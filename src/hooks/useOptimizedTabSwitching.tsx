import { useEffect, useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Optimized hook for handling tab switching performance
 * Smart cache invalidation based on how long the tab was idle
 */
export const useOptimizedTabSwitching = () => {
  const queryClient = useQueryClient();
  const tabHiddenAtRef = useRef<number | null>(null);

  const handleVisibilityChange = useCallback(() => {
    if (document.hidden) {
      // Tab became hidden - record the time
      tabHiddenAtRef.current = Date.now();
      console.log('[TabSwitching] Tab hidden at:', new Date().toLocaleTimeString());
    } else {
      // Tab became visible - check how long it was hidden
      const now = Date.now();
      const hiddenDuration = tabHiddenAtRef.current ? now - tabHiddenAtRef.current : 0;
      const hiddenMinutes = hiddenDuration / (1000 * 60);
      
      console.log('[TabSwitching] Tab visible after', hiddenMinutes.toFixed(2), 'minutes');
      
      if (hiddenMinutes < 2) {
        // Short tab switch (<2 min) - keep all cache, no refresh
        console.log('[TabSwitching] Short tab switch - keeping cache');
      } else if (hiddenMinutes < 10) {
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
        // Long tab switch (>10 min) - full refresh
        console.log('[TabSwitching] Long tab switch - full refresh');
        
        // Invalidate in order: auth-related → branches → data
        // This ensures proper loading sequence
        
        // Step 1: Invalidate auth-related queries first
        queryClient.invalidateQueries({
          predicate: (query) => {
            const key = query.queryKey[0];
            return typeof key === 'string' && key.includes('profile');
          }
        });
        
        // Step 2: Invalidate branches after a small delay
        setTimeout(() => {
          queryClient.invalidateQueries({
            predicate: (query) => {
              const key = query.queryKey[0];
              return typeof key === 'string' && (key.includes('branches') || key.includes('branch'));
            }
          });
        }, 100);
        
        // Step 3: Invalidate dashboard and other data after branches
        setTimeout(() => {
          queryClient.invalidateQueries({
            predicate: (query) => {
              const key = query.queryKey[0];
              return typeof key === 'string' && 
                (key.includes('dashboard') || key.includes('products') || key.includes('stock'));
            }
          });
        }, 200);
      }
      
      tabHiddenAtRef.current = null;
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
