-- Add organization_name column to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS organization_name TEXT DEFAULT NULL;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_profiles_organization_name ON public.profiles(organization_name);

-- Add comment for clarity
COMMENT ON COLUMN public.profiles.organization_name IS 'Organization name for the user profile';

