import { useCallback } from 'react';
import { useAuth } from './useAuth';
import { useBranches } from './useBranches';
import { analytics, AnalyticsEvents } from '@/lib/analytics';
import { normalizeEventName } from '@/lib/analytics/catalog';

export function useAppEventTracker() {
  const { user } = useAuth();
  const { activeBranch } = useBranches();

  const track = useCallback(
    (eventType: string, _label?: string, metadata?: Record<string, unknown>) => {
      if (!user?.id) return;
      const eventName = normalizeEventName(eventType);
      analytics.track(eventName, {
        userId: user.id,
        branchId: activeBranch?.branch_id ?? null,
        properties: {
          ...metadata,
        },
      });
    },
    [user?.id, activeBranch?.branch_id],
  );

  return { track, AnalyticsEvents };
}
