/**
 * Calendar React Component (헤드리스 패턴)
 * 캘린더의 기본 React 컴포넌트 - 개발자가 커스터마이징 가능한 예시 구현
 */

import React, {
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { CalendarView } from '@/core/calendar-view';
import { useCalendar, UseCalendarOptions } from './use-calendar';
import { CalendarState, Decoration } from '@/types';
import { DecorationData } from '@/core/decoration';

export interface CalendarProps extends UseCalendarOptions {
  className?: string;
  style?: React.CSSProperties;
  onDateClick?: (date: Date, event: React.MouseEvent) => void;
  onDateDoubleClick?: (date: Date, event: React.MouseEvent) => void;
  onDateHover?: (date: Date, event: React.MouseEvent) => void;
  onMonthChange?: (date: Date) => void;
  onViewChange?: (viewType: string) => void;
  onReady?: (calendar: CalendarView) => void;
  
  // 헤드리스 패턴을 위한 렌더링 커스터마이징 옵션
  renderDay?: (day: CalendarDay, decorations: Decoration[]) => React.ReactNode;
  renderHeader?: (state: CalendarState, controls: CalendarControls) => React.ReactNode;
  renderWeekdays?: (weekdays: string[]) => React.ReactNode;
  showHeader?: boolean;
  showWeekdays?: boolean;
  weekdayFormat?: 'long' | 'short' | 'narrow';
}

export interface CalendarDay {
  date: Date;
  isToday: boolean;
  isWeekend: boolean;
  isOtherMonth?: boolean;
  isDisabled?: boolean;
}

export interface CalendarControls {
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
  goToToday: () => void;
  goToPreviousYear: () => void;
  goToNextYear: () => void;
}

export interface CalendarRef {
  getCalendar: () => CalendarView | null;
  getState: () => CalendarState | null;
  execCommand: (commandName: string, ...args: any[]) => boolean;
  query: (pluginKey: string, queryName: string, ...args: any[]) => any;
  getDecorations: () => Map<string, Decoration[]>;
  getDecorationsForDate: (date: Date) => Decoration[];
}

/**
 * Calendar 컴포넌트
 */
export const Calendar = forwardRef<CalendarRef, CalendarProps>((props, ref) => {
  const {
    className = '',
    style,
    onDateClick,
    onDateDoubleClick,
    onDateHover,
    onMonthChange,
    onViewChange,
    onReady,
    onStateChange,
    onTransaction,
    showHeader = true,
    showWeekdays = true,
    weekdayFormat = 'short',
    renderDay,
    renderHeader,
    renderWeekdays,
    ...calendarOptions
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const previousStateRef = useRef<CalendarState | null>(null);

  // useCalendar 훅 사용
  const { state, calendar, execCommand, query, isReady, decorations } = useCalendar({
    ...calendarOptions,
    onStateChange: newState => {
      // 월 변경 감지
      const prevState = previousStateRef.current;
      if (
        prevState &&
        prevState.currentDate.getMonth() !== newState.currentDate.getMonth()
      ) {
        onMonthChange?.(newState.currentDate);
      }

      // 뷰 변경 감지
      if (prevState && prevState.viewType !== newState.viewType) {
        onViewChange?.(newState.viewType);
      }

      previousStateRef.current = newState;
      onStateChange?.(newState);
    },
    onTransaction,
  });

  // Ready 콜백 호출
  useEffect(() => {
    if (calendar && isReady) {
      onReady?.(calendar);
    }
  }, [calendar, isReady, onReady]);

  // 컨트롤 함수들
  const controls: CalendarControls = {
    goToPreviousMonth: () => execCommand('goToPreviousMonth'),
    goToNextMonth: () => execCommand('goToNextMonth'),
    goToToday: () => execCommand('goToToday'),
    goToPreviousYear: () => execCommand('goToPreviousYear'),
    goToNextYear: () => execCommand('goToNextYear'),
  };

  // 이벤트 핸들러들
  const handleDateClick = (day: CalendarDay, event: React.MouseEvent) => {
    // 헤드리스 패턴: 캘린더 로직 먼저 처리
    calendar?.handleDateClick(day.date, event.nativeEvent);
    // 사용자 콜백 호출
    onDateClick?.(day.date, event);
  };

  const handleDateDoubleClick = (day: CalendarDay, event: React.MouseEvent) => {
    onDateDoubleClick?.(day.date, event);
  };

  const handleDateHover = (day: CalendarDay, event: React.MouseEvent) => {
    onDateHover?.(day.date, event);
  };

  // Ref 연결
  useImperativeHandle(
    ref,
    () => ({
      getCalendar: () => calendar,
      getState: () => state,
      execCommand,
      query,
      getDecorations: () => decorations.getDecorationMap(),
      getDecorationsForDate: (date: Date) => decorations.getDecorationsForDate(date),
    }),
    [calendar, state, execCommand, query, decorations]
  );

  // 캘린더 데이터 생성
  const calendarDays = React.useMemo(() => {
    if (!state) return [];
    
    return state.days.map(day => ({
      ...day,
      isOtherMonth: day.date.getMonth() !== state.currentDate.getMonth(),
    }));
  }, [state]);

  // 요일 이름 생성
  const weekdays = React.useMemo(() => {
    const baseWeekdays = {
      long: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
      short: ['일', '월', '화', '수', '목', '금', '토'],
      narrow: ['일', '월', '화', '수', '목', '금', '토'],
    };
    return baseWeekdays[weekdayFormat];
  }, [weekdayFormat]);

  if (!state) {
    return <div className="calendar-loading">로딩 중...</div>;
  }

  const combinedClassName = ['my-calendar', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={containerRef}
      className={combinedClassName}
      style={style}
      data-testid='calendar'
    >
      {/* 헤더 렌더링 */}
      {showHeader && (
        renderHeader ? renderHeader(state, controls) : (
          <DefaultCalendarHeader state={state} controls={controls} />
        )
      )}

      {/* 캘린더 본체 */}
      <div className="calendar-body">
        {/* 요일 헤더 */}
        {showWeekdays && (
          renderWeekdays ? renderWeekdays(weekdays) : (
            <DefaultWeekdaysHeader weekdays={weekdays} />
          )
        )}

        {/* 날짜 그리드 */}
        <div className="calendar-grid">
          {calendarDays.map(day => {
            const dayDecorations = decorations.getDecorationsForDate(day.date);
            
            return renderDay ? renderDay(day, dayDecorations) : (
              <DefaultCalendarDay
                key={day.date.toISOString()}
                day={day}
                decorations={dayDecorations}
                onClick={(e) => handleDateClick(day, e)}
                onDoubleClick={(e) => handleDateDoubleClick(day, e)}
                onMouseEnter={(e) => handleDateHover(day, e)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
});

Calendar.displayName = 'Calendar';

// 개발자가 사용할 수 있는 유틸리티 함수들
// 별도의 파일로 분리하는 것을 권장
// eslint-disable-next-line react-refresh/only-export-components
export const CalendarUtils = {
  /**
   * 데코레이션에서 className 추출
   */
  getClassNameFromDecorations: (decorations: Decoration[]): string => {
    return decorations
      .map(d => d.spec.class)
      .filter(Boolean)
      .join(' ');
  },

  /**
   * 데코레이션에서 스타일 객체 추출
   */
  getStyleFromDecorations: (decorations: Decoration[]): React.CSSProperties => {
    const style: React.CSSProperties = {};
    
    decorations.forEach(decoration => {
      if (decoration.spec.style) {
        const styleObj = decoration.spec.style
          .split(';')
          .reduce((acc, rule) => {
            const [property, value] = rule.split(':').map(s => s.trim());
            if (property && value) {
              const camelProperty = property.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
              acc[camelProperty] = value;
            }
            return acc;
          }, {} as any);
        Object.assign(style, styleObj);
      }
    });
    
    return style;
  },

  /**
   * 데코레이션에서 HTML 속성 추출
   */
  getAttributesFromDecorations: (decorations: Decoration[]): Record<string, string> => {
    const attributes: Record<string, string> = {};
    
    decorations.forEach(decoration => {
      if (decoration.spec.attributes) {
        Object.assign(attributes, decoration.spec.attributes);
      }
    });
    
    return attributes;
  },

  /**
   * 날짜 키 생성 (데코레이션 매핑용)
   */
  getDateKey: (date: Date): string => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  },
};

/**
 * 기본 캘린더 헤더 컴포넌트
 */
interface DefaultCalendarHeaderProps {
  state: CalendarState;
  controls: CalendarControls;
  className?: string;
  showToday?: boolean;
  format?: 'short' | 'long';
}

const DefaultCalendarHeader: React.FC<DefaultCalendarHeaderProps> = ({
  state,
  controls,
  className = '',
  showToday = true,
  format = 'long',
}) => {
  const formatDate = (date: Date) => {
    if (format === 'short') {
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'short',
      });
    }
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
    });
  };

  return (
    <div className={`calendar-header ${className}`}>
      <button
        type='button'
        className='calendar-nav-button calendar-prev'
        onClick={controls.goToPreviousMonth}
        aria-label='이전 달'
      >
        ‹
      </button>

      <h2 className='calendar-title'>{formatDate(state.currentDate)}</h2>

      <button
        type='button'
        className='calendar-nav-button calendar-next'
        onClick={controls.goToNextMonth}
        aria-label='다음 달'
      >
        ›
      </button>

      {showToday && (
        <button
          type='button'
          className='calendar-today-button'
          onClick={controls.goToToday}
        >
          오늘
        </button>
      )}
    </div>
  );
};

/**
 * 기본 요일 헤더 컴포넌트
 */
interface DefaultWeekdaysHeaderProps {
  weekdays: string[];
  className?: string;
}

const DefaultWeekdaysHeader: React.FC<DefaultWeekdaysHeaderProps> = ({
  weekdays,
  className = '',
}) => {
  return (
    <div className={`calendar-weekdays ${className}`}>
      {weekdays.map((weekday, index) => (
        <div key={index} className='calendar-weekday'>
          {weekday}
        </div>
      ))}
    </div>
  );
};

/**
 * 기본 캘린더 날짜 셀 컴포넌트
 */
interface DefaultCalendarDayProps {
  day: CalendarDay;
  decorations: Decoration[];
  onClick?: (event: React.MouseEvent) => void;
  onDoubleClick?: (event: React.MouseEvent) => void;
  onMouseEnter?: (event: React.MouseEvent) => void;
  className?: string;
}

const DefaultCalendarDay: React.FC<DefaultCalendarDayProps> = ({
  day,
  decorations,
  onClick,
  onDoubleClick,
  onMouseEnter,
  className = '',
}) => {
  // 데코레이션에서 스타일 정보 추출
  const decorationData = React.useMemo(() => {
    const data: DecorationData = {
      className: '',
      style: {},
      attributes: {},
    };

    decorations.forEach(decoration => {
      if (decoration.spec.class) {
        data.className += ` ${decoration.spec.class}`;
      }
      if (decoration.spec.style) {
        // CSS 문자열을 객체로 변환 (간단한 구현)
        const styleObj = decoration.spec.style
          .split(';')
          .reduce((acc, rule) => {
            const [property, value] = rule.split(':').map(s => s.trim());
            if (property && value) {
              const camelProperty = property.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
              acc[camelProperty] = value;
            }
            return acc;
          }, {} as any);
        Object.assign(data.style ?? {}, styleObj);
      }
      if (decoration.spec.attributes) {
        Object.assign(data.attributes ?? {}, decoration.spec.attributes);
      }
      if (decoration.type === 'overlay' && decoration.spec.attributes?.['data-content']) {
        data.overlayContent = decoration.spec.attributes['data-content'];
      }
    });

    return data;
  }, [decorations]);

  const dayClassName = [
    'calendar-day',
    day.isToday ? 'today' : '',
    day.isWeekend ? 'weekend' : '',
    day.isOtherMonth ? 'other-month' : '',
    day.isDisabled ? 'disabled' : '',
    decorationData.className,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={dayClassName}
      style={decorationData.style}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onMouseEnter={onMouseEnter}
      data-date={day.date.toISOString()}
      {...decorationData.attributes}
    >
      <span className='calendar-day-number'>{day.date.getDate()}</span>
      {decorationData.overlayContent && (
        <div className='calendar-day-overlay'>
          {decorationData.overlayContent}
        </div>
      )}
    </div>
  );
};

// 레거시 호환성을 위한 Export
export interface CalendarHeaderProps {
  calendar: CalendarView | null;
  state: CalendarState | null;
  onPrevious?: () => void;
  onNext?: () => void;
  onToday?: () => void;
  showToday?: boolean;
  showNavigation?: boolean;
  format?: 'short' | 'long';
  className?: string;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = (_props) => {
  console.warn('CalendarHeader is deprecated. Use renderHeader prop in Calendar component for customization.');
  return null;
};

export interface CalendarGridProps {
  state: CalendarState | null;
  onDateClick?: (date: Date) => void;
  className?: string;
  showWeekdays?: boolean;
  weekdayFormat?: 'short' | 'narrow';
}

export const CalendarGrid: React.FC<CalendarGridProps> = (_props) => {
  console.warn('CalendarGrid is deprecated. Use renderDay prop in Calendar component for customization.');
  return null;
};
