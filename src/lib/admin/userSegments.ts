import type { UserAnalyticsSnapshot } from '@/hooks/useUserAnalyticsSnapshots';
import type { UserPlanInfo, UserProfile } from './types';
import { calculateActivityStatus } from './userActivity';

export function hasPaymentIssues(plan: UserPlanInfo): boolean {
  return plan.missingPaymentInfo || plan.subStatus === 'past_due' || plan.hasFailedInvoice;
}

export function isChurnRisk(
  user: UserProfile,
  plan: UserPlanInfo,
): boolean {
  const activity = calculateActivityStatus(user.last_login ?? null, user.created_at);
  return activity.days >= 3 && plan.subStatus === 'active';
}

export function isTrialExpiringWithin48h(plan: UserPlanInfo, now = new Date()): boolean {
  if (plan.subStatus !== 'trial' || !plan.trialEndDate) return false;
  const end = new Date(plan.trialEndDate);
  const in48h = new Date(now.getTime() + 48 * 60 * 60 * 1000);
  return end <= in48h && end > now;
}

export function hasRecentErrors(
  userId: string,
  snap: UserAnalyticsSnapshot | undefined,
  userIdsWithRecentErrors: Set<string>,
): boolean {
  return !!snap?.hitErrorsRecent || userIdsWithRecentErrors.has(userId);
}

export function matchesQuickFilter(
  user: UserProfile,
  filter: string,
  plan: UserPlanInfo,
  snap: UserAnalyticsSnapshot | undefined,
  userIdsWithRecentErrors: Set<string>,
  openChatCount: number,
  productCount: number,
): boolean {
  if (filter === 'all') return true;
  if (filter === 'blocked') return !!user.blocked;
  if (filter === 'active') {
    return calculateActivityStatus(user.last_login ?? null, user.created_at).isActive;
  }
  if (filter === 'inactive') {
    const activity = calculateActivityStatus(user.last_login ?? null, user.created_at);
    return activity.days >= 7 && productCount === 0;
  }
  if (filter === 'never-logged-in') return !user.last_login;
  if (filter === 'at-risk') return isChurnRisk(user, plan);
  if (filter === 'trialing') return plan.isActiveTrial;
  if (filter === 'paying') return plan.isRevenueCustomer;
  if (filter === 'has-open-chat') return openChatCount > 0;
  if (filter === 'has-recent-errors' || filter === 'hit-errors') {
    return hasRecentErrors(user.id, snap, userIdsWithRecentErrors);
  }
  if (filter === 'payment-issues') return hasPaymentIssues(plan);
  if (filter === 'stuck-onboarding') return !!snap?.stuckOnboarding;
  if (filter === 'failed-import') return !!snap?.failedImportRecent;
  return true;
}
