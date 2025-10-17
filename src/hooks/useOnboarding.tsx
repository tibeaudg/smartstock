import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const useOnboarding = () => {
  const { user, userProfile } = useAuth();
  const queryClient = useQueryClient();

  // Fetch onboarding status using React Query
  const {
    data: needsOnboarding = false,
    isLoading: loading,
  } = useQuery<boolean>({
    queryKey: ['onboarding-status', user?.id],
    queryFn: async () => {
      if (!user || !userProfile) {
        return false;
      }

      try {
        // Check if user has completed onboarding
        const { data, error } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error checking onboarding status:', error);
          return false;
        }

        return !data?.onboarding_completed;
      } catch (error) {
        console.error('Error in onboarding check:', error);
        return false;
      }
    },
    enabled: !!user && !!userProfile,
    staleTime: Infinity, // Cache indefinitely - only invalidate when explicitly updated
  });

  // Mutation to mark onboarding as complete
  const markOnboardingCompleteMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('No user');

      const { error } = await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      // Invalidate and refetch onboarding status
      queryClient.invalidateQueries({ queryKey: ['onboarding-status', user?.id] });
    },
    onError: (error) => {
      console.error('Error marking onboarding complete:', error);
    },
  });

  const markOnboardingComplete = async () => {
    try {
      await markOnboardingCompleteMutation.mutateAsync();
      return true;
    } catch (error) {
      return false;
    }
  };

  return {
    needsOnboarding,
    loading,
    markOnboardingComplete
  };
};
