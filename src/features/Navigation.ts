/**
 * Navigation Feature
 * 달력 네비게이션 기능 (월 이동, 오늘 날짜로 이동 등)
 */

import { Calendar, CalendarFeature, OnChangeFn } from '@/types/calendar';

// State
export interface NavigationState {
  // 네비게이션 관련 상태는 currentDate가 이미 CoreCalendarState에 있으므로 추가 상태 불필요
}

// Options
export interface NavigationOptions {
  /**
   * 네비게이션 활성화 여부
   */
  enableNavigation?: boolean;

  /**
   * 날짜 변경 콜백
   */
  onNavigationChange?: OnChangeFn<Date>;

  /**
   * 최소 날짜 (이전으로 갈 수 있는 최소 날짜)
   */
  minDate?: Date;

  /**
   * 최대 날짜 (미래로 갈 수 있는 최대 날짜)
   */
  maxDate?: Date;

  /**
   * 애니메이션 활성화
   */
  enableAnimation?: boolean;
}

// Instance 확장
export interface NavigationInstance {
  /**
   * 다음 월로 이동
   */
  goToNextMonth: () => void;

  /**
   * 이전 월로 이동
   */
  goToPreviousMonth: () => void;

  /**
   * 오늘 날짜로 이동
   */
  goToToday: () => void;

  /**
   * 특정 날짜로 이동
   */
  goToDate: (date: Date) => void;

  /**
   * 특정 년월로 이동
   */
  goToMonth: (year: number, month: number) => void;

  /**
   * 다음 년으로 이동
   */
  goToNextYear: () => void;

  /**
   * 이전 년으로 이동
   */
  goToPreviousYear: () => void;

  /**
   * 네비게이션 가능 여부 확인
   */
  canNavigateToDate: (date: Date) => boolean;
}

// Feature 구현
export const Navigation: CalendarFeature = {
  getInitialState: (state): NavigationState => {
    return {
      ...state,
    };
  },

  getDefaultOptions: <TData>(_calendar: Calendar<TData>) => {
    return {
      enableNavigation: true,
      enableAnimation: false,
    } as NavigationOptions;
  },

  createCalendar: <TData>(calendar: Calendar<TData>): void => {
    const instance: NavigationInstance = {
      goToNextMonth: () => {
        if (!calendar.options.enableNavigation) return;

        const currentState = calendar.getState();
        const nextMonth = new Date(
          currentState.currentDate.getFullYear(),
          currentState.currentDate.getMonth() + 1,
          1
        );

        if (calendar.canNavigateToDate(nextMonth)) {
          calendar.setState(old => ({
            ...old,
            currentDate: nextMonth,
          }));

          calendar.options.onNavigationChange?.(nextMonth);
        }
      },

      goToPreviousMonth: () => {
        if (!calendar.options.enableNavigation) return;

        const currentState = calendar.getState();
        const prevMonth = new Date(
          currentState.currentDate.getFullYear(),
          currentState.currentDate.getMonth() - 1,
          1
        );

        if (calendar.canNavigateToDate(prevMonth)) {
          calendar.setState(old => ({
            ...old,
            currentDate: prevMonth,
          }));

          calendar.options.onNavigationChange?.(prevMonth);
        }
      },

      goToToday: () => {
        if (!calendar.options.enableNavigation) return;

        const today = new Date();

        if (calendar.canNavigateToDate(today)) {
          calendar.setState(old => ({
            ...old,
            currentDate: today,
          }));

          calendar.options.onNavigationChange?.(today);
        }
      },

      goToDate: (date: Date) => {
        if (!calendar.options.enableNavigation) return;

        if (calendar.canNavigateToDate(date)) {
          calendar.setState(old => ({
            ...old,
            currentDate: new Date(date),
          }));

          calendar.options.onNavigationChange?.(date);
        }
      },

      goToMonth: (year: number, month: number) => {
        if (!calendar.options.enableNavigation) return;

        const targetDate = new Date(year, month, 1);

        if (calendar.canNavigateToDate(targetDate)) {
          calendar.setState(old => ({
            ...old,
            currentDate: targetDate,
          }));

          calendar.options.onNavigationChange?.(targetDate);
        }
      },

      goToNextYear: () => {
        if (!calendar.options.enableNavigation) return;

        const currentState = calendar.getState();
        const nextYear = new Date(
          currentState.currentDate.getFullYear() + 1,
          currentState.currentDate.getMonth(),
          1
        );

        if (calendar.canNavigateToDate(nextYear)) {
          calendar.setState(old => ({
            ...old,
            currentDate: nextYear,
          }));

          calendar.options.onNavigationChange?.(nextYear);
        }
      },

      goToPreviousYear: () => {
        if (!calendar.options.enableNavigation) return;

        const currentState = calendar.getState();
        const prevYear = new Date(
          currentState.currentDate.getFullYear() - 1,
          currentState.currentDate.getMonth(),
          1
        );

        if (calendar.canNavigateToDate(prevYear)) {
          calendar.setState(old => ({
            ...old,
            currentDate: prevYear,
          }));

          calendar.options.onNavigationChange?.(prevYear);
        }
      },

      canNavigateToDate: (date: Date) => {
        const { minDate, maxDate } = calendar.options;

        if (minDate && date < minDate) {
          return false;
        }

        if (maxDate && date > maxDate) {
          return false;
        }

        return true;
      },
    };

    Object.assign(calendar, instance);
  },
};

// TypeScript 타입 확장
declare module '@/types/calendar' {
  interface CalendarState extends NavigationState {}
  interface FeatureOptions<_TData> extends NavigationOptions {}
  interface Calendar extends NavigationInstance {}
}
