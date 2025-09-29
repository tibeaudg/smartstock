-- Apply onboarding migrations manually
-- This script applies the onboarding-related migrations

-- Add onboarding_data column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_data JSONB DEFAULT NULL;

-- Add onboarding_completed field to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

-- Create onboarding_responses table to track user onboarding answers
CREATE TABLE IF NOT EXISTS public.onboarding_responses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    sector TEXT NOT NULL,
    business_size TEXT NOT NULL,
    important_features JSONB NOT NULL DEFAULT '[]'::jsonb,
    specific_needs TEXT,
    expectations TEXT,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id) -- One response per user
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_onboarding_responses_user_id ON public.onboarding_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_responses_profile_id ON public.onboarding_responses(profile_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_responses_sector ON public.onboarding_responses(sector);
CREATE INDEX IF NOT EXISTS idx_onboarding_responses_business_size ON public.onboarding_responses(business_size);
CREATE INDEX IF NOT EXISTS idx_onboarding_responses_completed_at ON public.onboarding_responses(completed_at);

-- Enable RLS
ALTER TABLE public.onboarding_responses ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can view all onboarding responses" ON public.onboarding_responses
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Users can view own onboarding response" ON public.onboarding_responses
    FOR SELECT USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_onboarding_responses_updated_at
    BEFORE UPDATE ON public.onboarding_responses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT ALL ON public.onboarding_responses TO authenticated;
