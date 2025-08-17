/**
 * Range Selection Feature
 * 날짜 범위 선택 기능
 */

import { Calendar, CalendarFeature, Day, OnChangeFn } from '@/types/calendar';
import { makeStateUpdater } from '@/utils';

// State
export interface RangeSelectionState {
  selectedRange: {
    start: Date;
    end: Date;
  } | null;
  isSelecting: boolean;
  selectionStart: Date | null;
}

// Options
export interface RangeSelectionOptions {
  /**
   * 범위 선택 활성화 여부
   */
  enableRangeSelection?: boolean | ((date: Date) => boolean);

  /**
   * 최대 선택 가능 일수
   */
  maxRange?: number;

  /**
   * 최소 선택 가능 일수
   */
  minRange?: number;

  /**
   * 범위 선택 변경 콜백
   */
  onRangeSelectionChange?: OnChangeFn<RangeSelectionState['selectedRange']>;

  /**
   * 초기 선택 범위
   */
  initialSelectedRange?: RangeSelectionState['selectedRange'];
}

// Day 확장
export interface RangeSelectionDay {
  /**
   * 범위 선택 가능 여부
   */
  getCanSelectRange: () => boolean;

  /**
   * 범위 내 포함 여부
   */
  getIsInRange: () => boolean;

  /**
   * 범위 시작일 여부
   */
  getIsRangeStart: () => boolean;

  /**
   * 범위 종료일 여부
   */
  getIsRangeEnd: () => boolean;

  /**
   * 선택 중 호버 상태 여부
   */
  getIsHovering: () => boolean;
}

// Instance 확장
export interface RangeSelectionInstance {
  /**
   * 선택된 범위 가져오기
   */
  getSelectedRange: () => RangeSelectionState['selectedRange'];

  /**
   * 범위 선택 시작
   */
  startRangeSelection: (date: Date) => void;

  /**
   * 범위 선택 종료
   */
  endRangeSelection: (date: Date) => void;

  /**
   * 범위 설정
   */
  setSelectedRange: (start: Date, end: Date) => void;

  /**
   * 범위 선택 초기화
   */
  resetRangeSelection: () => void;

  /**
   * 범위 선택 중 여부
   */
  getIsSelectingRange: () => boolean;

  /**
   * 호버 날짜 설정 (범위 미리보기)
   */
  setHoverDate: (date: Date | null) => void;
}

// 내부 상태 (호버 등)
let hoverDate: Date | null = null;

// Feature 구현
export const RangeSelection: CalendarFeature = {
  getInitialState: (state): RangeSelectionState => {
    return {
      selectedRange: null,
      isSelecting: false,
      selectionStart: null,
      ...state,
    };
  },

  getDefaultOptions: <TData>(calendar: Calendar<TData>) => {
    return {
      enableRangeSelection: true,
      minRange: 1,
      onRangeSelectionChange: makeStateUpdater<any, 'selectedRange'>(
        'selectedRange',
        calendar
      ),
    } as RangeSelectionOptions;
  },

  createCalendar: <TData>(calendar: Calendar<TData>): void => {
    const instance: RangeSelectionInstance = {
      getSelectedRange: () => {
        return calendar.getState().selectedRange;
      },

      startRangeSelection: (date: Date) => {
        calendar.setState(
          old =>
            ({
              ...old,
              isSelecting: true,
              selectionStart: date,
              selectedRange: null,
            }) as any
        );
      },

      endRangeSelection: (date: Date) => {
        const state = calendar.getState();
        if (!state.isSelecting || !state.selectionStart) return;

        const start = state.selectionStart;
        const end = date;

        // 날짜 순서 정렬
        const [rangeStart, rangeEnd] =
          start <= end ? [start, end] : [end, start];

        // 범위 검증
        const { minRange, maxRange } = calendar.options;
        const daysDiff =
          Math.ceil(
            (rangeEnd.getTime() - rangeStart.getTime()) / (1000 * 60 * 60 * 24)
          ) + 1;

        if (minRange && daysDiff < minRange) return;
        if (maxRange && daysDiff > maxRange) return;

        calendar.setState(
          old =>
            ({
              ...old,
              selectedRange: { start: rangeStart, end: rangeEnd },
              isSelecting: false,
              selectionStart: null,
            }) as any
        );

        calendar.options.onRangeSelectionChange?.({
          start: rangeStart,
          end: rangeEnd,
        });
      },

      setSelectedRange: (start: Date, end: Date) => {
        const [rangeStart, rangeEnd] =
          start <= end ? [start, end] : [end, start];

        calendar.setState(
          old =>
            ({
              ...old,
              selectedRange: { start: rangeStart, end: rangeEnd },
              isSelecting: false,
              selectionStart: null,
            }) as any
        );

        calendar.options.onRangeSelectionChange?.({
          start: rangeStart,
          end: rangeEnd,
        });
      },

      resetRangeSelection: () => {
        calendar.setState(
          old =>
            ({
              ...old,
              selectedRange: null,
              isSelecting: false,
              selectionStart: null,
            }) as any
        );

        calendar.options.onRangeSelectionChange?.(null);
      },

      getIsSelectingRange: () => {
        return calendar.getState().isSelecting;
      },

      setHoverDate: (date: Date | null) => {
        hoverDate = date;
      },
    };

    Object.assign(calendar, instance);
  },

  createDay: <TData>(
    day: Day<TData>,
    _week: any,
    _month: any,
    calendar: Calendar<TData>
  ): void => {
    const dayInstance: RangeSelectionDay = {
      getCanSelectRange: () => {
        const { enableRangeSelection } = calendar.options;

        if (typeof enableRangeSelection === 'function') {
          return enableRangeSelection(day.getValue());
        }

        return enableRangeSelection ?? true;
      },

      getIsInRange: () => {
        const state = calendar.getState();
        const dayDate = day.getValue();

        // 선택 완료된 범위
        if (state.selectedRange) {
          return (
            dayDate >= state.selectedRange.start &&
            dayDate <= state.selectedRange.end
          );
        }

        // 선택 중인 범위 (호버)
        if (state.isSelecting && state.selectionStart && hoverDate) {
          const [start, end] =
            state.selectionStart <= hoverDate
              ? [state.selectionStart, hoverDate]
              : [hoverDate, state.selectionStart];

          return dayDate >= start && dayDate <= end;
        }

        return false;
      },

      getIsRangeStart: () => {
        const state = calendar.getState();
        const dayDate = day.getValue();

        if (state.selectedRange) {
          return dayDate.getTime() === state.selectedRange.start.getTime();
        }

        if (state.selectionStart) {
          return dayDate.getTime() === state.selectionStart.getTime();
        }

        return false;
      },

      getIsRangeEnd: () => {
        const state = calendar.getState();
        const dayDate = day.getValue();

        if (state.selectedRange) {
          return dayDate.getTime() === state.selectedRange.end.getTime();
        }

        if (state.isSelecting && hoverDate) {
          return dayDate.getTime() === hoverDate.getTime();
        }

        return false;
      },

      getIsHovering: () => {
        return hoverDate
          ? day.getValue().getTime() === hoverDate.getTime()
          : false;
      },
    };

    Object.assign(day, dayInstance);
  },
};

// TypeScript 타입 확장
declare module '@/types/calendar' {
  interface CalendarState extends RangeSelectionState {}
  interface FeatureOptions<_TData> extends RangeSelectionOptions {}
  interface Calendar extends RangeSelectionInstance {}
  interface Day extends RangeSelectionDay {}
}
