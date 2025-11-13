import React, { useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import {
  Package,
  Check,
  ArrowRight,
  Calendar,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { useNavigate } from 'react-router-dom';
import { UsageLimits } from '@/components/UsageLimits';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import type { PricingTier } from '@/hooks/useSubscription';

interface BillingSnapshot {
  id: string;
  snapshot_date: string;
  product_count: number;
  calculated_amount: number;
  status: 'pending' | 'invoiced' | 'paid' | 'failed';
  stripe_invoice_id: string | null;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }).format(value);

export const SubscriptionManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const subscription = useSubscription();
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
    error,
  } = subscription;

  const { data: fallbackProductCount = 0 } = useQuery<number>({
    queryKey: ['subscription-management-product-count', user?.id],
    queryFn: async () => {
      if (!user) return 0;

      const { data: branches, error: branchesError } = await supabase
        .from('branches')
        .select('id')
        .eq('user_id', user.id);
      const branchRows = branches as { id: string }[] | null;
      if (branchesError || !branchRows) return 0;
      const branchIds = branchRows.map(branch => branch.id);

      const result = (await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .in('branch_id', branchIds)) as { count: number | null; error: unknown };
      if (result.error) return 0;
      return result.count ?? 0;
    },
    enabled: !!user
  });

  const currentProducts = usageTracking?.current_products ?? fallbackProductCount;

  const tiersList = subscription.pricingTiers as PricingTier[];

  const sortedTiers = useMemo<PricingTier[]>(
    () => [...tiersList].sort((a, b) => (a.included_products ?? Number.MAX_SAFE_INTEGER) - (b.included_products ?? Number.MAX_SAFE_INTEGER)),
    [tiersList]
  );

  const currentTierIndex = currentTier ? sortedTiers.findIndex(tier => tier.id === currentTier.id) : -1;
  const nextTier = currentTierIndex >= 0 ? sortedTiers[currentTierIndex + 1] ?? null : null;
  const currentLimit = currentTier?.included_products ?? null;
  const nextLimit = nextTier?.included_products ?? null;

  const nextPlanSummary = nextTier
    ? `${nextTier.display_name} • ${nextLimit?.toLocaleString?.() ?? 'Unlimited'} products • ${formatCurrency(nextTier.price_monthly ?? 0)}`
    : 'You are on the highest available plan.';

  const progressDenominator = nextLimit ?? currentLimit ?? Math.max(currentProducts, 1);
  const progressValue = Math.min(100, (currentProducts / progressDenominator) * 100);

  const progressLabel = (() => {
    if (currentLimit !== null && currentProducts > currentLimit) {
      const over = currentProducts - currentLimit;
      return `You are ${over.toLocaleString()} over the ${currentLimit.toLocaleString()}-product limit — we will move you to ${nextTier?.display_name ?? 'the next plan'}.`;
    }
    if (nextLimit !== null) {
      const remaining = Math.max(0, nextLimit - currentProducts);
    }
    return '';
  })();

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
    <div className="space-y-4">
      {/* Current Plan */}
      <Card className="border border-blue-700 bg-blue-50 p-4 pt-10 shadow-lg">


        <CardContent className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">You are currently on</p>
              <p className="text-xl font-semibold text-foreground">
                {currentTier?.display_name ?? 'Free'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Current monthly estimate</p>
              <p className="text-xl font-semibold text-foreground">
                {formatCurrency(currentTier?.price_monthly ?? 0)}
              </p>
            </div>
          </div>



          {usageTracking?.next_billing_date && (
            <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span>Next billing date:</span>
                <span className="font-semibold text-foreground">
                  {new Date(usageTracking.next_billing_date).toLocaleDateString('nl-NL', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>
          )}

        </CardContent>
      </Card>

      {/* Usage Limits */}
      <UsageLimits />

      {/* Trial/Subscription Info */}
      {(isTrialActive || isSubscriptionActive && currentTier?.name !== 'free') && (
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
        const tier = currentTier || pricingTiers.find(t => t.name === 'free');
        const tierName = tier?.name ?? 'free';

        const upgradesByTier: Record<string, string[]> = {
          free: ['advanced', 'ultra'],
          advanced: ['ultra', 'premium'],
          ultra: ['premium'],
          premium: ['enterprise'],
        };

        const upgradeTargets = upgradesByTier[tierName] ?? [];
        if (upgradeTargets.length === 0) return null;
        return null;
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
          {usageTracking?.next_billing_date && (
            <div className="mb-6 flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Next bill</p>
                <p className="text-base font-semibold text-foreground">
                  {new Date(usageTracking.next_billing_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-sm text-muted-foreground">Estimated amount</p>
                <p className="text-base font-semibold text-foreground">
                  {formatCurrency(currentTier?.price_monthly ?? 0)}
                </p>
              </div>
            </div>
          )}
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
                            {snapshot.product_count.toLocaleString()} products during this cycle
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        € {snapshot.calculated_amount.toFixed(2)}
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
