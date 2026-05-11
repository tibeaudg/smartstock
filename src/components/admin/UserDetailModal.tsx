import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Users, Download, ListChecks, AlertTriangle, CreditCard, Calendar, Pause, LogIn, Shield, DollarSign } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
  created_at: string;
  updated_at: string;
  selected_plan: string | null;
  blocked: boolean | null;
  last_login?: string | null;
  organization_name?: string | null;
  referral_source?: string | null;
}

interface UserDetailModalProps {
  user: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

interface SubscriptionInfo {
  planDisplayName: string;
  planName: string;
  status: 'active' | 'trial' | 'past_due' | 'cancelled' | 'expired' | 'paused' | null;
  trialEndDate: string | null;
  startDate: string | null;
  endDate: string | null;
  maxProducts: number | null;
  stripeSubscriptionId: string | null;
}

interface InvoiceRow {
  id: string;
  invoice_number: string;
  amount: number;
  currency: string;
  status: string;
  paid_at: string | null;
  due_date: string | null;
  created_at: string;
}

async function fetchUserSubscription(userId: string): Promise<SubscriptionInfo | null> {
  const { data: sub, error } = await supabase
    .from('user_subscriptions')
    .select('status, tier_id, trial_end_date, end_date, stripe_subscription_id, start_date')
    .eq('user_id', userId)
    .maybeSingle();

  if (error || !sub) return null;

  let planDisplayName = 'Starter';
  let planName = 'free';
  let maxProducts: number | null = 100;

  if (sub.tier_id) {
    const { data: tier } = await supabase
      .from('pricing_tiers')
      .select('name, display_name, max_products')
      .eq('id', sub.tier_id)
      .single();
    if (tier) {
      planName = tier.name ?? 'free';
      planDisplayName = tier.display_name ?? 'Starter';
      maxProducts = tier.max_products ?? null;
    }
  }

  const status = (sub.status ?? null) as SubscriptionInfo['status'];
  const isOnTrial = status === 'trial';

  return {
    planDisplayName: isOnTrial ? `${planDisplayName} (Trial)` : planDisplayName,
    planName,
    status,
    trialEndDate: sub.trial_end_date ?? null,
    startDate: sub.start_date ?? null,
    endDate: sub.end_date ?? null,
    maxProducts,
    stripeSubscriptionId: sub.stripe_subscription_id ?? null,
  };
}

async function fetchUserProducts(userId: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

async function fetchUserSalesOrders(userId: string) {
  const { data, error } = await supabase
    .from('sales_orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

async function fetchUserInvoices(userId: string): Promise<InvoiceRow[]> {
  const { data, error } = await supabase
    .from('invoices')
    .select('id, invoice_number, amount, currency, status, paid_at, due_date, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as InvoiceRow[];
}

async function fetchUserAuditLogs(userId: string) {
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(100);
  if (error) throw error;
  return data || [];
}

function SubStatusBadge({ status }: { status: SubscriptionInfo['status'] }) {
  if (!status) return null;
  const map: Record<string, { label: string; className: string }> = {
    active:    { label: 'Active',    className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
    trial:     { label: 'Trial',     className: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' },
    past_due:  { label: 'Past Due',  className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' },
    paused:    { label: 'Paused',    className: 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300' },
    cancelled: { label: 'Cancelled', className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' },
    expired:   { label: 'Expired',   className: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' },
  };
  const cfg = map[status] ?? { label: status, className: 'bg-gray-100 text-gray-600' };
  return <Badge className={`ml-2 text-xs ${cfg.className}`}>{cfg.label}</Badge>;
}

function InvoiceStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    paid:    'bg-green-100 text-green-800',
    failed:  'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800',
    open:    'bg-blue-100 text-blue-800',
  };
  return (
    <Badge className={`text-xs ${map[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

export const UserDetailModal: React.FC<UserDetailModalProps> = ({
  user,
  isOpen,
  onClose,
}) => {
  const queryClient = useQueryClient();
  const { user: adminUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [resettingChecklist, setResettingChecklist] = useState(false);
  const [settingPlan, setSettingPlan] = useState(false);
  const [selectedTierId, setSelectedTierId] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'active' | 'trial'>('active');
  const [loadingExtendTrial, setLoadingExtendTrial] = useState(false);
  const [loadingPause, setLoadingPause] = useState(false);
  const [loadingLoginAs, setLoadingLoginAs] = useState(false);
  const [creditAmount, setCreditAmount] = useState('');
  const [creditNote, setCreditNote] = useState('');
  const [loadingCredit, setLoadingCredit] = useState(false);
  const [showAdminOnly, setShowAdminOnly] = useState(false);

  const handleRetriggerChecklist = async () => {
    if (!user) return;
    setResettingChecklist(true);
    try {
      const { error } = await supabase.functions.invoke('reset-checklist', {
        body: { user_id: user.id },
      });
      if (error) throw error;
      toast.success('Checklist will be shown to user on their next dashboard visit');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to retrigger checklist');
    } finally {
      setResettingChecklist(false);
    }
  };

  const handleSetPlan = async () => {
    if (!user || !selectedTierId) return;
    setSettingPlan(true);
    try {
      const now = new Date().toISOString();
      const trialEndDate = selectedStatus === 'trial'
        ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
        : null;
      const endDate = selectedStatus === 'trial'
        ? trialEndDate
        : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
      const { error } = await supabase
        .from('user_subscriptions')
        .upsert(
          {
            user_id: user.id,
            tier_id: selectedTierId,
            status: selectedStatus,
            billing_cycle: 'monthly',
            start_date: now,
            end_date: endDate,
            trial_end_date: trialEndDate,
            stripe_subscription_id: null,
          },
          { onConflict: 'user_id' }
        );
      if (error) throw error;
      const tierLabel = pricingTiers.find(t => t.id === selectedTierId)?.display_name ?? selectedTierId;
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        action: `ADMIN: Plan set to "${tierLabel}" (${selectedStatus}) by ${adminUser?.email ?? 'admin'}`,
        table_name: 'user_subscriptions',
        record_id: user.id,
      });
      toast.success('Plan updated successfully');
      queryClient.invalidateQueries({ queryKey: ['adminUserSubscription', user.id] });
      queryClient.invalidateQueries({ queryKey: ['userSubscriptionPlans'] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update plan');
    } finally {
      setSettingPlan(false);
    }
  };

  const handleExtendTrial = async () => {
    if (!user) return;
    setLoadingExtendTrial(true);
    try {
      const { data: sub } = await supabase
        .from('user_subscriptions')
        .select('trial_end_date, end_date')
        .eq('user_id', user.id)
        .maybeSingle();
      const baseDate = sub?.trial_end_date ? new Date(sub.trial_end_date) : new Date();
      const newEnd = new Date(baseDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
      const { error } = await supabase
        .from('user_subscriptions')
        .update({ trial_end_date: newEnd, end_date: newEnd })
        .eq('user_id', user.id);
      if (error) throw error;
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        action: `ADMIN: Trial extended +7 days by ${adminUser?.email ?? 'admin'}`,
        table_name: 'user_subscriptions',
        record_id: user.id,
      });
      toast.success('Trial extended by 7 days');
      queryClient.invalidateQueries({ queryKey: ['adminUserSubscription', user.id] });
      queryClient.invalidateQueries({ queryKey: ['userSubscriptionPlans'] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to extend trial');
    } finally {
      setLoadingExtendTrial(false);
    }
  };

  const handlePauseSubscription = async () => {
    if (!user) return;
    setLoadingPause(true);
    try {
      const { error } = await supabase
        .from('user_subscriptions')
        .update({ status: 'paused' })
        .eq('user_id', user.id);
      if (error) throw error;
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        action: `ADMIN: Subscription paused by ${adminUser?.email ?? 'admin'}`,
        table_name: 'user_subscriptions',
        record_id: user.id,
      });
      toast.success('Subscription paused');
      queryClient.invalidateQueries({ queryKey: ['adminUserSubscription', user.id] });
      queryClient.invalidateQueries({ queryKey: ['userSubscriptionPlans'] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to pause subscription');
    } finally {
      setLoadingPause(false);
    }
  };

  const handleLoginAs = async () => {
    if (!user) return;
    setLoadingLoginAs(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-magic-link', {
        body: { user_id: user.id },
      });
      if (error) throw error;
      if (data?.link) {
        await navigator.clipboard.writeText(data.link);
        toast.success('Magic link copied — open in a private/incognito window');
      }
    } catch {
      toast.error('Impersonation requires the "generate-magic-link" edge function to be deployed');
    } finally {
      setLoadingLoginAs(false);
    }
  };

  const handleAddCredit = async () => {
    if (!user || !creditAmount) return;
    const amount = parseFloat(creditAmount);
    if (isNaN(amount) || amount <= 0) { toast.error('Enter a valid amount'); return; }
    setLoadingCredit(true);
    try {
      const invoiceNumber = `CREDIT-${Date.now()}`;
      const { error } = await supabase.from('invoices').insert({
        user_id: user.id,
        invoice_number: invoiceNumber,
        amount: -Math.abs(amount),
        currency: 'usd',
        status: 'credit',
        paid_at: new Date().toISOString(),
      });
      if (error) throw error;
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        action: `ADMIN: Credit of $${amount.toFixed(2)} applied by ${adminUser?.email ?? 'admin'}${creditNote ? ` — ${creditNote}` : ''}`,
        table_name: 'invoices',
        record_id: user.id,
      });
      toast.success(`Credit of $${amount.toFixed(2)} applied`);
      setCreditAmount('');
      setCreditNote('');
      queryClient.invalidateQueries({ queryKey: ['userInvoices', user.id] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to apply credit');
    } finally {
      setLoadingCredit(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setActiveTab('overview');
      setShowAdminOnly(false);
    }
  }, [isOpen]);

  const { data: subscription, isLoading: loadingSubscription } = useQuery({
    queryKey: ['adminUserSubscription', user?.id],
    queryFn: () => fetchUserSubscription(user!.id),
    enabled: !!user && isOpen,
  });

  const { data: pricingTiers = [] } = useQuery({
    queryKey: ['pricingTiers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pricing_tiers')
        .select('id, name, display_name')
        .order('price_monthly', { ascending: true });
      if (error) throw error;
      return (data || []) as { id: string; name: string; display_name: string }[];
    },
    enabled: isOpen,
  });

  const { data: products = [] } = useQuery({
    queryKey: ['userProducts', user?.id],
    queryFn: () => fetchUserProducts(user!.id),
    enabled: !!user && isOpen && (activeTab === 'products' || activeTab === 'overview'),
  });

  const { data: salesOrders = [] } = useQuery({
    queryKey: ['userSalesOrders', user?.id],
    queryFn: () => fetchUserSalesOrders(user!.id),
    enabled: !!user && isOpen && (activeTab === 'sales-orders' || activeTab === 'overview'),
  });

  const { data: invoices = [], isLoading: loadingInvoices } = useQuery({
    queryKey: ['userInvoices', user?.id],
    queryFn: () => fetchUserInvoices(user!.id),
    enabled: !!user && isOpen && activeTab === 'billing',
  });

  const { data: auditLogs = [], isLoading: loadingAuditLogs } = useQuery({
    queryKey: ['userAuditLogs', user?.id],
    queryFn: () => fetchUserAuditLogs(user!.id),
    enabled: !!user && isOpen && activeTab === 'activity',
  });

  const exportData = (data: any[], filename: string) => {
    try {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Data');
      XLSX.writeFile(wb, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
      toast.success(`Exported ${data.length} records`);
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  if (!user) return null;

  const isOverLimit =
    subscription?.maxProducts != null &&
    products.length > subscription.maxProducts &&
    subscription.planName === 'free';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            {user.email}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-3 gap-1 mb-4">
            <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
            <TabsTrigger value="billing" className="text-xs">
              Billing
              {invoices.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">{invoices.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="activity" className="text-xs">Activity</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto">

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4 mt-0">

              {/* Over-limit warning */}
              {isOverLimit && (
                <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30 p-3">
                  <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    This user has <strong>{products.length} products</strong> but their{' '}
                    <strong>Starter</strong> plan only allows{' '}
                    <strong>{subscription.maxProducts}</strong>. They need to upgrade before
                    they can add more products or use workflows.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Profile Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Email:</span>
                      <p className="text-sm">{user.email}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Name:</span>
                      <p className="text-sm">{user.first_name} {user.last_name}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Role:</span>
                      <Badge className="ml-2">{user.role}</Badge>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-600">Plan:</span>
                      {loadingSubscription ? (
                        <Loader2 className="w-3 h-3 animate-spin ml-2" />
                      ) : subscription ? (
                        <>
                          <span className="ml-2 text-sm">{subscription.planDisplayName}</span>
                          <SubStatusBadge status={subscription.status} />
                        </>
                      ) : (
                        <span className="ml-2 text-sm text-gray-400">Starter</span>
                      )}
                    </div>
                    {subscription?.status === 'trial' && subscription.trialEndDate && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">Trial ends:</span>
                        <span className="ml-2 text-sm text-blue-600">
                          {format(new Date(subscription.trialEndDate), 'PP')}
                        </span>
                      </div>
                    )}
                    {subscription?.status === 'past_due' && (
                      <div className="flex items-center gap-1 text-sm text-red-600">
                        <CreditCard className="w-3 h-3" />
                        Payment overdue — Stripe will retry automatically
                      </div>
                    )}
                    <div>
                      <span className="text-sm font-medium text-gray-600">Organization:</span>
                      <p className="text-sm">{user.organization_name || '—'}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Referral Source:</span>
                      <p className="text-sm">{user.referral_source || '—'}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Status:</span>
                      <Badge className={`ml-2 ${user.blocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {user.blocked ? 'Blocked' : 'Active'}
                      </Badge>
                    </div>
                    <div className="pt-3 border-t mt-3">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Set Plan (Admin Override)</p>
                      <div className="flex items-center gap-2">
                        <Select value={selectedTierId} onValueChange={setSelectedTierId}>
                          <SelectTrigger className="h-8 text-xs flex-1">
                            <SelectValue placeholder="Select plan..." />
                          </SelectTrigger>
                          <SelectContent>
                            {pricingTiers.map((tier) => (
                              <SelectItem key={tier.id} value={tier.id} className="text-xs">
                                {tier.display_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select value={selectedStatus} onValueChange={(v) => setSelectedStatus(v as 'active' | 'trial')}>
                          <SelectTrigger className="h-8 text-xs w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active" className="text-xs">Active</SelectItem>
                            <SelectItem value="trial" className="text-xs">Trial</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          size="sm"
                          onClick={handleSetPlan}
                          disabled={settingPlan || !selectedTierId}
                          className="h-8 text-xs px-3"
                        >
                          {settingPlan ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Apply'}
                        </Button>
                      </div>
                    </div>

                    <div className="pt-3 border-t mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRetriggerChecklist}
                        disabled={resettingChecklist}
                        className="text-gray-600"
                      >
                        {resettingChecklist ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <ListChecks className="h-4 w-4 mr-2" />
                        )}
                        Retrigger onboarding checklist
                      </Button>
                      <p className="text-xs text-gray-500 mt-1">
                        User will see the account setup steps again on next login
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Account Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Created:</span>
                      <p className="text-sm">{format(new Date(user.created_at), 'PPpp')}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Last Login:</span>
                      <p className="text-sm">
                        {user.last_login ? format(new Date(user.last_login), 'PPpp') : 'Never'}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Last Updated:</span>
                      <p className="text-sm">{format(new Date(user.updated_at), 'PPpp')}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${isOverLimit ? 'text-amber-600' : 'text-blue-600'}`}>
                        {products.length}
                      </div>
                      <div className="text-sm text-gray-600">
                        Products
                        {subscription?.maxProducts != null && (
                          <span className="text-xs text-gray-400 block">
                            / {subscription.maxProducts} limit
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{salesOrders.length}</div>
                      <div className="text-sm text-gray-600">Sales Orders</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Billing Tab */}
            <TabsContent value="billing" className="mt-0 space-y-4">

              {/* Subscription summary card */}
              {subscription && (
                <div className="rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/40 p-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <span className="font-semibold text-base">{subscription.planDisplayName}</span>
                      <SubStatusBadge status={subscription.status} />
                    </div>
                    {subscription.stripeSubscriptionId && (
                      <span className="text-xs text-gray-400 font-mono truncate max-w-[160px]" title={subscription.stripeSubscriptionId}>
                        {subscription.stripeSubscriptionId}
                      </span>
                    )}
                  </div>

                  {/* Trial progress bar */}
                  {subscription.status === 'trial' && subscription.trialEndDate && (() => {
                    const now = new Date();
                    const trialEnd = new Date(subscription.trialEndDate);
                    const trialStart = subscription.startDate
                      ? new Date(subscription.startDate)
                      : new Date(trialEnd.getTime() - 14 * 24 * 60 * 60 * 1000);
                    const totalDays = Math.max(1, Math.ceil((trialEnd.getTime() - trialStart.getTime()) / (1000 * 60 * 60 * 24)));
                    const daysElapsed = Math.max(0, Math.ceil((now.getTime() - trialStart.getTime()) / (1000 * 60 * 60 * 24)));
                    const daysLeft = Math.max(0, Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
                    const progress = Math.min(100, Math.round((daysElapsed / totalDays) * 100));
                    const isUrgent = daysLeft <= 2;
                    return (
                      <div className={`rounded-md p-3 border ${isUrgent ? 'bg-orange-50 border-orange-200' : 'bg-purple-50 border-purple-200'}`}>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className={`font-semibold ${isUrgent ? 'text-orange-700' : 'text-purple-700'}`}>Trial Progress</span>
                          <span className={isUrgent ? 'text-orange-600 font-bold' : 'text-purple-600'}>Day {daysElapsed} of {totalDays}</span>
                        </div>
                        <div className={`w-full h-2 rounded-full overflow-hidden ${isUrgent ? 'bg-orange-200' : 'bg-purple-200'}`}>
                          <div
                            className={`h-full rounded-full transition-all ${isUrgent ? 'bg-orange-500' : 'bg-purple-500'}`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <p className={`text-xs mt-1.5 ${isUrgent ? 'text-orange-700 font-semibold' : 'text-purple-600'}`}>
                          {daysLeft} day{daysLeft !== 1 ? 's' : ''} remaining · Ends {format(trialEnd, 'PP')}
                        </p>
                      </div>
                    );
                  })()}

                  {/* Next billing date */}
                  {subscription.status === 'active' && subscription.endDate && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>Next billing: <strong>{format(new Date(subscription.endDate), 'PP')}</strong></span>
                    </div>
                  )}

                  {subscription.status === 'past_due' && (
                    <div className="flex items-center gap-1.5 text-sm text-red-600 font-medium">
                      <CreditCard className="w-4 h-4" />
                      Payment failed — Stripe retry in progress
                    </div>
                  )}

                  {subscription.status === 'paused' && (
                    <p className="text-sm text-slate-600">Subscription is paused. User cannot access paid features.</p>
                  )}

                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-2 pt-1 border-t border-gray-200">
                    {subscription.status === 'trial' && (
                      <Button size="sm" variant="outline" onClick={handleExtendTrial} disabled={loadingExtendTrial}
                        className="border-purple-200 text-purple-700 hover:bg-purple-50 text-xs">
                        {loadingExtendTrial ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Calendar className="w-3 h-3 mr-1" />}
                        Extend Trial +7d
                      </Button>
                    )}
                    {(subscription.status === 'active' || subscription.status === 'trial') && (
                      <Button size="sm" variant="outline" onClick={handlePauseSubscription} disabled={loadingPause}
                        className="border-amber-200 text-amber-700 hover:bg-amber-50 text-xs">
                        {loadingPause ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Pause className="w-3 h-3 mr-1" />}
                        Pause Subscription
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={handleLoginAs} disabled={loadingLoginAs}
                      className="border-slate-200 text-slate-700 hover:bg-slate-50 text-xs">
                      {loadingLoginAs ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <LogIn className="w-3 h-3 mr-1" />}
                      Login As
                    </Button>
                  </div>
                </div>
              )}

              {/* Add Credit section */}
              <div className="rounded-lg border border-gray-200 p-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  Apply Manual Credit
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">$</span>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={creditAmount}
                    onChange={e => setCreditAmount(e.target.value)}
                    className="w-20 h-8 text-sm border border-gray-200 rounded px-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                  <input
                    type="text"
                    value={creditNote}
                    onChange={e => setCreditNote(e.target.value)}
                    className="flex-1 h-8 text-sm border border-gray-200 rounded px-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Reason (optional)"
                  />
                  <Button size="sm" onClick={handleAddCredit} disabled={loadingCredit || !creditAmount} className="h-8 text-xs">
                    {loadingCredit ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Apply'}
                  </Button>
                </div>
              </div>

              {/* Invoice History */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-semibold text-gray-700">Invoice History ({invoices.length})</h3>
                  {invoices.length > 0 && (
                    <Button variant="outline" size="sm" onClick={() => exportData(invoices, `user_${user.id}_invoices`)}>
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  )}
                </div>

                {loadingInvoices ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                  </div>
                ) : invoices.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No invoices found</div>
                ) : (
                  <div className="space-y-2">
                    {invoices.map((inv) => (
                      <Card key={inv.id} className={inv.status === 'credit' ? 'border-green-200 bg-green-50/30' : inv.status === 'failed' ? 'border-red-200 bg-red-50/30' : ''}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-sm">{inv.invoice_number}</h4>
                              <p className={`text-sm font-medium ${inv.amount < 0 ? 'text-green-600' : 'text-gray-600'}`}>
                                {inv.amount < 0 ? '−' : ''}{Math.abs(inv.amount).toLocaleString('en-US', { style: 'currency', currency: inv.currency.toUpperCase() })}
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5">
                                {inv.paid_at
                                  ? `Paid ${format(new Date(inv.paid_at), 'PP')}`
                                  : inv.due_date
                                    ? `Due ${format(new Date(inv.due_date), 'PP')}`
                                    : format(new Date(inv.created_at), 'PP')}
                              </p>
                            </div>
                            <InvoiceStatusBadge status={inv.status} />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Activity Log Tab */}
            <TabsContent value="activity" className="mt-0">
              <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
                <h3 className="text-lg font-semibold">
                  Activity Log ({auditLogs.length})
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowAdminOnly(v => !v)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs border transition-colors ${
                      showAdminOnly
                        ? 'bg-purple-50 border-purple-200 text-purple-700 font-semibold'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Shield className="w-3 h-3" />
                    Admin Only
                  </button>
                  {auditLogs.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportData(auditLogs, `user_${user.id}_activity`)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  )}
                </div>
              </div>
              {loadingAuditLogs ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : auditLogs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No activity logs found</div>
              ) : (
                <div className="space-y-2">
                  {auditLogs.filter((log: any) => !showAdminOnly || (typeof log.action === 'string' && log.action.startsWith('ADMIN:'))).map((log: any) => {
                    const isAdminAction = typeof log.action === 'string' && log.action.startsWith('ADMIN:');
                    return (
                      <Card key={log.id} className={isAdminAction ? 'border-purple-200 bg-purple-50/40' : ''}>
                        <CardContent className="p-3">
                          {isAdminAction && (
                            <div className="flex items-center gap-1 text-xs text-purple-600 font-semibold mb-1">
                              <Shield className="w-3 h-3" />
                              Admin Action
                            </div>
                          )}
                          <p className="text-sm font-medium">{isAdminAction ? log.action.replace('ADMIN: ', '') : `${log.action} on ${log.table_name}`}</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {format(new Date(log.created_at), 'PPpp')}
                          </p>
                          {!isAdminAction && log.record_id && (
                            <p className="text-xs text-gray-400">Record: {log.record_id}</p>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
