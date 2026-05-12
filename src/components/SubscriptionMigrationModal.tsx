import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  Check,
  CreditCard,
  Loader2,
  Trash2,
  Zap,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * SubscriptionMigrationModal
 *
 * Purpose:
 * - Triggered when a free-tier user exceeds new branch limits.
 * - User can:
 *    1. Upgrade
 *    2. Pay for extra branches
 *    3. Skip -> automatically deletes ONLY the newly created overflow branches
 *
 * Important:
 * - The "skip" action removes ONLY the branches that caused the limit overflow.
 * - Assumes newest branches are the overflow branches.
 * - Requires branch records to have `created_at`.
 */

export const SubscriptionMigrationModal: React.FC = () => {
  const navigate = useNavigate();

  const {
    currentTier,
    nextTier,
    branchCount,
    maxBranches,
    isPaidPlan,
    isLoading,
  } = useSubscription();

  const { user, userProfile } = useAuth();

  const [loadingUpgrade, setLoadingUpgrade] = useState(false);
  const [loadingAddon, setLoadingAddon] = useState(false);
  const [loadingSkip, setLoadingSkip] = useState(false);

  const extraBranches = useMemo(
    () => Math.max(0, branchCount - maxBranches),
    [branchCount, maxBranches]
  );

  const monthlyCost = extraBranches * 5;

  const hasPaymentInfo = !!(userProfile as any)?.stripe_customer_id;

  const hasSeen = !!(
    userProfile as any
  )?.seen_subscription_migration_modal;

  /**
   * Show only for:
   * - authenticated users
   * - free plan
   * - over branch limit
   * - modal not seen yet
   */
  const shouldShow =
    !isLoading &&
    !!user &&
    !isPaidPlan &&
    branchCount > maxBranches &&
    !hasSeen;

  if (!shouldShow) return null;

  const markSeen = async () => {
    await supabase
      .from('profiles')
      .update({
        seen_subscription_migration_modal: true,
      })
      .eq('id', user!.id);
  };

  /**
   * Start plan checkout
   */
  const startCheckout = async (planName: string) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const token = session?.access_token;

    if (!token) {
      navigate('/auth');
      return null;
    }

    const baseUrl = import.meta.env.VITE_SUPABASE_URL ?? '';

    const fnUrl = `${baseUrl.replace(
      /\/$/,
      ''
    )}/functions/v1/create-checkout-session`;

    const response = await fetch(fnUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        planName,
      }),
    });

    const data = await response.json();

    return data.url as string | undefined;
  };

  /**
   * Start add-on checkout
   */
  const startAddonCheckout = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const token = session?.access_token;

    if (!token) {
      navigate('/auth');
      return null;
    }

    const baseUrl = import.meta.env.VITE_SUPABASE_URL ?? '';

    const fnUrl = `${baseUrl.replace(
      /\/$/,
      ''
    )}/functions/v1/create-addon-checkout-session`;

    const response = await fetch(fnUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        addonType: 'extra_branch',
        quantity: extraBranches,
      }),
    });

    const data = await response.json();

    return data.url as string | undefined;
  };

  /**
   * Upgrade flow
   */
  const handleUpgrade = async () => {
    if (!nextTier) return;

    setLoadingUpgrade(true);

    try {
      const url = await startCheckout(nextTier.name);

      if (!url) {
        toast.error('Unable to start checkout.');
        return;
      }

      await markSeen();

      window.location.href = url;
    } catch (error) {
      console.error(error);

      toast.error('Something went wrong.');
    } finally {
      setLoadingUpgrade(false);
    }
  };

  /**
   * Add-on flow
   */
  const handlePayExtra = async () => {
    try {
      setLoadingAddon(true);

      if (!hasPaymentInfo) {
        await markSeen();

        navigate('/dashboard/settings/billing');

        toast.info(
          'Please add a payment method to continue using extra branches.'
        );

        return;
      }

      const url = await startAddonCheckout();

      if (!url) {
        toast.error('Unable to start checkout.');
        return;
      }

      await markSeen();

      window.location.href = url;
    } catch (error) {
      console.error(error);

      toast.error('Something went wrong.');
    } finally {
      setLoadingAddon(false);
    }
  };

  /**
   * SKIP FLOW
   *
   * Deletes ONLY the newest overflow branches.
   *
   * Assumptions:
   * - Table = branches
   * - Has columns:
   *    branch_id
   *    owner_id
   *    created_at
   *
   * Strategy:
   * - Fetch newest branches
   * - Keep allowed amount
   * - Delete newest overflow branches
   */
  const handleSkip = async () => {
    if (!user) return;

    try {
      setLoadingSkip(true);

      /**
       * Fetch newest branches first
       */
      const { data: branches, error: fetchError } = await supabase
        .from('branches')
        .select('id, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      if (!branches || branches.length <= maxBranches) {
        await markSeen();
        return;
      }

      /**
       * Newest overflow branches
       */
      const overflowBranches = branches.slice(0, extraBranches);

      const branchIdsToDelete = overflowBranches
        .map((branch) => branch.id)
        .filter(Boolean);

      if (branchIdsToDelete.length === 0) {
        toast.error('No branches found to delete.');
        return;
      }

      const { error: deleteError } = await supabase
        .from('branches')
        .delete()
        .in('id', branchIdsToDelete);

      if (deleteError) {
        throw deleteError;
      }

      await markSeen();

      toast.success(
        `${branchIdsToDelete.length} ${
          branchIdsToDelete.length === 1
            ? 'branch was'
            : 'branches were'
        } removed.`
      );

      window.location.reload();

    } catch (error) {
      console.error(error);

      toast.error(
        'Failed to remove extra branches. Please try again.'
      );
    } finally {
      setLoadingSkip(false);
    }
  };
  const tierFeatures = nextTier?.features ?? [];

  return (
    <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-3xl rounded-2xl bg-white dark:bg-slate-900 shadow-2xl p-8 space-y-6">

        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Your plan limits have been exceeded
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Your free plan now includes a maximum of{' '}
              {maxBranches} branch
              {maxBranches !== 1 ? 'es' : ''}.
            </p>
          </div>
        </div>

        {/* Summary */}
        <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20 p-5 space-y-2">
          <p className="text-sm text-amber-900 dark:text-amber-300">
            You currently have{' '}
            <strong>{branchCount} branches</strong>.
          </p>

          <p className="text-sm text-amber-800 dark:text-amber-400">
            This means you have{' '}
            <strong>
              {extraBranches} extra{' '}
              {extraBranches === 1 ? 'branch' : 'branches'}
            </strong>{' '}
            above the limit.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Upgrade */}
          {nextTier && (
            <div className="relative rounded-2xl border-2 border-blue-500 p-6 space-y-5">

              <div className="absolute -top-3 left-4 bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                Recommended
              </div>

              <div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                  Upgrade to {nextTier.display_name}
                </h3>

                <div className="mt-2">
                  <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    ${nextTier.price_monthly}
                  </span>

                  <span className="text-sm text-gray-500">
                    /month
                  </span>
                </div>

                <p className="text-xs text-gray-500 mt-1">
                  Includes a 14-day free trial
                </p>
              </div>

              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  {nextTier.max_branches} branches included
                </li>

                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  {nextTier.max_users} user licenses
                </li>

                {tierFeatures.slice(0, 4).map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2"
                  >
                    <Check className="w-4 h-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>

              {!hasPaymentInfo && (
                <div className="text-xs text-gray-500 flex items-start gap-2">
                  <CreditCard className="w-4 h-4 mt-0.5 shrink-0" />
                  Payment details will be collected during checkout.
                </div>
              )}

              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleUpgrade}
                disabled={
                  loadingUpgrade ||
                  loadingAddon ||
                  loadingSkip
                }
              >
                {loadingUpgrade ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Zap className="w-4 h-4 mr-2" />
                )}

                Upgrade Plan
              </Button>
            </div>
          )}

          {/* Pay extra */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-5">

            <div>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                Keep existing branches
              </h3>

              <div className="mt-2">
                <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  ${monthlyCost}
                </span>

                <span className="text-sm text-gray-500">
                  /month
                </span>
              </div>

              <p className="text-xs text-gray-500 mt-1">
                ${5} × {extraBranches} extra{' '}
                {extraBranches === 1 ? 'branch' : 'branches'}
              </p>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              Stay on your current plan and keep all existing
              branches active.
            </p>

            <Button
              variant="outline"
              className="w-full"
              onClick={handlePayExtra}
              disabled={
                loadingUpgrade ||
                loadingAddon ||
                loadingSkip
              }
            >
              {loadingAddon ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <CreditCard className="w-4 h-4 mr-2" />
              )}

              Pay ${monthlyCost}/month
            </Button>
          </div>
        </div>

        {/* Skip section */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">

          <div className="rounded-xl bg-gray-50 dark:bg-slate-800/50 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100">
                Skip and remove extra branches
              </h4>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                The newest {extraBranches}{' '}
                {extraBranches === 1 ? 'branch will' : 'branches will'}{' '}
                automatically be deleted to bring your account back
                within the free plan limits.
              </p>
            </div>

            <Button
              variant="destructive"
              onClick={handleSkip}
              disabled={
                loadingUpgrade ||
                loadingAddon ||
                loadingSkip
              }
            >
              {loadingSkip ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}

              Skip & Remove Extra Branches
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};