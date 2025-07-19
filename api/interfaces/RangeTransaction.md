[**@openmys/my-calendar v1.0.0**](../README.md)

***

[@openmys/my-calendar](../globals.md) / RangeTransaction

# Interface: RangeTransaction

Defined in: [src/types/index.ts:94](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/types/index.ts#L94)

## Extends

- [`Transaction`](Transaction.md)\<\{ `end`: `Date`; `start`: `Date`; \}\>

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

#### end

> **end**: `Date`

#### start

> **start**: `Date`

#### Inherited from

[`Transaction`](Transaction.md).[`payload`](Transaction.md#payload)

***

### type

> **type**: `"SELECT_RANGE"`

Defined in: [src/types/index.ts:95](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/types/index.ts#L95)

#### Overrides

[`Transaction`](Transaction.md).[`type`](Transaction.md#type)
