#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import {
  COLOR_DEFAULTS,
  COLOR_KEYS,
  COLOR_SHADES,
  RADIUS_DEFAULTS,
  SHADOW_KEYS,
  SPACING_DEFAULTS,
  TYPOGRAPHY,
  USAGE_EXAMPLES,
} from './catalog.js'

const server = new McpServer({ name: '@arpit194/themeforge-mcp', version: '0.1.0' })

// ── Resources ─────────────────────────────────────────────────────────────────

server.registerResource(
  'catalog',
  'themeforge://catalog',
  { description: 'All ThemeForge token categories with their default values', mimeType: 'application/json' },
  async () => ({
    contents: [{
      uri: 'themeforge://catalog',
      mimeType: 'application/json',
      text: JSON.stringify({
        colors:     { keys: COLOR_KEYS, shades: COLOR_SHADES, defaults: COLOR_DEFAULTS },
        spacing:    SPACING_DEFAULTS,
        radius:     RADIUS_DEFAULTS,
        shadows:    { keys: SHADOW_KEYS },
        typography: TYPOGRAPHY,
      }, null, 2),
    }],
  }),
)

server.registerResource(
  'css-vars',
  'themeforge://css-vars',
  { description: 'Complete list of CSS custom properties emitted by ThemeForge', mimeType: 'text/plain' },
  async () => {
    const lines: string[] = ['# ThemeForge CSS Variables\n']

    lines.push('## Colors')
    for (const name of COLOR_KEYS) {
      for (const shade of COLOR_SHADES) lines.push(`--tf-color-${name}-${shade}`)
    }

    lines.push('\n## Spacing')
    for (const key of Object.keys(SPACING_DEFAULTS)) lines.push(`--tf-spacing-${key}`)

    lines.push('\n## Radius')
    for (const key of Object.keys(RADIUS_DEFAULTS)) lines.push(`--tf-radius-${key}`)

    lines.push('\n## Shadows')
    for (const key of SHADOW_KEYS) lines.push(`--tf-shadow-${key}`)

    lines.push('\n## Typography — Primitives')
    for (const key of Object.keys(TYPOGRAPHY.fontFamilies))  lines.push(`--tf-font-family-${key}`)
    for (const key of Object.keys(TYPOGRAPHY.fontSizes))     lines.push(`--tf-font-size-${key}`)
    for (const key of Object.keys(TYPOGRAPHY.fontWeights))   lines.push(`--tf-font-weight-${key}`)
    for (const key of Object.keys(TYPOGRAPHY.lineHeights))   lines.push(`--tf-line-height-${key}`)
    for (const key of Object.keys(TYPOGRAPHY.letterSpacing)) lines.push(`--tf-letter-spacing-${key}`)

    lines.push('\n## Typography — Text Styles')
    for (const style of Object.keys(TYPOGRAPHY.textStyles)) {
      for (const prop of ['family', 'size', 'weight', 'line-height', 'letter-spacing']) {
        lines.push(`--tf-text-${style}-${prop}`)
      }
    }

    return { contents: [{ uri: 'themeforge://css-vars', mimeType: 'text/plain', text: lines.join('\n') }] }
  },
)

// ── Tools ─────────────────────────────────────────────────────────────────────

server.registerTool(
  'list_tokens',
  {
    description: 'List all available token keys and their default values for a given category',
    inputSchema: {
      category: z.enum(['colors', 'spacing', 'radius', 'shadows', 'font-families', 'font-sizes', 'font-weights', 'line-heights', 'letter-spacing', 'text-styles'])
        .describe('The token category to list'),
    },
  },
  async ({ category }) => {
    let result: unknown

    switch (category) {
      case 'colors':
        result = { keys: COLOR_KEYS, shades: COLOR_SHADES, defaults: COLOR_DEFAULTS, note: 'Each color generates 11 shades (50–950) from the base hex' }
        break
      case 'spacing':        result = SPACING_DEFAULTS;         break
      case 'radius':         result = RADIUS_DEFAULTS;          break
      case 'shadows':        result = { keys: SHADOW_KEYS };    break
      case 'font-families':  result = TYPOGRAPHY.fontFamilies;  break
      case 'font-sizes':     result = TYPOGRAPHY.fontSizes;     break
      case 'font-weights':   result = TYPOGRAPHY.fontWeights;   break
      case 'line-heights':   result = TYPOGRAPHY.lineHeights;   break
      case 'letter-spacing': result = TYPOGRAPHY.letterSpacing; break
      case 'text-styles':    result = TYPOGRAPHY.textStyles;    break
    }

    return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] }
  },
)

server.registerTool(
  'get_css_var',
  {
    description: 'Get the CSS custom property name for a token. For colors provide shade. For text-style provide property.',
    inputSchema: {
      category: z.enum(['color', 'spacing', 'radius', 'shadow', 'font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing', 'text-style']),
      key:      z.string().describe('Token key e.g. "primary", "md", "h1"'),
      shade:    z.number().optional().describe('Color shade (50–950), only for color'),
      property: z.string().optional().describe('Text style property (family, size, weight, line-height, letter-spacing), only for text-style'),
    },
  },
  async ({ category, key, shade, property }) => {
    let cssVar: string

    switch (category) {
      case 'color':
        if (!shade) throw new Error('shade is required for color')
        cssVar = `--tf-color-${key}-${shade}`
        break
      case 'spacing':        cssVar = `--tf-spacing-${key}`;        break
      case 'radius':         cssVar = `--tf-radius-${key}`;         break
      case 'shadow':         cssVar = `--tf-shadow-${key}`;         break
      case 'font-family':    cssVar = `--tf-font-family-${key}`;    break
      case 'font-size':      cssVar = `--tf-font-size-${key}`;      break
      case 'font-weight':    cssVar = `--tf-font-weight-${key}`;    break
      case 'line-height':    cssVar = `--tf-line-height-${key}`;    break
      case 'letter-spacing': cssVar = `--tf-letter-spacing-${key}`; break
      case 'text-style':
        if (!property) throw new Error('property is required for text-style')
        cssVar = `--tf-text-${key}-${property}`
        break
      default: throw new Error(`Unknown category: ${category}`)
    }

    return { content: [{ type: 'text' as const, text: cssVar }] }
  },
)

server.registerTool(
  'get_usage_example',
  {
    description: 'Get a code example for a common ThemeForge pattern',
    inputSchema: {
      topic: z.enum(['basic', 'use-theme', 'css-vars', 'scoped-theme', 'module-augmentation', 'typography-override', 'custom-shadow'])
        .describe('The pattern to show an example for'),
    },
  },
  async ({ topic }) => {
    const example = USAGE_EXAMPLES[topic]
    if (!example) throw new Error(`Unknown topic: ${topic}`)
    return { content: [{ type: 'text' as const, text: example }] }
  },
)

// ── Start ─────────────────────────────────────────────────────────────────────

const transport = new StdioServerTransport()
await server.connect(transport)
