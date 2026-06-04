import type { ChartTimeRange, UserPlanInfo, UserProfile } from './types';
import { getPlanForUser } from './plans';

export interface RegistrationBucket {
  label: string;
  tooltip: string;
  trial: number;
  paid: number;
  free: number;
  priorTotal: number;
  total: number;
}

function classifySignup(plan: UserPlanInfo): 'trial' | 'paid' | 'free' {
  if (plan.isRevenueCustomer || (plan.isPayingCustomer && plan.subStatus === 'active')) {
    return 'paid';
  }
  if (plan.subStatus === 'trial' || plan.isActiveTrial) return 'trial';
  return 'free';
}

function buildRawBuckets(
  users: UserProfile[],
  subscriptionPlanMap: Record<string, UserPlanInfo>,
  timeRange: ChartTimeRange,
  offsetPeriods = 0,
): RegistrationBucket[] {
  const now = new Date();
  const periodShift = offsetPeriods;

  if (timeRange === 'day') {
    return Array.from({ length: 30 }, (_, i) => {
      const d = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - (29 - i) - periodShift * 30,
      );
      const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const dayUsers = users.filter((u) => u.created_at.startsWith(iso));
      let trial = 0;
      let paid = 0;
      let free = 0;
      for (const u of dayUsers) {
        const c = classifySignup(getPlanForUser(subscriptionPlanMap, u.id));
        if (c === 'trial') trial++;
        else if (c === 'paid') paid++;
        else free++;
      }
      const showLabel = i % 5 === 0 || i === 29;
      return {
        label: showLabel ? String(d.getDate()) : '',
        tooltip: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        trial,
        paid,
        free,
        priorTotal: 0,
        total: trial + paid + free,
      };
    });
  }

  if (timeRange === 'week') {
    const dayOfWeek = now.getDay();
    return Array.from({ length: 12 }, (_, i) => {
      const weeksAgo = 11 - i + periodShift * 12;
      const weekStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - dayOfWeek - weeksAgo * 7,
      );
      const weekEnd = new Date(
        weekStart.getFullYear(),
        weekStart.getMonth(),
        weekStart.getDate() + 6,
        23,
        59,
        59,
        999,
      );
      const weekUsers = users.filter((u) => {
        const d = new Date(u.created_at);
        return d >= weekStart && d <= weekEnd;
      });
      let trial = 0;
      let paid = 0;
      let free = 0;
      for (const u of weekUsers) {
        const c = classifySignup(getPlanForUser(subscriptionPlanMap, u.id));
        if (c === 'trial') trial++;
        else if (c === 'paid') paid++;
        else free++;
      }
      const label = weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const showLabel = i % 3 === 0 || i === 11;
      return {
        label: showLabel ? label : '',
        tooltip: `${label} – ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
        trial,
        paid,
        free,
        priorTotal: 0,
        total: trial + paid + free,
      };
    });
  }

  if (timeRange === 'month') {
    return Array.from({ length: 12 }, (_, i) => {
      const month = new Date(
        now.getFullYear(),
        now.getMonth() - (11 - i) - periodShift * 12,
        1,
      );
      const monthUsers = users.filter((u) => {
        const d = new Date(u.created_at);
        return d.getFullYear() === month.getFullYear() && d.getMonth() === month.getMonth();
      });
      let trial = 0;
      let paid = 0;
      let free = 0;
      for (const u of monthUsers) {
        const c = classifySignup(getPlanForUser(subscriptionPlanMap, u.id));
        if (c === 'trial') trial++;
        else if (c === 'paid') paid++;
        else free++;
      }
      const label = month.toLocaleDateString('en-US', { month: 'short' });
      const fullLabel = month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      return {
        label,
        tooltip: fullLabel,
        trial,
        paid,
        free,
        priorTotal: 0,
        total: trial + paid + free,
      };
    });
  }

  return Array.from({ length: 5 }, (_, i) => {
    const year = now.getFullYear() - (4 - i) - periodShift * 5;
    const yearUsers = users.filter((u) => new Date(u.created_at).getFullYear() === year);
    let trial = 0;
    let paid = 0;
    let free = 0;
    for (const u of yearUsers) {
      const c = classifySignup(getPlanForUser(subscriptionPlanMap, u.id));
      if (c === 'trial') trial++;
      else if (c === 'paid') paid++;
      else free++;
    }
    return {
      label: String(year),
      tooltip: String(year),
      trial,
      paid,
      free,
      priorTotal: 0,
      total: trial + paid + free,
    };
  });
}

/** Trim leading/trailing empty buckets; keep 1 padding bar each side when possible */
export function trimSparseBuckets(buckets: RegistrationBucket[]): RegistrationBucket[] {
  const first = buckets.findIndex((b) => b.total > 0);
  if (first === -1) return buckets;
  let last = -1;
  for (let i = buckets.length - 1; i >= 0; i--) {
    if (buckets[i].total > 0) {
      last = i;
      break;
    }
  }
  const start = Math.max(0, first - 1);
  const end = Math.min(buckets.length - 1, last + 1);
  return buckets.slice(start, end + 1);
}

export function suggestChartRange(
  users: UserProfile[],
  subscriptionPlanMap: Record<string, UserPlanInfo>,
): ChartTimeRange {
  if (users.length === 0) return 'month';
  const dates = users.map((u) => new Date(u.created_at).getTime());
  const spanDays = (Math.max(...dates) - Math.min(...dates)) / (1000 * 60 * 60 * 24);
  if (spanDays <= 35) return 'day';
  if (spanDays <= 120) return 'week';
  if (spanDays <= 400) return 'month';
  return 'year';
}

export function buildRegistrationSeries(
  users: UserProfile[],
  subscriptionPlanMap: Record<string, UserPlanInfo>,
  timeRange: ChartTimeRange,
): RegistrationBucket[] {
  const current = buildRawBuckets(users, subscriptionPlanMap, timeRange, 0);
  const prior = buildRawBuckets(users, subscriptionPlanMap, timeRange, 1);

  const merged = current.map((b, i) => ({
    ...b,
    priorTotal: prior[i]?.total ?? 0,
  }));

  return trimSparseBuckets(merged);
}

export function chartDataForRecharts(buckets: RegistrationBucket[]) {
  return buckets.map((b) => ({
    name: b.label || b.tooltip,
    tooltip: b.tooltip,
    trial: b.trial,
    paid: b.paid,
    free: b.free,
    prior: b.priorTotal,
    total: b.total,
  }));
}
