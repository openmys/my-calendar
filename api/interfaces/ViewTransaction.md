[**@openmys/my-calendar v1.0.0**](../README.md)

***

[@openmys/my-calendar](../globals.md) / ViewTransaction

# Interface: ViewTransaction

Defined in: [src/types/index.ts:90](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/types/index.ts#L90)

## Extends

- [`Transaction`](Transaction.md)\<\{ `viewType`: `string`; \}\>

## Properties

### meta

> **meta**: `Map`\<`string`, `unknown`\>

Defined in: [src/types/index.ts:82](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/types/index.ts#L82)

#### Inherited from

[`Transaction`](Transaction.md).[`meta`](Transaction.md#meta)

***

### payload

> **payload**: `object`

Defined in: [src/types/index.ts:81](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/types/index.ts#L81)

#### viewType

> **viewType**: `string`

#### Inherited from

[`Transaction`](Transaction.md).[`payload`](Transaction.md#payload)

***

### type

> **type**: `"CHANGE_VIEW"`

Defined in: [src/types/index.ts:91](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/types/index.ts#L91)

#### Overrides

[`Transaction`](Transaction.md).[`type`](Transaction.md#type)
