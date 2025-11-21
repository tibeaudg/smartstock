-- Add onboarding column to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS onboarding TEXT DEFAULT NULL;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding ON public.profiles(onboarding);

-- Add comment for clarity
COMMENT ON COLUMN public.profiles.onboarding IS 'Onboarding status: NULL (not started), in_progress, done';

