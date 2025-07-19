/**
 * Decoration System 구현
 * 선언적 UI 렌더링을 위한 데코레이션 시스템
 */

import { Decoration, DecorationType } from '@/types';

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
  static widget(date: Date, widgetFactory: () => HTMLElement): Decoration {
    return {
      type: 'widget',
      from: new Date(date),
      spec: {
        widget: widgetFactory,
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
 * Decoration Renderer
 * 데코레이션을 실제 DOM 요소에 적용하는 렌더러
 */
export class DecorationRenderer {
  private decorationElements: Map<Decoration, HTMLElement[]> = new Map();

  /**
   * 데코레이션을 DOM 요소에 적용
   */
  render(element: HTMLElement, decoration: Decoration): HTMLElement[] {
    const elements: HTMLElement[] = [];

    switch (decoration.type) {
      case 'highlight':
        elements.push(...this.renderHighlight(element, decoration));
        break;
      case 'overlay':
        elements.push(...this.renderOverlay(element, decoration));
        break;
      case 'widget':
        elements.push(...this.renderWidget(element, decoration));
        break;
    }

    this.decorationElements.set(decoration, elements);
    return elements;
  }

  /**
   * 하이라이트 데코레이션 렌더링
   */
  private renderHighlight(
    element: HTMLElement,
    decoration: Decoration
  ): HTMLElement[] {
    const { spec } = decoration;

    if (spec.class) {
      element.classList.add(spec.class);
    }

    if (spec.style) {
      element.style.cssText += spec.style;
    }

    if (spec.attributes) {
      for (const [key, value] of Object.entries(spec.attributes)) {
        element.setAttribute(key, value);
      }
    }

    return [element];
  }

  /**
   * 오버레이 데코레이션 렌더링
   */
  private renderOverlay(
    element: HTMLElement,
    decoration: Decoration
  ): HTMLElement[] {
    const overlayElement = document.createElement('div');
    const { spec } = decoration;

    if (spec.class) {
      overlayElement.className = spec.class;
    }

    if (spec.style) {
      overlayElement.style.cssText = spec.style;
    }

    if (spec.attributes) {
      for (const [key, value] of Object.entries(spec.attributes)) {
        overlayElement.setAttribute(key, value);

        // 특별한 속성 처리
        if (key === 'data-content') {
          overlayElement.textContent = value;
        }
      }
    }

    element.appendChild(overlayElement);
    return [overlayElement];
  }

  /**
   * 위젯 데코레이션 렌더링
   */
  private renderWidget(
    element: HTMLElement,
    decoration: Decoration
  ): HTMLElement[] {
    const { spec } = decoration;

    if (!spec.widget) {
      console.warn('Widget decoration missing widget factory');
      return [];
    }

    try {
      const widget = spec.widget();

      if (spec.class) {
        widget.classList.add(spec.class);
      }

      if (spec.style) {
        widget.style.cssText += spec.style;
      }

      if (spec.attributes) {
        for (const [key, value] of Object.entries(spec.attributes)) {
          widget.setAttribute(key, value);
        }
      }

      element.appendChild(widget);
      return [widget];
    } catch (error) {
      console.error('Error creating widget:', error);
      return [];
    }
  }

  /**
   * 데코레이션 제거
   */
  remove(decoration: Decoration): void {
    const elements = this.decorationElements.get(decoration);
    if (elements) {
      elements.forEach(element => {
        element.remove();
      });
      this.decorationElements.delete(decoration);
    }
  }

  /**
   * 모든 데코레이션 제거
   */
  clear(): void {
    for (const elements of this.decorationElements.values()) {
      elements.forEach(element => element.remove());
    }
    this.decorationElements.clear();
  }

  /**
   * 특정 요소의 데코레이션들 제거
   */
  clearElement(element: HTMLElement): void {
    // 클래스 제거
    element.className = element.className
      .split(' ')
      .filter(cls => !cls.startsWith('calendar-'))
      .join(' ');

    // 데이터 속성 제거
    const attributesToRemove: string[] = [];
    for (let i = 0; i < element.attributes.length; i++) {
      const attr = element.attributes[i];
      if (attr.name.startsWith('data-') || attr.name === 'title') {
        attributesToRemove.push(attr.name);
      }
    }
    attributesToRemove.forEach(attr => element.removeAttribute(attr));

    // 자식 데코레이션 요소들 제거
    const decorationChildren = element.querySelectorAll(
      '.calendar-overlay, .calendar-widget'
    );
    decorationChildren.forEach(child => child.remove());
  }
}

/**
 * Decoration Manager
 * 데코레이션의 생성, 업데이트, 제거를 관리
 */
export class DecorationManager {
  private currentDecorations = new DecorationSet();
  private renderer = new DecorationRenderer();
  private elementMap = new Map<Date, HTMLElement>();

  /**
   * 요소와 날짜 매핑 등록
   */
  registerElement(date: Date, element: HTMLElement): void {
    this.elementMap.set(date, element);
  }

  /**
   * 요소 매핑 제거
   */
  unregisterElement(date: Date): void {
    this.elementMap.delete(date);
  }

  /**
   * 데코레이션 업데이트
   */
  updateDecorations(newDecorations: DecorationSet): void {
    // 기존 데코레이션 제거
    this.clearAllDecorations();

    // 새 데코레이션 적용
    this.currentDecorations = newDecorations;
    this.applyDecorations();
  }

  /**
   * 데코레이션 적용
   */
  private applyDecorations(): void {
    for (const decoration of this.currentDecorations) {
      this.applyDecoration(decoration);
    }
  }

  /**
   * 단일 데코레이션 적용
   */
  private applyDecoration(decoration: Decoration): void {
    if (decoration.to) {
      // 범위 데코레이션
      const current = new Date(decoration.from);
      while (current <= decoration.to) {
        const element = this.elementMap.get(current);
        if (element) {
          this.renderer.render(element, decoration);
        }
        current.setDate(current.getDate() + 1);
      }
    } else {
      // 단일 날짜 데코레이션
      const element = this.elementMap.get(decoration.from);
      if (element) {
        this.renderer.render(element, decoration);
      }
    }
  }

  /**
   * 모든 데코레이션 제거
   */
  private clearAllDecorations(): void {
    for (const element of this.elementMap.values()) {
      this.renderer.clearElement(element);
    }
    this.renderer.clear();
  }

  /**
   * 현재 데코레이션 반환
   */
  getCurrentDecorations(): DecorationSet {
    return this.currentDecorations;
  }

  /**
   * 정리
   */
  dispose(): void {
    this.clearAllDecorations();
    this.elementMap.clear();
    this.currentDecorations = new DecorationSet();
  }
}
