import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, AlertTriangle, Package, TrendingUp } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface OpsSummaryStripProps {
  outOfStockCount: number;
  lowStockCount: number;
  missingSetupCount: number;
  overstockCount: number;
  activeFilters?: string[];
  onFilterClick: (filterType: 'out-of-stock' | 'low-stock' | 'missing-setup' | 'overstock') => void;
  className?: string;
}

export const OpsSummaryStrip: React.FC<OpsSummaryStripProps> = ({
  outOfStockCount,
  lowStockCount,
  missingSetupCount,
  overstockCount,
  activeFilters = [],
  onFilterClick,
  className,
}) => {
  const metrics = [
    {
      id: 'out-of-stock' as const,
      label: 'Out of Stock',
      count: outOfStockCount,
      icon: AlertCircle,
      color: 'text-red-600 bg-red-50 border-red-200 hover:bg-red-100',
      activeColor: 'text-red-700 bg-red-100 border-red-300',
      tooltip: 'Out of Stock: zero available units across all locations',
    },
    {
      id: 'low-stock' as const,
      label: 'Low Stock',
      count: lowStockCount,
      icon: AlertTriangle,
      color: 'text-orange-600 bg-orange-50 border-orange-200 hover:bg-orange-100',
      activeColor: 'text-orange-700 bg-orange-100 border-orange-300',
      tooltip: 'Low Stock: quantity at or below minimum stock level',
    },
    {
      id: 'missing-setup' as const,
      label: 'Missing Setup',
      count: missingSetupCount,
      icon: Package,
      color: 'text-yellow-600 bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
      activeColor: 'text-yellow-700 bg-yellow-100 border-yellow-300',
      tooltip: 'Missing Setup: products missing critical data (SKU, location, category)',
    },
    {
      id: 'overstock' as const,
      label: 'Overstock',
      count: overstockCount,
      icon: TrendingUp,
      color: 'text-blue-600 bg-blue-50 border-blue-200 hover:bg-blue-100',
      activeColor: 'text-blue-700 bg-blue-100 border-blue-300',
      tooltip: 'Overstock: products exceeding maximum stock level or high days of cover',
    },
  ];

  return (
    <div className={cn(
      "flex-shrink-0 px-3 md:px-4 lg:px-6 py-2.5 bg-white border-b border-gray-200",
      "flex items-center gap-2 flex-wrap",
      className
    )}>
      {metrics.map((metric) => {
        const Icon = metric.icon;
        const isActive = activeFilters.includes(metric.id);
        
        return (
          <TooltipProvider key={metric.id} delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onFilterClick(metric.id)}
                  className={cn(
                    "h-8 px-3 text-xs border transition-colors flex items-center gap-2",
                    isActive ? metric.activeColor : metric.color
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="font-medium">{metric.label}</span>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "h-5 px-1.5 text-[10px] font-semibold min-w-[20px] flex items-center justify-center",
                      isActive ? "bg-white/70 text-current" : "bg-white/80 text-current"
                    )}
                  >
                    {metric.count}
                  </Badge>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-xs">
                <p className="text-xs">{metric.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </div>
  );
};

