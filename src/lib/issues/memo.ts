/**
 * Memoises a build keyed by the UTC day of the clock reading it was given.
 *
 * Issues change only when the day does, so a page that asks several times
 * pays for the assembly once.
 */
export function memoisePerDay<T>(build: (now: Date) => T): (now: Date) => T {
  // One slot per day rather than one slot overall: the slot is shared by every
  // caller, so a single call for another day would otherwise evict the build
  // that all the others are using.
  const cached = new Map<string, T>();

  return (now) => {
    const day = now.toISOString().slice(0, 10);
    if (!cached.has(day)) {
      cached.set(day, build(now));
    }
    return cached.get(day)!;
  };
}
