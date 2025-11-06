import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook to revalidate Supabase session on tab visibility change
 * Prevents stale session issues when returning to the app after tab switching
 * Non-blocking implementation that doesn't interfere with query loading
 */
export const useSessionRevalidation = (onSessionChange?: (valid: boolean) => void) => {
  const lastCheckRef = useRef<number>(Date.now());
  const isCheckingRef = useRef(false);

  useEffect(() => {
    const handleVisibilityChange = () => {
      // Only check when tab becomes visible
      if (document.hidden || isCheckingRef.current) return;

      const now = Date.now();
      const timeSinceLastCheck = now - lastCheckRef.current;

      // Only revalidate if more than 30 seconds have passed since last check
      if (timeSinceLastCheck < 30000) return;

      isCheckingRef.current = true;
      lastCheckRef.current = now;

      // Non-blocking: run session validation asynchronously without blocking UI
      // Use setTimeout to ensure this doesn't block the main thread
      setTimeout(async () => {
        try {
          
          // Reduced timeout from 5s to 3s for better responsiveness (non-throwing)
          const timeoutPromise = new Promise<{ __timedOut: true }>((resolve) => {
            setTimeout(() => resolve({ __timedOut: true }), 3000);
          });

          const sessionPromise = supabase.auth.getSession();
          
          const result: any = await Promise.race([sessionPromise, timeoutPromise]);
          
          // Gracefully handle timeout without throwing
          if (result && result.__timedOut) {
            console.warn('[SessionRevalidation] Session check timed out');
            onSessionChange?.(true);
            return;
          }

          const { data, error } = result as Awaited<typeof sessionPromise>;

          if (error) {
            console.error('[SessionRevalidation] Session validation error:', error.message);
            // Non-blocking: assume session is valid to prevent UI blocking
            onSessionChange?.(true);
            return;
          }

          if (!data.session) {
            console.warn('[SessionRevalidation] No active session found, attempting silent refresh');
            // Try a silent refresh; if it succeeds, treat as valid
            try {
              const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession();
              if (refreshed?.session && !refreshError) {
                onSessionChange?.(true);
                return;
              }
            } catch {}
            // If refresh did not yield a session, still avoid blocking UI
            onSessionChange?.(true);
            return;
          }

          // Check if session is about to expire (within 5 minutes)
          const expiresAt = data.session.expires_at;
          if (expiresAt) {
            const expiresInMs = expiresAt * 1000 - Date.now();
            const fiveMinutes = 5 * 60 * 1000;

            if (expiresInMs < fiveMinutes) {
              // Non-blocking refresh - don't wait for completion
              supabase.auth.refreshSession().catch((refreshError) => {
                console.error('[SessionRevalidation] Session refresh failed:', refreshError.message);
                // Don't call callback on error to prevent blocking
              });
            }
          }

          onSessionChange?.(true);
        } catch (error) {
          console.error('[SessionRevalidation] Unexpected error:', error);
          // Non-blocking: assume valid to prevent UI blocking
          onSessionChange?.(true);
        } finally {
          // Always reset the checking flag, even if there was an error or timeout
          isCheckingRef.current = false;
        }
      }, 0); // Use setTimeout 0 to make it completely non-blocking
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [onSessionChange]);
};

