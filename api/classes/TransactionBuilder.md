[**@openmys/my-calendar v1.0.0**](../README.md)

***

[@openmys/my-calendar](../globals.md) / TransactionBuilder

# Class: TransactionBuilder

Defined in: [src/core/transaction.ts:11](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/transaction.ts#L11)

Transaction 생성을 위한 헬퍼 함수들

## Constructors

### Constructor

> **new TransactionBuilder**(`type`): `TransactionBuilder`

Defined in: [src/core/transaction.ts:14](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/transaction.ts#L14)

#### Parameters

##### type

`string`

#### Returns

`TransactionBuilder`

## Methods

### addMeta()

> **addMeta**(`key`, `value`): `TransactionBuilder`

Defined in: [src/core/transaction.ts:36](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/transaction.ts#L36)

메타데이터 추가

#### Parameters

##### key

`string`

##### value

`any`

#### Returns

`TransactionBuilder`

***

### build()

> **build**(): [`Transaction`](../interfaces/Transaction.md)

Defined in: [src/core/transaction.ts:44](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/transaction.ts#L44)

트랜잭션 빌드

#### Returns

[`Transaction`](../interfaces/Transaction.md)

***

### setPayload()

> **setPayload**(`payload`): `TransactionBuilder`

Defined in: [src/core/transaction.ts:28](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/transaction.ts#L28)

페이로드 설정

#### Parameters

##### payload

`any`

#### Returns

`TransactionBuilder`
