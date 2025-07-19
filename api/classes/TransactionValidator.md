[**@openmys/my-calendar v1.0.0**](../README.md)

***

[@openmys/my-calendar](../globals.md) / TransactionValidator

# Class: TransactionValidator

Defined in: [src/core/transaction.ts:97](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/transaction.ts#L97)

트랜잭션 유효성 검증

## Constructors

### Constructor

> **new TransactionValidator**(): `TransactionValidator`

#### Returns

`TransactionValidator`

## Methods

### validate()

> `static` **validate**(`transaction`): `boolean`

Defined in: [src/core/transaction.ts:103](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/transaction.ts#L103)

트랜잭션 기본 구조 검증

#### Parameters

##### transaction

[`Transaction`](../interfaces/Transaction.md)

#### Returns

`boolean`

***

### validateDateTransaction()

> `static` **validateDateTransaction**(`transaction`): `boolean`

Defined in: [src/core/transaction.ts:138](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/transaction.ts#L138)

날짜 관련 트랜잭션 검증

#### Parameters

##### transaction

[`Transaction`](../interfaces/Transaction.md)

#### Returns

`boolean`

***

### validateTimestamp()

> `static` **validateTimestamp**(`transaction`): `boolean`

Defined in: [src/core/transaction.ts:127](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/transaction.ts#L127)

타임스탬프 검증

#### Parameters

##### transaction

[`Transaction`](../interfaces/Transaction.md)

#### Returns

`boolean`
