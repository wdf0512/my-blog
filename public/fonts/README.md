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
