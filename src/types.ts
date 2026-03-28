// ── Color types ───────────────────────────────────────────────────────────────

export type ColorShades = {
  50: string
  100: string
  200: string
  300: string
  400: string
  500: string
  600: string
  700: string
  800: string
  900: string
  950: string
}

export type ColorScale = {
  shades: ColorShades
  /** The shade key the original input color was placed at. */
  anchor: keyof ColorShades
}

export type GenerateShadesFn = (baseHex: string) => ColorScale

/**
 * Extend this interface via module augmentation to add custom color keys.
 *
 * @example
 * ```ts
 * declare module 'themeforge' {
 *   interface CustomColorKeys {
 *     tertiary: string
 *   }
 * }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CustomColorKeys {}

export type ThemeColors = {
  primary: ColorScale
  secondary: ColorScale
  neutral: ColorScale
} & { [K in keyof CustomColorKeys]: ColorScale }

export type ThemeConfig = {
  primary: string
  secondary: string
  neutral: string
} & { [K in keyof CustomColorKeys]: string }

// ── Spacing types ─────────────────────────────────────────────────────────────

/**
 * Extend this interface via module augmentation to add custom spacing keys.
 *
 * @example
 * ```ts
 * declare module 'themeforge' {
 *   interface CustomSpacingKeys {
 *     section: string
 *     page: string
 *   }
 * }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CustomSpacingKeys {}

export type SpacingTokens = {
  '3xs': string
  '2xs': string
  xs: string
  sm: string
  md: string
  lg: string
  xl: string
  '2xl': string
  '3xl': string
  '4xl': string
  '5xl': string
  '6xl': string
  '7xl': string
  '8xl': string
  '9xl': string
  '10xl': string
} & { [K in keyof CustomSpacingKeys]: string }

// ── Radius types ──────────────────────────────────────────────────────────────

/**
 * Extend this interface via module augmentation to add custom radius keys.
 *
 * @example
 * ```ts
 * declare module 'themeforge' {
 *   interface CustomRadiusKeys {
 *     card: string
 *   }
 * }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CustomRadiusKeys {}

export type RadiusTokens = {
  none: string
  xs: string
  sm: string
  md: string
  lg: string
  xl: string
  '2xl': string
  '3xl': string
  full: string
} & { [K in keyof CustomRadiusKeys]: string }

// ── Shadow types ──────────────────────────────────────────────────────────────

/**
 * Extend this interface via module augmentation to add custom shadow keys.
 *
 * @example
 * ```ts
 * declare module 'themeforge' {
 *   interface CustomShadowKeys {
 *     glow: string
 *   }
 * }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CustomShadowKeys {}

export type ShadowLayer = {
  x?: keyof SpacingTokens
  y: keyof SpacingTokens
  blur: keyof SpacingTokens
  /** Spread radius. Negative when `negativeSpread` is true. */
  spread?: keyof SpacingTokens
  negativeSpread?: boolean
  /** Shade from the neutral color scale. Defaults to 900. */
  colorShade?: keyof ColorShades
  /** Opacity of the shadow color, 0–1. */
  opacity: number
  inset?: boolean
}

/** An array of shadow layers. Empty array resolves to `none`. */
export type ShadowDefinition = ShadowLayer[]

export type ShadowTokens = {
  none: ShadowDefinition
  xs: ShadowDefinition
  sm: ShadowDefinition
  md: ShadowDefinition
  lg: ShadowDefinition
  xl: ShadowDefinition
  '2xl': ShadowDefinition
  inner: ShadowDefinition
} & { [K in keyof CustomShadowKeys]: ShadowDefinition }

// ── Typography types ──────────────────────────────────────────────────────────

/**
 * Extend this interface via module augmentation to add custom font family keys.
 *
 * @example
 * ```ts
 * declare module 'themeforge' {
 *   interface CustomFontFamilyKeys {
 *     display: string
 *   }
 * }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CustomFontFamilyKeys {}

/**
 * Extend this interface via module augmentation to add custom font size keys.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CustomFontSizeKeys {}

/**
 * Extend this interface via module augmentation to add custom font weight keys.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CustomFontWeightKeys {}

/**
 * Extend this interface via module augmentation to add custom line height keys.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CustomLineHeightKeys {}

/**
 * Extend this interface via module augmentation to add custom letter spacing keys.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CustomLetterSpacingKeys {}

/**
 * Extend this interface via module augmentation to add custom text style keys.
 *
 * @example
 * ```ts
 * declare module 'themeforge' {
 *   interface CustomTextStyleKeys {
 *     hero: TextStyle
 *     overline: TextStyle
 *   }
 * }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CustomTextStyleKeys {}

export type FontFamilyTokens = {
  primary: string
  secondary: string
} & { [K in keyof CustomFontFamilyKeys]: string }

export type FontSizeTokens = {
  '2xs': string
  xs: string
  sm: string
  md: string
  lg: string
  xl: string
  '2xl': string
  '3xl': string
  '4xl': string
  '5xl': string
  '6xl': string
  '7xl': string
} & { [K in keyof CustomFontSizeKeys]: string }

export type FontWeightTokens = {
  thin: string
  light: string
  regular: string
  medium: string
  semibold: string
  bold: string
  black: string
} & { [K in keyof CustomFontWeightKeys]: string }

export type LineHeightTokens = {
  none: string
  tight: string
  snug: string
  normal: string
  relaxed: string
  loose: string
} & { [K in keyof CustomLineHeightKeys]: string }

export type LetterSpacingTokens = {
  tighter: string
  tight: string
  normal: string
  wide: string
  wider: string
  widest: string
} & { [K in keyof CustomLetterSpacingKeys]: string }

/** A composite text style referencing primitive token keys — not raw values. */
export type TextStyle = {
  family: keyof FontFamilyTokens
  size: keyof FontSizeTokens
  weight: keyof FontWeightTokens
  lineHeight: keyof LineHeightTokens
  letterSpacing: keyof LetterSpacingTokens
}

export type TextStyleTokens = {
  h1: TextStyle
  h2: TextStyle
  h3: TextStyle
  h4: TextStyle
  h5: TextStyle
  h6: TextStyle
  'body-lg': TextStyle
  body: TextStyle
  'body-sm': TextStyle
  label: TextStyle
  caption: TextStyle
  code: TextStyle
} & { [K in keyof CustomTextStyleKeys]: TextStyle }

export type TypographyTokens = {
  fontFamilies: FontFamilyTokens
  fontSizes: FontSizeTokens
  fontWeights: FontWeightTokens
  lineHeights: LineHeightTokens
  letterSpacing: LetterSpacingTokens
  textStyles: TextStyleTokens
}

/**
 * Shape for the `typography` prop on `<ThemeProvider>`.
 * Each key is fully optional — unspecified keys fall back to defaults.
 * Text style overrides are per-property: you can override just `weight`
 * without re-specifying the full style.
 */
export type TypographyConfig = {
  fontFamilies?: Partial<FontFamilyTokens>
  fontSizes?: Partial<FontSizeTokens>
  fontWeights?: Partial<FontWeightTokens>
  lineHeights?: Partial<LineHeightTokens>
  letterSpacing?: Partial<LetterSpacingTokens>
  textStyles?: { [K in keyof TextStyleTokens]?: Partial<TextStyle> }
}

// ── Context types ─────────────────────────────────────────────────────────────

export type ThemeContextValue = {
  colors: ThemeColors
  spacing: SpacingTokens
  radius: RadiusTokens
  shadows: ShadowTokens
  typography: TypographyTokens
  /** The CSS variable prefix in use — e.g. `"tf"` → `--tf-color-primary-500` */
  cssVarPrefix: string
}
