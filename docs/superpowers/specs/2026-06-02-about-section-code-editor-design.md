# About Section → VSCode-style Code Editor — Design Spec

**Date:** 2026-06-02
**Status:** Approved (pending spec review)
**Area:** Homepage `AboutSection`

## Summary

Replace the two prose columns ("About Me" / "What I believe") in `src/components/home/AboutSection.tsx` with a polished, mock VSCode-style code editor that presents the same personal information encoded as TypeScript variables, types, and functions. The animated stats-counter row above the columns **stays unchanged**.

The editor renders full IDE chrome, uses the Catppuccin theme (Latte light / Mocha dark, flipped by the existing `ThemeProvider`), a ligature-capable monospace font (`MonacoLigaturized`, user-supplied, with graceful fallback), and premium interactions: scroll-triggered line-by-line typewriter reveal, clickable file tabs, hover tooltips, themed text selection.

## Goals

- Present About + Beliefs content as believable, English TypeScript "source".
- Authentic full-IDE look (title bar, activity bar, explorer, tabs, gutter, status bar).
- Catppuccin Latte/Mocha theming wired into existing CSS-variable + `.dark` system.
- Ligatures + bold (`return` / declared identifiers) + italic (keywords / comments).
- Premium polish: fade-in, line reveal w/ caret, hover states, custom `::selection`.
- Fully responsive, accessible, reduced-motion aware, SSR-safe (real selectable text).

## Non-Goals

- No changes to the stats-counter row, Hero, or any other section.
- No real code execution / editing — purely a presentational mock.
- No new runtime dependencies (uses existing `lucide-react`, framer-motion-free CSS/JS).

## Build Approach (chosen: A — hand-tokenized rendering)

Each "file" is authored as typed token arrays grouped into lines:

```ts
type TokenType =
  | 'keyword' | 'func' | 'type' | 'string' | 'number'
  | 'constant' | 'property' | 'variable' | 'param'
  | 'punct' | 'operator' | 'comment';

interface Token {
  text: string;
  type: TokenType;
  bold?: boolean;            // e.g. `return`, declared/exported identifiers
  tip?: string;              // optional hover tooltip
}
type Line = Token[];
interface EditorFile { name: string; lines: Line[]; }
```

A renderer maps each `type` → a Catppuccin CSS variable and applies emphasis. Chosen over Shiki (opaque HTML, awkward per-token emphasis + line reveal + tooltips) and build-time `rehype-pretty-code` (no interactivity).

## Content

### `about.ts`
```ts
/** Full-stack developer turned AI engineer.
 *  Shipping production LLM systems & enterprise web apps. */
const developer = {
  name: "Defang",
  role: "AI Engineer | Full Stack Developer",
  sex: "male",          // ♂  (paired glyph, Catppuccin blue)
  age: 0x1A,            // 26, because hex is cooler
  focus: ["multi-agent backends", "generative UI"],
} satisfies Developer;

export function currentlyBuilding() {
  return [
    "AI-driven Agentic ERP — multi-agent workflows + Generative UI",
    "Info Radar — AI news, distilled into a daily digest",
  ];
}
```

### `beliefs.ts`
```ts
type Belief = { principle: string; because: string };

export const beliefs: Belief[] = [
  { principle: "Ship, then learn",
    because: "Real feedback from production beats any amount of planning." },
  { principle: "Build end-to-end",
    because: "Context collapse across layers is where the real problems live." },
  { principle: "Learn in public",
    because: "If I can't explain what I built, I don't fully understand it yet." },
  { principle: "AI is the craft",
    because: "Not a tool I use — the thing I think about most." },
];

export function whatIBelieve() {
  return beliefs.map((b) => b.principle);
}
```

Content is faithful to the current copy, all English.

## Chrome (Full IDE)

- **Title bar**: macOS traffic-light dots (reveal `× − +` glyphs on hover), centered title `defang — portfolio`.
- **Activity bar** (left, lucide icons): Files, Search, Source Control, Run, Extensions. Files active.
- **Explorer sidebar**: `PORTFOLIO` tree with `about.ts` / `beliefs.ts` entries (TS file glyph). Active file highlighted.
- **Tab bar**: `about.ts` (active, close ✕) + `beliefs.ts`. Clickable.
- **Editor area**: line-number gutter + tokenized code; active-line highlight on hover.
- **Status bar**: git branch `main*`, `⚠ 0`, `ⓧ 0`, `TypeScript`, `UTF-8`, `LF`, `Ln/Col`.

## Theming — Catppuccin

Add `--ctp-*` palette tokens to `globals.css` under `:root` (Latte) and `.dark` (Mocha), so the editor flips with the existing ThemeProvider (`document.documentElement.classList.toggle('dark', …)`).

**Latte (light):** base `#eff1f5`, mantle `#e6e9ef`, crust `#dce0e8`, text `#4c4f69`, subtext1 `#5c5f77`, overlay2 `#7c7f93`, overlay1 `#8c8fa1`, surface0 `#ccd0da`, surface1 `#bcc0cc`, surface2 `#acb0be`, mauve `#8839ef`, blue `#1e66f5`, green `#40a02b`, yellow `#df8e1d`, peach `#fe640b`, red `#d20f39`, sky `#04a5e5`, lavender `#7287fd`.

**Mocha (dark):** base `#1e1e2e`, mantle `#181825`, crust `#11111b`, text `#cdd6f4`, subtext1 `#bac2de`, overlay2 `#9399b2`, overlay1 `#7f849c`, surface0 `#313244`, surface1 `#45475a`, surface2 `#585b70`, mauve `#cba6f7`, blue `#89b4fa`, green `#a6e3a1`, yellow `#f9e2af`, peach `#fab387`, red `#f38ba8`, sky `#89dceb`, lavender `#b4befe`.

**Syntax token → color (Catppuccin official mapping):**

| Token type | Color |
|---|---|
| keyword (`const`, `return`, `export`, `function`, `type`, `satisfies`) | mauve, *italic* |
| func (function / method names) | blue |
| type (`Developer`, `Belief`) | yellow |
| string | green |
| number | peach |
| constant / language constant | peach |
| property (object keys) | text (default) |
| variable / param | text |
| operator | sky |
| punct (braces, brackets, commas) | overlay2 |
| comment | overlay1, *italic* |

**Emphasis rules:** `return` → **bold** (italic mauve); declared/exported identifiers (`developer`, `beliefs`, `currentlyBuilding`, `whatIBelieve`) → **bold**. Comments + keywords italic.

## Font

Plain CSS `@font-face` in `globals.css` (NOT `next/font/local`, so the build stays green before the woff2 files exist):

```css
@font-face {
  font-family: 'MonacoLigaturized';
  src: url('/fonts/MonacoLigaturized-Regular.woff2') format('woff2');
  font-weight: 400; font-style: normal; font-display: swap;
}
/* + Italic (400 italic), Bold (700 normal), BoldItalic (700 italic) */
```

Editor `font-family`: `'MonacoLigaturized', ui-monospace, var(--font-geist-mono), monospace`
with `font-variant-ligatures: contextual;` and `font-feature-settings: "calt" 1, "liga" 1;`.

Until the user drops the woff2 files into `public/fonts/`, the editor falls back to `ui-monospace` / Geist Mono; ligatures appear automatically once the files land. `public/fonts/README.md` documents the four required filenames:
`MonacoLigaturized-Regular.woff2`, `-Italic.woff2`, `-Bold.woff2`, `-BoldItalic.woff2`.

## Interactions / Premium Polish

- **Reveal**: IntersectionObserver (mirrors `ScrollReveal`: `rootMargin: '0px 0px -120px 0px'`, easing `cubic-bezier(0.22,1,0.36,1)`, in-viewport-on-mount + reduced-motion short-circuits). Chrome fades in, then code reveals line-by-line (~70ms stagger, opacity + small translateX) with a descending blinking caret.
- **Tabs**: clickable buttons; crossfade content; re-run a fast reveal on switch (instant if that file was already revealed once). Real `<button>`s with `focus-visible` rings.
- **Hover**:
  - Line hover → subtle highlight bar (surface0 low-alpha) + brighter line number.
  - Interactive identifiers (author-picked: `role`, `age` (tooltip decodes `0x1A` → 26), `currentlyBuilding`, `Info Radar`, `beliefs`) → underline + themed tooltip popover (surface0 bg, fade/scale in).
  - Activity-bar / tab icons → bg tint + color shift on hover.
  - Traffic lights → reveal `× − +` glyphs on hover.
- **Selection**: scoped `.code-editor ::selection` themed with Catppuccin surface2/overlay (no browser-blue inside the editor).
- **Container**: solid Catppuccin `base`, 1px `crust` ring, refined drop shadow + soft mauve glow on hover, rounded corners (`--radius-lg`).
- **Reduced-motion**: all code shown instantly, static (non-blinking) caret, no stagger.

## Component Structure

New directory `src/components/home/CodeEditor/`:

- `CodeEditor.tsx` — `'use client'` shell: renders chrome + manages state (`activeFile`, `revealedFiles` set); orchestrates reveal via `useReveal`. Renders full code in initial DOM (opacity-animated) for SSR/no-JS.
- `editorFiles.ts` — the two `EditorFile` token datasets (about.ts, beliefs.ts) + `TokenType`/`Token`/`Line`/`EditorFile` types.
- `tokens.tsx` — `Tokens`/`CodeLine` renderer: token → colored span with emphasis + optional tooltip.
- `useReveal.ts` — in-view detection + per-line reveal index, reduced-motion aware.
- `CodeEditor.module.css` — layout (grid: activity | explorer | editor; rows: titlebar / body / statusbar), caret keyframes, hover, tooltip, responsive rules.

Edits:
- `AboutSection.tsx` — replace the `grid grid-cols-1 md:grid-cols-2` About/Beliefs block with `<CodeEditor />`; keep the stats grid and section wrapper.
- `globals.css` — Catppuccin tokens, `@font-face`, scoped `::selection`.
- `public/fonts/README.md` — required woff2 filenames.

## Responsive

- **md+**: full IDE (activity bar + explorer + editor).
- **< md**: activity bar collapses to a thin strip (or hides); explorer hidden (tabs remain); editor full-width; smaller type; tabs scroll horizontally; status bar condensed (drop Ln/Col, encoding).

## Accessibility

- Real selectable text in the DOM (SSR-rendered), good Catppuccin contrast (AA).
- Tabs are `<button>`s with `aria-selected`, `focus-visible` rings, keyboard operable.
- `prefers-reduced-motion: reduce` → no typewriter/blink/stagger.
- Decorative chrome icons `aria-hidden`; editor labeled (e.g. `aria-label="Code editor: about and beliefs"`).

## Design-language pass

After the implementation plan, consult `ui-ux-pro-max` to refine spacing, shadow depth, contrast, and micro-interaction timing before finishing.

## Out-of-scope / Future

- Tooltip content is author-picked (a few key identifiers); not exhaustive.
- No minimap, no command palette, no real file-tree expansion beyond the two files.
