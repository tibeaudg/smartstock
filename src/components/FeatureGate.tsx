import React from 'react';
import { Lock, Crown, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSubscription } from '@/hooks/useSubscription';
import { UpgradePrompt } from './UpgradePrompt';

interface FeatureGateProps {
  feature: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUpgradePrompt?: boolean;
  requiredTier?: 'groei' | 'premium';
}

export const FeatureGate: React.FC<FeatureGateProps> = ({
  feature,
  children,
  fallback,
  showUpgradePrompt = true,
  requiredTier
}) => {
  const { canUseFeature, currentTier, isTrialActive, isSubscriptionActive } = useSubscription();

  const hasAccess = canUseFeature(feature);
  
  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (!showUpgradePrompt) {
    return null;
  }

  const getFeatureIcon = () => {
    switch (feature) {
      case 'analytics':
        return <Crown className="h-5 w-5 text-purple-600" />;
      case 'scanner':
        return <Zap className="h-5 w-5 text-blue-600" />;
      default:
        return <Lock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getFeatureTitle = () => {
    switch (feature) {
      case 'analytics':
        return 'Geavanceerde Analytics';
      case 'scanner':
        return 'Barcode Scanner';
      case 'delivery-notes':
        return 'Leveringsbonnen Beheer';
      case 'api':
        return 'API Toegang';
      default:
        return 'Premium Feature';
    }
  };

  const getFeatureDescription = () => {
    switch (feature) {
      case 'analytics':
        return 'AI-gedreven inzichten en voorspellingen voor optimale voorraadbeheer';
      case 'scanner':
        return 'Scan producten direct in en uit met je smartphone';
      case 'delivery-notes':
        return 'Volledig beheer van inkomende en uitgaande leveringsbonnen';
      case 'api':
        return 'Integreer StockFlow met je bestaande systemen via onze API';
      default:
        return 'Deze feature is alleen beschikbaar in hogere plannen';
    }
  };

  return (
    <Card className="border-dashed border-2 border-gray-300 bg-gray-50">
      <CardContent className="p-6 text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="p-3 rounded-full bg-gray-100">
            {getFeatureIcon()}
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {getFeatureTitle()}
            </h3>
            <p className="text-sm text-gray-600 max-w-md">
              {getFeatureDescription()}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Lock className="h-4 w-4" />
              <span>
                {currentTier?.display_name} plan • Upgrade vereist
              </span>
            </div>
            
            {(isTrialActive || isSubscriptionActive) && (
              <div className="text-sm text-blue-600">
                Je trial/subscription geeft je toegang tot deze feature
              </div>
            )}
          </div>

          <UpgradePrompt 
            feature={feature}
            showCloseButton={false}
          />
        </div>
      </CardContent>
    </Card>
  );
};

// Hook for checking feature access
export const useFeatureAccess = () => {
  const { canUseFeature, currentTier, isTrialActive, isSubscriptionActive } = useSubscription();

  const hasAnalytics = () => canUseFeature('analytics');
  const hasScanner = () => canUseFeature('scanner');
  const hasDeliveryNotes = () => canUseFeature('delivery-notes');
  const hasAPI = () => canUseFeature('api');

  const getFeatureStatus = (feature: string) => {
    const hasAccess = canUseFeature(feature);
    const isPremium = currentTier?.name !== 'basis';
    
    return {
      hasAccess,
      isPremium,
      isTrial: isTrialActive,
      isActive: isSubscriptionActive,
      tier: currentTier?.display_name
    };
  };

  return {
    hasAnalytics,
    hasScanner,
    hasDeliveryNotes,
    hasAPI,
    getFeatureStatus,
    currentTier,
    isTrialActive,
    isSubscriptionActive
  };
};

// Component for showing feature status in settings
export const FeatureStatus: React.FC<{ feature: string }> = ({ feature }) => {
  const { getFeatureStatus } = useFeatureAccess();
  const status = getFeatureStatus(feature);

  if (status.hasAccess) {
    return (
      <div className="flex items-center space-x-2 text-green-600">
        <div className="w-2 h-2 bg-green-500 rounded-full" />
        <span className="text-sm font-medium">Actief</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 text-gray-500">
      <div className="w-2 h-2 bg-gray-400 rounded-full" />
      <span className="text-sm">
        {status.isPremium ? 'Niet beschikbaar' : 'Upgrade vereist'}
      </span>
    </div>
  );
};
