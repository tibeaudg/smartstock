import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Users, Download, ListChecks, AlertTriangle, CreditCard, Calendar, Pause, LogIn, Shield, DollarSign, Navigation, Database, Trash2, Mail, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { format, formatDistanceToNow } from 'date-fns';
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
  onBlock?: (userId: string, blocked: boolean) => void;
  onDelete?: (userId: string) => void;
  currentUserId?: string;
  isBlockingPending?: boolean;
  deletingUserId?: string | null;
}

interface LinkedUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  blocked: boolean;
  lastLogin: string | null;
}

async function fetchLinkedUsers(headUserId: string): Promise<LinkedUser[]> {
  const { data: branches } = await supabase
    .from('branches')
    .select('id')
    .eq('user_id', headUserId);

  if (!branches || branches.length === 0) return [];

  const branchIds = (branches as { id: string }[]).map(b => b.id);

  const { data: branchUsers } = await supabase
    .from('branch_users')
    .select('user_id, role, profiles:profiles!branch_users_user_id_fkey(email, first_name, last_name, blocked, last_login)')
    .in('branch_id', branchIds)
    .neq('user_id', headUserId);

  if (!branchUsers) return [];

  const seen = new Set<string>();
  return (branchUsers as any[])
    .filter(bu => {
      if (seen.has(bu.user_id)) return false;
      seen.add(bu.user_id);
      return true;
    })
    .map(bu => ({
      id: bu.user_id,
      email: bu.profiles?.email || 'Unknown',
      firstName: bu.profiles?.first_name || '',
      lastName: bu.profiles?.last_name || '',
      role: bu.role,
      blocked: bu.profiles?.blocked || false,
      lastLogin: bu.profiles?.last_login || null,
    }));
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

interface AppEvent {
  id: string;
  user_id: string;
  event_type: string;
  page: string;
  label: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

async function fetchUserAppEvents(userId: string): Promise<AppEvent[]> {
  const { data, error } = await (supabase as any)
    .from('app_events')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(200);
  if (error) throw error;
  return (data || []) as AppEvent[];
}

interface EmailLogEntry {
  id: string;
  subject: string;
  email_type: string;
  status: string;
  sent_at: string;
  error_message: string | null;
  metadata: Record<string, any> | null;
}

interface LifecycleEmailEntry {
  id: string;
  lifecycle_stage: string;
  status: string;
  sent_at: string;
  error_message: string | null;
}

const LIFECYCLE_STAGES: { key: string; label: string; description: string; days: number; isWarning?: boolean }[] = [
  { key: '24h_nudge',        label: '24h Nudge',     description: 'Get started nudge after 24h of inactivity', days: 0 },
  { key: '7d_inactive',      label: '7-Day',          description: 'Re-engagement after 7 days inactive',       days: 7 },
  { key: '14d_inactive',     label: '14-Day',         description: 'Soft follow-up after 14 days inactive',     days: 14 },
  { key: '25d_warning',      label: '5-Day Warning',  description: 'Account deletion warning (25 days)',        days: 25, isWarning: true },
  { key: '29d_final_warning',label: 'Final Warning',  description: 'Last notice before deletion (29 days)',     days: 29, isWarning: true },
];

function getLifecycleEligibleDate(stage: string, createdAt: string, lastLogin: string | null | undefined): Date | null {
  const created = new Date(createdAt);
  const lastLoginDate = lastLogin ? new Date(lastLogin) : null;
  const refDate = lastLoginDate || created;

  switch (stage) {
    case '24h_nudge':       return new Date(created.getTime() + 24 * 60 * 60 * 1000);
    case '7d_inactive':     return new Date(refDate.getTime() + 7  * 24 * 60 * 60 * 1000);
    case '14d_inactive':    return new Date(refDate.getTime() + 14 * 24 * 60 * 60 * 1000);
    case '25d_warning':     return new Date(refDate.getTime() + 25 * 24 * 60 * 60 * 1000);
    case '29d_final_warning': return new Date(refDate.getTime() + 29 * 24 * 60 * 60 * 1000);
    default: return null;
  }
}

async function fetchUserEmailLogs(userId: string): Promise<EmailLogEntry[]> {
  const { data, error } = await supabase
    .from('email_logs')
    .select('id, subject, email_type, status, sent_at, error_message, metadata')
    .eq('recipient_user_id', userId)
    .order('sent_at', { ascending: false })
    .limit(100);
  if (error) throw error;
  return (data || []) as EmailLogEntry[];
}

async function fetchUserLifecycleEmails(userId: string): Promise<LifecycleEmailEntry[]> {
  const { data, error } = await (supabase as any)
    .from('user_lifecycle_emails')
    .select('id, lifecycle_stage, status, sent_at, error_message')
    .eq('user_id', userId)
    .order('sent_at', { ascending: false });
  if (error) throw error;
  return (data || []) as LifecycleEmailEntry[];
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
  onBlock,
  onDelete,
  currentUserId,
  isBlockingPending,
  deletingUserId,
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

  const { data: appEvents = [], isLoading: loadingAppEvents } = useQuery({
    queryKey: ['userAppEvents', user?.id],
    queryFn: () => fetchUserAppEvents(user!.id),
    enabled: !!user && isOpen && activeTab === 'activity',
  });

  const { data: linkedUsers = [], isLoading: loadingLinkedUsers } = useQuery({
    queryKey: ['linkedUsers', user?.id],
    queryFn: () => fetchLinkedUsers(user!.id),
    enabled: !!user && isOpen,
  });

  const { data: userEmailLogs = [], isLoading: loadingEmailLogs } = useQuery({
    queryKey: ['userEmailLogs', user?.id],
    queryFn: () => fetchUserEmailLogs(user!.id),
    enabled: !!user && isOpen && activeTab === 'emails',
  });

  const { data: lifecycleEmails = [], isLoading: loadingLifecycleEmails } = useQuery({
    queryKey: ['userLifecycleEmails', user?.id],
    queryFn: () => fetchUserLifecycleEmails(user!.id),
    enabled: !!user && isOpen && activeTab === 'emails',
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
          <TabsList className="grid w-full grid-cols-4 gap-1 mb-4">
            <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
            <TabsTrigger value="billing" className="text-xs">
              Billing
              {invoices.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">{invoices.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="activity" className="text-xs">Activity</TabsTrigger>
            <TabsTrigger value="emails" className="text-xs">
              Emails
              {userEmailLogs.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">{userEmailLogs.length}</Badge>
              )}
            </TabsTrigger>
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

              <div className="flex gap-4">
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

                    {/* Block / Delete actions */}
                    {(onBlock || onDelete) && (
                      <div className="pt-3 border-t mt-3">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Actions</p>
                        <div className="flex gap-2 flex-wrap">
                          {onBlock && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onBlock(user.id, !!user.blocked)}
                              disabled={isBlockingPending}
                              className={user.blocked ? 'border-green-200 text-green-700 hover:bg-green-50' : 'border-amber-200 text-amber-700 hover:bg-amber-50'}
                            >
                              {isBlockingPending ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}
                              {user.blocked ? 'Unblock User' : 'Block User'}
                            </Button>
                          )}
                          {onDelete && user.id !== currentUserId && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  disabled={deletingUserId === user.id}
                                  className="border-red-200 text-red-700 hover:bg-red-50"
                                >
                                  {deletingUserId === user.id ? (
                                    <><Loader2 className="w-3 h-3 animate-spin mr-1" />Deleting...</>
                                  ) : (
                                    <><Trash2 className="w-3 h-3 mr-1" />Delete User</>
                                  )}
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete User</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete {user.email}? This action cannot be undone and will permanently delete the user profile and all associated data from the database.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-red-600 hover:bg-red-700"
                                    onClick={() => onDelete(user.id)}
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      </div>
                    )}

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
                    <div className="text-center">
                      <div className="text-2xl font-bold text-violet-600">{linkedUsers.length}</div>
                      <div className="text-sm text-gray-600">Linked Users</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Linked Users */}
              {(loadingLinkedUsers || linkedUsers.length > 0) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Linked Users ({linkedUsers.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loadingLinkedUsers ? (
                      <div className="flex justify-center py-4">
                        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {linkedUsers.map(lu => (
                          <div key={lu.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50">
                            <div>
                              <p className="text-sm font-medium text-gray-800">{lu.email}</p>
                              {(lu.firstName || lu.lastName) && (
                                <p className="text-xs text-gray-500">{lu.firstName} {lu.lastName}</p>
                              )}
                              <p className="text-xs text-gray-400 mt-0.5">
                                Role: <span className="capitalize">{lu.role}</span>
                                {lu.lastLogin && (
                                  <span className="ml-2">· Last login: {formatDistanceToNow(new Date(lu.lastLogin), { addSuffix: true })}</span>
                                )}
                                {!lu.lastLogin && <span className="ml-2">· Never logged in</span>}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {lu.blocked && (
                                <Badge className="text-xs bg-red-100 text-red-700">Blocked</Badge>
                              )}
                              <Badge className="text-xs bg-slate-200 text-slate-600 capitalize">{lu.role}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
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
              {(() => {
                const loadingActivity = loadingAuditLogs || loadingAppEvents;

                // Merge and sort all events newest-first
                type TimelineEntry =
                  | { kind: 'page_view'; id: string; label: string; page: string; created_at: string }
                  | { kind: 'admin'; id: string; action: string; created_at: string }
                  | { kind: 'mutation'; id: string; action: string; table_name: string; record_id: string | null; created_at: string };

                const pageEntries: TimelineEntry[] = appEvents.map((e) => ({
                  kind: 'page_view',
                  id: e.id,
                  label: e.label ?? e.page,
                  page: e.page,
                  created_at: e.created_at,
                }));

                const auditEntries: TimelineEntry[] = auditLogs.map((log: any) => {
                  const isAdmin = typeof log.action === 'string' && log.action.startsWith('ADMIN:');
                  return isAdmin
                    ? { kind: 'admin', id: log.id, action: log.action.replace('ADMIN: ', ''), created_at: log.created_at }
                    : { kind: 'mutation', id: log.id, action: log.action, table_name: log.table_name, record_id: log.record_id ?? null, created_at: log.created_at };
                });

                const allEntries = [...pageEntries, ...auditEntries].sort(
                  (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                );

                const visible = showAdminOnly
                  ? allEntries.filter((e) => e.kind === 'admin')
                  : allEntries;

                const exportAll = () => exportData(
                  visible.map((e) => ({
                    type: e.kind,
                    label: e.kind === 'page_view' ? e.label : e.kind === 'admin' ? e.action : `${e.action} on ${e.table_name}`,
                    date: e.created_at,
                  })),
                  `user_${user.id}_activity`
                );

                return (
                  <>
                    <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
                      <div>
                        <h3 className="text-lg font-semibold">Activity Log</h3>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {pageEntries.length} page view{pageEntries.length !== 1 ? 's' : ''} · {auditEntries.length} data event{auditEntries.length !== 1 ? 's' : ''}
                        </p>
                      </div>
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
                        {visible.length > 0 && (
                          <Button variant="outline" size="sm" onClick={exportAll}>
                            <Download className="w-4 h-4 mr-2" />
                            Export
                          </Button>
                        )}
                      </div>
                    </div>

                    {loadingActivity ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                      </div>
                    ) : visible.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">No activity logs found</div>
                    ) : (
                      <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700" />
                        <div className="space-y-1 pl-10">
                          {visible.map((entry) => {
                            if (entry.kind === 'page_view') {
                              return (
                                <div key={entry.id} className="relative py-2">
                                  <div className="absolute -left-[26px] top-3 w-4 h-4 rounded-full bg-blue-100 border-2 border-blue-400 flex items-center justify-center">
                                    <Navigation className="w-2 h-2 text-blue-600" />
                                  </div>
                                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{entry.label}</p>
                                  <p className="text-xs text-gray-400 font-mono">{entry.page}</p>
                                  <p className="text-xs text-gray-400">{format(new Date(entry.created_at), 'PPpp')}</p>
                                </div>
                              );
                            }
                            if (entry.kind === 'admin') {
                              return (
                                <div key={entry.id} className="relative py-2">
                                  <div className="absolute -left-[26px] top-3 w-4 h-4 rounded-full bg-purple-100 border-2 border-purple-400 flex items-center justify-center">
                                    <Shield className="w-2 h-2 text-purple-600" />
                                  </div>
                                  <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-0.5">Admin Action</p>
                                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{entry.action}</p>
                                  <p className="text-xs text-gray-400">{format(new Date(entry.created_at), 'PPpp')}</p>
                                </div>
                              );
                            }
                            // mutation
                            return (
                              <div key={entry.id} className="relative py-2">
                                <div className="absolute -left-[26px] top-3 w-4 h-4 rounded-full bg-green-100 border-2 border-green-400 flex items-center justify-center">
                                  <Database className="w-2 h-2 text-green-600" />
                                </div>
                                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                  {entry.action} on <span className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-1 rounded">{entry.table_name}</span>
                                </p>
                                <p className="text-xs text-gray-400">{format(new Date(entry.created_at), 'PPpp')}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}
            </TabsContent>
            {/* Emails Tab */}
            <TabsContent value="emails" className="mt-0 space-y-4">
              {(loadingEmailLogs || loadingLifecycleEmails) ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : (
                <>
                  {/* Lifecycle Pipeline */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        Lifecycle Pipeline
                      </CardTitle>
                      <p className="text-xs text-gray-500">Retention emails based on user inactivity</p>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {LIFECYCLE_STAGES.map(stage => {
                        const sent = lifecycleEmails.find(e => e.lifecycle_stage === stage.key);
                        const eligibleDate = getLifecycleEligibleDate(stage.key, user.created_at, user.last_login);
                        const now = new Date();
                        const isEligible = !sent && eligibleDate && eligibleDate <= now;
                        const isFuture = !sent && eligibleDate && eligibleDate > now;
                        const daysUntil = eligibleDate ? Math.ceil((eligibleDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null;

                        return (
                          <div
                            key={stage.key}
                            className={`flex items-center justify-between px-3 py-2.5 rounded-lg border ${
                              sent
                                ? 'bg-green-50 border-green-200'
                                : isEligible
                                  ? stage.isWarning
                                    ? 'bg-red-50 border-red-200'
                                    : 'bg-orange-50 border-orange-200'
                                  : 'bg-gray-50 border-gray-200'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              {sent ? (
                                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                              ) : isEligible ? (
                                <AlertCircle className={`w-4 h-4 shrink-0 ${stage.isWarning ? 'text-red-500' : 'text-orange-500'}`} />
                              ) : (
                                <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                              )}
                              <div>
                                <p className="text-sm font-medium text-gray-800">{stage.label}</p>
                                <p className="text-xs text-gray-500">{stage.description}</p>
                              </div>
                            </div>

                            <div className="text-right shrink-0 ml-3">
                              {sent ? (
                                <>
                                  <Badge className="bg-green-100 text-green-700 text-xs">Sent</Badge>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {format(new Date(sent.sent_at), 'dd MMM yyyy')}
                                  </p>
                                  {sent.status === 'failed' && (
                                    <p className="text-xs text-red-500 mt-0.5">Failed</p>
                                  )}
                                </>
                              ) : isEligible ? (
                                <>
                                  <Badge className={`text-xs ${stage.isWarning ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                                    Eligible
                                  </Badge>
                                  <p className="text-xs text-gray-400 mt-1">Pending trigger</p>
                                </>
                              ) : eligibleDate ? (
                                <>
                                  <Badge className="bg-gray-100 text-gray-600 text-xs">Scheduled</Badge>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {daysUntil === 1 ? 'Tomorrow' : daysUntil === 0 ? 'Today' : `In ${daysUntil}d`}
                                    {' · '}{format(eligibleDate, 'dd MMM')}
                                  </p>
                                </>
                              ) : null}
                            </div>
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>

                  {/* Email History */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                        <Mail className="w-4 h-4" />
                        Email History ({userEmailLogs.length})
                      </h3>
                      {userEmailLogs.length > 0 && (
                        <Button variant="outline" size="sm" onClick={() =>
                          exportData(userEmailLogs.map(e => ({
                            subject: e.subject,
                            type: e.email_type,
                            status: e.status,
                            sent_at: e.sent_at,
                            error: e.error_message || '',
                          })), `user_${user.id}_emails`)
                        }>
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </Button>
                      )}
                    </div>

                    {userEmailLogs.length === 0 ? (
                      <div className="text-center py-8 text-gray-400">
                        <Mail className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">No emails sent to this user yet</p>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        {userEmailLogs.map(log => {
                          const statusColors: Record<string, string> = {
                            delivered: 'bg-green-100 text-green-700',
                            sent:      'bg-blue-100 text-blue-700',
                            failed:    'bg-red-100 text-red-700',
                            bounced:   'bg-orange-100 text-orange-700',
                          };
                          const typeColors: Record<string, string> = {
                            welcome:          'bg-purple-100 text-purple-700',
                            lifecycle:        'bg-indigo-100 text-indigo-700',
                            deletion_warning: 'bg-red-100 text-red-700',
                            newsletter:       'bg-blue-100 text-blue-700',
                            followup:         'bg-yellow-100 text-yellow-700',
                            support:          'bg-green-100 text-green-700',
                            custom:           'bg-gray-100 text-gray-700',
                          };
                          const lifecycleStage = log.metadata?.lifecycle_stage as string | undefined;

                          return (
                            <div key={log.id} className="flex items-start justify-between p-3 rounded-lg border border-gray-100 bg-white hover:bg-gray-50 transition-colors">
                              <div className="flex-1 min-w-0 pr-3">
                                <p className="text-sm font-medium text-gray-800 truncate">{log.subject}</p>
                                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                  <Badge className={`text-xs px-1.5 py-0 ${typeColors[log.email_type] || 'bg-gray-100 text-gray-700'}`}>
                                    {log.email_type.replace('_', ' ')}
                                  </Badge>
                                  {lifecycleStage && (
                                    <span className="text-xs text-gray-400">
                                      {LIFECYCLE_STAGES.find(s => s.key === lifecycleStage)?.label || lifecycleStage}
                                    </span>
                                  )}
                                  {log.status === 'failed' && log.error_message && (
                                    <span className="text-xs text-red-500 truncate max-w-[200px]">{log.error_message}</span>
                                  )}
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <Badge className={`text-xs ${statusColors[log.status] || 'bg-gray-100 text-gray-700'}`}>
                                  {log.status}
                                </Badge>
                                <p className="text-xs text-gray-400 mt-1 whitespace-nowrap">
                                  {formatDistanceToNow(new Date(log.sent_at), { addSuffix: true })}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
