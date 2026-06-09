import React from 'react';
import { FileText, Folder, Layers, Euro, DollarSign, PoundSterling, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useCurrency } from '@/hooks/useCurrency';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export interface ActivationSummaryCardsProps {
  variant: 'preview' | 'live';
  values?: {
    items?: number;
    categories?: number;
    totalQuantity?: number;
    totalValue?: string | number;
    itemsWithoutCostCount?: number;
    valuationMethodLabel?: string;
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

type CardKey = 'items' | 'categories' | 'totalQuantity' | 'totalValue';

const CARD_DEFS: Array<{
  key: CardKey;
  icon: React.ReactNode;
  label: string;
  description: string;
  tooltip: string;
}> = [
  {
    key: 'items',
    icon: <FileText className="text-blue-500 h-5 w-5" />,
    label: 'Items',
    description: 'Products in your catalog',
    tooltip: 'The total number of product records in this warehouse, including variants.',
  },
  {
    key: 'categories',
    icon: <Folder className="text-amber-500 h-5 w-5" />,
    label: 'Categories',
    description: 'Groups you use to organize products',
    tooltip: 'How many distinct categories currently contain at least one product.',
  },
  {
    key: 'totalQuantity',
    icon: <Layers className="text-purple-500 h-5 w-5" />,
    label: 'Total Quantity',
    description: 'Units on hand right now',
    tooltip: 'Sum of quantity in stock across all products. This counts units, not product records.',
  },
  {
    key: 'totalValue',
    icon: null,
    label: 'Total Value',
    description: 'Estimated cost of stock on hand',
    tooltip:
      'Calculated from your stock-in purchase prices using weighted average costing. ' +
      'Each time you receive stock, record the unit cost so this stays accurate.',
  },
];

function SummaryCardInner({
  icon,
  label,
  description,
  tooltip,
  value,
  hint,
  preview,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  tooltip: string;
  value: React.ReactNode;
  hint?: string;
  preview: boolean;
}) {
  if (preview) {
    return (
      <Card className="border border-dashed border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 shadow-none">
        <CardContent className="p-4 sm:p-6 flex flex-col items-center justify-center text-center space-y-2">
          <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-full">{icon}</div>
          <div className="text-2xl font-bold text-gray-300 dark:text-gray-600">{value}</div>
          <div className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</div>
          <p className="text-xs text-gray-400 leading-snug">{description}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-5 sm:p-6 flex flex-col space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-full shrink-0">{icon}</div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="text-slate-300 hover:text-slate-500 transition-colors mt-1"
                  aria-label={`More about ${label}`}
                >
                  <Info className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs text-sm leading-relaxed">
                {tooltip}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{value}</div>
        <div className="space-y-1">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</div>
          <p className="text-xs text-slate-400 leading-snug">{description}</p>
          {hint && (
            <p className="text-xs text-amber-600 dark:text-amber-500 leading-snug pt-0.5">{hint}</p>
          )}
        </div>
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
    itemsWithoutCostCount: values.itemsWithoutCostCount ?? 0,
    valuationMethodLabel: values.valuationMethodLabel ?? 'Weighted Average Cost',
  };

  const totalValueHint =
    !isPreview && resolved.itemsWithoutCostCount > 0
      ? `${resolved.itemsWithoutCostCount} item${resolved.itemsWithoutCostCount === 1 ? '' : 's'} ha${resolved.itemsWithoutCostCount === 1 ? 's' : 've'} stock but no purchase price recorded — add costs when receiving stock.`
      : !isPreview
        ? `Using ${resolved.valuationMethodLabel}`
        : undefined;

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
          const hint = def.key === 'totalValue' ? totalValueHint : undefined;

          return (
            <SummaryCardInner
              key={def.key}
              icon={icon}
              label={def.label}
              description={def.description}
              tooltip={def.tooltip}
              value={displayValue}
              hint={hint}
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
