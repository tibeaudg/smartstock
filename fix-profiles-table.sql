-- Fix profiles table schema mismatch
-- Voer deze queries uit in je Supabase SQL Editor

-- 1. Controleer de huidige structuur van de profiles tabel
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- 2. Voeg de ontbrekende kolommen toe aan profiles tabel
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS selected_plan TEXT,
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;

-- 3. Migreer bestaande data van full_name naar first_name/last_name (als full_name bestaat)
-- Let op: Voer dit alleen uit als je een full_name kolom hebt
-- UPDATE profiles 
-- SET 
--     first_name = CASE 
--         WHEN full_name IS NOT NULL AND position(' ' in full_name) > 0 
--         THEN split_part(full_name, ' ', 1)
--         ELSE full_name
--     END,
--     last_name = CASE 
--         WHEN full_name IS NOT NULL AND position(' ' in full_name) > 0 
--         THEN substring(full_name from position(' ' in full_name) + 1)
--         ELSE NULL
--     END
-- WHERE first_name IS NULL OR last_name IS NULL;

-- 4. Fix de RLS policies
-- Drop bestaande policies
DROP POLICY IF EXISTS "Users can view own profile only" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile only" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile only" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- Maak nieuwe policies
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Voeg admin policy toe (zonder recursie)
CREATE POLICY "Admins can view all profiles" ON profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- 5. Test de queries
-- Test of je je eigen profiel kunt ophalen
SELECT * FROM profiles WHERE id = auth.uid();

-- Test of alle profiles zichtbaar zijn (als admin)
SELECT id, email, first_name, last_name, role FROM profiles LIMIT 5;

-- 6. Maak een profiel aan voor de huidige gebruiker als deze niet bestaat
INSERT INTO profiles (id, email, first_name, last_name, role, created_at, updated_at)
SELECT 
    auth.uid(),
    auth.email(),
    COALESCE(auth.raw_user_meta_data->>'first_name', ''),
    COALESCE(auth.raw_user_meta_data->>'last_name', ''),
    COALESCE(auth.raw_user_meta_data->>'role', 'user'),
    NOW(),
    NOW()
WHERE auth.uid() IS NOT NULL
AND NOT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid());
