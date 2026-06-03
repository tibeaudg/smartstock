import { useEffect, useRef } from 'react';
import { useAppEventTracker } from '@/hooks/useAppEventTracker';

export function useActivationViewTracking(
  source: 'dashboard' | 'products',
  enabled: boolean
) {
  const { track } = useAppEventTracker();
  const tracked = useRef(false);

  useEffect(() => {
    if (!enabled || tracked.current) return;
    tracked.current = true;
    track('activation_view', source, { source });
  }, [enabled, source, track]);
}
