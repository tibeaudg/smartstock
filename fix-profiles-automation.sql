-- Fix profiles table automation
-- Voer deze queries uit in je Supabase SQL Editor

-- 1. Eerst voegen we de ontbrekende kolommen toe aan de profiles tabel
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS selected_plan TEXT,
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;

-- 2. Maak een functie die automatisch een profiel aanmaakt voor nieuwe gebruikers
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, role, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Maak een trigger die de functie aanroept wanneer een nieuwe gebruiker wordt aangemaakt
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Voeg handmatig een profiel toe voor de bestaande gebruiker
INSERT INTO public.profiles (id, email, first_name, last_name, role, created_at, updated_at)
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data->>'first_name', ''),
  COALESCE(raw_user_meta_data->>'last_name', ''),
  COALESCE(raw_user_meta_data->>'role', 'user'),
  created_at,
  NOW()
FROM auth.users
WHERE id = '39559e57-487b-4d5c-bba1-4f985c7768b7'
AND NOT EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.users.id);

-- 5. Fix de RLS policies
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

-- 6. Test de queries
-- Controleer of het profiel is aangemaakt
SELECT * FROM profiles WHERE id = '39559e57-487b-4d5c-bba1-4f985c7768b7';

-- Controleer of de trigger werkt (optioneel - maak een test gebruiker aan)
-- INSERT INTO auth.users (id, email, raw_user_meta_data) 
-- VALUES (gen_random_uuid(), 'test@example.com', '{"first_name": "Test", "last_name": "User"}');
