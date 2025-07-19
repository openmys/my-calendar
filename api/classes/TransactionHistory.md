[**@openmys/my-calendar v1.0.0**](../README.md)

***

[@openmys/my-calendar](../globals.md) / TransactionHistory

# Class: TransactionHistory

Defined in: [src/core/transaction.ts:174](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/transaction.ts#L174)

트랜잭션 히스토리 관리

## Constructors

### Constructor

> **new TransactionHistory**(): `TransactionHistory`

#### Returns

`TransactionHistory`

## Methods

### add()

> **add**(`transaction`): `void`

Defined in: [src/core/transaction.ts:182](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/transaction.ts#L182)

트랜잭션 추가

#### Parameters

##### transaction

[`Transaction`](../interfaces/Transaction.md)

#### Returns

`void`

***

### clear()

> **clear**(): `void`

Defined in: [src/core/transaction.ts:224](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/transaction.ts#L224)

히스토리 초기화

#### Returns

`void`

***

### getInfo()

> **getInfo**(): `object`

Defined in: [src/core/transaction.ts:232](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/transaction.ts#L232)

현재 히스토리 정보

#### Returns

`object`

##### canRedo

> **canRedo**: `boolean`

##### canUndo

> **canUndo**: `boolean`

##### currentIndex

> **currentIndex**: `number`

##### total

> **total**: `number`

***

### redo()

> **redo**(): `null` \| [`Transaction`](../interfaces/Transaction.md)\<`any`\>

Defined in: [src/core/transaction.ts:212](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/transaction.ts#L212)

다시 실행 (Redo)

#### Returns

`null` \| [`Transaction`](../interfaces/Transaction.md)\<`any`\>

***

### undo()

> **undo**(): `null` \| [`Transaction`](../interfaces/Transaction.md)\<`any`\>

Defined in: [src/core/transaction.ts:200](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/transaction.ts#L200)

되돌리기 (Undo)

#### Returns

`null` \| [`Transaction`](../interfaces/Transaction.md)\<`any`\>
