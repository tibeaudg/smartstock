import { useEffect, useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Optimized hook for handling tab switching performance
 * Smart cache invalidation based on how long the tab was idle
 * Coordinates with session revalidation to prevent race conditions
 */
export const useOptimizedTabSwitching = () => {
  const queryClient = useQueryClient();
  const tabHiddenAtRef = useRef<number | null>(null);
  const isProcessingRef = useRef<boolean>(false);
  const stuckQueryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Monitor and force-resolve stuck queries
  const monitorStuckQueries = useCallback(() => {
    // Clear any existing timeout
    if (stuckQueryTimeoutRef.current) {
      clearTimeout(stuckQueryTimeoutRef.current);
    }

    // Set timeout to force-resolve stuck queries after 8 seconds
    stuckQueryTimeoutRef.current = setTimeout(() => {
      const queries = queryClient.getQueryCache().getAll();
      let resolvedCount = 0;
      const now = Date.now();

      queries.forEach((query) => {
        // Check if query is stuck in loading state
        // A query is stuck if:
        // 1. It's currently fetching
        // 2. It has cached data (so we can show that instead of loading)
        // 3. It has been fetching for more than 8 seconds since last update
        const dataUpdatedAt = query.state.dataUpdatedAt || 0;
        const isStuck = 
          query.state.fetchStatus === 'fetching' &&
          query.state.data !== undefined && // Has cached data
          now - dataUpdatedAt > 8000; // Stuck for > 8 seconds

        if (isStuck) {
          console.warn('[TabSwitching] Detected stuck query:', query.queryKey);
          // Cancel the stuck query - this will show cached data
          queryClient.cancelQueries({ queryKey: query.queryKey });
          resolvedCount++;
        }
      });

      if (resolvedCount > 0) {
        console.warn(`[TabSwitching] Resolved ${resolvedCount} stuck queries`);
      }
    }, 8000);
  }, [queryClient]);

  const handleVisibilityChange = useCallback(() => {
    if (document.hidden) {
      // Tab became hidden - record the time
      tabHiddenAtRef.current = Date.now();
      
      // Clear any stuck query timeout when tab is hidden
      if (stuckQueryTimeoutRef.current) {
        clearTimeout(stuckQueryTimeoutRef.current);
        stuckQueryTimeoutRef.current = null;
      }
    } else {
      // Prevent multiple simultaneous processing
      if (isProcessingRef.current) {
        return;
      }

      // Tab became visible - check how long it was hidden
      const now = Date.now();
      const hiddenDuration = tabHiddenAtRef.current ? now - tabHiddenAtRef.current : 0;
      const hiddenMinutes = hiddenDuration / (1000 * 60);
      
      if (hiddenMinutes < 2) {
        // Short tab switch (<2 min) - keep all cache, no refresh
        tabHiddenAtRef.current = null;
        return;
      }

      // For medium and long tab switches, wait a bit for session revalidation to complete
      // This prevents race conditions between session check and query invalidation
      isProcessingRef.current = true;
      
      setTimeout(() => {
        try {
          if (hiddenMinutes < 10) {
            // Medium tab switch (2-10 min) - invalidate stale queries only and force refetch
            queryClient.invalidateQueries({
              predicate: (query) => {
                const dataAge = now - query.state.dataUpdatedAt;
                // Only invalidate if data is older than 5 minutes
                return dataAge > 1000 * 60 * 5;
              },
              refetchType: 'active', // Force active queries to refetch
            });
          } else {
            // Long tab switch (>10 min) - full refresh with single invalidation
            
            // Single invalidation call with forced refetch
            queryClient.invalidateQueries({
              predicate: (query) => {
                const key = query.queryKey[0];
                return typeof key === 'string' && (
                  key.includes('profile') || 
                  key.includes('dashboard') || 
                  key.includes('products') || 
                  key.includes('stock') ||
                  key.includes('categories') ||
                  key.includes('suppliers')
                );
              },
              refetchType: 'active', // Force active queries to refetch
            });
          }
          
          // Start monitoring for stuck queries after invalidation
          monitorStuckQueries();
        } catch (error) {
          console.error('[TabSwitching] Error during query invalidation:', error);
        } finally {
          isProcessingRef.current = false;
          tabHiddenAtRef.current = null;
        }
      }, 200); // Reduced delay from 500ms to 200ms for faster response
    }
  }, [queryClient, monitorStuckQueries]);

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      // Cleanup timeout on unmount
      if (stuckQueryTimeoutRef.current) {
        clearTimeout(stuckQueryTimeoutRef.current);
      }
    };
  }, [handleVisibilityChange]);

  // Return a function to manually refresh stale data
  const refreshStaleData = useCallback(() => {
    queryClient.invalidateQueries({
      predicate: (query) => {
        const dataAge = Date.now() - query.state.dataUpdatedAt;
        return dataAge > 1000 * 60 * 2; // 2 minutes
      },
      refetchType: 'active', // Force refetch
    });
  }, [queryClient]);

  return { refreshStaleData };
};
