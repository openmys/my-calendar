/**
 * 커스텀 플러그인 개발 예시들
 * 라이브러리 사용자가 참고할 수 있는 실제 플러그인 구현 예시입니다.
 */

import { 
  createCustomPlugin, 
  PluginTemplates 
} from '../utils/plugin-factory';
import { 
  createPluginBuilder, 
  PluginPresets 
} from '../utils/plugin-builder';
import { DecorationSet } from '../core/decoration';

/**
 * 예시 1: 간단한 하이라이트 플러그인
 * 특정 날짜들을 하이라이트하는 기본적인 플러그인입니다.
 */
export function createSimpleHighlightPlugin() {
  return PluginTemplates.createHighlightPlugin({
    key: 'simpleHighlight',
    highlightDates: [
      new Date('2024-01-01'), // 신정
      new Date('2024-12-25'), // 크리스마스
    ],
    highlightClass: 'holiday-highlight'
  });
}

/**
 * Todo 아이템 인터페이스
 */
export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  date: string;
  createdAt: Date;
}

/**
 * 노트 인터페이스
 */
export interface Note {
  id: string;
  text: string;
  date: string;
  color: string;
  createdAt: Date;
}

/**
 * 예시 2: 할일 추가 플러그인
 * 날짜를 클릭하면 할일을 추가할 수 있는 플러그인입니다.
 */
export function createTodoPlugin() {

  return createCustomPlugin<{
    todos: TodoItem[];
    showCompleted: boolean;
  }>({
    key: 'todoPlugin',
    initialState: {
      todos: [],
      showCompleted: true
    },
    stateHandlers: {
      'ADD_TODO': (state, payload) => ({
        todos: [...state.todos, {
          id: Date.now().toString(),
          text: payload.text,
          completed: false,
          date: payload.date,
          createdAt: new Date()
        }]
      }),
      'TOGGLE_TODO': (state, payload) => ({
        todos: state.todos.map(todo => 
          todo.id === payload.id 
            ? { ...todo, completed: !todo.completed }
            : todo
        )
      }),
      'REMOVE_TODO': (state, payload) => ({
        todos: state.todos.filter(todo => todo.id !== payload.id)
      }),
      'TOGGLE_SHOW_COMPLETED': (state) => ({
        showCompleted: !state.showCompleted
      })
    },
    commands: {
      addTodo: (dateStr: string, text: string) => (_state, dispatch) => {
        dispatch?.({
          type: 'ADD_TODO',
          payload: { date: dateStr, text },
          meta: new Map([['source', 'todoPlugin']])
        });
        return true;
      },
      toggleTodo: (id: string) => (_state, dispatch) => {
        dispatch?.({
          type: 'TOGGLE_TODO',
          payload: { id },
          meta: new Map([['source', 'todoPlugin']])
        });
        return true;
      },
      removeTodo: (id: string) => (_state, dispatch) => {
        dispatch?.({
          type: 'REMOVE_TODO',
          payload: { id },
          meta: new Map([['source', 'todoPlugin']])
        });
        return true;
      }
    },
    decorationFactory: (_state, pluginState) => {
      const decorations = pluginState.todos
        .filter(todo => pluginState.showCompleted || !todo.completed)
        .map(todo => ({
          type: 'highlight' as const,
          from: new Date(todo.date),
          spec: {
            class: `todo-badge ${todo.completed ? 'completed' : 'pending'}`,
            'data-todo-count': '1',
            title: todo.text
          }
        }));
      
      return new DecorationSet(decorations);
    },
    eventHandlers: {
      onDateClick: (date, event, _state, _pluginState) => {
        // 더블클릭시 할일 추가 프롬프트
        if (event.detail === 2) {
          const todoText = prompt('할일을 입력하세요:');
          if (todoText) {
            const calendar = window.__calendarInstance;
            calendar?.execCommand('addTodo', date.toISOString().split('T')[0], todoText);
          }
          return true; // 이벤트 소비
        }
        return false;
      }
    }
  });
}

/**
 * 날씨 데이터 인터페이스
 */
export interface WeatherData {
  date: string;
  temperature: number;
  condition: string;
  icon: string;
}

/**
 * 예시 3: 날씨 정보 플러그인
 * 외부 API에서 날씨 정보를 가져와 표시하는 플러그인입니다.
 */
export function createWeatherPlugin(apiKey: string) {

  return createCustomPlugin<{
    weatherData: WeatherData[];
    loading: boolean;
    lastUpdate: Date | null;
  }>({
    key: 'weatherPlugin',
    initialState: {
      weatherData: [],
      loading: false,
      lastUpdate: null
    },
    stateHandlers: {
      'START_WEATHER_FETCH': (_state) => ({
        loading: true
      }),
      'WEATHER_FETCH_SUCCESS': (_state, payload) => ({
        weatherData: payload.data,
        loading: false,
        lastUpdate: new Date()
      }),
      'WEATHER_FETCH_ERROR': (_state) => ({
        loading: false
      })
    },
    commands: {
      fetchWeather: (location: string) => (_state, dispatch) => {
        dispatch?.({
          type: 'START_WEATHER_FETCH',
          payload: {},
          meta: new Map([['source', 'weatherPlugin']])
        });

        // 비동기 처리를 내부적으로 실행 (Promise는 반환하지 않음)
        (async () => {
          try {
            // 실제 날씨 API 호출 (예시)
            const response = await fetch(`https://api.weather.com/forecast?location=${location}&key=${apiKey}`);
            const data = await response.json();
            
            dispatch?.({
              type: 'WEATHER_FETCH_SUCCESS',
              payload: { data: data.forecast },
              meta: new Map([['source', 'weatherPlugin']])
            });
          } catch (error) {
            dispatch?.({
              type: 'WEATHER_FETCH_ERROR',
              payload: { error },
              meta: new Map([['source', 'weatherPlugin']])
            });
          }
        })();

        return true; // 명령이 시작되었음을 표시
      }
    },
    decorationFactory: (_state, pluginState) => {
      if (pluginState.loading) {
        return new DecorationSet();
      }

      const decorations = pluginState.weatherData.map(weather => ({
        type: 'highlight' as const,
        from: new Date(weather.date),
        spec: {
          class: 'weather-info',
          'data-weather': `${weather.temperature}°C ${weather.condition}`,
          title: `날씨: ${weather.condition}, 온도: ${weather.temperature}°C`
        }
      }));

      return new DecorationSet(decorations);
    }
  });
}

/**
 * 예시 4: 빌더 패턴을 사용한 커스텀 플러그인
 * 더 복잡한 설정이 필요한 플러그인을 빌더 패턴으로 만드는 예시입니다.
 */
export function createAdvancedCounterPlugin(options: {
  maxCount?: number;
  resetDaily?: boolean;
  showBadge?: boolean;
}) {
  return createPluginBuilder<{
    counts: Map<string, number>;
    settings: typeof options;
    lastReset: Date | null;
  }>()
    .withKey('advancedCounter')
    .withInitialState({
      counts: new Map(),
      settings: options,
      lastReset: null
    })
    .onTransaction('INCREMENT_COUNT', (state, payload) => {
      const dateKey = (payload as any).date;
      const currentCount = state.counts.get(dateKey) ?? 0;
      const maxCount = state.settings.maxCount ?? Infinity;
      
      if (currentCount >= maxCount) {
        return state; // 최대 카운트 도달
      }

      const newCounts = new Map(state.counts);
      newCounts.set(dateKey, currentCount + 1);
      
      return { counts: newCounts };
    })
    .onTransaction('RESET_COUNTS', (_state) => ({
      counts: new Map(),
      lastReset: new Date()
    }))
    .onTransaction('DAILY_RESET_CHECK', (state) => {
      if (!state.settings.resetDaily || !state.lastReset) {
        return state;
      }

      const today = new Date();
      const lastReset = state.lastReset;
      
      // 날짜가 바뀌었으면 리셋
      if (today.toDateString() !== lastReset.toDateString()) {
        return {
          counts: new Map(),
          lastReset: today
        };
      }
      
      return state;
    })
    .addCommand('incrementCount', (date: Date) => (_state, dispatch) => {
      const dateKey = date.toISOString().split('T')[0];
      dispatch?.({
        type: 'INCREMENT_COUNT',
        payload: { date: dateKey },
        meta: new Map([['source', 'advancedCounter']])
      });
      return true;
    })
    .addCommand('resetCounts', () => (_state, dispatch) => {
      dispatch?.({
        type: 'RESET_COUNTS',
        payload: {},
        meta: new Map([['source', 'advancedCounter']])
      });
      return true;
    })
    .onDateClick((date, _event, _state, _pluginState) => {
      // 일일 리셋 체크
      const calendar = window.__calendarInstance;
      calendar?.execCommand('checkDailyReset');
      calendar?.execCommand('incrementCount', date);
      return false;
    })
    .withDecorations((_state, pluginState) => {
      if (!pluginState.settings.showBadge) {
        return new DecorationSet();
      }

      const decorations = Array.from(pluginState.counts.entries())
        .filter(([, count]) => count > 0)
        .map(([dateKey, count]) => ({
          type: 'highlight' as const,
          from: new Date(dateKey),
          spec: {
            class: 'count-badge',
            'data-count': count.toString(),
            title: `클릭 횟수: ${count}`
          }
        }));

      return new DecorationSet(decorations);
    })
    .postProcessTransactions((transactions, _oldState, _newState) => {
      // 자동 일일 리셋 체크
      const hasUserAction = transactions.some(tr => 
        tr.meta.get('source') === 'user'
      );
      
      if (hasUserAction) {
        return {
          type: 'DAILY_RESET_CHECK',
          payload: {},
          meta: new Map([['source', 'advancedCounter'], ['auto', 'true']])
        };
      }
      
      return null;
    })
    .build();
}

/**
 * 예시 5: 프리셋을 사용한 데이터 컬렉터 플러그인
 * 미리 정의된 프리셋을 사용하여 빠르게 플러그인을 만드는 예시입니다.
 */
export function createNotesPlugin() {
  // Note 인터페이스는 상단에서 export됨

  return PluginPresets.dataCollector<Note>('notesPlugin')
    .withDecorations((_state, pluginState) => {
      const decorations = pluginState.items.map(note => ({
        type: 'highlight' as const,
        from: new Date(note.date),
        spec: {
          class: `note-highlight ${note.color}`,
          'data-note-id': note.id,
          title: note.text
        }
      }));

      return new DecorationSet(decorations);
    })
    .onDateClick((date, event, _state, _pluginState) => {
      if (event.ctrlKey || event.metaKey) {
        const noteText = prompt('메모를 입력하세요:');
        if (noteText) {
          const note: Note = {
            id: Date.now().toString(),
            text: noteText,
            date: date.toISOString().split('T')[0],
            color: 'yellow',
            createdAt: new Date()
          };
          
          const calendar = window.__calendarInstance;
          calendar?.execCommand('addItem', note);
        }
        return true;
      }
      return false;
    })
    .build();
}

/**
 * 예시 6: 상태 토글러를 사용한 다크모드 플러그인
 */
export function createDarkModePlugin() {
  return PluginPresets.stateToggler('darkMode', 'isDarkMode')
    .withInitialState({ isDarkMode: false })
    .onKeyDown((event, _state, _pluginState) => {
      // Ctrl+D로 다크모드 토글
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'd') {
        event.preventDefault();
        const calendar = window.__calendarInstance;
        calendar?.execCommand('toggle', 'isDarkMode');
        return true;
      }
      return false;
    })
    .postProcessTransactions((transactions, _oldState, _newState) => {
      // 다크모드 상태 변경시 CSS 클래스 적용
      const darkModeChanged = transactions.some(tr => 
        tr.type === 'SET_STATE' || tr.type === 'TOGGLE_STATE'
      );
      
      if (darkModeChanged) {
        // 실제로는 DOM 조작을 별도 시스템에서 처리
        const calendar = document.querySelector('.calendar');
        if (calendar) {
          // 새 상태에서 다크모드 여부 확인 (실제로는 플러그인 상태에서 가져와야 함)
          calendar.classList.toggle('dark-mode', true); // 예시
        }
      }
      
      return null;
    })
    .build();
}

/**
 * 사용 예시
 */
export function createExampleCalendar() {
  // 다양한 커스텀 플러그인들을 조합
  const plugins = [
    createSimpleHighlightPlugin(),
    createTodoPlugin(),
    createWeatherPlugin('your-api-key'),
    createAdvancedCounterPlugin({
      maxCount: 5,
      resetDaily: true,
      showBadge: true
    }),
    createNotesPlugin(),
    createDarkModePlugin()
  ];

  return plugins;
}

/**
 * React에서의 사용 예시
 */
export const ReactUsageExample = `
import React from 'react';
import { useCalendar, Calendar } from '@openmys/my-calendar/react';
import { createTodoPlugin, createWeatherPlugin } from './custom-plugins';

function MyCalendarApp() {
  const plugins = React.useMemo(() => [
    createTodoPlugin(),
    createWeatherPlugin(process.env.REACT_APP_WEATHER_API_KEY)
  ], []);

  const { state, execCommand } = useCalendar({ plugins });

  const handleDateClick = (date: Date) => {
    console.log('Date clicked:', date);
    // 플러그인에서 자동으로 처리됩니다
  };

  return (
    <div className="calendar-app">
      <h1>My Custom Calendar</h1>
      <button onClick={() => execCommand('fetchWeather', 'Seoul')}>
        날씨 정보 업데이트
      </button>
      <Calendar
        plugins={plugins}
        onDateClick={handleDateClick}
      />
    </div>
  );
}

export default MyCalendarApp;
`;

/**
 * 바닐라 JavaScript에서의 사용 예시
 */
export const VanillaUsageExample = `
import { CalendarView, CalendarStateFactory } from '@openmys/my-calendar';
import { createTodoPlugin, createNotesPlugin } from './custom-plugins';

// 플러그인 생성
const plugins = [
  createTodoPlugin(),
  createNotesPlugin()
];

// 캘린더 초기화
const initialState = CalendarStateFactory.create(plugins);
const calendarElement = document.getElementById('calendar');
const calendar = new CalendarView(calendarElement, initialState, plugins);

// 전역 참조 설정 (플러그인에서 사용하기 위해)
window.__calendarInstance = calendar;

// 커맨드 실행 예시
calendar.execCommand('addTodo', '2024-01-15', '회의 준비');
calendar.execCommand('toggle', 'isDarkMode');

// 상태 변경 구독
calendar.onStateChange((newState) => {
  console.log('Calendar state changed:', newState);
});
`;