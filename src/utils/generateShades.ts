import type { ColorScale, ColorShades } from '../types'

const SHADE_KEYS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const

// Lightness targets per shade step (0–1)
const SHADE_LIGHTNESS: Record<keyof ColorShades, number> = {
  50:  0.97,
  100: 0.94,
  200: 0.86,
  300: 0.74,
  400: 0.62,
  500: 0.49,
  600: 0.40,
  700: 0.32,
  800: 0.24,
  900: 0.16,
  950: 0.11,
}

// ── Colour conversion helpers ────────────────────────────────────────────────

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '')
  const full = clean.length === 3
    ? clean.split('').map(c => c + c).join('')
    : clean
  const n = parseInt(full, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const rn = r / 255, gn = g / 255, bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const l = (max + min) / 2
  if (max === min) return [0, 0, l]

  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h = 0
  switch (max) {
    case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6; break
    case gn: h = ((bn - rn) / d + 2) / 6; break
    case bn: h = ((rn - gn) / d + 4) / 6; break
  }
  return [h, s, l]
}

function hslToHex(h: number, s: number, l: number): string {
  const hue2rgb = (p: number, q: number, t: number) => {
    const tn = t < 0 ? t + 1 : t > 1 ? t - 1 : t
    if (tn < 1 / 6) return p + (q - p) * 6 * tn
    if (tn < 1 / 2) return q
    if (tn < 2 / 3) return p + (q - p) * (2 / 3 - tn) * 6
    return p
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q
  const r = Math.round(hue2rgb(p, q, h + 1 / 3) * 255)
  const g = Math.round(hue2rgb(p, q, h) * 255)
  const b = Math.round(hue2rgb(p, q, h - 1 / 3) * 255)
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')
}

function nearestShadeKey(l: number): keyof ColorShades {
  return SHADE_KEYS.reduce((closest, key) => {
    const currentDelta = Math.abs(SHADE_LIGHTNESS[key] - l)
    const closestDelta = Math.abs(SHADE_LIGHTNESS[closest] - l)
    return currentDelta < closestDelta ? key : closest
  })
}

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Generate 11 shades (50–950) from a single base hex color.
 * The base color's lightness determines its anchor slot and appears there
 * exactly as provided. All other shades are generated from the same hue
 * and saturation using a fixed lightness ramp.
 *
 * Supply a custom implementation via ThemeProvider's `generateShades` prop
 * if the default output doesn't suit your needs.
 */
export function generateShades(baseHex: string): ColorScale {
  const [r, g, b] = hexToRgb(baseHex)
  const [h, s, l] = rgbToHsl(r, g, b)
  const anchor = nearestShadeKey(l)

  const shades = {} as ColorShades
  for (const key of SHADE_KEYS) {
    shades[key] = key === anchor ? baseHex : hslToHex(h, s, SHADE_LIGHTNESS[key])
  }

  return { shades, anchor }
}
