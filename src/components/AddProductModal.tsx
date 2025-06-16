
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { toast } from 'sonner';
import { SuggestionInput } from './SuggestionInput';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: () => void;
}

interface FormData {
  name: string;
  description: string;
  categoryName: string;
  supplierName: string;
  quantityInStock: number;
  minimumStockLevel: number;
  unitPrice: number;
}

export const AddProductModal = ({ isOpen, onClose, onProductAdded }: AddProductModalProps) => {
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [suppliers, setSuppliers] = useState<string[]>([]);

  const form = useForm<FormData>({
    defaultValues: {
      name: '',
      description: '',
      categoryName: '',
      supplierName: '',
      quantityInStock: 0,
      minimumStockLevel: 10,
      unitPrice: 0,
    },
  });

  const fetchSuggestions = async () => {
    try {
      // Fetch existing categories
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('name')
        .order('name');
      
      if (categoriesData) {
        setCategories(categoriesData.map(c => c.name));
      }

      // Fetch existing suppliers
      const { data: suppliersData } = await supabase
        .from('suppliers')
        .select('name')
        .order('name');
      
      if (suppliersData) {
        setSuppliers(suppliersData.map(s => s.name));
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

  const handleSubmit = async (data: FormData) => {
    if (!user || !activeBranch) {
      toast.error('Geen gebruiker of filiaal gevonden');
      return;
    }

    setLoading(true);
    try {
      console.log('Adding product for branch:', activeBranch.branch_id);
      
      let categoryId = null;
      let supplierId = null;

      // Handle category
      if (data.categoryName.trim()) {
        const { data: existingCategory } = await supabase
          .from('categories')
          .select('id')
          .eq('name', data.categoryName.trim())
          .single();

        if (existingCategory) {
          categoryId = existingCategory.id;
        } else {
          const { data: newCategory, error: categoryError } = await supabase
            .from('categories')
            .insert({ name: data.categoryName.trim() })
            .select('id')
            .single();

          if (categoryError) {
            console.error('Error creating category:', categoryError);
            toast.error('Failed to create category');
            return;
          }
          categoryId = newCategory.id;
        }
      }

      // Handle supplier
      if (data.supplierName.trim()) {
        const { data: existingSupplier } = await supabase
          .from('suppliers')
          .select('id')
          .eq('name', data.supplierName.trim())
          .single();

        if (existingSupplier) {
          supplierId = existingSupplier.id;
        } else {
          const { data: newSupplier, error: supplierError } = await supabase
            .from('suppliers')
            .insert({ name: data.supplierName.trim() })
            .select('id')
            .single();

          if (supplierError) {
            console.error('Error creating supplier:', supplierError);
            toast.error('Failed to create supplier');
            return;
          }
          supplierId = newSupplier.id;
        }
      }

      // Create product with branch_id
      const { error } = await supabase
        .from('products')
        .insert({
          name: data.name,
          description: data.description || null,
          category_id: categoryId,
          category_name: data.categoryName.trim() || null,
          supplier_id: supplierId,
          supplier_name: data.supplierName.trim() || null,
          quantity_in_stock: data.quantityInStock,
          minimum_stock_level: data.minimumStockLevel,
          unit_price: data.unitPrice,
          branch_id: activeBranch.branch_id, // CRUCIAL: Set the branch_id
        });

      if (error) {
        console.error('Error adding product:', error);
        toast.error('Failed to add product');
        return;
      }

      console.log('Product added successfully for branch:', activeBranch.branch_id);
      toast.success('Product added successfully!');
      form.reset();
      onProductAdded();
      onClose();
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  if (!activeBranch) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              rules={{ required: 'Product name is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter product name" disabled={loading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Enter product description" 
                      disabled={loading}
                      className="resize-none"
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="categoryName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <SuggestionInput
                        {...field}
                        label="Category"
                        suggestions={categories}
                        placeholder="Enter or select category"
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="supplierName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supplier</FormLabel>
                    <FormControl>
                      <SuggestionInput
                        {...field}
                        label="Supplier"
                        suggestions={suppliers}
                        placeholder="Enter or select supplier"
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="quantityInStock"
                rules={{ 
                  required: 'Quantity is required',
                  min: { value: 0, message: 'Quantity must be 0 or more' }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock Quantity *</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        min="0"
                        placeholder="0"
                        disabled={loading}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="minimumStockLevel"
                rules={{ 
                  required: 'Minimum stock level is required',
                  min: { value: 0, message: 'Minimum stock level must be 0 or more' }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Min. Level *</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        min="0"
                        placeholder="10"
                        disabled={loading}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unitPrice"
                rules={{ 
                  required: 'Unit price is required',
                  min: { value: 0, message: 'Unit price must be 0 or more' }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit Price *</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        disabled={loading}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Adding...' : 'Add Product'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
