import React from 'react';

interface FeatureGateProps {
  feature: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUpgradePrompt?: boolean;
  requiredTier?: 'growth' | 'premium';
}

// All features are now free - FeatureGate always allows access
export const FeatureGate: React.FC<FeatureGateProps> = ({
  children,
  fallback
}) => {
  // All features are free, so always render children
  if (fallback) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

// Hook for checking feature access - all features are now free
export const useFeatureAccess = () => {
  // All features are free
  const hasAnalytics = () => true;
  const hasScanner = () => true;
  const hasDeliveryNotes = () => true;
  const hasAPI = () => true;

  const getFeatureStatus = (feature: string) => {
    return {
      hasAccess: true,
      isPremium: false,
      isTrial: false,
      isActive: true,
      tier: 'Free'
    };
  };

  return {
    hasAnalytics,
    hasScanner,
    hasDeliveryNotes,
    hasAPI,
    getFeatureStatus,
    currentTier: null,
    isTrialActive: false,
    isSubscriptionActive: true
  };
};

// Component for showing feature status in settings
export const FeatureStatus: React.FC<{ feature: string }> = () => {
  // All features are free and active
  return (
    <div className="flex items-center space-x-2 text-green-600">
      <div className="w-2 h-2 bg-green-500 rounded-full" />
      <span className="text-sm font-medium">Actief</span>
    </div>
  );
};
