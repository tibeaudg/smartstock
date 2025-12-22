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
  status: 'active' | 'cancelled' | 'expired' | 'trial';
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
  isLoading: boolean;
  error: unknown;
  canUseFeature: (featureName: string) => boolean;
}

// Free tier configuration - all features are free
const FREE_TIER: PricingTier = {
  id: 'free',
  name: 'free',
  display_name: 'Free',
  description: 'Completely free - all features included',
  price_monthly: 0,
  price_yearly: 0,
  yearly_discount_percentage: 0,
  price_per_product_monthly: null,
  included_products: null, // Unlimited
  max_products: null, // Unlimited
  max_orders_per_month: null, // Unlimited
  max_users: null, // Unlimited
  max_branches: null, // Unlimited
  features: [
    'All features included',
    'Unlimited products',
    'Unlimited users',
    'Unlimited branches',
    'Barcode scanning',
    'Advanced analytics',
    'API access',
    'Priority support'
  ],
  is_popular: true,
  is_enterprise: false,
};

export const useSubscription: () => UseSubscriptionReturn = () => {
  const { user } = useAuth();

  // Fetch product count for display purposes only
  const {
    data: productCountFallback = 0,
  } = useQuery<number>({
    queryKey: ['subscription-product-count', user?.id],
    queryFn: async () => {
      if (!user) return 0;

      const { data: branches, error: branchesError } = await supabase
        .from('branches')
        .select('id')
        .eq('user_id', user.id);

      if (branchesError || !branches || branches.length === 0) {
        return 0;
      }

      const branchIds = branches.map(branch => branch.id);
      const { count, error: productError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .in('branch_id', branchIds);

      if (productError) {
        return 0;
      }

      return count ?? 0;
    },
    enabled: !!user,
    staleTime: 1000 * 60,
  });

  // All features are free - return free tier for everyone
  const result: UseSubscriptionReturn = {
    currentTier: FREE_TIER,
    nextTier: null, // No upgrades needed
    productCount: productCountFallback ?? 0,
    isLoading: false,
    error: null,
    canUseFeature: () => true, // All features are free
  };

  return result;
};
