# Daily Brief — Redesign Spec

**Date:** 2026-05-15  
**Scope:** Digest listing page, home page teaser section, digest detail page

---

## Goal

Integrate the auto-generated daily digest into the blog as a natural, first-class section called **Daily Brief** — matching the existing design system (Clash Display, golden primary `#F2C94C`, warm beige background) without any pipeline attribution or Horizon branding.

---

## Design Decisions

| Decision | Choice |
|---|---|
| Listing page layout | A — Editorial Grid (featured large + archive grid) |
| Home page teaser | B — Feature + Recent Strip (dark featured card + beige compact rows) |
| Section title | Daily Brief |
| Horizon / pipeline mentions | Removed everywhere |
| "从X条内容中精选" text | Removed; replaced with "TODAY'S PICKS · N items" pill |

---

## Section 1 — Listing Page (`/digest/page.tsx`)

### Header
- Title: `Daily Brief` — `font-display text-5xl md:text-6xl font-black text-text-primary`
- Subtitle: `Auto-curated, updated every morning` — `text-text-secondary text-xl`
- No description. No "by Horizon" attribution.

### Layout — Editorial Grid
**Featured card** (most recent digest, index 0):
- Full-width dark card, `bg-[#1C1B19]` with themed blue gradient pocket (`from-[#1a3a5c] to-[#0d2035]`)
- Top-left badge: `TODAY'S PICKS` — `bg-primary text-background text-xs font-black px-3 py-1 rounded-lg`
- Top-right: date label in muted ghost style
- Bottom: title (`font-display text-2xl font-black text-white`), item count as `N picks` in primary color
- Hover: `-translate-y-1 shadow-2xl`

**Archive grid** (all older digests):
- 2-column grid below the featured card
- Same dark card aesthetic, smaller (`aspect-auto` not `aspect-video`)
- Day-of-month number displayed large in muted gold as ghost visual
- Title, date, `N picks` — no TODAY badge
- No cover image dependency — all gradient pockets

### Empty state
- Centered: `"No issues yet — check back tomorrow."`

---

## Section 2 — Home Page (`/`)

### New component: `src/components/home/DailyBrief.tsx`

**Placement:** between `HorizontalFeatures` and `FeaturedPosts` in `page.tsx`.

**Section header:**
- `Daily Brief` — same `font-display text-4xl md:text-5xl font-black` as "Latest Articles"
- No subtitle
- `View archive →` right-aligned, links to `/digest`

**2-column layout:**

Left column (wider, ~60%):
- Today's digest as a dark card (`bg-[#1C1B19]`, rounded-3xl)
- Gradient pocket at top: themed blue, height ~140px
- `TODAY'S PICKS` badge (golden primary)
- Title in white `font-display font-black`
- One-line teaser: first sentence of description if available, otherwise omit
- `N picks` count in primary
- Full card is a `<Link>` to `/digest/[slug]`
- Hover: lift + shadow

Right column (~40%):
- 3 most recent past digests as compact rows
- Background: `bg-surface` (warm beige `#E8E5DB`), `rounded-2xl`
- Each row: day-of-month number large in primary/golden (`font-display font-black text-3xl`) + title + `N picks` count
- Each row is a `<Link>` to `/digest/[slug]`
- Hover: `bg-primary/10`

If no digests exist: render nothing (component returns `null`).

---

## Section 3 — Detail Page (`/digest/[slug]/page.tsx`)

### Metadata bar changes
- **Remove:** `total_fetched` display ("从X条内容筛选")
- **Remove:** description shown in meta (it's used as OG description only)
- **Replace with:** `TODAY'S PICKS · N items` pill badge — `bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full`
- Keep: date display
- Keep: cover image hero (gradient fallback if absent)

### Content rendering
- No changes to MDX prose rendering
- Remove any `⚡` emoji from auto-generated badge text
- Page `<title>` metadata: `"[digest.title] — Daily Brief"`

---

## Files to Modify / Create

| File | Action |
|---|---|
| `src/app/digest/page.tsx` | Full rewrite — Editorial Grid layout |
| `src/app/digest/[slug]/page.tsx` | Update metadata bar; remove total_fetched; add TODAY'S PICKS pill |
| `src/components/home/DailyBrief.tsx` | New component — Feature + Recent Strip |
| `src/app/page.tsx` | Add `<DailyBrief />` between HorizontalFeatures and FeaturedPosts |

---

## Design Tokens (reference)

```
primary:        #F2C94C  (golden)
background:     #F4F2EB  (warm beige)
surface:        #E8E5DB
text-primary:   #1C1B19
text-secondary: ~#666
text-muted:     ~#888
border:         ~rgba(0,0,0,0.08)
font-display:   Clash Display (font-black for headings)
dark card bg:   #1C1B19
```

---

## Out of Scope

- Pagination / infinite scroll on the listing page (archive is small; revisit when >20 issues)
- Cover image generation automation (already handled by Gemini in pipeline)
- Changes to MDX content format or `to_blog_post.py`
