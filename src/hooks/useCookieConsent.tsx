import { useEffect } from 'react';
import { initializeTracking, onConsentChange } from '@/utils/cookieConsentManager';

/**
 * Hook to initialize tracking based on cookie consent
 * This should be used at the app level
 */
export const useCookieConsent = () => {
  useEffect(() => {
    // Initialize tracking on mount if consent was already given
    initializeTracking();

    // Listen for consent changes and reload tracking
    const cleanup = onConsentChange((preferences) => {
      console.log('[Cookie Consent] Preferences changed:', preferences);
      // Re-initialize tracking with new preferences
      initializeTracking();
    });

    return cleanup;
  }, []);
};

