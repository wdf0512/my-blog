import { digests } from '#/.velite';
import { buildIssues, type DigestLang, type Issue } from './build';
import { memoisePerDay } from './memo';

export {
  buildIssues,
  DIGEST_LANGS,
  isDigestLang,
  type DigestLang,
  type Issue,
  type IssueRef,
} from './build';

/** Assembled once per day, however many times the pages ask. */
const allIssues = memoisePerDay((now) => buildIssues(digests, now));

/** Every visible Issue in one language, newest first. */
export function getIssues(lang: DigestLang, now: Date = new Date()): Issue[] {
  return allIssues(now).filter((issue) => issue.lang === lang);
}

/** One Issue, or null when the slug is unknown or not published in this language. */
export function getIssue(
  lang: DigestLang,
  slug: string,
  now: Date = new Date()
): Issue | null {
  return allIssues(now).find((i) => i.lang === lang && i.slug === slug) ?? null;
}
