import { useEffect } from 'react';

// Extend the Window interface to include queryClient
declare global {
  interface Window {
    queryClient?: any;
  }
}

export const usePageRefresh = () => {
  useEffect(() => {
    let isPageHidden = false;
    let lastVisibilityChange = Date.now();

    const handleVisibilityChange = () => {
      const now = Date.now();
      
      if (document.hidden) {
        // Page becomes hidden (user switches to another tab)
        isPageHidden = true;
        lastVisibilityChange = now;
        console.log('Page hidden at:', new Date().toLocaleTimeString());
      } else if (isPageHidden) {
        // Page becomes visible again (user returns) - use smart refresh strategy
        const timeHidden = now - lastVisibilityChange;
        const timeHiddenMinutes = timeHidden / (1000 * 60);
        
        console.log('Page visible again after', timeHidden, 'ms');
        
        // Only refresh if user was away for more than 10 minutes
        // This prevents unnecessary refreshes for quick tab switches
        if (timeHiddenMinutes > 10) {
          console.log('User was away for more than 10 minutes, refreshing...');
          // Use a more graceful refresh with a slight delay
          setTimeout(() => {
            window.location.reload();
          }, 500);
        } else {
          console.log('Quick tab switch detected, skipping refresh for better performance');
          // Instead of full refresh, just trigger a gentle data refetch
          if (window.queryClient) {
            // Invalidate stale queries to trigger background refetch
            window.queryClient.invalidateQueries({
              predicate: (query) => {
                // Only refetch queries that are older than 5 minutes
                return query.state.dataUpdatedAt < Date.now() - (1000 * 60 * 5);
              }
            });
          }
        }
      }
    };

    // Listen to visibility change events
    document.addEventListener('visibilitychange', handleVisibilityChange);
    console.log('Optimized page refresh hook initialized');

    // Cleanup function
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
}; 
