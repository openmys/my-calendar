/**
 * @openmys/my-calendar
 * ProseMirror 스타일 헤드리스 캘린더 라이브러리
 *
 * 이 라이브러리는 플러그인 시스템을 통해 확장 가능한 캘린더 기능을 제공합니다.
 */

// 핵심 타입 exports
export * from './types';

// 핵심 시스템 exports
export { CalendarView } from './core/calendar-view';
export type { CalendarViewOptions } from './core/calendar-view';

export { Plugin, PluginManager, PluginFactory } from './core/plugin';
export type { PluginSpec } from './core/plugin';

export {
  CommandManager,
  CommandComposer,
  CommandHistory,
} from './core/command';
export { coreCommands } from './core/command';

export {
  DecorationSet,
  DecorationFactory,
  DecorationManager,
} from './core/decoration';

export { CalendarStateFactory, StateUpdater, StateQuery } from './core/state';

export {
  BasePluginState,
  StateUpdater as PluginStateUpdater,
  StateSerializer,
  StateValidator,
  ImmutableStateManager,
} from './core/plugin-state';

export {
  TransactionBuilder,
  transactions,
  TransactionValidator,
  TransactionHistory,
} from './core/transaction';

// 내장 플러그인 exports
export { createRangePlugin } from './plugins/range-plugin';
export type { RangeOptions, RangeState } from './plugins/range-plugin';

export { createEventPlugin } from './plugins/event-plugin';
export type {
  CalendarEvent,
  EventOptions,
  EventState,
  RecurrenceRule,
} from './plugins/event-plugin';

// 고급 플러그인 exports
export { createAccessibilityPlugin } from './plugins/accessibility-plugin';
export type {
  AccessibilityOptions,
  AccessibilityState,
  AccessibilityReport,
  AccessibilityIssue,
} from './plugins/accessibility-plugin';
export { AccessibilityValidator } from './plugins/accessibility-plugin';

export { createSecurityPlugin } from './plugins/security-plugin';
export type {
  SecurityOptions,
  SecurityState,
  SecurityViolation,
} from './plugins/security-plugin';
export {
  HTMLSanitizer,
  SecurityError,
  ValidationError,
  XSSError,
  SecurityUtils,
} from './plugins/security-plugin';

export { createI18nPlugin } from './plugins/i18n-plugin';
export type {
  I18nOptions,
  I18nState,
  LocalizedMessages,
  CalendarSystem,
  CalendarDate,
} from './plugins/i18n-plugin';
export {
  DateTimeFormatter,
  GregorianCalendar,
  I18nUtils,
} from './plugins/i18n-plugin';

// 유틸리티 함수들
export { createCalendar } from './utils/calendar-factory';

// 플러그인 개발 도구들
export {
  createCustomPlugin,
  PluginTemplates,
  PluginHelpers,
} from './utils/plugin-factory';
export type {
  PluginFactoryOptions,
  BaseCustomPluginState,
} from './utils/plugin-factory';

export {
  PluginBuilder,
  createPluginBuilder,
  PluginPresets,
  DecorationBuilders,
  EventHandlerBuilders,
} from './utils/plugin-builder';

// 버전 정보
export const VERSION = '1.0.0';
