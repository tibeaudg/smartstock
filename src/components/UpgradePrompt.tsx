import React from 'react';
import { Crown, Zap, Star, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/hooks/useSubscription';
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
    if (currentTier?.name === 'basis') {
      return pricingTiers.find(tier => tier.name === 'groei');
    }
    if (currentTier?.name === 'groei') {
      return pricingTiers.find(tier => tier.name === 'premium');
    }
    return pricingTiers.find(tier => tier.name === 'groei');
  };

  const upgradeTier = getUpgradeTier();
  if (!upgradeTier) return null;

  const getFeatureDescription = () => {
    switch (feature) {
      case 'products':
        return `Je hebt ${currentLimit} van de ${maxLimit} producten gebruikt. Upgrade voor meer producten.`;
      case 'users':
        return `Je hebt ${currentLimit} van de ${maxLimit} gebruikers gebruikt. Upgrade voor meer teamleden.`;
      case 'branches':
        return `Je hebt ${currentLimit} van de ${maxLimit} vestigingen gebruikt. Upgrade voor meer locaties.`;
      case 'orders':
        return `Je hebt ${currentLimit} van de ${maxLimit} orders deze maand gebruikt. Upgrade voor meer orders.`;
      case 'analytics':
        return 'Geavanceerde analytics zijn alleen beschikbaar in hogere plannen.';
      case 'scanner':
        return 'Barcode scanner is alleen beschikbaar in hogere plannen.';
      case 'delivery-notes':
        return 'Leveringsbonnen beheer is alleen beschikbaar in hogere plannen.';
      case 'api':
        return 'API toegang is alleen beschikbaar in hogere plannen.';
      default:
        return `${feature} is alleen beschikbaar in hogere plannen.`;
    }
  };

  const getTierIcon = () => {
    switch (upgradeTier.name) {
      case 'groei':
        return <Zap className="h-6 w-6 text-blue-600" />;
      case 'premium':
        return <Crown className="h-6 w-6 text-purple-600" />;
      default:
        return <Star className="h-6 w-6 text-gray-600" />;
    }
  };

  const getTierColor = () => {
    switch (upgradeTier.name) {
      case 'groei':
        return 'border-blue-200 bg-blue-50';
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
                €{upgradeTier.price_monthly.toFixed(2)}
                <span className="text-sm font-normal text-gray-500">/maand</span>
              </div>
              <div className="text-sm text-gray-500">
                of €{upgradeTier.price_yearly.toFixed(2)}/jaar (bespaar {upgradeTier.yearly_discount_percentage}%)
              </div>
            </div>
            <Button 
              onClick={handleUpgrade}
              className={`${
                upgradeTier.name === 'groei' 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              Upgrade nu
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          {/* Trial Info */}
          <div className="bg-white rounded-lg p-3 border">
            <div className="flex items-center text-sm text-gray-600">
              <Star className="h-4 w-4 text-yellow-500 mr-2" />
              <span>14-dagen gratis trial • Geen creditcard vereist</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Compact version for inline use
export const CompactUpgradePrompt: React.FC<{
  feature: string;
  onUpgrade?: () => void;
}> = ({ feature, onUpgrade }) => {
  const { currentTier, pricingTiers } = useSubscription();
  const navigate = useNavigate();

  const upgradeTier = pricingTiers.find(tier => tier.name === 'groei');
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
