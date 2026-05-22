import { toRoman } from '@/lib/digests';

type MastheadProps = {
  variant?: 'archive' | 'detail';
  issueCount?: number;
  rightSlot?: React.ReactNode;
};

export function Masthead({ variant = 'archive', issueCount, rightSlot }: MastheadProps) {
  const year = new Date().getFullYear();
  const isArchive = variant === 'archive';

  return (
    <header className="relative">
      <div className="flex items-end justify-between gap-6 flex-wrap">
        <div className="flex-1 min-w-0">
          <h1
            className={`font-display font-black tracking-tighter leading-[0.85] text-text-primary ${
              isArchive ? 'text-6xl md:text-8xl lg:text-9xl' : 'text-3xl md:text-5xl'
            }`}
          >
            Daily Brief
          </h1>
          {isArchive && (
            <p className="digest-mono-eyebrow mt-4">
              Vol. {toRoman(year)} · Auto-curated · Updated every morning
            </p>
          )}
        </div>
        {rightSlot && (
          <div className="flex items-center gap-3 pb-1.5 shrink-0">{rightSlot}</div>
        )}
      </div>

      <div className="mt-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-primary/60" />
        <span className="digest-mono-eyebrow text-primary">§</span>
        <div className="h-px flex-1 bg-primary/60" />
        {issueCount !== undefined && (
          <>
            <span className="digest-mono-eyebrow shrink-0">
              {issueCount} {issueCount === 1 ? 'issue' : 'issues'} on file
            </span>
            <div className="h-px w-8 bg-primary/40" />
          </>
        )}
      </div>
    </header>
  );
}
