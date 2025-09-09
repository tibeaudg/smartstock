import { useQuery } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

// Helper function to validate UUID format
const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

export interface ModuleAccess {
  hasAccess: boolean;
  subscriptionStatus?: 'active' | 'cancelled' | 'expired';
  endDate?: string;
  billingCycle?: 'monthly' | 'yearly';
}

export const useModuleAccess = (moduleSlug: string) => {
  const { user } = useAuth();

  return useQuery<ModuleAccess>({
    queryKey: ['moduleAccess', moduleSlug, user?.id],
    queryFn: async () => {
      if (!user) {
        return { hasAccess: false };
      }

      // First try to get the module ID from the slug, fallback to title lookup, then hardcoded UUIDs
      let moduleId: string | null = null;
      
      try {
        const { data: module, error: moduleError } = await supabase
          .from('modules')
          .select('id')
          .eq('slug', moduleSlug)
          .single();

        if (!moduleError && module) {
          moduleId = module.id;
        }
      } catch (error) {
        // If slug column doesn't exist, try to find by title
        try {
          const titleMap: Record<string, string> = {
            'delivery-notes': 'Leveringsbonnen Beheer',
            'advanced-analytics': 'Geavanceerde Analytics',
            'auto-reorder': 'Automatische Herbestelling',
            'ecommerce-integration': 'E-commerce Integratie',
            'premium-support': 'Premium Support',
            'scanning': 'Barcode Scanner'
          };
          
          const title = titleMap[moduleSlug];
          if (title) {
            const { data: module, error: moduleError } = await supabase
              .from('modules')
              .select('id')
              .eq('title', title)
              .single();

            if (!moduleError && module) {
              moduleId = module.id;
            }
          }
        } catch (titleError) {
          // Fallback to hardcoded UUIDs for known modules
          const hardcodedIds: Record<string, string> = {
            'delivery-notes': '550e8400-e29b-41d4-a716-446655440000', // Fixed UUID for delivery-notes
            'advanced-analytics': '550e8400-e29b-41d4-a716-446655440001',
            'auto-reorder': '550e8400-e29b-41d4-a716-446655440002',
            'ecommerce-integration': '550e8400-e29b-41d4-a716-446655440003',
            'premium-support': '550e8400-e29b-41d4-a716-446655440004',
            'scanning': '550e8400-e29b-41d4-a716-446655440005'
          };
          
          if (hardcodedIds[moduleSlug]) {
            moduleId = hardcodedIds[moduleSlug];
            console.log('Using hardcoded UUID for module:', moduleSlug, moduleId);
          } else {
            console.warn('No module found for slug:', moduleSlug);
            return { hasAccess: false };
          }
        }
      }

      // If we still don't have a valid UUID, return no access
      if (!moduleId || !isValidUUID(moduleId)) {
        console.warn('Invalid module ID for slug:', moduleSlug, moduleId);
        return { hasAccess: false };
      }

      const { data, error } = await supabase
        .from('user_module_subscriptions')
        .select('status, end_date, billing_cycle')
        .eq('user_id', user.id)
        .eq('module_id', moduleId)
        .eq('status', 'active')
        .maybeSingle();

      if (error) {
        console.warn('Module access query error for module:', moduleSlug, 'ID:', moduleId, error);
        return { hasAccess: false };
      }

      if (!data) {
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
    enabled: !!user && !!moduleSlug,
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

      // Try to get modules with slug, fallback to without slug
      let data, error;
      
      try {
        const result = await supabase
          .from('user_module_subscriptions')
          .select(`
            module_id, 
            status, 
            end_date, 
            billing_cycle,
            modules!inner(slug)
          `)
          .eq('user_id', user.id)
          .eq('status', 'active');
        
        data = result.data;
        error = result.error;
      } catch (err) {
        // If slug column doesn't exist, use simple query
        const result = await supabase
          .from('user_module_subscriptions')
          .select('module_id, status, end_date, billing_cycle')
          .eq('user_id', user.id)
          .eq('status', 'active');
        
        data = result.data;
        error = result.error;
      }

      if (error) {
        console.warn('All module access query error:', error);
        return {};
      }

      if (!data) {
        return {};
      }

      const accessMap: Record<string, ModuleAccess> = {};
      const now = new Date();

      data.forEach(subscription => {
        const endDate = new Date(subscription.end_date);
        const isExpired = endDate < now;
        
        // Use slug if available, otherwise use module_id (but only if it's a valid UUID)
        const moduleKey = (subscription as any).modules?.slug || 
          (isValidUUID(subscription.module_id) ? subscription.module_id : null);

        if (moduleKey) {
          accessMap[moduleKey] = {
            hasAccess: !isExpired,
            subscriptionStatus: isExpired ? 'expired' : 'active',
            endDate: subscription.end_date,
            billingCycle: subscription.billing_cycle
          };
        }
      });

      return accessMap;
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
