/**
 * CalendarView 클래스
 * 캘린더의 핵심 뷰 관리 시스템
 */

import { CalendarState, Transaction } from '@/types';
import { Plugin, PluginManager } from './plugin';
import { CommandManager } from './command';
import { DecorationManager, DecorationSet } from './decoration';
import { CalendarStateFactory, StateUpdater } from './state';
import { TransactionHistory, TransactionValidator } from './transaction';

export interface CalendarViewOptions {
  plugins?: Plugin[];
  initialState?: Partial<CalendarState>;
}

/**
 * CalendarView 클래스
 * 캘린더의 핵심 뷰 및 상태 관리
 */
export class CalendarView {
  private state: CalendarState;
  private pluginManager: PluginManager;
  private commandManager: CommandManager;
  private decorationManager: DecorationManager;
  private transactionHistory: TransactionHistory;
  private isDestroyed = false;

  // 이벤트 콜백들
  private onStateChangeCallbacks: Array<(state: CalendarState) => void> = [];
  private onTransactionCallbacks: Array<(transaction: Transaction) => void> =
    [];

  constructor(options: CalendarViewOptions = {}) {
    // 매니저들 초기화
    this.pluginManager = new PluginManager();
    this.commandManager = new CommandManager();
    this.decorationManager = new DecorationManager();
    this.transactionHistory = new TransactionHistory();

    // 플러그인 등록
    if (options.plugins) {
      this.pluginManager.registerAll(options.plugins);
    }

    // 플러그인 커맨드를 커맨드 매니저에 등록
    for (const plugin of this.pluginManager.getAll()) {
      const commands = plugin.getCommands();
      this.commandManager.registerCommands(commands, plugin.key);
    }

    // 초기 상태 생성
    this.state = this.createInitialState(options.initialState);
  }

  /**
   * 현재 상태 반환
   */
  getState(): CalendarState {
    return this.state;
  }

  /**
   * 트랜잭션 디스패치 (핵심 메서드)
   */
  dispatch(transaction: Transaction): void {
    if (this.isDestroyed) {
      console.warn('Cannot dispatch transaction on destroyed CalendarView');
      return;
    }

    try {
      // 1. 트랜잭션 검증
      TransactionValidator.validate(transaction);

      // 2. 플러그인 필터링
      if (!this.pluginManager.filterTransaction(transaction, this.state)) {
        return;
      }

      // 3. 트랜잭션 히스토리에 추가
      this.transactionHistory.add(transaction);

      // 4. 상태 업데이트
      const oldState = this.state;
      this.state = this.applyTransaction(transaction);

      // 5. 추가 트랜잭션 처리
      const additionalTransactions = this.pluginManager.appendTransactions(
        [transaction],
        oldState,
        this.state
      );

      // 6. 플러그인 메시지 처리
      const messageTransactions = this.pluginManager.processMessages(
        this.state
      );
      additionalTransactions.push(...messageTransactions);

      // 7. 콜백 호출
      this.onTransactionCallbacks.forEach(callback => callback(transaction));
      this.onStateChangeCallbacks.forEach(callback => callback(this.state));

      // 8. 상태 변경 완료

      // 9. 추가 트랜잭션 재귀 처리
      additionalTransactions.forEach(tr => this.dispatch(tr));
    } catch (error) {
      console.error('Error dispatching transaction:', error);
    }
  }

  /**
   * 커맨드 실행
   */
  execCommand(commandName: string, ...args: unknown[]): boolean {
    return this.commandManager.executeCommand(
      commandName,
      this.state,
      this.dispatch.bind(this),
      ...args
    );
  }

  /**
   * 플러그인 쿼리
   */
  query<T = unknown>(
    pluginKey: string,
    queryName: string,
    ...args: unknown[]
  ): T {
    return this.pluginManager.query<T>(
      pluginKey,
      queryName,
      this.state,
      ...args
    );
  }

  /**
   * 데코레이션 데이터 반환
   */
  getDecorations(): DecorationSet {
    if (this.isDestroyed) return new DecorationSet();

    try {
      return this.pluginManager.getAllDecorations(this.state);
    } catch (error) {
      console.error('Error getting decorations:', error);
      return new DecorationSet();
    }
  }

  /**
   * 상태 변경 리스너 등록
   */
  onStateChange(callback: (state: CalendarState) => void): () => void {
    this.onStateChangeCallbacks.push(callback);

    // 구독 해제 함수 반환
    return () => {
      const index = this.onStateChangeCallbacks.indexOf(callback);
      if (index > -1) {
        this.onStateChangeCallbacks.splice(index, 1);
      }
    };
  }

  /**
   * 트랜잭션 리스너 등록
   */
  onTransaction(callback: (transaction: Transaction) => void): () => void {
    this.onTransactionCallbacks.push(callback);

    return () => {
      const index = this.onTransactionCallbacks.indexOf(callback);
      if (index > -1) {
        this.onTransactionCallbacks.splice(index, 1);
      }
    };
  }

  /**
   * Undo/Redo 지원
   */
  undo(): boolean {
    const transaction = this.transactionHistory.undo();
    if (transaction) {
      // Undo 로직 구현 (상태 롤백)
      // 실제로는 더 복잡한 구현이 필요
      return true;
    }
    return false;
  }

  redo(): boolean {
    const transaction = this.transactionHistory.redo();
    if (transaction) {
      // Redo 로직 구현
      return true;
    }
    return false;
  }

  /**
   * 등록된 플러그인 목록 조회
   */
  getPlugins(): Plugin[] {
    return this.pluginManager.getAll();
  }

  /**
   * 특정 플러그인 조회
   */
  getPlugin(key: string): Plugin | null {
    return this.pluginManager.get(key) ?? null;
  }

  /**
   * 정리
   */
  destroy(): void {
    if (this.isDestroyed) return;

    // 데코레이션 정리
    this.decorationManager.dispose();

    // 플러그인 정리
    this.pluginManager.clear();

    // 콜백 정리
    this.onStateChangeCallbacks = [];
    this.onTransactionCallbacks = [];

    // 상태 초기화
    this.transactionHistory.clear();

    this.isDestroyed = true;
  }

  /**
   * 초기 상태 생성
   */
  private createInitialState(options?: Partial<CalendarState>): CalendarState {
    const baseState = CalendarStateFactory.createInitialState({
      currentDate: options?.currentDate,
      viewType: options?.viewType,
      timeRange: options?.timeRange,
      timezone: options?.timezone,
    });

    // 플러그인 상태 초기화
    const pluginStates = new Map(baseState.pluginStates);

    for (const plugin of this.pluginManager.getAll()) {
      if (plugin.spec.state) {
        const initialState = plugin.spec.state.init();
        pluginStates.set(plugin.key, initialState);
      }
    }

    return {
      ...baseState,
      ...options,
      pluginStates,
    };
  }

  /**
   * 트랜잭션 적용
   */
  private applyTransaction(transaction: Transaction): CalendarState {
    let newState = { ...this.state };

    // 1. 코어 상태 업데이트
    newState = this.applyCoreTransaction(transaction, newState);

    // 2. 플러그인 상태 업데이트
    newState = this.applyPluginTransactions(transaction, newState);

    return newState;
  }

  /**
   * 코어 트랜잭션 적용
   */
  private applyCoreTransaction(
    transaction: Transaction,
    state: CalendarState
  ): CalendarState {
    switch (transaction.type) {
      case 'SELECT_DATE':
        return StateUpdater.updateCurrentDate(state, transaction.payload.date);

      case 'CHANGE_MONTH':
        return StateUpdater.navigateMonth(state, transaction.payload.direction);

      case 'CHANGE_VIEW':
        return StateUpdater.updateViewType(state, transaction.payload.viewType);

      case 'CHANGE_TIMEZONE':
        return StateUpdater.updateTimezone(state, transaction.payload.timezone);

      default:
        return state;
    }
  }

  /**
   * 플러그인 트랜잭션 적용
   */
  private applyPluginTransactions(
    transaction: Transaction,
    state: CalendarState
  ): CalendarState {
    const newPluginStates = new Map(state.pluginStates);

    for (const plugin of this.pluginManager.getAll()) {
      if (plugin.spec.state) {
        const currentState = newPluginStates.get(plugin.key);
        if (currentState) {
          const newState = plugin.spec.state.apply(transaction, currentState);
          newPluginStates.set(plugin.key, newState);
        }
      }
    }

    return {
      ...state,
      pluginStates: newPluginStates,
    };
  }

  /**
   * 날짜 클릭 처리 (헤드리스 방식)
   */
  handleDateClick(date: Date, event?: MouseEvent): boolean {
    const handled = this.pluginManager.handleEvent(
      'dateClick',
      { date, event },
      this.state
    );

    if (!handled) {
      // 기본 날짜 선택 동작
      this.execCommand('selectDate', date);
      return true;
    }
    return handled;
  }

  /**
   * 키보드 이벤트 처리 (헤드리스 방식)
   */
  handleKeyDown(event: KeyboardEvent): boolean {
    const handled = this.pluginManager.handleEvent(
      'keyDown',
      { event },
      this.state
    );

    if (!handled) {
      // 기본 키보드 네비게이션
      return this.handleDefaultKeyboard(event);
    }
    return handled;
  }

  /**
   * 드래그 시작 처리 (헤드리스 방식)
   */
  handleDragStart(event: DragEvent): boolean {
    // 드래그 로직은 플러그인에서 처리하도록 위임
    return this.pluginManager.handleEvent('drag', { event }, this.state);
  }

  /**
   * 기본 키보드 네비게이션
   */
  private handleDefaultKeyboard(event: KeyboardEvent): boolean {
    switch (event.key) {
      case 'ArrowLeft':
        this.execCommand('goToPreviousDay');
        return true;
      case 'ArrowRight':
        this.execCommand('goToNextDay');
        return true;
      case 'ArrowUp':
        this.execCommand('goToPreviousWeek');
        return true;
      case 'ArrowDown':
        this.execCommand('goToNextWeek');
        return true;
      case 'Home':
        this.execCommand('goToToday');
        return true;
      default:
        return false;
    }
  }
}
