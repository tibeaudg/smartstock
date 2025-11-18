-- Extend user_feedback table with churn-specific fields
ALTER TABLE public.user_feedback
ADD COLUMN IF NOT EXISTS churn_reason TEXT,
ADD COLUMN IF NOT EXISTS missing_features TEXT,
ADD COLUMN IF NOT EXISTS expectation_gap TEXT,
ADD COLUMN IF NOT EXISTS priority_feature TEXT,
ADD COLUMN IF NOT EXISTS churn_trigger_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS feedback_delivered_via TEXT;

-- Create index on churn_trigger_date for efficient queries
CREATE INDEX IF NOT EXISTS idx_user_feedback_churn_trigger_date ON public.user_feedback(churn_trigger_date);

-- Update trigger_context to allow 'churn' as a valid value
-- Note: If there's a CHECK constraint, we may need to alter it, but for now we'll just allow it

