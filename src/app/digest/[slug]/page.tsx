import { digests } from '#/.velite';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock, Database, Layers } from 'lucide-react';
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
    title: digest.title,
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

  const dateStr = new Date(digest.date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  return (
    <article className="container mx-auto px-4 py-12 md:py-16 max-w-4xl">
      {/* Back */}
      <Link
        href="/digest"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-surface text-text-secondary hover:text-text-primary transition-all mb-8 group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        返回情报列表
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wide mb-4">
          ⚡ Horizon Daily Digest
        </div>

        <h1 className="font-display text-4xl md:text-5xl font-black mb-4 leading-tight text-text-primary">
          {digest.title}
        </h1>

        {digest.description && (
          <p className="text-xl text-text-secondary mb-6">{digest.description}</p>
        )}

        <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
          <time dateTime={digest.date} className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            {dateStr}
          </time>
          {digest.total_fetched > 0 && (
            <span className="flex items-center gap-1.5">
              <Database className="h-4 w-4" />
              从 {digest.total_fetched} 条内容中筛选
            </span>
          )}
          {digest.item_count > 0 && (
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
              <Layers className="h-3.5 w-3.5" />
              {digest.item_count} 条精选
            </span>
          )}
        </div>
      </header>

      {/* Content */}
      <div className="prose prose-lg max-w-none">
        <MDXContent code={digest.body} />
      </div>

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-border">
        <div className="bg-surface rounded-2xl p-6 flex items-start gap-4">
          <div className="text-3xl flex-shrink-0">🤖</div>
          <div>
            <h3 className="font-display text-base font-bold mb-1 text-text-primary">
              由 Horizon 自动生成
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              本情报由{' '}
              <a
                href="https://github.com/wdf0512/Horizon"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Horizon
              </a>{' '}
              自动聚合分析，每日 09:00 从 GitHub、HackerNews、RSS 等多个信源中抓取，经 AI 评分筛选后生成。
            </p>
          </div>
        </div>
      </footer>
    </article>
  );
}
