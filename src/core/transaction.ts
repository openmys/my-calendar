/**
 * Transaction 시스템
 * 모든 상태 변경은 Transaction을 통해 이루어짐
 */

import { Transaction } from '@/types';

/**
 * Transaction 생성을 위한 헬퍼 함수들
 */
export class TransactionBuilder {
  private transaction: Transaction;

  constructor(type: string) {
    this.transaction = {
      type,
      payload: {},
      meta: new Map<string, any>([
        ['timestamp', Date.now()],
        ['source', 'user']
      ])
    };
  }

  /**
   * 페이로드 설정
   */
  setPayload(payload: any): TransactionBuilder {
    this.transaction.payload = payload;
    return this;
  }

  /**
   * 메타데이터 추가
   */
  addMeta(key: string, value: any): TransactionBuilder {
    this.transaction.meta.set(key, value);
    return this;
  }

  /**
   * 트랜잭션 빌드
   */
  build(): Transaction {
    return { ...this.transaction };
  }
}

/**
 * 트랜잭션 생성 팩토리 함수들
 */
export const createTransaction = (type: string, payload?: any, meta?: Map<string, any>): Transaction => {
  const builder = new TransactionBuilder(type);
  
  if (payload) {
    builder.setPayload(payload);
  }
  
  if (meta) {
    for (const [key, value] of meta) {
      builder.addMeta(key, value);
    }
  }
  
  return builder.build();
};

/**
 * 일반적인 트랜잭션 타입들을 위한 헬퍼 함수들
 */
export const transactions = {
  // 날짜 관련
  selectDate: (date: Date) => createTransaction('SELECT_DATE', { date }),
  changeMonth: (direction: 'next' | 'previous') => createTransaction('CHANGE_MONTH', { direction }),
  changeView: (viewType: string) => createTransaction('CHANGE_VIEW', { viewType }),
  
  // 범위 선택 관련
  selectRange: (start: Date, end: Date) => createTransaction('SELECT_RANGE', { start, end }),
  clearSelection: () => createTransaction('CLEAR_SELECTION', {}),
  
  // 이벤트 관련
  addEvent: (event: any) => createTransaction('ADD_EVENT', { event }),
  updateEvent: (eventId: string, updates: any) => createTransaction('UPDATE_EVENT', { eventId, updates }),
  deleteEvent: (eventId: string) => createTransaction('DELETE_EVENT', { eventId }),
  
  // 플러그인 관련
  enablePlugin: (pluginId: string) => createTransaction('ENABLE_PLUGIN', { pluginId }),
  disablePlugin: (pluginId: string) => createTransaction('DISABLE_PLUGIN', { pluginId }),
  
  // 사용자 정의 트랜잭션
  custom: (type: string, payload: any, meta?: Map<string, any>) => createTransaction(type, payload, meta)
};

/**
 * 트랜잭션 유효성 검증
 */
export class TransactionValidator {
  private static requiredFields = ['type', 'payload', 'meta'];

  /**
   * 트랜잭션 기본 구조 검증
   */
  static validate(transaction: Transaction): boolean {
    // 필수 필드 확인
    for (const field of this.requiredFields) {
      if (!(field in transaction)) {
        throw new Error(`Transaction missing required field: ${field}`);
      }
    }

    // 타입 검증
    if (typeof transaction.type !== 'string' || transaction.type.length === 0) {
      throw new Error('Transaction type must be a non-empty string');
    }

    // 메타데이터 검증
    if (!(transaction.meta instanceof Map)) {
      throw new Error('Transaction meta must be a Map');
    }

    return true;
  }

  /**
   * 타임스탬프 검증
   */
  static validateTimestamp(transaction: Transaction): boolean {
    const timestamp = transaction.meta.get('timestamp');
    if (typeof timestamp !== 'number' || timestamp <= 0) {
      throw new Error('Transaction must have valid timestamp in meta');
    }
    return true;
  }

  /**
   * 날짜 관련 트랜잭션 검증
   */
  static validateDateTransaction(transaction: Transaction): boolean {
    const dateTypes = ['SELECT_DATE', 'SELECT_RANGE'];
    
    if (dateTypes.includes(transaction.type)) {
      if (transaction.type === 'SELECT_DATE') {
        if (!transaction.payload || typeof transaction.payload !== 'object') {
          throw new Error('SELECT_DATE transaction requires payload object');
        }
        const payload = transaction.payload as { date?: unknown };
        if (!('date' in payload) || !(payload.date instanceof Date)) {
          throw new Error('SELECT_DATE transaction requires valid Date in payload');
        }
      }
      
      if (transaction.type === 'SELECT_RANGE') {
        if (!transaction.payload || typeof transaction.payload !== 'object') {
          throw new Error('SELECT_RANGE transaction requires payload object');
        }
        const payload = transaction.payload as { start?: unknown; end?: unknown };
        if (!('start' in payload) || !('end' in payload) || 
            !(payload.start instanceof Date) || !(payload.end instanceof Date)) {
          throw new Error('SELECT_RANGE transaction requires valid start and end Dates');
        }
        if (payload.start > payload.end) {
          throw new Error('SELECT_RANGE start date must be before end date');
        }
      }
    }

    return true;
  }
}

/**
 * 트랜잭션 히스토리 관리
 */
export class TransactionHistory {
  private history: Transaction[] = [];
  private currentIndex: number = -1;
  private maxHistory: number = 100;

  /**
   * 트랜잭션 추가
   */
  add(transaction: Transaction): void {
    // 현재 위치 이후의 히스토리 제거 (새로운 브랜치 생성)
    this.history = this.history.slice(0, this.currentIndex + 1);
    
    // 새 트랜잭션 추가
    this.history.push(transaction);
    this.currentIndex++;
    
    // 히스토리 크기 제한
    if (this.history.length > this.maxHistory) {
      this.history = this.history.slice(-this.maxHistory);
      this.currentIndex = this.history.length - 1;
    }
  }

  /**
   * 되돌리기 (Undo)
   */
  undo(): Transaction | null {
    if (this.currentIndex <= 0) {
      return null;
    }
    
    this.currentIndex--;
    return this.history[this.currentIndex];
  }

  /**
   * 다시 실행 (Redo)
   */
  redo(): Transaction | null {
    if (this.currentIndex >= this.history.length - 1) {
      return null;
    }
    
    this.currentIndex++;
    return this.history[this.currentIndex];
  }

  /**
   * 히스토리 초기화
   */
  clear(): void {
    this.history = [];
    this.currentIndex = -1;
  }

  /**
   * 현재 히스토리 정보
   */
  getInfo(): { canUndo: boolean; canRedo: boolean; currentIndex: number; total: number } {
    return {
      canUndo: this.currentIndex > 0,
      canRedo: this.currentIndex < this.history.length - 1,
      currentIndex: this.currentIndex,
      total: this.history.length
    };
  }
}