import { useEffect, useRef } from 'react';

/**
 * Hook to synchronize session state across browser tabs
 * Uses BroadcastChannel API to notify other tabs of session changes
 */
export const useTabSyncSession = (
  userId: string | null,
  onSessionUpdate?: () => void
) => {
  const channelRef = useRef<BroadcastChannel | null>(null);
  const lastUserIdRef = useRef<string | null>(userId);

  useEffect(() => {
    // Only use BroadcastChannel if supported by browser
    if (typeof BroadcastChannel === 'undefined') {
      console.warn('[TabSync] BroadcastChannel not supported');
      return;
    }

    try {
      // Create or reuse broadcast channel
      if (!channelRef.current) {
        channelRef.current = new BroadcastChannel('stockflow-session');
        console.log('[TabSync] BroadcastChannel created');
      }

      const channel = channelRef.current;

      // Listen for messages from other tabs
      const handleMessage = (event: MessageEvent) => {
        const { type, userId: updatedUserId, timestamp } = event.data;

        console.log('[TabSync] Received message:', { type, updatedUserId, timestamp });

        // Ignore old messages (older than 5 seconds)
        if (timestamp && Date.now() - timestamp > 5000) {
          return;
        }

        if (type === 'session-updated') {
          // Another tab updated the session
          console.log('[TabSync] Session updated in another tab');
          onSessionUpdate?.();
        } else if (type === 'sign-out') {
          // Another tab signed out
          console.log('[TabSync] Sign out detected in another tab');
          window.location.href = '/auth';
        }
      };

      channel.addEventListener('message', handleMessage);

      // Notify other tabs when user changes (sign in/out)
      if (userId !== lastUserIdRef.current) {
        const message = {
          type: userId ? 'session-updated' : 'sign-out',
          userId,
          timestamp: Date.now(),
        };

        console.log('[TabSync] Broadcasting session change:', message);
        channel.postMessage(message);
        lastUserIdRef.current = userId;
      }

      return () => {
        channel.removeEventListener('message', handleMessage);
      };
    } catch (error) {
      console.error('[TabSync] Error setting up BroadcastChannel:', error);
    }
  }, [userId, onSessionUpdate]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (channelRef.current) {
        channelRef.current.close();
        channelRef.current = null;
        console.log('[TabSync] BroadcastChannel closed');
      }
    };
  }, []);

  // Function to broadcast session update manually
  const broadcastSessionUpdate = () => {
    if (channelRef.current) {
      const message = {
        type: 'session-updated',
        userId,
        timestamp: Date.now(),
      };
      console.log('[TabSync] Manual broadcast:', message);
      channelRef.current.postMessage(message);
    }
  };

  return { broadcastSessionUpdate };
};

