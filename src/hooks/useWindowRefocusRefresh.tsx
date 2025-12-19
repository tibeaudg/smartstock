import { useEffect, useRef } from 'react';

/**
 * Simple page refresh on window refocus.
 * 
 * - Listens to both window.focus and visibilitychange events
 * - Force refreshes the page when user returns to the tab
 * - Works everywhere, simple and reliable
 */
export const useWindowRefocusRefresh = () => {
  const wasHiddenRef = useRef<boolean>(false);
  const isProcessingRef = useRef<boolean>(false);

  useEffect(() => {
    const handleRefresh = () => {
      // Prevent multiple simultaneous refreshes
      if (isProcessingRef.current) {
        return;
      }

      isProcessingRef.current = true;
      console.log('[WindowRefocusRefresh] Refreshing page...');
      
      // Force full page reload
      window.location.reload();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page became hidden - mark that we were hidden
        wasHiddenRef.current = true;
        isProcessingRef.current = false;
      } else if (wasHiddenRef.current) {
        // Page became visible again after being hidden - refresh
        wasHiddenRef.current = false;
        handleRefresh();
      }
    };

    const handleFocus = () => {
      // Only refresh if we were previously hidden (user switched tabs/windows)
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
      isProcessingRef.current = false;
      wasHiddenRef.current = false;
    };
  }, []);
};

