-- Fix RLS policies for chat_messages table
-- Drop existing policies
DROP POLICY IF EXISTS "Users can view messages in their chats" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can insert messages" ON public.chat_messages;

-- Create simpler and more reliable policies
-- Policy for viewing messages: users can see messages in their chats, admins can see all
CREATE POLICY "Users can view messages in their chats" ON public.chat_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.chats 
            WHERE chats.id = chat_messages.chat_id 
            AND (
                chats.user_id = auth.uid() 
                OR 
                EXISTS (
                    SELECT 1 FROM public.profiles 
                    WHERE id = auth.uid() AND role = 'admin'
                )
            )
        )
    );

-- Policy for inserting messages: users can insert messages in their chats, admins can insert anywhere
CREATE POLICY "Users can insert messages" ON public.chat_messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.chats 
            WHERE chats.id = chat_messages.chat_id 
            AND (
                chats.user_id = auth.uid() 
                OR 
                EXISTS (
                    SELECT 1 FROM public.profiles 
                    WHERE id = auth.uid() AND role = 'admin'
                )
            )
        )
    );

-- Policy for updating messages: users can update their own messages, admins can update any
CREATE POLICY "Users can update messages" ON public.chat_messages
    FOR UPDATE USING (
        sender_id = auth.uid() 
        OR 
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Policy for deleting messages: users can delete their own messages, admins can delete any
CREATE POLICY "Users can delete messages" ON public.chat_messages
    FOR DELETE USING (
        sender_id = auth.uid() 
        OR 
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Also fix the chats policy to be more reliable
DROP POLICY IF EXISTS "Users can view own chats" ON public.chats;

CREATE POLICY "Users can view own chats" ON public.chats
    FOR ALL USING (
        user_id = auth.uid() 
        OR 
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );
