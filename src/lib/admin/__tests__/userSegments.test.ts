import { describe, expect, it } from 'vitest';
import { hasPaymentIssues } from '../userSegments';
import type { UserPlanInfo } from '../types';

function plan(overrides: Partial<UserPlanInfo>): UserPlanInfo {
  return {
    displayName: 'Pro',
    filterKey: 'professional',
    subStatus: 'active',
    endDate: null,
    trialEndDate: null,
    trialStartDate: null,
    hasFailedInvoice: false,
    maxProducts: 2000,
    planPrice: 9,
    hasPaymentInfo: true,
    isPayingCustomer: true,
    isRevenueCustomer: true,
    isActiveTrial: false,
    missingPaymentInfo: false,
    ...overrides,
  };
}

describe('hasPaymentIssues', () => {
  it('includes missing payment info', () => {
    expect(hasPaymentIssues(plan({ missingPaymentInfo: true }))).toBe(true);
  });

  it('includes past_due', () => {
    expect(hasPaymentIssues(plan({ subStatus: 'past_due' }))).toBe(true);
  });

  it('includes failed invoice', () => {
    expect(hasPaymentIssues(plan({ hasFailedInvoice: true }))).toBe(true);
  });

  it('returns false for healthy paying customer', () => {
    expect(hasPaymentIssues(plan({}))).toBe(false);
  });
});
