[**@openmys/my-calendar v1.0.0**](../README.md)

***

[@openmys/my-calendar](../globals.md) / I18nUtils

# Variable: I18nUtils

> `const` **I18nUtils**: `object`

Defined in: [src/plugins/i18n-plugin.ts:682](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/plugins/i18n-plugin.ts#L682)

I18n 유틸리티 함수들

## Type declaration

### detectLocale()

> **detectLocale**(): `string`

브라우저의 기본 로케일 감지

#### Returns

`string`

### detectTimeZone()

> **detectTimeZone**(): `string`

시간대 감지

#### Returns

`string`

### getFirstDayOfWeek()

> **getFirstDayOfWeek**(`locale`): `number`

로케일별 첫 번째 요일 가져오기

#### Parameters

##### locale

`string`

#### Returns

`number`

### isRTLLanguage()

> **isRTLLanguage**(`locale`): `boolean`

RTL 언어 감지

#### Parameters

##### locale

`string`

#### Returns

`boolean`
