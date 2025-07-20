import type { Meta, StoryObj } from '@storybook/react-vite';
// Storybook 9.0 호환을 위해 콘솔 로깅으로 대체
import { Calendar } from '../react/calendar';
import { createRangePlugin } from '../plugins/range-plugin';
import { useMemo, useState } from 'react';

// Range Plugin 데모 컴포넌트
const RangePluginDemo = ({
  selectionMode = 'single',
  maxRange = 30,
  allowPastDates = true,
  allowFutureDates = true,
}: {
  selectionMode?: 'single' | 'range' | 'multiple';
  maxRange?: number;
  allowPastDates?: boolean;
  allowFutureDates?: boolean;
}) => {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [selectedRange, setSelectedRange] = useState<{
    start?: Date;
    end?: Date;
  }>({});

  const plugin = useMemo(
    () =>
      createRangePlugin({
        selectionMode,
        maxRange,
        allowPastDates,
        allowFutureDates,
      }),
    [selectionMode, maxRange, allowPastDates, allowFutureDates]
  );

  const handleDateClick = (date: Date) => {
    if (selectionMode === 'single') {
      setSelectedDates([date]);
    } else if (selectionMode === 'multiple') {
      setSelectedDates(prev => {
        const exists = prev.find(d => d.getTime() === date.getTime());
        if (exists) {
          return prev.filter(d => d.getTime() !== date.getTime());
        } else {
          return [...prev, date];
        }
      });
    } else if (selectionMode === 'range') {
      setSelectedRange(prev => {
        if (!prev.start || (prev.start && prev.end)) {
          return { start: date };
        } else {
          const start = prev.start < date ? prev.start : date;
          const end = prev.start < date ? date : prev.start;
          return { start, end };
        }
      });
    }
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
        <h3 style={{ margin: '0 0 12px 0' }}>Range Selection Plugin 설정</h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '8px',
            fontSize: '14px',
          }}
        >
          <div>
            <strong>모드:</strong> {selectionMode}
          </div>
          <div>
            <strong>최대 범위:</strong> {maxRange}일
          </div>
          <div>
            <strong>과거 날짜:</strong> {allowPastDates ? '허용' : '금지'}
          </div>
          <div>
            <strong>미래 날짜:</strong> {allowFutureDates ? '허용' : '금지'}
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <Calendar
          plugins={[plugin]}
          onDateClick={handleDateClick}
          onMonthChange={() => {}}
        />
      </div>

      <div
        style={{
          padding: '16px',
          backgroundColor: '#e3f2fd',
          borderRadius: '8px',
        }}
      >
        <h4 style={{ margin: '0 0 12px 0' }}>선택된 날짜 정보</h4>

        {selectionMode === 'single' && (
          <div>
            <strong>선택된 날짜:</strong>{' '}
            {selectedDates.length > 0
              ? selectedDates[0].toLocaleDateString('ko-KR')
              : '없음'}
          </div>
        )}

        {selectionMode === 'multiple' && (
          <div>
            <strong>선택된 날짜들 ({selectedDates.length}):</strong>
            <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
              {selectedDates.map((date, index) => (
                <li key={index}>{date.toLocaleDateString('ko-KR')}</li>
              ))}
            </ul>
          </div>
        )}

        {selectionMode === 'range' && (
          <div>
            <strong>선택된 범위:</strong>
            <div style={{ marginTop: '8px' }}>
              시작:{' '}
              {selectedRange.start
                ? selectedRange.start.toLocaleDateString('ko-KR')
                : '미선택'}
              <br />
              종료:{' '}
              {selectedRange.end
                ? selectedRange.end.toLocaleDateString('ko-KR')
                : '미선택'}
              {selectedRange.start && selectedRange.end && (
                <div style={{ marginTop: '4px', color: '#1976d2' }}>
                  총{' '}
                  {Math.ceil(
                    (selectedRange.end.getTime() -
                      selectedRange.start.getTime()) /
                      (1000 * 60 * 60 * 24)
                  ) + 1}
                  일
                </div>
              )}
            </div>
          </div>
        )}

        <div style={{ marginTop: '12px', fontSize: '12px', color: '#666' }}>
          <strong>사용 팁:</strong> 날짜를 클릭하여 선택하세요.
          {selectionMode === 'range' &&
            ' 범위 모드에서는 시작과 끝 날짜를 순서대로 클릭하세요.'}
          {selectionMode === 'multiple' &&
            ' 다중 선택 모드에서는 여러 날짜를 개별적으로 선택할 수 있습니다.'}
        </div>
      </div>
    </div>
  );
};

const meta: Meta<typeof RangePluginDemo> = {
  title: '플러그인/Range Selection Plugin',
  component: RangePluginDemo,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Range Selection Plugin은 날짜 범위 선택 기능을 제공합니다. 단일 선택, 범위 선택, 다중 선택 모드를 지원합니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    selectionMode: {
      description: '선택 모드',
      control: { type: 'select' },
      options: ['single', 'range', 'multiple'],
    },
    maxRange: {
      description: '범위 모드에서 최대 선택 가능한 날짜 수',
      control: { type: 'number', min: 1, max: 365 },
    },
    allowPastDates: {
      description: '과거 날짜 선택 허용 여부',
      control: { type: 'boolean' },
    },
    allowFutureDates: {
      description: '미래 날짜 선택 허용 여부',
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 단일 날짜 선택
export const SingleSelection: Story = {
  args: {
    selectionMode: 'single',
    allowPastDates: true,
    allowFutureDates: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          '가장 기본적인 단일 날짜 선택 모드입니다. 한 번에 하나의 날짜만 선택할 수 있습니다.',
      },
    },
  },
};

// 범위 날짜 선택
export const RangeSelection: Story = {
  args: {
    selectionMode: 'range',
    maxRange: 14,
    allowPastDates: true,
    allowFutureDates: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          '시작 날짜와 종료 날짜를 선택하여 연속된 날짜 범위를 선택하는 모드입니다. 최대 14일까지 선택 가능합니다.',
      },
    },
  },
};

// 다중 날짜 선택
export const MultipleSelection: Story = {
  args: {
    selectionMode: 'multiple',
    allowPastDates: true,
    allowFutureDates: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          '여러 개의 개별 날짜를 선택할 수 있는 모드입니다. 최대 5개까지 선택 가능합니다.',
      },
    },
  },
};

// 제한된 범위 선택 (주말만)
export const WeekendOnly: Story = {
  args: {
    selectionMode: 'multiple',
    allowPastDates: false,
    allowFutureDates: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          '미래 날짜만 선택 가능한 설정입니다. 과거 날짜는 선택할 수 없으며, 최대 8개의 날짜를 선택할 수 있습니다.',
      },
    },
  },
};

// 짧은 범위 선택 (1주일)
export const WeeklyRange: Story = {
  args: {
    selectionMode: 'range',
    maxRange: 7,
    allowPastDates: true,
    allowFutureDates: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          '최대 7일(1주일)까지만 선택할 수 있는 제한된 범위 선택 모드입니다.',
      },
    },
  },
};

// 긴 범위 선택 (1달)
export const MonthlyRange: Story = {
  args: {
    selectionMode: 'range',
    maxRange: 30,
    allowPastDates: true,
    allowFutureDates: true,
  },
  parameters: {
    docs: {
      description: {
        story: '최대 30일(약 1달)까지 선택할 수 있는 긴 범위 선택 모드입니다.',
      },
    },
  },
};
