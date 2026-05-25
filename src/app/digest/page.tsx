import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import {
  getPublishedDigests,
  getIssueNumberMap,
  formatShortDate,
  isToday,
} from '@/lib/digests';
import { Masthead } from '@/components/digest/Masthead';

export const metadata = {
  title: 'Daily Brief — Archive',
  description: 'Auto-curated daily digest of what matters in AI, updated every morning.',
};

export default function DigestArchivePage() {
  const published = getPublishedDigests();
  const issueBySlug = getIssueNumberMap(published);

  const featured = published[0];
  const archive = published.slice(1);

  return (
    <div className="container mx-auto px-4 pt-12 pb-20 md:pt-16 md:pb-28 max-w-6xl">
      <Masthead variant="archive" issueCount={published.length} />

      {published.length === 0 ? (
        <div className="mt-24 text-center">
          <p className="digest-mono-eyebrow text-text-muted">No issues on file</p>
          <p className="font-display text-2xl mt-3 text-text-primary">
            Check back tomorrow.
          </p>
        </div>
      ) : (
        <>
          {/* Latest-issue feature card */}
          {featured && (
            <FeatureCard
              digest={featured}
              issueNumber={issueBySlug.get(featured.slug) ?? published.length}
            />
          )}

          {/* Tear-sheet archive grid */}
          {archive.length > 0 && (
            <>
              <h2 className="digest-mono-eyebrow text-text-secondary mt-20 mb-6">
                The Archive · Older Issues
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {archive.map((digest) => (
                  <TearSheet
                    key={digest.slug}
                    digest={digest}
                    issueNumber={issueBySlug.get(digest.slug) ?? 0}
                  />
                ))}
              </div>
            </>
          )}

          {/* Colophon */}
          <div className="mt-24">
            <div className="digest-ornament" aria-hidden="true">
              ✦
            </div>
            <p className="digest-mono-eyebrow text-center text-text-muted">
              Briefs are auto-curated each morning from ~50 sources
              <span className="mx-2 opacity-50">·</span>
              Issue №{String(published.length).padStart(2, '0')} is the latest
            </p>
          </div>
        </>
      )}
    </div>
  );
}

type CardProps = {
  digest: {
    slug: string;
    title: string;
    date: string;
    item_count: number;
    total_fetched: number;
    description?: string;
    cover_image?: string;
  };
  issueNumber: number;
};

function FeatureCard({ digest, issueNumber }: CardProps) {
  const todayFlag = isToday(digest.date);

  return (
    <Link
      href={`/digest/${digest.slug}`}
      className="group relative mt-12 block overflow-hidden rounded-3xl bg-[#0d0c0b] shadow-lg hover:shadow-2xl transition-shadow duration-500 isolate min-h-[460px] md:min-h-[520px] md:aspect-[16/9]"
    >
      {/* Background — cover image or tonal gradient fallback */}
      {digest.cover_image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={digest.cover_image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#22170f] via-[#0d0c0b] to-[#0a0d10]" />
      )}

      {/* Warm tonal wash to unify any cover with the brand palette */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-br from-[#0d0c0b]/0 via-[#0d0c0b]/0 to-[#0d0c0b]/35 mix-blend-multiply"
      />

      {/* Paper-grain noise */}
      <div className="paper-grain absolute inset-0" aria-hidden="true" />

      {/* Big print-bleed numeral, ghosted into the image */}
      <span
        aria-hidden="true"
        className="absolute -top-6 right-2 md:right-6 font-display font-black tracking-tighter leading-none text-white/[0.08] text-[12rem] md:text-[18rem] select-none pointer-events-none"
      >
        {String(issueNumber).padStart(2, '0')}
      </span>

      {/* Top-left badge */}
      <div className="absolute top-6 left-6 md:top-7 md:left-7 z-10 flex items-center gap-2">
        <span className="font-mono uppercase text-[10px] tracking-[0.2em] bg-primary text-[#0d0c0b] px-2.5 py-1 rounded-md font-bold">
          {todayFlag ? "Today's Issue" : 'Latest Issue'}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">
          № {String(issueNumber).padStart(2, '0')}
        </span>
      </div>

      {/* Bottom mask — gradient from deep ink up to transparent, holding the type */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[72%] bg-gradient-to-t from-[#0a0908] via-[#0a0908]/85 via-45% to-transparent"
      />

      {/* Type stack at the bottom */}
      <div className="absolute inset-x-0 bottom-0 z-10 p-6 md:p-9">
        <p className="font-mono uppercase text-[11px] tracking-[0.22em] text-white/65 mb-3">
          Issue Nº{String(issueNumber).padStart(2, '0')}
          <span className="mx-2 opacity-50">·</span>
          {formatShortDate(digest.date)}
        </p>

        <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-black text-white leading-[0.98] tracking-tight max-w-[22ch] group-hover:text-primary transition-colors duration-300">
          {digest.title}
        </h2>

        {digest.description && (
          <p className="mt-4 text-white/70 text-sm md:text-base italic leading-relaxed line-clamp-2 max-w-prose">
            {digest.description}
          </p>
        )}

        <div className="mt-6 md:mt-8 pt-4 border-t border-white/15 flex items-center justify-between gap-4">
          <span className="font-mono text-[11px] md:text-xs text-white/60">
            {digest.item_count} picks · curated from {digest.total_fetched}
          </span>
          <span className="inline-flex items-center gap-1.5 text-primary font-bold text-sm">
            Read the issue
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

function TearSheet({ digest, issueNumber }: CardProps) {
  const todayFlag = isToday(digest.date);

  return (
    <Link
      href={`/digest/${digest.slug}`}
      className="group relative block overflow-hidden rounded-2xl bg-[#0d0c0b] shadow-md hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-500 isolate min-h-[280px] md:min-h-[300px] aspect-[4/3] md:aspect-[5/4]"
    >
      {/* Background — cover image or tonal gradient fallback */}
      {digest.cover_image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={digest.cover_image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#1c1208] via-[#0d0c0b] to-[#0a0d10]" />
      )}

      {/* Warm tonal wash */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-br from-[#0d0c0b]/0 via-[#0d0c0b]/0 to-[#0d0c0b]/40 mix-blend-multiply"
      />

      {/* Paper-grain noise */}
      <div className="paper-grain absolute inset-0" aria-hidden="true" />

      {/* Ghost issue numeral, scaled smaller than feature */}
      <span
        aria-hidden="true"
        className="absolute -top-3 right-1 md:right-3 font-display font-black tracking-tighter leading-none text-white/[0.07] text-[7rem] md:text-[9rem] select-none pointer-events-none"
      >
        {String(issueNumber).padStart(2, '0')}
      </span>

      {/* Top-left badge — smaller than feature */}
      <div className="absolute top-4 left-4 md:top-5 md:left-5 z-10 flex items-center gap-2">
        {todayFlag && (
          <span className="font-mono uppercase text-[9px] tracking-[0.2em] bg-primary text-[#0d0c0b] px-2 py-0.5 rounded-md font-bold">
            Today
          </span>
        )}
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/55">
          № {String(issueNumber).padStart(2, '0')}
        </span>
      </div>

      {/* Bottom mask */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[68%] bg-gradient-to-t from-[#0a0908] via-[#0a0908]/82 via-45% to-transparent"
      />

      {/* Type stack at the bottom */}
      <div className="absolute inset-x-0 bottom-0 z-10 p-5 md:p-6">
        <p className="font-mono uppercase text-[10px] tracking-[0.22em] text-white/65 mb-2">
          Issue Nº{String(issueNumber).padStart(2, '0')}
          <span className="mx-2 opacity-50">·</span>
          {formatShortDate(digest.date)}
        </p>

        <h3 className="font-display text-lg md:text-2xl font-black text-white leading-[1.05] tracking-tight line-clamp-2 max-w-[22ch] group-hover:text-primary transition-colors duration-300">
          {digest.title}
        </h3>

        <div className="mt-4 pt-3 border-t border-white/12 flex items-center justify-between gap-3">
          <span className="font-mono text-[10px] md:text-[11px] text-white/55">
            {digest.item_count} picks · from {digest.total_fetched}
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
