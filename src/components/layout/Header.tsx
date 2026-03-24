'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto flex items-center justify-between px-4 py-4 md:py-6 max-w-6xl">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group" aria-label="Home">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center group-hover:shadow-lg group-hover:shadow-primary/30 transition-all">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 12.79C20.8427 14.4922 20.2039 16.1144 19.1583 17.4668C18.1127 18.8192 16.7035 19.8458 15.0957 20.4265C13.4879 21.0073 11.748 21.1181 10.0795 20.7461C8.41104 20.3741 6.88302 19.5345 5.67425 18.3258C4.46548 17.117 3.62596 15.589 3.25393 13.9205C2.8819 12.252 2.99274 10.5121 3.57348 8.9043C4.15423 7.29651 5.18085 5.88737 6.53324 4.84175C7.88562 3.79614 9.50782 3.15731 11.21 3C10.2134 4.34827 9.73387 6.00945 9.85856 7.68141C9.98324 9.35338 10.7039 10.9251 11.8894 12.1106C13.0749 13.2961 14.6466 14.0168 16.3186 14.1414C17.9906 14.2661 19.6517 13.7866 21 12.79V12.79Z"
                fill="white"
              />
            </svg>
          </div>
          <span className="font-display font-black text-xl text-text-primary hidden sm:block">
            Defang<span className="text-primary">.</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1 md:gap-2">
          <Link
            href="/"
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              isActive('/')
                ? 'bg-primary/10 text-primary'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface'
            }`}
          >
            Home
          </Link>
          <Link
            href="/blog"
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              isActive('/blog')
                ? 'bg-primary/10 text-primary'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface'
            }`}
          >
            Blog
          </Link>
          <Link
            href="/about"
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              isActive('/about')
                ? 'bg-primary/10 text-primary'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface'
            }`}
          >
            About
          </Link>

          {/* Divider */}
          <div className="w-px h-6 bg-border mx-2 hidden md:block" />

          {/* Dark Mode Toggle */}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
