[**@openmys/my-calendar v1.0.0**](../../../../README.md)

***

[@openmys/my-calendar](../../../../globals.md) / [PluginHelpers](../README.md) / DecorationHelpers

# Variable: DecorationHelpers

> `const` **DecorationHelpers**: `object`

Defined in: [src/utils/plugin-factory.ts:497](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/utils/plugin-factory.ts#L497)

데코레이션 헬퍼

## Type declaration

### createBadge()

> **createBadge**: (`date`, `text`, `className`) => `object`

#### Parameters

##### date

`Date`

##### text

`string`

##### className

`string` = `'badge'`

#### Returns

`object`

##### from

> **from**: `Date` = `date`

##### spec

> **spec**: `object`

###### spec.class

> **class**: `string` = `className`

###### spec.data-badge

> **data-badge**: `string` = `text`

##### type

> **type**: `"badge"`

### createHighlight()

> **createHighlight**: (`date`, `className`) => `object`

#### Parameters

##### date

`Date`

##### className

`string` = `'highlight'`

#### Returns

`object`

##### from

> **from**: `Date` = `date`

##### spec

> **spec**: `object`

###### spec.class

> **class**: `string` = `className`

##### type

> **type**: `"highlight"`

### createTooltip()

> **createTooltip**: (`date`, `tooltip`) => `object`

#### Parameters

##### date

`Date`

##### tooltip

`string`

#### Returns

`object`

##### from

> **from**: `Date` = `date`

##### spec

> **spec**: `object`

###### spec.data-tooltip

> **data-tooltip**: `string` = `tooltip`

###### spec.title

> **title**: `string` = `tooltip`

##### type

> **type**: `"tooltip"`
