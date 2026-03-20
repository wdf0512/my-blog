# defang-blog-vibe

A modern personal tech blog with 3D visual effects, Apple-inspired design, and premium typography.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v3.4+
- **Fonts**: Geist Sans/Mono + Clash Display
- **Icons**: Lucide React
- **Package Manager**: Bun

## Project Status

✅ **Phase 1 Complete** - Foundation Setup

- Next.js 16 project initialized
- TypeScript configured (strict mode)
- Tailwind CSS with custom design tokens
- Geist fonts installed and configured
- Theme provider with dark/light mode
- Header and Footer components
- ESLint + Prettier configured

## Getting Started

### Prerequisites

1. **Install Bun** (if not already installed):
   ```bash
   curl -fsSL https://bun.sh/install | bash
   ```

2. **Download Clash Display Fonts**:
   - Visit: https://www.fontshare.com/fonts/clash-display
   - Download the font files
   - Place these files in `public/fonts/`:
     - `ClashDisplay-Regular.woff2`
     - `ClashDisplay-Semibold.woff2`
     - `ClashDisplay-Bold.woff2`
   - See `public/fonts/README.md` for detailed instructions

### Installation

```bash
# Install dependencies
bun install

# Run development server
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

### Available Scripts

```bash
bun dev          # Start development server
bun build        # Build for production
bun start        # Start production server
bun lint         # Run ESLint
bun format       # Format code with Prettier
```

## Features

### Implemented ✅

- **Premium Typography**: Geist + Clash Display fonts
- **Dark/Light Mode**: System preference detection + manual toggle
- **Glassmorphism**: Frosted glass effect on header
- **Responsive Layout**: Mobile-first design
- **Design System**: CSS variables for colors, spacing, shadows
- **Accessibility**: Focus indicators, reduced motion support

### Coming Next 🚧

**Phase 2** - Content Pipeline:
- Velite for MDX processing
- Blog post pages
- Code syntax highlighting (Shiki)
- Reading time calculation
- Table of contents

**Phase 3** - 3D & Animations:
- React Three Fiber hero scene
- GSAP scroll animations
- framer-motion hover effects
- Page transitions

**Phase 4** - Features:
- Search functionality (Fuse.js)
- Comments (Giscus)
- Newsletter signup (Resend)
- Categories and tags

## Project Structure

```
defang-blog-vibe/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with fonts
│   │   ├── page.tsx            # Homepage
│   │   └── globals.css         # Global styles + design system
│   └── components/
│       ├── layout/
│       │   ├── Header.tsx      # Navigation header
│       │   ├── Footer.tsx      # Site footer
│       │   └── ThemeToggle.tsx # Dark/light mode toggle
│       └── providers/
│           └── ThemeProvider.tsx # Theme context
├── public/
│   └── fonts/                  # Clash Display fonts (download required)
├── docs/
│   └── superpowers/
│       └── specs/              # Design specifications
├── IMPLEMENTATION_PLAN.md      # Detailed implementation guide
└── package.json
```

## Design System

### Colors

**Light Mode**:
- Background: `#FAFAFA`
- Primary: `#FFD93D` (Banana Yellow)
- Text: `#2C2C2C`

**Dark Mode**:
- Background: `#000000`
- Primary: `#F4C430`
- Text: `#F5F5F5`

### Typography

- **Body**: Geist Sans (16px base, 18px large screens)
- **Headings**: Clash Display (Bold/Semibold)
- **Code**: Geist Mono

### Spacing

Uses a consistent spacing scale (0.5rem to 6rem) via CSS variables.

## Documentation

- [Design Specification](docs/superpowers/specs/2026-03-20-3d-blog-design.md) - Complete design system and architecture
- [Implementation Plan](IMPLEMENTATION_PLAN.md) - Phase-by-phase build guide

## Contributing

This is a personal project, but feedback and suggestions are welcome!

## License

MIT

---

**Built with Claude Code** 🤖
