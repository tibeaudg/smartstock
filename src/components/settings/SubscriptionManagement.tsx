import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { 
  Crown, 
  Zap, 
  Package, 
  Check, 
  ArrowRight, 
  Calendar, 
  Users, 
  Building, 
  ShoppingCart,
  TrendingUp,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { useNavigate } from 'react-router-dom';
import { UsageLimits } from '@/components/UsageLimits';
import { UpgradePrompt } from '@/components/UpgradePrompt';

export const SubscriptionManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { 
    currentSubscription, 
    currentTier, 
    usageTracking, 
    isTrialActive, 
    isSubscriptionActive,
    cancelSubscription,
    isCancelling
  } = useSubscription();

  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

  const handleUpgrade = () => {
    navigate('/pricing');
  };

  const handleCancelSubscription = async () => {
    if (!currentSubscription) return;
    
    try {
      await cancelSubscription();
      toast({
        title: 'Abonnement geannuleerd',
        description: 'Je abonnement is geannuleerd. Je kunt tot het einde van je betaalperiode blijven gebruiken.',
      });
    } catch (error) {
      toast({
        title: 'Fout bij annuleren',
        description: 'Er is een fout opgetreden bij het annuleren van je abonnement.',
        variant: 'destructive',
      });
    }
  };

  const getTierIcon = () => {
    switch (currentTier?.name) {
      case 'basis':
        return <Package className="h-6 w-6 text-gray-600" />;
      case 'groei':
        return <Zap className="h-6 w-6 text-blue-600" />;
      case 'premium':
        return <Crown className="h-6 w-6 text-purple-600" />;
      default:
        return <Package className="h-6 w-6 text-gray-600" />;
    }
  };

  const getTierColor = () => {
    switch (currentTier?.name) {
      case 'basis':
        return 'border-gray-200 bg-gray-50';
      case 'groei':
        return 'border-blue-200 bg-blue-50';
      case 'premium':
        return 'border-purple-200 bg-purple-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getStatusBadge = () => {
    if (isTrialActive) {
      return <Badge className="bg-blue-100 text-blue-800">Trial actief</Badge>;
    }
    if (isSubscriptionActive) {
      return <Badge className="bg-green-100 text-green-800">Actief</Badge>;
    }
    return <Badge variant="outline" className="bg-gray-100 text-gray-800">Basis plan</Badge>;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const getNextBillingDate = () => {
    if (!currentSubscription) return null;
    return new Date(currentSubscription.end_date).toLocaleDateString('nl-NL');
  };

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card className={`${getTierColor()} border-2`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getTierIcon()}
              <div>
                <CardTitle className="text-xl">{currentTier?.display_name} Plan</CardTitle>
                <CardDescription>{currentTier?.description}</CardDescription>
              </div>
            </div>
            {getStatusBadge()}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Pricing Info */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {currentTier?.price_monthly === 0 ? 'Gratis' : formatPrice(currentTier?.price_monthly || 0)}
              </div>
              <div className="text-sm text-gray-500">
                {currentTier?.price_monthly === 0 ? 'Voor altijd gratis' : 'per maand'}
              </div>
            </div>
            
            {currentSubscription && (
              <div className="text-right">
                <div className="text-sm text-gray-600">
                  {currentSubscription.billing_cycle === 'monthly' ? 'Maandelijks' : 'Jaarlijks'}
                </div>
                {getNextBillingDate() && (
                  <div className="text-sm text-gray-500">
                    Volgende betaling: {getNextBillingDate()}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Features */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Inbegrepen features:</h4>
            <div className="grid grid-cols-2 gap-2">
              {currentTier?.features.slice(0, 6).map((feature, index) => (
                <div key={index} className="flex items-center text-sm">
                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-600">{feature}</span>
                </div>
              ))}
              {currentTier?.features.length > 6 && (
                <div className="text-sm text-gray-500 col-span-2">
                  +{currentTier.features.length - 6} meer features
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            {currentTier?.name === 'basis' && (
              <Button onClick={handleUpgrade} className="bg-blue-600 hover:bg-blue-700">
                Upgrade naar Groei
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
            
            {currentTier?.name === 'groei' && (
              <Button onClick={handleUpgrade} variant="outline">
                Upgrade naar Premium
                <Crown className="h-4 w-4 ml-2" />
              </Button>
            )}
            
            {isSubscriptionActive && (
              <Button 
                onClick={handleCancelSubscription}
                variant="outline"
                disabled={isCancelling}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                {isCancelling ? 'Annuleren...' : 'Abonnement annuleren'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Usage Limits */}
      <UsageLimits showUpgradePrompts={true} />

      {/* Trial/Subscription Info */}
      {(isTrialActive || isSubscriptionActive) && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">
                  {isTrialActive ? 'Gratis trial actief' : 'Premium plan actief'}
                </h4>
                <p className="text-sm text-blue-700 mt-1">
                  {isTrialActive 
                    ? 'Je trial loopt nog. Upgrade naar een betaald plan om je limieten te verhogen.'
                    : 'Je hebt toegang tot alle premium features en hogere limieten.'
                  }
                </p>
                {isTrialActive && (
                  <Button 
                    onClick={handleUpgrade} 
                    size="sm" 
                    className="mt-3 bg-blue-600 hover:bg-blue-700"
                  >
                    Nu upgraden
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upgrade Prompts for Basic Plan */}
      {currentTier?.name === 'basis' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Upgrade voor meer mogelijkheden
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <UpgradePrompt 
              feature="analytics"
              showCloseButton={false}
            />
            <UpgradePrompt 
              feature="scanner"
              showCloseButton={false}
            />
          </div>
        </div>
      )}

      {/* Billing History */}
      {currentSubscription && (
        <Card>
          <CardHeader>
            <CardTitle>Facturatie geschiedenis</CardTitle>
            <CardDescription>
              Bekijk je vorige betalingen en downloads facturen
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Facturatie geschiedenis wordt binnenkort toegevoegd</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
