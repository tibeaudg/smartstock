/**
 * Category Selection Modal
 * Allows users to change the category for a product
 */

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCategories } from '@/hooks/useCategories';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { toast } from 'sonner';
import { Package, Tag } from 'lucide-react';

interface CategorySelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    category_id: string | null;
    category_name: string | null;
  };
  onCategorySet: () => void;
}

export const CategorySelectionModal: React.FC<CategorySelectionModalProps> = ({
  isOpen,
  onClose,
  product,
  onCategorySet,
}) => {
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('__none__');
  const [isSetting, setIsSetting] = useState(false);

  // Set initial category selection when modal opens
  React.useEffect(() => {
    if (isOpen) {
      if (product.category_id) {
        setSelectedCategoryId(product.category_id);
      } else {
        setSelectedCategoryId('__none__');
      }
    }
  }, [isOpen, product.category_id]);

  const handleSetCategory = async () => {
    if (!user || !activeBranch) {
      toast.error('User or branch not found');
      return;
    }

    // If the selected category is the same as current category, just close
    if (selectedCategoryId === product.category_id || (selectedCategoryId === '__none__' && !product.category_id)) {
      toast.info('Product already has this category');
      onClose();
      return;
    }

    setIsSetting(true);

    try {
      const categoryId = selectedCategoryId === '__none__' ? null : selectedCategoryId;
      const selectedCategory = categories.find(c => c.id === categoryId);
      const categoryName = selectedCategory ? selectedCategory.name : null;

      const { error } = await supabase
        .from('products')
        .update({ 
          category_id: categoryId,
          category_name: categoryName,
          updated_at: new Date().toISOString()
        })
        .eq('id', product.id)
        .eq('branch_id', activeBranch.branch_id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error setting category:', error);
        toast.error(`Failed to set category: ${error.message}`);
        return;
      }

      toast.success(categoryName ? `Category set to ${categoryName}` : 'Category removed from product');
      onCategorySet();
      onClose();
    } catch (error) {
      console.error('Error setting category:', error);
      toast.error('Failed to set category');
    } finally {
      setIsSetting(false);
    }
  };

  const handleRemoveCategory = async () => {
    if (!user || !activeBranch) {
      toast.error('User or branch not found');
      return;
    }

    setIsSetting(true);

    try {
      const { error } = await supabase
        .from('products')
        .update({ 
          category_id: null,
          category_name: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', product.id)
        .eq('branch_id', activeBranch.branch_id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error removing category:', error);
        toast.error(`Failed to remove category: ${error.message}`);
        return;
      }

      toast.success('Category removed from product');
      onCategorySet();
      onClose();
    } catch (error) {
      console.error('Error removing category:', error);
      toast.error('Failed to remove category');
    } finally {
      setIsSetting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="w-5 h-5" />
            Set Product Category
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Product Info */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Product</div>
            <div className="font-semibold text-gray-900 dark:text-gray-100">{product.name}</div>
            {product.category_name && (
              <div className="mt-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Package className="w-4 h-4" />
                <span>Current category: <span className="font-medium">{product.category_name}</span></span>
              </div>
            )}
            {!product.category_name && (
              <div className="mt-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500">
                <Package className="w-4 h-4" />
                <span>No category assigned</span>
              </div>
            )}
          </div>

          {/* Category Selection */}
          <div className="space-y-2">
            <Label htmlFor="category">Select Category</Label>
            {categoriesLoading ? (
              <div className="text-sm text-gray-500">Loading categories...</div>
            ) : categories.length === 0 ? (
              <div className="text-sm text-gray-500">
                No categories available. Create a category first in the Products page.
              </div>
            ) : (
              <Select
                value={selectedCategoryId}
                onValueChange={setSelectedCategoryId}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">No Category</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Select the category for this product
            </p>
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between">
          <div>
            {product.category_id && (
              <Button
                variant="outline"
                onClick={handleRemoveCategory}
                disabled={isSetting}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Remove Category
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} disabled={isSetting}>
              Cancel
            </Button>
            <Button 
              onClick={handleSetCategory} 
              disabled={isSetting || categoriesLoading || categories.length === 0}
            >
              {isSetting ? 'Setting...' : 'Set Category'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

