-- Add created_by column to stock_transactions table
-- De code verwacht een created_by kolom maar de tabel heeft alleen user_id
-- We voegen created_by toe en migreren de data van user_id naar created_by

-- Voeg de created_by kolom toe
ALTER TABLE public.stock_transactions 
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Migreer bestaande data van user_id naar created_by
UPDATE public.stock_transactions 
SET created_by = user_id 
WHERE created_by IS NULL;

-- Maak created_by NOT NULL na de migratie
ALTER TABLE public.stock_transactions 
ALTER COLUMN created_by SET NOT NULL;

-- Voeg een index toe voor betere performance
CREATE INDEX IF NOT EXISTS idx_stock_transactions_created_by ON public.stock_transactions(created_by);

-- Update de RLS policies om created_by te gebruiken in plaats van user_id
-- Verwijder de oude policies
DROP POLICY IF EXISTS "Users can view their own stock transactions" ON public.stock_transactions;
DROP POLICY IF EXISTS "Users can insert their own stock transactions" ON public.stock_transactions;

-- Voeg nieuwe policies toe die created_by gebruiken
CREATE POLICY "Users can view their own stock transactions" ON public.stock_transactions
    FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Users can insert their own stock transactions" ON public.stock_transactions
    FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Voeg ook policies toe voor UPDATE en DELETE
CREATE POLICY "Users can update their own stock transactions" ON public.stock_transactions
    FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own stock transactions" ON public.stock_transactions
    FOR DELETE USING (auth.uid() = created_by);

-- Voeg een policy toe voor eigenaren om alle stock_transactions te kunnen zien
CREATE POLICY "Eigenaren kunnen alle stock_transactions zien" ON public.stock_transactions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.is_owner = true
        )
    );

-- Voeg een policy toe voor eigenaren om alle stock_transactions te kunnen bewerken
CREATE POLICY "Eigenaren kunnen alle stock_transactions bewerken" ON public.stock_transactions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.is_owner = true
        )
    );
