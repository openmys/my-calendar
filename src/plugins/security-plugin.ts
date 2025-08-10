/**
 * Security Plugin
 * 보안 기능을 제공하는 플러그인 (XSS 방지, 입력 검증, 에러 처리)
 */

import { Plugin, PluginSpec } from '@/core/plugin';
import { PluginState, Transaction } from '@/types';
import { transactions } from '@/core/transaction';

export interface SecurityOptions {
  enableInputValidation?: boolean;
  enableXSSProtection?: boolean;
  enableCSPMode?: boolean;
  maxInputLength?: number;
  allowedHTMLTags?: string[];
  sanitizeHTML?: boolean;
  logSecurityEvents?: boolean;
}

export interface SecurityState {
  violations: SecurityViolation[];
  isSecureMode: boolean;
  trustedSources: Set<string>;
  sanitizer: DOMPurify | null;
  options: SecurityOptions;
}

export interface SecurityViolation {
  id: string;
  type: 'xss' | 'injection' | 'validation' | 'csp';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  payload: any;
  timestamp: number;
  source?: string;
}

// DOMPurify 타입 정의 (외부 라이브러리)
interface DOMPurify {
  sanitize(dirty: string, config?: any): string;
  isValidAttribute(tag: string, attr: string, value: string): boolean;
}

/**
 * Security Plugin State 클래스
 */
class SecurityPluginState extends PluginState<SecurityState> {
  apply(transaction: Transaction): SecurityPluginState {
    const newValue = { ...this.value };

    switch (transaction.type) {
      case 'SECURITY_VIOLATION': {
        const violation: SecurityViolation = {
          id: this.generateViolationId(),
          type: transaction.payload.type,
          severity: transaction.payload.severity,
          message: transaction.payload.message,
          payload: transaction.payload.data,
          timestamp: Date.now(),
          source: transaction.payload.source,
        };

        newValue.violations = [...newValue.violations, violation];

        // 로깅 (옵션이 켜져 있는 경우)
        if (newValue.options.logSecurityEvents) {
          this.logSecurityViolation(violation);
        }

        // 위험도가 높은 경우 추가 조치
        if (violation.severity === 'critical') {
          this.handleCriticalViolation(violation);
        }
        break;
      }

      case 'SECURITY_SET_MODE':
        newValue.isSecureMode = transaction.payload.secure;
        break;

      case 'SECURITY_ADD_TRUSTED_SOURCE':
        newValue.trustedSources.add(transaction.payload.source);
        break;

      case 'SECURITY_REMOVE_TRUSTED_SOURCE':
        newValue.trustedSources.delete(transaction.payload.source);
        break;

      case 'SECURITY_CLEAR_VIOLATIONS':
        newValue.violations = [];
        break;

      case 'SECURITY_SET_OPTIONS':
        newValue.options = {
          ...newValue.options,
          ...transaction.payload.options,
        };
        break;

      // 다른 플러그인의 트랜잭션 검증
      default:
        if (newValue.options.enableInputValidation) {
          const validationResult = this.validateTransaction(transaction);
          if (!validationResult.valid) {
            // 유효하지 않은 트랜잭션에 대한 보안 위반 기록
            const violation: SecurityViolation = {
              id: this.generateViolationId(),
              type: 'validation',
              severity: 'medium',
              message: validationResult.message,
              payload: transaction,
              timestamp: Date.now(),
            };
            newValue.violations = [...newValue.violations, violation];
          }
        }
        break;
    }

    return new SecurityPluginState(newValue);
  }

  toJSON(): SecurityState {
    return {
      ...this.value,
      trustedSources: Array.from(this.value.trustedSources) as any,
    };
  }

  static fromJSON(value: any): SecurityPluginState {
    const state = { ...value };
    state.trustedSources = new Set(state.trustedSources ?? []);
    return new SecurityPluginState(state);
  }

  private generateViolationId(): string {
    return `violation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private validateTransaction(transaction: Transaction): {
    valid: boolean;
    message: string;
  } {
    // 기본 트랜잭션 구조 검증
    if (!transaction.type || typeof transaction.type !== 'string') {
      return { valid: false, message: 'Invalid transaction type' };
    }

    // 페이로드 크기 제한
    if (this.value.options.maxInputLength) {
      const payloadSize = JSON.stringify(transaction.payload).length;
      if (payloadSize > this.value.options.maxInputLength) {
        return { valid: false, message: 'Payload size exceeds limit' };
      }
    }

    // 특정 트랜잭션 타입별 검증
    switch (transaction.type) {
      case 'EVENT_ADD':
      case 'EVENT_UPDATE':
        return this.validateEventData(transaction.payload);

      case 'RANGE_SELECT_RANGE':
        return this.validateDateRange(transaction.payload);

      default:
        return { valid: true, message: '' };
    }
  }

  private validateEventData(data: any): { valid: boolean; message: string } {
    if (!data || typeof data !== 'object') {
      return { valid: false, message: 'Invalid event data structure' };
    }

    // 문자열 필드의 HTML 태그 검증
    if (data.title && this.containsUnsafeHTML(data.title)) {
      return { valid: false, message: 'Event title contains unsafe HTML' };
    }

    if (data.description && this.containsUnsafeHTML(data.description)) {
      return {
        valid: false,
        message: 'Event description contains unsafe HTML',
      };
    }

    // 날짜 필드 검증
    if (data.start && !this.isValidDate(data.start)) {
      return { valid: false, message: 'Invalid start date' };
    }

    if (data.end && !this.isValidDate(data.end)) {
      return { valid: false, message: 'Invalid end date' };
    }

    return { valid: true, message: '' };
  }

  private validateDateRange(data: any): { valid: boolean; message: string } {
    if (!data.start || !data.end) {
      return { valid: false, message: 'Missing date range data' };
    }

    if (!this.isValidDate(data.start) || !this.isValidDate(data.end)) {
      return { valid: false, message: 'Invalid date format' };
    }

    const start = new Date(data.start);
    const end = new Date(data.end);

    if (start > end) {
      return { valid: false, message: 'Start date must be before end date' };
    }

    return { valid: true, message: '' };
  }

  private containsUnsafeHTML(text: string): boolean {
    if (!this.value.options.enableXSSProtection) return false;

    // 기본적인 XSS 패턴 검사
    const dangerousPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
      /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
      /<embed\b[^<]*>/gi,
    ];

    return dangerousPatterns.some(pattern => pattern.test(text));
  }

  private isValidDate(dateValue: any): boolean {
    if (dateValue instanceof Date) {
      return !isNaN(dateValue.getTime());
    }

    if (typeof dateValue === 'string' || typeof dateValue === 'number') {
      const date = new Date(dateValue);
      return !isNaN(date.getTime());
    }

    return false;
  }

  private logSecurityViolation(violation: SecurityViolation): void {
    if (typeof console !== 'undefined') {
      const logLevel = this.getLogLevel(violation.severity);
      // eslint-disable-next-line no-console
      console[logLevel]('Security Violation:', {
        id: violation.id,
        type: violation.type,
        severity: violation.severity,
        message: violation.message,
        timestamp: new Date(violation.timestamp).toISOString(),
      });
    }
  }

  private getLogLevel(severity: string): 'log' | 'warn' | 'error' {
    switch (severity) {
      case 'critical':
      case 'high':
        return 'error';
      case 'medium':
        return 'warn';
      default:
        return 'log';
    }
  }

  private handleCriticalViolation(violation: SecurityViolation): void {
    // 중요한 보안 위반에 대한 추가 조치
    // 예: 특정 기능 비활성화, 관리자에게 알림 등

    if (window?.location) {
      // 개발 환경에서만 경고 표시
      if (process.env.NODE_ENV === 'development') {
        console.error('CRITICAL SECURITY VIOLATION:', violation);
      }
    }
  }
}

/**
 * HTML Sanitizer 유틸리티
 */
export class HTMLSanitizer {
  private allowedTags: Set<string>;
  private allowedAttributes: Set<string>;

  constructor(allowedTags: string[] = [], allowedAttributes: string[] = []) {
    this.allowedTags = new Set([
      'b',
      'i',
      'em',
      'strong',
      'u',
      'span',
      'div',
      'p',
      'br',
      ...allowedTags,
    ]);
    this.allowedAttributes = new Set([
      'class',
      'id',
      'style',
      ...allowedAttributes,
    ]);
  }

  sanitize(html: string): string {
    if (typeof DOMParser === 'undefined') {
      // 서버 환경에서는 정규식으로 기본 정리
      return this.basicSanitize(html);
    }

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      this.sanitizeNode(doc.body);
      return doc.body.innerHTML;
    } catch (error) {
      console.warn(
        'HTML sanitization failed, using basic sanitization:',
        error
      );
      return this.basicSanitize(html);
    }
  }

  private sanitizeNode(node: Node): void {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;

      // 허용되지 않는 태그 제거
      if (!this.allowedTags.has(element.tagName.toLowerCase())) {
        element.remove();
        return;
      }

      // 허용되지 않는 속성 제거
      const attributesToRemove: string[] = [];
      for (let i = 0; i < element.attributes.length; i++) {
        const attr = element.attributes[i];
        if (!this.allowedAttributes.has(attr.name.toLowerCase())) {
          attributesToRemove.push(attr.name);
        }
      }

      attributesToRemove.forEach(attrName => {
        element.removeAttribute(attrName);
      });
    }

    // 자식 노드들 재귀적으로 처리
    const children = Array.from(node.childNodes);
    children.forEach(child => this.sanitizeNode(child));
  }

  private basicSanitize(html: string): string {
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
      .replace(/<embed\b[^<]*>/gi, '');
  }
}

/**
 * Security Plugin 생성 함수
 */
export function createSecurityPlugin(
  options: SecurityOptions = {}
): Plugin<SecurityState> {
  const defaultOptions: SecurityOptions = {
    enableInputValidation: true,
    enableXSSProtection: true,
    enableCSPMode: false,
    maxInputLength: 10000,
    allowedHTMLTags: ['b', 'i', 'em', 'strong', 'u'],
    sanitizeHTML: true,
    logSecurityEvents: true,
  };

  const finalOptions = { ...defaultOptions, ...options };

  const spec: PluginSpec<SecurityState> = {
    key: 'security',
    priority: 2000, // 매우 높은 우선순위로 모든 트랜잭션을 먼저 검증

    state: {
      init: () =>
        new SecurityPluginState({
          violations: [],
          isSecureMode: true,
          trustedSources: new Set(),
          sanitizer: null,
          options: finalOptions,
        }),
      apply: (transaction, state) => state.apply(transaction),
    },

    commands: _plugin => ({
      reportViolation:
        (type: string, severity: string, message: string, data?: any) =>
        (_state: any, dispatch?: any) => {
          if (dispatch) {
            dispatch(
              transactions.custom('SECURITY_VIOLATION', {
                type,
                severity,
                message,
                data,
              })
            );
          }
          return true;
        },

      setSecureMode: (secure: boolean) => (_state: any, dispatch?: any) => {
        if (dispatch) {
          dispatch(transactions.custom('SECURITY_SET_MODE', { secure }));
        }
        return true;
      },

      addTrustedSource: (source: string) => (_state: any, dispatch?: any) => {
        if (dispatch) {
          dispatch(
            transactions.custom('SECURITY_ADD_TRUSTED_SOURCE', { source })
          );
        }
        return true;
      },

      clearViolations: () => (_state: any, dispatch?: any) => {
        if (dispatch) {
          dispatch(transactions.custom('SECURITY_CLEAR_VIOLATIONS', {}));
        }
        return true;
      },
    }),

    // 모든 트랜잭션을 사전에 필터링
    filterTransaction: (transaction, state, plugin) => {
      const securityState = plugin.getState(state);
      if (!securityState) return true;

      // 보안 모드가 비활성화된 경우 모든 트랜잭션 허용
      if (!securityState.value.isSecureMode) return true;

      // 트랜잭션 검증
      const validationResult = (securityState as any).validateTransaction(
        transaction
      );

      if (!validationResult.valid) {
        // 유효하지 않은 트랜잭션 차단
        console.warn(
          'Transaction blocked by security filter:',
          validationResult.message
        );
        return false;
      }

      return true;
    },

    queries: {
      getViolations: (state, plugin) => {
        const securityState = plugin.getState(state);
        return securityState?.value.violations ?? [];
      },

      isSecureMode: (state, plugin) => {
        const securityState = plugin.getState(state);
        return securityState?.value.isSecureMode ?? false;
      },

      getTrustedSources: (state, plugin) => {
        const securityState = plugin.getState(state);
        return Array.from(securityState?.value.trustedSources ?? []);
      },

      validateInput: (state, plugin, input: string) => {
        const securityState = plugin.getState(state);
        if (!securityState) return { valid: true, message: '' };

        const sanitizer = new HTMLSanitizer(
          securityState.value.options.allowedHTMLTags
        );

        const containsHTML = /<[a-z][\s\S]*>/i.test(input);
        const sanitized = containsHTML ? sanitizer.sanitize(input) : input;

        return {
          valid: sanitized === input,
          message: sanitized !== input ? 'Input contains unsafe content' : '',
          sanitized,
        };
      },
    },
  };

  return new Plugin(spec);
}

/**
 * 보안 에러 클래스들
 */
export class SecurityError extends Error {
  constructor(
    message: string,
    public code: string,
    public severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
  ) {
    super(message);
    this.name = 'SecurityError';
  }
}

export class ValidationError extends SecurityError {
  constructor(
    message: string,
    public field: string,
    public value: any
  ) {
    super(message, 'VALIDATION_ERROR', 'medium');
  }
}

export class XSSError extends SecurityError {
  constructor(
    message: string,
    public payload: string
  ) {
    super(message, 'XSS_ERROR', 'high');
  }
}

/**
 * 보안 유틸리티 함수들
 */
export const SecurityUtils = {
  /**
   * 안전한 문자열 이스케이프
   */
  escapeHTML(str: string): string {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  /**
   * CSP 헤더 생성
   */
  generateCSPHeader(
    options: { allowInlineStyles?: boolean; allowInlineScripts?: boolean } = {}
  ): string {
    const directives = [
      "default-src 'self'",
      options.allowInlineStyles
        ? "style-src 'self' 'unsafe-inline'"
        : "style-src 'self'",
      options.allowInlineScripts
        ? "script-src 'self' 'unsafe-inline'"
        : "script-src 'self'",
      "img-src 'self' data:",
      "connect-src 'self'",
      "font-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ];

    return directives.join('; ');
  },

  /**
   * 입력값 정규화
   */
  normalizeInput(input: string): string {
    return (
      input
        .trim()
        .replace(/\s+/g, ' ') // 연속된 공백을 하나로
        // eslint-disable-next-line no-control-regex
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    ); // 제어 문자 제거
  },
};
