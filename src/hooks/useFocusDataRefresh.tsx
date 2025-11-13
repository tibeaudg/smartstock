import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

/**
 * Global focus handler that:
 * - Silently revalidates Supabase session on focus/visibility return
 * - Debounced invalidation of critical queries to prevent bursts
 */
export const useFocusDataRefresh = () => {
  const queryClient = useQueryClient();
  const lastRunRef = useRef<number>(0);
  const debounceMs = 5000;

  useEffect(() => {
    const invalidateAndRefetch = () => {
      const now = Date.now();
      if (now - lastRunRef.current < debounceMs) return;
      lastRunRef.current = now;

      const predicateFor = (keyPrefix: unknown[]) => (q: any) => {
          const key = q.queryKey as unknown[];
          return key.length >= keyPrefix.length && keyPrefix.every((v, i) => key[i] === v);
      };

      const touch = (prefix: unknown[]) => {
        const predicate = predicateFor(prefix);
        queryClient.invalidateQueries({ predicate });
        queryClient.refetchQueries({ predicate, type: 'active' });
      };

      touch(['branches']);
      touch(['products']);
      touch(['products-total-count']);
      touch(['categories']);
      touch(['suppliers']);
      touch(['stockTransactions']);
      touch(['scannerSettings']);
      touch(['dashboardData']);
    };

    const handleFocus = async () => {
      try {
        // Try to re-check session quickly; do not block UI
        const { data } = await supabase.auth.getSession();
        if (!data?.session) {
          await supabase.auth.refreshSession().catch(() => {});
        }
      } finally {
        invalidateAndRefetch();
      }
    };

    const visibilityHandler = () => {
      if (!document.hidden) handleFocus();
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', visibilityHandler);
    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', visibilityHandler);
    };
  }, [queryClient]);
};


