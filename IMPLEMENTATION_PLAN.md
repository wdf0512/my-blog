# 3D Blog Implementation Plan

**Project**: defang-blog-vibe
**Date**: 2026-03-20
**Status**: Ready to Start

---

## Overview

This plan implements the [design specification](docs/superpowers/specs/2026-03-20-3d-blog-design.md) for a modern personal tech blog with 3D visual effects, Apple-inspired design, and premium typography.

**Tech Stack**: Next.js 15 + React Three Fiber + GSAP + framer-motion + Velite + Tailwind CSS v3.4+

**Timeline**: 4 weeks (6 phases)

---

## Current Phase: Phase 1 - Foundation

**Goal**: Basic Next.js setup with design system and premium typography

**Duration**: Week 1

---

## Phase 1 Tasks

### 1.1 Project Initialization

**Task**: Set up Next.js 15 project with Bun

**Steps**:
```bash
cd /Users/defff/defang-blog-vibe
bun create next-app@latest . --typescript --tailwind --app --src-dir --import-alias "@/*"
```

**Configuration Options**:
- ✅ TypeScript
- ✅ ESLint
- ✅ Tailwind CSS
- ✅ `src/` directory
- ✅ App Router
- ✅ Import alias `@/*`
- ❌ Turbopack (use default for now)

**Verification**:
```bash
bun dev
# Should start dev server at http://localhost:3000
```

---

### 1.2 TypeScript Configuration

**Task**: Set up strict TypeScript mode

**File**: `tsconfig.json`

**Changes**:
```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

---

### 1.3 Tailwind CSS Configuration

**Task**: Configure Tailwind CSS v3.4+ with design tokens

**File**: `tailwind.config.ts`

**Implementation**:
```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: 'var(--primary)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        border: 'var(--border)',
        surface: 'var(--surface)',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
        display: ['var(--font-clash-display)', 'var(--font-geist-sans)', 'sans-serif'],
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
      },
      spacing: {
        xs: '0.5rem',
        sm: '1rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '3rem',
        '2xl': '4rem',
        '3xl': '6rem',
      },
    },
  },
  plugins: [],
};
export default config;
```

---

### 1.4 Font Setup - Geist

**Task**: Install and configure Geist fonts

**Installation**:
```bash
bun add geist
```

**File**: `src/app/layout.tsx`

**Implementation**:
```typescript
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';

export const metadata = {
  title: 'Your Blog Name',
  description: 'Personal blog about React, AI, and more',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
```

---

### 1.5 Font Setup - Clash Display

**Task**: Download and configure Clash Display

**Steps**:

1. **Download Clash Display**:
   - Visit: https://www.fontshare.com/fonts/clash-display
   - Download: Regular, Semibold, Bold (WOFF2 format)

2. **Create fonts directory**:
```bash
mkdir -p public/fonts
```

3. **Place files**:
   - `public/fonts/ClashDisplay-Regular.woff2`
   - `public/fonts/ClashDisplay-Semibold.woff2`
   - `public/fonts/ClashDisplay-Bold.woff2`

4. **Configure in layout**:

**File**: `src/app/layout.tsx`

```typescript
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import localFont from 'next/font/local';
import './globals.css';

const clashDisplay = localFont({
  src: [
    {
      path: '../../public/fonts/ClashDisplay-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/ClashDisplay-Semibold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/ClashDisplay-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-clash-display',
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} ${clashDisplay.variable}`}
    >
      <body className="font-sans">{children}</body>
    </html>
  );
}
```

---

### 1.6 Global Styles & Design System

**Task**: Implement CSS variables and global styles

**File**: `src/app/globals.css`

**Implementation**:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* Colors - Light Mode */
  --background: #fafafa;
  --surface: #ffffff;
  --primary: #ffd93d;
  --text-primary: #2c2c2c;
  --text-secondary: #6b7280;
  --border: #e5e7eb;
  --glass-bg: rgba(255, 255, 255, 0.7);
  --glass-border: rgba(0, 0, 0, 0.1);

  /* Spacing */
  --spacing-xs: 0.5rem;
  --spacing-sm: 1rem;
  --spacing-md: 1.5rem;
  --spacing-lg: 2rem;
  --spacing-xl: 3rem;
  --spacing-2xl: 4rem;
  --spacing-3xl: 6rem;

  /* Border Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.12);
}

.dark {
  /* Colors - Dark Mode */
  --background: #000000;
  --surface: rgba(255, 255, 255, 0.05);
  --primary: #f4c430;
  --text-primary: #f5f5f5;
  --text-secondary: #9ca3af;
  --border: rgba(255, 255, 255, 0.1);
  --glass-bg: rgba(0, 0, 0, 0.3);
  --glass-border: rgba(255, 255, 255, 0.1);
}

* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html,
body {
  max-width: 100vw;
  overflow-x: hidden;
}

body {
  color: var(--text-primary);
  background: var(--background);
  font-family: var(--font-geist-sans), -apple-system, BlinkMacSystemFont,
    'Segoe UI', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: var(--font-clash-display), var(--font-geist-sans), sans-serif;
  font-weight: 700;
  line-height: 1.25;
  color: var(--text-primary);
}

h1 {
  font-size: 3rem; /* 48px */
}

h2 {
  font-size: 2.25rem; /* 36px */
  font-weight: 600;
}

h3 {
  font-size: 1.875rem; /* 30px */
  font-weight: 600;
}

h4 {
  font-size: 1.5rem; /* 24px */
}

p {
  line-height: 1.7;
  color: var(--text-primary);
}

a {
  color: var(--text-primary);
  text-decoration: none;
  transition: color 0.2s ease;
}

a:hover {
  color: var(--primary);
}

/* Glassmorphism utility */
.glass-card {
  background: var(--glass-bg);
  backdrop-filter: blur(10px) saturate(180%);
  -webkit-backdrop-filter: blur(10px) saturate(180%);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-lg);
}

/* Focus styles */
*:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
  border-radius: 4px;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

### 1.7 Install shadcn/ui

**Task**: Set up shadcn/ui component library

**Installation**:
```bash
bunx shadcn@latest init
```

**Configuration** (when prompted):
- Style: Default
- Base color: Neutral
- CSS variables: Yes
- React Server Components: Yes
- Write to `src/` directory: Yes
- Import alias: `@/*`
- Tailwind prefix: Leave empty

**Install initial components**:
```bash
bunx shadcn@latest add button
bunx shadcn@latest add card
bunx shadcn@latest add input
bunx shadcn@latest add dropdown-menu
```

---

### 1.8 Theme Provider

**Task**: Create dark/light mode theme provider

**File**: `src/components/providers/ThemeProvider.tsx`

```typescript
'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check localStorage
    const stored = localStorage.getItem('theme') as Theme | null;
    // Check system preference
    const systemPreference = window.matchMedia('(prefers-color-scheme: dark)')
      .matches
      ? 'dark'
      : 'light';

    const initialTheme = stored || systemPreference;
    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  // Prevent flash of wrong theme
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
```

**File**: `src/app/layout.tsx` (update)

```typescript
import { ThemeProvider } from '@/components/providers/ThemeProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} ${clashDisplay.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme') ||
                  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                document.documentElement.classList.toggle('dark', theme === 'dark');
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="font-sans">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

---

### 1.9 Theme Toggle Component

**Task**: Create theme toggle button

**File**: `src/components/layout/ThemeToggle.tsx`

```typescript
'use client';

import { useTheme } from '@/components/providers/ThemeProvider';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="rounded-full"
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </Button>
  );
}
```

**Install icons**:
```bash
bun add lucide-react
```

---

### 1.10 Header Component

**Task**: Create basic navigation header

**File**: `src/components/layout/Header.tsx`

```typescript
import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border glass-card">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-display font-bold">
          Your Blog
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/blog" className="hover:text-primary transition-colors">
            Blog
          </Link>
          <Link
            href="/about"
            className="hover:text-primary transition-colors"
          >
            About
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
```

---

### 1.11 Footer Component

**Task**: Create basic footer

**File**: `src/components/layout/Footer.tsx`

```typescript
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-display font-semibold mb-4">Your Blog</h3>
            <p className="text-text-secondary text-sm">
              Personal blog about React, AI, and modern web development.
            </p>
          </div>

          <div>
            <h3 className="font-display font-semibold mb-4">Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/blog"
                  className="text-text-secondary hover:text-primary transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-text-secondary hover:text-primary transition-colors"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold mb-4">Social</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://github.com/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-secondary hover:text-primary transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-secondary hover:text-primary transition-colors"
                >
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-text-secondary">
          © {currentYear} Your Name. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
```

---

### 1.12 Root Page Layout

**Task**: Update homepage with header and footer

**File**: `src/app/page.tsx`

```typescript
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="container mx-auto px-4 py-24 text-center">
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">
            Welcome to Your Blog
          </h1>
          <p className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto">
            A modern blog about React, AI, and web development with 3D visual
            effects.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
```

---

### 1.13 ESLint & Prettier Configuration

**Task**: Configure code quality tools

**File**: `.eslintrc.json` (update)

```json
{
  "extends": ["next/core-web-vitals", "next/typescript"],
  "rules": {
    "prefer-const": "error",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      { "argsIgnorePattern": "^_" }
    ]
  }
}
```

**File**: `.prettierrc` (create)

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "arrowParens": "always"
}
```

**Install Prettier**:
```bash
bun add -D prettier
```

**File**: `package.json` (add scripts)

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "format": "prettier --write \"src/**/*.{ts,tsx,js,jsx,json,css,md}\""
  }
}
```

---

### 1.14 Git Configuration

**Task**: Set up .gitignore

**File**: `.gitignore` (ensure these are included)

```
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# bun
.bun

# fonts (if purchased/licensed)
# Uncomment if Clash Display is purchased:
# public/fonts/ClashDisplay-*.woff2
```

---

## Phase 1 Checklist

- [ ] 1.1 - Next.js 15 project initialized with Bun
- [ ] 1.2 - TypeScript strict mode configured
- [ ] 1.3 - Tailwind CSS configured with design tokens
- [ ] 1.4 - Geist fonts installed and configured
- [ ] 1.5 - Clash Display fonts downloaded and configured
- [ ] 1.6 - Global styles and CSS variables implemented
- [ ] 1.7 - shadcn/ui installed with initial components
- [ ] 1.8 - Theme provider created
- [ ] 1.9 - Theme toggle component built
- [ ] 1.10 - Header component created
- [ ] 1.11 - Footer component created
- [ ] 1.12 - Root page layout updated
- [ ] 1.13 - ESLint & Prettier configured
- [ ] 1.14 - .gitignore configured

---

## Verification Steps

After completing Phase 1, verify:

1. **Dev server runs**:
   ```bash
   bun dev
   ```
   Visit http://localhost:3000

2. **Fonts loaded correctly**:
   - Open DevTools → Network
   - Check for Geist and Clash Display font files
   - Inspect headings (should use Clash Display)
   - Inspect body text (should use Geist Sans)

3. **Theme toggle works**:
   - Click sun/moon icon
   - Page should switch between light/dark mode
   - Preference should persist on reload

4. **TypeScript compiles**:
   ```bash
   bun run build
   ```
   Should complete with no errors

5. **Linting passes**:
   ```bash
   bun run lint
   ```

---

## Phase 1 Deliverable

**Expected Output**:
- ✅ Working Next.js 15 app with App Router
- ✅ Premium typography (Geist + Clash Display)
- ✅ Dark/light theme switching
- ✅ Basic layout (Header + Footer)
- ✅ Design system with CSS variables
- ✅ shadcn/ui components ready
- ✅ Code quality tools configured

**Screenshot Target**:
A clean homepage with:
- Glassmorphic header showing logo, nav, theme toggle
- Large hero heading in Clash Display
- Body text in Geist Sans
- Footer with links
- Smooth theme transition

---

## Next: Phase 2

After Phase 1 is complete, we'll implement:
- Velite for MDX processing
- Content schema and sample posts
- Blog index page
- Individual post pages
- Code highlighting with Shiki
- Reading time calculation
- Table of contents

---

**Ready to start Phase 1?** Let me know if you want to begin implementation or if you have any questions about the plan!
