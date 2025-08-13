import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { fetchAllChats, fetchChatMessages, sendChatMessage } from '@/lib/chatApi';
import { useAuth } from '@/hooks/useAuth';

export const AdminChatList: React.FC = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const loadChats = async () => {
      try {
        const result = await fetchAllChats();
        if (mounted) {
          setChats(result);
        }
      } catch (error) {
        console.error('Error loading chats:', error);
      }
    };
    loadChats();
    return () => {
      mounted = false;
    };
  }, []);

  async function openChat(chat: any) {
    setSelectedChat(chat);
    setLoading(true);
    const msgs = await fetchChatMessages(chat.id);
    setMessages(msgs);
    setLoading(false);
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
          <div className="h-64 overflow-y-auto border rounded p-2 mb-2 bg-gray-50">
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
    <Card>
      <CardHeader>
        <CardTitle>Chatgesprekken</CardTitle>
        <p className="text-sm text-gray-500">Overzicht van alle support chats. Klik op een chat om te antwoorden.</p>
      </CardHeader>
      <CardContent>
        {chats.length === 0 ? (
          <div className="text-gray-400 text-center py-12">Nog geen chats gevonden.</div>
        ) : (
          <ul>
            {chats.map(chat => (
              <li key={chat.id} className="border-b last:border-b-0 py-2 flex justify-between items-center">
                <span>Chat met {chat.profiles?.first_name || 'gebruiker'} {chat.profiles?.last_name || ''}</span>
                <button className="text-blue-600 underline text-xs" onClick={() => openChat(chat)}>
                  Openen
                </button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};
