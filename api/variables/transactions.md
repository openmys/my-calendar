[**@openmys/my-calendar v1.0.0**](../README.md)

***

[@openmys/my-calendar](../globals.md) / transactions

# Variable: transactions

> `const` **transactions**: `object`

Defined in: [src/core/transaction.ts:71](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/transaction.ts#L71)

일반적인 트랜잭션 타입들을 위한 헬퍼 함수들

## Type declaration

### addEvent()

> **addEvent**: (`event`) => [`Transaction`](../interfaces/Transaction.md)\<`any`\>

#### Parameters

##### event

`any`

#### Returns

[`Transaction`](../interfaces/Transaction.md)\<`any`\>

### changeMonth()

> **changeMonth**: (`direction`) => [`Transaction`](../interfaces/Transaction.md)\<`any`\>

#### Parameters

##### direction

`"next"` | `"previous"`

#### Returns

[`Transaction`](../interfaces/Transaction.md)\<`any`\>

### changeView()

> **changeView**: (`viewType`) => [`Transaction`](../interfaces/Transaction.md)\<`any`\>

#### Parameters

##### viewType

`string`

#### Returns

[`Transaction`](../interfaces/Transaction.md)\<`any`\>

### clearSelection()

> **clearSelection**: () => [`Transaction`](../interfaces/Transaction.md)\<`any`\>

#### Returns

[`Transaction`](../interfaces/Transaction.md)\<`any`\>

### custom()

> **custom**: (`type`, `payload`, `meta?`) => [`Transaction`](../interfaces/Transaction.md)\<`any`\>

#### Parameters

##### type

`string`

##### payload

`any`

##### meta?

`Map`\<`string`, `any`\>

#### Returns

[`Transaction`](../interfaces/Transaction.md)\<`any`\>

### deleteEvent()

> **deleteEvent**: (`eventId`) => [`Transaction`](../interfaces/Transaction.md)\<`any`\>

#### Parameters

##### eventId

`string`

#### Returns

[`Transaction`](../interfaces/Transaction.md)\<`any`\>

### disablePlugin()

> **disablePlugin**: (`pluginId`) => [`Transaction`](../interfaces/Transaction.md)\<`any`\>

#### Parameters

##### pluginId

`string`

#### Returns

[`Transaction`](../interfaces/Transaction.md)\<`any`\>

### enablePlugin()

> **enablePlugin**: (`pluginId`) => [`Transaction`](../interfaces/Transaction.md)\<`any`\>

#### Parameters

##### pluginId

`string`

#### Returns

[`Transaction`](../interfaces/Transaction.md)\<`any`\>

### selectDate()

> **selectDate**: (`date`) => [`Transaction`](../interfaces/Transaction.md)\<`any`\>

#### Parameters

##### date

`Date`

#### Returns

[`Transaction`](../interfaces/Transaction.md)\<`any`\>

### selectRange()

> **selectRange**: (`start`, `end`) => [`Transaction`](../interfaces/Transaction.md)\<`any`\>

#### Parameters

##### start

`Date`

##### end

`Date`

#### Returns

[`Transaction`](../interfaces/Transaction.md)\<`any`\>

### updateEvent()

> **updateEvent**: (`eventId`, `updates`) => [`Transaction`](../interfaces/Transaction.md)\<`any`\>

#### Parameters

##### eventId

`string`

##### updates

`any`

#### Returns

[`Transaction`](../interfaces/Transaction.md)\<`any`\>
