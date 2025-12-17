import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Global hook to protect against stuck loading states
 * Monitors all active queries and cancels those stuck for >8 seconds if cached data exists
 * This prevents infinite loading spinners when returning from another tab
 */
export const useStuckLoadingProtection = () => {
  const queryClient = useQueryClient();
  const monitoringIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastCheckRef = useRef<number>(0);

  useEffect(() => {
    const checkStuckQueries = () => {
      const now = Date.now();
      // Only check every 2 seconds to avoid performance issues
      if (now - lastCheckRef.current < 2000) {
        return;
      }
      lastCheckRef.current = now;

      const queries = queryClient.getQueryCache().getAll();
      let resolvedCount = 0;

      queries.forEach((query) => {
        const state = query.state;
        const dataUpdatedAt = state.dataUpdatedAt || 0;
        const fetchStatus = state.fetchStatus;
        const hasData = state.data !== undefined && state.data !== null;
        
        // Get fetch start time if available (when the current fetch started)
        const fetchStatusUpdatedAt = (state as any).fetchStatusUpdatedAt || 0;
        const timeSinceFetchStart = fetchStatusUpdatedAt > 0 ? now - fetchStatusUpdatedAt : 0;
        const timeSinceDataUpdate = now - dataUpdatedAt;

        // A query is stuck if:
        // 1. It's currently fetching
        // 2. It has cached data (so we can show that instead of loading)
        // 3. It has been fetching for more than 30 seconds (give more time for mutations/refetches)
        //    OR if we can't determine fetch start time, use dataUpdatedAt with longer timeout
        // 
        // Important: We use a longer timeout (30s instead of 8s) to avoid cancelling queries
        // that were recently invalidated as part of mutations (like adding a product).
        // These queries may take longer to refetch but are legitimate.
        const isStuck = 
          fetchStatus === 'fetching' &&
          hasData &&
          (
            (timeSinceFetchStart > 0 && timeSinceFetchStart > 30000) || // Fetching for >30s
            (timeSinceFetchStart === 0 && timeSinceDataUpdate > 30000) // Can't determine fetch start, use data update time
          );

        if (isStuck) {
          console.warn('[StuckLoadingProtection] Detected stuck query:', query.queryKey, {
            timeSinceFetchStart: timeSinceFetchStart > 0 ? `${Math.round(timeSinceFetchStart / 1000)}s` : 'unknown',
            timeSinceDataUpdate: `${Math.round(timeSinceDataUpdate / 1000)}s`,
            hasData: true
          });
          
          // Cancel the stuck query - this will show cached data instead of loading state
          queryClient.cancelQueries({ queryKey: query.queryKey });
          resolvedCount++;
        }
      });

      if (resolvedCount > 0) {
        console.warn(`[StuckLoadingProtection] Resolved ${resolvedCount} stuck query(ies)`);
      }
    };

    // Check for stuck queries every 3 seconds
    monitoringIntervalRef.current = setInterval(checkStuckQueries, 3000);

    // Also check immediately on mount
    checkStuckQueries();

    // Cleanup on unmount
    return () => {
      if (monitoringIntervalRef.current) {
        clearInterval(monitoringIntervalRef.current);
        monitoringIntervalRef.current = null;
      }
    };
  }, [queryClient]);

  // Also handle visibility change - reset stuck queries when tab becomes visible
  // BUT be more conservative - only cancel if truly stuck (longer timeout)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Tab became visible - check for stuck queries, but be conservative
        // Only cancel if query has been stuck for a long time (15+ seconds)
        // This prevents canceling legitimate queries that are still loading
        const queries = queryClient.getQueryCache().getAll();
        const now = Date.now();
        
        queries.forEach((query) => {
          const state = query.state;
          const dataUpdatedAt = state.dataUpdatedAt || 0;
          const fetchStatus = state.fetchStatus;
          const hasData = state.data !== undefined && state.data !== null;
          const timeSinceUpdate = now - dataUpdatedAt;

          // Only cancel if query has been fetching for >15 seconds AND has cached data
          // This is much more conservative to avoid canceling legitimate queries
          if (fetchStatus === 'fetching' && hasData && timeSinceUpdate > 15000) {
            console.warn('[StuckLoadingProtection] Canceling truly stuck query on visibility change:', query.queryKey, {
              timeSinceUpdate: `${Math.round(timeSinceUpdate / 1000)}s`
            });
            queryClient.cancelQueries({ queryKey: query.queryKey });
          }
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [queryClient]);
};

