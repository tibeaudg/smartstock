import { useCallback } from 'react';
import { useAuth } from './useAuth';
import { useBranches } from './useBranches';
import { trackEvent } from '@/lib/events/trackEvent';
import type { EventName } from '@/lib/events/catalog';
import { EVENT_CATALOG } from '@/lib/events/catalog';

/** Maps legacy string event types to canonical EventName */
const LEGACY_EVENT_MAP: Record<string, EventName> = {
  page_view: 'feature_viewed',
  activation_first_product: 'first_core_action',
};

function resolveEventName(eventType: string): EventName {
  if (eventType in EVENT_CATALOG) return eventType as EventName;
  if (LEGACY_EVENT_MAP[eventType]) return LEGACY_EVENT_MAP[eventType];
  return eventType as EventName;
}

export function useAppEventTracker() {
  const { user } = useAuth();
  const { activeBranch } = useBranches();

  const track = useCallback(
    (eventType: string, label?: string, metadata?: Record<string, unknown>) => {
      if (!user?.id) return;
      const eventName = resolveEventName(eventType);
      trackEvent(eventName, {
        userId: user.id,
        branchId: activeBranch?.branch_id ?? null,
        properties: {
          label: label ?? eventType,
          ...metadata,
        },
      });
    },
    [user?.id, activeBranch?.branch_id],
  );

  return { track };
}
