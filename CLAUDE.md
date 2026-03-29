# ThemeForge — Claude context

## Repo structure

```
/                   — @arpit194/themeforge (library)
  src/
    types.ts        — all TypeScript types and module augmentation interfaces
    defaults.ts     — all default token values
    ThemeProvider.tsx — React context, useMemo merges, CSS var injection
    utils/
      generateShades.ts — hex → 11-shade ColorScale
      buildCssVars.ts   — emits the <style> block, resolves shadows + semantic tokens
  src/index.ts      — public exports

mcp/                — @arpit194/themeforge-mcp (MCP server)
  src/
    catalog.ts      — re-exports defaults from ../../src/defaults.ts (always in sync)
    index.ts        — McpServer with tools and resources
```

## Key architecture decisions

- **Primitive + semantic two-layer color system.** Primitives are hex-derived shade scales (50–950). Semantic tokens are `{ scale, shade }` refs resolved at render time in `buildCssVars.ts`. Semantic vars emit as `--tf-color-bg-primary`, `--tf-color-text-on-dark`, etc.
- **All token merges in useMemo.** Every spread in ThemeProvider is wrapped in useMemo to avoid defeating downstream consumer memos.
- **Scoped CSS via useId.** Each ThemeProvider gets a unique `#scopeId` wrapper so nested providers don't bleed.
- **MCP imports library source directly.** `mcp/src/catalog.ts` imports from `../../src/defaults.ts` — no manual sync needed. The MCP tsconfig uses `rewriteRelativeImportExtensions: true` with explicit `.ts` extensions in imports.

## Token categories

| Category | CSS prefix | Notes |
|---|---|---|
| Primitive colors | `--tf-color-{scale}-{shade}` | 7 scales × 11 shades |
| Semantic colors | `--tf-color-{role}` | e.g. `--tf-color-bg-primary`, `--tf-color-text-on-dark` |
| Spacing | `--tf-spacing-{key}` | 3xs–10xl |
| Radius | `--tf-radius-{key}` | none, xs–3xl, full |
| Shadows | `--tf-shadow-{key}` | ShadowLayer[] resolved to CSS string |
| Font family | `--tf-font-family-{key}` | primary, secondary |
| Font size | `--tf-font-size-{key}` | 2xs–7xl |
| Font weight | `--tf-font-weight-{key}` | thin–black |
| Line height | `--tf-line-height-{key}` | none, tight–loose |
| Letter spacing | `--tf-letter-spacing-{key}` | tighter–widest |
| Text styles | `--tf-text-{style}-{prop}` | h1–h6, body variants, label, caption, code |

## Semantic token conventions

- `text-on-dark` (neutral-50) — text on saturated/dark colored backgrounds
- `text-on-light` (neutral-950) — text on light tinted backgrounds
- `text-disabled` / `icon-disabled` — neutral-400 (not 300, accessibility)
- `bg-page` (100) → `bg-subtle` (200) → `bg-surface` (50, elevated card feel)

## Module augmentation interfaces

All in `src/types.ts`: `CustomColorKeys`, `CustomSpacingKeys`, `CustomRadiusKeys`, `CustomShadowKeys`, `CustomFontFamilyKeys`, `CustomFontSizeKeys`, `CustomFontWeightKeys`, `CustomLineHeightKeys`, `CustomLetterSpacingKeys`, `CustomTextStyleKeys`, `CustomSemanticKeys`.

## Releasing

```bash
npm run release:patch          # library: bumps version, tags v*, pushes → npm publish
cd mcp && npm run release:patch # mcp: bumps version, tags mcp-v*, pushes → npm publish
```

Workflows in `.github/workflows/` trigger on those tag patterns.

## What not to do

- Don't add `rootDir` to `mcp/tsconfig.json` — it breaks cross-directory imports from `../../src/`
- Don't use `NodeNext` moduleResolution in the MCP package — use `bundler` with `rewriteRelativeImportExtensions`
- Don't add the React compiler to the library build
- Don't install new npm packages without asking first
