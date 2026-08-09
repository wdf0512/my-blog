import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import { getIssues, isDigestLang, DIGEST_LANGS, type Issue } from '@/lib/issues';
import { Masthead } from '@/components/digest/Masthead';
import { LocaleToggle } from '@/components/digest/LocaleToggle';

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return DIGEST_LANGS.map((locale) => ({ locale }));
}

const COPY = {
  en: {
    metaTitle: 'Daily Brief — Archive',
    metaDescription: 'Auto-curated daily digest of what matters in AI, updated every morning.',
    olderHeading: 'The Archive · Older Issues',
    emptyEyebrow: 'No issues on file',
    emptyTitle: 'Check back tomorrow.',
    colophon: (label: string) =>
      `Briefs are auto-curated each morning · ${label} is the latest`,
  },
  zh: {
    metaTitle: '每日简报 · 归档',
    metaDescription: '每日自动精选 AI 与技术领域的重要动态。',
    olderHeading: '过往简报 · 历史归档',
    emptyEyebrow: '暂无简报',
    emptyTitle: '请明日再来。',
    colophon: (label: string) => `每日自动精选 · ${label}为最新一期`,
  },
} as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isDigestLang(locale)) return {};
  const copy = COPY[locale];
  return { title: copy.metaTitle, description: copy.metaDescription };
}

export default async function DigestArchivePage({ params }: Props) {
  const { locale } = await params;
  if (!isDigestLang(locale)) notFound();

  const copy = COPY[locale];
  const issues = getIssues(locale);
  const [featured, ...archive] = issues;

  return (
    <div className="container mx-auto px-4 pt-12 pb-20 md:pt-16 md:pb-28 max-w-6xl">
      <Masthead
        variant="archive"
        locale={locale}
        issueCount={issues.length}
        rightSlot={<LocaleToggle locale={locale} variant="archive" />}
      />

      {!featured ? (
        <div className="mt-24 text-center">
          <p className="digest-mono-eyebrow text-text-muted">{copy.emptyEyebrow}</p>
          <p className="font-display text-2xl mt-3 text-text-primary">{copy.emptyTitle}</p>
        </div>
      ) : (
        <>
          <FeatureCard issue={featured} />

          {archive.length > 0 && (
            <>
              <h2 className="digest-mono-eyebrow text-text-secondary mt-20 mb-6">
                {copy.olderHeading}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {archive.map((issue) => (
                  <TearSheet key={issue.slug} issue={issue} />
                ))}
              </div>
            </>
          )}

          <div className="mt-24">
            <div className="digest-ornament" aria-hidden="true">
              ✦
            </div>
            <p className="digest-mono-eyebrow text-center text-text-muted">
              {copy.colophon(featured.label)}
            </p>
          </div>
        </>
      )}
    </div>
  );
}

const CARD_COPY = {
  en: {
    today: "Today's Issue",
    latest: 'Latest Issue',
    todayShort: 'Today',
    picksFmt: (n: number, total: number) => `${n} picks · curated from ${total}`,
    picksShort: (n: number, total: number) => `${n} picks · from ${total}`,
    cta: 'Read the issue',
  },
  zh: {
    today: '今日简报',
    latest: '最新一期',
    todayShort: '今日',
    picksFmt: (n: number, total: number) => `精选 ${n} 条 · 共 ${total} 条来源`,
    picksShort: (n: number, total: number) => `${n} 条 · 来自 ${total} 条`,
    cta: '阅读本期',
  },
} as const;

function FeatureCard({ issue }: { issue: Issue }) {
  const copy = CARD_COPY[issue.lang];

  return (
    <Link
      href={issue.href}
      className="group relative mt-12 block overflow-hidden rounded-3xl bg-[#0d0c0b] shadow-lg hover:shadow-2xl transition-shadow duration-500 isolate min-h-[460px] md:min-h-[520px] md:aspect-[16/9]"
    >
      {issue.cover ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={issue.cover}
          alt=""
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#22170f] via-[#0d0c0b] to-[#0a0d10]" />
      )}

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-br from-[#0d0c0b]/0 via-[#0d0c0b]/0 to-[#0d0c0b]/35 mix-blend-multiply"
      />
      <div className="paper-grain absolute inset-0" aria-hidden="true" />

      <span
        aria-hidden="true"
        className="absolute -top-6 right-2 md:right-6 font-display font-black tracking-tighter leading-none text-white/[0.08] text-[12rem] md:text-[18rem] select-none pointer-events-none"
      >
        {issue.numeral}
      </span>

      <div className="absolute top-6 left-6 md:top-7 md:left-7 z-10 flex items-center gap-2">
        <span className="font-mono uppercase text-[10px] tracking-[0.2em] bg-primary text-[#0d0c0b] px-2.5 py-1 rounded-md font-bold">
          {issue.isToday ? copy.today : copy.latest}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">
          № {issue.numeral}
        </span>
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[72%] bg-gradient-to-t from-[#0a0908] via-[#0a0908]/85 via-45% to-transparent"
      />

      <div className="absolute inset-x-0 bottom-0 z-10 p-6 md:p-9">
        <p className="font-mono uppercase text-[11px] tracking-[0.22em] text-white/65 mb-3">
          {issue.label}
          <span className="mx-2 opacity-50">·</span>
          {issue.dateShort}
        </p>

        <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-black text-white leading-[0.98] tracking-tight max-w-[22ch] group-hover:text-primary transition-colors duration-300">
          {issue.title}
        </h2>

        {issue.description && (
          <p className="mt-4 text-white/70 text-sm md:text-base italic leading-relaxed line-clamp-2 max-w-prose">
            {issue.description}
          </p>
        )}

        <div className="mt-6 md:mt-8 pt-4 border-t border-white/15 flex items-center justify-between gap-4">
          <span className="font-mono text-[11px] md:text-xs text-white/60">
            {copy.picksFmt(issue.itemCount, issue.totalFetched)}
          </span>
          <span className="inline-flex items-center gap-1.5 text-primary font-bold text-sm">
            {copy.cta}
            <ArrowRight
              aria-hidden="true"
              className="w-4 h-4 group-hover:translate-x-1.5 transition-transform"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}

function TearSheet({ issue }: { issue: Issue }) {
  const copy = CARD_COPY[issue.lang];

  return (
    <Link
      href={issue.href}
      className="group relative block overflow-hidden rounded-2xl bg-[#0d0c0b] shadow-md hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-500 isolate min-h-[280px] md:min-h-[300px] aspect-[4/3] md:aspect-[5/4]"
    >
      {issue.cover ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={issue.cover}
          alt=""
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#1c1208] via-[#0d0c0b] to-[#0a0d10]" />
      )}

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-br from-[#0d0c0b]/0 via-[#0d0c0b]/0 to-[#0d0c0b]/40 mix-blend-multiply"
      />
      <div className="paper-grain absolute inset-0" aria-hidden="true" />

      <span
        aria-hidden="true"
        className="absolute -top-3 right-1 md:right-3 font-display font-black tracking-tighter leading-none text-white/[0.07] text-[7rem] md:text-[9rem] select-none pointer-events-none"
      >
        {issue.numeral}
      </span>

      <div className="absolute top-4 left-4 md:top-5 md:left-5 z-10 flex items-center gap-2">
        {issue.isToday && (
          <span className="font-mono uppercase text-[9px] tracking-[0.2em] bg-primary text-[#0d0c0b] px-2 py-0.5 rounded-md font-bold">
            {copy.todayShort}
          </span>
        )}
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/55">
          № {issue.numeral}
        </span>
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[68%] bg-gradient-to-t from-[#0a0908] via-[#0a0908]/82 via-45% to-transparent"
      />

      <div className="absolute inset-x-0 bottom-0 z-10 p-5 md:p-6">
        <p className="font-mono uppercase text-[10px] tracking-[0.22em] text-white/65 mb-2">
          {issue.label}
          <span className="mx-2 opacity-50">·</span>
          {issue.dateShort}
        </p>

        <h3 className="font-display text-lg md:text-2xl font-black text-white leading-[1.05] tracking-tight line-clamp-2 max-w-[22ch] group-hover:text-primary transition-colors duration-300">
          {issue.title}
        </h3>

        <div className="mt-4 pt-3 border-t border-white/12 flex items-center justify-between gap-3">
          <span className="font-mono text-[10px] md:text-[11px] text-white/55">
            {copy.picksShort(issue.itemCount, issue.totalFetched)}
          </span>
          <ArrowRight
            aria-hidden="true"
            className="w-3.5 h-3.5 text-white/70 group-hover:text-primary group-hover:translate-x-1 transition-all"
          />
        </div>
      </div>
    </Link>
  );
}
