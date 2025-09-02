-- Migration: Admin toegang tot alle producten voor gebruikersbeheer
-- Deze policy zorgt ervoor dat eigenaren (is_owner = true) alle producten kunnen zien

-- Voeg een policy toe voor products tabel zodat eigenaren alle producten kunnen zien
CREATE POLICY "Eigenaren kunnen alle producten zien" ON products
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_owner = true
    )
  );

-- Voeg ook een policy toe voor branches tabel zodat eigenaren alle filialen kunnen zien
CREATE POLICY "Eigenaren kunnen alle filialen zien" ON branches
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_owner = true
    )
  );

-- Voeg een policy toe voor branch_users tabel zodat eigenaren alle branch_users kunnen zien
CREATE POLICY "Eigenaren kunnen alle branch_users zien" ON branch_users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_owner = true
    )
  );

-- Voeg een policy toe voor company_types tabel zodat eigenaren alle company_types kunnen zien
CREATE POLICY "Eigenaren kunnen alle company_types zien" ON company_types
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_owner = true
    )
  );

-- Voeg een policy toe voor onboarding_answers tabel zodat eigenaren alle antwoorden kunnen zien
CREATE POLICY "Eigenaren kunnen alle onboarding_answers zien" ON onboarding_answers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_owner = true
    )
  );

-- Zorg ervoor dat RLS is ingeschakeld op alle relevante tabellen
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE branch_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_answers ENABLE ROW LEVEL SECURITY;

-- Voeg ook een policy toe voor normale gebruikers (niet-eigenaren) zodat ze alleen hun eigen data kunnen zien
-- Products: gebruikers kunnen alleen producten zien in hun eigen filialen
CREATE POLICY "Gebruikers kunnen producten in hun filialen zien" ON products
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM branch_users 
      WHERE branch_users.branch_id = products.branch_id 
      AND branch_users.user_id = auth.uid()
    )
  );

-- Branches: gebruikers kunnen alleen filialen zien waar ze toegang toe hebben
CREATE POLICY "Gebruikers kunnen hun eigen filialen zien" ON branches
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM branch_users 
      WHERE branch_users.branch_id = branches.id 
      AND branch_users.user_id = auth.uid()
    )
  );

-- Branch_users: gebruikers kunnen alleen branch_users zien voor hun eigen filialen
CREATE POLICY "Gebruikers kunnen branch_users in hun filialen zien" ON branch_users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM branch_users bu2
      WHERE bu2.branch_id = branch_users.branch_id 
      AND bu2.user_id = auth.uid()
    )
  );

-- Company_types: gebruikers kunnen alleen hun eigen company_type zien
CREATE POLICY "Gebruikers kunnen hun eigen company_type zien" ON company_types
  FOR SELECT USING (user_id = auth.uid());

-- Onboarding_answers: gebruikers kunnen alleen hun eigen antwoorden zien
CREATE POLICY "Gebruikers kunnen hun eigen onboarding_answers zien" ON onboarding_answers
  FOR SELECT USING (user_id = auth.uid());
