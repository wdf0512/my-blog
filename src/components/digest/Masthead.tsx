import type { DigestLang } from '@/lib/issues';

const ROMAN: Array<[number, string]> = [
  [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
  [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
  [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
];

/** The Volume numeral is the calendar year; it is unrelated to Issue numbers. */
function toRoman(num: number): string {
  let out = '';
  let n = num;
  for (const [value, symbol] of ROMAN) {
    while (n >= value) {
      out += symbol;
      n -= value;
    }
  }
  return out;
}

type MastheadProps = {
  variant?: 'archive' | 'detail';
  locale?: DigestLang;
  issueCount?: number;
  rightSlot?: React.ReactNode;
};

const COPY = {
  en: {
    wordmark: 'Daily Brief',
    subhead: (vol: string) => `Vol. ${vol} · Auto-curated · Updated every morning`,
    issuesOnFile: (n: number) => `${n} ${n === 1 ? 'issue' : 'issues'} on file`,
  },
  zh: {
    wordmark: '每日简报',
    subhead: (vol: string) => `第 ${vol} 卷 · 自动精选 · 每日清晨更新`,
    issuesOnFile: (n: number) => `共 ${n} 期归档`,
  },
} as const;

export function Masthead({
  variant = 'archive',
  locale = 'en',
  issueCount,
  rightSlot,
}: MastheadProps) {
  const year = new Date().getFullYear();
  const isArchive = variant === 'archive';
  const copy = COPY[locale];

  return (
    <header className="relative">
      <div className="flex items-end justify-between gap-6 flex-wrap">
        <div className="flex-1 min-w-0">
          <h1
            className={`font-display font-black tracking-tighter leading-[0.85] text-text-primary ${
              isArchive ? 'text-6xl md:text-8xl lg:text-9xl' : 'text-3xl md:text-5xl'
            }`}
          >
            {copy.wordmark}
          </h1>
          {isArchive && (
            <p className="digest-mono-eyebrow mt-4">{copy.subhead(toRoman(year))}</p>
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
            <span className="digest-mono-eyebrow shrink-0">{copy.issuesOnFile(issueCount)}</span>
            <div className="h-px w-8 bg-primary/40" />
          </>
        )}
      </div>
    </header>
  );
}
