/**
 * React 패키지 엔트리포인트
 */

// Core exports (calendar 기능)
export * from '@/core';

// React Hook
export { useReactCalendar } from '@/react/useReactCalendar';

// React 유틸리티 (flexRender 등)
import * as React from 'react';

// Renderable 타입 (TanStack Table과 동일)
export type Renderable<TProps> = React.ReactNode | React.ComponentType<TProps>;

/**
 * flexRender 유틸리티 (TanStack Table과 동일한 패턴)
 * 커스텀 컴포넌트나 ReactNode를 렌더링
 */
export function flexRender<TProps extends object>(
  Comp: Renderable<TProps>,
  props: TProps
): React.ReactNode | React.JSX.Element {
  return !Comp
    ? null
    : isReactComponent<TProps>(Comp)
      ? React.createElement(Comp, props)
      : Comp;
}

function isReactComponent<TProps>(
  component: unknown
): component is React.ComponentType<TProps> {
  return (
    isClassComponent(component) ||
    typeof component === 'function' ||
    isExoticComponent(component)
  );
}

function isClassComponent(component: any) {
  return (
    typeof component === 'function' &&
    (() => {
      const proto = Object.getPrototypeOf(component);
      return proto.prototype?.isReactComponent;
    })()
  );
}

function isExoticComponent(component: any) {
  return (
    typeof component === 'object' &&
    typeof component.$$typeof === 'symbol' &&
    ['react.memo', 'react.forward_ref'].includes(component.$$typeof.description)
  );
}
