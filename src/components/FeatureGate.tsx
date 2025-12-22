import React from 'react';

interface FeatureGateProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
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
