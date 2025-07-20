/**
 * useCalendar Hook
 * React에서 캘린더 상태와 기능을 사용하기 위한 커스텀 훅
 */

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { CalendarView, CalendarViewOptions } from '@/core/calendar-view';
import { CalendarState, Transaction, PluginState } from '@/types';
import { Plugin } from '@/core/plugin';
import { DecorationManager } from '@/core/decoration';

export interface UseCalendarOptions
  extends Omit<CalendarViewOptions, 'plugins'> {
  plugins?: Plugin[];
  onStateChange?: (state: CalendarState) => void;
  onTransaction?: (transaction: Transaction) => void;
}

export interface UseCalendarReturn {
  state: CalendarState | null;
  calendar: CalendarView | null;
  execCommand: (commandName: string, ...args: unknown[]) => boolean;
  query: <T = unknown>(pluginKey: string, queryName: string, ...args: unknown[]) => T;
  undo: () => boolean;
  redo: () => boolean;
  isReady: boolean;
  decorations: DecorationManager;
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
  const decorationManagerRef = useRef<DecorationManager>(new DecorationManager());

  // 옵션 메모이제이션
  const memoizedOptions = useMemo(() => options, [options]);

  // 캘린더 초기화
  useEffect(() => {
    // 정리 함수에서 사용할 ref 값들을 미리 캡처
    const decorationManager = decorationManagerRef.current;
    
    // CalendarView 인스턴스 생성 (헤드리스 버전)
    const calendar = new CalendarView(memoizedOptions);
    calendarRef.current = calendar;

    // 초기 상태 설정
    setState(calendar.getState());
    setIsReady(true);

    // 상태 변경 리스너 등록
    const unsubscribeState = calendar.onStateChange(newState => {
      setState(newState);
      
      // 데코레이션 업데이트
      const decorations = calendar.getDecorations();
      decorationManagerRef.current.updateDecorations(decorations);
      
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
      if (decorationManager) {
        decorationManager.dispose();
      }
      setIsReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memoizedOptions]);

  // 커맨드 실행 함수
  const execCommand = useCallback(
    (commandName: string, ...args: unknown[]): boolean => {
      if (!calendarRef.current) return false;
      return calendarRef.current.execCommand(commandName, ...args);
    },
    []
  );

  // 쿼리 함수
  const query = useCallback(
    <T = unknown>(pluginKey: string, queryName: string, ...args: unknown[]): T => {
      if (!calendarRef.current) return undefined as T;
      return calendarRef.current.query(pluginKey, queryName, ...args) as T;
    },
    []
  );


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


  return {
    state,
    calendar: calendarRef.current,
    execCommand,
    query,
    undo,
    redo,
    isReady,
    decorations: decorationManagerRef.current,
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
export function useCalendarPlugin<T = unknown>(
  calendar: CalendarView | null,
  pluginKey: string
) {
  const state = useCalendarState(calendar);

  const pluginState = useMemo(() => {
    if (!state || !state.pluginStates.has(pluginKey)) {
      return null;
    }
    return state.pluginStates.get(pluginKey) as PluginState<T> | undefined;
  }, [state, pluginKey]);

  const query = useCallback(
    <R = unknown>(queryName: string, ...args: unknown[]): R => {
      if (!calendar) return undefined as R;
      return calendar.query(pluginKey, queryName, ...args) as R;
    },
    [calendar, pluginKey]
  );

  return {
    pluginState: pluginState?.value ?? null,
    query,
  };
}
