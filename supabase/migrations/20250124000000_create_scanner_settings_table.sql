-- Create scanner_settings table
CREATE TABLE IF NOT EXISTS scanner_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  sound_enabled BOOLEAN DEFAULT true,
  vibration_enabled BOOLEAN DEFAULT true,
  auto_focus BOOLEAN DEFAULT true,
  flash_enabled BOOLEAN DEFAULT false,
  scan_timeout INTEGER DEFAULT 5 CHECK (scan_timeout >= 1 AND scan_timeout <= 30),
  default_transaction_type TEXT DEFAULT 'in' CHECK (default_transaction_type IN ('in', 'out')),
  auto_create_products BOOLEAN DEFAULT false,
  require_confirmation BOOLEAN DEFAULT true,
  camera_resolution TEXT DEFAULT 'medium' CHECK (camera_resolution IN ('high', 'medium', 'low')),
  scan_sound_volume INTEGER DEFAULT 50 CHECK (scan_sound_volume >= 0 AND scan_sound_volume <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, branch_id)
);

-- Enable RLS
ALTER TABLE scanner_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own scanner settings" ON scanner_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own scanner settings" ON scanner_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own scanner settings" ON scanner_settings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own scanner settings" ON scanner_settings
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_scanner_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_scanner_settings_updated_at
  BEFORE UPDATE ON scanner_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_scanner_settings_updated_at();

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_scanner_settings_user_id ON scanner_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_scanner_settings_branch_id ON scanner_settings(branch_id);
CREATE INDEX IF NOT EXISTS idx_scanner_settings_user_branch ON scanner_settings(user_id, branch_id);
