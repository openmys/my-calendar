[**@openmys/my-calendar v1.0.0**](../README.md)

***

[@openmys/my-calendar](../globals.md) / Plugin

# Class: Plugin\<T\>

Defined in: [src/core/plugin.ts:104](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/plugin.ts#L104)

Plugin 클래스

## Type Parameters

### T

`T` = `any`

## Constructors

### Constructor

> **new Plugin**\<`T`\>(`spec`): `Plugin`\<`T`\>

Defined in: [src/core/plugin.ts:105](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/plugin.ts#L105)

#### Parameters

##### spec

[`PluginSpec`](../interfaces/PluginSpec.md)\<`T`\>

#### Returns

`Plugin`\<`T`\>

## Properties

### spec

> **spec**: [`PluginSpec`](../interfaces/PluginSpec.md)\<`T`\>

Defined in: [src/core/plugin.ts:105](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/plugin.ts#L105)

## Accessors

### dependencies

#### Get Signature

> **get** **dependencies**(): `string`[]

Defined in: [src/core/plugin.ts:116](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/plugin.ts#L116)

##### Returns

`string`[]

***

### key

#### Get Signature

> **get** **key**(): `string`

Defined in: [src/core/plugin.ts:112](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/plugin.ts#L112)

##### Returns

`string`

***

### priority

#### Get Signature

> **get** **priority**(): `number`

Defined in: [src/core/plugin.ts:120](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/plugin.ts#L120)

##### Returns

`number`

## Methods

### destroy()

> **destroy**(): `void`

Defined in: [src/core/plugin.ts:158](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/plugin.ts#L158)

플러그인 정리

#### Returns

`void`

***

### getCommands()

> **getCommands**(): [`CommandMap`](../interfaces/CommandMap.md)

Defined in: [src/core/plugin.ts:134](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/plugin.ts#L134)

플러그인이 제공하는 커맨드 가져오기

#### Returns

[`CommandMap`](../interfaces/CommandMap.md)

***

### getDecorations()

> **getDecorations**(`state`): [`DecorationSet`](DecorationSet.md)

Defined in: [src/core/plugin.ts:141](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/plugin.ts#L141)

플러그인의 데코레이션 가져오기

#### Parameters

##### state

[`CalendarState`](../interfaces/CalendarState.md)

#### Returns

[`DecorationSet`](DecorationSet.md)

***

### getState()

> **getState**(`calendarState`): `undefined` \| [`PluginState`](PluginState.md)\<`T`\>

Defined in: [src/core/plugin.ts:127](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/plugin.ts#L127)

플러그인의 현재 상태 가져오기

#### Parameters

##### calendarState

[`CalendarState`](../interfaces/CalendarState.md)

#### Returns

`undefined` \| [`PluginState`](PluginState.md)\<`T`\>

***

### query()

> **query**(`name`, `state`, ...`args`): `any`

Defined in: [src/core/plugin.ts:148](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/plugin.ts#L148)

쿼리 실행

#### Parameters

##### name

`string`

##### state

[`CalendarState`](../interfaces/CalendarState.md)

##### args

...`any`[]

#### Returns

`any`
