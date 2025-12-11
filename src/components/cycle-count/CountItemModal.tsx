import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { toast } from 'sonner';
import { Scan } from 'lucide-react';
import { CycleCountItem } from '@/types/stockTypes';
import { Product } from '@/types/stockTypes';

interface CountItemModalProps {
  cycleCountId: string;
  item: CycleCountItem | null;
  isOpen: boolean;
  onClose: () => void;
  onItemUpdated: () => void;
}

export const CountItemModal = ({
  cycleCountId,
  item,
  isOpen,
  onClose,
  onItemUpdated
}: CountItemModalProps) => {
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  const [loading, setLoading] = useState(false);
  const [productId, setProductId] = useState(item?.product_id || '');
  const [countedQuantity, setCountedQuantity] = useState(item?.counted_quantity || 0);
  const [countingMethod, setCountingMethod] = useState<'manual' | 'scan'>('manual');
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (isOpen && activeBranch?.branch_id) {
      fetchProducts();
      if (item) {
        setProductId(item.product_id || '');
        setCountedQuantity(item.counted_quantity);
        setCountingMethod(item.counting_method || 'manual');
      }
    }
  }, [isOpen, activeBranch?.branch_id, item]);

  const fetchProducts = async () => {
    if (!activeBranch?.branch_id) return;
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('branch_id', activeBranch.branch_id)
      .order('name');

    if (error) {
      console.error('Error fetching products:', error);
      return;
    }

    setProducts(data || []);
  };

  const handleSubmit = async () => {
    if (!user || !activeBranch) {
      toast.error('User or branch information missing');
      return;
    }

    if (!productId) {
      toast.error('Please select a product');
      return;
    }

    if (countedQuantity < 0) {
      toast.error('Counted quantity cannot be negative');
      return;
    }

    setLoading(true);
    try {
      const product = products.find(p => p.id === productId);
      if (!product) {
        toast.error('Product not found');
        return;
      }

      const expectedQuantity = product.quantity_in_stock;
      const variance = countedQuantity - expectedQuantity;
      const varianceValue = variance * (product.unit_price || 0);

      if (item?.id) {
        // Update existing item
        const { error } = await supabase
          .from('cycle_count_items')
          .update({
            counted_quantity: countedQuantity,
            variance: variance,
            variance_value: varianceValue,
            counting_method: countingMethod,
            counted_by: user.id,
            counted_at: new Date().toISOString(),
          })
          .eq('id', item.id);

        if (error) throw error;
      } else {
        // Create new item
        const { error } = await supabase
          .from('cycle_count_items')
          .insert({
            cycle_count_id: cycleCountId,
            product_id: productId,
            variant_id: null,
            expected_quantity: expectedQuantity,
            counted_quantity: countedQuantity,
            variance: variance,
            variance_value: varianceValue,
            counting_method: countingMethod,
            counted_by: user.id,
            counted_at: new Date().toISOString(),
          });

        if (error) throw error;
      }

      // Update cycle count totals
      const { data: countItems } = await supabase
        .from('cycle_count_items')
        .select('variance')
        .eq('cycle_count_id', cycleCountId);

      const discrepancyCount = countItems?.filter(item => item.variance !== 0).length || 0;
      const totalItemsCounted = countItems?.length || 0;

      await supabase
        .from('cycle_counts')
        .update({
          discrepancy_count: discrepancyCount,
          total_items_counted: totalItemsCounted,
          status: 'in_progress',
        })
        .eq('id', cycleCountId);

      toast.success('Item counted successfully');
      onItemUpdated();
      onClose();
    } catch (error) {
      console.error('Error counting item:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to count item');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const selectedProduct = products.find(p => p.id === productId);
  const expectedQuantity = selectedProduct?.quantity_in_stock || 0;
  const variance = countedQuantity - expectedQuantity;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{item ? 'Update Count Item' : 'Add Count Item'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="product">Product *</Label>
            <select
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              value={productId}
              onChange={(e) => {
                setProductId(e.target.value);
                const product = products.find(p => p.id === e.target.value);
                if (product && !item) {
                  setCountedQuantity(product.quantity_in_stock);
                }
              }}
              disabled={!!item}
            >
              <option value="">Select product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} (Expected: {product.quantity_in_stock})
                </option>
              ))}
            </select>
          </div>

          {selectedProduct && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-500">Expected Quantity</Label>
                  <p className="text-lg font-semibold">{expectedQuantity}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Variance</Label>
                  <p className={`text-lg font-semibold ${variance > 0 ? 'text-green-600' : variance < 0 ? 'text-red-600' : ''}`}>
                    {variance > 0 ? '+' : ''}{variance}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="countedQuantity">Counted Quantity *</Label>
            <Input
              id="countedQuantity"
              type="number"
              min="0"
              value={countedQuantity}
              onChange={(e) => setCountedQuantity(parseInt(e.target.value) || 0)}
            />
          </div>

          <div>
            <Label htmlFor="countingMethod">Counting Method</Label>
            <Select value={countingMethod} onValueChange={(value: 'manual' | 'scan') => setCountingMethod(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="scan">Scan (Barcode)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : 'Save Count'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

