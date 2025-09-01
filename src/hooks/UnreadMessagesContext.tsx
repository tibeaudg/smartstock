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
    // Count unread messages for the current user
    const { count, error } = await supabase
      .from('chat_messages')
      .select('*', { count: 'exact', head: true })
      .eq('sender_type', 'admin')
      .eq('is_read', false)
  .eq('chat_id', user?.id);
    if (error) {
      setUnreadCount(0);
      return;
    }
    setUnreadCount(count || 0);
  }, [user]);

  // Reset unread count by marking all as read in DB
  const resetUnreadCount = useCallback(async () => {
    if (!user) return;
    // Mark all unread admin messages as read for this user
    const { data: messages, error } = await supabase
      .from('chat_messages')
      .select('id')
      .eq('sender_type', 'admin')
      .eq('is_read', false)
  .eq('chat_id', user?.id);
    if (error || !messages || messages.length === 0) {
      setUnreadCount(0);
      return;
    }
    await supabase
      .from('chat_messages')
      .update({ is_read: true })
      .in('id', messages.map((msg: any) => msg.id));
    setUnreadCount(0);
  }, [user]);

  useEffect(() => {
    refreshUnreadCount();
    // Optionally, subscribe to realtime changes for chat_messages
    // ...existing code...
  }, [refreshUnreadCount]);

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
