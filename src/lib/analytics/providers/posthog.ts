import { canUseAnalytics } from '@/utils/cookieConsentManager';
import type { AnalyticsEnvelope } from '../types';

let posthogClient: {
  capture: (event: string, properties?: Record<string, unknown>) => void;
  identify: (distinctId: string, properties?: Record<string, unknown>) => void;
  reset: () => void;
} | null = null;

let initialized = false;

export async function initPostHog(): Promise<void> {
  if (initialized || typeof window === 'undefined') return;
  const key = import.meta.env.VITE_POSTHOG_KEY;
  const host = import.meta.env.VITE_POSTHOG_HOST ?? 'https://eu.i.posthog.com';
  if (!key) return;

  try {
    const { default: posthog } = await import('posthog-js');
    posthog.init(key, {
      api_host: host,
      person_profiles: 'identified_only',
      capture_pageview: false,
      capture_pageleave: false,
      persistence: 'localStorage',
      loaded: (ph) => {
        if (!canUseAnalytics()) ph.opt_out_capturing();
      },
    });
    posthogClient = posthog;
    initialized = true;
  } catch (e) {
    console.warn('[analytics] PostHog init failed:', e);
  }
}

export function capturePostHog(envelope: AnalyticsEnvelope): void {
  if (!canUseAnalytics() || !posthogClient) return;

  posthogClient.capture(envelope.event, {
    ...envelope.properties,
    $insert_id: envelope.idempotency_key,
    category: envelope.category,
    surface: envelope.properties.surface,
    org_id: envelope.org_id,
    branch_id: envelope.branch_id,
    session_id: envelope.session_id,
    request_id: envelope.request_id,
    app_version: envelope.app_version,
    route: envelope.context.route,
    device: envelope.context.device,
  });
}

export function identifyPostHog(
  userId: string,
  anonymousId: string,
  traits?: Record<string, unknown>,
): void {
  if (!canUseAnalytics() || !posthogClient) return;
  posthogClient.identify(userId, { ...traits, anonymous_id: anonymousId });
}

export function resetPostHog(): void {
  posthogClient?.reset();
}

export function setPostHogOptIn(enabled: boolean): void {
  if (!posthogClient) return;
  if (enabled) {
    (posthogClient as { opt_in_capturing?: () => void }).opt_in_capturing?.();
  } else {
    (posthogClient as { opt_out_capturing?: () => void }).opt_out_capturing?.();
  }
}

export function getPostHogDistinctId(): string | null {
  if (!posthogClient) return null;
  return (posthogClient as { get_distinct_id?: () => string }).get_distinct_id?.() ?? null;
}
