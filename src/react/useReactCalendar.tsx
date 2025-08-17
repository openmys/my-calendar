/**
 * React Calendar Hook
 * TanStack Table의 useReactTable에 해당
 */

import * as React from 'react';
import {
  CalendarOptions,
  CalendarOptionsResolved,
  createCalendar,
} from '@/core';

export function useReactCalendar<TData = any>(options: CalendarOptions<TData>) {
  // 옵션을 resolved 옵션으로 변환
  const resolvedOptions: CalendarOptionsResolved<TData> = Object.assign(
    {
      state: {},
      onStateChange: () => {},
      currentDate: new Date(),
      viewType: 'month',
      weekStartsOn: 0,
      locale: 'en-US',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      debugAll: false,
      debugCells: false,
      debugWeeks: false,
      debugMonths: false,
      debugCalendar: false,
      features: [],
      data: [],
    },
    options
  ) as CalendarOptionsResolved<TData>;

  // 캘린더 인스턴스를 ref로 관리
  const [calendarRef] = React.useState(() => ({
    current: createCalendar<TData>(resolvedOptions),
  }));

  // 상태 관리
  const [state, setState] = React.useState(
    () => calendarRef.current.initialState
  );

  // 옵션과 상태 업데이트
  calendarRef.current.setOptions(prev => ({
    ...prev,
    ...options,
    state: {
      ...state,
      ...options.state,
    },
    onStateChange: updater => {
      setState(updater);
      options.onStateChange?.(updater);
    },
  }));

  return calendarRef.current;
}
