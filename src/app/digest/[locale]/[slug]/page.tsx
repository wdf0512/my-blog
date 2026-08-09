import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { MDXContent } from '@/components/mdx/MDXContent';
import { getIssue, getIssues, isDigestLang, DIGEST_LANGS } from '@/lib/issues';
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

const COPY = {
  en: {
    backLabel: 'Daily Brief · Archive',
    todayBadge: "Today's Issue",
    minRead: (m: number) => `~${m} min read`,
    picksBand: (picks: number, total: number) => `${picks} Picks · Curated from ${total}`,
  },
  zh: {
    backLabel: '每日简报 · 归档',
    todayBadge: '今日简报',
    minRead: (m: number) => `约 ${m} 分钟阅读`,
    picksBand: (picks: number, total: number) => `精选 ${picks} 条 · 共 ${total} 条来源`,
  },
} as const;

export async function generateStaticParams() {
  return DIGEST_LANGS.flatMap((locale) =>
    getIssues(locale).map((issue) => ({ locale, slug: issue.slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isDigestLang(locale)) return { title: 'Not Found' };
  const issue = getIssue(locale, slug);
  if (!issue) return { title: 'Not Found' };
  return {
    title: `${issue.title} — Daily Brief`,
    description: issue.description,
    openGraph: issue.cover ? { images: [{ url: issue.cover }] } : undefined,
  };
}

export default async function DigestDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isDigestLang(locale)) notFound();

  const copy = COPY[locale];
  const issue = getIssue(locale, slug);
  if (!issue) notFound();

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
            companionHref={issue.companion?.href ?? null}
          />
        </div>

        {issue.cover && (
          <div className="mb-12">
            <IssueCover src={issue.cover} alt={issue.title} />
          </div>
        )}

        <header className="relative mb-12">
          <IssueNumeral
            number={issue.number}
            className="absolute -top-12 right-0 text-[12rem] md:text-[18rem] z-0"
          />
          <div className="relative z-[1]">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] bg-primary text-background px-2 py-1 rounded-md font-bold">
                {issue.isToday ? copy.todayBadge : issue.label}
              </span>
              <span className="digest-mono-eyebrow">
                {issue.dateLong}
                <span className="mx-2 opacity-50">·</span>
                {copy.minRead(issue.minutes)}
              </span>
            </div>

            <h1 className="mt-6 font-display text-4xl md:text-6xl lg:text-7xl font-black text-text-primary leading-[0.95] tracking-tight max-w-[18ch]">
              {issue.title}
            </h1>

            {issue.description && (
              <p className="mt-6 text-text-secondary text-lg md:text-xl italic leading-relaxed max-w-[60ch]">
                {issue.description}
              </p>
            )}

            <div className="mt-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-primary/40" />
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-primary font-bold">
                {copy.picksBand(issue.itemCount, issue.totalFetched)}
              </span>
              <div className="h-px flex-1 bg-primary/40" />
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_18rem] gap-10 lg:gap-16">
          <div className="digest-prose min-w-0 [&_p]:max-w-[68ch]">
            <DigestProvider>
              <MDXContent code={issue.body} components={digestComponents} />
            </DigestProvider>
          </div>
          <aside>
            <SidebarTOC locale={locale} />
          </aside>
        </div>

        <Colophon issue={issue} />
      </article>
    </>
  );
}
