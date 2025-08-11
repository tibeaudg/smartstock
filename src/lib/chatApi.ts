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
    .insert({ chat_id: chatId, sender_type: senderType, sender_id: senderId, message })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function fetchAllChats() {
  const { data, error } = await supabase
    .from('chats')
    .select('*, chat_messages(*)')
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return data || [];
}
