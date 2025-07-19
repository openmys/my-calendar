# Changelog

이 파일에는 프로젝트의 주요 변경사항이 기록됩니다.

형식은 [Keep a Changelog](https://keepachangelog.com/ko/1.0.0/)를 기반으로 하며,
이 프로젝트는 [Semantic Versioning](https://semver.org/spec/v2.0.0.html)을 따릅니다.

## [Unreleased]

### Added
- 배포 환경 설정 구성
- GitHub Actions CI/CD 파이프라인
- ESLint 및 Prettier 설정
- TypeDoc 기반 문서화 자동화

## [1.0.0] - 2024-12-19

### Added
- ProseMirror 스타일 헤드리스 캘린더 라이브러리 초기 구현
- State System: 불변 상태 관리 및 Transaction 기반 업데이트
- Command System: 사용자 액션의 구조화된 처리
- Plugin System: 모듈형 확장 시스템
- Decoration System: 선언적 UI 렌더링
- CalendarView: 핵심 뷰 관리 클래스
- Range Selection Plugin: 날짜 범위 선택 기능
- Event Management Plugin: 이벤트 CRUD 및 관리 기능
- React 어댑터: React 환경에서의 완전한 통합
- TypeScript 완전 지원: 100% 타입 안전성
- 테스트 환경 설정 (Vitest + jsdom)

### Technical Details
- Vite 기반 빌드 시스템
- TypeScript 5.2.2
- React 18 지원
- ESM 모듈 형식
- 프로덕션 빌드 크기: 23.82 kB (gzip)