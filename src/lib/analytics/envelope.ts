import { APP_VERSION, detectDeviceType } from '@/lib/events/device';
import { getOrCreateSessionId } from '@/lib/events/sessionStorage';
import { getOrCreateAnonymousId } from './anonymousId';
import {
  EVENT_CATEGORY_MAP,
  normalizeEventName,
  toDbEventCategory,
  type AnalyticsEventName,
} from './catalog';
import { buildIdempotencyKey } from './dedup';
import { getAnalyticsContext } from './context';
import { surfaceFromPathname } from './surfaces';
import type { AnalyticsEnvelope, AnalyticsSource, TrackOptions } from './types';

export function buildEnvelope(
  eventName: string,
  options: TrackOptions = {},
  source: AnalyticsSource = 'web',
): AnalyticsEnvelope | null {
  if (typeof window === 'undefined') return null;

  const ctx = getAnalyticsContext();
  const userId = options.userId ?? ctx.userId;
  const normalized = normalizeEventName(eventName);
  const category = EVENT_CATEGORY_MAP[normalized] ?? 'interaction';
  const sessionId = options.sessionId ?? getOrCreateSessionId();
  const route = window.location.pathname;

  const idempotency_key =
    options.idempotencyKey ??
    buildIdempotencyKey([sessionId, normalized, route, Date.now()]);

  const org_id = options.orgId ?? ctx.orgId ?? userId ?? getOrCreateAnonymousId();

  return {
    event: normalized,
    category,
    timestamp: new Date().toISOString(),
    anonymous_id: getOrCreateAnonymousId(),
    user_id: userId ?? null,
    session_id: sessionId,
    org_id,
    branch_id: options.branchId ?? ctx.branchId ?? null,
    source,
    app_version: APP_VERSION,
    request_id: options.requestId,
    idempotency_key,
    context: {
      route,
      referrer: document.referrer || undefined,
      device: detectDeviceType(),
      viewport: { w: window.innerWidth, h: window.innerHeight },
      locale: navigator.language,
    },
    properties: {
      page: route,
      route,
      surface: surfaceFromPathname(route),
      ...options.properties,
    },
  };
}

export function envelopeToDbRow(envelope: AnalyticsEnvelope) {
  const eventName = envelope.event as AnalyticsEventName;
  return {
    user_id: envelope.user_id,
    branch_id: envelope.branch_id,
    org_id: envelope.org_id,
    anonymous_id: envelope.anonymous_id,
    event_name: envelope.event,
    event_type: toDbEventCategory(eventName, envelope.category),
    category: envelope.category,
    properties: envelope.properties,
    timestamp: envelope.timestamp,
    session_id: envelope.session_id,
    device_type: envelope.context.device,
    app_version: envelope.app_version,
    experiment_id: null,
    variant: null,
    idempotency_key: envelope.idempotency_key,
    request_id: envelope.request_id ?? null,
    source: envelope.source,
  };
}
