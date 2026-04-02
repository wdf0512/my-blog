import { posts } from '#/.velite';
import Link from 'next/link';
import { ArrowRight, Search } from 'lucide-react';

export const metadata = {
  title: 'Blog - All Articles',
  description: 'Articles about web development, tech, and indie hacking',
};

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

export default function BlogPage() {
  const publishedPosts = posts
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const allTags = Array.from(
    new Set(publishedPosts.flatMap((post) => post.tags || []))
  ).slice(0, 10);

  return (
    <div className="container mx-auto px-4 py-12 md:py-16 max-w-6xl">
      {/* Header */}
      <div className="mb-12">
        <h1 className="font-display text-5xl md:text-6xl font-black mb-4 text-text-primary">
          All Articles
        </h1>
        <p className="text-text-secondary text-xl max-w-2xl">
          {publishedPosts.length} articles about web development, indie hacking,
          and building products. Updated regularly with new content.
        </p>
      </div>

      {/* Filter tags */}
      {allTags.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Search className="w-4 h-4 text-text-muted" />
            <span className="text-sm font-semibold text-text-muted uppercase tracking-wide">
              Filter by topic
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium shadow-sm">
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                className="px-4 py-2 rounded-xl bg-surface hover:bg-primary/10 border border-border hover:border-primary text-sm font-medium text-text-primary transition-all"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Posts grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {publishedPosts.map((post, i) => {
          const theme = THEMES[i % THEMES.length];
          const date = new Date(post.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          });

          return (
            <article key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="group flex flex-col h-[400px] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 border border-border"
              >
                {/* Decorative top — ghost number on accent background, same as homepage cards */}
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

                {/* Pocket */}
                <div className={`flex-1 ${theme.pocket} border-t border-black/5 dark:border-white/5 px-5 pt-4 pb-5`}>
                  <p className="text-xs text-text-muted font-medium">
                    {date} · {post.readingTime}
                  </p>
                  <h2
                    className={`font-display text-lg font-black mt-1.5 mb-2 leading-snug line-clamp-2 ${theme.title}`}
                  >
                    {post.title}
                  </h2>
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
            </article>
          );
        })}
      </div>

      {/* Empty state */}
      {publishedPosts.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="font-display text-2xl font-bold mb-2 text-text-primary">
            No articles yet
          </h3>
          <p className="text-text-secondary">Check back soon for new content!</p>
        </div>
      )}
    </div>
  );
}
