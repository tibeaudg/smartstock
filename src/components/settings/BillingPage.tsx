import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Loader2, Package, AlertCircle, Check, Star, XCircle, CreditCard } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

interface Invoice {
  id: string;
  invoice_number: string;
  amount: number;
  currency: string;
  status: string;
  due_date: string | null;
  paid_at: string | null;
  created_at: string;
}

interface Plan {
  name: string;
  displayName: string;
  description: string;
  monthlyPrice: number;
  features: string[];
  isPopular: boolean;
  ctaLabel: string;
  isSales: boolean;
}

const PAID_PLANS: Plan[] = [
  {
    name: 'professional',
    displayName: 'Professional',
    description: 'Best for simplifying day-to-day inventory tasks.',
    monthlyPrice: 9,
    features: [
      '2,000 unique items',
      '5 user licenses',
      '2 branches',
      'Unlimited QR code & barcode label creation',
      'Purchase orders',
      'Orders management',
    ],
    isPopular: true,
    ctaLabel: 'Start Free Trial',
    isSales: false,
  },
  {
    name: 'business',
    displayName: 'Business',
    description: 'Best for streamlining inventory processes and oversight.',
    monthlyPrice: 29,
    features: [
      '5,000 unique items',
      '8 user licenses',
      '5 branches',
      'Customizable role permissions',
      'QuickBooks Online integration',
      'Purchase orders',
    ],
    isPopular: false,
    ctaLabel: 'Start Free Trial',
    isSales: false,
  },
  {
    name: 'enterprise',
    displayName: 'Enterprise',
    description: 'Best for customized inventory processes and control.',
    monthlyPrice: 59,
    features: [
      '10,000+ unique items',
      '12+ user licenses',
      'API and webhooks',
      'Dedicated customer success manager',
    ],
    isPopular: false,
    ctaLabel: 'Start Free Trial',
    isSales: false,
  },
];

const STARTER_FEATURES = ['100 unique items', '1 user license', 'Core inventory features'];

const PLAN_ITEM_LIMITS: Record<string, number> = {
  free: 100,
  starter: 100,
  professional: 2000,
  business: 5000,
  enterprise: 10000,
};

const PLAN_CUSTOM_FIELD_LIMITS: Record<string, number> = {
  free: 1,
  starter: 1,
  professional: 20,
  business: 50,
  enterprise: 999,
};

export const BillingPage = () => {
  const { user } = useAuth();
  const { currentTier, isPaidPlan, isOnTrial, isPastDue, trialEndDate, refetch, productCount, branchCount, maxBranches, maxUsers } = useSubscription();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loadingPortal, setLoadingPortal] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [showUpgradePlans, setShowUpgradePlans] = useState(false);

  useEffect(() => {
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');
    if (success === 'true') {
      toast.success('Your free trial has started. Enjoy full access!');
      refetch();
      setSearchParams({}, { replace: true });
    } else if (canceled === 'true') {
      toast.info('Checkout canceled');
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams, refetch]);

  const { data: invoices = [], isLoading: invoicesLoading } = useQuery<Invoice[]>({
    queryKey: ['invoices', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('invoices')
        .select('id, invoice_number, amount, currency, status, due_date, paid_at, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as Invoice[];
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 2,
  });

  const handleUpgrade = async (planName: string) => {
    setLoadingPlan(planName);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) { window.location.href = '/auth'; return; }
      const baseUrl = import.meta.env.VITE_SUPABASE_URL || '';
      const fnUrl = `${baseUrl.replace(/\/$/, '')}/functions/v1/create-checkout-session`;
      const res = await fetch(fnUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ planName }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : 'Failed to start checkout');
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleManagePayment = async () => {
    setLoadingPortal(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) { window.location.href = '/auth'; return; }
      const baseUrl = import.meta.env.VITE_SUPABASE_URL || '';
      const fnUrl = `${baseUrl.replace(/\/$/, '')}/functions/v1/create-portal-session`;
      const res = await fetch(fnUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to open billing portal');
      }
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : 'Failed to open billing portal');
    } finally {
      setLoadingPortal(false);
    }
  };

  const formatDate = (d: string | null) => (d ? new Date(d).toLocaleDateString('en-US') : '-');
  const formatPeriod = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const { data: userCount = 1 } = useQuery<number>({
    queryKey: ['billing-user-count', user?.id],
    queryFn: async () => {
      if (!user) return 1;
      const { data: userBranches } = await supabase
        .from('branches')
        .select('id')
        .eq('user_id', user.id);
      if (!userBranches?.length) return 1;
      const branchIds = userBranches.map((b) => b.id);
      const { data: branchUsers } = await supabase
        .from('branch_users')
        .select('user_id')
        .in('branch_id', branchIds);
      const unique = new Set((branchUsers ?? []).map((u) => u.user_id));
      return unique.size || 1;
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 2,
  });

  const tierName = currentTier?.name ?? 'free';
  const itemLimit = currentTier?.max_products ?? PLAN_ITEM_LIMITS[tierName] ?? 100;
  const branchLimit = maxBranches;
  const userLimit = maxUsers;

  const itemCount = productCount ?? 0;
  const currentBranchCount = branchCount ?? 0;

  const itemPct = Math.min(100, Math.round((itemCount / itemLimit) * 100));
  const userPct = Math.min(100, Math.round((userCount / userLimit) * 100));
  const branchPct = Math.min(100, Math.round((currentBranchCount / branchLimit) * 100));

  const extraBranches = Math.max(0, currentBranchCount - branchLimit);
  const extraUsers = Math.max(0, userCount - userLimit);
  const atItemLimit = itemCount >= itemLimit;

  const planPrice = currentTier?.price_monthly ?? 0;
  const planDisplayName = currentTier?.display_name ?? 'Starter';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Plan & Billing</h1>
      </div>

      {/* Current Plan + Usage */}
      <Card className="overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-gray-700">
          {/* Left: Current Plan */}
          <div className="p-6">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">Current Plan</p>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {isOnTrial ? `${planDisplayName} (Free Trial)` : planDisplayName}
                </p>
                {isOnTrial ? (
                  <>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">Free</p>
                    {trialEndDate && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        then ${planPrice.toFixed(2)}/mo after trial
                      </p>
                    )}
                  </>
                ) : planPrice > 0 ? (
                  <>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                      ${planPrice.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">per month</p>
                  </>
                ) : (
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">Free</p>
                )}
                {isOnTrial && trialEndDate && (
                  <Badge variant="secondary" className="mt-2 text-xs">
                    Trial ends {new Date(trialEndDate).toLocaleDateString('en-US')}
                  </Badge>
                )}
              </div>
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Package className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
            </div>
          </div>

          {/* Right: Usage */}
          <div className="p-6 space-y-4">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Usage</p>

            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Items</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {itemCount} / {itemLimit}
                  </span>
                </div>
                <Progress value={itemPct} className="h-2" />
              </div>

      

              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">User Licenses</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {userCount} / {userLimit}
                    {extraUsers > 0 && (
                      <span className="ml-1 text-xs text-amber-600 dark:text-amber-400">
                        +{extraUsers} extra (${extraUsers * 2}/mo)
                      </span>
                    )}
                  </span>
                </div>
                <Progress
                  value={userPct}
                  className={`h-2 ${userPct >= 100 ? '[&>div]:bg-amber-500' : ''}`}
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Branches</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {currentBranchCount} / {branchLimit}
                    {extraBranches > 0 && (
                      <span className="ml-1 text-xs text-amber-600 dark:text-amber-400">
                        +{extraBranches} extra (${extraBranches * 5}/mo)
                      </span>
                    )}
                  </span>
                </div>
                <Progress
                  value={branchPct}
                  className={`h-2 ${branchPct >= 100 ? '[&>div]:bg-amber-500' : ''}`}
                />
              </div>
            </div>

            {atItemLimit && (
              <div className="flex items-start gap-2 text-sm text-red-600 dark:text-red-400">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p>You've reached your item limit. Upgrade your plan to add more items.</p>
              </div>
            )}

            <div className="flex gap-3 pt-1">
              {isPaidPlan ? (
                <>
                  <Button
                    onClick={handleManagePayment}
                    disabled={loadingPortal}
                    className="bg-red-600 hover:bg-red-700 text-white uppercase tracking-wide text-xs font-bold"
                  >
                    {loadingPortal ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Manage Plan'}
                  </Button>
                  <Button
                    onClick={handleManagePayment}
                    disabled={loadingPortal}
                    variant="outline"
                    className="uppercase tracking-wide text-xs font-bold"
                  >
                    Add Seats
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => setShowUpgradePlans((v) => !v)}
                    className="bg-blue-600 hover:bg-blue-700 text-white uppercase tracking-wide text-xs font-bold"
                  >
                    Manage Plan
                  </Button>
                 
                </>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Past-due payment failure banner */}
      {isPastDue && (
        <Card className="border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950/30">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-red-800 dark:text-red-200">
                  Payment overdue — access suspended
                </p>
                <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                  We could not process your last payment. Please update your payment method or pay the outstanding invoice below to restore full access. Your data is safe.
                </p>
              </div>
              <Button
                onClick={handleManagePayment}
                disabled={loadingPortal}
                size="sm"
                className="flex-shrink-0 bg-red-600 hover:bg-red-700 text-white"
              >
                {loadingPortal ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4 mr-1" />}
                Pay Now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upgrade plans — shown for free/starter users when toggled */}
      {!isPaidPlan && showUpgradePlans && (
        <Card className="overflow-hidden">
          <CardContent className="pt-6 pb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {/* Starter (current) */}
              <Card className="border-2 opacity-70">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Starter</CardTitle>
                  <p className="text-xs text-gray-500">Best for getting started.</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Free
                  </p>
                  <ul className="space-y-1.5">
                    {STARTER_FEATURES.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <Check className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="w-full text-sm" disabled>
                    Current plan
                  </Button>
                </CardContent>
              </Card>

              {PAID_PLANS.map((plan) => {
                const isLoading = loadingPlan === plan.name;
                return (
                  <Card
                    key={plan.name}
                    className={`border-2 relative ${
                      plan.isPopular ? 'border-blue-500 dark:border-blue-400' : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    {plan.isPopular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="inline-flex items-center gap-1 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                          <Star className="w-3 h-3" />
                          Most Popular
                        </span>
                      </div>
                    )}
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{plan.displayName}</CardTitle>
                      <p className="text-xs text-gray-500">{plan.description}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {plan.isSales ? (
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">Get a Quote</p>
                      ) : (
                        <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                          ${plan.monthlyPrice}
                          <span className="text-sm font-normal text-gray-500 ml-1">/mo.</span>
                        </p>
                      )}
                      <ul className="space-y-1.5">
                        {plan.features.map((f) => (
                          <li key={f} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                            <Check className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                            {f}
                          </li>
                        ))}
                      </ul>
                      <Button
                        onClick={() => handleUpgrade(plan.name)}
                        disabled={isLoading}
                        className={`w-full text-sm ${plan.isPopular ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}`}
                        variant={plan.isPopular ? 'default' : 'outline'}
                      >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : plan.ctaLabel}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            <p className="text-center text-xs text-gray-400 mt-4">
              * 14-day free trial on Professional. No credit card required to start your trial.
            </p>
            <p className="text-center text-xs text-gray-400 mt-1">
              Extra branches +$5/mo · Extra users +$2/mo, beyond what's included in your plan.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Trial banner for paid users still in trial */}
      {isPaidPlan && isOnTrial && trialEndDate && (
        <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  {Math.max(
                    0,
                    Math.ceil((new Date(trialEndDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                  )}{' '}
                  days left in your free trial
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  Add a payment method before your trial ends to keep your access. You will only be
                  charged after the trial period.
                </p>
              </div>
              <Button
                onClick={handleManagePayment}
                disabled={loadingPortal}
                size="sm"
                className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loadingPortal ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add Payment Method'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isPaidPlan ? (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage your payment method in the Stripe portal.
              </p>
              <Button onClick={handleManagePayment} disabled={loadingPortal} variant="outline" className="gap-2">
                {loadingPortal ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {isOnTrial ? 'Add payment method' : 'Manage payment method'}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                A payment method is required to be billed for extra branches (+$5/mo) or extra users (+$2/mo) beyond your plan limits.
              </p>
              <Button onClick={() => setShowUpgradePlans((v) => !v)} variant="outline" className="gap-2">
                Add Payment Method
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Payment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {invoicesLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : invoices.length === 0 ? (
            <p className="text-sm text-amber-600 dark:text-amber-400">No payments yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-gray-500 dark:text-gray-400">
                    <th className="py-3 font-medium">Invoice</th>
                    <th className="py-3 font-medium">Period</th>
                    <th className="py-3 font-medium text-right">Amount</th>
                    <th className="py-3 font-medium text-center">Status</th>
                    <th className="py-3 font-medium text-center">Paid</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => (
                    <tr key={inv.id} className={`border-b last:border-0 ${inv.status === 'failed' ? 'bg-red-50 dark:bg-red-950/20' : ''}`}>
                      <td className="py-3 font-mono text-xs">{inv.invoice_number}</td>
                      <td className="py-3">{formatPeriod(inv.created_at)}</td>
                      <td className="py-3 text-right font-mono">
                        ${Number(inv.amount).toFixed(2)}
                      </td>
                      <td className="py-3 text-center">
                        <Badge
                          variant={inv.status === 'paid' ? 'default' : 'secondary'}
                          className={
                            inv.status === 'paid'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                              : inv.status === 'failed'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                              : inv.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                              : ''
                          }
                        >
                          {inv.status}
                        </Badge>
                      </td>
                      <td className="py-3 text-center text-gray-500">
                        {inv.paid_at ? formatDate(inv.paid_at) : inv.status === 'failed' ? (
                          <button
                            onClick={handleManagePayment}
                            className="text-xs text-red-600 hover:text-red-700 underline font-medium"
                          >
                            Pay now
                          </button>
                        ) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
