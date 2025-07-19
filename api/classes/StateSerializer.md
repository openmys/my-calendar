[**@openmys/my-calendar v1.0.0**](../README.md)

***

[@openmys/my-calendar](../globals.md) / StateSerializer

# Class: StateSerializer

Defined in: [src/core/plugin-state.ts:141](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/plugin-state.ts#L141)

상태 직렬화/역직렬화를 위한 유틸리티

## Constructors

### Constructor

> **new StateSerializer**(): `StateSerializer`

#### Returns

`StateSerializer`

## Methods

### deserialize()

> `static` **deserialize**(`data`, `stateClasses`): [`PluginState`](PluginState.md)

Defined in: [src/core/plugin-state.ts:155](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/plugin-state.ts#L155)

JSON에서 PluginState로 역직렬화

#### Parameters

##### data

`any`

##### stateClasses

`Map`\<`string`, *typeof* [`PluginState`](PluginState.md)\>

#### Returns

[`PluginState`](PluginState.md)

***

### deserializeCalendarState()

> `static` **deserializeCalendarState**(`data`, `stateClasses`): `Partial`\<[`CalendarState`](../interfaces/CalendarState.md)\>

Defined in: [src/core/plugin-state.ts:190](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/plugin-state.ts#L190)

JSON에서 CalendarState로 역직렬화

#### Parameters

##### data

`any`

##### stateClasses

`Map`\<`string`, *typeof* [`PluginState`](PluginState.md)\>

#### Returns

`Partial`\<[`CalendarState`](../interfaces/CalendarState.md)\>

***

### serialize()

> `static` **serialize**(`state`): `any`

Defined in: [src/core/plugin-state.ts:145](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/plugin-state.ts#L145)

PluginState를 JSON으로 직렬화

#### Parameters

##### state

[`PluginState`](PluginState.md)

#### Returns

`any`

***

### serializeCalendarState()

> `static` **serializeCalendarState**(`state`, `_stateClasses`): `any`

Defined in: [src/core/plugin-state.ts:167](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/plugin-state.ts#L167)

전체 CalendarState 직렬화

#### Parameters

##### state

[`CalendarState`](../interfaces/CalendarState.md)

##### \_stateClasses

`Map`\<`string`, *typeof* [`PluginState`](PluginState.md)\>

#### Returns

`any`
