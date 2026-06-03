import { isPastTrialEndDate } from '@/utils/trialExpiration';

export interface PricingTierLike {
  price_monthly?: number | null;
  price_per_product_monthly?: number | null;
}

export interface SubscriptionRevenueRow {
  status: string | null;
  tier_id: string | null;
  trial_end_date?: string | null;
  user_id?: string;
}

export function isPaidTier(tier: PricingTierLike | null | undefined): boolean {
  if (!tier) return false;
  return (tier.price_monthly ?? 0) > 0 || (tier.price_per_product_monthly ?? 0) > 0;
}

/** Trial still in progress (status trial and end date not passed). */
export function isActiveTrial(
  status: string | null | undefined,
  trialEndDate: string | null | undefined,
): boolean {
  if (status !== 'trial') return false;
  return !isPastTrialEndDate(trialEndDate);
}

/**
 * Counts toward MRR / paying customers: active paid plan with Stripe on file.
 * Excludes trials, expired trials, free tiers, and active subs without payment info.
 */
export function isRevenuePayingCustomer(
  status: string | null | undefined,
  tier: PricingTierLike | null | undefined,
  hasPaymentInfo: boolean,
): boolean {
  return status === 'active' && isPaidTier(tier) && hasPaymentInfo;
}

export interface RevenueMetricsResult {
  mrr: number;
  payingCustomers: number;
  activeTrials: number;
  trialConversionPct: number;
}

export function computeRevenueMetrics(
  subs: SubscriptionRevenueRow[],
  tierById: Map<string, PricingTierLike & { price_monthly?: number | null }>,
  hasPaymentInfoByUserId: Map<string, boolean>,
): RevenueMetricsResult {
  let mrr = 0;
  let payingCustomers = 0;
  let activeTrials = 0;

  for (const sub of subs) {
    const tier = sub.tier_id ? tierById.get(sub.tier_id) : null;
    const hasPaymentInfo = sub.user_id ? !!hasPaymentInfoByUserId.get(sub.user_id) : false;

    if (isActiveTrial(sub.status, sub.trial_end_date)) {
      activeTrials++;
    }

    if (isRevenuePayingCustomer(sub.status, tier, hasPaymentInfo)) {
      payingCustomers++;
      mrr += tier?.price_monthly ?? 0;
    }
  }

  const trialConversionPct =
    payingCustomers + activeTrials > 0
      ? Math.round((100 * payingCustomers) / (payingCustomers + activeTrials))
      : 0;

  return { mrr, payingCustomers, activeTrials, trialConversionPct };
}
