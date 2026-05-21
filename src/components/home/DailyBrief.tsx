import { digests } from '#/.velite';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function DailyBrief() {
  const published = digests
    .filter((d) => d.published && d.item_count > 0)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (published.length === 0) return null;

  const issueBySlug = new Map(
    [...published]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((d, i) => [d.slug, i + 1] as const),
  );

  const featured = published[0];
  const recents = published.slice(1, 4);

  const featuredIssue = issueBySlug.get(featured.slug) ?? published.length;
  const featuredDateLong = new Date(featured.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });

  const isToday =
    featured.date.slice(0, 10) === new Date().toISOString().slice(0, 10);

  return (
    <section className="container mx-auto px-4 py-16 md:py-20 max-w-6xl">
      {/* Section header */}
      <div className="flex items-end justify-between mb-10 md:mb-12 gap-4">
        <div>
          <h2 className="font-display text-4xl md:text-5xl font-black text-text-primary">
            Daily Brief
          </h2>
          {/* TODO: swap copy to author voice */}
          <p className="text-text-secondary text-base md:text-lg mt-2">
            What I&apos;m reading and learning today, distilled.
          </p>
        </div>
        <Link
          href="/digest"
          className="hidden md:inline-flex items-center gap-2 text-text-secondary hover:text-primary transition-colors group shrink-0 pb-1"
        >
          View archive
          <ArrowRight
            aria-hidden="true"
            className="w-4 h-4 group-hover:translate-x-1 transition-transform"
          />
        </Link>
      </div>

      {/* 2-col layout */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Left: featured */}
        <Link
          href={`/digest/${featured.slug}`}
          className="md:col-span-3 group relative flex flex-col rounded-3xl bg-surface border border-border hover:border-primary/40 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 p-7 md:p-8 min-h-[260px] overflow-hidden"
        >
          {/* Ghost numeral */}
          <span
            aria-hidden="true"
            className="pointer-events-none select-none absolute -top-3 right-4 md:right-6 font-display font-black text-[7rem] md:text-[9rem] leading-none text-[#965D36]/10 dark:text-[#F2C94C]/10 group-hover:text-[#965D36]/15 dark:group-hover:text-[#F2C94C]/15 transition-colors"
          >
            {featuredIssue}
          </span>

          {/* Eyebrow */}
          <div className="relative flex items-center gap-2.5 mb-5">
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-text-secondary">
              Issue {featuredIssue} · {featuredDateLong}
            </span>
            {isToday && (
              <span className="font-mono text-[10px] uppercase tracking-wider bg-primary text-background px-2 py-0.5 rounded-md font-bold">
                Today
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="relative font-display text-2xl md:text-3xl font-black text-text-primary leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {featured.title}
          </h3>

          {/* Description */}
          {featured.description && (
            <p className="relative mt-3 text-text-secondary text-sm md:text-base leading-relaxed line-clamp-2">
              {featured.description}
            </p>
          )}

          {/* Spacer to push footer down on tall cards */}
          <div className="flex-1" />

          {/* Footer */}
          <div className="relative mt-6 pt-4 border-t border-border flex items-center justify-between">
            <span className="font-mono text-xs text-text-secondary">
              {featured.item_count} picks · from {featured.total_fetched}
            </span>
            <span className="inline-flex items-center gap-1.5 text-primary text-sm font-bold">
              Open
              <ArrowRight
                aria-hidden="true"
                className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform"
              />
            </span>
          </div>
        </Link>

        {/* Right: recents */}
        <div className="md:col-span-2 flex flex-col gap-3">
          {recents.map((digest) => {
            const issueNo = issueBySlug.get(digest.slug) ?? 0;
            const d = new Date(digest.date);
            const month = d.toLocaleDateString('en-US', {
              month: 'short',
              timeZone: 'UTC',
            });
            const day = String(d.getUTCDate()).padStart(2, '0');

            return (
              <Link
                key={digest.slug}
                href={`/digest/${digest.slug}`}
                className="group flex items-center gap-4 rounded-2xl bg-surface border border-border hover:border-primary/30 hover:bg-primary/5 hover:-translate-y-0.5 px-4 py-3.5 transition-all duration-200"
              >
                <div className="flex-shrink-0 w-12 leading-none">
                  <span className="font-display text-2xl font-black text-[#965D36] dark:text-[#F2C94C]/70 group-hover:text-primary transition-colors leading-none block">
                    {issueNo}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-wide text-text-muted mt-1.5 block">
                    {month} {day}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display text-sm font-black text-text-primary line-clamp-1 group-hover:text-primary transition-colors leading-snug">
                    {digest.title}
                  </p>
                  <p className="font-mono text-[11px] text-text-muted mt-1">
                    {digest.item_count} picks · from {digest.total_fetched}
                  </p>
                </div>
                <ArrowRight
                  aria-hidden="true"
                  className="w-3.5 h-3.5 text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0"
                />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Mobile: View archive */}
      <div className="mt-6 text-center md:hidden">
        <Link
          href="/digest"
          className="inline-flex items-center gap-2 px-6 py-3 bg-surface rounded-xl text-text-primary hover:bg-primary/10 transition-all"
        >
          View archive
          <ArrowRight aria-hidden="true" className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
