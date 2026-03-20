# 3D Personal Blog Design Specification

**Project**: defang-blog-vibe
**Date**: 2026-03-20
**Author**: Design Session with Claude
**Status**: Ready for Review

---

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Design System](#design-system)
4. [Architecture](#architecture)
5. [Features](#features)
6. [3D Hero Scene](#3d-hero-scene)
7. [Page Layouts](#page-layouts)
8. [Content Management](#content-management)
9. [Performance & Accessibility](#performance--accessibility)
10. [Implementation Phases](#implementation-phases)

---

## Overview

### Vision

A personal tech blog combining Apple-inspired design aesthetics with creative 3D interactions. The blog showcases technical content (React, AI, English learning) through a polished, professional interface featuring glassmorphism, smooth animations, and an interactive 3D character hero.

### Core Principles

- **Performance First**: 60fps animations, < 3.5s TTI
- **Content-Centric**: 3D effects enhance, never distract from reading
- **Apple-Inspired**: Clean, minimalist, generous whitespace
- **Personal Touch**: 3D character avatar creates unique brand identity
- **Accessibility**: WCAG AAA compliance, keyboard navigation, reduced motion support

### Target Audience

- Fellow developers and tech enthusiasts
- Students learning web development, AI, languages
- Readers seeking well-written technical tutorials
- Potential employers/collaborators viewing portfolio

---

## Tech Stack

### Core Framework

- **Next.js 15.x** (App Router, latest stable)
- **React 18+**
- **TypeScript** (strict mode)
- **Bun** (package manager and runtime)

### 3D & Animation

- **@react-three/fiber** + **@react-three/drei** (3D hero scene only)
- **GSAP 3.12+** (complex animations, scroll triggers, page transitions)
- **framer-motion 11.x** (component-level animations, hovers, micro-interactions)
- **GSAP ScrollTrigger** (scroll-based animations)
- **GSAP ScrollSmoother** (optional smooth scroll)

### Content Processing

- **Velite** (type-safe MDX processing, maintained alternative to Contentlayer)
- **gray-matter** (frontmatter parsing)
- **remark-gfm** (GitHub-flavored markdown)
- **rehype-autolink-headings** (auto TOC generation)
- **rehype-slug** (heading IDs)

### UI & Styling

- **Tailwind CSS v3.4+** (latest stable, v4 when stable)
- **shadcn/ui** (pre-built React components)
- **Radix UI** (accessible primitives)
- **CSS Modules** (complex component styling)

### Code Highlighting

- **Shiki** (syntax highlighting, better SSG support than Prism)
- **rehype-pretty-code** (Shiki integration for MDX)

### Search

- **Fuse.js** (lightweight fuzzy search, client-side, chosen for MVP)
  - Simple API, good documentation
  - Smaller learning curve
  - Later migration to FlexSearch if performance becomes an issue

### Third-Party Services

- **Giscus** (comments via GitHub Discussions, free)
- **Resend** (newsletter email delivery)
- **Vercel Analytics** (built-in with Vercel deployment)

### Additional Dependencies

- **feed** (RSS feed generation)
- **three** (core 3D library for React Three Fiber)

### Development Tools

- **ESLint** + **Prettier** (code quality)
- **Husky** (git hooks)
- **lint-staged** (pre-commit linting)
- **TypeScript strict mode**

---

## Design System

### Color Palette

#### Light Mode

```css
--background: #FAFAFA;                      /* Off-white background */
--surface: #FFFFFF;                         /* White cards/surfaces */
--primary: #FFD93D;                         /* Banana yellow accent */
--text-primary: #2C2C2C;                    /* Deep charcoal */
--text-secondary: #6B7280;                  /* Gray */
--border: #E5E7EB;                          /* Light gray borders */
--glass-bg: rgba(255, 255, 255, 0.7);       /* Glassmorphism background */
--glass-border: rgba(0, 0, 0, 0.1);         /* Glass border */
```

#### Dark Mode

```css
--background: linear-gradient(180deg, #000000 0%, #1C1C1C 100%);
--surface: rgba(255, 255, 255, 0.05);       /* Dark glass cards */
--primary: #F4C430;                         /* Softer yellow for dark bg */
--text-primary: #F5F5F5;                    /* Off-white text */
--text-secondary: #9CA3AF;                  /* Light gray */
--border: rgba(255, 255, 255, 0.1);         /* Subtle white borders */
--accent-blue: #4A5568;                     /* Blue-gray accents */
--glass-bg: rgba(0, 0, 0, 0.3);             /* Dark glassmorphism */
--glass-border: rgba(255, 255, 255, 0.1);   /* Glass border */
```

### Typography

#### Font Stack

```css
font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display',
             'Segoe UI', Roboto, sans-serif;
```

#### Type Scale

```css
--text-xs: 0.75rem;    /* 12px - Captions, labels */
--text-sm: 0.875rem;   /* 14px - Secondary text */
--text-base: 1rem;     /* 16px - Body text (small screens) */
--text-lg: 1.125rem;   /* 18px - Body text (large screens) */
--text-xl: 1.25rem;    /* 20px - Card titles */
--text-2xl: 1.5rem;    /* 24px - Section headings */
--text-3xl: 1.875rem;  /* 30px - Page titles */
--text-4xl: 2.25rem;   /* 36px - Hero titles */
--text-5xl: 3rem;      /* 48px - Main hero */
```

#### Font Weights

- **Regular**: 400 (body text)
- **Medium**: 500 (subheadings)
- **Semibold**: 600 (card titles)
- **Bold**: 700 (headings)

#### Line Heights

- **Tight**: 1.25 (headings)
- **Normal**: 1.5 (UI text)
- **Relaxed**: 1.7 (body content)

### Spacing System

Apple-inspired generous whitespace:

```css
--spacing-xs: 0.5rem;   /* 8px */
--spacing-sm: 1rem;     /* 16px */
--spacing-md: 1.5rem;   /* 24px */
--spacing-lg: 2rem;     /* 32px */
--spacing-xl: 3rem;     /* 48px */
--spacing-2xl: 4rem;    /* 64px */
--spacing-3xl: 6rem;    /* 96px */
```

### Border Radius

```css
--radius-sm: 8px;       /* Buttons, tags */
--radius-md: 12px;      /* Cards */
--radius-lg: 16px;      /* Hero sections, large cards */
--radius-xl: 24px;      /* Modals, drawers */
```

### Shadows

Subtle, Apple-like elevation:

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.12);
```

### Glassmorphism

#### Light Mode Glass

```css
.glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px) saturate(180%);
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
```

#### Dark Mode Glass

```css
.dark .glass-card {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}
```

#### Fallback Strategy

- **Modern browsers**: Full glassmorphism with `backdrop-filter`
- **Safari (older)**: Solid background with transparency
- **Firefox (no backdrop-filter)**: Gradient background

---

## Architecture

### Project Structure

```
defang-blog-vibe/
├── app/                              # Next.js App Router
│   ├── layout.tsx                   # Root layout (theme provider, fonts)
│   ├── page.tsx                     # Homepage (3D hero + posts grid)
│   ├── blog/
│   │   ├── page.tsx                # Blog index with category filters
│   │   ├── [slug]/
│   │   │   └── page.tsx            # Individual blog post (SSG)
│   │   └── category/
│   │       └── [category]/
│   │           └── page.tsx        # Category archive pages
│   ├── about/
│   │   └── page.tsx                # About page
│   └── api/
│       ├── newsletter/
│       │   └── route.ts            # Newsletter signup endpoint
│       └── search/
│           └── route.ts            # Search API (optional server-side)
│
├── components/
│   ├── 3d/
│   │   ├── HeroScene.tsx           # Three.js hero scene with character
│   │   ├── SceneLoader.tsx         # Lazy load wrapper with fallback
│   │   └── Character3D.tsx         # 3D character model component
│   ├── animations/
│   │   ├── PageTransition.tsx      # GSAP page route transitions
│   │   ├── ScrollReveal.tsx        # GSAP scroll-triggered reveals
│   │   ├── CursorTilt.tsx          # CSS 3D cursor tilt effect
│   │   └── ProgressBar.tsx         # Reading progress indicator
│   ├── blog/
│   │   ├── PostCard.tsx            # Glassmorphic blog card
│   │   ├── PostGrid.tsx            # Responsive posts grid
│   │   ├── CategoryFilter.tsx      # Category/tag filtering UI
│   │   ├── FeaturedPost.tsx        # Large hero post card
│   │   └── PostMeta.tsx            # Author, date, reading time
│   ├── mdx/
│   │   ├── MDXComponents.tsx       # Custom MDX component mappings
│   │   ├── CodeBlock.tsx           # Syntax highlighted code (Shiki)
│   │   ├── Callout.tsx             # Info/warning/success callouts
│   │   ├── Figure.tsx              # Image with caption
│   │   └── CodeComparison.tsx      # Before/after code blocks
│   ├── layout/
│   │   ├── Header.tsx              # Nav with GSAP scroll effects
│   │   ├── Footer.tsx              # Footer with links
│   │   ├── TableOfContents.tsx     # Sticky TOC for blog posts
│   │   └── ThemeToggle.tsx         # Dark/light mode switch
│   ├── ui/                          # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ...
│   └── search/
│       ├── SearchBar.tsx           # Search input with autocomplete
│       └── SearchResults.tsx       # Search results display
│
├── content/
│   └── posts/                       # MDX blog posts
│       ├── hello-world.mdx
│       ├── react-server-components.mdx
│       └── ai-learning-tips.mdx
│
├── lib/
│   ├── velite.ts                   # Velite content utilities
│   ├── gsap.ts                     # GSAP setup & helper functions
│   ├── three-utils.ts              # Three.js scene helpers
│   ├── search.ts                   # Search index builder (Fuse.js)
│   ├── utils.ts                    # General utilities (cn, etc.)
│   └── constants.ts                # Site config, metadata
│
├── public/
│   ├── images/
│   │   ├── posts/                  # Blog post cover images
│   │   └── avatar.png              # Author avatar
│   └── fonts/                       # Custom fonts (if needed)
│
├── styles/
│   └── globals.css                 # Global styles + Tailwind imports
│
├── velite.config.ts                # Velite configuration
├── tailwind.config.ts              # Tailwind v4 configuration
├── next.config.js                  # Next.js configuration
├── tsconfig.json                   # TypeScript configuration
├── package.json                    # Dependencies (Bun)
└── .gitignore
```

### Data Flow

#### Build Time (Static Generation)

```
MDX files in /content/posts/
    ↓
Velite processes MDX
    ↓
Generates TypeScript types
    ↓
Creates content objects with metadata
    ↓
Next.js generates static pages
    ↓
Search index built (JSON)
    ↓
RSS feed generated (/feed.xml)
    ↓
Static site ready for deployment
```

#### Runtime (Client-Side)

```
User visits homepage
    ↓
Hero scene lazy loads (React Three Fiber)
    ↓
GSAP initializes scroll triggers
    ↓
Posts rendered from static data
    ↓
Search component uses pre-built index
    ↓
Theme toggle updates CSS variables via GSAP
    ↓
Page transitions handled by GSAP
```

### Content Schema (Velite)

```typescript
// Auto-generated by Velite
type Post = {
  slug: string;                // URL-friendly identifier (required, auto-generated)
  title: string;               // Post title (required)
  description: string;         // Meta description (required)
  date: Date;                  // Publication date (required)
  updated?: Date;              // Last updated date (optional)
  category: string;            // Primary category (required)
  tags: string[];              // Tags for filtering (required, can be empty array)
  coverImage?: string;         // Cover image path (optional)
  author: string;              // Author name (required)
  featured: boolean;           // Show in featured section (required, default: false)
  draft: boolean;              // Draft posts not published (required, default: false)
  readingTime: number;         // Auto-calculated by Velite (words / 200)
  content: MDXContent;         // Compiled MDX content (auto-generated by Velite)
  headings: Heading[];         // Extracted for TOC (auto-generated by Velite)
  excerpt: string;             // Auto-generated by Velite from first 160 chars
};

// MDXContent is a React component returned by Velite's MDX compilation
type MDXContent = React.ComponentType<{
  components?: Record<string, React.ComponentType<any>>;
}>;

type Heading = {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  text: string;
  slug: string;                // For anchor links
};
```

---

## Features

### Core Features (MVP)

✅ **MDX Blog Posts**
- Write in Markdown with embedded React components
- Type-safe frontmatter validation
- Auto-generated reading time
- Code syntax highlighting (Shiki)
- Custom callouts, figures, comparisons

✅ **Categories & Tags**
- Organize posts by category (React, AI, English, etc.)
- Multiple tags per post
- Filter/browse by category
- Tag cloud or list

✅ **Full-Text Search**
- Client-side fuzzy search (Fuse.js)
- Search across titles, descriptions, content
- Keyboard shortcut (Cmd/Ctrl + K)
- Instant results

✅ **Comments (Giscus)**
- GitHub Discussions integration
- No database needed
- Markdown support
- Moderation via GitHub

✅ **Code Highlighting (Shiki)**
- Beautiful syntax highlighting
- Support for 100+ languages
- Line numbers (optional)
- Copy button
- Highlight specific lines
- Theme matches light/dark mode

✅ **Dark/Light Mode**
- System preference detection
- Manual toggle (Sun/Moon icon)
- Smooth GSAP transitions
- Persisted to localStorage
- No flash of wrong theme

✅ **RSS Feed**
- Auto-generated at build time
- Standard RSS 2.0 format
- Includes full content
- Endpoint: `/feed.xml`

✅ **Reading Time Estimates**
- Auto-calculated from word count
- Displayed on cards and post headers
- Formula: words / 200 WPM

✅ **Table of Contents**
- Auto-generated from headings
- Sticky sidebar on desktop
- Collapsible drawer on mobile
- Active heading highlight
- Smooth scroll to sections

✅ **Analytics (Vercel)**
- Page views tracking
- Performance monitoring
- No cookies, privacy-friendly
- Built-in with Vercel deployment

✅ **Newsletter Signup**
- Email collection form in footer
- Submits to Resend API (creates contact in Resend Audiences)
- No local database needed (Resend manages subscriber list)
- Validation, error handling
- Success confirmation
- Resend Audiences feature stores and manages emails


### 3D & Animation Features

✅ **3D Hero Scene**
- Interactive Three.js character
- Gentle floating animation
- Cursor parallax rotation
- Scroll-triggered exit animation
- Code-split, lazy loaded

✅ **Glassmorphism Cards**
- Frosted glass effect
- Backdrop blur
- Subtle borders and shadows
- Theme-aware colors

✅ **Cursor Tilt Effects**
- Cards tilt toward cursor
- 3D perspective transform
- Smooth, performant
- CSS-based (no JS overhead)

✅ **Page Transitions**
- 3D slide/rotate between routes
- GSAP timeline-based
- Smooth, seamless
- Maintains scroll position

✅ **Scroll Reveals**
- Cards fade in as you scroll
- Staggered animations
- GSAP ScrollTrigger
- Respects reduced motion

---

## 3D Hero Scene

### Concept

The hero section features a **3D low-poly character** based on the user's avatar:
- Person with glasses and cap
- Sitting at laptop with banana logo
- Clean geometric shapes, minimalist aesthetic
- Floating/breathing animation
- Interactive parallax rotation

### Technical Implementation

#### Option 1: Blender Model (Recommended)

**Workflow:**
1. Model character in Blender based on avatar design
2. Keep poly count low (~3-5K triangles)
3. Use simple materials (no complex textures)
4. Export as GLTF/GLB format
5. Load in React Three Fiber via `useGLTF`

**Pros:**
- High-quality, detailed model
- Professional appearance
- Fine control over design

**Cons:**
- Requires Blender skills
- Larger file size (~500KB-1MB)
- More complex to modify

#### Option 2: Code-Based Geometry

**Workflow:**
1. Build character using Three.js primitives
   - BoxGeometry (body, laptop)
   - SphereGeometry (head)
   - CylinderGeometry (arms, legs)
2. Position and scale to create character
3. Apply simple MeshStandardMaterial

**Pros:**
- Smaller bundle size
- Easier to modify colors/theme
- More performant
- No external asset loading

**Cons:**
- Less detailed
- Harder to achieve avatar likeness
- More code to maintain

**Decision**: Use **Option 2 (Code-Based Geometry)** for MVP.

**Rationale**: Smaller bundle, easier theme integration, faster iteration. Upgrade to Blender model post-launch if user feedback indicates demand for higher fidelity.

**Acceptance Criteria for Option 1 Migration**: If > 50% of user feedback mentions wanting more detailed 3D character, or if portfolio showcase requires it.

### Scene Composition

```tsx
<Canvas>
  <ambientLight intensity={0.4} />
  <pointLight position={[10, 10, 10]} intensity={0.6} />
  <Character3D />
  <Environment preset="city" />
</Canvas>
```

**Lighting:**
- Soft ambient light (0.4 intensity)
- Single point light for rim lighting
- Environment map for reflections (optional)

**Camera:**
- Perspective camera
- FOV: 50 degrees
- Position: [0, 0, 5]
- Look at character center

### Animations

#### Idle Animation (GSAP Timeline)

```javascript
gsap.timeline({ repeat: -1, yoyo: true })
  .to(characterRef.current.position, {
    y: 0.2,
    duration: 2,
    ease: 'sine.inOut'
  })
  .to(characterRef.current.rotation, {
    y: Math.PI * 0.05,
    duration: 3,
    ease: 'sine.inOut'
  }, 0);
```

**Effect**: Gentle floating up/down, subtle rotation

#### Cursor Parallax

```javascript
const onMouseMove = (event) => {
  const x = (event.clientX / window.innerWidth) * 2 - 1;
  const y = -(event.clientY / window.innerHeight) * 2 + 1;

  gsap.to(characterRef.current.rotation, {
    x: y * 0.1,
    y: x * 0.1,
    duration: 0.5,
    ease: 'power2.out'
  });
};
```

**Effect**: Character subtly follows cursor movement

#### Scroll Exit Animation

```javascript
ScrollTrigger.create({
  trigger: '.hero-section',
  start: 'top top',
  end: 'bottom top',
  onLeave: () => {
    gsap.to(characterRef.current.position, {
      y: -10,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.in'
    });
  }
});
```

**Effect**: Character drops down as user scrolls past hero

### Performance Optimizations

1. **Code Splitting**: Lazy load Three.js components
   ```tsx
   const HeroScene = dynamic(() => import('@/components/3d/HeroScene'), {
     ssr: false,
     loading: () => <HeroSkeleton />
   });
   ```

2. **Low Poly Count**: Keep geometry simple (~3K vertices max)

3. **Simple Materials**: Use `MeshStandardMaterial`, avoid shaders

4. **Throttle Animations**: Use `requestAnimationFrame` efficiently

5. **Mobile Simplification**:
   - Reduce poly count by 50%
   - Disable cursor parallax
   - Use auto-rotate instead
   - Smaller scene viewport

6. **Pause When Inactive**: Stop rendering when tab is hidden
   ```javascript
   useEffect(() => {
     const handleVisibilityChange = () => {
       if (document.hidden) {
         pauseAnimations();
       } else {
         resumeAnimations();
       }
     };
     document.addEventListener('visibilitychange', handleVisibilityChange);
   }, []);
   ```

---

## Page Layouts

### Homepage

```
┌─────────────────────────────────────────────┐
│  [Navigation Bar - Glassmorphic, Sticky]    │
│  Logo/Name    Blog  Categories  About  🔍 🌙 │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│                                             │
│          [3D Hero Scene]                    │
│      Full viewport height                   │
│      Floating 3D character                  │
│      "Hi, I'm [Name]"                       │
│      Tagline                                │
│                                             │
│      ↓ Scroll down indicator                │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  About Section                              │
│  Short intro paragraph (3-4 lines)          │
│  Skills/interests badges                    │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  Featured Posts                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│  │ Featured │ │ Featured │ │ Featured │    │
│  │   Post   │ │   Post   │ │   Post   │    │
│  └──────────┘ └──────────┘ └──────────┘    │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  All Posts                                  │
│  [Category Filter: All | React | AI | ...]  │
│  ┌─────┐ ┌─────┐ ┌─────┐                   │
│  │ Post│ │ Post│ │ Post│                   │
│  └─────┘ └─────┘ └─────┘                   │
│  ┌─────┐ ┌─────┐ ┌─────┐                   │
│  │ Post│ │ Post│ │ Post│                   │
│  └─────┘ └─────┘ └─────┘                   │
│  [Load More / Pagination]                   │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  Newsletter Signup                          │
│  "Get updates on new posts"                 │
│  [Email Input] [Subscribe Button]           │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  Footer                                     │
│  Links | Social | RSS | © 2026             │
└─────────────────────────────────────────────┘
```

#### Responsive Behavior

**Desktop (> 1024px)**:
- Hero: Full viewport
- Featured: 3 columns
- Posts grid: 3 columns
- TOC sidebar visible

**Tablet (768px - 1024px)**:
- Hero: 80vh
- Featured: 2 columns
- Posts grid: 2 columns
- TOC collapsible

**Mobile (< 768px)**:
- Hero: 60vh, simplified 3D scene
- Featured: 1 column
- Posts grid: 1 column
- TOC drawer (bottom sheet)

### Blog Post Page

```
┌─────────────────────────────────────────────┐
│  [Navigation Bar]                           │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  [Reading Progress Bar - Yellow, 0-100%]    │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  [Cover Image - Full Width, 16:9]           │
└─────────────────────────────────────────────┘

┌───────┬───────────────────────────┬─────────┐
│       │                           │         │
│ Space │  CONTENT AREA             │  TOC    │
│ (1fr) │  (max-width: 680px)       │ (240px) │
│       │                           │ Sticky  │
│       │  Category Badge           │         │
│       │  # Post Title (48px)      │ ○ H2    │
│       │  Author · Date · 5 min    │ ○ H2    │
│       │  [Tag] [Tag] [Tag]        │   ○ H3  │
│       │  ─────────────────        │   ○ H3  │
│       │                           │ ○ H2    │
│       │  Post content with MDX    │         │
│       │                           │         │
│       │  ## Heading 2             │         │
│       │  Paragraph text...        │         │
│       │                           │         │
│       │  ### Heading 3            │         │
│       │  More text...             │         │
│       │                           │         │
│       │  ```javascript            │         │
│       │  // Code block            │         │
│       │  ```                      │         │
│       │                           │         │
│       │  ![Image](...)            │         │
│       │                           │         │
│       │  > Callout box            │         │
│       │                           │         │
│       │  ─────────────────        │         │
│       │                           │         │
│       │  [Giscus Comments]        │         │
│       │                           │         │
└───────┴───────────────────────────┴─────────┘

┌─────────────────────────────────────────────┐
│  Related Posts                              │
│  ┌──────┐ ┌──────┐ ┌──────┐                │
│  │ Post │ │ Post │ │ Post │                │
│  └──────┘ └──────┘ └──────┘                │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  Footer                                     │
└─────────────────────────────────────────────┘
```

#### Reading Experience

**Typography:**
- Body text: 18px / 1.7 line-height
- Max width: 680px (optimal readability)
- Headings: Bold, 1.5x spacing above, 0.5x below
- Paragraph spacing: 1.5rem

**Code Blocks:**
- Theme: `github-light` / `github-dark`
- Padding: 24px
- Border radius: 8px
- Line numbers: Optional
- Copy button: Top-right
- Language badge: Top-left

**Images:**
- Full content width
- Lazy loaded
- Rounded corners (12px)
- Caption support
- Zoom on click (optional)

### Category/Archive Pages

```
┌─────────────────────────────────────────────┐
│  [Navigation Bar]                           │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  # React Posts                              │
│  12 articles about React development        │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  [Sort: Latest | Oldest | Popular]          │
│  [Filter by tags]                           │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  Posts Grid (3 columns on desktop)          │
│  ┌─────┐ ┌─────┐ ┌─────┐                   │
│  │ Post│ │ Post│ │ Post│                   │
│  └─────┘ └─────┘ └─────┘                   │
└─────────────────────────────────────────────┘
```

### About Page

```
┌─────────────────────────────────────────────┐
│  [Navigation Bar]                           │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  ┌────────┐                                 │
│  │ Avatar │  # About Me                     │
│  │ Image  │  Introduction paragraph...      │
│  └────────┘                                 │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  Skills & Technologies                      │
│  [React] [TypeScript] [Three.js] [AI] ...   │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  Timeline / Experience (Optional)           │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  Contact / Social Links                     │
│  GitHub | Twitter | Email                   │
└─────────────────────────────────────────────┘
```

---

## Content Management

### Writing Workflow

1. **Create MDX file**: `/content/posts/my-post.mdx`
2. **Add frontmatter**:
   ```yaml
   ---
   title: "Understanding React Server Components"
   description: "Deep dive into RSC architecture"
   date: "2026-03-20"
   category: "React"
   tags: ["react", "next.js", "rsc"]
   coverImage: "/images/posts/react-rsc.jpg"
   author: "Your Name"
   featured: true
   draft: false
   ---
   ```
3. **Write content** with Markdown + JSX
4. **Commit and push** to Git
5. **Deploy** (Vercel auto-deploys on push)
6. **Post is live** (statically generated)

### MDX Example

```mdx
---
title: "My First Post"
date: "2026-03-20"
category: "React"
tags: ["react", "tutorial"]
---

# Introduction

This is a **blog post** with MDX support.

## Code Example

```javascript
const greeting = "Hello, World!";
console.log(greeting);
```

## Custom Components

<Callout type="info">
  This is an info callout!
</Callout>

<Figure
  src="/images/example.jpg"
  caption="Example image with caption"
/>

## Conclusion

Thanks for reading!
```

### Velite Configuration

```typescript
// velite.config.ts
import { defineConfig, s } from 'velite';

export default defineConfig({
  collections: {
    posts: {
      name: 'Post',
      pattern: 'posts/**/*.mdx',
      schema: s.object({
        slug: s.slug('posts'),
        title: s.string().max(99),
        description: s.string().max(999),
        date: s.isodate(),
        updated: s.isodate().optional(),
        category: s.string(),
        tags: s.array(s.string()),
        coverImage: s.string().optional(),
        author: s.string(),
        featured: s.boolean().default(false),
        draft: s.boolean().default(false),
        content: s.mdx(),
        metadata: s.metadata(),
        excerpt: s.excerpt(),
      }),
    },
  },
});
```

### RSS Feed Generation

Auto-generated at build time:

```typescript
// lib/rss.ts
import { Feed } from 'feed';
import { posts } from '@/.velite';

export function generateRSSFeed() {
  const feed = new Feed({
    title: "Your Blog Name",
    description: "Blog about React, AI, and more",
    id: "https://yourblog.com/",
    link: "https://yourblog.com/",
    language: "en",
    feedLinks: {
      rss2: "https://yourblog.com/feed.xml",
    },
  });

  posts
    .filter(post => !post.draft)
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .forEach(post => {
      feed.addItem({
        title: post.title,
        id: `https://yourblog.com/blog/${post.slug}`,
        link: `https://yourblog.com/blog/${post.slug}`,
        description: post.description,
        content: post.content,
        date: post.date,
      });
    });

  return feed.rss2();
}
```

---

## Performance & Accessibility

### Performance Targets

**Core Web Vitals:**
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1
- **FCP** (First Contentful Paint): < 1.5s
- **TTI** (Time to Interactive): < 3.5s

**Bundle Size Targets:**
- Initial JS (no 3D): < 150KB (gzipped)
- Three.js bundle: ~100KB (lazy loaded, code-split)
- GSAP: ~50KB
- framer-motion: ~33KB
- Total homepage JS: < 350KB (revised to account for all dependencies)

### Optimization Strategies

#### 1. Code Splitting

```typescript
// Lazy load 3D scene (only on homepage)
const HeroScene = dynamic(() => import('@/components/3d/HeroScene'), {
  ssr: false,
  loading: () => <HeroSkeleton />,
});

// Lazy load comments (below fold)
const GiscusComments = dynamic(() => import('@/components/GiscusComments'), {
  ssr: false,
});
```

#### 2. Image Optimization

- Use Next.js `<Image>` component
- WebP format with PNG fallback
- Responsive images (srcset)
- Lazy loading (native)
- Blur placeholder

```tsx
<Image
  src="/images/post.jpg"
  alt="Post cover"
  width={1200}
  height={675}
  placeholder="blur"
  blurDataURL="data:image/..."
/>
```

#### 3. Font Optimization

- Use `next/font` for self-hosting
- Subset fonts (only needed glyphs)
- Preload critical fonts
- Font display: swap

```typescript
import { Inter } from 'next/font/inter';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});
```

#### 4. Static Generation

- All blog posts: SSG (build time)
- Homepage: SSG
- Category pages: SSG
- About page: SSG
- ISR (Incremental Static Regeneration): Optional for dynamic content

#### 5. Caching Strategy

```typescript
// next.config.js
module.exports = {
  headers: async () => [
    {
      source: '/images/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ],
};
```

#### 6. Three.js Optimizations

- Low poly count (~3K vertices)
- Simple materials (no shaders)
- Dispose geometries/materials on unmount
- Pause rendering when tab inactive
- Throttle animations (requestAnimationFrame)

### Accessibility (WCAG AAA)

#### Keyboard Navigation

✅ All interactive elements focusable
✅ Logical tab order
✅ Skip to content link
✅ Keyboard shortcuts:
  - `Cmd/Ctrl + K`: Open search
  - `T`: Toggle theme
  - `Esc`: Close modals/search

#### Screen Reader Support

✅ Semantic HTML (article, nav, main, aside)
✅ Alt text for all images
✅ ARIA labels for icon buttons
✅ Announce route changes
✅ Skip links for repetitive content

#### Color Contrast

✅ Text contrast ratio: **7:1** (AAA)
✅ Interactive elements: **4.5:1** minimum
✅ Yellow accent tested on both backgrounds:
  - Light mode: `#FFD93D` on `#FAFAFA` = 1.87:1 (decorative only)
  - Text always uses high-contrast colors

#### Motion & Animations

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Reduced Motion Strategy:**
- Disable GSAP animations
- Disable Motion animations
- Static 3D scene (no floating/rotation)
- Instant theme transitions
- Crossfade page transitions only

#### Focus Indicators

```css
*:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
  border-radius: 4px;
}
```

---

## Implementation Phases

### Phase 1: Foundation (Week 1)

**Goal**: Basic Next.js setup with design system

- [ ] Initialize Next.js 15 project with Bun
- [ ] Configure Tailwind CSS v3.4+
- [ ] Set up TypeScript (strict mode)
- [ ] Install shadcn/ui components
- [ ] Implement design system (CSS variables, colors, typography)
- [ ] Create basic layout components (Header, Footer)
- [ ] Set up dark/light theme toggle
- [ ] Configure ESLint + Prettier

**Deliverable**: Basic site shell with theme switching

### Phase 2: Content Pipeline (Week 2)

**Goal**: MDX content processing and blog structure

- [ ] Install and configure Velite
- [ ] Set up content schema (Post type)
- [ ] Create sample MDX posts (3-5)
- [ ] Build blog index page
- [ ] Build individual post page template
- [ ] Implement code highlighting (Shiki)
- [ ] Add reading time calculation
- [ ] Generate Table of Contents

**Deliverable**: Functional blog with static posts

### Phase 3: 3D Hero & Animations (Week 2-3)

**Goal**: 3D scene and GSAP/framer-motion animations

- [ ] Install @react-three/fiber + @react-three/drei + three
- [ ] Create 3D character (code-based geometry)
- [ ] Implement hero scene with lighting
- [ ] Add idle animations (GSAP)
- [ ] Implement cursor parallax
- [ ] Set up GSAP ScrollTrigger
- [ ] Add scroll reveal animations for cards
- [ ] Implement page transitions (GSAP)
- [ ] Add framer-motion hover effects (cards, buttons)

**Deliverable**: Fully animated homepage with 3D hero

### Phase 4: Features & Interactivity (Week 3)

**Goal**: Search, categories, comments

- [ ] Implement client-side search (Fuse.js)
- [ ] Build category filter UI
- [ ] Create category archive pages
- [ ] Integrate Giscus comments
- [ ] Add newsletter signup form (Resend API)
- [ ] Build reading progress bar
- [ ] Implement sticky TOC
- [ ] Add social share buttons

**Deliverable**: Feature-complete blog

### Phase 5: Polish & Optimization (Week 4)

**Goal**: Performance, accessibility, SEO

- [ ] Image optimization (all images)
- [ ] Code splitting (Three.js, comments)
- [ ] Font optimization (subsetting)
- [ ] Generate RSS feed
- [ ] Add sitemap.xml
- [ ] Implement structured data (JSON-LD)
- [ ] Meta tags (Open Graph, Twitter Cards)
- [ ] Test keyboard navigation
- [ ] Test screen reader support
- [ ] Test reduced motion
- [ ] Run Lighthouse audits
- [ ] Fix accessibility issues

**Deliverable**: Production-ready blog

### Phase 6: Deployment & Launch (Week 4)

**Goal**: Deploy to Vercel and go live

- [ ] Set up Vercel project
- [ ] Configure custom domain
- [ ] Set up Vercel Analytics
- [ ] Configure environment variables
- [ ] Set up CI/CD (auto-deploy on push)
- [ ] Test production build
- [ ] Write launch blog post
- [ ] Share on social media

**Deliverable**: Live blog at custom domain

### Future Enhancements (Post-Launch)

**Content:**
- [ ] Upgrade to Blender 3D character model
- [ ] Add more interactive MDX components
- [ ] Create series/collection feature
- [ ] Add post views counter (optional DB)

**Features:**
- [ ] Advanced search (filter by date, category)
- [ ] Related posts recommendations
- [ ] Bookmark/save posts feature
- [ ] Dark mode auto-switch based on time

**Internationalization (i18n):**
- [ ] Add Chinese translations
- [ ] Multi-language routing (/en/, /zh/)
- [ ] Language switcher in nav
- [ ] Separate content directories

---

## Technical Considerations

### Browser Support

**Target Browsers:**
- Chrome/Edge: Last 2 versions
- Safari: Last 2 versions
- Firefox: Last 2 versions
- Mobile Safari (iOS): Last 2 versions
- Chrome Mobile (Android): Last 2 versions

**Graceful Degradation:**
- No `backdrop-filter`: Solid background fallback
- No WebGL: Static hero image fallback
- No JavaScript: Content still readable (SSG)

### Environment Variables

**Setup Prerequisites:**
1. Enable GitHub Discussions on your blog repo
2. Install Giscus app: https://github.com/apps/giscus
3. Get Giscus IDs from: https://giscus.app/
4. Sign up for Resend: https://resend.com/

```env
# .env.local
NEXT_PUBLIC_SITE_URL=https://yourblog.com
NEXT_PUBLIC_GISCUS_REPO=username/repo
NEXT_PUBLIC_GISCUS_REPO_ID=xxx         # From giscus.app
NEXT_PUBLIC_GISCUS_CATEGORY=Announcements
NEXT_PUBLIC_GISCUS_CATEGORY_ID=xxx     # From giscus.app
RESEND_API_KEY=re_xxx                   # From resend.com dashboard
```

### Deployment Configuration

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // or 'standalone' for dynamic features
  images: {
    domains: ['yourblog.com'],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizeCss: true,
  },
};

module.exports = nextConfig;
```

### Security

- [ ] Content Security Policy (CSP) headers
- [ ] No inline scripts (except theme toggle)
- [ ] Sanitize MDX content (XSS protection)
- [ ] Rate limiting on API routes
- [ ] HTTPS only (enforced by Vercel)

---

## Success Metrics

**Performance:**
- Lighthouse score: 95+ (all categories)
- Core Web Vitals: All green
- Bundle size: < 350KB total JS (homepage with 3D)

**Accessibility:**
- Lighthouse accessibility: 100
- axe DevTools: 0 violations
- Keyboard navigation: 100% coverage

**User Engagement:**
- Average session duration: > 2 minutes
- Bounce rate: < 60%
- Pages per session: > 2

**SEO:**
- Google PageSpeed Insights: 90+
- Search Console: No errors
- All meta tags present

---

## Conclusion

This design specification outlines a modern, performant, and accessible personal blog with unique 3D visual elements. The tech stack is carefully chosen for developer experience and production performance. The phased implementation approach ensures steady progress while maintaining quality.

**Key Differentiators:**
1. **3D Character Hero** - Unique, personal branding
2. **Apple-Inspired Design** - Clean, professional aesthetic
3. **Smooth Animations** - GSAP + Motion for polished feel
4. **Database-Free** - Simple, Git-based workflow
5. **Performance-First** - Code splitting, lazy loading, optimization

**Next Steps:**
1. Review this specification
2. Approve design decisions
3. Begin Phase 1 implementation
4. Iterate based on feedback

---

**Document Version**: 1.0
**Last Updated**: 2026-03-20
**Status**: ✅ Ready for Implementation
