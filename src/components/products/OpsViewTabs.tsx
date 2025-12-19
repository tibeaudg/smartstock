import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { OpsViewName } from '@/hooks/useOpsViewState';

interface OpsViewTabsProps {
  activeView: OpsViewName;
  onViewChange: (view: OpsViewName) => void;
  className?: string;
}

const VIEW_LABELS: Record<OpsViewName, string> = {
  "today's-fires": "Today's Fires",
  'needs-reorder': 'Needs Reorder',
  'missing-setup': 'Missing Setup',
  'overstock': 'Overstock',
  'all-products': 'All Products',
};

export const OpsViewTabs: React.FC<OpsViewTabsProps> = ({
  activeView,
  onViewChange,
  className,
}) => {
  const views: OpsViewName[] = [
    "today's-fires",
    'needs-reorder',
    'missing-setup',
    'overstock',
    'all-products',
  ];

  return (
    <div className={cn(
      "flex-shrink-0 px-3 md:px-4 lg:px-6 py-2 bg-gray-50 border-b border-gray-200",
      "flex items-center gap-1 overflow-x-auto",
      className
    )}>
      {views.map((view) => (
        <Button
          key={view}
          variant="ghost"
          size="sm"
          onClick={() => onViewChange(view)}
          className={cn(
            "h-8 px-3 text-xs font-medium transition-colors whitespace-nowrap",
            activeView === view
              ? "bg-white text-blue-700 border border-blue-200 shadow-sm"
              : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
          )}
        >
          {VIEW_LABELS[view]}
          {view === "today's-fires" && (
            <span className="ml-1.5 text-[10px] text-blue-500">●</span>
          )}
        </Button>
      ))}
    </div>
  );
};

