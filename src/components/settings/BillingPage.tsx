import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, CreditCard, FileText, ExternalLink, Crown, Check } from 'lucide-react';
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

const FREE_FEATURES = ['1 branch', '1 user', 'Core inventory features'];
const PRO_FEATURES = ['Contacts submenu', 'Orders submenus', 'Unlimited branches', 'Unlimited users'];

export const BillingPage = () => {
  const { user } = useAuth();
  const { currentTier, isPaidPlan, isOnTrial, trialEndDate, refetch } = useSubscription();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loadingPortal, setLoadingPortal] = useState(false);

  useEffect(() => {
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');
    if (success === 'true') {
      toast.success('Your free trial has started. Enjoy full access to Advance features.');
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

  const handleUpgrade = async () => {
    const paymentLink = import.meta.env.VITE_STRIPE_PAYMENT_LINK;
    if (!paymentLink) {
      toast.error('Payment link not configured. Please contact support.');
      return;
    }
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      window.location.href = '/auth';
      return;
    }
    const params = new URLSearchParams();
    if (session.user.email) params.set('prefilled_email', session.user.email);
    params.set('client_reference_id', session.user.id);
    const url = `${paymentLink}${paymentLink.includes('?') ? '&' : '?'}${params.toString()}`;
    window.location.href = url;
  };

  const handleManagePayment = async () => {
    setLoadingPortal(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) {
        window.location.href = '/auth';
        return;
      }
      const baseUrl = import.meta.env.VITE_SUPABASE_URL || '';
      const fnUrl = `${baseUrl.replace(/\/$/, '')}/functions/v1/create-portal-session`;
      const res = await fetch(fnUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
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
  const formatPeriod = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Billing</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage your subscription and view invoice history.
        </p>
      </div>

      <Tabs defaultValue="subscription">
        <TabsList className="mb-4">
          <TabsTrigger value="subscription" className="gap-2">
            <CreditCard className="w-4 h-4" />
            Subscription
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <FileText className="w-4 h-4" />
            Invoice History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="subscription">
          {isPaidPlan ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Current Plan</CardTitle>
                    <CardDescription>
                      {isOnTrial ? 'You are on a 14-day free trial of Advance.' : 'You are on the Advance plan.'}
                    </CardDescription>
                  </div>
                  <Badge variant="default" className="text-sm">
                    {currentTier?.display_name ?? 'Advance'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {isOnTrial && trialEndDate && (
                  <div className="rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30 p-4">
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      {Math.max(0, Math.ceil((new Date(trialEndDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} days left in your free trial
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                      Add a payment method before your trial ends to keep your access. No charge until the trial ends.
                    </p>
                  </div>
                )}
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Manage your payment method and subscription in the Stripe portal.
                </p>
                <Button
                  onClick={handleManagePayment}
                  disabled={loadingPortal}
                  variant="outline"
                  className="gap-2"
                >
                  {loadingPortal ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ExternalLink className="w-4 h-4" />
                  )}
                  {isOnTrial ? 'Add payment method & manage subscription' : 'Manage payment & invoices'}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="max-w-3xl mx-auto">
              {/* Upgrade modal-style card */}
              <Card className="overflow-hidden shadow-lg">
                <CardContent className="pt-8 pb-8">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
                      <Crown className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      Upgrade to premium
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md mx-auto">
                      You&apos;ve hit your limit. Please choose from one of our paid plans to continue.
                    </p>
                  </div>

                  {/* Two plan cards side by side */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Free / Demo plan */}
                    <Card className="border-2">
                      <CardHeader>
                        <CardTitle className="text-xl">Free</CardTitle>
                        <CardDescription>
                          Core inventory features for getting started. Perfect for trying out StockFlow.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <ul className="space-y-2">
                          {FREE_FEATURES.map((f) => (
                            <li key={f} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                              {f}
                            </li>
                          ))}
                        </ul>
                        <div className="pt-4">
                          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">Free</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Forever!</p>
                          <Button
                            variant="outline"
                            className="w-full mt-4 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                            disabled
                          >
                            Current plan
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Pro / Advance plan */}
                    <Card className="border-2 border-blue-200 dark:border-blue-800">
                      <CardHeader>
                        <CardTitle className="text-xl">Advance</CardTitle>
                        <CardDescription>
                          Contacts, Orders, unlimited branches and users. For growing teams.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <ul className="space-y-2">
                          {PRO_FEATURES.map((f) => (
                            <li key={f} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                              {f}
                            </li>
                          ))}
                        </ul>
                        <div className="pt-4">
                          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">14-day free trial</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            No credit card required • Then $9.99/mo
                          </p>
                          <Button
                            onClick={handleUpgrade}
                            className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                          >
                            Start free trial
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Invoice History</CardTitle>
              <CardDescription>Previously paid invoices.</CardDescription>
            </CardHeader>
            <CardContent>
              {invoicesLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                </div>
              ) : invoices.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="font-medium">No invoices yet</p>
                  <p className="text-sm mt-1">Invoices will appear here after you subscribe.</p>
                </div>
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
                        <tr key={inv.id} className="border-b last:border-0">
                          <td className="py-3 font-mono text-xs">{inv.invoice_number}</td>
                          <td className="py-3">{formatPeriod(inv.created_at)}</td>
                          <td className="py-3 text-right font-mono">
                            {inv.currency?.toUpperCase() === 'EUR' ? '€' : '$'}
                            {Number(inv.amount).toFixed(2)}
                          </td>
                          <td className="py-3 text-center">
                            <Badge
                              variant={inv.status === 'paid' ? 'default' : 'secondary'}
                              className={inv.status === 'paid' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : ''}
                            >
                              {inv.status}
                            </Badge>
                          </td>
                          <td className="py-3 text-center text-gray-500">
                            {inv.paid_at ? formatDate(inv.paid_at) : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
