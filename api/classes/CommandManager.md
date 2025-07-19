[**@openmys/my-calendar v1.0.0**](../README.md)

***

[@openmys/my-calendar](../globals.md) / CommandManager

# Class: CommandManager

Defined in: [src/core/command.ts:152](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/command.ts#L152)

Command Manager
커맨드의 등록, 실행, 관리를 담당

## Constructors

### Constructor

> **new CommandManager**(): `CommandManager`

Defined in: [src/core/command.ts:155](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/command.ts#L155)

#### Returns

`CommandManager`

## Methods

### clear()

> **clear**(): `void`

Defined in: [src/core/command.ts:235](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/command.ts#L235)

모든 커맨드 초기화

#### Returns

`void`

***

### executeCommand()

> **executeCommand**(`name`, `state`, `dispatch?`, ...`args?`): `boolean`

Defined in: [src/core/command.ts:185](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/command.ts#L185)

커맨드 실행

#### Parameters

##### name

`string`

##### state

[`CalendarState`](../interfaces/CalendarState.md)

##### dispatch?

(`transaction`) => `void`

##### args?

...`unknown`[]

#### Returns

`boolean`

***

### getCommandNames()

> **getCommandNames**(): `string`[]

Defined in: [src/core/command.ts:221](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/command.ts#L221)

등록된 커맨드 목록

#### Returns

`string`[]

***

### hasCommand()

> **hasCommand**(`name`): `boolean`

Defined in: [src/core/command.ts:228](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/command.ts#L228)

커맨드 존재 여부 확인

#### Parameters

##### name

`string`

#### Returns

`boolean`

***

### registerCommand()

> **registerCommand**(`name`, `command`): `void`

Defined in: [src/core/command.ts:162](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/command.ts#L162)

커맨드 등록

#### Parameters

##### name

`string`

##### command

[`Command`](../type-aliases/Command.md) | (...`args`) => [`Command`](../type-aliases/Command.md)

#### Returns

`void`

***

### registerCommands()

> **registerCommands**(`commandMap`): `void`

Defined in: [src/core/command.ts:169](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/command.ts#L169)

여러 커맨드 일괄 등록

#### Parameters

##### commandMap

[`CommandMap`](../interfaces/CommandMap.md)

#### Returns

`void`

***

### unregisterCommand()

> **unregisterCommand**(`name`): `boolean`

Defined in: [src/core/command.ts:178](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/command.ts#L178)

커맨드 제거

#### Parameters

##### name

`string`

#### Returns

`boolean`
