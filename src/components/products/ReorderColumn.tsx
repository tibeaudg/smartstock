import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertCircle, Package, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { InlineIntelligence } from './InlineIntelligence';
import { InlineReorderButton } from './InlineReorderButton';
import { useProductDemandForecast } from '@/hooks/useProductDemandForecast';
import { calculateReorderQuantity } from '@/utils/reorderQuantityCalculator';
import { calculateDaysOfCover } from '@/utils/daysOfCover';

interface ReorderColumnProps {
  product: any;
  compactMode?: boolean;
  onCreatePO: (product: any, suggestedQuantity?: number) => void;
  onSetRule: (product: any) => void;
  className?: string;
}

export const ReorderColumn: React.FC<ReorderColumnProps> = ({
  product,
  compactMode = false,
  onCreatePO,
  onSetRule,
  className,
}) => {
  const currentStock = Number(product.quantity_in_stock) || 0;
  const minimumStockLevel = Number(product.minimum_stock_level) || 0;
  
  const { data: forecast, isLoading: forecastLoading } = useProductDemandForecast(
    product.id,
    currentStock,
    minimumStockLevel
  );

  // Calculate reorder suggestion
  const reorderSuggestion = React.useMemo(() => {
    if (!forecast || forecast.velocity30Days <= 0) {
      return null;
    }
    return calculateReorderQuantity({
      currentStock,
      minimumStockLevel,
      velocity30Days: forecast.velocity30Days,
    });
  }, [forecast, currentStock, minimumStockLevel]);

  // Calculate days of cover
  const dailyConsumption = forecast 
    ? forecast.velocity30Days / 30 
    : null;
  const daysOfCover = calculateDaysOfCover(currentStock, dailyConsumption);

  // Determine state
  const hasReorderRule = minimumStockLevel > 0;
  const needsReorder = currentStock <= minimumStockLevel && currentStock > 0;
  const isOutOfStock = currentStock === 0;
  const isHealthy = currentStock > minimumStockLevel && daysOfCover !== null && daysOfCover > 7;

  // Calculate days until reorder needed
  const daysUntilReorder = React.useMemo(() => {
    if (!dailyConsumption || dailyConsumption <= 0 || currentStock <= minimumStockLevel) {
      return null;
    }
    const stockAboveMin = currentStock - minimumStockLevel;
    return Math.floor(stockAboveMin / dailyConsumption);
  }, [currentStock, minimumStockLevel, dailyConsumption]);

  if (forecastLoading) {
    return (
      <td className={cn("text-left px-3 sm:px-4 py-2 border-r border-gray-200", className)}>
        <div className="text-xs text-gray-400">Loading...</div>
      </td>
    );
  }

  // State 1: Reorder Required
  if ((needsReorder || isOutOfStock) && hasReorderRule && reorderSuggestion) {
    return (
      <td className={cn("text-left px-3 sm:px-4 py-2 border-r border-gray-200", className)}>
        <div className="space-y-1.5">
          <div className="text-xs font-medium text-orange-700">
            {isOutOfStock 
              ? 'Out of stock' 
              : daysUntilReorder !== null && daysUntilReorder > 0
              ? `Reorder in ${daysUntilReorder} day${daysUntilReorder !== 1 ? 's' : ''}`
              : 'Reorder now'}
          </div>
          <div className="text-xs text-gray-600">
            Suggested: {reorderSuggestion.suggestedQuantity} units
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onCreatePO(product, reorderSuggestion.suggestedQuantity);
            }}
            className={cn(
              "h-7 text-xs",
              compactMode && "h-6 text-[10px] px-2"
            )}
          >
            <Package className="w-3 h-3 mr-1" />
            Create PO
          </Button>
        </div>
      </td>
    );
  }

  // State 2: Rule Missing
  if (!hasReorderRule) {
    return (
      <td className={cn("text-left px-3 sm:px-4 py-2 border-r border-gray-200", className)}>
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-yellow-700">
            <AlertCircle className="w-3.5 h-3.5" />
            <span className="font-medium">No reorder rule</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onSetRule(product);
            }}
            className={cn(
              "h-7 text-xs",
              compactMode && "h-6 text-[10px] px-2"
            )}
          >
            <Settings className="w-3 h-3 mr-1" />
            Set rule
          </Button>
        </div>
      </td>
    );
  }

  // State 3: Healthy
  return (
    <td className={cn("text-left hidden lg:table-cell px-3 sm:px-4 py-2 border-r border-gray-200", className)}>
      <div className="space-y-1">
        {daysOfCover !== null ? (
          <div className="text-xs text-gray-600">
            Covered for {Math.floor(daysOfCover)} day{Math.floor(daysOfCover) !== 1 ? 's' : ''}
          </div>
        ) : (
          <div className="text-xs text-gray-500">
            Stock level healthy
          </div>
        )}
        {reorderSuggestion && reorderSuggestion.suggestedQuantity > 0 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="text-[10px] text-gray-400 cursor-help">
                  Future: {reorderSuggestion.suggestedQuantity} units
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-xs space-y-1">
                  <p className="font-medium">Future Reorder Suggestion</p>
                  {reorderSuggestion.reasoning.slice(0, 3).map((reason, idx) => (
                    <p key={idx} className="text-gray-300">• {reason}</p>
                  ))}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </td>
  );
};

