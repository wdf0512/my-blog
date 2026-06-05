# Fonts

## Clash Display (committed)
`ClashDisplay-{Regular,Semibold,Bold}.woff2` — loaded via `next/font/local` in `src/app/layout.tsx`.

## MonacoLigaturized Nerd Font Mono (committed)
The About-section code editor uses these via plain `@font-face` in `src/app/globals.css`
(family alias `MonacoLigaturized`):

- `MonacoLigaturizedNerdFontMono-Regular.woff2` — 400 normal
- `MonacoLigaturizedNerdFontMono-Italic.woff2` — 400 italic
- `MonacoLigaturizedNerdFontMono-Bold.woff2` — 700 normal
- `MonacoLigaturizedNerdFontMono-BoldItalic.woff2` — 700 italic

The editor enables ligatures via `font-variant-ligatures: contextual` +
`font-feature-settings: "calt","liga"`. If a file is missing, the editor falls back
to `ui-monospace` / Geist Mono.

> Converted from the upstream `.ttf` (~2.35 MB each) to `.woff2` (~1.08 MB each, ~46%)
> with `fonttools` (`TTFont(src); f.flavor='woff2'; f.save(dst)`, needs `brotli`).
> To regenerate from a new `.ttf`: convert, drop the `.woff2` here, keep the
> `format('woff2')` `src` in `globals.css`.
