/**
 * Decoration System 구현
 * 선언적 UI 렌더링을 위한 데코레이션 시스템
 */

import { Decoration, DecorationType } from '@/types';

/**
 * React에서 사용할 데코레이션 데이터 타입
 */
export interface DecorationData {
  className?: string;
  style?: React.CSSProperties;
  attributes?: Record<string, string>;
  overlayContent?: string;
  widgetData?: any;
}

/**
 * DecorationSet 클래스
 * 데코레이션 컬렉션을 관리하고 조작하는 클래스
 */
export class DecorationSet {
  constructor(public decorations: Decoration[] = []) {}

  /**
   * 특정 날짜의 데코레이션 찾기
   */
  find(date: Date): Decoration[] {
    return this.decorations.filter(decoration => {
      if (decoration.to) {
        // 범위 데코레이션
        return date >= decoration.from && date <= decoration.to;
      }
      // 단일 날짜 데코레이션
      return this.isSameDay(date, decoration.from);
    });
  }

  /**
   * 날짜 범위의 데코레이션 찾기
   */
  findInRange(start: Date, end: Date): Decoration[] {
    return this.decorations.filter(decoration => {
      if (decoration.to) {
        // 범위 데코레이션과 범위가 겹치는지 확인
        return decoration.from <= end && decoration.to >= start;
      }
      // 단일 날짜가 범위 안에 있는지 확인
      return decoration.from >= start && decoration.from <= end;
    });
  }

  /**
   * 데코레이션 추가
   */
  add(decoration: Decoration): DecorationSet {
    return new DecorationSet([...this.decorations, decoration]);
  }

  /**
   * 여러 데코레이션 추가
   */
  addAll(decorations: Decoration[]): DecorationSet {
    return new DecorationSet([...this.decorations, ...decorations]);
  }

  /**
   * 데코레이션 제거
   */
  remove(filter: (decoration: Decoration) => boolean): DecorationSet {
    return new DecorationSet(
      this.decorations.filter(decoration => !filter(decoration))
    );
  }

  /**
   * 데코레이션 교체
   */
  replace(oldDecoration: Decoration, newDecoration: Decoration): DecorationSet {
    const index = this.decorations.indexOf(oldDecoration);
    if (index === -1) {
      return this;
    }

    const newDecorations = [...this.decorations];
    newDecorations[index] = newDecoration;
    return new DecorationSet(newDecorations);
  }

  /**
   * 모든 데코레이션 제거
   */
  clear(): DecorationSet {
    return new DecorationSet([]);
  }

  /**
   * 데코레이션 수
   */
  get size(): number {
    return this.decorations.length;
  }

  /**
   * 빈 데코레이션 셋인지 확인
   */
  get isEmpty(): boolean {
    return this.decorations.length === 0;
  }

  /**
   * 데코레이션 존재 여부 확인
   */
  has(decoration: Decoration): boolean {
    return this.decorations.includes(decoration);
  }

  /**
   * 데코레이션 타입별 필터링
   */
  filterByType(type: DecorationType): DecorationSet {
    return new DecorationSet(this.decorations.filter(d => d.type === type));
  }

  /**
   * 데코레이션 정렬 (날짜 순)
   */
  sort(): DecorationSet {
    const sorted = [...this.decorations].sort(
      (a, b) => a.from.getTime() - b.from.getTime()
    );
    return new DecorationSet(sorted);
  }

  /**
   * 두 날짜가 같은 날인지 확인
   */
  private isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  /**
   * 이터레이터 지원
   */
  [Symbol.iterator](): Iterator<Decoration> {
    return this.decorations[Symbol.iterator]();
  }
}

/**
 * Decoration Factory
 * 일반적인 데코레이션 생성을 위한 헬퍼 함수들
 */
export class DecorationFactory {
  /**
   * 하이라이트 데코레이션 생성
   */
  static highlight(date: Date, className?: string): Decoration {
    return {
      type: 'highlight',
      from: new Date(date),
      spec: {
        class: className ?? 'calendar-highlight',
      },
    };
  }

  /**
   * 범위 하이라이트 데코레이션 생성
   */
  static highlightRange(
    start: Date,
    end: Date,
    className?: string
  ): Decoration {
    return {
      type: 'highlight',
      from: new Date(start),
      to: new Date(end),
      spec: {
        class: className ?? 'calendar-range-highlight',
      },
    };
  }

  /**
   * 오버레이 데코레이션 생성
   */
  static overlay(date: Date, content: string, className?: string): Decoration {
    return {
      type: 'overlay',
      from: new Date(date),
      spec: {
        class: className ?? 'calendar-overlay',
        attributes: {
          'data-content': content,
        },
      },
    };
  }

  /**
   * 위젯 데코레이션 생성
   */
  static widget(date: Date, widgetData: any): Decoration {
    return {
      type: 'widget',
      from: new Date(date),
      spec: {
        attributes: {
          'data-widget': JSON.stringify(widgetData),
        },
      },
    };
  }

  /**
   * 커스텀 스타일 데코레이션 생성
   */
  static customStyle(
    date: Date,
    style: string,
    className?: string
  ): Decoration {
    return {
      type: 'highlight',
      from: new Date(date),
      spec: {
        class: className,
        style,
      },
    };
  }

  /**
   * 이벤트 표시 데코레이션 생성
   */
  static event(date: Date, title: string, color?: string): Decoration {
    return {
      type: 'overlay',
      from: new Date(date),
      spec: {
        class: 'calendar-event',
        style: color ? `background-color: ${color}` : undefined,
        attributes: {
          'data-event-title': title,
          title: title,
        },
      },
    };
  }

  /**
   * 다중일 이벤트 데코레이션 생성
   */
  static multiDayEvent(
    start: Date,
    end: Date,
    title: string,
    color?: string
  ): Decoration[] {
    const decorations: Decoration[] = [];
    const current = new Date(start);

    while (current <= end) {
      const isStart = current.getTime() === start.getTime();
      const isEnd = current.getTime() === end.getTime();

      let className = 'calendar-event-multi';
      if (isStart) className += ' event-start';
      if (isEnd) className += ' event-end';
      if (!isStart && !isEnd) className += ' event-middle';

      decorations.push({
        type: 'overlay',
        from: new Date(current),
        spec: {
          class: className,
          style: color ? `background-color: ${color}` : undefined,
          attributes: {
            'data-event-title': title,
            title: title,
            'data-event-part': isStart ? 'start' : isEnd ? 'end' : 'middle',
          },
        },
      });

      current.setDate(current.getDate() + 1);
    }

    return decorations;
  }
}

/**
 * Decoration Manager (헤드리스 버전)
 * 데코레이션 데이터만 관리하고 DOM 조작은 하지 않음
 */
export class DecorationManager {
  private currentDecorations = new DecorationSet();

  /**
   * 데코레이션 업데이트
   */
  updateDecorations(newDecorations: DecorationSet): void {
    this.currentDecorations = newDecorations;
  }

  /**
   * 현재 데코레이션 반환
   */
  getCurrentDecorations(): DecorationSet {
    return this.currentDecorations;
  }

  /**
   * 특정 날짜의 데코레이션 반환
   */
  getDecorationsForDate(date: Date): Decoration[] {
    return this.currentDecorations.find(date);
  }

  /**
   * 날짜 범위의 데코레이션 반환
   */
  getDecorationsForRange(start: Date, end: Date): Decoration[] {
    return this.currentDecorations.findInRange(start, end);
  }

  /**
   * 날짜별 데코레이션 맵 반환 (React에서 사용하기 편한 형태)
   */
  getDecorationMap(): Map<string, Decoration[]> {
    const map = new Map<string, Decoration[]>();

    for (const decoration of this.currentDecorations) {
      if (decoration.to) {
        // 범위 데코레이션
        const current = new Date(decoration.from);
        while (current <= decoration.to) {
          const dateKey = this.getDateKey(current);
          if (!map.has(dateKey)) {
            map.set(dateKey, []);
          }
          map.get(dateKey)!.push(decoration);
          current.setDate(current.getDate() + 1);
        }
      } else {
        // 단일 날짜 데코레이션
        const dateKey = this.getDateKey(decoration.from);
        if (!map.has(dateKey)) {
          map.set(dateKey, []);
        }
        map.get(dateKey)!.push(decoration);
      }
    }

    return map;
  }

  /**
   * 날짜를 키로 변환
   */
  private getDateKey(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  /**
   * 정리
   */
  dispose(): void {
    this.currentDecorations = new DecorationSet();
  }
}
