import React from 'react';
import { FileText, Folder, Layers, Euro, DollarSign, PoundSterling } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useCurrency } from '@/hooks/useCurrency';
import { cn } from '@/lib/utils';

export interface ActivationSummaryCardsProps {
  variant: 'preview' | 'live';
  values?: {
    items?: number;
    categories?: number;
    totalQuantity?: number;
    totalValue?: string | number;
  };
  showUnlockLabel?: boolean;
  className?: string;
}

function ValueIcon() {
  const { currency } = useCurrency();
  if (currency === 'EUR') return <Euro className="text-blue-400 h-5 w-5" />;
  if (currency === 'GBP') return <PoundSterling className="text-blue-400 h-5 w-5" />;
  return <DollarSign className="text-blue-400 h-5 w-5" />;
}

const CARD_DEFS = [
  { key: 'items' as const, icon: <FileText className="text-blue-500 h-5 w-5" />, label: 'Items' },
  { key: 'categories' as const, icon: <Folder className="text-amber-500 h-5 w-5" />, label: 'Categories' },
  { key: 'totalQuantity' as const, icon: <Layers className="text-purple-500 h-5 w-5" />, label: 'Total Quantity' },
  { key: 'totalValue' as const, icon: null as React.ReactNode | null, label: 'Total Value' },
];

function SummaryCardInner({
  icon,
  label,
  value,
  preview,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  preview: boolean;
}) {
  if (preview) {
    return (
      <Card className="border border-dashed border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 shadow-none">
        <CardContent className="p-4 sm:p-6 flex flex-col items-center justify-center text-center space-y-2">
          <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-full">{icon}</div>
          <div className="text-2xl font-bold text-gray-300 dark:text-gray-600">{value}</div>
          <div className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2">
        <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-full">{icon}</div>
        <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{value}</div>
        <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</div>
      </CardContent>
    </Card>
  );
}

export function ActivationSummaryCards({
  variant,
  values = {},
  showUnlockLabel = true,
  className,
}: ActivationSummaryCardsProps) {
  const { formatPrice } = useCurrency();
  const isPreview = variant === 'preview';

  const resolved = {
    items: values.items ?? 0,
    categories: values.categories ?? 0,
    totalQuantity: values.totalQuantity ?? 0,
    totalValue:
      values.totalValue !== undefined
        ? values.totalValue
        : formatPrice(0),
  };

  return (
    <section className={cn('space-y-3', className)}>
      {isPreview && showUnlockLabel && (
        <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Here&apos;s what you&apos;ll unlock:
        </p>
      )}
      <div className={cn('grid grid-cols-2 lg:grid-cols-4 gap-4', isPreview && 'opacity-90')}>
        {CARD_DEFS.map((def) => {
          const icon = def.key === 'totalValue' ? <ValueIcon /> : def.icon;
          const displayValue = isPreview
            ? '—'
            : def.key === 'totalValue'
              ? resolved.totalValue
              : resolved[def.key];

          return (
            <SummaryCardInner
              key={def.key}
              icon={icon}
              label={def.label}
              value={displayValue}
              preview={isPreview}
            />
          );
        })}
      </div>
      {isPreview && showUnlockLabel && (
        <p className="text-center text-xs text-gray-400 dark:text-gray-500">
          Add products to unlock your live dashboard
        </p>
      )}
    </section>
  );
}
