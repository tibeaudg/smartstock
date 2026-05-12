import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Loader2, Zap, Plus, CreditCard, AlertCircle } from 'lucide-react';
import { useSubscription, PricingTier } from '@/hooks/useSubscription';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Props {
  type: 'branch' | 'user';
  open: boolean;
  onClose: () => void;
  /** Called after the user successfully completed checkout (new tab) so caller can
   *  re-show the form when they return */
  onPaymentStarted?: () => void;
}

const EXTRA_PRICES = { branch: 5, user: 2 } as const;
const LABELS = { branch: 'branch', user: 'user license' };

export const UpgradeOrPayModal: React.FC<Props> = ({ type, open, onClose, onPaymentStarted }) => {
  const { currentTier, nextTier, branchCount, userCount, maxBranches, maxUsers } = useSubscription();
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const [loadingUpgrade, setLoadingUpgrade] = useState(false);
  const [loadingAddon, setLoadingAddon] = useState(false);

  const hasPaymentInfo = !!(userProfile as any)?.stripe_customer_id;
  const extraPrice = EXTRA_PRICES[type];
  const label = LABELS[type];
  const currentCount = type === 'branch' ? branchCount : userCount;
  const planLimit = type === 'branch' ? maxBranches : maxUsers;

  const startCheckout = async (planName: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (!token) { navigate('/auth'); return null; }
    const baseUrl = import.meta.env.VITE_SUPABASE_URL ?? '';
    const fnUrl = `${baseUrl.replace(/\/$/, '')}/functions/v1/create-checkout-session`;
    const res = await fetch(fnUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ planName }),
    });
    const data = await res.json();
    return data.url as string | undefined;
  };

  const startAddonCheckout = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (!token) { navigate('/auth'); return null; }
    const baseUrl = import.meta.env.VITE_SUPABASE_URL ?? '';
    const fnUrl = `${baseUrl.replace(/\/$/, '')}/functions/v1/create-addon-checkout-session`;
    const res = await fetch(fnUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ addonType: type === 'branch' ? 'extra_branch' : 'extra_user' }),
    });
    const data = await res.json();
    return data.url as string | undefined;
  };

  const handleUpgrade = async () => {
    if (!nextTier) return;
    if (!hasPaymentInfo) {
      // Checkout will collect payment info
    }
    setLoadingUpgrade(true);
    try {
      const url = await startCheckout(nextTier.name);
      if (url) {
        onPaymentStarted?.();
        onClose();
        window.location.href = url;
      } else {
        toast.error('Could not start checkout. Please try again.');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoadingUpgrade(false);
    }
  };

  const handlePayExtra = async () => {
    if (!hasPaymentInfo) {
      // No Stripe customer yet — send them to billing to set up payment first
      onClose();
      navigate('/dashboard/settings/billing');
      toast.info('Please add a payment method first, then you can add extra ' + label + 's.');
      return;
    }
    setLoadingAddon(true);
    try {
      const url = await startAddonCheckout();
      if (url) {
        onPaymentStarted?.();
        onClose();
        window.location.href = url;
      } else {
        toast.error('Could not start checkout. Please try again.');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoadingAddon(false);
    }
  };

  const tierFeatures = nextTier?.features ?? [];
  const tierBranches = nextTier?.max_branches ?? '—';
  const tierUsers = nextTier?.max_users ?? '—';

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Zap className="w-5 h-5 text-amber-500" />
            {type === 'branch' ? 'Branch limit reached' : 'User limit reached'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Usage summary */}
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg px-4 py-3 text-sm">
            <span className="font-medium text-amber-900 dark:text-amber-300">
              {currentCount} / {planLimit} {label}s used
            </span>
            <span className="text-amber-700 dark:text-amber-400">
              {' '}on your <strong>{currentTier?.display_name ?? 'current'}</strong> plan.
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Option A – Upgrade */}
            {nextTier && (
              <div className="rounded-xl border-2 border-blue-500 dark:border-blue-400 p-4 space-y-3 relative">
                <Badge className="absolute -top-3 left-3 bg-blue-500 text-white text-xs">Recommended</Badge>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    Upgrade to {nextTier.display_name}
                  </p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                    ${nextTier.price_monthly}
                    <span className="text-sm font-normal text-gray-500">/mo</span>
                  </p>
                </div>
                <ul className="space-y-1.5 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />
                    {tierBranches} branches included
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />
                    {tierUsers} user licenses
                  </li>
                  {tierFeatures.slice(0, 3).map((f) => (
                    <li key={f} className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                {!hasPaymentInfo && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-start gap-1">
                    <CreditCard className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    Payment details collected at checkout. 14-day free trial.
                  </p>
                )}
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handleUpgrade}
                  disabled={loadingUpgrade}
                >
                  {loadingUpgrade
                    ? <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    : <Zap className="w-4 h-4 mr-2" />}
                  Upgrade to {nextTier.display_name}
                </Button>
              </div>
            )}

            {/* Option B – Pay extra */}
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-3">
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  Add extra {label}
                </p>
                <p className="text-2xl font-bold text-gray-700 dark:text-gray-200 mt-0.5">
                  ${extraPrice}
                  <span className="text-sm font-normal text-gray-500">/mo per {label}</span>
                </p>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Keep your current plan and pay <strong>${extraPrice}/mo</strong> for each extra {label} beyond your plan's limit.
              </p>
              {!hasPaymentInfo && (
                <p className="text-xs text-amber-700 dark:text-amber-400 flex items-start gap-1 bg-amber-50 dark:bg-amber-950/30 rounded p-2">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  You'll be asked to add a payment method first.
                </p>
              )}
              <Button
                variant="outline"
                className="w-full"
                onClick={handlePayExtra}
                disabled={loadingAddon}
              >
                {loadingAddon
                  ? <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  : <Plus className="w-4 h-4 mr-2" />}
                Pay ${extraPrice}/mo per extra {label}
              </Button>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 dark:text-gray-600">
            Questions?{' '}
            <a href="mailto:support@stockflowsystems.com" className="underline hover:text-gray-600">
              Contact support
            </a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
