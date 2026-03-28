import type { RadiusTokens, ShadowDefinition, ShadowTokens, SpacingTokens, ThemeColors, TypographyTokens } from '../types'

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '')
  const full = clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean
  const n = parseInt(full, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function resolveShadowDefinition(
  definition: ShadowDefinition,
  spacing: SpacingTokens,
  colors: ThemeColors,
): string {
  if (definition.length === 0) return 'none'

  return definition.map(layer => {
    const x      = layer.x ? spacing[layer.x] : '0'
    const y      = spacing[layer.y]
    const blur   = spacing[layer.blur]
    const spread = layer.spread
      ? `${layer.negativeSpread ? '-' : ''}${spacing[layer.spread]}`
      : '0'
    const shade  = layer.colorShade ?? 900
    const hex    = colors.neutral.shades[shade]
    const [r, g, b] = hexToRgb(hex)
    const color  = `rgb(${r} ${g} ${b} / ${layer.opacity})`
    const inset  = layer.inset ? 'inset ' : ''
    return `${inset}${x} ${y} ${blur} ${spread} ${color}`
  }).join(', ')
}

export function buildCssVars(
  colors: ThemeColors,
  spacing: SpacingTokens,
  radius: RadiusTokens,
  shadows: ShadowTokens,
  typography: TypographyTokens,
  prefix: string,
  scopeId: string,
): string {
  const lines: string[] = []

  // Colors
  for (const [colorName, scale] of Object.entries(colors)) {
    for (const [shade, value] of Object.entries(scale.shades)) {
      lines.push(`  --${prefix}-color-${colorName}-${shade}: ${value};`)
    }
  }

  // Spacing
  for (const [key, value] of Object.entries(spacing)) {
    lines.push(`  --${prefix}-spacing-${key}: ${value};`)
  }

  // Radius
  for (const [key, value] of Object.entries(radius)) {
    lines.push(`  --${prefix}-radius-${key}: ${value};`)
  }

  // Shadows
  for (const [key, definition] of Object.entries(shadows)) {
    lines.push(`  --${prefix}-shadow-${key}: ${resolveShadowDefinition(definition, spacing, colors)};`)
  }

  // Typography — primitives
  for (const [key, value] of Object.entries(typography.fontFamilies)) {
    lines.push(`  --${prefix}-font-family-${key}: ${value};`)
  }
  for (const [key, value] of Object.entries(typography.fontSizes)) {
    lines.push(`  --${prefix}-font-size-${key}: ${value};`)
  }
  for (const [key, value] of Object.entries(typography.fontWeights)) {
    lines.push(`  --${prefix}-font-weight-${key}: ${value};`)
  }
  for (const [key, value] of Object.entries(typography.lineHeights)) {
    lines.push(`  --${prefix}-line-height-${key}: ${value};`)
  }
  for (const [key, value] of Object.entries(typography.letterSpacing)) {
    lines.push(`  --${prefix}-letter-spacing-${key}: ${value};`)
  }

  // Typography — semantic text styles (resolved values, not var() references)
  const { fontFamilies, fontSizes, fontWeights, lineHeights, letterSpacing } = typography
  for (const [styleName, style] of Object.entries(typography.textStyles)) {
    lines.push(`  --${prefix}-text-${styleName}-family: ${fontFamilies[style.family]};`)
    lines.push(`  --${prefix}-text-${styleName}-size: ${fontSizes[style.size]};`)
    lines.push(`  --${prefix}-text-${styleName}-weight: ${fontWeights[style.weight]};`)
    lines.push(`  --${prefix}-text-${styleName}-line-height: ${lineHeights[style.lineHeight]};`)
    lines.push(`  --${prefix}-text-${styleName}-letter-spacing: ${letterSpacing[style.letterSpacing]};`)
  }

  return `#${scopeId} {\n${lines.join('\n')}\n}`
}
