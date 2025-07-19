/**
 * Calendar React Component
 * 캘린더의 기본 React 컴포넌트
 */

import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { CalendarView } from '@/core/calendar-view';
import { useCalendar, UseCalendarOptions } from './use-calendar';
import { CalendarState } from '@/types';

export interface CalendarProps extends UseCalendarOptions {
  className?: string;
  style?: React.CSSProperties;
  onDateClick?: (date: Date, event: React.MouseEvent) => void;
  onDateDoubleClick?: (date: Date, event: React.MouseEvent) => void;
  onDateHover?: (date: Date, event: React.MouseEvent) => void;
  onMonthChange?: (date: Date) => void;
  onViewChange?: (viewType: string) => void;
  onReady?: (calendar: CalendarView) => void;
}

export interface CalendarRef {
  getCalendar: () => CalendarView | null;
  getState: () => CalendarState | null;
  execCommand: (commandName: string, ...args: any[]) => boolean;
  query: (pluginKey: string, queryName: string, ...args: any[]) => any;
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
    ...calendarOptions
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const previousStateRef = useRef<CalendarState | null>(null);

  // useCalendar 훅 사용
  const {
    state,
    calendar,
    execCommand,
    query,
    isReady
  } = useCalendar({
    ...calendarOptions,
    onStateChange: (newState) => {
      // 월 변경 감지
      const prevState = previousStateRef.current;
      if (prevState && prevState.currentDate.getMonth() !== newState.currentDate.getMonth()) {
        onMonthChange?.(newState.currentDate);
      }

      // 뷰 변경 감지
      if (prevState && prevState.viewType !== newState.viewType) {
        onViewChange?.(newState.viewType);
      }

      previousStateRef.current = newState;
      onStateChange?.(newState);
    },
    onTransaction
  });

  // DOM 연결
  useEffect(() => {
    if (!calendar || !containerRef.current || !isReady) return;

    // 캘린더의 DOM을 컨테이너에 연결
    const calendarElement = (calendar as any).element;
    if (calendarElement && containerRef.current !== calendarElement.parentElement) {
      containerRef.current.appendChild(calendarElement);
    }

    // ready 콜백 호출
    onReady?.(calendar);
  }, [calendar, isReady, onReady]);

  // 이벤트 핸들링
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const dateElement = target.closest('[data-date]') as HTMLElement;
      
      if (dateElement && onDateClick) {
        const dateStr = dateElement.getAttribute('data-date');
        if (dateStr) {
          const date = new Date(dateStr);
          onDateClick(date, event as any);
        }
      }
    };

    const handleDoubleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const dateElement = target.closest('[data-date]') as HTMLElement;
      
      if (dateElement && onDateDoubleClick) {
        const dateStr = dateElement.getAttribute('data-date');
        if (dateStr) {
          const date = new Date(dateStr);
          onDateDoubleClick(date, event as any);
        }
      }
    };

    const handleMouseOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const dateElement = target.closest('[data-date]') as HTMLElement;
      
      if (dateElement && onDateHover) {
        const dateStr = dateElement.getAttribute('data-date');
        if (dateStr) {
          const date = new Date(dateStr);
          onDateHover(date, event as any);
        }
      }
    };

    container.addEventListener('click', handleClick);
    container.addEventListener('dblclick', handleDoubleClick);
    container.addEventListener('mouseover', handleMouseOver);

    return () => {
      container.removeEventListener('click', handleClick);
      container.removeEventListener('dblclick', handleDoubleClick);
      container.removeEventListener('mouseover', handleMouseOver);
    };
  }, [onDateClick, onDateDoubleClick, onDateHover]);

  // Ref 연결
  useImperativeHandle(ref, () => ({
    getCalendar: () => calendar,
    getState: () => state,
    execCommand,
    query
  }), [calendar, state, execCommand, query]);

  const combinedClassName = ['my-calendar', className].filter(Boolean).join(' ');

  return (
    <div
      ref={containerRef}
      className={combinedClassName}
      style={style}
      data-testid="calendar"
    />
  );
});

Calendar.displayName = 'Calendar';

/**
 * CalendarHeader 컴포넌트
 * 캘린더 헤더 영역을 위한 별도 컴포넌트
 */
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

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  calendar,
  state,
  onPrevious,
  onNext,
  onToday,
  showToday = true,
  showNavigation = true,
  format = 'long',
  className = ''
}) => {
  const handlePrevious = () => {
    if (onPrevious) {
      onPrevious();
    } else if (calendar) {
      calendar.execCommand('goToPreviousMonth');
    }
  };

  const handleNext = () => {
    if (onNext) {
      onNext();
    } else if (calendar) {
      calendar.execCommand('goToNextMonth');
    }
  };

  const handleToday = () => {
    if (onToday) {
      onToday();
    } else if (calendar) {
      calendar.execCommand('goToToday');
    }
  };

  const formatDate = (date: Date) => {
    if (format === 'short') {
      return date.toLocaleDateString('ko-KR', { 
        year: 'numeric', 
        month: 'short' 
      });
    }
    return date.toLocaleDateString('ko-KR', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  if (!state) return null;

  return (
    <div className={`calendar-header ${className}`}>
      {showNavigation && (
        <button 
          type="button"
          className="calendar-nav-button calendar-prev"
          onClick={handlePrevious}
          aria-label="이전 달"
        >
          ‹
        </button>
      )}
      
      <h2 className="calendar-title">
        {formatDate(state.currentDate)}
      </h2>
      
      {showNavigation && (
        <button 
          type="button"
          className="calendar-nav-button calendar-next"
          onClick={handleNext}
          aria-label="다음 달"
        >
          ›
        </button>
      )}
      
      {showToday && (
        <button 
          type="button"
          className="calendar-today-button"
          onClick={handleToday}
        >
          오늘
        </button>
      )}
    </div>
  );
};

/**
 * CalendarGrid 컴포넌트
 * 캘린더 그리드만을 위한 컴포넌트
 */
export interface CalendarGridProps {
  state: CalendarState | null;
  onDateClick?: (date: Date) => void;
  className?: string;
  showWeekdays?: boolean;
  weekdayFormat?: 'short' | 'narrow';
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  state,
  onDateClick,
  className = '',
  showWeekdays = true,
  weekdayFormat = 'short'
}) => {
  if (!state) return null;

  const shortWeekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const narrowWeekdays = ['일', '월', '화', '수', '목', '금', '토'];

  const getWeekdayLabels = () => {
    switch (weekdayFormat) {
      case 'narrow':
        return narrowWeekdays;
      case 'short':
      default:
        return shortWeekdays;
    }
  };

  const handleDateClick = (date: Date) => {
    onDateClick?.(date);
  };

  return (
    <div className={`calendar-grid ${className}`}>
      {showWeekdays && (
        <div className="calendar-weekdays">
          {getWeekdayLabels().map((weekday, index) => (
            <div key={index} className="calendar-weekday">
              {weekday}
            </div>
          ))}
        </div>
      )}
      
      <div className="calendar-days">
        {state.days.map((day) => (
          <div
            key={day.date.toISOString()}
            className={`calendar-day ${day.isToday ? 'today' : ''} ${day.isWeekend ? 'weekend' : ''}`}
            onClick={() => handleDateClick(day.date)}
            data-date={day.date.toISOString()}
          >
            <span className="calendar-day-number">
              {day.date.getDate()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};