/**
 * Accessibility Plugin
 * 접근성 지원을 위한 플러그인 (ARIA, 키보드 네비게이션, 스크린 리더)
 */

import { Plugin, PluginSpec } from '@/core/plugin';
import { PluginState, Transaction, CalendarState } from '@/types';
import { DecorationSet, DecorationFactory } from '@/core/decoration';
import { transactions } from '@/core/transaction';

export interface AccessibilityOptions {
  ariaLive?: 'polite' | 'assertive' | 'off';
  announceSelections?: boolean;
  announceNavigations?: boolean;
  keyboardNavigation?: boolean;
  focusManagement?: boolean;
  screenReaderSupport?: boolean;
}

export interface AccessibilityState {
  focusedDate: Date | null;
  announcement: string | null;
  announcementType: 'polite' | 'assertive' | null;
  navigationMode: 'grid' | 'list' | 'timeline';
  describedBy: Map<string, string>; // 요소 ID와 설명 매핑
  options: AccessibilityOptions;
}

/**
 * Accessibility Plugin State 클래스
 */
class AccessibilityPluginState extends PluginState<AccessibilityState> {
  apply(transaction: Transaction): AccessibilityPluginState {
    const newValue = { ...this.value };

    switch (transaction.type) {
      case 'A11Y_FOCUS_DATE':
        newValue.focusedDate = new Date(transaction.payload.date);
        if (newValue.options.announceNavigations) {
          newValue.announcement = this.createDateAnnouncement(newValue.focusedDate);
          newValue.announcementType = 'polite';
        }
        break;

      case 'A11Y_ANNOUNCE':
        newValue.announcement = transaction.payload.message;
        newValue.announcementType = transaction.payload.type ?? 'polite';
        break;

      case 'A11Y_CLEAR_ANNOUNCEMENT':
        newValue.announcement = null;
        newValue.announcementType = null;
        break;

      case 'A11Y_SET_NAVIGATION_MODE':
        newValue.navigationMode = transaction.payload.mode;
        break;

      case 'A11Y_ADD_DESCRIPTION':
        newValue.describedBy.set(transaction.payload.id, transaction.payload.description);
        break;

      case 'A11Y_REMOVE_DESCRIPTION':
        newValue.describedBy.delete(transaction.payload.id);
        break;

      case 'A11Y_SET_OPTIONS':
        newValue.options = { ...newValue.options, ...transaction.payload.options };
        break;

      // 다른 플러그인의 이벤트에 반응
      case 'RANGE_SELECT_SINGLE':
      case 'RANGE_SELECT_RANGE':
        if (newValue.options.announceSelections) {
          const date = transaction.payload.date ?? transaction.payload.start;
          newValue.announcement = this.createSelectionAnnouncement(date, transaction.payload);
          newValue.announcementType = 'assertive';
        }
        break;
    }

    return new AccessibilityPluginState(newValue);
  }

  toJSON(): AccessibilityState {
    return {
      ...this.value,
      describedBy: Object.fromEntries(this.value.describedBy) as any
    };
  }

  static fromJSON(value: any): AccessibilityPluginState {
    const state = { ...value };
    state.describedBy = new Map(Object.entries(state.describedBy ?? {}));
    if (state.focusedDate) {
      state.focusedDate = new Date(state.focusedDate);
    }
    return new AccessibilityPluginState(state);
  }

  private createDateAnnouncement(date: Date): string {
    const dayName = date.toLocaleDateString('ko-KR', { weekday: 'long' });
    const dateStr = date.toLocaleDateString('ko-KR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    return `${dayName}, ${dateStr}로 이동했습니다`;
  }

  private createSelectionAnnouncement(date: Date, payload: any): string {
    if (payload.end) {
      // 범위 선택
      const startStr = payload.start.toLocaleDateString('ko-KR');
      const endStr = payload.end.toLocaleDateString('ko-KR');
      return `${startStr}부터 ${endStr}까지 범위가 선택되었습니다`;
    } else {
      // 단일 날짜 선택
      const dateStr = date.toLocaleDateString('ko-KR');
      return `${dateStr}이 선택되었습니다`;
    }
  }
}

/**
 * Accessibility Plugin 생성 함수
 */
export function createAccessibilityPlugin(options: AccessibilityOptions = {}): Plugin<AccessibilityState> {
  const defaultOptions: AccessibilityOptions = {
    ariaLive: 'polite',
    announceSelections: true,
    announceNavigations: true,
    keyboardNavigation: true,
    focusManagement: true,
    screenReaderSupport: true
  };

  const finalOptions = { ...defaultOptions, ...options };

  const spec: PluginSpec<AccessibilityState> = {
    key: 'accessibility',
    priority: 1000, // 높은 우선순위로 다른 플러그인보다 먼저 처리

    state: {
      init: () => new AccessibilityPluginState({
        focusedDate: null,
        announcement: null,
        announcementType: null,
        navigationMode: 'grid',
        describedBy: new Map(),
        options: finalOptions
      }),
      apply: (transaction, state) => state.apply(transaction)
    },

    commands: (_plugin) => ({
      focusDate: (date: Date) => (_state: any, dispatch?: any) => {
        if (dispatch) {
          dispatch(transactions.custom('A11Y_FOCUS_DATE', { date }));
        }
        return true;
      },

      announce: (message: string, type: 'polite' | 'assertive' = 'polite') => 
        (_state: any, dispatch?: any) => {
          if (dispatch) {
            dispatch(transactions.custom('A11Y_ANNOUNCE', { message, type }));
          }
          return true;
        },

      clearAnnouncement: () => (_state: any, dispatch?: any) => {
        if (dispatch) {
          dispatch(transactions.custom('A11Y_CLEAR_ANNOUNCEMENT', {}));
        }
        return true;
      },

      setNavigationMode: (mode: 'grid' | 'list' | 'timeline') => 
        (_state: any, dispatch?: any) => {
          if (dispatch) {
            dispatch(transactions.custom('A11Y_SET_NAVIGATION_MODE', { mode }));
          }
          return true;
        },

      addDescription: (id: string, description: string) => 
        (_state: any, dispatch?: any) => {
          if (dispatch) {
            dispatch(transactions.custom('A11Y_ADD_DESCRIPTION', { id, description }));
          }
          return true;
        }
    }),

    decorations: (state, plugin) => {
      const a11yState = plugin.getState(state);
      if (!a11yState) return new DecorationSet();

      const decorations: any[] = [];

      // 캘린더 컨테이너에 ARIA 속성 추가
      decorations.push(
        DecorationFactory.widget(new Date(), () => {
          const container = document.createElement('div');
          container.setAttribute('role', 'grid');
          container.setAttribute('aria-label', '캘린더');
          container.setAttribute('aria-roledescription', '날짜 선택기');
          
          if (a11yState.value.focusedDate) {
            const focusedId = getDateCellId(a11yState.value.focusedDate);
            container.setAttribute('aria-activedescendant', focusedId);
          }
          
          if (a11yState.value.options.ariaLive && a11yState.value.options.ariaLive !== 'off') {
            container.setAttribute('aria-live', a11yState.value.options.ariaLive);
          }
          
          return container;
        })
      );

      // 각 날짜 셀에 ARIA 속성 추가
      for (const day of state.days) {
        const cellId = getDateCellId(day.date);
        const isFocused = a11yState.value.focusedDate?.getTime() === day.date.getTime();
        const isSelected = isDateSelected(day.date, state);
        
        decorations.push(
          DecorationFactory.widget(day.date, () => {
            const cell = document.createElement('td');
            cell.id = cellId;
            cell.setAttribute('role', 'gridcell');
            cell.setAttribute('aria-selected', isSelected ? 'true' : 'false');
            cell.setAttribute('tabindex', isFocused ? '0' : '-1');
            
            // 접근 가능한 레이블 생성
            const ariaLabel = createDateLabel(day.date, state);
            cell.setAttribute('aria-label', ariaLabel);
            
            // 설명 추가 (있는 경우)
            const description = a11yState.value.describedBy.get(cellId);
            if (description) {
              cell.setAttribute('aria-describedby', `${cellId}-desc`);
            }
            
            return cell;
          })
        );
      }

      // 스크린 리더 알림 영역
      if (a11yState.value.announcement) {
        decorations.push(
          DecorationFactory.widget(new Date(), () => {
            const announcement = document.createElement('div');
            announcement.className = 'sr-only';
            announcement.setAttribute('aria-live', a11yState.value.announcementType ?? 'polite');
            announcement.setAttribute('aria-atomic', 'true');
            announcement.textContent = a11yState.value.announcement;
            return announcement;
          })
        );
      }

      return new DecorationSet(decorations);
    },

    props: {
      handleKeyDown: (event, state, plugin) => {
        const a11yState = plugin.getState(state);
        if (!a11yState?.value.options.keyboardNavigation) return false;

        const focusedDate = a11yState.value.focusedDate ?? state.currentDate;
        
        switch (event.key) {
          case 'ArrowRight':
            event.preventDefault();
            return moveFocus(focusedDate, 1, 'day');
            
          case 'ArrowLeft':
            event.preventDefault();
            return moveFocus(focusedDate, -1, 'day');
            
          case 'ArrowDown':
            event.preventDefault();
            return moveFocus(focusedDate, 1, 'week');
            
          case 'ArrowUp':
            event.preventDefault();
            return moveFocus(focusedDate, -1, 'week');
            
          case 'Home':
            event.preventDefault();
            return moveFocus(focusedDate, 0, 'weekStart');
            
          case 'End':
            event.preventDefault();
            return moveFocus(focusedDate, 0, 'weekEnd');
            
          case 'PageUp':
            event.preventDefault();
            return moveFocus(focusedDate, -1, 'month');
            
          case 'PageDown':
            event.preventDefault();
            return moveFocus(focusedDate, 1, 'month');
            
          case 'Enter':
          case ' ':
            event.preventDefault();
            // 선택 이벤트 발생
            return true;
            
          default:
            return false;
        }
      }
    },

    queries: {
      getFocusedDate: (state, plugin) => {
        const a11yState = plugin.getState(state);
        return a11yState?.value.focusedDate ?? null;
      },

      getCurrentAnnouncement: (state, plugin) => {
        const a11yState = plugin.getState(state);
        return a11yState?.value.announcement ?? null;
      },

      getNavigationMode: (state, plugin) => {
        const a11yState = plugin.getState(state);
        return a11yState?.value.navigationMode ?? 'grid';
      },

      isKeyboardNavigationEnabled: (state, plugin) => {
        const a11yState = plugin.getState(state);
        return a11yState?.value.options.keyboardNavigation ?? false;
      }
    }
  };

  // 헬퍼 함수들을 spec 내부에 정의
  const getDateCellId = (date: Date): string => {
    return `calendar-cell-${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  };

  const isDateSelected = (_date: Date, _state: CalendarState): boolean => {
    // 다른 플러그인의 선택 상태 확인
    // 이는 실제 구현에서는 Range Plugin의 쿼리를 사용해야 함
    return false; // 임시
  };

  const createDateLabel = (date: Date, _state: CalendarState): string => {
    const dayName = date.toLocaleDateString('ko-KR', { weekday: 'long' });
    const dateStr = date.toLocaleDateString('ko-KR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    let label = `${dayName}, ${dateStr}`;
    
    // 오늘 표시
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      label += ', 오늘';
    }
    
    // 이벤트 개수 (Event Plugin이 있는 경우)
    // const events = getEventsForDate(date, state);
    // if (events.length > 0) {
    //   label += `, ${events.length}개의 일정`;
    // }
    
    return label;
  };

  const moveFocus = (currentDate: Date, amount: number, unit: string): boolean => {
    const newDate = new Date(currentDate);
    
    switch (unit) {
      case 'day':
        newDate.setDate(newDate.getDate() + amount);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + (amount * 7));
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() + amount);
        break;
      case 'weekStart': {
        const day = newDate.getDay();
        newDate.setDate(newDate.getDate() - day);
        break;
      }
      case 'weekEnd': {
        const endDay = newDate.getDay();
        newDate.setDate(newDate.getDate() + (6 - endDay));
        break;
      }
    }
    
    // focusDate 커맨드 실행
    return true; // 실제로는 dispatch를 통해 처리
  };

  return new Plugin(spec);
}

/**
 * 접근성 검증 유틸리티
 */
export class AccessibilityValidator {
  static validateCalendar(_state: CalendarState): AccessibilityReport {
    const issues: AccessibilityIssue[] = [];
    
    // ARIA 라벨 검증
    if (!this.hasAriaLabel()) {
      issues.push({
        type: 'missing-aria-label',
        severity: 'error',
        message: '캘린더에 aria-label이 없습니다'
      });
    }
    
    // 키보드 네비게이션 검증
    if (!this.hasKeyboardSupport()) {
      issues.push({
        type: 'missing-keyboard-support',
        severity: 'error',
        message: '키보드 네비게이션이 지원되지 않습니다'
      });
    }
    
    return {
      valid: issues.filter(i => i.severity === 'error').length === 0,
      issues
    };
  }
  
  private static hasAriaLabel(): boolean {
    // 실제 DOM 검사 로직
    return true; // 임시
  }
  
  private static hasKeyboardSupport(): boolean {
    // 키보드 이벤트 핸들러 존재 검사
    return true; // 임시
  }
}

export interface AccessibilityReport {
  valid: boolean;
  issues: AccessibilityIssue[];
}

export interface AccessibilityIssue {
  type: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
}