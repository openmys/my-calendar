[**@openmys/my-calendar v1.0.0**](../README.md)

***

[@openmys/my-calendar](../globals.md) / PluginFactoryOptions

# Interface: PluginFactoryOptions\<T\>

Defined in: [src/utils/plugin-factory.ts:29](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/utils/plugin-factory.ts#L29)

플러그인 생성 옵션

## Type Parameters

### T

`T` = [`BaseCustomPluginState`](BaseCustomPluginState.md)

## Properties

### commands?

> `optional` **commands**: [`CommandMap`](CommandMap.md)

Defined in: [src/utils/plugin-factory.ts:48](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/utils/plugin-factory.ts#L48)

커맨드 정의

***

### decorationFactory()?

> `optional` **decorationFactory**: (`state`, `pluginState`) => [`DecorationSet`](../classes/DecorationSet.md)

Defined in: [src/utils/plugin-factory.ts:51](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/utils/plugin-factory.ts#L51)

데코레이션 생성 함수

#### Parameters

##### state

[`CalendarState`](CalendarState.md)

##### pluginState

`T`

#### Returns

[`DecorationSet`](../classes/DecorationSet.md)

***

### dependencies?

> `optional` **dependencies**: `string`[]

Defined in: [src/utils/plugin-factory.ts:37](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/utils/plugin-factory.ts#L37)

의존성 플러그인들

***

### eventHandlers?

> `optional` **eventHandlers**: `object`

Defined in: [src/utils/plugin-factory.ts:54](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/utils/plugin-factory.ts#L54)

이벤트 핸들러들

#### onDateClick()?

> `optional` **onDateClick**: (`date`, `event`, `state`, `pluginState`) => `boolean`

##### Parameters

###### date

`Date`

###### event

`MouseEvent`

###### state

[`CalendarState`](CalendarState.md)

###### pluginState

`T`

##### Returns

`boolean`

#### onKeyDown()?

> `optional` **onKeyDown**: (`event`, `state`, `pluginState`) => `boolean`

##### Parameters

###### event

`KeyboardEvent`

###### state

[`CalendarState`](CalendarState.md)

###### pluginState

`T`

##### Returns

`boolean`

#### onKeyUp()?

> `optional` **onKeyUp**: (`event`, `state`, `pluginState`) => `boolean`

##### Parameters

###### event

`KeyboardEvent`

###### state

[`CalendarState`](CalendarState.md)

###### pluginState

`T`

##### Returns

`boolean`

#### onTimeClick()?

> `optional` **onTimeClick**: (`datetime`, `event`, `state`, `pluginState`) => `boolean`

##### Parameters

###### datetime

`Date`

###### event

`MouseEvent`

###### state

[`CalendarState`](CalendarState.md)

###### pluginState

`T`

##### Returns

`boolean`

***

### initialState?

> `optional` **initialState**: `Partial`\<`T`\>

Defined in: [src/utils/plugin-factory.ts:34](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/utils/plugin-factory.ts#L34)

초기 상태

***

### key

> **key**: `string`

Defined in: [src/utils/plugin-factory.ts:31](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/utils/plugin-factory.ts#L31)

플러그인 고유 키

***

### priority?

> `optional` **priority**: `number`

Defined in: [src/utils/plugin-factory.ts:40](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/utils/plugin-factory.ts#L40)

실행 우선순위

***

### stateHandlers?

> `optional` **stateHandlers**: `object`

Defined in: [src/utils/plugin-factory.ts:43](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/utils/plugin-factory.ts#L43)

상태 업데이트 핸들러들

#### Index Signature

\[`transactionType`: `string`\]: (`state`, `payload`) => `Partial`\<`T`\>

***

### transactionFilter()?

> `optional` **transactionFilter**: (`transaction`, `state`) => `boolean`

Defined in: [src/utils/plugin-factory.ts:62](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/utils/plugin-factory.ts#L62)

트랜잭션 필터

#### Parameters

##### transaction

[`Transaction`](Transaction.md)

##### state

[`CalendarState`](CalendarState.md)

#### Returns

`boolean`

***

### transactionPostProcessor()?

> `optional` **transactionPostProcessor**: (`transactions`, `oldState`, `newState`) => `null` \| [`Transaction`](Transaction.md)\<`any`\>

Defined in: [src/utils/plugin-factory.ts:65](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/utils/plugin-factory.ts#L65)

트랜잭션 후처리

#### Parameters

##### transactions

[`Transaction`](Transaction.md)\<`any`\>[]

##### oldState

[`CalendarState`](CalendarState.md)

##### newState

[`CalendarState`](CalendarState.md)

#### Returns

`null` \| [`Transaction`](Transaction.md)\<`any`\>
