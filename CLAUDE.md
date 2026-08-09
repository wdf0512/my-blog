# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun run dev        # Start dev server (runs velite --watch & next dev concurrently)
bun run build      # Build for production (velite then next build)
bun run test       # Vitest, single run
bun run test:watch # Vitest in watch mode
bun run lint       # ESLint over the repo
bun run format     # Prettier format src/**/*.{ts,tsx,js,jsx,json,css,md}
```

Tests run on Vitest (`vitest.config.mts`, picking up `src/**/*.test.ts`). Coverage is
deliberately narrow: `src/lib/issues/` only. Everything else is untested, so a change
outside that module is verified by `bun run build` and `bunx tsc --noEmit`.

`bun run lint` currently reports 15 pre-existing problems, all of them React-hooks rules
in components. Treat that count as the baseline — a change should not raise it.

## Architecture

**Stack**: Next.js (App Router) + Velite (MDX) + React Three Fiber + framer-motion + Tailwind CSS v3.4 + TypeScript

### Content Pipeline

Blog posts are authored as `.mdx` files in `content/posts/**/*.mdx`, digests in `content/digests/*.mdx`. Velite processes them and outputs typed data to `.velite/` (imported as `'#/.velite'`). MDX uses `rehype-pretty-code` (Shiki, github-dark/light themes), `rehype-slug`, and `rehype-autolink-headings`.

Reading time is measured differently per collection, and one of the two is wrong. Digests use `s.metadata()`, which measures the raw markdown. Posts still use `computedFields`, which runs *after* `s.mdx()` has compiled the body — so post reading times count minified JS tokens, not prose. Known defect, recorded in the out-of-scope list of issue #1.

Post frontmatter fields: `title`, `slug`, `date` (ISO), `published` (default true), `description`, `tags`.

Static params for blog posts are generated via `generateStaticParams()` in `src/app/blog/[slug]/page.tsx`.

### The daily brief

The bilingual daily brief is separate content from blog Posts, with its own vocabulary — read `CONTEXT.md` before working on it. A **Digest** is the authored `.mdx` file; an **Issue** is what a reader opens, one per language per day.

`src/lib/issues/` owns the whole assembly:

- `build.ts` — pure. Numbering, the Companion link, neighbours, the visibility rule. Imports nothing generated, so it is driven from fixtures in tests.
- `memo.ts` — per-day memoisation, keyed by UTC day.
- `index.ts` — the Velite wiring and the page-facing interface: `getIssues(lang, now?)`, `getIssue(lang, slug, now?)`, `DIGEST_LANGS`, `isDigestLang`.

**Pages must not re-derive Issue fields from the raw `digests` rows.** Three pages doing exactly that, and drifting apart, is why the module exists — it produced a sitemap that advertised a 404. Add the field to `Issue` instead.

Issue numbers are assigned **across** languages (grouped by `issue_id`); neighbours are computed **within** a language. Reversing either breaks prev/next. See `docs/adr/0001-issue-is-per-language.md`.

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
    digest/[locale]/    # Daily brief archive and detail pages
  components/
    3d/                 # ASCII art hero (Character, HeroScene, HeroSceneLoader)
    animations/         # Framer-motion wrappers (FadeIn, ScaleOnHover, StaggerChildren)
    digest/             # Masthead, Colophon, SidebarTOC, LocaleToggle, ScrollProgress
    home/               # Homepage sections (Hero, FeaturedPosts, About, Newsletter)
    layout/             # Header, Footer, ThemeToggle
    mdx/                # MDXContent renderer
    providers/          # ThemeProvider
  lib/
    issues/             # Issue assembly — the daily brief's domain module
```

### Tailwind Custom Tokens

Colors reference CSS variables: `background`, `foreground`, `primary`, `text-primary`, `text-secondary`, `border`, `surface`. Font families: `font-sans` (Geist), `font-mono` (Geist Mono), `font-display` (Clash Display).

## Agent skills

### Issue tracker

Issues live in GitHub Issues for `wdf0512/my-blog`, driven by the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

The five canonical roles, each label string equal to its name. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context — one `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
