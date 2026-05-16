import { digests } from '#/.velite';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { MDXContent } from '@/components/mdx/MDXContent';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return digests.map((digest) => ({
    slug: digest.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const digest = digests.find((d) => d.slug === slug);
  if (!digest) return { title: 'Not Found' };
  return {
    title: `${digest.title} — Daily Brief`,
    description: digest.description,
    openGraph: digest.cover_image
      ? { images: [{ url: digest.cover_image }] }
      : undefined,
  };
}

export default async function DigestDetailPage({ params }: Props) {
  const { slug } = await params;
  const digest = digests.find((d) => d.slug === slug);

  if (!digest || !digest.published) {
    notFound();
  }

  const dateStr = new Date(digest.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    timeZone: 'UTC',
  });

  return (
    <article className="container mx-auto px-4 py-12 md:py-16 max-w-4xl">
      {/* Back */}
      <Link
        href="/digest"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-surface text-text-secondary hover:text-text-primary transition-all mb-8 group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
        Daily Brief
      </Link>

      {/* Hero Image */}
      {digest.cover_image && (
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-10 shadow-2xl">
          <img
            src={digest.cover_image}
            alt={digest.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />
        </div>
      )}

      {/* Header */}
      <header className="mb-10 pb-8 border-b border-border">
        {/* TODAY'S PICKS badge */}
        {digest.item_count > 0 && (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wide mb-4">
            Today's Picks · {digest.item_count} items
          </div>
        )}

        <h1 className="font-display text-4xl md:text-5xl font-black mb-6 leading-tight text-text-primary">
          {digest.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
          <time dateTime={digest.date} className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" aria-hidden="true" />
            {dateStr}
          </time>
        </div>
      </header>

      {/* Content */}
      <div className="prose prose-lg max-w-none">
        <MDXContent code={digest.body} />
      </div>
    </article>
  );
}
