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
  AlertTriangle,
  Euro,
  ExternalLink,
  Download,
  Info
} from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { useNavigate } from 'react-router-dom';
import { UsageLimits } from '@/components/UsageLimits';
import { UpgradePrompt, UpgradeOptions, AllUpgradeOptions, TierUpgradeCard } from '@/components/UpgradePrompt';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface BillingSnapshot {
  id: string;
  snapshot_date: string;
  product_count: number;
  calculated_amount: number;
  status: 'pending' | 'invoiced' | 'paid' | 'failed';
  stripe_invoice_id: string | null;
}

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
    isCancelling,
    pricingTiers,
    isLoading,
    error
  } = useSubscription();

  // Fetch billing history
  const { data: billingHistory = [] } = useQuery({
    queryKey: ['billing-history', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('billing_snapshots')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(12);

      if (error) throw error;
      return data as BillingSnapshot[];
    },
    enabled: !!user
  });

  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

  // Calculate monthly cost based on current usage
  const calculateMonthlyCost = () => {
    if (!usageTracking) return 0;
    const FREE_PRODUCTS = 100;
    const PRICE_PER_PRODUCT = 0.008;
    const billableProducts = Math.max(0, usageTracking.current_products - FREE_PRODUCTS);
    return billableProducts * PRICE_PER_PRODUCT;
  };

  const monthlyCost = calculateMonthlyCost();

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
    const tier = currentTier || pricingTiers.find(t => t.name === 'basic');
    switch (tier?.name) {
      case 'basic':
        return <Package className="h-6 w-6 text-gray-600" />;
      case 'growth':
        return <Zap className="h-6 w-6 text-blue-600" />;
      case 'premium':
        return <Crown className="h-6 w-6 text-purple-600" />;
      default:
        return <Package className="h-6 w-6 text-gray-600" />;
    }
  };

  const getTierColor = () => {
    const tier = currentTier || pricingTiers.find(t => t.name === 'basic');
    switch (tier?.name) {
      case 'basic':
        return 'border-gray-200 bg-gray-50';
      case 'growth':
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

  // Show loading state if data is still loading
  if (isLoading) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading subscription data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if there's an error
  if (error) {
    return (
      <div className="space-y-2">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="text-red-600">
              <h3 className="font-semibold">Error loading subscription data</h3>
              <p className="text-sm mt-1">{error.message}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Current Plan */}
      <Card className={`${getTierColor()} border-2`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getTierIcon()}
              <div>
                <CardTitle className="text-xl">{(currentTier || pricingTiers.find(t => t.name === 'basic'))?.display_name} Plan</CardTitle>
                <CardDescription>{(currentTier || pricingTiers.find(t => t.name === 'basic'))?.description}</CardDescription>
              </div>
            </div>
            {getStatusBadge()}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Pricing Info - Usage-Based */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Euro className="h-6 w-6 text-gray-600" />
                  {formatPrice(monthlyCost)}
                </div>
                <div className="text-sm text-gray-500">
                  Current monthly estimate
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-lg font-semibold text-gray-900 flex items-center justify-end gap-2">
                  <Package className="h-5 w-5 text-blue-600" />
                  {usageTracking?.current_products || 0} products
                </div>
                <div className="text-sm text-gray-500">
                  {usageTracking && usageTracking.current_products > 100 
                    ? `${usageTracking.current_products - 100} billable` 
                    : 'All products free'}
                </div>
              </div>
            </div>

            {/* Next Billing Date */}
            {usageTracking?.next_billing_date && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-600" />
                  <span className="text-gray-600">Next billing date:</span>
                  <span className="font-semibold text-gray-900">
                    {new Date(usageTracking.next_billing_date).toLocaleDateString('nl-NL', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Usage-Based Pricing Info */}
          {monthlyCost > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-900">
                    Usage-Based Billing
                  </h4>
                  <p className="text-sm text-blue-700 mt-1">
                    You get the first 100 products free forever. You're currently using {usageTracking?.current_products || 0} products, 
                    so you're being charged €0.008 per month for each product over 100. 
                    You can add or remove products anytime - charges are calculated at the end of each 30-day billing cycle.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Free Tier Info */}
          {monthlyCost === 0 && usageTracking && usageTracking.current_products <= 100 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Package className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-green-900">
                    You're on the Free Plan
                  </h4>
                  <p className="text-sm text-green-700 mt-1">
                    Your first 100 products are completely free forever. After that, pay only €0.008 per product per month. 
                    No hidden fees, cancel anytime.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Features */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Included features:</h4>
            <div className="grid grid-cols-2 gap-2">
              {(() => {
                const tier = currentTier || pricingTiers.find(t => t.name === 'basic');
                const features = tier?.features || [];
                return features.slice(0, 6).map((feature, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-gray-600">{feature}</span>
                  </div>
                ));
              })()}
              {(() => {
                const tier = currentTier || pricingTiers.find(t => t.name === 'basic');
                const features = tier?.features || [];
                return features.length > 6 && (
                  <div className="text-sm text-gray-500 col-span-2">
                    +{features.length - 6} more features
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            {(() => {
              const tier = currentTier || pricingTiers.find(t => t.name === 'basic');
              return tier?.name === 'basic' && (
                <Button onClick={handleUpgrade} className="bg-blue-600 hover:bg-blue-700">
                      Upgrade to Growth
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              );
            })()}
            
            {(() => {
              const tier = currentTier || pricingTiers.find(t => t.name === 'basic');
              return tier?.name === 'growth' && (
                <Button onClick={handleUpgrade} variant="outline">
                      Upgrade to Premium
                  <Crown className="h-4 w-4 ml-2" />
                </Button>
              );
            })()}
            
            {isSubscriptionActive && (
              <Button 
                onClick={handleCancelSubscription}
                variant="outline"
                disabled={isCancelling}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
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

      {/* Upgrade Prompts */}
      {(() => {
        const tier = currentTier || pricingTiers.find(t => t.name === 'basic');
        const isBasic = tier?.name === 'basic';
        const isGrowth = tier?.name === 'growth';
        
        if (!isBasic && !isGrowth) return null;
        
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Upgrade for more features
            </h3>
            
            {isBasic ? (
              <div className="grid md:grid-cols-2 gap-4">
                <TierUpgradeCard 
                  tier={pricingTiers.find(t => t.name === 'growth')!}
                  feature="analytics"
                  showCloseButton={false}
                />
                <TierUpgradeCard 
                  tier={pricingTiers.find(t => t.name === 'premium')!}
                  feature="scanner"
                  showCloseButton={false}
                />
              </div>
            ) : (
              <UpgradeOptions 
                feature="premium"
                showAllOptions={false}
                showCloseButton={false}
              />
            )}
          </div>
        );
      })()}

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>
            Your past invoices and payment history
          </CardDescription>
        </CardHeader>
        <CardContent>
          {billingHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No billing history yet</p>
              <p className="text-sm mt-1">Your first bill will appear here after your first billing cycle</p>
            </div>
          ) : (
            <div className="space-y-3">
              {billingHistory.map((snapshot) => (
                <div
                  key={snapshot.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {new Date(snapshot.snapshot_date).toLocaleDateString('nl-NL', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                          <p className="text-sm text-gray-500">
                            {snapshot.product_count.toLocaleString()} products • {snapshot.product_count > 100 ? `${snapshot.product_count - 100} billable` : 'All products free'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatPrice(snapshot.calculated_amount)}
                      </p>
                      {snapshot.stripe_invoice_id && (
                        <a
                          href={`https://dashboard.stripe.com/invoices/${snapshot.stripe_invoice_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-800 flex items-center justify-end gap-1"
                        >
                          Invoice
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                    <Badge 
                      className={
                        snapshot.status === 'paid' ? 'bg-green-100 text-green-800' :
                        snapshot.status === 'failed' ? 'bg-red-100 text-red-800' :
                        snapshot.status === 'invoiced' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }
                    >
                      {snapshot.status === 'paid' ? 'Paid' :
                       snapshot.status === 'failed' ? 'Failed' :
                       snapshot.status === 'invoiced' ? 'Invoiced' :
                       'Pending'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
