[**@openmys/my-calendar v1.0.0**](../README.md)

***

[@openmys/my-calendar](../globals.md) / CommandHistory

# Class: CommandHistory

Defined in: [src/core/command.ts:401](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/command.ts#L401)

Command History
실행된 커맨드의 히스토리 관리

## Constructors

### Constructor

> **new CommandHistory**(): `CommandHistory`

#### Returns

`CommandHistory`

## Methods

### clear()

> **clear**(): `void`

Defined in: [src/core/command.ts:463](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/command.ts#L463)

히스토리 초기화

#### Returns

`void`

***

### getHistory()

> **getHistory**(`filter?`): `object`[]

Defined in: [src/core/command.ts:431](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/command.ts#L431)

히스토리 조회

#### Parameters

##### filter?

###### limit?

`number`

###### name?

`string`

###### success?

`boolean`

#### Returns

`object`[]

***

### getLastCommand()

> **getLastCommand**(): `null` \| \{ `args`: `unknown`[]; `name`: `string`; `success`: `boolean`; `timestamp`: `number`; \}

Defined in: [src/core/command.ts:470](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/command.ts#L470)

최근 실행된 커맨드

#### Returns

`null` \| \{ `args`: `unknown`[]; `name`: `string`; `success`: `boolean`; `timestamp`: `number`; \}

***

### record()

> **record**(`name`, `args`, `success`): `void`

Defined in: [src/core/command.ts:414](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/command.ts#L414)

커맨드 실행 기록 추가

#### Parameters

##### name

`string`

##### args

`any`[]

##### success

`boolean`

#### Returns

`void`
