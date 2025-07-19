/**
 * 플러그인 팩토리 - 사용자가 쉽게 커스텀 플러그인을 만들 수 있도록 도와주는 유틸리티
 */

import {
  CalendarState,
  Transaction,
  CommandMap,
  Command,
  DecorationType,
  PluginState,
} from '@/types';
import { Plugin, PluginSpec } from '@/core/plugin';
import { DecorationSet } from '@/core/decoration';
import { BasePluginState } from '@/core/plugin-state';

/**
 * 기본 플러그인 상태 인터페이스
 */
export interface BaseCustomPluginState {
  isEnabled: boolean;
  data: Record<string, any>;
  settings: Record<string, any>;
}

/**
 * 플러그인 생성 옵션
 */
export interface PluginFactoryOptions<T = BaseCustomPluginState> {
  /** 플러그인 고유 키 */
  key: string;

  /** 초기 상태 */
  initialState?: Partial<T>;

  /** 의존성 플러그인들 */
  dependencies?: string[];

  /** 실행 우선순위 */
  priority?: number;

  /** 상태 업데이트 핸들러들 */
  stateHandlers?: {
    [transactionType: string]: (state: T, payload: any) => Partial<T>;
  };

  /** 커맨드 정의 */
  commands?: CommandMap;

  /** 데코레이션 생성 함수 */
  decorationFactory?: (state: CalendarState, pluginState: T) => DecorationSet;

  /** 이벤트 핸들러들 */
  eventHandlers?: {
    onDateClick?: (
      date: Date,
      event: MouseEvent,
      state: CalendarState,
      pluginState: T
    ) => boolean;
    onTimeClick?: (
      datetime: Date,
      event: MouseEvent,
      state: CalendarState,
      pluginState: T
    ) => boolean;
    onKeyDown?: (
      event: KeyboardEvent,
      state: CalendarState,
      pluginState: T
    ) => boolean;
    onKeyUp?: (
      event: KeyboardEvent,
      state: CalendarState,
      pluginState: T
    ) => boolean;
  };

  /** 트랜잭션 필터 */
  transactionFilter?: (
    transaction: Transaction,
    state: CalendarState
  ) => boolean;

  /** 트랜잭션 후처리 */
  transactionPostProcessor?: (
    transactions: Transaction[],
    oldState: CalendarState,
    newState: CalendarState
  ) => Transaction | null;
}

/**
 * 커스텀 플러그인 상태 클래스
 */
class CustomPluginState<T = BaseCustomPluginState> extends BasePluginState<T> {
  private stateHandlers: {
    [key: string]: (state: T, payload: unknown) => Partial<T>;
  };

  constructor(
    value: T,
    handlers: { [key: string]: (state: T, payload: unknown) => Partial<T> } = {}
  ) {
    super(value);
    this.stateHandlers = handlers;
  }

  apply(transaction: Transaction): CustomPluginState<T> {
    const handler = this.stateHandlers[transaction.type];

    if (handler) {
      const updates = handler(this.value, transaction.payload);
      const newValue = { ...this.value, ...updates };
      return new CustomPluginState(newValue, this.stateHandlers);
    }

    return this;
  }

  toJSON(): T {
    return this.value;
  }

  static fromJSON<T>(
    value: T,
    handlers: Record<string, any> = {}
  ): CustomPluginState<T> {
    return new CustomPluginState(value, handlers);
  }
}

/**
 * 사용자 친화적인 플러그인 생성 팩토리
 */
export function createCustomPlugin<T = BaseCustomPluginState>(
  options: PluginFactoryOptions<T>
): Plugin<T> {
  const {
    key,
    initialState = {} as Partial<T>,
    dependencies = [],
    priority = 100,
    stateHandlers = {},
    commands = {},
    decorationFactory,
    eventHandlers = {},
    transactionFilter,
    transactionPostProcessor,
  } = options;

  // 기본 상태와 사용자 상태 병합
  const defaultState: BaseCustomPluginState = {
    isEnabled: true,
    data: {},
    settings: {},
  };

  const mergedInitialState = {
    ...defaultState,
    ...initialState,
  } as T;

  const spec: PluginSpec<T> = {
    key,
    dependencies,
    priority,

    // 상태 관리
    state: {
      init: () => new CustomPluginState(mergedInitialState, stateHandlers),
      apply: (transaction: Transaction, state: PluginState<T>) => {
        if (state instanceof CustomPluginState) {
          return state.apply(transaction);
        }
        // fallback: 상태가 CustomPluginState가 아닌 경우
        return state;
      },
    },

    // 커맨드 생성
    commands: (_plugin: Plugin<T>): CommandMap => {
      const commandMap: CommandMap = {};

      Object.entries(commands).forEach(([name, commandFn]) => {
        commandMap[name] = (...args: unknown[]): Command => {
          return commandFn(...args);
        };
      });

      return commandMap;
    },

    // 데코레이션
    decorations: decorationFactory
      ? (state: CalendarState, plugin: Plugin<T>) => {
          const pluginState = plugin.getState(state);
          return pluginState
            ? decorationFactory(state, pluginState.value)
            : new DecorationSet();
        }
      : undefined,

    // 이벤트 핸들러
    props: {
      handleDateClick: eventHandlers.onDateClick
        ? (
            date: Date,
            event: MouseEvent,
            state: CalendarState,
            plugin: Plugin<T>
          ) => {
            const pluginState = plugin.getState(state);
            return pluginState
              ? eventHandlers.onDateClick!(
                  date,
                  event,
                  state,
                  pluginState.value
                )
              : false;
          }
        : undefined,

      handleTimeClick: eventHandlers.onTimeClick
        ? (
            datetime: Date,
            event: MouseEvent,
            state: CalendarState,
            plugin: Plugin<T>
          ) => {
            const pluginState = plugin.getState(state);
            return pluginState
              ? eventHandlers.onTimeClick!(
                  datetime,
                  event,
                  state,
                  pluginState.value
                )
              : false;
          }
        : undefined,

      handleKeyDown: eventHandlers.onKeyDown
        ? (event: KeyboardEvent, state: CalendarState, plugin: Plugin<T>) => {
            const pluginState = plugin.getState(state);
            return pluginState
              ? eventHandlers.onKeyDown!(event, state, pluginState.value)
              : false;
          }
        : undefined,
    },

    // 트랜잭션 필터링
    filterTransaction: transactionFilter,

    // 트랜잭션 후처리
    appendTransaction: transactionPostProcessor,
  };

  return new Plugin(spec);
}

/**
 * 미리 정의된 플러그인 템플릿들
 */
export namespace PluginTemplates {
  /**
   * 간단한 하이라이트 플러그인 템플릿
   */
  export function createHighlightPlugin(options: {
    key: string;
    highlightDates?: Date[];
    highlightClass?: string;
  }) {
    return createCustomPlugin({
      key: options.key,
      initialState: {
        highlightDates: options.highlightDates ?? [],
        highlightClass: options.highlightClass ?? 'highlight-date',
      },
      stateHandlers: {
        ADD_HIGHLIGHT_DATE: (state, payload) => ({
          highlightDates: [...(state as any).highlightDates, payload.date],
        }),
        REMOVE_HIGHLIGHT_DATE: (state, payload) => ({
          highlightDates: (state as any).highlightDates.filter(
            (date: Date) => date.getTime() !== payload.date.getTime()
          ),
        }),
        CLEAR_HIGHLIGHTS: _state => ({
          highlightDates: [],
        }),
      },
      commands: {
        addHighlight: (date: Date) => (_state, dispatch) => {
          dispatch?.({
            type: 'ADD_HIGHLIGHT_DATE',
            payload: { date },
            meta: new Map([['source', options.key]]),
          });
          return true;
        },
        removeHighlight: (date: Date) => (_state, dispatch) => {
          dispatch?.({
            type: 'REMOVE_HIGHLIGHT_DATE',
            payload: { date },
            meta: new Map([['source', options.key]]),
          });
          return true;
        },
        clearHighlights: () => (_state, dispatch) => {
          dispatch?.({
            type: 'CLEAR_HIGHLIGHTS',
            payload: {},
            meta: new Map([['source', options.key]]),
          });
          return true;
        },
      },
      decorationFactory: (_state, pluginState) => {
        const decorations = (pluginState as any).highlightDates.map(
          (date: Date) => ({
            type: 'highlight' as const,
            from: date,
            spec: {
              class: (pluginState as any).highlightClass,
              'data-highlighted': 'true',
            },
          })
        );
        return new DecorationSet(decorations);
      },
    });
  }

  /**
   * 클릭 카운터 플러그인 템플릿
   */
  export function createClickCounterPlugin(options: {
    key: string;
    onCountChange?: (count: number, date: Date) => void;
  }) {
    return createCustomPlugin({
      key: options.key,
      initialState: {
        clickCounts: new Map<string, number>(),
      },
      stateHandlers: {
        INCREMENT_DATE_CLICK: (state, payload) => {
          const dateKey = payload.date.toISOString().split('T')[0];
          const currentCount = (state as any).clickCounts.get(dateKey) ?? 0;
          const newCounts = new Map<string, number>((state as any).clickCounts);
          newCounts.set(dateKey, currentCount + 1);

          options.onCountChange?.(currentCount + 1, payload.date);

          return {
            clickCounts: newCounts,
          };
        },
      },
      eventHandlers: {
        onDateClick: (date, _event, _state, _pluginState) => {
          // 클릭 카운트 증가 트랜잭션 디스패치
          const calendar = (window as any).__calendarInstance; // 임시 해결책
          calendar?.execCommand('incrementDateClick', date);
          return false; // 다른 핸들러도 실행되도록
        },
      },
      commands: {
        incrementDateClick: (date: Date) => (_state, dispatch) => {
          dispatch?.({
            type: 'INCREMENT_DATE_CLICK',
            payload: { date },
            meta: new Map([['source', options.key]]),
          });
          return true;
        },
        getClickCount: (date: Date) => state => {
          // 조회 전용 커맨드 (실제로는 query로 구현하는 것이 좋음)
          const dateKey = date.toISOString().split('T')[0];
          return (state as any).clickCounts?.get(dateKey) ?? 0;
        },
      },
    });
  }

  /**
   * 날짜 비활성화 플러그인 템플릿
   */
  export function createDateDisablerPlugin(options: {
    key: string;
    disabledDates?: Date[];
    disableWeekends?: boolean;
    disablePastDates?: boolean;
  }) {
    return createCustomPlugin({
      key: options.key,
      initialState: {
        disabledDates: options.disabledDates ?? [],
        disableWeekends: options.disableWeekends ?? false,
        disablePastDates: options.disablePastDates ?? false,
      },
      stateHandlers: {
        ADD_DISABLED_DATE: (state, payload) => ({
          disabledDates: [...(state as any).disabledDates, payload.date],
        }),
        REMOVE_DISABLED_DATE: (state, payload) => ({
          disabledDates: (state as any).disabledDates.filter(
            (date: Date) => date.getTime() !== payload.date.getTime()
          ),
        }),
        TOGGLE_WEEKEND_DISABLE: state => ({
          disableWeekends: !(state as any).disableWeekends,
        }),
        TOGGLE_PAST_DATES_DISABLE: state => ({
          disablePastDates: !(state as any).disablePastDates,
        }),
      },
      commands: {
        disableDate: (date: Date) => (_state, dispatch) => {
          dispatch?.({
            type: 'ADD_DISABLED_DATE',
            payload: { date },
            meta: new Map([['source', options.key]]),
          });
          return true;
        },
        enableDate: (date: Date) => (_state, dispatch) => {
          dispatch?.({
            type: 'REMOVE_DISABLED_DATE',
            payload: { date },
            meta: new Map([['source', options.key]]),
          });
          return true;
        },
        toggleWeekendDisable: () => (_state, dispatch) => {
          dispatch?.({
            type: 'TOGGLE_WEEKEND_DISABLE',
            payload: {},
            meta: new Map([['source', options.key]]),
          });
          return true;
        },
      },
      decorationFactory: (_state, pluginState) => {
        const decorations: Array<{
          type: DecorationType;
          from: Date;
          spec: Record<string, unknown>;
        }> = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // 명시적으로 비활성화된 날짜들
        (pluginState as any).disabledDates.forEach((date: Date) => {
          decorations.push({
            type: 'disable' as const,
            from: date,
            spec: {
              class: 'disabled-date',
              'data-disabled': 'manual',
            },
          });
        });

        // 주말 비활성화 (필요한 경우 달력의 모든 날짜를 체크해야 함)
        if ((pluginState as any).disableWeekends) {
          // 이 부분은 달력의 현재 표시되는 날짜들을 기반으로 구현해야 함
          // 여기서는 예시로만 표시
        }

        return new DecorationSet(decorations);
      },
      eventHandlers: {
        onDateClick: (date, event, _state, pluginState) => {
          // 비활성화된 날짜 클릭 차단
          const dateKey = date.toISOString().split('T')[0];
          const isDisabled = (pluginState as any).disabledDates.some(
            (d: Date) => d.toISOString().split('T')[0] === dateKey
          );

          if (isDisabled) {
            event?.preventDefault();
            return true; // 이벤트 소비
          }

          // 주말 체크
          if (
            (pluginState as any).disableWeekends &&
            (date.getDay() === 0 || date.getDay() === 6)
          ) {
            event?.preventDefault();
            return true;
          }

          // 과거 날짜 체크
          if ((pluginState as any).disablePastDates) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (date < today) {
              event?.preventDefault();
              return true;
            }
          }

          return false;
        },
      },
    });
  }
}

/**
 * 플러그인 개발 도우미 함수들
 */
export namespace PluginHelpers {
  /**
   * 날짜 유틸리티
   */
  export const DateUtils = {
    isWeekend: (date: Date) => date.getDay() === 0 || date.getDay() === 6,
    isSameDay: (date1: Date, date2: Date) =>
      date1.toISOString().split('T')[0] === date2.toISOString().split('T')[0],
    addDays: (date: Date, days: number) => {
      const result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    },
    getDateKey: (date: Date) => date.toISOString().split('T')[0],
  };

  /**
   * 상태 업데이트 헬퍼
   */
  export const StateHelpers = {
    toggleBoolean: (key: string) => (state: Record<string, unknown>) => ({
      [key]: !state[key],
    }),
    addToArray:
      (key: string) => (state: Record<string, unknown>, item: unknown) => ({
        [key]: [...(Array.isArray(state[key]) ? state[key] : []), item],
      }),
    removeFromArray:
      (key: string, predicate: (item: unknown) => boolean) =>
      (state: Record<string, unknown>) => ({
        [key]: ((state[key] as unknown[]) ?? []).filter(
          (item: unknown) => !predicate(item)
        ),
      }),
    updateObject:
      (key: string) =>
      (state: Record<string, unknown>, updates: Record<string, unknown>) => ({
        [key]: { ...(state[key] ?? {}), ...updates },
      }),
  };

  /**
   * 데코레이션 헬퍼
   */
  export const DecorationHelpers = {
    createHighlight: (date: Date, className: string = 'highlight') => ({
      type: 'highlight' as const,
      from: date,
      spec: { class: className },
    }),
    createBadge: (date: Date, text: string, className: string = 'badge') => ({
      type: 'badge' as const,
      from: date,
      spec: {
        class: className,
        'data-badge': text,
      },
    }),
    createTooltip: (date: Date, tooltip: string) => ({
      type: 'tooltip' as const,
      from: date,
      spec: {
        'data-tooltip': tooltip,
        title: tooltip,
      },
    }),
  };
}
