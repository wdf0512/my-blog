# Now Section Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the emoji + flat-border card layout in the "What I'm Doing Now" section with borderless terminal-badge cards using warm accent colours, Geist Mono typography, spring hover animation, and a pulsing dot section label.

**Architecture:** Add a CSS module (`AboutSections.module.css`) for all Now-section styles, then update `AboutSections.tsx` to use those classes. The two other sections (My Story, Contact) are untouched.

**Tech Stack:** Next.js App Router, CSS Modules, Tailwind CSS v3, TypeScript

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `src/components/about/AboutSections.module.css` | All styles for the Now section (cards, badge, label, hover, animations) |
| Modify | `src/components/about/AboutSections.tsx` | Import CSS module, rewrite `NOW_ITEMS` shape and card render block |

---

### Task 1: Create the CSS module

**Files:**
- Create: `src/components/about/AboutSections.module.css`

- [ ] **Step 1: Create the file with all Now-section styles**

```css
/* src/components/about/AboutSections.module.css */

/* ── Section label ─────────────────────────────────────── */
.nowLabel {
  font-family: var(--font-geist-mono), 'Courier New', monospace;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.18em;
  color: #fbbf24;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 32px;
}

.pulseDot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #fbbf24;
  box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.15);
  animation: dotPulse 2.4s ease-in-out infinite;
  flex-shrink: 0;
}

@keyframes dotPulse {
  0%, 100% { box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.18); opacity: 1; }
  50%       { box-shadow: 0 0 0 6px rgba(251, 191, 36, 0.04); opacity: 0.7; }
}

/* ── Card base ─────────────────────────────────────────── */
.nowCard {
  background: #141414;
  border-radius: 14px;
  padding: 24px 20px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.45);
  transition:
    transform 200ms cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 200ms cubic-bezier(0.22, 1, 0.36, 1),
    background 200ms ease;
}

/* Inner radial glow — hidden at rest */
.nowCard::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 14px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 220ms ease;
}

.nowCard:hover {
  background: #181818;
  transform: translateY(-3px);
}

/* ── Amber variant (Building / >_) ─────────────────────── */
.amber::before {
  background: radial-gradient(ellipse 90% 70% at 10% 10%, rgba(251, 191, 36, 0.09) 0%, transparent 65%);
}
.amber:hover {
  box-shadow: 0 12px 32px rgba(251, 191, 36, 0.12), 0 4px 12px rgba(0, 0, 0, 0.5);
}

/* ── Orange variant (Learning / λ) ─────────────────────── */
.orange::before {
  background: radial-gradient(ellipse 90% 70% at 10% 10%, rgba(251, 146, 60, 0.09) 0%, transparent 65%);
}
.orange:hover {
  box-shadow: 0 12px 32px rgba(251, 146, 60, 0.12), 0 4px 12px rgba(0, 0, 0, 0.5);
}

/* ── Red variant (Writing / //) ────────────────────────── */
.red::before {
  background: radial-gradient(ellipse 90% 70% at 10% 10%, rgba(248, 113, 113, 0.09) 0%, transparent 65%);
}
.red:hover {
  box-shadow: 0 12px 32px rgba(248, 113, 113, 0.12), 0 4px 12px rgba(0, 0, 0, 0.5);
}

/* Reveal the radial glow on hover for all variants */
.nowCard:hover::before {
  opacity: 1;
}

/* ── Badge ─────────────────────────────────────────────── */
.badge {
  width: 38px;
  height: 38px;
  border-radius: 9px;
  background: #1e1e1e;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-geist-mono), 'Courier New', monospace;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: -0.5px;
  margin-bottom: 18px;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.04);
  position: relative;
  z-index: 1;
}

.badgeAmber { color: #fbbf24; text-shadow: 0 0 12px rgba(251, 191, 36, 0.55); }
.badgeOrange { color: #fb923c; text-shadow: 0 0 12px rgba(251, 146, 60, 0.55); }
.badgeRed    { color: #f87171; text-shadow: 0 0 12px rgba(248, 113, 113, 0.55); }

/* ── Card label ────────────────────────────────────────── */
.cardLabel {
  font-family: var(--font-geist-mono), 'Courier New', monospace;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  margin-bottom: 10px;
  position: relative;
  z-index: 1;
}

.labelAmber { color: #fbbf24; }
.labelOrange { color: #fb923c; }
.labelRed    { color: #f87171; }

/* ── Card description ──────────────────────────────────── */
.cardDesc {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.75;
  position: relative;
  z-index: 1;
}

/* ── Reduced motion ────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .nowCard { transition: none; }
  .nowCard:hover { transform: none; }
  .pulseDot { animation: none; }
}
```

- [ ] **Step 2: Verify file saved correctly**

```bash
head -5 src/components/about/AboutSections.module.css
```

Expected output starts with `/* src/components/about/AboutSections.module.css */`

---

### Task 2: Update `NOW_ITEMS` and the card render block in `AboutSections.tsx`

**Files:**
- Modify: `src/components/about/AboutSections.tsx`

- [ ] **Step 1: Add the CSS module import at the top of the file (after existing imports)**

Replace the existing import block:
```tsx
import { useRef } from 'react';
import { Github, Mail, Twitter } from 'lucide-react';
import btn from '@/styles/buttons.module.css';
import { useSectionStagger } from '@/hooks/useSectionStagger';
import { useLineReveal } from '@/hooks/useLineReveal';
```

With:
```tsx
import { useRef } from 'react';
import { Github, Mail, Twitter } from 'lucide-react';
import btn from '@/styles/buttons.module.css';
import now from './AboutSections.module.css';
import { useSectionStagger } from '@/hooks/useSectionStagger';
import { useLineReveal } from '@/hooks/useLineReveal';
```

- [ ] **Step 2: Replace `NOW_ITEMS` with the typed variant array**

Replace:
```tsx
const NOW_ITEMS = [
  {
    icon: '🔨',
    label: 'Building',
    desc: 'An Agentic ERP system with multi-agent LLM orchestration (LangGraph) and Generative UI via SSE streaming.',
  },
  {
    icon: '📖',
    label: 'Learning',
    desc: 'Advanced RAG architectures, prompt engineering, and LangGraph patterns for reliable agentic workflows.',
  },
  {
    icon: '✍️',
    label: 'Writing',
    desc: 'Articles on AI engineering, agent design, full-stack development, and lessons from real production systems.',
  },
];
```

With:
```tsx
const NOW_ITEMS = [
  {
    glyph: '>_',
    label: 'Building',
    desc: 'An Agentic ERP system with multi-agent LLM orchestration (LangGraph) and Generative UI via SSE streaming.',
    cardCls: now.amber,
    badgeCls: now.badgeAmber,
    labelCls: now.labelAmber,
  },
  {
    glyph: 'λ',
    label: 'Learning',
    desc: 'Advanced RAG architectures, prompt engineering, and LangGraph patterns for reliable agentic workflows.',
    cardCls: now.orange,
    badgeCls: now.badgeOrange,
    labelCls: now.labelOrange,
  },
  {
    glyph: '//',
    label: 'Writing',
    desc: 'Articles on AI engineering, agent design, full-stack development, and lessons from real production systems.',
    cardCls: now.red,
    badgeCls: now.badgeRed,
    labelCls: now.labelRed,
  },
];
```

- [ ] **Step 3: Replace the Now section label and card render block**

Replace the entire `{/* Section: What I'm Doing Now */}` section:
```tsx
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
```

With:
```tsx
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
          <p data-stagger className={`mb-8 ${now.nowLabel}`}>
            <span className={now.pulseDot} aria-hidden="true" />
            What I&apos;m Doing Now
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {NOW_ITEMS.map((item) => (
              <div
                key={item.label}
                data-stagger
                className={`${now.nowCard} ${item.cardCls}`}
              >
                <div className={`${now.badge} ${item.badgeCls}`}>{item.glyph}</div>
                <div className={`${now.cardLabel} ${item.labelCls}`}>{item.label}</div>
                <div className={now.cardDesc}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
```

- [ ] **Step 4: Verify the dev server compiles without errors**

```bash
bun run dev
```

Expected: no TypeScript or CSS module errors in terminal output. Open `http://localhost:3000/about` and confirm the Now section renders with warm-coloured badge glyphs, no borders, and hover lift.

- [ ] **Step 5: Commit**

```bash
git add src/components/about/AboutSections.module.css src/components/about/AboutSections.tsx
git commit -m "feat(about): redesign Now section with terminal badges and warm accent colours"
```
