[**@openmys/my-calendar v1.0.0**](../README.md)

***

[@openmys/my-calendar](../globals.md) / PluginFactory

# Class: PluginFactory

Defined in: [src/core/plugin.ts:489](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/plugin.ts#L489)

플러그인 팩토리 헬퍼

## Constructors

### Constructor

> **new PluginFactory**(): `PluginFactory`

#### Returns

`PluginFactory`

## Methods

### createCommandPlugin()

> `static` **createCommandPlugin**(`key`, `commands`): [`Plugin`](Plugin.md)

Defined in: [src/core/plugin.ts:536](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/plugin.ts#L536)

커맨드 전용 플러그인 생성

#### Parameters

##### key

`string`

##### commands

[`CommandMap`](../interfaces/CommandMap.md)

#### Returns

[`Plugin`](Plugin.md)

***

### createDecorationPlugin()

> `static` **createDecorationPlugin**(`key`, `decorationFactory`): [`Plugin`](Plugin.md)

Defined in: [src/core/plugin.ts:546](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/plugin.ts#L546)

데코레이션 전용 플러그인 생성

#### Parameters

##### key

`string`

##### decorationFactory

(`state`) => [`DecorationSet`](DecorationSet.md)

#### Returns

[`Plugin`](Plugin.md)

***

### createSimpleStatePlugin()

> `static` **createSimpleStatePlugin**\<`T`\>(`key`, `initialState`, `handlers`): [`Plugin`](Plugin.md)\<`T`\>

Defined in: [src/core/plugin.ts:493](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/plugin.ts#L493)

간단한 상태 플러그인 생성

#### Type Parameters

##### T

`T`

#### Parameters

##### key

`string`

##### initialState

`T`

##### handlers

`Partial`\<\{ `createDecorations`: (`calendarState`, `state`) => [`DecorationSet`](DecorationSet.md); `handleDateClick`: (`date`, `event`, `state`) => `boolean`; `handleTransaction`: (`transaction`, `state`) => `T`; \}\>

#### Returns

[`Plugin`](Plugin.md)\<`T`\>
