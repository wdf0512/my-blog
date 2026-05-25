import Link from 'next/link';
import type { DigestLang } from '@/lib/digests';

type Props = {
  locale: DigestLang;
  variant: 'archive' | 'detail';
  /** Detail-only: link to the same-issue companion in the other language. */
  companionHref?: string | null;
};

const LABELS: Record<DigestLang, string> = { en: 'EN', zh: '中文' };

export function LocaleToggle({ locale, variant, companionHref }: Props) {
  const otherLang: DigestLang = locale === 'en' ? 'zh' : 'en';

  // Detail variant: the inactive side links to the companion issue when present,
  // otherwise renders as disabled.
  const otherHref =
    variant === 'archive' ? `/digest/${otherLang}` : (companionHref ?? null);

  return (
    <div
      role="group"
      aria-label="Language"
      className="inline-flex items-center rounded-full border border-border bg-surface/60 backdrop-blur-sm p-0.5 text-[11px] font-mono uppercase tracking-[0.18em] shrink-0"
    >
      <ActiveChip label={LABELS[locale]} />
      {otherHref ? (
        <Link
          href={otherHref}
          className="px-3 py-1.5 rounded-full text-text-muted hover:text-text-primary transition-colors"
        >
          {LABELS[otherLang]}
        </Link>
      ) : (
        <span
          aria-disabled="true"
          title={
            otherLang === 'en'
              ? 'English version not available'
              : '暂无中文版本'
          }
          className="px-3 py-1.5 rounded-full text-text-muted/40 cursor-not-allowed line-through"
        >
          {LABELS[otherLang]}
        </span>
      )}
    </div>
  );
}

function ActiveChip({ label }: { label: string }) {
  return (
    <span className="px-3 py-1.5 rounded-full bg-primary text-[#0d0c0b] font-bold">
      {label}
    </span>
  );
}
