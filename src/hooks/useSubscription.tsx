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
}

export const useSubscription = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch pricing tiers
  const {
    data: pricingTiers = [],
    isLoading: tiersLoading,
    error: tiersError
  } = useQuery<PricingTier[]>({
    queryKey: ['pricing-tiers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pricing_tiers')
        .select('*')
        .order('price_monthly', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch user's current subscription
  const {
    data: currentSubscription,
    isLoading: subscriptionLoading,
    error: subscriptionError
  } = useQuery<UserSubscription | null>({
    queryKey: ['user-subscription', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          tier: pricing_tiers(*)
        `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();

      if (error) throw error;
      return data || null;
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 2, // 2 minutes
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

      const { data, error } = await supabase
        .from('usage_tracking')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data || null;
    },
    enabled: !!user,
    staleTime: 1000 * 30, // 30 seconds
  });

  // Start trial mutation
  const startTrialMutation = useMutation({
    mutationFn: async ({ tierId, billingCycle }: { tierId: string; billingCycle: 'monthly' | 'yearly' }) => {
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
    mutationFn: async ({ tierId, billingCycle, stripeSessionId }: { 
      tierId: string; 
      billingCycle: 'monthly' | 'yearly';
      stripeSessionId?: string;
    }) => {
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

  const getCurrentTier = () => {
    return currentSubscription?.tier || pricingTiers.find(tier => tier.name === 'basis');
  };

  const canUseFeature = (featureName: string) => {
    const tier = getCurrentTier();
    if (!tier) return false;
    
    // Check if feature is included in tier
    return tier.features.includes(featureName);
  };

  const isWithinLimits = (type: 'products' | 'users' | 'branches' | 'orders') => {
    const tier = getCurrentTier();
    if (!tier || !usageTracking) return true;

    switch (type) {
      case 'products':
        return tier.max_products === null || usageTracking.current_products < tier.max_products;
      case 'users':
        return tier.max_users === null || usageTracking.current_users < tier.max_users;
      case 'branches':
        return tier.max_branches === null || usageTracking.current_branches < tier.max_branches;
      case 'orders':
        return tier.max_orders === null || usageTracking.orders_this_month < tier.max_orders;
      default:
        return true;
    }
  };

  const getRemainingLimit = (type: 'products' | 'users' | 'branches' | 'orders') => {
    const tier = getCurrentTier();
    if (!tier || !usageTracking) return null;

    switch (type) {
      case 'products':
        return tier.max_products ? tier.max_products - usageTracking.current_products : null;
      case 'users':
        return tier.max_users ? tier.max_users - usageTracking.current_users : null;
      case 'branches':
        return tier.max_branches ? tier.max_branches - usageTracking.current_branches : null;
      case 'orders':
        return tier.max_orders ? tier.max_orders - usageTracking.orders_this_month : null;
      default:
        return null;
    }
  };

  return {
    // Data
    pricingTiers,
    currentSubscription,
    usageTracking,
    currentTier: getCurrentTier(),
    
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
    getRemainingLimit
  };
};
