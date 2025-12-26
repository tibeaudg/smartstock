/**
 * Utility functions for tracking referral information
 */

export interface ReferralInfo {
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

/**
 * Captures referral information from the current page
 * Includes document.referrer and UTM parameters from URL
 */
export function captureReferralInfo(): string {
  const referralInfo: ReferralInfo = {};
  
  // Capture document.referrer if available
  if (typeof document !== 'undefined' && document.referrer) {
    referralInfo.referrer = document.referrer;
  }
  
  // Capture UTM parameters from URL
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.get('utm_source')) {
      referralInfo.utm_source = urlParams.get('utm_source') || undefined;
    }
    if (urlParams.get('utm_medium')) {
      referralInfo.utm_medium = urlParams.get('utm_medium') || undefined;
    }
    if (urlParams.get('utm_campaign')) {
      referralInfo.utm_campaign = urlParams.get('utm_campaign') || undefined;
    }
    if (urlParams.get('utm_term')) {
      referralInfo.utm_term = urlParams.get('utm_term') || undefined;
    }
    if (urlParams.get('utm_content')) {
      referralInfo.utm_content = urlParams.get('utm_content') || undefined;
    }
  }
  
  // Also check localStorage for stored referral info (if user visited before signup)
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const storedReferral = localStorage.getItem('referral_info');
      if (storedReferral) {
        const parsed = JSON.parse(storedReferral);
        // Merge stored info (prefer stored over current if stored exists)
        if (parsed.referrer && !referralInfo.referrer) {
          referralInfo.referrer = parsed.referrer;
        }
        Object.keys(parsed).forEach(key => {
          if (key.startsWith('utm_') && parsed[key] && !referralInfo[key as keyof ReferralInfo]) {
            referralInfo[key as keyof ReferralInfo] = parsed[key];
          }
        });
      }
    } catch (e) {
      console.warn('Error reading stored referral info:', e);
    }
  }
  
  // Store referral info in localStorage for later use (before signup)
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.setItem('referral_info', JSON.stringify(referralInfo));
    } catch (e) {
      console.warn('Error storing referral info:', e);
    }
  }
  
  // Return as JSON string for database storage
  return JSON.stringify(referralInfo);
}

/**
 * Gets referral information from a stored JSON string
 */
export function parseReferralInfo(referralSource?: string | null): ReferralInfo | null {
  if (!referralSource) return null;
  
  try {
    return JSON.parse(referralSource) as ReferralInfo;
  } catch (e) {
    console.warn('Error parsing referral info:', e);
    return null;
  }
}

/**
 * Formats referral info for display
 */
export function formatReferralInfo(referralSource?: string | null): string {
  const info = parseReferralInfo(referralSource);
  if (!info) return 'Direct';
  
  const parts: string[] = [];
  
  if (info.utm_source) {
    parts.push(`Source: ${info.utm_source}`);
  }
  if (info.utm_medium) {
    parts.push(`Medium: ${info.utm_medium}`);
  }
  if (info.utm_campaign) {
    parts.push(`Campaign: ${info.utm_campaign}`);
  }
  if (info.referrer && !info.referrer.startsWith(window.location.origin)) {
    try {
      const url = new URL(info.referrer);
      parts.push(`From: ${url.hostname}`);
    } catch (e) {
      parts.push(`From: ${info.referrer}`);
    }
  }
  
  return parts.length > 0 ? parts.join(', ') : (info.referrer || 'Direct');
}

