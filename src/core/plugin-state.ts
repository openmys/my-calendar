/**
 * PluginState 구현
 * 플러그인의 상태 관리를 위한 추상 클래스와 구체적 구현들
 */

import { PluginState, Transaction, CalendarState } from '@/types';

/**
 * 기본 PluginState 구현
 * 간단한 상태를 가진 플러그인을 위한 기본 구현
 */
export class BasePluginState<T = any> extends PluginState<T> {
  constructor(value: T) {
    super(value);
  }

  apply(_transaction: Transaction): BasePluginState<T> {
    // 기본 구현은 상태를 변경하지 않음
    return new BasePluginState(this.value);
  }

  toJSON(): T {
    return this.value;
  }

  static fromJSON<T>(value: T): BasePluginState<T> {
    return new BasePluginState(value);
  }
}

/**
 * 상태 변경을 위한 헬퍼 클래스
 */
export class StateUpdater<T> {
  constructor(private currentValue: T) {}

  /**
   * 얕은 복사로 객체 업데이트
   */
  shallowUpdate(updates: Partial<T>): T {
    return { ...this.currentValue, ...updates };
  }

  /**
   * 깊은 복사로 객체 업데이트 (간단한 구현)
   */
  deepUpdate(updates: Partial<T>): T {
    return this.deepMerge(this.currentValue, updates);
  }

  /**
   * 배열 요소 추가
   */
  addToArray<K extends keyof T>(key: K, item: T[K] extends Array<infer U> ? U : never): T {
    if (!Array.isArray(this.currentValue[key])) {
      throw new Error(`Field ${String(key)} is not an array`);
    }

    return {
      ...this.currentValue,
      [key]: [...(this.currentValue[key] as any), item]
    };
  }

  /**
   * 배열 요소 제거
   */
  removeFromArray<K extends keyof T>(key: K, predicate: (item: any) => boolean): T {
    if (!Array.isArray(this.currentValue[key])) {
      throw new Error(`Field ${String(key)} is not an array`);
    }

    return {
      ...this.currentValue,
      [key]: (this.currentValue[key] as any).filter((item: any) => !predicate(item))
    };
  }

  /**
   * Map 업데이트
   */
  updateMap<K extends keyof T>(key: K, mapKey: string, value: any): T {
    if (!(this.currentValue[key] instanceof Map)) {
      throw new Error(`Field ${String(key)} is not a Map`);
    }

    const newMap = new Map(this.currentValue[key] as Map<string, any>);
    newMap.set(mapKey, value);

    return {
      ...this.currentValue,
      [key]: newMap
    };
  }

  /**
   * Map에서 키 제거
   */
  deleteFromMap<K extends keyof T>(key: K, mapKey: string): T {
    if (!(this.currentValue[key] instanceof Map)) {
      throw new Error(`Field ${String(key)} is not a Map`);
    }

    const newMap = new Map(this.currentValue[key] as Map<string, any>);
    newMap.delete(mapKey);

    return {
      ...this.currentValue,
      [key]: newMap
    };
  }

  private deepMerge(target: any, source: any): any {
    if (source === null || typeof source !== 'object') {
      return source;
    }

    if (target === null || typeof target !== 'object') {
      return source;
    }

    const result = { ...target };

    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
          result[key] = this.deepMerge(target[key], source[key]);
        } else {
          result[key] = source[key];
        }
      }
    }

    return result;
  }
}

/**
 * 상태 직렬화/역직렬화를 위한 유틸리티
 */
export class StateSerializer {
  /**
   * PluginState를 JSON으로 직렬화
   */
  static serialize(state: PluginState): any {
    return {
      className: state.constructor.name,
      value: state.toJSON()
    };
  }

  /**
   * JSON에서 PluginState로 역직렬화
   */
  static deserialize(data: any, stateClasses: Map<string, typeof PluginState>): PluginState {
    const StateClass = stateClasses.get(data.className);
    if (!StateClass) {
      throw new Error(`Unknown PluginState class: ${data.className}`);
    }

    return StateClass.fromJSON(data.value);
  }

  /**
   * 전체 CalendarState 직렬화
   */
  static serializeCalendarState(state: CalendarState, _stateClasses: Map<string, typeof PluginState>): any {
    const serializedPluginStates: Record<string, any> = {};

    for (const [pluginId, pluginState] of state.pluginStates) {
      serializedPluginStates[pluginId] = this.serialize(pluginState);
    }

    return {
      currentDate: state.currentDate.toISOString(),
      viewType: state.viewType,
      timeRange: {
        start: state.timeRange.start.toISOString(),
        end: state.timeRange.end.toISOString()
      },
      timezone: state.timezone,
      pluginStates: serializedPluginStates,
      // 다른 필드들은 필요에 따라 추가
    };
  }

  /**
   * JSON에서 CalendarState로 역직렬화
   */
  static deserializeCalendarState(data: any, stateClasses: Map<string, typeof PluginState>): Partial<CalendarState> {
    const pluginStates = new Map<string, PluginState>();

    for (const [pluginId, serializedState] of Object.entries(data.pluginStates)) {
      pluginStates.set(pluginId, this.deserialize(serializedState, stateClasses));
    }

    return {
      currentDate: new Date(data.currentDate),
      viewType: data.viewType,
      timeRange: {
        start: new Date(data.timeRange.start),
        end: new Date(data.timeRange.end)
      },
      timezone: data.timezone,
      pluginStates
    };
  }
}

/**
 * 상태 검증을 위한 유틸리티
 */
export class StateValidator {
  /**
   * PluginState 유효성 검증
   */
  static validatePluginState(state: PluginState): boolean {
    if (!state || typeof state !== 'object') {
      throw new Error('PluginState must be an object');
    }

    if (!('value' in state)) {
      throw new Error('PluginState must have a value property');
    }

    if (typeof state.apply !== 'function') {
      throw new Error('PluginState must implement apply method');
    }

    if (typeof state.toJSON !== 'function') {
      throw new Error('PluginState must implement toJSON method');
    }

    return true;
  }

  /**
   * CalendarState 유효성 검증
   */
  static validateCalendarState(state: CalendarState): boolean {
    if (!state || typeof state !== 'object') {
      throw new Error('CalendarState must be an object');
    }

    // 필수 필드 검증
    const requiredFields = ['currentDate', 'viewType', 'timeRange', 'days', 'pluginStates', 'timezone'];
    
    for (const field of requiredFields) {
      if (!(field in state)) {
        throw new Error(`CalendarState missing required field: ${field}`);
      }
    }

    // 타입별 검증
    if (!(state.currentDate instanceof Date)) {
      throw new Error('CalendarState.currentDate must be a Date');
    }

    if (!(state.pluginStates instanceof Map)) {
      throw new Error('CalendarState.pluginStates must be a Map');
    }

    if (!Array.isArray(state.days)) {
      throw new Error('CalendarState.days must be an array');
    }

    // 플러그인 상태들 검증
    for (const [pluginId, pluginState] of state.pluginStates) {
      try {
        this.validatePluginState(pluginState);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Invalid plugin state for ${pluginId}: ${message}`);
      }
    }

    return true;
  }
}

/**
 * 불변성을 보장하는 상태 관리자
 */
export class ImmutableStateManager {
  /**
   * 상태 업데이트 시 불변성 검증
   */
  static ensureImmutability<T>(originalState: T, newState: T): boolean {
    // 참조가 다른지 확인 (새로운 객체인지)
    if (originalState === newState) {
      console.warn('State update did not create a new object - immutability may be violated');
      return false;
    }

    return true;
  }

  /**
   * 깊은 동결 (개발 환경에서만 사용)
   */
  static deepFreeze<T>(obj: T): T {
    if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
      Object.freeze(obj);

      Object.getOwnPropertyNames(obj).forEach(property => {
        const value = (obj as any)[property];
        if (value && typeof value === 'object') {
          this.deepFreeze(value);
        }
      });
    }

    return obj;
  }
}