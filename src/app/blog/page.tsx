import { posts } from '#/.velite';
import Link from 'next/link';
import { Calendar, Clock } from 'lucide-react';

export const metadata = {
  title: 'Blog',
  description: 'Articles about React, AI, and web development',
};

export default function BlogPage() {
  const publishedPosts = posts
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="font-display text-5xl md:text-6xl font-bold mb-4">
        Blog
      </h1>
      <p className="text-text-secondary text-lg mb-12">
        Thoughts on React, AI, and modern web development
      </p>

      <div className="space-y-8">
        {publishedPosts.map((post) => (
          <article
            key={post.slug}
            className="group border border-border rounded-lg p-6 hover:border-primary transition-colors"
          >
            <Link href={`/blog/${post.slug}`}>
              <h2 className="font-display text-2xl md:text-3xl font-semibold mb-3 group-hover:text-primary transition-colors">
                {post.title}
              </h2>
            </Link>

            {post.description && (
              <p className="text-text-secondary mb-4">{post.description}</p>
            )}

            <div className="flex items-center gap-4 text-sm text-text-secondary">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </div>

              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>{post.readingTime}</span>
              </div>
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="flex gap-2 mt-4">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1 rounded-full bg-surface border border-border"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
