import React from 'react';
import { Button } from '@/components/ui/button';
import { Hash, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ActionableSKUProps {
  product: any;
  isVariant?: boolean;
  parentProduct?: any;
  compactMode?: boolean;
  onGenerateSKU?: (productId: string) => void;
}

export const ActionableSKU: React.FC<ActionableSKUProps> = ({
  product,
  isVariant = false,
  parentProduct,
  compactMode = false,
  onGenerateSKU,
}) => {
  if (isVariant) {
    const hasVariantSKU = !!(product.variant_sku || product.sku);
    const hasParentSKU = parentProduct && !!(parentProduct.sku && parentProduct.sku !== '---');
    const variantMatchesParent = hasVariantSKU && hasParentSKU && (product.variant_sku || product.sku) === parentProduct.sku;
    const showNoSKU = (!hasVariantSKU && !hasParentSKU) || variantMatchesParent;
    
    if (showNoSKU) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onGenerateSKU?.(product.id);
                }}
                className={cn(
                  "h-6 px-2 text-xs text-orange-600 hover:text-orange-700 hover:bg-orange-50 opacity-40",
                  compactMode && "h-5 px-1.5 text-[10px]"
                )}
              >
                <Hash className="w-3 h-3 mr-1" />
                Missing SKU
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-xs space-y-1">
                <p className="font-medium">SKU is required for:</p>
                <ul className="list-disc list-inside space-y-0.5 text-gray-300">
                  <li>Sales synchronization</li>
                  <li>Barcode scanning</li>
                  <li>Inventory tracking</li>
                </ul>
                <p className="mt-2 text-blue-300">Click to auto-generate SKU</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    
    return (
      <span className={cn(
        "font-mono",
        !hasVariantSKU ? "text-gray-400 opacity-60" : "text-gray-900",
        compactMode ? "text-xs" : "text-sm"
      )}>
        {product.variant_sku || product.sku || '—'}
      </span>
    );
  }

  const hasSKU = !!(product.sku && product.sku !== '---');
  
  if (!hasSKU) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onGenerateSKU?.(product.id);
              }}
              className={cn(
                "h-6 px-2 text-xs text-orange-600 hover:text-orange-700 hover:bg-orange-50 opacity-40",
                compactMode && "h-5 px-1.5 text-[10px]"
              )}
            >
              <Hash className="w-3 h-3 mr-1" />
              Missing SKU
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-xs space-y-1">
              <p className="font-medium">SKU is required for:</p>
              <ul className="list-disc list-inside space-y-0.5 text-gray-300">
                <li>Sales synchronization</li>
                <li>Barcode scanning</li>
                <li>Inventory tracking</li>
              </ul>
              <p className="mt-2 text-blue-300">Click to auto-generate SKU</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <span className={cn(
      "font-mono text-gray-900 font-medium",
      compactMode ? "text-xs" : "text-sm"
    )}>
      {product.sku}
    </span>
  );
};

