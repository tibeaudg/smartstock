import { CookiePreferences } from '@/components/CookieConsent';

const CONSENT_KEY = 'stockflow_cookie_consent';
const PREFERENCES_KEY = 'stockflow_cookie_preferences';

/**
 * Get cookie consent preferences
 */
export const getCookieConsent = (): CookiePreferences | null => {
  if (typeof window === 'undefined') return null;
  
  const consent = localStorage.getItem(CONSENT_KEY);
  if (!consent) return null;
  
  const preferences = localStorage.getItem(PREFERENCES_KEY);
  if (!preferences) return null;
  
  try {
    return JSON.parse(preferences);
  } catch {
    return null;
  }
};

/**
 * Check if user has given consent
 */
export const hasGivenConsent = (): boolean => {
  return localStorage.getItem(CONSENT_KEY) !== null;
};

/**
 * Check if specific cookie category is allowed
 */
export const isCategoryAllowed = (category: keyof CookiePreferences): boolean => {
  const preferences = getCookieConsent();
  if (!preferences) return false;
  return preferences[category] === true;
};

/**
 * Check if analytics cookies are allowed
 */
export const canUseAnalytics = (): boolean => {
  return isCategoryAllowed('analytics');
};

/**
 * Check if marketing cookies are allowed
 */
export const canUseMarketing = (): boolean => {
  return isCategoryAllowed('marketing');
};

/**
 * Check if functional cookies are allowed
 */
export const canUseFunctional = (): boolean => {
  return isCategoryAllowed('functional');
};

/**
 * Load Google Analytics/Ads scripts
 */
export const loadGoogleAds = (): void => {
  if (!canUseMarketing()) {
    console.log('[Cookie Consent] Marketing cookies not allowed - Google Ads not loaded');
    return;
  }

  // Check if already loaded
  if (document.querySelector('script[src*="googletagmanager.com/gtag"]')) {
    console.log('[Cookie Consent] Google Ads already loaded');
    return;
  }

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=AW-17574614935';
  script.onload = () => {
    // @ts-ignore
    window.dataLayer = window.dataLayer || [];
    // @ts-ignore
    function gtag(){window.dataLayer.push(arguments);}
    // @ts-ignore
    gtag('js', new Date());
    // @ts-ignore
    gtag('config', 'AW-17574614935', {
      'anonymize_ip': true, // Anonymize IP for privacy
      'allow_ad_personalization_signals': canUseMarketing(),
    });
    // @ts-ignore
    window.gtag = gtag;
    console.log('[Cookie Consent] Google Ads loaded successfully');
  };
  document.head.appendChild(script);
};

/**
 * Load Facebook Pixel
 */
export const loadFacebookPixel = (): void => {
  if (!canUseMarketing()) {
    console.log('[Cookie Consent] Marketing cookies not allowed - Facebook Pixel not loaded');
    return;
  }

  // Check if already loaded
  // @ts-ignore
  if (window.fbq) {
    console.log('[Cookie Consent] Facebook Pixel already loaded');
    return;
  }

  // Facebook Pixel Code
  // @ts-ignore
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  // @ts-ignore
  fbq('init', '1788618995199125', {
    external_id: undefined, // Don't track external IDs without consent
  });
  // @ts-ignore
  fbq('track', 'PageView');
  console.log('[Cookie Consent] Facebook Pixel loaded successfully');
};

/**
 * Load all marketing scripts based on consent
 */
export const loadMarketingScripts = (): void => {
  if (!canUseMarketing()) {
    console.log('[Cookie Consent] Marketing cookies not allowed - scripts not loaded');
    return;
  }

  loadGoogleAds();
  loadFacebookPixel();
};

/**
 * Initialize tracking based on consent
 * Call this on page load and after consent is given
 */
export const initializeTracking = (): void => {
  // Only proceed if user has given consent
  if (!hasGivenConsent()) {
    console.log('[Cookie Consent] No consent given - tracking not initialized');
    return;
  }

  const preferences = getCookieConsent();
  if (!preferences) {
    console.log('[Cookie Consent] No preferences found - tracking not initialized');
    return;
  }

  console.log('[Cookie Consent] Initializing tracking with preferences:', preferences);

  // Load marketing scripts (Google Ads, Facebook Pixel)
  if (preferences.marketing) {
    loadMarketingScripts();
  }

  // Analytics is handled by useWebsiteTracking hook
  // Functional cookies (Stripe) are loaded on-demand when needed
};

/**
 * Remove all tracking scripts and cookies
 */
export const removeTrackingScripts = (): void => {
  // Remove Google Ads script
  const googleScript = document.querySelector('script[src*="googletagmanager.com/gtag"]');
  if (googleScript) {
    googleScript.remove();
  }

  // Remove Facebook Pixel script
  const fbScript = document.querySelector('script[src*="connect.facebook.net"]');
  if (fbScript) {
    fbScript.remove();
  }

  // Clear dataLayer
  // @ts-ignore
  if (window.dataLayer) {
    // @ts-ignore
    window.dataLayer = [];
  }

  // Clear Facebook Pixel
  // @ts-ignore
  if (window.fbq) {
    // @ts-ignore
    delete window.fbq;
    // @ts-ignore
    delete window._fbq;
  }

  console.log('[Cookie Consent] Tracking scripts removed');
};

/**
 * Listen for consent changes
 */
export const onConsentChange = (callback: (preferences: CookiePreferences) => void): (() => void) => {
  const handler = (event: CustomEvent<CookiePreferences>) => {
    callback(event.detail);
  };

  // @ts-ignore
  window.addEventListener('cookieConsentChanged', handler);

  // Return cleanup function
  return () => {
    // @ts-ignore
    window.removeEventListener('cookieConsentChanged', handler);
  };
};

/**
 * Stripe should only be loaded if functional cookies are allowed
 * This is called by the payment components
 */
export const canLoadStripe = (): boolean => {
  // Allow Stripe if no consent given yet (it's needed for core functionality)
  // OR if functional cookies are explicitly allowed
  if (!hasGivenConsent()) return true;
  return canUseFunctional() || isCategoryAllowed('necessary');
};

