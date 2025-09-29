import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

export const useOnboarding = () => {
  const { user, userProfile } = useAuth();
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!user || !userProfile) {
        setLoading(false);
        return;
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
          setNeedsOnboarding(false);
        } else {
          setNeedsOnboarding(!data?.onboarding_completed);
        }
      } catch (error) {
        console.error('Error in onboarding check:', error);
        setNeedsOnboarding(false);
      } finally {
        setLoading(false);
      }
    };

    checkOnboardingStatus();
  }, [user, userProfile]);

  const markOnboardingComplete = async () => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('id', user.id);

      if (error) throw error;
      
      setNeedsOnboarding(false);
      return true;
    } catch (error) {
      console.error('Error marking onboarding complete:', error);
      return false;
    }
  };

  return {
    needsOnboarding,
    loading,
    markOnboardingComplete
  };
};
