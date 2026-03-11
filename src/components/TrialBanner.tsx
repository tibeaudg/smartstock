import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSubscription } from '@/hooks/useSubscription';
import { Button } from '@/components/ui/button';
import { Clock, X } from 'lucide-react';

export const TrialBanner = () => {
  const { isOnTrial, trialEndDate } = useSubscription();
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (trialEndDate && typeof window !== 'undefined') {
      setIsDismissed(localStorage.getItem(`trial-banner-dismissed-${trialEndDate}`) === 'true');
    }
  }, [trialEndDate]);

  if (!isOnTrial || !trialEndDate || isDismissed) {
    return null;
  }

  const daysLeft = Math.max(
    0,
    Math.ceil((new Date(trialEndDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  );

  const handleDismiss = () => {
    setIsDismissed(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`trial-banner-dismissed-${trialEndDate}`, 'true');
    }
  };

  return (
    <div className="bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-400 dark:border-blue-600 p-4 mb-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="ml-3 flex-1">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                {daysLeft} day{daysLeft !== 1 ? 's' : ''} left in your free trial
              </h3>
              <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                Add a payment method before your trial ends to keep your Advance features.
              </p>
            </div>
            <button
              onClick={handleDismiss}
              className="ml-4 flex-shrink-0 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
              aria-label="Dismiss banner"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-4">
            <Button asChild size="sm" variant="outline" className="border-blue-300 text-blue-800 dark:text-blue-200 hover:bg-blue-100 dark:hover:bg-blue-900/50">
              <Link to="/dashboard/settings/billing">Add payment method</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
