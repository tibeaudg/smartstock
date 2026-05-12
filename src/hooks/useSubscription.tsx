import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface PricingTier {
  id: string;
  name: string;
  display_name: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  yearly_discount_percentage: number;
  price_per_product_monthly: number | null;
  included_products: number | null;
  max_products: number | null;
  max_orders_per_month: number | null;
  max_users: number | null;
  max_branches: number | null;
  features: string[];
  is_popular: boolean;
  is_enterprise: boolean;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  tier_id: string;
  status: 'active' | 'cancelled' | 'expired' | 'trial' | 'past_due';
  billing_cycle: 'monthly' | 'yearly';
  start_date: string;
  end_date: string;
  trial_end_date?: string;
  stripe_subscription_id?: string;
  tier: PricingTier;
}

export interface UsageTracking {
  id: string;
  user_id: string;
  tier_id: string;
  current_products: number;
  current_users: number;
  current_branches: number;
  orders_this_month: number;
  last_reset_date: string;
  billing_anchor_date: string | null;
  next_billing_date: string | null;
}

export interface UseSubscriptionReturn {
  currentTier: PricingTier | null;
  nextTier: PricingTier | null;
  productCount: number;
  branchCount: number;
  userCount: number;
  maxProducts: number;
  maxBranches: number;
  maxUsers: number;
  isOverProductLimit: boolean;
  isOverBranchLimit: boolean;
  isOverUserLimit: boolean;
  isLoading: boolean;
  error: unknown;
  canUseFeature: (featureName: string) => boolean;
  isPaidPlan: boolean;
  isOnTrial: boolean;
  isPastDue: boolean;
  subscriptionStatus: 'active' | 'trial' | 'past_due' | 'cancelled' | 'expired' | null;
  trialEndDate: string | null;
  refetch: () => void;
}

function normalizeTier(row: Record<string, unknown> | null): PricingTier | null {
  if (!row) return null;
  const features = row.features;
  return {
    id: String(row.id ?? ''),
    name: String(row.name ?? 'free'),
    display_name: String(row.display_name ?? 'Free'),
    description: String(row.description ?? ''),
    price_monthly: Number(row.price_monthly ?? 0),
    price_yearly: Number(row.price_yearly ?? 0),
    yearly_discount_percentage: Number(row.yearly_discount_percentage ?? 0),
    price_per_product_monthly: row.price_per_product_monthly != null ? Number(row.price_per_product_monthly) : null,
    included_products: row.included_products != null ? Number(row.included_products) : null,
    max_products: row.max_products != null ? Number(row.max_products) : null,
    max_orders_per_month: row.max_orders_per_month != null ? Number(row.max_orders_per_month) : null,
    max_users: row.max_users != null ? Number(row.max_users) : null,
    max_branches: row.max_branches != null ? Number(row.max_branches) : null,
    features: Array.isArray(features) ? features.map(String) : [],
    is_popular: Boolean(row.is_popular),
    is_enterprise: Boolean(row.is_enterprise),
  };
}

// Free/Starter tier: 100 products, 1 branch, 1 user, no Contacts, no Orders
const FREE_TIER: PricingTier = {
  id: 'free',
  name: 'free',
  display_name: 'Starter',
  description: 'Core inventory features',
  price_monthly: 0,
  price_yearly: 0,
  yearly_discount_percentage: 0,
  price_per_product_monthly: null,
  included_products: 100,
  max_products: 100,
  max_orders_per_month: null,
  max_users: 1,
  max_branches: 1,
  features: ['Core inventory', '1 branch', '1 user'],
  is_popular: false,
  is_enterprise: false,
};

export const useSubscription: () => UseSubscriptionReturn = () => {
  const { user, authLoading } = useAuth();

  const {
    data: subscriptionData,
    isLoading: subLoading,
    error: subError,
    refetch,
  } = useQuery({
    queryKey: ['user-subscription', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data: sub, error } = await supabase
        .from('user_subscriptions')
        .select('id, tier_id, status, stripe_subscription_id, trial_end_date, pricing_tiers(*)')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return sub;
    },
    enabled: !!user,
    staleTime: 1000 * 60,
  });

  const { data: productCountFallback = 0 } = useQuery<number>({
    queryKey: ['subscription-product-count', user?.id],
    queryFn: async () => {
      if (!user) return 0;
      const { data: branches, error: branchesError } = await supabase
        .from('branches')
        .select('id')
        .eq('user_id', user.id);
      if (branchesError || !branches?.length) return 0;
      const branchIds = branches.map((b) => b.id);
      const { count, error: productError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .in('branch_id', branchIds);
      if (productError) return 0;
      return count ?? 0;
    },
    enabled: !!user,
    staleTime: 1000 * 60,
  });

  const { data: branchCountFallback = 0 } = useQuery<number>({
    queryKey: ['subscription-branch-count', user?.id],
    queryFn: async () => {
      if (!user) return 0;
      const { count, error } = await supabase
        .from('branches')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
      if (error) return 0;
      return count ?? 0;
    },
    enabled: !!user,
    staleTime: 1000 * 60,
  });

  const { data: userCountFallback = 0 } = useQuery<number>({
    queryKey: ['subscription-user-count', user?.id],
    queryFn: async () => {
      if (!user) return 0;
      const { data: branches } = await supabase
        .from('branches')
        .select('id')
        .eq('user_id', user.id);
      if (!branches?.length) return 0;
      const { data: branchUsers } = await supabase
        .from('branch_users')
        .select('user_id')
        .in('branch_id', branches.map((b) => b.id));
      const unique = new Set((branchUsers ?? []).map((u) => u.user_id));
      return unique.size;
    },
    enabled: !!user,
    staleTime: 1000 * 60,
  });

  // Fetch all non-enterprise tiers sorted by price so we can find the next tier up.
  const { data: allTiers = [] } = useQuery<PricingTier[]>({
    queryKey: ['all-pricing-tiers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pricing_tiers')
        .select('*')
        .eq('is_enterprise', false)
        .order('price_monthly', { ascending: true });
      if (error) return [];
      return (data ?? []).map((r) => normalizeTier(r as Record<string, unknown>) as PricingTier);
    },
    staleTime: 1000 * 60 * 10,
  });

  const { currentTier, isPaidPlan, isOnTrial, isPastDue, subscriptionStatus, trialEndDate } = useMemo(() => {
    const sub = subscriptionData as { status?: string; tier_id?: string | null; trial_end_date?: string | null; pricing_tiers?: Record<string, unknown> | Record<string, unknown>[] } | null;
    const status = (sub?.status ?? null) as 'active' | 'trial' | 'past_due' | 'cancelled' | 'expired' | null;
    // active, trial, and past_due all retain the paid tier (past_due is blocked in UI via PaymentGate)
    const hasAccess = sub && (status === 'active' || status === 'trial' || status === 'past_due');
    if (!sub || !hasAccess) {
      return { currentTier: FREE_TIER, isPaidPlan: false, isOnTrial: false, isPastDue: false, subscriptionStatus: status, trialEndDate: null };
    }
    const tierRow = Array.isArray(sub.pricing_tiers) ? sub.pricing_tiers[0] : sub.pricing_tiers;
    const tier = normalizeTier(tierRow as Record<string, unknown> | null) ?? FREE_TIER;
    // If tier data is unavailable but the user has an active subscription with a tier_id,
    // infer they're on a paid plan rather than locking them out silently.
    const tierDataMissing = !tierRow && !!sub.tier_id;
    const paid = tier.name !== 'free' || (tierDataMissing && status === 'active');
    const onTrial = status === 'trial';
    const pastDue = status === 'past_due';
    return { currentTier: tier, isPaidPlan: paid, isOnTrial: onTrial, isPastDue: pastDue, subscriptionStatus: status, trialEndDate: sub.trial_end_date ?? null };
  }, [subscriptionData]);

  const branchCount = branchCountFallback ?? 0;
  const userCount = userCountFallback ?? 0;
  const maxProducts = currentTier?.max_products ?? 100;
  const maxBranches = currentTier?.max_branches ?? 1;
  const maxUsers = currentTier?.max_users ?? 1;
  const isOverProductLimit = !isPaidPlan && (productCountFallback ?? 0) > maxProducts;
  const isOverBranchLimit = branchCount >= maxBranches;
  const isOverUserLimit = userCount >= maxUsers;

  const nextTier = useMemo(() => {
    if (!currentTier || !allTiers.length) return null;
    const idx = allTiers.findIndex((t) => t.name === currentTier.name);
    // If current tier not found in list (e.g. free/starter), find first paid tier
    if (idx === -1) return allTiers.find((t) => t.price_monthly > 0) ?? null;
    return allTiers[idx + 1] ?? null;
  }, [currentTier, allTiers]);

  const canUseFeature = useMemo(() => {
    return (featureName: string): boolean => {
      switch (featureName) {
        case 'add_branch':
          return true; // Extra branches are charged separately, no upgrade required
        case 'add_user':
          return true; // Extra users are charged separately, no upgrade required
        case 'billing':
          return true;
        case 'branches_management':
          return true;
        case 'contacts':
          return isPaidPlan;
        case 'orders':
          return isPaidPlan;
        default:
          return true;
      }
    };
  }, [isPaidPlan]);

  return {
    currentTier,
    nextTier,
    productCount: productCountFallback ?? 0,
    branchCount,
    userCount,
    maxProducts,
    maxBranches,
    maxUsers,
    isOverProductLimit,
    isOverBranchLimit,
    isOverUserLimit,
    isLoading: authLoading || subLoading,
    error: subError,
    canUseFeature,
    isPaidPlan,
    isOnTrial,
    isPastDue,
    subscriptionStatus,
    trialEndDate,
    refetch,
  };
};
