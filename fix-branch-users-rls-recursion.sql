-- Fix infinite recursion in branch_users RLS policy
-- Het probleem is dat de policy "Gebruikers kunnen branch_users in hun filialen zien" 
-- naar zichzelf verwijst, wat een infinite recursion veroorzaakt.

-- Verwijder de problematische policy
DROP POLICY IF EXISTS "Gebruikers kunnen branch_users in hun filialen zien" ON branch_users;

-- Vervang door een eenvoudigere policy die geen recursion veroorzaakt
-- Gebruikers kunnen alleen branch_users zien waar ze zelf deel van uitmaken
CREATE POLICY "Gebruikers kunnen hun eigen branch_users zien" ON branch_users
  FOR SELECT USING (user_id = auth.uid());

-- Voeg ook policies toe voor INSERT, UPDATE en DELETE
CREATE POLICY "Gebruikers kunnen hun eigen branch_users toevoegen" ON branch_users
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Gebruikers kunnen hun eigen branch_users bijwerken" ON branch_users
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Gebruikers kunnen hun eigen branch_users verwijderen" ON branch_users
  FOR DELETE USING (user_id = auth.uid());

-- Voor eigenaren (is_owner = true) behouden we de bestaande policy
-- Deze policy is al correct en veroorzaakt geen recursion
-- CREATE POLICY "Eigenaren kunnen alle branch_users zien" ON branch_users
--   FOR SELECT USING (
--     EXISTS (
--       SELECT 1 FROM profiles 
--       WHERE profiles.id = auth.uid() 
--       AND profiles.is_owner = true
--     )
--   );
