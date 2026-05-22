import { describe, it, expect } from 'vitest';
import { daySchema } from '../content/schema';

describe('daySchema', () => {
  it('parses a valid entry with title and date string', () => {
    const result = daySchema.parse({ title: 'Test', date: '2026-04-05' });
    expect(result.title).toBe('Test');
    expect(result.date).toBeInstanceOf(Date);
    expect(result.date.getFullYear()).toBe(2026);
  });

  it('accepts optional photos array', () => {
    const result = daySchema.parse({
      title: 'Test',
      date: '2026-04-05',
      photos: ['folder/img.jpg'],
    });
    expect(result.photos).toEqual(['folder/img.jpg']);
  });

  it('photos defaults to undefined when omitted', () => {
    const result = daySchema.parse({ title: 'Test', date: '2026-04-05' });
    expect(result.photos).toBeUndefined();
  });

  it('rejects missing title', () => {
    expect(() => daySchema.parse({ date: '2026-04-05' })).toThrow();
  });

  it('rejects invalid date string', () => {
    expect(() => daySchema.parse({ title: 'Test', date: 'not-a-date' })).toThrow();
  });
});
