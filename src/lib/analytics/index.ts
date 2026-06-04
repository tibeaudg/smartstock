import { getOrCreateAnonymousId } from './anonymousId';
import { normalizeEventName } from './catalog';
import {
  setAnalyticsContext,
  getAnalyticsContext,
  clearAnalyticsContext,
} from './context';
import { shouldDedupe, shouldDebounceRoute, buildIdempotencyKey } from './dedup';
import { buildEnvelope } from './envelope';
import { resolveOrgId } from './orgResolver';
import { surfaceFromPathname } from './surfaces';
import { shouldExcludeFromProductAnalytics } from './exclusions';
import { sendToSupabase } from './providers/supabase';
import {
  capturePostHog,
  identifyPostHog,
  initPostHog,
  resetPostHog,
  setPostHogOptIn,
} from './providers/posthog';
import {
  captureSentryException,
  initSentry,
  setSentryUser,
} from './providers/sentry';
import type { AnalyticsSource, TrackOptions } from './types';

export { AnalyticsEvents } from './catalog';
export { emitActivationOnce } from './activation';
export { startOperation, endOperation } from './operations';
export { surfaceFromPathname } from './surfaces';
export { setAnalyticsContext, getAnalyticsContext, clearAnalyticsContext };
export { createRequestId, getCurrentRequestId, setCurrentRequestId } from './requestId';
export { initPostHog, setPostHogOptIn, getPostHogDistinctId } from './providers/posthog';
export { initSentry, captureSentryException } from './providers/sentry';

async function flushEnvelope(
  eventName: string,
  options: TrackOptions,
  source: AnalyticsSource = 'web',
): Promise<void> {
  const ctx = getAnalyticsContext();
  const pathname =
    typeof window !== 'undefined' ? window.location.pathname : undefined;
  if (
    shouldExcludeFromProductAnalytics({
      isOwner: ctx.isOwner,
      pathname,
    })
  ) {
    return;
  }

  let orgId = options.orgId ?? ctx.orgId;
  const userId = options.userId ?? ctx.userId;

  if (userId && !orgId) {
    orgId = await resolveOrgId(userId, options.branchId ?? ctx.branchId);
    setAnalyticsContext({ orgId });
  }

  const envelope = buildEnvelope(eventName, { ...options, orgId: orgId ?? userId }, source);
  if (!envelope) return;

  if (!options.force && shouldDedupe(envelope.idempotency_key)) return;

  const tasks: Promise<void>[] = [sendToSupabase(envelope)];
  capturePostHog(envelope);

  void Promise.allSettled(tasks);
}

export const analytics = {
  async init(): Promise<void> {
    await Promise.all([initPostHog(), initSentry()]);
  },

  track(eventName: string, options: TrackOptions = {}): void {
    void flushEnvelope(eventName, options);
  },

  trackRoute(pathname?: string, options: TrackOptions = {}): void {
    const route = pathname ?? (typeof window !== 'undefined' ? window.location.pathname : '/');
    const ctx = getAnalyticsContext();
    const sessionId = options.sessionId;
    const sessionKey = sessionId ?? 'route';

    if (shouldDebounceRoute(sessionKey, route) && !options.force) return;

    const surface = surfaceFromPathname(route);
    const idempotencyKey = buildIdempotencyKey([
      sessionKey,
      'route_viewed',
      route,
      Math.floor(Date.now() / 2000),
    ]);

    this.track('route_viewed', {
      ...options,
      idempotencyKey,
      properties: {
        surface,
        route,
        ...options.properties,
      },
    });
  },

  identify(userId: string, traits?: Record<string, unknown>): void {
    const anonymousId = getOrCreateAnonymousId();
    setAnalyticsContext({ userId });
    setSentryUser(userId, traits?.org_id as string | undefined);
    identifyPostHog(userId, anonymousId, traits);
  },

  reset(): void {
    clearAnalyticsContext();
    resetPostHog();
    setSentryUser(null);
  },


  async trackError(
    error: Error,
    options: TrackOptions & { error_code?: string; http_status?: number; endpoint?: string },
  ): Promise<void> {
    const ctx = getAnalyticsContext();
    await captureSentryException(error, {
      event: 'error_captured',
      user_id: options.userId ?? ctx.userId,
      request_id: options.requestId,
      properties: options.properties,
    } as Parameters<typeof captureSentryException>[1]);

    this.track('error_captured', {
      ...options,
      properties: {
        message: error.message,
        error_code: options.error_code ?? error.name,
        http_status: options.http_status,
        endpoint: options.endpoint,
        ...options.properties,
      },
    });
  },
};

export { analytics as default };
