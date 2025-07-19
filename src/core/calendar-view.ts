/**
 * CalendarView 클래스
 * 캘린더의 핵심 뷰 관리 시스템
 */

import { CalendarState, Transaction } from '@/types';
import { Plugin, PluginManager } from './plugin';
import { CommandManager } from './command';
import { DecorationManager } from './decoration';
import { CalendarStateFactory, StateUpdater } from './state';
import { TransactionHistory, TransactionValidator } from './transaction';

export interface CalendarViewOptions {
  plugins?: Plugin[];
  initialState?: Partial<CalendarState>;
  autoRender?: boolean;
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
  private element: HTMLElement;
  private eventListeners: Map<string, EventListener> = new Map();
  private isDestroyed = false;
  private autoRender: boolean;

  // 이벤트 콜백들
  private onStateChangeCallbacks: Array<(state: CalendarState) => void> = [];
  private onTransactionCallbacks: Array<(transaction: Transaction) => void> =
    [];

  constructor(element: HTMLElement, options: CalendarViewOptions = {}) {
    this.element = element;
    this.autoRender = options.autoRender ?? true;

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
    const pluginCommands = this.pluginManager.getAllCommands();
    this.commandManager.registerCommands(pluginCommands);

    // 초기 상태 생성
    this.state = this.createInitialState(options.initialState);

    // DOM 이벤트 바인딩
    this.bindEvents();

    // 초기 렌더링
    if (this.autoRender) {
      this.render();
    }
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

      // 8. 렌더링
      if (this.autoRender) {
        this.render();
      }

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
  query(pluginKey: string, queryName: string, ...args: unknown[]): unknown {
    return this.pluginManager.query(pluginKey, queryName, this.state, ...args);
  }

  /**
   * 렌더링
   */
  render(): void {
    if (this.isDestroyed) return;

    try {
      // 1. 기본 캘린더 구조 렌더링
      this.renderCalendarStructure();

      // 2. 데코레이션 적용
      const decorations = this.pluginManager.getAllDecorations(this.state);
      this.decorationManager.updateDecorations(decorations);

      // 3. 접근성 속성 업데이트
      this.updateAccessibility();
    } catch (error) {
      console.error('Error during rendering:', error);
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
   * 플러그인 관리
   */
  addPlugin(plugin: Plugin): void {
    this.pluginManager.register(plugin);

    // 플러그인 커맨드 등록
    const commands = plugin.getCommands();
    this.commandManager.registerCommands(commands);

    // 플러그인 상태 초기화
    if (plugin.spec.state) {
      const initialPluginState = plugin.spec.state.init();
      this.state = StateUpdater.updatePluginState(
        this.state,
        plugin.key,
        initialPluginState
      );
    }

    if (this.autoRender) {
      this.render();
    }
  }

  removePlugin(pluginKey: string): boolean {
    const success = this.pluginManager.unregister(pluginKey);
    if (success) {
      // 플러그인 상태 제거
      this.state = StateUpdater.removePlugin(this.state, pluginKey);

      if (this.autoRender) {
        this.render();
      }
    }
    return success;
  }

  /**
   * 정리
   */
  destroy(): void {
    if (this.isDestroyed) return;

    // 이벤트 리스너 제거
    this.unbindEvents();

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
   * DOM 이벤트 바인딩
   */
  private bindEvents(): void {
    // 클릭 이벤트
    const clickHandler = (event: Event) => {
      const mouseEvent = event as MouseEvent;
      const target = mouseEvent.target as HTMLElement;
      const dateElement = target.closest('[data-date]') as HTMLElement;

      if (dateElement) {
        const dateStr = dateElement.getAttribute('data-date');
        if (dateStr) {
          const date = new Date(dateStr);
          this.handleDateClick(date, mouseEvent);
        }
      }
    };

    // 키보드 이벤트
    const keyDownHandler = (event: Event) => {
      const keyboardEvent = event as KeyboardEvent;
      this.handleKeyDown(keyboardEvent);
    };

    // 드래그 이벤트 (향후 확장)
    const dragStartHandler = (event: Event) => {
      const dragEvent = event as DragEvent;
      this.handleDragStart(dragEvent);
    };

    this.element.addEventListener('click', clickHandler);
    this.element.addEventListener('keydown', keyDownHandler);
    this.element.addEventListener('dragstart', dragStartHandler);

    // 리스너 저장 (정리용)
    this.eventListeners.set('click', clickHandler);
    this.eventListeners.set('keydown', keyDownHandler);
    this.eventListeners.set('dragstart', dragStartHandler);
  }

  /**
   * DOM 이벤트 제거
   */
  private unbindEvents(): void {
    for (const [eventType, listener] of this.eventListeners) {
      this.element.removeEventListener(eventType, listener);
    }
    this.eventListeners.clear();
  }

  /**
   * 날짜 클릭 처리
   */
  private handleDateClick(date: Date, event: MouseEvent): void {
    const handled = this.pluginManager.handleEvent(
      'dateClick',
      { date, event },
      this.state
    );

    if (!handled) {
      // 기본 날짜 선택 동작
      this.execCommand('selectDate', date);
    }
  }

  /**
   * 키보드 이벤트 처리
   */
  private handleKeyDown(event: KeyboardEvent): void {
    const handled = this.pluginManager.handleEvent(
      'keyDown',
      { event },
      this.state
    );

    if (!handled) {
      // 기본 키보드 네비게이션
      this.handleDefaultKeyboard(event);
    }
  }

  /**
   * 드래그 시작 처리
   */
  private handleDragStart(event: DragEvent): void {
    // 드래그 로직은 플러그인에서 처리하도록 위임
    this.pluginManager.handleEvent('drag', { event }, this.state);
  }

  /**
   * 기본 키보드 네비게이션
   */
  private handleDefaultKeyboard(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowLeft':
        this.execCommand('goToPreviousDay');
        event.preventDefault();
        break;
      case 'ArrowRight':
        this.execCommand('goToNextDay');
        event.preventDefault();
        break;
      case 'ArrowUp':
        this.execCommand('goToPreviousWeek');
        event.preventDefault();
        break;
      case 'ArrowDown':
        this.execCommand('goToNextWeek');
        event.preventDefault();
        break;
      case 'Home':
        this.execCommand('goToToday');
        event.preventDefault();
        break;
    }
  }

  /**
   * 캘린더 구조 렌더링
   */
  private renderCalendarStructure(): void {
    // 기본 캘린더 HTML 구조 생성
    if (!this.element.querySelector('.calendar-container')) {
      this.element.innerHTML = `
        <div class="calendar-container">
          <div class="calendar-header">
            <button class="calendar-nav-prev" data-command="goToPreviousMonth">‹</button>
            <h2 class="calendar-title">${this.formatCurrentMonth()}</h2>
            <button class="calendar-nav-next" data-command="goToNextMonth">›</button>
          </div>
          <div class="calendar-body">
            ${this.renderCalendarGrid()}
          </div>
        </div>
      `;

      // 네비게이션 버튼 이벤트
      this.bindNavigationEvents();
    } else {
      // 기존 구조가 있으면 내용만 업데이트
      this.updateCalendarContent();
    }

    // 날짜 요소들을 데코레이션 매니저에 등록
    this.registerDateElements();
  }

  /**
   * 캘린더 그리드 렌더링
   */
  private renderCalendarGrid(): string {
    const { days } = this.state;
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    let html = '<table class="calendar-grid"><thead><tr>';

    // 요일 헤더
    for (const weekday of weekdays) {
      html += `<th class="calendar-weekday">${weekday}</th>`;
    }
    html += '</tr></thead><tbody>';

    // 날짜 그리드
    let currentWeek: string[] = [];
    for (const day of days) {
      const dayOfWeek = day.date.getDay();

      if (dayOfWeek === 0 && currentWeek.length > 0) {
        // 새로운 주 시작
        html += `<tr>${currentWeek.join('')}</tr>`;
        currentWeek = [];
      }

      const classes = [
        'calendar-day',
        day.isToday ? 'today' : '',
        day.isWeekend ? 'weekend' : '',
      ]
        .filter(Boolean)
        .join(' ');

      currentWeek.push(`
        <td class="${classes}" 
            data-date="${day.date.toISOString()}"
            tabindex="0">
          <span class="calendar-day-number">${day.date.getDate()}</span>
        </td>
      `);
    }

    if (currentWeek.length > 0) {
      html += `<tr>${currentWeek.join('')}</tr>`;
    }

    html += '</tbody></table>';
    return html;
  }

  /**
   * 현재 월 포맷
   */
  private formatCurrentMonth(): string {
    return this.state.currentDate.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
    });
  }

  /**
   * 캘린더 내용 업데이트
   */
  private updateCalendarContent(): void {
    const titleElement = this.element.querySelector('.calendar-title');
    if (titleElement) {
      titleElement.textContent = this.formatCurrentMonth();
    }

    const bodyElement = this.element.querySelector('.calendar-body');
    if (bodyElement) {
      bodyElement.innerHTML = this.renderCalendarGrid();
    }

    this.registerDateElements();
  }

  /**
   * 네비게이션 버튼 이벤트 바인딩
   */
  private bindNavigationEvents(): void {
    const commandButtons = this.element.querySelectorAll('[data-command]');

    commandButtons.forEach(button => {
      button.addEventListener('click', event => {
        const command = (event.target as HTMLElement).getAttribute(
          'data-command'
        );
        if (command) {
          this.execCommand(command);
        }
      });
    });
  }

  /**
   * 날짜 요소들을 데코레이션 매니저에 등록
   */
  private registerDateElements(): void {
    const dateElements = this.element.querySelectorAll('[data-date]');

    dateElements.forEach(element => {
      const dateStr = element.getAttribute('data-date');
      if (dateStr) {
        const date = new Date(dateStr);
        this.decorationManager.registerElement(date, element as HTMLElement);
      }
    });
  }

  /**
   * 접근성 속성 업데이트
   */
  private updateAccessibility(): void {
    const container = this.element.querySelector('.calendar-container');
    if (container) {
      container.setAttribute('role', 'grid');
      container.setAttribute('aria-label', 'Calendar');
    }

    const grid = this.element.querySelector('.calendar-grid');
    if (grid) {
      grid.setAttribute('role', 'grid');
    }

    // 날짜 셀들에 ARIA 속성 추가
    const dateCells = this.element.querySelectorAll('.calendar-day');
    dateCells.forEach(cell => {
      cell.setAttribute('role', 'gridcell');
      cell.setAttribute('aria-selected', 'false');
    });
  }
}
