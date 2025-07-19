[**@openmys/my-calendar v1.0.0**](../README.md)

***

[@openmys/my-calendar](../globals.md) / CommandComposer

# Class: CommandComposer

Defined in: [src/core/command.ts:301](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/command.ts#L301)

Command Composer
여러 커맨드를 조합하여 복합 커맨드 생성

## Constructors

### Constructor

> **new CommandComposer**(): `CommandComposer`

#### Returns

`CommandComposer`

## Methods

### conditional()

> `static` **conditional**(`condition`, `trueCommand`, `falseCommand?`): [`Command`](../type-aliases/Command.md)

Defined in: [src/core/command.ts:330](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/command.ts#L330)

조건부 실행 커맨드 생성

#### Parameters

##### condition

(`state`) => `boolean`

##### trueCommand

[`Command`](../type-aliases/Command.md)

##### falseCommand?

[`Command`](../type-aliases/Command.md)

#### Returns

[`Command`](../type-aliases/Command.md)

***

### parallel()

> `static` **parallel**(...`commands`): [`Command`](../type-aliases/Command.md)

Defined in: [src/core/command.ts:381](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/command.ts#L381)

병렬 실행 커맨드 생성 (모두 성공해야 성공)

#### Parameters

##### commands

...[`Command`](../type-aliases/Command.md)[]

#### Returns

[`Command`](../type-aliases/Command.md)

***

### retry()

> `static` **retry**(`command`, `maxAttempts`, `delay`): [`Command`](../type-aliases/Command.md)

Defined in: [src/core/command.ts:353](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/command.ts#L353)

재시도 커맨드 생성

#### Parameters

##### command

[`Command`](../type-aliases/Command.md)

##### maxAttempts

`number` = `3`

##### delay

`number` = `0`

#### Returns

[`Command`](../type-aliases/Command.md)

***

### sequence()

> `static` **sequence**(...`commands`): [`Command`](../type-aliases/Command.md)

Defined in: [src/core/command.ts:305](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/command.ts#L305)

순차 실행 커맨드 생성

#### Parameters

##### commands

...[`Command`](../type-aliases/Command.md)[]

#### Returns

[`Command`](../type-aliases/Command.md)
