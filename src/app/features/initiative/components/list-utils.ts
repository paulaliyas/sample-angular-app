/**
 * Helpers that keep the paginated tables fast with large lists.
 * Template getters run on every change detection (each click and keystroke),
 * so the filtering work is cached until one of its inputs actually changes.
 */

/** Wraps fn so it only recomputes when an argument changes (compared with ===). */
export function memoize<A extends unknown[], R>(fn: (...args: A) => R): (...args: A) => R {
  let lastArgs: A | null = null;
  let lastResult!: R;
  return (...args: A): R => {
    if (!lastArgs || args.length !== lastArgs.length || args.some((arg, i) => arg !== lastArgs![i])) {
      lastArgs = args;
      lastResult = fn(...args);
    }
    return lastResult;
  };
}

/** Case-insensitive search on a contributor's name or ID. An empty search matches everything. */
export function matchesSearch(person: { name: string; nnid: string }, text: string): boolean {
  return !text || person.name.toLowerCase().includes(text) || person.nnid.includes(text);
}

/**
 * A Set view of an id array, rebuilt only when the array is replaced.
 * The components always replace selectedIds instead of mutating it, so the cache stays correct.
 */
export function idSet(): (ids: string[]) => Set<string> {
  return memoize((ids: string[]) => new Set(ids));
}
