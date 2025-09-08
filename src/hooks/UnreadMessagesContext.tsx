import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

interface UnreadMessagesContextType {
  unreadCount: number;
  refreshUnreadCount: () => Promise<void>;
  resetUnreadCount: () => Promise<void>;
}

const UnreadMessagesContext = createContext<UnreadMessagesContextType | undefined>(undefined);

export const UnreadMessagesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  const refreshUnreadCount = useCallback(async () => {
    if (!user) {
      setUnreadCount(0);
      return;
    }
    
    try {
      // First get the user's chat
      const { data: chats, error: chatError } = await supabase
        .from('chats')
        .select('id')
        .eq('user_id', user.id)
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
  }, [user]);

  // Reset unread count by marking all as read in DB
  const resetUnreadCount = useCallback(async () => {
    if (!user) return;
    
    try {
      // First get the user's chat
      const { data: chats, error: chatError } = await supabase
        .from('chats')
        .select('id')
        .eq('user_id', user.id)
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
  }, [user]);

  useEffect(() => {
    refreshUnreadCount();
    
    // Subscribe to realtime changes for chat_messages
    if (user) {
      const channel = supabase
        .channel('chat_messages_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'chat_messages'
          },
          (payload) => {
            console.log('Chat message change detected:', payload);
            
            // Only refresh if the message is from admin and unread
            if (payload.eventType === 'INSERT' && 
                payload.new?.sender_type === 'admin' && 
                payload.new?.is_read === false) {
              console.log('New unread admin message, refreshing count...');
              refreshUnreadCount();
            } else if (payload.eventType === 'UPDATE' && 
                       payload.new?.sender_type === 'admin') {
              // Refresh when admin messages are marked as read/unread
              console.log('Admin message updated, refreshing count...');
              refreshUnreadCount();
            }
          }
        )
        .subscribe();

      // Cleanup subscription on unmount
      return () => {
        console.log('Cleaning up chat messages subscription');
        supabase.removeChannel(channel);
      };
    }
  }, [refreshUnreadCount, user]);

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
