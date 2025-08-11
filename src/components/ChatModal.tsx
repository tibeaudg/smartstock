import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { getOrCreateChat, fetchChatMessages, sendChatMessage } from '@/lib/chatApi';

interface ChatModalProps {
  open: boolean;
  onClose: () => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({ open, onClose }) => {
  const { user, userProfile } = useAuth();
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll naar beneden bij nieuwe berichten
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Chat ophalen of aanmaken
  useEffect(() => {
    if (!open || !user) return;
    setLoading(true);
    getOrCreateChat(user.id)
      .then(chat => {
        setChatId(chat.id);
        return fetchChatMessages(chat.id);
      })
      .then(setMessages)
      .finally(() => setLoading(false));
  }, [open, user]);

  // Bericht versturen
  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !chatId || !user) return;
    setLoading(true);
    await sendChatMessage({
      chatId,
      senderType: 'user',
      senderId: user.id,
      message: input.trim(),
    });
    setInput('');
    const msgs = await fetchChatMessages(chatId);
    setMessages(msgs);
    setLoading(false);
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-4 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">✕</button>
        <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
          <MessageCircle className="w-5 h-5" /> Chat met support
        </h2>
        <div className="h-64 overflow-y-auto border rounded p-2 mb-2 bg-gray-50">
          {loading ? (
            <div className="text-center text-gray-400 mt-24">Laden…</div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-400 mt-24">Start een gesprek…</div>
          ) : (
            <div>
              {messages.map((msg) => (
                <div key={msg.id} className={`mb-2 flex ${msg.sender_type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`px-3 py-2 rounded-lg max-w-xs ${msg.sender_type === 'user' ? 'bg-blue-100 text-blue-900' : 'bg-gray-200 text-gray-800'}`}>
                    {msg.message}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
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
          <Button type="submit" disabled={loading || !input.trim()}>Verstuur</Button>
        </form>
      </div>
    </div>
  );
};
