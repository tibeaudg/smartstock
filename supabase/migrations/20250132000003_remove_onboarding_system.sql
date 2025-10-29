-- Remove onboarding system completely
-- This migration removes all onboarding-related tables, columns, and policies

-- Drop the onboarding_responses table
DROP TABLE IF EXISTS public.onboarding_responses CASCADE;

-- Remove onboarding_completed column from profiles table
ALTER TABLE public.profiles DROP COLUMN IF EXISTS onboarding_completed;

-- Remove onboarding_data column from profiles table  
ALTER TABLE public.profiles DROP COLUMN IF EXISTS onboarding_data;

-- Clean up any remaining policies that might reference onboarding
-- (These will be automatically dropped when the table is dropped, but included for completeness)
DROP POLICY IF EXISTS "Admins can view all onboarding responses" ON public.onboarding_responses;
DROP POLICY IF EXISTS "Users can view own onboarding response" ON public.onboarding_responses;
DROP POLICY IF EXISTS "Users can insert own onboarding response" ON public.onboarding_responses;
DROP POLICY IF EXISTS "Users can update own onboarding response" ON public.onboarding_responses;
DROP POLICY IF EXISTS "Admins can insert onboarding responses" ON public.onboarding_responses;
DROP POLICY IF EXISTS "Admins can update onboarding responses" ON public.onboarding_responses;
