import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Package, Sparkles } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { useCurrency } from '@/hooks/useCurrency';

export const LicenseOverview = () => {
  const { formatPrice } = useCurrency();
  const {
    currentTier,
    productCount,
    isLoading,
    error,
  } = useSubscription();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[240px] text-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
        <p className="text-sm text-muted-foreground">Loading your plan details…</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-700">Unable to load plan details</CardTitle>
          <CardDescription className="text-red-600">
            Please refresh the page or contact support if the issue persists.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const currentProducts = productCount ?? 0;

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
              <CardDescription>Completely free with unlimited usage</CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="mt-2 sm:mt-0 bg-green-100 text-green-800">
            {currentTier?.display_name ?? 'Free'} Forever
          </Badge>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">You are currently on</p>
              <p className="text-xl font-semibold text-foreground">{currentTier?.display_name ?? 'Free'}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Monthly cost</p>
              <p className="text-xl font-semibold text-foreground">{formatPrice(0)}</p>
            </div>
          </div>

          <div className="rounded-lg border bg-green-50 p-4">
            <div className="flex items-center justify-between text-sm font-medium text-foreground">
              <span>{currentProducts.toLocaleString()} products</span>
              <span className="text-green-700">Unlimited</span>
            </div>
            <div className="mt-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Sparkles className="h-4 w-4 text-green-600" />
                <span>All features included at no cost. No limits, no subscriptions, free forever.</span>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
