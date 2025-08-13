import { supabase } from '@/integrations/supabase/client';

export async function getOrCreateChat(userId: string) {
  // Zoek bestaande open chat
  const { data: chats, error } = await supabase
    .from('chats')
    .select('*')
    .eq('user_id', userId)
    .eq('is_closed', false)
    .limit(1);
  if (error) throw error;
  if (chats && chats.length > 0) return chats[0];
  // Maak nieuwe chat aan
  const { data: newChat, error: createError } = await supabase
    .from('chats')
    .insert({ user_id: userId })
    .select()
    .single();
  if (createError) throw createError;
  return newChat;
}

export async function fetchChatMessages(chatId: string) {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('chat_id', chatId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function sendChatMessage({ chatId, senderType, senderId, message }: { chatId: string, senderType: 'user' | 'admin', senderId: string, message: string }) {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert({ 
      chat_id: chatId, 
      sender_type: senderType, 
      sender_id: senderId, 
      message,
      is_read: false // Always set new messages as unread
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function fetchAllChats() {
  // First fetch all chats with user profiles
  const { data: chats, error: chatsError } = await supabase
    .from('chats')
    .select(`
      *,
      profiles:user_id (
        first_name,
        last_name,
        email
      )
    `)
    .order('updated_at', { ascending: false });

  if (chatsError) throw chatsError;

  // Then fetch unread counts for each chat
  const chatsWithCounts = await Promise.all((chats || []).map(async (chat) => {
    const { count } = await supabase
      .from('chat_messages')
      .select('*', { count: 'exact', head: true })
      .eq('chat_id', chat.id)
      .eq('sender_type', 'user')
      .eq('is_read', false);

    return {
      ...chat,
      unread_count: count || 0
    };
  }));

  return chatsWithCounts;
}

export async function markMessagesAsRead(chatId: string, senderType: 'user' | 'admin') {
  console.log('Marking messages as read:', { chatId, senderType });
  
  try {
    // First, find all unread message IDs
    const { data: messages, error: findError } = await supabase
      .from('chat_messages')
      .select('id, is_read, sender_type')
      .eq('chat_id', chatId)
      .eq('sender_type', senderType)
      .eq('is_read', false);

    if (findError) {
      console.error('Error finding unread messages:', findError);
      throw findError;
    }

    console.log('Found unread messages:', messages);

    if (!messages || messages.length === 0) {
      console.log('No unread messages to update');
      return [];
    }

    if (messages.length === 0) {
      console.log('No unread messages to update');
      return [];
    }

    // Update all messages in a single query
    const { data: updatedMessages, error: updateError } = await supabase
      .from('chat_messages')
      .update({ 
        is_read: true,
        updated_at: new Date().toISOString()
      })
      .in('id', messages.map(msg => msg.id))
      .select();

    if (updateError) {
      console.error('Error updating messages:', updateError);
      throw updateError;
    }

    // If no data is returned but the update was successful, return the original messages as updated
    const result = updatedMessages || messages.map(msg => ({
      ...msg,
      is_read: true,
      updated_at: new Date().toISOString()
    }));

    console.log('Successfully updated messages:', result);
    return result;
  } catch (error) {
    console.error('Error in markMessagesAsRead:', error);
    throw error;
  }
}
