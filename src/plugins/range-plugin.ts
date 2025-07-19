/**
 * Range Selection Plugin
 * 날짜 범위 선택 기능을 제공하는 플러그인
 */

import { Plugin, PluginSpec } from '@/core/plugin';
import { PluginState, Transaction } from '@/types';
import { DecorationSet, DecorationFactory } from '@/core/decoration';
import { transactions } from '@/core/transaction';

export interface RangeOptions {
  maxRange?: number; // 최대 선택 가능한 일수
  minRange?: number; // 최소 선택 가능한 일수
  allowPastDates?: boolean; // 과거 날짜 선택 허용 여부
  allowFutureDates?: boolean; // 미래 날짜 선택 허용 여부
  selectionMode?: 'single' | 'range' | 'multiple'; // 선택 모드
}

export interface RangeState {
  selectedRange: {
    start: Date;
    end: Date;
  } | null;
  isSelecting: boolean; // 범위 선택 중인지 여부
  selectionStart: Date | null; // 선택 시작 지점
  hoveredDate: Date | null; // 마우스 호버 중인 날짜
  selectedDates: Date[]; // 다중 선택 모드에서 선택된 날짜들
  options: RangeOptions;
}

/**
 * Range Plugin State 클래스
 */
class RangePluginState extends PluginState<RangeState> {
  apply(transaction: Transaction): RangePluginState {
    const newValue = { ...this.value };

    switch (transaction.type) {
      case 'RANGE_START_SELECTION':
        newValue.isSelecting = true;
        newValue.selectionStart = new Date(transaction.payload.date);
        newValue.selectedRange = null;
        break;

      case 'RANGE_UPDATE_SELECTION':
        if (newValue.isSelecting && newValue.selectionStart) {
          const endDate = new Date(transaction.payload.date);
          const startDate = newValue.selectionStart;

          // 시작과 끝 날짜 정렬
          const start = startDate <= endDate ? startDate : endDate;
          const end = startDate <= endDate ? endDate : startDate;

          // 범위 제한 확인
          if (this.isValidRange(start, end, newValue.options)) {
            newValue.selectedRange = { start, end };
          }
        }
        break;

      case 'RANGE_END_SELECTION':
        newValue.isSelecting = false;
        newValue.selectionStart = null;
        break;

      case 'RANGE_SELECT_RANGE': {
        const { start, end } = transaction.payload;
        if (this.isValidRange(start, end, newValue.options)) {
          newValue.selectedRange = { start, end };
          newValue.isSelecting = false;
          newValue.selectionStart = null;
        }
        break;
      }

      case 'RANGE_SELECT_SINGLE': {
        const singleDate = new Date(transaction.payload.date);
        if (this.isValidDate(singleDate, newValue.options)) {
          if (newValue.options.selectionMode === 'multiple') {
            // 다중 선택 모드
            const index = newValue.selectedDates.findIndex(
              d => d.getTime() === singleDate.getTime()
            );
            if (index > -1) {
              newValue.selectedDates.splice(index, 1);
            } else {
              newValue.selectedDates.push(singleDate);
            }
          } else {
            // 단일 선택 모드
            newValue.selectedRange = { start: singleDate, end: singleDate };
            newValue.selectedDates = [singleDate];
          }
        }
        break;
      }

      case 'RANGE_HOVER_DATE':
        newValue.hoveredDate = transaction.payload.date
          ? new Date(transaction.payload.date)
          : null;
        break;

      case 'RANGE_CLEAR_SELECTION':
        newValue.selectedRange = null;
        newValue.selectedDates = [];
        newValue.isSelecting = false;
        newValue.selectionStart = null;
        newValue.hoveredDate = null;
        break;

      case 'RANGE_SET_OPTIONS':
        newValue.options = {
          ...newValue.options,
          ...transaction.payload.options,
        };
        break;
    }

    return new RangePluginState(newValue);
  }

  toJSON(): RangeState {
    return {
      ...this.value,
      selectedRange: this.value.selectedRange
        ? {
            start: this.value.selectedRange.start,
            end: this.value.selectedRange.end,
          }
        : null,
      selectedDates: [...this.value.selectedDates],
    };
  }

  static fromJSON(value: RangeState): RangePluginState {
    const state = { ...value };
    if (state.selectedRange) {
      state.selectedRange = {
        start: new Date(state.selectedRange.start),
        end: new Date(state.selectedRange.end),
      };
    }
    state.selectedDates = state.selectedDates.map(d => new Date(d));
    return new RangePluginState(state);
  }

  private isValidRange(start: Date, end: Date, options: RangeOptions): boolean {
    const daysDiff =
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    if (options.maxRange && daysDiff > options.maxRange) {
      return false;
    }

    if (options.minRange && daysDiff < options.minRange) {
      return false;
    }

    return this.isValidDate(start, options) && this.isValidDate(end, options);
  }

  private isValidDate(date: Date, options: RangeOptions): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!options.allowPastDates && date < today) {
      return false;
    }

    if (!options.allowFutureDates && date > today) {
      return false;
    }

    return true;
  }
}

/**
 * Range Selection Plugin 생성 함수
 */
export function createRangePlugin(
  options: RangeOptions = {}
): Plugin<RangeState> {
  const defaultOptions: RangeOptions = {
    maxRange: undefined,
    minRange: 1,
    allowPastDates: true,
    allowFutureDates: true,
    selectionMode: 'range',
  };

  const finalOptions = { ...defaultOptions, ...options };

  const spec: PluginSpec<RangeState> = {
    key: 'range',

    state: {
      init: () =>
        new RangePluginState({
          selectedRange: null,
          isSelecting: false,
          selectionStart: null,
          hoveredDate: null,
          selectedDates: [],
          options: finalOptions,
        }),
      apply: (transaction, state) => state.apply(transaction),
    },

    commands: _plugin => ({
      startRangeSelection: (date: Date) => (_state: any, dispatch?: any) => {
        if (dispatch) {
          dispatch(transactions.custom('RANGE_START_SELECTION', { date }));
        }
        return true;
      },

      updateRangeSelection: (date: Date) => (_state: any, dispatch?: any) => {
        if (dispatch) {
          dispatch(transactions.custom('RANGE_UPDATE_SELECTION', { date }));
        }
        return true;
      },

      endRangeSelection: () => (_state: any, dispatch?: any) => {
        if (dispatch) {
          dispatch(transactions.custom('RANGE_END_SELECTION', {}));
        }
        return true;
      },

      selectSingleDate: (date: Date) => (_state: any, dispatch?: any) => {
        if (dispatch) {
          dispatch(transactions.custom('RANGE_SELECT_SINGLE', { date }));
        }
        return true;
      },

      selectRange:
        (start: Date, end: Date) => (_state: any, dispatch?: any) => {
          if (dispatch) {
            dispatch(
              transactions.custom('RANGE_START_SELECTION', { date: start })
            );
            dispatch(
              transactions.custom('RANGE_UPDATE_SELECTION', { date: end })
            );
            dispatch(transactions.custom('RANGE_END_SELECTION', {}));
          }
          return true;
        },

      clearRangeSelection: () => (_state: any, dispatch?: any) => {
        if (dispatch) {
          dispatch(transactions.custom('RANGE_CLEAR_SELECTION', {}));
        }
        return true;
      },

      hoverDate: (date: Date | null) => (_state: any, dispatch?: any) => {
        if (dispatch) {
          dispatch(transactions.custom('RANGE_HOVER_DATE', { date }));
        }
        return true;
      },

      setRangeOptions:
        (newOptions: Partial<RangeOptions>) =>
        (_state: any, dispatch?: any) => {
          if (dispatch) {
            dispatch(
              transactions.custom('RANGE_SET_OPTIONS', { options: newOptions })
            );
          }
          return true;
        },
    }),

    decorations: (state, plugin) => {
      const rangeState = plugin.getState(state);
      if (!rangeState) return new DecorationSet();

      const decorations: any[] = [];

      // 선택된 범위 데코레이션
      if (rangeState.value.selectedRange) {
        const { start, end } = rangeState.value.selectedRange;

        if (start.getTime() === end.getTime()) {
          // 단일 날짜 선택
          decorations.push(
            DecorationFactory.highlight(start, 'calendar-selected-date')
          );
        } else {
          // 범위 선택
          const current = new Date(start);
          while (current <= end) {
            const isStart = current.getTime() === start.getTime();
            const isEnd = current.getTime() === end.getTime();

            let className = 'calendar-range-selected';
            if (isStart) className += ' range-start';
            if (isEnd) className += ' range-end';
            if (!isStart && !isEnd) className += ' range-middle';

            decorations.push(
              DecorationFactory.highlight(new Date(current), className)
            );

            current.setDate(current.getDate() + 1);
          }
        }
      }

      // 다중 선택 데코레이션
      if (rangeState.value.options.selectionMode === 'multiple') {
        for (const date of rangeState.value.selectedDates) {
          decorations.push(
            DecorationFactory.highlight(date, 'calendar-multi-selected')
          );
        }
      }

      // 임시 범위 미리보기 (선택 중일 때)
      if (
        rangeState.value.isSelecting &&
        rangeState.value.selectionStart &&
        rangeState.value.hoveredDate
      ) {
        const start = rangeState.value.selectionStart;
        const end = rangeState.value.hoveredDate;
        const actualStart = start <= end ? start : end;
        const actualEnd = start <= end ? end : start;

        const current = new Date(actualStart);
        while (current <= actualEnd) {
          decorations.push(
            DecorationFactory.highlight(
              new Date(current),
              'calendar-range-preview'
            )
          );
          current.setDate(current.getDate() + 1);
        }
      }

      // 호버 데코레이션
      if (rangeState.value.hoveredDate && !rangeState.value.isSelecting) {
        decorations.push(
          DecorationFactory.highlight(
            rangeState.value.hoveredDate,
            'calendar-hover'
          )
        );
      }

      return new DecorationSet(decorations);
    },

    props: {
      handleDateClick: (date, event, state, plugin) => {
        const rangeState = plugin.getState(state);
        if (!rangeState) return false;

        const { selectionMode } = rangeState.value.options;

        if (event.shiftKey && selectionMode === 'range') {
          // Shift 클릭으로 범위 선택
          if (rangeState.value.selectedRange) {
            // 기존 선택의 시작점을 사용하여 새 범위 생성
            const existingStart = rangeState.value.selectedRange.start;

            // Shift + 클릭으로 범위 선택: 로그로 상태 확인
            // eslint-disable-next-line no-console
            console.log('범위 선택:', { existingStart, date });
            return true; // 처리됨을 표시
          }
        } else if (event.ctrlKey || event.metaKey) {
          // Ctrl/Cmd 클릭으로 다중 선택 (다중 모드에서만)
          if (selectionMode === 'multiple') {
            return true; // selectSingleDate 커맨드로 처리
          }
        } else {
          // 일반 클릭
          if (selectionMode === 'range') {
            if (!rangeState.value.isSelecting) {
              // 범위 선택 시작
              return true; // startRangeSelection 커맨드로 처리
            } else {
              // 범위 선택 완료
              return true; // endRangeSelection 커맨드로 처리
            }
          } else {
            // 단일 선택
            return true; // selectSingleDate 커맨드로 처리
          }
        }

        return false;
      },
    },

    queries: {
      getSelectedRange: (state, plugin) => {
        const rangeState = plugin.getState(state);
        return rangeState?.value.selectedRange ?? null;
      },

      getSelectedDates: (state, plugin) => {
        const rangeState = plugin.getState(state);
        if (!rangeState) return [];

        if (rangeState.value.selectedRange) {
          const { start, end } = rangeState.value.selectedRange;
          const dates: Date[] = [];
          const current = new Date(start);

          while (current <= end) {
            dates.push(new Date(current));
            current.setDate(current.getDate() + 1);
          }

          return dates;
        }

        return rangeState.value.selectedDates;
      },

      isDateSelected: (state, plugin, date: Date) => {
        const rangeState = plugin.getState(state);
        if (!rangeState) return false;

        if (rangeState.value.selectedRange) {
          const { start, end } = rangeState.value.selectedRange;
          return date >= start && date <= end;
        }

        return rangeState.value.selectedDates.some(
          d => d.getTime() === date.getTime()
        );
      },

      getSelectionMode: (state, plugin) => {
        const rangeState = plugin.getState(state);
        return rangeState?.value.options.selectionMode ?? 'range';
      },

      isSelecting: (state, plugin) => {
        const rangeState = plugin.getState(state);
        return rangeState?.value.isSelecting ?? false;
      },
    },
  };

  return new Plugin(spec);
}
