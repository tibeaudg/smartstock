import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';
import { analytics } from '@/lib/analytics';
import { buildIdempotencyKey } from '@/lib/analytics/dedup';
import { isAdminAnalyticsPath } from '@/lib/analytics/exclusions';
import { getOrCreateSessionId } from '@/lib/events/sessionStorage';

export function usePageViewLogger() {
  const location = useLocation();
  const { user } = useAuth();
  const lastPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    const path = location.pathname;
    if (path === lastPathRef.current) return;
    if (!path.startsWith('/dashboard') || isAdminAnalyticsPath(path)) return;
    lastPathRef.current = path;

    const sessionId = getOrCreateSessionId();
    const activationPanel =
      path === '/dashboard' || path === '/dashboard/';

    analytics.trackRoute(path, {
      userId: user.id,
      idempotencyKey: buildIdempotencyKey([
        sessionId,
        'route_viewed',
        path,
        activationPanel ? 'activation_panel' : '',
        Math.floor(Date.now() / 2000),
      ]),
      properties: activationPanel
        ? { activation_panel_visible: true, onboarding_surface: true }
        : undefined,
    });
  }, [location.pathname, user?.id]);
}
