[**@openmys/my-calendar v1.0.0**](../README.md)

***

[@openmys/my-calendar](../globals.md) / StateQuery

# Class: StateQuery

Defined in: [src/core/state.ts:294](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/state.ts#L294)

상태 쿼리 헬퍼

## Constructors

### Constructor

> **new StateQuery**(): `StateQuery`

#### Returns

`StateQuery`

## Methods

### findDay()

> `static` **findDay**(`state`, `date`): `undefined` \| [`CalendarDay`](../interfaces/CalendarDay.md)

Defined in: [src/core/state.ts:298](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/state.ts#L298)

특정 날짜의 CalendarDay 찾기

#### Parameters

##### state

[`CalendarState`](../interfaces/CalendarState.md)

##### date

`Date`

#### Returns

`undefined` \| [`CalendarDay`](../interfaces/CalendarDay.md)

***

### getActivePlugins()

> `static` **getActivePlugins**(`state`): `string`[]

Defined in: [src/core/state.ts:319](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/state.ts#L319)

활성화된 플러그인 목록

#### Parameters

##### state

[`CalendarState`](../interfaces/CalendarState.md)

#### Returns

`string`[]

***

### getPluginState()

> `static` **getPluginState**\<`T`\>(`state`, `pluginId`): `undefined` \| [`PluginState`](PluginState.md)\<`T`\>

Defined in: [src/core/state.ts:312](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/state.ts#L312)

플러그인 상태 가져오기

#### Type Parameters

##### T

`T` = `any`

#### Parameters

##### state

[`CalendarState`](../interfaces/CalendarState.md)

##### pluginId

`string`

#### Returns

`undefined` \| [`PluginState`](PluginState.md)\<`T`\>

***

### getToday()

> `static` **getToday**(`state`): `undefined` \| [`CalendarDay`](../interfaces/CalendarDay.md)

Defined in: [src/core/state.ts:326](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/state.ts#L326)

오늘 날짜 가져오기

#### Parameters

##### state

[`CalendarState`](../interfaces/CalendarState.md)

#### Returns

`undefined` \| [`CalendarDay`](../interfaces/CalendarDay.md)

***

### getVisibleDateRange()

> `static` **getVisibleDateRange**(`state`): [`TimeRange`](../interfaces/TimeRange.md)

Defined in: [src/core/state.ts:305](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/state.ts#L305)

현재 보이는 날짜 범위 가져오기

#### Parameters

##### state

[`CalendarState`](../interfaces/CalendarState.md)

#### Returns

[`TimeRange`](../interfaces/TimeRange.md)

***

### getWeekends()

> `static` **getWeekends**(`state`): [`CalendarDay`](../interfaces/CalendarDay.md)[]

Defined in: [src/core/state.ts:334](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/state.ts#L334)

주말 날짜들 가져오기

#### Parameters

##### state

[`CalendarState`](../interfaces/CalendarState.md)

#### Returns

[`CalendarDay`](../interfaces/CalendarDay.md)[]
