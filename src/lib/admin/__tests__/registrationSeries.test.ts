import { describe, expect, it } from 'vitest';
import { trimSparseBuckets, type RegistrationBucket } from '../registrationSeries';

describe('trimSparseBuckets', () => {
  it('trims leading and trailing empty buckets with padding', () => {
    const buckets: RegistrationBucket[] = [
      { label: '', tooltip: 'a', trial: 0, paid: 0, free: 0, priorTotal: 0, total: 0 },
      { label: '', tooltip: 'b', trial: 0, paid: 0, free: 0, priorTotal: 0, total: 0 },
      { label: '1', tooltip: 'c', trial: 1, paid: 0, free: 0, priorTotal: 0, total: 1 },
      { label: '2', tooltip: 'd', trial: 2, paid: 1, free: 0, priorTotal: 0, total: 3 },
      { label: '', tooltip: 'e', trial: 0, paid: 0, free: 0, priorTotal: 0, total: 0 },
      { label: '', tooltip: 'f', trial: 0, paid: 0, free: 0, priorTotal: 0, total: 0 },
    ];
    const trimmed = trimSparseBuckets(buckets);
    expect(trimmed.length).toBe(4);
    expect(trimmed[0].total).toBe(0);
    expect(trimmed[trimmed.length - 1].total).toBe(0);
    expect(trimmed.some((b) => b.total === 3)).toBe(true);
  });

  it('returns all buckets when none have data', () => {
    const buckets: RegistrationBucket[] = [
      { label: 'a', tooltip: 'a', trial: 0, paid: 0, free: 0, priorTotal: 0, total: 0 },
    ];
    expect(trimSparseBuckets(buckets)).toEqual(buckets);
  });
});
