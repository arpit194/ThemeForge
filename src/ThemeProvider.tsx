import {
  createContext,
  useContext,
  useId,
  useMemo,
  type ReactNode,
} from "react";
import { generateShades as defaultGenerateShades } from "./utils/generateShades";
import { buildCssVars } from "./utils/buildCssVars";
import {
  DEFAULT_CONFIG,
  DEFAULT_FONT_FAMILIES,
  DEFAULT_FONT_SIZES,
  DEFAULT_FONT_WEIGHTS,
  DEFAULT_LETTER_SPACING,
  DEFAULT_LINE_HEIGHTS,
  DEFAULT_PREFIX,
  DEFAULT_RADIUS,
  DEFAULT_SHADOWS,
  DEFAULT_SPACING,
  DEFAULT_TEXT_STYLES,
} from "./defaults";
import type {
  ColorScale,
  GenerateShadesFn,
  RadiusTokens,
  ShadowTokens,
  SpacingTokens,
  TextStyle,
  TextStyleTokens,
  ThemeConfig,
  ThemeColors,
  ThemeContextValue,
  TypographyConfig,
  TypographyTokens,
} from "./types";

// ── Context ───────────────────────────────────────────────────────────────────

const ThemeContext = createContext<ThemeContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────

type ThemeProviderProps = {
  /**
   * Override any or all base colors. Unspecified keys fall back to defaults.
   * Pass a stable reference (defined outside the component or wrapped in useMemo)
   * to avoid recomputing shades on every render — especially important when
   * ThemeProvider is used for scoped themes inside frequently-rendering components.
   */
  theme?: Partial<ThemeConfig>;
  /**
   * Override any or all spacing tokens. Unspecified keys fall back to defaults.
   * Pass a stable reference for the same reasons as `theme`.
   */
  spacing?: Partial<SpacingTokens>;
  /**
   * Override any or all radius tokens. Unspecified keys fall back to defaults.
   * Pass a stable reference for the same reasons as `theme`.
   */
  radius?: Partial<RadiusTokens>;
  /**
   * Override any or all shadow tokens. Unspecified keys fall back to defaults.
   * Pass a stable reference for the same reasons as `theme`.
   */
  shadows?: Partial<ShadowTokens>;
  /**
   * Override any or all typography tokens. Each sub-key is optional.
   * Text style overrides are per-property — e.g. `{ h1: { weight: 'medium' } }`
   * merges with the default h1 style; you don't need to re-specify all properties.
   * Pass a stable reference for the same reasons as `theme`.
   */
  typography?: TypographyConfig;
  /** Prefix for all CSS variable names. Defaults to "tf" → e.g. `--tf-color-primary-500` */
  cssVarPrefix?: string;
  /** Provide a custom shade generator to replace the built-in implementation. */
  generateShades?: GenerateShadesFn;
  children: ReactNode;
};

export function ThemeProvider({
  theme,
  spacing,
  radius,
  shadows,
  typography,
  cssVarPrefix = DEFAULT_PREFIX,
  generateShades = defaultGenerateShades,
  children,
}: ThemeProviderProps) {
  const config = useMemo<ThemeConfig>(() => ({ ...DEFAULT_CONFIG, ...theme }), [theme]);
  const spacingTokens = useMemo<SpacingTokens>(() => ({ ...DEFAULT_SPACING, ...spacing }), [spacing]);
  const radiusTokens = useMemo<RadiusTokens>(() => ({ ...DEFAULT_RADIUS, ...radius }), [radius]);
  const shadowTokens = useMemo<ShadowTokens>(() => ({ ...DEFAULT_SHADOWS, ...shadows }), [shadows]);

  const rawId = useId();
  const scopeId = `tf-${rawId.replace(/:/g, "")}`;

  const colors = useMemo(() => {
    const result: Record<string, ColorScale> = {};
    for (const [key, value] of Object.entries(config)) {
      result[key] = generateShades(value);
    }
    return result as ThemeColors;
  }, [config, generateShades]);

  const typographyTokens = useMemo((): TypographyTokens => {
    const fontFamilies = { ...DEFAULT_FONT_FAMILIES, ...typography?.fontFamilies };
    const fontSizes    = { ...DEFAULT_FONT_SIZES,    ...typography?.fontSizes };
    const fontWeights  = { ...DEFAULT_FONT_WEIGHTS,  ...typography?.fontWeights };
    const lineHeights  = { ...DEFAULT_LINE_HEIGHTS,  ...typography?.lineHeights };
    const letterSpacing = { ...DEFAULT_LETTER_SPACING, ...typography?.letterSpacing };

    const textStyles = { ...DEFAULT_TEXT_STYLES } as Record<string, TextStyle>;
    if (typography?.textStyles) {
      for (const [key, overrides] of Object.entries(typography.textStyles)) {
        textStyles[key] = { ...textStyles[key], ...overrides } as TextStyle;
      }
    }

    return { fontFamilies, fontSizes, fontWeights, lineHeights, letterSpacing, textStyles: textStyles as TextStyleTokens };
  }, [typography]);

  const cssVars = useMemo(
    () => buildCssVars(colors, spacingTokens, radiusTokens, shadowTokens, typographyTokens, cssVarPrefix, scopeId),
    [colors, spacingTokens, radiusTokens, shadowTokens, typographyTokens, cssVarPrefix, scopeId],
  );

  const contextValue = useMemo<ThemeContextValue>(
    () => ({ colors, spacing: spacingTokens, radius: radiusTokens, shadows: shadowTokens, typography: typographyTokens, cssVarPrefix }),
    [colors, spacingTokens, radiusTokens, shadowTokens, typographyTokens, cssVarPrefix],
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <div id={scopeId} style={{ display: "contents" }}>
        <style>{cssVars}</style>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a <ThemeProvider>");
  return ctx;
}
