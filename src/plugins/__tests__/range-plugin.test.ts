/**
 * Range Plugin Tests
 * Range Selection Plugin의 기능 테스트
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { createRangePlugin, RangeOptions } from '../range-plugin';
import { CalendarState } from '../../types';
import { transactions } from '../../core/transaction';

describe('Range Plugin', () => {
  let rangePlugin: ReturnType<typeof createRangePlugin>;
  let mockState: CalendarState;

  beforeEach(() => {
    rangePlugin = createRangePlugin();
    mockState = {
      currentDate: new Date('2023-06-15'),
      viewType: 'month',
      timeRange: { start: new Date('2023-06-01'), end: new Date('2023-06-30') },
      days: [],
      pluginStates: new Map(),
      timezone: 'UTC',
    };
  });

  describe('Plugin Initialization', () => {
    it('should initialize with default options', () => {
      expect(rangePlugin.key).toBe('range');

      const initialState = rangePlugin.spec.state!.init();
      expect(initialState.value.selectedRange).toBeNull();
      expect(initialState.value.isSelecting).toBe(false);
      expect(initialState.value.selectedDates).toEqual([]);
      expect(initialState.value.options.selectionMode).toBe('range');
      expect(initialState.value.options.allowPastDates).toBe(true);
      expect(initialState.value.options.allowFutureDates).toBe(true);
    });

    it('should initialize with custom options', () => {
      const options: RangeOptions = {
        maxRange: 7,
        minRange: 2,
        allowPastDates: false,
        selectionMode: 'single',
      };

      const customPlugin = createRangePlugin(options);
      const initialState = customPlugin.spec.state!.init();

      expect(initialState.value.options.maxRange).toBe(7);
      expect(initialState.value.options.minRange).toBe(2);
      expect(initialState.value.options.allowPastDates).toBe(false);
      expect(initialState.value.options.selectionMode).toBe('single');
    });
  });

  describe('Range Selection', () => {
    it('should start range selection', () => {
      const initialState = rangePlugin.spec.state!.init();
      const startDate = new Date('2023-06-10');

      const transaction = transactions.custom('RANGE_START_SELECTION', {
        date: startDate,
      });
      const newState = rangePlugin.spec.state!.apply(transaction, initialState);

      expect(newState.value.isSelecting).toBe(true);
      expect(newState.value.selectionStart).toEqual(startDate);
      expect(newState.value.selectedRange).toBeNull();
    });

    it('should update range selection during selection', () => {
      let state = rangePlugin.spec.state!.init();
      const startDate = new Date('2023-06-10');
      const endDate = new Date('2023-06-15');

      // 선택 시작
      state = rangePlugin.spec.state!.apply(
        transactions.custom('RANGE_START_SELECTION', { date: startDate }),
        state
      );

      // 선택 업데이트
      state = rangePlugin.spec.state!.apply(
        transactions.custom('RANGE_UPDATE_SELECTION', { date: endDate }),
        state
      );

      expect(state.value.selectedRange).toEqual({
        start: startDate,
        end: endDate,
      });
    });

    it('should handle reverse range selection', () => {
      let state = rangePlugin.spec.state!.init();
      const startDate = new Date('2023-06-15');
      const endDate = new Date('2023-06-10');

      // 선택 시작 (나중 날짜)
      state = rangePlugin.spec.state!.apply(
        transactions.custom('RANGE_START_SELECTION', { date: startDate }),
        state
      );

      // 선택 업데이트 (이전 날짜)
      state = rangePlugin.spec.state!.apply(
        transactions.custom('RANGE_UPDATE_SELECTION', { date: endDate }),
        state
      );

      // 시작과 끝이 올바르게 정렬되어야 함
      expect(state.value.selectedRange).toEqual({
        start: endDate,
        end: startDate,
      });
    });

    it('should end range selection', () => {
      let state = rangePlugin.spec.state!.init();

      // 선택 시작
      state = rangePlugin.spec.state!.apply(
        transactions.custom('RANGE_START_SELECTION', {
          date: new Date('2023-06-10'),
        }),
        state
      );

      // 선택 종료
      state = rangePlugin.spec.state!.apply(
        transactions.custom('RANGE_END_SELECTION', {}),
        state
      );

      expect(state.value.isSelecting).toBe(false);
      expect(state.value.selectionStart).toBeNull();
    });

    it('should select range directly', () => {
      const state = rangePlugin.spec.state!.init();
      const startDate = new Date('2023-06-10');
      const endDate = new Date('2023-06-15');

      const newState = rangePlugin.spec.state!.apply(
        transactions.custom('RANGE_SELECT_RANGE', {
          start: startDate,
          end: endDate,
        }),
        state
      );

      expect(newState.value.selectedRange).toEqual({
        start: startDate,
        end: endDate,
      });
      expect(newState.value.isSelecting).toBe(false);
    });
  });

  describe('Single Date Selection', () => {
    it('should select single date in single mode', () => {
      const singleModePlugin = createRangePlugin({ selectionMode: 'single' });
      const state = singleModePlugin.spec.state!.init();
      const selectedDate = new Date('2023-06-15');

      const newState = singleModePlugin.spec.state!.apply(
        transactions.custom('RANGE_SELECT_SINGLE', { date: selectedDate }),
        state
      );

      expect(newState.value.selectedRange).toEqual({
        start: selectedDate,
        end: selectedDate,
      });
      expect(newState.value.selectedDates).toEqual([selectedDate]);
    });

    it('should handle multiple date selection in multiple mode', () => {
      const multiplePlugin = createRangePlugin({ selectionMode: 'multiple' });
      let state = multiplePlugin.spec.state!.init();

      const date1 = new Date('2023-06-10');
      const date2 = new Date('2023-06-15');

      // 첫 번째 날짜 선택
      state = multiplePlugin.spec.state!.apply(
        transactions.custom('RANGE_SELECT_SINGLE', { date: date1 }),
        state
      );

      expect(state.value.selectedDates).toEqual([date1]);

      // 두 번째 날짜 선택
      state = multiplePlugin.spec.state!.apply(
        transactions.custom('RANGE_SELECT_SINGLE', { date: date2 }),
        state
      );

      expect(state.value.selectedDates).toEqual([date1, date2]);
    });

    it('should toggle date selection in multiple mode', () => {
      const multiplePlugin = createRangePlugin({ selectionMode: 'multiple' });
      let state = multiplePlugin.spec.state!.init();

      const selectedDate = new Date('2023-06-15');

      // 날짜 선택
      state = multiplePlugin.spec.state!.apply(
        transactions.custom('RANGE_SELECT_SINGLE', { date: selectedDate }),
        state
      );

      expect(state.value.selectedDates).toEqual([selectedDate]);

      // 같은 날짜 다시 선택 (토글)
      state = multiplePlugin.spec.state!.apply(
        transactions.custom('RANGE_SELECT_SINGLE', { date: selectedDate }),
        state
      );

      expect(state.value.selectedDates).toEqual([]);
    });
  });

  describe('Hover Functionality', () => {
    it('should update hovered date', () => {
      const state = rangePlugin.spec.state!.init();
      const hoveredDate = new Date('2023-06-15');

      const newState = rangePlugin.spec.state!.apply(
        transactions.custom('RANGE_HOVER_DATE', { date: hoveredDate }),
        state
      );

      expect(newState.value.hoveredDate).toEqual(hoveredDate);
    });

    it('should clear hovered date', () => {
      let state = rangePlugin.spec.state!.init();

      // 호버 설정
      state = rangePlugin.spec.state!.apply(
        transactions.custom('RANGE_HOVER_DATE', {
          date: new Date('2023-06-15'),
        }),
        state
      );

      // 호버 해제
      state = rangePlugin.spec.state!.apply(
        transactions.custom('RANGE_HOVER_DATE', { date: null }),
        state
      );

      expect(state.value.hoveredDate).toBeNull();
    });
  });

  describe('Clear Selection', () => {
    it('should clear all selection state', () => {
      let state = rangePlugin.spec.state!.init();

      // 상태 설정
      state = rangePlugin.spec.state!.apply(
        transactions.custom('RANGE_SELECT_RANGE', {
          start: new Date('2023-06-10'),
          end: new Date('2023-06-15'),
        }),
        state
      );

      state = rangePlugin.spec.state!.apply(
        transactions.custom('RANGE_HOVER_DATE', {
          date: new Date('2023-06-20'),
        }),
        state
      );

      // 선택 클리어
      state = rangePlugin.spec.state!.apply(
        transactions.custom('RANGE_CLEAR_SELECTION', {}),
        state
      );

      expect(state.value.selectedRange).toBeNull();
      expect(state.value.selectedDates).toEqual([]);
      expect(state.value.isSelecting).toBe(false);
      expect(state.value.selectionStart).toBeNull();
      expect(state.value.hoveredDate).toBeNull();
    });
  });

  describe('Options Update', () => {
    it('should update plugin options', () => {
      const state = rangePlugin.spec.state!.init();

      const newOptions = {
        maxRange: 14,
        allowPastDates: false,
      };

      const newState = rangePlugin.spec.state!.apply(
        transactions.custom('RANGE_SET_OPTIONS', { options: newOptions }),
        state
      );

      expect(newState.value.options.maxRange).toBe(14);
      expect(newState.value.options.allowPastDates).toBe(false);
      expect(newState.value.options.selectionMode).toBe('range'); // 기존 값 유지
    });
  });

  describe('Validation', () => {
    it('should reject range exceeding maxRange', () => {
      const restrictedPlugin = createRangePlugin({ maxRange: 3 });
      const state = restrictedPlugin.spec.state!.init();

      const startDate = new Date('2023-06-10');
      const endDate = new Date('2023-06-15'); // 6일 차이 (maxRange 3 초과)

      const newState = restrictedPlugin.spec.state!.apply(
        transactions.custom('RANGE_SELECT_RANGE', {
          start: startDate,
          end: endDate,
        }),
        state
      );

      // 유효하지 않은 범위는 선택되지 않아야 함
      expect(newState.value.selectedRange).toBeNull();
    });

    it('should reject range below minRange', () => {
      const restrictedPlugin = createRangePlugin({ minRange: 3 });
      const state = restrictedPlugin.spec.state!.init();

      const startDate = new Date('2023-06-10');
      const endDate = new Date('2023-06-11'); // 2일 차이 (minRange 3 미만)

      const newState = restrictedPlugin.spec.state!.apply(
        transactions.custom('RANGE_SELECT_RANGE', {
          start: startDate,
          end: endDate,
        }),
        state
      );

      // 유효하지 않은 범위는 선택되지 않아야 함
      expect(newState.value.selectedRange).toBeNull();
    });

    it('should reject past dates when not allowed', () => {
      const futureOnlyPlugin = createRangePlugin({ allowPastDates: false });
      const state = futureOnlyPlugin.spec.state!.init();

      const pastDate = new Date('2020-01-01');

      const newState = futureOnlyPlugin.spec.state!.apply(
        transactions.custom('RANGE_SELECT_SINGLE', { date: pastDate }),
        state
      );

      // 과거 날짜는 선택되지 않아야 함
      expect(newState.value.selectedDates).toEqual([]);
    });
  });

  describe('Queries', () => {
    beforeEach(() => {
      mockState.pluginStates.set('range', rangePlugin.spec.state!.init());
    });

    it('should get selected range', () => {
      const rangeState = mockState.pluginStates.get('range')!;
      const startDate = new Date('2023-06-10');
      const endDate = new Date('2023-06-15');

      // 선택 상태 설정
      const newRangeState = rangePlugin.spec.state!.apply(
        transactions.custom('RANGE_SELECT_RANGE', {
          start: startDate,
          end: endDate,
        }),
        rangeState
      );

      mockState.pluginStates.set('range', newRangeState);

      const selectedRange = rangePlugin.spec.queries!.getSelectedRange(
        mockState,
        rangePlugin
      );
      expect(selectedRange).toEqual({ start: startDate, end: endDate });
    });

    it('should get selected dates from range', () => {
      const rangeState = mockState.pluginStates.get('range')!;
      const startDate = new Date('2023-06-10');
      const endDate = new Date('2023-06-12');

      // 3일 범위 선택
      const newRangeState = rangePlugin.spec.state!.apply(
        transactions.custom('RANGE_SELECT_RANGE', {
          start: startDate,
          end: endDate,
        }),
        rangeState
      );

      mockState.pluginStates.set('range', newRangeState);

      const selectedDates = rangePlugin.spec.queries!.getSelectedDates(
        mockState,
        rangePlugin
      );
      expect(selectedDates).toHaveLength(3);
      expect(selectedDates[0]).toEqual(startDate);
      expect(selectedDates[2]).toEqual(endDate);
    });

    it('should check if date is selected', () => {
      const rangeState = mockState.pluginStates.get('range')!;
      const startDate = new Date('2023-06-10');
      const endDate = new Date('2023-06-15');

      const newRangeState = rangePlugin.spec.state!.apply(
        transactions.custom('RANGE_SELECT_RANGE', {
          start: startDate,
          end: endDate,
        }),
        rangeState
      );

      mockState.pluginStates.set('range', newRangeState);

      const middleDate = new Date('2023-06-12');
      const outsideDate = new Date('2023-06-20');

      expect(
        rangePlugin.spec.queries!.isDateSelected(
          mockState,
          rangePlugin,
          middleDate
        )
      ).toBe(true);
      expect(
        rangePlugin.spec.queries!.isDateSelected(
          mockState,
          rangePlugin,
          outsideDate
        )
      ).toBe(false);
    });

    it('should get selection mode', () => {
      const mode = rangePlugin.spec.queries!.getSelectionMode(
        mockState,
        rangePlugin
      );
      expect(mode).toBe('range');
    });

    it('should check if currently selecting', () => {
      let rangeState = mockState.pluginStates.get('range')!;

      expect(
        rangePlugin.spec.queries!.isSelecting(mockState, rangePlugin)
      ).toBe(false);

      // 선택 시작
      rangeState = rangePlugin.spec.state!.apply(
        transactions.custom('RANGE_START_SELECTION', {
          date: new Date('2023-06-10'),
        }),
        rangeState
      );

      mockState.pluginStates.set('range', rangeState);

      expect(
        rangePlugin.spec.queries!.isSelecting(mockState, rangePlugin)
      ).toBe(true);
    });
  });

  describe('Serialization', () => {
    it('should serialize and deserialize state correctly', () => {
      let state = rangePlugin.spec.state!.init();

      // 상태 설정
      state = rangePlugin.spec.state!.apply(
        transactions.custom('RANGE_SELECT_RANGE', {
          start: new Date('2023-06-10'),
          end: new Date('2023-06-15'),
        }),
        state
      );

      // 직렬화
      const serialized = state.toJSON();

      // 역직렬화
      const StateClass = state.constructor as any;
      const deserialized = StateClass.fromJSON(serialized);

      expect(deserialized.value.selectedRange).toEqual(
        state.value.selectedRange
      );
      expect(deserialized.value.selectedDates).toEqual(
        state.value.selectedDates
      );
      expect(deserialized.value.options).toEqual(state.value.options);
    });
  });
});
