import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { RawActivityEvent } from '@/lib/analytics/timeline';

export interface UserActivityProfile {
  analytics_consent: boolean | null;
}

async function fetchUserActivityEvents(userId: string): Promise<RawActivityEvent[]> {
  const { data: events, error } = await supabase
    .from('events')
    .select(
      'id, user_id, event_name, category, properties, timestamp, session_id, request_id, idempotency_key',
    )
    .eq('user_id', userId)
    .order('timestamp', { ascending: false })
    .limit(200);

  if (!error && events && events.length > 0) {
    return events.map((e) => ({
      ...e,
      properties: (e.properties ?? {}) as Record<string, unknown>,
    }));
  }

  const { data: legacy, error: legacyError } = await supabase
    .from('app_events' as never)
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(200);

  if (legacyError) throw legacyError;

  return ((legacy || []) as Array<{
    id: string;
    user_id: string;
    event_type: string;
    page: string;
    label: string | null;
    metadata: Record<string, unknown> | null;
    created_at: string;
  }>).map((e) => ({
    id: e.id,
    user_id: e.user_id,
    event_name: e.event_type === 'page_view' ? 'feature_viewed' : e.event_type,
    category: null,
    properties: { page: e.page, label: e.label, route: e.page, ...e.metadata },
    timestamp: e.created_at,
    session_id: null,
    request_id: null,
    idempotency_key: null,
  }));
}

async function fetchUserAnalyticsConsent(userId: string): Promise<boolean | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('analytics_consent')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.warn('[useUserActivityEvents] consent fetch failed:', error.message);
    return null;
  }
  return (data as { analytics_consent?: boolean | null } | null)?.analytics_consent ?? null;
}

export function useUserActivityEvents(userId: string | undefined, enabled: boolean) {
  const eventsQuery = useQuery({
    queryKey: ['userActivityEvents', userId],
    queryFn: () => fetchUserActivityEvents(userId!),
    enabled: !!userId && enabled,
  });

  const consentQuery = useQuery({
    queryKey: ['userAnalyticsConsent', userId],
    queryFn: () => fetchUserAnalyticsConsent(userId!),
    enabled: !!userId && enabled,
  });

  return {
    events: eventsQuery.data ?? [],
    analyticsConsent: consentQuery.data ?? null,
    isLoading: eventsQuery.isLoading || consentQuery.isLoading,
    isError: eventsQuery.isError || consentQuery.isError,
    error: eventsQuery.error ?? consentQuery.error,
    refetch: () => {
      void eventsQuery.refetch();
      void consentQuery.refetch();
    },
  };
}
