import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Hash, Plus, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ActionableSKUProps {
  product: any;
  isVariant?: boolean;
  parentProduct?: any;
  compactMode?: boolean;
  onUpdateSKU?: (productId: string, sku: string) => void;
}

export const ActionableSKU: React.FC<ActionableSKUProps> = ({
  product,
  isVariant = false,
  parentProduct,
  compactMode = false,
  onUpdateSKU,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [skuValue, setSkuValue] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  // Initialize SKU value when editing starts
  React.useEffect(() => {
    if (isEditing) {
      if (isVariant) {
        setSkuValue(product.variant_sku || product.sku || '');
      } else {
        setSkuValue(product.sku || '');
      }
    }
  }, [isEditing, product, isVariant]);

  const handleSave = async () => {
    if (!onUpdateSKU) return;
    
    setIsSaving(true);
    try {
      await onUpdateSKU(product.id, skuValue.trim());
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating SKU:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (isVariant) {
      setSkuValue(product.variant_sku || product.sku || '');
    } else {
      setSkuValue(product.sku || '');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  if (isVariant) {
    const hasVariantSKU = !!(product.variant_sku || product.sku);
    const hasParentSKU = parentProduct && !!(parentProduct.sku && parentProduct.sku !== '---');
    const variantMatchesParent = hasVariantSKU && hasParentSKU && (product.variant_sku || product.sku) === parentProduct.sku;
    const showNoSKU = (!hasVariantSKU && !hasParentSKU) || variantMatchesParent;
    
    if (isEditing) {
      return (
        <div className="flex gap-1 items-center">
          <Input
            value={skuValue}
            onChange={(e) => setSkuValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter SKU"
            className={cn(
              "h-7 text-xs font-mono",
              compactMode && "h-6 text-[10px]"
            )}
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleSave();
            }}
            disabled={isSaving}
            className="h-7 px-2"
          >
            <Check className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              handleCancel();
            }}
            className="h-7 px-2"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      );
    }
    
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
                  setIsEditing(true);
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
                <p className="mt-2 text-blue-300">Click to enter SKU</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              className={cn(
                "text-gray-900 hover:text-blue-700 hover:bg-blue-50 h-auto px-2 py-1 font-mono",
                !hasVariantSKU && "text-gray-400 opacity-60",
                compactMode ? "text-xs h-5 px-1" : "text-sm h-6 px-2"
              )}
            >
              {product.variant_sku || product.sku || ' '}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Click to edit SKU</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  const hasSKU = !!(product.sku && product.sku !== '---');
  
  if (isEditing) {
    return (
      <div className="flex gap-1 items-center">
        <Input
          value={skuValue}
          onChange={(e) => setSkuValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter SKU"
          className={cn(
            "h-7 text-xs font-mono",
            compactMode && "h-6 text-[10px]"
          )}
          autoFocus
          onClick={(e) => e.stopPropagation()}
        />
        <Button
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleSave();
          }}
          disabled={isSaving}
          className="h-7 px-2"
        >
          <Check className="w-3 h-3" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            handleCancel();
          }}
          className="h-7 px-2"
        >
          <X className="w-3 h-3" />
        </Button>
      </div>
    );
  }
  
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
                setIsEditing(true);
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
              <p className="mt-2 text-blue-300">Click to enter SKU</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
            className={cn(
              "text-gray-900 hover:text-blue-700 hover:bg-blue-50 h-auto px-2 py-1 font-mono font-medium",
              compactMode ? "text-xs h-5 px-1" : "text-sm h-6 px-2"
            )}
          >
            {product.sku}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Click to edit SKU</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
