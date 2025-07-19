[**@openmys/my-calendar v1.0.0**](../README.md)

***

[@openmys/my-calendar](../globals.md) / DecorationManager

# Class: DecorationManager

Defined in: [src/core/decoration.ts:439](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/decoration.ts#L439)

Decoration Manager
데코레이션의 생성, 업데이트, 제거를 관리

## Constructors

### Constructor

> **new DecorationManager**(): `DecorationManager`

#### Returns

`DecorationManager`

## Methods

### dispose()

> **dispose**(): `void`

Defined in: [src/core/decoration.ts:522](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/decoration.ts#L522)

정리

#### Returns

`void`

***

### getCurrentDecorations()

> **getCurrentDecorations**(): [`DecorationSet`](DecorationSet.md)

Defined in: [src/core/decoration.ts:515](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/decoration.ts#L515)

현재 데코레이션 반환

#### Returns

[`DecorationSet`](DecorationSet.md)

***

### registerElement()

> **registerElement**(`date`, `element`): `void`

Defined in: [src/core/decoration.ts:447](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/decoration.ts#L447)

요소와 날짜 매핑 등록

#### Parameters

##### date

`Date`

##### element

`HTMLElement`

#### Returns

`void`

***

### unregisterElement()

> **unregisterElement**(`date`): `void`

Defined in: [src/core/decoration.ts:454](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/decoration.ts#L454)

요소 매핑 제거

#### Parameters

##### date

`Date`

#### Returns

`void`

***

### updateDecorations()

> **updateDecorations**(`newDecorations`): `void`

Defined in: [src/core/decoration.ts:461](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/decoration.ts#L461)

데코레이션 업데이트

#### Parameters

##### newDecorations

[`DecorationSet`](DecorationSet.md)

#### Returns

`void`
