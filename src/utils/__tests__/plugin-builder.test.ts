/**
 * 플러그인 빌더 테스트
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  PluginBuilder,
  createPluginBuilder,
  PluginPresets,
  DecorationBuilders,
  EventHandlerBuilders,
} from '../plugin-builder';
import { CalendarStateFactory } from '../../core/state';
import type { CalendarState } from '@/types';

// Mock CalendarState for tests
const createMockCalendarState = (): CalendarState => ({
  currentDate: new Date('2024-01-15'),
  viewType: 'month' as const,
  timeRange: {
    start: new Date('2024-01-01'),
    end: new Date('2024-01-31'),
  },
  days: [],
  pluginStates: new Map(),
  timezone: 'UTC',
});

describe('PluginBuilder', () => {
  let builder: PluginBuilder;

  beforeEach(() => {
    builder = new PluginBuilder();
  });

  it('should create a plugin builder instance', () => {
    expect(builder).toBeInstanceOf(PluginBuilder);
  });

  it('should build a plugin with key', () => {
    const plugin = builder.withKey('testPlugin').build();

    expect(plugin.spec.key).toBe('testPlugin');
  });

  it('should throw error when building without key', () => {
    expect(() => builder.build()).toThrow('Plugin key is required');
  });

  it('should set initial state correctly', () => {
    const initialState = { testValue: 42, isActive: true };

    const plugin = builder
      .withKey('testPlugin')
      .withInitialState(initialState)
      .build();

    const calendarState = CalendarStateFactory.create([plugin]);
    const pluginState = plugin.getState(calendarState);

    expect(pluginState?.value).toMatchObject(initialState);
  });

  it('should add dependencies correctly', () => {
    const plugin = builder
      .withKey('testPlugin')
      .dependsOn('dependency1', 'dependency2')
      .dependsOn('dependency3')
      .build();

    expect(plugin.spec.dependencies).toEqual([
      'dependency1',
      'dependency2',
      'dependency3',
    ]);
  });

  it('should set priority correctly', () => {
    const plugin = builder.withKey('testPlugin').withPriority(150).build();

    expect(plugin.spec.priority).toBe(150);
  });

  it('should add transaction handlers', () => {
    const handler = vi.fn((_state, payload) => ({ testValue: payload.value }));

    const plugin = builder
      .withKey('testPlugin')
      .onTransaction('TEST_ACTION', handler)
      .build();

    const calendarState = CalendarStateFactory.create([plugin]);
    const pluginState = plugin.getState(calendarState);

    if (pluginState) {
      const newState = pluginState.apply({
        type: 'TEST_ACTION',
        payload: { value: 'test' },
        meta: new Map(),
      });

      expect(handler).toHaveBeenCalledWith(pluginState.value, {
        value: 'test',
      });
      expect(newState.value).toMatchObject({ testValue: 'test' });
    }
  });

  it('should add commands correctly', () => {
    const commandFn = vi.fn(() => (_state: any, _dispatch: any) => true);

    const plugin = builder
      .withKey('testPlugin')
      .addCommand('testCommand', commandFn)
      .build();

    const commands = plugin.spec.commands?.(plugin);
    expect(commands?.testCommand).toBeInstanceOf(Function);
  });

  it('should add event handlers', () => {
    const dateClickHandler = vi.fn(() => false);
    const keyDownHandler = vi.fn(() => false);

    const plugin = builder
      .withKey('testPlugin')
      .onDateClick(dateClickHandler)
      .onKeyDown(keyDownHandler)
      .build();

    const props = plugin.spec.props;
    expect(props?.handleDateClick).toBeInstanceOf(Function);
    expect(props?.handleKeyDown).toBeInstanceOf(Function);
  });

  it('should chain multiple configuration methods', () => {
    const plugin = builder
      .withKey('chainedPlugin')
      .withInitialState({ value: 1 })
      .dependsOn('dep1')
      .withPriority(200)
      .onTransaction('TEST', (_state, payload) => ({
        value: (payload as any).newValue,
      }))
      .addCommand('cmd', () => () => true)
      .onDateClick(() => false)
      .build();

    expect(plugin.spec.key).toBe('chainedPlugin');
    expect(plugin.spec.dependencies).toEqual(['dep1']);
    expect(plugin.spec.priority).toBe(200);
    expect(plugin.spec.commands).toBeInstanceOf(Function);
    expect(plugin.spec.props?.handleDateClick).toBeInstanceOf(Function);
  });
});

describe('createPluginBuilder', () => {
  it('should create a new plugin builder instance', () => {
    const builder = createPluginBuilder();
    expect(builder).toBeInstanceOf(PluginBuilder);
  });

  it('should create typed plugin builder', () => {
    interface TestState {
      count: number;
      name: string;
    }

    const builder = createPluginBuilder<TestState>();
    const plugin = builder
      .withKey('typedPlugin')
      .withInitialState({ count: 0, name: 'test' })
      .onTransaction('INCREMENT', (state, _payload) => ({
        count: state.count + 1,
      }))
      .build();

    expect(plugin.spec.key).toBe('typedPlugin');
  });
});

describe('PluginPresets', () => {
  describe('dataCollector', () => {
    it('should create a data collector plugin', () => {
      const plugin = PluginPresets.dataCollector('collector').build();

      expect(plugin.spec.key).toBe('collector');

      const calendarState = CalendarStateFactory.create([plugin]);
      const pluginState = plugin.getState(calendarState);

      expect(pluginState?.value.items).toEqual([]);
      expect(pluginState?.value.settings).toEqual({});
    });

    it('should handle add item command', () => {
      const plugin = PluginPresets.dataCollector('collector').build();
      const commands = plugin.spec.commands?.(plugin);

      expect(commands?.addItem).toBeInstanceOf(Function);

      const mockDispatch = vi.fn();
      const testItem = { id: 1, name: 'test' };

      const command = commands!.addItem;
      expect(typeof command).toBe('function');
      const result = command(testItem)(createMockCalendarState(), mockDispatch);

      expect(result).toBe(true);
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'ADD_ITEM',
        payload: { item: testItem },
        meta: new Map([['source', 'collector']]),
      });
    });

    it('should handle remove item command', () => {
      const plugin = PluginPresets.dataCollector('collector').build();
      const commands = plugin.spec.commands?.(plugin);

      const mockDispatch = vi.fn();
      const command = commands!.removeItem;
      expect(typeof command).toBe('function');
      const result = command(1)(createMockCalendarState(), mockDispatch);

      expect(result).toBe(true);
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'REMOVE_ITEM',
        payload: { index: 1 },
        meta: new Map([['source', 'collector']]),
      });
    });

    it('should handle clear items command', () => {
      const plugin = PluginPresets.dataCollector('collector').build();
      const commands = plugin.spec.commands?.(plugin);

      const mockDispatch = vi.fn();
      const command = commands!.clearItems;
      expect(typeof command).toBe('function');
      const result = command()(createMockCalendarState(), mockDispatch);

      expect(result).toBe(true);
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'CLEAR_ITEMS',
        payload: {},
        meta: new Map([['source', 'collector']]),
      });
    });
  });

  describe('dateBasedState', () => {
    it('should create a date-based state plugin', () => {
      const plugin = PluginPresets.dateBasedState(
        'dateState',
        'defaultValue'
      ).build();

      expect(plugin.spec.key).toBe('dateState');

      const calendarState = CalendarStateFactory.create([plugin]);
      const pluginState = plugin.getState(calendarState);

      expect(pluginState?.value.dateStates).toBeInstanceOf(Map);
    });

    it('should handle set date state command', () => {
      const plugin = PluginPresets.dateBasedState(
        'dateState',
        'default'
      ).build();
      const commands = plugin.spec.commands?.(plugin);

      const mockDispatch = vi.fn();
      const testDate = new Date('2024-01-15');
      const testValue = 'testValue';

      const command = commands!.setDateState;
      expect(typeof command).toBe('function');
      const result = command(testDate, testValue)(
        createMockCalendarState(),
        mockDispatch
      );

      expect(result).toBe(true);
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'SET_DATE_STATE',
        payload: {
          dateKey: '2024-01-15',
          value: testValue,
        },
        meta: new Map([['source', 'dateState']]),
      });
    });
  });

  describe('stateToggler', () => {
    it('should create a state toggler plugin', () => {
      const plugin = PluginPresets.stateToggler('toggler', 'isActive').build();

      expect(plugin.spec.key).toBe('toggler');

      const calendarState = CalendarStateFactory.create([plugin]);
      const pluginState = plugin.getState(calendarState);

      expect(pluginState?.value.isActive).toBe(false);
    });

    it('should handle toggle command', () => {
      const plugin = PluginPresets.stateToggler('toggler').build();
      const commands = plugin.spec.commands?.(plugin);

      const mockDispatch = vi.fn();
      const command = commands!.toggle;
      expect(typeof command).toBe('function');
      const result = command()(createMockCalendarState(), mockDispatch);

      expect(result).toBe(true);
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'TOGGLE_STATE',
        payload: { key: 'isEnabled' },
        meta: new Map([['source', 'toggler']]),
      });
    });

    it('should handle enable/disable commands', () => {
      const plugin = PluginPresets.stateToggler('toggler').build();
      const commands = plugin.spec.commands?.(plugin);

      const mockDispatch = vi.fn();

      // Test enable
      const enableCommand = commands!.enable;
      expect(typeof enableCommand).toBe('function');
      enableCommand()(createMockCalendarState(), mockDispatch);
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'SET_STATE',
        payload: { key: 'isEnabled', value: true },
        meta: new Map([['source', 'toggler']]),
      });

      // Test disable
      mockDispatch.mockClear();
      const disableCommand = commands!.disable;
      expect(typeof disableCommand).toBe('function');
      disableCommand()(createMockCalendarState(), mockDispatch);
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'SET_STATE',
        payload: { key: 'isEnabled', value: false },
        meta: new Map([['source', 'toggler']]),
      });
    });
  });

  describe('eventListener', () => {
    it('should create an event listener plugin', () => {
      const plugin = PluginPresets.eventListener('listener').build();

      expect(plugin.spec.key).toBe('listener');

      const calendarState = CalendarStateFactory.create([plugin]);
      const pluginState = plugin.getState(calendarState);

      expect(pluginState?.value.events).toEqual([]);
    });

    it('should handle log event command', () => {
      const plugin = PluginPresets.eventListener('listener').build();
      const commands = plugin.spec.commands?.(plugin);

      const mockDispatch = vi.fn();
      const result = commands!.logEvent('test_event', { data: 'test' })(
        {} as any,
        mockDispatch
      );

      expect(result).toBe(true);
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'LOG_EVENT',
        payload: { type: 'test_event', data: { data: 'test' } },
        meta: new Map([['source', 'listener']]),
      });
    });
  });
});

describe('DecorationBuilders', () => {
  it('should build highlight decorations', () => {
    const dates = [new Date('2024-01-01'), new Date('2024-01-02')];
    const decorationFn = DecorationBuilders.highlightDates(
      dates,
      'custom-highlight'
    );

    const decorationSet = decorationFn({} as any, {});

    expect(decorationSet).toBeDefined();
    // 실제 데코레이션 내용은 DecorationSet의 구현에 따라 달라짐
  });

  it('should build badge decorations', () => {
    const dateMap = new Map([
      [new Date('2024-01-01'), 'Badge 1'],
      [new Date('2024-01-02'), 'Badge 2'],
    ]);

    const decorationFn = DecorationBuilders.badgeDates(dateMap, 'custom-badge');
    const decorationSet = decorationFn({} as any, {});

    expect(decorationSet).toBeDefined();
  });

  it('should build conditional highlight decorations', () => {
    const condition = vi.fn((date: Date) => date.getDay() === 0); // 일요일만
    const decorationFn = DecorationBuilders.conditionalHighlight(
      condition,
      'sunday-highlight'
    );

    const mockState = {
      currentDate: new Date('2024-01-15'),
    } as any;

    const decorationSet = decorationFn(mockState, {});

    expect(decorationSet).toBeDefined();
    expect(condition).toHaveBeenCalled();
  });
});

describe('EventHandlerBuilders', () => {
  it('should create click prevention handler', () => {
    const condition = vi.fn(() => true);
    const handler = EventHandlerBuilders.preventClickOnCondition(condition);

    const mockEvent = {
      preventDefault: vi.fn(),
    } as any;

    const result = handler(new Date(), mockEvent, {} as any, {});

    expect(result).toBe(true);
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(condition).toHaveBeenCalled();
  });

  it('should create click logger handler', () => {
    const logFn = vi.fn();
    const handler = EventHandlerBuilders.logClicks(logFn);

    const testDate = new Date('2024-01-15');
    const result = handler(testDate, {} as any, {} as any, {});

    expect(result).toBe(false);
    expect(logFn).toHaveBeenCalledWith(testDate, expect.any(Number));
  });

  it('should create keyboard shortcuts handler', () => {
    const shortcuts = {
      a: vi.fn(),
      b: vi.fn(),
      escape: vi.fn(),
    };

    const handler = EventHandlerBuilders.keyboardShortcuts(shortcuts);

    // Test matching shortcut
    const mockEvent1 = {
      key: 'a',
      preventDefault: vi.fn(),
    } as any;

    const result1 = handler(mockEvent1, createMockCalendarState(), {});

    expect(result1).toBe(true);
    expect(shortcuts.a).toHaveBeenCalled();
    expect(mockEvent1.preventDefault).toHaveBeenCalled();

    // Test non-matching shortcut
    const mockEvent2 = {
      key: 'x',
      preventDefault: vi.fn(),
    } as any;

    const result2 = handler(mockEvent2, createMockCalendarState(), {});

    expect(result2).toBe(false);
    expect(mockEvent2.preventDefault).not.toHaveBeenCalled();
  });
});

// 통합 테스트
describe('Plugin Builder Integration', () => {
  it('should create complex plugin using builder pattern', () => {
    interface ComplexPluginState {
      counter: number;
      items: string[];
      isActive: boolean;
    }

    const plugin = createPluginBuilder<ComplexPluginState>()
      .withKey('complexPlugin')
      .withInitialState({
        counter: 0,
        items: [],
        isActive: true,
      })
      .dependsOn('basePlugin')
      .withPriority(150)
      .onTransaction('INCREMENT', (state, payload) => ({
        counter: state.counter + ((payload as any).amount || 1),
      }))
      .onTransaction('ADD_ITEM', (state, payload) => ({
        items: [...state.items, (payload as any).item],
      }))
      .onTransaction('TOGGLE_ACTIVE', state => ({
        isActive: !state.isActive,
      }))
      .addCommand('increment', (amount = 1) => (_state, dispatch) => {
        dispatch?.({
          type: 'INCREMENT',
          payload: { amount },
          meta: new Map([['source', 'complexPlugin']]),
        });
        return true;
      })
      .addCommand('addItem', (item: string) => (_state, dispatch) => {
        dispatch?.({
          type: 'ADD_ITEM',
          payload: { item },
          meta: new Map([['source', 'complexPlugin']]),
        });
        return true;
      })
      .onDateClick((_date, _event, _state, pluginState) => {
        if (!pluginState.isActive) return false;

        // 클릭시 카운터 증가
        const calendar = (window as any).__calendarInstance;
        calendar?.execCommand('increment', 1);
        return false;
      })
      .onKeyDown((event, _state, _pluginState) => {
        if (event.key === 'Space') {
          const calendar = (window as any).__calendarInstance;
          calendar?.execCommand('toggleActive');
          return true;
        }
        return false;
      })
      .filterTransactions((transaction, _state) => {
        // 비활성 상태에서는 INCREMENT 차단
        if (transaction.type === 'INCREMENT') {
          // 실제 구현에서는 상태를 확인해야 함
          return true; // 테스트용 간단화
        }
        return true;
      })
      .build();

    // 플러그인 검증
    expect(plugin.spec.key).toBe('complexPlugin');
    expect(plugin.spec.dependencies).toEqual(['basePlugin']);
    expect(plugin.spec.priority).toBe(150);

    const calendarState = CalendarStateFactory.create([plugin]);
    const pluginState = plugin.getState(calendarState);

    expect(pluginState?.value).toMatchObject({
      counter: 0,
      items: [],
      isActive: true,
    });

    // 커맨드 테스트
    const commands = plugin.spec.commands?.(plugin);
    expect(commands?.increment).toBeInstanceOf(Function);
    expect(commands?.addItem).toBeInstanceOf(Function);

    // 이벤트 핸들러 테스트
    const props = plugin.spec.props;
    expect(props?.handleDateClick).toBeInstanceOf(Function);
    expect(props?.handleKeyDown).toBeInstanceOf(Function);

    // 트랜잭션 필터 테스트
    expect(plugin.spec.filterTransaction).toBeInstanceOf(Function);
  });
});
