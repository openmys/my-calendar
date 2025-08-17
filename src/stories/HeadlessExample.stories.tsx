/**
 * 헤드리스 캘린더 예제
 */

import type { Meta, StoryObj } from '@storybook/react';
// @ts-ignore
import React from 'react';
import { useReactCalendar, DateSelection, RangeSelection } from '@/react';

// 완전한 헤드리스 구현 (스타일 없음)
const HeadlessCalendarComponent = () => {
  const calendar = useReactCalendar({
    features: [DateSelection, RangeSelection],
  });

  // 캘린더 데이터만 사용하여 원하는 대로 UI 구성
  const state = calendar.getState();
  const month = calendar.getMonth();

  return (
    <div style={{ fontFamily: 'monospace' }}>
      <h1>헤드리스 캘린더 데이터</h1>
      <pre>
        {JSON.stringify(
          {
            currentDate: state.currentDate,
            selectedDate: (state as any).selectedDate,
            selectedRange: (state as any).selectedRange,
            monthData: {
              year: month.getYear(),
              month: month.getMonth(),
              weeksCount: month.getWeeks().length,
            },
          },
          null,
          2
        )}
      </pre>

      <h2>날짜 목록</h2>
      <ul>
        {month.getWeeks().flatMap(week =>
          week.getDays().map(day => (
            <li key={day.id}>
              {day.getValue().toLocaleDateString('ko-KR')}:
              {day.getIsToday() && ' [오늘]'}
              {(day as any).getIsSelected?.() && ' [선택됨]'}
              <button onClick={() => (day as any).toggleSelected?.()}>
                선택
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

// 커스텀 스타일 캘린더
const CustomStyledCalendarComponent = () => {
  const calendar = useReactCalendar({
    features: [DateSelection],
    weekStartsOn: 1, // 월요일 시작
  });

  const month = calendar.getMonth();

  return (
    <div
      style={{
        padding: '20px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '20px',
        color: 'white',
      }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
        {calendar.getState().currentDate.toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: 'long',
        })}
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '10px',
        }}
      >
        {['월', '화', '수', '목', '금', '토', '일'].map(day => (
          <div
            key={day}
            style={{
              textAlign: 'center',
              fontWeight: 'bold',
              padding: '10px',
            }}
          >
            {day}
          </div>
        ))}

        {month.getWeeks().flatMap(week =>
          week.getDays().map(day => (
            <button
              key={day.id}
              onClick={() => (day as any).toggleSelected?.()}
              style={{
                padding: '15px',
                border: 'none',
                borderRadius: '10px',
                background: (day as any).getIsSelected?.()
                  ? 'rgba(255, 255, 255, 0.9)'
                  : day.getIsToday()
                    ? 'rgba(255, 255, 255, 0.3)'
                    : 'rgba(255, 255, 255, 0.1)',
                color: (day as any).getIsSelected?.() ? '#764ba2' : 'white',
                cursor: 'pointer',
                opacity: day.getIsCurrentMonth() ? 1 : 0.5,
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              {day.getValue().getDate()}
            </button>
          ))
        )}
      </div>

      <div
        style={{
          marginTop: '20px',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <button
          onClick={() =>
            calendar.setOptions(old => ({
              ...old,
              currentDate: new Date(
                old.currentDate.getFullYear(),
                old.currentDate.getMonth() - 1
              ),
            }))
          }
          style={{
            padding: '10px 20px',
            border: '2px solid white',
            borderRadius: '10px',
            background: 'transparent',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          이전 달
        </button>
        <button
          onClick={() =>
            calendar.setOptions(old => ({
              ...old,
              currentDate: new Date(),
            }))
          }
          style={{
            padding: '10px 20px',
            border: '2px solid white',
            borderRadius: '10px',
            background: 'transparent',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          오늘
        </button>
        <button
          onClick={() =>
            calendar.setOptions(old => ({
              ...old,
              currentDate: new Date(
                old.currentDate.getFullYear(),
                old.currentDate.getMonth() + 1
              ),
            }))
          }
          style={{
            padding: '10px 20px',
            border: '2px solid white',
            borderRadius: '10px',
            background: 'transparent',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          다음 달
        </button>
      </div>
    </div>
  );
};

const meta: Meta = {
  title: 'Calendar/Headless',
  parameters: {
    layout: 'centered',
  },
};

export default meta;

export const DataOnly: StoryObj = {
  render: () => <HeadlessCalendarComponent />,
};

export const CustomStyled: StoryObj = {
  render: () => <CustomStyledCalendarComponent />,
};
