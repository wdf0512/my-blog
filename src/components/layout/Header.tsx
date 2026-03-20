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
