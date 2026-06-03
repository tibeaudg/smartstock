import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { X, Plus, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useActivationState } from '@/hooks/useActivationState';
import { useAppEventTracker } from '@/hooks/useAppEventTracker';

const DISMISS_KEY = 'stockflow_activation_banner_dismissed';

const HIDDEN_PATH_PREFIXES = [
  '/dashboard/products/new',
  '/dashboard/products/import',
  '/dashboard/scan',
];

function shouldHideBanner(pathname: string): boolean {
  return HIDDEN_PATH_PREFIXES.some((p) => pathname.startsWith(p));
}

export function ActivationBanner() {
  const { isActivated, isLoading } = useActivationState();
  const location = useLocation();
  const navigate = useNavigate();
  const { track } = useAppEventTracker();
  const [dismissed, setDismissed] = useState(
    () => sessionStorage.getItem(DISMISS_KEY) === '1'
  );

  if (isLoading || isActivated || dismissed) return null;
  if (!location.pathname.startsWith('/dashboard')) return null;
  if (shouldHideBanner(location.pathname)) return null;

  const dismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, '1');
    setDismissed(true);
    track('activation_banner_dismissed', undefined, { page: location.pathname });
  };

  return (
    <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/40 px-4 py-3">
      <p className="text-sm text-blue-900 dark:text-blue-100 flex-1">
        <span className="font-medium">Finish setup:</span> add your first product to unlock your
        dashboard.
      </p>
      <div className="flex items-center gap-2 shrink-0">
        <Button
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 h-8"
          onClick={() => {
            track('activation_path_selected', 'manual', { source: 'banner', path: 'manual' });
            navigate('/dashboard/products/new?quick=1');
          }}
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          Add product
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-8 border-blue-200 dark:border-blue-800"
          onClick={() => {
            track('activation_path_selected', 'import', { source: 'banner', path: 'import' });
            navigate('/dashboard/products/import');
          }}
        >
          <Upload className="h-3.5 w-3.5 mr-1" />
          Import
        </Button>
        <button
          type="button"
          onClick={dismiss}
          className="p-1 rounded text-blue-600 hover:bg-blue-100 dark:text-blue-300 dark:hover:bg-blue-900/50"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
