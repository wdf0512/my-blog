import { digests } from '#/.velite';

export type Digest = (typeof digests)[number];
export type DigestLang = 'en' | 'zh';

export function getPublishedDigests(lang?: DigestLang): Digest[] {
  return digests
    .filter((d) => d.published && d.item_count > 0 && (!lang || d.lang === lang))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/** Issue numbers are keyed by issue_id (date prefix), so EN + ZH for the
 *  same day share an issue number across the bilingual archive. */
export function getIssueNumberMap(published: Digest[]): Map<string, number> {
  const uniqueIssueIds = [...new Set(published.map((d) => d.issue_id))].sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime(),
  );
  const issueByDate = new Map(uniqueIssueIds.map((id, i) => [id, i + 1] as const));
  return new Map(published.map((d) => [d.slug, issueByDate.get(d.issue_id) ?? 0] as const));
}

/** Companion digest in the opposite language for the same issue_id. */
export function findCompanion(digest: Digest): Digest | null {
  const otherLang: DigestLang = digest.lang === 'en' ? 'zh' : 'en';
  return (
    digests.find(
      (d) =>
        d.published &&
        d.item_count > 0 &&
        d.issue_id === digest.issue_id &&
        d.lang === otherLang,
    ) ?? null
  );
}

export function formatLongDate(iso: string, lang: DigestLang = 'en'): string {
  const locale = lang === 'zh' ? 'zh-CN' : 'en-US';
  return new Date(iso).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    timeZone: 'UTC',
  });
}

export function formatShortDate(iso: string, lang: DigestLang = 'en'): string {
  const locale = lang === 'zh' ? 'zh-CN' : 'en-US';
  return new Date(iso).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

export function formatMonoDate(iso: string, lang: DigestLang = 'en'): string {
  const locale = lang === 'zh' ? 'zh-CN' : 'en-US';
  return new Date(iso).toLocaleDateString(locale, {
    month: 'short',
    day: '2-digit',
    timeZone: 'UTC',
  });
}

export function isToday(iso: string): boolean {
  return iso.slice(0, 10) === new Date().toISOString().slice(0, 10);
}

const ROMAN: Array<[number, string]> = [
  [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
  [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
  [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
];

export function toRoman(num: number): string {
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

export function estimateMinutes(wordCount: number): number {
  return Math.max(1, Math.round(wordCount / 220));
}
