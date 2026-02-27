import { describe, expect, it } from 'vitest';
import { formatAddedTimestamp } from './time';

describe('formatAddedTimestamp', () => {
  const now = new Date('2026-02-27T12:00:00.000Z').getTime();

  it('formats short ranges correctly', () => {
    expect(formatAddedTimestamp('2026-02-27T11:59:40.000Z', now)).toBe('Added just now');
    expect(formatAddedTimestamp('2026-02-27T11:30:00.000Z', now)).toBe('Added 30 min ago');
    expect(formatAddedTimestamp('2026-02-27T10:00:00.000Z', now)).toBe('Added 2 hours ago');
  });

  it('formats day and week ranges correctly', () => {
    expect(formatAddedTimestamp('2026-02-26T11:59:00.000Z', now)).toBe('Added yesterday');
    expect(formatAddedTimestamp('2026-02-24T12:00:00.000Z', now)).toBe('Added 3 days ago');
    expect(formatAddedTimestamp('2026-02-10T12:00:00.000Z', now)).toMatch(/^Added [A-Z][a-z]{2} \d{1,2}$/);
  });
});
