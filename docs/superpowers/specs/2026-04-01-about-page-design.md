# About Page Design Spec

**Date:** 2026-04-01  
**Route:** `/about`  
**File:** `src/app/about/page.tsx`

---

## Overview

A full-scroll About page with 5 sections: Hero (typewriter), My Story, Timeline (film tape carousel), What I'm Doing Now, and Contact CTA. Pure black background, Apple SF Pro Display typography, gold (`#f2c94c`) accent color.

---

## Section 1 — Hero (Typewriter)

**Full viewport height** (`min-h-screen`), centered content, pure black background (`#000`) with a subtle radial gold glow behind the text.

### Typography
- Font: `-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif`
- Size: `52px` (desktop), scale down on mobile
- Weight: `700`
- Letter-spacing: `-0.04em`
- Word-spacing: `0.12em`

### Typewriter Sequence (loops forever)
1. **Phase 1** — Type char-by-char at 75ms: `Hi, I'm Defang`  
   - "Defang" renders in gold `#f2c94c`; rest in `#f5f5f7`
2. Pause 900ms
3. Delete backwards at 38ms until empty
4. **Phase 2** — Type word-by-word at 130ms: `Do what you set out to do — And do it better than before`  
   - Full text in `rgba(245, 245, 247, 0.85)`
5. Pause 4500ms → loop

### Badge & Buttons
- Frosted pill badge above title: green dot + "Available for freelance"  
  - Background: `rgba(255,255,255,0.06)`, border: `rgba(255,255,255,0.1)`
- Below typewriter: two pill buttons (`border-radius: 980px`)
  - Primary: gold background (`#f2c94c`), black text — "Read my articles"
  - Secondary: frosted glass — "Say hello"

---

## Section 2 — My Story

Two-column layout (single column on mobile). Left: pull-quote in large weight. Right: 2–3 short paragraphs about how I got into coding, self-taught philosophy, learning in public.

Background: slightly elevated surface (`#0a0e15` or similar).

---

## Section 3 — Timeline (Film Tape Carousel)

Auto-scrolling horizontal film tape. Pauses on hover.

### Structure
- Two rows of sprocket holes (top + bottom): evenly spaced circles, `rgba(255,255,255,0.12)` border
- Cards between sprocket rows: `200px` wide, separated by `2px` vertical dividers
- Animation: `tape-scroll` infinite linear `18s`
- Left/right fade masks: gradient from `#000` to transparent

### Cards (5 milestone entries)
| Year | Event |
|------|-------|
| 2019 | First line of code |
| 2020 | First freelance project |
| 2022 | Launched this blog |
| 2024 | First SaaS shipped |
| Now  | AI tools & Three.js |

- Default card: dark background, white year label, gray description
- "Now" card: gold glow border, `#f2c94c` year text, pulsing dot

### Hover Behavior
`:hover` on the tape container sets `animation-play-state: paused` on all animated children.

---

## Section 4 — What I'm Doing Now

Three equal cards in a row (stack on mobile):
- 🔨 Building — AI-powered writing tools, LLM exploration
- 📖 Learning — WebGL shaders, advanced Three.js
- ✍️ Writing — React patterns, indie hacking, creative coding

Card style: `#161b22` background, `1px solid #21262d` border, `border-radius: 8px`.

---

## Section 5 — Contact / CTA

Centered, minimal. "Want to work together?" heading, short subtext, email + GitHub + Twitter buttons.

Primary CTA: gold pill with email address. Secondary: frosted glass social links.

---

## Implementation Notes

- No Tech Stack section (excluded per design decision)
- All sections use `section` HTML element with consistent `padding: 80px 24px` (desktop) / `48px 16px` (mobile)
- Framer Motion `FadeIn` + `StaggerChildren` wrappers for story and "now" sections
- Timeline tape implemented in pure CSS (no JS scroll library)
- Page uses the existing global theme — black background overrides site surface in hero; rest can follow site surface color
- `src/app/about/page.tsx` — Server Component (no `"use client"` needed at page level); typewriter extracted to a Client Component
