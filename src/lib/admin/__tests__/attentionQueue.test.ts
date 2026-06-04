import { describe, expect, it } from 'vitest';
import { buildAttentionQueue } from '../attentionQueue';
import type { UserPlanInfo, UserProfile } from '../types';

const now = new Date('2026-06-04T12:00:00Z');

function user(id: string, email: string, overrides: Partial<UserProfile> = {}): UserProfile {
  return {
    id,
    email,
    first_name: null,
    last_name: null,
    role: 'user',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    selected_plan: null,
    blocked: false,
    last_login: '2026-05-01T00:00:00Z',
    ...overrides,
  };
}

function planMap(entry: Record<string, Partial<UserPlanInfo>>): Record<string, UserPlanInfo> {
  const base: UserPlanInfo = {
    displayName: 'Pro',
    filterKey: 'professional',
    subStatus: 'active',
    endDate: null,
    trialEndDate: null,
    trialStartDate: null,
    hasFailedInvoice: false,
    maxProducts: 2000,
    planPrice: 29,
    hasPaymentInfo: true,
    isPayingCustomer: true,
    isRevenueCustomer: true,
    isActiveTrial: false,
    missingPaymentInfo: false,
  };
  const map: Record<string, UserPlanInfo> = {};
  for (const [id, p] of Object.entries(entry)) {
    map[id] = { ...base, ...p };
  }
  return map;
}

describe('buildAttentionQueue', () => {
  it('sorts by MRR at risk descending', () => {
    const users = [user('a', 'a@test.com'), user('b', 'b@test.com')];
    const queue = buildAttentionQueue({
      users,
      subUserParentMap: {},
      subscriptionPlanMap: planMap({
        a: { missingPaymentInfo: true, planPrice: 9 },
        b: { missingPaymentInfo: true, planPrice: 59 },
      }),
      analyticsSnapshots: new Map(),
      userIdsWithRecentErrors: new Set(),
      now,
    });
    expect(queue[0].userId).toBe('b');
    expect(queue[0].mrrAtRisk).toBe(59);
  });

  it('excludes sub-users', () => {
    const users = [user('sub', 'sub@test.com')];
    const queue = buildAttentionQueue({
      users,
      subUserParentMap: { sub: 'parent' },
      subscriptionPlanMap: planMap({ sub: { missingPaymentInfo: true } }),
      analyticsSnapshots: new Map(),
      userIdsWithRecentErrors: new Set(),
      now,
    });
    expect(queue).toHaveLength(0);
  });
});
