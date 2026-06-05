import type { UserAnalyticsSnapshot } from '@/hooks/useUserAnalyticsSnapshots';
import type { AttentionQueueItem, AttentionReason, UserPlanInfo, UserProfile } from './types';
import { getPlanForUser } from './plans';
import { calculateActivityStatus } from './userActivity';
import {
  hasPaymentIssues,
  hasRecentErrors,
  isChurnRisk,
  isTrialExpiringWithin48h,
} from './userSegments';

const REASON_LABELS: Record<AttentionReason, string> = {
  churn_risk: 'Churn risk',
  no_payment_method: 'No payment method',
  stuck_onboarding: 'Stuck onboarding',
  recent_errors: 'Recent errors',
  trial_expiring: 'Trial expiring',
  billing_risk: 'Billing issue',
};

export function getAttentionReasonLabel(reason: AttentionReason): string {
  return REASON_LABELS[reason];
}

export function buildAttentionQueue(params: {
  users: UserProfile[];
  subUserParentMap: Record<string, string>;
  subscriptionPlanMap: Record<string, UserPlanInfo>;
  analyticsSnapshots: Map<string, UserAnalyticsSnapshot>;
  userIdsWithRecentErrors: Set<string>;
  now?: Date;
}): AttentionQueueItem[] {
  const now = params.now ?? new Date();
  const items: AttentionQueueItem[] = [];

  for (const user of params.users) {
    if (params.subUserParentMap[user.id] || user.is_owner) continue;

    const plan = getPlanForUser(params.subscriptionPlanMap, user.id);
    const snap = params.analyticsSnapshots.get(user.id);
    const reasons: AttentionReason[] = [];

    if (isChurnRisk(user, plan)) reasons.push('churn_risk');
    if (plan.missingPaymentInfo) reasons.push('no_payment_method');
    if (snap?.stuckOnboarding) reasons.push('stuck_onboarding');
    if (hasRecentErrors(user.id, snap, params.userIdsWithRecentErrors)) {
      reasons.push('recent_errors');
    }
    if (isTrialExpiringWithin48h(plan, now)) reasons.push('trial_expiring');
    if (plan.subStatus === 'past_due' || plan.hasFailedInvoice) {
      reasons.push('billing_risk');
    }

    if (reasons.length === 0) continue;

    const activity = calculateActivityStatus(user.last_login ?? null, user.created_at);
    let trialHoursRemaining: number | null = null;
    if (plan.trialEndDate) {
      const ms = new Date(plan.trialEndDate).getTime() - now.getTime();
      trialHoursRemaining = ms > 0 ? Math.ceil(ms / (1000 * 60 * 60)) : 0;
    }

    const mrrAtRisk = plan.isRevenueCustomer || plan.isPayingCustomer ? plan.planPrice : 0;

    items.push({
      userId: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      reasons,
      mrrAtRisk,
      trialHoursRemaining,
      inactivityDays: activity.days,
      planDisplayName: plan.displayName,
    });
  }

  items.sort((a, b) => {
    if (b.mrrAtRisk !== a.mrrAtRisk) return b.mrrAtRisk - a.mrrAtRisk;
    const trialA = a.trialHoursRemaining ?? Infinity;
    const trialB = b.trialHoursRemaining ?? Infinity;
    if (trialA !== trialB) return trialA - trialB;
    return b.inactivityDays - a.inactivityDays;
  });

  return items;
}
