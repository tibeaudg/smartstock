import { analytics } from '@/lib/analytics';
import type { EventName } from './catalog';

export interface TrackEventOptions {
  userId: string;
  branchId?: string | null;
  orgId?: string | null;
  properties?: Record<string, unknown>;
  sessionId?: string;
  experimentId?: string;
  variant?: string;
  requestId?: string;
  idempotencyKey?: string;
  force?: boolean;
}

/** @deprecated Prefer analytics.track — kept for gradual migration */
export function trackEvent(
  eventName: EventName,
  options: TrackEventOptions,
): void {
  const { userId, branchId, properties, sessionId, orgId, requestId, idempotencyKey, force } =
    options;
  if (!userId) return;

  analytics.track(eventName, {
    userId,
    branchId: branchId ?? null,
    orgId: orgId ?? null,
    sessionId,
    requestId,
    idempotencyKey,
    force,
    properties: {
      experiment_id: options.experimentId ?? null,
      variant: options.variant ?? null,
      ...properties,
    },
  });
}
