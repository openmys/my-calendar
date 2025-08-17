/**
 * Calendar Core 구현
 * TanStack Table의 table.ts에 해당
 */

import {
  Calendar,
  CalendarFeature,
  CalendarOptions,
  CalendarOptionsResolved,
  CalendarState,
  CoreCalendarState,
  CoreInstance,
  RequiredKeys,
  Updater,
} from '@/types/calendar';

import { createDay } from '@/core/day';
import { createMonth } from '@/core/month';
import { createWeek } from '@/core/week';
import { functionalUpdate, getMemoOptions, memo } from '@/utils';
import { Navigation } from '@/features/Navigation';

// Built-in features
const builtInFeatures: CalendarFeature[] = [Navigation];

export function createCalendar<TData = any>(
  options: CalendarOptions<TData>
): Calendar<TData> {
  if (
    process.env.NODE_ENV !== 'production' &&
    (options.debugAll || options.debugCalendar)
  ) {
    console.info('Creating Calendar Instance...');
  }

  const features = [...builtInFeatures, ...(options.features ?? [])];

  const calendar = { features } as unknown as Calendar<TData>;

  const defaultOptions = calendar.features.reduce((obj, feature) => {
    return Object.assign(obj, feature.getDefaultOptions?.(calendar));
  }, {}) as CalendarOptionsResolved<TData>;

  const mergeOptions = (options: CalendarOptions<TData>) => {
    if (calendar.options.mergeOptions) {
      return calendar.options.mergeOptions(defaultOptions, options);
    }

    return {
      ...defaultOptions,
      ...options,
    };
  };

  const coreInitialState: CoreCalendarState = {
    currentDate: new Date(),
    viewType: 'month',
    weekStartsOn: 0,
    locale: 'en-US',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };

  let initialState = {
    ...coreInitialState,
  } as CalendarState;

  calendar.features.forEach(feature => {
    initialState = (feature.getInitialState?.(initialState) ??
      initialState) as CalendarState;
  });

  const coreInstance: CoreInstance<TData> = {
    features,
    options: {
      ...defaultOptions,
      ...options,
    },
    initialState,

    getState: () => {
      return {
        ...calendar.initialState,
        currentDate: calendar.options.currentDate,
        weekStartsOn: calendar.options.weekStartsOn,
        locale: calendar.options.locale,
        timezone: calendar.options.timezone,
        ...calendar.options.state,
      } as CalendarState;
    },
    setState: (updater: Updater<CalendarState>) => {
      calendar.options.onStateChange?.(updater);
    },

    reset: () => {
      calendar.setState(calendar.initialState);
    },

    setOptions: (updater: Updater<CalendarOptionsResolved<TData>>) => {
      const newOptions = functionalUpdate(updater, calendar.options);
      console.log('newOptions', newOptions);
      calendar.options = mergeOptions(newOptions) as RequiredKeys<
        CalendarOptionsResolved<TData>,
        'state'
      >;
    },

    _getCoreMonth: memo(
      () => [calendar.getState().currentDate] as const,
      currentDate => {
        const monthData = _getCoreMonth(calendar, currentDate);
        return createMonth(
          calendar,
          monthData,
          `${monthData.year}-${monthData.month}`
        );
      },
      getMemoOptions(options, 'debugAll', 'getCoreMonth')
    ),

    _getCoreWeeks: memo(
      () => [calendar._getCoreMonth!()] as const,
      month => {
        return month.data.weeks.map((weekData: any, index: number) =>
          createWeek(calendar, weekData, `${month.id}-w${index}`)
        );
      },
      getMemoOptions(options, 'debugAll', 'getCoreWeeks')
    ),

    _getCoreDays: memo(
      () => [calendar._getCoreWeeks!()] as const,
      weeks => {
        return weeks.flatMap((week: any) =>
          week.data.days.map((dayData: any, index: number) =>
            createDay(calendar, dayData, `${week.id}-d${index}`)
          )
        );
      },
      getMemoOptions(options, 'debugAll', 'getCoreDays')
    ),

    getMonth: () => calendar._getCoreMonth!(),
    getWeeks: () => calendar._getCoreWeeks!(),
    getDays: () => calendar._getCoreDays!(),
  };

  Object.assign(calendar, coreInstance);

  // Process features
  for (let index = 0; index < calendar.features.length; index++) {
    const feature = calendar.features[index];
    feature?.createCalendar?.(calendar);
  }

  return calendar;
}

// 내부 헬퍼 함수
function _getCoreMonth<TData>(calendar: Calendar<TData>, currentDate: Date) {
  const { weekStartsOn = 0 } = calendar.options;
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);

  // 월의 주 계산
  const weeks = _getMonthWeeks(startDate, weekStartsOn);

  return {
    year,
    month,
    startDate,
    endDate,
    weeks,
  };
}

function _getMonthWeeks(monthStart: Date, weekStartsOn: number) {
  const weeks = [];
  const monthEnd = new Date(
    monthStart.getFullYear(),
    monthStart.getMonth() + 1,
    0
  );

  // 월의 첫 주 시작일 계산
  const current = new Date(monthStart);
  const dayOfWeek = current.getDay();
  const daysToSubtract = (dayOfWeek - weekStartsOn + 7) % 7;
  current.setDate(current.getDate() - daysToSubtract);

  let weekNumber = 1;

  while (current <= monthEnd || current.getDay() !== weekStartsOn) {
    const weekStart = new Date(current);
    const weekEnd = new Date(current);
    weekEnd.setDate(weekEnd.getDate() + 6);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(current);
      const isCurrentMonth = date.getMonth() === monthStart.getMonth();
      const isToday = _isToday(date);
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;

      days.push({
        date,
        isToday,
        isWeekend,
        isCurrentMonth,
      });

      current.setDate(current.getDate() + 1);
    }

    weeks.push({
      weekNumber: weekNumber++,
      startDate: weekStart,
      endDate: weekEnd,
      days,
    });

    if (
      current.getMonth() > monthStart.getMonth() &&
      current.getDay() === weekStartsOn
    ) {
      break;
    }
  }

  return weeks;
}

function _isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}
