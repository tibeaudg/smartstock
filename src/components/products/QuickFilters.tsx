import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, AlertTriangle, Package, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type QuickFilterType = 'low-stock' | 'out-of-stock' | 'missing-data' | 'needs-reorder';

interface QuickFiltersProps {
  activeFilters: QuickFilterType[];
  onFilterToggle: (filter: QuickFilterType) => void;
  onClearAll: () => void;
  lowStockCount?: number;
  outOfStockCount?: number;
  missingDataCount?: number;
  needsReorderCount?: number;
}

export const QuickFilters: React.FC<QuickFiltersProps> = ({
  activeFilters,
  onFilterToggle,
  onClearAll,
  lowStockCount = 0,
  outOfStockCount = 0,
  missingDataCount = 0,
  needsReorderCount = 0,
}) => {
  const filters = [
    {
      id: 'low-stock' as QuickFilterType,
      label: 'Low Stock',
      icon: AlertTriangle,
      count: lowStockCount,
      color: 'text-orange-600 bg-orange-50 border-orange-200 hover:bg-orange-100',
      activeColor: 'text-orange-700 bg-orange-100 border-orange-300',
    },
    {
      id: 'out-of-stock' as QuickFilterType,
      label: 'Out of Stock',
      icon: AlertCircle,
      count: outOfStockCount,
      color: 'text-red-600 bg-red-50 border-red-200 hover:bg-red-100',
      activeColor: 'text-red-700 bg-red-100 border-red-300',
    },
    {
      id: 'missing-data' as QuickFilterType,
      label: 'Missing Data',
      icon: Package,
      count: missingDataCount,
      color: 'text-yellow-600 bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
      activeColor: 'text-yellow-700 bg-yellow-100 border-yellow-300',
    },
    {
      id: 'needs-reorder' as QuickFilterType,
      label: 'Needs Reorder',
      icon: AlertTriangle,
      count: needsReorderCount,
      color: 'text-blue-600 bg-blue-50 border-blue-200 hover:bg-blue-100',
      activeColor: 'text-blue-700 bg-blue-100 border-blue-300',
    },
  ];

  if (activeFilters.length === 0 && filters.every(f => f.count === 0)) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs font-medium text-gray-500 mr-1">Quick filters:</span>
      {filters.map((filter) => {
        const isActive = activeFilters.includes(filter.id);
        const Icon = filter.icon;
        
        return (
          <Button
            key={filter.id}
            variant="outline"
            size="sm"
            onClick={() => onFilterToggle(filter.id)}
            className={cn(
              "h-7 px-2.5 text-xs border transition-colors",
              isActive ? filter.activeColor : filter.color
            )}
          >
            <Icon className="w-3 h-3 mr-1.5" />
            {filter.label}
            {filter.count > 0 && (
              <Badge
                variant="secondary"
                className={cn(
                  "ml-1.5 h-4 px-1 text-[10px]",
                  isActive ? "bg-white/50" : "bg-white/70"
                )}
              >
                {filter.count}
              </Badge>
            )}
          </Button>
        );
      })}
      {activeFilters.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="h-7 px-2 text-xs text-gray-500 hover:text-gray-700"
        >
          <X className="w-3 h-3 mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
};

