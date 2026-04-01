# About Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a 5-section About page at `/about` with an Apple-style typewriter hero, a CSS film-tape timeline carousel, and FadeIn-animated story/now/contact sections.

**Architecture:** Three new files under `src/components/about/` — `HeroTypewriter.tsx` (client, handles animation state), `HeroTypewriter.module.css`, `TimelineTape.tsx` (client, CSS-only scroll), `TimelineTape.module.css` — assembled in a server component `src/app/about/page.tsx`. No new dependencies needed.

**Tech Stack:** Next.js App Router, TypeScript, CSS Modules (keyframes), framer-motion FadeIn, lucide-react icons.

---

### Task 1: HeroTypewriter client component

**Files:**
- Create: `src/components/about/HeroTypewriter.tsx`
- Create: `src/components/about/HeroTypewriter.module.css`

- [ ] **Step 1: Create the CSS module**

`src/components/about/HeroTypewriter.module.css`:
```css
.section {
  min-height: 100vh;
  background: #000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  position: relative;
  overflow: hidden;
}

.glow {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(ellipse 60% 50% at 50% 50%, rgba(242,201,76,0.06) 0%, transparent 70%);
  pointer-events: none;
}

.content {
  position: relative;
  text-align: center;
  max-width: 800px;
  width: 100%;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 980px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  margin-bottom: 32px;
}

.badgeDot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #4ade80;
  flex-shrink: 0;
}

.badgeText {
  color: #4ade80;
  font-size: 13px;
  font-weight: 500;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif;
}

.headline {
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif;
  font-size: clamp(32px, 5vw, 52px);
  font-weight: 700;
  letter-spacing: -0.04em;
  word-spacing: 0.12em;
  min-height: 76px;
  line-height: 1.15;
  margin-bottom: 40px;
}

.phase1Color {
  color: #f5f5f7;
}

.phase2Color {
  color: rgba(245, 245, 247, 0.85);
}

.gold {
  color: #f2c94c;
}

.cursor {
  display: inline-block;
  width: 3px;
  height: 0.85em;
  background: #f2c94c;
  margin-left: 4px;
  vertical-align: middle;
  animation: cursorBlink 1s step-end infinite;
}

.buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.btnPrimary {
  display: inline-flex;
  align-items: center;
  padding: 12px 28px;
  border-radius: 980px;
  background: #f2c94c;
  color: #000;
  font-weight: 700;
  font-size: 15px;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif;
  text-decoration: none;
  transition: transform 0.15s, box-shadow 0.15s;
}

.btnPrimary:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 24px rgba(242,201,76,0.4);
}

.btnSecondary {
  display: inline-flex;
  align-items: center;
  padding: 12px 28px;
  border-radius: 980px;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.12);
  color: #f5f5f7;
  font-weight: 600;
  font-size: 15px;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif;
  text-decoration: none;
  transition: background 0.15s;
}

.btnSecondary:hover {
  background: rgba(255,255,255,0.13);
}

@keyframes cursorBlink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
```

- [ ] **Step 2: Create the component**

`src/components/about/HeroTypewriter.tsx`:
```tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './HeroTypewriter.module.css';

const PHASE1 = "Hi, I'm Defang";
const DEFANG_START = PHASE1.indexOf('Defang'); // 8
const PHASE2_WORDS = [
  'Do', 'what', 'you', 'set', 'out', 'to', 'do', '—',
  'And', 'do', 'it', 'better', 'than', 'before',
];

type Phase = 1 | 2;

export function HeroTypewriter() {
  const [phase, setPhase] = useState<Phase>(1);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [wordIdx, setWordIdx] = useState(0);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (phase === 1 && !isDeleting) {
      if (text.length < PHASE1.length) {
        timer = setTimeout(() => setText(PHASE1.slice(0, text.length + 1)), 75);
      } else {
        timer = setTimeout(() => setIsDeleting(true), 900);
      }
    } else if (phase === 1 && isDeleting) {
      if (text.length > 0) {
        timer = setTimeout(() => setText(text.slice(0, -1)), 38);
      } else {
        setIsDeleting(false);
        setPhase(2);
        setWordIdx(0);
      }
    } else {
      // phase === 2
      if (wordIdx < PHASE2_WORDS.length) {
        timer = setTimeout(() => setWordIdx((i) => i + 1), 130);
      } else {
        timer = setTimeout(() => {
          setPhase(1);
          setText('');
          setWordIdx(0);
        }, 4500);
      }
    }

    return () => clearTimeout(timer);
  }, [phase, text, isDeleting, wordIdx]);

  const renderContent = () => {
    if (phase === 1) {
      if (text.length <= DEFANG_START) {
        return <span>{text}</span>;
      }
      return (
        <>
          <span>{text.slice(0, DEFANG_START)}</span>
          <span className={styles.gold}>{text.slice(DEFANG_START)}</span>
        </>
      );
    }
    return <span>{PHASE2_WORDS.slice(0, wordIdx).join(' ')}</span>;
  };

  return (
    <section className={styles.section}>
      <div className={styles.glow} />
      <div className={styles.content}>
        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          <span className={styles.badgeText}>Available for freelance</span>
        </div>

        <div
          className={`${styles.headline} ${
            phase === 1 ? styles.phase1Color : styles.phase2Color
          }`}
        >
          {renderContent()}
          <span className={styles.cursor} aria-hidden="true" />
        </div>

        <div className={styles.buttons}>
          <Link href="/blog" className={styles.btnPrimary}>
            Read my articles
          </Link>
          <a href="mailto:your@email.com" className={styles.btnSecondary}>
            Say hello
          </a>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Verify build compiles**

```bash
bun run build 2>&1 | tail -20
```
Expected: no TypeScript errors for the new file.

- [ ] **Step 4: Commit**

```bash
git add src/components/about/HeroTypewriter.tsx src/components/about/HeroTypewriter.module.css
git commit -m "feat(about): add HeroTypewriter client component"
```

---

### Task 2: TimelineTape client component

**Files:**
- Create: `src/components/about/TimelineTape.tsx`
- Create: `src/components/about/TimelineTape.module.css`

- [ ] **Step 1: Create the CSS module**

`src/components/about/TimelineTape.module.css`:
```css
.wrapper {
  position: relative;
  overflow: hidden;
  background: #0a0e15;
  border-top: 1px solid rgba(255,255,255,0.05);
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.wrapper:hover .track {
  animation-play-state: paused;
}

.fadeLeft {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 80px;
  background: linear-gradient(to right, #0a0e15, transparent);
  pointer-events: none;
  z-index: 2;
}

.fadeRight {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 80px;
  background: linear-gradient(to left, #0a0e15, transparent);
  pointer-events: none;
  z-index: 2;
}

.track {
  display: flex;
  width: max-content;
  animation: tapeScroll 18s linear infinite;
}

.slice {
  width: 200px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgba(255,255,255,0.05);
}

.sprocketRow {
  height: 28px;
  background: #111820;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sprocket {
  width: 14px;
  height: 14px;
  border-radius: 3px;
  border: 1.5px solid rgba(255,255,255,0.15);
  background: transparent;
}

.card {
  flex: 1;
  padding: 28px 20px;
  background: #0d1117;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 120px;
}

.cardNow {
  background: rgba(242,201,76,0.03);
  box-shadow: inset 0 0 0 1px rgba(242,201,76,0.2), 0 0 24px rgba(242,201,76,0.08);
}

.year {
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: #e6edf3;
}

.yearNow {
  color: #f2c94c;
}

.desc {
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif;
  font-size: 12px;
  color: #6b7280;
  line-height: 1.6;
}

@keyframes tapeScroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
```

- [ ] **Step 2: Create the component**

`src/components/about/TimelineTape.tsx`:
```tsx
'use client';

import styles from './TimelineTape.module.css';

const MILESTONES = [
  { year: '2019', desc: 'First line of code' },
  { year: '2020', desc: 'First freelance project' },
  { year: '2022', desc: 'Launched this blog' },
  { year: '2024', desc: 'First SaaS shipped' },
  { year: 'Now', desc: 'AI tools & Three.js', isNow: true },
];

// Duplicate for seamless infinite loop (animation goes -50%)
const CARDS = [...MILESTONES, ...MILESTONES];

export function TimelineTape() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.fadeLeft} />
      <div className={styles.fadeRight} />

      <div className={styles.track}>
        {CARDS.map((card, i) => (
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

- [ ] **Step 3: Verify build compiles**

```bash
bun run build 2>&1 | tail -20
```
Expected: no TypeScript errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/about/TimelineTape.tsx src/components/about/TimelineTape.module.css
git commit -m "feat(about): add TimelineTape CSS carousel component"
```

---

### Task 3: About page — assemble all sections

**Files:**
- Create: `src/app/about/page.tsx`

- [ ] **Step 1: Create the page**

`src/app/about/page.tsx`:
```tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { Github, Twitter, Mail } from 'lucide-react';
import { HeroTypewriter } from '@/components/about/HeroTypewriter';
import { TimelineTape } from '@/components/about/TimelineTape';
import { FadeIn } from '@/components/animations/FadeIn';

export const metadata: Metadata = {
  title: 'About — Defang',
  description:
    "Developer, writer, and indie hacker. Learn about my story, journey, and what I'm doing now.",
};

const HERO_FONT =
  "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif";

const NOW_ITEMS = [
  {
    icon: '🔨',
    label: 'Building',
    desc: 'AI-powered writing tools and exploring the boundaries of what's possible with LLMs.',
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

export default function AboutPage() {
  return (
    <div style={{ background: '#000' }}>
      {/* ── Section 1: Hero ── */}
      <HeroTypewriter />

      {/* ── Section 2: My Story ── */}
      <section
        style={{
          padding: '80px 24px',
          background: '#0a0e15',
          borderTop: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <FadeIn>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '48px',
                alignItems: 'start',
              }}
            >
              <p
                style={{
                  fontFamily: HERO_FONT,
                  fontSize: 'clamp(20px, 2.5vw, 26px)',
                  fontWeight: 700,
                  color: '#f5f5f7',
                  lineHeight: 1.35,
                  letterSpacing: '-0.03em',
                  margin: 0,
                }}
              >
                "I fell in love with coding in 2019 and never looked back."
              </p>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  fontFamily: HERO_FONT,
                  fontSize: '15px',
                  color: '#6b7280',
                  lineHeight: 1.75,
                }}
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
                  I believe in learning in public and sharing everything freely with the community.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Section 3: Timeline ── */}
      <TimelineTape />

      {/* ── Section 4: What I'm Doing Now ── */}
      <section
        style={{
          padding: '80px 24px',
          background: '#0a0e15',
          borderTop: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <FadeIn>
            <p
              style={{
                fontFamily: HERO_FONT,
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                color: '#f2c94c',
                textTransform: 'uppercase',
                marginBottom: '32px',
              }}
            >
              What I&apos;m Doing Now
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '16px',
              }}
            >
              {NOW_ITEMS.map((item) => (
                <div
                  key={item.label}
                  style={{
                    background: '#161b22',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '12px',
                    padding: '24px 20px',
                  }}
                >
                  <div style={{ fontSize: '24px', marginBottom: '12px' }}>{item.icon}</div>
                  <div
                    style={{
                      fontFamily: HERO_FONT,
                      fontSize: '15px',
                      fontWeight: 600,
                      color: '#e6edf3',
                      marginBottom: '8px',
                    }}
                  >
                    {item.label}
                  </div>
                  <div
                    style={{
                      fontFamily: HERO_FONT,
                      fontSize: '13px',
                      color: '#6b7280',
                      lineHeight: 1.65,
                    }}
                  >
                    {item.desc}
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Section 5: Contact ── */}
      <section
        style={{
          padding: '80px 24px',
          background: '#000',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          textAlign: 'center',
        }}
      >
        <FadeIn>
          <p
            style={{
              fontFamily: HERO_FONT,
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.1em',
              color: '#f2c94c',
              textTransform: 'uppercase',
              marginBottom: '16px',
            }}
          >
            Let&apos;s Talk
          </p>
          <p
            style={{
              fontFamily: HERO_FONT,
              fontSize: 'clamp(24px, 3vw, 36px)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: '#f5f5f7',
              marginBottom: '12px',
            }}
          >
            Want to work together?
          </p>
          <p
            style={{
              fontFamily: HERO_FONT,
              fontSize: '15px',
              color: '#6b7280',
              marginBottom: '32px',
            }}
          >
            I&apos;m always open to interesting projects, collabs, or just a chat.
          </p>
          <div
            style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <a
              href="mailto:your@email.com"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 28px',
                borderRadius: '980px',
                background: '#f2c94c',
                color: '#000',
                fontWeight: 700,
                fontSize: '15px',
                fontFamily: HERO_FONT,
                textDecoration: 'none',
              }}
            >
              <Mail size={16} />
              your@email.com
            </a>
            <a
              href="https://github.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                borderRadius: '980px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#f5f5f7',
                fontWeight: 600,
                fontSize: '15px',
                fontFamily: HERO_FONT,
                textDecoration: 'none',
              }}
            >
              <Github size={16} />
              GitHub
            </a>
            <a
              href="https://twitter.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                borderRadius: '980px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#f5f5f7',
                fontWeight: 600,
                fontSize: '15px',
                fontFamily: HERO_FONT,
                textDecoration: 'none',
              }}
            >
              <Twitter size={16} />
              Twitter
            </a>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
```

- [ ] **Step 2: Add "About" link to the site header**

Read `src/components/layout/Header.tsx`, find the nav links array, add `{ href: '/about', label: 'About' }`.

- [ ] **Step 3: Verify full build**

```bash
bun run build 2>&1 | tail -30
```
Expected: exit 0, static page `/about` listed in the build output.

- [ ] **Step 4: Smoke-test in browser**

```bash
bun run dev
```
Open `http://localhost:3000/about`. Verify:
- Hero fills viewport, typewriter cycles phase 1 → phase 2 → loop
- "Defang" renders in gold during phase 1
- Tape scrolls and pauses on hover
- Story, Now, Contact sections fade in on scroll

- [ ] **Step 5: Commit**

```bash
git add src/app/about/page.tsx src/components/layout/Header.tsx
git commit -m "feat(about): implement About page with typewriter hero and tape timeline"
```
