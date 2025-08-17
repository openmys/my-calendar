# @openmys/my-calendar

> TanStack Table 스타일 헤드리스 캘린더 라이브러리

## 🚀 특징

- **헤드리스 아키텍처**: UI 프레임워크에 완전히 독립적
- **Feature 시스템**: TanStack Table 스타일의 확장 가능한 아키텍처
- **타입스크립트 완전 지원**: Module Augmentation을 통한 100% 타입 안전성
- **React 통합**: React 환경에서 완전한 통합 지원
- **성능 최적화**: Memoization 기반 렌더링 최적화
- **모듈형 설계**: 필요한 기능만 선택적 사용

## 📦 설치

```bash
npm install @openmys/my-calendar
# 또는
pnpm add @openmys/my-calendar
# 또는
yarn add @openmys/my-calendar
```

## 🎯 빠른 시작

### 기본 사용법

```tsx
import { useReactCalendar, DateSelection } from '@openmys/my-calendar/react';

function MyCalendar() {
  const calendar = useReactCalendar({
    features: [DateSelection],
  });

  const month = calendar.getMonth();

  return (
    <div>
      {month.getWeeks().map(week => (
        <div key={week.id}>
          {week.getDays().map(day => (
            <button 
              key={day.id}
              onClick={() => day.toggleSelected()}
              className={day.getIsSelected() ? 'selected' : ''}
            >
              {day.getValue().getDate()}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
```

### 범위 선택

```tsx
import { useReactCalendar, RangeSelection } from '@openmys/my-calendar/react';

function RangeCalendar() {
  const calendar = useReactCalendar({
    features: [RangeSelection],
    maxRange: 7, // 최대 7일까지 선택 가능
  });

  const handleDayClick = (day) => {
    const state = calendar.getState();
    
    if (!state.isSelecting) {
      calendar.startRangeSelection(day.getValue());
    } else {
      calendar.endRangeSelection(day.getValue());
    }
  };

  return (
    <div>
      {/* 캘린더 렌더링 */}
    </div>
  );
}
```

### 여러 Feature 조합

```tsx
import { useReactCalendar, DateSelection, RangeSelection } from '@openmys/my-calendar/react';

function AdvancedCalendar() {
  const calendar = useReactCalendar({
    features: [DateSelection, RangeSelection],
    enableDateSelection: (date) => date.getDay() !== 0, // 일요일 제외
    maxRange: 14,
  });

  // 두 Feature의 기능을 모두 사용 가능
  calendar.toggleDateSelection(date);
  calendar.startRangeSelection(date);
}
```

## 🏗️ 아키텍처

### Feature 시스템

TanStack Table의 Feature 시스템을 캘린더에 적용:

```typescript
export interface CalendarFeature<TData = any> {
  createDay?: (day, week, month, calendar) => void;
  createWeek?: (week, month, calendar) => void;
  createMonth?: (month, calendar) => void;
  createCalendar?: (calendar) => void;
  getDefaultOptions?: (calendar) => Partial<CalendarOptionsResolved>;
  getInitialState?: (initialState) => Partial<CalendarState>;
}
```

### 계층 구조

```
Calendar (전체 캘린더)
  └── Month (월)
      └── Week (주)
          └── Day (일)
```

각 계층은 독립적인 인스턴스로 관리되며, 필요한 메서드와 상태를 가집니다.

## 🎨 커스텀 Feature 만들기

```typescript
import { CalendarFeature } from '@openmys/my-calendar';

export const MyCustomFeature: CalendarFeature = {
  getInitialState: (state) => ({
    ...state,
    myCustomState: null,
  }),
  
  createCalendar: (calendar) => {
    Object.assign(calendar, {
      myCustomMethod: () => {
        // 커스텀 로직
      },
    });
  },
  
  createDay: (day, week, month, calendar) => {
    Object.assign(day, {
      getMyCustomProp: () => {
        // 날짜별 커스텀 속성
      },
    });
  },
};

// TypeScript 타입 확장
declare module '@openmys/my-calendar/types/calendar' {
  interface CalendarState {
    myCustomState: any;
  }
  interface Calendar {
    myCustomMethod: () => void;
  }
  interface Day {
    getMyCustomProp: () => any;
  }
}
```

## 📚 API Reference

### Calendar 인스턴스

#### Core Methods
- `getState()`: 현재 상태 반환
- `setState(updater)`: 상태 업데이트
- `setOptions(updater)`: 옵션 업데이트
- `reset()`: 초기 상태로 리셋

#### Data Access
- `getMonth()`: 현재 월 인스턴스 반환
- `getWeeks()`: 주 인스턴스 배열 반환
- `getDays()`: 일 인스턴스 배열 반환

### DateSelection Feature

- `getSelectedDate()`: 선택된 날짜 반환
- `setSelectedDate(date)`: 날짜 선택
- `toggleDateSelection(date)`: 날짜 선택 토글
- `resetDateSelection()`: 선택 초기화

### RangeSelection Feature

- `getSelectedRange()`: 선택된 범위 반환
- `startRangeSelection(date)`: 범위 선택 시작
- `endRangeSelection(date)`: 범위 선택 종료
- `setSelectedRange(start, end)`: 범위 설정
- `resetRangeSelection()`: 범위 초기화
- `getIsSelectingRange()`: 선택 중 상태 확인
- `setHoverDate(date)`: 호버 날짜 설정

### Day 인스턴스

#### Core Methods
- `getValue()`: Date 객체 반환
- `getIsToday()`: 오늘 여부
- `getIsWeekend()`: 주말 여부
- `getIsCurrentMonth()`: 현재 월 포함 여부

#### DateSelection Methods
- `getCanSelect()`: 선택 가능 여부
- `getIsSelected()`: 선택 상태
- `toggleSelected()`: 선택 토글

#### RangeSelection Methods
- `getCanSelectRange()`: 범위 선택 가능 여부
- `getIsInRange()`: 범위 내 포함 여부
- `getIsRangeStart()`: 범위 시작일 여부
- `getIsRangeEnd()`: 범위 종료일 여부

## 🔧 옵션

```typescript
interface CalendarOptions {
  // Core
  currentDate?: Date;
  viewType?: 'month' | 'week' | 'day' | 'year';
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  locale?: string;
  timezone?: string;
  
  // Features
  features?: CalendarFeature[];
  
  // DateSelection
  enableDateSelection?: boolean | ((date: Date) => boolean);
  onDateSelectionChange?: (date: Date | null) => void;
  
  // RangeSelection
  enableRangeSelection?: boolean | ((date: Date) => boolean);
  maxRange?: number;
  minRange?: number;
  onRangeSelectionChange?: (range: { start: Date; end: Date } | null) => void;
  
  // Debug
  debugAll?: boolean;
  debugCells?: boolean;
  debugWeeks?: boolean;
  debugMonths?: boolean;
  debugCalendar?: boolean;
}
```

## 🧪 테스트

```bash
npm test
# 또는
pnpm test
```

## 📄 라이선스

MIT

## 🤝 기여

기여는 언제나 환영합니다! PR을 보내주세요.

## 📮 문의

이슈나 문의사항은 [GitHub Issues](https://github.com/openmys/my-calendar/issues)를 이용해주세요.