import { useCallback } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

export function useAppEventTracker() {
  const { user } = useAuth();

  const track = useCallback(
    (eventType: string, label?: string, metadata?: Record<string, unknown>) => {
      if (!user?.id) return;
      supabase.from('app_events' as any).insert({
        user_id: user.id,
        event_type: eventType,
        page: window.location.pathname,
        label: label ?? eventType,
        metadata: metadata ?? null,
      }).then(() => {});
    },
    [user?.id],
  );

  return { track };
}
