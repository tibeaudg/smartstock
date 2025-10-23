import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook to revalidate Supabase session on tab visibility change
 * Prevents stale session issues when returning to the app after tab switching
 */
export const useSessionRevalidation = (onSessionChange?: (valid: boolean) => void) => {
  const lastCheckRef = useRef<number>(Date.now());
  const isCheckingRef = useRef(false);

  useEffect(() => {
    const handleVisibilityChange = async () => {
      // Only check when tab becomes visible
      if (document.hidden || isCheckingRef.current) return;

      const now = Date.now();
      const timeSinceLastCheck = now - lastCheckRef.current;

      // Only revalidate if more than 30 seconds have passed since last check
      if (timeSinceLastCheck < 30000) return;

      isCheckingRef.current = true;
      lastCheckRef.current = now;

      try {
        console.log('[SessionRevalidation] Tab became visible, checking session validity...');
        
        // Add timeout to prevent hanging - reduced to 5 seconds for better responsiveness
        const timeoutPromise = new Promise<null>((_, reject) => {
          setTimeout(() => reject(new Error('Session check timeout')), 5000);
        });

        const sessionPromise = supabase.auth.getSession();
        
        const result = await Promise.race([sessionPromise, timeoutPromise]);
        
        if (!result || 'message' in result) {
          // Timeout or error occurred
          console.warn('[SessionRevalidation] Session check failed or timed out');
          onSessionChange?.(false);
          return;
        }

        const { data, error } = result as Awaited<typeof sessionPromise>;

        if (error) {
          console.error('[SessionRevalidation] Session validation error:', error.message);
          onSessionChange?.(false);
          return;
        }

        if (!data.session) {
          console.warn('[SessionRevalidation] No active session found');
          onSessionChange?.(false);
          return;
        }

        // Check if session is about to expire (within 5 minutes)
        const expiresAt = data.session.expires_at;
        if (expiresAt) {
          const expiresInMs = expiresAt * 1000 - Date.now();
          const fiveMinutes = 5 * 60 * 1000;

          if (expiresInMs < fiveMinutes) {
            console.log('[SessionRevalidation] Session expiring soon, refreshing...');
            const { error: refreshError } = await supabase.auth.refreshSession();
            
            if (refreshError) {
              console.error('[SessionRevalidation] Session refresh failed:', refreshError.message);
              onSessionChange?.(false);
              return;
            }
          }
        }

        console.log('[SessionRevalidation] Session is valid');
        onSessionChange?.(true);
      } catch (error) {
        console.error('[SessionRevalidation] Unexpected error:', error);
        onSessionChange?.(false);
      } finally {
        // Always reset the checking flag, even if there was an error or timeout
        isCheckingRef.current = false;
        console.log('[SessionRevalidation] Session check completed, flag reset');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [onSessionChange]);
};

