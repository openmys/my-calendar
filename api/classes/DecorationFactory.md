[**@openmys/my-calendar v1.0.0**](../README.md)

***

[@openmys/my-calendar](../globals.md) / DecorationFactory

# Class: DecorationFactory

Defined in: [src/core/decoration.ts:142](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/decoration.ts#L142)

Decoration Factory
일반적인 데코레이션 생성을 위한 헬퍼 함수들

## Constructors

### Constructor

> **new DecorationFactory**(): `DecorationFactory`

#### Returns

`DecorationFactory`

## Methods

### customStyle()

> `static` **customStyle**(`date`, `style`, `className?`): [`Decoration`](../interfaces/Decoration.md)

Defined in: [src/core/decoration.ts:202](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/decoration.ts#L202)

커스텀 스타일 데코레이션 생성

#### Parameters

##### date

`Date`

##### style

`string`

##### className?

`string`

#### Returns

[`Decoration`](../interfaces/Decoration.md)

***

### event()

> `static` **event**(`date`, `title`, `color?`): [`Decoration`](../interfaces/Decoration.md)

Defined in: [src/core/decoration.ts:216](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/decoration.ts#L216)

이벤트 표시 데코레이션 생성

#### Parameters

##### date

`Date`

##### title

`string`

##### color?

`string`

#### Returns

[`Decoration`](../interfaces/Decoration.md)

***

### highlight()

> `static` **highlight**(`date`, `className?`): [`Decoration`](../interfaces/Decoration.md)

Defined in: [src/core/decoration.ts:146](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/decoration.ts#L146)

하이라이트 데코레이션 생성

#### Parameters

##### date

`Date`

##### className?

`string`

#### Returns

[`Decoration`](../interfaces/Decoration.md)

***

### highlightRange()

> `static` **highlightRange**(`start`, `end`, `className?`): [`Decoration`](../interfaces/Decoration.md)

Defined in: [src/core/decoration.ts:159](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/decoration.ts#L159)

범위 하이라이트 데코레이션 생성

#### Parameters

##### start

`Date`

##### end

`Date`

##### className?

`string`

#### Returns

[`Decoration`](../interfaces/Decoration.md)

***

### multiDayEvent()

> `static` **multiDayEvent**(`start`, `end`, `title`, `color?`): [`Decoration`](../interfaces/Decoration.md)[]

Defined in: [src/core/decoration.ts:234](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/decoration.ts#L234)

다중일 이벤트 데코레이션 생성

#### Parameters

##### start

`Date`

##### end

`Date`

##### title

`string`

##### color?

`string`

#### Returns

[`Decoration`](../interfaces/Decoration.md)[]

***

### overlay()

> `static` **overlay**(`date`, `content`, `className?`): [`Decoration`](../interfaces/Decoration.md)

Defined in: [src/core/decoration.ts:173](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/decoration.ts#L173)

오버레이 데코레이션 생성

#### Parameters

##### date

`Date`

##### content

`string`

##### className?

`string`

#### Returns

[`Decoration`](../interfaces/Decoration.md)

***

### widget()

> `static` **widget**(`date`, `widgetFactory`): [`Decoration`](../interfaces/Decoration.md)

Defined in: [src/core/decoration.ts:189](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/decoration.ts#L189)

위젯 데코레이션 생성

#### Parameters

##### date

`Date`

##### widgetFactory

() => `HTMLElement`

#### Returns

[`Decoration`](../interfaces/Decoration.md)
