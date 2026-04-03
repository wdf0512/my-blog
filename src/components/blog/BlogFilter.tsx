'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Search } from 'lucide-react';
import { useFlipCards } from '@/hooks/useFlipCards';
import { useFilterMorph } from '@/hooks/useFilterMorph';

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
  useFilterMorph(gridRef, activeTag);

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
        {posts.map((post, i) => {
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
