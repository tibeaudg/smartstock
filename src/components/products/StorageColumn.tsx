import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface StorageColumnProps {
  product: any;
  warehouseName: string | null;
  isVariant?: boolean;
  parentProduct?: any;
  compactMode?: boolean;
  onAssignWarehouse?: (productId: string, warehouseName: string) => void;
  warehouses?: Array<{ id: string; name: string }>;
}

export const StorageColumn: React.FC<StorageColumnProps> = ({
  product,
  warehouseName,
  isVariant = false,
  parentProduct,
  compactMode = false,
  onAssignWarehouse,
  warehouses = [],
}) => {
  const [isAssigning, setIsAssigning] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>(warehouseName || '');

  // For variants, check if matches parent
  if (isVariant) {
    const variantWarehouse = warehouseName;
    const parentWarehouse = parentProduct ? parentProduct.warehouse_name : null;
    const warehouseMatchesParent = variantWarehouse === parentWarehouse;
    
    if (warehouseMatchesParent) {
      return (
        <span className={cn(
          "text-gray-400 opacity-60",
          compactMode ? "text-[10px]" : "text-xs"
        )}>
          Same as parent
        </span>
      );
    }
  }

  const hasStorage = !!warehouseName;
  const displayText = warehouseName || null;

  const handleAssign = () => {
    if (onAssignWarehouse && selectedWarehouse) {
      setIsAssigning(true);
      onAssignWarehouse(product.id, selectedWarehouse);
      setTimeout(() => setIsAssigning(false), 500);
    }
  };

  if (!hasStorage) {
    return (
      <>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAssigning(true);
                }}
                className={cn(
                  "h-6 px-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 opacity-40",
                  compactMode && "h-5 px-1.5 text-[10px]"
                )}
              >
                <MapPin className="w-3 h-3 mr-1" />
                Assign location
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Click to assign warehouse</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {isAssigning && (
          <div className="mt-2 space-y-2">
            {warehouses.length > 0 && (
              <div className="flex gap-1">
                <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
                  <SelectTrigger className="h-7 text-xs flex-1">
                    <SelectValue placeholder="Select warehouse" />
                  </SelectTrigger>
                  <SelectContent>
                    {warehouses.map((w) => (
                      <SelectItem key={w.id} value={w.name}>
                        {w.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  size="sm"
                  onClick={handleAssign}
                  className="h-7 px-2"
                  disabled={!selectedWarehouse}
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>
        )}
      </>
    );
  }

  return (
    <span className={cn(
      "text-gray-600",
      compactMode ? "text-xs" : "text-sm"
    )}>
      {displayText}
    </span>
  );
};

