-- Fix infinite recursion in profiles RLS policy
-- Drop the problematic policy
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Create a simpler policy that doesn't cause recursion
-- For now, let's just allow users to see their own profiles
-- We can add admin policies later if needed
CREATE POLICY "Users can view own profile only" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile only" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile only" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);
