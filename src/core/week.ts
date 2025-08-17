/**
 * Week Core 구현
 * TanStack Table의 row.ts에 해당
 */

import { Calendar, Day, Week, WeekData } from '@/types/calendar';
import { createDay } from '@/core/day';

export interface CoreWeek<TData = any> {
  id: string;
  data: WeekData;
  calendar: Calendar<TData>;
  getDays: () => Day<TData>[];
  getWeekNumber: () => number;
}

export function createWeek<TData>(
  calendar: Calendar<TData>,
  data: WeekData,
  id: string
): Week<TData> {
  const week: CoreWeek<TData> = {
    id,
    data,
    calendar,
    getDays: () => {
      return data.days.map((dayData, index) =>
        createDay(calendar, dayData, `${id}-d${index}`)
      );
    },
    getWeekNumber: () => data.weekNumber,
  };

  // Process features
  calendar.features.forEach(feature => {
    feature.createWeek?.(week as Week<TData>, {} as any, calendar);
  });

  return week as Week<TData>;
}
