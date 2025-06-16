
-- Check if the user profile exists and create it if it doesn't
-- First, let's make sure we can insert profiles properly
INSERT INTO public.profiles (id, email, first_name, last_name, role)
SELECT 
  '37835790-1a4e-4163-b68c-42aeb5038ec3' as id,
  'tibeaudegrauwe@gmail.com' as email,
  NULL as first_name,
  NULL as last_name,
  'staff'::user_role as role
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles WHERE id = '37835790-1a4e-4163-b68c-42aeb5038ec3'
);
