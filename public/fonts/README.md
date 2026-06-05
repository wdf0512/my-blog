# Fonts

## Clash Display (committed)
`ClashDisplay-{Regular,Semibold,Bold}.woff2` — loaded via `next/font/local` in `src/app/layout.tsx`.

## MonacoLigaturized Nerd Font Mono (committed)
The About-section code editor uses these via plain `@font-face` in `src/app/globals.css`
(family alias `MonacoLigaturized`):

- `MonacoLigaturizedNerdFontMono-Regular.ttf` — 400 normal
- `MonacoLigaturizedNerdFontMono-Italic.ttf` — 400 italic
- `MonacoLigaturizedNerdFontMono-Bold.ttf` — 700 normal
- `MonacoLigaturizedNerdFontMono-BoldItalic.ttf` — 700 italic

The editor enables ligatures via `font-variant-ligatures: contextual` +
`font-feature-settings: "calt","liga"`. If a file is missing, the editor falls back
to `ui-monospace` / Geist Mono.

> **Performance note:** these are `.ttf` (~2.5 MB each, ~10 MB total). Converting to
> `.woff2` roughly halves each file (and the git footprint). To switch later: convert
> with `fonttools` (`fonttools ttLib.woff2 compress <file>.ttf`) or
> https://transfonter.org (enable WOFF2 only), drop the `.woff2` files here, and change
> each `src: url('…').ttf format('truetype')` to `…woff2 format('woff2')` in `globals.css`.
