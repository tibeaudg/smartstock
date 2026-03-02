-- Add recipient configuration fields to email_campaigns
ALTER TABLE public.email_campaigns 
ADD COLUMN IF NOT EXISTS recipient_type text CHECK (recipient_type IN ('all', 'segment', 'manual')),
ADD COLUMN IF NOT EXISTS segment_id uuid REFERENCES public.email_segments(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS recipient_config jsonb DEFAULT '{}'::jsonb;

-- Create index for segment_id
CREATE INDEX IF NOT EXISTS idx_email_campaigns_segment_id ON public.email_campaigns(segment_id);
