import type { Meta, StoryObj } from '@storybook/react-vite';
// Storybook 9.0 호환을 위해 콘솔 로깅으로 대체
import { Calendar } from '../react/calendar';
import { createEventPlugin } from '../plugins/event-plugin';
import { useMemo, useState } from 'react';

// Event Plugin 데모 컴포넌트
const EventPluginDemo = ({
  allowOverlap = true,
  maxEventsPerDay = 5,
  defaultEventColor = '#3b82f6',
  categories = [],
}: {
  allowOverlap?: boolean;
  maxEventsPerDay?: number;
  defaultEventColor?: string;
  categories?: Array<{ id: string; name: string; color: string }>;
}) => {
  const [events, setEvents] = useState([
    {
      id: 'event-1',
      title: '팀 미팅',
      date: new Date(),
      startTime: '10:00',
      endTime: '11:00',
      category: 'work',
      color: '#ef4444',
    },
    {
      id: 'event-2',
      title: '점심 약속',
      date: new Date(Date.now() + 24 * 60 * 60 * 1000),
      startTime: '12:00',
      endTime: '13:00',
      category: 'personal',
      color: '#10b981',
    },
  ]);

  const [newEvent, setNewEvent] = useState({
    title: '',
    startTime: '09:00',
    endTime: '10:00',
    category: categories.length > 0 ? categories[0].id : 'default',
  });

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const plugin = useMemo(
    () =>
      createEventPlugin({
        allowOverlap,
        maxEventsPerDay,
        defaultEventColor,
        categories: categories.map(c => (typeof c === 'string' ? c : c.id)),
      }),
    [allowOverlap, maxEventsPerDay, defaultEventColor, categories]
  );

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleAddEvent = () => {
    if (!selectedDate || !newEvent.title.trim()) return;

    const event = {
      id: `event-${Date.now()}`,
      title: newEvent.title,
      date: selectedDate,
      startTime: newEvent.startTime,
      endTime: newEvent.endTime,
      category: newEvent.category,
      color:
        categories.find(c => c.id === newEvent.category)?.color ??
        defaultEventColor,
    };

    setEvents(prev => [...prev, event]);
    setNewEvent({
      title: '',
      startTime: '09:00',
      endTime: '10:00',
      category: categories.length > 0 ? categories[0].id : 'default',
    });
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(
      event => event.date.toDateString() === date.toDateString()
    );
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      <div
        style={{
          marginBottom: '20px',
          padding: '16px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
        }}
      >
        <h3 style={{ margin: '0 0 12px 0' }}>Event Management Plugin 설정</h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '8px',
            fontSize: '14px',
          }}
        >
          <div>
            <strong>이벤트 겹침:</strong> {allowOverlap ? '허용' : '금지'}
          </div>
          <div>
            <strong>일일 최대 이벤트:</strong> {maxEventsPerDay}개
          </div>
          <div>
            <strong>기본 색상:</strong>{' '}
            <span style={{ color: defaultEventColor }}>
              {defaultEventColor}
            </span>
          </div>
          <div>
            <strong>카테고리 수:</strong> {categories.length}개
          </div>
        </div>

        {categories.length > 0 && (
          <div style={{ marginTop: '12px' }}>
            <strong>카테고리:</strong>
            <div
              style={{
                display: 'flex',
                gap: '8px',
                marginTop: '4px',
                flexWrap: 'wrap',
              }}
            >
              {categories.map(category => (
                <span
                  key={category.id}
                  style={{
                    padding: '2px 8px',
                    backgroundColor: category.color,
                    color: 'white',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                >
                  {category.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 300px',
          gap: '20px',
        }}
      >
        <div>
          <Calendar
            plugins={[plugin]}
            onDateClick={handleDateClick}
            onMonthChange={() => {}}
          />
        </div>

        <div>
          <div
            style={{
              marginBottom: '20px',
              padding: '16px',
              backgroundColor: '#e3f2fd',
              borderRadius: '8px',
            }}
          >
            <h4 style={{ margin: '0 0 12px 0' }}>이벤트 추가</h4>

            <div style={{ marginBottom: '8px' }}>
              <strong>선택된 날짜:</strong>{' '}
              {selectedDate
                ? selectedDate.toLocaleDateString('ko-KR')
                : '날짜를 선택하세요'}
            </div>

            <div style={{ marginBottom: '8px' }}>
              <input
                type='text'
                placeholder='이벤트 제목'
                value={newEvent.title}
                onChange={e =>
                  setNewEvent(prev => ({ ...prev, title: e.target.value }))
                }
                style={{
                  width: '100%',
                  padding: '4px 8px',
                  marginBottom: '4px',
                }}
              />
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '4px',
                marginBottom: '8px',
              }}
            >
              <input
                type='time'
                value={newEvent.startTime}
                onChange={e =>
                  setNewEvent(prev => ({ ...prev, startTime: e.target.value }))
                }
                style={{ padding: '4px' }}
              />
              <input
                type='time'
                value={newEvent.endTime}
                onChange={e =>
                  setNewEvent(prev => ({ ...prev, endTime: e.target.value }))
                }
                style={{ padding: '4px' }}
              />
            </div>

            {categories.length > 0 && (
              <div style={{ marginBottom: '8px' }}>
                <select
                  value={newEvent.category}
                  onChange={e =>
                    setNewEvent(prev => ({ ...prev, category: e.target.value }))
                  }
                  style={{ width: '100%', padding: '4px' }}
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={handleAddEvent}
              disabled={!selectedDate || !newEvent.title.trim()}
              style={{
                width: '100%',
                padding: '8px',
                backgroundColor:
                  selectedDate && newEvent.title.trim() ? '#2196f3' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor:
                  selectedDate && newEvent.title.trim()
                    ? 'pointer'
                    : 'not-allowed',
              }}
            >
              이벤트 추가
            </button>
          </div>

          <div
            style={{
              padding: '16px',
              backgroundColor: '#f9f9f9',
              borderRadius: '8px',
            }}
          >
            <h4 style={{ margin: '0 0 12px 0' }}>
              전체 이벤트 ({events.length})
            </h4>

            {events.length === 0 ? (
              <div style={{ color: '#666', fontSize: '14px' }}>
                등록된 이벤트가 없습니다.
              </div>
            ) : (
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {events.map(event => (
                  <div
                    key={event.id}
                    style={{
                      padding: '8px',
                      marginBottom: '8px',
                      backgroundColor: 'white',
                      borderLeft: `4px solid ${event.color}`,
                      borderRadius: '4px',
                      fontSize: '14px',
                    }}
                  >
                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                      {event.title}
                    </div>
                    <div style={{ color: '#666', fontSize: '12px' }}>
                      {event.date.toLocaleDateString('ko-KR')} {event.startTime}
                      -{event.endTime}
                    </div>
                    {event.category &&
                      categories.find(c => c.id === event.category) && (
                        <div style={{ fontSize: '12px', marginTop: '2px' }}>
                          <span
                            style={{
                              padding: '1px 6px',
                              backgroundColor: categories.find(
                                c => c.id === event.category
                              )?.color,
                              color: 'white',
                              borderRadius: '8px',
                            }}
                          >
                            {
                              categories.find(c => c.id === event.category)
                                ?.name
                            }
                          </span>
                        </div>
                      )}
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      style={{
                        marginTop: '4px',
                        padding: '2px 6px',
                        backgroundColor: '#f44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: '2px',
                        fontSize: '10px',
                        cursor: 'pointer',
                      }}
                    >
                      삭제
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedDate && (
        <div
          style={{
            marginTop: '20px',
            padding: '16px',
            backgroundColor: '#fff3e0',
            borderRadius: '8px',
          }}
        >
          <h4 style={{ margin: '0 0 12px 0' }}>
            {selectedDate.toLocaleDateString('ko-KR')} 이벤트 (
            {getEventsForDate(selectedDate).length})
          </h4>

          {getEventsForDate(selectedDate).length === 0 ? (
            <div style={{ color: '#666', fontSize: '14px' }}>
              이 날짜에는 이벤트가 없습니다.
            </div>
          ) : (
            getEventsForDate(selectedDate).map(event => (
              <div
                key={event.id}
                style={{
                  padding: '8px',
                  marginBottom: '4px',
                  backgroundColor: 'white',
                  borderLeft: `4px solid ${event.color}`,
                  borderRadius: '4px',
                  fontSize: '14px',
                }}
              >
                <strong>{event.title}</strong> ({event.startTime}-
                {event.endTime})
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

const meta: Meta<typeof EventPluginDemo> = {
  title: '플러그인/Event Management Plugin',
  component: EventPluginDemo,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Event Management Plugin은 캘린더에 이벤트를 추가, 수정, 삭제할 수 있는 기능을 제공합니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    allowOverlap: {
      description: '같은 시간대 이벤트 겹침 허용 여부',
      control: { type: 'boolean' },
    },
    maxEventsPerDay: {
      description: '하루 최대 이벤트 수',
      control: { type: 'number', min: 1, max: 20 },
    },
    defaultEventColor: {
      description: '기본 이벤트 색상',
      control: { type: 'color' },
    },
    categories: {
      description: '이벤트 카테고리 목록',
      control: { type: 'object' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 이벤트 관리
export const BasicEventManagement: Story = {
  args: {
    allowOverlap: true,
    maxEventsPerDay: 5,
    defaultEventColor: '#3b82f6',
    categories: [],
  },
  parameters: {
    docs: {
      description: {
        story:
          '기본적인 이벤트 관리 기능입니다. 카테고리 없이 간단한 이벤트를 생성, 수정, 삭제할 수 있습니다.',
      },
    },
  },
};

// 카테고리가 있는 이벤트 관리
export const CategorizedEvents: Story = {
  args: {
    allowOverlap: true,
    maxEventsPerDay: 8,
    defaultEventColor: '#6366f1',
    categories: [
      { id: 'work', name: '업무', color: '#ef4444' },
      { id: 'personal', name: '개인', color: '#10b981' },
      { id: 'meeting', name: '미팅', color: '#8b5cf6' },
      { id: 'hobby', name: '취미', color: '#f59e0b' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          '카테고리별로 이벤트를 분류할 수 있는 고급 이벤트 관리 기능입니다. 각 카테고리는 고유한 색상을 가집니다.',
      },
    },
  },
};

// 제한된 이벤트 관리 (겹침 불가)
export const NoOverlapEvents: Story = {
  args: {
    allowOverlap: false,
    maxEventsPerDay: 3,
    defaultEventColor: '#dc2626',
    categories: [
      { id: 'appointment', name: '약속', color: '#dc2626' },
      { id: 'task', name: '업무', color: '#7c3aed' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          '이벤트 겹침이 허용되지 않는 엄격한 스케줄 관리 모드입니다. 하루 최대 3개의 이벤트만 생성할 수 있습니다.',
      },
    },
  },
};

// 많은 이벤트를 지원하는 관리
export const HighVolumeEvents: Story = {
  args: {
    allowOverlap: true,
    maxEventsPerDay: 15,
    defaultEventColor: '#059669',
    categories: [
      { id: 'class', name: '수업', color: '#3b82f6' },
      { id: 'study', name: '공부', color: '#10b981' },
      { id: 'exercise', name: '운동', color: '#f59e0b' },
      { id: 'meal', name: '식사', color: '#ef4444' },
      { id: 'rest', name: '휴식', color: '#8b5cf6' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          '많은 수의 이벤트를 관리할 수 있는 고용량 이벤트 관리 모드입니다. 세분화된 카테고리로 체계적인 스케줄 관리가 가능합니다.',
      },
    },
  },
};
