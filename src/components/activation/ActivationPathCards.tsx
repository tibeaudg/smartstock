import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Upload, ScanLine, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useAppEventTracker } from '@/hooks/useAppEventTracker';
import { navigateToAddProduct } from '@/lib/navigation/productNavigation';
import { cn } from '@/lib/utils';

export type ActivationPath = 'manual' | 'import' | 'scan';
export type ActivationSource = 'dashboard' | 'products' | 'banner';

const PATHS: {
  id: ActivationPath;
  title: string;
  description: string;
  time: string;
  icon: React.ComponentType<{ className?: string }>;
  primary?: boolean;
}[] = [
  {
    id: 'manual',
    title: 'Add manually',
    description: 'Enter one product in under a minute',
    time: '~1 min',
    icon: Plus,
    primary: true,
  },
  {
    id: 'import',
    title: 'Import CSV',
    description: 'Upload a spreadsheet with your catalog',
    time: '~5 min',
    icon: Upload,
  },
  {
    id: 'scan',
    title: 'Scan barcode',
    description: 'Use your camera to add items fast',
    time: '~30 sec',
    icon: ScanLine,
  },
];

interface ActivationPathCardsProps {
  source: ActivationSource;
  className?: string;
}

export function ActivationPathCards({ source, className }: ActivationPathCardsProps) {
  const navigate = useNavigate();
  const { track } = useAppEventTracker();

  const handleSelect = (path: ActivationPath) => {
    track('activation_path_selected', path, { source, path });

    if (path === 'manual') {
      navigateToAddProduct(navigate, { mode: 'quick' });
    } else if (path === 'import') {
      navigate('/dashboard/products/import');
    } else {
      navigate('/dashboard/scan', { state: { returnTo: '/dashboard/categories' } });
    }
  };

  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-3 gap-3', className)}>
      {PATHS.map((path) => {
        const Icon = path.icon;
        return (
          <button
            key={path.id}
            type="button"
            onClick={() => handleSelect(path.id)}
            className="text-left w-full"
          >
            <Card
              className={cn(
                'h-full transition-all hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700',
                path.primary
                  ? 'border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-950/20'
                  : 'border-gray-200 dark:border-gray-800'
              )}
            >
              <CardContent className="p-4 flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <div
                    className={cn(
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                      path.primary
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
                    {path.time}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900 dark:text-gray-100 flex items-center gap-1">
                    {path.title}
                    <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{path.description}</p>
                </div>
              </CardContent>
            </Card>
          </button>
        );
      })}
    </div>
  );
}
