import { digests } from '#/.velite';

export type Digest = (typeof digests)[number];

export function getPublishedDigests(): Digest[] {
  return digests
    .filter((d) => d.published && d.item_count > 0)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getIssueNumberMap(published: Digest[]): Map<string, number> {
  return new Map(
    [...published]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((d, i) => [d.slug, i + 1] as const),
  );
}

export function formatLongDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    timeZone: 'UTC',
  });
}

export function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

export function formatMonoDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
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
