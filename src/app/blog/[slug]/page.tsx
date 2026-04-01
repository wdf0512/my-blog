import { posts } from '#/.velite';
import { notFound } from 'next/navigation';
import { Clock, ArrowLeft, Twitter, Linkedin, Facebook } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { MDXContent } from '@/components/mdx/MDXContent';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((post) => post.slug === slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} - Creative Coding & Conversations`,
    description: post.description,
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = posts.find((post) => post.slug === slug);

  if (!post || !post.published) {
    notFound();
  }

  // Get related posts (same tags)
  const relatedPosts = posts
    .filter(
      (p) =>
        p.published &&
        p.slug !== post.slug &&
        p.tags?.some((tag) => post.tags?.includes(tag))
    )
    .slice(0, 3);

  return (
    <>
      <article className="container mx-auto px-4 py-12 md:py-16 max-w-4xl">
        {/* Back button */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-surface text-text-secondary hover:text-text-primary transition-all mb-8 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to all articles
        </Link>

        {/* Article header */}
        <header className="mb-12">
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex gap-2 mb-6">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-lg bg-primary/10 text-xs font-semibold text-primary uppercase tracking-wide"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight text-text-primary">
            {post.title}
          </h1>

          {/* Description */}
          {post.description && (
            <p className="text-xl md:text-2xl text-text-secondary mb-8 leading-relaxed">
              {post.description}
            </p>
          )}

          {/* Meta info */}
          <div className="flex items-center justify-between flex-wrap gap-4 pb-6 border-b border-border">
            <div className="flex items-center gap-4 text-sm text-text-muted">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  D
                </div>
                <div>
                  <div className="font-semibold text-text-primary">Defang</div>
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </div>
              </div>
              <span className="text-text-muted">•</span>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>{post.readingTime}</span>
              </div>
            </div>

            {/* Share buttons */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-text-muted mr-2">Share:</span>
              <button className="w-8 h-8 rounded-lg bg-surface hover:bg-primary/10 flex items-center justify-center transition-colors group">
                <Twitter className="w-4 h-4 text-text-secondary group-hover:text-primary transition-colors" />
              </button>
              <button className="w-8 h-8 rounded-lg bg-surface hover:bg-primary/10 flex items-center justify-center transition-colors group">
                <Linkedin className="w-4 h-4 text-text-secondary group-hover:text-primary transition-colors" />
              </button>
              <button className="w-8 h-8 rounded-lg bg-surface hover:bg-primary/10 flex items-center justify-center transition-colors group">
                <Facebook className="w-4 h-4 text-text-secondary group-hover:text-primary transition-colors" />
              </button>
            </div>
          </div>
        </header>

        {/* Article content */}
        <div className="prose prose-lg max-w-none">
          <MDXContent code={post.body} />
        </div>

        {/* Author bio */}
        <div className="mt-16 pt-12 border-t border-border">
          <div className="bg-surface rounded-2xl p-8">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                D
              </div>
              <div>
                <h3 className="font-display text-xl font-bold mb-2 text-text-primary">
                  Written by Defang
                </h3>
                <p className="text-text-secondary mb-4">
                  Full-stack developer passionate about building beautiful web experiences.
                  I write about React, Next.js, and indie hacking. Currently exploring
                  AI-powered tools and creative coding.
                </p>
                <div className="flex gap-3">
                  <a
                    href="https://twitter.com/yourusername"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    Follow on Twitter
                  </a>
                  <span className="text-text-muted">•</span>
                  <a
                    href="https://github.com/yourusername"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <section className="bg-surface py-16 border-t border-border">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="font-display text-3xl font-black mb-8 text-text-primary">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.slug}
                  href={`/blog/${relatedPost.slug}`}
                  className="group bg-background rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-border hover:border-primary/20"
                >
                  <h3 className="font-display text-xl font-bold mb-2 text-text-primary group-hover:text-primary transition-colors line-clamp-2">
                    {relatedPost.title}
                  </h3>
                  {relatedPost.description && (
                    <p className="text-text-secondary text-sm line-clamp-2 mb-3">
                      {relatedPost.description}
                    </p>
                  )}
                  <div className="text-primary text-sm font-medium">
                    Read article →
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
