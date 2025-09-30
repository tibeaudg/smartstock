import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  identifyUser, 
  setTag, 
  trackEvent, 
  upgradeSession,
  setCookieConsent 
} from '../services/clarityService';
import { useAuth } from './useAuth';

/**
 * Hook to integrate Microsoft Clarity with your app
 * Automatically tracks page views and identifies users
 */
export const useClarity = () => {
  const { user, userProfile } = useAuth();
  const location = useLocation();

  // Identify user when authenticated
  useEffect(() => {
    if (user && userProfile) {
      const customId = user.id;
      const friendlyName = userProfile.full_name || user.email || 'Anonymous';
      
      // Identify user in Clarity
      identifyUser(customId, undefined, undefined, friendlyName);

      // Set user tags
      if (userProfile.role) {
        setTag('role', userProfile.role);
      }
      
      if (userProfile.subscription_tier) {
        setTag('subscription_tier', userProfile.subscription_tier);
      }

      if (userProfile.blocked) {
        setTag('account_status', 'blocked');
      } else {
        setTag('account_status', 'active');
      }
    }
  }, [user, userProfile]);

  // Track page views
  useEffect(() => {
    // Call identify on each page view (as recommended by Clarity)
    if (user) {
      identifyUser(user.id);
    }

    // Set custom page tag
    setTag('page', location.pathname);

    // Track page view event
    trackEvent(`pageview:${location.pathname}`);
  }, [location.pathname, user]);

  return {
    identifyUser,
    setTag,
    trackEvent,
    upgradeSession,
    setCookieConsent,
  };
};

export default useClarity;
