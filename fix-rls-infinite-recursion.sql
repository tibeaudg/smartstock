-- Fix infinite recursion in RLS policies
-- Voer deze queries uit in je Supabase SQL Editor

-- 1. Drop alle bestaande policies die infinite recursion kunnen veroorzaken
DROP POLICY IF EXISTS "Users can view their own branch assignments" ON branch_users;
DROP POLICY IF EXISTS "Users can insert their own branch assignments" ON branch_users;
DROP POLICY IF EXISTS "Users can update their own branch assignments" ON branch_users;
DROP POLICY IF EXISTS "Users can delete their own branch assignments" ON branch_users;

-- 2. Maak nieuwe, eenvoudige policies zonder recursie
-- Voor branch_users tabel - gebruik alleen auth.uid() zonder complexe queries
CREATE POLICY "Users can view their own branch assignments" ON branch_users
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own branch assignments" ON branch_users
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own branch assignments" ON branch_users
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own branch assignments" ON branch_users
    FOR DELETE USING (auth.uid() = user_id);

-- 3. Ook voor branches tabel - maak eenvoudige policies
DROP POLICY IF EXISTS "Users can view their own branches" ON branches;
DROP POLICY IF EXISTS "Users can insert their own branches" ON branches;
DROP POLICY IF EXISTS "Users can update their own branches" ON branches;
DROP POLICY IF EXISTS "Users can delete their own branches" ON branches;

CREATE POLICY "Users can view their own branches" ON branches
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own branches" ON branches
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own branches" ON branches
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own branches" ON branches
    FOR DELETE USING (auth.uid() = user_id);

-- 4. Voeg een speciale policy toe voor branch_users die rekening houdt met granted_by
-- Dit is nodig voor het aanmaken van branch_users records
CREATE POLICY "Users can insert branch assignments they grant" ON branch_users
    FOR INSERT WITH CHECK (auth.uid() = granted_by);

-- 5. Test of de policies werken
-- Probeer een test branch aan te maken (vervang de UUID met je eigen user ID)
-- INSERT INTO branches (name, user_id, is_main) 
-- VALUES ('Test Branch', '39559e57-487b-4d5c-bba1-4f985c7768b7', true);

-- 6. Als je een branch hebt, probeer dan een branch_user aan te maken
-- INSERT INTO branch_users (branch_id, user_id, role, granted_by) 
-- VALUES ('branch-uuid-here', '39559e57-487b-4d5c-bba1-4f985c7768b7', 'admin', '39559e57-487b-4d5c-bba1-4f985c7768b7');

-- 7. Controleer of RLS is ingeschakeld
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('branches', 'branch_users') 
AND schemaname = 'public';
