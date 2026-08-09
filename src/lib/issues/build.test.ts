import { describe, expect, it } from 'vitest';
import { buildIssues, isDigestLang, type DigestRow } from './build';

const NOW = new Date('2026-05-18T09:00:00Z');

function row(
  overrides: Partial<DigestRow> & Pick<DigestRow, 'slug'>
): DigestRow {
  return {
    title: 'Untitled',
    date: '2026-05-16',
    lang: 'en',
    issue_id: '2026-05-16',
    published: true,
    item_count: 3,
    total_fetched: 50,
    body: '<compiled>',
    metadata: { readingTime: 7.4, wordCount: 1500 },
    ...overrides,
  };
}

/** A day in both languages, plus an earlier and a later ZH-only day. */
const CORPUS: DigestRow[] = [
  row({
    slug: 'd-2026-05-15',
    date: '2026-05-15',
    issue_id: '2026-05-15',
    lang: 'zh',
  }),
  row({ slug: 'd-2026-05-16-en', lang: 'en' }),
  row({ slug: 'd-2026-05-16-zh', lang: 'zh' }),
  row({
    slug: 'd-2026-05-18',
    date: '2026-05-18',
    issue_id: '2026-05-18',
    lang: 'zh',
  }),
];

describe('numbering', () => {
  it('gives both languages of one day the same number', () => {
    const issues = buildIssues(CORPUS, NOW);
    const en = issues.find((i) => i.slug === 'd-2026-05-16-en')!;
    const zh = issues.find((i) => i.slug === 'd-2026-05-16-zh')!;

    expect(en.number).toBe(2);
    expect(zh.number).toBe(2);
  });

  it('numbers days chronologically regardless of input order', () => {
    const shuffled = [CORPUS[3], CORPUS[1], CORPUS[0], CORPUS[2]];
    const numbers = Object.fromEntries(
      buildIssues(shuffled, NOW).map((i) => [i.slug, i.number])
    );

    expect(numbers).toEqual({
      'd-2026-05-15': 1,
      'd-2026-05-16-en': 2,
      'd-2026-05-16-zh': 2,
      'd-2026-05-18': 3,
    });
  });

  it('does not skip a number for a day that has only one language', () => {
    expect(
      buildIssues(CORPUS, NOW).find((i) => i.slug === 'd-2026-05-18')!.number
    ).toBe(3);
  });
});

describe('visibility', () => {
  it('excludes unpublished rows', () => {
    const issues = buildIssues(
      [...CORPUS, row({ slug: 'draft', published: false })],
      NOW
    );
    expect(issues.map((i) => i.slug)).not.toContain('draft');
  });

  it('excludes rows with no picks', () => {
    const issues = buildIssues(
      [...CORPUS, row({ slug: 'empty', item_count: 0 })],
      NOW
    );
    expect(issues.map((i) => i.slug)).not.toContain('empty');
  });

  it('does not let an excluded row consume an issue number', () => {
    const withEmpty = [
      row({
        slug: 'empty',
        date: '2026-05-14',
        issue_id: '2026-05-14',
        item_count: 0,
      }),
      ...CORPUS,
    ];
    expect(
      buildIssues(withEmpty, NOW).find((i) => i.slug === 'd-2026-05-15')!.number
    ).toBe(1);
  });
});

describe('neighbours', () => {
  it('stays within one language', () => {
    const zh = buildIssues(CORPUS, NOW).find(
      (i) => i.slug === 'd-2026-05-16-zh'
    )!;

    expect(zh.newer?.href).toBe('/digest/zh/d-2026-05-18');
    expect(zh.older?.href).toBe('/digest/zh/d-2026-05-15');
  });

  it('leaves the ends open', () => {
    const issues = buildIssues(CORPUS, NOW);
    const newest = issues.find((i) => i.slug === 'd-2026-05-18')!;
    const onlyEn = issues.find((i) => i.slug === 'd-2026-05-16-en')!;

    expect(newest.newer).toBeNull();
    expect(onlyEn.newer).toBeNull();
    expect(onlyEn.older).toBeNull();
  });
});

describe('companion', () => {
  it('links the two languages of one day', () => {
    const issues = buildIssues(CORPUS, NOW);
    const en = issues.find((i) => i.slug === 'd-2026-05-16-en')!;

    expect(en.companion?.href).toBe('/digest/zh/d-2026-05-16-zh');
    expect(en.companion?.number).toBe(en.number);
  });

  it('is null for a day published in one language only', () => {
    expect(
      buildIssues(CORPUS, NOW).find((i) => i.slug === 'd-2026-05-18')!.companion
    ).toBeNull();
  });
});

describe('presentation', () => {
  it('localises the label', () => {
    const issues = buildIssues(CORPUS, NOW);

    expect(issues.find((i) => i.slug === 'd-2026-05-16-en')!.label).toBe(
      'Issue Nº02'
    );
    expect(issues.find((i) => i.slug === 'd-2026-05-16-zh')!.label).toBe(
      '第 02 期'
    );
  });

  it('builds the href from language and slug', () => {
    expect(
      buildIssues(CORPUS, NOW).find((i) => i.slug === 'd-2026-05-16-en')!.href
    ).toBe('/digest/en/d-2026-05-16-en');
  });

  it('rounds reading time up to at least one minute', () => {
    const issues = buildIssues(
      [row({ slug: 'brief', metadata: { readingTime: 0.2, wordCount: 40 } })],
      NOW
    );
    expect(issues[0].minutes).toBe(1);
  });

  it('returns Issues newest first', () => {
    expect(buildIssues(CORPUS, NOW).map((i) => i.date)).toEqual([
      '2026-05-18',
      '2026-05-16',
      '2026-05-16',
      '2026-05-15',
    ]);
  });
});

describe('isToday', () => {
  it('is true only for the Issue dated on the given day', () => {
    const flags = Object.fromEntries(
      buildIssues(CORPUS, NOW).map((i) => [i.slug, i.isToday])
    );

    expect(flags['d-2026-05-18']).toBe(true);
    expect(flags['d-2026-05-16-en']).toBe(false);
  });

  it('goes stale rather than lying about a different day', () => {
    const laterNow = new Date('2026-05-19T09:00:00Z');
    expect(buildIssues(CORPUS, laterNow).every((i) => !i.isToday)).toBe(true);
  });
});

describe('isDigestLang', () => {
  it('accepts the published languages and rejects anything else', () => {
    expect(isDigestLang('en')).toBe(true);
    expect(isDigestLang('zh')).toBe(true);
    expect(isDigestLang('fr')).toBe(false);
    expect(isDigestLang('')).toBe(false);
  });
});
