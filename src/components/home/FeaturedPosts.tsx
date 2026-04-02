import { posts } from '#/.velite';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const THEMES = [
  {
    pocket: 'bg-amber-50 dark:bg-amber-950/30',
    title: 'text-amber-600 dark:text-amber-400',
    deco: 'text-amber-300/80 dark:text-amber-700/50',
    read: 'text-amber-500 dark:text-amber-400',
  },
  {
    pocket: 'bg-sky-50 dark:bg-sky-900/20',
    title: 'text-sky-600 dark:text-sky-400',
    deco: 'text-sky-300/80 dark:text-sky-700/50',
    read: 'text-sky-500 dark:text-sky-400',
  },
  {
    pocket: 'bg-violet-50 dark:bg-violet-900/20',
    title: 'text-violet-600 dark:text-violet-400',
    deco: 'text-violet-300/80 dark:text-violet-700/50',
    read: 'text-violet-500 dark:text-violet-400',
  },
] as const;

export function FeaturedPosts() {
  const featuredPosts = posts
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  if (featuredPosts.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-16 md:py-20 max-w-6xl">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="font-display text-4xl md:text-5xl font-black mb-3 text-text-primary">
            Latest Articles
          </h2>
          <p className="text-text-secondary text-lg">
            Thoughts, tutorials, and insights from my journey
          </p>
        </div>
        <Link
          href="/blog"
          className="hidden md:inline-flex items-center gap-2 text-text-secondary hover:text-primary transition-colors group"
        >
          View all
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredPosts.map((post, i) => {
          const theme = THEMES[i % THEMES.length];
          const date = new Date(post.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          });

          return (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col h-[380px] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 border border-border"
            >
              {/* Top section — same accent color as pocket, big ghost number as visual */}
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

              {/* Pocket — slightly more saturated divider line gives depth */}
              <div className={`flex-1 ${theme.pocket} border-t border-black/5 dark:border-white/5 px-5 pt-4 pb-5`}>
                <p className="text-xs text-text-muted font-medium">
                  {date} · {post.readingTime}
                </p>
                <h3
                  className={`font-display text-xl font-black mt-1.5 mb-2 leading-snug line-clamp-2 ${theme.title}`}
                >
                  {post.title}
                </h3>
                {post.description && (
                  <p className="text-text-secondary text-sm leading-relaxed line-clamp-2">
                    {post.description}
                  </p>
                )}
                <div
                  className={`mt-3 flex items-center gap-1.5 text-xs font-semibold ${theme.read} opacity-70 group-hover:opacity-100 group-hover:gap-2.5 transition-all`}
                >
                  Read article <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 text-center md:hidden">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 px-6 py-3 bg-surface rounded-xl text-text-primary hover:bg-primary/20 transition-all"
        >
          View all articles
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
