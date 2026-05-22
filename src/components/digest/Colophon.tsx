import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { formatShortDate } from '@/lib/digests';

type Neighbor = {
  slug: string;
  title: string;
  date: string;
  issueNumber: number;
} | null;

type Props = {
  issueNumber: number;
  totalFetched: number;
  publishedDate: string;
  prev: Neighbor;
  next: Neighbor;
};

export function Colophon({ issueNumber, totalFetched, publishedDate, prev, next }: Props) {
  return (
    <footer className="mt-20 mb-12">
      <div className="digest-ornament" aria-hidden="true">
        ✦
      </div>

      <p className="digest-mono-eyebrow text-center mb-12">
        End of Issue №{String(issueNumber).padStart(2, '0')}
        <span className="mx-2 opacity-50">·</span>
        Auto-curated from {totalFetched} sources
        <span className="mx-2 opacity-50">·</span>
        {formatShortDate(publishedDate)}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {prev ? (
          <Link
            href={`/digest/${prev.slug}`}
            className="group flex items-center gap-4 rounded-2xl border border-border bg-surface hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-200 px-5 py-4"
          >
            <ArrowLeft
              aria-hidden="true"
              className="w-5 h-5 text-text-muted group-hover:text-primary group-hover:-translate-x-1 transition-all shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="digest-mono-eyebrow text-text-muted">
                Previous · №{String(prev.issueNumber).padStart(2, '0')}
              </p>
              <p className="font-display text-base font-bold text-text-primary line-clamp-1 group-hover:text-primary transition-colors mt-1">
                {prev.title}
              </p>
            </div>
          </Link>
        ) : (
          <div className="rounded-2xl border border-dashed border-border px-5 py-4">
            <p className="digest-mono-eyebrow text-text-muted">No earlier issues</p>
          </div>
        )}
        {next ? (
          <Link
            href={`/digest/${next.slug}`}
            className="group flex items-center gap-4 rounded-2xl border border-border bg-surface hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-200 px-5 py-4 text-right md:text-left"
          >
            <div className="flex-1 min-w-0 order-1 md:order-none">
              <p className="digest-mono-eyebrow text-text-muted md:text-right">
                Next · №{String(next.issueNumber).padStart(2, '0')}
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
            <p className="digest-mono-eyebrow text-text-muted">Latest issue</p>
          </div>
        )}
      </div>
    </footer>
  );
}
