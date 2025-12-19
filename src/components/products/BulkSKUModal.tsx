import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

interface BulkSKUModalProps {
  isOpen: boolean;
  onClose: () => void;
  productIds: string[];
  products: Array<{ id: string; name: string; category_name?: string | null; sku?: string | null }>;
}

export const BulkSKUModal: React.FC<BulkSKUModalProps> = ({
  isOpen,
  onClose,
  productIds,
  products,
}) => {
  const [mode, setMode] = useState<'auto' | 'edit'>('auto');
  const [prefix, setPrefix] = useState('');
  const [skuMap, setSkuMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  // Initialize SKU map when products change
  React.useEffect(() => {
    if (isOpen && products.length > 0) {
      const initialMap: Record<string, string> = {};
      products.forEach((product) => {
        initialMap[product.id] = product.sku || '';
      });
      setSkuMap(initialMap);
    }
  }, [isOpen, products]);

  // Auto-generate SKU format: PREFIX-YYYYMMDD-### or CAT-YYYYMMDD-###
  const generateSKU = (product: { id: string; name: string; category_name?: string | null }, index: number): string => {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const categoryPrefix = (product.category_name || 'PROD')
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, 3);
    const finalPrefix = prefix.trim() || categoryPrefix;
    const number = String(index + 1).padStart(3, '0');
    return `${finalPrefix}-${dateStr}-${number}`;
  };

  const handleAutoGenerate = () => {
    const newMap: Record<string, string> = {};
    products.forEach((product, index) => {
      newMap[product.id] = generateSKU(product, index);
    });
    setSkuMap(newMap);
    setMode('edit'); // Switch to edit mode to show generated SKUs
  };

  const handleSave = async () => {
    if (productIds.length === 0) {
      toast.error('No products selected');
      return;
    }

    setLoading(true);
    try {
      // Batch update products with their SKUs
      const updates = Object.entries(skuMap).map(([productId, sku]) =>
        supabase
          .from('products')
          .update({ sku: sku.trim() || null })
          .eq('id', productId)
      );

      const results = await Promise.all(updates);
      const errors = results.filter(r => r.error);

      if (errors.length > 0) {
        throw new Error(`Failed to update ${errors.length} product(s)`);
      }

      toast.success(`Updated SKUs for ${productIds.length} product(s)`);
      queryClient.invalidateQueries({ queryKey: ['productsByCategories'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      onClose();
    } catch (error) {
      console.error('Error updating SKUs:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update SKUs');
    } finally {
      setLoading(false);
    }
  };

  const handleSKUChange = (productId: string, value: string) => {
    setSkuMap(prev => ({ ...prev, [productId]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Bulk SKU Management</DialogTitle>
          <p className="text-sm text-gray-500 mt-1">
            Auto-generate or edit SKUs for {productIds.length} selected product(s)
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          <RadioGroup value={mode} onValueChange={(v) => setMode(v as 'auto' | 'edit')} className="mb-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="auto" id="auto" />
              <Label htmlFor="auto" className="cursor-pointer">Auto-generate SKUs</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="edit" id="edit" />
              <Label htmlFor="edit" className="cursor-pointer">Edit SKUs manually</Label>
            </div>
          </RadioGroup>

          {mode === 'auto' && (
            <div className="mb-4">
              <Label htmlFor="prefix">Prefix (optional)</Label>
              <Input
                id="prefix"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                placeholder="e.g., CAT (defaults to category prefix)"
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Format: PREFIX-YYYYMMDD-### (e.g., CAT-20240115-001)
              </p>
              <Button onClick={handleAutoGenerate} className="mt-2" variant="outline">
                Generate SKUs
              </Button>
            </div>
          )}

          {(mode === 'edit' || (mode === 'auto' && Object.keys(skuMap).length > 0)) && (
            <div className="flex-1 overflow-y-auto border rounded-lg p-4">
              <div className="space-y-3">
                {products.map((product) => (
                  <div key={product.id} className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{product.name}</p>
                      {product.category_name && (
                        <p className="text-xs text-gray-500">{product.category_name}</p>
                      )}
                    </div>
                    <Input
                      value={skuMap[product.id] || ''}
                      onChange={(e) => handleSKUChange(product.id, e.target.value)}
                      placeholder="Enter SKU"
                      className="w-48 font-mono text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading || Object.keys(skuMap).length === 0}>
            {loading ? 'Saving...' : 'Save SKUs'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
