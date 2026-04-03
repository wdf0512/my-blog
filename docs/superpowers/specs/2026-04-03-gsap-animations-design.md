# GSAP Advanced Animations — Design Spec
**Date:** 2026-04-03
**Status:** Approved

## Overview

Add GSAP-powered advanced animations to the Home, Blog, and About pages using a hybrid approach: `@gsap/react` hooks for all new complex animations, existing framer-motion components (`FadeIn`, `StaggerChildren`, `ScrollReveal`) left untouched.

Animation personality is **page-specific (hybrid)**:
- Home hero: cinematic parallax entrance + mouse depth
- Blog: snappy 3D flip-in cards + filter morph on tag change
- About: fluid per-section stagger + masked line-by-line text reveal

---

## Architecture

### New files

```
src/
  components/
    providers/
      GSAPProvider.tsx         # Registers ScrollTrigger once; handles reduced-motion
  hooks/
    useParallaxHero.ts         # Home: parallax entrance + mouse depth
    useFlipCards.ts            # Blog: 3D flip-in on scroll enter
    useFilterMorph.ts          # Blog: scale/fade on tag filter change
    useLineReveal.ts           # About: masked line-by-line text reveal
    useSectionStagger.ts       # About: per-section stagger + SVG line draw
```

### Unchanged files

`FadeIn.tsx`, `StaggerChildren.tsx`, `ScrollReveal.tsx`, `ScaleOnHover.tsx` — no modifications.

### Dependency

Install `@gsap/react` (thin React wrapper ~2kb, peer of existing `gsap@^3.12.5`).

---

## GSAPProvider

- Added to `src/app/layout.tsx` as a client boundary wrapper
- Registers `ScrollTrigger` plugin inside `useEffect` (client-only, no SSR issues)
- Checks `window.matchMedia('(prefers-reduced-motion: reduce)')` on mount; if true, sets `gsap.globalTimeline.timeScale(0)` so all animations complete instantly
- No props, no config — purely a side-effect provider

---

## Home — `useParallaxHero`

**Target:** `HeroSection.tsx`

### Entrance
- Text column: `gsap.from(textRef, { x: -60, opacity: 0, duration: 0.9, ease: 'power3.out' })`
- ASCII column: `gsap.from(asciiRef, { x: 60, opacity: 0, duration: 1.2, ease: 'power3.out' })`
- Different durations create perceived depth between the two columns
- Internal text stagger timeline: eyebrow → h1 → p → CTA button, `stagger: 0.12s`, starts after text column begins entering

### Mouse parallax (desktop only)
- `mousemove` listener on the section element
- Text column: `±8px` X/Y offset (subtle)
- ASCII column: `±18px` X/Y offset on opposite axis (exaggerated depth)
- Disabled via `gsap.matchMedia()` at `(max-width: 768px)` — mobile gets entrance only
- Listener removed on unmount via `useGSAP` cleanup

---

## Blog — `useFlipCards` + `useFilterMorph`

**Target:** `BlogFilter.tsx`

### useFlipCards — entrance
- ScrollTrigger fires when the card grid enters the viewport (`start: 'top 80%'`)
- Each card: `gsap.from(card, { rotateY: -45, opacity: 0, duration: 0.5, ease: 'back.out(1.4)' })`
- Stagger: `index * 0.08s` (row-aware — cards in the same row feel simultaneous, next row slightly delayed)
- Requires `perspective` CSS on the grid container (`perspective: 1200px`)

### useFilterMorph — tag filter
- Watches `activeTag` prop via `useEffect` dependency
- On change: `gsap.killTweensOf(allCards)` first (prevents stacking on rapid clicks)
- Non-matching cards: `gsap.to(card, { scale: 0.92, opacity: 0.25, duration: 0.25, ease: 'power2.out' })`
- Matching cards: `gsap.to(card, { scale: 1.02, duration: 0.2 })` then `gsap.to(card, { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.5)' })` — pop then settle
- "All" selected: all cards animate back to `scale: 1, opacity: 1`

---

## About — `useSectionStagger` + `useLineReveal`

**Target:** `AboutPage` sections

### useSectionStagger
- Applied to each `<section>` via a shared hook; each section ref passed individually
- ScrollTrigger per section (`start: 'top 75%'`, `once: true`)
- Children stagger: `gsap.from(children, { y: 32, opacity: 0, stagger: 0.1, duration: 0.6, ease: 'power2.out' })`
- Current sections use CSS `border-top` — replace with `<svg width="100%" height="2"><line x1="0" y1="1" x2="100%" y2="1" stroke="var(--border)" stroke-width="1" /></svg>` at the top of each section. `stroke-dasharray` and `stroke-dashoffset` set to the line length; tween `stroke-dashoffset` to 0 on scroll enter.
- "What I'm Doing Now" cards use `ease: 'back.out(1.7)'` instead of power2 for spring bounce

### useLineReveal
- Applied to the "My Story" quote block
- No GSAP SplitText plugin (Club GSAP) — manual line splitting: each visual line wrapped in `<span class="line-outer"><span class="line-inner">…</span></span>` in JSX
- `.line-outer`: `overflow: hidden; display: block`
- `.line-inner`: `gsap.from(el, { y: '100%', duration: 0.7, ease: 'power3.out', stagger: 0.12 })` on ScrollTrigger enter
- Also applied to body copy paragraphs in My Story section (per-paragraph, not per-word)

---

## Edge Cases

| Scenario | Handling |
|---|---|
| Rapid tag filter clicks | `gsap.killTweensOf` before new tween |
| Reduced motion | `gsap.globalTimeline.timeScale(0)` in GSAPProvider |
| Mobile mouse parallax | Disabled via `gsap.matchMedia` |
| SSR | All hooks use `useGSAP` (client-only); GSAPProvider registers plugins in `useEffect` |
| Component unmount | `useGSAP` context auto-reverts all tweens and ScrollTriggers |
| No posts (empty blog) | `useFlipCards` / `useFilterMorph` guard against empty `refs` array |

---

## Implementation Order

1. Install `@gsap/react`, add `GSAPProvider` to layout
2. `useParallaxHero` → wire into `HeroSection`
3. `useFlipCards` → wire into `BlogFilter`
4. `useFilterMorph` → wire into `BlogFilter`
5. `useSectionStagger` → wire into `AboutPage` sections
6. `useLineReveal` → wire into My Story quote + body copy
