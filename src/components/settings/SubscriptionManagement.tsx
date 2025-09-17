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
        title: 'Subscription cancelled',
        description: 'Your subscription has been cancelled. You can still use it until the end of your billing period.',
      });
    } catch (error) {
      toast({
        title: 'Error cancelling subscription',
        description: 'An error occurred while cancelling your subscription.',
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
      return <Badge className="bg-blue-100 text-blue-800">Trial Active</Badge>;
    }
    if (isSubscriptionActive) {
      return <Badge className="bg-green-100 text-green-800">Active</Badge>;
    }
    return <Badge className="bg-gray-100 text-gray-800">Basic plan</Badge>;
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
                {currentTier?.price_monthly === 0 ? 'Free' : formatPrice(currentTier?.price_monthly || 0)}
              </div>
              <div className="text-sm text-gray-500">
                {currentTier?.price_monthly === 0 ? 'Forever free' : 'per month'}
                <CardTitle className="text-xl">{currentTier?.display_name} plan</CardTitle>
              </div>
            </div>
            
            {currentSubscription && (
              <div className="text-right">
                <div className="text-sm text-gray-600">
                  {currentSubscription.billing_cycle === 'monthly' ? 'Monthly' : 'Yearly'}
                  <CardTitle className="text-xl">{currentTier?.display_name} plan</CardTitle>
                </div>
                {getNextBillingDate() && (
                  <div className="text-sm text-gray-500">
                    <CardTitle className="text-xl">{currentTier?.display_name} plan</CardTitle>
                    Next payment: {getNextBillingDate()}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Features */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Included features:</h4>
            <div className="grid grid-cols-2 gap-2">
              {currentTier?.features.slice(0, 6).map((feature, index) => (
                <div key={index} className="flex items-center text-sm">
                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-600">{feature}</span>
                </div>
              ))}
              {currentTier?.features.length > 6 && (
                <div className="text-sm text-gray-500 col-span-2">
                <CardTitle className="text-xl">{currentTier?.display_name} plan</CardTitle>
                  +{currentTier.features.length - 6} more features
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            {currentTier?.name === 'basis' && (
              <Button onClick={handleUpgrade} className="bg-blue-600 hover:bg-blue-700">
                <CardTitle className="text-xl">{currentTier?.display_name} plan</CardTitle>
                    Upgrade to Growth
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
            
            {currentTier?.name === 'groei' && (
              <Button onClick={handleUpgrade} variant="outline">
                  <CardTitle className="text-xl">{currentTier?.display_name} plan</CardTitle>
                    Upgrade to Premium
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
                <CardTitle className="text-xl">{currentTier?.display_name} plan</CardTitle>
                      {isCancelling ? 'Cancelling...' : 'Cancel subscription'}
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
                  {isTrialActive ? 'Free trial active' : 'Premium plan active'}
                </h4>
                <p className="text-sm text-blue-700 mt-1">
                  {isTrialActive 
                    ? 'Your trial is still active. Upgrade to a paid plan to increase your limits.'
                    : 'You have access to all premium features and higher limits.'
                  }
                </p>
                {isTrialActive && (
                  <Button 
                    onClick={handleUpgrade} 
                    size="sm" 
                    className="mt-3 bg-blue-600 hover:bg-blue-700"
                  >
                    Upgrade now
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
            Upgrade for more features
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
            <CardTitle>Billing history</CardTitle>
            <CardDescription>
              View your previous payments and downloads invoices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Billing history will be added soon</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
