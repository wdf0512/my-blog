import { posts } from '#/.velite';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

export function FeaturedPosts() {
  const featuredPosts = posts
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  if (featuredPosts.length === 0) {
    return null;
  }

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
        {featuredPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group bg-surface rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-border hover:border-primary/20"
          >
            {/* Post meta */}
            <div className="flex items-center gap-3 mb-4 text-sm text-text-muted">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </time>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{post.readingTime}</span>
              </div>
            </div>

            {/* Post title */}
            <h3 className="font-display text-2xl font-bold mb-3 text-text-primary group-hover:text-primary transition-colors line-clamp-2">
              {post.title}
            </h3>

            {/* Post description */}
            {post.description && (
              <p className="text-text-secondary mb-4 line-clamp-2 leading-relaxed">
                {post.description}
              </p>
            )}

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-lg bg-background text-xs font-medium text-text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Read more */}
            <div className="flex items-center gap-2 text-primary font-medium text-sm group-hover:gap-3 transition-all">
              Read article
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        ))}
      </div>

      {/* Mobile view all link */}
      <div className="mt-8 text-center md:hidden">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 px-6 py-3 bg-surface rounded-xl text-text-primary hover:bg-primary hover:text-white transition-all"
        >
          View all articles
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
