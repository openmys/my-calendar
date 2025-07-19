[**@openmys/my-calendar v1.0.0**](../README.md)

***

[@openmys/my-calendar](../globals.md) / CalendarStateFactory

# Class: CalendarStateFactory

Defined in: [src/core/state.ts:12](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/state.ts#L12)

CalendarState 팩토리

## Constructors

### Constructor

> **new CalendarStateFactory**(): `CalendarStateFactory`

#### Returns

`CalendarStateFactory`

## Methods

### calculateTimeRangeForView()

> `static` **calculateTimeRangeForView**(`date`, `viewType`): [`TimeRange`](../interfaces/TimeRange.md)

Defined in: [src/core/state.ts:109](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/state.ts#L109)

뷰 타입에 따른 시간 범위 계산

#### Parameters

##### date

`Date`

##### viewType

[`ViewType`](../type-aliases/ViewType.md)

#### Returns

[`TimeRange`](../interfaces/TimeRange.md)

***

### create()

> `static` **create**(`plugins`, `options?`): [`CalendarState`](../interfaces/CalendarState.md)

Defined in: [src/core/state.ts:50](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/state.ts#L50)

플러그인과 함께 CalendarState 생성

#### Parameters

##### plugins

`any`[] = `[]`

##### options?

###### currentDate?

`Date`

###### timeRange?

[`TimeRange`](../interfaces/TimeRange.md)

###### timezone?

`string`

###### viewType?

[`ViewType`](../type-aliases/ViewType.md)

#### Returns

[`CalendarState`](../interfaces/CalendarState.md)

***

### createInitialState()

> `static` **createInitialState**(`options`): [`CalendarState`](../interfaces/CalendarState.md)

Defined in: [src/core/state.ts:16](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/state.ts#L16)

기본 CalendarState 생성

#### Parameters

##### options

###### currentDate?

`Date`

###### timeRange?

[`TimeRange`](../interfaces/TimeRange.md)

###### timezone?

`string`

###### viewType?

[`ViewType`](../type-aliases/ViewType.md)

#### Returns

[`CalendarState`](../interfaces/CalendarState.md)
