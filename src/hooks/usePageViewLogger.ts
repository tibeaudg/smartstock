import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';
import { analytics } from '@/lib/analytics';
import { isAdminAnalyticsPath } from '@/lib/analytics/exclusions';

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

    analytics.trackRoute(path, {
      userId: user.id,
    });
  }, [location.pathname, user?.id]);
}
