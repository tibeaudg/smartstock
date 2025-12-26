-- Add referral_source column to profiles table to track where users came from
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_source TEXT;

-- Create index for referral source queries
CREATE INDEX IF NOT EXISTS idx_profiles_referral_source ON profiles(referral_source);

-- Add comment to document the column
COMMENT ON COLUMN profiles.referral_source IS 'Stores referral information (document.referrer, UTM params, etc.) captured at signup';

