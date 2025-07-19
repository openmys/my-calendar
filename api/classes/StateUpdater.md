[**@openmys/my-calendar v1.0.0**](../README.md)

***

[@openmys/my-calendar](../globals.md) / StateUpdater

# Class: StateUpdater

Defined in: [src/core/state.ts:154](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/state.ts#L154)

상태 업데이트 헬퍼

## Constructors

### Constructor

> **new StateUpdater**(): `StateUpdater`

#### Returns

`StateUpdater`

## Methods

### goToToday()

> `static` **goToToday**(`state`): [`CalendarState`](../interfaces/CalendarState.md)

Defined in: [src/core/state.ts:286](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/state.ts#L286)

오늘로 이동

#### Parameters

##### state

[`CalendarState`](../interfaces/CalendarState.md)

#### Returns

[`CalendarState`](../interfaces/CalendarState.md)

***

### navigateDay()

> `static` **navigateDay**(`state`, `direction`): [`CalendarState`](../interfaces/CalendarState.md)

Defined in: [src/core/state.ts:271](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/state.ts#L271)

일 이동

#### Parameters

##### state

[`CalendarState`](../interfaces/CalendarState.md)

##### direction

`"next"` | `"previous"`

#### Returns

[`CalendarState`](../interfaces/CalendarState.md)

***

### navigateMonth()

> `static` **navigateMonth**(`state`, `direction`): [`CalendarState`](../interfaces/CalendarState.md)

Defined in: [src/core/state.ts:241](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/state.ts#L241)

월 이동 (다음/이전)

#### Parameters

##### state

[`CalendarState`](../interfaces/CalendarState.md)

##### direction

`"next"` | `"previous"`

#### Returns

[`CalendarState`](../interfaces/CalendarState.md)

***

### navigateWeek()

> `static` **navigateWeek**(`state`, `direction`): [`CalendarState`](../interfaces/CalendarState.md)

Defined in: [src/core/state.ts:256](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/state.ts#L256)

주 이동

#### Parameters

##### state

[`CalendarState`](../interfaces/CalendarState.md)

##### direction

`"next"` | `"previous"`

#### Returns

[`CalendarState`](../interfaces/CalendarState.md)

***

### removePlugin()

> `static` **removePlugin**(`state`, `pluginId`): [`CalendarState`](../interfaces/CalendarState.md)

Defined in: [src/core/state.ts:212](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/state.ts#L212)

플러그인 제거

#### Parameters

##### state

[`CalendarState`](../interfaces/CalendarState.md)

##### pluginId

`string`

#### Returns

[`CalendarState`](../interfaces/CalendarState.md)

***

### updateCurrentDate()

> `static` **updateCurrentDate**(`state`, `newDate`): [`CalendarState`](../interfaces/CalendarState.md)

Defined in: [src/core/state.ts:158](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/state.ts#L158)

현재 날짜 변경

#### Parameters

##### state

[`CalendarState`](../interfaces/CalendarState.md)

##### newDate

`Date`

#### Returns

[`CalendarState`](../interfaces/CalendarState.md)

***

### updatePluginState()

> `static` **updatePluginState**(`state`, `pluginId`, `newPluginState`): [`CalendarState`](../interfaces/CalendarState.md)

Defined in: [src/core/state.ts:192](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/state.ts#L192)

플러그인 상태 업데이트

#### Parameters

##### state

[`CalendarState`](../interfaces/CalendarState.md)

##### pluginId

`string`

##### newPluginState

[`PluginState`](PluginState.md)

#### Returns

[`CalendarState`](../interfaces/CalendarState.md)

***

### updateTimezone()

> `static` **updateTimezone**(`state`, `timezone`): [`CalendarState`](../interfaces/CalendarState.md)

Defined in: [src/core/state.ts:228](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/state.ts#L228)

시간대 변경

#### Parameters

##### state

[`CalendarState`](../interfaces/CalendarState.md)

##### timezone

`string`

#### Returns

[`CalendarState`](../interfaces/CalendarState.md)

***

### updateViewType()

> `static` **updateViewType**(`state`, `viewType`): [`CalendarState`](../interfaces/CalendarState.md)

Defined in: [src/core/state.ts:175](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/state.ts#L175)

뷰 타입 변경

#### Parameters

##### state

[`CalendarState`](../interfaces/CalendarState.md)

##### viewType

[`ViewType`](../type-aliases/ViewType.md)

#### Returns

[`CalendarState`](../interfaces/CalendarState.md)
