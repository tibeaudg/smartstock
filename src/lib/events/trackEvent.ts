import { supabase } from '@/integrations/supabase/client';
import type { EventName } from './catalog';
import { getEventCategory } from './catalog';
import { APP_VERSION, detectDeviceType } from './device';
import { getOrCreateSessionId } from './sessionStorage';

export interface TrackEventOptions {
  userId: string;
  branchId?: string | null;
  properties?: Record<string, unknown>;
  sessionId?: string;
  experimentId?: string;
  variant?: string;
}

export function trackEvent(
  eventName: EventName,
  options: TrackEventOptions,
): void {
  const { userId, branchId, properties, sessionId, experimentId, variant } = options;
  if (!userId) return;

  const payload = {
    user_id: userId,
    branch_id: branchId ?? null,
    event_name: eventName,
    event_type: getEventCategory(eventName),
    properties: {
      page: window.location.pathname,
      ...properties,
    },
    session_id: sessionId ?? getOrCreateSessionId(),
    device_type: detectDeviceType(),
    app_version: APP_VERSION,
    experiment_id: experimentId ?? null,
    variant: variant ?? null,
  };

  supabase.from('events').insert(payload).then(() => {});
}
