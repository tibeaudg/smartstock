import React from 'react';
import { Crown, Zap, Star, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSubscription, PricingTier } from '@/hooks/useSubscription';
import { useNavigate } from 'react-router-dom';

interface UpgradePromptProps {
  feature: string;
  currentLimit?: number;
  maxLimit?: number;
  onClose?: () => void;
  showCloseButton?: boolean;
}

export const UpgradePrompt: React.FC<UpgradePromptProps> = ({
  feature,
  currentLimit,
  maxLimit,
  onClose,
  showCloseButton = true
}) => {
  const { currentTier, pricingTiers } = useSubscription();
  const navigate = useNavigate();

  const getUpgradeTier = () => {
    if (currentTier?.name === 'basic' || currentTier?.name === 'free') {
      return pricingTiers.find(tier => tier.name === 'starter' || tier.name === 'growth');
    }
    if (currentTier?.name === 'starter' || currentTier?.name === 'growth') {
      return pricingTiers.find(tier => tier.name === 'business' || tier.name === 'premium');
    }
    // For users without subscription or on trial, show starter/growth as default upgrade
    return pricingTiers.find(tier => tier.name === 'starter' || tier.name === 'growth');
  };

  const getAvailableUpgradeTiers = () => {
    if (currentTier?.name === 'basic' || currentTier?.name === 'free') {
      return pricingTiers.filter(tier => tier.name !== 'basic' && tier.name !== 'free');
    }
    if (currentTier?.name === 'starter' || currentTier?.name === 'growth') {
      return pricingTiers.filter(tier => tier.name === 'business' || tier.name === 'premium');
    }
    // For users without subscription or on trial, show all paid tiers
    return pricingTiers.filter(tier => tier.name !== 'basic' && tier.name !== 'free');
  };

  const upgradeTier = getUpgradeTier();
  if (!upgradeTier) return null;

  const getFeatureDescription = () => {
    switch (feature) {
      case 'products':
        return `You have used ${currentLimit} of ${maxLimit} products. Upgrade for more products.`;
      case 'users':
        return `You have used ${currentLimit} of ${maxLimit} users. Upgrade for more team members.`;
      case 'branches':
        return `You have used ${currentLimit} of ${maxLimit} branches. Upgrade for more locations.`;
      case 'orders':
        return `You have used ${currentLimit} of ${maxLimit} orders this month. Upgrade for more orders.`;
      case 'analytics':
        return 'Advanced analytics are only available in higher plans.';
      case 'scanner':
        return 'Barcode scanner is only available in higher plans.';
      case 'delivery-notes':
        return 'Delivery notes management is only available in higher plans.';
      case 'api':
        return 'API access is only available in higher plans.';
      default:
        return `${feature} is only available in higher plans.`;
    }
  };

  const getTierIcon = () => {
    switch (upgradeTier.name) {
      case 'starter':
      case 'growth':
        return <Zap className="h-6 w-6 text-blue-600" />;
      case 'business':
      case 'premium':
        return <Crown className="h-6 w-6 text-purple-600" />;
      default:
        return <Star className="h-6 w-6 text-gray-600" />;
    }
  };

  const getTierColor = () => {
    switch (upgradeTier.name) {
      case 'starter':
      case 'growth':
        return 'border-blue-200 bg-blue-50';
      case 'business':
      case 'premium':
        return 'border-purple-200 bg-purple-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const handleUpgrade = () => {
    navigate(`/pricing?tier=${upgradeTier.name}`);
  };

  return (
    <Card className={`border-2 ${getTierColor()} shadow-lg`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getTierIcon()}
            <div>
              <CardTitle className="text-lg">
                Upgrade naar {upgradeTier.display_name}
              </CardTitle>
              <CardDescription>
                {getFeatureDescription()}
              </CardDescription>
            </div>
          </div>
          {showCloseButton && onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Tier Benefits */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-gray-900">
              Met {upgradeTier.display_name} krijg je:
            </h4>
            <ul className="space-y-1">
              {upgradeTier.features.slice(0, 4).map((feature, index) => (
                <li key={index} className="flex items-center text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 flex-shrink-0" />
                  {feature}
                </li>
              ))}
              {upgradeTier.features.length > 4 && (
                <li className="text-sm text-gray-500">
                  +{upgradeTier.features.length - 4} meer features
                </li>
              )}
            </ul>
          </div>

          {/* Pricing */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                ${upgradeTier.price_monthly.toFixed(2)}
                <span className="text-sm font-normal text-gray-500">/month</span>
              </div>
              <div className="text-sm text-gray-500">
                or ${upgradeTier.price_yearly.toFixed(2)}/year (save {upgradeTier.yearly_discount_percentage}%)
              </div>
            </div>
            <Button 
              onClick={handleUpgrade}
              className={`${
                (upgradeTier.name === 'starter' || upgradeTier.name === 'growth')
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              {(upgradeTier.name === 'business' || upgradeTier.name === 'premium') ? 'Contact Sales' : 'Upgrade nu'}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          {/* Trial Info */}
          <div className="bg-white rounded-lg p-3 border">
            <div className="flex items-center text-sm text-gray-600">
              <Star className="h-4 w-4 text-yellow-500 mr-2" />
              <span>14-day free trial • No credit card required</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Component to show multiple upgrade options
export const UpgradeOptions: React.FC<{
  feature?: string;
  showAllOptions?: boolean;
  onClose?: () => void;
  showCloseButton?: boolean;
}> = ({ 
  feature, 
  showAllOptions = false, 
  onClose, 
  showCloseButton = true 
}) => {
  const { currentTier, pricingTiers } = useSubscription();
  const navigate = useNavigate();

  const getAvailableUpgradeTiers = () => {
    if (currentTier?.name === 'basic' || currentTier?.name === 'free') {
      return pricingTiers.filter(tier => tier.name !== 'basic' && tier.name !== 'free');
    }
    if (currentTier?.name === 'starter' || currentTier?.name === 'growth') {
      return pricingTiers.filter(tier => tier.name === 'business' || tier.name === 'premium');
    }
    // For users without subscription or on trial, show all paid tiers
    return pricingTiers.filter(tier => tier.name !== 'basic' && tier.name !== 'free');
  };

  const availableTiers = getAvailableUpgradeTiers();
  
  if (availableTiers.length === 0) return null;

  // If showAllOptions is false and there are multiple options, show only the first one
  const tiersToShow = showAllOptions ? availableTiers : [availableTiers[0]];

  const handleUpgrade = (tierName: string) => {
    navigate(`/pricing?tier=${tierName}`);
  };

  return (
    <div className="space-y-4">
      {tiersToShow.map((tier) => (
        <UpgradePrompt 
          key={tier.name}
          feature={feature || 'premium'}
          showCloseButton={showCloseButton}
          onClose={onClose}
        />
      ))}
    </div>
  );
};

// Component to show a specific tier upgrade card
export const TierUpgradeCard: React.FC<{
  tier: PricingTier;
  feature?: string;
  onClose?: () => void;
  showCloseButton?: boolean;
}> = ({ 
  tier,
  feature, 
  onClose, 
  showCloseButton = true 
}) => {
  const navigate = useNavigate();

  const getFeatureDescription = () => {
    switch (feature) {
      case 'products':
        return 'More products and advanced product management features.';
      case 'users':
        return 'More team members and advanced user management.';
      case 'branches':
        return 'More branches and advanced location management.';
      case 'orders':
        return 'More orders per month and advanced order management.';
      case 'analytics':
        return 'Advanced analytics are only available in higher plans.';
      case 'scanner':
        return 'Barcode scanner is only available in higher plans.';
      case 'delivery-notes':
        return 'Delivery notes management is only available in higher plans.';
      case 'api':
        return 'API access is only available in higher plans.';
      default:
        return `${feature || 'Premium features'} are only available in higher plans.`;
    }
  };

  const getTierIcon = () => {
    switch (tier.name) {
      case 'starter':
      case 'growth':
        return <Zap className="h-6 w-6 text-blue-600" />;
      case 'business':
      case 'premium':
        return <Crown className="h-6 w-6 text-purple-600" />;
      default:
        return <Star className="h-6 w-6 text-gray-600" />;
    }
  };

  const getTierColor = () => {
    switch (tier.name) {
      case 'starter':
      case 'growth':
        return 'border-blue-200 bg-blue-50';
      case 'business':
      case 'premium':
        return 'border-purple-200 bg-purple-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const handleUpgrade = () => {
    navigate(`/pricing?tier=${tier.name}`);
  };

  return (
    <Card className={`border-2 ${getTierColor()} shadow-lg`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getTierIcon()}
            <div>
              <CardTitle className="text-lg">
                Upgrade naar {tier.display_name}
              </CardTitle>
              <CardDescription>
                {getFeatureDescription()}
              </CardDescription>
            </div>
          </div>
          {showCloseButton && onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Tier Benefits */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-gray-900">
              Met {tier.display_name} krijg je:
            </h4>
            <ul className="space-y-1">
              {tier.features.slice(0, 4).map((feature, index) => (
                <li key={index} className="flex items-center text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 flex-shrink-0" />
                  {feature}
                </li>
              ))}
              {tier.features.length > 4 && (
                <li className="text-sm text-gray-500">
                  +{tier.features.length - 4} meer features
                </li>
              )}
            </ul>
          </div>

          {/* Pricing */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                ${tier.price_monthly.toFixed(2)}
                <span className="text-sm font-normal text-gray-500">/month</span>
              </div>
              <div className="text-sm text-gray-500">
                or ${tier.price_yearly.toFixed(2)}/year (save {tier.yearly_discount_percentage}%)
              </div>
            </div>
            <Button 
              onClick={handleUpgrade}
              className={`${
                (tier.name === 'starter' || tier.name === 'growth')
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              {(tier.name === 'business' || tier.name === 'premium') ? 'Contact Sales' : 'Upgrade nu'}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          {/* Trial Info */}
          <div className="bg-white rounded-lg p-3 border">
            <div className="flex items-center text-sm text-gray-600">
              <Star className="h-4 w-4 text-yellow-500 mr-2" />
              <span>14-day free trial • No credit card required</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Component to show all available upgrade options in a grid
export const AllUpgradeOptions: React.FC<{
  feature?: string;
  onClose?: () => void;
  showCloseButton?: boolean;
}> = ({ 
  feature, 
  onClose, 
  showCloseButton = true 
}) => {
  const { currentTier, pricingTiers } = useSubscription();

  const getAvailableUpgradeTiers = () => {
    if (currentTier?.name === 'basic' || currentTier?.name === 'free') {
      return pricingTiers.filter(tier => tier.name !== 'basic' && tier.name !== 'free');
    }
    if (currentTier?.name === 'starter' || currentTier?.name === 'growth') {
      return pricingTiers.filter(tier => tier.name === 'business' || tier.name === 'premium');
    }
    // For users without subscription or on trial, show all paid tiers
    return pricingTiers.filter(tier => tier.name !== 'basic' && tier.name !== 'free');
  };

  const availableTiers = getAvailableUpgradeTiers();
  
  if (availableTiers.length === 0) return null;

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {availableTiers.map((tier) => (
        <TierUpgradeCard 
          key={tier.name}
          tier={tier}
          feature={feature || 'premium'}
          showCloseButton={showCloseButton}
          onClose={onClose}
        />
      ))}
    </div>
  );
};

// Compact version for inline use
export const CompactUpgradePrompt: React.FC<{
  feature: string;
  onUpgrade?: () => void;
}> = ({ feature, onUpgrade }) => {
  const { currentTier, pricingTiers } = useSubscription();
  const navigate = useNavigate();

  const upgradeTier = pricingTiers.find(tier => tier.name === 'starter' || tier.name === 'growth');
  if (!upgradeTier) return null;

  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade();
    } else {
      navigate(`/pricing?tier=${upgradeTier.name}`);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Crown className="h-5 w-5 text-blue-600" />
          <div>
            <h4 className="font-semibold text-sm text-gray-900">
              {feature} is een premium feature
            </h4>
            <p className="text-xs text-gray-600">
              Upgrade naar {upgradeTier.display_name} om deze feature te gebruiken
            </p>
          </div>
        </div>
        <Button 
          size="sm" 
          onClick={handleUpgrade}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Upgrade
        </Button>
      </div>
    </div>
  );
};
