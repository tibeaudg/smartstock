import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useUnreadMessages = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setUnreadCount(0);
      return;
    }

    let mounted = true;

    const fetchUnreadCount = async () => {
      if (!mounted || !user) return;
      
      try {
        // Get active chats for the user
        const { data: activeChats, error: chatError } = await supabase
          .from('chats')
          .select('id')
          .eq('user_id', user.id)
          .eq('is_closed', false);

        if (chatError) {
          console.error('Error fetching active chats:', chatError);
          return;
        }

        if (!activeChats?.length) {
          if (mounted) setUnreadCount(0);
          return;
        }

        // Get unread messages count
        const { count, error: countError } = await supabase
          .from('chat_messages')
          .select('*', { count: 'exact', head: true })
          .in('chat_id', activeChats.map(chat => chat.id))
          .eq('sender_type', 'admin')
          .eq('is_read', false);

        if (countError) {
          console.error('Error counting unread messages:', countError);
          return;
        }

        if (mounted) {
          setUnreadCount(count || 0);
        }
      } catch (error) {
        console.error('Error in fetchUnreadCount:', error);
      }
    };

    // Initial fetch
    fetchUnreadCount();

    // Subscribe to message changes
    const channel = supabase.channel('chat-updates');
    
    const subscription = channel
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'chat_messages'
        },
        () => {
          fetchUnreadCount();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages'
        },
        () => {
          fetchUnreadCount();
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      if (subscription) subscription.unsubscribe();
    };
  }, [user]);

  return unreadCount;
};
