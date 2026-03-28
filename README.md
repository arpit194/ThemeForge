# ThemeForge

A lightweight, type-safe design token library for React. Define your brand once and get colors, spacing, radius, shadows, and typography as scoped CSS custom properties throughout your app.

## Features

- Generates 11-shade color scales (50–950) from a single base hex
- Scoped CSS variables — supports multiple `ThemeProvider` instances on the same page
- Tokens: colors, spacing, radius, shadows, typography (primitives + semantic text styles)
- Extend any token type with full TypeScript support via module augmentation
- Zero runtime dependencies
- React 18 and 19

## Installation

```bash
npm install themeforge
```

## Basic usage

```tsx
import { ThemeProvider } from 'themeforge'

<ThemeProvider
  theme={{ primary: '#E11D48', secondary: '#7C3AED', neutral: '#64748B' }}
>
  <App />
</ThemeProvider>
```

All props are optional — unspecified tokens fall back to defaults.

## CSS variables

Every token is injected as a scoped CSS custom property:

```css
--tf-color-primary-500
--tf-spacing-md
--tf-radius-lg
--tf-shadow-md
--tf-font-size-xl
--tf-text-h1-size
--tf-text-body-weight
```

Use them directly in CSS, Tailwind's `theme()`, or inline styles.

## useTheme

Access resolved token values anywhere in the tree:

```tsx
import { useTheme } from 'themeforge'

function Card() {
  const { colors, spacing, radius, shadows, typography } = useTheme()

  return (
    <div style={{
      backgroundColor: colors.primary.shades[50],
      padding: spacing.md,
      borderRadius: radius.lg,
      boxShadow: shadows.md, // resolved CSS string
    }}>
      ...
    </div>
  )
}
```

## Tokens

### Colors

Three built-in scales, each with 11 shades (50–950):

| Key       | Default          |
|-----------|------------------|
| primary   | `#3B82F6` blue   |
| secondary | `#8B5CF6` violet |
| neutral   | `#6B7280` gray   |

### Spacing

Scale from `3xs` (0.125rem) to `10xl` (16rem).

### Radius

Scale from `none` (0) to `full` (9999px), plus `xs` through `3xl`.

### Shadows

Eight levels: `none`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `inner`. Shadow color is derived from the neutral scale.

```tsx
<ThemeProvider shadows={{
  md: [{ y: '2xs', blur: 'sm', colorShade: 800, opacity: 0.2 }]
}}>
```

### Typography

Primitive tokens (`fontFamilies`, `fontSizes`, `fontWeights`, `lineHeights`, `letterSpacing`) plus semantic text styles (`h1`–`h6`, `body-lg`, `body`, `body-sm`, `label`, `caption`, `code`).

Text style overrides are per-property — you only specify what you want to change:

```tsx
<ThemeProvider typography={{
  fontFamilies: { primary: 'Inter, sans-serif' },
  textStyles: { h1: { weight: 'bold', letterSpacing: 'tight' } },
}}>
```

## Extending token types

Add custom keys with full TypeScript support via module augmentation:

```ts
declare module 'themeforge' {
  interface CustomColorKeys   { brand: string }
  interface CustomShadowKeys  { glow: ShadowDefinition }
  interface CustomTextStyleKeys { hero: TextStyle }
}
```

Then pass them to the provider as normal — autocomplete and type checking work automatically.

## Scoped themes

`ThemeProvider` can be nested for component-level theming:

```tsx
<ThemeProvider theme={{ primary: '#E11D48' }}>
  <App />
  <ThemeProvider theme={{ primary: '#7C3AED' }}>
    <Sidebar />
  </ThemeProvider>
</ThemeProvider>
```

Each instance generates its own scoped CSS variables without leaking into siblings.

## Custom shade generator

Replace the built-in HSL shade generator with your own:

```tsx
import { ThemeProvider } from 'themeforge'
import { generateShades } from 'your-oklch-library'

<ThemeProvider generateShades={generateShades}>
```

## Standalone usage

`generateShades` is exported for use outside React:

```ts
import { generateShades } from 'themeforge'

const { shades, anchor } = generateShades('#E11D48')
// shades: { 50: '#fff0f3', ..., 950: '#3b000d' }
// anchor: 600  ← shade where the original hex was placed
```
