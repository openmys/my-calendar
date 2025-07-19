/**
 * Plugin System Tests
 * 플러그인 시스템의 핵심 기능 테스트
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Plugin, PluginManager } from '../plugin';
import { PluginState, Transaction, Command } from '../../types';
import { CalendarState } from '../../types';
import { transactions } from '../transaction';

// 테스트용 플러그인 상태
class TestPluginState extends PluginState<{ count: number }> {
  apply(transaction: Transaction): TestPluginState {
    const newValue = { ...this.value };
    
    switch (transaction.type) {
      case 'TEST_INCREMENT':
        newValue.count += transaction.payload.amount || 1;
        break;
      case 'TEST_DECREMENT':
        newValue.count -= transaction.payload.amount || 1;
        break;
      case 'TEST_RESET':
        newValue.count = 0;
        break;
    }
    
    return new TestPluginState(newValue);
  }
  
  toJSON() {
    return this.value;
  }
  
  static fromJSON(value: { count: number }): TestPluginState {
    return new TestPluginState(value);
  }
}

// 테스트용 플러그인
function createTestPlugin(initialCount = 0): Plugin<{ count: number }> {
  return new Plugin({
    key: 'test',
    
    state: {
      init: () => new TestPluginState({ count: initialCount }),
      apply: (transaction, state) => state.apply(transaction)
    },
    
    commands: () => ({
      increment: (amount = 1) => (_state: CalendarState, dispatch?: (transaction: Transaction) => void) => {
        if (dispatch) {
          dispatch(transactions.custom('TEST_INCREMENT', { amount }));
        }
        return true;
      },
      
      decrement: (amount = 1) => (_state: CalendarState, dispatch?: (transaction: Transaction) => void) => {
        if (dispatch) {
          dispatch(transactions.custom('TEST_DECREMENT', { amount }));
        }
        return true;
      },
      
      reset: () => (_state: CalendarState, dispatch?: (transaction: Transaction) => void) => {
        if (dispatch) {
          dispatch(transactions.custom('TEST_RESET', {}));
        }
        return true;
      }
    }),
    
    queries: {
      getCount: (state, plugin) => {
        const testState = plugin.getState(state);
        return testState?.value.count ?? 0;
      }
    }
  });
}

describe('Plugin System', () => {
  let pluginManager: PluginManager;
  
  beforeEach(() => {
    pluginManager = new PluginManager();
  });
  
  describe('Plugin Registration', () => {
    it('should register a plugin successfully', () => {
      const plugin = createTestPlugin();
      pluginManager.register(plugin);
      
      expect(pluginManager.getPlugin('test')).toBe(plugin);
    });
    
    it('should throw error when registering duplicate plugin key', () => {
      const plugin1 = createTestPlugin();
      const plugin2 = createTestPlugin();
      
      pluginManager.register(plugin1);
      
      expect(() => {
        pluginManager.register(plugin2);
      }).toThrow('Plugin with key "test" is already registered');
    });
    
    it('should list all registered plugins', () => {
      const plugin1 = createTestPlugin();
      const plugin2 = new Plugin({ key: 'test2', state: { init: () => new TestPluginState({ count: 0 }), apply: (_tr, state) => state } });
      
      pluginManager.register(plugin1);
      pluginManager.register(plugin2);
      
      const plugins = pluginManager.getAll();
      expect(plugins).toHaveLength(2);
      expect(plugins.map(p => p.key)).toEqual(['test', 'test2']);
    });
  });
  
  describe('Plugin Dependencies', () => {
    it('should resolve plugin dependencies correctly', () => {
      const dependentPlugin = new Plugin({
        key: 'dependent',
        dependencies: ['test'],
        state: { init: () => new TestPluginState({ count: 0 }), apply: (_tr, state) => state }
      });
      
      const basePlugin = createTestPlugin();
      
      // 의존성이 있는 플러그인은 의존하는 플러그인 다음에 등록해야 함
      pluginManager.register(basePlugin);  // 먼저 'test' 플러그인 등록
      pluginManager.register(dependentPlugin);  // 그 다음 의존성이 있는 플러그인 등록
      
      const resolved = pluginManager.resolveDependencies();
      const keys = resolved.map(p => p.key);
      
      // 의존성이 있는 플러그인이 나중에 와야 함
      expect(keys.indexOf('test')).toBeLessThan(keys.indexOf('dependent'));
    });
    
    it('should detect circular dependencies', () => {
      // 순환 의존성을 테스트하기 위해 일시적으로 의존성 검증을 우회
      const plugin1 = new Plugin({
        key: 'plugin1',
        dependencies: ['plugin2'],
        state: { init: () => new TestPluginState({ count: 0 }), apply: (_tr, state) => state }
      });
      
      const plugin2 = new Plugin({
        key: 'plugin2',
        dependencies: ['plugin1'],
        state: { init: () => new TestPluginState({ count: 0 }), apply: (_tr, state) => state }
      });
      
      // 순환 의존성을 가진 플러그인들을 강제로 등록 (의존성 검사 우회)
      (pluginManager as unknown as { plugins: Map<string, Plugin> }).plugins.set('plugin1', plugin1);
      (pluginManager as unknown as { plugins: Map<string, Plugin> }).plugins.set('plugin2', plugin2);
      
      expect(() => {
        // sortPlugins 메서드를 직접 호출하여 순환 의존성 감지 테스트
        (pluginManager as unknown as { sortPlugins: () => void }).sortPlugins();
      }).toThrow('Circular dependency detected');
    });
  });
  
  describe('Plugin State Management', () => {
    it('should initialize plugin state correctly', () => {
      const plugin = createTestPlugin(10);
      const state = plugin.spec.state!.init();
      
      expect(state.value.count).toBe(10);
    });
    
    it('should apply transactions to plugin state', () => {
      const plugin = createTestPlugin(5);
      const initialState = plugin.spec.state!.init();
      
      const transaction = transactions.custom('TEST_INCREMENT', { amount: 3 });
      const newState = plugin.spec.state!.apply(transaction, initialState);
      
      expect(newState.value.count).toBe(8);
    });
    
    it('should maintain state immutability', () => {
      const plugin = createTestPlugin(5);
      const initialState = plugin.spec.state!.init();
      
      const transaction = transactions.custom('TEST_INCREMENT', { amount: 1 });
      const newState = plugin.spec.state!.apply(transaction, initialState);
      
      expect(initialState.value.count).toBe(5);
      expect(newState.value.count).toBe(6);
      expect(newState).not.toBe(initialState);
    });
  });
  
  describe('Plugin Commands', () => {
    it('should execute plugin commands', () => {
      const plugin = createTestPlugin();
      const commands = plugin.spec.commands!(plugin);
      
      const mockDispatch = vi.fn();
      const incrementCommandFactory = commands.increment as (amount: number) => Command;
      const incrementCommand = incrementCommandFactory(5);
      
      const mockState: CalendarState = {
        currentDate: new Date(),
        viewType: 'month',
        timeRange: { start: new Date(), end: new Date() },
        days: [],
        pluginStates: new Map(),
        timezone: 'UTC'
      };
      
      const result = incrementCommand(mockState, mockDispatch);
      
      expect(result).toBe(true);
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'TEST_INCREMENT',
          payload: { amount: 5 }
        })
      );
    });
    
    it('should handle commands without dispatch', () => {
      const plugin = createTestPlugin();
      const commands = plugin.spec.commands!(plugin);
      
      const incrementCommandFactory = commands.increment as (amount: number) => Command;
      const incrementCommand = incrementCommandFactory(5);
      const mockState: CalendarState = {
        currentDate: new Date(),
        viewType: 'month',
        timeRange: { start: new Date(), end: new Date() },
        days: [],
        pluginStates: new Map(),
        timezone: 'UTC'
      };
      
      const result = incrementCommand(mockState);
      
      expect(result).toBe(true);
    });
  });
  
  describe('Plugin Queries', () => {
    it('should execute plugin queries', () => {
      const plugin = createTestPlugin();
      const mockState: CalendarState = {
        currentDate: new Date(),
        viewType: 'month',
        timeRange: { start: new Date(), end: new Date() },
        days: [],
        pluginStates: new Map([
          ['test', new TestPluginState({ count: 42 })]
        ]),
        timezone: 'UTC'
      };
      
      const count = plugin.spec.queries!.getCount(mockState, plugin);
      expect(count).toBe(42);
    });
    
    it('should handle missing plugin state in queries', () => {
      const plugin = createTestPlugin();
      const mockState: CalendarState = {
        currentDate: new Date(),
        viewType: 'month',
        timeRange: { start: new Date(), end: new Date() },
        days: [],
        pluginStates: new Map(),
        timezone: 'UTC'
      };
      
      const count = plugin.spec.queries!.getCount(mockState, plugin);
      expect(count).toBe(0);
    });
  });
  
  describe('Plugin Serialization', () => {
    it('should serialize and deserialize plugin state', () => {
      const originalState = new TestPluginState({ count: 25 });
      const serialized = originalState.toJSON();
      const deserialized = TestPluginState.fromJSON(serialized);
      
      expect(deserialized.value.count).toBe(25);
      expect(deserialized).not.toBe(originalState);
    });
  });
  
  describe('Plugin Priority', () => {
    it('should sort plugins by priority', () => {
      const lowPriorityPlugin = new Plugin({
        key: 'low',
        priority: 100,
        state: { init: () => new TestPluginState({ count: 0 }), apply: (_tr, state) => state }
      });
      
      const highPriorityPlugin = new Plugin({
        key: 'high',
        priority: 1,
        state: { init: () => new TestPluginState({ count: 0 }), apply: (_tr, state) => state }
      });
      
      const mediumPriorityPlugin = new Plugin({
        key: 'medium',
        priority: 50,
        state: { init: () => new TestPluginState({ count: 0 }), apply: (_tr, state) => state }
      });
      
      pluginManager.register(lowPriorityPlugin);
      pluginManager.register(highPriorityPlugin);
      pluginManager.register(mediumPriorityPlugin);
      
      const sorted = pluginManager.resolveDependencies();
      const keys = sorted.map(p => p.key);
      
      expect(keys).toEqual(['high', 'medium', 'low']);
    });
  });
  
  describe('Plugin Messaging', () => {
    it('should handle plugin messages', () => {
      const receiverPlugin = new Plugin({
        key: 'receiver',
        state: { init: () => new TestPluginState({ count: 0 }), apply: (_tr, state) => state },
        handleMessage: (message, _state) => {
          if (message.type === 'PING') {
            return transactions.custom('TEST_INCREMENT', { amount: 1 });
          }
          return null;
        }
      });
      
      pluginManager.register(receiverPlugin);
      
      const message = {
        from: 'sender',
        to: 'receiver',
        type: 'PING',
        payload: {}
      };
      
      const mockState: CalendarState = {
        currentDate: new Date(),
        viewType: 'month',
        timeRange: { start: new Date(), end: new Date() },
        days: [],
        pluginStates: new Map(),
        timezone: 'UTC'
      };
      
      const result = pluginManager.handleMessage(message, mockState);
      expect(result).not.toBeNull();
      expect(result!.type).toBe('TEST_INCREMENT');
    });
  });
});