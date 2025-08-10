/**
 * 플러그인 빌더 - 플루언트 API를 통한 플러그인 생성
 */

import { CalendarState, Transaction } from '@/types';
import { Plugin } from '@/core/plugin';
import { createCustomPlugin, PluginFactoryOptions } from './plugin-factory';

/**
 * 플러그인 빌더 클래스
 * 플루언트 API를 통해 단계별로 플러그인을 구성할 수 있습니다.
 */
export class PluginBuilder<T = any> {
  private options: PluginFactoryOptions<T> = {
    key: '',
    stateHandlers: {},
    commands: {},
    eventHandlers: {},
    initialState: {} as Partial<T>,
  };

  /**
   * 플러그인 키 설정
   */
  withKey(key: string): PluginBuilder<T> {
    this.options.key = key;
    return this;
  }

  /**
   * 초기 상태 설정
   */
  withInitialState(state: Partial<T>): PluginBuilder<T> {
    this.options.initialState = { ...this.options.initialState, ...state };
    return this;
  }

  /**
   * 의존성 추가
   */
  dependsOn(...dependencies: string[]): PluginBuilder<T> {
    this.options.dependencies = [
      ...(this.options.dependencies ?? []),
      ...dependencies,
    ];
    return this;
  }

  /**
   * 우선순위 설정
   */
  withPriority(priority: number): PluginBuilder<T> {
    this.options.priority = priority;
    return this;
  }

  /**
   * 상태 핸들러 추가
   */
  onTransaction(
    transactionType: string,
    handler: (state: T, payload: unknown) => Partial<T>
  ): PluginBuilder<T> {
    this.options.stateHandlers![transactionType] = handler;
    return this;
  }

  /**
   * 커맨드 추가
   */
  addCommand(
    name: string,
    commandFn: (
      ...args: any[]
    ) => (
      state: CalendarState,
      dispatch?: (transaction: Transaction) => void
    ) => boolean
  ): PluginBuilder<T> {
    this.options.commands![name] = commandFn as any;
    return this;
  }

  /**
   * 날짜 클릭 핸들러 설정
   */
  onDateClick(
    handler: (
      date: Date,
      event: MouseEvent,
      state: CalendarState,
      pluginState: T,
      calendar?: any
    ) => boolean
  ): PluginBuilder<T> {
    this.options.eventHandlers!.onDateClick = handler;
    return this;
  }

  /**
   * 시간 클릭 핸들러 설정
   */
  onTimeClick(
    handler: (
      datetime: Date,
      event: MouseEvent,
      state: CalendarState,
      pluginState: T,
      calendar?: any
    ) => boolean
  ): PluginBuilder<T> {
    this.options.eventHandlers!.onTimeClick = handler;
    return this;
  }

  /**
   * 키보드 이벤트 핸들러 설정
   */
  onKeyDown(
    handler: (
      event: KeyboardEvent,
      state: CalendarState,
      pluginState: T,
      calendar?: any
    ) => boolean
  ): PluginBuilder<T> {
    this.options.eventHandlers!.onKeyDown = handler;
    return this;
  }

  /**
   * 키업 이벤트 핸들러 설정
   */
  onKeyUp(
    handler: (
      event: KeyboardEvent,
      state: CalendarState,
      pluginState: T,
      calendar?: any
    ) => boolean
  ): PluginBuilder<T> {
    this.options.eventHandlers!.onKeyUp = handler;
    return this;
  }

  /**
   * 데코레이션 팩토리 설정 (제거됨)
   */
  withDecorations(_factory: any): PluginBuilder<T> {
    // Decoration system has been removed
    console.warn(
      'withDecorations is deprecated. The decoration system has been removed.'
    );
    return this;
  }

  /**
   * 트랜잭션 필터 설정
   */
  filterTransactions(
    filter: (transaction: Transaction, state: CalendarState) => boolean
  ): PluginBuilder<T> {
    this.options.transactionFilter = filter;
    return this;
  }

  /**
   * 트랜잭션 후처리 설정
   */
  postProcessTransactions(
    processor: (
      transactions: Transaction[],
      oldState: CalendarState,
      newState: CalendarState
    ) => Transaction | null
  ): PluginBuilder<T> {
    this.options.transactionPostProcessor = processor;
    return this;
  }

  /**
   * 플러그인 빌드
   */
  build(): Plugin<T> {
    if (!this.options.key) {
      throw new Error('Plugin key is required');
    }
    return createCustomPlugin(this.options);
  }
}

/**
 * 새 플러그인 빌더 생성
 */
export function createPluginBuilder<T = any>(): PluginBuilder<T> {
  return new PluginBuilder<T>();
}

/**
 * 일반적인 플러그인 패턴들을 위한 프리셋 빌더들
 */
export namespace PluginPresets {
  /**
   * 데이터 수집 플러그인 빌더
   */
  export function dataCollector<T extends Record<string, any>>(key: string) {
    return createPluginBuilder<{ items: T[]; settings: Record<string, any> }>()
      .withKey(key)
      .withInitialState({ items: [], settings: {} })
      .onTransaction('ADD_ITEM', (state, payload) => ({
        items: [...state.items, (payload as any).item],
      }))
      .onTransaction('REMOVE_ITEM', (state, payload) => ({
        items: state.items.filter(
          (_item, index) => index !== (payload as any).index
        ),
      }))
      .onTransaction('UPDATE_ITEM', (state, payload) => ({
        items: state.items.map((item, index) =>
          index === (payload as any).index
            ? { ...item, ...(payload as any).updates }
            : item
        ),
      }))
      .onTransaction('CLEAR_ITEMS', _state => ({
        items: [],
      }))
      .addCommand('addItem', (item: any) => (_state, dispatch) => {
        dispatch?.({
          type: 'ADD_ITEM',
          payload: { item },
          meta: new Map([['source', key]]),
        });
        return true;
      })
      .addCommand('removeItem', (index: any) => (_state, dispatch) => {
        dispatch?.({
          type: 'REMOVE_ITEM',
          payload: { index },
          meta: new Map([['source', key]]),
        });
        return true;
      })
      .addCommand(
        'updateItem',
        (index: any, updates: any) => (_state, dispatch) => {
          dispatch?.({
            type: 'UPDATE_ITEM',
            payload: { index, updates },
            meta: new Map([['source', key]]),
          });
          return true;
        }
      )
      .addCommand('clearItems', () => (_state, dispatch) => {
        dispatch?.({
          type: 'CLEAR_ITEMS',
          payload: {},
          meta: new Map([['source', key]]),
        });
        return true;
      });
  }

  /**
   * 날짜 기반 상태 관리 플러그인 빌더
   */
  export function dateBasedState<T>(key: string, _defaultValue: T) {
    return createPluginBuilder<{ dateStates: Map<string, T> }>()
      .withKey(key)
      .withInitialState({ dateStates: new Map() })
      .onTransaction('SET_DATE_STATE', (state, payload) => {
        const newMap = new Map(state.dateStates);
        newMap.set((payload as any).dateKey, (payload as any).value);
        return { dateStates: newMap };
      })
      .onTransaction('CLEAR_DATE_STATE', (state, payload) => {
        const newMap = new Map(state.dateStates);
        newMap.delete((payload as any).dateKey);
        return { dateStates: newMap };
      })
      .addCommand(
        'setDateState',
        (date: Date, value: T) => (_state, dispatch) => {
          const dateKey = date.toISOString().split('T')[0];
          dispatch?.({
            type: 'SET_DATE_STATE',
            payload: { dateKey, value },
            meta: new Map([['source', key]]),
          });
          return true;
        }
      )
      .addCommand('getDateState', (date: Date) => (_state, _dispatch) => {
        date.toISOString().split('T')[0];
        // 실제로는 query 시스템으로 구프해야 함
        return true;
      })
      .addCommand('clearDateState', (date: Date) => (_state, dispatch) => {
        const dateKey = date.toISOString().split('T')[0];
        dispatch?.({
          type: 'CLEAR_DATE_STATE',
          payload: { dateKey },
          meta: new Map([['source', key]]),
        });
        return true;
      });
  }

  /**
   * 이벤트 리스너 플러그인 빌더
   */
  export function eventListener(key: string) {
    return createPluginBuilder<{
      events: Array<{ type: string; date: Date; data: unknown }>;
    }>()
      .withKey(key)
      .withInitialState({ events: [] })
      .onTransaction('LOG_EVENT', (state, payload) => ({
        events: [
          ...state.events,
          {
            type: (payload as any).type,
            date: new Date(),
            data: (payload as any).data,
          },
        ],
      }))
      .onDateClick((date, _event, _state, _pluginState, calendar) => {
        // 클릭 이벤트 로깅
        calendar?.execCommand('logEvent', 'date_click', {
          date,
          timestamp: Date.now(),
        });
        return false; // 이벤트 전파 계속
      })
      .onKeyDown((event, _state, _pluginState, calendar) => {
        // 키 이벤트 로깅
        calendar?.execCommand('logEvent', 'key_down', {
          key: event.key,
          timestamp: Date.now(),
        });
        return false;
      })
      .addCommand(
        'logEvent',
        (type: string, data: unknown) => (_state, dispatch) => {
          dispatch?.({
            type: 'LOG_EVENT',
            payload: { type, data },
            meta: new Map([['source', key]]),
          });
          return true;
        }
      )
      .addCommand('getEvents', () => _state => {
        // 실제로는 query로 구현
        return true;
      });
  }

  /**
   * 상태 토글 플러그인 빌더
   */
  export function stateToggler(key: string, toggleKey: string = 'isEnabled') {
    return createPluginBuilder<Record<string, boolean>>()
      .withKey(key)
      .withInitialState({ [toggleKey]: false })
      .onTransaction('TOGGLE_STATE', (state, payload) => ({
        [(payload as any).key]: !state[(payload as any).key],
      }))
      .onTransaction('SET_STATE', (_state, payload) => ({
        [(payload as any).key]: (payload as any).value,
      }))
      .addCommand(
        'toggle',
        (stateKey: string = toggleKey) =>
          (_state, dispatch) => {
            dispatch?.({
              type: 'TOGGLE_STATE',
              payload: { key: stateKey },
              meta: new Map([['source', key]]),
            });
            return true;
          }
      )
      .addCommand(
        'setState',
        (stateKey: string, value: boolean) => (_state, dispatch) => {
          dispatch?.({
            type: 'SET_STATE',
            payload: { key: stateKey, value },
            meta: new Map([['source', key]]),
          });
          return true;
        }
      )
      .addCommand('enable', () => (_state, dispatch) => {
        dispatch?.({
          type: 'SET_STATE',
          payload: { key: toggleKey, value: true },
          meta: new Map([['source', key]]),
        });
        return true;
      })
      .addCommand('disable', () => (_state, dispatch) => {
        dispatch?.({
          type: 'SET_STATE',
          payload: { key: toggleKey, value: false },
          meta: new Map([['source', key]]),
        });
        return true;
      });
  }
}

/**
 * 자주 사용되는 데코레이션 빌더 (제거됨)
 */
export namespace DecorationBuilders {
  export function highlightDates(
    _dates: Date[],
    _className: string = 'highlighted'
  ) {
    console.warn(
      'DecorationBuilders.highlightDates is deprecated. The decoration system has been removed.'
    );
    return () => [];
  }

  export function badgeDates(
    _dateValueMap: Map<Date, string>,
    _className: string = 'badge'
  ) {
    console.warn(
      'DecorationBuilders.badgeDates is deprecated. The decoration system has been removed.'
    );
    return () => [];
  }

  export function conditionalHighlight(
    _condition: (
      date: Date,
      state: CalendarState,
      pluginState: Record<string, unknown>
    ) => boolean,
    _className: string = 'conditional-highlight'
  ) {
    console.warn(
      'DecorationBuilders.conditionalHighlight is deprecated. The decoration system has been removed.'
    );
    return () => [];
  }
}

/**
 * 자주 사용되는 이벤트 핸들러 빌더
 */
export namespace EventHandlerBuilders {
  export function preventClickOnCondition(
    condition: (date: Date, state: CalendarState, pluginState: any) => boolean
  ) {
    return (
      date: Date,
      event: MouseEvent,
      state: CalendarState,
      pluginState: any
    ) => {
      if (condition(date, state, pluginState)) {
        event.preventDefault();
        return true; // 이벤트 소비
      }
      return false;
    };
  }

  export function logClicks(logFn: (date: Date, timestamp: number) => void) {
    return (
      date: Date,
      _event: MouseEvent,
      _state: CalendarState,
      _pluginState: any
    ) => {
      logFn(date, Date.now());
      return false; // 이벤트 전파 계속
    };
  }

  export function keyboardShortcuts(shortcuts: Record<string, () => void>) {
    return (event: KeyboardEvent, _state: CalendarState, _pluginState: any) => {
      const key = event.key.toLowerCase();
      const handler = shortcuts[key];

      if (handler) {
        event.preventDefault();
        handler();
        return true; // 이벤트 소비
      }

      return false;
    };
  }
}
