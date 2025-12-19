import React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useProductDemandForecast } from '@/hooks/useProductDemandForecast';
import { calculateReorderQuantity } from '@/utils/reorderQuantityCalculator';

interface InlineReorderButtonProps {
  productId: string;
  productName: string;
  currentStock: number;
  minimumStockLevel: number;
  onReorder?: (productId: string, suggestedQuantity?: number) => void;
  onCreatePO?: (productId: string, suggestedQuantity?: number) => void;
  variant?: 'reorder' | 'create-po' | 'both';
  compact?: boolean;
  className?: string;
}

export const InlineReorderButton: React.FC<InlineReorderButtonProps> = ({
  productId,
  productName,
  currentStock,
  minimumStockLevel,
  onReorder,
  onCreatePO,
  variant = 'reorder',
  compact = false,
  className,
}) => {
  const { data: forecast } = useProductDemandForecast(
    productId,
    currentStock,
    minimumStockLevel
  );

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

  const handleReorder = (e: React.MouseEvent) => {
    e.stopPropagation();
    onReorder?.(productId, reorderSuggestion?.suggestedQuantity);
  };

  const handleCreatePO = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCreatePO?.(productId, reorderSuggestion?.suggestedQuantity);
  };

  const tooltipContent = reorderSuggestion ? (
    <div className="text-xs space-y-1.5">
      <div className="font-semibold">Suggested Reorder Quantity</div>
      <div>
        <span className="font-semibold text-lg">{reorderSuggestion.suggestedQuantity}</span> units
      </div>
      {reorderSuggestion.reasoning.length > 0 && (
        <div className="space-y-0.5 mt-2 pt-2 border-t border-gray-600">
          {reorderSuggestion.reasoning.slice(0, 3).map((reason, idx) => (
            <div key={idx} className="text-gray-300 text-[10px]">
              • {reason}
            </div>
          ))}
        </div>
      )}
    </div>
  ) : null;

  if (variant === 'both') {
    return (
      <div className={cn('flex items-center gap-1', className)}>
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size={compact ? 'sm' : 'default'}
                className={cn(
                  'h-6 px-2 text-xs font-medium',
                  compact && 'h-5 px-1.5 text-[10px]'
                )}
                onClick={handleReorder}
              >
                <ShoppingCart className={cn('mr-1', compact ? 'w-3 h-3' : 'w-3.5 h-3.5')} />
                Reorder
                {reorderSuggestion && reorderSuggestion.suggestedQuantity > 0 && (
                  <span className="ml-1 text-[10px] opacity-75">
                    ({reorderSuggestion.suggestedQuantity})
                  </span>
                )}
              </Button>
            </TooltipTrigger>
            {tooltipContent && (
              <TooltipContent side="top" align="center">
                {tooltipContent}
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size={compact ? 'sm' : 'default'}
                className={cn(
                  'h-6 px-2 text-xs font-medium',
                  compact && 'h-5 px-1.5 text-[10px]'
                )}
                onClick={handleCreatePO}
              >
                <FileText className={cn('mr-1', compact ? 'w-3 h-3' : 'w-3.5 h-3.5')} />
                Create PO
                {reorderSuggestion && reorderSuggestion.suggestedQuantity > 0 && (
                  <span className="ml-1 text-[10px] opacity-75">
                    ({reorderSuggestion.suggestedQuantity})
                  </span>
                )}
              </Button>
            </TooltipTrigger>
            {tooltipContent && (
              <TooltipContent side="top" align="center">
                {tooltipContent}
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }

  const isCreatePO = variant === 'create-po';

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size={compact ? 'sm' : 'default'}
            className={cn(
              'h-6 px-2 text-xs font-medium',
              compact && 'h-5 px-1.5 text-[10px]',
              className
            )}
            onClick={isCreatePO ? handleCreatePO : handleReorder}
          >
            {isCreatePO ? (
              <>
                <FileText className={cn('mr-1', compact ? 'w-3 h-3' : 'w-3.5 h-3.5')} />
                Create PO
                {reorderSuggestion && reorderSuggestion.suggestedQuantity > 0 && (
                  <span className="ml-1 text-[10px] opacity-75">
                    ({reorderSuggestion.suggestedQuantity})
                  </span>
                )}
              </>
            ) : (
              <>
                <ShoppingCart className={cn('mr-1', compact ? 'w-3 h-3' : 'w-3.5 h-3.5')} />
                Reorder
                {reorderSuggestion && reorderSuggestion.suggestedQuantity > 0 && (
                  <span className="ml-1 text-[10px] opacity-75">
                    ({reorderSuggestion.suggestedQuantity})
                  </span>
                )}
              </>
            )}
          </Button>
        </TooltipTrigger>
        {tooltipContent && (
          <TooltipContent side="top" align="center">
            {tooltipContent}
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};
