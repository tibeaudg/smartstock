import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export function useOnboardingCheck() {
  const { user, userProfile } = useAuth();

  const { data: productCount, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['onboarding-product-count', user?.id],
    queryFn: async () => {
      if (!user) return 0;

      const { count, error } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error counting products for onboarding check:', error);
        return 0;
      }

      return count || 0;
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Only show onboarding if:
  // 1. User is authenticated
  // 2. User profile exists
  // 3. User has 0 products (new user)
  // 4. Onboarding status is null (not started) - NOT 'done' or 'in_progress'
  // This ensures onboarding only triggers once right after signup
  const shouldShowOnboarding =
    !!user &&
    !!userProfile &&
    (productCount ?? 0) === 0 &&
    userProfile.onboarding === null;

  const isLoading = isLoadingProducts || !user || !userProfile;

  return {
    shouldShowOnboarding,
    isLoading,
  };
}

