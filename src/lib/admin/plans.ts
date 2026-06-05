import { supabase } from '@/integrations/supabase/client';
import { isActiveTrial, isRevenuePayingCustomer } from '@/utils/subscriptionRevenueMetrics';
import type { UserPlanInfo } from './types';

export const plans = {
  free: { price: 0, limit: 100, displayName: 'Starter', pricePerProduct: 0, includedProducts: 100 },
  basic: { price: 0, limit: 100, displayName: 'Starter', pricePerProduct: 0, includedProducts: 100 },
  starter: { price: 0, limit: 100, displayName: 'Starter', pricePerProduct: 0, includedProducts: 100 },
  professional: { price: 9, limit: 2000, displayName: 'Professional', pricePerProduct: 0, includedProducts: 2000 },
  professional_trial: { price: 9, limit: 2000, displayName: 'Professional (Trial)', pricePerProduct: 0, includedProducts: 2000 },
  business: { price: 29, limit: 5000, displayName: 'Business', pricePerProduct: 0, includedProducts: 5000 },
  business_trial: { price: 29, limit: 5000, displayName: 'Business (Trial)', pricePerProduct: 0, includedProducts: 5000 },
  enterprise: { price: 59, limit: null, displayName: 'Enterprise', pricePerProduct: 0, includedProducts: 10000 },
  enterprise_trial: { price: 59, limit: null, displayName: 'Enterprise (Trial)', pricePerProduct: 0, includedProducts: 10000 },
  essential: { price: 9, limit: 500, displayName: 'Essential (legacy)', pricePerProduct: 0, includedProducts: 500 },
  essential_trial: { price: 9, limit: 500, displayName: 'Essential Trial (legacy)', pricePerProduct: 0, includedProducts: 500 },
  custom: { price: 59, limit: null, displayName: 'Enterprise', pricePerProduct: 0, includedProducts: 10000 },
  advance: { price: 9, limit: 500, displayName: 'Essential (legacy)', pricePerProduct: 0, includedProducts: 500 },
  advance_trial: { price: 9, limit: 500, displayName: 'Essential Trial (legacy)', pricePerProduct: 0, includedProducts: 500 },
  growth: { price: 0, limit: 10000, displayName: 'Business (legacy)', pricePerProduct: 0.008, includedProducts: 100 },
  premium: { price: 59, limit: null, displayName: 'Enterprise (legacy)', pricePerProduct: 0, includedProducts: 10000 },
};

export function getPlanDisplayName(planId: string | null): string {
  if (!planId) return '—';
  const plan = plans[planId as keyof typeof plans];
  return plan?.displayName ?? planId;
}

const DEFAULT_PLAN: UserPlanInfo = {
  displayName: 'Starter',
  filterKey: 'free',
  subStatus: null,
  endDate: null,
  trialEndDate: null,
  trialStartDate: null,
  hasFailedInvoice: false,
  maxProducts: 100,
  planPrice: 0,
  hasPaymentInfo: false,
  isPayingCustomer: false,
  isRevenueCustomer: false,
  isActiveTrial: false,
  missingPaymentInfo: false,
};

export function getPlanForUser(planMap: Record<string, UserPlanInfo>, userId: string): UserPlanInfo {
  return planMap[userId] ?? DEFAULT_PLAN;
}

export async function fetchUserSubscriptionPlans(): Promise<Record<string, UserPlanInfo>> {
  const [subsResult, failedInvoicesResult, profilesResult] = await Promise.all([
    supabase
      .from('user_subscriptions')
      .select('user_id, status, tier_id, end_date, trial_end_date, start_date'),
    supabase.from('invoices').select('user_id').eq('status', 'failed'),
    supabase
      .from('profiles')
      .select('id, stripe_customer_id')
      .not('stripe_customer_id', 'is', null),
  ]);

  if (subsResult.error) {
    console.error('Error fetching user subscriptions:', subsResult.error);
    return {};
  }
  if (profilesResult.error) console.error('Error fetching profile payment info:', profilesResult.error);

  const subs = subsResult.data || [];
  const failedUserIds = new Set(
    (failedInvoicesResult.data || []).map((r: { user_id: string }) => r.user_id),
  );

  const profileData = profilesResult.data as Array<{ id: string; stripe_customer_id: string | null }> | null;

  const stripeCustomerMap = new Map(
    (profileData || []).map((p: { id: string; stripe_customer_id: string | null }) => [
      p.id,
      p.stripe_customer_id,
    ]),
  );

  const tierIds = [...new Set(subs.map((s) => s.tier_id).filter(Boolean))];
  const { data: tiers } = tierIds.length
    ? await supabase
        .from('pricing_tiers')
        .select('id, name, display_name, max_products, price_monthly, price_per_product_monthly')
        .in('id', tierIds)
    : { data: [] };
  const tierMap = new Map((tiers || []).map((t) => [t.id, t]));

  const map: Record<string, UserPlanInfo> = {};
  for (const row of subs) {
    const tier = row.tier_id ? tierMap.get(row.tier_id) : null;
    const tierName = tier?.name ?? 'free';
    const displayName =
      tier?.display_name ?? plans[tierName as keyof typeof plans]?.displayName ?? 'Starter';
    const status = (row.status ?? null) as UserPlanInfo['subStatus'];
    const isOnTrial = status === 'trial';

    const hasPaymentInfo = !!stripeCustomerMap.get(row.user_id);
    const isPaidTier =
      !!tier && ((tier.price_monthly ?? 0) > 0 || (tier.price_per_product_monthly ?? 0) > 0);
    const isPayingCustomer = status === 'active' && isPaidTier;
    const isRevenueCustomer = isRevenuePayingCustomer(status, tier, hasPaymentInfo);
    const isActiveTrialUser = isActiveTrial(status, row.trial_end_date);
    const missingPaymentInfo = isPayingCustomer && !hasPaymentInfo;

    if (tierName === 'free' || !tierName) {
      map[row.user_id] = {
        displayName: 'Starter',
        filterKey: 'free',
        subStatus: status,
        endDate: row.end_date ?? null,
        trialEndDate: row.trial_end_date ?? null,
        trialStartDate: row.start_date ?? null,
        hasFailedInvoice: failedUserIds.has(row.user_id),
        maxProducts: 100,
        planPrice: 0,
        hasPaymentInfo,
        isPayingCustomer,
        isRevenueCustomer,
        isActiveTrial: isActiveTrialUser,
        missingPaymentInfo,
      };
    } else {
      const filterKey = isOnTrial ? `${tierName}_trial` : tierName;
      map[row.user_id] = {
        displayName: isOnTrial ? `${displayName} (Trial)` : displayName,
        filterKey,
        subStatus: status,
        endDate: row.end_date ?? null,
        trialEndDate: row.trial_end_date ?? null,
        trialStartDate: row.start_date ?? null,
        hasFailedInvoice: failedUserIds.has(row.user_id),
        maxProducts: tier?.max_products ?? null,
        planPrice: tier?.price_monthly ?? 0,
        hasPaymentInfo,
        isPayingCustomer,
        isRevenueCustomer,
        isActiveTrial: isActiveTrialUser,
        missingPaymentInfo,
      };
    }
  }
  return map;
}
