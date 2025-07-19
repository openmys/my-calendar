[**@openmys/my-calendar v1.0.0**](../README.md)

***

[@openmys/my-calendar](../globals.md) / PluginBuilder

# Class: PluginBuilder\<T\>

Defined in: [src/utils/plugin-builder.ts:17](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/utils/plugin-builder.ts#L17)

플러그인 빌더 클래스
플루언트 API를 통해 단계별로 플러그인을 구성할 수 있습니다.

## Type Parameters

### T

`T` = `any`

## Constructors

### Constructor

> **new PluginBuilder**\<`T`\>(): `PluginBuilder`\<`T`\>

#### Returns

`PluginBuilder`\<`T`\>

## Methods

### addCommand()

> **addCommand**(`name`, `commandFn`): `PluginBuilder`\<`T`\>

Defined in: [src/utils/plugin-builder.ts:72](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/utils/plugin-builder.ts#L72)

커맨드 추가

#### Parameters

##### name

`string`

##### commandFn

(...`args`) => (`state`, `dispatch?`) => `boolean`

#### Returns

`PluginBuilder`\<`T`\>

***

### build()

> **build**(): [`Plugin`](Plugin.md)\<`T`\>

Defined in: [src/utils/plugin-builder.ts:153](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/utils/plugin-builder.ts#L153)

플러그인 빌드

#### Returns

[`Plugin`](Plugin.md)\<`T`\>

***

### dependsOn()

> **dependsOn**(...`dependencies`): `PluginBuilder`\<`T`\>

Defined in: [src/utils/plugin-builder.ts:45](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/utils/plugin-builder.ts#L45)

의존성 추가

#### Parameters

##### dependencies

...`string`[]

#### Returns

`PluginBuilder`\<`T`\>

***

### filterTransactions()

> **filterTransactions**(`filter`): `PluginBuilder`\<`T`\>

Defined in: [src/utils/plugin-builder.ts:133](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/utils/plugin-builder.ts#L133)

트랜잭션 필터 설정

#### Parameters

##### filter

(`transaction`, `state`) => `boolean`

#### Returns

`PluginBuilder`\<`T`\>

***

### onDateClick()

> **onDateClick**(`handler`): `PluginBuilder`\<`T`\>

Defined in: [src/utils/plugin-builder.ts:83](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/utils/plugin-builder.ts#L83)

날짜 클릭 핸들러 설정

#### Parameters

##### handler

(`date`, `event`, `state`, `pluginState`) => `boolean`

#### Returns

`PluginBuilder`\<`T`\>

***

### onKeyDown()

> **onKeyDown**(`handler`): `PluginBuilder`\<`T`\>

Defined in: [src/utils/plugin-builder.ts:103](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/utils/plugin-builder.ts#L103)

키보드 이벤트 핸들러 설정

#### Parameters

##### handler

(`event`, `state`, `pluginState`) => `boolean`

#### Returns

`PluginBuilder`\<`T`\>

***

### onKeyUp()

> **onKeyUp**(`handler`): `PluginBuilder`\<`T`\>

Defined in: [src/utils/plugin-builder.ts:113](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/utils/plugin-builder.ts#L113)

키업 이벤트 핸들러 설정

#### Parameters

##### handler

(`event`, `state`, `pluginState`) => `boolean`

#### Returns

`PluginBuilder`\<`T`\>

***

### onTimeClick()

> **onTimeClick**(`handler`): `PluginBuilder`\<`T`\>

Defined in: [src/utils/plugin-builder.ts:93](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/utils/plugin-builder.ts#L93)

시간 클릭 핸들러 설정

#### Parameters

##### handler

(`datetime`, `event`, `state`, `pluginState`) => `boolean`

#### Returns

`PluginBuilder`\<`T`\>

***

### onTransaction()

> **onTransaction**(`transactionType`, `handler`): `PluginBuilder`\<`T`\>

Defined in: [src/utils/plugin-builder.ts:61](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/utils/plugin-builder.ts#L61)

상태 핸들러 추가

#### Parameters

##### transactionType

`string`

##### handler

(`state`, `payload`) => `Partial`\<`T`\>

#### Returns

`PluginBuilder`\<`T`\>

***

### postProcessTransactions()

> **postProcessTransactions**(`processor`): `PluginBuilder`\<`T`\>

Defined in: [src/utils/plugin-builder.ts:143](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/utils/plugin-builder.ts#L143)

트랜잭션 후처리 설정

#### Parameters

##### processor

(`transactions`, `oldState`, `newState`) => `null` \| [`Transaction`](../interfaces/Transaction.md)\<`any`\>

#### Returns

`PluginBuilder`\<`T`\>

***

### withDecorations()

> **withDecorations**(`factory`): `PluginBuilder`\<`T`\>

Defined in: [src/utils/plugin-builder.ts:123](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/utils/plugin-builder.ts#L123)

데코레이션 팩토리 설정

#### Parameters

##### factory

(`state`, `pluginState`) => [`DecorationSet`](DecorationSet.md)

#### Returns

`PluginBuilder`\<`T`\>

***

### withInitialState()

> **withInitialState**(`state`): `PluginBuilder`\<`T`\>

Defined in: [src/utils/plugin-builder.ts:37](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/utils/plugin-builder.ts#L37)

초기 상태 설정

#### Parameters

##### state

`Partial`\<`T`\>

#### Returns

`PluginBuilder`\<`T`\>

***

### withKey()

> **withKey**(`key`): `PluginBuilder`\<`T`\>

Defined in: [src/utils/plugin-builder.ts:29](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/utils/plugin-builder.ts#L29)

플러그인 키 설정

#### Parameters

##### key

`string`

#### Returns

`PluginBuilder`\<`T`\>

***

### withPriority()

> **withPriority**(`priority`): `PluginBuilder`\<`T`\>

Defined in: [src/utils/plugin-builder.ts:53](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/utils/plugin-builder.ts#L53)

우선순위 설정

#### Parameters

##### priority

`number`

#### Returns

`PluginBuilder`\<`T`\>
