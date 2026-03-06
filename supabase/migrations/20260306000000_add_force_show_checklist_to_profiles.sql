-- Add force_show_checklist column to profiles for admin retrigger of onboarding steps
-- When true, the user will see the account setup checklist again on their next dashboard visit
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS force_show_checklist BOOLEAN DEFAULT false;

COMMENT ON COLUMN public.profiles.force_show_checklist IS 'When true, show the account setup checklist to the user (admin can set this to retrigger onboarding)';
