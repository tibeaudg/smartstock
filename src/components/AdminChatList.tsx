import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { fetchAllChats, fetchChatMessages, sendChatMessage, markMessagesAsRead, fetchAllChatsTest, debugAllChats, fetchAllChatsIncludingClosed } from '@/lib/chatApi';
import { useAuth } from '@/hooks/useAuth';
import { useUnreadMessages } from '@/hooks/UnreadMessagesContext';
import { MessageSquare, MessageSquareDashed, RefreshCw } from 'lucide-react';

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
                          {lastMessage && (
                            <div className="flex items-center gap-2">
                              {hasUnread && (
                                <MessageSquare className="w-4 h-4 text-blue-500" />
                              )}
                              <p className="text-sm text-gray-500 truncate max-w-xs">
                                {lastMessage.message}
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
