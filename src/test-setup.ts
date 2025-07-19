import { afterEach } from 'vitest';

// Cleanup after each test case
afterEach(() => {
  // DOM cleanup if needed

  // Clear global calendar instance
  if (typeof window !== 'undefined') {
    (window as any).__calendarInstance = undefined;
    delete (window as any).__calendarInstance;
  }

  // Clear any timers
  // Note: vi.clearAllTimers() would be called if using vi.useFakeTimers()
});
