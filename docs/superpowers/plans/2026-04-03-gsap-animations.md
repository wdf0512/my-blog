# GSAP Advanced Animations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add GSAP-powered advanced animations to Home (parallax hero), Blog (3D flip cards + filter morph), and About (stagger + masked line reveal) pages using `@gsap/react` hooks alongside existing framer-motion.

**Architecture:** Each animation is a focused custom hook in `src/hooks/`. A `GSAPProvider` component registers ScrollTrigger once and handles `prefers-reduced-motion`. Framer-motion components are untouched.

**Tech Stack:** GSAP 3.12.5 (already installed), `@gsap/react` (new), Next.js App Router, TypeScript, Tailwind CSS v3.4, Bun

---

## File Map

**Create:**
- `src/components/providers/GSAPProvider.tsx` — registers ScrollTrigger plugin, handles reduced-motion
- `src/hooks/useParallaxHero.ts` — Home hero entrance + mouse depth parallax
- `src/hooks/useFlipCards.ts` — Blog card 3D flip-in on scroll
- `src/hooks/useFilterMorph.ts` — Blog card scale/fade on tag filter change
- `src/hooks/useSectionStagger.ts` — About per-section stagger + SVG line draw
- `src/hooks/useLineReveal.ts` — About masked line-by-line text reveal
- `src/components/about/AboutSections.tsx` — client component wrapper for About static sections

**Modify:**
- `src/app/layout.tsx` — add `<GSAPProvider>` inside `<ThemeProvider>`
- `src/components/home/HeroSection.tsx` — add refs + `data-hero-item` attrs, call `useParallaxHero`
- `src/components/blog/BlogFilter.tsx` — add `gridRef`, `data-post-slug`/`data-post-tags`, call both blog hooks
- `src/app/about/page.tsx` — replace inline sections with `<AboutSections />`

---

## Task 1: Install @gsap/react + create GSAPProvider

**Files:**
- Create: `src/components/providers/GSAPProvider.tsx`

- [ ] **Step 1: Install @gsap/react**

```bash
bun add @gsap/react
```

Expected output: package added to `package.json` and `bun.lock` updated.

- [ ] **Step 2: Create GSAPProvider**

Create `src/components/providers/GSAPProvider.tsx`:

```tsx
'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function GSAPProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.defaults({ duration: 0, delay: 0 });
    });

    return () => mm.revert();
  }, []);

  return <>{children}</>;
}
```

- [ ] **Step 3: Add GSAPProvider to layout**

Modify `src/app/layout.tsx` — import and wrap inside `<ThemeProvider>`:

```tsx
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import localFont from 'next/font/local';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { GSAPProvider } from '@/components/providers/GSAPProvider';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import './globals.css';

const clashDisplay = localFont({
  src: [
    { path: '../../public/fonts/ClashDisplay-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../../public/fonts/ClashDisplay-Semibold.woff2', weight: '600', style: 'normal' },
    { path: '../../public/fonts/ClashDisplay-Bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-clash-display',
  display: 'swap',
  fallback: ['sans-serif'],
});

export const metadata: Metadata = {
  title: 'Creative Coding & Conversations',
  description: "Insights from a developer's journey - exploring tech, indie hacking, and web development",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} ${clashDisplay.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="font-sans" suppressHydrationWarning>
        <ThemeProvider>
          <GSAPProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </GSAPProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Verify dev server starts without errors**

```bash
bun run dev
```

Expected: no TypeScript or import errors in the terminal. Visit `http://localhost:3000` — site loads normally.

- [ ] **Step 5: Commit**

```bash
git add src/components/providers/GSAPProvider.tsx src/app/layout.tsx package.json bun.lock
git commit -m "feat(gsap): install @gsap/react and add GSAPProvider"
```

---

## Task 2: useParallaxHero — Home hero entrance + mouse depth

**Files:**
- Create: `src/hooks/useParallaxHero.ts`
- Modify: `src/components/home/HeroSection.tsx`

- [ ] **Step 1: Create useParallaxHero hook**

Create `src/hooks/useParallaxHero.ts`:

```ts
'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export function useParallaxHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const asciiRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline();

      // Text column enters from left, ASCII from right at different speeds
      tl.from(textRef.current, { x: -60, opacity: 0, duration: 0.9, ease: 'power3.out' })
        .from(asciiRef.current, { x: 60, opacity: 0, duration: 1.2, ease: 'power3.out' }, '<0.1');

      // Stagger internal items inside text column
      const q = gsap.utils.selector(textRef);
      tl.from(
        q('[data-hero-item]'),
        { y: 20, opacity: 0, stagger: 0.12, duration: 0.6, ease: 'power2.out' },
        '<0.2'
      );

      // Mouse parallax — desktop only
      const mm = gsap.matchMedia();
      mm.add('(min-width: 769px)', () => {
        const section = sectionRef.current;
        if (!section) return;

        const onMouseMove = (e: MouseEvent) => {
          const { left, top, width, height } = section.getBoundingClientRect();
          const x = (e.clientX - left - width / 2) / (width / 2);
          const y = (e.clientY - top - height / 2) / (height / 2);
          gsap.to(textRef.current, { x: x * 8, y: y * 8, duration: 0.5, ease: 'power1.out' });
          gsap.to(asciiRef.current, { x: -x * 18, y: -y * 18, duration: 0.7, ease: 'power1.out' });
        };

        section.addEventListener('mousemove', onMouseMove);
        return () => section.removeEventListener('mousemove', onMouseMove);
      });
    },
    { scope: sectionRef }
  );

  return { sectionRef, textRef, asciiRef };
}
```

- [ ] **Step 2: Update HeroSection to use the hook**

Replace `src/components/home/HeroSection.tsx` with:

```tsx
'use client';

import { HeroSceneLoader } from '@/components/3d/HeroSceneLoader';
import { Github, Twitter, Linkedin, Mail, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import btn from '@/styles/buttons.module.css';
import styles from './HeroSection.module.css';
import { useParallaxHero } from '@/hooks/useParallaxHero';

const SOCIAL = [
  { label: 'GitHub', href: 'https://github.com/yourusername', icon: Github, color: 'var(--text-primary)' },
  { label: 'Twitter', href: 'https://twitter.com/yourusername', icon: Twitter, color: '#1DA1F2' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/yourusername', icon: Linkedin, color: '#0A66C2' },
  { label: 'Email', href: 'mailto:defangninj@outlook.com', icon: Mail, color: 'var(--primary)' },
] as const;

export function HeroSection() {
  const { sectionRef, textRef, asciiRef } = useParallaxHero();

  return (
    <section ref={sectionRef} className="relative overflow-hidden min-h-screen flex flex-col justify-center">
      {/* Radial glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: 'radial-gradient(ellipse 55% 60% at 20% 50%, rgba(242,201,76,0.07) 0%, transparent 70%)' }}
        aria-hidden
      />

      <div className="relative container mx-auto px-4 py-16 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left: text + CTA */}
          <div ref={textRef} className="order-2 lg:order-1 flex flex-col items-start gap-5">
            <div data-hero-item className={styles.eyebrow}>
              <span className={styles.eyebrowDot} aria-hidden />
              Developer · Writer · Builder
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
              I build beautiful web experiences and share everything I learn — from React patterns to indie hacking and creative coding with Three.js.
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

- [ ] **Step 3: Verify in browser**

```bash
bun run dev
```

Visit `http://localhost:3000`. On load, text column should slide in from the left and ASCII banana from the right. On desktop, moving the mouse should create a subtle parallax depth effect between the two columns.

- [ ] **Step 4: Commit**

```bash
git add src/hooks/useParallaxHero.ts src/components/home/HeroSection.tsx
git commit -m "feat(gsap): add parallax entrance and mouse depth to home hero"
```

---

## Task 3: useFlipCards — Blog 3D flip-in on scroll

**Files:**
- Create: `src/hooks/useFlipCards.ts`
- Modify: `src/components/blog/BlogFilter.tsx` (grid ref + perspective + data attrs)

- [ ] **Step 1: Create useFlipCards hook**

Create `src/hooks/useFlipCards.ts`:

```ts
'use client';

import { RefObject } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function useFlipCards(gridRef: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      const cards = gsap.utils.toArray<HTMLElement>('[data-post-slug]', gridRef.current!);
      if (cards.length === 0) return;

      gsap.from(cards, {
        rotateY: -45,
        opacity: 0,
        duration: 0.5,
        ease: 'back.out(1.4)',
        stagger: { each: 0.08, from: 'start' },
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 80%',
          once: true,
        },
      });
    },
    { scope: gridRef }
  );
}
```

- [ ] **Step 2: Update BlogFilter — add gridRef, perspective, data attrs, and call useFlipCards**

Replace `src/components/blog/BlogFilter.tsx` with:

```tsx
'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Search } from 'lucide-react';
import { useFlipCards } from '@/hooks/useFlipCards';

const THEMES = [
  {
    pocket: 'bg-amber-50 dark:bg-amber-950/30',
    title: 'text-amber-600 dark:text-amber-400',
    read: 'text-amber-500 dark:text-amber-400',
    deco: 'text-amber-300/80 dark:text-amber-700/50',
  },
  {
    pocket: 'bg-sky-50 dark:bg-sky-900/20',
    title: 'text-sky-600 dark:text-sky-400',
    read: 'text-sky-500 dark:text-sky-400',
    deco: 'text-sky-300/80 dark:text-sky-700/50',
  },
  {
    pocket: 'bg-violet-50 dark:bg-violet-900/20',
    title: 'text-violet-600 dark:text-violet-400',
    read: 'text-violet-500 dark:text-violet-400',
    deco: 'text-violet-300/80 dark:text-violet-700/50',
  },
  {
    pocket: 'bg-rose-50 dark:bg-rose-950/30',
    title: 'text-rose-600 dark:text-rose-400',
    read: 'text-rose-500 dark:text-rose-400',
    deco: 'text-rose-300/80 dark:text-rose-700/50',
  },
  {
    pocket: 'bg-emerald-50 dark:bg-emerald-950/30',
    title: 'text-emerald-700 dark:text-emerald-400',
    read: 'text-emerald-600 dark:text-emerald-400',
    deco: 'text-emerald-300/80 dark:text-emerald-700/50',
  },
] as const;

type Post = {
  slug: string;
  title: string;
  description?: string;
  date: string;
  readingTime: string;
  tags?: string[];
};

type Props = {
  posts: Post[];
  allTags: string[];
};

export function BlogFilter({ posts, allTags }: Props) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useFlipCards(gridRef);

  const filtered = activeTag
    ? posts.filter((p) => p.tags?.includes(activeTag))
    : posts;

  return (
    <>
      {allTags.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Search className="w-4 h-4 text-text-muted" />
            <span className="text-sm font-semibold text-text-muted uppercase tracking-wide">
              Filter by topic
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTag(null)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTag === null
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-surface border border-border text-text-primary hover:bg-primary/10 hover:border-primary'
              }`}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag === activeTag ? null : tag)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeTag === tag
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-surface border border-border text-text-primary hover:bg-primary/10 hover:border-primary'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      <div
        ref={gridRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        style={{ perspective: '1200px' }}
      >
        {filtered.map((post, i) => {
          const theme = THEMES[i % THEMES.length];
          const date = new Date(post.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          });

          return (
            <article
              key={post.slug}
              data-post-slug={post.slug}
              data-post-tags={(post.tags ?? []).join(',')}
            >
              <Link
                href={`/blog/${post.slug}`}
                className="group flex flex-col h-[400px] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 border border-border"
              >
                <div className={`relative flex items-center justify-center h-44 flex-shrink-0 overflow-hidden ${theme.pocket}`}>
                  <span
                    className={`font-display font-black text-[9rem] leading-none select-none transition-transform duration-500 group-hover:scale-110 ${theme.deco}`}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {post.tags && post.tags.length > 0 && (
                    <div className="absolute bottom-3 left-4 flex flex-wrap gap-1.5">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-lg bg-background/80 backdrop-blur-sm text-xs font-semibold text-text-primary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className={`flex-1 ${theme.pocket} border-t border-black/5 dark:border-white/5 px-5 pt-4 pb-5`}>
                  <p className="text-xs text-text-muted font-medium">
                    {date} · {post.readingTime}
                  </p>
                  <h2 className={`font-display text-lg font-black mt-1.5 mb-2 leading-snug line-clamp-2 ${theme.title}`}>
                    {post.title}
                  </h2>
                  {post.description && (
                    <p className="text-text-secondary text-sm leading-relaxed line-clamp-2">
                      {post.description}
                    </p>
                  )}
                  <div className={`mt-3 flex items-center gap-1.5 text-xs font-semibold ${theme.read} opacity-70 group-hover:opacity-100 group-hover:gap-2.5 transition-all`}>
                    Read article <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            </article>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="text-text-secondary text-lg mb-3">No articles tagged &ldquo;{activeTag}&rdquo;</p>
          <button
            onClick={() => setActiveTag(null)}
            className="text-sm text-primary hover:underline"
          >
            Clear filter
          </button>
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 3: Verify in browser**

Visit `http://localhost:3000/blog`. Scroll the card grid into view — each card should flip in from a -45° Y-axis rotation, staggered left-to-right.

- [ ] **Step 4: Commit**

```bash
git add src/hooks/useFlipCards.ts src/components/blog/BlogFilter.tsx
git commit -m "feat(gsap): add 3D flip-in entrance to blog cards"
```

---

## Task 4: useFilterMorph — Blog tag filter animation

**Files:**
- Create: `src/hooks/useFilterMorph.ts`
- Modify: `src/components/blog/BlogFilter.tsx` (call the hook, pass activeTag)

- [ ] **Step 1: Create useFilterMorph hook**

Create `src/hooks/useFilterMorph.ts`:

```ts
'use client';

import { RefObject, useEffect } from 'react';
import gsap from 'gsap';

export function useFilterMorph(
  gridRef: RefObject<HTMLElement | null>,
  activeTag: string | null
) {
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const cards = gsap.utils.toArray<HTMLElement>('[data-post-slug]', grid);
    if (cards.length === 0) return;

    gsap.killTweensOf(cards);

    if (activeTag === null) {
      gsap.to(cards, { scale: 1, opacity: 1, duration: 0.25, ease: 'power2.out' });
      return;
    }

    cards.forEach((card) => {
      const tags = (card.dataset.postTags ?? '').split(',').filter(Boolean);
      const matches = tags.includes(activeTag);

      if (matches) {
        gsap.to(card, { opacity: 1, scale: 1.02, duration: 0.2, ease: 'power2.out' });
        gsap.to(card, { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.5)', delay: 0.2 });
      } else {
        gsap.to(card, { scale: 0.92, opacity: 0.25, duration: 0.25, ease: 'power2.out' });
      }
    });
  }, [activeTag, gridRef]);
}
```

- [ ] **Step 2: Add useFilterMorph call to BlogFilter**

In `src/components/blog/BlogFilter.tsx`, add the import and hook call directly after `useFlipCards(gridRef)`:

```tsx
// Add import at top:
import { useFilterMorph } from '@/hooks/useFilterMorph';

// Add after useFlipCards(gridRef):
useFilterMorph(gridRef, activeTag);
```

The full imports block at the top of `BlogFilter.tsx` should now be:

```tsx
import { useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Search } from 'lucide-react';
import { useFlipCards } from '@/hooks/useFlipCards';
import { useFilterMorph } from '@/hooks/useFilterMorph';
```

And the two hook calls after state declaration:

```tsx
const gridRef = useRef<HTMLDivElement>(null);
useFlipCards(gridRef);
useFilterMorph(gridRef, activeTag);
```

- [ ] **Step 3: Verify in browser**

Visit `http://localhost:3000/blog`. Click a tag filter — non-matching cards should shrink and fade to 25% opacity; matching cards should pop slightly then settle. Clicking "All" should restore all cards to full size/opacity.

- [ ] **Step 4: Commit**

```bash
git add src/hooks/useFilterMorph.ts src/components/blog/BlogFilter.tsx
git commit -m "feat(gsap): add filter morph animation to blog tag filter"
```

---

## Task 5: Extract AboutSections client component

**Files:**
- Create: `src/components/about/AboutSections.tsx`
- Modify: `src/app/about/page.tsx`

The About page is a server component (exports `metadata`). Hooks can't run there. This task extracts the 3 static sections (My Story, What I'm Doing Now, Contact) into a `'use client'` component so hooks can be added in Tasks 6 and 7.

- [ ] **Step 1: Create AboutSections.tsx**

Create `src/components/about/AboutSections.tsx`:

```tsx
'use client';

import { Github, Mail, Twitter } from 'lucide-react';
import btn from '@/styles/buttons.module.css';

const FONT =
  "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif";

const SECTION_LABEL: React.CSSProperties = {
  fontFamily: FONT,
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '0.1em',
  color: 'var(--primary)',
  textTransform: 'uppercase',
};

const NOW_ITEMS = [
  {
    icon: '🔨',
    label: 'Building',
    desc: "AI-powered writing tools and exploring the boundaries of what's possible with LLMs.",
  },
  {
    icon: '📖',
    label: 'Learning',
    desc: 'Going deeper on WebGL shaders and advanced Three.js techniques.',
  },
  {
    icon: '✍️',
    label: 'Writing',
    desc: 'Regular articles on React patterns, indie hacking, and creative coding.',
  },
];

export function AboutSections() {
  return (
    <>
      {/* Section: My Story */}
      <section
        className="px-4 md:px-8 py-12 md:py-20"
        style={{ background: 'var(--surface)' }}
      >
        {/* SVG divider — replaces border-top, animated in Task 6 */}
        <svg
          className="section-divider w-full mb-12"
          height="2"
          aria-hidden
        >
          <line x1="0" y1="1" x2="100%" y2="1" stroke="var(--border)" strokeWidth="1" />
        </svg>

        <div className="max-w-[960px] mx-auto">
          <p className="mb-8" style={SECTION_LABEL}>My Story</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
            {/* Quote — wrapped for line reveal in Task 7 */}
            <div className="quote-block">
              <p
                style={{
                  fontFamily: FONT,
                  fontSize: 'clamp(20px, 2.5vw, 26px)',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  lineHeight: 1.35,
                  letterSpacing: '-0.03em',
                  margin: 0,
                }}
              >
                <span className="line-outer" style={{ overflow: 'hidden', display: 'block' }}>
                  <span className="line-inner" style={{ display: 'block' }}>
                    &ldquo;I fell in love with coding in 2019
                  </span>
                </span>
                <span className="line-outer" style={{ overflow: 'hidden', display: 'block' }}>
                  <span className="line-inner" style={{ display: 'block' }}>
                    and never looked back.&rdquo;
                  </span>
                </span>
              </p>
            </div>
            <div
              className="flex flex-col gap-4"
              style={{ fontFamily: FONT, fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.75 }}
            >
              <p style={{ margin: 0 }}>
                What started as curiosity turned into a full career. I&apos;m self-taught,
                which means I&apos;ve always had to learn by building — and that&apos;s
                exactly how I like it.
              </p>
              <p style={{ margin: 0 }}>
                When I&apos;m not shipping code, I&apos;m experimenting with 3D graphics,
                writing about my experiences, or working on my next side project.
              </p>
              <p style={{ margin: 0 }}>
                I believe in learning in public and sharing everything freely with the
                community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section: What I'm Doing Now */}
      <section
        className="px-4 md:px-8 py-12 md:py-20"
        style={{ background: 'var(--surface)' }}
      >
        <svg className="section-divider w-full mb-12" height="2" aria-hidden>
          <line x1="0" y1="1" x2="100%" y2="1" stroke="var(--border)" strokeWidth="1" />
        </svg>

        <div className="max-w-[960px] mx-auto">
          <p className="mb-8" style={SECTION_LABEL}>What I&apos;m Doing Now</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {NOW_ITEMS.map((item) => (
              <div
                key={item.label}
                style={{
                  background: 'var(--background)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '24px 20px',
                }}
              >
                <div style={{ fontSize: '24px', marginBottom: '12px' }}>{item.icon}</div>
                <div
                  style={{
                    fontFamily: FONT,
                    fontSize: '15px',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    marginBottom: '8px',
                  }}
                >
                  {item.label}
                </div>
                <div style={{ fontFamily: FONT, fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section: Contact */}
      <section
        className="px-4 md:px-8 py-12 md:py-20 text-center"
        style={{ background: 'var(--background)' }}
      >
        <svg className="section-divider w-full mb-12" height="2" aria-hidden>
          <line x1="0" y1="1" x2="100%" y2="1" stroke="var(--border)" strokeWidth="1" />
        </svg>

        <div className="max-w-[960px] mx-auto">
          <p className="mb-4" style={SECTION_LABEL}>Let&apos;s Talk</p>
          <p
            className="mb-3"
            style={{
              fontFamily: FONT,
              fontSize: 'clamp(24px, 3vw, 36px)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
            }}
          >
            Want to work together?
          </p>
          <p
            className="mb-8"
            style={{ fontFamily: FONT, fontSize: '15px', color: 'var(--text-secondary)' }}
          >
            I&apos;m always open to interesting projects, collabs, or just a chat.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="mailto:defangninj@outlook.com" className={btn.btnPrimary}>
              <span className={btn.btnLabel}>defangninj@outlook.com</span>
              <span className={btn.btnKnob} aria-hidden>
                <Mail className={btn.btnKnobIcon} strokeWidth={2} />
              </span>
            </a>
            <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className={btn.btnSecondary}>
              <Github className={btn.btnSecondaryIcon} size={16} aria-hidden />
              <span className={btn.btnLabel}>GitHub</span>
            </a>
            <a href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer" className={btn.btnSecondary}>
              <Twitter className={btn.btnSecondaryIcon} size={16} aria-hidden />
              <span className={btn.btnLabel}>Twitter</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 2: Update about/page.tsx to use AboutSections**

Replace `src/app/about/page.tsx` with:

```tsx
import type { Metadata } from 'next';
import { HeroTypewriterLoader } from '@/components/about/HeroTypewriterLoader';
import { TimelineTapeLoader } from '@/components/about/TimelineTapeLoader';
import { AboutSections } from '@/components/about/AboutSections';

export const metadata: Metadata = {
  title: 'About — Defang',
  description:
    "Developer, writer, and indie hacker. Learn about my story, journey, and what I'm doing now.",
};

export default function AboutPage() {
  return (
    <div style={{ background: 'var(--background)' }}>
      <HeroTypewriterLoader />
      <TimelineTapeLoader />
      <AboutSections />
    </div>
  );
}
```

- [ ] **Step 3: Verify in browser**

Visit `http://localhost:3000/about`. Page should look identical to before — all sections render, no visual change yet. Confirm no TypeScript errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/about/AboutSections.tsx src/app/about/page.tsx
git commit -m "refactor(about): extract static sections into client component for GSAP hooks"
```

---

## Task 6: useSectionStagger — About per-section stagger + SVG line draw

**Files:**
- Create: `src/hooks/useSectionStagger.ts`
- Modify: `src/components/about/AboutSections.tsx`

- [ ] **Step 1: Create useSectionStagger hook**

Create `src/hooks/useSectionStagger.ts`:

```ts
'use client';

import { RefObject } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function useSectionStagger(
  sectionRef: RefObject<HTMLElement | null>,
  options: { springCards?: boolean } = {}
) {
  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      const section = sectionRef.current;
      if (!section) return;

      const svgLine = section.querySelector<SVGLineElement>('.section-divider line');
      const children = gsap.utils.toArray<HTMLElement>('[data-stagger]', section);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          once: true,
        },
      });

      // Animate SVG divider line drawing in
      if (svgLine) {
        gsap.set(svgLine, { strokeDasharray: 2000, strokeDashoffset: 2000 });
        tl.to(svgLine, { strokeDashoffset: 0, duration: 0.8, ease: 'power2.inOut' });
      }

      if (children.length > 0) {
        tl.from(
          children,
          {
            y: 32,
            opacity: 0,
            stagger: 0.1,
            duration: 0.6,
            ease: options.springCards ? 'back.out(1.7)' : 'power2.out',
          },
          svgLine ? '-=0.4' : 0
        );
      }
    },
    { scope: sectionRef }
  );
}
```

- [ ] **Step 2: Add refs and data-stagger attrs to AboutSections**

Update `src/components/about/AboutSections.tsx` — add imports, refs, and hook calls. Add `data-stagger` to the key children in each section, and `ref` to each section element.

Replace the imports and the component body with:

```tsx
'use client';

import { useRef } from 'react';
import { Github, Mail, Twitter } from 'lucide-react';
import btn from '@/styles/buttons.module.css';
import { useSectionStagger } from '@/hooks/useSectionStagger';

const FONT =
  "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif";

const SECTION_LABEL: React.CSSProperties = {
  fontFamily: FONT,
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '0.1em',
  color: 'var(--primary)',
  textTransform: 'uppercase',
};

const NOW_ITEMS = [
  {
    icon: '🔨',
    label: 'Building',
    desc: "AI-powered writing tools and exploring the boundaries of what's possible with LLMs.",
  },
  {
    icon: '📖',
    label: 'Learning',
    desc: 'Going deeper on WebGL shaders and advanced Three.js techniques.',
  },
  {
    icon: '✍️',
    label: 'Writing',
    desc: 'Regular articles on React patterns, indie hacking, and creative coding.',
  },
];

export function AboutSections() {
  const storyRef = useRef<HTMLElement>(null);
  const nowRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  useSectionStagger(storyRef);
  useSectionStagger(nowRef, { springCards: true });
  useSectionStagger(contactRef);

  return (
    <>
      {/* Section: My Story */}
      <section
        ref={storyRef}
        className="px-4 md:px-8 py-12 md:py-20"
        style={{ background: 'var(--surface)' }}
      >
        <svg className="section-divider w-full mb-12" height="2" aria-hidden>
          <line x1="0" y1="1" x2="100%" y2="1" stroke="var(--border)" strokeWidth="1" />
        </svg>

        <div className="max-w-[960px] mx-auto">
          <p data-stagger className="mb-8" style={SECTION_LABEL}>My Story</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
            {/* quote-block intentionally has no data-stagger — handled by useLineReveal in Task 7 */}
            <div className="quote-block">
              <p
                style={{
                  fontFamily: FONT,
                  fontSize: 'clamp(20px, 2.5vw, 26px)',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  lineHeight: 1.35,
                  letterSpacing: '-0.03em',
                  margin: 0,
                }}
              >
                <span className="line-outer" style={{ overflow: 'hidden', display: 'block' }}>
                  <span className="line-inner" style={{ display: 'block' }}>
                    &ldquo;I fell in love with coding in 2019
                  </span>
                </span>
                <span className="line-outer" style={{ overflow: 'hidden', display: 'block' }}>
                  <span className="line-inner" style={{ display: 'block' }}>
                    and never looked back.&rdquo;
                  </span>
                </span>
              </p>
            </div>
            <div
              data-stagger
              className="flex flex-col gap-4"
              style={{ fontFamily: FONT, fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.75 }}
            >
              <p style={{ margin: 0 }}>
                What started as curiosity turned into a full career. I&apos;m self-taught,
                which means I&apos;ve always had to learn by building — and that&apos;s
                exactly how I like it.
              </p>
              <p style={{ margin: 0 }}>
                When I&apos;m not shipping code, I&apos;m experimenting with 3D graphics,
                writing about my experiences, or working on my next side project.
              </p>
              <p style={{ margin: 0 }}>
                I believe in learning in public and sharing everything freely with the
                community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section: What I'm Doing Now */}
      <section
        ref={nowRef}
        className="px-4 md:px-8 py-12 md:py-20"
        style={{ background: 'var(--surface)' }}
      >
        <svg className="section-divider w-full mb-12" height="2" aria-hidden>
          <line x1="0" y1="1" x2="100%" y2="1" stroke="var(--border)" strokeWidth="1" />
        </svg>

        <div className="max-w-[960px] mx-auto">
          <p data-stagger className="mb-8" style={SECTION_LABEL}>What I&apos;m Doing Now</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {NOW_ITEMS.map((item) => (
              <div
                key={item.label}
                data-stagger
                style={{
                  background: 'var(--background)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '24px 20px',
                }}
              >
                <div style={{ fontSize: '24px', marginBottom: '12px' }}>{item.icon}</div>
                <div
                  style={{
                    fontFamily: FONT,
                    fontSize: '15px',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    marginBottom: '8px',
                  }}
                >
                  {item.label}
                </div>
                <div style={{ fontFamily: FONT, fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section: Contact */}
      <section
        ref={contactRef}
        className="px-4 md:px-8 py-12 md:py-20 text-center"
        style={{ background: 'var(--background)' }}
      >
        <svg className="section-divider w-full mb-12" height="2" aria-hidden>
          <line x1="0" y1="1" x2="100%" y2="1" stroke="var(--border)" strokeWidth="1" />
        </svg>

        <div className="max-w-[960px] mx-auto">
          <p data-stagger className="mb-4" style={SECTION_LABEL}>Let&apos;s Talk</p>
          <p
            data-stagger
            className="mb-3"
            style={{
              fontFamily: FONT,
              fontSize: 'clamp(24px, 3vw, 36px)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
            }}
          >
            Want to work together?
          </p>
          <p
            data-stagger
            className="mb-8"
            style={{ fontFamily: FONT, fontSize: '15px', color: 'var(--text-secondary)' }}
          >
            I&apos;m always open to interesting projects, collabs, or just a chat.
          </p>
          <div data-stagger className="flex flex-wrap justify-center gap-3">
            <a href="mailto:defangninj@outlook.com" className={btn.btnPrimary}>
              <span className={btn.btnLabel}>defangninj@outlook.com</span>
              <span className={btn.btnKnob} aria-hidden>
                <Mail className={btn.btnKnobIcon} strokeWidth={2} />
              </span>
            </a>
            <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className={btn.btnSecondary}>
              <Github className={btn.btnSecondaryIcon} size={16} aria-hidden />
              <span className={btn.btnLabel}>GitHub</span>
            </a>
            <a href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer" className={btn.btnSecondary}>
              <Twitter className={btn.btnSecondaryIcon} size={16} aria-hidden />
              <span className={btn.btnLabel}>Twitter</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 3: Verify in browser**

Visit `http://localhost:3000/about` and scroll down. Each section's SVG line should draw left-to-right as the section enters the viewport, followed by its content staggering up. The "Now" cards should spring in with a bounce.

- [ ] **Step 4: Commit**

```bash
git add src/hooks/useSectionStagger.ts src/components/about/AboutSections.tsx
git commit -m "feat(gsap): add per-section stagger and SVG line draw to about page"
```

---

## Task 7: useLineReveal — About masked text reveal

**Files:**
- Create: `src/hooks/useLineReveal.ts`
- Modify: `src/components/about/AboutSections.tsx` (add quoteRef + hook call)

- [ ] **Step 1: Create useLineReveal hook**

Create `src/hooks/useLineReveal.ts`:

```ts
'use client';

import { RefObject } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function useLineReveal(containerRef: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      const container = containerRef.current;
      if (!container) return;

      const lines = gsap.utils.toArray<HTMLElement>('.line-inner', container);
      if (lines.length === 0) return;

      gsap.from(lines, {
        y: '100%',
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: container,
          start: 'top 80%',
          once: true,
        },
      });
    },
    { scope: containerRef }
  );
}
```

- [ ] **Step 2: Add quoteRef + useLineReveal call to AboutSections**

In `src/components/about/AboutSections.tsx`:

Add import:
```tsx
import { useLineReveal } from '@/hooks/useLineReveal';
```

Add ref inside `AboutSections`:
```tsx
const quoteRef = useRef<HTMLDivElement>(null);
```

Add hook call after the other `useSectionStagger` calls:
```tsx
useLineReveal(quoteRef);
```

Add `ref={quoteRef}` to the `<div className="quote-block">` in the My Story section:
```tsx
<div ref={quoteRef} className="quote-block">
```

- [ ] **Step 3: Verify in browser**

Visit `http://localhost:3000/about` and scroll to My Story. The quote lines should slide up from behind their parent (masked reveal) — first line `"I fell in love with coding in 2019`, then `and never looked back."` with a 0.12s delay between them.

- [ ] **Step 4: Commit**

```bash
git add src/hooks/useLineReveal.ts src/components/about/AboutSections.tsx
git commit -m "feat(gsap): add masked line-by-line text reveal to about quote"
```

---

## Task 8: Final smoke test + add .superpowers to .gitignore

- [ ] **Step 1: Full browser walkthrough**

```bash
bun run dev
```

Check each page:

| Page | What to verify |
|---|---|
| `/` | Text enters from left, ASCII from right; mouse moves create parallax depth |
| `/blog` | Cards flip in from -45° Y rotation on scroll; tag filter morphs matching/non-matching cards |
| `/about` | SVG lines draw on scroll enter; sections stagger in; quote lines slide up masked |
| Any page | `prefers-reduced-motion: reduce` in OS settings → all animations skip instantly |

- [ ] **Step 2: Add .superpowers to .gitignore**

```bash
echo ".superpowers/" >> .gitignore
```

- [ ] **Step 3: Build check**

```bash
bun run build
```

Expected: build completes with no TypeScript errors and no `dynamic require` warnings.

- [ ] **Step 4: Final commit**

```bash
git add .gitignore
git commit -m "chore: add .superpowers to .gitignore"
```
