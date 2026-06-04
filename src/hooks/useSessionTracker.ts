import { useEffect, useRef } from 'react';
import { useAuth } from './useAuth';
import { shouldExcludeFromProductAnalytics } from '@/lib/analytics/exclusions';
import { useOptionalBranchId } from './useBranches';
import { supabase } from '@/integrations/supabase/client';
import { detectDeviceType } from '@/lib/events/device';
import { trackEvent } from '@/lib/events/trackEvent';
import {
  clearSessionId,
  getLastSessionEnd,
  getOrCreateSessionId,
  setLastSessionEnd,
} from '@/lib/events/sessionStorage';

const RETURN_VISIT_GAP_MS = 24 * 60 * 60 * 1000;

export function useSessionTracker() {
  const { user, userProfile } = useAuth();
  const branchId = useOptionalBranchId();
  const sessionIdRef = useRef<string | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!user?.id) return;

    const sessionId = getOrCreateSessionId();
    sessionIdRef.current = sessionId;
    startTimeRef.current = Date.now();
    const branchIdVal = branchId;
    const entryPath = window.location.pathname;
    if (
      shouldExcludeFromProductAnalytics({
        isOwner: userProfile?.is_owner === true,
        pathname: entryPath,
      })
    ) {
      return;
    }

    const lastEnd = getLastSessionEnd();
    const isReturnVisit =
      lastEnd !== null && Date.now() - lastEnd > RETURN_VISIT_GAP_MS;

    const deviceType = detectDeviceType();

    supabase.from('sessions').insert({
      session_id: sessionId,
      user_id: user.id,
      branch_id: branchIdVal,
      start_time: new Date().toISOString(),
      entry_event: entryPath,
      device_type: deviceType,
    }).then(() => {});

    trackEvent('session_started', {
      userId: user.id,
      branchId: branchIdVal,
      sessionId,
      properties: { entry_path: entryPath },
    });

    if (isReturnVisit) {
      trackEvent('return_visit', {
        userId: user.id,
        branchId: branchIdVal,
        sessionId,
        properties: {
          gap_hours: Math.round((Date.now() - (lastEnd ?? 0)) / 3600000),
        },
      });
    }

    const endSession = () => {
      const sid = sessionIdRef.current;
      if (!sid || !user.id) return;
      const endTime = Date.now();
      const durationSec = Math.round((endTime - startTimeRef.current) / 1000);
      const exitPath = window.location.pathname;

      supabase
        .from('sessions')
        .update({
          end_time: new Date(endTime).toISOString(),
          duration_sec: durationSec,
          exit_event: exitPath,
        })
        .eq('session_id', sid)
        .eq('user_id', user.id)
        .then(() => {});

      setLastSessionEnd(endTime);
      clearSessionId();
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') endSession();
    };

    window.addEventListener('beforeunload', endSession);
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', endSession);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [user?.id, branchId, userProfile?.is_owner]);
}
