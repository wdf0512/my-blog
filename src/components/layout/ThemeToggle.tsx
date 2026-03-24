'use client';

import { useTheme } from '@/components/providers/ThemeProvider';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="w-9 h-9 rounded-lg bg-surface hover:bg-primary/10 flex items-center justify-center transition-all group"
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 text-text-secondary group-hover:text-primary transition-colors" />
      ) : (
        <Moon className="w-4 h-4 text-text-secondary group-hover:text-primary transition-colors" />
      )}
    </button>
  );
}
