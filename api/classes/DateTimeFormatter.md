[**@openmys/my-calendar v1.0.0**](../README.md)

***

[@openmys/my-calendar](../globals.md) / DateTimeFormatter

# Class: DateTimeFormatter

Defined in: [src/plugins/i18n-plugin.ts:321](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/plugins/i18n-plugin.ts#L321)

Date/Time Formatter 유틸리티

## Constructors

### Constructor

> **new DateTimeFormatter**(`locale`, `timeZone`): `DateTimeFormatter`

Defined in: [src/plugins/i18n-plugin.ts:326](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/plugins/i18n-plugin.ts#L326)

#### Parameters

##### locale

`string`

##### timeZone

`string`

#### Returns

`DateTimeFormatter`

## Methods

### format()

> **format**(`date`, `options?`): `string`

Defined in: [src/plugins/i18n-plugin.ts:331](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/plugins/i18n-plugin.ts#L331)

#### Parameters

##### date

`Date`

##### options?

`DateTimeFormatOptions`

#### Returns

`string`

***

### formatRange()

> **formatRange**(`startDate`, `endDate`, `options?`): `string`

Defined in: [src/plugins/i18n-plugin.ts:344](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/plugins/i18n-plugin.ts#L344)

#### Parameters

##### startDate

`Date`

##### endDate

`Date`

##### options?

`DateTimeFormatOptions`

#### Returns

`string`

***

### getMonths()

> **getMonths**(`format`): `string`[]

Defined in: [src/plugins/i18n-plugin.ts:372](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/plugins/i18n-plugin.ts#L372)

#### Parameters

##### format

`"long"` | `"short"` | `"narrow"`

#### Returns

`string`[]

***

### getWeekdays()

> **getWeekdays**(`format`, `firstDay`): `string`[]

Defined in: [src/plugins/i18n-plugin.ts:359](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/plugins/i18n-plugin.ts#L359)

#### Parameters

##### format

`"long"` | `"short"` | `"narrow"`

##### firstDay

`number` = `0`

#### Returns

`string`[]
