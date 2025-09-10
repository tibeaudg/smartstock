-- Fix chats table foreign key relationship
-- Dit script lost het probleem op waarbij de chats.user_id foreign key relatie niet correct is ingesteld

-- 1. Eerst verwijderen we de bestaande foreign key constraint (als deze bestaat)
ALTER TABLE chats DROP CONSTRAINT IF EXISTS chats_user_id_fkey;

-- 2. Controleer of de chats tabel bestaat en wat de huidige structuur is
DO $$
BEGIN
    -- Controleer of de chats tabel bestaat
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'chats' AND table_schema = 'public') THEN
        RAISE NOTICE 'Chats table exists, proceeding with foreign key fix...';
        
        -- Voeg de correcte foreign key constraint toe die naar profiles verwijst
        ALTER TABLE chats 
        ADD CONSTRAINT chats_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
        
        RAISE NOTICE 'Foreign key constraint added successfully';
    ELSE
        RAISE NOTICE 'Chats table does not exist, creating it...';
        
        -- Maak de chats tabel aan met de correcte foreign key relatie
        CREATE TABLE public.chats (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
            user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
            is_closed BOOLEAN DEFAULT false
        );
        
        -- Maak de chat_messages tabel aan
        CREATE TABLE public.chat_messages (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            chat_id UUID REFERENCES chats(id) ON DELETE CASCADE,
            sender_type TEXT CHECK (sender_type IN ('user', 'admin')),
            sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
            message TEXT NOT NULL,
            is_read BOOLEAN DEFAULT false,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
        );
        
        -- Voeg indexes toe
        CREATE INDEX IF NOT EXISTS idx_chats_user_id ON chats(user_id);
        CREATE INDEX IF NOT EXISTS idx_chat_messages_chat_id ON chat_messages(chat_id);
        CREATE INDEX IF NOT EXISTS idx_chat_messages_sender_id ON chat_messages(sender_id);
        
        RAISE NOTICE 'Chats and chat_messages tables created successfully';
    END IF;
END $$;

-- 3. Controleer of de chat_messages tabel de juiste foreign key heeft voor sender_id
DO $$
BEGIN
    -- Controleer of sender_id foreign key bestaat
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
        WHERE tc.table_name = 'chat_messages' 
        AND kcu.column_name = 'sender_id'
        AND tc.constraint_type = 'FOREIGN KEY'
    ) THEN
        -- Voeg foreign key toe voor sender_id
        ALTER TABLE chat_messages 
        ADD CONSTRAINT chat_messages_sender_id_fkey 
        FOREIGN KEY (sender_id) REFERENCES profiles(id) ON DELETE CASCADE;
        
        RAISE NOTICE 'Foreign key constraint for sender_id added successfully';
    ELSE
        RAISE NOTICE 'Foreign key constraint for sender_id already exists';
    END IF;
END $$;

-- 3.1. Voeg updated_at kolom toe aan chat_messages als deze niet bestaat
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'chat_messages' 
        AND column_name = 'updated_at'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE chat_messages 
        ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now());
        
        -- Update bestaande records met de huidige tijd
        UPDATE chat_messages 
        SET updated_at = created_at 
        WHERE updated_at IS NULL;
        
        RAISE NOTICE 'updated_at column added to chat_messages table';
    ELSE
        RAISE NOTICE 'updated_at column already exists in chat_messages table';
    END IF;
END $$;

-- 4. Zet RLS aan voor beide tabellen
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- 5. Maak RLS policies voor chats
DROP POLICY IF EXISTS "Users can view their own chats" ON chats;
DROP POLICY IF EXISTS "Admins can view all chats" ON chats;
DROP POLICY IF EXISTS "Users can create their own chats" ON chats;
DROP POLICY IF EXISTS "Users can update their own chats" ON chats;

CREATE POLICY "Users can view their own chats" ON chats
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all chats" ON chats
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Users can create their own chats" ON chats
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chats" ON chats
    FOR UPDATE USING (auth.uid() = user_id);

-- 6. Maak RLS policies voor chat_messages
DROP POLICY IF EXISTS "Users can view messages in their chats" ON chat_messages;
DROP POLICY IF EXISTS "Admins can view all messages" ON chat_messages;
DROP POLICY IF EXISTS "Users can send messages in their chats" ON chat_messages;
DROP POLICY IF EXISTS "Admins can send messages in any chat" ON chat_messages;

CREATE POLICY "Users can view messages in their chats" ON chat_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.chats 
            WHERE id = chat_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can view all messages" ON chat_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Users can send messages in their chats" ON chat_messages
    FOR INSERT WITH CHECK (
        sender_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM public.chats 
            WHERE id = chat_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can send messages in any chat" ON chat_messages
    FOR INSERT WITH CHECK (
        sender_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- 7. Maak een functie om updated_at automatisch bij te werken
CREATE OR REPLACE FUNCTION update_chat_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.chats 
    SET updated_at = NOW()
    WHERE id = NEW.chat_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. Maak een trigger om updated_at bij te werken bij nieuwe berichten
DROP TRIGGER IF EXISTS update_chat_timestamp ON chat_messages;
CREATE TRIGGER update_chat_timestamp
    AFTER INSERT ON chat_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_chat_updated_at();

-- 8.1. Maak een functie om updated_at bij te werken voor chat_messages
CREATE OR REPLACE FUNCTION update_chat_message_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8.2. Maak een trigger om updated_at bij te werken bij updates van chat_messages
DROP TRIGGER IF EXISTS update_chat_message_timestamp ON chat_messages;
CREATE TRIGGER update_chat_message_timestamp
    BEFORE UPDATE ON chat_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_chat_message_updated_at();

-- 9. Verleen de juiste permissies
GRANT ALL ON public.chats TO authenticated;
GRANT ALL ON public.chat_messages TO authenticated;

-- 10. Controleer de uiteindelijke structuur
SELECT 
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_name IN ('chats', 'chat_messages')
    AND tc.table_schema = 'public'
ORDER BY tc.table_name, kcu.column_name;
