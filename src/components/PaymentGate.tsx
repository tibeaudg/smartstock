import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertTriangle, CreditCard, Loader2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PaymentGateProps {
  children: React.ReactNode;
}

export const PaymentGate: React.FC<PaymentGateProps> = ({ children }) => {
  const { isPastDue, currentTier } = useSubscription();
  const [loadingPortal, setLoadingPortal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // These paths are always accessible even when payment is overdue
  const isAllowedPath =
    location.pathname.includes('/settings/billing') ||
    location.pathname.startsWith('/auth') ||
    location.pathname.startsWith('/admin');

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

  if (!isPastDue || isAllowedPath) {
    return <>{children}</>;
  }

  const planName = currentTier?.display_name ?? 'your plan';

  return (
    <>
      {/* Render children underneath so layout remains (sidebar visible) */}
      <div className="pointer-events-none select-none opacity-30 blur-sm">
        {children}
      </div>

      {/* Blocking overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-8 space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Payment Required
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Your <span className="font-semibold">{planName}</span> subscription has an outstanding payment. Please update your payment method or pay the overdue invoice to restore full access.
            </p>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 text-xs text-amber-800 dark:text-amber-300 text-center">
            Your data is safe. Access is restored immediately after payment.
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleOpenPortal}
              disabled={loadingPortal}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold"
            >
              {loadingPortal
                ? <Loader2 className="w-4 h-4 animate-spin mr-2" />
                : <CreditCard className="w-4 h-4 mr-2" />}
              Update Payment Method
            </Button>
            <Button
              onClick={() => navigate('/dashboard/settings/billing')}
              variant="outline"
              className="w-full"
            >
              <FileText className="w-4 h-4 mr-2" />
              View Invoices & Billing
            </Button>
          </div>

          <p className="text-center text-xs text-gray-400 dark:text-gray-600">
            Questions? Contact{' '}
            <a href="mailto:support@stockflowsystems.com" className="underline hover:text-gray-600">
              support@stockflowsystems.com
            </a>
          </p>
        </div>
      </div>
    </>
  );
};
