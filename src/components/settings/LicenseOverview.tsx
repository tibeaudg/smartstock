import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Loader2, Package, Sparkles } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { useCurrency } from '@/hooks/useCurrency';

export const LicenseOverview = () => {
  const { formatPrice } = useCurrency();
  const {
    currentTier,
    nextTier,
    productCount,
    usageTracking,
    isLoading,
    error,
  } = useSubscription();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[240px] text-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
        <p className="text-sm text-muted-foreground">Loading your subscription details…</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-700">Unable to load subscription</CardTitle>
          <CardDescription className="text-red-600">
            Please refresh the page or contact support if the issue persists.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const currentProducts = productCount ?? 0;
  const includedProducts = currentTier?.included_products ?? null;
  const isUnlimited = includedProducts === null;
  const planPrice = currentTier?.price_monthly ?? 0;
  const progressValue = isUnlimited || includedProducts === 0
    ? 0
    : Math.min(100, (currentProducts / includedProducts) * 100);

  const remainingProducts = !isUnlimited && includedProducts !== null
    ? Math.max(0, includedProducts - currentProducts)
    : null;

  const nextPlanMessage = nextTier
    ? `${nextTier.display_name} • ${nextTier.included_products ?? 'Unlimited'} products • ${formatPrice(nextTier.price_monthly)}`
    : 'You are on the highest available plan.';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Plan</CardTitle>
              <CardDescription>Current monthly estimate</CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="mt-2 sm:mt-0">
            {currentTier?.display_name ?? 'No plan'} plan
          </Badge>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">You are currently on</p>
              <p className="text-xl font-semibold text-foreground">{currentTier?.display_name ?? 'Free'}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Estimated monthly charge</p>
              <p className="text-xl font-semibold text-foreground">{formatPrice(planPrice)}</p>
            </div>
          </div>

          <div className="rounded-lg border bg-slate-50 p-4">
            <div className="flex items-center justify-between text-sm font-medium text-foreground">
              <span>{currentProducts} products</span>
              <span>
                {isUnlimited
                  ? 'Unlimited'
                  : `${includedProducts} included`}
              </span>
            </div>
            <Progress value={progressValue} className="mt-2" />
            <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
              <span>
                {isUnlimited
                  ? 'Plan includes unlimited products.'
                  : remainingProducts !== null && remainingProducts > 0
                    ? `${remainingProducts} products left before upgrade`
                    : 'Limit reached — next plan will auto-apply.'}
              </span>
              <span className="flex items-center gap-1">
                <Sparkles className="h-4 w-4 text-blue-500" />
                <span>{nextPlanMessage}</span>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
