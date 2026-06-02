# About Section → VSCode-style Code Editor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the "About Me" / "What I believe" prose columns on the homepage with a polished, mock VSCode-style code editor (Catppuccin Latte/Mocha, ligature font, typewriter reveal, tabs, hover tooltips), keeping the stats-counter row untouched.

**Architecture:** A self-contained `src/components/home/CodeEditor/` module. Content is authored as typed **token arrays** (`{text, type, bold?, tip?}` grouped into lines) in `editorFiles.ts`; a small `TokenSpan` renderer maps token types → Catppuccin CSS variables; `useReveal` handles in-view + reduced-motion detection (mirroring the existing `ScrollReveal` pattern); `CodeEditor.tsx` renders full IDE chrome and drives a line-by-line reveal with a child `CodeReveal` (key-based remount per file for replay). Theming flips via the existing `.dark` class + CSS variables added to `globals.css`. No new dependencies (uses existing `lucide-react`).

**Tech Stack:** Next.js App Router (React 19, `'use client'`), Tailwind v3.4, CSS Modules, CSS custom properties, lucide-react.

**Testing note:** This repo has **no test framework** (`package.json` has no test script) and this is purely presentational UI — adding a runner is out of scope and the user did not request it. Per-task verification is **lint** (`bun run lint`); type-heavy tasks also run `bunx tsc --noEmit`; the final task runs a full `bun run build` plus **Playwright visual verification** in light + dark + reduced-motion + mobile. This adapts the TDD discipline to a no-test-runner, visual-UI context: every task still ends in a green check and a commit.

**Reference spec:** `docs/superpowers/specs/2026-06-02-about-section-code-editor-design.md`

---

## File Structure

| File | Responsibility | Action |
|---|---|---|
| `src/app/globals.css` | Catppuccin Latte/Mocha tokens, `--font-code`, `@font-face`, scoped `::selection` | Modify (append) |
| `public/fonts/README.md` | Document the four `MonacoLigaturized` woff2 filenames the user must drop in | Create |
| `src/components/home/CodeEditor/editorFiles.ts` | Token types + token constructors + the two tokenized files (`about.ts`, `beliefs.ts`) | Create |
| `src/components/home/CodeEditor/CodeEditor.module.css` | Editor layout (CSS grid), chrome, syntax colors, caret, tooltip, responsive, reduced-motion | Create |
| `src/components/home/CodeEditor/tokens.tsx` | `TokenSpan` — one token → colored/emphasized span (+ optional tooltip) | Create |
| `src/components/home/CodeEditor/useReveal.ts` | In-view + reduced-motion detection hook | Create |
| `src/components/home/CodeEditor/CodeEditor.tsx` | IDE shell, tab/file state, `CodeReveal` line-reveal child | Create |
| `src/components/home/AboutSection.tsx` | Swap the two prose columns for `<CodeEditor />`; keep stats row | Modify |

---

### Task 1: Theme tokens, font face, and fonts README

**Files:**
- Modify: `src/app/globals.css` (append at end of file)
- Create: `public/fonts/README.md`

- [ ] **Step 1: Append Catppuccin tokens, `--font-code`, `@font-face`, and editor selection to `globals.css`**

Append the following block to the **end** of `src/app/globals.css`:

```css
/* ── Catppuccin (Latte = light, Mocha = dark) for the About code editor ── */
:root {
  --ctp-base: #eff1f5;
  --ctp-mantle: #e6e9ef;
  --ctp-crust: #dce0e8;
  --ctp-text: #4c4f69;
  --ctp-overlay2: #7c7f93;
  --ctp-overlay1: #8c8fa1;
  --ctp-overlay0: #9ca0b0;
  --ctp-surface2: #acb0be;
  --ctp-surface1: #bcc0cc;
  --ctp-surface0: #ccd0da;
  --ctp-mauve: #8839ef;
  --ctp-blue: #1e66f5;
  --ctp-green: #40a02b;
  --ctp-yellow: #df8e1d;
  --ctp-peach: #fe640b;
  --ctp-sky: #04a5e5;

  --font-code: 'MonacoLigaturized', ui-monospace, var(--font-geist-mono),
    'SFMono-Regular', Menlo, Consolas, monospace;
}

.dark {
  --ctp-base: #1e1e2e;
  --ctp-mantle: #181825;
  --ctp-crust: #11111b;
  --ctp-text: #cdd6f4;
  --ctp-overlay2: #9399b2;
  --ctp-overlay1: #7f849c;
  --ctp-overlay0: #6c7086;
  --ctp-surface2: #585b70;
  --ctp-surface1: #45475a;
  --ctp-surface0: #313244;
  --ctp-mauve: #cba6f7;
  --ctp-blue: #89b4fa;
  --ctp-green: #a6e3a1;
  --ctp-yellow: #f9e2af;
  --ctp-peach: #fab387;
  --ctp-sky: #89dceb;
}

/* MonacoLigaturized — user supplies the woff2 files (see public/fonts/README.md).
   Plain @font-face (not next/font) keeps the build green before the files exist;
   the editor falls back to ui-monospace / Geist Mono until they land. */
@font-face {
  font-family: 'MonacoLigaturized';
  src: url('/fonts/MonacoLigaturized-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'MonacoLigaturized';
  src: url('/fonts/MonacoLigaturized-Italic.woff2') format('woff2');
  font-weight: 400;
  font-style: italic;
  font-display: swap;
}
@font-face {
  font-family: 'MonacoLigaturized';
  src: url('/fonts/MonacoLigaturized-Bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'MonacoLigaturized';
  src: url('/fonts/MonacoLigaturized-BoldItalic.woff2') format('woff2');
  font-weight: 700;
  font-style: italic;
  font-display: swap;
}
```

- [ ] **Step 2: Create `public/fonts/README.md`**

```markdown
# Fonts

## Clash Display (committed)
`ClashDisplay-{Regular,Semibold,Bold}.woff2` — loaded via `next/font/local` in `src/app/layout.tsx`.

## MonacoLigaturized (you supply)
The About-section code editor uses `MonacoLigaturized Nerd Font` via plain `@font-face`
in `src/app/globals.css`. Drop these four woff2 files here to activate it:

- `MonacoLigaturized-Regular.woff2`
- `MonacoLigaturized-Italic.woff2`
- `MonacoLigaturized-Bold.woff2`
- `MonacoLigaturized-BoldItalic.woff2`

Until they exist the editor falls back to `ui-monospace` / Geist Mono (ligatures
appear automatically once the files are present). Convert your `.ttf`/`.otf` with
`woff2_compress` or https://transfonter.org (enable WOFF2 only).
```

- [ ] **Step 3: Lint**

Run: `bun run lint`
Expected: no new errors (CSS is not linted by ESLint; this confirms nothing else broke).

- [ ] **Step 4: Verify tokens landed**

Run: `grep -c "ctp-mauve" src/app/globals.css`
Expected: `2` (one in `:root`, one in `.dark`).

- [ ] **Step 5: Commit**

```bash
git add src/app/globals.css public/fonts/README.md
git commit -m "feat(about): add Catppuccin tokens + MonacoLigaturized font-face"
```

---

### Task 2: Editor data model + tokenized content

**Files:**
- Create: `src/components/home/CodeEditor/editorFiles.ts`

- [ ] **Step 1: Create `editorFiles.ts` with types, token constructors, and both files**

```ts
export type TokenType =
  | 'keyword'
  | 'func'
  | 'type'
  | 'string'
  | 'number'
  | 'property'
  | 'variable'
  | 'operator'
  | 'punct'
  | 'comment';

export interface Token {
  text: string;
  type?: TokenType; // omit → default editor text color
  bold?: boolean; // `return` + declared/exported identifiers
  tip?: string; // hover/focus tooltip
}

export type Line = Token[];

export interface EditorFile {
  name: string;
  lines: Line[];
}

// Compact token constructors keep the content readable.
const kw = (text: string, bold = false): Token => ({ text, type: 'keyword', bold });
const fn = (text: string, bold = false, tip?: string): Token => ({ text, type: 'func', bold, tip });
const ty = (text: string, bold = false): Token => ({ text, type: 'type', bold });
const str = (text: string, tip?: string): Token => ({ text, type: 'string', tip });
const num = (text: string, tip?: string): Token => ({ text, type: 'number', tip });
const prop = (text: string, tip?: string): Token => ({ text, type: 'property', tip });
const vr = (text: string, bold = false, tip?: string): Token => ({ text, type: 'variable', bold, tip });
const op = (text: string): Token => ({ text, type: 'operator' });
const p = (text: string): Token => ({ text, type: 'punct' });
const cm = (text: string): Token => ({ text, type: 'comment' });
const tx = (text: string): Token => ({ text }); // whitespace / default

export const aboutFile: EditorFile = {
  name: 'about.ts',
  lines: [
    [cm('/** Full-stack developer turned AI engineer.')],
    [cm(' *  Shipping production LLM systems & enterprise web apps. */')],
    [],
    [kw('const'), tx(' '), vr('developer', true), tx(' '), op('='), tx(' '), p('{')],
    [tx('  '), prop('name'), p(':'), tx(' '), str('"Defang"'), p(',')],
    [
      tx('  '),
      prop('role', 'Two hats — I build the model layer and the pixels.'),
      p(':'),
      tx(' '),
      str('"AI Engineer | Full Stack Developer"'),
      p(','),
    ],
    [tx('  '), prop('sex'), p(':'), tx(' '), str('"male"'), p(','), tx('          '), cm('// ♂')],
    [
      tx('  '),
      prop('age', 'Hex flex: 0x1A === 26.'),
      p(':'),
      tx(' '),
      num('0x1A', '0x1A === 26'),
      p(','),
      tx('            '),
      cm('// 26, because hex is cooler'),
    ],
    [
      tx('  '),
      prop('focus'),
      p(':'),
      tx(' '),
      p('['),
      str('"multi-agent backends"'),
      p(','),
      tx(' '),
      str('"generative UI"'),
      p(']'),
      p(','),
    ],
    [p('}'), tx(' '), kw('satisfies'), tx(' '), ty('Developer'), p(';')],
    [],
    [
      kw('export'),
      tx(' '),
      kw('function'),
      tx(' '),
      fn('currentlyBuilding', true, 'What I ship after hours.'),
      p('('),
      p(')'),
      tx(' '),
      p('{'),
    ],
    [tx('  '), kw('return', true), tx(' '), p('[')],
    [tx('    '), str('"AI-driven Agentic ERP — multi-agent workflows + Generative UI"'), p(',')],
    [
      tx('    '),
      str(
        '"Info Radar — AI news, distilled into a daily digest"',
        'My daily AI-news radar — the Horizon digest on this site.',
      ),
      p(','),
    ],
    [tx('  '), p(']'), p(';')],
    [p('}')],
  ],
};

export const beliefsFile: EditorFile = {
  name: 'beliefs.ts',
  lines: [
    [
      kw('type'),
      tx(' '),
      ty('Belief', true),
      tx(' '),
      op('='),
      tx(' '),
      p('{'),
      tx(' '),
      prop('principle'),
      p(':'),
      tx(' '),
      ty('string'),
      p(';'),
      tx(' '),
      prop('because'),
      p(':'),
      tx(' '),
      ty('string'),
      p(';'),
      tx(' '),
      p('}'),
      p(';'),
    ],
    [],
    [
      kw('export'),
      tx(' '),
      kw('const'),
      tx(' '),
      vr('beliefs', true, 'What I optimize for, in order.'),
      p(':'),
      tx(' '),
      ty('Belief'),
      p('['),
      p(']'),
      tx(' '),
      op('='),
      tx(' '),
      p('['),
    ],
    [tx('  '), p('{'), tx(' '), prop('principle'), p(':'), tx(' '), str('"Ship, then learn"'), p(',')],
    [
      tx('    '),
      prop('because'),
      p(':'),
      tx(' '),
      str('"Real feedback from production beats any amount of planning."'),
      tx(' '),
      p('}'),
      p(','),
    ],
    [tx('  '), p('{'), tx(' '), prop('principle'), p(':'), tx(' '), str('"Build end-to-end"'), p(',')],
    [
      tx('    '),
      prop('because'),
      p(':'),
      tx(' '),
      str('"Context collapse across layers is where the real problems live."'),
      tx(' '),
      p('}'),
      p(','),
    ],
    [tx('  '), p('{'), tx(' '), prop('principle'), p(':'), tx(' '), str('"Learn in public"'), p(',')],
    [
      tx('    '),
      prop('because'),
      p(':'),
      tx(' '),
      str('"If I can\'t explain what I built, I don\'t fully understand it yet."'),
      tx(' '),
      p('}'),
      p(','),
    ],
    [tx('  '), p('{'), tx(' '), prop('principle'), p(':'), tx(' '), str('"AI is the craft"'), p(',')],
    [
      tx('    '),
      prop('because'),
      p(':'),
      tx(' '),
      str('"Not a tool I use — the thing I think about most."'),
      tx(' '),
      p('}'),
      p(','),
    ],
    [p(']'), p(';')],
    [],
    [
      kw('export'),
      tx(' '),
      kw('function'),
      tx(' '),
      fn('whatIBelieve', true),
      p('('),
      p(')'),
      tx(' '),
      p('{'),
    ],
    [
      tx('  '),
      kw('return', true),
      tx(' '),
      vr('beliefs'),
      p('.'),
      fn('map'),
      p('('),
      p('('),
      vr('b'),
      p(')'),
      tx(' '),
      op('=>'),
      tx(' '),
      vr('b'),
      p('.'),
      prop('principle'),
      p(')'),
      p(';'),
    ],
    [p('}')],
  ],
};
```

- [ ] **Step 2: Type-check**

Run: `bunx tsc --noEmit`
Expected: PASS with no errors referencing `editorFiles.ts`. (If pre-existing unrelated errors appear, confirm none point at this file.)

- [ ] **Step 3: Lint**

Run: `bun run lint`
Expected: no errors in `editorFiles.ts`.

- [ ] **Step 4: Commit**

```bash
git add src/components/home/CodeEditor/editorFiles.ts
git commit -m "feat(about): tokenized about.ts / beliefs.ts editor content"
```

---

### Task 3: Editor styles (CSS Module)

**Files:**
- Create: `src/components/home/CodeEditor/CodeEditor.module.css`

> Created before `tokens.tsx`/`CodeEditor.tsx` because those import it. Class names `keyword`, `func`, `type`, `string`, `number`, `property`, `variable`, `operator`, `punct`, `comment` must match `TokenType` exactly (the renderer does `styles[token.type]`).

- [ ] **Step 1: Create `CodeEditor.module.css`**

```css
.shell {
  width: 100%;
}

.editor {
  display: grid;
  grid-template-columns: 48px 200px 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    'title title title'
    'activity explorer main'
    'status status status';
  min-height: 460px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--ctp-crust);
  background: var(--ctp-base);
  box-shadow: var(--shadow-xl);
  overflow: hidden;
  color: var(--ctp-text);
  font-family: var(--font-code);
  font-variant-ligatures: contextual;
  font-feature-settings: 'calt' 1, 'liga' 1;
  font-size: 13.5px;
  line-height: 1.65;
  transition: box-shadow 0.4s ease, transform 0.4s ease;
}

.editor:hover {
  box-shadow: 0 28px 70px -24px color-mix(in srgb, var(--ctp-mauve) 38%, transparent);
}

.editor ::selection {
  background: var(--ctp-surface2);
  color: var(--ctp-text);
}

/* Title bar */
.titlebar {
  grid-area: title;
  display: flex;
  align-items: center;
  gap: 12px;
  height: 38px;
  padding: 0 14px;
  background: var(--ctp-mantle);
  border-bottom: 1px solid var(--ctp-crust);
}
.lights {
  display: flex;
  gap: 8px;
}
.light {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  line-height: 1;
  color: rgba(0, 0, 0, 0.55);
}
.close {
  background: #ec6a5e;
}
.min {
  background: #f4bf4f;
}
.max {
  background: #61c554;
}
.lights:hover .close::after {
  content: '\00d7';
}
.lights:hover .min::after {
  content: '\2013';
}
.lights:hover .max::after {
  content: '\002b';
}
.title {
  flex: 1;
  text-align: center;
  font-family: var(--font-geist-sans), sans-serif;
  font-size: 12px;
  color: var(--ctp-overlay1);
  letter-spacing: 0.02em;
}
.titleRight {
  width: 52px;
}

/* Activity bar */
.activity {
  grid-area: activity;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  padding: 14px 0;
  background: var(--ctp-crust);
}
.actIcon {
  width: 22px;
  height: 22px;
  color: var(--ctp-overlay0);
  cursor: pointer;
  transition: color 0.2s ease;
}
.actIcon:hover {
  color: var(--ctp-text);
}
.actActive {
  color: var(--ctp-text);
}

/* Explorer */
.explorer {
  grid-area: explorer;
  background: var(--ctp-mantle);
  border-right: 1px solid var(--ctp-crust);
  padding: 12px 8px;
  font-family: var(--font-geist-sans), sans-serif;
  overflow: hidden;
}
.explorerTitle {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--ctp-overlay1);
  padding: 4px 8px 8px;
}
.folder {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12.5px;
  color: var(--ctp-text);
  padding: 2px 6px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-weight: 600;
}
.folderChevron {
  width: 14px;
  height: 14px;
  color: var(--ctp-overlay1);
}
.tree {
  list-style: none;
  margin: 4px 0 0;
  padding: 0;
}
.treeItem {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 4px 8px 4px 22px;
  border: 0;
  background: transparent;
  font: inherit;
  font-size: 12.5px;
  color: var(--ctp-overlay1);
  cursor: pointer;
  border-radius: 6px;
  text-align: left;
  transition: background 0.2s ease, color 0.2s ease;
}
.treeItem:hover {
  background: color-mix(in srgb, var(--ctp-surface0) 60%, transparent);
  color: var(--ctp-text);
}
.treeActive {
  background: color-mix(in srgb, var(--ctp-surface0) 85%, transparent);
  color: var(--ctp-text);
}
.treeItem:focus-visible {
  outline: 2px solid var(--ctp-blue);
  outline-offset: -2px;
}
.fileIcon {
  width: 15px;
  height: 15px;
  color: var(--ctp-blue);
  flex: none;
}

/* Main = tabs + code */
.main {
  grid-area: main;
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.tabs {
  display: flex;
  align-items: stretch;
  background: var(--ctp-mantle);
  border-bottom: 1px solid var(--ctp-crust);
  overflow-x: auto;
  scrollbar-width: none;
}
.tabs::-webkit-scrollbar {
  display: none;
}
.tab {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 0 14px;
  height: 36px;
  border: 0;
  border-right: 1px solid var(--ctp-crust);
  background: transparent;
  color: var(--ctp-overlay1);
  font: inherit;
  font-size: 12.5px;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s ease, color 0.2s ease;
}
.tab:hover {
  color: var(--ctp-text);
}
.tabActive {
  background: var(--ctp-base);
  color: var(--ctp-text);
  box-shadow: inset 0 2px 0 var(--ctp-mauve);
}
.tab:focus-visible {
  outline: 2px solid var(--ctp-blue);
  outline-offset: -2px;
}
.tabIcon {
  width: 14px;
  height: 14px;
  color: var(--ctp-blue);
  flex: none;
}
.tabClose {
  width: 13px;
  height: 13px;
  color: var(--ctp-overlay1);
  border-radius: 4px;
}
.tabClose:hover {
  color: var(--ctp-text);
}
.codeScroll {
  flex: 1;
  overflow: auto;
  padding: 14px 0;
}

/* Code */
.code {
  min-width: max-content;
}
.line {
  display: flex;
  align-items: flex-start;
  min-height: 1.65em;
  padding: 0 16px;
  opacity: 0;
  transform: translateX(-6px);
  transition: opacity 0.35s ease, transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}
.shown {
  opacity: 1;
  transform: none;
}
.line:hover {
  background: color-mix(in srgb, var(--ctp-surface0) 55%, transparent);
}
.gutter {
  width: 34px;
  flex: none;
  text-align: right;
  padding-right: 16px;
  color: var(--ctp-overlay0);
  user-select: none;
  transition: color 0.2s ease;
}
.line:hover .gutter {
  color: var(--ctp-text);
}
.lineContent {
  white-space: pre;
}

/* Caret */
.caret {
  display: inline-block;
  width: 2px;
  height: 1.05em;
  background: var(--ctp-blue);
  margin-left: 1px;
  vertical-align: text-bottom;
  transform: translateY(2px);
  animation: caretBlink 1.05s steps(1) infinite;
}
@keyframes caretBlink {
  0%,
  49% {
    opacity: 1;
  }
  50%,
  100% {
    opacity: 0;
  }
}

/* Tokens */
.tok {
  transition: color 0.2s ease;
}
.keyword {
  color: var(--ctp-mauve);
  font-style: italic;
}
.func {
  color: var(--ctp-blue);
}
.type {
  color: var(--ctp-yellow);
}
.string {
  color: var(--ctp-green);
}
.number {
  color: var(--ctp-peach);
}
.property {
  color: var(--ctp-text);
}
.variable {
  color: var(--ctp-text);
}
.operator {
  color: var(--ctp-sky);
}
.punct {
  color: var(--ctp-overlay2);
}
.comment {
  color: var(--ctp-overlay1);
  font-style: italic;
}
.bold {
  font-weight: 700;
}

/* Interactive tooltip */
.interactive {
  position: relative;
  cursor: help;
  text-decoration: underline dotted var(--ctp-overlay1);
  text-underline-offset: 3px;
}
.interactive::after {
  content: attr(data-tip);
  position: absolute;
  left: 0;
  bottom: calc(100% + 8px);
  width: max-content;
  max-width: 260px;
  white-space: normal;
  background: var(--ctp-surface0);
  color: var(--ctp-text);
  border: 1px solid var(--ctp-surface1);
  padding: 6px 10px;
  border-radius: 8px;
  font-family: var(--font-geist-sans), sans-serif;
  font-size: 12px;
  line-height: 1.45;
  box-shadow: var(--shadow-lg);
  opacity: 0;
  transform: translateY(4px) scale(0.96);
  transform-origin: bottom left;
  pointer-events: none;
  transition: opacity 0.18s ease, transform 0.18s ease;
  z-index: 5;
}
.interactive:hover::after,
.interactive:focus-visible::after {
  opacity: 1;
  transform: translateY(0) scale(1);
}
.interactive:focus-visible {
  outline: none;
}

/* Status bar */
.statusbar {
  grid-area: status;
  display: flex;
  align-items: center;
  gap: 14px;
  height: 26px;
  padding: 0 14px;
  background: var(--ctp-mauve);
  color: var(--ctp-crust);
  font-family: var(--font-geist-sans), sans-serif;
  font-size: 11.5px;
}
.statusItem {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.statusIcon {
  width: 12px;
  height: 12px;
}
.statusGap {
  flex: 1;
}

/* Responsive */
@media (max-width: 768px) {
  .editor {
    grid-template-columns: 40px 1fr;
    grid-template-areas:
      'title title'
      'activity main'
      'status status';
    min-height: 420px;
    font-size: 12px;
  }
  .explorer {
    display: none;
  }
  .activity {
    gap: 14px;
    padding: 12px 0;
  }
  .actIcon {
    width: 19px;
    height: 19px;
  }
  .gutter {
    width: 26px;
    padding-right: 10px;
  }
  .statusItem:nth-last-child(-n + 2) {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .line {
    transition: none;
    transform: none;
    opacity: 1;
  }
  .caret {
    animation: none;
  }
  .editor {
    transition: none;
  }
}
```

- [ ] **Step 2: Lint**

Run: `bun run lint`
Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/home/CodeEditor/CodeEditor.module.css
git commit -m "feat(about): Catppuccin code-editor styles (chrome, syntax, caret, tooltip)"
```

---

### Task 4: Token renderer

**Files:**
- Create: `src/components/home/CodeEditor/tokens.tsx`

- [ ] **Step 1: Create `tokens.tsx`**

```tsx
import type { Token } from './editorFiles';
import styles from './CodeEditor.module.css';

export function TokenSpan({ token }: { token: Token }) {
  const className = [
    styles.tok,
    token.type ? styles[token.type] : null,
    token.bold ? styles.bold : null,
    token.tip ? styles.interactive : null,
  ]
    .filter(Boolean)
    .join(' ');

  if (token.tip) {
    return (
      <span className={className} data-tip={token.tip} tabIndex={0}>
        {token.text}
      </span>
    );
  }
  return <span className={className}>{token.text}</span>;
}
```

- [ ] **Step 2: Lint + type-check**

Run: `bun run lint && bunx tsc --noEmit`
Expected: PASS (no errors in `tokens.tsx`).

- [ ] **Step 3: Commit**

```bash
git add src/components/home/CodeEditor/tokens.tsx
git commit -m "feat(about): token → colored span renderer with tooltips"
```

---

### Task 5: In-view + reduced-motion hook

**Files:**
- Create: `src/components/home/CodeEditor/useReveal.ts`

> Mirrors the existing `ScrollReveal` logic (rootMargin `0px 0px -120px 0px`, in-viewport-on-mount short-circuit, reduced-motion respect). Returns a ref to attach to the editor shell.

- [ ] **Step 1: Create `useReveal.ts`**

```ts
'use client';

import { useEffect, useRef, useState } from 'react';

export function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const node = ref.current;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReduced(prefersReduced);

    if (!node) return;

    if (prefersReduced) {
      setInView(true);
      return;
    }

    // Already on screen at mount (e.g. fast scroll / short pages).
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setInView(true);
        observer.disconnect();
      },
      { threshold: 0, rootMargin: '0px 0px -120px 0px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, inView, reduced };
}
```

- [ ] **Step 2: Lint + type-check**

Run: `bun run lint && bunx tsc --noEmit`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/components/home/CodeEditor/useReveal.ts
git commit -m "feat(about): useReveal in-view/reduced-motion hook"
```

---

### Task 6: Editor component (shell + line reveal)

**Files:**
- Create: `src/components/home/CodeEditor/CodeEditor.tsx`

> `mode` is computed each render: `hidden` (pre-scroll, lines in DOM at opacity 0 for SSR/SEO), `instant` (reduced-motion, or a file already seen), `animate` (in view, first time). `CodeReveal` is keyed by `active` so switching files remounts it with a fresh reveal; `seen` (a ref Set) makes a return visit instant. `markSeen` is a stable `useCallback`.

- [ ] **Step 1: Create `CodeEditor.tsx`**

```tsx
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Files,
  Search,
  GitBranch,
  Play,
  Blocks,
  ChevronDown,
  FileCode2,
  X,
  AlertTriangle,
  XCircle,
} from 'lucide-react';
import { aboutFile, beliefsFile, type EditorFile } from './editorFiles';
import { TokenSpan } from './tokens';
import { useReveal } from './useReveal';
import styles from './CodeEditor.module.css';

const FILES: EditorFile[] = [aboutFile, beliefsFile];

type Mode = 'hidden' | 'instant' | 'animate';

function CodeReveal({
  file,
  mode,
  index,
  markSeen,
}: {
  file: EditorFile;
  mode: Mode;
  index: number;
  markSeen: (i: number) => void;
}) {
  const total = file.lines.length;
  const [revealed, setRevealed] = useState(mode === 'animate' ? 0 : mode === 'hidden' ? 0 : total);

  useEffect(() => {
    if (mode === 'instant') {
      setRevealed(total);
      markSeen(index);
      return;
    }
    if (mode === 'hidden') {
      setRevealed(0);
      return;
    }
    // animate
    if (revealed >= total) {
      markSeen(index);
      return;
    }
    const id = setTimeout(() => setRevealed((r) => r + 1), 70);
    return () => clearTimeout(id);
  }, [mode, revealed, total, index, markSeen]);

  return (
    <div className={styles.code}>
      {file.lines.map((line, i) => {
        const shown = i < revealed;
        const isCaretLine = i === revealed - 1;
        return (
          <div className={`${styles.line} ${shown ? styles.shown : ''}`} key={i}>
            <span className={styles.gutter} aria-hidden="true">
              {i + 1}
            </span>
            <span className={styles.lineContent}>
              {line.map((tk, j) => (
                <TokenSpan key={j} token={tk} />
              ))}
              {isCaretLine && <span className={styles.caret} aria-hidden="true" />}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function CodeEditor() {
  const { ref, inView, reduced } = useReveal();
  const [active, setActive] = useState(0);
  const seen = useRef<Set<number>>(new Set());
  const markSeen = useCallback((i: number) => {
    seen.current.add(i);
  }, []);

  const mode: Mode = reduced
    ? 'instant'
    : !inView
      ? 'hidden'
      : seen.current.has(active)
        ? 'instant'
        : 'animate';

  const file = FILES[active];

  return (
    <div ref={ref} className={styles.shell}>
      <div className={styles.editor} aria-label="Code editor showing about and beliefs">
        {/* Title bar */}
        <div className={styles.titlebar}>
          <div className={styles.lights} aria-hidden="true">
            <span className={`${styles.light} ${styles.close}`} />
            <span className={`${styles.light} ${styles.min}`} />
            <span className={`${styles.light} ${styles.max}`} />
          </div>
          <span className={styles.title}>defang — portfolio</span>
          <span className={styles.titleRight} aria-hidden="true" />
        </div>

        {/* Activity bar */}
        <div className={styles.activity} aria-hidden="true">
          <Files className={`${styles.actIcon} ${styles.actActive}`} />
          <Search className={styles.actIcon} />
          <GitBranch className={styles.actIcon} />
          <Play className={styles.actIcon} />
          <Blocks className={styles.actIcon} />
        </div>

        {/* Explorer */}
        <div className={styles.explorer}>
          <div className={styles.explorerTitle}>Explorer</div>
          <div className={styles.folder}>
            <ChevronDown className={styles.folderChevron} aria-hidden="true" />
            <span>portfolio</span>
          </div>
          <ul className={styles.tree}>
            {FILES.map((f, i) => (
              <li key={f.name}>
                <button
                  type="button"
                  className={`${styles.treeItem} ${i === active ? styles.treeActive : ''}`}
                  onClick={() => setActive(i)}
                >
                  <FileCode2 className={styles.fileIcon} aria-hidden="true" />
                  {f.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Main: tabs + code */}
        <div className={styles.main}>
          <div className={styles.tabs} role="tablist" aria-label="Open files">
            {FILES.map((f, i) => (
              <button
                key={f.name}
                type="button"
                role="tab"
                aria-selected={i === active}
                className={`${styles.tab} ${i === active ? styles.tabActive : ''}`}
                onClick={() => setActive(i)}
              >
                <FileCode2 className={styles.tabIcon} aria-hidden="true" />
                <span>{f.name}</span>
                {i === active && <X className={styles.tabClose} aria-hidden="true" />}
              </button>
            ))}
          </div>
          <div className={styles.codeScroll}>
            <CodeReveal file={file} mode={mode} index={active} markSeen={markSeen} key={active} />
          </div>
        </div>

        {/* Status bar */}
        <div className={styles.statusbar} aria-hidden="true">
          <span className={styles.statusItem}>
            <GitBranch className={styles.statusIcon} /> main*
          </span>
          <span className={styles.statusItem}>
            <XCircle className={styles.statusIcon} /> 0
          </span>
          <span className={styles.statusItem}>
            <AlertTriangle className={styles.statusIcon} /> 0
          </span>
          <span className={styles.statusGap} />
          <span className={styles.statusItem}>TypeScript</span>
          <span className={styles.statusItem}>UTF-8</span>
          <span className={styles.statusItem}>LF</span>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Lint + type-check**

Run: `bun run lint && bunx tsc --noEmit`
Expected: PASS. If ESLint flags `react-hooks/exhaustive-deps` on the `CodeReveal` effect, confirm deps are exactly `[mode, revealed, total, index, markSeen]` (they are) — no change needed.

- [ ] **Step 3: Commit**

```bash
git add src/components/home/CodeEditor/CodeEditor.tsx
git commit -m "feat(about): VSCode-style CodeEditor shell with typewriter reveal + tabs"
```

---

### Task 7: Wire the editor into AboutSection

**Files:**
- Modify: `src/components/home/AboutSection.tsx`

- [ ] **Step 1: Add the import**

Add this line to the import block at the top of `src/components/home/AboutSection.tsx` (after the `useCountUp` import):

```tsx
import { CodeEditor } from './CodeEditor/CodeEditor';
```

- [ ] **Step 2: Replace the two prose columns with `<CodeEditor />`**

Replace this exact block (the About & Beliefs grid):

```tsx
        {/* About & Beliefs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="font-display text-3xl font-black mb-4 text-text-primary">
              About Me
            </h2>
            <div className="space-y-4 text-text-secondary leading-relaxed">
              <p>
                I&apos;m a full-stack developer turned AI engineer, with experience
                shipping production LLM systems and complex enterprise web apps.
                I specialize in the full chain — from multi-agent backends with
                LangGraph to generative UI frontends in React.
              </p>
              <p>
                When I&apos;m not shipping code, I&apos;m exploring new AI frameworks,
                writing about what I&apos;ve learned, or working on a side project.
                I believe in learning in public and sharing knowledge freely.
              </p>
              <p>
                Currently building an AI-driven Agentic ERP system at Nuobinteng,
                architecting multi-agent workflows and Generative UI with SSE streaming.
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-display text-3xl font-black mb-6 text-text-primary">
              What I believe
            </h2>
            <div className="flex flex-col gap-5">
              {beliefs.map((item) => (
                <div key={item.heading}>
                  <p className="text-sm font-semibold text-primary mb-1">{item.heading}</p>
                  <p className="text-text-secondary text-sm leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
```

with:

```tsx
        {/* About & beliefs, rendered as code */}
        <CodeEditor />
```

- [ ] **Step 3: Remove the now-unused `beliefs` constant**

The `beliefs` array (declared near the top of the file, used only by the block just removed) is now dead. Delete this exact declaration:

```tsx
const beliefs = [
  { heading: 'Ship, then learn',   body: 'Real feedback from production beats any amount of planning. I ship early and iterate fast.' },
  { heading: 'Build end-to-end',   body: "I own the whole stack — backend, API, frontend. Context collapse across layers is where the real problems live." },
  { heading: 'Learn in public',    body: "Writing forces clarity. If I can't explain what I built, I don't fully understand it yet." },
  { heading: 'AI is the craft',    body: "Not a tool I use — the thing I think about most. The models, the patterns, the failures, and where it's all going." },
];
```

(The `stats` array, `StatCounter`, and the stats grid stay — they are untouched.)

- [ ] **Step 4: Lint + type-check (catches the unused-var / unused-import case)**

Run: `bun run lint && bunx tsc --noEmit`
Expected: PASS, with no "`beliefs` is declared but never read" error.

- [ ] **Step 5: Commit**

```bash
git add src/components/home/AboutSection.tsx
git commit -m "feat(about): render About/Beliefs as the VSCode-style code editor"
```

---

### Task 8: Full build + visual verification (light, dark, reduced-motion, mobile)

**Files:** none (verification only)

- [ ] **Step 1: Production build**

Run: `bun run build`
Expected: `velite` succeeds, then `next build` completes with no type errors and no failed pages.

- [ ] **Step 2: Start the dev server (background) and confirm the port**

Run: `bun run dev:clean; bun run dev` (start in background)
Expected: concurrently boots VELITE + NEXT; note the URL Next prints (default `http://localhost:3000`).

- [ ] **Step 3: Visual check with Playwright — light mode**

Use the Playwright MCP (`document-skills:webapp-testing` / `mcp__plugin_playwright_playwright__*`):
- `browser_navigate` to `http://localhost:3000/`
- Scroll to the editor (it sits below the stats counters): `browser_evaluate` →
  `document.querySelector('[aria-label="Code editor showing about and beliefs"]').scrollIntoView({block:'center'})`
- `browser_wait_for` ~2s to let the line-by-line reveal finish
- `browser_take_screenshot`
Expected: full IDE chrome (traffic lights, activity bar, explorer with `about.ts`/`beliefs.ts`, active tab, gutter line numbers, status bar). `about.ts` content shows Catppuccin **Latte** colors (mauve italic keywords, blue functions, green strings, peach `0x1A`), with `return` and `developer` bold.

- [ ] **Step 4: Tab switch + tooltip**

- `browser_click` the `beliefs.ts` tab → `browser_take_screenshot`. Expected: content swaps to the beliefs file and re-reveals.
- `browser_hover` over the `beliefs` identifier (or `role`/`Info Radar`) → `browser_take_screenshot`. Expected: dotted underline + themed tooltip popover appears above the token.

- [ ] **Step 5: Dark mode**

Toggle the site theme (click the header `ThemeToggle`, or `browser_evaluate` → `document.documentElement.classList.add('dark')`), screenshot. Expected: editor flips to Catppuccin **Mocha** (dark `#1e1e2e` base), status bar text stays readable (uses `--ctp-crust`).

- [ ] **Step 6: Reduced-motion + mobile**

- `browser_evaluate` to emulate reduced motion is limited; instead set the OS/browser emulation if available, reload, and confirm all code is shown instantly with a non-blinking caret and no per-line stagger.
- `browser_resize` to 390×844 → screenshot. Expected: explorer hidden, activity bar narrow, editor full-width, tabs scrollable, status bar condensed (no UTF-8/LF), horizontal code scroll works.

- [ ] **Step 7: Stop the dev server**

Run: `bun run dev:clean`
Expected: VELITE + NEXT processes terminated.

- [ ] **Step 8: Commit (only if any fixes were needed during verification)**

```bash
git add -A
git commit -m "fix(about): address issues found during visual verification"
```

(Skip if no fixes were required.)

---

### Task 9: Design-language polish pass (ui-ux-pro-max)

**Files:** likely `CodeEditor.module.css` (and `globals.css` tokens if contrast tweaks needed)

- [ ] **Step 1: Consult the design skill**

Invoke `ui-ux-pro-max:ui-ux-pro-max` (action: review/improve; element: card/editor; topics: color systems, shadow, spacing, animation, accessibility, dark mode). Apply its concrete recommendations on: shadow depth + hover glow, spacing rhythm inside the editor, contrast of overlay/comment tokens against `base` (verify AA in both Latte and Mocha), and reveal/tooltip timing.

- [ ] **Step 2: Apply refinements** in `CodeEditor.module.css` (and `globals.css` only if a token value needs an accessibility nudge). Keep changes scoped to the editor.

- [ ] **Step 3: Re-verify**

Run: `bun run lint && bun run build`
Expected: PASS. Re-screenshot light + dark via Playwright (repeat Task 8 steps 2–7) to confirm the polish improved, not regressed, the look.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "style(about): ui-ux-pro-max polish pass on the code editor"
```

---

## Self-Review

**1. Spec coverage:**
- Editor replaces two prose columns, stats row kept → Task 7. ✓
- Local `MonacoLigaturized` woff2 + graceful fallback + README → Task 1. ✓
- Full IDE chrome (titlebar/activity/explorer/tabs/gutter/status) → Task 6 + Task 3. ✓
- Catppuccin Latte/Mocha via `.dark` tokens + official syntax mapping + bold `return`/declarations + italic keywords/comments → Tasks 1, 2, 3. ✓
- Typewriter reveal on scroll, blinking caret, tabs, hover tooltips, themed `::selection`, hover glow → Tasks 3, 6. ✓
- Reduced-motion, responsive, SSR-safe selectable text, accessible tabs → Tasks 3, 5, 6. ✓
- Content edits (role combined, no company/stack, `sex` + `♂`, `age: 0x1A`, `currentlyBuilding` array incl. Info Radar) → Task 2. ✓
- `ui-ux-pro-max` design-language pass → Task 9. ✓

**2. Placeholder scan:** No TBD/TODO/"add error handling"/"similar to Task N"; every code step has full code. ✓

**3. Type consistency:** `Token`/`TokenType`/`Line`/`EditorFile` defined in Task 2 and consumed unchanged in Tasks 4 & 6; `useReveal()` returns `{ ref, inView, reduced }` (Task 5) consumed exactly in Task 6; `CodeReveal` props `{ file, mode, index, markSeen }` and `Mode` union are internal to Task 6 and self-consistent; CSS class names match `TokenType` values used by `styles[token.type]` (Tasks 3 ↔ 4). ✓
