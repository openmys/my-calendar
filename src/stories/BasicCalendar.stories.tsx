/**
 * 기본 캘린더 스토리북
 */

import type { Meta, StoryObj } from '@storybook/react';
// @ts-ignore
import React from 'react';
import { useReactCalendar, DateSelection, RangeSelection } from '@/react';
import '@/styles/calendar.css';

// 1. 기본 캘린더 컴포넌트
const BasicCalendarComponent = () => {
  const calendar = useReactCalendar({
    features: [DateSelection],
  });

  const month = calendar.getMonth();
  const weeks = month.getWeeks();

  return (
    <div className='calendar'>
      <div className='calendar-header'>
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
        >
          Previous
        </button>
        <h2>
          {calendar.getState().currentDate.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
          })}
        </h2>
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
        >
          Next
        </button>
      </div>

      <div className='calendar-grid'>
        {/* 요일 헤더 */}
        <div className='weekdays'>
          {['일', '월', '화', '수', '목', '금', '토'].map(day => (
            <div key={day} className='weekday'>
              {day}
            </div>
          ))}
        </div>

        {/* 날짜 그리드 */}
        {weeks.map(week => (
          <div key={week.id} className='week'>
            {week.getDays().map(day => (
              <div
                key={day.id}
                className={`day ${day.getIsToday() ? 'today' : ''} ${(day as any).getIsSelected?.() ? 'selected' : ''} ${!day.getIsCurrentMonth() ? 'other-month' : ''}`}
                onClick={() => (day as any).toggleSelected?.()}
              >
                {day.getValue().getDate()}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* 선택된 날짜 표시 */}
      {(calendar as any).getSelectedDate?.() && (
        <div className='selected-info'>
          선택된 날짜:{' '}
          {(calendar as any).getSelectedDate().toLocaleDateString('ko-KR')}
        </div>
      )}
    </div>
  );
};

// 2. 범위 선택 캘린더
const RangeCalendarComponent = () => {
  const calendar = useReactCalendar({
    features: [RangeSelection],
    maxRange: 7, // 최대 7일까지 선택 가능
  });

  const handleDayClick = (day: any) => {
    const state = calendar.getState();

    if (!(state as any).isSelecting) {
      (calendar as any).startRangeSelection(day.getValue());
    } else {
      (calendar as any).endRangeSelection(day.getValue());
    }
  };

  const handleDayHover = (day: any) => {
    if ((calendar as any).getIsSelectingRange()) {
      (calendar as any).setHoverDate(day.getValue());
    }
  };

  const month = calendar.getMonth();
  const weeks = month.getWeeks();

  return (
    <div className='calendar'>
      <div className='calendar-header'>
        <h2>범위 선택 캘린더</h2>
        <button onClick={() => (calendar as any).resetRangeSelection()}>
          선택 초기화
        </button>
      </div>

      <div className='calendar-grid'>
        {weeks.map(week => (
          <div key={week.id} className='week'>
            {week.getDays().map(day => (
              <div
                key={day.id}
                className={`day 
                  ${(day as any).getIsInRange?.() ? 'in-range' : ''} 
                  ${(day as any).getIsRangeStart?.() ? 'range-start' : ''} 
                  ${(day as any).getIsRangeEnd?.() ? 'range-end' : ''}
                `}
                onClick={() => handleDayClick(day)}
                onMouseEnter={() => handleDayHover(day)}
              >
                {day.getValue().getDate()}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* 선택된 범위 표시 */}
      {(calendar as any).getSelectedRange?.() && (
        <div className='range-info'>
          선택 범위:{' '}
          {(calendar as any)
            .getSelectedRange()
            .start.toLocaleDateString('ko-KR')}{' '}
          -{' '}
          {(calendar as any).getSelectedRange().end.toLocaleDateString('ko-KR')}
        </div>
      )}
    </div>
  );
};

// 3. 고급 캘린더 (여러 Feature 조합)
const AdvancedCalendarComponent = () => {
  const calendar = useReactCalendar({
    features: [DateSelection, RangeSelection],
    enableDateSelection: date => {
      // 주말은 선택 불가
      return date.getDay() !== 0 && date.getDay() !== 6;
    },
  });

  // 모드 전환 상태
  const [mode, setMode] = React.useState<'single' | 'range'>('single');

  const handleDayClick = (day: any) => {
    if (mode === 'single') {
      day.toggleSelected?.();
    } else {
      const state = calendar.getState();
      if (!(state as any).isSelecting) {
        (calendar as any).startRangeSelection(day.getValue());
      } else {
        (calendar as any).endRangeSelection(day.getValue());
      }
    }
  };

  const month = calendar.getMonth();

  return (
    <div className='calendar'>
      <div className='calendar-controls'>
        <button
          onClick={() => setMode('single')}
          className={mode === 'single' ? 'active' : ''}
        >
          단일 선택
        </button>
        <button
          onClick={() => setMode('range')}
          className={mode === 'range' ? 'active' : ''}
        >
          범위 선택
        </button>
      </div>

      <div className='calendar-grid'>
        {month.getWeeks().map(week => (
          <div key={week.id} className='week'>
            {week.getDays().map((day: any) => {
              const canSelect =
                mode === 'single'
                  ? day.getCanSelect?.()
                  : day.getCanSelectRange?.();

              return (
                <div
                  key={day.id}
                  className={`day 
                    ${!canSelect ? 'disabled' : ''}
                    ${day.getIsSelected?.() ? 'selected' : ''}
                    ${day.getIsInRange?.() ? 'in-range' : ''}
                  `}
                  onClick={() => canSelect && handleDayClick(day)}
                >
                  {day.getValue().getDate()}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

const meta: Meta = {
  title: 'Calendar/Basic',
  parameters: {
    layout: 'centered',
  },
};

export default meta;

export const SingleSelection: StoryObj = {
  render: () => <BasicCalendarComponent />,
};

export const RangeSelectionStory: StoryObj = {
  render: () => <RangeCalendarComponent />,
};

export const Advanced: StoryObj = {
  render: () => <AdvancedCalendarComponent />,
};
