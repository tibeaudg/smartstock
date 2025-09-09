-- Fix stock_transactions created_by relationship and schema cache issue
-- Dit script lost het schema cache probleem op door expliciet de relatie in te stellen

-- Stap 1: Controleer of de created_by kolom bestaat, zo niet voeg hem toe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'stock_transactions' 
        AND column_name = 'created_by'
    ) THEN
        -- Voeg de created_by kolom toe
        ALTER TABLE public.stock_transactions 
        ADD COLUMN created_by UUID;
        
        -- Migreer bestaande data van user_id naar created_by
        -- created_by moet verwijzen naar profiles.id, niet auth.users.id
        UPDATE public.stock_transactions 
        SET created_by = user_id 
        WHERE created_by IS NULL;
        
        -- Maak created_by NOT NULL na de migratie
        ALTER TABLE public.stock_transactions 
        ALTER COLUMN created_by SET NOT NULL;
    END IF;
END $$;

-- Stap 2: Verwijder bestaande foreign key constraint als die bestaat
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'stock_transactions_created_by_fkey'
        AND table_name = 'stock_transactions'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.stock_transactions 
        DROP CONSTRAINT stock_transactions_created_by_fkey;
    END IF;
END $$;

-- Stap 3: Voeg de foreign key constraint expliciet toe
-- De types file verwacht dat created_by verwijst naar profiles, niet auth.users
ALTER TABLE public.stock_transactions 
ADD CONSTRAINT stock_transactions_created_by_fkey 
FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Stap 4: Voeg index toe voor betere performance
CREATE INDEX IF NOT EXISTS idx_stock_transactions_created_by ON public.stock_transactions(created_by);

-- Stap 5: Update RLS policies
-- Verwijder alle bestaande policies voor stock_transactions
DROP POLICY IF EXISTS "Users can view their own stock transactions" ON public.stock_transactions;
DROP POLICY IF EXISTS "Users can insert their own stock transactions" ON public.stock_transactions;
DROP POLICY IF EXISTS "Users can update their own stock transactions" ON public.stock_transactions;
DROP POLICY IF EXISTS "Users can delete their own stock transactions" ON public.stock_transactions;
DROP POLICY IF EXISTS "Eigenaren kunnen alle stock_transactions zien" ON public.stock_transactions;
DROP POLICY IF EXISTS "Eigenaren kunnen alle stock_transactions bewerken" ON public.stock_transactions;

-- Voeg nieuwe policies toe
CREATE POLICY "Users can view their own stock transactions" ON public.stock_transactions
    FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Users can insert their own stock transactions" ON public.stock_transactions
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own stock transactions" ON public.stock_transactions
    FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own stock transactions" ON public.stock_transactions
    FOR DELETE USING (auth.uid() = created_by);

-- Policy voor eigenaren
CREATE POLICY "Eigenaren kunnen alle stock_transactions zien" ON public.stock_transactions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.is_owner = true
        )
    );

CREATE POLICY "Eigenaren kunnen alle stock_transactions bewerken" ON public.stock_transactions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.is_owner = true
        )
    );

-- Stap 6: Forceer schema cache refresh door een dummy query uit te voeren
SELECT 1 FROM public.stock_transactions LIMIT 1;

-- Stap 7: Verifieer dat de relatie correct is ingesteld
SELECT 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_name='stock_transactions'
AND kcu.column_name = 'created_by';
