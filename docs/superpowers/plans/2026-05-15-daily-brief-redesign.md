# Daily Brief Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the digest/daily section of the blog as "Daily Brief" — matching the existing design system, removing all Horizon/pipeline mentions, and adding a home page teaser section.

**Architecture:** Four isolated file changes: rewrite the listing page with an Editorial Grid, create a new `DailyBrief` home component with Feature + Recent Strip layout, wire it into `page.tsx`, and clean up the detail page metadata/attribution. No new data models or API changes.

**Tech Stack:** Next.js 14 App Router, Velite (MDX content pipeline), Tailwind CSS, Lucide React, TypeScript

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/app/digest/page.tsx` | Rewrite | Editorial Grid listing page |
| `src/components/home/DailyBrief.tsx` | Create | Home page Feature + Recent Strip |
| `src/app/page.tsx` | Modify | Wire in `DailyBrief` component |
| `src/app/digest/[slug]/page.tsx` | Modify | Clean metadata, remove Horizon attribution |

---

## Task 1: Rewrite Listing Page — Editorial Grid

**Files:**
- Modify: `src/app/digest/page.tsx`

- [ ] **Step 1: Replace the file with the Editorial Grid implementation**

Replace the entire contents of `src/app/digest/page.tsx` with:

```tsx
import { digests } from '#/.velite';
import Link from 'next/link';

export const metadata = {
  title: 'Daily Brief',
  description: 'Auto-curated daily digest of what matters in AI, updated every morning.',
};

export default function DigestPage() {
  const published = digests
    .filter((d) => d.published && d.item_count > 0)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const featured = published[0];
  const archive = published.slice(1);

  return (
    <div className="container mx-auto px-4 py-12 md:py-16 max-w-6xl">
      {/* Header */}
      <div className="mb-12">
        <h1 className="font-display text-5xl md:text-6xl font-black mb-3 text-text-primary">
          Daily Brief
        </h1>
        <p className="text-text-secondary text-xl">
          Auto-curated, updated every morning
        </p>
      </div>

      {published.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-text-secondary text-lg">No issues yet — check back tomorrow.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Featured — latest issue */}
          {featured && <FeaturedCard digest={featured} />}

          {/* Archive grid */}
          {archive.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {archive.map((digest) => (
                <ArchiveCard key={digest.slug} digest={digest} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

type DigestCardProps = {
  digest: {
    slug: string;
    title: string;
    date: string;
    item_count: number;
  };
};

function FeaturedCard({ digest }: DigestCardProps) {
  const d = new Date(digest.date);
  const dateLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <Link
      href={`/digest/${digest.slug}`}
      className="group block rounded-3xl overflow-hidden bg-[#1C1B19] border border-white/5 hover:border-primary/30 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
    >
      {/* Gradient pocket */}
      <div
        className="relative h-36 md:h-44 flex items-end p-5"
        style={{ background: 'linear-gradient(135deg, #1a3a5c 0%, #0d2035 60%, #0d251a 100%)' }}
      >
        <span className="absolute top-4 left-5 px-3 py-1 rounded-lg bg-primary text-background text-xs font-black tracking-wide">
          TODAY'S PICKS
        </span>
        <span className="absolute top-4 right-5 text-white/30 text-xs font-medium">
          {dateLabel}
        </span>
        <h2 className="font-display text-2xl md:text-3xl font-black text-white leading-snug line-clamp-2 group-hover:text-primary/90 transition-colors">
          {digest.title}
        </h2>
      </div>

      {/* Body */}
      <div className="px-5 py-4 flex items-center justify-between">
        <span className="text-primary text-sm font-bold">
          {digest.item_count} picks
        </span>
        <span className="text-white/40 text-sm font-semibold group-hover:text-primary group-hover:translate-x-1 transition-all">
          Read →
        </span>
      </div>
    </Link>
  );
}

function ArchiveCard({ digest }: DigestCardProps) {
  const d = new Date(digest.date);
  const day = String(d.getDate()).padStart(2, '0');
  const dateLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <Link
      href={`/digest/${digest.slug}`}
      className="group flex items-center gap-4 rounded-2xl overflow-hidden bg-[#1C1B19] border border-white/5 hover:border-primary/20 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 px-5 py-4"
    >
      <span className="font-display text-4xl font-black text-white/10 group-hover:text-primary/20 transition-colors flex-shrink-0 leading-none w-12 text-center">
        {day}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-white/40 mb-1">{dateLabel}</p>
        <h3 className="font-display text-sm font-black text-white line-clamp-1 group-hover:text-primary/90 transition-colors leading-snug">
          {digest.title}
        </h3>
      </div>
      <span className="text-white/30 text-xs font-semibold flex-shrink-0">
        {digest.item_count} picks
      </span>
    </Link>
  );
}
```

- [ ] **Step 2: Verify no TypeScript errors**

```bash
cd /Users/defff/defang-blog-vibe && npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors (or only pre-existing unrelated errors).

- [ ] **Step 3: Commit**

```bash
cd /Users/defff/defang-blog-vibe
git add src/app/digest/page.tsx
git commit -m "feat(digest): Editorial Grid listing page — Daily Brief"
```

---

## Task 2: Create Home Page DailyBrief Component

**Files:**
- Create: `src/components/home/DailyBrief.tsx`

- [ ] **Step 1: Create the component file**

Create `src/components/home/DailyBrief.tsx` with:

```tsx
import { digests } from '#/.velite';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function DailyBrief() {
  const published = digests
    .filter((d) => d.published && d.item_count > 0)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (published.length === 0) return null;

  const featured = published[0];
  const recents = published.slice(1, 4);

  const featuredDate = new Date(featured.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <section className="container mx-auto px-4 py-16 md:py-20 max-w-6xl">
      {/* Section header */}
      <div className="flex items-center justify-between mb-10">
        <h2 className="font-display text-4xl md:text-5xl font-black text-text-primary">
          Daily Brief
        </h2>
        <Link
          href="/digest"
          className="hidden md:inline-flex items-center gap-2 text-text-secondary hover:text-primary transition-colors group"
        >
          View archive
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* 2-col layout */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Left: featured today */}
        <Link
          href={`/digest/${featured.slug}`}
          className="md:col-span-3 group block rounded-3xl overflow-hidden bg-[#1C1B19] border border-white/5 hover:border-primary/30 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
        >
          <div
            className="relative h-40 flex items-end p-5"
            style={{ background: 'linear-gradient(135deg, #1a3a5c 0%, #0d2035 60%, #0d251a 100%)' }}
          >
            <span className="absolute top-4 left-5 px-3 py-1 rounded-lg bg-primary text-background text-xs font-black tracking-wide">
              TODAY'S PICKS
            </span>
            <h3 className="font-display text-xl md:text-2xl font-black text-white leading-snug line-clamp-2 group-hover:text-primary/90 transition-colors">
              {featured.title}
            </h3>
          </div>
          <div className="px-5 py-4 flex items-center justify-between">
            <span className="text-white/40 text-xs">{featuredDate}</span>
            <span className="text-primary text-sm font-bold">
              {featured.item_count} picks →
            </span>
          </div>
        </Link>

        {/* Right: recent strip */}
        <div className="md:col-span-2 flex flex-col gap-3">
          {recents.map((digest) => {
            const d = new Date(digest.date);
            const day = String(d.getDate()).padStart(2, '0');
            const month = d.toLocaleDateString('en-US', { month: 'short' });

            return (
              <Link
                key={digest.slug}
                href={`/digest/${digest.slug}`}
                className="group flex items-center gap-4 rounded-2xl bg-surface border border-border hover:border-primary/30 hover:bg-primary/5 px-4 py-3.5 transition-all duration-200 flex-1"
              >
                <div className="flex-shrink-0 text-center w-10">
                  <span className="font-display text-2xl font-black text-primary/60 group-hover:text-primary transition-colors leading-none block">
                    {day}
                  </span>
                  <span className="text-[9px] text-text-muted font-medium uppercase tracking-wide">
                    {month}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display text-sm font-black text-text-primary line-clamp-1 group-hover:text-primary transition-colors leading-snug">
                    {digest.title}
                  </p>
                  <p className="text-xs text-text-muted mt-0.5">{digest.item_count} picks</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Mobile: View archive */}
      <div className="mt-6 text-center md:hidden">
        <Link
          href="/digest"
          className="inline-flex items-center gap-2 px-6 py-3 bg-surface rounded-xl text-text-primary hover:bg-primary/10 transition-all"
        >
          View archive
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify no TypeScript errors**

```bash
cd /Users/defff/defang-blog-vibe && npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
cd /Users/defff/defang-blog-vibe
git add src/components/home/DailyBrief.tsx
git commit -m "feat(home): DailyBrief component — Feature + Recent Strip"
```

---

## Task 3: Wire DailyBrief into the Home Page

**Files:**
- Modify: `src/app/page.tsx`

Current content of `src/app/page.tsx`:
```tsx
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedPosts } from '@/components/home/FeaturedPosts';
import { AboutSection } from '@/components/home/AboutSection';
import { NewsletterSection } from '@/components/home/NewsletterSection';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { HorizontalFeatures } from '@/components/home/HorizontalFeatures';

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

- [ ] **Step 1: Add DailyBrief between HorizontalFeatures and FeaturedPosts**

Replace `src/app/page.tsx` with:

```tsx
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedPosts } from '@/components/home/FeaturedPosts';
import { DailyBrief } from '@/components/home/DailyBrief';
import { AboutSection } from '@/components/home/AboutSection';
import { NewsletterSection } from '@/components/home/NewsletterSection';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { HorizontalFeatures } from '@/components/home/HorizontalFeatures';

export default function Home() {
  return (
    <>
      <HeroSection />
      <HorizontalFeatures />
      <ScrollReveal>
        <DailyBrief />
      </ScrollReveal>
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

- [ ] **Step 2: Verify no TypeScript errors**

```bash
cd /Users/defff/defang-blog-vibe && npx tsc --noEmit 2>&1 | head -30
```

- [ ] **Step 3: Commit**

```bash
cd /Users/defff/defang-blog-vibe
git add src/app/page.tsx
git commit -m "feat(home): add DailyBrief section to home page"
```

---

## Task 4: Clean Up Detail Page — Remove Horizon Attribution

**Files:**
- Modify: `src/app/digest/[slug]/page.tsx`

- [ ] **Step 1: Replace the file with the cleaned version**

Replace the entire contents of `src/app/digest/[slug]/page.tsx` with:

```tsx
import { digests } from '#/.velite';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { MDXContent } from '@/components/mdx/MDXContent';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return digests.map((digest) => ({
    slug: digest.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const digest = digests.find((d) => d.slug === slug);
  if (!digest) return { title: 'Not Found' };
  return {
    title: `${digest.title} — Daily Brief`,
    description: digest.description,
    openGraph: digest.cover_image
      ? { images: [{ url: digest.cover_image }] }
      : undefined,
  };
}

export default async function DigestDetailPage({ params }: Props) {
  const { slug } = await params;
  const digest = digests.find((d) => d.slug === slug);

  if (!digest || !digest.published) {
    notFound();
  }

  const dateStr = new Date(digest.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  return (
    <article className="container mx-auto px-4 py-12 md:py-16 max-w-4xl">
      {/* Back */}
      <Link
        href="/digest"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-surface text-text-secondary hover:text-text-primary transition-all mb-8 group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Daily Brief
      </Link>

      {/* Hero Image */}
      {digest.cover_image && (
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-10 shadow-2xl">
          <img
            src={digest.cover_image}
            alt={digest.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />
        </div>
      )}

      {/* Header */}
      <header className="mb-10 pb-8 border-b border-border">
        {/* TODAY'S PICKS badge */}
        {digest.item_count > 0 && (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wide mb-4">
            Today's Picks · {digest.item_count} items
          </div>
        )}

        <h1 className="font-display text-4xl md:text-5xl font-black mb-6 leading-tight text-text-primary">
          {digest.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
          <time dateTime={digest.date} className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            {dateStr}
          </time>
        </div>
      </header>

      {/* Content */}
      <div className="prose prose-lg max-w-none">
        <MDXContent code={digest.body} />
      </div>
    </article>
  );
}
```

Key changes from the original:
- Removed `Database`, `Layers` imports (unused)
- Removed `⚡ Horizon Daily Digest` badge → `Today's Picks · N items` pill
- Removed description display below title
- Removed `total_fetched` "从X条内容中筛选" row
- Removed entire Horizon attribution footer block
- Back link text: `"Daily Brief"` (was `"返回情报列表"`)
- Date format: English (`en-US`) instead of Chinese (`zh-CN`)
- `generateMetadata` title: `"[digest.title] — Daily Brief"`

- [ ] **Step 2: Verify no TypeScript errors**

```bash
cd /Users/defff/defang-blog-vibe && npx tsc --noEmit 2>&1 | head -30
```

- [ ] **Step 3: Commit**

```bash
cd /Users/defff/defang-blog-vibe
git add src/app/digest/[slug]/page.tsx
git commit -m "feat(digest): clean detail page — Today's Picks badge, remove Horizon attribution"
```

---

## Task 5: Verify in Browser

- [ ] **Step 1: Start dev server**

```bash
cd /Users/defff/defang-blog-vibe && npm run dev
```

- [ ] **Step 2: Check listing page**

Open `http://localhost:3000/digest`.

Verify:
- Title reads "Daily Brief" (no "AI 每日情报", no Horizon)
- Latest digest appears as large dark featured card with "TODAY'S PICKS" badge
- Older digests appear as compact rows in a 2-col grid below
- No "从X条" or "由Horizon" text anywhere

- [ ] **Step 3: Check home page**

Open `http://localhost:3000`.

Verify:
- "Daily Brief" section appears between HorizontalFeatures and Latest Articles
- Left: dark featured card with "TODAY'S PICKS" badge
- Right: 3 compact beige rows with large day numbers in golden
- "View archive" link works

- [ ] **Step 4: Check detail page**

Open any digest from the listing.

Verify:
- Back link reads "Daily Brief" (not Chinese)
- Badge reads "Today's Picks · N items" in golden
- No description paragraph below title
- No "从X条内容" line in metadata
- No Horizon attribution footer
- Date in English format

- [ ] **Step 5: Push to remote**

```bash
cd /Users/defff/defang-blog-vibe && git push origin master
```

Vercel will pick up the push and deploy automatically.
