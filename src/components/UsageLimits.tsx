import React from 'react';
import { AlertTriangle, Users, Package, Building, ShoppingCart, TrendingUp, Info } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSubscription } from '@/hooks/useSubscription';
import { UpgradePrompt } from './UpgradePrompt';

interface UsageLimitsProps {
  showUpgradePrompts?: boolean;
  compact?: boolean;
}

export const UsageLimits: React.FC<UsageLimitsProps> = ({ 
  showUpgradePrompts = true, 
  compact = false 
}) => {
  const { 
    currentTier, 
    usageTracking, 
    isWithinLimits, 
    getRemainingLimit,
    isTrialActive,
    isSubscriptionActive 
  } = useSubscription();

  if (!currentTier || !usageTracking) return null;

  // Calculate monthly cost based on usage-based pricing
  const calculateMonthlyCost = (): number => {
    const productCount = usageTracking.current_products;
    const FREE_PRODUCTS = 100;
    const PRICE_PER_PRODUCT = 0.008;
    
    if (productCount <= FREE_PRODUCTS) {
      return 0;
    }
    
    const billableProducts = productCount - FREE_PRODUCTS;
    return billableProducts * PRICE_PER_PRODUCT;
  };

  const monthlyCost = calculateMonthlyCost();
  const shouldShowUpgrade = usageTracking.current_products >= 10000;

  const limits = [
    {
      type: 'products' as const,
      icon: <Package className="h-4 w-4" />,
      label: 'Products',
      current: usageTracking.current_products,
      max: currentTier.max_products,
      color: 'text-blue-600',
      showCost: monthlyCost > 0,
      estimatedCost: monthlyCost
    },
    {
      type: 'users' as const,
      icon: <Users className="h-4 w-4" />,
      label: 'Users',
      current: usageTracking.current_users,
      max: currentTier.max_users,
      color: 'text-green-600'
    },
    {
      type: 'branches' as const,
      icon: <Building className="h-4 w-4" />,
      label: 'Branches',
      current: usageTracking.current_branches,
      max: currentTier.max_branches,
      color: 'text-purple-600'
    },
    {
      type: 'orders' as const,
      icon: <ShoppingCart className="h-4 w-4" />,
      label: 'Orders this month',
      current: usageTracking.orders_this_month,
      max: currentTier.max_orders_per_month,
      color: 'text-orange-600'
    }
  ];

  const getUsagePercentage = (current: number, max: number | null) => {
    if (max === null) return 0;
    return Math.min((current / max) * 100, 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStatusBadge = () => {
    if (isTrialActive) {
      return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Trial Active</Badge>;
    }
    if (isSubscriptionActive) {
      return <Badge variant="secondary" className="bg-green-100 text-green-800">Active</Badge>;
    }
    return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Basic Plan</Badge>;
  };

  if (compact) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm text-gray-900">Usage</h3>
          {getStatusBadge()}
        </div>
        
        {limits.map((limit) => {
          const percentage = getUsagePercentage(limit.current, limit.max);
          const isNearLimit = percentage >= 75;
          const isOverLimit = percentage >= 100;
          
          return (
            <div key={limit.type} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <span className={limit.color}>{limit.icon}</span>
                  <span className="text-gray-600">{limit.label}</span>
                </div>
                <span className="text-gray-900 font-medium">
                  {limit.current} / {limit.max || '∞'}
                </span>
              </div>
              
              {limit.max && (
                <Progress 
                  value={percentage} 
                  className="h-2"
                />
              )}
              
              {isOverLimit && showUpgradePrompts && (
                <div className="mt-2">
                  <UpgradePrompt 
                    feature={limit.type}
                    currentLimit={limit.current}
                    maxLimit={limit.max}
                    showCloseButton={false}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Usage & Limits</CardTitle>
            <CardDescription>
              Huidige {currentTier.display_name} plan
            </CardDescription>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {limits.map((limit) => {
          const percentage = getUsagePercentage(limit.current, limit.max);
          const isNearLimit = percentage >= 75;
          const isOverLimit = percentage >= 100;
          const remaining = getRemainingLimit(limit.type);
          
          return (
            <div key={limit.type} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className={limit.color}>{limit.icon}</span>
                  <div>
                    <h4 className="font-medium text-gray-900">{limit.label}</h4>
                    <p className="text-sm text-gray-500">
                      {limit.current} of {limit.max || 'unlimited'} used
                      {(limit as any).showCost && (
                        <span className="ml-2 font-semibold text-blue-600">
                          • €{(limit as any).estimatedCost.toFixed(2)}/month
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                
                {isOverLimit && (
                  <Badge variant="destructive" className="bg-red-100 text-red-800">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Limit reached
                  </Badge>
                )}
                {isNearLimit && !isOverLimit && (
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Almost full
                  </Badge>
                )}
              </div>
              
              {limit.max && (
                <div className="space-y-2">
                  <Progress 
                    value={percentage} 
                    className="h-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                      <span>{percentage.toFixed(0)}% used</span>
                    {remaining !== null && (
                      <span>{remaining} remaining</span>
                    )}
                  </div>
                </div>
              )}
              
              {isOverLimit && showUpgradePrompts && (
                <div className="mt-3">
                  <UpgradePrompt 
                    feature={limit.type}
                    currentLimit={limit.current}
                    maxLimit={limit.max}
                  />
                </div>
              )}
            </div>
          );
        })}
        
        {/* Enterprise Warning */}
        {shouldShowUpgrade && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-purple-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-purple-900">
                  Enterprise Plan Required
                </h4>
                <p className="text-sm text-purple-700 mt-1">
                  You've reached the 10,000 product limit. Contact sales for custom Enterprise pricing.
                </p>
                <a 
                  href="/contact?subject=enterprise-pricing" 
                  className="text-sm font-medium text-purple-600 hover:text-purple-800 mt-2 inline-block"
                >
                  Contact Sales →
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Usage-Based Pricing Info */}
        {monthlyCost > 0 && !shouldShowUpgrade && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Info className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-900">
                  Usage-Based Billing
                </h4>
                <p className="text-sm text-green-700 mt-1">
                  First 100 products are free. You're paying €0.004 per product per month for the remaining {usageTracking.current_products - 100} products.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Trial/Subscription Info */}
        {(isTrialActive || isSubscriptionActive) && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">
                  {isTrialActive ? 'Free trial active' : 'Active subscription'}
                </h4>
                <p className="text-sm text-blue-700 mt-1">
                  {isTrialActive 
                    ? 'Your trial is still active. Upgrade to a paid plan to increase your limits.'
                    : 'You have access to all premium features and higher limits.'
                  }
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Hook for checking specific limits
export const useUsageLimits = () => {
  const { isWithinLimits, getRemainingLimit, currentTier, usageTracking } = useSubscription();

  const canAddProduct = () => isWithinLimits('products');
  const canAddUser = () => isWithinLimits('users');
  const canAddBranch = () => isWithinLimits('branches');
  const canAddOrder = () => isWithinLimits('orders');

  const getProductsRemaining = () => getRemainingLimit('products');
  const getUsersRemaining = () => getRemainingLimit('users');
  const getBranchesRemaining = () => getRemainingLimit('branches');
  const getOrdersRemaining = () => getRemainingLimit('orders');

  return {
    canAddProduct,
    canAddUser,
    canAddBranch,
    canAddOrder,
    getProductsRemaining,
    getUsersRemaining,
    getBranchesRemaining,
    getOrdersRemaining,
    currentTier,
    usageTracking
  };
};
