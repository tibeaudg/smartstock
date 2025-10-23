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

  const handleVisibilityChange = useCallback(() => {
    if (document.hidden) {
      // Tab became hidden - record the time
      tabHiddenAtRef.current = Date.now();
      console.log('[TabSwitching] Tab hidden at:', new Date().toLocaleTimeString());
    } else {
      // Prevent multiple simultaneous processing
      if (isProcessingRef.current) {
        console.log('[TabSwitching] Already processing visibility change, skipping');
        return;
      }

      // Tab became visible - check how long it was hidden
      const now = Date.now();
      const hiddenDuration = tabHiddenAtRef.current ? now - tabHiddenAtRef.current : 0;
      const hiddenMinutes = hiddenDuration / (1000 * 60);
      
      console.log('[TabSwitching] Tab visible after', hiddenMinutes.toFixed(2), 'minutes');
      
      if (hiddenMinutes < 2) {
        // Short tab switch (<2 min) - keep all cache, no refresh
        console.log('[TabSwitching] Short tab switch - keeping cache');
        tabHiddenAtRef.current = null;
        return;
      }

      // For medium and long tab switches, wait a bit for session revalidation to complete
      // This prevents race conditions between session check and query invalidation
      isProcessingRef.current = true;
      
      setTimeout(() => {
        try {
          if (hiddenMinutes < 10) {
            // Medium tab switch (2-10 min) - invalidate stale queries only
            console.log('[TabSwitching] Medium tab switch - invalidating stale queries');
            queryClient.invalidateQueries({
              predicate: (query) => {
                const dataAge = now - query.state.dataUpdatedAt;
                // Only invalidate if data is older than 5 minutes
                return dataAge > 1000 * 60 * 5;
              }
            });
          } else {
            // Long tab switch (>10 min) - full refresh with single invalidation
            console.log('[TabSwitching] Long tab switch - full refresh');
            
            // Single invalidation call instead of cascading timeouts
            queryClient.invalidateQueries({
              predicate: (query) => {
                const key = query.queryKey[0];
                return typeof key === 'string' && (
                  key.includes('profile') || 
                  key.includes('branches') || 
                  key.includes('branch') ||
                  key.includes('dashboard') || 
                  key.includes('products') || 
                  key.includes('stock') ||
                  key.includes('categories') ||
                  key.includes('suppliers')
                );
              }
            });
          }
        } catch (error) {
          console.error('[TabSwitching] Error during query invalidation:', error);
        } finally {
          isProcessingRef.current = false;
          tabHiddenAtRef.current = null;
        }
      }, 500); // Wait 500ms for session revalidation to complete
    }
  }, [queryClient]);

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [handleVisibilityChange]);

  // Return a function to manually refresh stale data
  const refreshStaleData = useCallback(() => {
    console.log('[TabSwitching] Manual refresh triggered');
    queryClient.invalidateQueries({
      predicate: (query) => {
        const dataAge = Date.now() - query.state.dataUpdatedAt;
        return dataAge > 1000 * 60 * 2; // 2 minutes
      }
    });
  }, [queryClient]);

  return { refreshStaleData };
};
