import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CORE_ACTION_EVENTS } from '@/lib/analytics/catalog';
import {
  isWithinActivationWindow,
  CORE_EVENT_NAMES,
} from '@/lib/admin/activationMetrics';
import { lastMeaningfulTimestamp, normalizeActivityEvent, type RawActivityEvent } from '@/lib/analytics/timeline';

export interface UserAnalyticsSnapshot {
  userId: string;
  /** Core action within 7 days of signup (matches product-health SQL). */
  activatedWithin7d: boolean;
  /** @deprecated Use activatedWithin7d — kept for callers during migration */
  activated: boolean;
  activationMethod: string | null;
  stuckOnboarding: boolean;
  failedImportRecent: boolean;
  hitErrorsRecent: boolean;
  lastMeaningfulAt: string | null;
  lastSurface: string | null;
}

const ERROR_EVENTS = new Set(['error_captured', 'api_request_failed', 'client_error', 'unhandled_rejection']);
const NAV_EVENTS = new Set(['route_viewed', 'feature_viewed', 'page_view']);

function activationMethodFromEvent(properties: Record<string, unknown> | null): string | null {
  const method = properties?.method ?? properties?.path;
  if (typeof method === 'string' && method.trim()) return method;
  return null;
}

async function fetchRecentEvents(): Promise<RawActivityEvent[]> {
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from('events')
    .select('id, user_id, event_name, category, properties, timestamp, session_id, request_id, idempotency_key')
    .gte('timestamp', since)
    .in('event_name', [
      ...CORE_ACTION_EVENTS,
      'route_viewed',
      'feature_viewed',
      'page_view',
      'import_failed',
      'import_started',
      'error_captured',
      'api_request_failed',
      'client_error',
      'activation_path_selected',
    ])
    .order('timestamp', { ascending: false })
    .limit(5000);

  if (error) throw error;
  return (data ?? []).map((e) => ({
    ...e,
    properties: (e.properties ?? {}) as Record<string, unknown>,
  }));
}

export function buildSnapshotsFromEvents(
  events: RawActivityEvent[],
  users: Array<{ id: string; created_at: string }>,
): Map<string, UserAnalyticsSnapshot> {
  const byUser = new Map<string, RawActivityEvent[]>();
  for (const e of events) {
    if (!e.user_id) continue;
    const list = byUser.get(e.user_id) ?? [];
    list.push(e);
    byUser.set(e.user_id, list);
  }

  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const fortyEightHoursAgo = Date.now() - 48 * 60 * 60 * 1000;
  const result = new Map<string, UserAnalyticsSnapshot>();

  for (const user of users) {
    const userEvents = byUser.get(user.id) ?? [];
    const normalized = userEvents.map(normalizeActivityEvent);

    const coreEvents = normalized
      .filter((e) => CORE_EVENT_NAMES.has(String(e.normalized_name)))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const coreWithin7d = coreEvents.find((e) =>
      isWithinActivationWindow(user.created_at, e.timestamp),
    );

    const activatedWithin7d = !!coreWithin7d;
    const activationMethod = coreWithin7d
      ? activationMethodFromEvent(coreWithin7d.properties)
      : null;

    const hasNav = normalized.some(
      (e) => NAV_EVENTS.has(String(e.normalized_name)) || NAV_EVENTS.has(e.event_name),
    );
    const createdMs = new Date(user.created_at).getTime();
    const stuckOnboarding =
      !activatedWithin7d && hasNav && createdMs < fortyEightHoursAgo;

    const failedImportRecent = userEvents.some(
      (e) =>
        e.event_name === 'import_failed' &&
        new Date(e.timestamp).getTime() >= sevenDaysAgo,
    );

    const hitErrorsRecent = userEvents.some(
      (e) =>
        ERROR_EVENTS.has(e.event_name) &&
        new Date(e.timestamp).getTime() >= sevenDaysAgo,
    );

    const lastNav = normalized
      .filter((e) => e.surface && (NAV_EVENTS.has(String(e.normalized_name)) || NAV_EVENTS.has(e.event_name)))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

    result.set(user.id, {
      userId: user.id,
      activatedWithin7d,
      activated: activatedWithin7d,
      activationMethod,
      stuckOnboarding,
      failedImportRecent,
      hitErrorsRecent,
      lastMeaningfulAt: lastMeaningfulTimestamp(userEvents),
      lastSurface: lastNav?.surface ?? null,
    });
  }

  return result;
}

export function useUserAnalyticsSnapshots(
  users: Array<{ id: string; created_at: string }>,
  enabled: boolean,
) {
  const query = useQuery({
    queryKey: ['userAnalyticsSnapshots', users.length],
    queryFn: fetchRecentEvents,
    enabled: enabled && users.length > 0,
    staleTime: 3 * 60 * 1000,
  });

  const snapshots = useMemo(
    () =>
      query.data
        ? buildSnapshotsFromEvents(query.data, users)
        : new Map<string, UserAnalyticsSnapshot>(),
    [query.data, users],
  );

  return {
    snapshots,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
