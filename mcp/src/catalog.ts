// Token keys and defaults imported directly from the library source — always in sync.
import {
  DEFAULT_CONFIG,
  DEFAULT_FONT_FAMILIES,
  DEFAULT_FONT_SIZES,
  DEFAULT_FONT_WEIGHTS,
  DEFAULT_LETTER_SPACING,
  DEFAULT_LINE_HEIGHTS,
  DEFAULT_RADIUS,
  DEFAULT_SHADOWS,
  DEFAULT_SPACING,
  DEFAULT_TEXT_STYLES,
} from '../../src/defaults.ts'

export const COLOR_KEYS   = Object.keys(DEFAULT_CONFIG) as string[]
export const COLOR_SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const
export const COLOR_DEFAULTS  = DEFAULT_CONFIG
export const SPACING_DEFAULTS = DEFAULT_SPACING as Record<string, string>
export const RADIUS_DEFAULTS  = DEFAULT_RADIUS  as Record<string, string>
export const SHADOW_KEYS = Object.keys(DEFAULT_SHADOWS) as string[]
export const TYPOGRAPHY = {
  fontFamilies:  DEFAULT_FONT_FAMILIES  as Record<string, string>,
  fontSizes:     DEFAULT_FONT_SIZES     as Record<string, string>,
  fontWeights:   DEFAULT_FONT_WEIGHTS   as Record<string, string>,
  lineHeights:   DEFAULT_LINE_HEIGHTS   as Record<string, string>,
  letterSpacing: DEFAULT_LETTER_SPACING as Record<string, string>,
  textStyles:    DEFAULT_TEXT_STYLES    as Record<string, Record<string, string>>,
}

export const USAGE_EXAMPLES: Record<string, string> = {
  basic: `\
import { ThemeProvider } from 'themeforge'

function App() {
  return (
    <ThemeProvider
      theme={{ primary: '#E11D48', secondary: '#7C3AED', neutral: '#64748B' }}
    >
      <YourApp />
    </ThemeProvider>
  )
}`,

  'use-theme': `\
import { useTheme } from 'themeforge'

function Card() {
  const { colors, spacing, radius, shadows } = useTheme()

  return (
    <div style={{
      backgroundColor: colors.primary.shades[50],
      padding: spacing.md,
      borderRadius: radius.lg,
      boxShadow: shadows.md,
    }}>
      ...
    </div>
  )
}`,

  'css-vars': `\
.card {
  background: var(--tf-color-primary-50);
  padding: var(--tf-spacing-md);
  border-radius: var(--tf-radius-lg);
  box-shadow: var(--tf-shadow-md);
}

.heading {
  font-size: var(--tf-text-h1-size);
  font-weight: var(--tf-text-h1-weight);
  line-height: var(--tf-text-h1-line-height);
}`,

  'scoped-theme': `\
<ThemeProvider theme={{ primary: '#E11D48' }}>
  <App />
  <ThemeProvider theme={{ primary: '#7C3AED' }}>
    <Sidebar />
  </ThemeProvider>
</ThemeProvider>`,

  'module-augmentation': `\
import type { ShadowDefinition, TextStyle } from 'themeforge'

declare module 'themeforge' {
  interface CustomColorKeys   { brand: string }
  interface CustomShadowKeys  { glow: ShadowDefinition }
  interface CustomSpacingKeys { section: string }
  interface CustomTextStyleKeys { hero: TextStyle }
}

<ThemeProvider
  theme={{ brand: '#FF6B35' }}
  shadows={{ glow: [{ y: '3xs', blur: 'md', colorShade: 400, opacity: 0.4 }] }}
  spacing={{ section: '7rem' }}
  typography={{ textStyles: { hero: { size: '7xl', weight: 'bold' } } }}
>`,

  'typography-override': `\
<ThemeProvider
  typography={{
    fontFamilies: { primary: 'Inter, sans-serif' },
    textStyles: {
      h1: { weight: 'bold', letterSpacing: 'tight' },
      body: { lineHeight: 'relaxed' },
    },
  }}
>`,

  'custom-shadow': `\
import type { ShadowDefinition } from 'themeforge'

declare module 'themeforge' {
  interface CustomShadowKeys { glow: ShadowDefinition }
}

<ThemeProvider
  shadows={{
    md: [{ y: '2xs', blur: 'sm', colorShade: 800, opacity: 0.2 }],
    glow: [{ y: '3xs', blur: 'md', colorShade: 400, opacity: 0.4 }],
  }}
>`,
}
