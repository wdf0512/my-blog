import { digests } from '#/.velite';
import Link from 'next/link';

export const metadata = {
  title: 'Daily Brief',
  description: 'Auto-curated daily digest of what matters in AI, updated every morning.',
};

export default function DigestPage() {
  const published = digests
    .filter((d) => d.published && d.item_count > 0)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const featured = published[0];
  const archive = published.slice(1);

  return (
    <div className="container mx-auto px-4 py-12 md:py-16 max-w-6xl">
      {/* Header */}
      <div className="mb-12">
        <h1 className="font-display text-5xl md:text-6xl font-black mb-3 text-text-primary">
          Daily Brief
        </h1>
        <p className="text-text-secondary text-xl">
          Auto-curated, updated every morning
        </p>
      </div>

      {published.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-text-secondary text-lg">No issues yet — check back tomorrow.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Featured — latest issue */}
          {featured && <FeaturedCard digest={featured} />}

          {/* Archive grid */}
          {archive.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {archive.map((digest) => (
                <ArchiveCard key={digest.slug} digest={digest} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

type DigestCardProps = {
  digest: {
    slug: string;
    title: string;
    date: string;
    item_count: number;
  };
};

function FeaturedCard({ digest }: DigestCardProps) {
  const d = new Date(digest.date);
  const dateLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <Link
      href={`/digest/${digest.slug}`}
      className="group block rounded-3xl overflow-hidden bg-[#1C1B19] border border-white/5 hover:border-primary/30 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
    >
      {/* Gradient pocket */}
      <div
        className="relative h-36 md:h-44 flex items-end p-5"
        style={{ background: 'linear-gradient(135deg, #1a3a5c 0%, #0d2035 60%, #0d251a 100%)' }}
      >
        <span className="absolute top-4 left-5 px-3 py-1 rounded-lg bg-primary text-background text-xs font-black tracking-wide">
          TODAY'S PICKS
        </span>
        <span className="absolute top-4 right-5 text-white/30 text-xs font-medium">
          {dateLabel}
        </span>
        <h2 className="font-display text-2xl md:text-3xl font-black text-white leading-snug line-clamp-2 group-hover:text-primary/90 transition-colors">
          {digest.title}
        </h2>
      </div>

      {/* Body */}
      <div className="px-5 py-4 flex items-center justify-between">
        <span className="text-primary text-sm font-bold">
          {digest.item_count} picks
        </span>
        <span className="text-white/40 text-sm font-semibold group-hover:text-primary group-hover:translate-x-1 transition-all">
          Read →
        </span>
      </div>
    </Link>
  );
}

function ArchiveCard({ digest }: DigestCardProps) {
  const d = new Date(digest.date);
  const day = String(d.getDate()).padStart(2, '0');
  const dateLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <Link
      href={`/digest/${digest.slug}`}
      className="group flex items-center gap-4 rounded-2xl overflow-hidden bg-[#1C1B19] border border-white/5 hover:border-primary/20 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 px-5 py-4"
    >
      <span className="font-display text-4xl font-black text-white/10 group-hover:text-primary/20 transition-colors flex-shrink-0 leading-none w-12 text-center">
        {day}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-white/40 mb-1">{dateLabel}</p>
        <h3 className="font-display text-sm font-black text-white line-clamp-1 group-hover:text-primary/90 transition-colors leading-snug">
          {digest.title}
        </h3>
      </div>
      <span className="text-white/30 text-xs font-semibold flex-shrink-0">
        {digest.item_count} picks
      </span>
    </Link>
  );
}
