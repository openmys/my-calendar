[**@openmys/my-calendar v1.0.0**](../README.md)

***

[@openmys/my-calendar](../globals.md) / PluginStateUpdater

# Class: PluginStateUpdater\<T\>

Defined in: [src/core/plugin-state.ts:34](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/plugin-state.ts#L34)

상태 변경을 위한 헬퍼 클래스

## Type Parameters

### T

`T`

## Constructors

### Constructor

> **new PluginStateUpdater**\<`T`\>(`currentValue`): `StateUpdater`\<`T`\>

Defined in: [src/core/plugin-state.ts:35](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/plugin-state.ts#L35)

#### Parameters

##### currentValue

`T`

#### Returns

`StateUpdater`\<`T`\>

## Methods

### addToArray()

> **addToArray**\<`K`\>(`key`, `item`): `T`

Defined in: [src/core/plugin-state.ts:54](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/plugin-state.ts#L54)

배열 요소 추가

#### Type Parameters

##### K

`K` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### key

`K`

##### item

`T`\[`K`\] *extends* `U`[] ? `U` : `never`

#### Returns

`T`

***

### deepUpdate()

> **deepUpdate**(`updates`): `T`

Defined in: [src/core/plugin-state.ts:47](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/plugin-state.ts#L47)

깊은 복사로 객체 업데이트 (간단한 구현)

#### Parameters

##### updates

`Partial`\<`T`\>

#### Returns

`T`

***

### deleteFromMap()

> **deleteFromMap**\<`K`\>(`key`, `mapKey`): `T`

Defined in: [src/core/plugin-state.ts:99](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/plugin-state.ts#L99)

Map에서 키 제거

#### Type Parameters

##### K

`K` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### key

`K`

##### mapKey

`string`

#### Returns

`T`

***

### removeFromArray()

> **removeFromArray**\<`K`\>(`key`, `predicate`): `T`

Defined in: [src/core/plugin-state.ts:68](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/plugin-state.ts#L68)

배열 요소 제거

#### Type Parameters

##### K

`K` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### key

`K`

##### predicate

(`item`) => `boolean`

#### Returns

`T`

***

### shallowUpdate()

> **shallowUpdate**(`updates`): `T`

Defined in: [src/core/plugin-state.ts:40](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/plugin-state.ts#L40)

얕은 복사로 객체 업데이트

#### Parameters

##### updates

`Partial`\<`T`\>

#### Returns

`T`

***

### updateMap()

> **updateMap**\<`K`\>(`key`, `mapKey`, `value`): `T`

Defined in: [src/core/plugin-state.ts:82](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/plugin-state.ts#L82)

Map 업데이트

#### Type Parameters

##### K

`K` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### key

`K`

##### mapKey

`string`

##### value

`any`

#### Returns

`T`
