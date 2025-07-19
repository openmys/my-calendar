[**@openmys/my-calendar v1.0.0**](../README.md)

***

[@openmys/my-calendar](../globals.md) / DecorationSet

# Class: DecorationSet

Defined in: [src/core/decoration.ts:12](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/decoration.ts#L12)

DecorationSet 클래스
데코레이션 컬렉션을 관리하고 조작하는 클래스

## Constructors

### Constructor

> **new DecorationSet**(`decorations`): `DecorationSet`

Defined in: [src/core/decoration.ts:13](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/decoration.ts#L13)

#### Parameters

##### decorations

[`Decoration`](../interfaces/Decoration.md)[] = `[]`

#### Returns

`DecorationSet`

## Properties

### decorations

> **decorations**: [`Decoration`](../interfaces/Decoration.md)[] = `[]`

Defined in: [src/core/decoration.ts:13](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/decoration.ts#L13)

## Accessors

### isEmpty

#### Get Signature

> **get** **isEmpty**(): `boolean`

Defined in: [src/core/decoration.ts:95](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/decoration.ts#L95)

빈 데코레이션 셋인지 확인

##### Returns

`boolean`

***

### size

#### Get Signature

> **get** **size**(): `number`

Defined in: [src/core/decoration.ts:88](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/decoration.ts#L88)

데코레이션 수

##### Returns

`number`

## Methods

### \[iterator\]()

> **\[iterator\]**(): `Iterator`\<[`Decoration`](../interfaces/Decoration.md)\>

Defined in: [src/core/decoration.ts:133](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/decoration.ts#L133)

이터레이터 지원

#### Returns

`Iterator`\<[`Decoration`](../interfaces/Decoration.md)\>

***

### add()

> **add**(`decoration`): `DecorationSet`

Defined in: [src/core/decoration.ts:46](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/decoration.ts#L46)

데코레이션 추가

#### Parameters

##### decoration

[`Decoration`](../interfaces/Decoration.md)

#### Returns

`DecorationSet`

***

### addAll()

> **addAll**(`decorations`): `DecorationSet`

Defined in: [src/core/decoration.ts:53](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/decoration.ts#L53)

여러 데코레이션 추가

#### Parameters

##### decorations

[`Decoration`](../interfaces/Decoration.md)[]

#### Returns

`DecorationSet`

***

### clear()

> **clear**(): `DecorationSet`

Defined in: [src/core/decoration.ts:81](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/decoration.ts#L81)

모든 데코레이션 제거

#### Returns

`DecorationSet`

***

### filterByType()

> **filterByType**(`type`): `DecorationSet`

Defined in: [src/core/decoration.ts:109](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/decoration.ts#L109)

데코레이션 타입별 필터링

#### Parameters

##### type

[`DecorationType`](../type-aliases/DecorationType.md)

#### Returns

`DecorationSet`

***

### find()

> **find**(`date`): [`Decoration`](../interfaces/Decoration.md)[]

Defined in: [src/core/decoration.ts:18](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/decoration.ts#L18)

특정 날짜의 데코레이션 찾기

#### Parameters

##### date

`Date`

#### Returns

[`Decoration`](../interfaces/Decoration.md)[]

***

### findInRange()

> **findInRange**(`start`, `end`): [`Decoration`](../interfaces/Decoration.md)[]

Defined in: [src/core/decoration.ts:32](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/decoration.ts#L32)

날짜 범위의 데코레이션 찾기

#### Parameters

##### start

`Date`

##### end

`Date`

#### Returns

[`Decoration`](../interfaces/Decoration.md)[]

***

### has()

> **has**(`decoration`): `boolean`

Defined in: [src/core/decoration.ts:102](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/decoration.ts#L102)

데코레이션 존재 여부 확인

#### Parameters

##### decoration

[`Decoration`](../interfaces/Decoration.md)

#### Returns

`boolean`

***

### remove()

> **remove**(`filter`): `DecorationSet`

Defined in: [src/core/decoration.ts:60](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/decoration.ts#L60)

데코레이션 제거

#### Parameters

##### filter

(`decoration`) => `boolean`

#### Returns

`DecorationSet`

***

### replace()

> **replace**(`oldDecoration`, `newDecoration`): `DecorationSet`

Defined in: [src/core/decoration.ts:67](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/decoration.ts#L67)

데코레이션 교체

#### Parameters

##### oldDecoration

[`Decoration`](../interfaces/Decoration.md)

##### newDecoration

[`Decoration`](../interfaces/Decoration.md)

#### Returns

`DecorationSet`

***

### sort()

> **sort**(): `DecorationSet`

Defined in: [src/core/decoration.ts:116](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/core/decoration.ts#L116)

데코레이션 정렬 (날짜 순)

#### Returns

`DecorationSet`
