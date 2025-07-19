[**@openmys/my-calendar v1.0.0**](../README.md)

***

[@openmys/my-calendar](../globals.md) / ImmutableStateManager

# Class: ImmutableStateManager

Defined in: [src/core/plugin-state.ts:284](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/plugin-state.ts#L284)

불변성을 보장하는 상태 관리자

## Constructors

### Constructor

> **new ImmutableStateManager**(): `ImmutableStateManager`

#### Returns

`ImmutableStateManager`

## Methods

### deepFreeze()

> `static` **deepFreeze**\<`T`\>(`obj`): `T`

Defined in: [src/core/plugin-state.ts:301](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/plugin-state.ts#L301)

깊은 동결 (개발 환경에서만 사용)

#### Type Parameters

##### T

`T`

#### Parameters

##### obj

`T`

#### Returns

`T`

***

### ensureImmutability()

> `static` **ensureImmutability**\<`T`\>(`originalState`, `newState`): `boolean`

Defined in: [src/core/plugin-state.ts:288](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/plugin-state.ts#L288)

상태 업데이트 시 불변성 검증

#### Type Parameters

##### T

`T`

#### Parameters

##### originalState

`T`

##### newState

`T`

#### Returns

`boolean`
