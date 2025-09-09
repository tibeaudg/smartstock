-- Fix branch_users foreign key relationship
-- Dit script lost het probleem op waarbij branch_users.user_id naar auth.users verwijst
-- maar de TypeScript types verwachten dat het naar profiles verwijst

-- 1. Eerst verwijderen we de bestaande foreign key constraint
ALTER TABLE branch_users DROP CONSTRAINT IF EXISTS branch_users_user_id_fkey;

-- 2. Voegen we de nieuwe foreign key constraint toe die naar profiles verwijst
ALTER TABLE branch_users 
ADD CONSTRAINT branch_users_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- 3. We doen hetzelfde voor granted_by kolom als die bestaat
ALTER TABLE branch_users DROP CONSTRAINT IF EXISTS branch_users_granted_by_fkey;

-- Controleer of granted_by kolom bestaat voordat we de constraint toevoegen
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'branch_users' AND column_name = 'granted_by') THEN
        ALTER TABLE branch_users 
        ADD CONSTRAINT branch_users_granted_by_fkey 
        FOREIGN KEY (granted_by) REFERENCES profiles(id) ON DELETE SET NULL;
    END IF;
END $$;

-- 4. Voeg granted_at kolom toe als deze niet bestaat (voor consistentie met types)
ALTER TABLE branch_users 
ADD COLUMN IF NOT EXISTS granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 5. Controleer of alle benodigde kolommen bestaan
DO $$
BEGIN
    -- Voeg granted_by kolom toe als deze niet bestaat
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'branch_users' AND column_name = 'granted_by') THEN
        ALTER TABLE branch_users ADD COLUMN granted_by UUID;
        ALTER TABLE branch_users 
        ADD CONSTRAINT branch_users_granted_by_fkey 
        FOREIGN KEY (granted_by) REFERENCES profiles(id) ON DELETE SET NULL;
    END IF;
END $$;

-- 6. Update de RLS policies om te werken met de nieuwe foreign key relatie
DROP POLICY IF EXISTS "Users can view their own branch assignments" ON branch_users;
DROP POLICY IF EXISTS "Users can insert their own branch assignments" ON branch_users;
DROP POLICY IF EXISTS "Users can update their own branch assignments" ON branch_users;
DROP POLICY IF EXISTS "Users can delete their own branch assignments" ON branch_users;

-- Nieuwe RLS policies
CREATE POLICY "Users can view their own branch assignments" ON branch_users
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own branch assignments" ON branch_users
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own branch assignments" ON branch_users
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own branch assignments" ON branch_users
    FOR DELETE USING (user_id = auth.uid());

-- 7. Voeg admin policies toe voor branch management
CREATE POLICY "Admins can manage all branch assignments" ON branch_users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- 8. Controleer de uiteindelijke structuur
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'branch_users' 
ORDER BY ordinal_position;

-- 9. Controleer de foreign key constraints
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
AND tc.table_name='branch_users';
