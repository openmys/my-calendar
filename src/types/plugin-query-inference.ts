/**
 * 플러그인 쿼리 타입 완전 자동 추론 시스템
 * 빌드타임에 플러그인 배열로부터 타입을 추출하여 완벽한 타입 안전성 제공
 */

import { Plugin } from '@/core/plugin';
import { CalendarState } from './index';

/**
 * 쿼리 함수의 매개변수 추출 (state, plugin 제외)
 */
export type ExtractQueryArgs<T> = T extends (
  state: CalendarState,
  plugin: Plugin<any>,
  ...args: infer Args
) => any
  ? Args
  : [];

/**
 * 쿼리 함수의 반환 타입 추출
 */
export type ExtractQueryReturn<T> = T extends (
  state: CalendarState,
  plugin: Plugin<any>,
  ...args: any[]
) => infer Return
  ? Return
  : unknown;

/**
 * 쿼리 함수를 사용자 호출 가능한 형태로 변환
 */
export type TransformQueryFunction<T> = T extends (
  state: CalendarState,
  plugin: Plugin<any>,
  ...args: infer Args
) => infer Return
  ? (...args: Args) => Return
  : T;

/**
 * 플러그인의 모든 쿼리를 변환
 */
export type TransformPluginQueries<T> = {
  [K in keyof T]: TransformQueryFunction<T[K]>;
};

/**
 * 플러그인에서 쿼리 객체와 키를 정확히 추출
 */
export type ExtractPluginInfo<T> =
  T extends Plugin<any>
    ? T extends { spec: { key: infer K; queries: infer Q } }
      ? K extends string
        ? { key: K; queries: Q }
        : never
      : never
    : never;

/**
 * 플러그인 정보에서 키-쿼리 매핑 생성
 */
export type CreatePluginQueryMap<TInfo> = TInfo extends {
  key: infer K;
  queries: infer Q;
}
  ? K extends string
    ? Record<K, TransformPluginQueries<Q>>
    : never
  : never;

/**
 * 플러그인 배열을 Union으로 변환
 */
export type PluginArrayToUnion<T> = T extends readonly (infer U)[] ? U : never;

/**
 * Union을 교집합으로 변환
 */
export type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

/**
 * 플러그인 배열에서 모든 쿼리 맵을 병합
 */
export type MergePluginQueries<T extends readonly Plugin<any>[]> =
  UnionToIntersection<
    CreatePluginQueryMap<ExtractPluginInfo<PluginArrayToUnion<T>>>
  >;

/**
 * 허용되는 플러그인 키들을 Union으로 추출
 */
export type ExtractPluginKeys<T extends readonly Plugin<any>[]> =
  ExtractPluginInfo<PluginArrayToUnion<T>> extends { key: infer K } ? K : never;

/**
 * 특정 플러그인 키의 쿼리명들을 추출
 */
export type ExtractQueryNames<TQueries, TPluginKey> =
  TPluginKey extends keyof TQueries ? keyof TQueries[TPluginKey] : never;

/**
 * 완전 타입 안전한 쿼리 함수
 */
export interface TypedQueryFunction<TPlugins extends readonly Plugin<any>[]> {
  <
    TPluginKey extends ExtractPluginKeys<TPlugins>,
    TQueryName extends ExtractQueryNames<
      MergePluginQueries<TPlugins>,
      TPluginKey
    >,
  >(
    pluginKey: TPluginKey,
    queryName: TQueryName,
    ...args: TPluginKey extends keyof MergePluginQueries<TPlugins>
      ? TQueryName extends keyof MergePluginQueries<TPlugins>[TPluginKey]
        ? MergePluginQueries<TPlugins>[TPluginKey][TQueryName] extends (
            ...args: infer Args
          ) => any
          ? Args
          : []
        : []
      : []
  ): TPluginKey extends keyof MergePluginQueries<TPlugins>
    ? TQueryName extends keyof MergePluginQueries<TPlugins>[TPluginKey]
      ? MergePluginQueries<TPlugins>[TPluginKey][TQueryName] extends (
          ...args: any[]
        ) => infer Return
        ? Return
        : unknown
      : unknown
    : unknown;
}
