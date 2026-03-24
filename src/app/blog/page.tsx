import { posts } from '#/.velite';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, Search } from 'lucide-react';

export const metadata = {
  title: 'Blog - All Articles',
  description: 'Articles about web development, tech, and indie hacking',
};

export default function BlogPage() {
  const publishedPosts = posts
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Get unique tags
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {publishedPosts.map((post, index) => (
          <article
            key={post.slug}
            className={`group bg-surface rounded-2xl p-6 md:p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-border hover:border-primary/20 ${
              index === 0 ? 'md:col-span-2' : ''
            }`}
          >
            <Link href={`/blog/${post.slug}`}>
              {/* Post meta */}
              <div className="flex items-center gap-3 mb-4 text-sm text-text-muted">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
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
              <h2
                className={`font-display font-black mb-3 text-text-primary group-hover:text-primary transition-colors ${
                  index === 0 ? 'text-3xl md:text-4xl' : 'text-2xl md:text-3xl'
                }`}
              >
                {post.title}
              </h2>

              {/* Post description */}
              {post.description && (
                <p
                  className={`text-text-secondary mb-4 leading-relaxed ${
                    index === 0 ? 'text-lg line-clamp-2' : 'line-clamp-2'
                  }`}
                >
                  {post.description}
                </p>
              )}

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-lg bg-background text-xs font-medium text-text-primary"
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
          </article>
        ))}
      </div>

      {/* Empty state */}
      {publishedPosts.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="font-display text-2xl font-bold mb-2 text-text-primary">
            No articles yet
          </h3>
          <p className="text-text-secondary">
            Check back soon for new content!
          </p>
        </div>
      )}
    </div>
  );
}
