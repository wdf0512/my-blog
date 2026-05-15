import { digests } from '#/.velite';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function DailyBrief() {
  const published = digests
    .filter((d) => d.published && d.item_count > 0)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (published.length === 0) return null;

  const featured = published[0];
  const recents = published.slice(1, 4);

  const featuredDate = new Date(featured.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  const isToday = featured.date.slice(0, 10) === new Date().toISOString().slice(0, 10);

  return (
    <section className="container mx-auto px-4 py-16 md:py-20 max-w-6xl">
      {/* Section header */}
      <div className="flex items-center justify-between mb-10">
        <h2 className="font-display text-4xl md:text-5xl font-black text-text-primary">
          Daily Brief
        </h2>
        <Link
          href="/digest"
          className="hidden md:inline-flex items-center gap-2 text-text-secondary hover:text-primary transition-colors group"
        >
          View archive
          <ArrowRight aria-hidden="true" className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* 2-col layout */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Left: featured today */}
        <Link
          href={`/digest/${featured.slug}`}
          className="md:col-span-3 group block rounded-3xl overflow-hidden bg-[#1C1B19] border border-white/5 hover:border-primary/30 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
        >
          <div
            className="relative h-40 flex items-end p-5"
            style={{ background: 'linear-gradient(135deg, #1a3a5c 0%, #0d2035 60%, #0d251a 100%)' }}
          >
            <span className="absolute top-4 left-5 px-3 py-1 rounded-lg bg-primary text-background text-xs font-black tracking-wide">
              {isToday ? "TODAY'S PICKS" : 'LATEST ISSUE'}
            </span>
            <h3 className="font-display text-xl md:text-2xl font-black text-white leading-snug line-clamp-2 group-hover:text-primary/90 transition-colors">
              {featured.title}
            </h3>
          </div>
          <div className="px-5 py-4 flex items-center justify-between">
            <span className="text-white/40 text-xs">{featuredDate}</span>
            <span className="text-primary text-sm font-bold">
              {featured.item_count} picks →
            </span>
          </div>
        </Link>

        {/* Right: recent strip */}
        <div className="md:col-span-2 flex flex-col gap-3">
          {recents.map((digest) => {
            const d = new Date(digest.date);
            const day = String(d.getUTCDate()).padStart(2, '0');
            const month = d.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' });

            return (
              <Link
                key={digest.slug}
                href={`/digest/${digest.slug}`}
                className="group flex items-center gap-4 rounded-2xl bg-surface border border-border hover:border-primary/30 hover:bg-primary/5 px-4 py-3.5 transition-all duration-200"
              >
                <div className="flex-shrink-0 text-center w-10">
                  <span className="font-display text-2xl font-black text-primary/60 group-hover:text-primary transition-colors leading-none block">
                    {day}
                  </span>
                  <span className="text-[9px] text-text-muted font-medium uppercase tracking-wide">
                    {month}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display text-sm font-black text-text-primary line-clamp-1 group-hover:text-primary transition-colors leading-snug">
                    {digest.title}
                  </p>
                  <p className="text-xs text-text-muted mt-0.5">{digest.item_count} picks</p>
                </div>
                <ArrowRight aria-hidden="true" className="w-3.5 h-3.5 text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0" />
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
