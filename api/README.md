**@openmys/my-calendar v1.0.0**

***

# @openmys/my-calendar

> ProseMirror 스타일 헤드리스 캘린더 라이브러리

## 🚀 특징

- **헤드리스 아키텍처**: UI에 구애받지 않는 순수 로직 라이브러리
- **플러그인 시스템**: ProseMirror 스타일의 확장 가능한 아키텍처
- **타입스크립트 완전 지원**: 100% 타입 안전성
- **React 통합**: React 환경에서 완전한 통합 지원
- **불변 상태 관리**: Transaction 기반 상태 업데이트
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

```typescript
import { createCalendarState, CalendarView } from '@openmys/my-calendar';
import { createRangePlugin } from '@openmys/my-calendar';

// 플러그인 생성
const rangePlugin = createRangePlugin();

// 캘린더 상태 생성
const state = createCalendarState([rangePlugin]);

// 캘린더 뷰 생성
const calendar = new CalendarView(
  document.getElementById('calendar'),
  state,
  [rangePlugin]
);
```

### React와 함께 사용

```tsx
import { useCalendar, Calendar } from '@openmys/my-calendar/react';
import { createRangePlugin, createEventPlugin } from '@openmys/my-calendar';

function MyCalendar() {
  const calendar = useCalendar({
    plugins: [createRangePlugin(), createEventPlugin()],
    initialDate: new Date(),
  });

  return (
    <Calendar calendar={calendar}>
      <Calendar.Header />
      <Calendar.Grid />
      <Calendar.Events />
    </Calendar>
  );
}
```

## 📚 문서

- [API 문서](https://openmys.github.io/my-calendar/api/)
- [플러그인 가이드](https://openmys.github.io/my-calendar/plugins/)
- [React 통합 가이드](https://openmys.github.io/my-calendar/react/)

## 🔧 개발

```bash
# 의존성 설치
pnpm install

# 개발 서버 시작
pnpm dev

# 테스트 실행
pnpm test

# 빌드
pnpm build
```

## 📄 라이선스

MIT © OpenMYS
