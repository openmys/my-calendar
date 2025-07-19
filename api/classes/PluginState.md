[**@openmys/my-calendar v1.0.0**](../README.md)

***

[@openmys/my-calendar](../globals.md) / PluginState

# Class: `abstract` PluginState\<T\>

Defined in: [src/types/index.ts:102](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/types/index.ts#L102)

## Extended by

- [`BasePluginState`](BasePluginState.md)

## Type Parameters

### T

`T` = `any`

## Constructors

### Constructor

> **new PluginState**\<`T`\>(`value`): `PluginState`\<`T`\>

Defined in: [src/types/index.ts:103](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/types/index.ts#L103)

#### Parameters

##### value

`T`

#### Returns

`PluginState`\<`T`\>

## Properties

### value

> **value**: `T`

Defined in: [src/types/index.ts:103](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/types/index.ts#L103)

## Methods

### apply()

> `abstract` **apply**(`transaction`): `PluginState`\<`T`\>

Defined in: [src/types/index.ts:105](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/types/index.ts#L105)

#### Parameters

##### transaction

[`Transaction`](../interfaces/Transaction.md)

#### Returns

`PluginState`\<`T`\>

***

### toJSON()

> `abstract` **toJSON**(): `any`

Defined in: [src/types/index.ts:106](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/types/index.ts#L106)

#### Returns

`any`

***

### fromJSON()

> `static` **fromJSON**(`_value`): `PluginState`\<`any`\>

Defined in: [src/types/index.ts:107](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/types/index.ts#L107)

#### Parameters

##### \_value

`any`

#### Returns

`PluginState`\<`any`\>
