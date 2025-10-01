import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Optimized hook for handling tab switching performance
 * Replaces the aggressive page refresh with smart data management
 */
export const useOptimizedTabSwitching = () => {
  const queryClient = useQueryClient();

  const handleVisibilityChange = useCallback(() => {
    if (document.hidden) {
      console.log('Tab hidden - pausing real-time subscriptions');
      // When tab is hidden, we could pause real-time subscriptions
      // to reduce resource usage, but keep data cached
    } else {
      console.log('Tab visible - checking for stale data');
      // When tab becomes visible, check for stale data and refresh if needed
      const now = Date.now();
      
      // Invalidate queries that are older than 5 minutes
      queryClient.invalidateQueries({
        predicate: (query) => {
          const dataAge = now - query.state.dataUpdatedAt;
          return dataAge > 1000 * 60 * 5; // 5 minutes
        }
      });
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
    queryClient.invalidateQueries({
      predicate: (query) => {
        const dataAge = Date.now() - query.state.dataUpdatedAt;
        return dataAge > 1000 * 60 * 2; // 2 minutes
      }
    });
  }, [queryClient]);

  return { refreshStaleData };
};
