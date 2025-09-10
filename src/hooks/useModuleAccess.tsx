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
      console.log('useModuleAccess: Starting check for module:', moduleSlug, 'user:', user?.id);
      
      if (!user) {
        console.log('useModuleAccess: No user found, returning no access');
        return { hasAccess: false };
      }

      // First try to get the module ID from the slug, fallback to title lookup, then hardcoded UUIDs
      let moduleId: string | null = null;
      
      try {
        const { data: module, error: moduleError } = await supabase
          .from('modules')
          .select('id')
          .eq('slug', moduleSlug)
          .maybeSingle();

        if (!moduleError && module) {
          moduleId = module.id;
          console.log('Found module by slug:', moduleSlug, 'ID:', moduleId);
        } else if (moduleError && moduleError.code === '42703') {
          // Column 'slug' doesn't exist, skip to fallback
          console.log('Slug column does not exist, using fallback');
          throw new Error('Slug column not found');
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
              .maybeSingle();

            if (!moduleError && module) {
              moduleId = module.id;
              console.log('Found module by title:', title, 'ID:', moduleId);
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

      console.log('useModuleAccess: Checking module access for:', moduleSlug, 'moduleId:', moduleId, 'userId:', user.id);
      
      const { data, error } = await supabase
        .from('user_module_subscriptions')
        .select('status, end_date, billing_cycle')
        .eq('user_id', user.id)
        .eq('module_id', moduleId)
        .eq('status', 'active')
        .maybeSingle();

      if (error) {
        console.warn('useModuleAccess: Module access query error for module:', moduleSlug, 'ID:', moduleId, error);
        return { hasAccess: false };
      }

      console.log('useModuleAccess: Module access query result:', data);

      if (!data) {
        console.log('useModuleAccess: No active subscription found for module:', moduleSlug);
        return { hasAccess: false };
      }

      // Check if subscription is still valid
      const endDate = new Date(data.end_date);
      const now = new Date();
      const isExpired = endDate < now;

      console.log('useModuleAccess: Subscription check - endDate:', data.end_date, 'now:', now.toISOString(), 'isExpired:', isExpired);

      const result = {
        hasAccess: !isExpired,
        subscriptionStatus: isExpired ? 'expired' : 'active',
        endDate: data.end_date,
        billingCycle: data.billing_cycle
      };

      console.log('useModuleAccess: Final result for module:', moduleSlug, result);
      return result;
    },
    enabled: !!user && !!moduleSlug,
    staleTime: 1000 * 30, // 30 seconds for faster updates
    retry: 1, // Only retry once
    retryDelay: 1000, // Wait 1 second before retry
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

      console.log('Fetching all module access for user:', user.id);

      // Get all active subscriptions with module details
      const { data: subscriptions, error } = await supabase
        .from('user_module_subscriptions')
        .select(`
          module_id, 
          status, 
          end_date, 
          billing_cycle,
          modules!inner(
            id,
            title,
            slug
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (error) {
        console.warn('All module access query error:', error);
        return {};
      }

      if (!subscriptions) {
        console.log('No subscriptions found for user');
        return {};
      }

      console.log('Found subscriptions:', subscriptions);

      const accessMap: Record<string, ModuleAccess> = {};
      const now = new Date();

      subscriptions.forEach(subscription => {
        const endDate = new Date(subscription.end_date);
        const isExpired = endDate < now;
        
        // Get module info
        const module = (subscription as any).modules;
        if (!module) return;

        // Use slug if available, otherwise map by title
        let moduleKey = module.slug;
        
        if (!moduleKey) {
          // Map by title as fallback
          const titleMap: Record<string, string> = {
            'Leveringsbonnen Beheer': 'delivery-notes',
            'Barcode Scanner': 'scanning',
            'Geavanceerde Analytics': 'advanced-analytics',
            'Automatische Herbestelling': 'auto-reorder',
            'E-commerce Integratie': 'ecommerce-integration',
            'Premium Support': 'premium-support'
          };
          moduleKey = titleMap[module.title] || module.id;
        }

        if (moduleKey) {
          accessMap[moduleKey] = {
            hasAccess: !isExpired,
            subscriptionStatus: isExpired ? 'expired' : 'active',
            endDate: subscription.end_date,
            billingCycle: subscription.billing_cycle
          };
          
          console.log(`Module access set for ${moduleKey}:`, accessMap[moduleKey]);
        }
      });

      console.log('Final access map:', accessMap);
      return accessMap;
    },
    enabled: !!user,
    staleTime: 1000 * 30, // 30 seconds for faster updates
  });
};
