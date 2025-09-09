-- Create delivery notes module
INSERT INTO modules (id, title, description, category, status, price_monthly, price_yearly, features, icon, created_at, updated_at) VALUES
(
  'delivery-notes',
  'Leveringsbonnen Beheer',
  'Volledig beheer van inkomende en uitgaande leveringsbonnen',
  'automation',
  'active',
  14.99,
  149.99,
  ARRAY[
    'Inkomende leveringsbonnen uploaden',
    'Uitgaande leveringsbonnen genereren',
    'Producten toevoegen tijdens upload',
    'Automatische voorraad updates',
    'PDF export functionaliteit',
    'Bulk import/export',
    'Custom leveringsbon templates'
  ],
  'Package',
  NOW(),
  NOW()
);

-- Create delivery_notes table
CREATE TABLE IF NOT EXISTS delivery_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('incoming', 'outgoing')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'processing', 'completed', 'cancelled')),
  supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
  customer_name TEXT,
  customer_email TEXT,
  customer_address TEXT,
  delivery_date DATE,
  reference_number TEXT,
  notes TEXT,
  total_amount DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create delivery_note_items table
CREATE TABLE IF NOT EXISTS delivery_note_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  delivery_note_id UUID NOT NULL REFERENCES delivery_notes(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_sku TEXT,
  quantity INTEGER NOT NULL DEFAULT 0,
  unit_price DECIMAL(10,2) DEFAULT 0,
  total_price DECIMAL(10,2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_delivery_notes_user_id ON delivery_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_delivery_notes_type ON delivery_notes(type);
CREATE INDEX IF NOT EXISTS idx_delivery_notes_status ON delivery_notes(status);
CREATE INDEX IF NOT EXISTS idx_delivery_notes_delivery_date ON delivery_notes(delivery_date);
CREATE INDEX IF NOT EXISTS idx_delivery_note_items_delivery_note_id ON delivery_note_items(delivery_note_id);
CREATE INDEX IF NOT EXISTS idx_delivery_note_items_product_id ON delivery_note_items(product_id);

-- Enable RLS
ALTER TABLE delivery_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_note_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for delivery_notes
CREATE POLICY "Users can view own delivery notes" ON delivery_notes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own delivery notes" ON delivery_notes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own delivery notes" ON delivery_notes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own delivery notes" ON delivery_notes
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for delivery_note_items
CREATE POLICY "Users can view delivery note items" ON delivery_note_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM delivery_notes 
      WHERE delivery_notes.id = delivery_note_items.delivery_note_id 
      AND delivery_notes.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert delivery note items" ON delivery_note_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM delivery_notes 
      WHERE delivery_notes.id = delivery_note_items.delivery_note_id 
      AND delivery_notes.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update delivery note items" ON delivery_note_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM delivery_notes 
      WHERE delivery_notes.id = delivery_note_items.delivery_note_id 
      AND delivery_notes.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete delivery note items" ON delivery_note_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM delivery_notes 
      WHERE delivery_notes.id = delivery_note_items.delivery_note_id 
      AND delivery_notes.user_id = auth.uid()
    )
  );

-- Create function to update updated_at
CREATE OR REPLACE FUNCTION update_delivery_notes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_delivery_notes_updated_at
  BEFORE UPDATE ON delivery_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_delivery_notes_updated_at();
