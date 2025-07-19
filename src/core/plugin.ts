/**
 * Plugin System 구현
 * ProseMirror 스타일의 플러그인 아키텍처
 */

import { 
  CalendarState, 
  PluginState, 
  Transaction, 
  CommandMap, 
  PluginMessage,
  DragData,
  ResizeData
} from '@/types';
import { DecorationSet } from './decoration';

/**
 * 플러그인 인터페이스
 */
export interface PluginSpec<T = any> {
  key: string;
  
  // 플러그인 의존성
  dependencies?: string[];
  priority?: number;

  // 상태 관리
  state?: {
    init: (config?: any) => PluginState<T>;
    apply: (transaction: Transaction, state: PluginState<T>) => PluginState<T>;
  };

  // 커맨드 제공
  commands?: (plugin: Plugin<T>) => CommandMap;

  // 데코레이션 제공
  decorations?: (state: CalendarState, plugin: Plugin<T>) => DecorationSet;

  // 이벤트 핸들러
  props?: {
    handleDateClick?: (
      date: Date,
      event: MouseEvent,
      state: CalendarState,
      plugin: Plugin<T>
    ) => boolean;
    handleTimeClick?: (
      datetime: Date,
      event: MouseEvent,
      state: CalendarState,
      plugin: Plugin<T>
    ) => boolean;
    handleKeyDown?: (
      event: KeyboardEvent,
      state: CalendarState,
      plugin: Plugin<T>
    ) => boolean;
    handleDrag?: (
      dragData: DragData,
      state: CalendarState,
      plugin: Plugin<T>
    ) => boolean;
    handleResize?: (
      resizeData: ResizeData,
      state: CalendarState,
      plugin: Plugin<T>
    ) => boolean;
  };

  // 트랜잭션 후킹
  filterTransaction?: (
    transaction: Transaction,
    state: CalendarState,
    plugin: Plugin<T>
  ) => boolean;
  
  appendTransaction?: (
    transactions: Transaction[],
    oldState: CalendarState,
    newState: CalendarState,
    plugin: Plugin<T>
  ) => Transaction | null;
  
  // 플러그인 쿼리
  queries?: {
    [queryName: string]: (state: CalendarState, plugin: Plugin<T>, ...args: any[]) => any;
  };
  
  // 플러그인 간 메시지 처리
  handleMessage?: (
    message: PluginMessage,
    state: CalendarState,
    plugin: Plugin<T>
  ) => Transaction | null;

  // 플러그인 생명주기
  onCreate?: (plugin: Plugin<T>) => void;
  onDestroy?: (plugin: Plugin<T>) => void;
}

/**
 * Plugin 클래스
 */
export class Plugin<T = any> {
  constructor(public spec: PluginSpec<T>) {
    // 플러그인 생성 시 콜백 호출
    if (this.spec.onCreate) {
      this.spec.onCreate(this);
    }
  }

  get key(): string {
    return this.spec.key;
  }

  get dependencies(): string[] {
    return this.spec.dependencies || [];
  }

  get priority(): number {
    return this.spec.priority || 0;
  }

  /**
   * 플러그인의 현재 상태 가져오기
   */
  getState(calendarState: CalendarState): PluginState<T> | undefined {
    return calendarState.pluginStates.get(this.key) as PluginState<T>;
  }

  /**
   * 플러그인이 제공하는 커맨드 가져오기
   */
  getCommands(): CommandMap {
    return this.spec.commands ? this.spec.commands(this) : {};
  }

  /**
   * 플러그인의 데코레이션 가져오기
   */
  getDecorations(state: CalendarState): DecorationSet {
    return this.spec.decorations ? this.spec.decorations(state, this) : new DecorationSet();
  }

  /**
   * 쿼리 실행
   */
  query(name: string, state: CalendarState, ...args: any[]): any {
    if (!this.spec.queries || !this.spec.queries[name]) {
      return undefined;
    }
    return this.spec.queries[name](state, this, ...args);
  }

  /**
   * 플러그인 정리
   */
  destroy(): void {
    if (this.spec.onDestroy) {
      this.spec.onDestroy(this);
    }
  }
}

/**
 * 플러그인 관리자
 */
export class PluginManager {
  private plugins: Map<string, Plugin> = new Map();
  private sortedPlugins: Plugin[] = [];
  private messageQueue: PluginMessage[] = [];

  /**
   * 플러그인 등록
   */
  register(plugin: Plugin): void {
    // 중복 확인
    if (this.plugins.has(plugin.key)) {
      throw new Error(`Plugin with key "${plugin.key}" is already registered`);
    }
    
    // 의존성 확인
    this.validateDependencies(plugin);
    
    this.plugins.set(plugin.key, plugin);
    this.sortPlugins();
  }

  /**
   * 여러 플러그인 일괄 등록
   */
  registerAll(plugins: Plugin[]): void {
    // 의존성 순서로 정렬하여 등록
    const sortedByDependency = this.sortByDependencies(plugins);
    
    for (const plugin of sortedByDependency) {
      this.register(plugin);
    }
  }

  /**
   * 플러그인 제거
   */
  unregister(pluginKey: string): boolean {
    const plugin = this.plugins.get(pluginKey);
    if (plugin) {
      plugin.destroy();
      this.plugins.delete(pluginKey);
      this.sortPlugins();
      return true;
    }
    return false;
  }

  /**
   * 플러그인 가져오기
   */
  get(pluginKey: string): Plugin | undefined {
    return this.plugins.get(pluginKey);
  }

  /**
   * 플러그인 가져오기 (별칭)
   */
  getPlugin(pluginKey: string): Plugin | undefined {
    return this.get(pluginKey);
  }

  /**
   * 모든 플러그인 가져오기 (우선순위 순)
   */
  getAll(): Plugin[] {
    return [...this.sortedPlugins];
  }

  /**
   * 플러그인 존재 여부 확인
   */
  has(pluginKey: string): boolean {
    return this.plugins.has(pluginKey);
  }

  /**
   * 모든 플러그인의 커맨드 수집
   */
  getAllCommands(): CommandMap {
    const allCommands: CommandMap = {};
    
    for (const plugin of this.sortedPlugins) {
      const commands = plugin.getCommands();
      Object.assign(allCommands, commands);
    }
    
    return allCommands;
  }

  /**
   * 모든 플러그인의 데코레이션 수집
   */
  getAllDecorations(state: CalendarState): DecorationSet {
    let decorations = new DecorationSet();
    
    for (const plugin of this.sortedPlugins) {
      const pluginDecorations = plugin.getDecorations(state);
      decorations = decorations.addAll(pluginDecorations.decorations);
    }
    
    return decorations;
  }

  /**
   * 트랜잭션 필터링
   */
  filterTransaction(transaction: Transaction, state: CalendarState): boolean {
    for (const plugin of this.sortedPlugins) {
      if (plugin.spec.filterTransaction) {
        if (!plugin.spec.filterTransaction(transaction, state, plugin)) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * 추가 트랜잭션 생성
   */
  appendTransactions(
    transactions: Transaction[],
    oldState: CalendarState,
    newState: CalendarState
  ): Transaction[] {
    const additionalTransactions: Transaction[] = [];
    
    for (const plugin of this.sortedPlugins) {
      if (plugin.spec.appendTransaction) {
        const additional = plugin.spec.appendTransaction(transactions, oldState, newState, plugin);
        if (additional) {
          additionalTransactions.push(additional);
        }
      }
    }
    
    return additionalTransactions;
  }

  /**
   * 이벤트 처리
   */
  handleEvent(
    eventType: string,
    eventData: any,
    state: CalendarState
  ): boolean {
    for (const plugin of this.sortedPlugins) {
      const props = plugin.spec.props;
      if (!props) continue;

      let handled = false;
      
      switch (eventType) {
        case 'dateClick':
          if (props.handleDateClick) {
            handled = props.handleDateClick(eventData.date, eventData.event, state, plugin);
          }
          break;
        case 'timeClick':
          if (props.handleTimeClick) {
            handled = props.handleTimeClick(eventData.datetime, eventData.event, state, plugin);
          }
          break;
        case 'keyDown':
          if (props.handleKeyDown) {
            handled = props.handleKeyDown(eventData.event, state, plugin);
          }
          break;
        case 'drag':
          if (props.handleDrag) {
            handled = props.handleDrag(eventData.dragData, state, plugin);
          }
          break;
        case 'resize':
          if (props.handleResize) {
            handled = props.handleResize(eventData.resizeData, state, plugin);
          }
          break;
      }

      if (handled) {
        return true; // 이벤트가 처리되면 더 이상 전파하지 않음
      }
    }
    
    return false;
  }

  /**
   * 플러그인 간 메시지 전송
   */
  sendMessage(message: PluginMessage): void {
    this.messageQueue.push(message);
  }

  /**
   * 메시지 처리
   */
  processMessages(state: CalendarState): Transaction[] {
    const transactions: Transaction[] = [];
    const messages = [...this.messageQueue];
    this.messageQueue = [];

    for (const message of messages) {
      const targetPlugin = this.plugins.get(message.to);
      if (targetPlugin && targetPlugin.spec.handleMessage) {
        const transaction = targetPlugin.spec.handleMessage(message, state, targetPlugin);
        if (transaction) {
          transactions.push(transaction);
        }
      }
    }

    return transactions;
  }

  /**
   * 쿼리 실행
   */
  query(pluginKey: string, queryName: string, state: CalendarState, ...args: any[]): any {
    const plugin = this.plugins.get(pluginKey);
    return plugin ? plugin.query(queryName, state, ...args) : undefined;
  }

  /**
   * 모든 플러그인 정리
   */
  clear(): void {
    for (const plugin of this.plugins.values()) {
      plugin.destroy();
    }
    this.plugins.clear();
    this.sortedPlugins = [];
  }

  /**
   * 의존성과 우선순위로 정렬된 플러그인 목록 반환
   */
  resolveDependencies(): Plugin[] {
    return [...this.sortedPlugins];
  }

  /**
   * 메시지 핸들링
   */
  handleMessage(message: PluginMessage, state: CalendarState): Transaction | null {
    const targetPlugin = this.plugins.get(message.to);
    if (targetPlugin && targetPlugin.spec.handleMessage) {
      return targetPlugin.spec.handleMessage(message, state, targetPlugin);
    }
    return null;
  }

  /**
   * 의존성 검증
   */
  private validateDependencies(plugin: Plugin): void {
    if (!plugin.dependencies) return;
    
    for (const dependency of plugin.dependencies) {
      if (!this.plugins.has(dependency)) {
        throw new Error(`Plugin ${plugin.key} depends on ${dependency}, but it's not registered`);
      }
    }
  }

  /**
   * 플러그인을 우선순위와 의존성에 따라 정렬
   */
  private sortPlugins(): void {
    const plugins = Array.from(this.plugins.values());
    this.sortedPlugins = this.sortByDependencies(plugins);
  }

  /**
   * 의존성을 고려한 플러그인 정렬
   */
  private sortByDependencies(plugins: Plugin[]): Plugin[] {
    const sorted: Plugin[] = [];
    const visited = new Set<string>();
    const visiting = new Set<string>();

    const visit = (plugin: Plugin) => {
      if (visiting.has(plugin.key)) {
        throw new Error(`Circular dependency detected involving plugin: ${plugin.key}`);
      }
      
      if (visited.has(plugin.key)) {
        return;
      }

      visiting.add(plugin.key);

      // 의존성 먼저 처리
      if (plugin.dependencies) {
        for (const depKey of plugin.dependencies) {
          const dependency = plugins.find(p => p.key === depKey);
          if (dependency) {
            visit(dependency);
          }
        }
      }

      visiting.delete(plugin.key);
      visited.add(plugin.key);
      sorted.push(plugin);
    };

    for (const plugin of plugins) {
      visit(plugin);
    }

    // 우선순위로 2차 정렬 (낮은 숫자가 먼저)
    return sorted.sort((a, b) => a.priority - b.priority);
  }
}

/**
 * 플러그인 팩토리 헬퍼
 */
export class PluginFactory {
  /**
   * 간단한 상태 플러그인 생성
   */
  static createSimpleStatePlugin<T>(
    key: string,
    initialState: T,
    handlers: Partial<{
      handleTransaction: (transaction: Transaction, state: T) => T;
      handleDateClick: (date: Date, event: MouseEvent, state: T) => boolean;
      createDecorations: (calendarState: CalendarState, state: T) => DecorationSet;
    }>
  ): Plugin<T> {
    return new Plugin({
      key,
      state: {
        init: () => new (class extends PluginState<T> {
          apply(transaction: Transaction): PluginState<T> {
            if (handlers.handleTransaction) {
              const newState = handlers.handleTransaction(transaction, this.value);
              return new (this.constructor as any)(newState);
            }
            return this;
          }
          toJSON() { return this.value; }
          static fromJSON(value: T) { return new (this as any)(value); }
        })(initialState),
        apply: (transaction, state) => state.apply(transaction)
      },
      decorations: handlers.createDecorations ? 
        (calendarState, plugin) => {
          const pluginState = plugin.getState(calendarState);
          return pluginState ? handlers.createDecorations!(calendarState, pluginState.value) : new DecorationSet();
        } : undefined,
      props: {
        handleDateClick: handlers.handleDateClick ? 
          (date, event, calendarState, plugin) => {
            const pluginState = plugin.getState(calendarState);
            return pluginState ? handlers.handleDateClick!(date, event, pluginState.value) : false;
          } : undefined
      }
    });
  }

  /**
   * 커맨드 전용 플러그인 생성
   */
  static createCommandPlugin(key: string, commands: CommandMap): Plugin {
    return new Plugin({
      key,
      commands: () => commands
    });
  }

  /**
   * 데코레이션 전용 플러그인 생성
   */
  static createDecorationPlugin(
    key: string,
    decorationFactory: (state: CalendarState) => DecorationSet
  ): Plugin {
    return new Plugin({
      key,
      decorations: decorationFactory
    });
  }
}