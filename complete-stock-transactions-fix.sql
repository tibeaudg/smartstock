-- Complete fix for stock_transactions created_by relationship
-- Dit script lost alle problemen op met de stock_transactions tabel

-- Stap 1: Controleer en voeg created_by kolom toe indien nodig
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

-- Stap 3: Voeg de foreign key constraint expliciet toe naar profiles
ALTER TABLE public.stock_transactions 
ADD CONSTRAINT stock_transactions_created_by_fkey 
FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Stap 4: Voeg index toe voor betere performance
CREATE INDEX IF NOT EXISTS idx_stock_transactions_created_by ON public.stock_transactions(created_by);

-- Stap 5: Voeg branch_id kolom toe als die nog niet bestaat (voor branch-based filtering)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'stock_transactions' 
        AND column_name = 'branch_id'
    ) THEN
        ALTER TABLE public.stock_transactions 
        ADD COLUMN branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL;
        
        -- Voeg index toe voor branch_id
        CREATE INDEX IF NOT EXISTS idx_stock_transactions_branch_id ON public.stock_transactions(branch_id);
    END IF;
END $$;

-- Stap 6: Update RLS policies - verwijder alle bestaande policies
DROP POLICY IF EXISTS "Users can view their own stock transactions" ON public.stock_transactions;
DROP POLICY IF EXISTS "Users can insert their own stock transactions" ON public.stock_transactions;
DROP POLICY IF EXISTS "Users can update their own stock transactions" ON public.stock_transactions;
DROP POLICY IF EXISTS "Users can delete their own stock transactions" ON public.stock_transactions;
DROP POLICY IF EXISTS "Eigenaren kunnen alle stock_transactions zien" ON public.stock_transactions;
DROP POLICY IF EXISTS "Eigenaren kunnen alle stock_transactions bewerken" ON public.stock_transactions;

-- Stap 7: Voeg nieuwe branch-based policies toe
-- Policy voor normale gebruikers - kunnen alleen hun eigen stock_transactions zien
CREATE POLICY "Users can view their own stock transactions" ON public.stock_transactions
    FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Users can insert their own stock transactions" ON public.stock_transactions
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own stock transactions" ON public.stock_transactions
    FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own stock transactions" ON public.stock_transactions
    FOR DELETE USING (auth.uid() = created_by);

-- Policy voor eigenaren - kunnen alle stock_transactions zien
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

-- Stap 8: Forceer schema cache refresh
SELECT 1 FROM public.stock_transactions LIMIT 1;

-- Stap 9: Verifieer dat alle relaties correct zijn ingesteld
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
AND kcu.column_name IN ('created_by', 'branch_id', 'product_id');

-- Stap 10: Toon de huidige tabel structuur
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'stock_transactions'
ORDER BY ordinal_position;
