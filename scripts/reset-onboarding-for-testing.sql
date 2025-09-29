-- Reset onboarding status for testing purposes
-- This script sets onboarding_completed to false for all users so they can test the onboarding flow

-- Update all users to have onboarding_completed = false
UPDATE profiles 
SET 
  onboarding_completed = false,
  onboarding_data = NULL
WHERE onboarding_completed = true;

-- Show the results
SELECT 
  id,
  email,
  onboarding_completed,
  onboarding_data,
  created_at
FROM profiles 
ORDER BY created_at DESC
LIMIT 10;
