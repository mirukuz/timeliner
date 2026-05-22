import { describe, it, expect } from 'vitest';
import { sortByDateDesc } from './content';

describe('sortByDateDesc', () => {
  it('sorts entries newest first', () => {
    const entries = [
      { data: { title: 'Old', date: new Date('2026-01-01') } },
      { data: { title: 'New', date: new Date('2026-06-01') } },
      { data: { title: 'Mid', date: new Date('2026-03-01') } },
    ];
    const sorted = sortByDateDesc(entries);
    expect(sorted[0].data.title).toBe('New');
    expect(sorted[1].data.title).toBe('Mid');
    expect(sorted[2].data.title).toBe('Old');
  });

  it('does not mutate the input array', () => {
    const entries = [
      { data: { title: 'A', date: new Date('2026-01-01') } },
      { data: { title: 'B', date: new Date('2026-06-01') } },
    ];
    sortByDateDesc(entries);
    expect(entries[0].data.title).toBe('A');
  });

  it('handles a single entry', () => {
    const entries = [{ data: { title: 'Only', date: new Date('2026-04-05') } }];
    expect(sortByDateDesc(entries)).toHaveLength(1);
  });
});
