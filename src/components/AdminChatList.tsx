import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { fetchAllChats, fetchChatMessages, sendChatMessage, markMessagesAsRead, deleteChat } from '@/lib/chatApi';
import { useAuth } from '@/hooks/useAuth';
import { MessageSquare, MessageSquareDashed, RefreshCw, Bug, Trash2, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Helper function to check if a date is today
function isToday(date: Date) {
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
}

const getApiBase = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) {
    return (import.meta.env.VITE_API_URL as string).replace(/\/$/, '');
  }
  return '';
};

export const AdminChatList: React.FC = () => {
  const { user, session } = useAuth();
  const [chats, setChats] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [chatToDelete, setChatToDelete] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);

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

    return () => {
      mounted = false;
    };
  }, []);

  async function openChat(chat: any) {
    try {
      setSelectedChat(chat);
      setLoading(true);
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
    const replyText = input.trim();
    setLoading(true);
    try {
      await sendChatMessage({
        chatId: selectedChat.id,
        senderType: 'admin',
        senderId: user.id,
        message: replyText,
      });
      setInput('');
      const msgs = await fetchChatMessages(selectedChat.id);
      setMessages(msgs);
      refreshChatList();

      const userEmail = selectedChat.profiles?.email;
      if (userEmail) {
        try {
          const { data, error } = await supabase.functions.invoke<{ success: boolean; error?: string }>(
            'send-support-reply-email',
            { body: { chatId: selectedChat.id, message: replyText } }
          );
          if (!error && data?.success) {
            toast.success('Reply sent and email sent to user');
          } else if (data?.error) {
            console.warn('Support reply email failed:', data.error);
            toast.info('Reply saved; email could not be sent. Check SMTP in Admin.');
          } else if (error && session?.access_token) {
            const base = getApiBase();
            const url = base ? `${base}/api/send-support-reply-email` : '/api/send-support-reply-email';
            const res = await fetch(url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.access_token}`,
              },
              body: JSON.stringify({ chatId: selectedChat.id, message: replyText }),
            });
            const apiData = await res.json().catch(() => ({}));
            if (res.ok && apiData.success) {
              toast.success('Reply sent and email sent to user');
            } else {
              toast.info('Reply saved; email could not be sent. Check SMTP in Admin.');
            }
          } else {
            toast.info('Reply saved; email could not be sent. Check SMTP in Admin.');
          }
        } catch (err) {
          console.warn('Support reply email error:', err);
          toast.info('Reply saved; email could not be sent.');
        }
      }
    } finally {
      setLoading(false);
    }
  }

  // Functie om een chat te verwijderen
  const handleDeleteChat = async (chat: any) => {
    setChatToDelete(chat);
  };

  // Functie om de verwijdering te bevestigen
  const confirmDeleteChat = async () => {
    if (!chatToDelete) return;
    
    setDeleting(true);
    try {
      await deleteChat(chatToDelete.id);
      
      // Verwijder de chat uit de lokale state
      setChats(prevChats => prevChats.filter(chat => chat.id !== chatToDelete.id));
      
      // Als de geselecteerde chat wordt verwijderd, sluit deze
      if (selectedChat?.id === chatToDelete.id) {
        setSelectedChat(null);
        setMessages([]);
      }
      
      setChatToDelete(null);
    } catch (error) {
      console.error('Error deleting chat:', error);
      alert('Er is een fout opgetreden bij het verwijderen van de chat.');
    } finally {
      setDeleting(false);
    }
  };

  // Functie om de verwijdering te annuleren
  const cancelDeleteChat = () => {
    setChatToDelete(null);
  };

  // Debug functie
  const debugDatabase = async () => {
    try {
      setDebugInfo('Debug gestart...\n');
      
      // Test 1: Haal alle chats op (alleen chats tabel)
      const { data: allChatsRaw, error: chatsError } = await supabase
        .from('chats')
        .select('*')
        .order('created_at', { ascending: false });

      if (chatsError) {
        setDebugInfo(prev => prev + `Error fetching chats: ${chatsError.message}\n`);
      } else {
        setDebugInfo(prev => prev + 
          `Raw chats (alleen chats tabel): ${JSON.stringify(allChatsRaw, null, 2)}\n`
        );
        setDebugInfo(prev => prev + `Aantal raw chats: ${allChatsRaw?.length || 0}\n`);
      }

      // Test 2: Haal alle profiles op
      const { data: allProfiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email')
        .order('first_name');

      if (profilesError) {
        setDebugInfo(prev => prev + `Error fetching profiles: ${profilesError.message}\n`);
      } else {
        setDebugInfo(prev => prev + 
          `Alle profiles: ${JSON.stringify(allProfiles, null, 2)}\n`
        );
        setDebugInfo(prev => prev + `Aantal profiles: ${allProfiles?.length || 0}\n`);
      }

    } catch (error) {
      setDebugInfo(prev => prev + `Error tijdens debug: ${error}\n`);
    }
  };

  if (selectedChat) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Chat met {(() => {
            const firstName = selectedChat.profiles?.first_name?.trim();
            const lastName = selectedChat.profiles?.last_name?.trim();
            const email = selectedChat.profiles?.email;
            
            if (firstName || lastName) {
              return `${firstName || ''} ${lastName || ''}`.trim();
            } else if (email) {
              return email.split('@')[0];
            } else {
              return 'gebruiker';
            }
          })()}</CardTitle>
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
    <>
      {/* Delete Confirmation Modal */}
      {chatToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Chat verwijderen</h3>
              <button
                onClick={cancelDeleteChat}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Weet je zeker dat je de chat met{' '}
              <span className="font-medium">
                {(() => {
                  const firstName = chatToDelete.profiles?.first_name?.trim();
                  const lastName = chatToDelete.profiles?.last_name?.trim();
                  const email = chatToDelete.profiles?.email;
                  
                  if (firstName || lastName) {
                    return `${firstName || ''} ${lastName || ''}`.trim();
                  } else if (email) {
                    return email.split('@')[0];
                  } else {
                    return 'gebruiker';
                  }
                })()}
              </span>{' '}
              wilt verwijderen? Dit kan niet ongedaan worden gemaakt.
            </p>
            <div className="flex gap-3">
              <button
                onClick={cancelDeleteChat}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                disabled={deleting}
              >
                Annuleren
              </button>
              <button
                onClick={confirmDeleteChat}
                className="flex-1 px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
                disabled={deleting}
              >
                {deleting ? 'Verwijderen...' : 'Verwijderen'}
              </button>
            </div>
          </div>
        </div>
      )}

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
            Laatste update: {new Date().toLocaleTimeString('nl-NL')}
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
                  <div
                    key={chat.id}
                    className={`w-full px-4 py-3 rounded-lg transition-colors ${
                      hasUnread ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => openChat(chat)}
                        className="flex-1 text-left flex items-center space-x-3"
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          hasUnread ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {(() => {
                            const firstName = chat.profiles?.first_name?.trim();
                            const lastName = chat.profiles?.last_name?.trim();
                            const email = chat.profiles?.email;
                            
                            if (firstName) {
                              return firstName[0].toUpperCase();
                            } else if (lastName) {
                              return lastName[0].toUpperCase();
                            } else if (email) {
                              return email[0].toUpperCase();
                            } else {
                              return '?';
                            }
                          })()}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">
                              {(() => {
                                const firstName = chat.profiles?.first_name?.trim();
                                const lastName = chat.profiles?.last_name?.trim();
                                const email = chat.profiles?.email;
                                
                                if (firstName || lastName) {
                                  return `${firstName || ''} ${lastName || ''}`.trim();
                                } else if (email) {
                                  // Gebruik email als fallback, maar toon alleen het deel voor @
                                  return email.split('@')[0];
                                } else {
                                  return 'Gebruiker';
                                }
                              })()}
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
                      </button>
                      
                      <div className="flex items-center gap-2">
                        {!hasUnread && lastMessage && (
                          <MessageSquareDashed className="w-4 h-4 text-gray-400" />
                        )}
                        {timestamp && (
                          <span className="text-xs text-gray-500 flex-shrink-0">
                            {timestamp}
                          </span>
                        )}
                        
                        {/* Delete button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteChat(chat);
                          }}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors rounded"
                          title="Chat verwijderen"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};
