-- Add onboarding_data column to profiles table to store onboarding responses
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_data JSONB DEFAULT NULL;
