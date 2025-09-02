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
  console.log('Fetching all chats...');
  
  // First fetch all active chats with user profiles
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
    .eq('is_closed', false)
    .order('updated_at', { ascending: false });

  if (chatsError) {
    console.error('Error fetching chats:', chatsError);
    throw chatsError;
  }

  console.log('Raw chats from database:', chats);
  console.log('Found chats:', chats?.length || 0);

  // Then fetch unread counts and latest messages for each chat
  const chatsWithCounts = await Promise.all((chats || []).map(async (chat) => {
    console.log('Processing chat:', chat.id, 'for user:', chat.user_id);
    
    // Fetch unread count
    const { count: unreadCount, error: countError } = await supabase
      .from('chat_messages')
      .select('*', { count: 'exact', head: true })
      .eq('chat_id', chat.id)
      .eq('sender_type', 'user')
      .eq('is_read', false);

    if (countError) {
      console.error('Error fetching unread count for chat:', chat.id, countError);
    }

    // Fetch latest messages (last 5 messages for preview)
    const { data: latestMessages, error: messagesError } = await supabase
      .from('chat_messages')
      .select('id, message, created_at, sender_type, is_read')
      .eq('chat_id', chat.id)
      .order('created_at', { ascending: false })
      .limit(5);

    if (messagesError) {
      console.error('Error fetching messages for chat:', chat.id, messagesError);
    }

    const chatWithData = {
      ...chat,
      unread_count: unreadCount || 0,
      chat_messages: latestMessages || []
    };

    console.log('Chat with data:', chatWithData);
    return chatWithData;
  }));

  console.log('Final chats with counts:', chatsWithCounts);
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

// Test functie om fetchAllChats te testen zonder is_closed filter
export async function fetchAllChatsTest() {
  console.log('=== TEST: fetchAllChats without is_closed filter ===');
  
  // Test fetchAllChats without the is_closed filter
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
    // .eq('is_closed', false)  // Comment this out for testing
    .order('updated_at', { ascending: false });

  if (chatsError) {
    console.error('Error fetching chats without closed filter:', chatsError);
    throw chatsError;
  }

  console.log('Chats without is_closed filter:', chats);
  console.log('Found chats without filter:', chats?.length || 0);

  // Then fetch unread counts and latest messages for each chat
  const chatsWithCounts = await Promise.all((chats || []).map(async (chat) => {
    console.log('Processing chat:', chat.id, 'for user:', chat.user_id);
    
    // Fetch unread count
    const { count: unreadCount, error: countError } = await supabase
      .from('chat_messages')
      .select('*', { count: 'exact', head: true })
      .eq('chat_id', chat.id)
      .eq('sender_type', 'user')
      .eq('is_read', false);

    if (countError) {
      console.error('Error fetching unread count for chat:', chat.id, countError);
    }

    // Fetch latest messages (last 5 messages for preview)
    const { data: latestMessages, error: messagesError } = await supabase
      .from('chat_messages')
      .select('id, message, created_at, sender_type, is_read')
      .eq('chat_id', chat.id)
      .order('created_at', { ascending: false })
      .limit(5);

    if (messagesError) {
      console.error('Error fetching messages for chat:', chat.id, messagesError);
    }

    const chatWithData = {
      ...chat,
      unread_count: unreadCount || 0,
      chat_messages: latestMessages || []
    };

    console.log('Chat with data:', chatWithData);
    return chatWithData;
  }));

  console.log('Final chats with counts (without filter):', chatsWithCounts);
  return chatsWithCounts;
}
