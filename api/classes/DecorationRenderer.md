[**@openmys/my-calendar v1.0.0**](../README.md)

***

[@openmys/my-calendar](../globals.md) / DecorationRenderer

# Class: DecorationRenderer

Defined in: [src/core/decoration.ts:272](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/decoration.ts#L272)

Decoration Renderer
데코레이션을 실제 DOM 요소에 적용하는 렌더러

## Constructors

### Constructor

> **new DecorationRenderer**(): `DecorationRenderer`

#### Returns

`DecorationRenderer`

## Methods

### clear()

> **clear**(): `void`

Defined in: [src/core/decoration.ts:402](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/decoration.ts#L402)

모든 데코레이션 제거

#### Returns

`void`

***

### clearElement()

> **clearElement**(`element`): `void`

Defined in: [src/core/decoration.ts:412](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/decoration.ts#L412)

특정 요소의 데코레이션들 제거

#### Parameters

##### element

`HTMLElement`

#### Returns

`void`

***

### remove()

> **remove**(`decoration`): `void`

Defined in: [src/core/decoration.ts:389](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/decoration.ts#L389)

데코레이션 제거

#### Parameters

##### decoration

[`Decoration`](../interfaces/Decoration.md)

#### Returns

`void`

***

### render()

> **render**(`element`, `decoration`): `HTMLElement`[]

Defined in: [src/core/decoration.ts:278](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/decoration.ts#L278)

데코레이션을 DOM 요소에 적용

#### Parameters

##### element

`HTMLElement`

##### decoration

[`Decoration`](../interfaces/Decoration.md)

#### Returns

`HTMLElement`[]
