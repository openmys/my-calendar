/**
 * 핵심 타입 정의
 * ProseMirror 스타일 헤드리스 캘린더 라이브러리의 기본 타입들
 */

// 기본 날짜 관련 타입
export interface TimeRange {
  start: Date;
  end: Date;
}

export interface CalendarDay {
  date: Date;
  hours?: CalendarHour[];
  isToday: boolean;
  isWeekend: boolean;
  isHoliday?: boolean;
  metadata?: Map<string, any>;
}

export interface CalendarHour {
  hour: number;
  minute: number;
  slots?: TimeSlot[];
}

export interface TimeSlot {
  start: Date;
  end: Date;
  available: boolean;
  metadata?: Map<string, any>;
}

// 뷰 타입
export type ViewType = 'month' | 'week' | 'day' | 'timeline' | 'gantt' | 'list';

// 주 시작일 (0: 일요일, 1: 월요일, ...)
export type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;

// 리소스 관리 (회의실, 직원 등)
export interface Resource {
  id: string;
  name: string;
  type: string;
  metadata?: Map<string, any>;
}

// 필터링 상태
export interface FilterState {
  activeFilters: Map<string, any>;
  hiddenCategories: Set<string>;
}

// 가상화를 위한 뷰포트 상태
export interface ViewportState {
  scrollTop: number;
  scrollLeft: number;
  visibleStartIndex: number;
  visibleEndIndex: number;
  itemHeight: number;
  containerHeight: number;
}

// 전역 캘린더 상태
export interface CalendarState {
  currentDate: Date;
  viewType: ViewType;
  timeRange: TimeRange;
  days: CalendarDay[];
  pluginStates: Map<string, PluginState>;
  timezone: string;
  resources?: Resource[];
  filters?: FilterState;
  viewportState?: ViewportState;
}

// 트랜잭션 타입
// 기본 Transaction 인터페이스
export interface Transaction<T = any> {
  type: string;
  payload: T;
  meta: Map<string, unknown>;
}

// 구체적인 트랜잭션 타입들
export interface DateTransaction extends Transaction<{ date: Date }> {
  type: 'SELECT_DATE';
}

export interface ViewTransaction extends Transaction<{ viewType: string }> {
  type: 'CHANGE_VIEW';
}

export interface RangeTransaction extends Transaction<{ start: Date; end: Date }> {
  type: 'SELECT_RANGE';
}

// 트랜잭션 유니온 타입
export type KnownTransaction = DateTransaction | ViewTransaction | RangeTransaction;

// 플러그인 상태 추상 클래스
export abstract class PluginState<T = any> {
  constructor(public value: T) {}

  abstract apply(transaction: Transaction): PluginState<T>;
  abstract toJSON(): any;
  static fromJSON(_value: any): PluginState<any> {
    throw new Error('PluginState.fromJSON must be implemented by subclass');
  }
}

// 커맨드 타입
export type Command = (
  state: CalendarState,
  dispatch?: (transaction: Transaction) => void
) => boolean;

// CommandMap: 문자열 키로 접근하는 경우가 많아 any[] 사용이 필요
export interface CommandMap {
  [commandName: string]: (...args: any[]) => Command;
}

// 일반적인 유틸리티 타입들
export type UnknownRecord = Record<string, any>;
export type AnyFunction = (...args: any[]) => any;
export type EventHandler<T = Event> = (event: T) => boolean | void;

// 데코레이션 시스템
export type DecorationType = 'highlight' | 'overlay' | 'widget' | 'badge' | 'tooltip' | 'disable' | 'custom-decoration';

export interface DecorationSpec {
  class?: string;
  style?: string;
  attributes?: Record<string, string>;
  widget?: () => HTMLElement;
}

export interface Decoration {
  type: DecorationType;
  from: Date;
  to?: Date;
  spec: DecorationSpec;
}

// 이벤트 처리 타입
export interface DragData {
  startDate: Date;
  endDate: Date;
  originalEvent: DragEvent;
  element: HTMLElement;
}

export interface ResizeData {
  date: Date;
  direction: 'start' | 'end';
  originalEvent: MouseEvent;
  element: HTMLElement;
}

// 플러그인 간 메시지 시스템
export interface PluginMessage {
  from: string;
  to: string;
  type: string;
  payload: any;
}

// 에러 타입
export abstract class CalendarError extends Error {
  constructor(
    message: string,
    public code: string,
    public context?: any
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ValidationError extends CalendarError {
  constructor(message: string, public field: string, public value: any) {
    super(message, 'VALIDATION_ERROR', { field, value });
  }
}

export class TransactionError extends CalendarError {
  constructor(message: string, context: any) {
    super(message, 'TRANSACTION_ERROR', context);
  }
}

export class PluginError extends CalendarError {
  constructor(message: string, public pluginId?: string) {
    super(message, 'PLUGIN_ERROR', { pluginId });
  }
}

export class SecurityError extends CalendarError {
  constructor(message: string) {
    super(message, 'SECURITY_ERROR');
  }
}