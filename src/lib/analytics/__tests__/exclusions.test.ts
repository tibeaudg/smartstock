import { describe, expect, it } from 'vitest';
import {
  isAdminAnalyticsPath,
  shouldExcludeFromProductAnalytics,
} from '../exclusions';

describe('analytics exclusions', () => {
  it('detects admin paths', () => {
    expect(isAdminAnalyticsPath('/admin')).toBe(true);
    expect(isAdminAnalyticsPath('/admin/users')).toBe(true);
    expect(isAdminAnalyticsPath('/dashboard')).toBe(false);
  });

  it('excludes owner and admin paths', () => {
    expect(shouldExcludeFromProductAnalytics({ isOwner: true, pathname: '/dashboard' })).toBe(
      true,
    );
    expect(shouldExcludeFromProductAnalytics({ isOwner: false, pathname: '/admin' })).toBe(
      true,
    );
    expect(
      shouldExcludeFromProductAnalytics({ isOwner: false, pathname: '/dashboard/products' }),
    ).toBe(false);
  });
});
