import { supabase } from '@/integrations/supabase/client';

/**
 * Links anonymous website events to a user after login
 * Updates all events with the same session_id to have the user_id
 */
export async function linkAnonymousEventsToUser(
  userId: string,
  sessionId: string
): Promise<{ linked: number; error?: any }> {
  try {
    // Update all events with the same session_id that don't have a user_id yet
    const { data, error } = await supabase
      .from('website_events')
      .update({ user_id: userId })
      .eq('session_id', sessionId)
      .is('user_id', null)
      .select('id');

    if (error) {
      console.error('[EventLinking] Error linking anonymous events:', error);
      return { linked: 0, error };
    }

    const linkedCount = data?.length || 0;
    if (linkedCount > 0) {
      console.log(`[EventLinking] Linked ${linkedCount} anonymous events to user ${userId}`);
    }

    return { linked: linkedCount };
  } catch (error) {
    console.error('[EventLinking] Exception linking anonymous events:', error);
    return { linked: 0, error };
  }
}

/**
 * Gets the current session ID from localStorage or generates a new one
 */
export function getSessionId(): string {
  if (typeof window === 'undefined' || !window.localStorage) {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  try {
    let sessionId = localStorage.getItem('tracking_session_id');
    
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('tracking_session_id', sessionId);
    }
    
    return sessionId;
  } catch (e) {
    console.warn('Error getting/setting session ID:', e);
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}

