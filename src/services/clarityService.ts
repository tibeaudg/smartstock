import Clarity from '@microsoft/clarity';
import { shouldDisableTracking } from '../config/tracking';

// Clarity configuration
const CLARITY_PROJECT_ID = import.meta.env.VITE_CLARITY_PROJECT_ID;

/**
 * Initialize Microsoft Clarity
 */
export const initClarity = (): void => {
  // Check if tracking should be disabled
  if (shouldDisableTracking()) {
    console.log('[Clarity] Tracking disabled for this environment');
    return;
  }

  // Check if Clarity project ID is configured
  if (!CLARITY_PROJECT_ID) {
    console.warn('[Clarity] Project ID not configured. Set VITE_CLARITY_PROJECT_ID in your environment variables.');
    return;
  }

  try {
    Clarity.init(CLARITY_PROJECT_ID);
    console.log('[Clarity] Initialized successfully');
  } catch (error) {
    console.error('[Clarity] Failed to initialize:', error);
  }
};

/**
 * Identify user in Clarity
 * @param customId - Unique identifier for the customer (required)
 * @param customSessionId - Custom session identifier (optional)
 * @param customPageId - Custom page identifier (optional)
 * @param friendlyName - Friendly name for the customer (optional)
 */
export const identifyUser = (
  customId: string,
  customSessionId?: string,
  customPageId?: string,
  friendlyName?: string
): void => {
  if (shouldDisableTracking() || !CLARITY_PROJECT_ID) return;

  try {
    Clarity.identify(customId, customSessionId, customPageId, friendlyName);
    console.log('[Clarity] User identified:', customId);
  } catch (error) {
    console.error('[Clarity] Failed to identify user:', error);
  }
};

/**
 * Set custom tag in Clarity
 * @param key - Tag key
 * @param value - Tag value(s)
 */
export const setTag = (key: string, value: string | string[]): void => {
  if (shouldDisableTracking() || !CLARITY_PROJECT_ID) return;

  try {
    Clarity.setTag(key, value);
    console.log('[Clarity] Tag set:', key, value);
  } catch (error) {
    console.error('[Clarity] Failed to set tag:', error);
  }
};

/**
 * Track custom event in Clarity
 * @param eventName - Name of the event
 */
export const trackEvent = (eventName: string): void => {
  if (shouldDisableTracking() || !CLARITY_PROJECT_ID) return;

  try {
    Clarity.event(eventName);
    console.log('[Clarity] Event tracked:', eventName);
  } catch (error) {
    console.error('[Clarity] Failed to track event:', error);
  }
};

/**
 * Set cookie consent for Clarity
 * @param hasConsent - Whether user has given consent
 */
export const setCookieConsent = (hasConsent: boolean = true): void => {
  if (shouldDisableTracking() || !CLARITY_PROJECT_ID) return;

  try {
    Clarity.consent(hasConsent);
    console.log('[Clarity] Cookie consent set:', hasConsent);
  } catch (error) {
    console.error('[Clarity] Failed to set cookie consent:', error);
  }
};

/**
 * Upgrade session priority in Clarity
 * @param reason - Reason for the upgrade
 */
export const upgradeSession = (reason: string): void => {
  if (shouldDisableTracking() || !CLARITY_PROJECT_ID) return;

  try {
    Clarity.upgrade(reason);
    console.log('[Clarity] Session upgraded:', reason);
  } catch (error) {
    console.error('[Clarity] Failed to upgrade session:', error);
  }
};

export default {
  initClarity,
  identifyUser,
  setTag,
  trackEvent,
  setCookieConsent,
  upgradeSession,
};
