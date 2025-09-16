import React from 'react';
import { AlertTriangle, Users, Package, Building, ShoppingCart, TrendingUp } from 'lucide-react';
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

  const limits = [
    {
      type: 'products' as const,
      icon: <Package className="h-4 w-4" />,
      label: 'Producten',
      current: usageTracking.current_products,
      max: currentTier.max_products,
      color: 'text-blue-600'
    },
    {
      type: 'users' as const,
      icon: <Users className="h-4 w-4" />,
      label: 'Gebruikers',
      current: usageTracking.current_users,
      max: currentTier.max_users,
      color: 'text-green-600'
    },
    {
      type: 'branches' as const,
      icon: <Building className="h-4 w-4" />,
      label: 'Vestigingen',
      current: usageTracking.current_branches,
      max: currentTier.max_branches,
      color: 'text-purple-600'
    },
    {
      type: 'orders' as const,
      icon: <ShoppingCart className="h-4 w-4" />,
      label: 'Orders deze maand',
      current: usageTracking.orders_this_month,
      max: currentTier.max_orders,
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
      return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Trial actief</Badge>;
    }
    if (isSubscriptionActive) {
      return <Badge variant="secondary" className="bg-green-100 text-green-800">Actief</Badge>;
    }
    return <Badge variant="outline" className="bg-gray-100 text-gray-800">Basis plan</Badge>;
  };

  if (compact) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm text-gray-900">Gebruik</h3>
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
            <CardTitle className="text-lg">Gebruik & Limieten</CardTitle>
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
                      {limit.current} van {limit.max || 'onbeperkt'} gebruikt
                    </p>
                  </div>
                </div>
                
                {isOverLimit && (
                  <Badge variant="destructive" className="bg-red-100 text-red-800">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Limiet bereikt
                  </Badge>
                )}
                {isNearLimit && !isOverLimit && (
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Bijna vol
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
                    <span>{percentage.toFixed(0)}% gebruikt</span>
                    {remaining !== null && (
                      <span>{remaining} over</span>
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
        
        {/* Trial/Subscription Info */}
        {(isTrialActive || isSubscriptionActive) && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
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
