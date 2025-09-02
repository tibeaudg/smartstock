import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { fetchAllChats, fetchChatMessages, sendChatMessage, markMessagesAsRead, fetchAllChatsTest, debugAllChats, fetchAllChatsIncludingClosed } from '@/lib/chatApi';
import { useAuth } from '@/hooks/useAuth';
import { useUnreadMessages } from '@/hooks/UnreadMessagesContext';
import { MessageSquare, MessageSquareDashed, RefreshCw, Bug } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

// Helper function to check if a date is today
function isToday(date: Date) {
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
}

export const AdminChatList: React.FC = () => {
  const { resetUnreadCount } = useUnreadMessages();
  const { user } = useAuth();
  const [chats, setChats] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');

  React.useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Functie om chats op te halen
  const loadChats = async (forceRefresh = false) => {
    if (forceRefresh) {
      setRefreshing(true);
    }
    try {
      console.log('Loading chats...', { forceRefresh });
      const result = await fetchAllChats();
      console.log('Chats loaded:', result);
      setChats(result);
    } catch (error) {
      console.error('Error loading chats:', error);
    } finally {
      if (forceRefresh) {
        setRefreshing(false);
      }
    }
  };

  // Functie om chat lijst te verversen bij nieuwe berichten
  const refreshChatList = () => {
    loadChats();
  };

  useEffect(() => {
    let mounted = true;
    
    // Laad chats bij component mount
    loadChats();
    
    // Poll elke 3 seconden voor nieuwe chats en berichten
    const interval = setInterval(() => {
      if (mounted) {
        loadChats();
      }
    }, 3000); // 3 seconden voor snellere updates

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  async function openChat(chat: any) {
    try {
      setSelectedChat(chat);
      setLoading(true);
      // Instantly reset unread messages count in sidebar
      resetUnreadCount();
      // Mark messages as read first
      await markMessagesAsRead(chat.id, 'user');
      // Then fetch the messages to ensure we get the updated read status
      const msgs = await fetchChatMessages(chat.id);
      setMessages(msgs);
      
      // Ververs de chat lijst om de unread count bij te werken
      refreshChatList();
    } catch (error) {
      console.error('Error opening chat:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !selectedChat || !user) return;
    setLoading(true);
    await sendChatMessage({
      chatId: selectedChat.id,
      senderType: 'admin',
      senderId: user.id, // gebruik het echte admin user id
      message: input.trim(),
    });
    setInput('');
    const msgs = await fetchChatMessages(selectedChat.id);
    setMessages(msgs);
    
    // Ververs de chat lijst om nieuwe berichten te tonen
    refreshChatList();
    
    setLoading(false);
  }

  // Eenvoudige debug functie
  const debugDatabase = async () => {
    try {
      setDebugInfo('Debug gestart...\n');
      
      // Test 1: Haal alle chats op
      const allChats = await fetchAllChats();
      setDebugInfo(prev => prev + `Chats geladen: ${allChats?.length || 0}\n`);
      
      // Test 2: Toon details van elke chat
      if (allChats && allChats.length > 0) {
        setDebugInfo(prev => prev + `\n=== CHAT DETAILS ===\n`);
        allChats.forEach((chat, index) => {
          setDebugInfo(prev => prev + 
            `Chat ${index + 1}: ${chat.id}\n` +
            `  User: ${chat.profiles?.first_name} ${chat.profiles?.last_name}\n` +
            `  Berichten: ${chat.chat_messages?.length || 0}\n` +
            `  Unread: ${chat.unread_count || 0}\n` +
            `  Laatste bericht: ${chat.chat_messages?.[chat.chat_messages?.length - 1]?.message || 'Geen'}\n`
          );
        });
      }
      
      // Test 3: Haal alle berichten op
      const { data: allMessages, error: messagesError } = await supabase
        .from('chat_messages')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (messagesError) {
        setDebugInfo(prev => prev + `\nError ophalen berichten: ${messagesError.message}\n`);
      } else {
        setDebugInfo(prev => prev + `\nAlle berichten in database: ${allMessages?.length || 0}\n`);
        
        // Test 4: Controleer berichten per chat
        if (allChats && allChats.length > 0) {
          setDebugInfo(prev => prev + `\n=== BERICHTEN PER CHAT ===\n`);
          allChats.forEach((chat, index) => {
            const chatMessages = allMessages?.filter(msg => msg.chat_id === chat.id);
            setDebugInfo(prev => prev + 
              `Chat ${index + 1} (${chat.id}): ${chatMessages?.length || 0} berichten\n`
            );
            
            if (chatMessages && chatMessages.length > 0) {
              setDebugInfo(prev => prev + 
                `  Laatste: "${chatMessages[chatMessages.length - 1].message}"\n`
              );
            }
          });
        }
      }
      
      // Test 5: Controleer of er een mismatch is tussen fetchAllChats en directe database query
      setDebugInfo(prev => prev + `\n=== VERGELIJKING ===\n`);
      const chatsWithMessages = allChats?.filter(chat => 
        allMessages?.some(msg => msg.chat_id === chat.id)
      );
      setDebugInfo(prev => prev + 
        `Chats met berichten (volgens database): ${chatsWithMessages?.length || 0}\n` +
        `Chats met berichten (volgens fetchAllChats): ${allChats?.filter(chat => chat.chat_messages && chat.chat_messages.length > 0).length || 0}\n`
      );
      
      // Test 6: Specifiek onderzoek voor emperio test chat
      setDebugInfo(prev => prev + `\n=== SPECIFIEK ONDERZOEK EMPERIO ===\n`);
      const emperioChat = allChats?.find(chat => chat.profiles?.first_name === 'emperio');
      if (emperioChat) {
        setDebugInfo(prev => prev + 
          `Emperio chat ID: ${emperioChat.id}\n` +
          `User ID: ${emperioChat.user_id}\n` +
          `Is closed: ${emperioChat.is_closed}\n`
        );
        
        // Controleer of er berichten zijn voor deze specifieke chat
        const emperioMessages = allMessages?.filter(msg => msg.chat_id === emperioChat.id);
        setDebugInfo(prev => prev + 
          `Berichten voor emperio chat: ${emperioMessages?.length || 0}\n`
        );
        
        if (emperioMessages && emperioMessages.length > 0) {
          setDebugInfo(prev => prev + `Eerste paar berichten:\n`);
          emperioMessages.slice(0, 3).forEach((msg, index) => {
            setDebugInfo(prev => prev + 
              `  ${index + 1}. "${msg.message}" (${msg.created_at})\n`
            );
          });
        }
        
        // Controleer of er berichten zijn met dezelfde user_id
        const userMessages = allMessages?.filter(msg => msg.sender_id === emperioChat.user_id);
        setDebugInfo(prev => prev + 
          `Berichten van emperio user: ${userMessages?.length || 0}\n`
        );
      }
      
      // Test 7: Controleer alle chat IDs in berichten
      setDebugInfo(prev => prev + `\n=== ALLE CHAT IDS IN BERICHTEN ===\n`);
      const uniqueChatIds = [...new Set(allMessages?.map(msg => msg.chat_id) || [])];
      setDebugInfo(prev => prev + `Unieke chat IDs in berichten: ${uniqueChatIds.join(', ')}\n`);
      
      // Test 8: Controleer of er berichten zijn die niet aan chats zijn gekoppeld
      if (allChats && allMessages) {
        const chatIds = allChats.map(chat => chat.id);
        const orphanedMessages = allMessages.filter(msg => !chatIds.includes(msg.chat_id));
        setDebugInfo(prev => prev + 
          `Berichten zonder geldige chat: ${orphanedMessages.length}\n`
        );
        
        if (orphanedMessages.length > 0) {
          setDebugInfo(prev => prev + `Eerste paar orphaned berichten:\n`);
          orphanedMessages.slice(0, 3).forEach((msg, index) => {
            setDebugInfo(prev => prev + 
              `  ${index + 1}. Chat ID: ${msg.chat_id}, Bericht: "${msg.message}"\n`
            );
          });
        }
      }
      
    } catch (error) {
      setDebugInfo(prev => prev + `Error tijdens debug: ${error}\n`);
    }
  };

  if (selectedChat) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Chat met {selectedChat.profiles?.first_name || 'gebruiker'} {selectedChat.profiles?.last_name || ''}</CardTitle>
          <button className="text-xs text-blue-600 underline" onClick={() => setSelectedChat(null)}>
            Terug naar alle chats
          </button>
        </CardHeader>
        <CardContent>
          <div ref={scrollContainerRef} className="h-64 overflow-y-auto border rounded p-2 mb-2 bg-gray-50">
            {loading ? (
              <div className="text-center text-gray-400 mt-24">Laden…</div>
            ) : messages.length === 0 ? (
              <div className="text-center text-gray-400 mt-24">Geen berichten.</div>
            ) : (
              <div>
                {messages.map((msg) => (
                  <div key={msg.id} className={`mb-2 flex ${msg.sender_type === 'admin' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`px-3 py-2 rounded-lg max-w-xs ${msg.sender_type === 'admin' ? 'bg-blue-100 text-blue-900' : 'bg-gray-200 text-gray-800'}`}>
                      {msg.message}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <form className="flex gap-2" onSubmit={handleSend}>
            <input
              type="text"
              className="flex-1 border rounded px-2 py-1"
              placeholder="Typ een bericht..."
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={loading}
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded" disabled={loading || !input.trim()}>Verstuur</button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Support Chats</CardTitle>
            <p className="text-sm text-gray-500">Beheer hier alle actieve support chats</p>
          </div>
                     <div className="flex gap-2">
             <button
               onClick={() => loadChats(true)}
               disabled={refreshing}
               className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors disabled:opacity-50"
             >
               <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
               {refreshing ? 'Verversen...' : 'Verversen'}
             </button>
             <button
               onClick={debugDatabase}
               className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors"
             >
               <Bug className="w-4 h-4" />
               Debug
             </button>


           </div>
        </div>
      </CardHeader>
                 <CardContent>
           {refreshing && (
             <div className="flex justify-center items-center mb-2">
               <RefreshCw className="w-6 h-6 text-blue-500 animate-spin" />
               <span className="ml-2 text-sm text-gray-500">Nieuwe chats ophalen...</span>
             </div>
           )}
           
           {/* Debug informatie weergeven */}
           {debugInfo && (
             <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
               <h4 className="font-medium text-gray-800 mb-2">Debug Informatie:</h4>
               <pre className="text-xs text-gray-700 whitespace-pre-wrap overflow-auto max-h-32">
                 {debugInfo}
               </pre>
               <button 
                 onClick={() => setDebugInfo('')}
                 className="mt-2 text-xs text-gray-600 underline"
               >
                 Sluiten
               </button>
             </div>
           )}
           
           <div className="mb-2 text-xs text-gray-500 text-center">
             Laatste update: {new Date().toLocaleTimeString('nl-NL')} | Polling elke 3 seconden
           </div>
          {chats.length === 0 ? (
            <div className="text-gray-400 text-center py-12">Nog geen chats gevonden.</div>
          ) : (
            <div className="space-y-1">
              {chats.map(chat => {
                const hasUnread = chat.unread_count > 0;
                const lastMessage = chat.chat_messages?.[chat.chat_messages?.length - 1];
                const timestamp = lastMessage ? new Date(lastMessage.created_at).toLocaleString('nl-NL', {
                  hour: '2-digit',
                  minute: '2-digit',
                  ...(isToday(new Date(lastMessage.created_at)) ? {} : { day: '2-digit', month: '2-digit' })
                }) : '';

                return (
                  <button
                    key={chat.id}
                    onClick={() => openChat(chat)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      hasUnread ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          hasUnread ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {chat.profiles?.first_name?.[0] || chat.profiles?.last_name?.[0] || '?'}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">
                              {chat.profiles?.first_name || 'Gebruiker'} {chat.profiles?.last_name || ''}
                            </span>
                            {hasUnread && (
                              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                                {chat.unread_count}
                              </span>
                            )}
                          </div>
                          {lastMessage ? (
                            <div className="flex items-center gap-2">
                              {hasUnread && (
                                <MessageSquare className="w-4 h-4 text-blue-500" />
                              )}
                              <p className="text-sm text-gray-500 truncate max-w-xs">
                                {lastMessage.message}
                              </p>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <p className="text-sm text-gray-400 italic">
                                Geen berichten
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!hasUnread && lastMessage && (
                          <MessageSquareDashed className="w-4 h-4 text-gray-400" />
                        )}
                        {timestamp && (
                          <span className="text-xs text-gray-500 flex-shrink-0">
                            {timestamp}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </CardContent>
    </Card>
  );
};
