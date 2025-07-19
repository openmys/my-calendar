/**
 * Event Management Plugin
 * 이벤트 추가, 수정, 삭제 기능을 제공하는 플러그인
 */

import { Plugin, PluginSpec } from '@/core/plugin';
import { PluginState, Transaction, CalendarState } from '@/types';
import { DecorationSet, DecorationFactory } from '@/core/decoration';
import { transactions } from '@/core/transaction';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  allDay?: boolean;
  color?: string;
  category?: string;
  metadata?: Record<string, any>;
  recurrence?: RecurrenceRule;
}

export interface RecurrenceRule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval?: number; // 간격 (예: 2주마다 = interval: 2, frequency: 'weekly')
  endDate?: Date;
  count?: number; // 반복 횟수
  daysOfWeek?: number[]; // 요일 (0=일요일, 1=월요일, ...)
  dayOfMonth?: number; // 월의 특정 일
}

export interface EventOptions {
  allowOverlap?: boolean; // 이벤트 겹침 허용 여부
  maxEventsPerDay?: number; // 하루 최대 이벤트 수
  defaultDuration?: number; // 기본 이벤트 지속 시간 (분)
  allowPastEvents?: boolean; // 과거 이벤트 생성 허용
  categories?: string[]; // 허용된 카테고리 목록
}

export interface EventState {
  events: Map<string, CalendarEvent>;
  selectedEventId: string | null;
  editingEventId: string | null;
  options: EventOptions;
  eventsByDate: Map<string, string[]>; // 날짜별 이벤트 ID 캐시
}

/**
 * Event Plugin State 클래스
 */
class EventPluginState extends PluginState<EventState> {
  apply(transaction: Transaction): EventPluginState {
    const newValue = { ...this.value };
    newValue.events = new Map(this.value.events);
    newValue.eventsByDate = new Map(this.value.eventsByDate);

    switch (transaction.type) {
      case 'EVENT_ADD':
        if (transaction.payload && typeof transaction.payload === 'object' && 'event' in transaction.payload) {
          const payload = transaction.payload as { event: unknown };
          if (payload.event && typeof payload.event === 'object') {
            const newEvent = this.createEvent(payload.event);
            if (this.isValidEvent(newEvent, newValue)) {
              newValue.events.set(newEvent.id, newEvent);
              this.updateEventsByDate(newValue, newEvent, 'add');
            }
          }
        }
        break;

      case 'EVENT_UPDATE':
        if (transaction.payload && typeof transaction.payload === 'object') {
          const payload = transaction.payload as { eventId?: unknown; updates?: unknown };
          if (typeof payload.eventId === 'string' && payload.updates && typeof payload.updates === 'object') {
            const existingEvent = newValue.events.get(payload.eventId);
            if (existingEvent) {
              const updatedEvent = { ...existingEvent, ...payload.updates as Partial<CalendarEvent> };
              if (this.isValidEvent(updatedEvent, newValue)) {
                // 기존 이벤트를 날짜별 캐시에서 제거
                this.updateEventsByDate(newValue, existingEvent, 'remove');
                // 업데이트된 이벤트를 추가
                newValue.events.set(payload.eventId, updatedEvent);
                this.updateEventsByDate(newValue, updatedEvent, 'add');
              }
            }
          }
        }
        break;

      case 'EVENT_DELETE':
        if (transaction.payload && typeof transaction.payload === 'object' && 'eventId' in transaction.payload) {
          const payload = transaction.payload as { eventId: unknown };
          if (typeof payload.eventId === 'string') {
            const eventToDelete = newValue.events.get(payload.eventId);
            if (eventToDelete) {
              newValue.events.delete(payload.eventId);
              this.updateEventsByDate(newValue, eventToDelete, 'remove');
              
              // 선택/편집 중인 이벤트면 해제
              if (newValue.selectedEventId === payload.eventId) {
                newValue.selectedEventId = null;
              }
              if (newValue.editingEventId === payload.eventId) {
                newValue.editingEventId = null;
              }
            }
          }
        }
        break;

      case 'EVENT_SELECT':
        if (transaction.payload && typeof transaction.payload === 'object' && 'eventId' in transaction.payload) {
          const payload = transaction.payload as { eventId: unknown };
          if (typeof payload.eventId === 'string') {
            newValue.selectedEventId = payload.eventId;
          }
        }
        break;

      case 'EVENT_DESELECT':
        newValue.selectedEventId = null;
        break;

      case 'EVENT_START_EDIT':
        if (transaction.payload && typeof transaction.payload === 'object' && 'eventId' in transaction.payload) {
          const payload = transaction.payload as { eventId: unknown };
          if (typeof payload.eventId === 'string') {
            newValue.editingEventId = payload.eventId;
          }
        }
        break;

      case 'EVENT_END_EDIT':
        newValue.editingEventId = null;
        break;

      case 'EVENT_SET_OPTIONS':
        if (transaction.payload && typeof transaction.payload === 'object' && 'options' in transaction.payload) {
          const payload = transaction.payload as { options: unknown };
          if (payload.options && typeof payload.options === 'object') {
            newValue.options = { ...newValue.options, ...payload.options as Partial<EventOptions> };
          }
        }
        break;

      case 'EVENT_BULK_ADD':
        const eventsToAdd = transaction.payload.events as CalendarEvent[];
        for (const event of eventsToAdd) {
          const validEvent = this.createEvent(event);
          if (this.isValidEvent(validEvent, newValue)) {
            newValue.events.set(validEvent.id, validEvent);
            this.updateEventsByDate(newValue, validEvent, 'add');
          }
        }
        break;
    }

    return new EventPluginState(newValue);
  }

  toJSON(): any {
    return {
      ...this.value,
      events: Object.fromEntries(this.value.events),
      eventsByDate: Object.fromEntries(this.value.eventsByDate)
    };
  }

  static fromJSON(value: any): EventPluginState {
    const state = { ...value };
    
    // events Map 복원
    state.events = new Map();
    if (value.events) {
      for (const [id, event] of Object.entries(value.events as Record<string, any>)) {
        state.events.set(id, {
          ...event,
          startDate: new Date(event.startDate),
          endDate: new Date(event.endDate)
        });
      }
    }
    
    // eventsByDate Map 복원
    state.eventsByDate = new Map(Object.entries(value.eventsByDate || {}));
    
    return new EventPluginState(state);
  }

  private createEvent(eventData: Partial<CalendarEvent>): CalendarEvent {
    const now = new Date();
    return {
      id: eventData.id || this.generateEventId(),
      title: eventData.title || 'Untitled Event',
      description: eventData.description,
      startDate: eventData.startDate || now,
      endDate: eventData.endDate || new Date(now.getTime() + 60 * 60 * 1000), // 1시간 후
      allDay: eventData.allDay || false,
      color: eventData.color || '#3174ad',
      category: eventData.category,
      metadata: eventData.metadata || {},
      recurrence: eventData.recurrence
    };
  }

  private generateEventId(): string {
    return `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private isValidEvent(event: CalendarEvent, state: EventState): boolean {
    // 기본 유효성 검사
    if (!event.title.trim()) return false;
    if (event.startDate >= event.endDate) return false;

    // 과거 이벤트 허용 여부 확인
    if (!state.options.allowPastEvents && event.startDate < new Date()) {
      return false;
    }

    // 카테고리 검증
    if (state.options.categories && event.category) {
      if (!state.options.categories.includes(event.category)) {
        return false;
      }
    }

    // 겹침 허용 여부 확인
    if (!state.options.allowOverlap) {
      for (const existingEvent of state.events.values()) {
        if (existingEvent.id !== event.id && this.eventsOverlap(event, existingEvent)) {
          return false;
        }
      }
    }

    // 하루 최대 이벤트 수 확인
    if (state.options.maxEventsPerDay) {
      const dateKey = this.getDateKey(event.startDate);
      const eventsOnDate = state.eventsByDate.get(dateKey) || [];
      if (eventsOnDate.length >= state.options.maxEventsPerDay) {
        return false;
      }
    }

    return true;
  }

  private eventsOverlap(event1: CalendarEvent, event2: CalendarEvent): boolean {
    return event1.startDate < event2.endDate && event1.endDate > event2.startDate;
  }

  private updateEventsByDate(state: EventState, event: CalendarEvent, action: 'add' | 'remove'): void {
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    
    // 이벤트가 걸쳐있는 모든 날짜에 대해 처리
    const current = new Date(startDate);
    current.setHours(0, 0, 0, 0);
    
    while (current <= endDate) {
      const dateKey = this.getDateKey(current);
      
      if (action === 'add') {
        const eventsOnDate = state.eventsByDate.get(dateKey) || [];
        if (!eventsOnDate.includes(event.id)) {
          eventsOnDate.push(event.id);
          state.eventsByDate.set(dateKey, eventsOnDate);
        }
      } else {
        const eventsOnDate = state.eventsByDate.get(dateKey) || [];
        const index = eventsOnDate.indexOf(event.id);
        if (index > -1) {
          eventsOnDate.splice(index, 1);
          if (eventsOnDate.length === 0) {
            state.eventsByDate.delete(dateKey);
          } else {
            state.eventsByDate.set(dateKey, eventsOnDate);
          }
        }
      }
      
      current.setDate(current.getDate() + 1);
    }
  }

  private getDateKey(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}

/**
 * Event Management Plugin 생성 함수
 */
export function createEventPlugin(options: EventOptions = {}): Plugin<EventState> {
  const defaultOptions: EventOptions = {
    allowOverlap: true,
    maxEventsPerDay: undefined,
    defaultDuration: 60, // 1시간
    allowPastEvents: true,
    categories: undefined
  };

  const finalOptions = { ...defaultOptions, ...options };

  const spec: PluginSpec<EventState> = {
    key: 'events',

    state: {
      init: () => new EventPluginState({
        events: new Map(),
        selectedEventId: null,
        editingEventId: null,
        options: finalOptions,
        eventsByDate: new Map()
      }),
      apply: (transaction, state) => state.apply(transaction)
    },

    commands: (plugin) => ({
      addEvent: (event: Partial<CalendarEvent>) => (_state: CalendarState, dispatch?: (transaction: Transaction) => void) => {
        if (dispatch) {
          dispatch(transactions.custom('EVENT_ADD', { event }));
        }
        return true;
      },

      updateEvent: (eventId: string, updates: Partial<CalendarEvent>) => (_state: CalendarState, dispatch?: (transaction: Transaction) => void) => {
        if (dispatch) {
          dispatch(transactions.custom('EVENT_UPDATE', { eventId, updates }));
        }
        return true;
      },

      deleteEvent: (eventId: string) => (_state: CalendarState, dispatch?: (transaction: Transaction) => void) => {
        if (dispatch) {
          dispatch(transactions.custom('EVENT_DELETE', { eventId }));
        }
        return true;
      },

      selectEvent: (eventId: string) => (_state: CalendarState, dispatch?: (transaction: Transaction) => void) => {
        if (dispatch) {
          dispatch(transactions.custom('EVENT_SELECT', { eventId }));
        }
        return true;
      },

      deselectEvent: () => (_state: CalendarState, dispatch?: (transaction: Transaction) => void) => {
        if (dispatch) {
          dispatch(transactions.custom('EVENT_DESELECT', {}));
        }
        return true;
      },

      startEditEvent: (eventId: string) => (_state: CalendarState, dispatch?: (transaction: Transaction) => void) => {
        if (dispatch) {
          dispatch(transactions.custom('EVENT_START_EDIT', { eventId }));
        }
        return true;
      },

      endEditEvent: () => (_state: CalendarState, dispatch?: (transaction: Transaction) => void) => {
        if (dispatch) {
          dispatch(transactions.custom('EVENT_END_EDIT', {}));
        }
        return true;
      },

      createEventOnDate: (date: Date, title?: string) => (state: CalendarState, dispatch?: (transaction: Transaction) => void) => {
        const eventState = plugin.getState(state);
        const duration = eventState?.value.options.defaultDuration || 60;
        
        const startDate = new Date(date);
        const endDate = new Date(startDate.getTime() + duration * 60 * 1000);
        
        const event: Partial<CalendarEvent> = {
          title: title || `Event on ${date.toLocaleDateString()}`,
          startDate,
          endDate,
          allDay: true
        };

        if (dispatch) {
          dispatch(transactions.custom('EVENT_ADD', { event }));
        }
        return true;
      },

      bulkAddEvents: (events: CalendarEvent[]) => (_state: CalendarState, dispatch?: (transaction: Transaction) => void) => {
        if (dispatch) {
          dispatch(transactions.custom('EVENT_BULK_ADD', { events }));
        }
        return true;
      },

      setEventOptions: (newOptions: Partial<EventOptions>) => (_state: CalendarState, dispatch?: (transaction: Transaction) => void) => {
        if (dispatch) {
          dispatch(transactions.custom('EVENT_SET_OPTIONS', { options: newOptions }));
        }
        return true;
      }
    }),

    decorations: (state, plugin) => {
      const eventState = plugin.getState(state);
      if (!eventState) return new DecorationSet();

      const decorations: any[] = [];

      // 각 날짜의 이벤트 표시
      for (const [dateKey, eventIds] of eventState.value.eventsByDate) {
        const date = new Date(dateKey);
        const eventsOnDate = eventIds
          .map(id => eventState.value.events.get(id))
          .filter(Boolean) as CalendarEvent[];

        if (eventsOnDate.length > 0) {
          // 이벤트 개수 표시
          decorations.push(
            DecorationFactory.overlay(
              date,
              eventsOnDate.length.toString(),
              'calendar-event-count'
            )
          );

          // 각 이벤트를 작은 점으로 표시
          eventsOnDate.forEach((event) => {
            const widget = () => {
              const eventDot = document.createElement('div');
              eventDot.className = 'calendar-event-dot';
              eventDot.style.backgroundColor = event.color || '#3174ad';
              eventDot.style.width = '6px';
              eventDot.style.height = '6px';
              eventDot.style.borderRadius = '50%';
              eventDot.style.display = 'inline-block';
              eventDot.style.margin = '1px';
              eventDot.title = event.title;
              eventDot.setAttribute('data-event-id', event.id);
              return eventDot;
            };

            decorations.push(
              DecorationFactory.widget(date, widget)
            );
          });

          // 선택된 이벤트 강조
          if (eventState.value.selectedEventId) {
            const selectedEvent = eventState.value.events.get(eventState.value.selectedEventId);
            if (selectedEvent && eventsOnDate.includes(selectedEvent)) {
              decorations.push(
                DecorationFactory.highlight(date, 'calendar-selected-event-date')
              );
            }
          }
        }
      }

      return new DecorationSet(decorations);
    },

    props: {
      handleDateClick: (_date, event, _state, _plugin) => {
        const target = event.target as HTMLElement;
        
        // 이벤트 점을 클릭한 경우
        if (target.classList.contains('calendar-event-dot')) {
          const eventId = target.getAttribute('data-event-id');
          if (eventId) {
            // 이벤트 선택
            return true; // selectEvent 커맨드로 처리
          }
        }
        
        // 빈 날짜를 더블클릭한 경우 이벤트 생성
        if (event.detail === 2) { // 더블클릭
          // createEventOnDate 커맨드로 처리
          return true;
        }

        return false;
      }
    },

    queries: {
      getEvent: (state, plugin, eventId: string) => {
        const eventState = plugin.getState(state);
        return eventState?.value.events.get(eventId) || null;
      },

      getEventsOnDate: (state, plugin, date: Date) => {
        const eventState = plugin.getState(state);
        if (!eventState) return [];

        const dateKey = date.toISOString().split('T')[0];
        const eventIds = eventState.value.eventsByDate.get(dateKey) || [];
        return eventIds
          .map(id => eventState.value.events.get(id))
          .filter(Boolean) as CalendarEvent[];
      },

      getEventsInRange: (state, plugin, startDate: Date, endDate: Date) => {
        const eventState = plugin.getState(state);
        if (!eventState) return [];

        const events: CalendarEvent[] = [];
        for (const event of eventState.value.events.values()) {
          if (event.startDate <= endDate && event.endDate >= startDate) {
            events.push(event);
          }
        }
        return events.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
      },

      getAllEvents: (state, plugin) => {
        const eventState = plugin.getState(state);
        if (!eventState) return [];
        return Array.from(eventState.value.events.values());
      },

      getSelectedEvent: (state, plugin) => {
        const eventState = plugin.getState(state);
        if (!eventState || !eventState.value.selectedEventId) return null;
        return eventState.value.events.get(eventState.value.selectedEventId) || null;
      },

      getEventsByCategory: (state, plugin, category: string) => {
        const eventState = plugin.getState(state);
        if (!eventState) return [];
        
        return Array.from(eventState.value.events.values())
          .filter(event => event.category === category);
      },

      searchEvents: (state, plugin, query: string) => {
        const eventState = plugin.getState(state);
        if (!eventState) return [];
        
        const lowercaseQuery = query.toLowerCase();
        return Array.from(eventState.value.events.values())
          .filter(event => 
            event.title.toLowerCase().includes(lowercaseQuery) ||
            (event.description && event.description.toLowerCase().includes(lowercaseQuery))
          );
      }
    }
  };

  return new Plugin(spec);
}