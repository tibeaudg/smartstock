
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SuggestionInput } from './SuggestionInput';
import { toast } from 'sonner';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: () => void;
}

export const AddProductModal = ({ isOpen, onClose, onProductAdded }: AddProductModalProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [categorySuggestions, setCategorySuggestions] = useState<string[]>([]);
  const [supplierSuggestions, setSupplierSuggestions] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    unit_price: '',
    quantity_in_stock: '',
    minimum_stock_level: '',
    category_name: '',
    supplier_name: '',
  });

  const fetchSuggestions = async () => {
    try {
      const [categoriesResult, suppliersResult] = await Promise.all([
        supabase.from('categories').select('name').order('name'),
        supabase.from('suppliers').select('name').order('name')
      ]);

      if (categoriesResult.data) {
        setCategorySuggestions(categoriesResult.data.map(cat => cat.name));
      }
      if (suppliersResult.data) {
        setSupplierSuggestions(suppliersResult.data.map(sup => sup.name));
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchSuggestions();
    }
  }, [isOpen]);

  const saveToLookupTables = async (categoryName: string, supplierName: string) => {
    const promises = [];

    // Save category if it doesn't exist
    if (categoryName && !categorySuggestions.includes(categoryName)) {
      promises.push(
        supabase
          .from('categories')
          .insert({ name: categoryName })
          .select()
          .single()
      );
    }

    // Save supplier if it doesn't exist
    if (supplierName && !supplierSuggestions.includes(supplierName)) {
      promises.push(
        supabase
          .from('suppliers')
          .insert({ name: supplierName })
          .select()
          .single()
      );
    }

    if (promises.length > 0) {
      try {
        await Promise.all(promises);
      } catch (error) {
        console.error('Error saving to lookup tables:', error);
        // Don't fail the product creation if lookup table updates fail
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      console.log('Creating product with data:', formData);

      const unitPrice = formData.unit_price ? parseFloat(formData.unit_price) : 0;
      const quantityInStock = formData.quantity_in_stock ? parseInt(formData.quantity_in_stock) : 0;
      const minimumStockLevel = formData.minimum_stock_level ? parseInt(formData.minimum_stock_level) : 0;

      // Save to lookup tables first
      await saveToLookupTables(formData.category_name, formData.supplier_name);

      const { data, error } = await supabase
        .from('products')
        .insert({
          name: formData.name,
          description: formData.description || null,
          unit_price: unitPrice,
          quantity_in_stock: quantityInStock,
          minimum_stock_level: minimumStockLevel,
          category_name: formData.category_name || null,
          supplier_name: formData.supplier_name || null,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating product:', error);
        toast.error('Failed to create product');
        return;
      }

      console.log('Product created successfully:', data);

      // Create initial stock transaction if there's stock
      if (quantityInStock > 0) {
        const { error: transactionError } = await supabase
          .from('stock_transactions')
          .insert({
            product_id: data.id,
            product_name: formData.name,
            transaction_type: 'incoming',
            quantity: quantityInStock,
            unit_price: unitPrice,
            notes: 'Initial stock - product created',
            created_by: user.id
          });

        if (transactionError) {
          console.error('Error creating initial stock transaction:', transactionError);
          // Don't fail the product creation for this
        }
      }

      toast.success('Product created successfully');
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        unit_price: '',
        quantity_in_stock: '',
        minimum_stock_level: '',
        category_name: '',
        supplier_name: '',
      });

      onProductAdded();
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name *
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Enter product name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <Input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter description (optional)"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit Price
              </label>
              <Input
                type="number"
                step="0.01"
                value={formData.unit_price}
                onChange={(e) => setFormData({ ...formData, unit_price: e.target.value })}
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Initial Stock
              </label>
              <Input
                type="number"
                value={formData.quantity_in_stock}
                onChange={(e) => setFormData({ ...formData, quantity_in_stock: e.target.value })}
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Stock Level
            </label>
            <Input
              type="number"
              value={formData.minimum_stock_level}
              onChange={(e) => setFormData({ ...formData, minimum_stock_level: e.target.value })}
              placeholder="0"
            />
          </div>

          <SuggestionInput
            value={formData.category_name}
            onChange={(value) => setFormData({ ...formData, category_name: value })}
            suggestions={categorySuggestions}
            placeholder="Enter category (optional)"
            label="Category"
          />

          <SuggestionInput
            value={formData.supplier_name}
            onChange={(value) => setFormData({ ...formData, supplier_name: value })}
            suggestions={supplierSuggestions}
            placeholder="Enter supplier (optional)"
            label="Supplier"
          />

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Product'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
