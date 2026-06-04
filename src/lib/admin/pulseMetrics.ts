import type { MetricDelta, PulseMetricValues, UserPlanInfo, UserProfile } from './types';
import { getPlanForUser } from './plans';
import { calculateUserStats } from './userActivity';

export function computePulseMetrics(
  users: UserProfile[],
  subscriptionPlanMap: Record<string, UserPlanInfo>,
  subUserParentMap: Record<string, string>,
): PulseMetricValues {
  const now = new Date();
  const in48h = new Date(now.getTime() + 48 * 60 * 60 * 1000);

  const ownerUsers = users.filter((u) => !subUserParentMap[u.id] && u.is_owner !== true);

  const activeTrials = ownerUsers.filter((u) =>
    getPlanForUser(subscriptionPlanMap, u.id).isActiveTrial,
  ).length;
  const activePayingCustomers = ownerUsers.filter((u) =>
    getPlanForUser(subscriptionPlanMap, u.id).isRevenueCustomer,
  ).length;
  const activePayingCustomersMissingInfo = ownerUsers.filter(
    (u) => getPlanForUser(subscriptionPlanMap, u.id).missingPaymentInfo,
  ).length;

  const trialsExpiringSoon = ownerUsers.filter((u) => {
    const plan = getPlanForUser(subscriptionPlanMap, u.id);
    return (
      plan.subStatus === 'trial' &&
      plan.trialEndDate &&
      new Date(plan.trialEndDate) <= in48h &&
      new Date(plan.trialEndDate) > now
    );
  }).length;

  const mrrAtRisk = ownerUsers.reduce((sum, u) => {
    const plan = getPlanForUser(subscriptionPlanMap, u.id);
    if (plan.subStatus === 'past_due' || plan.hasFailedInvoice) return sum + plan.planPrice;
    return sum;
  }, 0);

  const totalMRR = ownerUsers.reduce((sum, u) => {
    const plan = getPlanForUser(subscriptionPlanMap, u.id);
    if (plan.isRevenueCustomer) return sum + plan.planPrice;
    return sum;
  }, 0);

  const conversionRate =
    activePayingCustomers + activeTrials > 0
      ? Math.round((activePayingCustomers / (activePayingCustomers + activeTrials)) * 100)
      : 0;

  const stats = calculateUserStats(ownerUsers);

  return {
    totalUsers: ownerUsers.length,
    newUsersToday: stats.newUsersToday,
    newUsersThisWeek: stats.newUsersThisWeek,
    activeTrials,
    trialsExpiringSoon,
    activePayingCustomers,
    activePayingCustomersMissingInfo,
    conversionRate,
    totalMRR,
    mrrAtRisk,
  };
}

export function buildMetricDeltas(
  users: UserProfile[],
  subscriptionPlanMap: Record<string, UserPlanInfo>,
  subUserParentMap: Record<string, string>,
  metrics: PulseMetricValues,
): {
  newToday: MetricDelta;
  newWeek: MetricDelta;
  conversion: MetricDelta;
  mrrPartial: MetricDelta;
} {
  const ownerUsers = users.filter((u) => !subUserParentMap[u.id] && u.is_owner !== true);
  const stats = calculateUserStats(ownerUsers);

  const newTodayDelta = stats.newUsersToday - stats.newUsersYesterday;
  const newWeekDelta = stats.newUsersThisWeek - stats.newUsersPriorWeek;

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

  const trialsNow = metrics.activeTrials;
  const payingNow = metrics.activePayingCustomers;
  const convNow = metrics.conversionRate;

  const usersCreatedLastWeek = ownerUsers.filter((u) => {
    const d = new Date(u.created_at);
    return d >= weekAgo;
  });
  const trialsLw = usersCreatedLastWeek.filter(
    (u) => getPlanForUser(subscriptionPlanMap, u.id).isActiveTrial,
  ).length;
  const payingLw = usersCreatedLastWeek.filter(
    (u) => getPlanForUser(subscriptionPlanMap, u.id).isRevenueCustomer,
  ).length;
  const convLw =
    trialsLw + payingLw > 0 ? Math.round((payingLw / (payingLw + trialsLw)) * 100) : convNow;

  const newPaying7d = ownerUsers.filter((u) => {
    const plan = getPlanForUser(subscriptionPlanMap, u.id);
    const created = new Date(u.created_at);
    return plan.isRevenueCustomer && created >= weekAgo;
  }).length;

  const churnedPaying7d = ownerUsers.filter((u) => {
    const plan = getPlanForUser(subscriptionPlanMap, u.id);
    const created = new Date(u.created_at);
    return (
      !plan.isRevenueCustomer &&
      (plan.subStatus === 'cancelled' || plan.subStatus === 'expired') &&
      created >= twoWeeksAgo &&
      created < weekAgo
    );
  }).length;

  const mrrPartialDelta = newPaying7d - churnedPaying7d;

  function toDelta(value: number, label: string, isPercent = false): MetricDelta {
    return {
      value: Math.abs(value),
      label,
      direction: value > 0 ? 'up' : value < 0 ? 'down' : 'flat',
      isPercent,
    };
  }

  return {
    newToday: toDelta(newTodayDelta, 'vs yesterday'),
    newWeek: toDelta(newWeekDelta, 'vs prior 7d'),
    conversion: toDelta(convNow - convLw, 'vs last week cohort', true),
    mrrPartial: toDelta(mrrPartialDelta, 'paying Δ last 7d'),
  };
}
