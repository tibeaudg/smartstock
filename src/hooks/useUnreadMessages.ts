import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import type { Database } from '@/types/supabase';
import type { SupabaseClient } from '@supabase/supabase-js';

export const useUnreadMessages = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    let mounted = true;

    // Initial fetch of unread messages
    const fetchUnreadCount = async () => {
      try {
        // Get active chat for current user
        const { data: activeChats, error: chatError } = await supabase
          .from('chats')
          .select('id')
          .eq('user_id', user.id)
          .eq('is_closed', false);

        if (chatError) throw chatError;

        if (activeChats && activeChats.length > 0) {
          // Get unread messages count across all active chats
          const { count, error: countError } = await supabase
            .from('chat_messages')
            .select('*', { count: 'exact', head: true })
            .in('chat_id', activeChats.map(chat => chat.id))
            .eq('sender_type', 'admin')
            .eq('is_read', false);

          if (countError) throw countError;
          
          if (mounted) {
            setUnreadCount(count || 0);
          }
        }
      } catch (error) {
        console.error('Error fetching unread messages:', error);
      }
    };

    fetchUnreadCount();

    // Subscribe to changes in chat_messages
    const subscription = supabase
      .channel('chat-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `sender_type=eq.admin`
        },
        () => {
          fetchUnreadCount();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'chat_messages',
          filter: `is_read=eq.true`
        },
        () => {
          fetchUnreadCount();
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [user]);

  return unreadCount;
};
