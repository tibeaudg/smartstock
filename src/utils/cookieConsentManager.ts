import { CookiePreferences } from '@/components/CookieConsent';

const CONSENT_KEY = 'stockflow_cookie_consent';
const PREFERENCES_KEY = 'stockflow_cookie_preferences';

// Singleton policy instance to avoid recreating
let trustedTypesPolicy: unknown = null;

/**
 * Create or get Trusted Types policy for script loading
 * This is required to safely load external scripts
 */
const getTrustedTypesPolicy = () => {
  if (trustedTypesPolicy) {
    return trustedTypesPolicy;
  }
  
  if (typeof window === 'undefined' || !('trustedTypes' in window)) {
    return null;
  }

  try {
    // @ts-expect-error - trustedTypes is not yet in all TypeScript definitions
    trustedTypesPolicy = window.trustedTypes.createPolicy('stockflow-scripts', {
      createScriptURL: (input: string) => {
        // Only allow our trusted domains
        const allowedDomains = [
          'https://www.googletagmanager.com',
          'https://connect.facebook.net'
        ];
        
        if (allowedDomains.some(domain => input.startsWith(domain))) {
          return input;
        }
        
        throw new Error('Untrusted script URL: ' + input);
      }
    });
    
    return trustedTypesPolicy;
  } catch (e) {
    // Policy might already exist
    console.warn('[Trusted Types] Could not create policy:', e);
    return null;
  }
};

/**
 * Create Trusted Types policy for script loading
 * This is required to safely load external scripts
 */
const createTrustedScriptURL = (url: string): string | TrustedScriptURL => {
  const policy = getTrustedTypesPolicy();
  
  if (policy) {
    try {
      return policy.createScriptURL(url);
    } catch (e) {
      console.error('[Trusted Types] Failed to create trusted URL:', e);
    }
  }
  
  // If Trusted Types not supported or failed, return raw URL
  // This allows the code to work in browsers without Trusted Types
  return url;
};

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
    return;
  }

  // Check if already loaded
  if (document.querySelector('script[src*="googletagmanager.com/gtag"]')) {
    return;
  }

  const script = document.createElement('script');
  script.async = true;
  // Use trusted script URL to comply with Trusted Types policy
  const trustedUrl = createTrustedScriptURL('https://www.googletagmanager.com/gtag/js?id=AW-17574614935');
  // @ts-expect-error - TypeScript doesn't recognize TrustedScriptURL yet
  script.src = trustedUrl;
  script.onload = () => {
    // @ts-expect-error - Google Tag Manager types not available
    window.dataLayer = window.dataLayer || [];
    // @ts-expect-error - Google Tag Manager types not available
    function gtag(...args: unknown[]){window.dataLayer.push(args);}
    // @ts-expect-error - Google Tag Manager types not available
    gtag('js', new Date());
    // @ts-expect-error - Google Tag Manager types not available
    gtag('config', 'AW-17574614935', {
      'anonymize_ip': true, // Anonymize IP for privacy
      'allow_ad_personalization_signals': canUseMarketing(),
    });
    // @ts-expect-error - Google Tag Manager types not available
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
  // @ts-expect-error - Facebook Pixel types not available
  if (window.fbq) {
    console.log('[Cookie Consent] Facebook Pixel already loaded');
    return;
  }

  // Initialize Facebook Pixel stub BEFORE loading the script
  // This prevents "fbq is not defined" errors
  // @ts-expect-error - Facebook Pixel initialization code
  (function(f: unknown,b: unknown,e: unknown,v: unknown,n: unknown,t: unknown,s: unknown) {
    if(f.fbq)return;
    n=f.fbq=function(...args: unknown[]){n.callMethod?n.callMethod(...args):n.queue.push(args)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];
  })(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
  
  // Now load the actual Facebook Pixel script
  const fbScript = document.createElement('script');
  fbScript.async = true;
  const trustedFbUrl = createTrustedScriptURL('https://connect.facebook.net/en_US/fbevents.js');
  // @ts-expect-error - TypeScript doesn't recognize TrustedScriptURL yet
  fbScript.src = trustedFbUrl;
  
  fbScript.onload = () => {
    // Initialize and track after script loads
    // @ts-expect-error - Facebook Pixel types not available
    if (window.fbq) {
      // @ts-expect-error - Facebook Pixel types not available
      fbq('init', '1788618995199125', {
        external_id: undefined, // Don't track external IDs without consent
      });
      // @ts-expect-error - Facebook Pixel types not available
      fbq('track', 'PageView');
      console.log('[Cookie Consent] Facebook Pixel loaded successfully');
    }
  };
  
  document.head.appendChild(fbScript);
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
  // @ts-expect-error - Google Tag Manager types not available
  if (window.dataLayer) {
    // @ts-expect-error - Google Tag Manager types not available
    window.dataLayer = [];
  }

  // Clear Facebook Pixel
  // @ts-expect-error - Facebook Pixel types not available
  if (window.fbq) {
    // @ts-expect-error - Facebook Pixel types not available
    delete window.fbq;
    // @ts-expect-error - Facebook Pixel types not available
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

  // @ts-expect-error - Custom event types not available
  window.addEventListener('cookieConsentChanged', handler);

  // Return cleanup function
  return () => {
    // @ts-expect-error - Custom event types not available
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

