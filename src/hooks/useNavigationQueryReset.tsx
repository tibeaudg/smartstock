import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';

/**
 * Hook to reset query state on navigation
 * Only cancels queries that are stuck in loading states during navigation
 * This prevents loading states from persisting across page changes without
 * interfering with normal data loading or rehydration from localStorage
 * 
 * Note: This hook must be used inside a Router context (BrowserRouter, etc.)
 */
export const useNavigationQueryReset = () => {
  const queryClient = useQueryClient();
  const previousPathRef = useRef<string | null>(null);
  const navigationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Check if we're inside a Router context
  let location;
  try {
    location = useLocation();
  } catch (error) {
    // If useLocation fails, we're not inside a Router context
    console.warn('[NavigationQueryReset] useLocation failed - not inside Router context');
    return { resetAllQueries: () => {} };
  }

  useEffect(() => {
    // Only reset queries if we're actually navigating to a different path
    // Skip the initial load to avoid interfering with rehydration
    if (previousPathRef.current === null) {
      previousPathRef.current = location.pathname;
      console.log('[NavigationQueryReset] Initial load, skipping query reset');
      return;
    }

    if (previousPathRef.current !== location.pathname) {
      console.log('[NavigationQueryReset] Navigation detected, setting up timeout for stuck queries');
      
      // Clear any existing timeout
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
      
      // Set a timeout to cancel queries that are stuck loading after navigation
      // This gives queries time to complete normally, only canceling if they're stuck
      navigationTimeoutRef.current = setTimeout(() => {
        console.log('[NavigationQueryReset] Timeout reached, canceling stuck queries');
        
        // Only cancel queries that are still fetching after the timeout
        queryClient.cancelQueries({
          predicate: (query) => {
            return query.state.fetchStatus === 'fetching' && 
                   query.state.dataUpdatedAt === 0; // Not from cache
          }
        });
      }, 3000); // 3 second timeout

      previousPathRef.current = location.pathname;
    }
    
    // Cleanup timeout on unmount
    return () => {
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, [location.pathname, queryClient]);

  // Return a function to manually reset queries if needed
  const resetAllQueries = () => {
    queryClient.cancelQueries();
    queryClient.resetQueries();
    console.log('[NavigationQueryReset] Manual query reset triggered');
  };

  return { resetAllQueries };
};
