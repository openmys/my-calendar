/**
 * useCalendar Hook
 * React에서 캘린더 상태와 기능을 사용하기 위한 커스텀 훅
 */

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { CalendarView, CalendarViewOptions } from '@/core/calendar-view';
import { CalendarState, Transaction } from '@/types';
import { Plugin } from '@/core/plugin';

export interface UseCalendarOptions
  extends Omit<CalendarViewOptions, 'plugins'> {
  plugins?: Plugin[];
  onStateChange?: (state: CalendarState) => void;
  onTransaction?: (transaction: Transaction) => void;
}

export interface UseCalendarReturn {
  state: CalendarState | null;
  calendar: CalendarView | null;
  execCommand: (commandName: string, ...args: any[]) => boolean;
  query: (pluginKey: string, queryName: string, ...args: any[]) => any;
  addPlugin: (plugin: Plugin) => void;
  removePlugin: (pluginKey: string) => boolean;
  undo: () => boolean;
  redo: () => boolean;
  render: () => void;
  isReady: boolean;
}

/**
 * useCalendar Hook
 */
export function useCalendar(
  options: UseCalendarOptions = {}
): UseCalendarReturn {
  const [state, setState] = useState<CalendarState | null>(null);
  const [isReady, setIsReady] = useState(false);
  const calendarRef = useRef<CalendarView | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // 옵션 메모이제이션
  const memoizedOptions = useMemo(() => options, [options]);

  // 캘린더 초기화
  useEffect(() => {
    // 컨테이너 엘리먼트 생성
    if (!containerRef.current) {
      containerRef.current = document.createElement('div');
      containerRef.current.className = 'calendar-container';
    }

    // CalendarView 인스턴스 생성
    const calendar = new CalendarView(containerRef.current, memoizedOptions);
    calendarRef.current = calendar;

    // 초기 상태 설정
    setState(calendar.getState());
    setIsReady(true);

    // 상태 변경 리스너 등록
    const unsubscribeState = calendar.onStateChange(newState => {
      setState(newState);
      options.onStateChange?.(newState);
    });

    // 트랜잭션 리스너 등록
    const unsubscribeTransaction = calendar.onTransaction(transaction => {
      options.onTransaction?.(transaction);
    });

    // 정리 함수
    return () => {
      unsubscribeState();
      unsubscribeTransaction();
      calendar.destroy();
      calendarRef.current = null;
      setIsReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memoizedOptions]);

  // 커맨드 실행 함수
  const execCommand = useCallback(
    (commandName: string, ...args: any[]): boolean => {
      if (!calendarRef.current) return false;
      return calendarRef.current.execCommand(commandName, ...args);
    },
    []
  );

  // 쿼리 함수
  const query = useCallback(
    (pluginKey: string, queryName: string, ...args: any[]): any => {
      if (!calendarRef.current) return undefined;
      return calendarRef.current.query(pluginKey, queryName, ...args);
    },
    []
  );

  // 플러그인 추가
  const addPlugin = useCallback((plugin: Plugin): void => {
    if (!calendarRef.current) return;
    calendarRef.current.addPlugin(plugin);
  }, []);

  // 플러그인 제거
  const removePlugin = useCallback((pluginKey: string): boolean => {
    if (!calendarRef.current) return false;
    return calendarRef.current.removePlugin(pluginKey);
  }, []);

  // Undo
  const undo = useCallback((): boolean => {
    if (!calendarRef.current) return false;
    return calendarRef.current.undo();
  }, []);

  // Redo
  const redo = useCallback((): boolean => {
    if (!calendarRef.current) return false;
    return calendarRef.current.redo();
  }, []);

  // 수동 렌더링
  const render = useCallback((): void => {
    if (!calendarRef.current) return;
    calendarRef.current.render();
  }, []);

  return {
    state,
    calendar: calendarRef.current,
    execCommand,
    query,
    addPlugin,
    removePlugin,
    undo,
    redo,
    render,
    isReady,
  };
}

/**
 * useCalendarRef Hook
 * DOM 엘리먼트와 함께 캘린더를 사용하는 훅
 */
export function useCalendarRef(options: UseCalendarOptions = {}) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [calendar, setCalendar] = useState<CalendarView | null>(null);
  const [state, setState] = useState<CalendarState | null>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const calendarInstance = new CalendarView(elementRef.current, options);
    setCalendar(calendarInstance);
    setState(calendarInstance.getState());

    const unsubscribe = calendarInstance.onStateChange(setState);

    return () => {
      unsubscribe();
      calendarInstance.destroy();
      setCalendar(null);
      setState(null);
    };
  }, [options]);

  return {
    elementRef,
    calendar,
    state,
  };
}

/**
 * useCalendarCommands Hook
 * 캘린더 커맨드만 사용하는 경량 훅
 */
export function useCalendarCommands(calendar: CalendarView | null) {
  const execCommand = useCallback(
    (commandName: string, ...args: any[]): boolean => {
      if (!calendar) return false;
      return calendar.execCommand(commandName, ...args);
    },
    [calendar]
  );

  const query = useCallback(
    (pluginKey: string, queryName: string, ...args: any[]): any => {
      if (!calendar) return undefined;
      return calendar.query(pluginKey, queryName, ...args);
    },
    [calendar]
  );

  return {
    execCommand,
    query,
  };
}

/**
 * useCalendarState Hook
 * 캘린더 상태만 구독하는 훅
 */
export function useCalendarState(
  calendar: CalendarView | null
): CalendarState | null {
  const [state, setState] = useState<CalendarState | null>(
    calendar ? calendar.getState() : null
  );

  useEffect(() => {
    if (!calendar) {
      setState(null);
      return;
    }

    setState(calendar.getState());
    return calendar.onStateChange(setState);
  }, [calendar]);

  return state;
}

/**
 * useCalendarPlugin Hook
 * 특정 플러그인의 상태와 기능을 사용하는 훅
 */
export function useCalendarPlugin(
  calendar: CalendarView | null,
  pluginKey: string
) {
  const state = useCalendarState(calendar);

  const pluginState = useMemo(() => {
    if (!state || !state.pluginStates.has(pluginKey)) {
      return null;
    }
    return state.pluginStates.get(pluginKey) as any;
  }, [state, pluginKey]);

  const query = useCallback(
    (queryName: string, ...args: any[]): any => {
      if (!calendar) return undefined;
      return calendar.query(pluginKey, queryName, ...args);
    },
    [calendar, pluginKey]
  );

  return {
    pluginState: pluginState?.value || null,
    query,
  };
}
