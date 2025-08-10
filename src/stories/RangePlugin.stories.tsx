import type { Meta, StoryObj } from '@storybook/react-vite';
import { createRangePlugin } from '../plugins/range-plugin';
import { useCalendar } from '../react/use-calendar';
import { useMemo } from 'react';
// import { RangePluginQueryFunction } from '../types/range-plugin-types'; // 더 이상 필요 없음!

// Range Plugin 데모 컴포넌트
const RangePluginDemo = ({
  selectionMode = 'range',
  maxRange = 30,
  allowPastDates = true,
  allowFutureDates = true,
}: {
  selectionMode?: 'single' | 'range' | 'multiple';
  maxRange?: number;
  allowPastDates?: boolean;
  allowFutureDates?: boolean;
}) => {
  const plugins = useMemo(() => {
    const plugin = createRangePlugin({
      selectionMode,
      maxRange,
      allowPastDates,
      allowFutureDates,
    });
    return [plugin] as const; // as const로 타입 보존
  }, [selectionMode, maxRange, allowPastDates, allowFutureDates]);

  // useCalendar 훅 사용 - 범용 쿼리 시스템으로 완전 타입 안전!
  const { state, calendar, query, execCommand } = useCalendar({
    plugins,
  });

  // 🔥 범용 쿼리 시스템 - 완전 타입 안전한 쿼리!
  const selectedRange = query('range', 'getSelectedRange'); // { start: Date; end: Date } | null
  const selectedDates = query('range', 'getSelectedDates'); // Date[]
  const currentSelectionMode = query('range', 'getSelectionMode'); // 'single' | 'range' | 'multiple'
  const isSelecting = query('range', 'isSelecting'); // boolean

  // 날짜 클릭 핸들러
  const handleDateClick = (date: Date) => {
    calendar?.handleDateClick(date);
  };

  // 컨트롤 함수들
  const goToPreviousMonth = () => execCommand('goToPreviousMonth');
  const goToNextMonth = () => execCommand('goToNextMonth');

  // 🎯 타입 안전성 시연
  const demonstrateTypeSafety = () => {
    // ✅ 범용 쿼리 시스템 - 모든 타입이 완벽하게 추론됨
    const range = query('range', 'getSelectedRange'); // { start: Date; end: Date } | null
    const dates = query('range', 'getSelectedDates'); // Date[]
    const mode = query('range', 'getSelectionMode'); // 'single' | 'range' | 'multiple'
    const selecting = query('range', 'isSelecting'); // boolean

    // ✅ 범용 쿼리 시스템은 컴파일 타임에 완전히 타입 안전합니다!
    // 잘못된 플러그인 키나 쿼리명은 즉시 타입 에러 발생:
    // query('wrongPlugin', 'getSelectedRange'); // Argument of type '"wrongPlugin"' is not assignable
    // query('range', 'wrongQuery'); // Argument of type '"wrongQuery"' is not assignable

    // eslint-disable-next-line no-console
    console.log('범용 쿼리 시스템 타입 추론 결과:', {
      range,
      dates,
      mode,
      selecting,
    });
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      {/* 타입 추론 시연 섹션 */}
      <div
        style={{
          marginBottom: '20px',
          padding: '15px',
          backgroundColor: '#e8f5e8',
          borderRadius: '8px',
          border: '1px solid #4caf50',
        }}
      >
        <h3 style={{ color: '#2e7d32', margin: '0 0 10px 0' }}>
          ✨ 범용 쿼리 시스템 타입 추론 시연
        </h3>
        <div style={{ fontSize: '14px', color: '#333', marginBottom: '10px' }}>
          <p>
            <strong>🔥 완전 자동 타입 추론:</strong> 범용 쿼리 시스템으로 모든
            쿼리의 매개변수와 반환값이 정확히 추론됩니다
          </p>
          <p>
            <strong>🛡️ 컴파일 타임 안전성:</strong> 잘못된 플러그인 키, 쿼리명,
            매개변수 사용을 미리 방지합니다
          </p>
        </div>
        <button
          onClick={demonstrateTypeSafety}
          style={{
            padding: '8px 16px',
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          콘솔에서 타입 추론 결과 확인하기
        </button>
        <div
          style={{
            marginTop: '10px',
            padding: '8px',
            backgroundColor: '#f1f8e9',
            borderRadius: '4px',
            fontSize: '12px',
          }}
        >
          <strong>현재 추론된 값들:</strong>
          <br />
          <code>
            selectedRange:{' '}
            {selectedRange
              ? `{start: ${selectedRange.start.toLocaleDateString()}, end: ${selectedRange.end.toLocaleDateString()}}`
              : 'null'}
            <br />
            selectedDates: [{selectedDates.length}개 날짜]
            <br />
            selectionMode: &quot;{currentSelectionMode}&quot;
            <br />
            isSelecting: {String(isSelecting)}
          </code>
        </div>
      </div>

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
            <strong>모드:</strong> {currentSelectionMode}
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

      {/* 헤드리스 캘린더 구현 */}
      <div
        style={{
          marginBottom: '20px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '16px',
          backgroundColor: '#fff',
        }}
      >
        {!state ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            캘린더 로딩 중...
          </div>
        ) : (
          <>
            {/* 캘린더 헤더 */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <button
                onClick={goToPreviousMonth}
                style={{
                  padding: '8px 12px',
                  cursor: 'pointer',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: '#f5f5f5',
                }}
              >
                ← 이전달
              </button>
              <h3 style={{ margin: 0 }}>
                {state.currentDate.getFullYear()}년{' '}
                {state.currentDate.getMonth() + 1}월
              </h3>
              <button
                onClick={goToNextMonth}
                style={{
                  padding: '8px 12px',
                  cursor: 'pointer',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: '#f5f5f5',
                }}
              >
                다음달 →
              </button>
            </div>

            {/* 요일 헤더 */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: '4px',
                marginBottom: '8px',
              }}
            >
              {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
                <div
                  key={index}
                  style={{
                    textAlign: 'center',
                    padding: '8px',
                    fontWeight: 'bold',
                    color:
                      index === 0
                        ? '#ff5252'
                        : index === 6
                          ? '#2196f3'
                          : '#333',
                  }}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* 날짜 그리드 */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: '4px',
              }}
            >
              {state.days.map((dayInfo, index) => {
                const date = dayInfo.date;

                // 🔥 범용 쿼리 시스템으로 타입 안전한 상태 확인
                const isSelected = query('range', 'isDateSelected', date);
                const isRangeStart =
                  selectedRange?.start?.getTime() === date.getTime();
                const isRangeEnd =
                  selectedRange?.end?.getTime() === date.getTime();
                const isOtherMonth =
                  date.getMonth() !== state.currentDate.getMonth();
                const isToday = dayInfo.isToday;
                const isWeekend = dayInfo.isWeekend;

                // 스타일 결정
                let backgroundColor = '#fff';
                let color = '#333';
                let border = '1px solid #ddd';
                let fontWeight = 'normal';

                if (isSelected) {
                  backgroundColor = '#e3f2fd';
                  border = '2px solid #1976d2';
                }
                if (isRangeStart || isRangeEnd) {
                  backgroundColor = '#1976d2';
                  color = '#fff';
                  fontWeight = 'bold';
                }
                if (isToday) {
                  border = '2px solid #ff9800';
                }
                if (isOtherMonth) {
                  color = '#ccc';
                }
                if (isWeekend && !isOtherMonth) {
                  color = index % 7 === 0 ? '#ff5252' : '#2196f3';
                }

                return (
                  <div
                    key={date.toISOString()}
                    onClick={() => handleDateClick(date)}
                    style={{
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor,
                      color,
                      border,
                      borderRadius: '4px',
                      cursor: 'pointer',
                      userSelect: 'none',
                      fontWeight,
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => {
                      if (!isSelected && !isRangeStart && !isRangeEnd) {
                        e.currentTarget.style.backgroundColor = '#f0f0f0';
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isSelected && !isRangeStart && !isRangeEnd) {
                        e.currentTarget.style.backgroundColor = backgroundColor;
                      }
                    }}
                  >
                    {date.getDate()}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      <div
        style={{
          padding: '16px',
          backgroundColor: '#e3f2fd',
          borderRadius: '8px',
        }}
      >
        <h4 style={{ margin: '0 0 12px 0' }}>선택된 날짜 정보</h4>

        {/* 현재 선택 상태 표시 */}
        <div
          style={{
            marginBottom: '12px',
            padding: '8px',
            backgroundColor: '#fff3e0',
            borderRadius: '4px',
          }}
        >
          <strong>현재 상태:</strong>{' '}
          <span
            style={{
              color: isSelecting
                ? '#ff9800'
                : currentSelectionMode === 'range' &&
                    selectedRange?.start &&
                    selectedRange?.end
                  ? '#4caf50'
                  : '#666',
            }}
          >
            {isSelecting
              ? '범위 선택 중...'
              : currentSelectionMode === 'range' &&
                  selectedRange?.start &&
                  selectedRange?.end
                ? '범위 선택 완료'
                : '대기 중'}
          </span>
        </div>

        {currentSelectionMode === 'single' && (
          <div>
            <strong>선택된 날짜:</strong>{' '}
            {selectedDates && selectedDates.length > 0
              ? selectedDates[0].toLocaleDateString('ko-KR')
              : '없음'}
          </div>
        )}

        {currentSelectionMode === 'multiple' && (
          <div>
            <strong>선택된 날짜들 ({selectedDates?.length ?? 0}):</strong>
            <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
              {selectedDates?.map((date, index) => (
                <li key={index}>{date.toLocaleDateString('ko-KR')}</li>
              ))}
            </ul>
          </div>
        )}

        {currentSelectionMode === 'range' && (
          <div>
            <strong>선택된 범위:</strong>
            <div style={{ marginTop: '8px' }}>
              시작:{' '}
              {selectedRange?.start
                ? selectedRange.start.toLocaleDateString('ko-KR')
                : '미선택'}
              <br />
              종료:{' '}
              {selectedRange?.end
                ? selectedRange.end.toLocaleDateString('ko-KR')
                : '미선택'}
              {selectedRange?.start && selectedRange?.end && (
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
          {currentSelectionMode === 'range' &&
            ' 범위 모드에서는 시작과 끝 날짜를 순서대로 클릭하세요. 범위가 완료된 후 다른 날짜를 클릭하면 새로 시작됩니다.'}
          {currentSelectionMode === 'multiple' &&
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
