/**
 * Calendar Factory
 * 캘린더 생성을 위한 편의 함수들
 */

import { CalendarView, CalendarViewOptions } from '@/core/calendar-view';
import { Plugin } from '@/core/plugin';
import { createRangePlugin, RangeOptions } from '@/plugins/range-plugin';
import { createEventPlugin, EventOptions } from '@/plugins/event-plugin';
import { CalendarState, ViewType } from '@/types';

export interface CreateCalendarOptions {
  // 기본 설정
  initialDate?: Date;
  viewType?: ViewType;
  timezone?: string;

  // 플러그인 설정
  plugins?: Plugin[];
  enableRange?: boolean | RangeOptions;
  enableEvents?: boolean | EventOptions;

  // 초기 상태
  initialState?: Partial<CalendarState>;
}

/**
 * 캘린더 생성 팩토리 함수 (헤드리스 버전)
 */
export function createCalendar(
  options: CreateCalendarOptions = {}
): CalendarView {
  const {
    initialDate = new Date(),
    viewType = 'month',
    timezone = Intl.DateTimeFormat().resolvedOptions().timeZone,
    plugins = [],
    enableRange = true,
    enableEvents = true,
    initialState = {},
  } = options;

  // 플러그인 목록 구성
  const allPlugins = [...plugins];

  // Range 플러그인 추가
  if (enableRange) {
    const rangeOptions = enableRange === true ? {} : enableRange;
    allPlugins.push(createRangePlugin(rangeOptions));
  }

  // Event 플러그인 추가
  if (enableEvents) {
    const eventOptions = enableEvents === true ? {} : enableEvents;
    allPlugins.push(createEventPlugin(eventOptions));
  }

  // CalendarView 옵션 구성
  const viewOptions: CalendarViewOptions = {
    plugins: allPlugins,
    initialState: {
      currentDate: initialDate,
      viewType,
      timezone,
      ...initialState,
    },
  };

  return new CalendarView(viewOptions);
}

/**
 * 미니멀 캘린더 생성 (플러그인 없음)
 */
export function createMinimalCalendar(initialDate?: Date): CalendarView {
  return createCalendar({
    initialDate,
    enableRange: false,
    enableEvents: false,
  });
}

/**
 * 풀 기능 캘린더 생성 (모든 내장 플러그인 포함)
 */
export function createFullCalendar(
  options: {
    initialDate?: Date;
    viewType?: ViewType;
    rangeOptions?: RangeOptions;
    eventOptions?: EventOptions;
  } = {}
): CalendarView {
  return createCalendar({
    initialDate: options.initialDate,
    viewType: options.viewType,
    enableRange: options.rangeOptions ?? true,
    enableEvents: options.eventOptions ?? true,
  });
}

/**
 * 날짜 선택기 생성 (Range 플러그인만 포함)
 */
export function createDatePicker(
  options: {
    initialDate?: Date;
    rangeOptions?: RangeOptions;
  } = {}
): CalendarView {
  return createCalendar({
    initialDate: options.initialDate,
    enableRange: options.rangeOptions ?? true,
    enableEvents: false,
  });
}

/**
 * 이벤트 캘린더 생성 (Event 플러그인만 포함)
 */
export function createEventCalendar(
  options: {
    initialDate?: Date;
    viewType?: ViewType;
    eventOptions?: EventOptions;
  } = {}
): CalendarView {
  return createCalendar({
    initialDate: options.initialDate,
    viewType: options.viewType,
    enableRange: false,
    enableEvents: options.eventOptions ?? true,
  });
}
