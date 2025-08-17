/**
 * 유틸리티 함수들
 */

import { Updater } from '@/types/calendar';

export function functionalUpdate<T>(updater: Updater<T>, input: T): T {
  return typeof updater === 'function'
    ? (updater as (input: T) => T)(input)
    : updater;
}

export function makeStateUpdater<
  TCalendarState,
  K extends keyof TCalendarState,
>(key: K, instance: any) {
  return (updater: Updater<TCalendarState[K]>) => {
    instance.setState((old: TCalendarState) => {
      return {
        ...old,
        [key]: functionalUpdate(updater, old[key]),
      };
    });
  };
}

export function isFunction<T extends (...args: any[]) => any>(
  d: unknown
): d is T {
  return typeof d === 'function';
}

export function isNumberArray(d: unknown): d is number[] {
  return Array.isArray(d) && d.every(val => typeof val === 'number');
}

export function flattenBy<TNode>(
  arr: TNode[],
  getChildren: (item: TNode) => TNode[]
): TNode[] {
  const flat: TNode[] = [];

  const recurse = (subArr: TNode[]) => {
    subArr.forEach(item => {
      flat.push(item);
      const children = getChildren(item);
      if (children?.length) {
        recurse(children);
      }
    });
  };

  recurse(arr);

  return flat;
}

export function memo<TDeps extends readonly any[], TResult>(
  getDeps: () => [...TDeps],
  fn: (...args: [...TDeps]) => TResult,
  opts?: {
    key?: any;
    debug?: () => any;
    onChange?: (result: TResult) => void;
  }
): () => TResult {
  let deps: [...TDeps] | undefined;
  let result: TResult | undefined;

  return () => {
    const newDeps = getDeps();
    const depsChanged =
      !deps || !deps.every((dep, index) => dep === newDeps[index]);

    if (depsChanged) {
      deps = newDeps;
      result = fn(...newDeps);
      opts?.onChange?.(result);
    }

    return result!;
  };
}

export function getMemoOptions<TOptions extends object>(
  options: TOptions,
  debugLevel?: 'debugAll' | string,
  key?: string,
  onChange?: (result: any) => void
): {
  key: string;
  debug: () => any;
  onChange?: (result: any) => void;
} {
  return {
    key,
    debug: () => (options as any)?.[debugLevel ?? ''],
    onChange,
  } as any;
}

// 날짜 관련 유틸리티
export function startOfMonth(date: Date): Date {
  const d = new Date(date);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function endOfMonth(date: Date): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + 1);
  d.setDate(0);
  d.setHours(23, 59, 59, 999);
  return d;
}

export function startOfWeek(date: Date, weekStartsOn: number = 0): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function endOfWeek(date: Date, weekStartsOn: number = 0): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day < weekStartsOn ? -7 : 0) + 6 - (day - weekStartsOn);
  d.setDate(d.getDate() + diff);
  d.setHours(23, 59, 59, 999);
  return d;
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

export function getWeekNumber(date: Date): number {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

export function getDaysInMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

export function getMonthWeeks(date: Date, weekStartsOn: number = 0): Date[][] {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  const startWeek = startOfWeek(start, weekStartsOn);
  const endWeek = endOfWeek(end, weekStartsOn);

  const weeks: Date[][] = [];
  const current = new Date(startWeek);

  while (current <= endWeek) {
    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      week.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    weeks.push(week);
  }

  return weeks;
}
