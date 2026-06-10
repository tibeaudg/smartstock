import { GOOGLE_ADS_CONVERSION_SEND_TO } from '@/config/googleAds';

const DEDUP_PREFIX = 'sf_gads_signup_conversion:';

function isProductionHost(): boolean {
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname;
  return host !== 'localhost' && host !== '127.0.0.1';
}

function hasTrackedSignup(userId: string): boolean {
  try {
    return localStorage.getItem(`${DEDUP_PREFIX}${userId}`) === '1';
  } catch {
    return false;
  }
}

function markSignupTracked(userId: string): void {
  try {
    localStorage.setItem(`${DEDUP_PREFIX}${userId}`, '1');
  } catch {
    // ignore
  }
}

/** Fire Google Ads signup conversion once per user (requires gtag from index.html). */
export function trackGoogleAdsSignupConversion(userId: string): void {
  if (!userId || !isProductionHost()) return;
  if (hasTrackedSignup(userId)) return;
  if (typeof window.gtag !== 'function') return;

  markSignupTracked(userId);
  window.gtag('event', 'conversion', {
    send_to: GOOGLE_ADS_CONVERSION_SEND_TO,
  });
}
