import { posts } from '#/.velite';
import { notFound } from 'next/navigation';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
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
    title: post.title,
    description: post.description,
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = posts.find((post) => post.slug === slug);

  if (!post || !post.published) {
    notFound();
  }

  return (
    <article className="container mx-auto px-4 py-12 max-w-3xl">
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-text-secondary hover:text-primary transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Blog
      </Link>

      <header className="mb-8">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
          {post.title}
        </h1>

        {post.description && (
          <p className="text-xl text-text-secondary mb-6">{post.description}</p>
        )}

        <div className="flex items-center gap-4 text-sm text-text-secondary pb-6 border-b border-border">
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
          <div className="flex gap-2 mt-6">
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
      </header>

      <div className="prose">
        <MDXContent code={post.body} />
      </div>
    </article>
  );
}
