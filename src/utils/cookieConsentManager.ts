import { CookiePreferences } from '@/components/CookieConsent';

type TrustedScriptPolicy = {
  createScriptURL: (input: string) => unknown;
};

type TrustedTypesAPI = {
  createPolicy: (
    name: string,
    policy: { createScriptURL: (input: string) => string }
  ) => TrustedScriptPolicy;
};

type FacebookPixelFn = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[];
  loaded?: boolean;
  version?: string;
};

type ExtendedWindow = Window & {
  trustedTypes?: TrustedTypesAPI;
  fbq?: FacebookPixelFn;
  _fbq?: FacebookPixelFn;
};

declare global {
  interface WindowEventMap {
    cookieConsentChanged: CustomEvent<CookiePreferences>;
  }
}

const CONSENT_KEY = 'stockflow_cookie_consent';
const PREFERENCES_KEY = 'stockflow_cookie_preferences';

// Singleton policy instance to avoid recreating
let trustedTypesPolicy: TrustedScriptPolicy | null = null;

/**
 * Create or get Trusted Types policy for script loading
 * This is required to safely load external scripts
 */
const getTrustedTypesPolicy = (): TrustedScriptPolicy | null => {
  if (trustedTypesPolicy) {
    return trustedTypesPolicy;
  }

  if (typeof window === 'undefined') {
    return null;
  }

  const win = window as unknown as ExtendedWindow;
  const trustedTypes = win.trustedTypes;

  if (!trustedTypes) {
    return null;
  }

  try {
    const policy = trustedTypes.createPolicy('stockflow-scripts', {
      createScriptURL: (input: string) => {
        const allowedDomains = ['https://connect.facebook.net'];

        if (allowedDomains.some(domain => input.startsWith(domain))) {
          return input;
        }

        throw new Error('Untrusted script URL: ' + input);
      }
    });

    trustedTypesPolicy = policy as unknown as TrustedScriptPolicy;
    return trustedTypesPolicy;
  } catch (e) {
    console.warn('[Trusted Types] Could not create policy:', e);
    return null;
  }
};

/**
 * Create Trusted Types policy for script loading
 * This is required to safely load external scripts
 */
const createTrustedScriptURL = (url: string): string => {
  const policy = getTrustedTypesPolicy();
  
  if (policy) {
    try {
      const trustedUrl = policy.createScriptURL(url);
      return typeof trustedUrl === 'string' ? trustedUrl : String(trustedUrl);
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
 * Load Facebook Pixel
 */
export const loadFacebookPixel = (): void => {
  if (!canUseMarketing()) {
    console.log('[Cookie Consent] Marketing cookies not allowed - Facebook Pixel not loaded');
    return;
  }

  const win = window as unknown as ExtendedWindow;

  if (win.fbq) {
    console.log('[Cookie Consent] Facebook Pixel already loaded');
    return;
  }

  const fbq: FacebookPixelFn = (...args: unknown[]) => {
    if (fbq.callMethod) {
      fbq.callMethod(...args);
    } else {
      fbq.queue.push(args);
    }
  };
  fbq.queue = [];
  fbq.loaded = true;
  fbq.version = '2.0';

  win.fbq = fbq;
  win._fbq = fbq;

  const fbScript = document.createElement('script');
  fbScript.async = true;
  const trustedFbUrl = createTrustedScriptURL('https://connect.facebook.net/en_US/fbevents.js');
  fbScript.src = trustedFbUrl;

  fbScript.onload = () => {
    const pixel = win.fbq;
    if (pixel) {
      pixel('init', '1788618995199125', {
        external_id: undefined,
      });
      pixel('track', 'PageView');
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

  // Load marketing scripts (Facebook Pixel)
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
  // Remove Facebook Pixel script
  const fbScript = document.querySelector('script[src*="connect.facebook.net"]');
  if (fbScript) {
    fbScript.remove();
  }

  // Clear Facebook Pixel
  const win = window as unknown as ExtendedWindow;
  if (win.fbq) {
    delete win.fbq;
  }
  if (win._fbq) {
    delete win._fbq;
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

  window.addEventListener('cookieConsentChanged', handler);

  // Return cleanup function
  return () => {
    window.removeEventListener('cookieConsentChanged', handler);
  };
};

// Stripe is no longer used - platform is completely free

