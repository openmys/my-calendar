[**@openmys/my-calendar v1.0.0**](../README.md)

***

[@openmys/my-calendar](../globals.md) / CalendarSystem

# Interface: CalendarSystem

Defined in: [src/plugins/i18n-plugin.ts:626](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/plugins/i18n-plugin.ts#L626)

지역별 달력 시스템 인터페이스

## Properties

### name

> **name**: `string`

Defined in: [src/plugins/i18n-plugin.ts:627](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/plugins/i18n-plugin.ts#L627)

## Methods

### fromGregorian()

> **fromGregorian**(`date`): [`CalendarDate`](CalendarDate.md)

Defined in: [src/plugins/i18n-plugin.ts:629](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/plugins/i18n-plugin.ts#L629)

#### Parameters

##### date

`Date`

#### Returns

[`CalendarDate`](CalendarDate.md)

***

### getDaysInMonth()

> **getDaysInMonth**(`year`, `month`): `number`

Defined in: [src/plugins/i18n-plugin.ts:633](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/plugins/i18n-plugin.ts#L633)

#### Parameters

##### year

`number`

##### month

`number`

#### Returns

`number`

***

### getMonthNames()

> **getMonthNames**(`locale`): `string`[]

Defined in: [src/plugins/i18n-plugin.ts:630](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/plugins/i18n-plugin.ts#L630)

#### Parameters

##### locale

`string`

#### Returns

`string`[]

***

### getWeekdayNames()

> **getWeekdayNames**(`locale`): `string`[]

Defined in: [src/plugins/i18n-plugin.ts:631](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/plugins/i18n-plugin.ts#L631)

#### Parameters

##### locale

`string`

#### Returns

`string`[]

***

### isLeapYear()

> **isLeapYear**(`year`): `boolean`

Defined in: [src/plugins/i18n-plugin.ts:632](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/plugins/i18n-plugin.ts#L632)

#### Parameters

##### year

`number`

#### Returns

`boolean`

***

### toGregorian()

> **toGregorian**(`date`): `Date`

Defined in: [src/plugins/i18n-plugin.ts:628](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/plugins/i18n-plugin.ts#L628)

#### Parameters

##### date

[`CalendarDate`](CalendarDate.md)

#### Returns

`Date`
