import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface OnboardingCheckProps {
  children: React.ReactNode;
}

/**
 * Component that checks if user needs to complete onboarding
 * Only applies to new signups (created within last 30 days or onboarding is NULL)
 */
export const OnboardingCheck: React.FC<OnboardingCheckProps> = ({ children }) => {
  const { user, userProfile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Don't check if still loading or no user
    if (loading || !user || !userProfile) {
      return;
    }

    // If onboarding is already done, allow access
    if (userProfile.onboarding === 'done') {
      return;
    }

    // If onboarding is in progress, allow access (user is working on it)
    if (userProfile.onboarding === 'in_progress') {
      return;
    }

    // Only redirect if onboarding is null AND user is a new signup (created within last 30 days)
    if (userProfile.onboarding === null) {
      const createdAt = userProfile.created_at ? new Date(userProfile.created_at) : new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const isNewSignup = createdAt >= thirtyDaysAgo && !isNaN(createdAt.getTime());

      // Only redirect new signups to onboarding
      if (isNewSignup) {
        navigate('/onboarding', { replace: true });
      }
    }
  }, [user, userProfile, loading, navigate]);

  // Show loading state while checking
  if (loading || !user || !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If onboarding is not done and user is new signup, don't render children
  // (navigation will happen in useEffect)
  if (userProfile.onboarding === null) {
    const createdAt = userProfile.created_at ? new Date(userProfile.created_at) : new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const isNewSignup = createdAt >= thirtyDaysAgo && !isNaN(createdAt.getTime());

    if (isNewSignup) {
      return null; // Will redirect in useEffect
    }
  }

  return <>{children}</>;
};

