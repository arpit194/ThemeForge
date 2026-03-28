import type {
  FontFamilyTokens,
  FontSizeTokens,
  FontWeightTokens,
  LetterSpacingTokens,
  LineHeightTokens,
  RadiusTokens,
  ShadowTokens,
  SpacingTokens,
  TextStyleTokens,
  ThemeConfig,
} from "./types";

export const DEFAULT_PREFIX = "tf";

export const DEFAULT_CONFIG: ThemeConfig = {
  primary: "#3B82F6", // blue
  secondary: "#8B5CF6", // violet
  neutral: "#6B7280", // gray
};

export const DEFAULT_SPACING: SpacingTokens = {
  "3xs": "0.125rem", //   2px
  "2xs": "0.25rem", //   4px
  xs: "0.5rem", //   8px
  sm: "0.75rem", //  12px
  md: "1rem", //  16px
  lg: "1.5rem", //  24px
  xl: "2rem", //  32px
  "2xl": "2.5rem", //  40px
  "3xl": "3rem", //  48px
  "4xl": "4rem", //  64px
  "5xl": "5rem", //  80px
  "6xl": "6rem", //  96px
  "7xl": "8rem", // 128px
  "8xl": "10rem", // 160px
  "9xl": "12rem", // 192px
  "10xl": "16rem", // 256px
};

export const DEFAULT_RADIUS: RadiusTokens = {
  none: "0px", //  0px
  xs: "0.125rem", //  2px
  sm: "0.25rem", //  4px
  md: "0.375rem", //  6px
  lg: "0.5rem", //  8px
  xl: "0.75rem", // 12px
  "2xl": "1rem", // 16px
  "3xl": "1.5rem", // 24px
  full: "9999px", // pills, avatars
};

// ── Shadow defaults ───────────────────────────────────────────────────────────

export const DEFAULT_SHADOWS: ShadowTokens = {
  none: [],
  xs: [{ y: "3xs", blur: "3xs", opacity: 0.05 }],
  sm: [
    { y: "3xs", blur: "2xs", opacity: 0.1 },
    {
      y: "3xs",
      blur: "3xs",
      spread: "3xs",
      negativeSpread: true,
      opacity: 0.1,
    },
  ],
  md: [
    { y: "2xs", blur: "xs", spread: "3xs", negativeSpread: true, opacity: 0.1 },
    {
      y: "3xs",
      blur: "2xs",
      spread: "3xs",
      negativeSpread: true,
      opacity: 0.1,
    },
  ],
  lg: [
    { y: "sm", blur: "md", spread: "3xs", negativeSpread: true, opacity: 0.1 },
    { y: "2xs", blur: "xs", spread: "2xs", negativeSpread: true, opacity: 0.1 },
  ],
  xl: [
    { y: "lg", blur: "lg", spread: "2xs", negativeSpread: true, opacity: 0.1 },
    { y: "xs", blur: "sm", spread: "xs", negativeSpread: true, opacity: 0.1 },
  ],
  "2xl": [
    { y: "lg", blur: "3xl", spread: "sm", negativeSpread: true, opacity: 0.25 },
  ],
  inner: [{ y: "3xs", blur: "2xs", opacity: 0.05, inset: true }],
};

// ── Typography defaults ───────────────────────────────────────────────────────

export const DEFAULT_FONT_FAMILIES: FontFamilyTokens = {
  primary:
    "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  secondary: "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif",
};

export const DEFAULT_FONT_SIZES: FontSizeTokens = {
  "2xs": "0.625rem", //  10px
  xs: "0.75rem", //  12px
  sm: "0.875rem", //  14px
  md: "1rem", //  16px
  lg: "1.125rem", //  18px
  xl: "1.25rem", //  20px
  "2xl": "1.5rem", //  24px
  "3xl": "1.875rem", //  30px
  "4xl": "2.25rem", //  36px
  "5xl": "3rem", //  48px
  "6xl": "3.75rem", //  60px
  "7xl": "4.5rem", //  72px
};

export const DEFAULT_FONT_WEIGHTS: FontWeightTokens = {
  thin: "100",
  light: "300",
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
  black: "900",
};

export const DEFAULT_LINE_HEIGHTS: LineHeightTokens = {
  none: "1",
  tight: "1.25",
  snug: "1.375",
  normal: "1.5",
  relaxed: "1.625",
  loose: "2",
};

export const DEFAULT_LETTER_SPACING: LetterSpacingTokens = {
  tighter: "-0.05em",
  tight: "-0.025em",
  normal: "0em",
  wide: "0.025em",
  wider: "0.05em",
  widest: "0.1em",
};

export const DEFAULT_TEXT_STYLES: TextStyleTokens = {
  h1: {
    family: "primary",
    size: "5xl",
    weight: "regular",
    lineHeight: "normal",
    letterSpacing: "normal",
  },
  h2: {
    family: "primary",
    size: "4xl",
    weight: "regular",
    lineHeight: "normal",
    letterSpacing: "normal",
  },
  h3: {
    family: "primary",
    size: "3xl",
    weight: "regular",
    lineHeight: "normal",
    letterSpacing: "normal",
  },
  h4: {
    family: "primary",
    size: "2xl",
    weight: "regular",
    lineHeight: "normal",
    letterSpacing: "normal",
  },
  h5: {
    family: "primary",
    size: "xl",
    weight: "regular",
    lineHeight: "normal",
    letterSpacing: "normal",
  },
  h6: {
    family: "primary",
    size: "lg",
    weight: "regular",
    lineHeight: "normal",
    letterSpacing: "normal",
  },
  "body-lg": {
    family: "primary",
    size: "lg",
    weight: "regular",
    lineHeight: "normal",
    letterSpacing: "normal",
  },
  body: {
    family: "primary",
    size: "md",
    weight: "regular",
    lineHeight: "normal",
    letterSpacing: "normal",
  },
  "body-sm": {
    family: "primary",
    size: "sm",
    weight: "regular",
    lineHeight: "normal",
    letterSpacing: "normal",
  },
  label: {
    family: "primary",
    size: "sm",
    weight: "regular",
    lineHeight: "normal",
    letterSpacing: "normal",
  },
  caption: {
    family: "primary",
    size: "xs",
    weight: "regular",
    lineHeight: "normal",
    letterSpacing: "normal",
  },
  code: {
    family: "primary",
    size: "sm",
    weight: "regular",
    lineHeight: "normal",
    letterSpacing: "normal",
  },
};
