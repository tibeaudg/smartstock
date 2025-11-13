import { useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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

type BillingCycle = 'monthly' | 'yearly';

type StartTrialParams = { tierId: string; billingCycle: BillingCycle };

type SubscribeParams = { tierId: string; billingCycle: BillingCycle; stripeSessionId?: string };

export interface UseSubscriptionReturn {
  pricingTiers: PricingTier[];
  currentSubscription: UserSubscription | null;
  usageTracking: UsageTracking | null;
  currentTier: PricingTier | null;
  nextTier: PricingTier | null;
  productCount: number;
  isLoading: boolean;
  error: unknown;
  startTrial: (params: StartTrialParams) => void;
  subscribe: (params: SubscribeParams) => void;
  cancelSubscription: () => void;
  updateUsage: (updates: Partial<UsageTracking>) => void;
  isStartingTrial: boolean;
  isSubscribing: boolean;
  isCancelling: boolean;
  isUpdatingUsage: boolean;
  isTrialActive: boolean;
  isSubscriptionActive: boolean;
  canUseFeature: (featureName: string) => boolean;
  isWithinLimits: (type: 'products' | 'users' | 'branches' | 'orders') => boolean;
  getRemainingLimit: (type: 'products' | 'users' | 'branches' | 'orders') => number | null;
  shouldContactSales: () => boolean;
}

export const useSubscription: () => UseSubscriptionReturn = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const tierThresholds = [
    { name: 'free', limit: 100 },
    { name: 'advanced', limit: 500 },
    { name: 'ultra', limit: 2000 },
    { name: 'premium', limit: 5000 },
    { name: 'enterprise', limit: null },
  ] as const;

  useEffect(() => {
    if (!user) return;
    const productChannel = supabase
      .channel(`subscription-products-${user.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        queryClient.invalidateQueries({ queryKey: ['subscription-product-count', user.id] });
        queryClient.invalidateQueries({ queryKey: ['usage-tracking', user.id] });
      })
      .subscribe();

    const usageChannel = supabase
      .channel(`subscription-usage-${user.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'usage_tracking', filter: `user_id=eq.${user.id}` },
        () => {
          queryClient.invalidateQueries({ queryKey: ['usage-tracking', user.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(productChannel);
      supabase.removeChannel(usageChannel);
    };
  }, [user, queryClient]);

  // Fetch pricing tiers
  const {
    data: pricingTiersRaw = [],
    isLoading: tiersLoading,
    error: tiersError
  } = useQuery<PricingTier[]>({
    queryKey: ['pricing-tiers'],
    queryFn: async () => {
      // Add timeout to prevent hanging requests
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 5000); // Reduced from 8000 to 5000ms
      });
      
      const queryPromise = supabase
        .from('pricing_tiers')
        .select('*')
        .order('price_monthly', { ascending: true });
      
      try {
        const result = await Promise.race([queryPromise, timeoutPromise]) as any;
        
        if (result.error) throw result.error;
        return result.data || [];
      } catch (timeoutError) {
        console.error('Pricing tiers fetch timeout:', timeoutError);
        // Return empty array instead of throwing to prevent infinite loading
        return [];
      }
    },
    staleTime: Infinity, // Never mark as stale - persist until invalidated
    retry: 1, // Only retry once to prevent infinite loops
    retryDelay: 2000, // 2 second delay between retries
  });

  const renameMap: Record<string, { name: string; display_name: string }> = {
    basic: { name: 'free', display_name: 'Free' },
    free: { name: 'free', display_name: 'Free' },
    growth: { name: 'advanced', display_name: 'Advanced' },
    business: { name: 'advanced', display_name: 'Advanced' },
    premium: { name: 'premium', display_name: 'Premium' },
  };

  const pricingTiers = useMemo(
    () =>
      pricingTiersRaw.map(tier => {
        const rename = renameMap[tier.name];
        if (!rename) return tier;
        return {
          ...tier,
          name: rename.name,
          display_name: rename.display_name,
        };
      }),
    [pricingTiersRaw]
  );

  const sortedTiers = useMemo(
    () =>
      [...pricingTiers].sort((a, b) => {
        const aLimit = a.included_products ?? Number.MAX_SAFE_INTEGER;
        const bLimit = b.included_products ?? Number.MAX_SAFE_INTEGER;
        return aLimit - bLimit;
      }),
    [pricingTiers]
  );

  const determineTierByCount = (count: number) => {
    const threshold = tierThresholds.find(entry => entry.limit === null || count <= (entry.limit ?? Number.MAX_SAFE_INTEGER));
    if (!threshold) return null;
    return pricingTiers.find(tier => tier.name === threshold.name) ?? null;
  };

  // Fetch user's current subscription
  const {
    data: currentSubscription,
    isLoading: subscriptionLoading,
    error: subscriptionError
  } = useQuery<UserSubscription | null>({
    queryKey: ['user-subscription', user?.id],
    queryFn: async () => {
      if (!user) return null;

      // Add timeout to prevent hanging requests
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 8000);
      });
      
      const queryPromise = supabase
        .from('user_subscriptions')
        .select(`
          *,
          tier: pricing_tiers(*)
        `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();
      
      const result = await Promise.race([queryPromise, timeoutPromise]) as any;
      
      if (result.error) throw result.error;
      return result.data || null;
    },
    enabled: !!user,
    staleTime: Infinity, // Never mark as stale - persist until invalidated
    retry: 1, // Only retry once to prevent infinite loops
    retryDelay: 2000, // 2 second delay between retries
  });

  // Fetch usage tracking
  const {
    data: usageTracking,
    isLoading: usageLoading,
    error: usageError
  } = useQuery<UsageTracking | null>({
    queryKey: ['usage-tracking', user?.id],
    queryFn: async () => {
      if (!user) return null;

      // Add timeout to prevent hanging requests
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 8000);
      });
      
      const queryPromise = supabase
        .from('usage_tracking')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      const result = await Promise.race([queryPromise, timeoutPromise]) as any;
      
      if (result.error) throw result.error;
      return result.data || null;
    },
    enabled: !!user,
    staleTime: Infinity, // Never mark as stale - persist until invalidated
    retry: 1, // Only retry once to prevent infinite loops
    retryDelay: 2000, // 2 second delay between retries
  });

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
        console.warn('[useSubscription] Failed to fetch product count fallback', productError);
        return 0;
      }

      return count ?? 0;
    },
    enabled: !!user,
    staleTime: 1000 * 60,
  });

  // Start trial mutation
  const startTrialMutation = useMutation({
    mutationFn: async ({ tierId, billingCycle }: StartTrialParams) => {
      if (!user) throw new Error('User not authenticated');

      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 14);

      const { data, error } = await supabase
        .from('user_subscriptions')
        .upsert({
          user_id: user.id,
          tier_id: tierId,
          status: 'trial',
          billing_cycle: billingCycle,
          start_date: new Date().toISOString(),
          end_date: trialEndDate.toISOString(),
          trial_end_date: trialEndDate.toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-subscription'] });
      queryClient.invalidateQueries({ queryKey: ['usage-tracking'] });
    }
  });

  // Subscribe mutation
  const subscribeMutation = useMutation({
    mutationFn: async ({ tierId, billingCycle, stripeSessionId }: SubscribeParams) => {
      if (!user) throw new Error('User not authenticated');

      const endDate = new Date();
      if (billingCycle === 'monthly') {
        endDate.setMonth(endDate.getMonth() + 1);
      } else {
        endDate.setFullYear(endDate.getFullYear() + 1);
      }

      const { data, error } = await supabase
        .from('user_subscriptions')
        .upsert({
          user_id: user.id,
          tier_id: tierId,
          status: 'active',
          billing_cycle: billingCycle,
          start_date: new Date().toISOString(),
          end_date: endDate.toISOString(),
          stripe_subscription_id: stripeSessionId
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-subscription'] });
      queryClient.invalidateQueries({ queryKey: ['usage-tracking'] });
    }
  });

  // Cancel subscription mutation
  const cancelSubscriptionMutation = useMutation({
    mutationFn: async () => {
      if (!user || !currentSubscription) throw new Error('No active subscription');

      const { error } = await supabase
        .from('user_subscriptions')
        .update({ status: 'cancelled' })
        .eq('id', currentSubscription.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-subscription'] });
    }
  });

  // Update usage tracking
  const updateUsageMutation = useMutation({
    mutationFn: async (updates: Partial<UsageTracking>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('usage_tracking')
        .upsert({
          user_id: user.id,
          ...updates,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usage-tracking'] });
    }
  });

  // Helper functions
  const isTrialActive = () => {
    if (!currentSubscription || currentSubscription.status !== 'trial') return false;
    if (!currentSubscription.trial_end_date) return false;
    return new Date(currentSubscription.trial_end_date) > new Date();
  };

  const isSubscriptionActive = () => {
    if (!currentSubscription) return false;
    if (currentSubscription.status !== 'active') return false;
    return new Date(currentSubscription.end_date) > new Date();
  };

  const getTierById = (id?: string | null) => {
    if (!id) return null;
    return pricingTiers.find(tier => tier.id === id) ?? null;
  };

  const productCount = Math.max(usageTracking?.current_products ?? 0, productCountFallback ?? 0);

  const getCurrentTier = () => {
    const usageTier = getTierById(usageTracking?.tier_id);
    if (usageTier) return usageTier;
    const subscriptionTier = getTierById(currentSubscription?.tier_id);
    if (subscriptionTier) return subscriptionTier;
    const tierByCount = determineTierByCount(productCount);
    if (tierByCount) return tierByCount;
    return sortedTiers[0] ?? null;
  };

  const getNextTier = () => {
    const current = getCurrentTier();
    if (!current) return null;
    const thresholdIndex = tierThresholds.findIndex(entry => entry.name === current.name);
    if (thresholdIndex === -1) return null;
    const nextThreshold = tierThresholds[thresholdIndex + 1];
    if (!nextThreshold) return null;
    return pricingTiers.find(tier => tier.name === nextThreshold.name) ?? null;
  };

  const canUseFeature = (featureName: string) => {
    const tier = getCurrentTier();
    if (!tier) return false;
    
    // Scanner is now available for all users including free tier
    if (featureName === 'scanner' || featureName === 'Barcode scanner') {
      return true;
    }
    
    // Check if feature is included in tier
    return tier.features.includes(featureName);
  };

  const isWithinLimits = (type: 'products' | 'users' | 'branches' | 'orders') => {
    const tier = getCurrentTier();
    if (!tier) return true;

    switch (type) {
      case 'products':
        if (tier.included_products === null) return true;
        return productCount <= tier.included_products;
      case 'users':
        return tier.max_users === null || (usageTracking?.current_users ?? 0) < tier.max_users;
      case 'branches':
        return tier.max_branches === null || (usageTracking?.current_branches ?? 0) < tier.max_branches;
      case 'orders':
        return tier.max_orders_per_month === null || (usageTracking?.orders_this_month ?? 0) < tier.max_orders_per_month;
      default:
        return true;
    }
  };

  const getRemainingLimit = (type: 'products' | 'users' | 'branches' | 'orders') => {
    const tier = getCurrentTier();
    if (!tier) return null;

    switch (type) {
      case 'products':
        return tier.included_products ? tier.included_products - productCount : null;
      case 'users':
        return tier.max_users ? tier.max_users - (usageTracking?.current_users ?? 0) : null;
      case 'branches':
        return tier.max_branches ? tier.max_branches - (usageTracking?.current_branches ?? 0) : null;
      case 'orders':
        return tier.max_orders_per_month ? tier.max_orders_per_month - (usageTracking?.orders_this_month ?? 0) : null;
      default:
        return null;
    }
  };

  const shouldContactSales = () => {
    const tier = getCurrentTier();
    return tier?.name === 'enterprise';
  };

  const result: UseSubscriptionReturn = {
    // Data
    pricingTiers,
    currentSubscription,
    usageTracking,
    currentTier: getCurrentTier(),
    nextTier: getNextTier(),
    productCount,

    // Loading states
    isLoading: tiersLoading || subscriptionLoading || usageLoading,

    // Errors
    error: tiersError || subscriptionError || usageError,

    // Mutations
    startTrial: startTrialMutation.mutate,
    subscribe: subscribeMutation.mutate,
    cancelSubscription: cancelSubscriptionMutation.mutate,
    updateUsage: updateUsageMutation.mutate,

    // Mutation states
    isStartingTrial: startTrialMutation.isPending,
    isSubscribing: subscribeMutation.isPending,
    isCancelling: cancelSubscriptionMutation.isPending,
    isUpdatingUsage: updateUsageMutation.isPending,

    // Helper functions
    isTrialActive: isTrialActive(),
    isSubscriptionActive: isSubscriptionActive(),
    canUseFeature,
    isWithinLimits,
    getRemainingLimit,
    shouldContactSales,
  };

  return result;
};
