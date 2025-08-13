-- Enable UUID-OSSP extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create chats table
CREATE TABLE IF NOT EXISTS public.chats (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    is_closed BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    chat_id UUID NOT NULL REFERENCES public.chats(id) ON DELETE CASCADE,
    sender_type TEXT NOT NULL CHECK (sender_type IN ('user', 'admin')),
    sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_chats_user_id ON public.chats(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_chat_id ON public.chat_messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_is_read ON public.chat_messages(is_read);
CREATE INDEX IF NOT EXISTS idx_chat_messages_sender_type ON public.chat_messages(sender_type);

-- Function to update chat updated_at timestamp
CREATE OR REPLACE FUNCTION update_chat_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.chats 
    SET updated_at = NOW()
    WHERE id = NEW.chat_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update chat updated_at
DROP TRIGGER IF EXISTS update_chat_timestamp ON chat_messages;
CREATE TRIGGER update_chat_timestamp
    AFTER INSERT ON chat_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_chat_updated_at();

-- Set up RLS (Row Level Security) policies
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Policy for chats: users can only see their own chats, admins can see all
CREATE POLICY "Users can view own chats" ON public.chats
    FOR ALL USING (
        auth.uid() = user_id OR 
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Policy for chat messages: users can only see messages in their chats, admins can see all
CREATE POLICY "Users can view messages in their chats" ON public.chat_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.chats 
            WHERE chats.id = chat_messages.chat_id 
            AND (chats.user_id = auth.uid() OR EXISTS (
                SELECT 1 FROM public.profiles 
                WHERE user_id = auth.uid() AND role = 'admin'
            ))
        )
    );

-- Policy for inserting messages
CREATE POLICY "Users can insert messages" ON public.chat_messages
    FOR INSERT WITH CHECK (
        sender_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM public.chats 
            WHERE chats.id = chat_messages.chat_id 
            AND (chats.user_id = auth.uid() OR EXISTS (
                SELECT 1 FROM public.profiles 
                WHERE user_id = auth.uid() AND role = 'admin'
            ))
        )
    );

-- Grant access to authenticated users
GRANT ALL ON public.chats TO authenticated;
GRANT ALL ON public.chat_messages TO authenticated;

-- Enable realtime for these tables
ALTER PUBLICATION supabase_realtime ADD TABLE chats;
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
