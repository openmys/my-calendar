/**
 * useCalendar Hook
 * React에서 캘린더 상태와 기능을 사용하기 위한 커스텀 훅
 */

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { CalendarView, CalendarViewOptions } from '@/core/calendar-view';
import { CalendarState, Transaction, PluginState } from '@/types';
import { TypedQueryFunction } from '@/types/plugin-query-inference';
import { Plugin } from '@/core/plugin';

export interface UseCalendarOptions<
  TPlugins extends readonly Plugin<any>[] = readonly Plugin<any>[],
> extends Omit<CalendarViewOptions, 'plugins'> {
  plugins?: TPlugins;
  onStateChange?: (state: CalendarState) => void;
  onTransaction?: (transaction: Transaction) => void;
}

export interface UseCalendarReturn<
  TPlugins extends readonly Plugin<any>[] = readonly Plugin<any>[],
> {
  state: CalendarState | null;
  calendar: CalendarView | null;
  execCommand: (commandName: string, ...args: unknown[]) => boolean;
  query: TypedQueryFunction<TPlugins>;
  undo: () => boolean;
  redo: () => boolean;
  isReady: boolean;
  // Range Plugin 전용 타입 안전한 쿼리 헬퍼 (backward compatibility)
  rangeQuery: {
    getSelectedRange(): { start: Date; end: Date } | null;
    getSelectedDates(): Date[];
    isDateSelected(date: Date): boolean;
    getSelectionMode(): 'single' | 'range' | 'multiple';
    isSelecting(): boolean;
  };
}

/**
 * useCalendar Hook
 */
export function useCalendar<TPlugins extends readonly Plugin<any>[]>(
  options: UseCalendarOptions<TPlugins> = {} as UseCalendarOptions<TPlugins>
): UseCalendarReturn<TPlugins> {
  const [state, setState] = useState<CalendarState | null>(null);
  const [isReady, setIsReady] = useState(false);
  const calendarRef = useRef<CalendarView | null>(null);
  const optionsRef = useRef(options);

  // options ref 업데이트
  useEffect(() => {
    optionsRef.current = options;
  });

  // 옵션을 깊은 메모이제이션으로 처리하여 무한 리렌더링 방지
  const memoizedOptions = useMemo(() => {
    return {
      plugins: options.plugins ? [...options.plugins] : [], // readonly 배열을 일반 배열로 변환
      initialState: options.initialState,
    };
  }, [
    options.plugins, // 배열 참조 - 스토리에서 고정된 배열이므로 안전
    options.initialState,
  ]);

  // 캘린더 초기화
  useEffect(() => {
    // CalendarView 인스턴스 생성 (헤드리스 버전)
    const calendar = new CalendarView(memoizedOptions);
    calendarRef.current = calendar;

    // 초기 상태 설정
    setState(calendar.getState());
    setIsReady(true);

    // 상태 변경 리스너 등록
    const unsubscribeState = calendar.onStateChange(newState => {
      setState(newState);
      // ref를 통해 최신 콜백 호출
      optionsRef.current.onStateChange?.(newState);
    });

    // 트랜잭션 리스너 등록
    const unsubscribeTransaction = calendar.onTransaction(transaction => {
      // ref를 통해 최신 콜백 호출
      optionsRef.current.onTransaction?.(transaction);
    });

    // 정리 함수
    return () => {
      unsubscribeState();
      unsubscribeTransaction();
      calendar.destroy();
      calendarRef.current = null;
      setIsReady(false);
    };
  }, [memoizedOptions]);

  // 커맨드 실행 함수
  const execCommand = useCallback(
    (commandName: string, ...args: unknown[]): boolean => {
      if (!calendarRef.current) return false;
      return calendarRef.current.execCommand(commandName, ...args);
    },
    []
  );

  // 완전 타입 안전한 쿼리 함수
  const query = useCallback(
    (pluginKey: string, queryName: string, ...args: unknown[]) => {
      if (!calendarRef.current) return undefined;
      return calendarRef.current.query(pluginKey, queryName, ...args);
    },
    []
  ) as TypedQueryFunction<TPlugins>;

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

  // Range Plugin 전용 타입 안전한 쿼리 헬퍼
  const rangeQuery = useMemo(
    () => ({
      getSelectedRange(): { start: Date; end: Date } | null {
        if (!calendarRef.current) return null;
        return calendarRef.current.query('range', 'getSelectedRange') as {
          start: Date;
          end: Date;
        } | null;
      },
      getSelectedDates(): Date[] {
        if (!calendarRef.current) return [];
        return calendarRef.current.query('range', 'getSelectedDates') as Date[];
      },
      isDateSelected(date: Date): boolean {
        if (!calendarRef.current) return false;
        return calendarRef.current.query(
          'range',
          'isDateSelected',
          date
        ) as boolean;
      },
      getSelectionMode(): 'single' | 'range' | 'multiple' {
        if (!calendarRef.current) return 'single';
        return calendarRef.current.query('range', 'getSelectionMode') as
          | 'single'
          | 'range'
          | 'multiple';
      },
      isSelecting(): boolean {
        if (!calendarRef.current) return false;
        return calendarRef.current.query('range', 'isSelecting') as boolean;
      },
    }),
    []
  );

  return {
    state,
    calendar: calendarRef.current,
    execCommand,
    query,
    undo,
    redo,
    isReady,
    rangeQuery,
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
