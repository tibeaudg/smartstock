-- Create application_errors table for storing application errors
-- This table stores errors logged from the frontend for admin review
CREATE TABLE IF NOT EXISTS public.application_errors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  error_message TEXT NOT NULL,
  error_type TEXT,
  stack_trace TEXT,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  page_url TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  error_count INTEGER DEFAULT 1,
  component_stack TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_application_errors_created_at ON public.application_errors(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_application_errors_user_id ON public.application_errors(user_id);
CREATE INDEX IF NOT EXISTS idx_application_errors_error_type ON public.application_errors(error_type);
CREATE INDEX IF NOT EXISTS idx_application_errors_page_url ON public.application_errors(page_url);

-- Enable RLS
ALTER TABLE public.application_errors ENABLE ROW LEVEL SECURITY;

-- Create policy for owners to view all errors
CREATE POLICY "Owners can view all application errors" ON public.application_errors
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_owner = true
    )
  );

-- Create policy for inserting errors (any authenticated user can log errors)
CREATE POLICY "Authenticated users can insert errors" ON public.application_errors
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Add comment
COMMENT ON TABLE public.application_errors IS 'Stores application errors logged from the frontend for admin review and debugging';

