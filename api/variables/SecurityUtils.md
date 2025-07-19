[**@openmys/my-calendar v1.0.0**](../README.md)

***

[@openmys/my-calendar](../globals.md) / SecurityUtils

# Variable: SecurityUtils

> `const` **SecurityUtils**: `object`

Defined in: [src/plugins/security-plugin.ts:511](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/plugins/security-plugin.ts#L511)

보안 유틸리티 함수들

## Type declaration

### escapeHTML()

> **escapeHTML**(`str`): `string`

안전한 문자열 이스케이프

#### Parameters

##### str

`string`

#### Returns

`string`

### generateCSPHeader()

> **generateCSPHeader**(`options`): `string`

CSP 헤더 생성

#### Parameters

##### options

###### allowInlineScripts?

`boolean`

###### allowInlineStyles?

`boolean`

#### Returns

`string`

### normalizeInput()

> **normalizeInput**(`input`): `string`

입력값 정규화

#### Parameters

##### input

`string`

#### Returns

`string`
