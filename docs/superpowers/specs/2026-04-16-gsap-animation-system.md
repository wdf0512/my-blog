# GSAP Animation System — Design Spec
Date: 2026-04-16
Pages: Home (`/`), Blog (`/blog`), About (`/about`)

---

## Goal

Add 6 GSAP-powered animation effects across all pages using a hook-per-effect architecture. Each effect is a self-contained hook or component that can be dropped onto any component independently. The result: a few high-impact signature moments (plane, horizontal scroll) mixed with clean everyday interactions (magnetic, scramble, counters, cursor).

---

## Architecture

**Pattern:** Hook-per-effect, matching the existing codebase pattern (`useParallaxHero`, `useSectionStagger`, `useLineReveal`).

**No new dependencies.** GSAP + `@gsap/react` + `gsap/ScrollTrigger` are already installed and registered in `GSAPProvider`. `MotionPathPlugin` is part of GSAP free tier — register it alongside `ScrollTrigger` in `GSAPProvider`.

**`prefers-reduced-motion`:** Every hook checks GSAP's `matchMedia` utility. When reduced motion is preferred, animations are skipped entirely (duration 0 via `gsap.defaults` already set in `GSAPProvider`).

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `src/hooks/usePlaneScroll.ts` | Paper airplane traces SVG path on hero scroll |
| Create | `src/hooks/useHorizontalScroll.ts` | Pin + scrub horizontal track on scroll |
| Create | `src/hooks/useMagneticButton.ts` | Pull element toward cursor on proximity |
| Create | `src/hooks/useTextScramble.ts` | Randomise → decode text on scroll enter |
| Create | `src/hooks/useCountUp.ts` | Count number from 0 to target on scroll enter |
| Create | `src/components/ui/CursorTrail.tsx` | Global custom cursor dot + ring, desktop only |
| Create | `src/components/home/HorizontalFeatures.tsx` | Pinned horizontal-scroll featured posts section |
| Modify | `src/components/providers/GSAPProvider.tsx` | Register `MotionPathPlugin` |
| Modify | `src/app/layout.tsx` | Mount `<CursorTrail />` inside `GSAPProvider` |
| Modify | `src/app/page.tsx` | Add `<HorizontalFeatures />` between Hero and FeaturedPosts |
| Modify | `src/components/home/HeroSection.tsx` | Mount plane, scramble on "Defang.", magnetic on CTA |
| Modify | `src/components/home/AboutSection.tsx` | `useCountUp` on each stat value |
| Modify | `src/components/about/TimelineTape.tsx` | Replace CSS auto-scroll with `useHorizontalScroll` |
| Modify | `src/components/about/AboutSections.tsx` | `useTextScramble` on Now card glyphs (`>_` / `λ` / `//`) |
| Modify | `src/app/blog/page.tsx` | `useTextScramble` on "All Articles" h1 |

---

## Effect Specifications

### 1. `usePlaneScroll` — Paper Airplane

**Where:** `HeroSection` only.

**Behaviour:**
- An `<svg>` containing a hidden path (`#plane-path`) and a plane `<g>` element is absolutely positioned over the hero section.
- On scroll, GSAP `MotionPathPlugin` moves the plane group along `#plane-path` from start to end as the user scrolls through the hero.
- The plane rotates to follow the path tangent (`autoRotate: true`).
- Path: starts bottom-left of hero, arcs diagonally up-right, exits top-right of the frame.
- ScrollTrigger: `trigger` = hero section, `start: 'top top'`, `end: 'bottom top'`, `scrub: 1`.
- Plane visual: a small SVG paper plane icon (inline SVG, `~24×24px`, `fill: var(--primary)`).

**Hook signature:**
```ts
export function usePlaneScroll(sectionRef: RefObject<HTMLElement | null>): {
  planeRef: RefObject<SVGGElement | null>;
  pathRef: RefObject<SVGPathElement | null>;
}
```

**Rendered in `HeroSection`:**
```tsx
<svg aria-hidden className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
  <path ref={pathRef} id="plane-path" d="M 80,420 C 200,300 500,180 900,60" fill="none" stroke="none" />
  <g ref={planeRef}>
    {/* inline paper plane SVG paths */}
  </g>
</svg>
```

---

### 2. `useHorizontalScroll` — Pinned Horizontal Scroll

**Where:** `HorizontalFeatures` (home) and `TimelineTape` (about).

**Behaviour:**
- Pins the outer wrapper while the inner track translates from `x: 0` to `x: -(trackWidth - viewportWidth)`.
- `scrub: 1` for smooth scrubbing.
- ScrollTrigger `end` is calculated dynamically: `"+=" + (trackWidth - viewportWidth)`.
- On resize, ScrollTrigger refreshes automatically.

**Hook signature:**
```ts
export function useHorizontalScroll(
  wrapperRef: RefObject<HTMLElement | null>,
  trackRef: RefObject<HTMLElement | null>
): void
```

**`TimelineTape` changes:**
- Remove the `CARDS = [...MILESTONES, ...MILESTONES]` duplication (no more infinite loop).
- Remove the CSS `animation` from `.track` in `TimelineTape.module.css`.
- Add outer `<section ref={wrapperRef}>` wrapper with `overflow: hidden`.
- Pass `wrapperRef` and `trackRef` to `useHorizontalScroll`.
- Keep all existing card styles unchanged.

**`HorizontalFeatures`:**
- New component. Renders the top 3 featured blog posts as wide cards (similar style to `FeaturedPosts` but landscape-oriented, `~380px wide × 260px tall`).
- Section heading "Latest Articles" with `useTextScramble`.
- Added to `page.tsx` between `<HeroSection />` and the `<FeaturedPosts />` scroll-reveal block.
- `FeaturedPosts` remains below as the standard grid — `HorizontalFeatures` is additive, not a replacement.

---

### 3. `useMagneticButton` — Magnetic Pull

**Where:** Hero CTA ("Read my articles"), About section social icons, blog post card links.

**Behaviour:**
- On `mousemove` near the element (within `80px`), compute normalised offset from element centre and translate the element `x: offsetX * 0.35, y: offsetY * 0.35` with `gsap.to`, `duration: 0.4, ease: 'power2.out'`.
- On `mouseleave`, return to `x: 0, y: 0`.
- Applied with `overwrite: 'auto'` to avoid stacking.
- Desktop only (`matchMedia min-width: 769px`).

**Hook signature:**
```ts
export function useMagneticButton<T extends HTMLElement>(
  strength?: number   // default 0.35
): RefObject<T | null>
```

Returns a single ref to attach to any element. Usage:
```tsx
const btnRef = useMagneticButton<HTMLAnchorElement>();
<a ref={btnRef} ...>
```

---

### 4. `useTextScramble` — Decode Animation

**Where:** "Defang." in hero h1, "All Articles" on blog page, Now card glyphs (`>_` / `λ` / `//`) in AboutSections, HorizontalFeatures section heading.

**Behaviour:**
- On ScrollTrigger enter (`once: true`), run a character-randomise loop for `600ms`, then resolve to the real text.
- Characters drawn from `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_./λ>`.
- Each character resolves left-to-right over the duration.
- Uses `requestAnimationFrame` internally, cleaned up on component unmount.
- Hero heading fires immediately on page load (no ScrollTrigger — it's above the fold).

**Hook signature:**
```ts
export function useTextScramble(
  ref: RefObject<HTMLElement | null>,
  options?: {
    trigger?: boolean;   // true = fire on ScrollTrigger enter; false = fire immediately (default false)
    duration?: number;   // ms, default 600
  }
): void
```

---

### 5. `useCountUp` — Animated Counter

**Where:** Each stat value in `AboutSection` (e.g. `5+`, `10+`, `∞`, `1K+`).

**Behaviour:**
- Parse the numeric portion of the value string (`5+` → `5`, `10+` → `10`, `1K+` → `1000`, `∞` → skip).
- On ScrollTrigger enter, count from `0` to target over `1.5s`, `ease: 'power2.out'`.
- Format the number back to the original suffix (`+`, `K+`) on each update tick.
- `∞` is left untouched (no count animation).
- `once: true`.

**Hook signature:**
```ts
export function useCountUp(
  ref: RefObject<HTMLElement | null>,
  target: string   // raw string like "5+", "1K+", "∞"
): void
```

`AboutSection` passes each stat element's ref and its `value` string.

---

### 6. `CursorTrail` — Custom Cursor

**Where:** Global — mounted once in `layout.tsx` inside `GSAPProvider`.

**Behaviour:**
- Two fixed elements: `dot` (8×8px filled circle, `var(--primary)`) and `ring` (24×24px hollow circle, `2px border var(--primary)`).
- `dot` follows cursor with `gsap.quickTo(x/y)`, `duration: 0.1` (nearly instant).
- `ring` follows cursor with `gsap.quickTo(x/y)`, `duration: 0.35` (lagged trail).
- On `mouseenter` of any `a`, `button`, or `[data-magnetic]`: `dot` scales to `0`, `ring` scales to `1.8` and reduces opacity to `0.4`.
- On `mouseleave`: revert.
- Desktop only — hidden via `@media (pointer: coarse)` CSS, and JS listener only added on `min-width: 769px`.
- Global `cursor: none` applied to `body` only when `CursorTrail` is active (add/remove a `data-custom-cursor` attribute on `<html>`).

**Component:**
```tsx
// src/components/ui/CursorTrail.tsx
'use client';
export function CursorTrail() { ... }
```

Mounted in `layout.tsx` as a sibling inside `GSAPProvider`, before `<div className="flex min-h-screen...">`.

---

## Integration Points

### `GSAPProvider` — add MotionPathPlugin
```ts
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
```

### `layout.tsx`
```tsx
<GSAPProvider>
  <CursorTrail />
  <div className="flex min-h-screen flex-col">
    ...
  </div>
</GSAPProvider>
```

### `page.tsx`
```tsx
<HeroSection />
<HorizontalFeatures />
<ScrollReveal><FeaturedPosts /></ScrollReveal>
<ScrollReveal><AboutSection /></ScrollReveal>
<ScrollReveal><NewsletterSection /></ScrollReveal>
```

---

## Accessibility

- All animations respect `prefers-reduced-motion` via `gsap.defaults({ duration: 0 })` already set in `GSAPProvider`.
- `CursorTrail` hidden on touch devices (`pointer: coarse`) — native cursor unaffected.
- Plane SVG has `aria-hidden`.
- Text scramble resolves immediately (duration 0) under reduced motion, so content is always readable.

---

## What Does NOT Change

- Blog post content pages (`/blog/[slug]`)
- Header, Footer
- Theme system, CSS variables
- `FeaturedPosts` grid (kept, `HorizontalFeatures` is additive above it)
- All existing scroll reveal / stagger behaviour
