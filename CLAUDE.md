# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun run dev      # Start dev server (runs velite --watch & next dev concurrently)
bun run build    # Build for production (velite then next build)
bun run lint     # ESLint via next lint
bun run format   # Prettier format src/**/*.{ts,tsx,js,jsx,json,css,md}
```

No tests are configured.

## Architecture

**Stack**: Next.js (App Router) + Velite (MDX) + React Three Fiber + framer-motion + Tailwind CSS v3.4 + TypeScript

### Content Pipeline

Blog posts are authored as `.mdx` files in `content/posts/**/*.mdx`. Velite processes them and outputs typed data to `.velite/` (imported as `'#/.velite'`). The velite schema (`velite.config.ts`) computes `readingTime` and `wordCount` from the body. MDX uses `rehype-pretty-code` (Shiki, github-dark/light themes), `rehype-slug`, and `rehype-autolink-headings`.

Post frontmatter fields: `title`, `slug`, `date` (ISO), `published` (default true), `description`, `tags`.

Static params for blog posts are generated via `generateStaticParams()` in `src/app/blog/[slug]/page.tsx`.

### Theming

Custom `ThemeProvider` in `src/components/providers/ThemeProvider.tsx` manages dark/light mode via `localStorage` and `document.documentElement.classList.toggle('dark', ...)`. CSS custom properties defined in `globals.css` under `:root` and `.dark`. Primary accent color is `--primary` (#FFD93D light / #F4C430 dark). The `.glass-card` utility class provides glassmorphism.

Font variables: `--font-geist-sans`, `--font-geist-mono` (Geist package), `--font-clash-display` (local woff2 files in `public/fonts/`). Headings use `font-display` (Clash Display).

### 3D / ASCII Hero

`src/components/3d/Character.tsx` renders an animated ASCII-art banana using `requestAnimationFrame` with a diagonal radar-sweep light effect (no Three.js). It is loaded via `HeroSceneLoader` which uses `next/dynamic` with `ssr: false` to avoid hydration issues.

### Component Organization

```
src/
  app/                  # Next.js App Router pages
    blog/[slug]/        # Dynamic blog post pages
  components/
    3d/                 # ASCII art hero (Character, HeroScene, HeroSceneLoader)
    animations/         # Framer-motion wrappers (FadeIn, ScaleOnHover, StaggerChildren)
    home/               # Homepage sections (Hero, FeaturedPosts, About, Newsletter)
    layout/             # Header, Footer, ThemeToggle
    mdx/                # MDXContent renderer
    providers/          # ThemeProvider
```

### Tailwind Custom Tokens

Colors reference CSS variables: `background`, `foreground`, `primary`, `text-primary`, `text-secondary`, `border`, `surface`. Font families: `font-sans` (Geist), `font-mono` (Geist Mono), `font-display` (Clash Display).
