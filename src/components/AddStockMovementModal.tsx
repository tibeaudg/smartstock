
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  sku: string;
  quantity_in_stock: number;
}

interface AddStockMovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransactionAdded: () => void;
}

export const AddStockMovementModal = ({ isOpen, onClose, onTransactionAdded }: AddStockMovementModalProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  const [formData, setFormData] = useState({
    product_id: '',
    transaction_type: 'incoming' as 'incoming' | 'outgoing',
    quantity: '',
    unit_price: '',
    reference_number: '',
    notes: '',
  });

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, sku, quantity_in_stock')
        .order('name');

      if (error) {
        console.error('Error fetching products:', error);
        return;
      }

      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchProducts();
    }
  }, [isOpen]);

  const ensureUserProfile = async () => {
    if (!user) return false;

    try {
      // Check if profile exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error checking profile:', fetchError);
        return false;
      }

      if (!existingProfile) {
        console.log('No profile found for user, creating default profile...');
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email || '',
            first_name: user.user_metadata?.first_name || null,
            last_name: user.user_metadata?.last_name || null,
            role: 'staff'
          });

        if (insertError) {
          console.error('Error creating profile:', insertError);
          return false;
        }
        console.log('Profile created successfully');
      }

      return true;
    } catch (error) {
      console.error('Error ensuring user profile:', error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // Ensure user profile exists
      const profileExists = await ensureUserProfile();
      if (!profileExists) {
        toast.error('Failed to create user profile');
        return;
      }

      console.log('Creating stock movement with data:', formData);

      const selectedProduct = products.find(p => p.id === formData.product_id);
      const quantity = parseInt(formData.quantity);
      const unitPrice = formData.unit_price ? parseFloat(formData.unit_price) : null;
      const totalValue = unitPrice ? quantity * unitPrice : null;

      // Start a database transaction
      const { data: transactionData, error: transactionError } = await supabase.rpc('begin_transaction');
      
      if (transactionError) {
        console.error('Error starting transaction:', transactionError);
        toast.error('Failed to create stock movement');
        return;
      }

      // Create the stock transaction
      const { data: stockTransaction, error: stockError } = await supabase
        .from('stock_transactions')
        .insert({
          product_id: formData.product_id,
          product_name: selectedProduct?.name || '',
          transaction_type: formData.transaction_type,
          quantity: quantity,
          unit_price: unitPrice,
          total_value: totalValue,
          reference_number: formData.reference_number || null,
          notes: formData.notes || null,
          created_by: user.id,
        })
        .select()
        .single();

      if (stockError) {
        console.error('Error creating stock transaction:', stockError);
        toast.error('Failed to create stock movement');
        return;
      }

      // Update the product quantity
      const currentStock = selectedProduct?.quantity_in_stock || 0;
      const newStock = formData.transaction_type === 'incoming' 
        ? currentStock + quantity 
        : currentStock - quantity;

      const { error: updateError } = await supabase
        .from('products')
        .update({ 
          quantity_in_stock: Math.max(0, newStock), // Ensure stock doesn't go negative
          updated_at: new Date().toISOString()
        })
        .eq('id', formData.product_id);

      if (updateError) {
        console.error('Error updating product stock:', updateError);
        toast.error('Stock movement created but failed to update product quantity');
      } else {
        console.log('Stock movement created and product quantity updated successfully');
        toast.success('Stock movement created successfully');
      }

      // Reset form
      setFormData({
        product_id: '',
        transaction_type: 'incoming',
        quantity: '',
        unit_price: '',
        reference_number: '',
        notes: '',
      });

      onTransactionAdded();
    } catch (error) {
      console.error('Error creating stock movement:', error);
      toast.error('Failed to create stock movement');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Stock Movement</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product *
            </label>
            <Select value={formData.product_id} onValueChange={(value) => setFormData({ ...formData, product_id: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name} ({product.sku}) - Current: {product.quantity_in_stock}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Movement Type *
            </label>
            <Select value={formData.transaction_type} onValueChange={(value: 'incoming' | 'outgoing') => setFormData({ ...formData, transaction_type: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="incoming">Incoming (Stock In)</SelectItem>
                <SelectItem value="outgoing">Outgoing (Stock Out)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity *
              </label>
              <Input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
                min="1"
                placeholder="0"
              />
            </div>

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
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reference Number
            </label>
            <Input
              type="text"
              value={formData.reference_number}
              onChange={(e) => setFormData({ ...formData, reference_number: e.target.value })}
              placeholder="Invoice #, PO #, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <Input
              type="text"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !formData.product_id || !formData.quantity}>
              {loading ? 'Creating...' : 'Create Movement'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
