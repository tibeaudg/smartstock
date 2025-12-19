import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface DeadStockConfigProps {
  thresholdDays: number;
  minStockLevel: number;
  onThresholdDaysChange: (days: number) => void;
  onMinStockLevelChange: (level: number) => void;
}

export const DeadStockConfig: React.FC<DeadStockConfigProps> = ({
  thresholdDays,
  minStockLevel,
  onThresholdDaysChange,
  onMinStockLevelChange,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Dead Stock Configuration
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-gray-400 cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>
                  Configure how dead stock is identified. Products with no movement for the
                  specified number of days will be flagged as dead stock.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
        <CardDescription>
          Adjust the criteria for identifying dead or obsolete inventory
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="threshold-days">
            Threshold Days (Days since last movement)
          </Label>
          <Input
            id="threshold-days"
            type="number"
            min="1"
            value={thresholdDays}
            onChange={(e) => onThresholdDaysChange(parseInt(e.target.value, 10) || 90)}
            className="max-w-xs"
          />
          <p className="text-xs text-gray-500">
            Products with no transactions for this many days will be considered dead stock.
            Default: 90 days
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="min-stock-level">Minimum Stock Level</Label>
          <Input
            id="min-stock-level"
            type="number"
            min="0"
            value={minStockLevel}
            onChange={(e) => onMinStockLevelChange(parseInt(e.target.value, 10) || 0)}
            className="max-w-xs"
          />
          <p className="text-xs text-gray-500">
            Only consider products with stock at or above this level. Helps filter out
            low-stock items that may appear as dead stock due to low quantities.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <strong>Current Settings:</strong> Products with{' '}
            {minStockLevel > 0 ? `at least ${minStockLevel} units and ` : ''}
            no movement for {thresholdDays} days will be flagged as dead stock.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};




