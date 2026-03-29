# ThemeForge

A lightweight, type-safe design token library for React. Define your brand colors and get a complete token system — primitive color scales, spacing, radius, shadows, typography, and semantic color tokens — all emitted as scoped CSS custom properties.

## Features

- Generates 11-shade color scales (50–950) from a single base hex
- Scoped CSS variables — supports multiple `ThemeProvider` instances on the same page
- Primitive tokens: colors, spacing, radius, shadows, typography (primitives + text styles)
- Semantic color tokens: named roles (`bg-primary`, `text-on-dark`, `border-error`) resolved against the active theme at render time
- Extend any token type with full TypeScript support via module augmentation
- Zero runtime dependencies
- React 18 and 19

## Installation

```bash
npm install @arpit194/themeforge
```

## Basic usage

```tsx
import { ThemeProvider } from '@arpit194/themeforge'

<ThemeProvider
  theme={{ primary: '#7C3AED', secondary: '#F59E0B' }}
>
  <App />
</ThemeProvider>
```

All props are optional — unspecified tokens fall back to defaults.

## CSS variables

Every token is injected as a scoped CSS custom property:

```css
/* Primitive colors */
--tf-color-primary-500
--tf-color-neutral-100

/* Semantic colors */
--tf-color-bg-primary
--tf-color-text-on-dark
--tf-color-border-error

/* Other tokens */
--tf-spacing-md
--tf-radius-lg
--tf-shadow-md
--tf-font-size-xl
--tf-text-h1-size
```

## useTheme

Access resolved token values anywhere in the tree:

```tsx
import { useTheme } from '@arpit194/themeforge'

function Card() {
  const { colors, spacing, radius, shadows, typography, semantic } = useTheme()

  return (
    <div style={{
      backgroundColor: colors.primary.shades[500],
      padding: spacing.md,
      borderRadius: radius.lg,
      boxShadow: shadows.md,
    }}>
      ...
    </div>
  )
}
```

## Tokens

### Colors

Seven built-in primitive scales, each with 11 shades (50–950):

| Key | Default |
|---|---|
| `primary` | `#7C3AED` violet |
| `secondary` | `#F59E0B` amber |
| `neutral` | `#6B7280` gray |
| `success` | `#22C55E` green |
| `warning` | `#EAB308` yellow |
| `error` | `#EF4444` red |
| `info` | `#3B82F6` blue |

### Semantic colors

Semantic tokens map named roles to primitive shades — automatically updated when the theme changes. Use these in component styles instead of primitive vars.

#### Background
- `bg-page` · `bg-subtle` · `bg-surface` · `bg-surface-raised` — layout surfaces
- `bg-primary` · `bg-primary-hover` · `bg-primary-active` · `bg-primary-disabled` · `bg-primary-selected` · `bg-primary-subtle`
- Same pattern for `bg-secondary`
- `bg-success` · `bg-success-subtle` · `bg-warning` · `bg-warning-subtle` · `bg-error` · `bg-error-hover` · `bg-error-active` · `bg-error-subtle` · `bg-info` · `bg-info-subtle`

#### Text
- `text-primary` · `text-secondary` · `text-disabled` · `text-inverse` · `text-placeholder`
- `text-link` · `text-link-hover`
- `text-on-dark` — use on saturated/dark backgrounds (e.g. `bg-primary`, `bg-error`)
- `text-on-light` — use on light tinted backgrounds (e.g. `bg-primary-subtle`, `bg-error-subtle`)
- `text-success` · `text-warning` · `text-error` · `text-info`

#### Icon
- `icon-primary` · `icon-secondary` · `icon-disabled` · `icon-inverse`
- `icon-on-dark` · `icon-on-light`
- `icon-success` · `icon-warning` · `icon-error` · `icon-info`

#### Border
- `border-default` · `border-subtle` · `border-strong`
- `border-primary` · `border-primary-focus` · `border-primary-disabled`
- Same pattern for `border-secondary`
- `border-success` · `border-warning` · `border-error` · `border-info`

Override any semantic token by passing a `{ scale, shade }` ref:

```tsx
<ThemeProvider
  semantic={{
    'bg-primary': { scale: 'primary', shade: 600 },
  }}
>
```

### Spacing

Scale from `3xs` (0.125rem / 2px) to `10xl` (16rem / 256px). CSS: `--tf-spacing-md`

### Radius

`none` · `xs` · `sm` · `md` · `lg` · `xl` · `2xl` · `3xl` · `full`. CSS: `--tf-radius-lg`

### Shadows

`none` · `xs` · `sm` · `md` · `lg` · `xl` · `2xl` · `inner`. Defined as `ShadowLayer[]` arrays — each layer references spacing tokens for spatial values and the neutral scale for color:

```tsx
<ThemeProvider
  shadows={{
    md: [{ y: '2xs', blur: 'sm', colorShade: 800, opacity: 0.2 }],
  }}
>
```

### Typography

Primitive tokens (`fontFamilies`, `fontSizes`, `fontWeights`, `lineHeights`, `letterSpacing`) plus semantic text styles (`h1`–`h6`, `body-lg`, `body`, `body-sm`, `label`, `caption`, `code`).

Text style overrides are per-property — only specify what you want to change:

```tsx
<ThemeProvider typography={{
  fontFamilies: { primary: 'Inter, sans-serif' },
  textStyles: { h1: { weight: 'bold', letterSpacing: 'tight' } },
}}>
```

## Module augmentation

Add custom keys to any token category with full TypeScript support:

```ts
import type { ShadowDefinition, TextStyle, SemanticColorRef } from '@arpit194/themeforge'

declare module '@arpit194/themeforge' {
  interface CustomColorKeys    { brand: string }
  interface CustomShadowKeys   { glow: ShadowDefinition }
  interface CustomSpacingKeys  { section: string }
  interface CustomTextStyleKeys { hero: TextStyle }
  interface CustomSemanticKeys  { 'bg-brand': SemanticColorRef }
}

<ThemeProvider
  theme={{ brand: '#FF6B35' }}
  shadows={{ glow: [{ y: '3xs', blur: 'md', colorShade: 400, opacity: 0.4 }] }}
  spacing={{ section: '7rem' }}
  typography={{ textStyles: { hero: { size: '7xl', weight: 'bold' } } }}
  semantic={{ 'bg-brand': { scale: 'brand', shade: 500 } }}
>
```

## Scoped themes

Nest `ThemeProvider` for component-level theming:

```tsx
<ThemeProvider theme={{ primary: '#7C3AED' }}>
  <App />
  <ThemeProvider theme={{ primary: '#E11D48' }}>
    <Sidebar />
  </ThemeProvider>
</ThemeProvider>
```

Each instance generates its own scoped CSS variables without leaking into siblings.

## Custom shade generator

Replace the built-in shade generator with your own:

```tsx
import { ThemeProvider } from '@arpit194/themeforge'
import { generateShades } from 'your-oklch-library'

<ThemeProvider generateShades={generateShades}>
```

`generateShades` is also exported for standalone use:

```ts
import { generateShades } from '@arpit194/themeforge'

const { shades, anchor } = generateShades('#E11D48')
// shades: { 50: '#fff0f3', ..., 950: '#3b000d' }
// anchor: 600  ← shade where the original hex was placed
```

## MCP server

A Claude MCP server is available so Claude can work with ThemeForge without needing to look things up:

```bash
npm install -g @arpit194/themeforge-mcp
```

Add `.mcp.json` at your project root:

```json
{
  "mcpServers": {
    "themeforge": {
      "type": "stdio",
      "command": "themeforge-mcp"
    }
  }
}
```

### Available tools

| Tool | Description |
|---|---|
| `list_tokens` | List all token keys and defaults for a category |
| `list_semantic_by_group` | Filter semantic tokens by group (`bg`, `text`, `icon`, `border`) |
| `get_css_var` | Get the CSS variable name for any token |
| `suggest_tokens` | Get the right semantic tokens for a component and state |
| `get_usage_example` | Get a code example for a common pattern |
| `scan_augmentations` | Scan a project for `declare module` blocks to discover custom tokens |

## Publishing

```bash
# Library
npm run release:patch   # or release:minor / release:major

# MCP server (from mcp/)
cd mcp && npm run release:patch
```

Each command bumps the version, commits, tags, and pushes. GitHub Actions publishes to npm on tag push. The two packages are versioned independently.
