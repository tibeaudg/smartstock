import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MessageCircle, X, Send, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { getOrCreateChat, fetchChatMessages, sendChatMessage, markMessagesAsRead } from '@/lib/chatApi';

interface Message {
  id: string;
  sender_type: 'user' | 'support';
  senderId: string;
  message: string;
  created_at: string;
}

interface ChatModalProps {
  open: boolean;
  onClose: () => void;
  'aria-describedby'?: string;
  resetUnreadMessages?: () => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({ 
  open, 
  onClose, 
  'aria-describedby': ariaDescribedBy,
  resetUnreadMessages
}) => {
  const { user, userProfile } = useAuth();
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = useCallback((smooth = true) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: smooth ? 'smooth' : 'auto',
        block: 'end',
      });
    }
  }, []);

  // Scroll to bottom when messages change or when loading completes
  useEffect(() => {
    if (!loading) {
      scrollToBottom(false); // Use instant scroll when loading messages
    }
  }, [messages, loading, scrollToBottom]);

  // Initialize chat when modal opens
  useEffect(() => {
    let mounted = true;

    if (!open || !user) {
      // Reset state when closing
      if (!open) {
        setMessages([]);
        setChatId(null);
        setError(null);
        setInput('');
      }
      return () => { mounted = false; };
    }

    const initializeChat = async () => {
      // Instantly reset unread messages count in sidebar
      if (resetUnreadMessages) resetUnreadMessages();
      if (!mounted) return;
      setLoading(true);
      setError(null);
      
      try {
        const chat = await getOrCreateChat(user.id);
        if (!mounted) return;
        setChatId(chat.id);
        
        console.log('Chat initialized with profile:', { userProfile, chatId: chat.id });
        
        // Mark messages as read based on user role
        try {
          if (userProfile?.role === 'admin') {
            // When admin opens chat, mark user messages as read
            const updatedMessages = await markMessagesAsRead(chat.id, 'user');
            if (!mounted) return;
            console.log('Admin opened chat, marking user messages as read:', updatedMessages);
          } else {
            // When regular user opens chat, mark admin messages as read
            const updatedMessages = await markMessagesAsRead(chat.id, 'admin');
            if (!mounted) return;
            console.log('User opened chat, marking admin messages as read:', updatedMessages);
          }
          // Trigger unread count refresh in sidebar
          if (resetUnreadMessages) resetUnreadMessages();
        } catch (err) {
          // Log error but continue with chat initialization
          console.warn('Failed to mark messages as read:', err);
        }

        // Then fetch the updated messages
        const chatMessages = await fetchChatMessages(chat.id);
        if (!mounted) return;
        setMessages(chatMessages);
      } catch (err) {
        if (!mounted) return;
        console.error('Failed to initialize chat:', err);
        setError('Kon chat niet laden. Probeer het opnieuw.');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeChat();
    return () => { mounted = false; };
  }, [open, user, userProfile?.role]); // Added userProfile?.role as dependency

  // Focus input when chat opens
  useEffect(() => {
    if (open && !loading) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, loading]);

  // Handle message sending
  const handleSend = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || !chatId || !user || sending) return;

    const messageText = input.trim();
    setInput('');
    setSending(true);
    setError(null);

    try {
      await sendChatMessage({
        chatId,
        senderType: 'user',
        senderId: user.id,
        message: messageText,
      });

      // Refresh messages
      const updatedMessages = await fetchChatMessages(chatId);
      setMessages(updatedMessages);
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Bericht kon niet worden verzonden. Probeer het opnieuw.');
      setInput(messageText); // Restore the message
    } finally {
      setSending(false);
      // Scroll to bottom immediately after sending a message
      scrollToBottom(false);
    }
  }, [input, chatId, user, sending, scrollToBottom]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="chat-modal-title"
      aria-describedby={ariaDescribedBy}
    >
      {/* Desktop Position */}
      <div
        className="absolute top-1/2 -translate-y-1/2 hidden md:block"
        style={{ left: '55%', transform: 'translate(-55%, -50%)', width: '500px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <ChatContent 
          onClose={onClose}
          messages={messages}
          input={input}
          setInput={setInput}
          loading={loading}
          sending={sending}
          error={error}
          onSend={handleSend}
          inputRef={inputRef}
          messagesEndRef={messagesEndRef}
        />
      </div>

      {/* Mobile Position */}
      <div
        className="absolute inset-x-4 top-1/2 -translate-y-1/2 md:hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <ChatContent 
          onClose={onClose}
          messages={messages}
          input={input}
          setInput={setInput}
          loading={loading}
          sending={sending}
          error={error}
          onSend={handleSend}
          inputRef={inputRef}
          messagesEndRef={messagesEndRef}
        />
      </div>
    </div>
  );
};

interface ChatContentProps {
  onClose: () => void;
  messages: Message[];
  input: string;
  setInput: (value: string) => void;
  loading: boolean;
  sending: boolean;
  error: string | null;
  onSend: (e: React.FormEvent) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const ChatContent: React.FC<ChatContentProps> = ({
  onClose,
  messages,
  input,
  setInput,
  loading,
  sending,
  error,
  onSend,
  inputRef,
  messagesEndRef,
}) => {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto flex flex-col max-h-[600px] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <MessageCircle className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-sm font-semibold text-gray-800">
              Support Chat
            </h2>
            <p className="text-xs text-gray-500">We helpen je graag</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0 rounded-full hover:bg-gray-200 transition-colors"
          aria-label="Chat sluiten"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="flex items-center gap-2 text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Chat wordt geladen...</span>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-center">
              <MessageCircle className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-gray-500 text-sm">Start een gesprek met ons support team</p>
              <p className="text-gray-400 text-xs mt-1">We reageren zo snel mogelijk</p>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="px-4 pb-2">
          <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4 bg-gray-50 rounded-b-xl">
        <form onSubmit={onSend} className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-400 text-sm"
            placeholder="Typ je bericht hier..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading || sending}
            maxLength={500}
          />
          <Button
            type="submit"
            disabled={loading || sending || !input.trim()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all rounded-lg"
          >
            {sending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>
        {input.length > 450 && (
          <p className="text-xs text-gray-500 mt-1">
            {500 - input.length} karakters over
          </p>
        )}
      </div>
    </div>
  );
};

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender_type === 'user';
  const timestamp = new Date(message.created_at).toLocaleTimeString('nl-NL', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className="max-w-[75%]">
        <div
          className={`
            px-3 py-2 rounded-2xl text-sm leading-relaxed
            ${isUser
              ? 'bg-blue-600 text-white rounded-br-md'
              : 'bg-gray-100 text-gray-900 rounded-bl-md'
            }
          `}
        >
          {message.message}
        </div>
        <p className={`text-xs text-gray-500 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {timestamp}
        </p>
      </div>
    </div>
  );
};

export default ChatModal;
