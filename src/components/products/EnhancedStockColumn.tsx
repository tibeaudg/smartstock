import React from 'react';
import { cn } from '@/lib/utils';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { StockQuickActionMenu } from './StockQuickActionMenu';
import type { StockTrend } from '@/utils/stockTrends';

interface EnhancedStockColumnProps {
  product: any;
  stockValue: number;
  stockStatus: string;
  stockDotColor: string;
  minimumStockLevel: number;
  isVariant?: boolean;
  isAggregatedTotal?: boolean;
  compactMode?: boolean;
  isMobile?: boolean;
  trend?: StockTrend | null;
  onAdjustStock: (product: any) => void;
  onCreatePO: (product: any) => void;
  onViewHistory: (product: any) => void;
  formatStockQuantity: (qty: number) => string;
}

export const EnhancedStockColumn: React.FC<EnhancedStockColumnProps> = ({
  product,
  stockValue,
  stockStatus,
  stockDotColor,
  minimumStockLevel,
  isVariant = false,
  isAggregatedTotal = false,
  compactMode = false,
  isMobile = false,
  trend = null,
  onAdjustStock,
  onCreatePO,
  onViewHistory,
  formatStockQuantity,
}) => {
  const getTrendIcon = () => {
    if (!trend) return null;
    switch (trend) {
      case 'selling-fast':
        return <TrendingDown className="w-3 h-3 text-red-600" />;
      case 'overstock':
        return <TrendingUp className="w-3 h-3 text-blue-600" />;
      case 'stable':
        return <Minus className="w-3 h-3 text-gray-500" />;
      default:
        return null;
    }
  };

  const getTrendLabel = () => {
    if (!trend) return null;
    switch (trend) {
      case 'selling-fast':
        return '↓ Fast';
      case 'overstock':
        return '↑ Overstock';
      case 'stable':
        return '→ Stable';
      default:
        return null;
    }
  };

  // Map stock dot color to lighter background color
  const getCellBackgroundColor = () => {
    if (stockDotColor === 'bg-red-500') return 'bg-red-50';
    if (stockDotColor === 'bg-orange-500') return 'bg-orange-50';
    if (stockDotColor === 'bg-green-500') return 'bg-green-50';
    return '';
  };

  // Map stock dot color to darker border color
  const getBadgeBorderColor = () => {
    if (stockDotColor === 'bg-red-500') return 'border-red-400';
    if (stockDotColor === 'bg-orange-500') return 'border-orange-400';
    if (stockDotColor === 'bg-green-500') return 'border-green-400';
    return 'border-gray-300';
  };

  return (
    <td 
      className={cn(
        "text-right w-auto align-middle",
        "px-2 sm:px-4 py-1 border-r border-gray-200"
      )} 
      onClick={(e) => isMobile && e.stopPropagation()}
    >
      {!isMobile ? (
        <StockQuickActionMenu
          product={product}
          onAdjustStock={onAdjustStock}
          onCreatePO={onCreatePO}
          onViewHistory={onViewHistory}
        >
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  data-interactive
                  className={cn(
                    compactMode ? "rounded-lg p-1 transition-all" : "space-y-0.5 rounded-lg p-1 transition-all",
                    "cursor-pointer group hover:shadow-md",
                    "border-2",
                    isVariant 
                      ? "bg-blue-50/20 border-blue-300" 
                      : isAggregatedTotal 
                        ? "bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-400 shadow-sm"
                        : cn(getCellBackgroundColor(), getBadgeBorderColor())
                  )}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Stock value and status */}
                  <div className={cn(
                    "flex items-center justify-center gap-2"
                  )}>
                    <div
                      className={cn(
                        'rounded-full shadow-sm',
                        stockDotColor,
                        stockValue === 0 ? 'animate-pulse' : '',
                        'w-2 h-2'
                      )}
                    />
                    <span
                      className={cn(
                        isVariant ? 'font-medium' : (isAggregatedTotal ? 'font-bold text-blue-700' : 'font-semibold'),
                        'transition-colors font-mono',
                        stockValue === 0
                          ? 'animate-pulse text-red-600'
                          : isVariant 
                            ? 'text-gray-700' // Variant stock numbers in neutral dark gray
                            : isAggregatedTotal ? 'text-blue-700' : 'text-gray-900',
                        !isMobile && !isVariant && 'group-hover:text-blue-600',
                        'text-sm'
                      )}
                      style={!isVariant && !isAggregatedTotal ? { fontWeight: 600 } : undefined}
                    >
                      {formatStockQuantity(stockValue)}
                    </span>
                    {isAggregatedTotal && (
                      <span className="text-[9px] text-blue-600 font-bold ml-1 bg-blue-200/50 px-1 py-0.5 rounded">Σ</span>
                    )}
                    {trend && getTrendIcon()}
                  </div>
                  
                  {/* Status and trend */}
                  {!compactMode && (
                    <div className={cn(
                      "text-xs font-medium transition-colors text-center",
                      isMobile ? "text-gray-600" : "text-gray-600 group-hover:text-blue-600"
                    )}>
                      {stockStatus}
                      {stockValue === 0 && product.daysOutOfStock !== null && product.daysOutOfStock !== undefined && (
                        <span className="ml-1 text-[10px] opacity-75">
                          · Out for {product.daysOutOfStock} day{product.daysOutOfStock !== 1 ? 's' : ''}
                        </span>
                      )}
                      {trend && stockValue > 0 && (
                        <span className="ml-1 text-[10px] opacity-75">
                          · {getTrendLabel()}
                        </span>
                      )}
                    </div>
                  )}

                </div>
              </TooltipTrigger>
              {!isMobile && (
                <TooltipContent side="top" align="center" sideOffset={8} className="z-[200000] max-w-xs shadow-lg">
                  <p className="font-medium">
                    {formatStockQuantity(stockValue)} in stock. Minimum: {formatStockQuantity(minimumStockLevel)}
                    {isAggregatedTotal && <span className="text-xs text-gray-500 ml-1">(Total)</span>}
                  </p>
                  {trend && (
                    <p className="text-xs text-gray-500 mt-1">
                      Trend: {getTrendLabel()}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">Status: {stockStatus}</p>
                  {stockValue === 0 && (
                    <p className="text-xs text-red-400 mt-1">⚠️ Out of stock!</p>
                  )}
                  {stockValue > 0 && stockValue <= minimumStockLevel && (
                    <p className="text-xs text-orange-400 mt-1">⚠️ Low stock alert</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">Click to adjust stock</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </StockQuickActionMenu>
      ) : (
        <div 
          className={cn(
            "space-y-0.5 rounded-lg p-1.5 border-2",
            isVariant 
              ? "bg-blue-50/20 border-blue-300" 
              : cn(getCellBackgroundColor(), getBadgeBorderColor())
          )}
        >
          <div className="flex items-center justify-center gap-2">
            <div
              className={cn(
                'rounded-full shadow-sm',
                stockDotColor,
                stockValue === 0 ? 'animate-pulse' : '',
                'w-2 h-2'
              )}
            />
            <span
              className={cn(
                'font-semibold font-mono',
                stockValue === 0 ? 'text-red-600' : 'text-gray-900',
                'text-sm'
              )}
            >
              {formatStockQuantity(stockValue)}
            </span>
          </div>
          <div className="text-xs text-gray-600 text-center">
            {stockStatus}
          </div>
        </div>
      )}
    </td>
  );
};

