-- Fix stock_transactions to support both user_id and created_by columns
-- Dit lost het null constraint probleem op door beide kolommen te ondersteunen

-- Stap 1: Controleer of created_by kolom bestaat, zo niet voeg hem toe
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

-- Stap 2: Stel de foreign key constraint in voor created_by
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'stock_transactions_created_by_fkey'
        AND table_name = 'stock_transactions'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.stock_transactions 
        ADD CONSTRAINT stock_transactions_created_by_fkey 
        FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Stap 3: Voeg branch_id kolom toe als die nog niet bestaat
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

-- Stap 4: Voeg index toe voor created_by
CREATE INDEX IF NOT EXISTS idx_stock_transactions_created_by ON public.stock_transactions(created_by);

-- Stap 5: Update RLS policies - verwijder alle bestaande policies
DROP POLICY IF EXISTS "Users can view their own stock transactions" ON public.stock_transactions;
DROP POLICY IF EXISTS "Users can insert their own stock transactions" ON public.stock_transactions;
DROP POLICY IF EXISTS "Users can update their own stock transactions" ON public.stock_transactions;
DROP POLICY IF EXISTS "Users can delete their own stock transactions" ON public.stock_transactions;
DROP POLICY IF EXISTS "Eigenaren kunnen alle stock_transactions zien" ON public.stock_transactions;
DROP POLICY IF EXISTS "Eigenaren kunnen alle stock_transactions bewerken" ON public.stock_transactions;

-- Stap 6: Voeg nieuwe policies toe die beide kolommen ondersteunen
-- Policy voor normale gebruikers - kunnen alleen hun eigen stock_transactions zien
CREATE POLICY "Users can view their own stock transactions" ON public.stock_transactions
    FOR SELECT USING (
        auth.uid() = user_id OR 
        auth.uid() = created_by
    );

CREATE POLICY "Users can insert their own stock transactions" ON public.stock_transactions
    FOR INSERT WITH CHECK (
        auth.uid() = user_id OR 
        auth.uid() = created_by
    );

CREATE POLICY "Users can update their own stock transactions" ON public.stock_transactions
    FOR UPDATE USING (
        auth.uid() = user_id OR 
        auth.uid() = created_by
    );

CREATE POLICY "Users can delete their own stock transactions" ON public.stock_transactions
    FOR DELETE USING (
        auth.uid() = user_id OR 
        auth.uid() = created_by
    );

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

-- Stap 7: Forceer schema cache refresh
SELECT 1 FROM public.stock_transactions LIMIT 1;

-- Stap 8: Verifieer de tabel structuur
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'stock_transactions'
ORDER BY ordinal_position;
