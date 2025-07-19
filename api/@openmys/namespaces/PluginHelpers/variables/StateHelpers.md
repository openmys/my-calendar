[**@openmys/my-calendar v1.0.0**](../../../../README.md)

***

[@openmys/my-calendar](../../../../globals.md) / [PluginHelpers](../README.md) / StateHelpers

# Variable: StateHelpers

> `const` **StateHelpers**: `object`

Defined in: [src/utils/plugin-factory.ts:479](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/utils/plugin-factory.ts#L479)

상태 업데이트 헬퍼

## Type declaration

### addToArray()

> **addToArray**: (`key`) => (`state`, `item`) => `object`

#### Parameters

##### key

`string`

#### Returns

> (`state`, `item`): `object`

##### Parameters

###### state

`Record`\<`string`, `unknown`\>

###### item

`unknown`

##### Returns

`object`

### removeFromArray()

> **removeFromArray**: (`key`, `predicate`) => (`state`) => `object`

#### Parameters

##### key

`string`

##### predicate

(`item`) => `boolean`

#### Returns

> (`state`): `object`

##### Parameters

###### state

`Record`\<`string`, `unknown`\>

##### Returns

`object`

### toggleBoolean()

> **toggleBoolean**: (`key`) => (`state`) => `object`

#### Parameters

##### key

`string`

#### Returns

> (`state`): `object`

##### Parameters

###### state

`Record`\<`string`, `unknown`\>

##### Returns

`object`

### updateObject()

> **updateObject**: (`key`) => (`state`, `updates`) => `object`

#### Parameters

##### key

`string`

#### Returns

> (`state`, `updates`): `object`

##### Parameters

###### state

`Record`\<`string`, `unknown`\>

###### updates

`Record`\<`string`, `unknown`\>

##### Returns

`object`
