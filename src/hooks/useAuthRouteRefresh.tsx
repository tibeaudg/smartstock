import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook that forces a full browser refresh when the window regains focus
 * on authenticated routes (routes after /auth like /dashboard, /admin, etc.)
 * This ensures fresh data and prevents stale data issues.
 */
export const useAuthRouteRefresh = () => {
  const location = useLocation();
  const isProcessingRef = useRef(false);
  const wasHiddenRef = useRef(false);

  useEffect(() => {
    // Check if current route is an authenticated route
    const isAuthenticatedRoute = (pathname: string): boolean => {
      // Routes that require authentication (after /auth)
      const authRoutes = ['/dashboard', '/admin'];
      
      // Exclude the auth page itself
      if (pathname === '/auth' || pathname.startsWith('/auth/')) {
        return false;
      }
      
      // Check if pathname starts with any authenticated route
      return authRoutes.some(route => pathname.startsWith(route));
    };

    if (!isAuthenticatedRoute(location.pathname)) {
      return;
    }

    const handleRefresh = () => {
      // Prevent multiple simultaneous refreshes
      if (isProcessingRef.current) {
        return;
      }

      isProcessingRef.current = true;

      // Force a full browser refresh
      console.log('[AuthRouteRefresh] Window refocused on authenticated route, refreshing...');
      window.location.reload();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page became hidden - mark that we were hidden
        wasHiddenRef.current = true;
      } else if (wasHiddenRef.current) {
        // Page became visible again after being hidden - refresh
        wasHiddenRef.current = false;
        handleRefresh();
      }
    };

    const handleFocus = () => {
      // Only refresh if we were previously hidden (user switched tabs/windows)
      // This prevents refresh when clicking within the same window
      if (wasHiddenRef.current) {
        wasHiddenRef.current = false;
        handleRefresh();
      }
    };

    // Listen to both window focus and visibility change events
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      // Reset flags when unmounting or route changes
      isProcessingRef.current = false;
      wasHiddenRef.current = false;
    };
  }, [location.pathname]);
};

