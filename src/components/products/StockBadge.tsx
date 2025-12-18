import React from 'react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export type StockStatus = 'critical' | 'at-risk' | 'healthy'; // Note: 'healthy' is deprecated but kept for type safety

interface StockBadgeProps {
  status: StockStatus;
  quantity: number;
  daysOfCover?: number | null;
  showQuantity?: boolean;
  className?: string;
  compact?: boolean;
}

export const StockBadge: React.FC<StockBadgeProps> = ({
  status,
  quantity,
  daysOfCover,
  showQuantity = false,
  className,
  compact = false,
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'critical':
        return {
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-700',
          dotColor: 'bg-red-500',
          label: 'Empty',
        };
      case 'at-risk':
        return {
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          textColor: 'text-orange-700',
          dotColor: 'bg-orange-500',
          label: 'Low',
        };
      case 'healthy':
        return {
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-700',
          dotColor: 'bg-green-500',
          label: 'Healthy',
        };
    }
  };

  const config = getStatusConfig();
  const formattedQuantity = new Intl.NumberFormat('en-US').format(quantity);

  const tooltipContent = (
    <div className="text-xs">
      <div className="font-medium mb-1">{config.label}</div>
      <div>Units: {formattedQuantity}</div>
      {daysOfCover !== null && daysOfCover !== undefined && (
        <div>Days of cover: {daysOfCover.toFixed(1)}</div>
      )}
    </div>
  );

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border font-medium transition-all',
              config.bgColor,
              config.borderColor,
              config.textColor,
              compact ? 'text-[10px]' : 'text-xs',
              status === 'critical' && 'animate-pulse',
              className
            )}
          >
            <div className={cn('w-1.5 h-1.5 rounded-full', config.dotColor)} />
            <span>{config.label}</span>
            {showQuantity && (
              <span className="font-mono opacity-75">({formattedQuantity})</span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" align="center">
          {tooltipContent}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
