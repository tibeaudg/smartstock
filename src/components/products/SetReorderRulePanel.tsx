import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useBranches } from '@/hooks/useBranches';

interface SetReorderRulePanelProps {
  isOpen: boolean;
  onClose: () => void;
  products: any[];
  onUpdate?: () => void;
}

export const SetReorderRulePanel: React.FC<SetReorderRulePanelProps> = ({
  isOpen,
  onClose,
  products,
  onUpdate,
}) => {
  const { activeBranch } = useBranches();
  const queryClient = useQueryClient();
  
  const [minimumStockLevel, setMinimumStockLevel] = useState<string>('');
  const [leadTimeDays, setLeadTimeDays] = useState<string>('');
  const [safetyStockMultiplier, setSafetyStockMultiplier] = useState<string>('1.5');
  const [isSaving, setIsSaving] = useState(false);

  // Pre-fill with existing values if all products have the same
  React.useEffect(() => {
    if (products.length > 0) {
      const firstProduct = products[0];
      const allSameMinLevel = products.every(
        p => (Number(p.minimum_stock_level) || 0) === (Number(firstProduct.minimum_stock_level) || 0)
      );
      
      if (allSameMinLevel && firstProduct.minimum_stock_level) {
        setMinimumStockLevel(String(firstProduct.minimum_stock_level));
      }
    }
  }, [products]);

  const handleSave = async () => {
    if (!activeBranch) {
      toast.error('No active branch selected');
      return;
    }

    if (!minimumStockLevel || Number(minimumStockLevel) < 0) {
      toast.error('Please enter a valid minimum stock level');
      return;
    }

    setIsSaving(true);
    try {
      const updates: any = {
        minimum_stock_level: Number(minimumStockLevel),
      };

      // Note: lead_time_days and safety_stock_multiplier might not exist in products table
      // If they do, uncomment these:
      // if (leadTimeDays) {
      //   updates.lead_time_days = Number(leadTimeDays);
      // }
      // if (safetyStockMultiplier) {
      //   updates.safety_stock_multiplier = Number(safetyStockMultiplier);
      // }

      const { error } = await supabase
        .from('products')
        .update(updates)
        .in('id', products.map(p => p.id))
        .eq('branch_id', activeBranch.branch_id);

      if (error) throw error;

      toast.success(`Updated reorder rules for ${products.length} product${products.length !== 1 ? 's' : ''}`);
      
      queryClient.invalidateQueries({ queryKey: ['productsByCategories'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      onUpdate?.();
      onClose();
    } catch (error: any) {
      console.error('Error updating reorder rules:', error);
      toast.error(`Failed to update reorder rules: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Set Reorder Rule</SheetTitle>
          <SheetDescription>
            Configure reorder settings for {products.length} selected product{products.length !== 1 ? 's' : ''}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="minStockLevel">
              Minimum Stock Level <span className="text-red-500">*</span>
            </Label>
            <Input
              id="minStockLevel"
              type="number"
              min="0"
              value={minimumStockLevel}
              onChange={(e) => setMinimumStockLevel(e.target.value)}
              placeholder="Enter minimum stock level..."
            />
            <p className="text-xs text-gray-500">
              When stock falls to this level, reorder will be suggested
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="leadTimeDays">Lead Time (Days)</Label>
            <Input
              id="leadTimeDays"
              type="number"
              min="0"
              value={leadTimeDays}
              onChange={(e) => setLeadTimeDays(e.target.value)}
              placeholder="Enter lead time in days..."
            />
            <p className="text-xs text-gray-500">
              Average days from order to receipt (optional)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="safetyStockMultiplier">Safety Stock Multiplier</Label>
            <Input
              id="safetyStockMultiplier"
              type="number"
              min="1"
              step="0.1"
              value={safetyStockMultiplier}
              onChange={(e) => setSafetyStockMultiplier(e.target.value)}
              placeholder="1.5"
            />
            <p className="text-xs text-gray-500">
              Multiplier for safety stock calculation (default: 1.5)
            </p>
          </div>

          {products.length > 0 && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs font-medium text-gray-700 mb-2">Selected Products:</p>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {products.slice(0, 5).map((product) => (
                  <div key={product.id} className="text-xs text-gray-600">
                    • {product.name}
                  </div>
                ))}
                {products.length > 5 && (
                  <div className="text-xs text-gray-500">
                    +{products.length - 5} more
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t flex gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || !minimumStockLevel}
            className="flex-1"
          >
            {isSaving ? 'Saving...' : 'Save Rule'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};


