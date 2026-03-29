#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";
import {
  COLOR_DEFAULTS,
  COLOR_KEYS,
  COLOR_SHADES,
  RADIUS_DEFAULTS,
  SEMANTIC_DEFAULTS,
  SHADOW_KEYS,
  SPACING_DEFAULTS,
  TYPOGRAPHY,
  USAGE_EXAMPLES,
} from "./catalog.js";

const server = new McpServer({
  name: "@arpit194/themeforge-mcp",
  version: "0.1.0",
});

// ── Resources ─────────────────────────────────────────────────────────────────

server.registerResource(
  "catalog",
  "themeforge://catalog",
  {
    description: "All ThemeForge token categories with their default values",
    mimeType: "application/json",
  },
  async () => ({
    contents: [
      {
        uri: "themeforge://catalog",
        mimeType: "application/json",
        text: JSON.stringify(
          {
            colors: {
              keys: COLOR_KEYS,
              shades: COLOR_SHADES,
              defaults: COLOR_DEFAULTS,
            },
            spacing: SPACING_DEFAULTS,
            radius: RADIUS_DEFAULTS,
            shadows: { keys: SHADOW_KEYS },
            typography: TYPOGRAPHY,
            semantic: SEMANTIC_DEFAULTS,
          },
          null,
          2,
        ),
      },
    ],
  }),
);

server.registerResource(
  "css-vars",
  "themeforge://css-vars",
  {
    description: "Complete list of CSS custom properties emitted by ThemeForge",
    mimeType: "text/plain",
  },
  async () => {
    const lines: string[] = ["# ThemeForge CSS Variables\n"];

    lines.push("## Colors");
    for (const name of COLOR_KEYS) {
      for (const shade of COLOR_SHADES)
        lines.push(`--tf-color-${name}-${shade}`);
    }

    lines.push("\n## Spacing");
    for (const key of Object.keys(SPACING_DEFAULTS))
      lines.push(`--tf-spacing-${key}`);

    lines.push("\n## Radius");
    for (const key of Object.keys(RADIUS_DEFAULTS))
      lines.push(`--tf-radius-${key}`);

    lines.push("\n## Shadows");
    for (const key of SHADOW_KEYS) lines.push(`--tf-shadow-${key}`);

    lines.push("\n## Typography — Primitives");
    for (const key of Object.keys(TYPOGRAPHY.fontFamilies))
      lines.push(`--tf-font-family-${key}`);
    for (const key of Object.keys(TYPOGRAPHY.fontSizes))
      lines.push(`--tf-font-size-${key}`);
    for (const key of Object.keys(TYPOGRAPHY.fontWeights))
      lines.push(`--tf-font-weight-${key}`);
    for (const key of Object.keys(TYPOGRAPHY.lineHeights))
      lines.push(`--tf-line-height-${key}`);
    for (const key of Object.keys(TYPOGRAPHY.letterSpacing))
      lines.push(`--tf-letter-spacing-${key}`);

    lines.push("\n## Typography — Text Styles");
    for (const style of Object.keys(TYPOGRAPHY.textStyles)) {
      for (const prop of [
        "family",
        "size",
        "weight",
        "line-height",
        "letter-spacing",
      ]) {
        lines.push(`--tf-text-${style}-${prop}`);
      }
    }

    lines.push("\n## Semantic Colors");
    for (const key of Object.keys(SEMANTIC_DEFAULTS))
      lines.push(`--tf-color-${key}`);

    return {
      contents: [
        {
          uri: "themeforge://css-vars",
          mimeType: "text/plain",
          text: lines.join("\n"),
        },
      ],
    };
  },
);

// ── Tools ─────────────────────────────────────────────────────────────────────

server.registerTool(
  "list_tokens",
  {
    description:
      "List all available token keys and their default values for a given category",
    inputSchema: {
      category: z
        .enum([
          "colors",
          "spacing",
          "radius",
          "shadows",
          "font-families",
          "font-sizes",
          "font-weights",
          "line-heights",
          "letter-spacing",
          "text-styles",
          "semantic",
        ])
        .describe("The token category to list"),
    },
  },
  async ({ category }) => {
    let result: unknown;

    switch (category) {
      case "colors":
        result = {
          keys: COLOR_KEYS,
          shades: COLOR_SHADES,
          defaults: COLOR_DEFAULTS,
          note: "Each color generates 11 shades (50–950) from the base hex",
        };
        break;
      case "spacing":
        result = SPACING_DEFAULTS;
        break;
      case "radius":
        result = RADIUS_DEFAULTS;
        break;
      case "shadows":
        result = { keys: SHADOW_KEYS };
        break;
      case "font-families":
        result = TYPOGRAPHY.fontFamilies;
        break;
      case "font-sizes":
        result = TYPOGRAPHY.fontSizes;
        break;
      case "font-weights":
        result = TYPOGRAPHY.fontWeights;
        break;
      case "line-heights":
        result = TYPOGRAPHY.lineHeights;
        break;
      case "letter-spacing":
        result = TYPOGRAPHY.letterSpacing;
        break;
      case "text-styles":
        result = TYPOGRAPHY.textStyles;
        break;
      case "semantic":
        result = SEMANTIC_DEFAULTS;
        break;
    }

    return {
      content: [
        { type: "text" as const, text: JSON.stringify(result, null, 2) },
      ],
    };
  },
);

server.registerTool(
  "get_css_var",
  {
    description:
      "Get the CSS custom property name for a token. For colors provide shade. For text-style provide property.",
    inputSchema: {
      category: z.enum([
        "color",
        "spacing",
        "radius",
        "shadow",
        "font-family",
        "font-size",
        "font-weight",
        "line-height",
        "letter-spacing",
        "text-style",
        "semantic",
      ]),
      key: z
        .string()
        .describe('Token key e.g. "primary", "md", "h1", "bg-primary"'),
      shade: z
        .number()
        .optional()
        .describe("Color shade (50-950), only for color"),
      property: z
        .string()
        .optional()
        .describe(
          "Text style property (family, size, weight, line-height, letter-spacing), only for text-style",
        ),
    },
  },
  async ({ category, key, shade, property }) => {
    let cssVar: string;

    switch (category) {
      case "color":
        if (!shade) throw new Error("shade is required for color");
        cssVar = `--tf-color-${key}-${shade}`;
        break;
      case "spacing":
        cssVar = `--tf-spacing-${key}`;
        break;
      case "radius":
        cssVar = `--tf-radius-${key}`;
        break;
      case "shadow":
        cssVar = `--tf-shadow-${key}`;
        break;
      case "font-family":
        cssVar = `--tf-font-family-${key}`;
        break;
      case "font-size":
        cssVar = `--tf-font-size-${key}`;
        break;
      case "font-weight":
        cssVar = `--tf-font-weight-${key}`;
        break;
      case "line-height":
        cssVar = `--tf-line-height-${key}`;
        break;
      case "letter-spacing":
        cssVar = `--tf-letter-spacing-${key}`;
        break;
      case "text-style":
        if (!property) throw new Error("property is required for text-style");
        cssVar = `--tf-text-${key}-${property}`;
        break;
      case "semantic":
        cssVar = `--tf-color-${key}`;
        break;
      default:
        throw new Error(`Unknown category: ${category}`);
    }

    return { content: [{ type: "text" as const, text: cssVar }] };
  },
);

server.registerTool(
  "list_semantic_by_group",
  {
    description: "List semantic color tokens filtered by group (bg, text, icon, border)",
    inputSchema: {
      group: z
        .enum(["bg", "text", "icon", "border"])
        .describe("The semantic group to list"),
    },
  },
  async ({ group }) => {
    const result = Object.fromEntries(
      Object.entries(SEMANTIC_DEFAULTS).filter(([key]) => key.startsWith(`${group}-`)),
    )
    return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] }
  },
)

server.registerTool(
  "suggest_tokens",
  {
    description: "Given a component type, return the relevant semantic tokens for each of its states",
    inputSchema: {
      component: z
        .enum(["button-primary", "button-secondary", "button-outline", "button-ghost", "button-destructive", "input", "badge", "card", "toast-success", "toast-warning", "toast-error", "toast-info"])
        .describe("The component to get token suggestions for"),
    },
  },
  async ({ component }) => {
    const suggestions: Record<string, Record<string, string>> = {
      "button-primary": {
        default:  "bg → bg-primary, text → text-on-dark",
        hover:    "bg → bg-primary-hover",
        active:   "bg → bg-primary-active",
        disabled: "bg → bg-primary-disabled, text → text-disabled",
        focus:    "outline → border-primary-focus",
      },
      "button-secondary": {
        default:  "bg → bg-secondary, text → text-on-dark",
        hover:    "bg → bg-secondary-hover",
        active:   "bg → bg-secondary-active",
        disabled: "bg → bg-secondary-disabled, text → text-disabled",
        focus:    "outline → border-primary-focus",
      },
      "button-outline": {
        default:  "bg → transparent, border → border-default, text → text-primary",
        hover:    "bg → bg-primary-subtle, border → border-primary",
        active:   "bg → bg-primary-selected",
        disabled: "border → border-primary-disabled, text → text-disabled",
        focus:    "outline → border-primary-focus",
      },
      "button-ghost": {
        default:  "bg → transparent, text → text-primary",
        hover:    "bg → bg-primary-subtle",
        active:   "bg → bg-primary-selected",
        disabled: "text → text-disabled",
        focus:    "outline → border-primary-focus",
      },
      "button-destructive": {
        default:  "bg → bg-error, text → text-on-dark",
        hover:    "bg → bg-error-hover",
        active:   "bg → bg-error-active",
        disabled: "bg → bg-error-subtle, text → text-disabled",
        focus:    "outline → border-error",
      },
      input: {
        default:  "bg → bg-surface, border → border-default, text → text-primary, placeholder → text-placeholder",
        hover:    "border → border-strong",
        focus:    "border → border-primary-focus, outline → border-primary-focus",
        disabled: "bg → bg-subtle, border → border-default, text → text-disabled",
        error:    "border → border-error, text → text-error",
      },
      badge: {
        neutral:  "bg → bg-subtle, text → text-secondary",
        primary:  "bg → bg-primary-subtle, text → text-link",
        success:  "bg → bg-success-subtle, text → text-success",
        warning:  "bg → bg-warning-subtle, text → text-warning",
        error:    "bg → bg-error-subtle, text → text-error",
        info:     "bg → bg-info-subtle, text → text-info",
      },
      card: {
        default:  "bg → bg-surface-raised, border → border-subtle",
        hover:    "border → border-default",
        selected: "border → border-primary, bg → bg-primary-subtle",
      },
      "toast-success": {
        default: "bg → bg-success-subtle, border → border-success, text → text-success, icon → icon-success",
      },
      "toast-warning": {
        default: "bg → bg-warning-subtle, border → border-warning, text → text-warning, icon → icon-warning",
      },
      "toast-error": {
        default: "bg → bg-error-subtle, border → border-error, text → text-error, icon → icon-error",
      },
      "toast-info": {
        default: "bg → bg-info-subtle, border → border-info, text → text-info, icon → icon-info",
      },
    }

    return { content: [{ type: "text" as const, text: JSON.stringify(suggestions[component], null, 2) }] }
  },
)

server.registerTool(
  "get_usage_example",
  {
    description: "Get a code example for a common ThemeForge pattern",
    inputSchema: {
      topic: z
        .enum([
          "basic",
          "use-theme",
          "css-vars",
          "scoped-theme",
          "module-augmentation",
          "typography-override",
          "custom-shadow",
        ])
        .describe("The pattern to show an example for"),
    },
  },
  async ({ topic }) => {
    const example = USAGE_EXAMPLES[topic];
    if (!example) throw new Error(`Unknown topic: ${topic}`);
    return { content: [{ type: "text" as const, text: example }] };
  },
);

server.registerTool(
  "scan_augmentations",
  {
    description:
      "Scan a project directory for ThemeForge module augmentations and return any custom token keys the user has declared",
    inputSchema: {
      projectPath: z
        .string()
        .describe("Absolute path to the project root to scan"),
    },
  },
  async ({ projectPath }) => {
    const TS_EXTS = new Set([".ts", ".tsx"]);
    const SKIP = new Set([
      "node_modules",
      "dist",
      "build",
      ".git",
      ".next",
      "out",
    ]);

    function collectFiles(dir: string, acc: string[] = []): string[] {
      for (const entry of readdirSync(dir)) {
        if (SKIP.has(entry)) continue;
        const full = join(dir, entry);
        if (statSync(full).isDirectory()) collectFiles(full, acc);
        else if (TS_EXTS.has(extname(entry))) acc.push(full);
      }
      return acc;
    }

    type Augmentations = Record<string, string[]>;

    function parseFile(content: string): Augmentations {
      const result: Augmentations = {};
      const moduleRe = /declare\s+module\s+['"]themeforge['"]\s*\{/g;
      let m: RegExpExecArray | null;

      while ((m = moduleRe.exec(content)) !== null) {
        // Walk forward to find the matching closing brace
        let depth = 1;
        let i = m.index + m[0].length;
        let block = "";
        while (i < content.length && depth > 0) {
          if (content[i] === "{") depth++;
          else if (content[i] === "}") depth--;
          if (depth > 0) block += content[i];
          i++;
        }

        // Extract each interface and its property keys
        const ifaceRe = /interface\s+(Custom\w+)\s*\{([^}]*)\}/g;
        let im: RegExpExecArray | null;
        while ((im = ifaceRe.exec(block)) !== null) {
          const name = im[1];
          const keys = [...im[2].matchAll(/^\s*(\w+)\s*:/gm)].map((k) => k[1]);
          if (keys.length) result[name] = [...(result[name] ?? []), ...keys];
        }
      }

      return result;
    }

    let files: string[];
    try {
      files = collectFiles(projectPath);
    } catch {
      throw new Error(`Cannot read directory: ${projectPath}`);
    }

    const combined: Augmentations = {};
    for (const file of files) {
      const found = parseFile(readFileSync(file, "utf8"));
      for (const [iface, keys] of Object.entries(found)) {
        combined[iface] = [...new Set([...(combined[iface] ?? []), ...keys])];
      }
    }

    if (Object.keys(combined).length === 0) {
      return {
        content: [
          {
            type: "text" as const,
            text: "No ThemeForge module augmentations found.",
          },
        ],
      };
    }

    return {
      content: [
        { type: "text" as const, text: JSON.stringify(combined, null, 2) },
      ],
    };
  },
);

// ── Start ─────────────────────────────────────────────────────────────────────

const transport = new StdioServerTransport();
await server.connect(transport);
