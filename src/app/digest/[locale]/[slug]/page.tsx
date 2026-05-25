import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { MDXContent } from '@/components/mdx/MDXContent';
import {
  getPublishedDigests,
  getIssueNumberMap,
  findCompanion,
  formatLongDate,
  estimateMinutes,
  isToday,
  type DigestLang,
} from '@/lib/digests';
import { IssueCover } from '@/components/digest/IssueCover';
import { IssueNumeral } from '@/components/digest/IssueNumeral';
import { ScrollProgress } from '@/components/digest/ScrollProgress';
import { SidebarTOC } from '@/components/digest/SidebarTOC';
import { Colophon } from '@/components/digest/Colophon';
import { LocaleToggle } from '@/components/digest/LocaleToggle';
import { DigestProvider, digestComponents } from '@/components/mdx/digest-components';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

function isLocale(value: string): value is DigestLang {
  return value === 'en' || value === 'zh';
}

const COPY = {
  en: {
    backLabel: 'Daily Brief · Archive',
    todayBadge: "Today's Issue",
    issueBadge: (n: number) => `Issue Nº${String(n).padStart(2, '0')}`,
    minRead: (m: number) => `~${m} min read`,
    picksBand: (picks: number, total: number) => `${picks} Picks · Curated from ${total}`,
  },
  zh: {
    backLabel: '每日简报 · 归档',
    todayBadge: '今日简报',
    issueBadge: (n: number) => `第 ${String(n).padStart(2, '0')} 期`,
    minRead: (m: number) => `约 ${m} 分钟阅读`,
    picksBand: (picks: number, total: number) => `精选 ${picks} 条 · 共 ${total} 条来源`,
  },
} as const;

export async function generateStaticParams() {
  return getPublishedDigests().map((d) => ({ locale: d.lang, slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return { title: 'Not Found' };
  const digest = getPublishedDigests(locale).find((d) => d.slug === slug);
  if (!digest) return { title: 'Not Found' };
  return {
    title: `${digest.title} — Daily Brief`,
    description: digest.description,
    openGraph: digest.cover_image ? { images: [{ url: digest.cover_image }] } : undefined,
  };
}

export default async function DigestDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const copy = COPY[locale];

  const allPublished = getPublishedDigests();
  const localePublished = getPublishedDigests(locale);
  const digest = localePublished.find((d) => d.slug === slug);
  if (!digest || !digest.published) notFound();

  const issueBySlug = getIssueNumberMap(allPublished);
  const issueNumber = issueBySlug.get(digest.slug) ?? 0;
  const minutes = estimateMinutes(digest.wordCount);
  const dateLong = formatLongDate(digest.date, locale);
  const todayFlag = isToday(digest.date);

  const idx = localePublished.findIndex((d) => d.slug === slug);
  const newer = idx > 0 ? localePublished[idx - 1] : null;
  const older = idx < localePublished.length - 1 ? localePublished[idx + 1] : null;

  const neighborOf = (d: typeof newer | typeof older) =>
    d
      ? {
          slug: d.slug,
          title: d.title,
          date: d.date,
          issueNumber: issueBySlug.get(d.slug) ?? 0,
          locale,
        }
      : null;

  const companion = findCompanion(digest);

  return (
    <>
      <ScrollProgress />

      <article className="container mx-auto px-4 pt-10 md:pt-14 pb-8 max-w-6xl">
        <div className="flex items-center justify-between gap-4 mb-8">
          <Link
            href={`/digest/${locale}`}
            className="inline-flex items-center gap-2 group text-text-secondary hover:text-text-primary transition-colors"
          >
            <ArrowLeft
              className="h-4 w-4 group-hover:-translate-x-1 transition-transform"
              aria-hidden="true"
            />
            <span className="digest-mono-eyebrow">{copy.backLabel}</span>
          </Link>
          <LocaleToggle
            locale={locale}
            variant="detail"
            companionHref={companion ? `/digest/${companion.lang}/${companion.slug}` : null}
          />
        </div>

        {digest.cover_image && (
          <div className="mb-12">
            <IssueCover src={digest.cover_image} alt={digest.title} />
          </div>
        )}

        <header className="relative mb-12">
          <IssueNumeral
            number={issueNumber}
            className="absolute -top-12 right-0 text-[12rem] md:text-[18rem] z-0"
          />
          <div className="relative z-[1]">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] bg-primary text-background px-2 py-1 rounded-md font-bold">
                {todayFlag ? copy.todayBadge : copy.issueBadge(issueNumber)}
              </span>
              <span className="digest-mono-eyebrow">
                {dateLong}
                <span className="mx-2 opacity-50">·</span>
                {copy.minRead(minutes)}
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
                {copy.picksBand(digest.item_count, digest.total_fetched)}
              </span>
              <div className="h-px flex-1 bg-primary/40" />
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_18rem] gap-10 lg:gap-16">
          <div className="digest-prose min-w-0 [&_p]:max-w-[68ch]">
            <DigestProvider>
              <MDXContent code={digest.body} components={digestComponents} />
            </DigestProvider>
          </div>
          <aside>
            <SidebarTOC locale={locale} />
          </aside>
        </div>

        <Colophon
          issueNumber={issueNumber}
          totalFetched={digest.total_fetched}
          publishedDate={digest.date}
          prev={neighborOf(older)}
          next={neighborOf(newer)}
          locale={locale}
        />
      </article>
    </>
  );
}
