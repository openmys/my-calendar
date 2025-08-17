/**
 * Month Core 구현
 * TanStack Table의 column.ts에 해당
 */

import { Calendar, Month, MonthData, Week } from '@/types/calendar';
import { createWeek } from '@/core/week';

export interface CoreMonth<TData = any> {
  id: string;
  data: MonthData;
  calendar: Calendar<TData>;
  getWeeks: () => Week<TData>[];
  getYear: () => number;
  getMonth: () => number;
}

export function createMonth<TData>(
  calendar: Calendar<TData>,
  data: MonthData,
  id: string
): Month<TData> {
  const month: CoreMonth<TData> = {
    id,
    data,
    calendar,
    getWeeks: () => {
      return data.weeks.map((weekData, index) =>
        createWeek(calendar, weekData, `${id}-w${index}`)
      );
    },
    getYear: () => data.year,
    getMonth: () => data.month,
  };

  // Process features
  calendar.features.forEach(feature => {
    feature.createMonth?.(month as Month<TData>, calendar);
  });

  return month as Month<TData>;
}
