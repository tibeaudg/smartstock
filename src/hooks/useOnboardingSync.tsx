import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useOnboardingSync = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Set up real-time subscription for onboarding_responses table
    const channel = supabase
      .channel('onboarding-responses-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'onboarding_responses',
        },
        (payload) => {
          console.log('Onboarding response change detected:', payload);
          
          // Invalidate and refetch onboarding data
          queryClient.invalidateQueries({ queryKey: ['onboardingResponses'] });
          queryClient.invalidateQueries({ queryKey: ['onboardingStats'] });
          
          // Also invalidate user profiles to keep everything in sync
          queryClient.invalidateQueries({ queryKey: ['userProfiles'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
        },
        (payload) => {
          console.log('Profile change detected:', payload);
          
          // Invalidate onboarding data when profiles change
          queryClient.invalidateQueries({ queryKey: ['onboardingResponses'] });
          queryClient.invalidateQueries({ queryKey: ['onboardingStats'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  // Function to manually sync data
  const syncOnboardingData = async () => {
    try {
      // Force refresh of all onboarding-related queries
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['onboardingResponses'] }),
        queryClient.invalidateQueries({ queryKey: ['onboardingStats'] }),
        queryClient.invalidateQueries({ queryKey: ['userProfiles'] })
      ]);
      
      console.log('Onboarding data synchronized');
      return true;
    } catch (error) {
      console.error('Error synchronizing onboarding data:', error);
      return false;
    }
  };

  return {
    syncOnboardingData
  };
};
