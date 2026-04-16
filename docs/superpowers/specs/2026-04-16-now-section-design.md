# "What I'm Doing Now" Section — Design Spec
Date: 2026-04-16  
Component: `src/components/about/AboutSections.tsx`

---

## Goal

Replace the current emoji + flat-border card layout with a polished terminal-badge design: borderless cards using shadow elevation, warm colour gradient across the three items, JetBrains Mono typography, and a smooth spring hover interaction.

---

## Visual Design

### Cards
- **No border.** Separation is achieved entirely through background colour and box-shadow.
- **Rest state** — `background: var(--surface)` (maps to `#141414` in dark mode), `box-shadow: 0 2px 8px rgba(0,0,0,0.45)`
- **Hover state** — `background` lightens one step, `transform: translateY(-3px)`, shadow spreads with a warm colour tint, inner radial glow fades in
- **Animation** — `cubic-bezier(0.22, 1, 0.36, 1)` (spring-out ease), `200ms`, `transform` + `opacity` + `box-shadow` only (no width/height)
- **`cursor: pointer`** on each card
- **`@media (prefers-reduced-motion: reduce)`** — disable `transform` and `transition`

### Colours (warm gradient across the three cards)
| Card | Glyph | Accent |
|------|-------|--------|
| Building | `>_` | Amber `#fbbf24` |
| Learning | `λ` | Orange `#fb923c` |
| Writing | `//` | Red `#f87171` |

Each accent is used for: badge text-shadow glow, label colour, hover box-shadow tint, hover radial glow.

### Badge
- `38×38px`, `border-radius: 9px`, `background: #1e1e1e`
- Inner highlight ring via `box-shadow: 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.04)`
- Glyph text-shadow: `0 0 12px rgba(<accent-rgb>, 0.55)`
- Font: JetBrains Mono 700, 13px

### Typography
- Section label: Geist Mono (`var(--font-geist-mono)`, already loaded), 700, 10px, `letter-spacing: 0.18em`, uppercase, amber `#fbbf24`
- Card label: Geist Mono, 700, 10px, `letter-spacing: 0.14em`, uppercase, per-card accent
- Description: system sans-serif (existing `FONT` constant), 13px, `color: var(--text-secondary)`, `line-height: 1.75`
- No new font imports — use existing `font-family: var(--font-geist-mono)` CSS var

### Section Label Animation
- Pulsing dot (7×7px circle) left of label text
- `box-shadow` pulse animation at `2.4s ease-in-out infinite`
- Dot colour: amber `#fbbf24`

---

## Implementation

### Files to change
1. **`src/components/about/AboutSections.tsx`** — update `NOW_ITEMS` array and the card render block
2. **`src/components/about/AboutSections.module.css`** (create) — CSS module for the Now section styles

### CSS approach
Use a new CSS module (`AboutSections.module.css`) for the Now section so animations and hover states are co-located and don't pollute the inline style objects already used for My Story and Contact sections.

### Accessibility
- `cursor: pointer` on each card
- `prefers-reduced-motion` — wrap all transitions and transforms in a `@media` query that disables them
- Colour contrast: amber/orange/red on `#141414` background — all pass WCAG AA for the non-body label use case; description text uses existing `var(--text-secondary)` token which is already contrast-checked

---

## What does NOT change
- Card copy (Building / Learning / Writing descriptions)
- Grid layout (`grid-cols-1 sm:grid-cols-3`)
- Section heading style (`SECTION_LABEL` constant)
- My Story, Contact sections
