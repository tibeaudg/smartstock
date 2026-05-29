import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSubscription } from '@/hooks/useSubscription';
import { Button } from '@/components/ui/button';
import { AlertTriangle, X } from 'lucide-react';

export const TrialExpiredBanner = () => {
  const { isTrialExpired, trialEndDate } = useSubscription();
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (trialEndDate && typeof window !== 'undefined') {
      setIsDismissed(
        sessionStorage.getItem(`trial-expired-banner-dismissed-${trialEndDate}`) === 'true',
      );
    }
  }, [trialEndDate]);

  if (!isTrialExpired || isDismissed) {
    return null;
  }

  const expiredOn = trialEndDate
    ? new Date(trialEndDate).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  const handleDismiss = () => {
    setIsDismissed(true);
    if (trialEndDate && typeof window !== 'undefined') {
      sessionStorage.setItem(`trial-expired-banner-dismissed-${trialEndDate}`, 'true');
    }
  };

  return (
    <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-500 dark:border-amber-600 p-4 mb-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
        </div>
        <div className="ml-3 flex-1">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-amber-900 dark:text-amber-200">
                Your free trial has ended
              </h3>
              <p className="mt-1 text-sm text-amber-800 dark:text-amber-300">
                {expiredOn
                  ? `Your trial ended on ${expiredOn}. You're now on the Starter plan. Upgrade to restore access to Orders, Contacts, and other Advance features.`
                  : `You're now on the Starter plan. Upgrade to restore access to Orders, Contacts, and other Advance features.`}
              </p>
            </div>
            <button
              onClick={handleDismiss}
              className="ml-4 flex-shrink-0 text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200"
              aria-label="Dismiss banner"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-4">
            <Button
              asChild
              size="sm"
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              <Link to="/dashboard/settings/billing">Upgrade plan</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
