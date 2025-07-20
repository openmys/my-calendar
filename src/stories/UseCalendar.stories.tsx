import type { Meta, StoryObj } from '@storybook/react-vite';
import { useCalendar } from '../react/use-calendar';
import { createRangePlugin } from '../plugins/range-plugin';
import { createEventPlugin } from '../plugins/event-plugin';
import { useMemo } from 'react';

// useCalendar 훅을 사용하는 예시 컴포넌트
const CalendarExample = ({
  plugins = [],
  showDecorations = false,
  customStyle = false,
}: {
  plugins?: any[];
  showDecorations?: boolean;
  customStyle?: boolean;
}) => {
  const memoizedPlugins = useMemo(() => plugins, [plugins]);
  const { state, execCommand, decorations } = useCalendar({
    plugins: memoizedPlugins,
  });

  if (!state) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ marginBottom: '20px' }}>
        <h3>현재 상태</h3>
        <p>
          <strong>현재 날짜:</strong>{' '}
          {state.currentDate.toLocaleDateString('ko-KR')}
        </p>
        <p>
          <strong>뷰 타입:</strong> {state.viewType}
        </p>
        <p>
          <strong>총 일수:</strong> {state.days.length}
        </p>
        <p>
          <strong>활성 플러그인 수:</strong> {plugins.length}
        </p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>명령어 테스트</h3>
        <button
          onClick={() => execCommand('goToPreviousMonth')}
          style={{ marginRight: '8px', padding: '4px 8px' }}
        >
          이전 달
        </button>
        <button
          onClick={() => execCommand('goToNextMonth')}
          style={{ marginRight: '8px', padding: '4px 8px' }}
        >
          다음 달
        </button>
        <button
          onClick={() => execCommand('goToToday')}
          style={{ padding: '4px 8px' }}
        >
          오늘
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>캘린더 그리드</h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '2px',
            maxWidth: '400px',
            border: customStyle ? '2px solid #8b5cf6' : '1px solid #ccc',
            borderRadius: customStyle ? '12px' : '4px',
            padding: '12px',
            background: customStyle
              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              : '#fff',
          }}
        >
          {['일', '월', '화', '수', '목', '금', '토'].map(day => (
            <div
              key={day}
              style={{
                textAlign: 'center',
                fontWeight: 'bold',
                padding: '8px',
                color: customStyle ? '#fff' : '#000',
              }}
            >
              {day}
            </div>
          ))}
          {state.days.map((day, index) => {
            const dayDecorations = decorations.getDecorationsForDate(day.date);
            const hasDecorations = dayDecorations.length > 0;

            return (
              <div
                key={index}
                onClick={() => execCommand('selectDate', day.date)}
                style={{
                  textAlign: 'center',
                  padding: '8px',
                  cursor: 'pointer',
                  backgroundColor: hasDecorations
                    ? customStyle
                      ? 'rgba(255,255,255,0.3)'
                      : '#e3f2fd'
                    : customStyle
                      ? 'rgba(255,255,255,0.1)'
                      : '#f9f9f9',
                  border: hasDecorations
                    ? '2px solid #2196f3'
                    : '1px solid #ddd',
                  borderRadius: customStyle ? '8px' : '4px',
                  transition: 'all 0.2s ease',
                  color: customStyle
                    ? '#fff'
                    : day.isCurrentMonth
                      ? '#000'
                      : '#999',
                  opacity: day.isCurrentMonth ? 1 : 0.6,
                }}
                onMouseEnter={e => {
                  if (customStyle) {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.backgroundColor =
                      'rgba(255,255,255,0.4)';
                  } else {
                    e.currentTarget.style.backgroundColor = hasDecorations
                      ? '#bbdefb'
                      : '#e0e0e0';
                  }
                }}
                onMouseLeave={e => {
                  if (customStyle) {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.backgroundColor = hasDecorations
                      ? 'rgba(255,255,255,0.3)'
                      : 'rgba(255,255,255,0.1)';
                  } else {
                    e.currentTarget.style.backgroundColor = hasDecorations
                      ? '#e3f2fd'
                      : '#f9f9f9';
                  }
                }}
              >
                {day.date.getDate()}
              </div>
            );
          })}
        </div>
      </div>

      {showDecorations && (
        <div>
          <h3>데코레이션 정보</h3>
          <div
            style={{ fontSize: '12px', maxHeight: '150px', overflow: 'auto' }}
          >
            <pre>{JSON.stringify(decorations, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

const meta: Meta<typeof CalendarExample> = {
  title: '캘린더/useCalendar 훅',
  component: CalendarExample,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '헤드리스 패턴의 핵심인 useCalendar 훅을 사용한 커스텀 캘린더 구현 예시입니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    plugins: {
      description: '적용할 플러그인들의 배열',
      control: { type: 'object' },
    },
    showDecorations: {
      description: '데코레이션 정보를 표시할지 여부',
      control: { type: 'boolean' },
    },
    customStyle: {
      description: '커스텀 스타일을 적용할지 여부',
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 useCalendar 사용법
export const BasicUsage: Story = {
  args: {
    plugins: [],
    showDecorations: false,
    customStyle: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'useCalendar 훅의 기본 사용법입니다. 플러그인 없이 순수한 캘린더 상태와 명령어만 사용합니다.',
      },
    },
  },
};

// Range 플러그인과 함께 사용
export const WithRangePlugin: Story = {
  args: {
    plugins: [createRangePlugin({ selectionMode: 'range', maxRange: 7 })],
    showDecorations: true,
    customStyle: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Range Selection 플러그인을 사용한 예시입니다. 날짜를 클릭하여 범위를 선택해보세요.',
      },
    },
  },
};

// Event 플러그인과 함께 사용
export const WithEventPlugin: Story = {
  args: {
    plugins: [createEventPlugin({ allowOverlap: true })],
    showDecorations: true,
    customStyle: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Event Management 플러그인을 사용한 예시입니다. 데코레이션 정보에서 이벤트 데이터를 확인할 수 있습니다.',
      },
    },
  },
};

// 여러 플러그인과 함께 사용
export const MultiplePlugins: Story = {
  args: {
    plugins: [
      createRangePlugin({ selectionMode: 'multiple' }),
      createEventPlugin({ allowOverlap: false }),
    ],
    showDecorations: true,
    customStyle: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          '여러 플러그인을 조합한 예시입니다. Range Selection과 Event Management가 함께 동작합니다.',
      },
    },
  },
};

// 커스텀 스타일 적용
export const CustomStyled: Story = {
  args: {
    plugins: [createRangePlugin({ selectionMode: 'single' })],
    showDecorations: false,
    customStyle: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          '헤드리스 패턴의 장점을 보여주는 커스텀 스타일 예시입니다. 동일한 로직에 완전히 다른 UI를 적용했습니다.',
      },
    },
  },
};
