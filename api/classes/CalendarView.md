[**@openmys/my-calendar v1.0.0**](../README.md)

***

[@openmys/my-calendar](../globals.md) / CalendarView

# Class: CalendarView

Defined in: [src/core/calendar-view.ts:23](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/calendar-view.ts#L23)

CalendarView 클래스
캘린더의 핵심 뷰 및 상태 관리

## Constructors

### Constructor

> **new CalendarView**(`element`, `options`): `CalendarView`

Defined in: [src/core/calendar-view.ts:38](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/calendar-view.ts#L38)

#### Parameters

##### element

`HTMLElement`

##### options

[`CalendarViewOptions`](../interfaces/CalendarViewOptions.md) = `{}`

#### Returns

`CalendarView`

## Methods

### addPlugin()

> **addPlugin**(`plugin`): `void`

Defined in: [src/core/calendar-view.ts:227](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/calendar-view.ts#L227)

플러그인 관리

#### Parameters

##### plugin

[`Plugin`](Plugin.md)

#### Returns

`void`

***

### destroy()

> **destroy**(): `void`

Defined in: [src/core/calendar-view.ts:261](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/calendar-view.ts#L261)

정리

#### Returns

`void`

***

### dispatch()

> **dispatch**(`transaction`): `void`

Defined in: [src/core/calendar-view.ts:82](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/calendar-view.ts#L82)

트랜잭션 디스패치 (핵심 메서드)

#### Parameters

##### transaction

[`Transaction`](../interfaces/Transaction.md)

#### Returns

`void`

***

### execCommand()

> **execCommand**(`commandName`, ...`args`): `boolean`

Defined in: [src/core/calendar-view.ts:135](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/calendar-view.ts#L135)

커맨드 실행

#### Parameters

##### commandName

`string`

##### args

...`unknown`[]

#### Returns

`boolean`

***

### getState()

> **getState**(): [`CalendarState`](../interfaces/CalendarState.md)

Defined in: [src/core/calendar-view.ts:75](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/calendar-view.ts#L75)

현재 상태 반환

#### Returns

[`CalendarState`](../interfaces/CalendarState.md)

***

### onStateChange()

> **onStateChange**(`callback`): () => `void`

Defined in: [src/core/calendar-view.ts:176](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/calendar-view.ts#L176)

상태 변경 리스너 등록

#### Parameters

##### callback

(`state`) => `void`

#### Returns

> (): `void`

##### Returns

`void`

***

### onTransaction()

> **onTransaction**(`callback`): () => `void`

Defined in: [src/core/calendar-view.ts:191](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/calendar-view.ts#L191)

트랜잭션 리스너 등록

#### Parameters

##### callback

(`transaction`) => `void`

#### Returns

> (): `void`

##### Returns

`void`

***

### query()

> **query**(`pluginKey`, `queryName`, ...`args`): `unknown`

Defined in: [src/core/calendar-view.ts:147](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/calendar-view.ts#L147)

플러그인 쿼리

#### Parameters

##### pluginKey

`string`

##### queryName

`string`

##### args

...`unknown`[]

#### Returns

`unknown`

***

### redo()

> **redo**(): `boolean`

Defined in: [src/core/calendar-view.ts:215](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/calendar-view.ts#L215)

#### Returns

`boolean`

***

### removePlugin()

> **removePlugin**(`pluginKey`): `boolean`

Defined in: [src/core/calendar-view.ts:245](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/calendar-view.ts#L245)

#### Parameters

##### pluginKey

`string`

#### Returns

`boolean`

***

### render()

> **render**(): `void`

Defined in: [src/core/calendar-view.ts:154](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/calendar-view.ts#L154)

렌더링

#### Returns

`void`

***

### undo()

> **undo**(): `boolean`

Defined in: [src/core/calendar-view.ts:205](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/calendar-view.ts#L205)

Undo/Redo 지원

#### Returns

`boolean`
