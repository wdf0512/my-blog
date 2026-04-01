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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {publishedPosts.map((post) => (
          <article
            key={post.slug}
            className="group isolate flex flex-col bg-surface rounded-2xl border border-border hover:border-primary/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            {/* Card thumbnail */}
            <div className="relative h-36 overflow-hidden">
              <img
                src="/images/image_1774949295441_1.jpg"
                alt=""
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Overlay so card text stays readable */}
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
              {/* Tags float over the image */}
              {post.tags && post.tags.length > 0 && (
                <div className="absolute bottom-3 left-4 flex flex-wrap gap-1.5">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 rounded-md bg-black/50 backdrop-blur-sm text-xs font-semibold text-primary uppercase tracking-wide"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <Link href={`/blog/${post.slug}`} className="flex flex-col flex-1 p-6">
              {/* Post title */}
              <h2 className="font-display text-xl font-black mb-2 text-text-primary group-hover:text-primary transition-colors line-clamp-2">
                {post.title}
              </h2>

              {/* Post description */}
              {post.description && (
                <p className="text-text-secondary text-sm leading-relaxed line-clamp-3 flex-1 mb-4">
                  {post.description}
                </p>
              )}

              {/* Card footer */}
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                <div className="flex items-center gap-3 text-xs text-text-muted">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </time>
                  </div>
                  <span>·</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{post.readingTime}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-primary font-semibold text-xs group-hover:gap-2 transition-all">
                  Read <ArrowRight className="w-3.5 h-3.5" />
                </div>
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
