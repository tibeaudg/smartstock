import { useQuery } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface ModuleAccess {
  hasAccess: boolean;
  subscriptionStatus?: 'active' | 'cancelled' | 'expired';
  endDate?: string;
  billingCycle?: 'monthly' | 'yearly';
}

export const useModuleAccess = (moduleId: string) => {
  const { user } = useAuth();

  return useQuery<ModuleAccess>({
    queryKey: ['moduleAccess', moduleId, user?.id],
    queryFn: async () => {
      if (!user) {
        return { hasAccess: false };
      }

      const { data, error } = await supabase
        .from('user_module_subscriptions')
        .select('status, end_date, billing_cycle')
        .eq('user_id', user.id)
        .eq('module_id', moduleId)
        .eq('status', 'active')
        .single();

      if (error || !data) {
        return { hasAccess: false };
      }

      // Check if subscription is still valid
      const endDate = new Date(data.end_date);
      const now = new Date();
      const isExpired = endDate < now;

      return {
        hasAccess: !isExpired,
        subscriptionStatus: isExpired ? 'expired' : 'active',
        endDate: data.end_date,
        billingCycle: data.billing_cycle
      };
    },
    enabled: !!user && !!moduleId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useAllModuleAccess = () => {
  const { user } = useAuth();

  return useQuery<Record<string, ModuleAccess>>({
    queryKey: ['allModuleAccess', user?.id],
    queryFn: async () => {
      if (!user) {
        return {};
      }

      const { data, error } = await supabase
        .from('user_module_subscriptions')
        .select('module_id, status, end_date, billing_cycle')
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (error || !data) {
        return {};
      }

      const accessMap: Record<string, ModuleAccess> = {};
      const now = new Date();

      data.forEach(subscription => {
        const endDate = new Date(subscription.end_date);
        const isExpired = endDate < now;

        accessMap[subscription.module_id] = {
          hasAccess: !isExpired,
          subscriptionStatus: isExpired ? 'expired' : 'active',
          endDate: subscription.end_date,
          billingCycle: subscription.billing_cycle
        };
      });

      return accessMap;
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
