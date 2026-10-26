import { Contributor } from './initiative.models';

/** Matches by name (case-insensitive) or ID / Iqama number. */
export function filterContributors(list: readonly Contributor[], query: string): readonly Contributor[] {
  const q = query.trim().toLowerCase();
  if (!q) return list;
  return list.filter((c) => c.name.toLowerCase().includes(q) || c.nnid.includes(q));
}

/**
 * Page numbers to show in the pager, with `null` marking a gap,
 * e.g. pageList(1, 10) → [1, 2, 3, null, 8, 9, 10].
 */
export function pageList(current: number, total: number): (number | null)[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const candidates = [1, 2, 3, current - 1, current, current + 1, total - 2, total - 1, total];
  const pages = [...new Set(candidates.filter((p) => p >= 1 && p <= total))].sort((a, b) => a - b);

  const result: (number | null)[] = [];
  pages.forEach((p, i) => {
    if (i > 0 && p - pages[i - 1] > 1) result.push(null);
    result.push(p);
  });
  return result;
}
