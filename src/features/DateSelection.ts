/**
 * Date Selection Feature
 * 단일 날짜 선택 기능
 */

import {
  Calendar,
  CalendarFeature,
  Day,
  OnChangeFn,
  Updater,
} from '@/types/calendar';
import { makeStateUpdater } from '@/utils';

// State
export interface DateSelectionState {
  selectedDate: Date | null;
}

// Options
export interface DateSelectionOptions {
  /**
   * 날짜 선택 활성화 여부
   */
  enableDateSelection?: boolean | ((date: Date) => boolean);

  /**
   * 날짜 선택 변경 콜백
   */
  onDateSelectionChange?: OnChangeFn<Date | null>;

  /**
   * 초기 선택 날짜
   */
  initialSelectedDate?: Date | null;
}

// Day 확장
export interface DateSelectionDay {
  /**
   * 날짜 선택 가능 여부
   */
  getCanSelect: () => boolean;

  /**
   * 날짜 선택 여부
   */
  getIsSelected: () => boolean;

  /**
   * 날짜 선택 토글
   */
  toggleSelected: () => void;
}

// Instance 확장
export interface DateSelectionInstance {
  /**
   * 선택된 날짜 가져오기
   */
  getSelectedDate: () => Date | null;

  /**
   * 날짜 선택
   */
  setSelectedDate: (date: Date | null) => void;

  /**
   * 날짜 선택 토글
   */
  toggleDateSelection: (date: Date) => void;

  /**
   * 날짜 선택 초기화
   */
  resetDateSelection: () => void;

  /**
   * 상태 setter
   */
  setDateSelectionState: (updater: Updater<DateSelectionState>) => void;
}

// Feature 구현
export const DateSelection: CalendarFeature = {
  getInitialState: (state): DateSelectionState => {
    return {
      selectedDate: null,
      ...state,
    };
  },

  getDefaultOptions: <TData>(calendar: Calendar<TData>) => {
    return {
      enableDateSelection: true,
      onDateSelectionChange: makeStateUpdater<any, 'selectedDate'>(
        'selectedDate',
        calendar
      ),
    } as DateSelectionOptions;
  },

  createCalendar: <TData>(calendar: Calendar<TData>): void => {
    const instance: DateSelectionInstance = {
      getSelectedDate: () => {
        return calendar.getState().selectedDate;
      },

      setSelectedDate: (date: Date | null) => {
        calendar.options.onDateSelectionChange?.(date);
      },

      toggleDateSelection: (date: Date) => {
        const currentSelected = calendar.getState().selectedDate;
        const isSameDate =
          currentSelected && currentSelected.getTime() === date.getTime();

        calendar.options.onDateSelectionChange?.(isSameDate ? null : date);
      },

      resetDateSelection: () => {
        calendar.options.onDateSelectionChange?.(null);
      },

      setDateSelectionState: updater => {
        calendar.setState(old => {
          const newState =
            typeof updater === 'function'
              ? updater({ selectedDate: old.selectedDate } as any)
              : updater;
          return {
            ...old,
            selectedDate: newState.selectedDate,
          };
        });
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
    const dayInstance: DateSelectionDay = {
      getCanSelect: () => {
        const { enableDateSelection } = calendar.options;

        if (typeof enableDateSelection === 'function') {
          return enableDateSelection(day.getValue());
        }

        return enableDateSelection ?? true;
      },

      getIsSelected: () => {
        const selectedDate = calendar.getState().selectedDate;
        if (!selectedDate) return false;

        const dayDate = day.getValue();
        return (
          selectedDate.getFullYear() === dayDate.getFullYear() &&
          selectedDate.getMonth() === dayDate.getMonth() &&
          selectedDate.getDate() === dayDate.getDate()
        );
      },

      toggleSelected: () => {
        if (day.getCanSelect()) {
          calendar.toggleDateSelection(day.getValue());
        }
      },
    };

    Object.assign(day, dayInstance);
  },
};

// TypeScript 타입 확장
declare module '@/types/calendar' {
  interface CalendarState extends DateSelectionState {}
  interface FeatureOptions<_TData> extends DateSelectionOptions {}
  interface Calendar extends DateSelectionInstance {}
  interface Day extends DateSelectionDay {}
}
