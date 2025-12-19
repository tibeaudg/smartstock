import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { HierarchicalCategorySelector } from '@/components/categories/HierarchicalCategorySelector';

interface BulkCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  productIds: string[];
  products: Array<{ id: string; name: string; category_id?: string | null; category_name?: string | null }>;
}

export const BulkCategoryModal: React.FC<BulkCategoryModalProps> = ({
  isOpen,
  onClose,
  productIds,
  products,
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleSave = async () => {
    if (productIds.length === 0) {
      toast.error('No products selected');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('products')
        .update({ category_id: selectedCategoryId })
        .in('id', productIds);

      if (error) throw error;

      toast.success(`Updated category for ${productIds.length} product(s)`);
      queryClient.invalidateQueries({ queryKey: ['productsByCategories'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['categoryProductCounts'] });
      onClose();
    } catch (error) {
      console.error('Error updating categories:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update categories');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Bulk Category Assignment</DialogTitle>
          <p className="text-sm text-gray-500 mt-1">
            Assign category to {productIds.length} selected product(s)
          </p>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="category-select">Category</Label>
            <HierarchicalCategorySelector
              value={selectedCategoryId}
              onValueChange={(id) => setSelectedCategoryId(id || null)}
              placeholder="Select category..."
              allowCreate={false}
            />
            <p className="text-xs text-gray-500 mt-1">
              Leave empty to remove category from selected products
            </p>
          </div>

          {products.length > 0 && (
            <div className="border rounded-lg p-3 max-h-48 overflow-y-auto">
              <p className="text-xs font-medium text-gray-700 mb-2">Selected products:</p>
              <div className="space-y-1">
                {products.slice(0, 10).map((product) => (
                  <p key={product.id} className="text-xs text-gray-600 truncate">
                    {product.name}
                  </p>
                ))}
                {products.length > 10 && (
                  <p className="text-xs text-gray-500 italic">
                    ...and {products.length - 10} more
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Assign Category'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

