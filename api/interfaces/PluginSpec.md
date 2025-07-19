[**@openmys/my-calendar v1.0.0**](../README.md)

***

[@openmys/my-calendar](../globals.md) / PluginSpec

# Interface: PluginSpec\<T\>

Defined in: [src/core/plugin.ts:20](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/plugin.ts#L20)

플러그인 인터페이스

## Type Parameters

### T

`T` = `any`

## Properties

### appendTransaction()?

> `optional` **appendTransaction**: (`transactions`, `oldState`, `newState`, `plugin`) => `null` \| [`Transaction`](Transaction.md)\<`any`\>

Defined in: [src/core/plugin.ts:77](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/plugin.ts#L77)

#### Parameters

##### transactions

[`Transaction`](Transaction.md)\<`any`\>[]

##### oldState

[`CalendarState`](CalendarState.md)

##### newState

[`CalendarState`](CalendarState.md)

##### plugin

[`Plugin`](../classes/Plugin.md)\<`T`\>

#### Returns

`null` \| [`Transaction`](Transaction.md)\<`any`\>

***

### commands()?

> `optional` **commands**: (`plugin`) => [`CommandMap`](CommandMap.md)

Defined in: [src/core/plugin.ts:34](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/plugin.ts#L34)

#### Parameters

##### plugin

[`Plugin`](../classes/Plugin.md)\<`T`\>

#### Returns

[`CommandMap`](CommandMap.md)

***

### decorations()?

> `optional` **decorations**: (`state`, `plugin`) => [`DecorationSet`](../classes/DecorationSet.md)

Defined in: [src/core/plugin.ts:37](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/plugin.ts#L37)

#### Parameters

##### state

[`CalendarState`](CalendarState.md)

##### plugin

[`Plugin`](../classes/Plugin.md)\<`T`\>

#### Returns

[`DecorationSet`](../classes/DecorationSet.md)

***

### dependencies?

> `optional` **dependencies**: `string`[]

Defined in: [src/core/plugin.ts:24](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/plugin.ts#L24)

***

### filterTransaction()?

> `optional` **filterTransaction**: (`transaction`, `state`, `plugin`) => `boolean`

Defined in: [src/core/plugin.ts:71](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/plugin.ts#L71)

#### Parameters

##### transaction

[`Transaction`](Transaction.md)

##### state

[`CalendarState`](CalendarState.md)

##### plugin

[`Plugin`](../classes/Plugin.md)\<`T`\>

#### Returns

`boolean`

***

### handleMessage()?

> `optional` **handleMessage**: (`message`, `state`, `plugin`) => `null` \| [`Transaction`](Transaction.md)\<`any`\>

Defined in: [src/core/plugin.ts:90](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/plugin.ts#L90)

#### Parameters

##### message

[`PluginMessage`](PluginMessage.md)

##### state

[`CalendarState`](CalendarState.md)

##### plugin

[`Plugin`](../classes/Plugin.md)\<`T`\>

#### Returns

`null` \| [`Transaction`](Transaction.md)\<`any`\>

***

### key

> **key**: `string`

Defined in: [src/core/plugin.ts:21](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/plugin.ts#L21)

***

### onCreate()?

> `optional` **onCreate**: (`plugin`) => `void`

Defined in: [src/core/plugin.ts:97](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/plugin.ts#L97)

#### Parameters

##### plugin

[`Plugin`](../classes/Plugin.md)\<`T`\>

#### Returns

`void`

***

### onDestroy()?

> `optional` **onDestroy**: (`plugin`) => `void`

Defined in: [src/core/plugin.ts:98](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/plugin.ts#L98)

#### Parameters

##### plugin

[`Plugin`](../classes/Plugin.md)\<`T`\>

#### Returns

`void`

***

### priority?

> `optional` **priority**: `number`

Defined in: [src/core/plugin.ts:25](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/plugin.ts#L25)

***

### props?

> `optional` **props**: `object`

Defined in: [src/core/plugin.ts:40](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/plugin.ts#L40)

#### handleDateClick()?

> `optional` **handleDateClick**: (`date`, `event`, `state`, `plugin`) => `boolean`

##### Parameters

###### date

`Date`

###### event

`MouseEvent`

###### state

[`CalendarState`](CalendarState.md)

###### plugin

[`Plugin`](../classes/Plugin.md)\<`T`\>

##### Returns

`boolean`

#### handleDrag()?

> `optional` **handleDrag**: (`dragData`, `state`, `plugin`) => `boolean`

##### Parameters

###### dragData

[`DragData`](DragData.md)

###### state

[`CalendarState`](CalendarState.md)

###### plugin

[`Plugin`](../classes/Plugin.md)\<`T`\>

##### Returns

`boolean`

#### handleKeyDown()?

> `optional` **handleKeyDown**: (`event`, `state`, `plugin`) => `boolean`

##### Parameters

###### event

`KeyboardEvent`

###### state

[`CalendarState`](CalendarState.md)

###### plugin

[`Plugin`](../classes/Plugin.md)\<`T`\>

##### Returns

`boolean`

#### handleResize()?

> `optional` **handleResize**: (`resizeData`, `state`, `plugin`) => `boolean`

##### Parameters

###### resizeData

[`ResizeData`](ResizeData.md)

###### state

[`CalendarState`](CalendarState.md)

###### plugin

[`Plugin`](../classes/Plugin.md)\<`T`\>

##### Returns

`boolean`

#### handleTimeClick()?

> `optional` **handleTimeClick**: (`datetime`, `event`, `state`, `plugin`) => `boolean`

##### Parameters

###### datetime

`Date`

###### event

`MouseEvent`

###### state

[`CalendarState`](CalendarState.md)

###### plugin

[`Plugin`](../classes/Plugin.md)\<`T`\>

##### Returns

`boolean`

***

### queries?

> `optional` **queries**: `object`

Defined in: [src/core/plugin.ts:85](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/plugin.ts#L85)

#### Index Signature

\[`queryName`: `string`\]: (`state`, `plugin`, ...`args`) => `any`

***

### state?

> `optional` **state**: `object`

Defined in: [src/core/plugin.ts:28](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/plugin.ts#L28)

#### apply()

> **apply**: (`transaction`, `state`) => [`PluginState`](../classes/PluginState.md)\<`T`\>

##### Parameters

###### transaction

[`Transaction`](Transaction.md)

###### state

[`PluginState`](../classes/PluginState.md)\<`T`\>

##### Returns

[`PluginState`](../classes/PluginState.md)\<`T`\>

#### init()

> **init**: (`config?`) => [`PluginState`](../classes/PluginState.md)\<`T`\>

##### Parameters

###### config?

`any`

##### Returns

[`PluginState`](../classes/PluginState.md)\<`T`\>
