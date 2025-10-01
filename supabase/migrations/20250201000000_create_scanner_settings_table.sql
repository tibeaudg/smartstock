-- Create scanner_settings table
CREATE TABLE IF NOT EXISTS public.scanner_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES public.branches(id) ON DELETE CASCADE,
  sound_enabled BOOLEAN DEFAULT true,
  vibration_enabled BOOLEAN DEFAULT true,
  auto_focus BOOLEAN DEFAULT true,
  flash_enabled BOOLEAN DEFAULT false,
  scan_timeout INTEGER DEFAULT 5,
  default_transaction_type TEXT DEFAULT 'in' CHECK (default_transaction_type IN ('in', 'out')),
  auto_create_products BOOLEAN DEFAULT false,
  require_confirmation BOOLEAN DEFAULT true,
  camera_resolution TEXT DEFAULT 'medium' CHECK (camera_resolution IN ('high', 'medium', 'low')),
  scan_sound_volume INTEGER DEFAULT 50 CHECK (scan_sound_volume >= 0 AND scan_sound_volume <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, branch_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_scanner_settings_user_branch ON public.scanner_settings(user_id, branch_id);

-- Enable RLS
ALTER TABLE public.scanner_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own scanner settings"
  ON public.scanner_settings
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own scanner settings"
  ON public.scanner_settings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own scanner settings"
  ON public.scanner_settings
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own scanner settings"
  ON public.scanner_settings
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_scanner_settings_updated_at
  BEFORE UPDATE ON public.scanner_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Add comment
COMMENT ON TABLE public.scanner_settings IS 'Scanner settings for barcode scanner functionality per user and branch';

