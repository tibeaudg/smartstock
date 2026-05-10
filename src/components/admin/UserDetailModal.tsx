import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Users, Download, ListChecks, AlertTriangle, CreditCard } from 'lucide-react';
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
  status: 'active' | 'trial' | 'past_due' | 'cancelled' | 'expired' | null;
  trialEndDate: string | null;
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
    .select('status, tier_id, trial_end_date, end_date, stripe_subscription_id')
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
    trial:     { label: 'Trial',     className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
    past_due:  { label: 'Past Due',  className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' },
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
  const [activeTab, setActiveTab] = useState('overview');
  const [resettingChecklist, setResettingChecklist] = useState(false);
  const [settingPlan, setSettingPlan] = useState(false);
  const [selectedTierId, setSelectedTierId] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'active' | 'trial'>('active');

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
      toast.success('Plan updated successfully');
      queryClient.invalidateQueries({ queryKey: ['adminUserSubscription', user.id] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update plan');
    } finally {
      setSettingPlan(false);
    }
  };

  useEffect(() => {
    if (isOpen) setActiveTab('overview');
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
            <TabsContent value="billing" className="mt-0">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Invoice History ({invoices.length})</h3>
                {invoices.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportData(invoices, `user_${user.id}_invoices`)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                )}
              </div>

              {/* Subscription summary */}
              {subscription && (
                <div className="mb-4 p-3 rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/40">
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="font-medium">{subscription.planDisplayName}</span>
                      <SubStatusBadge status={subscription.status} />
                    </div>
                    {subscription.stripeSubscriptionId && (
                      <span className="text-xs text-gray-400 font-mono truncate max-w-[160px]">
                        {subscription.stripeSubscriptionId}
                      </span>
                    )}
                  </div>
                  {subscription.status === 'trial' && subscription.trialEndDate && (
                    <p className="text-xs text-blue-600 mt-1">
                      Trial ends {format(new Date(subscription.trialEndDate), 'PP')}
                    </p>
                  )}
                  {subscription.status === 'past_due' && (
                    <p className="text-xs text-red-600 mt-1">
                      Payment failed — Stripe retry in progress
                    </p>
                  )}
                </div>
              )}

              {loadingInvoices ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : invoices.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No invoices found</div>
              ) : (
                <div className="space-y-2">
                  {invoices.map((inv) => (
                    <Card key={inv.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-sm">{inv.invoice_number}</h4>
                            <p className="text-sm text-gray-600">
                              {inv.amount.toLocaleString('en-US', { style: 'currency', currency: inv.currency.toUpperCase() })}
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
            </TabsContent>

            {/* Activity Log Tab */}
            <TabsContent value="activity" className="mt-0">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Activity Log ({auditLogs.length})</h3>
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
              {loadingAuditLogs ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : auditLogs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No activity logs found</div>
              ) : (
                <div className="space-y-2">
                  {auditLogs.map((log: any) => (
                    <Card key={log.id}>
                      <CardContent className="p-4">
                        <p className="text-sm font-medium">{log.action} on {log.table_name}</p>
                        <p className="text-sm text-gray-600">
                          {format(new Date(log.created_at), 'PPpp')}
                        </p>
                        {log.record_id && (
                          <p className="text-xs text-gray-400">Record ID: {log.record_id}</p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
