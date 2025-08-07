-- Create features table
CREATE TABLE IF NOT EXISTS features (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('optimization', 'premium', 'analytics', 'integration')),
  status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'in-development', 'released')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  estimated_release TEXT,
  icon TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create feature_votes table
CREATE TABLE IF NOT EXISTS feature_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  feature_id UUID NOT NULL REFERENCES features(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  voted BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(feature_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_features_category ON features(category);
CREATE INDEX IF NOT EXISTS idx_features_status ON features(status);
CREATE INDEX IF NOT EXISTS idx_features_priority ON features(priority);
CREATE INDEX IF NOT EXISTS idx_feature_votes_feature_id ON feature_votes(feature_id);
CREATE INDEX IF NOT EXISTS idx_feature_votes_user_id ON feature_votes(user_id);

-- Create RLS policies
ALTER TABLE features ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_votes ENABLE ROW LEVEL SECURITY;

-- Features policies: everyone can read, only admins can write
CREATE POLICY "Features are viewable by everyone" ON features
  FOR SELECT USING (true);

CREATE POLICY "Features are insertable by admins" ON features
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM branch_users 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

CREATE POLICY "Features are updatable by admins" ON features
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM branch_users 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

CREATE POLICY "Features are deletable by admins" ON features
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM branch_users 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Feature votes policies: users can manage their own votes
CREATE POLICY "Users can view their own votes" ON feature_votes
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own votes" ON feature_votes
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own votes" ON feature_votes
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own votes" ON feature_votes
  FOR DELETE USING (user_id = auth.uid());

-- Admins can view all votes
CREATE POLICY "Admins can view all votes" ON feature_votes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM branch_users 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_features_updated_at BEFORE UPDATE ON features
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_feature_votes_updated_at BEFORE UPDATE ON feature_votes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample features
INSERT INTO features (title, description, category, status, priority, estimated_release, icon) VALUES
('Geavanceerd Dashboard', 'Interactief dashboard met widgets die gebruikers kunnen aanpassen. Toont lage voorraad, totale waarde, verkoopstatistieken en omloopsnelheid.', 'optimization', 'planned', 'high', 'Q1 2024', 'dashboard'),
('Barcode & QR-code Scanning', 'Scan barcodes en QR-codes met smartphone camera voor snelle producttoevoeging en stockmutaties.', 'optimization', 'in-development', 'high', 'Q4 2023', 'scan'),
('Uitgebreide Rapporten', 'Historische voorraadrapporten, mutatie-analyse en ABC-analyse voor betere inzichten.', 'analytics', 'planned', 'medium', 'Q2 2024', 'reports'),
('Bulkacties', 'Voer acties uit op meerdere producten tegelijk: prijzen aanpassen, categorieën wijzigen, locaties verplaatsen.', 'optimization', 'planned', 'medium', 'Q1 2024', 'bulk'),
('Inkoopbeheer (Purchase Orders)', 'Automatische besteladviezen, professionele bestelbonnen en goederenontvangst tracking.', 'premium', 'planned', 'high', 'Q3 2024', 'purchase'),
('E-commerce Integraties', 'Koppeling met Shopify, WooCommerce en Bol.com voor automatische voorraadsynchronisatie.', 'integration', 'planned', 'high', 'Q2 2024', 'ecommerce'),
('Kassasysteem (POS) Integratie', 'Directe koppeling met kassasystemen voor real-time voorraadupdates bij verkoop.', 'integration', 'planned', 'medium', 'Q3 2024', 'pos'),
('Productie & Assemblage', 'Stuklijsten (BOM) en productieorders voor bedrijven die zelf producten samenstellen.', 'premium', 'planned', 'low', 'Q4 2024', 'production'),
('Demand Forecasting', 'Voorspel toekomstige vraag op basis van historische data om voorraadoptimalisatie te verbeteren.', 'analytics', 'planned', 'medium', 'Q2 2024', 'forecast'),
('Offertes en Facturatie', 'Maak offertes en verkoopfacturen die direct gelinkt zijn aan product- en voorraadgegevens.', 'premium', 'planned', 'medium', 'Q3 2024', 'invoicing'); 