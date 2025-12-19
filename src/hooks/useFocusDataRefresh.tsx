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
  const isProcessingRef = useRef<boolean>(false);
  const sessionCheckPromiseRef = useRef<Promise<void> | null>(null);

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

    const performRefresh = async (source: 'focus' | 'visibility') => {
      // Prevent multiple simultaneous executions
      if (isProcessingRef.current) {
        console.log(`[FocusDataRefresh] Already processing refresh from ${source}, skipping`);
        return;
      }

      console.log(`[FocusDataRefresh] ${source} event triggered, wasHidden:`, wasHiddenRef.current);
      
      // Only refresh if we were previously hidden (user switched tabs/windows)
      // This prevents refresh when clicking within the same window
      if (!wasHiddenRef.current) {
        console.log('[FocusDataRefresh] Window was not hidden, skipping refresh');
        return;
      }

      // Mark as processing immediately to prevent race conditions
      isProcessingRef.current = true;
      
      // Clear any pending refresh timeout
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
        refreshTimeoutRef.current = null;
      }

      try {
        // Try to re-check session quickly; do not block UI
        // Reuse existing promise if one is already in progress
        if (!sessionCheckPromiseRef.current) {
          sessionCheckPromiseRef.current = (async () => {
            try {
              const { data } = await supabase.auth.getSession();
              if (!data?.session) {
                await supabase.auth.refreshSession().catch(() => {});
              }
            } catch (error) {
              console.error('[FocusDataRefresh] Session check error:', error);
            } finally {
              sessionCheckPromiseRef.current = null;
            }
          })();
        }
        
        // Wait for session check to complete (or use existing promise)
        await sessionCheckPromiseRef.current;
      } catch (error) {
        console.error('[FocusDataRefresh] Error during session check:', error);
      } finally {
        // Add a delay to allow immediate user interactions (like clicking chevrons)
        // This prevents the refresh from interfering with user clicks
        // Refresh happens in the background
        console.log('[FocusDataRefresh] Scheduling refresh in 300ms...');
        refreshTimeoutRef.current = setTimeout(() => {
          // Check if page is still visible before executing refresh
          // If page became hidden again, skip the refresh
          if (document.hidden) {
            console.log('[FocusDataRefresh] Page became hidden again, skipping scheduled refresh');
            isProcessingRef.current = false;
            return;
          }
          
          try {
            invalidateAndRefetch();
          } catch (error) {
            console.error('[FocusDataRefresh] Error during refresh:', error);
          } finally {
            isProcessingRef.current = false;
            // Only reset wasHiddenRef after refresh completes and page is still visible
            if (!document.hidden) {
              wasHiddenRef.current = false;
            }
          }
        }, 300);
      }
    };

    const handleFocus = () => {
      // Focus event can fire even when page wasn't hidden (e.g., clicking in same window)
      // So we rely on wasHiddenRef to determine if refresh is needed
      performRefresh('focus');
    };

    const visibilityHandler = () => {
      if (document.hidden) {
        // Page became hidden - mark that we were hidden
        console.log('[FocusDataRefresh] Page hidden');
        wasHiddenRef.current = true;
        
        // Clear any pending refresh timeout when page is hidden
        if (refreshTimeoutRef.current) {
          clearTimeout(refreshTimeoutRef.current);
          refreshTimeoutRef.current = null;
        }
        
        // Reset processing flag when page is hidden (allows new refresh when visible again)
        isProcessingRef.current = false;
      } else {
        // Page became visible again
        // Only trigger refresh if we were previously hidden
        if (wasHiddenRef.current) {
          console.log('[FocusDataRefresh] Page visible again after being hidden');
          // Trigger refresh via visibilitychange
          // Note: focus event might also fire, but isProcessingRef will prevent double execution
          performRefresh('visibility');
        } else {
          console.log('[FocusDataRefresh] Page visible but was not hidden, skipping refresh');
        }
      }
    };

    // Use capture phase for focus event to catch it early
    window.addEventListener('focus', handleFocus, true);
    document.addEventListener('visibilitychange', visibilityHandler);
    
    return () => {
      window.removeEventListener('focus', handleFocus, true);
      document.removeEventListener('visibilitychange', visibilityHandler);
      
      // Clear timeout on cleanup
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
        refreshTimeoutRef.current = null;
      }
      
      // Reset flags on cleanup
      isProcessingRef.current = false;
      wasHiddenRef.current = false;
      sessionCheckPromiseRef.current = null;
    };
  }, [queryClient, location.pathname]);
};


