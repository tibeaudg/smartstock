import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ValuationMethod } from '@/hooks/useInventoryValuation';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ValuationMethodSelectorProps {
  value: ValuationMethod;
  onValueChange: (value: ValuationMethod) => void;
  label?: string;
}

export const ValuationMethodSelector: React.FC<ValuationMethodSelectorProps> = ({
  value,
  onValueChange,
  label = 'Valuation Method',
}) => {
  const methodDescriptions = {
    FIFO: 'First In, First Out - Assumes oldest inventory is sold first',
    LIFO: 'Last In, First Out - Assumes newest inventory is sold first',
    Average: 'Weighted Average Cost - Uses average cost of all purchases',
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor="valuation-method">{label}</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-gray-400 cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <div className="space-y-2">
                <p className="font-semibold">Valuation Methods:</p>
                <ul className="text-sm space-y-1">
                  <li><strong>FIFO:</strong> First In, First Out</li>
                  <li><strong>LIFO:</strong> Last In, First Out</li>
                  <li><strong>Average:</strong> Weighted Average Cost</li>
                </ul>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Select value={value} onValueChange={(val) => onValueChange(val as ValuationMethod)}>
        <SelectTrigger id="valuation-method" className="w-full">
          <SelectValue placeholder="Select valuation method" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="FIFO">
            <div className="flex flex-col">
              <span className="font-medium">FIFO</span>
              <span className="text-xs text-gray-500">First In, First Out</span>
            </div>
          </SelectItem>
          <SelectItem value="LIFO">
            <div className="flex flex-col">
              <span className="font-medium">LIFO</span>
              <span className="text-xs text-gray-500">Last In, First Out</span>
            </div>
          </SelectItem>
          <SelectItem value="Average">
            <div className="flex flex-col">
              <span className="font-medium">Average Cost</span>
              <span className="text-xs text-gray-500">Weighted Average</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
      {methodDescriptions[value] && (
        <p className="text-xs text-gray-500 mt-1">{methodDescriptions[value]}</p>
      )}
    </div>
  );
};




