[**@openmys/my-calendar v1.0.0**](../README.md)

***

[@openmys/my-calendar](../globals.md) / HTMLSanitizer

# Class: HTMLSanitizer

Defined in: [src/plugins/security-plugin.ts:282](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/plugins/security-plugin.ts#L282)

HTML Sanitizer 유틸리티

## Constructors

### Constructor

> **new HTMLSanitizer**(`allowedTags`, `allowedAttributes`): `HTMLSanitizer`

Defined in: [src/plugins/security-plugin.ts:286](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/plugins/security-plugin.ts#L286)

#### Parameters

##### allowedTags

`string`[] = `[]`

##### allowedAttributes

`string`[] = `[]`

#### Returns

`HTMLSanitizer`

## Methods

### sanitize()

> **sanitize**(`html`): `string`

Defined in: [src/plugins/security-plugin.ts:297](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/plugins/security-plugin.ts#L297)

#### Parameters

##### html

`string`

#### Returns

`string`
