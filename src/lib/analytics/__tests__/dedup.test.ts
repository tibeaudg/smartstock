import { describe, it, expect, beforeEach } from 'vitest';
import {
  shouldDedupe,
  buildIdempotencyKey,
  shouldDebounceRoute,
  resetDedupForTests,
} from '../dedup';

describe('analytics dedup', () => {
  beforeEach(() => {
    resetDedupForTests();
  });

  it('dedupes identical idempotency keys', () => {
    const key = buildIdempotencyKey(['sess', 'route_viewed', '/dashboard']);
    expect(shouldDedupe(key)).toBe(false);
    expect(shouldDedupe(key)).toBe(true);
  });

  it('debounces route within window', () => {
    expect(shouldDebounceRoute('s1', '/dashboard')).toBe(false);
    expect(shouldDebounceRoute('s1', '/dashboard')).toBe(true);
  });

  it('allows different routes', () => {
    expect(shouldDebounceRoute('s1', '/a')).toBe(false);
    expect(shouldDebounceRoute('s1', '/b')).toBe(false);
  });
});
