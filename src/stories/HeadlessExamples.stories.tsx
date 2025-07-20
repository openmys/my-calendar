import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from '@storybook/test';
import { useCalendar } from '../react/use-calendar';
import { createRangePlugin } from '../plugins/range-plugin';
import { createEventPlugin } from '../plugins/event-plugin';
import { useMemo } from 'react';

// 미니멀 캘린더 예시
const MinimalCalendar = ({ plugins = [] }: { plugins?: any[] }) => {
  const memoizedPlugins = useMemo(() => plugins, [plugins]);
  const { state, execCommand, decorations } = useCalendar({
    plugins: memoizedPlugins,
  });

  if (!state) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ fontFamily: 'monospace', fontSize: '14px' }}>
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <button onClick={() => execCommand('goToPreviousMonth')}>{'<'}</button>
        <span style={{ margin: '0 20px', fontWeight: 'bold' }}>
          {state.currentDate.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
          })}
        </span>
        <button onClick={() => execCommand('goToNextMonth')}>{'>'}</button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 30px)',
          gap: '2px',
          justifyContent: 'center',
        }}
      >
        {['일', '월', '화', '수', '목', '금', '토'].map(day => (
          <div key={day} style={{ textAlign: 'center', fontWeight: 'bold' }}>
            {day}
          </div>
        ))}
        {state.days.map((day, index) => {
          const dayDecorations = decorations.getDecorationsForDate(day.date);
          const isDecorated = dayDecorations.length > 0;

          return (
            <div
              key={index}
              onClick={() => execCommand('selectDate', day.date)}
              style={{
                textAlign: 'center',
                cursor: 'pointer',
                padding: '4px',
                backgroundColor: isDecorated ? '#ffeb3b' : 'transparent',
                color: day.isCurrentMonth ? '#000' : '#999',
                border:
                  day.date.toDateString() === new Date().toDateString()
                    ? '1px solid red'
                    : 'none',
              }}
            >
              {day.date.getDate()}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 카드 스타일 캘린더 예시
const CardCalendar = ({ plugins = [] }: { plugins?: any[] }) => {
  const memoizedPlugins = useMemo(() => plugins, [plugins]);
  const { state, execCommand, decorations } = useCalendar({
    plugins: memoizedPlugins,
  });

  if (!state) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        backgroundColor: '#1e293b',
        color: 'white',
        padding: '20px',
        borderRadius: '16px',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <button
          onClick={() => execCommand('goToPreviousMonth')}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 12px',
            cursor: 'pointer',
          }}
        >
          ← 이전
        </button>
        <h2 style={{ margin: 0, fontSize: '24px' }}>
          {state.currentDate.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
          })}
        </h2>
        <button
          onClick={() => execCommand('goToNextMonth')}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 12px',
            cursor: 'pointer',
          }}
        >
          다음 →
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '8px',
          marginBottom: '10px',
        }}
      >
        {[
          '일요일',
          '월요일',
          '화요일',
          '수요일',
          '목요일',
          '금요일',
          '토요일',
        ].map(day => (
          <div
            key={day}
            style={{
              textAlign: 'center',
              fontWeight: 'bold',
              color: '#94a3b8',
              fontSize: '12px',
            }}
          >
            {day.slice(0, 1)}
          </div>
        ))}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '8px',
        }}
      >
        {state.days.map((day, index) => {
          const dayDecorations = decorations.getDecorationsForDate(day.date);
          const isDecorated = dayDecorations.length > 0;
          const isToday = day.date.toDateString() === new Date().toDateString();

          return (
            <div
              key={index}
              onClick={() => execCommand('selectDate', day.date)}
              style={{
                textAlign: 'center',
                cursor: 'pointer',
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: isDecorated
                  ? '#10b981'
                  : isToday
                    ? '#3b82f6'
                    : '#374151',
                color:
                  isDecorated || isToday
                    ? 'white'
                    : day.isCurrentMonth
                      ? '#f1f5f9'
                      : '#64748b',
                transition: 'all 0.2s ease',
                transform: 'scale(1)',
                fontWeight: isToday ? 'bold' : 'normal',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.backgroundColor = isDecorated
                  ? '#059669'
                  : isToday
                    ? '#2563eb'
                    : '#4b5563';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.backgroundColor = isDecorated
                  ? '#10b981'
                  : isToday
                    ? '#3b82f6'
                    : '#374151';
              }}
            >
              {day.date.getDate()}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 리스트 스타일 캘린더 예시
const ListCalendar = ({ plugins = [] }: { plugins?: any[] }) => {
  const memoizedPlugins = useMemo(() => plugins, [plugins]);
  const { state, execCommand, decorations } = useCalendar({
    plugins: memoizedPlugins,
  });

  if (!state) {
    return <div>Loading...</div>;
  }

  const weeks = [];
  for (let i = 0; i < state.days.length; i += 7) {
    weeks.push(state.days.slice(i, i + 7));
  }

  return (
    <div
      style={{
        fontFamily: 'system-ui, sans-serif',
        maxWidth: '600px',
        backgroundColor: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          backgroundColor: '#0f172a',
          color: 'white',
          padding: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <button
          onClick={() => execCommand('goToPreviousMonth')}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            fontSize: '18px',
          }}
        >
          ←
        </button>
        <h3 style={{ margin: 0, fontSize: '18px' }}>
          {state.currentDate.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
          })}
        </h3>
        <button
          onClick={() => execCommand('goToNextMonth')}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            fontSize: '18px',
          }}
        >
          →
        </button>
      </div>

      {weeks.map((week, weekIndex) => (
        <div key={weekIndex} style={{ borderBottom: '1px solid #e2e8f0' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              backgroundColor: '#f1f5f9',
            }}
          >
            {week.map((day, dayIndex) => {
              const dayDecorations = decorations.getDecorationsForDate(
                day.date
              );
              const isDecorated = dayDecorations.length > 0;
              const isToday =
                day.date.toDateString() === new Date().toDateString();

              return (
                <div
                  key={dayIndex}
                  onClick={() => execCommand('selectDate', day.date)}
                  style={{
                    padding: '12px 8px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: isDecorated
                      ? '#dbeafe'
                      : isToday
                        ? '#fef3c7'
                        : 'transparent',
                    color: day.isCurrentMonth ? '#1e293b' : '#94a3b8',
                    borderRight: dayIndex < 6 ? '1px solid #e2e8f0' : 'none',
                    fontWeight: isToday ? 'bold' : 'normal',
                    fontSize: '14px',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = isDecorated
                      ? '#bfdbfe'
                      : isToday
                        ? '#fde68a'
                        : '#e2e8f0';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = isDecorated
                      ? '#dbeafe'
                      : isToday
                        ? '#fef3c7'
                        : 'transparent';
                  }}
                >
                  <div>{day.date.getDate()}</div>
                  {isDecorated && (
                    <div
                      style={{
                        width: '6px',
                        height: '6px',
                        backgroundColor: '#3b82f6',
                        borderRadius: '50%',
                        margin: '2px auto 0',
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

// 모바일 스타일 캘린더 예시
const MobileCalendar = ({ plugins = [] }: { plugins?: any[] }) => {
  const memoizedPlugins = useMemo(() => plugins, [plugins]);
  const { state, execCommand, decorations } = useCalendar({
    plugins: memoizedPlugins,
  });

  if (!state) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        fontFamily: 'system-ui, sans-serif',
        maxWidth: '320px',
        backgroundColor: 'white',
        borderRadius: '20px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '20px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <button
            onClick={() => execCommand('goToPreviousMonth')}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: 'white',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            ←
          </button>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
              {state.currentDate.toLocaleDateString('ko-KR', { month: 'long' })}
            </div>
            <div style={{ fontSize: '32px', fontWeight: '300' }}>
              {state.currentDate.getFullYear()}
            </div>
          </div>
          <button
            onClick={() => execCommand('goToNextMonth')}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: 'white',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            →
          </button>
        </div>
      </div>

      <div style={{ padding: '16px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '4px',
            marginBottom: '8px',
          }}
        >
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
            <div
              key={day}
              style={{
                textAlign: 'center',
                fontWeight: 'bold',
                color: '#94a3b8',
                fontSize: '12px',
                padding: '8px 0',
              }}
            >
              {day}
            </div>
          ))}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '4px',
          }}
        >
          {state.days.map((day, index) => {
            const dayDecorations = decorations.getDecorationsForDate(day.date);
            const isDecorated = dayDecorations.length > 0;
            const isToday =
              day.date.toDateString() === new Date().toDateString();

            return (
              <div
                key={index}
                onClick={() => execCommand('selectDate', day.date)}
                style={{
                  textAlign: 'center',
                  cursor: 'pointer',
                  padding: '12px 4px',
                  borderRadius: '12px',
                  backgroundColor: isDecorated
                    ? '#667eea'
                    : isToday
                      ? '#764ba2'
                      : 'transparent',
                  color:
                    isDecorated || isToday
                      ? 'white'
                      : day.isCurrentMonth
                        ? '#1e293b'
                        : '#cbd5e1',
                  fontSize: '14px',
                  fontWeight: isToday ? 'bold' : 'normal',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  if (!isDecorated && !isToday) {
                    e.currentTarget.style.backgroundColor = '#f1f5f9';
                  }
                }}
                onMouseLeave={e => {
                  if (!isDecorated && !isToday) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                {day.date.getDate()}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const meta: Meta = {
  title: '헤드리스 예시/커스텀 UI 구현',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '헤드리스 패턴의 장점을 보여주는 다양한 커스텀 UI 구현 예시입니다. 동일한 로직과 데이터를 사용하면서 완전히 다른 스타일의 캘린더를 만들 수 있습니다.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

// 미니멀 캘린더
export const Minimal: Story = {
  render: () => (
    <MinimalCalendar
      plugins={[createRangePlugin({ selectionMode: 'single' })]}
    />
  ),
  args: {
    onDateSelect: fn(),
    onMonthChange: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          '최소한의 스타일만 적용된 미니멀 캘린더입니다. 모노스페이스 폰트와 간단한 레이아웃을 사용합니다.',
      },
    },
  },
};

// 카드 스타일 캘린더
export const CardStyle: Story = {
  render: () => (
    <CardCalendar
      plugins={[
        createRangePlugin({ selectionMode: 'multiple' }),
        createEventPlugin({ allowOverlap: true }),
      ]}
    />
  ),
  args: {
    onDateSelect: fn(),
    onMonthChange: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          '다크 테마의 카드 스타일 캘린더입니다. 호버 효과와 애니메이션이 적용되어 모던한 느낌을 줍니다.',
      },
    },
  },
};

// 리스트 스타일 캘린더
export const ListStyle: Story = {
  render: () => (
    <ListCalendar
      plugins={[createRangePlugin({ selectionMode: 'range', maxRange: 7 })]}
    />
  ),
  args: {
    onDateSelect: fn(),
    onMonthChange: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          '주간 단위로 구분된 리스트 스타일 캘린더입니다. 각 날짜에 이벤트 표시점이 추가됩니다.',
      },
    },
  },
};

// 모바일 스타일 캘린더
export const MobileStyle: Story = {
  render: () => (
    <MobileCalendar
      plugins={[
        createRangePlugin({ selectionMode: 'single' }),
        createEventPlugin({ maxEventsPerDay: 3 }),
      ]}
    />
  ),
  args: {
    onDateSelect: fn(),
    onMonthChange: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          '모바일 앱과 같은 느낌의 캘린더입니다. 그라데이션 헤더와 둥근 모서리가 특징입니다.',
      },
    },
  },
};

// 모든 스타일 비교
export const AllStyles: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '40px' }}>
      <div>
        <h3>미니멀 스타일</h3>
        <MinimalCalendar
          plugins={[createRangePlugin({ selectionMode: 'single' })]}
        />
      </div>

      <div>
        <h3>카드 스타일</h3>
        <CardCalendar
          plugins={[createRangePlugin({ selectionMode: 'multiple' })]}
        />
      </div>

      <div>
        <h3>리스트 스타일</h3>
        <ListCalendar
          plugins={[createRangePlugin({ selectionMode: 'range', maxRange: 7 })]}
        />
      </div>

      <div>
        <h3>모바일 스타일</h3>
        <MobileCalendar
          plugins={[createRangePlugin({ selectionMode: 'single' })]}
        />
      </div>
    </div>
  ),
  args: {
    onDateSelect: fn(),
    onMonthChange: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          '모든 커스텀 스타일을 한 번에 비교해볼 수 있는 페이지입니다. 각각 동일한 헤드리스 로직을 사용하면서도 완전히 다른 UI를 제공합니다.',
      },
    },
  },
};
