import { MOCK_CONTRIBUTORS } from './services';
import { filterContributors, pageList } from './initiative.utils';

describe('filterContributors', () => {
  it('returns everything for an empty query', () => {
    expect(filterContributors(MOCK_CONTRIBUTORS, '  ').length).toBe(MOCK_CONTRIBUTORS.length);
  });

  it('matches by name, case-insensitively', () => {
    const result = filterContributors(MOCK_CONTRIBUTORS, 'al-harbi');
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((c) => c.name.includes('Al-Harbi'))).toBe(true);
  });

  it('matches by ID', () => {
    expect(filterContributors(MOCK_CONTRIBUTORS, '98765432101').map((c) => c.nnid)).toEqual(['98765432101']);
  });
});

describe('pageList', () => {
  it('lists every page when there are few', () => {
    expect(pageList(1, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it('collapses the middle like the design', () => {
    expect(pageList(1, 10)).toEqual([1, 2, 3, null, 8, 9, 10]);
  });

  it('keeps the neighbours of the current page', () => {
    expect(pageList(6, 12)).toEqual([1, 2, 3, null, 5, 6, 7, null, 10, 11, 12]);
  });
});
