/**
 * 전역 상태 관리 시스템
 * CalendarState의 생성, 업데이트, 관리를 담당
 */

import {
  CalendarDay,
  CalendarState,
  PluginState,
  TimeRange,
  ViewType,
} from '@/types';
import { ImmutableStateManager, StateValidator } from './plugin-state';

/**
 * CalendarState 팩토리
 */
export class CalendarStateFactory {
  /**
   * 기본 CalendarState 생성
   */
  static createInitialState(
    options: {
      currentDate?: Date;
      viewType?: ViewType;
      timeRange?: TimeRange;
      timezone?: string;
    } = {}
  ): CalendarState {
    const now = new Date();
    const currentDate = options.currentDate ?? now;

    // 기본 시간 범위 (현재 월)
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    const timeRange = options.timeRange ?? {
      start: startOfMonth,
      end: endOfMonth,
    };

    const state: CalendarState = {
      currentDate,
      viewType: options.viewType ?? 'month',
      timeRange,
      days: this.generateDays(timeRange),
      pluginStates: new Map<string, PluginState>(),
      timezone:
        options.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

    // 개발 환경에서 불변성 보장
    return ImmutableStateManager.deepFreeze(state);
  }

  /**
   * 플러그인과 함께 CalendarState 생성
   */
  static create(
    plugins: any[] = [],
    options?: {
      currentDate?: Date;
      viewType?: ViewType;
      timeRange?: TimeRange;
      timezone?: string;
    }
  ): CalendarState {
    const state = this.createInitialState(options);

    // 플러그인 상태들을 초기화
    const pluginStates = new Map(state.pluginStates);

    plugins.forEach(plugin => {
      if (plugin?.spec?.state?.init) {
        const pluginState = plugin.spec.state.init();
        pluginStates.set(plugin.spec.key, pluginState);
      }
    });

    return {
      ...state,
      pluginStates,
    };
  }

  /**
   * 날짜 범위에 따른 CalendarDay 배열 생성
   */
  static generateDays(timeRange: TimeRange): CalendarDay[] {
    const days: CalendarDay[] = [];
    const current = new Date(timeRange.start);
    const today = new Date();

    while (current <= timeRange.end) {
      const day: CalendarDay = {
        date: new Date(current),
        isToday: this.isSameDay(current, today),
        isWeekend: current.getDay() === 0 || current.getDay() === 6,
        isCurrentMonth: current.getMonth() === timeRange.start.getMonth(),
        metadata: new Map(),
      };

      days.push(day);
      current.setDate(current.getDate() + 1);
    }

    return days;
  }

  /**
   * 두 날짜가 같은 날인지 확인
   */
  private static isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  /**
   * 뷰 타입에 따른 시간 범위 계산
   */
  static calculateTimeRangeForView(date: Date, viewType: ViewType): TimeRange {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    switch (viewType) {
      case 'month':
        return {
          start: new Date(year, month, 1),
          end: new Date(year, month + 1, 0),
        };

      case 'week': {
        const startOfWeek = new Date(date);
        const dayOfWeek = startOfWeek.getDay();
        startOfWeek.setDate(day - dayOfWeek);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        return {
          start: startOfWeek,
          end: endOfWeek,
        };
      }

      case 'day':
        return {
          start: new Date(year, month, day),
          end: new Date(year, month, day),
        };

      default:
        // 기본값은 월간 뷰
        return {
          start: new Date(year, month, 1),
          end: new Date(year, month + 1, 0),
        };
    }
  }
}

/**
 * 상태 업데이트 헬퍼
 */
export class StateUpdater {
  /**
   * 현재 날짜 변경
   */
  static updateCurrentDate(state: CalendarState, newDate: Date): CalendarState {
    const newTimeRange = CalendarStateFactory.calculateTimeRangeForView(
      newDate,
      state.viewType
    );

    const corePluginState = state.pluginStates.get('core') as CorePluginState;

    const newState: CalendarState = {
      ...state,
      currentDate: new Date(newDate),
      timeRange: newTimeRange,
      days: CalendarStateFactory.generateDays(newTimeRange),
    };

    StateValidator.validateCalendarState(newState);
    return ImmutableStateManager.deepFreeze(newState);
  }

  /**
   * 뷰 타입 변경
   */
  static updateViewType(
    state: CalendarState,
    viewType: ViewType
  ): CalendarState {
    const newTimeRange = CalendarStateFactory.calculateTimeRangeForView(
      state.currentDate,
      viewType
    );

    const newState: CalendarState = {
      ...state,
      viewType,
      timeRange: newTimeRange,
      days: CalendarStateFactory.generateDays(newTimeRange),
    };

    StateValidator.validateCalendarState(newState);
    return ImmutableStateManager.deepFreeze(newState);
  }

  /**
   * 플러그인 상태 업데이트
   */
  static updatePluginState(
    state: CalendarState,
    pluginId: string,
    newPluginState: PluginState
  ): CalendarState {
    const newPluginStates = new Map(state.pluginStates);
    newPluginStates.set(pluginId, newPluginState);

    const newState: CalendarState = {
      ...state,
      pluginStates: newPluginStates,
    };

    StateValidator.validateCalendarState(newState);
    return ImmutableStateManager.deepFreeze(newState);
  }

  /**
   * 시간대 변경
   */
  static updateTimezone(state: CalendarState, timezone: string): CalendarState {
    const newState: CalendarState = {
      ...state,
      timezone,
    };

    StateValidator.validateCalendarState(newState);
    return ImmutableStateManager.deepFreeze(newState);
  }

  /**
   * 월 이동 (다음/이전)
   */
  static navigateMonth(
    state: CalendarState,
    direction: 'next' | 'previous'
  ): CalendarState {
    const currentDate = new Date(state.currentDate);

    if (direction === 'next') {
      currentDate.setMonth(currentDate.getMonth() + 1);
    } else {
      currentDate.setMonth(currentDate.getMonth() - 1);
    }

    return this.updateCurrentDate(state, currentDate);
  }

  /**
   * 주 이동
   */
  static navigateWeek(
    state: CalendarState,
    direction: 'next' | 'previous'
  ): CalendarState {
    const currentDate = new Date(state.currentDate);

    if (direction === 'next') {
      currentDate.setDate(currentDate.getDate() + 7);
    } else {
      currentDate.setDate(currentDate.getDate() - 7);
    }

    return this.updateCurrentDate(state, currentDate);
  }

  /**
   * 일 이동
   */
  static navigateDay(
    state: CalendarState,
    direction: 'next' | 'previous'
  ): CalendarState {
    const currentDate = new Date(state.currentDate);

    if (direction === 'next') {
      currentDate.setDate(currentDate.getDate() + 1);
    } else {
      currentDate.setDate(currentDate.getDate() - 1);
    }

    return this.updateCurrentDate(state, currentDate);
  }

  /**
   * 오늘로 이동
   */
  static goToToday(state: CalendarState): CalendarState {
    return this.updateCurrentDate(state, new Date());
  }
}

/**
 * 상태 쿼리 헬퍼
 */
export class StateQuery {
  /**
   * 특정 날짜의 CalendarDay 찾기
   */
  static findDay(state: CalendarState, date: Date): CalendarDay | undefined {
    return state.days.find(day => this.isSameDay(day.date, date));
  }

  /**
   * 현재 보이는 날짜 범위 가져오기
   */
  static getVisibleDateRange(state: CalendarState): TimeRange {
    return state.timeRange;
  }

  /**
   * 플러그인 상태 가져오기
   */
  static getPluginState<T = any>(
    state: CalendarState,
    pluginId: string
  ): PluginState<T> | undefined {
    return state.pluginStates.get(pluginId) as PluginState<T>;
  }

  /**
   * 활성화된 플러그인 목록
   */
  static getActivePlugins(state: CalendarState): string[] {
    return Array.from(state.pluginStates.keys());
  }

  /**
   * 오늘 날짜 가져오기
   */
  static getToday(state: CalendarState): CalendarDay | undefined {
    const today = new Date();
    return this.findDay(state, today);
  }

  /**
   * 주말 날짜들 가져오기
   */
  static getWeekends(state: CalendarState): CalendarDay[] {
    return state.days.filter(day => day.isWeekend);
  }

  private static isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }
}
