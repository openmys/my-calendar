/**
 * 플러그인 팩토리 테스트
 */

import { describe, it, expect, vi } from 'vitest';
import {
  createCustomPlugin,
  PluginTemplates,
  PluginHelpers,
} from '../plugin-factory';
import { CalendarStateFactory } from '../../core/state';
import type { CalendarState } from '@/types';

// Mock CalendarState for tests
const createMockCalendarState = (): CalendarState => ({
  currentDate: new Date('2024-01-15'),
  viewType: 'month' as const,
  timeRange: {
    start: new Date('2024-01-01'),
    end: new Date('2024-01-31'),
  },
  days: [],
  pluginStates: new Map(),
  timezone: 'UTC',
});

describe('createCustomPlugin', () => {
  it('should create a basic plugin with default state', () => {
    const plugin = createCustomPlugin({
      key: 'testPlugin',
      initialState: {
        isEnabled: true,
        data: {},
        settings: { theme: 'light' },
      },
    });

    expect(plugin).toBeDefined();
    expect(plugin.spec.key).toBe('testPlugin');
  });

  it('should handle state transactions correctly', () => {
    const plugin = createCustomPlugin({
      key: 'testPlugin',
      stateHandlers: {
        TEST_ACTION: (state, payload) => ({
          data: { ...state.data, ...payload },
        }),
      },
    });

    const initialState = CalendarStateFactory.create([plugin]);
    const pluginState = plugin.getState(initialState);

    expect(pluginState).toBeDefined();

    if (pluginState) {
      const newState = pluginState.apply({
        type: 'TEST_ACTION',
        payload: { testValue: 42 },
        meta: new Map(),
      });

      expect(newState.value.data).toEqual({ testValue: 42 });
    }
  });

  it('should register commands correctly', () => {
    const plugin = createCustomPlugin({
      key: 'testPlugin',
      commands: {
        testCommand: (value: string) => (_state, dispatch) => {
          dispatch?.({
            type: 'TEST_ACTION',
            payload: { value },
            meta: new Map(),
          });
          return true;
        },
      },
    });

    const commands = plugin.spec.commands?.(plugin);
    expect(commands).toBeDefined();
    expect(commands!.testCommand).toBeInstanceOf(Function);
  });

  it('should handle dependencies correctly', () => {
    const plugin = createCustomPlugin({
      key: 'testPlugin',
      dependencies: ['range', 'events'],
    });

    expect(plugin.spec.dependencies).toEqual(['range', 'events']);
  });

  it('should set priority correctly', () => {
    const plugin = createCustomPlugin({
      key: 'testPlugin',
      priority: 200,
    });

    expect(plugin.spec.priority).toBe(200);
  });
});

describe('PluginTemplates', () => {
  describe('createHighlightPlugin', () => {
    it('should create highlight plugin with correct configuration', () => {
      const testDates = [new Date('2024-01-01'), new Date('2024-12-25')];
      const plugin = PluginTemplates.createHighlightPlugin({
        key: 'holidays',
        highlightDates: testDates,
        highlightClass: 'holiday',
      });

      expect(plugin.spec.key).toBe('holidays');

      const initialState = CalendarStateFactory.create([plugin]);
      const pluginState = plugin.getState(initialState);

      expect(pluginState?.value.highlightDates).toEqual(testDates);
      expect(pluginState?.value.highlightClass).toBe('holiday');
    });

    it('should handle add highlight command', () => {
      const plugin = PluginTemplates.createHighlightPlugin({
        key: 'highlights',
        highlightDates: [],
      });

      const commands = plugin.spec.commands?.(plugin);
      expect(commands?.addHighlight).toBeInstanceOf(Function);

      const mockDispatch = vi.fn();
      const newDate = new Date('2024-06-15');

      const command = commands!.addHighlight;
      expect(typeof command).toBe('function');
      const result = command(newDate)(createMockCalendarState(), mockDispatch);

      expect(result).toBe(true);
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'ADD_HIGHLIGHT_DATE',
        payload: { date: newDate },
        meta: new Map([['source', 'highlights']]),
      });
    });

    it('should handle remove highlight command', () => {
      const plugin = PluginTemplates.createHighlightPlugin({
        key: 'highlights',
        highlightDates: [new Date('2024-01-01')],
      });

      const commands = plugin.spec.commands?.(plugin);
      const mockDispatch = vi.fn();
      const dateToRemove = new Date('2024-01-01');

      const command = commands!.removeHighlight;
      expect(typeof command).toBe('function');
      const result = command(dateToRemove)(
        createMockCalendarState(),
        mockDispatch
      );

      expect(result).toBe(true);
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'REMOVE_HIGHLIGHT_DATE',
        payload: { date: dateToRemove },
        meta: new Map([['source', 'highlights']]),
      });
    });

    it('should clear all highlights', () => {
      const plugin = PluginTemplates.createHighlightPlugin({
        key: 'highlights',
      });

      const commands = plugin.spec.commands?.(plugin);
      const mockDispatch = vi.fn();

      const command = commands!.clearHighlights;
      expect(typeof command).toBe('function');
      const result = command()(createMockCalendarState(), mockDispatch);

      expect(result).toBe(true);
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'CLEAR_HIGHLIGHTS',
        payload: {},
        meta: new Map([['source', 'highlights']]),
      });
    });
  });

  describe('createClickCounterPlugin', () => {
    it('should create click counter plugin', () => {
      const onCountChange = vi.fn();
      const plugin = PluginTemplates.createClickCounterPlugin({
        key: 'clickCounter',
        onCountChange,
      });

      expect(plugin.spec.key).toBe('clickCounter');

      const initialState = CalendarStateFactory.create([plugin]);
      const pluginState = plugin.getState(initialState);

      expect(pluginState?.value.clickCounts).toBeInstanceOf(Map);
    });

    it('should handle click increment', () => {
      const onCountChange = vi.fn();
      const plugin = PluginTemplates.createClickCounterPlugin({
        key: 'clickCounter',
        onCountChange,
      });

      const initialState = CalendarStateFactory.create([plugin]);
      const pluginState = plugin.getState(initialState);

      if (pluginState) {
        const testDate = new Date('2024-01-15');
        const newState = pluginState.apply({
          type: 'INCREMENT_DATE_CLICK',
          payload: { date: testDate },
          meta: new Map(),
        });

        const dateKey = testDate.toISOString().split('T')[0];
        expect(newState.value.clickCounts.get(dateKey)).toBe(1);
        expect(onCountChange).toHaveBeenCalledWith(1, testDate);
      }
    });
  });

  describe('createDateDisablerPlugin', () => {
    it('should create date disabler plugin', () => {
      const disabledDates = [new Date('2024-01-01')];
      const plugin = PluginTemplates.createDateDisablerPlugin({
        key: 'disabler',
        disabledDates,
        disableWeekends: true,
        disablePastDates: false,
      });

      expect(plugin.spec.key).toBe('disabler');

      const initialState = CalendarStateFactory.create([plugin]);
      const pluginState = plugin.getState(initialState);

      expect(pluginState?.value.disabledDates).toEqual(disabledDates);
      expect(pluginState?.value.disableWeekends).toBe(true);
      expect(pluginState?.value.disablePastDates).toBe(false);
    });

    it('should handle date click events correctly', () => {
      const disabledDate = new Date('2024-01-01');
      const plugin = PluginTemplates.createDateDisablerPlugin({
        key: 'disabler',
        disabledDates: [disabledDate],
      });

      const eventHandlers = plugin.spec.props;
      expect(eventHandlers?.handleDateClick).toBeInstanceOf(Function);

      // 비활성화된 날짜 클릭 테스트
      const mockEvent = {
        preventDefault: vi.fn(),
      } as any;

      const initialState = CalendarStateFactory.create([plugin]);
      const result = eventHandlers!.handleDateClick!(
        disabledDate,
        mockEvent,
        initialState,
        plugin
      );

      expect(result).toBe(true); // 이벤트가 소비되어야 함
      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });
  });
});

describe('PluginHelpers', () => {
  describe('DateUtils', () => {
    it('should identify weekends correctly', () => {
      const saturday = new Date('2024-01-06'); // 토요일
      const sunday = new Date('2024-01-07'); // 일요일
      const monday = new Date('2024-01-08'); // 월요일

      expect(PluginHelpers.DateUtils.isWeekend(saturday)).toBe(true);
      expect(PluginHelpers.DateUtils.isWeekend(sunday)).toBe(true);
      expect(PluginHelpers.DateUtils.isWeekend(monday)).toBe(false);
    });

    it('should compare dates correctly', () => {
      const date1 = new Date('2024-01-15T10:30:00');
      const date2 = new Date('2024-01-15T15:45:00');
      const date3 = new Date('2024-01-16T10:30:00');

      expect(PluginHelpers.DateUtils.isSameDay(date1, date2)).toBe(true);
      expect(PluginHelpers.DateUtils.isSameDay(date1, date3)).toBe(false);
    });

    it('should add days correctly', () => {
      const baseDate = new Date('2024-01-15');
      const futureDate = PluginHelpers.DateUtils.addDays(baseDate, 5);
      const pastDate = PluginHelpers.DateUtils.addDays(baseDate, -3);

      expect(futureDate.getDate()).toBe(20);
      expect(pastDate.getDate()).toBe(12);
    });

    it('should generate date keys correctly', () => {
      const date = new Date('2024-01-15T10:30:00');
      const key = PluginHelpers.DateUtils.getDateKey(date);

      expect(key).toBe('2024-01-15');
    });
  });

  describe('StateHelpers', () => {
    it('should toggle boolean values', () => {
      const state = { isEnabled: false, other: 'value' };
      const updater = PluginHelpers.StateHelpers.toggleBoolean('isEnabled');
      const result = updater(state);

      expect(result).toEqual({ isEnabled: true });
    });

    it('should add items to arrays', () => {
      const state = { items: [1, 2, 3] };
      const updater = PluginHelpers.StateHelpers.addToArray('items');
      const result = updater(state, 4);

      expect(result).toEqual({ items: [1, 2, 3, 4] });
    });

    it('should remove items from arrays', () => {
      const state = { items: [1, 2, 3, 4] };
      const updater = PluginHelpers.StateHelpers.removeFromArray(
        'items',
        (item: unknown) => (item as number) > 2
      );
      const result = updater(state);

      expect(result).toEqual({ items: [1, 2] });
    });

    it('should update objects', () => {
      const state = { settings: { theme: 'light', size: 'medium' } };
      const updater = PluginHelpers.StateHelpers.updateObject('settings');
      const result = updater(state, { theme: 'dark', newProp: 'value' });

      expect(result).toEqual({
        settings: {
          theme: 'dark',
          size: 'medium',
          newProp: 'value',
        },
      });
    });
  });

  describe('DecorationHelpers', () => {
    it('should create highlight decorations', () => {
      const date = new Date('2024-01-15');
      const decoration = PluginHelpers.DecorationHelpers.createHighlight(
        date,
        'custom-highlight'
      );

      expect(decoration).toEqual({
        type: 'highlight',
        from: date,
        spec: { class: 'custom-highlight' },
      });
    });

    it('should create badge decorations', () => {
      const date = new Date('2024-01-15');
      const decoration = PluginHelpers.DecorationHelpers.createBadge(
        date,
        'New',
        'custom-badge'
      );

      expect(decoration).toEqual({
        type: 'badge',
        from: date,
        spec: {
          class: 'custom-badge',
          'data-badge': 'New',
        },
      });
    });

    it('should create tooltip decorations', () => {
      const date = new Date('2024-01-15');
      const decoration = PluginHelpers.DecorationHelpers.createTooltip(
        date,
        'Tooltip text'
      );

      expect(decoration).toEqual({
        type: 'tooltip',
        from: date,
        spec: {
          'data-tooltip': 'Tooltip text',
          title: 'Tooltip text',
        },
      });
    });
  });
});

// 통합 테스트
describe('Plugin Integration Tests', () => {
  it('should work with multiple custom plugins', () => {
    const highlightPlugin = PluginTemplates.createHighlightPlugin({
      key: 'highlights',
      highlightDates: [new Date('2024-01-01')],
    });

    const counterPlugin = PluginTemplates.createClickCounterPlugin({
      key: 'counter',
    });

    const customPlugin = createCustomPlugin({
      key: 'custom',
      dependencies: ['highlights'],
      stateHandlers: {
        CUSTOM_ACTION: (_state, payload) => ({
          data: { customValue: payload.value },
        }),
      },
    });

    const plugins = [highlightPlugin, counterPlugin, customPlugin];
    const initialState = CalendarStateFactory.create(plugins);

    // 모든 플러그인이 올바르게 초기화되었는지 확인
    expect(highlightPlugin.getState(initialState)).toBeDefined();
    expect(counterPlugin.getState(initialState)).toBeDefined();
    expect(customPlugin.getState(initialState)).toBeDefined();

    // 의존성이 올바르게 설정되었는지 확인
    expect(customPlugin.spec.dependencies).toContain('highlights');
  });

  it('should handle state updates across multiple plugins', () => {
    const plugin1 = createCustomPlugin({
      key: 'plugin1',
      stateHandlers: {
        SHARED_ACTION: (state, payload) => ({
          data: { ...state.data, plugin1Data: payload.value },
        }),
      },
    });

    const plugin2 = createCustomPlugin({
      key: 'plugin2',
      stateHandlers: {
        SHARED_ACTION: (state, payload) => ({
          data: { ...state.data, plugin2Data: payload.value * 2 },
        }),
      },
    });

    const plugins = [plugin1, plugin2];
    const initialState = CalendarStateFactory.create(plugins);

    // 같은 트랜잭션 타입을 두 플러그인이 처리하는지 확인
    const plugin1State = plugin1.getState(initialState);
    const plugin2State = plugin2.getState(initialState);

    if (plugin1State && plugin2State) {
      const newState1 = plugin1State.apply({
        type: 'SHARED_ACTION',
        payload: { value: 10 },
        meta: new Map(),
      });

      const newState2 = plugin2State.apply({
        type: 'SHARED_ACTION',
        payload: { value: 10 },
        meta: new Map(),
      });

      expect(newState1.value.data.plugin1Data).toBe(10);
      expect(newState2.value.data.plugin2Data).toBe(20);
    }
  });
});
