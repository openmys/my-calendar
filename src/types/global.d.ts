/**
 * 전역 타입 정의
 */

interface CalendarInstance {
  execCommand: (command: string, ...args: unknown[]) => boolean;
}

declare global {
  interface Window {
    __calendarInstance?: CalendarInstance;
  }
}

export {};
