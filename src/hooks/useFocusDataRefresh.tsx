import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

/**
 * Global focus handler that:
 * - Silently revalidates Supabase session on focus/visibility return
 * - Debounced invalidation of critical queries to prevent bursts
 * - Skips refresh when user is actively editing/adding products
 */
export const useFocusDataRefresh = () => {
  const queryClient = useQueryClient();
  const location = useLocation();
  const lastRunRef = useRef<number>(0);
  const debounceMs = 5000;
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const wasHiddenRef = useRef<boolean>(false);

  useEffect(() => {
    /**
     * Check if user is actively editing/adding a product
     * Returns true if we should skip the refresh
     */
    const isUserEditing = (): boolean => {
      // Check if we're on the AddProductPage
      if (location.pathname === '/dashboard/products/new' || 
          location.pathname.startsWith('/dashboard/products/new/')) {
        return true;
      }

      // Check if any form input/textarea is currently focused (user is actively typing)
      const activeElement = document.activeElement;
      if (activeElement && (
        activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.tagName === 'SELECT' ||
        activeElement.isContentEditable
      )) {
        return true;
      }

      // Check if any dialog/modal with form inputs is open
      // We check if the dialog contains form inputs as an indicator of potential editing
      const openDialogs = document.querySelectorAll('[role="dialog"]:not([aria-hidden="true"])');
      if (openDialogs.length > 0) {
        for (const dialog of openDialogs) {
          // Check if dialog contains form elements (inputs, textareas, selects)
          const formElements = dialog.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]), textarea, select');
          if (formElements.length > 0) {
            // If there are form elements, assume user might be editing
            // This prevents refresh when forms are open, allowing user to fill them out
            return true;
          }
        }
      }

      return false;
    };

    const invalidateAndRefetch = () => {
      // Skip refresh if user is actively editing
      if (isUserEditing()) {
        console.log('[FocusDataRefresh] Skipping refresh - user is actively editing/adding product');
        return;
      }

      const now = Date.now();
      if (now - lastRunRef.current < debounceMs) {
        console.log('[FocusDataRefresh] Skipping refresh - debounced');
        return;
      }
      lastRunRef.current = now;

      console.log('[FocusDataRefresh] Window refocused - refreshing all active queries in background...');
      
      // Force refetch ALL active queries, regardless of their refetchOnWindowFocus setting
      // This ensures all pages get fresh data when window regains focus
      queryClient.refetchQueries({ 
        type: 'active', // Only refetch queries that are currently being used
        cancelRefetch: false, // Don't cancel ongoing refetches
      });
      
      // Also specifically invalidate and refetch critical queries that might have
      // refetchOnWindowFocus: false or staleTime: Infinity
      // Use prefix matching to catch all variations (with branch_id, filters, etc.)
      const criticalQueryPrefixes = [
        ['stockTransactions'], // Matches ['stockTransactions', branch_id, filters]
        ['bomList'], // Matches ['bomList', branch_id]
        ['products'], // Matches ['products', ...]
        ['categories'], // Matches ['categories', ...]
        ['dashboardData'], // Matches ['dashboardData', ...]
      ];
      
      criticalQueryPrefixes.forEach(queryKeyPrefix => {
        queryClient.invalidateQueries({ 
          predicate: (query) => {
            // Match queries that start with the prefix
            const queryKey = query.queryKey as unknown[];
            return queryKey.length >= queryKeyPrefix.length && 
                   queryKeyPrefix.every((v, i) => queryKey[i] === v);
          },
          refetchType: 'active', // Force refetch even if staleTime is Infinity
        });
      });
      
      // Also invalidate stale queries to trigger refetch for queries that might not be active
      // but should be refreshed when the user returns
      queryClient.invalidateQueries({
        predicate: (query) => {
          // Invalidate queries that are older than 2 minutes OR have staleTime: Infinity
          const dataAge = Date.now() - (query.state.dataUpdatedAt || 0);
          const isStale = dataAge > 1000 * 60 * 2; // 2 minutes
          // Also invalidate queries with staleTime: Infinity (they won't be marked stale automatically)
          const hasInfiniteStaleTime = query.options.staleTime === Infinity;
          return isStale || hasInfiniteStaleTime;
        },
        refetchType: 'active', // Only refetch active queries
      });
      
      console.log('[FocusDataRefresh] Refresh triggered for all active queries');
    };

    const handleFocus = async () => {
      console.log('[FocusDataRefresh] Window focus event triggered, wasHidden:', wasHiddenRef.current);
      
      // Only refresh if we were previously hidden (user switched tabs/windows)
      // This prevents refresh when clicking within the same window
      if (!wasHiddenRef.current) {
        console.log('[FocusDataRefresh] Window was not hidden, skipping refresh');
        return;
      }
      
      wasHiddenRef.current = false;

      // Clear any pending refresh timeout
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
        refreshTimeoutRef.current = null;
      }

      try {
        // Try to re-check session quickly; do not block UI
        const { data } = await supabase.auth.getSession();
        if (!data?.session) {
          await supabase.auth.refreshSession().catch(() => {});
        }
      } finally {
        // Add a delay to allow immediate user interactions (like clicking chevrons)
        // This prevents the refresh from interfering with user clicks
        // Refresh happens in the background
        console.log('[FocusDataRefresh] Scheduling refresh in 300ms...');
        refreshTimeoutRef.current = setTimeout(() => {
          invalidateAndRefetch();
        }, 300);
      }
    };

    const visibilityHandler = () => {
      if (document.hidden) {
        // Page became hidden - mark that we were hidden
        console.log('[FocusDataRefresh] Page hidden');
        wasHiddenRef.current = true;
      } else if (wasHiddenRef.current) {
        // Page became visible again after being hidden - refresh
        console.log('[FocusDataRefresh] Page visible again after being hidden');
        // Clear any pending refresh timeout
        if (refreshTimeoutRef.current) {
          clearTimeout(refreshTimeoutRef.current);
          refreshTimeoutRef.current = null;
        }
        // Call handleFocus which will reset wasHiddenRef
        handleFocus();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', visibilityHandler);
    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', visibilityHandler);
      // Clear timeout on cleanup
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
        refreshTimeoutRef.current = null;
      }
    };
  }, [queryClient, location.pathname]);
};


