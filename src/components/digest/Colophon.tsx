import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { Issue } from '@/lib/issues';

type Props = {
  issue: Issue;
};

const COPY = {
  en: {
    endOf: (label: string) => `End of ${label}`,
    sources: (n: number) => `Auto-curated from ${n} sources`,
    prevLabel: (numeral: string) => `Previous · Nº${numeral}`,
    nextLabel: (numeral: string) => `Next · Nº${numeral}`,
    noEarlier: 'No earlier issues',
    latest: 'Latest issue',
  },
  zh: {
    endOf: (label: string) => `${label}完`,
    sources: (n: number) => `自动精选自 ${n} 条来源`,
    prevLabel: (numeral: string) => `上一期 · 第 ${numeral} 期`,
    nextLabel: (numeral: string) => `下一期 · 第 ${numeral} 期`,
    noEarlier: '已是最早一期',
    latest: '已是最新一期',
  },
} as const;

export function Colophon({ issue }: Props) {
  const copy = COPY[issue.lang];
  const { older: prev, newer: next } = issue;

  return (
    <footer className="mt-20 mb-12">
      <div className="digest-ornament" aria-hidden="true">
        ✦
      </div>

      <p className="digest-mono-eyebrow text-center mb-12">
        {copy.endOf(issue.label)}
        <span className="mx-2 opacity-50">·</span>
        {copy.sources(issue.totalFetched)}
        <span className="mx-2 opacity-50">·</span>
        {issue.dateShort}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {prev ? (
          <Link
            href={prev.href}
            className="group flex items-center gap-4 rounded-2xl border border-border bg-surface hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-200 px-5 py-4"
          >
            <ArrowLeft
              aria-hidden="true"
              className="w-5 h-5 text-text-muted group-hover:text-primary group-hover:-translate-x-1 transition-all shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="digest-mono-eyebrow text-text-muted">{copy.prevLabel(prev.numeral)}</p>
              <p className="font-display text-base font-bold text-text-primary line-clamp-1 group-hover:text-primary transition-colors mt-1">
                {prev.title}
              </p>
            </div>
          </Link>
        ) : (
          <div className="rounded-2xl border border-dashed border-border px-5 py-4">
            <p className="digest-mono-eyebrow text-text-muted">{copy.noEarlier}</p>
          </div>
        )}
        {next ? (
          <Link
            href={next.href}
            className="group flex items-center gap-4 rounded-2xl border border-border bg-surface hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-200 px-5 py-4 text-right md:text-left"
          >
            <div className="flex-1 min-w-0 order-1 md:order-none">
              <p className="digest-mono-eyebrow text-text-muted md:text-right">
                {copy.nextLabel(next.numeral)}
              </p>
              <p className="font-display text-base font-bold text-text-primary line-clamp-1 group-hover:text-primary transition-colors mt-1 md:text-right">
                {next.title}
              </p>
            </div>
            <ArrowRight
              aria-hidden="true"
              className="w-5 h-5 text-text-muted group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 order-2 md:order-none md:ml-auto"
            />
          </Link>
        ) : (
          <div className="rounded-2xl border border-dashed border-border px-5 py-4 md:text-right">
            <p className="digest-mono-eyebrow text-text-muted">{copy.latest}</p>
          </div>
        )}
      </div>
    </footer>
  );
}
