[**@openmys/my-calendar v1.0.0**](../README.md)

***

[@openmys/my-calendar](../globals.md) / PluginManager

# Class: PluginManager

Defined in: [src/core/plugin.ts:168](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/plugin.ts#L168)

플러그인 관리자

## Constructors

### Constructor

> **new PluginManager**(): `PluginManager`

#### Returns

`PluginManager`

## Methods

### appendTransactions()

> **appendTransactions**(`transactions`, `oldState`, `newState`): [`Transaction`](../interfaces/Transaction.md)\<`any`\>[]

Defined in: [src/core/plugin.ts:288](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/plugin.ts#L288)

추가 트랜잭션 생성

#### Parameters

##### transactions

[`Transaction`](../interfaces/Transaction.md)\<`any`\>[]

##### oldState

[`CalendarState`](../interfaces/CalendarState.md)

##### newState

[`CalendarState`](../interfaces/CalendarState.md)

#### Returns

[`Transaction`](../interfaces/Transaction.md)\<`any`\>[]

***

### clear()

> **clear**(): `void`

Defined in: [src/core/plugin.ts:396](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/plugin.ts#L396)

모든 플러그인 정리

#### Returns

`void`

***

### filterTransaction()

> **filterTransaction**(`transaction`, `state`): `boolean`

Defined in: [src/core/plugin.ts:274](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/plugin.ts#L274)

트랜잭션 필터링

#### Parameters

##### transaction

[`Transaction`](../interfaces/Transaction.md)

##### state

[`CalendarState`](../interfaces/CalendarState.md)

#### Returns

`boolean`

***

### get()

> **get**(`pluginKey`): `undefined` \| [`Plugin`](Plugin.md)\<`any`\>

Defined in: [src/core/plugin.ts:218](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/plugin.ts#L218)

플러그인 가져오기

#### Parameters

##### pluginKey

`string`

#### Returns

`undefined` \| [`Plugin`](Plugin.md)\<`any`\>

***

### getAll()

> **getAll**(): [`Plugin`](Plugin.md)\<`any`\>[]

Defined in: [src/core/plugin.ts:232](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/plugin.ts#L232)

모든 플러그인 가져오기 (우선순위 순)

#### Returns

[`Plugin`](Plugin.md)\<`any`\>[]

***

### getAllCommands()

> **getAllCommands**(): [`CommandMap`](../interfaces/CommandMap.md)

Defined in: [src/core/plugin.ts:246](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/plugin.ts#L246)

모든 플러그인의 커맨드 수집

#### Returns

[`CommandMap`](../interfaces/CommandMap.md)

***

### getAllDecorations()

> **getAllDecorations**(`state`): [`DecorationSet`](DecorationSet.md)

Defined in: [src/core/plugin.ts:260](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/plugin.ts#L260)

모든 플러그인의 데코레이션 수집

#### Parameters

##### state

[`CalendarState`](../interfaces/CalendarState.md)

#### Returns

[`DecorationSet`](DecorationSet.md)

***

### getPlugin()

> **getPlugin**(`pluginKey`): `undefined` \| [`Plugin`](Plugin.md)\<`any`\>

Defined in: [src/core/plugin.ts:225](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/plugin.ts#L225)

플러그인 가져오기 (별칭)

#### Parameters

##### pluginKey

`string`

#### Returns

`undefined` \| [`Plugin`](Plugin.md)\<`any`\>

***

### handleEvent()

> **handleEvent**(`eventType`, `eventData`, `state`): `boolean`

Defined in: [src/core/plugin.ts:310](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/plugin.ts#L310)

이벤트 처리

#### Parameters

##### eventType

`string`

##### eventData

`any`

##### state

[`CalendarState`](../interfaces/CalendarState.md)

#### Returns

`boolean`

***

### handleMessage()

> **handleMessage**(`message`, `state`): `null` \| [`Transaction`](../interfaces/Transaction.md)\<`any`\>

Defined in: [src/core/plugin.ts:414](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/plugin.ts#L414)

메시지 핸들링

#### Parameters

##### message

[`PluginMessage`](../interfaces/PluginMessage.md)

##### state

[`CalendarState`](../interfaces/CalendarState.md)

#### Returns

`null` \| [`Transaction`](../interfaces/Transaction.md)\<`any`\>

***

### has()

> **has**(`pluginKey`): `boolean`

Defined in: [src/core/plugin.ts:239](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/plugin.ts#L239)

플러그인 존재 여부 확인

#### Parameters

##### pluginKey

`string`

#### Returns

`boolean`

***

### processMessages()

> **processMessages**(`state`): [`Transaction`](../interfaces/Transaction.md)\<`any`\>[]

Defined in: [src/core/plugin.ts:367](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/plugin.ts#L367)

메시지 처리

#### Parameters

##### state

[`CalendarState`](../interfaces/CalendarState.md)

#### Returns

[`Transaction`](../interfaces/Transaction.md)\<`any`\>[]

***

### query()

> **query**(`pluginKey`, `queryName`, `state`, ...`args`): `any`

Defined in: [src/core/plugin.ts:388](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/plugin.ts#L388)

쿼리 실행

#### Parameters

##### pluginKey

`string`

##### queryName

`string`

##### state

[`CalendarState`](../interfaces/CalendarState.md)

##### args

...`any`[]

#### Returns

`any`

***

### register()

> **register**(`plugin`): `void`

Defined in: [src/core/plugin.ts:176](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/plugin.ts#L176)

플러그인 등록

#### Parameters

##### plugin

[`Plugin`](Plugin.md)

#### Returns

`void`

***

### registerAll()

> **registerAll**(`plugins`): `void`

Defined in: [src/core/plugin.ts:192](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/plugin.ts#L192)

여러 플러그인 일괄 등록

#### Parameters

##### plugins

[`Plugin`](Plugin.md)\<`any`\>[]

#### Returns

`void`

***

### resolveDependencies()

> **resolveDependencies**(): [`Plugin`](Plugin.md)\<`any`\>[]

Defined in: [src/core/plugin.ts:407](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/plugin.ts#L407)

의존성과 우선순위로 정렬된 플러그인 목록 반환

#### Returns

[`Plugin`](Plugin.md)\<`any`\>[]

***

### sendMessage()

> **sendMessage**(`message`): `void`

Defined in: [src/core/plugin.ts:360](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/plugin.ts#L360)

플러그인 간 메시지 전송

#### Parameters

##### message

[`PluginMessage`](../interfaces/PluginMessage.md)

#### Returns

`void`

***

### unregister()

> **unregister**(`pluginKey`): `boolean`

Defined in: [src/core/plugin.ts:204](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/plugin.ts#L204)

플러그인 제거

#### Parameters

##### pluginKey

`string`

#### Returns

`boolean`
