/**
 * TanStack Table 스타일의 캘린더 타입 정의
 */

// 기본 타입
export type Updater<T> = T | ((old: T) => T);
export type OnChangeFn<T> = (updaterOrValue: Updater<T>) => void;

// 날짜 관련 기본 타입
export interface DayData {
  date: Date;
  isToday: boolean;
  isWeekend: boolean;
  isCurrentMonth: boolean;
  isHoliday?: boolean;
  metadata?: Record<string, unknown>;
}

export interface WeekData {
  weekNumber: number;
  startDate: Date;
  endDate: Date;
  days: DayData[];
}

export interface MonthData {
  year: number;
  month: number;
  startDate: Date;
  endDate: Date;
  weeks: WeekData[];
}

// Feature 인터페이스
export interface CalendarFeature<TData = any> {
  createDay?: (
    day: Day<TData>,
    week: Week<TData>,
    month: Month<TData>,
    calendar: Calendar<TData>
  ) => void;
  createWeek?: (
    week: Week<TData>,
    month: Month<TData>,
    calendar: Calendar<TData>
  ) => void;
  createMonth?: (month: Month<TData>, calendar: Calendar<TData>) => void;
  createCalendar?: (calendar: Calendar<TData>) => void;
  getDefaultOptions?: (
    calendar: Calendar<TData>
  ) => Partial<CalendarOptionsResolved<TData>>;
  getInitialState?: (
    initialState?: InitialCalendarState
  ) => Partial<CalendarState>;
}

// 메타 데이터
export interface CalendarMeta {}
export interface DayMeta {}
export interface EventMeta {}

// Core 인터페이스
export interface CoreCalendarState {
  currentDate: Date;
  viewType: 'month' | 'week' | 'day' | 'year';
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  locale: string;
  timezone: string;
}

export interface CoreOptions<TData = any> {
  /**
   * 추가 features 배열
   */
  features?: CalendarFeature<TData>[];

  /**
   * 현재 날짜 (초기값)
   */
  currentDate?: Date;

  /**
   * 뷰 타입
   */
  viewType?: 'month' | 'week' | 'day' | 'year';

  /**
   * 주의 시작 요일 (0: 일요일, 1: 월요일)
   */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;

  /**
   * 로케일 설정
   */
  locale?: string;

  /**
   * 타임존
   */
  timezone?: string;

  /**
   * 디버그 모드
   */
  debugAll?: boolean;

  /**
   * 디버그 셀 (날짜)
   */
  debugCells?: boolean;

  /**
   * 디버그 주
   */
  debugWeeks?: boolean;

  /**
   * 디버그 월
   */
  debugMonths?: boolean;

  /**
   * 디버그 캘린더
   */
  debugCalendar?: boolean;

  /**
   * 상태 변경 콜백
   */
  onStateChange: OnChangeFn<CalendarState>;

  /**
   * 메타 데이터
   */
  meta?: CalendarMeta;

  /**
   * 상태
   */
  state: Partial<CalendarState>;

  /**
   * 캘린더 데이터 (이벤트 등)
   */
  data?: TData[];

  /**
   * 옵션 병합 함수
   */
  mergeOptions?: (
    defaultOptions: CalendarOptions<TData>,
    options: Partial<CalendarOptions<TData>>
  ) => CalendarOptions<TData>;
}

// Instance 인터페이스
export interface CoreInstance<TData = any> {
  features: readonly CalendarFeature<TData>[];
  initialState: CalendarState;
  options: RequiredKeys<CalendarOptionsResolved<TData>, 'state'>;
  reset: () => void;
  setState: (updater: Updater<CalendarState>) => void;
  getState: () => CalendarState;
  setOptions: (newOptions: Updater<CalendarOptionsResolved<TData>>) => void;
  _getCoreMonth?: () => Month<TData>;
  _getCoreWeeks?: () => Week<TData>[];
  _getCoreDays?: () => Day<TData>[];
  getMonth: () => Month<TData>;
  getWeeks: () => Week<TData>[];
  getDays: () => Day<TData>[];
}

// Feature Options 통합 인터페이스 (TanStack Table의 FeatureOptions와 동일한 패턴)
export interface FeatureOptions<_TData = any> {
  // Features will extend this interface through module augmentation
}

// 통합 타입들
export interface Calendar<TData = any> extends CoreInstance<TData> {
  // Features will extend this interface
}

export interface CalendarState extends CoreCalendarState {
  // Features will extend this state
}

export interface CalendarOptionsResolved<TData = any>
  extends CoreOptions<TData>,
    FeatureOptions<TData> {
  // Resolved options with defaults
  currentDate: Date;
  viewType: 'month' | 'week' | 'day' | 'year';
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  locale: string;
  timezone: string;
  debugAll: boolean;
  debugCells: boolean;
  debugWeeks: boolean;
  debugMonths: boolean;
  debugCalendar: boolean;
  onStateChange: OnChangeFn<CalendarState>;
  state: Partial<CalendarState>;
  data: TData[];
}

export interface CalendarOptions<TData = any>
  extends PartialKeys<
    CalendarOptionsResolved<TData>,
    | 'state'
    | 'onStateChange'
    | 'debugAll'
    | 'debugCells'
    | 'debugWeeks'
    | 'debugMonths'
    | 'debugCalendar'
    | 'weekStartsOn'
    | 'locale'
    | 'timezone'
    | 'data'
    | 'currentDate'
    | 'viewType'
  > {}

export interface InitialCalendarState extends Partial<CoreCalendarState> {
  // Initial state from features
}

// Day, Week, Month 인터페이스
export interface Day<TData = any> {
  id: string;
  data: DayData;
  calendar: Calendar<TData>;
  getValue: () => Date;
  getIsToday: () => boolean;
  getIsWeekend: () => boolean;
  getIsCurrentMonth: () => boolean;
}

export interface Week<TData = any> {
  id: string;
  data: WeekData;
  calendar: Calendar<TData>;
  getDays: () => Day<TData>[];
  getWeekNumber: () => number;
}

export interface Month<TData = any> {
  id: string;
  data: MonthData;
  calendar: Calendar<TData>;
  getWeeks: () => Week<TData>[];
  getYear: () => number;
  getMonth: () => number;
}

// 유틸리티 타입
export type PartialKeys<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;
export type RequiredKeys<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>;
