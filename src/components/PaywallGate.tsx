import React from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';

export interface PaywallGateProps {
  feature: 'add_branch' | 'add_user' | 'billing' | 'branches_management' | 'contacts' | 'orders';
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onUpgrade?: () => void;
}

export const PaywallGate: React.FC<PaywallGateProps> = ({
  feature,
  children,
  fallback,
  onUpgrade,
}) => {
  const { canUseFeature, isLoading } = useSubscription();

  if (isLoading) {
    return null;
  }

  if (canUseFeature(feature)) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  const handleUpgrade = async () => {
    if (onUpgrade) {
      onUpgrade();
      return;
    }
    const paymentLink = import.meta.env.VITE_STRIPE_PAYMENT_LINK;
    if (!paymentLink) {
      window.location.href = '/dashboard/settings/billing';
      return;
    }
    const { data: { session } } = await import('@/integrations/supabase/client').then(
      (m) => m.supabase.auth.getSession()
    );
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

  const messages: Record<string, string> = {
    add_branch: 'Start your 14-day free trial to add more branches.',
    add_user: 'Start your 14-day free trial to invite more users.',
    billing: 'Start your 14-day free trial to manage your subscription.',
    branches_management: 'Start your 14-day free trial to manage multiple branches.',
    contacts: 'Start your 14-day free trial to use Contacts.',
    orders: 'Start your 14-day free trial to use Orders.',
  };

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30 p-6 text-center">
      <Lock className="w-10 h-10 mx-auto mb-3 text-amber-600 dark:text-amber-500" />
      <p className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-2">
        {messages[feature]}
      </p>
      <p className="text-xs text-amber-700 dark:text-amber-300 mb-4">
        No credit card required.
      </p>
      <Button onClick={handleUpgrade} size="sm">
        Start free trial
      </Button>
    </div>
  );
};
