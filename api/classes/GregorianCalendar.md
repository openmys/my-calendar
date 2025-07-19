[**@openmys/my-calendar v1.0.0**](../README.md)

***

[@openmys/my-calendar](../globals.md) / GregorianCalendar

# Class: GregorianCalendar

Defined in: [src/plugins/i18n-plugin.ts:645](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/plugins/i18n-plugin.ts#L645)

그레고리안 달력 시스템 (기본)

## Implements

- [`CalendarSystem`](../interfaces/CalendarSystem.md)

## Constructors

### Constructor

> **new GregorianCalendar**(): `GregorianCalendar`

#### Returns

`GregorianCalendar`

## Properties

### name

> **name**: `string` = `'gregorian'`

Defined in: [src/plugins/i18n-plugin.ts:646](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/plugins/i18n-plugin.ts#L646)

#### Implementation of

[`CalendarSystem`](../interfaces/CalendarSystem.md).[`name`](../interfaces/CalendarSystem.md#name)

## Methods

### fromGregorian()

> **fromGregorian**(`date`): [`CalendarDate`](../interfaces/CalendarDate.md)

Defined in: [src/plugins/i18n-plugin.ts:652](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/plugins/i18n-plugin.ts#L652)

#### Parameters

##### date

`Date`

#### Returns

[`CalendarDate`](../interfaces/CalendarDate.md)

#### Implementation of

[`CalendarSystem`](../interfaces/CalendarSystem.md).[`fromGregorian`](../interfaces/CalendarSystem.md#fromgregorian)

***

### getDaysInMonth()

> **getDaysInMonth**(`year`, `month`): `number`

Defined in: [src/plugins/i18n-plugin.ts:674](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/plugins/i18n-plugin.ts#L674)

#### Parameters

##### year

`number`

##### month

`number`

#### Returns

`number`

#### Implementation of

[`CalendarSystem`](../interfaces/CalendarSystem.md).[`getDaysInMonth`](../interfaces/CalendarSystem.md#getdaysinmonth)

***

### getMonthNames()

> **getMonthNames**(`locale`): `string`[]

Defined in: [src/plugins/i18n-plugin.ts:660](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/plugins/i18n-plugin.ts#L660)

#### Parameters

##### locale

`string`

#### Returns

`string`[]

#### Implementation of

[`CalendarSystem`](../interfaces/CalendarSystem.md).[`getMonthNames`](../interfaces/CalendarSystem.md#getmonthnames)

***

### getWeekdayNames()

> **getWeekdayNames**(`locale`): `string`[]

Defined in: [src/plugins/i18n-plugin.ts:665](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/plugins/i18n-plugin.ts#L665)

#### Parameters

##### locale

`string`

#### Returns

`string`[]

#### Implementation of

[`CalendarSystem`](../interfaces/CalendarSystem.md).[`getWeekdayNames`](../interfaces/CalendarSystem.md#getweekdaynames)

***

### isLeapYear()

> **isLeapYear**(`year`): `boolean`

Defined in: [src/plugins/i18n-plugin.ts:670](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/plugins/i18n-plugin.ts#L670)

#### Parameters

##### year

`number`

#### Returns

`boolean`

#### Implementation of

[`CalendarSystem`](../interfaces/CalendarSystem.md).[`isLeapYear`](../interfaces/CalendarSystem.md#isleapyear)

***

### toGregorian()

> **toGregorian**(`date`): `Date`

Defined in: [src/plugins/i18n-plugin.ts:648](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/plugins/i18n-plugin.ts#L648)

#### Parameters

##### date

[`CalendarDate`](../interfaces/CalendarDate.md)

#### Returns

`Date`

#### Implementation of

[`CalendarSystem`](../interfaces/CalendarSystem.md).[`toGregorian`](../interfaces/CalendarSystem.md#togregorian)
