[**@openmys/my-calendar v1.0.0**](../../../../README.md)

***

[@openmys/my-calendar](../../../../globals.md) / [DecorationBuilders](../README.md) / conditionalHighlight

# Function: conditionalHighlight()

> **conditionalHighlight**(`condition`, `className`): (`_state`, `_pluginState`) => [`DecorationSet`](../../../../classes/DecorationSet.md)

Defined in: [src/utils/plugin-builder.ts:388](https://github.com/openmys/my-calendar/blob/96ebce4306bfb6a4ab4c4297a9b422c56933c5da/src/utils/plugin-builder.ts#L388)

## Parameters

### condition

(`date`, `state`, `pluginState`) => `boolean`

### className

`string` = `'conditional-highlight'`

## Returns

> (`_state`, `_pluginState`): [`DecorationSet`](../../../../classes/DecorationSet.md)

### Parameters

#### \_state

[`CalendarState`](../../../../interfaces/CalendarState.md)

#### \_pluginState

`Record`\<`string`, `unknown`\>

### Returns

[`DecorationSet`](../../../../classes/DecorationSet.md)
