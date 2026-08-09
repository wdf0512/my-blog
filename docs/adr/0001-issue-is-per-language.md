# Issue is per-language, and two Issues share a number

An Issue is the daily brief for one *language* on one day, not the day itself — so the EN and ZH Issues of 16 May 2026 are two Issues carrying the same Issue number. The number is assigned per `issue_id` (the day) across both languages, which is why it appears twice.

## Considered options

**Issue = the day, holding both languages** (`issue.byLang[locale]`) is ontologically cleaner: the number would belong to exactly one object. It was rejected because every caller renders exactly one language at a time — the archive lists one language, the detail page renders one, `DailyBrief` is EN-only — so that model forces each of them to reach through `byLang[locale]` and handle the missing-language case. Most days have only one language, so that case is the common path, not the edge. The point of the module is to stop pages deriving; per-day would have handed them a new derivation.

## Consequences

- `getIssues(lang)` returns exactly what a page renders. No unwrapping.
- Two records legitimately share `number`. This is not a bug and should not be "fixed".
- Numbering must be computed **across** languages (grouped by `issue_id`) while neighbours are computed **within** a language. Reversing either produces prev/next links that hop between languages, or EN and ZH disagreeing about which Issue number a day is.
- The Companion is reachable as `issue.companion`, an `IssueRef` rather than a full `Issue`, so the link graph terminates.
