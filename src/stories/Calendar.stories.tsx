import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { createEventPlugin } from '../plugins/event-plugin';
import { createRangePlugin } from '../plugins/range-plugin';
import { Calendar } from '../react/calendar';

const meta: Meta<typeof Calendar> = {
  title: '캘린더/기본 캘린더',
  component: Calendar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '기본 제공되는 캘린더 컴포넌트입니다. 플러그인을 조합하여 다양한 기능을 구현할 수 있습니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    plugins: {
      description: '캘린더에 적용할 플러그인들의 배열',
      control: { type: 'object' },
    },
    onDateClick: {
      description: '날짜 클릭 시 호출되는 콜백 함수',
    },
    onDateHover: {
      description: '날짜 호버 시 호출되는 콜백 함수',
    },
    onMonthChange: {
      description: '월 변경 시 호출되는 콜백 함수',
    },
    className: {
      description: '캘린더 컨테이너에 적용할 CSS 클래스',
      control: { type: 'text' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 캘린더 (플러그인 없음)
export const Default: Story = {
  render: () => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

    return (
      <div>
        <Calendar
          plugins={[]}
          showHeader={true}
          onDateClick={date => {
            setSelectedDate(date);
            fn()(date);
          }}
          onDateHover={fn()}
          onMonthChange={date => {
            setCurrentMonth(date);
            fn()(date);
          }}
        />
        <div
          style={{
            marginTop: '1rem',
            padding: '0.75rem',
            background: '#f7fafc',
            borderRadius: '8px',
            fontSize: '0.875rem',
            border: '1px solid #e2e8f0',
          }}
        >
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>현재 표시 월:</strong>{' '}
            {currentMonth.toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
            })}
          </div>
          {selectedDate ? (
            <div>
              <strong>선택된 날짜:</strong>{' '}
              {selectedDate.toLocaleDateString('ko-KR')}
            </div>
          ) : (
            <div style={{ color: '#666' }}>
              날짜를 클릭하여 선택하거나 헤더 버튼으로 월을 이동하세요
            </div>
          )}
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          '플러그인이 적용되지 않은 기본 캘린더입니다. 헤더의 ‹ › 버튼으로 월을 이동하고, 오늘 버튼으로 현재 날짜로 돌아갈 수 있습니다. 날짜를 클릭하면 선택된 날짜가 표시됩니다.',
      },
    },
  },
};

// Range Selection이 적용된 캘린더
export const WithRangeSelection: Story = {
  render: () => {
    const [selectedRange, setSelectedRange] = useState<{
      start: Date | null;
      end: Date | null;
    }>({
      start: null,
      end: null,
    });
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

    return (
      <div>
        <Calendar
          plugins={[createRangePlugin({ selectionMode: 'range', maxRange: 7 })]}
          showHeader={true}
          onDateClick={date => {
            fn()(date);
          }}
          onDateHover={fn()}
          onMonthChange={date => {
            setCurrentMonth(date);
            fn()(date);
          }}
          onStateChange={state => {
            // Range Plugin 상태에서 선택된 범위 추출
            const rangeState = state.pluginStates.get('range');
            if (rangeState?.value?.selectedRange) {
              setSelectedRange(rangeState.value.selectedRange);
            } else if (rangeState?.value?.selectedRange === null) {
              // 월 변경 시 선택 상태가 초기화된 경우 처리
              setSelectedRange({ start: null, end: null });
            }
          }}
        />
        <div
          style={{
            marginTop: '1rem',
            padding: '0.75rem',
            background: '#f7fafc',
            borderRadius: '8px',
            fontSize: '0.875rem',
            border: '1px solid #e2e8f0',
          }}
        >
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>현재 표시 월:</strong>{' '}
            {currentMonth.toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
            })}
          </div>
          <div>
            <strong>선택된 범위:</strong>
            {selectedRange.start && selectedRange.end ? (
              <div style={{ marginTop: '0.25rem' }}>
                {selectedRange.start.toLocaleDateString('ko-KR')} ~{' '}
                {selectedRange.end.toLocaleDateString('ko-KR')}
                <br />
                <small style={{ color: '#4299e1' }}>
                  (
                  {Math.ceil(
                    (selectedRange.end.getTime() -
                      selectedRange.start.getTime()) /
                      (1000 * 60 * 60 * 24) +
                      1
                  )}
                  일 선택됨)
                </small>
              </div>
            ) : selectedRange.start ? (
              <div style={{ marginTop: '0.25rem', color: '#ed8936' }}>
                {selectedRange.start.toLocaleDateString('ko-KR')} (종료일을
                선택하세요)
              </div>
            ) : (
              <div style={{ marginTop: '0.25rem', color: '#666' }}>
                첫 번째 날짜를 클릭하여 범위 선택을 시작하세요 (최대 7일)
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Range Selection 플러그인이 적용된 캘린더입니다. 헤더의 네비게이션 버튼으로 월을 이동할 수 있으며, 시작 날짜와 끝 날짜를 차례로 클릭하여 범위를 선택할 수 있습니다. 최대 7일까지 선택 가능합니다.',
      },
    },
  },
};

// Event Management가 적용된 캘린더
export const WithEventManagement: Story = {
  render: () => {
    const [events, setEvents] = useState<
      Array<{ id: string; date: Date; title: string; category: string }>
    >([]);
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

    const handleAddEvent = (date: Date) => {
      const title = prompt('이벤트 제목을 입력하세요:');
      if (title) {
        const categories = ['work', 'personal', 'meeting'];
        const category =
          categories[Math.floor(Math.random() * categories.length)];
        const newEvent = {
          id: Date.now().toString(),
          date,
          title,
          category,
        };
        setEvents(prev => [...prev, newEvent]);
      }
    };

    // 현재 표시되는 월의 이벤트만 필터링
    const currentMonthEvents = events.filter(event => {
      return (
        event.date.getFullYear() === currentMonth.getFullYear() &&
        event.date.getMonth() === currentMonth.getMonth()
      );
    });

    return (
      <div>
        <Calendar
          plugins={[
            createEventPlugin({
              allowOverlap: true,
              maxEventsPerDay: 5,
            }),
          ]}
          showHeader={true}
          onDateClick={date => {
            handleAddEvent(date);
            fn()(date);
          }}
          onDateDoubleClick={date => {
            handleAddEvent(date);
            fn()(date);
          }}
          onDateHover={fn()}
          onMonthChange={date => {
            setCurrentMonth(date);
            fn()(date);
          }}
        />
        <div
          style={{
            marginTop: '1rem',
            padding: '0.75rem',
            background: '#f7fafc',
            borderRadius: '8px',
            fontSize: '0.875rem',
            border: '1px solid #e2e8f0',
          }}
        >
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>현재 표시 월:</strong>{' '}
            {currentMonth.toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
            })}
          </div>
          <div style={{ marginBottom: '0.5rem', color: '#666' }}>
            <strong>사용법:</strong> 날짜를 클릭하여 이벤트를 추가하거나 헤더
            버튼으로 월을 이동하세요
          </div>

          <div>
            <strong>
              {currentMonth.toLocaleDateString('ko-KR', { month: 'long' })}의
              이벤트 ({currentMonthEvents.length}개):
            </strong>
            {currentMonthEvents.length > 0 ? (
              <ul style={{ margin: '0.5rem 0', paddingLeft: '1rem' }}>
                {currentMonthEvents.map(event => (
                  <li key={event.id} style={{ marginBottom: '0.25rem' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor:
                          event.category === 'work'
                            ? '#4299e1'
                            : event.category === 'personal'
                              ? '#48bb78'
                              : '#ed8936',
                        marginRight: '0.5rem',
                      }}
                    ></span>
                    {event.date.getDate()}일 - {event.title}
                    <small style={{ marginLeft: '0.5rem', color: '#666' }}>
                      ({event.category})
                    </small>
                    <button
                      onClick={() =>
                        setEvents(prev => prev.filter(e => e.id !== event.id))
                      }
                      style={{
                        marginLeft: '0.5rem',
                        fontSize: '0.75rem',
                        color: '#e53e3e',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      삭제
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div style={{ marginTop: '0.5rem', color: '#666' }}>
                이 달에는 이벤트가 없습니다
              </div>
            )}
          </div>

          {events.length > currentMonthEvents.length && (
            <div
              style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#999' }}
            >
              전체 이벤트: {events.length}개 (다른 달 포함)
            </div>
          )}
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Event Management 플러그인이 적용된 캘린더입니다. 헤더 버튼으로 월을 이동하면서 각 달의 이벤트를 관리할 수 있습니다. 날짜를 클릭하여 이벤트를 추가하고, 추가된 이벤트는 현재 표시된 달별로 필터링되어 표시됩니다.',
      },
    },
  },
};

// 모든 플러그인이 적용된 풀 기능 캘린더
export const FullFeatured: Story = {
  render: () => {
    const [selectedDates, setSelectedDates] = useState<Date[]>([]);
    const [events, setEvents] = useState<
      Array<{ id: string; date: Date; title: string; category: string }>
    >([]);
    const [mode, setMode] = useState<'select' | 'event'>('select');
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

    const handleDateClick = (date: Date) => {
      if (mode === 'event') {
        const title = prompt('이벤트 제목을 입력하세요:');
        if (title) {
          const categories = ['work', 'personal', 'meeting'];
          const category =
            categories[Math.floor(Math.random() * categories.length)];
          const newEvent = {
            id: Date.now().toString(),
            date,
            title,
            category,
          };
          setEvents(prev => [...prev, newEvent]);
        }
      }
      fn()(date);
    };

    // 현재 표시되는 월의 이벤트와 선택된 날짜 필터링
    const currentMonthEvents = events.filter(event => {
      return (
        event.date.getFullYear() === currentMonth.getFullYear() &&
        event.date.getMonth() === currentMonth.getMonth()
      );
    });

    const currentMonthSelectedDates = selectedDates.filter(date => {
      return (
        date.getFullYear() === currentMonth.getFullYear() &&
        date.getMonth() === currentMonth.getMonth()
      );
    });

    return (
      <div>
        <div
          style={{
            marginBottom: '1rem',
            padding: '0.75rem',
            background: '#e6fffa',
            borderRadius: '8px',
            fontSize: '0.875rem',
            border: '1px solid #b2f5ea',
          }}
        >
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>현재 표시 월:</strong>{' '}
            {currentMonth.toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
            })}{' '}
            - 헤더 버튼으로 월 이동 가능
          </div>
          <strong>모드 선택:</strong>
          <div style={{ marginTop: '0.5rem' }}>
            <label style={{ marginRight: '1rem' }}>
              <input
                type='radio'
                name='mode'
                value='select'
                checked={mode === 'select'}
                onChange={() => setMode('select')}
                style={{ marginRight: '0.25rem' }}
              />
              날짜 선택 모드 (다중 선택)
            </label>
            <label>
              <input
                type='radio'
                name='mode'
                value='event'
                checked={mode === 'event'}
                onChange={() => setMode('event')}
                style={{ marginRight: '0.25rem' }}
              />
              이벤트 추가 모드
            </label>
          </div>
        </div>

        <Calendar
          plugins={[
            createRangePlugin({ selectionMode: 'multiple', maxRange: 10 }),
            createEventPlugin({
              allowOverlap: false,
              maxEventsPerDay: 3,
              categories: ['work', 'personal', 'meeting'],
            }),
          ]}
          showHeader={true}
          onDateClick={handleDateClick}
          onDateHover={fn()}
          onMonthChange={date => {
            setCurrentMonth(date);
            fn()(date);
          }}
          onStateChange={state => {
            const rangeState = state.pluginStates.get('range');
            if (rangeState?.value?.selectedDates) {
              setSelectedDates(rangeState.value.selectedDates);
            }
          }}
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginTop: '1rem',
          }}
        >
          <div
            style={{
              padding: '0.75rem',
              background: '#f7fafc',
              borderRadius: '8px',
              fontSize: '0.875rem',
              border: '1px solid #e2e8f0',
            }}
          >
            <strong>
              {currentMonth.toLocaleDateString('ko-KR', { month: 'long' })}에
              선택된 날짜 ({currentMonthSelectedDates.length}개):
            </strong>
            {currentMonthSelectedDates.length > 0 ? (
              <ul style={{ margin: '0.5rem 0', paddingLeft: '1rem' }}>
                {currentMonthSelectedDates.slice(0, 5).map((date, index) => (
                  <li key={index}>
                    {date.getDate()}일 (
                    {date.toLocaleDateString('ko-KR', { weekday: 'short' })})
                  </li>
                ))}
                {currentMonthSelectedDates.length > 5 && (
                  <li>... 외 {currentMonthSelectedDates.length - 5}개</li>
                )}
              </ul>
            ) : (
              <div style={{ marginTop: '0.5rem', color: '#666' }}>
                이 달에는 선택된 날짜가 없습니다
              </div>
            )}
            {selectedDates.length > currentMonthSelectedDates.length && (
              <div
                style={{
                  marginTop: '0.5rem',
                  fontSize: '0.8rem',
                  color: '#999',
                }}
              >
                전체 선택: {selectedDates.length}개 (다른 달 포함)
              </div>
            )}
          </div>

          <div
            style={{
              padding: '0.75rem',
              background: '#f7fafc',
              borderRadius: '8px',
              fontSize: '0.875rem',
              border: '1px solid #e2e8f0',
            }}
          >
            <strong>
              {currentMonth.toLocaleDateString('ko-KR', { month: 'long' })}의
              이벤트 ({currentMonthEvents.length}개):
            </strong>
            {currentMonthEvents.length > 0 ? (
              <ul style={{ margin: '0.5rem 0', paddingLeft: '1rem' }}>
                {currentMonthEvents.slice(0, 5).map(event => (
                  <li key={event.id} style={{ marginBottom: '0.25rem' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor:
                          event.category === 'work'
                            ? '#4299e1'
                            : event.category === 'personal'
                              ? '#48bb78'
                              : '#ed8936',
                        marginRight: '0.5rem',
                      }}
                    ></span>
                    {event.date.getDate()}일 - {event.title}
                    <small style={{ marginLeft: '0.5rem', color: '#666' }}>
                      ({event.category})
                    </small>
                  </li>
                ))}
                {currentMonthEvents.length > 5 && (
                  <li>... 외 {currentMonthEvents.length - 5}개</li>
                )}
              </ul>
            ) : (
              <div style={{ marginTop: '0.5rem', color: '#666' }}>
                이 달에는 이벤트가 없습니다
              </div>
            )}
            {events.length > currentMonthEvents.length && (
              <div
                style={{
                  marginTop: '0.5rem',
                  fontSize: '0.8rem',
                  color: '#999',
                }}
              >
                전체 이벤트: {events.length}개 (다른 달 포함)
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          '모든 주요 플러그인이 적용된 풀 기능 캘린더입니다. 헤더 버튼으로 월을 이동하면서 모드를 전환하여 날짜 선택(다중)과 이벤트 관리를 모두 사용할 수 있습니다. 현재 표시된 달의 데이터만 필터링되어 표시됩니다.',
      },
    },
  },
};

// 커스텀 스타일이 적용된 캘린더
export const CustomStyled: Story = {
  render: () => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [animationClass, setAnimationClass] = useState('');
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

    const handleDateClick = (date: Date) => {
      setSelectedDate(date);
      setAnimationClass('pulse');
      setTimeout(() => setAnimationClass(''), 600);
      fn()(date);
    };

    return (
      <div>
        <style>{`
          .custom-calendar {
            border: 2px solid #8b5cf6;
            border-radius: 12px;
            padding: 16px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            box-shadow: 0 8px 32px rgba(139, 92, 246, 0.3);
          }
          .custom-calendar .calendar-header {
            background: rgba(255, 255, 255, 0.1);
            border-color: rgba(255, 255, 255, 0.2);
            margin-bottom: 1rem;
            padding: 0.75rem;
            border-radius: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .custom-calendar .calendar-title {
            color: white;
            font-size: 1.25rem;
            font-weight: bold;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          }
          .custom-calendar .calendar-nav-button {
            color: rgba(255, 255, 255, 0.8);
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 6px;
            padding: 0.5rem 0.75rem;
            font-size: 1.25rem;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          .custom-calendar .calendar-nav-button:hover {
            background-color: rgba(255, 255, 255, 0.25);
            color: white;
            transform: scale(1.1);
            box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2);
          }
          .custom-calendar .calendar-today-button {
            background: rgba(255, 215, 0, 0.3);
            border: 1px solid rgba(255, 215, 0, 0.5);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: bold;
          }
          .custom-calendar .calendar-today-button:hover {
            background: rgba(255, 215, 0, 0.5);
            transform: scale(1.05);
            box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
          }
          .custom-calendar .calendar-weekday {
            color: rgba(255, 255, 255, 0.7);
            font-weight: bold;
            text-align: center;
            padding: 0.5rem;
          }
          .custom-calendar .calendar-day {
            background: rgba(255, 255, 255, 0.1);
            color: white;
            border-radius: 8px;
            transition: all 0.3s ease;
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
          .custom-calendar .calendar-day:hover {
            background-color: rgba(255, 255, 255, 0.2);
            transform: scale(1.05);
            box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2);
          }
          .custom-calendar .calendar-day.selected {
            background: rgba(255, 255, 255, 0.3);
            border-color: rgba(255, 255, 255, 0.5);
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.4);
          }
          .custom-calendar .calendar-day.today {
            background: rgba(255, 215, 0, 0.3);
            border-color: rgba(255, 215, 0, 0.6);
            box-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
          }
          .custom-calendar .calendar-day.other-month {
            background: rgba(255, 255, 255, 0.05);
            color: rgba(255, 255, 255, 0.4);
          }
          .custom-calendar.pulse {
            animation: customPulse 0.6s ease-out;
          }
          @keyframes customPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.02); box-shadow: 0 0 30px rgba(139, 92, 246, 0.6); }
            100% { transform: scale(1); }
          }
        `}</style>
        <Calendar
          plugins={[createRangePlugin({ selectionMode: 'single' })]}
          showHeader={true}
          onDateClick={handleDateClick}
          onMonthChange={date => {
            setCurrentMonth(date);
            fn()(date);
          }}
          className={`custom-calendar ${animationClass}`}
          onStateChange={state => {
            const rangeState = state.pluginStates.get('range');
            if (rangeState?.value?.selectedDate) {
              setSelectedDate(rangeState.value.selectedDate);
            }
          }}
        />
        {selectedDate ? (
          <div
            style={{
              marginTop: '1rem',
              padding: '1rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '12px',
              color: 'white',
              fontSize: '0.875rem',
              textAlign: 'center',
              boxShadow: '0 8px 24px rgba(139, 92, 246, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <strong>✨ 선택된 날짜</strong>
            <div style={{ fontSize: '1.1rem', marginTop: '0.5rem' }}>
              {selectedDate.toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long',
              })}
            </div>
          </div>
        ) : (
          <div
            style={{
              marginTop: '1rem',
              padding: '1rem',
              background: 'rgba(139, 92, 246, 0.1)',
              borderRadius: '12px',
              color: '#8b5cf6',
              fontSize: '0.875rem',
              textAlign: 'center',
              border: '1px solid rgba(139, 92, 246, 0.2)',
            }}
          >
            <div style={{ marginBottom: '0.5rem' }}>
              <strong>현재 표시 월:</strong>{' '}
              {currentMonth.toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
              })}
            </div>
            <div style={{ color: '#666' }}>
              날짜를 클릭하여 선택하거나 헤더의 네비게이션 버튼을 사용하세요
            </div>
          </div>
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          '커스텀 CSS 스타일과 애니메이션이 적용된 캘린더입니다. 헤더 네비게이션 버튼이 포함되어 있으며, 그라데이션 배경, 호버 효과, 클릭 애니메이션 등 다양한 시각적 효과를 확인할 수 있습니다. 헤더 버튼으로 월을 이동하면서 커스텀 스타일을 체험해보세요.',
      },
    },
  },
};
