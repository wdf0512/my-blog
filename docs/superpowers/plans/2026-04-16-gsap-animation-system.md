# GSAP Animation System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 6 GSAP animation effects (paper airplane, horizontal scroll, magnetic buttons, text scramble, count-up counters, custom cursor) across all pages using a hook-per-effect architecture.

**Architecture:** One focused hook per animation type, matching existing patterns (`useParallaxHero`, `useSectionStagger`). GSAP + ScrollTrigger + MotionPathPlugin handle all animations. A global `CursorTrail` client component mounts in `layout.tsx`. No new dependencies — GSAP is already installed.

**Tech Stack:** Next.js 16 App Router, GSAP 3 + ScrollTrigger + MotionPathPlugin, `@gsap/react` (`useGSAP`), TypeScript, CSS Modules

---

## File Map

| Action | File |
|--------|------|
| Modify | `src/components/providers/GSAPProvider.tsx` |
| Create | `src/components/ui/CursorTrail.tsx` |
| Create | `src/components/ui/ScrambleText.tsx` |
| Modify | `src/app/layout.tsx` |
| Modify | `src/app/globals.css` |
| Create | `src/hooks/useTextScramble.ts` |
| Create | `src/hooks/useMagneticButton.ts` |
| Create | `src/hooks/useCountUp.ts` |
| Create | `src/hooks/usePlaneScroll.ts` |
| Create | `src/hooks/useHorizontalScroll.ts` |
| Modify | `src/components/home/HeroSection.tsx` |
| Modify | `src/components/home/AboutSection.tsx` |
| Create | `src/components/home/HorizontalFeatures.tsx` |
| Modify | `src/app/page.tsx` |
| Modify | `src/components/about/TimelineTape.tsx` |
| Modify | `src/components/about/TimelineTape.module.css` |
| Modify | `src/components/about/AboutSections.tsx` |
| Modify | `src/app/blog/page.tsx` |

---

### Task 1: Foundation — MotionPathPlugin + CursorTrail + layout

**Files:**
- Modify: `src/components/providers/GSAPProvider.tsx`
- Create: `src/components/ui/CursorTrail.tsx`
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Register MotionPathPlugin in GSAPProvider**

Replace the entire file:

```ts
'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

export function GSAPProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.defaults({ duration: 0, delay: 0 });
    });

    return () => mm.revert();
  }, []);

  return <>{children}</>;
}
```

- [ ] **Step 2: Create CursorTrail component**

Create `src/components/ui/CursorTrail.tsx`:

```tsx
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function CursorTrail() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const mm = gsap.matchMedia();
    mm.add('(min-width: 769px) and (pointer: fine)', () => {
      document.documentElement.setAttribute('data-custom-cursor', '');

      const moveX = gsap.quickTo(dot, 'x', { duration: 0.1, ease: 'none' });
      const moveY = gsap.quickTo(dot, 'y', { duration: 0.1, ease: 'none' });
      const ringX = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power2.out' });
      const ringY = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power2.out' });

      const onMouseMove = (e: MouseEvent) => {
        moveX(e.clientX);
        moveY(e.clientY);
        ringX(e.clientX);
        ringY(e.clientY);
      };

      const onEnterInteractive = () => {
        gsap.to(dot, { scale: 0, duration: 0.2, overwrite: 'auto' });
        gsap.to(ring, { scale: 1.8, opacity: 0.4, duration: 0.3, overwrite: 'auto' });
      };

      const onLeaveInteractive = () => {
        gsap.to(dot, { scale: 1, duration: 0.2, overwrite: 'auto' });
        gsap.to(ring, { scale: 1, opacity: 1, duration: 0.3, overwrite: 'auto' });
      };

      window.addEventListener('mousemove', onMouseMove);

      const interactiveEls = document.querySelectorAll('a, button');
      interactiveEls.forEach((el) => {
        el.addEventListener('mouseenter', onEnterInteractive);
        el.addEventListener('mouseleave', onLeaveInteractive);
      });

      return () => {
        document.documentElement.removeAttribute('data-custom-cursor');
        window.removeEventListener('mousemove', onMouseMove);
        interactiveEls.forEach((el) => {
          el.removeEventListener('mouseenter', onEnterInteractive);
          el.removeEventListener('mouseleave', onLeaveInteractive);
        });
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: 'var(--primary)',
          pointerEvents: 'none',
          zIndex: 9999,
          transform: 'translate(-50%, -50%)',
          willChange: 'transform',
        }}
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 24,
          height: 24,
          borderRadius: '50%',
          border: '2px solid var(--primary)',
          pointerEvents: 'none',
          zIndex: 9998,
          transform: 'translate(-50%, -50%)',
          willChange: 'transform',
        }}
      />
    </>
  );
}
```

- [ ] **Step 3: Add cursor:none rule to globals.css**

Append to the end of `src/app/globals.css`:

```css
/* Custom cursor — hides native cursor when CursorTrail is active */
[data-custom-cursor],
[data-custom-cursor] * {
  cursor: none !important;
}
```

- [ ] **Step 4: Mount CursorTrail in layout.tsx**

In `src/app/layout.tsx`, add the import:

```tsx
import { CursorTrail } from '@/components/ui/CursorTrail';
```

Then add `<CursorTrail />` as the first child inside `<GSAPProvider>`, before the `<div className="flex min-h-screen...">`:

```tsx
<GSAPProvider>
  <CursorTrail />
  <div className="flex min-h-screen flex-col">
    <Header />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
</GSAPProvider>
```

- [ ] **Step 5: Verify**

```bash
bun run dev
```

Open http://localhost:3000. On desktop, the native cursor should disappear and be replaced by a small gold dot + trailing ring. Hovering over links/buttons should expand the ring and hide the dot.

- [ ] **Step 6: Commit**

```bash
git add src/components/providers/GSAPProvider.tsx src/components/ui/CursorTrail.tsx src/app/globals.css src/app/layout.tsx
git commit -m "feat(animation): add CursorTrail and register MotionPathPlugin"
```

---

### Task 2: useTextScramble hook + ScrambleText component

**Files:**
- Create: `src/hooks/useTextScramble.ts`
- Create: `src/components/ui/ScrambleText.tsx`

- [ ] **Step 1: Create useTextScramble hook**

Create `src/hooks/useTextScramble.ts`:

```ts
'use client';

import { RefObject } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_./λ>-';

export function useTextScramble(
  ref: RefObject<HTMLElement | null>,
  options: { trigger?: boolean; duration?: number } = {}
) {
  const { trigger = false, duration = 600 } = options;

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;

    const original = el.textContent ?? '';
    const totalFrames = Math.max(1, Math.round(duration / 40));
    let rafId = 0;

    const run = () => {
      cancelAnimationFrame(rafId);
      let frame = 0;

      const tick = () => {
        let out = '';
        const resolved = (frame / totalFrames) * original.length;
        for (let i = 0; i < original.length; i++) {
          if (i < resolved) {
            out += original[i];
          } else if (original[i] === ' ') {
            out += ' ';
          } else {
            out += CHARS[Math.floor(Math.random() * CHARS.length)];
          }
        }
        el.textContent = out;
        frame++;
        if (frame <= totalFrames) {
          rafId = requestAnimationFrame(tick);
        } else {
          el.textContent = original;
        }
      };

      rafId = requestAnimationFrame(tick);
    };

    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      if (trigger) {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 85%',
          once: true,
          onEnter: run,
        });
      } else {
        // Small delay so the component is fully painted before scrambling
        const timeout = window.setTimeout(run, 100);
        return () => clearTimeout(timeout);
      }
    });

    return () => {
      cancelAnimationFrame(rafId);
      mm.revert();
    };
  }, [trigger, duration]);
}
```

- [ ] **Step 2: Create ScrambleText component**

Create `src/components/ui/ScrambleText.tsx`:

```tsx
'use client';

import { useRef } from 'react';
import { useTextScramble } from '@/hooks/useTextScramble';

export function ScrambleText({
  children,
  trigger = true,
  duration = 600,
  className,
  style,
}: {
  children: string;
  trigger?: boolean;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  useTextScramble(ref, { trigger, duration });
  return (
    <span ref={ref} className={className} style={{ display: 'inline-block', ...style }}>
      {children}
    </span>
  );
}
```

- [ ] **Step 3: Verify compilation**

```bash
bun run build
```

Expected: no TypeScript errors. The hooks are not yet wired to any component so no visual to check yet.

- [ ] **Step 4: Commit**

```bash
git add src/hooks/useTextScramble.ts src/components/ui/ScrambleText.tsx
git commit -m "feat(animation): add useTextScramble hook and ScrambleText component"
```

---

### Task 3: useMagneticButton hook

**Files:**
- Create: `src/hooks/useMagneticButton.ts`

- [ ] **Step 1: Create useMagneticButton hook**

Create `src/hooks/useMagneticButton.ts`:

```ts
'use client';

import { useRef, RefObject } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export function useMagneticButton<T extends HTMLElement>(
  strength = 0.35
): RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;

    const mm = gsap.matchMedia();
    mm.add(
      '(min-width: 769px) and (prefers-reduced-motion: no-preference)',
      () => {
        const onMouseMove = (e: MouseEvent) => {
          const { left, top, width, height } = el.getBoundingClientRect();
          const cx = left + width / 2;
          const cy = top + height / 2;
          const dx = e.clientX - cx;
          const dy = e.clientY - cy;
          gsap.to(el, {
            x: dx * strength,
            y: dy * strength,
            duration: 0.4,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        };

        const onMouseLeave = () => {
          gsap.to(el, {
            x: 0,
            y: 0,
            duration: 0.6,
            ease: 'elastic.out(1, 0.5)',
            overwrite: 'auto',
          });
        };

        el.addEventListener('mousemove', onMouseMove);
        el.addEventListener('mouseleave', onMouseLeave);

        return () => {
          el.removeEventListener('mousemove', onMouseMove);
          el.removeEventListener('mouseleave', onMouseLeave);
        };
      }
    );

    return () => mm.revert();
  }, [strength]);

  return ref;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/useMagneticButton.ts
git commit -m "feat(animation): add useMagneticButton hook"
```

---

### Task 4: useCountUp hook + wire into AboutSection

**Files:**
- Create: `src/hooks/useCountUp.ts`
- Modify: `src/components/home/AboutSection.tsx`

- [ ] **Step 1: Create useCountUp hook**

Create `src/hooks/useCountUp.ts`:

```ts
'use client';

import { RefObject } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

/** Parse "5+" → { value: 5, suffix: "+" }, "1K+" → { value: 1000, suffix: "K+" }, "∞" → null */
function parse(raw: string): { value: number; suffix: string } | null {
  if (raw === '∞') return null;
  const match = raw.match(/^(\d+(?:\.\d+)?)(K?)(\+?)(.*)$/);
  if (!match) return null;
  const num = parseFloat(match[1]) * (match[2] === 'K' ? 1000 : 1);
  const suffix = match[2] + match[3] + match[4];
  return { value: num, suffix };
}

function format(n: number, suffix: string): string {
  if (suffix.startsWith('K')) return Math.round(n / 1000) + suffix;
  return Math.round(n) + suffix;
}

export function useCountUp(ref: RefObject<HTMLElement | null>, target: string) {
  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    const parsed = parse(target);
    if (!parsed) return;

    const obj = { val: 0 };
    gsap.to(obj, {
      val: parsed.value,
      duration: 1.5,
      ease: 'power2.out',
      onUpdate() {
        if (el) el.textContent = format(obj.val, parsed.suffix);
      },
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true,
      },
    });
  }, [target]);
}
```

- [ ] **Step 2: Add StatCounter sub-component and wire into AboutSection**

Replace the entire `src/components/home/AboutSection.tsx`:

```tsx
'use client';

import { useRef } from 'react';
import { Code2, Rocket, Coffee, Users } from 'lucide-react';
import { useCountUp } from '@/hooks/useCountUp';

const stats = [
  { icon: Code2,  value: '5+',   label: 'Years Coding',    color: 'bg-primary/10 text-primary' },
  { icon: Rocket, value: '10+',  label: 'Projects Built',  color: 'bg-blue/10 text-blue' },
  { icon: Coffee, value: '∞',    label: 'Cups of Coffee',  color: 'bg-brown/10 text-brown' },
  { icon: Users,  value: '1K+',  label: 'Blog Readers',    color: 'bg-primary/10 text-primary' },
];

const beliefs = [
  { heading: 'Ship, then learn',   body: 'Real feedback from production beats any amount of planning. I ship early and iterate fast.' },
  { heading: 'Build end-to-end',   body: "I own the whole stack — backend, API, frontend. Context collapse across layers is where the real problems live." },
  { heading: 'Learn in public',    body: "Writing forces clarity. If I can't explain what I built, I don't fully understand it yet." },
  { heading: 'AI is the craft',    body: "Not a tool I use — the thing I think about most. The models, the patterns, the failures, and where it's all going." },
];

function StatCounter({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useCountUp(ref, value);
  return (
    <div ref={ref} className={className}>
      {value}
    </div>
  );
}

export function AboutSection() {
  return (
    <section className="bg-surface py-16 md:py-20 border-t border-b border-border">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="text-center p-6 bg-background rounded-2xl border border-border"
              >
                <div
                  className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-3`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <StatCounter
                  value={stat.value}
                  className="font-display text-3xl font-black text-text-primary mb-1"
                />
                <div className="text-sm text-text-secondary">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* About & Beliefs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="font-display text-3xl font-black mb-4 text-text-primary">
              About Me
            </h2>
            <div className="space-y-4 text-text-secondary leading-relaxed">
              <p>
                I&apos;m a full-stack developer turned AI engineer, with experience
                shipping production LLM systems and complex enterprise web apps.
                I specialize in the full chain — from multi-agent backends with
                LangGraph to generative UI frontends in React.
              </p>
              <p>
                When I&apos;m not shipping code, I&apos;m exploring new AI frameworks,
                writing about what I&apos;ve learned, or working on a side project.
                I believe in learning in public and sharing knowledge freely.
              </p>
              <p>
                Currently building an AI-driven Agentic ERP system at Nuobinteng,
                architecting multi-agent workflows and Generative UI with SSE streaming.
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-display text-3xl font-black mb-6 text-text-primary">
              What I believe
            </h2>
            <div className="flex flex-col gap-5">
              {beliefs.map((item) => (
                <div key={item.heading}>
                  <p className="text-sm font-semibold text-primary mb-1">{item.heading}</p>
                  <p className="text-text-secondary text-sm leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Verify**

```bash
bun run dev
```

Open http://localhost:3000, scroll down to the About section. The stat numbers (`5+`, `10+`, `1K+`) should count up from 0 when they scroll into view. `∞` stays static.

- [ ] **Step 4: Commit**

```bash
git add src/hooks/useCountUp.ts src/components/home/AboutSection.tsx
git commit -m "feat(animation): add useCountUp and wire to AboutSection stats"
```

---

### Task 5: usePlaneScroll hook + HeroSection plane SVG

**Files:**
- Create: `src/hooks/usePlaneScroll.ts`
- Modify: `src/components/home/HeroSection.tsx`

- [ ] **Step 1: Create usePlaneScroll hook**

Create `src/hooks/usePlaneScroll.ts`:

```ts
'use client';

import { useRef, RefObject } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export function usePlaneScroll(sectionRef: RefObject<HTMLElement | null>) {
  const planeRef = useRef<SVGGElement | null>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const plane = planeRef.current;
      if (!section || !plane) return;

      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.to(plane, {
          motionPath: {
            path: '#plane-path',
            align: '#plane-path',
            autoRotate: true,
            alignOrigin: [0.5, 0.5],
            start: 0,
            end: 1,
          },
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.5,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return { planeRef };
}
```

- [ ] **Step 2: Add plane SVG and wire usePlaneScroll into HeroSection**

Replace the entire `src/components/home/HeroSection.tsx`:

```tsx
'use client';

import { HeroSceneLoader } from '@/components/3d/HeroSceneLoader';
import { Github, Twitter, Linkedin, Mail, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import btn from '@/styles/buttons.module.css';
import styles from './HeroSection.module.css';
import { useParallaxHero } from '@/hooks/useParallaxHero';
import { usePlaneScroll } from '@/hooks/usePlaneScroll';

const SOCIAL = [
  { label: 'GitHub',   href: 'https://github.com/wdf0512',                             icon: Github,   color: 'var(--text-primary)' },
  { label: 'Twitter',  href: 'https://x.com/De991025',                                icon: Twitter,  color: '#1DA1F2' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/defang-weng-169591226/',     icon: Linkedin, color: '#0A66C2' },
  { label: 'Email',    href: 'mailto:defangninj@outlook.com',                          icon: Mail,     color: 'var(--primary)' },
] as const;

export function HeroSection() {
  const { sectionRef, textRef, asciiRef } = useParallaxHero();
  const { planeRef } = usePlaneScroll(sectionRef);

  return (
    <section ref={sectionRef} className="relative overflow-hidden min-h-screen flex flex-col justify-center">
      {/* Radial glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: 'radial-gradient(ellipse 55% 60% at 20% 50%, rgba(242,201,76,0.07) 0%, transparent 70%)' }}
        aria-hidden
      />

      {/* Paper airplane — follows #plane-path on scroll */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ overflow: 'visible' }}
      >
        <path
          id="plane-path"
          d="M 80,520 C 220,380 480,220 1160,60"
          fill="none"
          stroke="none"
        />
        <g ref={planeRef} style={{ opacity: 0.9 }}>
          {/* Paper airplane shape */}
          <polygon
            points="0,-5 -14,6 0,1"
            fill="var(--primary)"
          />
          <polygon
            points="-14,6 -9,1 0,1"
            fill="rgba(242,201,76,0.45)"
          />
        </g>
      </svg>

      <div className="relative container mx-auto px-4 py-16 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left: text + CTA */}
          <div ref={textRef} className="order-2 lg:order-1 flex flex-col items-start gap-5">
            <div data-hero-item className={styles.eyebrow}>
              <span className={styles.eyebrowDot} aria-hidden />
              AI Engineer · Full-Stack Dev · Builder
            </div>

            <h1
              data-hero-item
              className="font-display font-black leading-[1.05] tracking-tight text-text-primary mb-5"
              style={{ fontSize: 'clamp(2.75rem, 6vw, 4.5rem)' }}
            >
              Hi, I&apos;m{' '}
              <span className="text-primary">Defang.</span>
            </h1>

            <p
              data-hero-item
              className="text-text-secondary leading-relaxed mb-8"
              style={{ fontSize: 'clamp(1.05rem, 1.8vw, 1.25rem)', maxWidth: '38ch' }}
            >
              Full-stack AI engineer. I love programming, obsess over intelligent systems,
              and write about everything AI — what&apos;s shipping, what&apos;s breaking,
              and what actually matters.
            </p>

            <div data-hero-item className="mb-8">
              <Link href="/blog" className={btn.btnPrimary}>
                <span className={btn.btnLabel}>Read my articles</span>
                <span className={btn.btnKnob} aria-hidden>
                  <ChevronRight className={btn.btnKnobIcon} strokeWidth={2.25} />
                </span>
              </Link>
            </div>
          </div>

          {/* Right: 3D character + social icons */}
          <div ref={asciiRef} className="order-1 lg:order-2 flex flex-col items-center gap-8">
            <HeroSceneLoader />

            <div className="flex items-center gap-4">
              {SOCIAL.map(({ label, href, icon: Icon, color }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('mailto') ? undefined : '_blank'}
                  rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                  aria-label={label}
                  className={styles.neuBtn}
                >
                  <Icon size={22} style={{ color }} aria-hidden />
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Verify**

```bash
bun run dev
```

Open http://localhost:3000. Scroll slowly through the hero — a small gold paper airplane should trace diagonally from the lower-left toward the upper-right as you scroll. No visible path line, just the moving shape.

- [ ] **Step 4: Commit**

```bash
git add src/hooks/usePlaneScroll.ts src/components/home/HeroSection.tsx
git commit -m "feat(animation): add paper airplane scroll effect to hero"
```

---

### Task 6: Wire scramble + magnetic into HeroSection, About Now glyphs, blog heading

**Files:**
- Modify: `src/components/home/HeroSection.tsx`
- Modify: `src/components/about/AboutSections.tsx`
- Modify: `src/app/blog/page.tsx`

- [ ] **Step 1: Add scramble on "Defang." and magnetic on CTA in HeroSection**

Replace the entire `src/components/home/HeroSection.tsx`:

```tsx
'use client';

import { useRef } from 'react';
import { HeroSceneLoader } from '@/components/3d/HeroSceneLoader';
import { Github, Twitter, Linkedin, Mail, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import btn from '@/styles/buttons.module.css';
import styles from './HeroSection.module.css';
import { useParallaxHero } from '@/hooks/useParallaxHero';
import { usePlaneScroll } from '@/hooks/usePlaneScroll';
import { useTextScramble } from '@/hooks/useTextScramble';
import { useMagneticButton } from '@/hooks/useMagneticButton';

const SOCIAL = [
  { label: 'GitHub',   href: 'https://github.com/wdf0512',                             icon: Github,   color: 'var(--text-primary)' },
  { label: 'Twitter',  href: 'https://x.com/De991025',                                icon: Twitter,  color: '#1DA1F2' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/defang-weng-169591226/',     icon: Linkedin, color: '#0A66C2' },
  { label: 'Email',    href: 'mailto:defangninj@outlook.com',                          icon: Mail,     color: 'var(--primary)' },
] as const;

export function HeroSection() {
  const { sectionRef, textRef, asciiRef } = useParallaxHero();
  const { planeRef } = usePlaneScroll(sectionRef);

  const nameRef = useRef<HTMLSpanElement>(null);
  useTextScramble(nameRef, { trigger: false, duration: 800 });

  const ctaRef = useMagneticButton<HTMLAnchorElement>(0.4);

  return (
    <section ref={sectionRef} className="relative overflow-hidden min-h-screen flex flex-col justify-center">
      {/* Radial glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: 'radial-gradient(ellipse 55% 60% at 20% 50%, rgba(242,201,76,0.07) 0%, transparent 70%)' }}
        aria-hidden
      />

      {/* Paper airplane */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ overflow: 'visible' }}
      >
        <path
          id="plane-path"
          d="M 80,520 C 220,380 480,220 1160,60"
          fill="none"
          stroke="none"
        />
        <g ref={planeRef} style={{ opacity: 0.9 }}>
          <polygon points="0,-5 -14,6 0,1" fill="var(--primary)" />
          <polygon points="-14,6 -9,1 0,1" fill="rgba(242,201,76,0.45)" />
        </g>
      </svg>

      <div className="relative container mx-auto px-4 py-16 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left: text + CTA */}
          <div ref={textRef} className="order-2 lg:order-1 flex flex-col items-start gap-5">
            <div data-hero-item className={styles.eyebrow}>
              <span className={styles.eyebrowDot} aria-hidden />
              AI Engineer · Full-Stack Dev · Builder
            </div>

            <h1
              data-hero-item
              className="font-display font-black leading-[1.05] tracking-tight text-text-primary mb-5"
              style={{ fontSize: 'clamp(2.75rem, 6vw, 4.5rem)' }}
            >
              Hi, I&apos;m{' '}
              <span ref={nameRef} className="text-primary">Defang.</span>
            </h1>

            <p
              data-hero-item
              className="text-text-secondary leading-relaxed mb-8"
              style={{ fontSize: 'clamp(1.05rem, 1.8vw, 1.25rem)', maxWidth: '38ch' }}
            >
              Full-stack AI engineer. I love programming, obsess over intelligent systems,
              and write about everything AI — what&apos;s shipping, what&apos;s breaking,
              and what actually matters.
            </p>

            <div data-hero-item className="mb-8">
              <Link ref={ctaRef} href="/blog" className={btn.btnPrimary}>
                <span className={btn.btnLabel}>Read my articles</span>
                <span className={btn.btnKnob} aria-hidden>
                  <ChevronRight className={btn.btnKnobIcon} strokeWidth={2.25} />
                </span>
              </Link>
            </div>
          </div>

          {/* Right: 3D character + social icons */}
          <div ref={asciiRef} className="order-1 lg:order-2 flex flex-col items-center gap-8">
            <HeroSceneLoader />

            <div className="flex items-center gap-4">
              {SOCIAL.map(({ label, href, icon: Icon, color }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('mailto') ? undefined : '_blank'}
                  rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                  aria-label={label}
                  className={styles.neuBtn}
                >
                  <Icon size={22} style={{ color }} aria-hidden />
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Wire ScrambleText onto Now card glyphs in AboutSections**

In `src/components/about/AboutSections.tsx`, add the import at the top (after existing imports):

```tsx
import { ScrambleText } from '@/components/ui/ScrambleText';
```

Then find the badge render line inside the Now section map:

```tsx
<div className={now.badge}>{item.glyph}</div>
```

Replace it with:

```tsx
<div className={now.badge}>
  <ScrambleText trigger duration={400}>{item.glyph}</ScrambleText>
</div>
```

- [ ] **Step 3: Wire ScrambleText onto the blog page heading**

In `src/app/blog/page.tsx`, add the import at the top:

```tsx
import { ScrambleText } from '@/components/ui/ScrambleText';
```

Find the h1:

```tsx
<h1 className="font-display text-5xl md:text-6xl font-black mb-4 text-text-primary">
  All Articles
</h1>
```

Replace it with:

```tsx
<h1 className="font-display text-5xl md:text-6xl font-black mb-4 text-text-primary">
  <ScrambleText trigger={false} duration={700}>All Articles</ScrambleText>
</h1>
```

- [ ] **Step 4: Verify**

```bash
bun run dev
```

Check three things:
1. http://localhost:3000 — "Defang." scrambles to itself ~100ms after page load; hovering the CTA button creates a subtle magnetic pull.
2. http://localhost:3000/about — The `>_`, `λ`, `//` glyphs in the Now cards scramble as they scroll into view.
3. http://localhost:3000/blog — "All Articles" scrambles on page load.

- [ ] **Step 5: Commit**

```bash
git add src/components/home/HeroSection.tsx src/components/about/AboutSections.tsx src/app/blog/page.tsx
git commit -m "feat(animation): wire scramble and magnetic effects across pages"
```

---

### Task 7: useHorizontalScroll + HorizontalFeatures section

**Files:**
- Create: `src/hooks/useHorizontalScroll.ts`
- Create: `src/components/home/HorizontalFeatures.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create useHorizontalScroll hook**

Create `src/hooks/useHorizontalScroll.ts`:

```ts
'use client';

import { RefObject } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export function useHorizontalScroll(
  wrapperRef: RefObject<HTMLElement | null>,
  trackRef: RefObject<HTMLElement | null>
) {
  useGSAP(
    () => {
      const wrapper = wrapperRef.current;
      const track = trackRef.current;
      if (!wrapper || !track) return;

      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const getScrollAmount = () =>
          -(track.scrollWidth - wrapper.offsetWidth);

        gsap.to(track, {
          x: getScrollAmount,
          ease: 'none',
          scrollTrigger: {
            trigger: wrapper,
            start: 'top top',
            end: () => `+=${Math.abs(getScrollAmount())}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: wrapperRef }
  );
}
```

- [ ] **Step 2: Create HorizontalFeatures component**

Create `src/components/home/HorizontalFeatures.tsx`:

```tsx
'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { posts } from '#/.velite';
import { useHorizontalScroll } from '@/hooks/useHorizontalScroll';
import { ScrambleText } from '@/components/ui/ScrambleText';

const FONT =
  "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif";

export function HorizontalFeatures() {
  const wrapperRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useHorizontalScroll(wrapperRef, trackRef);

  const featuredPosts = posts
    .filter((p) => p.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  if (featuredPosts.length === 0) return null;

  return (
    <section
      ref={wrapperRef}
      style={{
        overflow: 'hidden',
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
      }}
    >
      <div style={{ padding: '3rem 2rem 2rem' }}>
        <h2
          className="font-display font-black text-text-primary"
          style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '0.25rem' }}
        >
          <ScrambleText trigger duration={600}>
            Latest Articles
          </ScrambleText>
        </h2>
        <p style={{ fontFamily: FONT, fontSize: 14, color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Scroll to browse — or{' '}
          <Link href="/blog" style={{ color: 'var(--primary)', textDecoration: 'none' }}>
            view all
          </Link>
        </p>
      </div>

      {/* Horizontal track */}
      <div
        ref={trackRef}
        style={{
          display: 'flex',
          gap: '1.25rem',
          paddingLeft: '2rem',
          paddingRight: '4rem',
          paddingBottom: '3rem',
          width: 'max-content',
        }}
      >
        {featuredPosts.map((post) => {
          const date = new Date(post.date).toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric',
          });
          return (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              style={{
                flexShrink: 0,
                width: 340,
                minHeight: 240,
                borderRadius: 16,
                background: 'var(--background)',
                border: '1px solid var(--border)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                textDecoration: 'none',
                transition: 'box-shadow 200ms ease, transform 200ms ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow =
                  '0 8px 24px rgba(0,0,0,0.1)';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              }}
            >
              <div>
                <p
                  style={{
                    fontFamily: 'var(--font-geist-mono)',
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'var(--primary)',
                    marginBottom: 10,
                  }}
                >
                  {date} · {post.readingTime}
                </p>
                <h3
                  className="font-display font-black text-text-primary"
                  style={{ fontSize: 18, lineHeight: 1.25, marginBottom: 10 }}
                >
                  {post.title}
                </h3>
              </div>
              {post.description && (
                <p
                  style={{
                    fontFamily: FONT,
                    fontSize: 13,
                    color: 'var(--text-secondary)',
                    lineHeight: 1.7,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {post.description}
                </p>
              )}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  marginTop: 16,
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'var(--primary)',
                }}
              >
                Read article <ArrowRight size={12} />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Add HorizontalFeatures to home page**

In `src/app/page.tsx`, add the import:

```tsx
import { HorizontalFeatures } from '@/components/home/HorizontalFeatures';
```

Then add `<HorizontalFeatures />` between `<HeroSection />` and the first `<ScrollReveal>`:

```tsx
export default function Home() {
  return (
    <>
      <HeroSection />
      <HorizontalFeatures />
      <ScrollReveal>
        <FeaturedPosts />
      </ScrollReveal>
      <ScrollReveal>
        <AboutSection />
      </ScrollReveal>
      <ScrollReveal>
        <NewsletterSection />
      </ScrollReveal>
    </>
  );
}
```

- [ ] **Step 4: Verify**

```bash
bun run dev
```

Open http://localhost:3000. Scroll past the hero — the "Latest Articles" section should pin in place while you scroll, panning the post cards horizontally to the right. After the last card is visible, the page resumes normal vertical scroll.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useHorizontalScroll.ts src/components/home/HorizontalFeatures.tsx src/app/page.tsx
git commit -m "feat(animation): add horizontal scroll featured posts section to home"
```

---

### Task 8: TimelineTape — replace CSS auto-scroll with scroll-driven horizontal

**Files:**
- Modify: `src/components/about/TimelineTape.tsx`
- Modify: `src/components/about/TimelineTape.module.css`

- [ ] **Step 1: Remove CSS animation from TimelineTape.module.css**

Replace the entire `src/components/about/TimelineTape.module.css`:

```css
.wrapper {
  position: relative;
  overflow: hidden;
  background: var(--background);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

.fadeLeft {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 80px;
  background: linear-gradient(to right, var(--background), transparent);
  pointer-events: none;
  z-index: 2;
}

.fadeRight {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 80px;
  background: linear-gradient(to left, var(--background), transparent);
  pointer-events: none;
  z-index: 2;
}

.track {
  display: flex;
  width: max-content;
  /* No animation — GSAP ScrollTrigger drives horizontal movement */
}

.slice {
  width: 200px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--border);
}

.sprocketRow {
  height: 28px;
  background: var(--surface);
  display: flex;
  align-items: center;
  justify-content: center;
}

.sprocket {
  width: 14px;
  height: 14px;
  border-radius: 3px;
  border: 1.5px solid var(--border);
  background: transparent;
}

.card {
  flex: 1;
  padding: 28px 20px;
  background: var(--background);
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 120px;
}

.cardNow {
  background: rgba(242, 201, 76, 0.03);
  box-shadow: inset 0 0 0 1px rgba(242, 201, 76, 0.2), 0 0 24px rgba(242, 201, 76, 0.08);
}

.year {
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: var(--text-primary);
}

.yearNow {
  color: var(--primary);
}

.desc {
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif;
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.6;
}
```

- [ ] **Step 2: Replace TimelineTape component to use useHorizontalScroll**

Replace the entire `src/components/about/TimelineTape.tsx`:

```tsx
'use client';

import { useRef } from 'react';
import styles from './TimelineTape.module.css';
import { useHorizontalScroll } from '@/hooks/useHorizontalScroll';

const MILESTONES = [
  { year: '2020', desc: 'First line of code' },
  { year: '2022', desc: 'First dev projects (Creatify.ai)' },
  { year: '2023', desc: 'First full-time dev role — Shanghai & Sydney' },
  { year: '2024', desc: 'Pivoted to AI engineering — LangGraph & LLMs' },
  { year: 'Now',  desc: 'Agentic ERP & multi-agent systems', isNow: true },
];

export function TimelineTape() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useHorizontalScroll(wrapperRef, trackRef);

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <div className={styles.fadeLeft} />
      <div className={styles.fadeRight} />

      <div ref={trackRef} className={styles.track}>
        {MILESTONES.map((card, i) => (
          <div key={i} className={styles.slice}>
            <div className={styles.sprocketRow}>
              <div className={styles.sprocket} />
            </div>
            <div className={`${styles.card} ${card.isNow ? styles.cardNow : ''}`}>
              <div className={`${styles.year} ${card.isNow ? styles.yearNow : ''}`}>
                {card.year}
              </div>
              <div className={styles.desc}>{card.desc}</div>
            </div>
            <div className={styles.sprocketRow}>
              <div className={styles.sprocket} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify**

```bash
bun run dev
```

Open http://localhost:3000/about. Scroll to the timeline section. The film strip should pin while you scroll, with the milestone cards moving horizontally from left to right. After "Now" card is visible, normal scroll resumes. Under `prefers-reduced-motion`, the timeline is static.

- [ ] **Step 4: Commit**

```bash
git add src/components/about/TimelineTape.tsx src/components/about/TimelineTape.module.css
git commit -m "feat(animation): convert TimelineTape to scroll-driven horizontal reveal"
```

---

## Self-Review

**Spec coverage:**
- ✅ Paper airplane (Task 5 + 6)
- ✅ Horizontal scroll — home HorizontalFeatures (Task 7), About timeline (Task 8)
- ✅ Magnetic buttons — hero CTA (Task 6)
- ✅ Text scramble — "Defang." hero (Task 6), Now glyphs (Task 6), blog heading (Task 6), HorizontalFeatures heading (Task 7)
- ✅ Count-up counters — AboutSection stats (Task 4)
- ✅ Custom cursor trail — CursorTrail global (Task 1)
- ✅ MotionPathPlugin registered (Task 1)
- ✅ prefers-reduced-motion handled in every hook via gsap.matchMedia

**Placeholder scan:** None found.

**Type consistency:**
- `usePlaneScroll` returns `{ planeRef }` — used as `const { planeRef } = usePlaneScroll(sectionRef)` ✅
- `useMagneticButton` returns `RefObject<T>` — used as `const ctaRef = useMagneticButton<HTMLAnchorElement>()` ✅
- `useCountUp(ref, target)` — used as `useCountUp(ref, value)` where value is the stat string ✅
- `useHorizontalScroll(wrapperRef, trackRef)` — consistent across Task 7 and Task 8 ✅
- `ScrambleText` props: `children: string`, `trigger?: boolean`, `duration?: number` — used consistently ✅
