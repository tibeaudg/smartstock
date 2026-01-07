import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { AuthContext } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

interface UnreadMessagesContextType {
  unreadCount: number;
  refreshUnreadCount: () => Promise<void>;
  resetUnreadCount: () => Promise<void>;
}

const UnreadMessagesContext = createContext<UnreadMessagesContextType | undefined>(undefined);

export const UnreadMessagesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Safely access auth context - use useContext directly to avoid throwing errors during hot reload
  const authContext = useContext(AuthContext);
  const user = authContext?.user || null;

  const userId = user?.id || null;

  const refreshUnreadCount = useCallback(async () => {
    if (!userId) {
      setUnreadCount(0);
      return;
    }
    
    try {
      // First get the user's chat
      const { data: chats, error: chatError } = await supabase
        .from('chats')
        .select('id')
        .eq('user_id', userId)
        .eq('is_closed', false)
        .limit(1);
      
      if (chatError || !chats || chats.length === 0) {
        setUnreadCount(0);
        return;
      }
      
      const chatId = chats[0].id;
      
      // Count unread messages for the current user's chat
      const { count, error } = await supabase
        .from('chat_messages')
        .select('*', { count: 'exact', head: true })
        .eq('sender_type', 'admin')
        .eq('is_read', false)
        .eq('chat_id', chatId);
        
      if (error) {
        console.error('Error counting unread messages:', error);
        setUnreadCount(0);
        return;
      }
      
      setUnreadCount(count || 0);
    } catch (error) {
      console.error('Error in refreshUnreadCount:', error);
      setUnreadCount(0);
    }
  }, [userId]);

  // refs to hold the active channel and debounce timer across renders
  const channelRef = useRef<any>(null);
  const refreshTimeoutRef = useRef<number | null>(null);

  // Reset unread count by marking all as read in DB
  const resetUnreadCount = useCallback(async () => {
    if (!userId) return;
    
    try {
      // First get the user's chat
      const { data: chats, error: chatError } = await supabase
        .from('chats')
        .select('id')
        .eq('user_id', userId)
        .eq('is_closed', false)
        .limit(1);
      
      if (chatError || !chats || chats.length === 0) {
        setUnreadCount(0);
        return;
      }
      
      const chatId = chats[0].id;
      
      // Mark all unread admin messages as read for this user's chat
      const { data: messages, error } = await supabase
        .from('chat_messages')
        .select('id')
        .eq('sender_type', 'admin')
        .eq('is_read', false)
        .eq('chat_id', chatId);
        
      if (error || !messages || messages.length === 0) {
        setUnreadCount(0);
        return;
      }
      
      await supabase
        .from('chat_messages')
        .update({ is_read: true })
        .in('id', messages.map((msg: any) => msg.id));
        
      setUnreadCount(0);
    } catch (error) {
      console.error('Error in resetUnreadCount:', error);
      setUnreadCount(0);
    }
  }, [userId]);

  useEffect(() => {
    // Initial count
    refreshUnreadCount();

    // Keep a ref to the active channel so we don't recreate on re-renders
    const existingChannel = channelRef.current;

    // Subscribe to realtime changes for chat_messages only once per authenticated user
    if (userId && !existingChannel) {
      const channelName = `chat_messages_changes_user_${userId}`;
      const channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'chat_messages'
          },
          (payload) => {
            // Debounce refreshes to avoid rapid repeated network calls
            if (refreshTimeoutRef.current) {
              clearTimeout(refreshTimeoutRef.current);
            }
            refreshTimeoutRef.current = window.setTimeout(() => {
              // Only refresh for admin messages insert/update
              if (payload.eventType === 'INSERT' && payload.new?.sender_type === 'admin' && payload.new?.is_read === false) {
                refreshUnreadCount();
              } else if (payload.eventType === 'UPDATE' && payload.new?.sender_type === 'admin') {
                refreshUnreadCount();
              }
            }, 250) as unknown as number;
          }
        )
        .subscribe();

      channelRef.current = channel;
    }

    // Cleanup subscription on unmount or when userId changes
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
        refreshTimeoutRef.current = null;
      }
      const ch = channelRef.current;
      if (ch) {
        console.log('Cleaning up chat messages subscription');
        supabase.removeChannel(ch);
        channelRef.current = null;
      }
    };
  }, [userId, refreshUnreadCount]);
  

  return (
    <UnreadMessagesContext.Provider value={{ unreadCount, refreshUnreadCount, resetUnreadCount }}>
      {children}
    </UnreadMessagesContext.Provider>
  );
};

export const useUnreadMessages = () => {
  const context = useContext(UnreadMessagesContext);
  if (!context) {
    throw new Error('useUnreadMessages must be used within an UnreadMessagesProvider');
  }
  return context;
};
