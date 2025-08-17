/**
 * Day Core 구현
 * TanStack Table의 cell.ts에 해당
 */

import { Calendar, Day, DayData } from '@/types/calendar';

export interface CoreDay<TData = any> {
  id: string;
  data: DayData;
  calendar: Calendar<TData>;
  getValue: () => Date;
  getIsToday: () => boolean;
  getIsWeekend: () => boolean;
  getIsCurrentMonth: () => boolean;
}

export function createDay<TData>(
  calendar: Calendar<TData>,
  data: DayData,
  id: string
): Day<TData> {
  const day: CoreDay<TData> = {
    id,
    data,
    calendar,
    getValue: () => data.date,
    getIsToday: () => data.isToday,
    getIsWeekend: () => data.isWeekend,
    getIsCurrentMonth: () => data.isCurrentMonth,
  };

  // Process features
  calendar.features.forEach(feature => {
    feature.createDay?.(day as Day<TData>, {} as any, {} as any, calendar);
  });

  return day as Day<TData>;
}
