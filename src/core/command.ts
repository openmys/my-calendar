/**
 * Command System 구현
 * 사용자 액션을 구조화된 명령으로 변환하고 실행하는 시스템
 */

import { Command, CommandMap, CalendarState, Transaction } from '@/types';
import { transactions } from './transaction';

/**
 * 기본 커맨드들
 */
export const coreCommands: CommandMap = {
  // 날짜 네비게이션 커맨드
  goToNextMonth:
    () =>
    (_state: CalendarState, dispatch?: (transaction: Transaction) => void) => {
      if (dispatch) {
        dispatch(transactions.changeMonth('next'));
      }
      return true;
    },

  goToPreviousMonth:
    () =>
    (_state: CalendarState, dispatch?: (transaction: Transaction) => void) => {
      if (dispatch) {
        dispatch(transactions.changeMonth('previous'));
      }
      return true;
    },

  goToNextWeek:
    () =>
    (state: CalendarState, dispatch?: (transaction: Transaction) => void) => {
      const currentDate = new Date(state.currentDate);
      currentDate.setDate(currentDate.getDate() + 7);

      if (dispatch) {
        dispatch(transactions.selectDate(currentDate));
      }
      return true;
    },

  goToPreviousWeek:
    () =>
    (state: CalendarState, dispatch?: (transaction: Transaction) => void) => {
      const currentDate = new Date(state.currentDate);
      currentDate.setDate(currentDate.getDate() - 7);

      if (dispatch) {
        dispatch(transactions.selectDate(currentDate));
      }
      return true;
    },

  goToNextDay:
    () =>
    (state: CalendarState, dispatch?: (transaction: Transaction) => void) => {
      const currentDate = new Date(state.currentDate);
      currentDate.setDate(currentDate.getDate() + 1);

      if (dispatch) {
        dispatch(transactions.selectDate(currentDate));
      }
      return true;
    },

  goToPreviousDay:
    () =>
    (state: CalendarState, dispatch?: (transaction: Transaction) => void) => {
      const currentDate = new Date(state.currentDate);
      currentDate.setDate(currentDate.getDate() - 1);

      if (dispatch) {
        dispatch(transactions.selectDate(currentDate));
      }
      return true;
    },

  goToToday:
    () =>
    (_state: CalendarState, dispatch?: (transaction: Transaction) => void) => {
      if (dispatch) {
        dispatch(transactions.selectDate(new Date()));
      }
      return true;
    },

  // 날짜 선택 커맨드
  selectDate:
    (date: Date) =>
    (_state: CalendarState, dispatch?: (transaction: Transaction) => void) => {
      if (!(date instanceof Date) || isNaN(date.getTime())) {
        return false;
      }

      if (dispatch) {
        dispatch(transactions.selectDate(date));
      }
      return true;
    },

  // 뷰 변경 커맨드
  changeView:
    (viewType: string) =>
    (_state: CalendarState, dispatch?: (transaction: Transaction) => void) => {
      const allowedViews = [
        'month',
        'week',
        'day',
        'timeline',
        'gantt',
        'list',
      ];

      if (!allowedViews.includes(viewType)) {
        return false;
      }

      if (dispatch) {
        dispatch(transactions.changeView(viewType));
      }
      return true;
    },

  // 범위 선택 커맨드
  selectRange:
    (start: Date, end: Date) =>
    (_state: CalendarState, dispatch?: (transaction: Transaction) => void) => {
      if (!(start instanceof Date) || !(end instanceof Date)) {
        return false;
      }

      if (start > end) {
        return false;
      }

      if (dispatch) {
        dispatch(transactions.selectRange(start, end));
      }
      return true;
    },

  clearSelection:
    () =>
    (_state: CalendarState, dispatch?: (transaction: Transaction) => void) => {
      if (dispatch) {
        dispatch(transactions.clearSelection());
      }
      return true;
    },

  // 플러그인 관리 커맨드
  enablePlugin:
    (pluginId: string) =>
    (_state: CalendarState, dispatch?: (transaction: Transaction) => void) => {
      if (!pluginId || typeof pluginId !== 'string') {
        return false;
      }

      if (dispatch) {
        dispatch(transactions.enablePlugin(pluginId));
      }
      return true;
    },

  disablePlugin:
    (pluginId: string) =>
    (_state: CalendarState, dispatch?: (transaction: Transaction) => void) => {
      if (!pluginId || typeof pluginId !== 'string') {
        return false;
      }

      if (dispatch) {
        dispatch(transactions.disablePlugin(pluginId));
      }
      return true;
    },
};

/**
 * Command Manager
 * 커맨드의 등록, 실행, 관리를 담당
 */
export class CommandManager {
  private commands: Map<string, Command | ((...args: unknown[]) => Command)> =
    new Map();
  private pluginCommands: Map<string, Set<string>> = new Map(); // pluginKey -> command names

  constructor() {
    this.registerCommands(coreCommands);
  }

  /**
   * 커맨드 등록
   */
  registerCommand(
    name: string,
    command: Command | ((...args: unknown[]) => Command),
    pluginKey?: string
  ): void {
    this.commands.set(name, command);
    
    // 플러그인 커맨드 추적
    if (pluginKey) {
      if (!this.pluginCommands.has(pluginKey)) {
        this.pluginCommands.set(pluginKey, new Set());
      }
      this.pluginCommands.get(pluginKey)!.add(name);
    }
  }

  /**
   * 여러 커맨드 일괄 등록
   */
  registerCommands(commandMap: CommandMap, pluginKey?: string): void {
    for (const [name, command] of Object.entries(commandMap)) {
      this.registerCommand(name, command, pluginKey);
    }
  }

  /**
   * 커맨드 제거
   */
  unregisterCommand(name: string): boolean {
    // 플러그인 커맨드 추적에서도 제거
    for (const [pluginKey, commandNames] of this.pluginCommands.entries()) {
      if (commandNames.has(name)) {
        commandNames.delete(name);
        if (commandNames.size === 0) {
          this.pluginCommands.delete(pluginKey);
        }
        break;
      }
    }
    
    return this.commands.delete(name);
  }

  /**
   * 플러그인의 모든 커맨드 제거
   */
  unregisterPluginCommands(pluginKey: string): boolean {
    const commandNames = this.pluginCommands.get(pluginKey);
    if (!commandNames) {
      return false;
    }

    // 모든 커맨드 제거
    for (const commandName of commandNames) {
      this.commands.delete(commandName);
    }

    // 플러그인 커맨드 추적 제거
    this.pluginCommands.delete(pluginKey);
    return true;
  }

  /**
   * 커맨드 실행
   */
  executeCommand(
    name: string,
    state: CalendarState,
    dispatch?: (transaction: Transaction) => void,
    ...args: unknown[]
  ): boolean {
    const command = this.commands.get(name);

    if (!command) {
      console.warn(`Command '${name}' not found`);
      return false;
    }

    try {
      // 커맨드가 함수를 반환하는 팩토리인지 확인
      if (typeof command === 'function') {
        // 먼저 팩토리 함수로 호출해보기
        if (args.length > 0) {
          const actualCommand = (command as any)(...args);
          if (typeof actualCommand === 'function') {
            return actualCommand(state, dispatch);
          }
        }
        // 직접 커맨드인 경우
        return (command as Command)(state, dispatch);
      }
      return false;
    } catch (error) {
      console.error(`Error executing command '${name}':`, error);
      return false;
    }
  }

  /**
   * 등록된 커맨드 목록
   */
  getCommandNames(): string[] {
    return Array.from(this.commands.keys());
  }

  /**
   * 커맨드 존재 여부 확인
   */
  hasCommand(name: string): boolean {
    return this.commands.has(name);
  }

  /**
   * 플러그인 커맨드 목록 조회
   */
  getPluginCommands(pluginKey: string): string[] {
    const commandNames = this.pluginCommands.get(pluginKey);
    return commandNames ? Array.from(commandNames) : [];
  }

  /**
   * 모든 커맨드 초기화
   */
  clear(): void {
    this.commands.clear();
    this.pluginCommands.clear();
    this.registerCommands(coreCommands);
  }
}

/**
 * Command Validator
 * 커맨드 실행 전 유효성 검증
 */
export class CommandValidator {
  /**
   * 커맨드 시그니처 검증
   */
  static validateCommand(command: Command): boolean {
    if (typeof command !== 'function') {
      throw new Error('Command must be a function');
    }

    // 커맨드는 최소 1개의 매개변수(state)를 받아야 함
    if (command.length < 1) {
      throw new Error('Command must accept at least one parameter (state)');
    }

    return true;
  }

  /**
   * 커맨드 실행 전 상태 검증
   */
  static validateState(state: CalendarState): boolean {
    if (!state || typeof state !== 'object') {
      throw new Error('State must be a valid CalendarState object');
    }

    // 필수 필드 확인
    const requiredFields = [
      'currentDate',
      'viewType',
      'timeRange',
      'days',
      'pluginStates',
    ];
    for (const field of requiredFields) {
      if (!(field in state)) {
        throw new Error(`State missing required field: ${field}`);
      }
    }

    return true;
  }

  /**
   * 날짜 매개변수 검증
   */
  static validateDateParameter(date: unknown): boolean {
    if (!(date instanceof Date)) {
      throw new Error('Date parameter must be a Date object');
    }

    if (isNaN(date.getTime())) {
      throw new Error('Date parameter must be a valid date');
    }

    return true;
  }
}

/**
 * Command Composer
 * 여러 커맨드를 조합하여 복합 커맨드 생성
 */
export class CommandComposer {
  /**
   * 순차 실행 커맨드 생성
   */
  static sequence(...commands: Command[]): Command {
    return (state: CalendarState, dispatch) => {
      const currentState = state;

      for (const command of commands) {
        try {
          CommandValidator.validateCommand(command);
          const result = command(currentState, dispatch);

          if (!result) {
            return false; // 하나라도 실패하면 전체 실패
          }
        } catch (error) {
          console.error('Error in command sequence:', error);
          return false;
        }
      }

      return true;
    };
  }

  /**
   * 조건부 실행 커맨드 생성
   */
  static conditional(
    condition: (state: CalendarState) => boolean,
    trueCommand: Command,
    falseCommand?: Command
  ): Command {
    return (state: CalendarState, dispatch) => {
      try {
        if (condition(state)) {
          return trueCommand(state, dispatch);
        } else if (falseCommand) {
          return falseCommand(state, dispatch);
        }
        return true;
      } catch (error) {
        console.error('Error in conditional command:', error);
        return false;
      }
    };
  }

  /**
   * 재시도 커맨드 생성
   */
  static retry(
    command: Command,
    maxAttempts: number = 3,
    delay: number = 0
  ): Command {
    return (state: CalendarState, dispatch) => {
      let success = false;

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          const result = command(state, dispatch);
          if (result) {
            success = true;
            break;
          }
        } catch (error) {
          console.warn(`Command attempt ${attempt} failed:`, error);
        }

        if (attempt < maxAttempts && delay > 0) {
          // 동기적으로 처리하거나 콜백으로 지연 처리
          // setTimeout은 비동기이므로 여기서는 제거
        }
      }

      return success;
    };
  }

  /**
   * 병렬 실행 커맨드 생성 (모두 성공해야 성공)
   */
  static parallel(...commands: Command[]): Command {
    return (state: CalendarState, dispatch) => {
      const results = commands.map(command => {
        try {
          return command(state, dispatch);
        } catch (error) {
          console.error('Error in parallel command:', error);
          return false;
        }
      });

      return results.every(result => result === true);
    };
  }
}

/**
 * Command History
 * 실행된 커맨드의 히스토리 관리
 */
export class CommandHistory {
  private history: Array<{
    name: string;
    args: unknown[];
    timestamp: number;
    success: boolean;
  }> = [];

  private maxHistory: number = 100;

  /**
   * 커맨드 실행 기록 추가
   */
  record(name: string, args: any[], success: boolean): void {
    this.history.push({
      name,
      args,
      timestamp: Date.now(),
      success,
    });

    // 히스토리 크기 제한
    if (this.history.length > this.maxHistory) {
      this.history = this.history.slice(-this.maxHistory);
    }
  }

  /**
   * 히스토리 조회
   */
  getHistory(filter?: {
    success?: boolean;
    name?: string;
    limit?: number;
  }): Array<{
    name: string;
    args: unknown[];
    timestamp: number;
    success: boolean;
  }> {
    let filtered = this.history;

    if (filter) {
      if (filter.success !== undefined) {
        filtered = filtered.filter(entry => entry.success === filter.success);
      }

      if (filter.name) {
        filtered = filtered.filter(entry => entry.name === filter.name);
      }

      if (filter.limit) {
        filtered = filtered.slice(-filter.limit);
      }
    }

    return [...filtered];
  }

  /**
   * 히스토리 초기화
   */
  clear(): void {
    this.history = [];
  }

  /**
   * 최근 실행된 커맨드
   */
  getLastCommand(): {
    name: string;
    args: unknown[];
    timestamp: number;
    success: boolean;
  } | null {
    return this.history.length > 0
      ? this.history[this.history.length - 1]
      : null;
  }
}
