/**
 * Internationalization (i18n) Plugin
 * 국제화 지원을 위한 플러그인 (다국어, RTL, 시간대, 지역별 달력)
 */

import { Plugin, PluginSpec } from '@/core/plugin';
import { PluginState, Transaction } from '@/types';
import { DecorationSet, DecorationFactory } from '@/core/decoration';
import { transactions } from '@/core/transaction';

export interface I18nOptions {
  locale?: string;
  timeZone?: string;
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday, 1 = Monday, etc.
  dateFormat?: string;
  timeFormat?: '12h' | '24h';
  rtl?: boolean;
  calendarSystem?: 'gregorian' | 'hijri' | 'hebrew' | 'persian' | 'buddhist';
  numberSystem?: 'latn' | 'arab' | 'hans' | 'hant' | 'thai';
}

export interface LocalizedMessages {
  // 일반 UI 메시지
  today: string;
  nextMonth: string;
  previousMonth: string;
  nextYear: string;
  previousYear: string;
  selectDate: string;
  goToToday: string;
  
  // 날짜/시간 관련
  weekdays: string[];
  weekdaysShort: string[];
  weekdaysMin: string[];
  months: string[];
  monthsShort: string[];
  
  // 접근성 메시지
  dateSelected: (date: Date) => string;
  monthChanged: (month: string) => string;
  yearChanged: (year: number) => string;
  
  // 이벤트 관련
  event: string;
  events: string;
  noEvents: string;
  addEvent: string;
  editEvent: string;
  deleteEvent: string;
  
  // 시간 관련
  am: string;
  pm: string;
  hour: string;
  minute: string;
  allDay: string;
  
  // 에러 메시지
  invalidDate: string;
  invalidRange: string;
  eventConflict: string;
}

export interface I18nState {
  locale: string;
  timeZone: string;
  rtl: boolean;
  firstDayOfWeek: number;
  dateFormat: Intl.DateTimeFormatOptions;
  timeFormat: '12h' | '24h';
  calendarSystem: string;
  numberSystem: string;
  messages: LocalizedMessages;
  formatters: Map<string, Intl.DateTimeFormat>;
  options: I18nOptions;
}

/**
 * I18n Plugin State 클래스
 */
class I18nPluginState extends PluginState<I18nState> {
  apply(transaction: Transaction): I18nPluginState {
    const newValue = { ...this.value };

    switch (transaction.type) {
      case 'I18N_CHANGE_LOCALE':
        const newLocale = transaction.payload.locale;
        newValue.locale = newLocale;
        newValue.rtl = this.isRTLLocale(newLocale);
        newValue.messages = this.loadMessages(newLocale);
        newValue.formatters.clear(); // 캐시 무효화
        break;

      case 'I18N_CHANGE_TIMEZONE':
        newValue.timeZone = transaction.payload.timeZone;
        newValue.formatters.clear(); // 캐시 무효화
        break;

      case 'I18N_SET_FIRST_DAY_OF_WEEK':
        newValue.firstDayOfWeek = transaction.payload.day;
        break;

      case 'I18N_SET_DATE_FORMAT':
        newValue.dateFormat = transaction.payload.format;
        newValue.formatters.clear(); // 캐시 무효화
        break;

      case 'I18N_SET_TIME_FORMAT':
        newValue.timeFormat = transaction.payload.format;
        newValue.formatters.clear(); // 캐시 무효화
        break;

      case 'I18N_SET_CALENDAR_SYSTEM':
        newValue.calendarSystem = transaction.payload.system;
        newValue.formatters.clear(); // 캐시 무효화
        break;

      case 'I18N_SET_NUMBER_SYSTEM':
        newValue.numberSystem = transaction.payload.system;
        newValue.formatters.clear(); // 캐시 무효화
        break;

      case 'I18N_SET_OPTIONS':
        Object.assign(newValue.options, transaction.payload.options);
        break;
    }

    return new I18nPluginState(newValue);
  }

  toJSON(): I18nState {
    return {
      ...this.value,
      formatters: {} as any // 함수는 직렬화하지 않음
    };
  }

  static fromJSON(value: any): I18nPluginState {
    const state = { ...value };
    state.formatters = new Map();
    return new I18nPluginState(state);
  }

  private isRTLLocale(locale: string): boolean {
    const rtlLocales = [
      'ar', 'he', 'fa', 'ur', 'ps', 'sd', 'yi', 'arc', 'az', 'dv', 'ku', 'ckb'
    ];
    const lang = locale.split('-')[0];
    return rtlLocales.includes(lang);
  }

  private loadMessages(locale: string): LocalizedMessages {
    // 실제 구현에서는 외부 파일에서 로드
    return this.getDefaultMessages(locale);
  }

  private getDefaultMessages(locale: string): LocalizedMessages {
    const lang = locale.split('-')[0];
    
    switch (lang) {
      case 'ko':
        return {
          today: '오늘',
          nextMonth: '다음 달',
          previousMonth: '이전 달',
          nextYear: '다음 해',
          previousYear: '이전 해',
          selectDate: '날짜 선택',
          goToToday: '오늘로 이동',
          
          weekdays: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
          weekdaysShort: ['일', '월', '화', '수', '목', '금', '토'],
          weekdaysMin: ['일', '월', '화', '수', '목', '금', '토'],
          months: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
          monthsShort: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
          
          dateSelected: (date) => `${date.toLocaleDateString('ko-KR')}이 선택되었습니다`,
          monthChanged: (month) => `${month}로 이동했습니다`,
          yearChanged: (year) => `${year}년으로 이동했습니다`,
          
          event: '일정',
          events: '일정들',
          noEvents: '일정 없음',
          addEvent: '일정 추가',
          editEvent: '일정 편집',
          deleteEvent: '일정 삭제',
          
          am: '오전',
          pm: '오후',
          hour: '시',
          minute: '분',
          allDay: '종일',
          
          invalidDate: '잘못된 날짜입니다',
          invalidRange: '잘못된 범위입니다',
          eventConflict: '일정이 겹칩니다'
        };
        
      case 'ja':
        return {
          today: '今日',
          nextMonth: '来月',
          previousMonth: '先月',
          nextYear: '来年',
          previousYear: '昨年',
          selectDate: '日付を選択',
          goToToday: '今日に移動',
          
          weekdays: ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
          weekdaysShort: ['日', '月', '火', '水', '木', '金', '土'],
          weekdaysMin: ['日', '月', '火', '水', '木', '金', '土'],
          months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
          monthsShort: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
          
          dateSelected: (date) => `${date.toLocaleDateString('ja-JP')}が選択されました`,
          monthChanged: (month) => `${month}に移動しました`,
          yearChanged: (year) => `${year}年に移動しました`,
          
          event: 'イベント',
          events: 'イベント',
          noEvents: 'イベントなし',
          addEvent: 'イベント追加',
          editEvent: 'イベント編集',
          deleteEvent: 'イベント削除',
          
          am: '午前',
          pm: '午後',
          hour: '時',
          minute: '分',
          allDay: '終日',
          
          invalidDate: '無効な日付です',
          invalidRange: '無効な範囲です',
          eventConflict: 'イベントが重複しています'
        };
        
      case 'ar':
        return {
          today: 'اليوم',
          nextMonth: 'الشهر التالي',
          previousMonth: 'الشهر السابق',
          nextYear: 'السنة التالية',
          previousYear: 'السنة السابقة',
          selectDate: 'اختر التاريخ',
          goToToday: 'اذهب إلى اليوم',
          
          weekdays: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
          weekdaysShort: ['أح', 'إث', 'ثل', 'أر', 'خم', 'جم', 'سب'],
          weekdaysMin: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'],
          months: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
          monthsShort: ['ينا', 'فبر', 'مار', 'أبر', 'ماي', 'يون', 'يول', 'أغس', 'سبت', 'أكت', 'نوف', 'ديس'],
          
          dateSelected: (date) => `تم اختيار ${date.toLocaleDateString('ar')}`,
          monthChanged: (month) => `تم الانتقال إلى ${month}`,
          yearChanged: (year) => `تم الانتقال إلى ${year}`,
          
          event: 'حدث',
          events: 'أحداث',
          noEvents: 'لا توجد أحداث',
          addEvent: 'إضافة حدث',
          editEvent: 'تعديل حدث',
          deleteEvent: 'حذف حدث',
          
          am: 'ص',
          pm: 'م',
          hour: 'ساعة',
          minute: 'دقيقة',
          allDay: 'طوال اليوم',
          
          invalidDate: 'تاريخ غير صحيح',
          invalidRange: 'نطاق غير صحيح',
          eventConflict: 'تعارض في الأحداث'
        };
        
      default: // English
        return {
          today: 'Today',
          nextMonth: 'Next Month',
          previousMonth: 'Previous Month',
          nextYear: 'Next Year',
          previousYear: 'Previous Year',
          selectDate: 'Select Date',
          goToToday: 'Go to Today',
          
          weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
          weekdaysMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
          months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
          monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          
          dateSelected: (date) => `Selected ${date.toLocaleDateString('en-US')}`,
          monthChanged: (month) => `Moved to ${month}`,
          yearChanged: (year) => `Moved to ${year}`,
          
          event: 'Event',
          events: 'Events',
          noEvents: 'No Events',
          addEvent: 'Add Event',
          editEvent: 'Edit Event',
          deleteEvent: 'Delete Event',
          
          am: 'AM',
          pm: 'PM',
          hour: 'Hour',
          minute: 'Minute',
          allDay: 'All Day',
          
          invalidDate: 'Invalid Date',
          invalidRange: 'Invalid Range',
          eventConflict: 'Event Conflict'
        };
    }
  }
}

/**
 * Date/Time Formatter 유틸리티
 */
export class DateTimeFormatter {
  private formatters: Map<string, Intl.DateTimeFormat> = new Map();
  private locale: string;
  private timeZone: string;

  constructor(locale: string, timeZone: string) {
    this.locale = locale;
    this.timeZone = timeZone;
  }

  format(date: Date, options?: Intl.DateTimeFormatOptions): string {
    const key = `${this.locale}-${this.timeZone}-${JSON.stringify(options)}`;
    
    if (!this.formatters.has(key)) {
      this.formatters.set(key, new Intl.DateTimeFormat(this.locale, {
        timeZone: this.timeZone,
        ...options
      }));
    }
    
    return this.formatters.get(key)!.format(date);
  }

  formatRange(startDate: Date, endDate: Date, options?: Intl.DateTimeFormatOptions): string {
    const key = `${this.locale}-${this.timeZone}-range-${JSON.stringify(options)}`;
    
    if (!this.formatters.has(key)) {
      this.formatters.set(key, new Intl.DateTimeFormat(this.locale, {
        timeZone: this.timeZone,
        ...options
      }));
    }
    
    const formatter = this.formatters.get(key)!;
    return (formatter as any).formatRange?.(startDate, endDate) || 
           `${formatter.format(startDate)} - ${formatter.format(endDate)}`;
  }

  getWeekdays(format: 'long' | 'short' | 'narrow' = 'short', firstDay: number = 0): string[] {
    const date = new Date(2023, 0, 1); // 2023년 1월 1일 (일요일)
    const days: string[] = [];
    
    for (let i = 0; i < 7; i++) {
      const dayIndex = (firstDay + i) % 7;
      date.setDate(1 + dayIndex);
      days.push(this.format(date, { weekday: format }));
    }
    
    return days;
  }

  getMonths(format: 'long' | 'short' | 'narrow' = 'long'): string[] {
    const months: string[] = [];
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(2023, i, 1);
      months.push(this.format(date, { month: format }));
    }
    
    return months;
  }
}

/**
 * I18n Plugin 생성 함수
 */
export function createI18nPlugin(options: I18nOptions = {}): Plugin<I18nState> {
  // 기본 로케일 감지
  const defaultLocale = typeof navigator !== 'undefined' 
    ? navigator.language || 'en-US'
    : 'en-US';
    
  const defaultTimeZone = typeof Intl !== 'undefined'
    ? Intl.DateTimeFormat().resolvedOptions().timeZone
    : 'UTC';

  const defaultOptions: Required<I18nOptions> = {
    locale: defaultLocale,
    timeZone: defaultTimeZone,
    firstDayOfWeek: 0,
    dateFormat: 'short',
    timeFormat: '24h',
    rtl: false,
    calendarSystem: 'gregorian',
    numberSystem: 'latn'
  };

  const finalOptions = { ...defaultOptions, ...options };

  const spec: PluginSpec<I18nState> = {
    key: 'i18n',
    priority: 100, // 다른 플러그인보다 먼저 처리되어야 함

    state: {
      init: () => {
        const initialState = new I18nPluginState({
          locale: finalOptions.locale,
          timeZone: finalOptions.timeZone,
          rtl: finalOptions.rtl,
          firstDayOfWeek: finalOptions.firstDayOfWeek,
          dateFormat: { dateStyle: finalOptions.dateFormat as any },
          timeFormat: finalOptions.timeFormat,
          calendarSystem: finalOptions.calendarSystem,
          numberSystem: finalOptions.numberSystem,
          messages: {} as LocalizedMessages, // loadMessages에서 채워짐
          formatters: new Map(),
          options: finalOptions
        });
        
        // 메시지 로드
        (initialState as any).value.messages = (initialState as any).loadMessages(finalOptions.locale);
        
        return initialState;
      },
      apply: (transaction, state) => state.apply(transaction)
    },

    commands: (_plugin) => ({
      changeLocale: (locale: string) => (_state: any, dispatch?: any) => {
        if (dispatch) {
          dispatch(transactions.custom('I18N_CHANGE_LOCALE', { locale }));
        }
        return true;
      },

      changeTimeZone: (timeZone: string) => (_state: any, dispatch?: any) => {
        if (dispatch) {
          dispatch(transactions.custom('I18N_CHANGE_TIMEZONE', { timeZone }));
        }
        return true;
      },

      setFirstDayOfWeek: (day: number) => (_state: any, dispatch?: any) => {
        if (dispatch) {
          dispatch(transactions.custom('I18N_SET_FIRST_DAY_OF_WEEK', { day }));
        }
        return true;
      },

      setDateFormat: (format: Intl.DateTimeFormatOptions) => (_state: any, dispatch?: any) => {
        if (dispatch) {
          dispatch(transactions.custom('I18N_SET_DATE_FORMAT', { format }));
        }
        return true;
      },

      setTimeFormat: (format: '12h' | '24h') => (_state: any, dispatch?: any) => {
        if (dispatch) {
          dispatch(transactions.custom('I18N_SET_TIME_FORMAT', { format }));
        }
        return true;
      }
    }),

    decorations: (state, plugin) => {
      const i18nState = plugin.getState(state);
      if (!i18nState) return new DecorationSet();

      const decorations: any[] = [];

      // RTL 지원
      if (i18nState.value.rtl) {
        decorations.push(
          DecorationFactory.widget(new Date(), () => {
            const style = document.createElement('style');
            style.textContent = `
              .calendar-container {
                direction: rtl;
                text-align: right;
              }
              .calendar-header {
                flex-direction: row-reverse;
              }
              .calendar-nav-prev {
                order: 2;
              }
              .calendar-nav-next {
                order: 1;
              }
            `;
            return style;
          })
        );
      }

      // 숫자 시스템 지원
      if (i18nState.value.numberSystem !== 'latn') {
        decorations.push(
          DecorationFactory.widget(new Date(), () => {
            const style = document.createElement('style');
            style.textContent = `
              .calendar-date {
                font-variant-numeric: ${i18nState.value.numberSystem};
              }
            `;
            return style;
          })
        );
      }

      return new DecorationSet(decorations);
    },

    queries: {
      getLocale: (state, plugin) => {
        const i18nState = plugin.getState(state);
        return i18nState?.value.locale || 'en-US';
      },

      getTimeZone: (state, plugin) => {
        const i18nState = plugin.getState(state);
        return i18nState?.value.timeZone || 'UTC';
      },

      isRTL: (state, plugin) => {
        const i18nState = plugin.getState(state);
        return i18nState?.value.rtl || false;
      },

      getFirstDayOfWeek: (state, plugin) => {
        const i18nState = plugin.getState(state);
        return i18nState?.value.firstDayOfWeek || 0;
      },

      getMessages: (state, plugin) => {
        const i18nState = plugin.getState(state);
        return i18nState?.value.messages;
      },

      formatDate: (state, plugin, date: Date, options?: Intl.DateTimeFormatOptions) => {
        const i18nState = plugin.getState(state);
        if (!i18nState) return date.toLocaleDateString();

        const formatter = new DateTimeFormatter(
          i18nState.value.locale,
          i18nState.value.timeZone
        );
        
        return formatter.format(date, options || i18nState.value.dateFormat);
      },

      formatTime: (state, plugin, date: Date) => {
        const i18nState = plugin.getState(state);
        if (!i18nState) return date.toLocaleTimeString();

        const formatter = new DateTimeFormatter(
          i18nState.value.locale,
          i18nState.value.timeZone
        );
        
        const options: Intl.DateTimeFormatOptions = {
          hour: 'numeric',
          minute: '2-digit',
          hour12: i18nState.value.timeFormat === '12h'
        };
        
        return formatter.format(date, options);
      },

      formatDateRange: (state, plugin, startDate: Date, endDate: Date) => {
        const i18nState = plugin.getState(state);
        if (!i18nState) {
          return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
        }

        const formatter = new DateTimeFormatter(
          i18nState.value.locale,
          i18nState.value.timeZone
        );
        
        return formatter.formatRange(startDate, endDate, i18nState.value.dateFormat);
      },

      getWeekdays: (state, plugin, format?: 'long' | 'short' | 'narrow') => {
        const i18nState = plugin.getState(state);
        if (!i18nState) return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        const formatter = new DateTimeFormatter(
          i18nState.value.locale,
          i18nState.value.timeZone
        );
        
        return formatter.getWeekdays(format, i18nState.value.firstDayOfWeek);
      },

      getMonths: (state, plugin, format?: 'long' | 'short' | 'narrow') => {
        const i18nState = plugin.getState(state);
        if (!i18nState) return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        const formatter = new DateTimeFormatter(
          i18nState.value.locale,
          i18nState.value.timeZone
        );
        
        return formatter.getMonths(format);
      }
    }
  };

  return new Plugin(spec);
}

/**
 * 지역별 달력 시스템 인터페이스
 */
export interface CalendarSystem {
  name: string;
  toGregorian(date: CalendarDate): Date;
  fromGregorian(date: Date): CalendarDate;
  getMonthNames(locale: string): string[];
  getWeekdayNames(locale: string): string[];
  isLeapYear(year: number): boolean;
  getDaysInMonth(year: number, month: number): number;
}

export interface CalendarDate {
  year: number;
  month: number;
  day: number;
}

/**
 * 그레고리안 달력 시스템 (기본)
 */
export class GregorianCalendar implements CalendarSystem {
  name = 'gregorian';

  toGregorian(date: CalendarDate): Date {
    return new Date(date.year, date.month - 1, date.day);
  }

  fromGregorian(date: Date): CalendarDate {
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate()
    };
  }

  getMonthNames(locale: string): string[] {
    const formatter = new DateTimeFormatter(locale, 'UTC');
    return formatter.getMonths('long');
  }

  getWeekdayNames(locale: string): string[] {
    const formatter = new DateTimeFormatter(locale, 'UTC');
    return formatter.getWeekdays('long');
  }

  isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  }

  getDaysInMonth(year: number, month: number): number {
    return new Date(year, month, 0).getDate();
  }
}

/**
 * I18n 유틸리티 함수들
 */
export const I18nUtils = {
  /**
   * 브라우저의 기본 로케일 감지
   */
  detectLocale(): string {
    if (typeof navigator !== 'undefined') {
      return navigator.language || navigator.languages?.[0] || 'en-US';
    }
    return 'en-US';
  },

  /**
   * 시간대 감지
   */
  detectTimeZone(): string {
    if (typeof Intl !== 'undefined') {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
    return 'UTC';
  },

  /**
   * RTL 언어 감지
   */
  isRTLLanguage(locale: string): boolean {
    const rtlLanguages = ['ar', 'he', 'fa', 'ur', 'ps', 'sd', 'yi'];
    const lang = locale.split('-')[0];
    return rtlLanguages.includes(lang);
  },

  /**
   * 로케일별 첫 번째 요일 가져오기
   */
  getFirstDayOfWeek(locale: string): number {
    // ISO 국가 코드 기반 첫 번째 요일 (0 = 일요일, 1 = 월요일)
    const mondayFirst = [
      'AD', 'AI', 'AL', 'AM', 'AN', 'AT', 'AX', 'AZ', 'BA', 'BE', 'BG', 'BM', 'BN', 'BY', 'CH',
      'CL', 'CM', 'CR', 'CY', 'CZ', 'DE', 'DK', 'EC', 'EE', 'ES', 'FI', 'FJ', 'FO', 'FR', 'GB',
      'GE', 'GF', 'GP', 'GR', 'GT', 'GU', 'HR', 'HU', 'IS', 'IT', 'KG', 'KZ', 'LB', 'LI', 'LK',
      'LT', 'LU', 'LV', 'MC', 'MD', 'ME', 'MH', 'MK', 'MN', 'MQ', 'MT', 'MY', 'NL', 'NO', 'NZ',
      'PL', 'PT', 'RE', 'RO', 'RS', 'RU', 'SE', 'SI', 'SK', 'SM', 'TJ', 'TM', 'TR', 'UA', 'UY',
      'UZ', 'VA', 'VN', 'XK'
    ];
    
    const country = locale.split('-')[1];
    return country && mondayFirst.includes(country) ? 1 : 0;
  }
};