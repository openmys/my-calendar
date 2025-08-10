/**
 * Range Plugin의 쿼리 타입 정의
 */

export interface RangePluginQueries {
  range: {
    getSelectedRange: () => { start: Date; end: Date } | null;
    getSelectedDates: () => Date[];
    isDateSelected: (date: Date) => boolean;
    getSelectionMode: () => 'single' | 'range' | 'multiple';
    isSelecting: () => boolean;
  };
}

export type RangePluginQueryFunction = <
  TPluginKey extends keyof RangePluginQueries,
  TQueryName extends keyof RangePluginQueries[TPluginKey],
>(
  pluginKey: TPluginKey,
  queryName: TQueryName,
  ...args: RangePluginQueries[TPluginKey][TQueryName] extends (
    ...args: infer Args
  ) => any
    ? Args
    : never[]
) => RangePluginQueries[TPluginKey][TQueryName] extends (
  ...args: any[]
) => infer Return
  ? Return
  : unknown;
