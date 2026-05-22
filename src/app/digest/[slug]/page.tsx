import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { MDXContent } from '@/components/mdx/MDXContent';
import {
  getPublishedDigests,
  getIssueNumberMap,
  formatLongDate,
  estimateMinutes,
  isToday,
} from '@/lib/digests';
import { IssueCover } from '@/components/digest/IssueCover';
import { IssueNumeral } from '@/components/digest/IssueNumeral';
import { ScrollProgress } from '@/components/digest/ScrollProgress';
import { SidebarTOC } from '@/components/digest/SidebarTOC';
import { Colophon } from '@/components/digest/Colophon';
import { DigestProvider, digestComponents } from '@/components/mdx/digest-components';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getPublishedDigests().map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const digest = getPublishedDigests().find((d) => d.slug === slug);
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
  const published = getPublishedDigests();
  const digest = published.find((d) => d.slug === slug);
  if (!digest || !digest.published) notFound();

  const issueBySlug = getIssueNumberMap(published);
  const issueNumber = issueBySlug.get(digest.slug) ?? published.length;
  const minutes = estimateMinutes(digest.wordCount);
  const dateLong = formatLongDate(digest.date);
  const todayFlag = isToday(digest.date);

  // Prev = older (further back in sorted desc array); Next = newer
  const idx = published.findIndex((d) => d.slug === slug);
  const newer = idx > 0 ? published[idx - 1] : null;
  const older = idx < published.length - 1 ? published[idx + 1] : null;

  const neighborOf = (d: typeof newer | typeof older) =>
    d
      ? {
          slug: d.slug,
          title: d.title,
          date: d.date,
          issueNumber: issueBySlug.get(d.slug) ?? 0,
        }
      : null;

  return (
    <>
      <ScrollProgress />

      <article className="container mx-auto px-4 pt-10 md:pt-14 pb-8 max-w-6xl">
        {/* Back */}
        <Link
          href="/digest"
          className="inline-flex items-center gap-2 group text-text-secondary hover:text-text-primary transition-colors mb-8"
        >
          <ArrowLeft
            className="h-4 w-4 group-hover:-translate-x-1 transition-transform"
            aria-hidden="true"
          />
          <span className="digest-mono-eyebrow">Daily Brief · Archive</span>
        </Link>

        {/* Cover */}
        {digest.cover_image && (
          <div className="mb-12">
            <IssueCover src={digest.cover_image} alt={digest.title} />
          </div>
        )}

        {/* Issue masthead */}
        <header className="relative mb-12">
          <IssueNumeral
            number={issueNumber}
            className="absolute -top-12 right-0 text-[12rem] md:text-[18rem] z-0"
          />
          <div className="relative z-[1]">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] bg-primary text-background px-2 py-1 rounded-md font-bold">
                {todayFlag ? "Today's Issue" : `Issue №${String(issueNumber).padStart(2, '0')}`}
              </span>
              <span className="digest-mono-eyebrow">
                {dateLong}
                <span className="mx-2 opacity-50">·</span>~{minutes} min read
              </span>
            </div>

            <h1 className="mt-6 font-display text-4xl md:text-6xl lg:text-7xl font-black text-text-primary leading-[0.95] tracking-tight max-w-[18ch]">
              {digest.title}
            </h1>

            {digest.description && (
              <p className="mt-6 text-text-secondary text-lg md:text-xl italic leading-relaxed max-w-[60ch]">
                {digest.description}
              </p>
            )}

            <div className="mt-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-primary/40" />
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-primary font-bold">
                {digest.item_count} Picks · Curated from {digest.total_fetched}
              </span>
              <div className="h-px flex-1 bg-primary/40" />
            </div>
          </div>
        </header>

        {/* Two-column body */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_18rem] gap-10 lg:gap-16">
          <div className="digest-prose min-w-0 [&_p]:max-w-[68ch]">
            <DigestProvider>
              <MDXContent code={digest.body} components={digestComponents} />
            </DigestProvider>
          </div>
          <aside>
            <SidebarTOC />
          </aside>
        </div>

        {/* Colophon */}
        <Colophon
          issueNumber={issueNumber}
          totalFetched={digest.total_fetched}
          publishedDate={digest.date}
          prev={neighborOf(older)}
          next={neighborOf(newer)}
        />
      </article>
    </>
  );
}
