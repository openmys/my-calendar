[**@openmys/my-calendar v1.0.0**](../README.md)

***

[@openmys/my-calendar](../globals.md) / DateTransaction

# Interface: DateTransaction

Defined in: [src/types/index.ts:86](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/types/index.ts#L86)

## Extends

- [`Transaction`](Transaction.md)\<\{ `date`: `Date`; \}\>

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

#### date

> **date**: `Date`

#### Inherited from

[`Transaction`](Transaction.md).[`payload`](Transaction.md#payload)

***

### type

> **type**: `"SELECT_DATE"`

Defined in: [src/types/index.ts:87](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/types/index.ts#L87)

#### Overrides

[`Transaction`](Transaction.md).[`type`](Transaction.md#type)
