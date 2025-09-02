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
  
  // First fetch all chats (including closed) with user profiles
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
      .order('created_at', { ascending: true }) // Verander naar ascending voor correcte volgorde
      .limit(5);

    if (messagesError) {
      console.error('Error fetching messages for chat:', chat.id, messagesError);
    }

    // Reverse de volgorde zodat nieuwste bericht laatste is voor de UI
    const reversedMessages = latestMessages ? [...latestMessages].reverse() : [];

    const chatWithData = {
      ...chat,
      unread_count: unreadCount || 0,
      chat_messages: reversedMessages
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

// Uitgebreide debug functie om alle mogelijke problemen te onderzoeken
export async function debugAllChats() {
  console.log('=== UITGEBREIDE DEBUG: Onderzoek alle mogelijke problemen ===');
  
  // Test 1: Haal alle chats op zonder enige relaties
  console.log('=== TEST 1: Alle chats zonder relaties ===');
  const { data: allChatsRaw, error: rawError } = await supabase
    .from('chats')
    .select('*')
    .order('updated_at', { ascending: false });

  if (rawError) {
    console.error('Error fetching raw chats:', rawError);
  } else {
    console.log('Raw chats (alleen chats tabel):', allChatsRaw);
    console.log('Aantal raw chats:', allChatsRaw?.length || 0);
  }

  // Test 2: Haal alle chats op met alleen user_id (zonder profiles relatie)
  console.log('=== TEST 2: Chats met user_id maar zonder profiles relatie ===');
  const { data: chatsWithUserId, error: userIdError } = await supabase
    .from('chats')
    .select('id, created_at, updated_at, user_id, is_closed')
    .order('updated_at', { ascending: false });

  if (userIdError) {
    console.error('Error fetching chats with user_id:', userIdError);
  } else {
    console.log('Chats met user_id:', chatsWithUserId);
    console.log('Aantal chats met user_id:', chatsWithUserId?.length || 0);
  }

  // Test 3: Test elke user_id individueel
  if (chatsWithUserId && chatsWithUserId.length > 0) {
    console.log('=== TEST 3: Test elke user_id individueel ===');
    
    for (const chat of chatsWithUserId) {
      console.log(`--- Testing chat ${chat.id} voor user ${chat.user_id} ---`);
      
      // Test of we deze specifieke chat kunnen ophalen
      const { data: singleChat, error: singleError } = await supabase
        .from('chats')
        .select('*')
        .eq('id', chat.id)
        .single();

      if (singleError) {
        console.error(`Error fetching single chat ${chat.id}:`, singleError);
      } else {
        console.log(`Single chat ${chat.id} found:`, singleChat);
      }

      // Test of we het profiel van deze gebruiker kunnen ophalen
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email')
        .eq('id', chat.user_id)
        .single();

      if (profileError) {
        console.error(`Error fetching profile for user ${chat.user_id}:`, profileError);
      } else {
        console.log(`Profile for user ${chat.user_id}:`, profile);
      }
    }
  }

  // Test 4: Test of we alle profiles kunnen ophalen
  console.log('=== TEST 4: Test alle profiles ===');
  const { data: allProfiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, email')
    .limit(10);

  if (profilesError) {
    console.error('Error fetching all profiles:', profilesError);
  } else {
    console.log('Alle profiles:', allProfiles);
    console.log('Aantal profiles:', allProfiles?.length || 0);
  }

  // Test 5: Test de relatie query stap voor stap
  console.log('=== TEST 5: Test relatie query stap voor stap ===');
  if (chatsWithUserId && chatsWithUserId.length > 0) {
    const testChat = chatsWithUserId[0];
    console.log(`Testing relatie voor chat ${testChat.id} met user ${testChat.user_id}`);
    
    const { data: relatieTest, error: relatieError } = await supabase
      .from('chats')
      .select(`
        *,
        profiles:user_id (
          id,
          first_name,
          last_name,
          email
        )
      `)
      .eq('id', testChat.id)
      .single();

    if (relatieError) {
      console.error('Error testing relatie:', relatieError);
    } else {
      console.log('Relatie test result:', relatieTest);
    }
  }

  return {
    allChatsRaw,
    chatsWithUserId,
    allProfiles
  };
}

// Functie om ALLE chats op te halen inclusief gesloten chats
export async function fetchAllChatsIncludingClosed() {
  console.log('=== FETCH ALLE CHATS INCLUSIEF GESLOTEN ===');
  
  // Haal alle chats op zonder enige filters
  const { data: allChats, error: chatsError } = await supabase
    .from('chats')
    .select(`
      *,
      profiles:user_id (
        id,
        first_name,
        last_name,
        email
      )
    `)
    .order('updated_at', { ascending: false });

  if (chatsError) {
    console.error('Error fetching all chats including closed:', chatsError);
    throw chatsError;
  }

  console.log('Alle chats inclusief gesloten:', allChats);
  console.log('Totaal aantal chats gevonden:', allChats?.length || 0);

  // Toon details van elke chat
  if (allChats && allChats.length > 0) {
    console.log('=== DETAILS VAN ALLE CHATS ===');
    allChats.forEach((chat, index) => {
      console.log(`Chat ${index + 1}:`, {
        id: chat.id,
        user_id: chat.user_id,
        is_closed: chat.is_closed,
        created_at: chat.created_at,
        updated_at: chat.updated_at,
        profile: chat.profiles
      });
    });
  }

  return allChats;
}

// Functie om RLS policies te testen
export async function testRLSPolicies() {
  console.log('=== TEST RLS POLICIES ===');
  
  // Test 1: Haal alle chats op zonder relaties
  console.log('=== TEST 1: Alle chats zonder relaties ===');
  const { data: allChatsRaw, error: rawError } = await supabase
    .from('chats')
    .select('*')
    .order('updated_at', { ascending: false });

  if (rawError) {
    console.error('Error fetching raw chats:', rawError);
  } else {
    console.log('Raw chats (alleen chats tabel):', allChatsRaw);
    console.log('Aantal raw chats:', allChatsRaw?.length || 0);
  }

  // Test 2: Haal alle profiles op
  console.log('=== TEST 2: Alle profiles ===');
  const { data: allProfiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, email')
    .order('first_name');

  if (profilesError) {
    console.error('Error fetching all profiles:', profilesError);
  } else {
    console.log('Alle profiles:', allProfiles);
    console.log('Aantal profiles:', allProfiles?.length || 0);
  }

  // Test 3: Test elke user_id individueel
  if (allChatsRaw && allChatsRaw.length > 0) {
    console.log('=== TEST 3: Test elke user_id individueel ===');
    
    for (const chat of allChatsRaw) {
      console.log(`--- Testing chat ${chat.id} voor user ${chat.user_id} ---`);
      
      // Test of we deze specifieke chat kunnen ophalen
      const { data: singleChat, error: singleError } = await supabase
        .from('chats')
        .select('*')
        .eq('id', chat.id)
        .single();

      if (singleError) {
        console.error(`Error fetching single chat ${chat.id}:`, singleError);
      } else {
        console.log(`Single chat ${chat.id} found:`, singleChat);
      }

      // Test of we het profiel van deze gebruiker kunnen ophalen
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email')
        .eq('id', chat.user_id)
        .single();

      if (profileError) {
        console.error(`Error fetching profile for user ${chat.user_id}:`, profileError);
      } else {
        console.log(`Profile for user ${chat.user_id}:`, profile);
      }
    }
  }

  // Test 4: Test of we alle profiles kunnen ophalen
  console.log('=== TEST 4: Test alle profiles ===');
  const { data: allProfiles2, error: profilesError2 } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, email')
    .limit(10);

  if (profilesError2) {
    console.error('Error fetching all profiles:', profilesError2);
  } else {
    console.log('Alle profiles:', allProfiles2);
    console.log('Aantal profiles:', allProfiles2?.length || 0);
  }

  // Test 5: Test de relatie query stap voor stap
  console.log('=== TEST 5: Test relatie query stap voor stap ===');
  if (allChatsRaw && allChatsRaw.length > 0) {
    const testChat = allChatsRaw[0];
    console.log(`Testing relatie voor chat ${testChat.id} met user ${testChat.user_id}`);
    
    const { data: relatieTest, error: relatieError } = await supabase
      .from('chats')
      .select(`
        *,
        profiles:user_id (
          id,
          first_name,
          last_name,
          email
        )
      `)
      .eq('id', testChat.id)
      .single();

    if (relatieError) {
      console.error('Error testing relatie:', relatieError);
    } else {
      console.log('Relatie test result:', relatieTest);
    }
  }

  return {
    allChatsRaw,
    allProfiles
  };
}

// Functie om een chat en alle bijbehorende berichten te verwijderen
export async function deleteChat(chatId: string) {
  try {
    console.log('Deleting chat:', chatId);
    
    // Eerst alle berichten van deze chat verwijderen
    const { error: messagesError } = await supabase
      .from('chat_messages')
      .delete()
      .eq('chat_id', chatId);
    
    if (messagesError) {
      console.error('Error deleting chat messages:', messagesError);
      throw messagesError;
    }
    
    console.log('Chat messages deleted successfully');
    
    // Dan de chat zelf verwijderen
    const { error: chatError } = await supabase
      .from('chats')
      .delete()
      .eq('id', chatId);
    
    if (chatError) {
      console.error('Error deleting chat:', chatError);
      throw chatError;
    }
    
    console.log('Chat deleted successfully');
    return { success: true };
  } catch (error) {
    console.error('Error in deleteChat:', error);
    throw error;
  }
}
