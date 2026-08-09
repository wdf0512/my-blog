/**
 * Assembles Issues from Digest rows.
 *
 * This file deliberately imports nothing generated, so the whole assembly —
 * numbering, the Companion link, neighbours, the visibility rule — can be
 * driven from fixtures without a Velite build. See `./index.ts` for the
 * wiring that feeds it real content.
 */

export type DigestLang = 'en' | 'zh';

/** The languages the brief is published in, in display order. */
export const DIGEST_LANGS = [
  'en',
  'zh',
] as const satisfies readonly DigestLang[];

/** Narrows an untrusted route segment to a language. */
export function isDigestLang(value: string): value is DigestLang {
  return (DIGEST_LANGS as readonly string[]).includes(value);
}

/**
 * The Velite record behind an Issue. Declared structurally rather than derived
 * from `#/.velite` so this module stays importable without a build.
 */
export type DigestRow = {
  slug: string;
  title: string;
  date: string;
  lang: DigestLang;
  issue_id: string;
  published: boolean;
  description?: string;
  item_count: number;
  total_fetched: number;
  cover_image?: string;
  body: string;
  metadata: { readingTime: number; wordCount: number };
};

/** A link to an Issue. Deliberately not an Issue, so the link graph terminates. */
export type IssueRef = {
  number: number;
  numeral: string;
  label: string;
  href: string;
  title: string;
  date: string;
};

export type Issue = {
  number: number;
  /** Zero-padded number for display, e.g. `07`. */
  numeral: string;
  /** Localised, e.g. `Issue Nº07` or `第 07 期`. */
  label: string;
  href: string;
  lang: DigestLang;
  slug: string;
  title: string;
  description?: string;
  date: string;
  dateLong: string;
  dateShort: string;
  dateMono: string;
  cover: string | null;
  minutes: number;
  itemCount: number;
  totalFetched: number;
  isToday: boolean;
  body: string;
  /** The Issue for the same day in the opposite language. */
  companion: IssueRef | null;
  newer: IssueRef | null;
  older: IssueRef | null;
};

const BCP47: Record<DigestLang, string> = { en: 'en-US', zh: 'zh-CN' };

function formatDate(
  iso: string,
  lang: DigestLang,
  options: Intl.DateTimeFormatOptions
): string {
  return new Date(iso).toLocaleDateString(BCP47[lang], {
    ...options,
    timeZone: 'UTC',
  });
}

function numeralOf(number: number): string {
  return String(number).padStart(2, '0');
}

function labelOf(number: number, lang: DigestLang): string {
  const n = numeralOf(number);
  return lang === 'zh' ? `第 ${n} 期` : `Issue Nº${n}`;
}

/** An Issue before its links are attached. */
type IssueCore = Omit<Issue, 'companion' | 'newer' | 'older'>;

type Entry = { row: DigestRow; core: IssueCore };

function toCore(row: DigestRow, number: number, today: string): IssueCore {
  return {
    number,
    numeral: numeralOf(number),
    label: labelOf(number, row.lang),
    href: `/digest/${row.lang}/${row.slug}`,
    lang: row.lang,
    slug: row.slug,
    title: row.title,
    description: row.description,
    date: row.date,
    dateLong: formatDate(row.date, row.lang, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    }),
    dateShort: formatDate(row.date, row.lang, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
    dateMono: formatDate(row.date, row.lang, {
      month: 'short',
      day: '2-digit',
    }),
    cover: row.cover_image ?? null,
    minutes: Math.max(1, Math.round(row.metadata.readingTime)),
    itemCount: row.item_count,
    totalFetched: row.total_fetched,
    isToday: row.date.slice(0, 10) === today,
    body: row.body,
  };
}

function toRef(core: IssueCore): IssueRef {
  return {
    number: core.number,
    numeral: core.numeral,
    label: core.label,
    href: core.href,
    title: core.title,
    date: core.date,
  };
}

/** An Issue is visible when it is published and actually has picks in it. */
function isVisible(row: DigestRow): boolean {
  return row.published && row.item_count > 0;
}

/**
 * Issue numbers are keyed by `issue_id` (the day) and assigned in chronological
 * order across BOTH languages, so the EN and ZH Issues of one day agree.
 * See docs/adr/0001-issue-is-per-language.md.
 */
function numberByIssueId(rows: DigestRow[]): Map<string, number> {
  const ordered = [...new Set(rows.map((r) => r.issue_id))].sort((a, b) =>
    a.localeCompare(b)
  );
  return new Map(ordered.map((id, i) => [id, i + 1] as const));
}

/**
 * Builds every visible Issue, newest first.
 *
 * Numbering runs across languages; neighbours run within a language. Reversing
 * either would make prev/next hop between EN and ZH.
 */
export function buildIssues(rows: readonly DigestRow[], now: Date): Issue[] {
  const visible = rows.filter(isVisible);
  const numbers = numberByIssueId(visible);
  const today = now.toISOString().slice(0, 10);

  const entries: Entry[] = visible
    .map((row) => ({
      row,
      // Safe: every issue_id in `visible` seeded the map above.
      core: toCore(row, numbers.get(row.issue_id)!, today),
    }))
    .sort(
      (a, b) =>
        b.core.date.localeCompare(a.core.date) ||
        a.core.slug.localeCompare(b.core.slug)
    );

  const byLang: Record<DigestLang, Entry[]> = {
    en: entries.filter((e) => e.core.lang === 'en'),
    zh: entries.filter((e) => e.core.lang === 'zh'),
  };

  return entries.map((entry) => {
    const timeline = byLang[entry.core.lang];
    const i = timeline.indexOf(entry);
    const companion = entries.find(
      (other) =>
        other.row.issue_id === entry.row.issue_id &&
        other.core.lang !== entry.core.lang
    );

    return {
      ...entry.core,
      companion: companion ? toRef(companion.core) : null,
      newer: i > 0 ? toRef(timeline[i - 1].core) : null,
      older: i < timeline.length - 1 ? toRef(timeline[i + 1].core) : null,
    };
  });
}
