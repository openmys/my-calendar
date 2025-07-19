/* eslint-disable react-refresh/only-export-components */
/**
 * Calendar Context
 * React Context를 통한 캘린더 상태 공유
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { CalendarView } from '@/core/calendar-view';
import { CalendarState } from '@/types';
import {
  useCalendar,
  UseCalendarOptions,
  UseCalendarReturn,
} from './use-calendar';

export interface CalendarContextValue extends UseCalendarReturn {
  // 추가적인 컨텍스트 관련 기능들
}

const CalendarContext = createContext<CalendarContextValue | null>(null);

export interface CalendarProviderProps extends UseCalendarOptions {
  children: ReactNode;
}

/**
 * CalendarProvider 컴포넌트
 * 하위 컴포넌트들에게 캘린더 상태와 기능을 제공
 */
export const CalendarProvider: React.FC<CalendarProviderProps> = ({
  children,
  ...options
}) => {
  const calendarValue = useCalendar(options);

  return (
    <CalendarContext.Provider value={calendarValue}>
      {children}
    </CalendarContext.Provider>
  );
};

/**
 * useCalendarContext Hook
 * CalendarProvider 내에서 캘린더 컨텍스트를 사용하는 훅
 */
export function useCalendarContext(): CalendarContextValue {
  const context = useContext(CalendarContext);

  if (!context) {
    throw new Error(
      'useCalendarContext must be used within a CalendarProvider'
    );
  }

  return context;
}

/**
 * withCalendar HOC
 * 클래스 컴포넌트에서 캘린더 컨텍스트를 사용하기 위한 HOC
 */
export function withCalendar<P extends object>(
  Component: React.ComponentType<P & { calendar: CalendarContextValue }>
): React.FC<P> {
  return function WithCalendarComponent(props: P) {
    const calendar = useCalendarContext();

    return <Component {...props} calendar={calendar} />;
  };
}

/**
 * CalendarConsumer 컴포넌트
 * Render props 패턴으로 캘린더 컨텍스트를 사용
 */
export interface CalendarConsumerProps {
  children: (calendar: CalendarContextValue) => ReactNode;
}

export const CalendarConsumer: React.FC<CalendarConsumerProps> = ({
  children,
}) => {
  const calendar = useCalendarContext();
  return <>{children(calendar)}</>;
};

/**
 * useCalendarCommands Hook (컨텍스트 버전)
 * 컨텍스트에서 커맨드 실행 기능만 추출
 */
export function useCalendarCommands() {
  const { execCommand, query } = useCalendarContext();
  return { execCommand, query };
}

/**
 * useCalendarState Hook (컨텍스트 버전)
 * 컨텍스트에서 상태만 추출
 */
export function useCalendarState(): CalendarState | null {
  const { state } = useCalendarContext();
  return state;
}

/**
 * useCalendarInstance Hook
 * 컨텍스트에서 CalendarView 인스턴스만 추출
 */
export function useCalendarInstance(): CalendarView | null {
  const { calendar } = useCalendarContext();
  return calendar;
}

/**
 * useCalendarPlugin Hook (컨텍스트 버전)
 * 컨텍스트에서 특정 플러그인의 상태와 기능을 사용
 */
export function useCalendarPlugin(pluginKey: string) {
  const { state, query } = useCalendarContext();

  const pluginState = React.useMemo(() => {
    if (!state || !state.pluginStates.has(pluginKey)) {
      return null;
    }
    return state.pluginStates.get(pluginKey) as any;
  }, [state, pluginKey]);

  const queryPlugin = React.useCallback(
    (queryName: string, ...args: any[]): any => {
      return query(pluginKey, queryName, ...args);
    },
    [query, pluginKey]
  );

  return {
    pluginState: pluginState?.value || null,
    query: queryPlugin,
  };
}

/**
 * CalendarStateProvider 컴포넌트
 * 캘린더 상태만을 제공하는 가벼운 프로바이더
 */
interface CalendarStateContextValue {
  state: CalendarState | null;
  calendar: CalendarView | null;
}

const CalendarStateContext = createContext<CalendarStateContextValue | null>(
  null
);

export interface CalendarStateProviderProps {
  calendar: CalendarView | null;
  children: ReactNode;
}

export const CalendarStateProvider: React.FC<CalendarStateProviderProps> = ({
  calendar,
  children,
}) => {
  const [state, setState] = React.useState<CalendarState | null>(
    calendar ? calendar.getState() : null
  );

  React.useEffect(() => {
    if (!calendar) {
      setState(null);
      return;
    }

    setState(calendar.getState());
    return calendar.onStateChange(setState);
  }, [calendar]);

  const value = React.useMemo(() => ({ state, calendar }), [state, calendar]);

  return (
    <CalendarStateContext.Provider value={value}>
      {children}
    </CalendarStateContext.Provider>
  );
};

/**
 * useCalendarStateContext Hook
 * CalendarStateProvider에서 상태를 가져오는 훅
 */
export function useCalendarStateContext(): CalendarStateContextValue {
  const context = useContext(CalendarStateContext);

  if (!context) {
    throw new Error(
      'useCalendarStateContext must be used within a CalendarStateProvider'
    );
  }

  return context;
}
