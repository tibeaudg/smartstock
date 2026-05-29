import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  CreditCard,
  Loader2,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const PastDueNotice: React.FC = () => {
  const { isPastDue, currentTier } = useSubscription();
  const [loadingPortal, setLoadingPortal] = useState(false);
  const navigate = useNavigate();

  if (!isPastDue) return null;

  const planName = currentTier?.display_name ?? 'your plan';
  const planPrice = currentTier?.price_monthly;

  const handleOpenPortal = async () => {
    setLoadingPortal(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) { navigate('/auth'); return; }
      const baseUrl = import.meta.env.VITE_SUPABASE_URL ?? '';
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
    } catch {
      toast.error('Failed to open billing portal. Please try again.');
    } finally {
      setLoadingPortal(false);
    }
  };

  return (
    <div className="rounded-xl overflow-hidden border border-red-200 dark:border-red-800 bg-white dark:bg-slate-900 shadow-sm">
      <div className="bg-red-50 dark:bg-red-950/40 border-b border-red-100 dark:border-red-900/50 px-6 py-5">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-11 h-11 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div className="min-w-0 pt-0.5">
            <Badge
              variant="secondary"
              className="mb-2 text-xs bg-white/80 dark:bg-slate-800 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800"
            >
              {planName}
              {planPrice != null && planPrice > 0 ? ` · $${planPrice}/mo` : ''}
            </Badge>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 leading-snug">
              Payment overdue — access paused
            </h2>
            <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              We couldn&apos;t process your last payment. Update your payment method or pay the
              outstanding invoice below to restore full access to StockFlow.
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 py-5 space-y-5">
        <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-4 space-y-2.5">
          <div className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <span>Your inventory, orders, and account data are safe.</span>
          </div>
          <div className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
            <ArrowRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <span>Access is restored immediately once payment succeeds.</span>
          </div>
        </div>

        <Button
          onClick={handleOpenPortal}
          disabled={loadingPortal}
          className="w-full h-11 bg-red-600 hover:bg-red-700 text-white font-medium"
        >
          {loadingPortal ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <CreditCard className="w-4 h-4 mr-2" />
          )}
          Pay outstanding invoice
        </Button>

        <p className="text-center text-xs text-slate-400 dark:text-slate-500">
          Need help?{' '}
          <a
            href="mailto:support@stockflowsystems.com"
            className="text-slate-600 dark:text-slate-400 underline underline-offset-2 hover:text-slate-800 dark:hover:text-slate-300"
          >
            support@stockflowsystems.com
          </a>
        </p>
      </div>
    </div>
  );
};
