-- Migration: Admin toegang tot subscription en usage tracking tabellen
-- Deze policies zorgen ervoor dat eigenaren (is_owner = true) alle subscriptions en usage data kunnen zien

-- Voeg een policy toe voor user_subscriptions tabel zodat eigenaren alle subscriptions kunnen zien
-- Deze policy werkt naast de bestaande "Users can view their own subscriptions" policy
CREATE POLICY "Eigenaren kunnen alle user_subscriptions zien" ON user_subscriptions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_owner = true
    )
  );

-- Voeg een policy toe voor usage_tracking tabel zodat eigenaren alle usage data kunnen zien
-- Deze policy werkt naast de bestaande "Users can view their own usage" policy
CREATE POLICY "Eigenaren kunnen alle usage_tracking zien" ON usage_tracking
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_owner = true
    )
  );

-- Voeg ook policies toe voor UPDATE en INSERT operaties voor eigenaren
CREATE POLICY "Eigenaren kunnen user_subscriptions updaten" ON user_subscriptions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_owner = true
    )
  );

CREATE POLICY "Eigenaren kunnen usage_tracking updaten" ON usage_tracking
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_owner = true
    )
  );

CREATE POLICY "Eigenaren kunnen usage_tracking inserten" ON usage_tracking
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_owner = true
    )
  );
