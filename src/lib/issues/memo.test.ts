import { describe, expect, it } from 'vitest';
import { memoisePerDay } from './memo';

describe('memoisePerDay', () => {
  it('builds once for repeated calls on the same day', () => {
    let builds = 0;
    const get = memoisePerDay((now: Date) => {
      builds += 1;
      return now.toISOString().slice(0, 10);
    });

    get(new Date('2026-05-16T01:00:00Z'));
    get(new Date('2026-05-16T23:00:00Z'));

    expect(builds).toBe(1);
  });

  it('keeps an earlier day, so two days do not evict each other', () => {
    let builds = 0;
    const get = memoisePerDay((now: Date) => {
      builds += 1;
      return now.toISOString().slice(0, 10);
    });

    get(new Date('2026-05-16T09:00:00Z'));
    get(new Date('2026-05-18T09:00:00Z'));
    get(new Date('2026-05-16T09:00:00Z'));

    expect(builds).toBe(2);
  });
});
