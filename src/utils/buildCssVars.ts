import type {
  RadiusTokens,
  SemanticColorRef,
  SemanticTokens,
  ShadowDefinition,
  ShadowTokens,
  SpacingTokens,
  ThemeColors,
  TypographyTokens,
} from '../types'

function resolveShadowDefinition(
  definition: ShadowDefinition,
  spacing: SpacingTokens,
  prefix: string,
): string {
  if (definition.length === 0) return 'none'
  return definition.map(layer => {
    const x      = layer.x ? spacing[layer.x] : '0'
    const y      = spacing[layer.y]
    const blur   = spacing[layer.blur]
    const spread = layer.spread ? `${layer.negativeSpread ? '-' : ''}${spacing[layer.spread]}` : '0'
    const inset  = layer.inset ? 'inset ' : ''
    const color  = `var(--${prefix}-color-${layer.semantic ?? 'shadow-color'})`
    return `${inset}${x} ${y} ${blur} ${spread} ${color}`
  }).join(', ')
}

export function buildCssVars(
  colors: ThemeColors,
  spacing: SpacingTokens,
  radius: RadiusTokens,
  shadows: ShadowTokens,
  typography: TypographyTokens,
  semantic: SemanticTokens,
  semanticDark: SemanticTokens,
  prefix: string,
  scopeId: string,
): string {
  const light: string[] = []
  const dark:  string[] = []

  // ── Primitive colors (mode-independent) ─────────────────────────────────────
  for (const [colorName, scale] of Object.entries(colors)) {
    for (const [shade, value] of Object.entries(scale.shades)) {
      light.push(`  --${prefix}-color-${colorName}-${shade}: ${value};`)
    }
  }

  // ── Spacing / Radius / Shadows / Typography — mode-independent ───────────────
  for (const [key, value] of Object.entries(spacing)) {
    light.push(`  --${prefix}-spacing-${key}: ${value};`)
  }
  for (const [key, value] of Object.entries(radius)) {
    light.push(`  --${prefix}-radius-${key}: ${value};`)
  }
  for (const [key, definition] of Object.entries(shadows)) {
    light.push(`  --${prefix}-shadow-${key}: ${resolveShadowDefinition(definition, spacing, prefix)};`)
  }
  for (const [key, value] of Object.entries(typography.fontFamilies)) {
    light.push(`  --${prefix}-font-family-${key}: ${value};`)
  }
  for (const [key, value] of Object.entries(typography.fontSizes)) {
    light.push(`  --${prefix}-font-size-${key}: ${value};`)
  }
  for (const [key, value] of Object.entries(typography.fontWeights)) {
    light.push(`  --${prefix}-font-weight-${key}: ${value};`)
  }
  for (const [key, value] of Object.entries(typography.lineHeights)) {
    light.push(`  --${prefix}-line-height-${key}: ${value};`)
  }
  for (const [key, value] of Object.entries(typography.letterSpacing)) {
    light.push(`  --${prefix}-letter-spacing-${key}: ${value};`)
  }
  const { fontFamilies, fontSizes, fontWeights, lineHeights, letterSpacing } = typography
  for (const [styleName, style] of Object.entries(typography.textStyles)) {
    light.push(`  --${prefix}-text-${styleName}-family: ${fontFamilies[style.family]};`)
    light.push(`  --${prefix}-text-${styleName}-size: ${fontSizes[style.size]};`)
    light.push(`  --${prefix}-text-${styleName}-weight: ${fontWeights[style.weight]};`)
    light.push(`  --${prefix}-text-${styleName}-line-height: ${lineHeights[style.lineHeight]};`)
    light.push(`  --${prefix}-text-${styleName}-letter-spacing: ${letterSpacing[style.letterSpacing]};`)
  }

  // ── Semantic colors — light ───────────────────────────────────────────────────
  for (const [key, ref] of Object.entries(semantic)) {
    const r = ref as SemanticColorRef
    light.push(`  --${prefix}-color-${key}: var(--${prefix}-color-${r.scale}-${r.shade});`)
  }

  // ── Semantic colors — dark ────────────────────────────────────────────────────
  for (const [key, ref] of Object.entries(semanticDark)) {
    const r = ref as SemanticColorRef
    dark.push(`  --${prefix}-color-${key}: var(--${prefix}-color-${r.scale}-${r.shade});`)
  }

  // ── Assemble ──────────────────────────────────────────────────────────────────
  const lightBlock = `#${scopeId} {\n${light.join('\n')}\n}`

  const darkLines = dark.join('\n')
  const darkBlock = [
    `@media (prefers-color-scheme: dark) {\n  #${scopeId}:not([data-theme="light"]) {\n${dark.map(l => '  ' + l).join('\n')}\n  }\n}`,
    `#${scopeId}[data-theme="dark"] {\n${darkLines}\n}`,
  ].join('\n')

  return `${lightBlock}\n${darkBlock}`
}
