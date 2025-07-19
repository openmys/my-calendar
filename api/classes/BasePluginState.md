[**@openmys/my-calendar v1.0.0**](../README.md)

***

[@openmys/my-calendar](../globals.md) / BasePluginState

# Class: BasePluginState\<T\>

Defined in: [src/core/plugin-state.ts:12](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/plugin-state.ts#L12)

기본 PluginState 구현
간단한 상태를 가진 플러그인을 위한 기본 구현

## Extends

- [`PluginState`](PluginState.md)\<`T`\>

## Type Parameters

### T

`T` = `any`

## Constructors

### Constructor

> **new BasePluginState**\<`T`\>(`value`): `BasePluginState`\<`T`\>

Defined in: [src/core/plugin-state.ts:13](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/plugin-state.ts#L13)

#### Parameters

##### value

`T`

#### Returns

`BasePluginState`\<`T`\>

#### Overrides

[`PluginState`](PluginState.md).[`constructor`](PluginState.md#constructor)

## Properties

### value

> **value**: `T`

Defined in: [src/types/index.ts:103](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/types/index.ts#L103)

#### Inherited from

[`PluginState`](PluginState.md).[`value`](PluginState.md#value)

## Methods

### apply()

> **apply**(`_transaction`): `BasePluginState`\<`T`\>

Defined in: [src/core/plugin-state.ts:17](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/plugin-state.ts#L17)

#### Parameters

##### \_transaction

[`Transaction`](../interfaces/Transaction.md)

#### Returns

`BasePluginState`\<`T`\>

#### Overrides

[`PluginState`](PluginState.md).[`apply`](PluginState.md#apply)

***

### toJSON()

> **toJSON**(): `T`

Defined in: [src/core/plugin-state.ts:22](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/plugin-state.ts#L22)

#### Returns

`T`

#### Overrides

[`PluginState`](PluginState.md).[`toJSON`](PluginState.md#tojson)

***

### fromJSON()

> `static` **fromJSON**\<`T`\>(`value`): `BasePluginState`\<`T`\>

Defined in: [src/core/plugin-state.ts:26](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/plugin-state.ts#L26)

#### Type Parameters

##### T

`T`

#### Parameters

##### value

`T`

#### Returns

`BasePluginState`\<`T`\>

#### Overrides

[`PluginState`](PluginState.md).[`fromJSON`](PluginState.md#fromjson)
