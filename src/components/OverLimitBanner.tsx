import React, { useState, useEffect } from 'react';
import { AlertTriangle, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

// Shows once per login session for free-tier users who are over their product limit.
// Dismissed state is stored in sessionStorage so it reappears on the next login.
export const OverLimitBanner: React.FC = () => {
  const { userProfile } = useAuth();
  const { isOverProductLimit, productCount, maxProducts, isLoading } = useSubscription();
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(false);

  const storageKey = userProfile ? `over-limit-dismissed-${userProfile.id}` : null;

  // Check if already dismissed in this session
  useEffect(() => {
    if (!storageKey) return;
    if (sessionStorage.getItem(storageKey) === 'true') {
      setDismissed(true);
    }
  }, [storageKey]);

  const handleDismiss = () => {
    if (storageKey) sessionStorage.setItem(storageKey, 'true');
    setDismissed(true);
  };

  // Only show if: not loading, user has more products than their free-plan limit,
  // and they haven't dismissed it in this session.
  if (isLoading || !isOverProductLimit || dismissed) return null;

  return (
    <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30 p-4 mb-6">
      <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
          You've exceeded your Starter plan limit
        </p>
        <p className="text-sm text-amber-800 dark:text-amber-300 mt-0.5">
          Your account has <strong>{productCount} products</strong>, but the free plan only
          includes <strong>{maxProducts}</strong>. You can still view and manage your existing
          products, but you won't be able to add new products or use workflows until you
          upgrade.
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Button
          size="sm"
          onClick={() => navigate('/dashboard/settings/billing')}
          className="bg-amber-600 hover:bg-amber-700 text-white text-xs"
        >
          Upgrade plan
          <ArrowRight className="w-3 h-3 ml-1" />
        </Button>
        <button
          onClick={handleDismiss}
          className="text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-200 p-1"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
