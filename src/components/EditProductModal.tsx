
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
  description: string | null;
  quantity_in_stock: number;
  minimum_stock_level: number;
  unit_price: number;
  status: string | null;
  categories: {
    name: string;
  } | null;
  suppliers: {
    name: string;
  } | null;
}

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductUpdated: () => void;
  product: Product;
}

export const EditProductModal = ({ isOpen, onClose, onProductUpdated, product }: EditProductModalProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [transactionType, setTransactionType] = useState<'incoming' | 'outgoing'>('outgoing');
  const [quantity, setQuantity] = useState('');
  const [unitPrice, setUnitPrice] = useState(product.unit_price.toString());
  const [notes, setNotes] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');

  useEffect(() => {
    if (isOpen) {
      setQuantity('');
      setUnitPrice(product.unit_price.toString());
      setNotes('');
      setReferenceNumber('');
      setTransactionType('outgoing');
    }
  }, [isOpen, product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !quantity) return;

    const quantityNum = parseInt(quantity);
    const unitPriceNum = parseFloat(unitPrice);

    if (quantityNum <= 0) {
      toast.error('Quantity must be greater than 0');
      return;
    }

    if (transactionType === 'outgoing' && quantityNum > product.quantity_in_stock) {
      toast.error('Cannot remove more stock than available');
      return;
    }

    setLoading(true);
    try {
      console.log('Creating stock movement:', { transactionType, quantity: quantityNum, unitPrice: unitPriceNum });

      // Calculate new stock level
      const newQuantity = transactionType === 'incoming' 
        ? product.quantity_in_stock + quantityNum
        : product.quantity_in_stock - quantityNum;

      // Create stock transaction without total_value (it's a generated column)
      const { error: transactionError } = await supabase
        .from('stock_transactions')
        .insert({
          product_id: product.id,
          product_name: product.name,
          transaction_type: transactionType,
          quantity: quantityNum,
          unit_price: unitPriceNum,
          notes: notes || null,
          reference_number: referenceNumber || null,
          created_by: user.id
        });

      if (transactionError) {
        console.error('Error creating transaction:', transactionError);
        toast.error('Failed to create stock movement');
        return;
      }

      // Update product stock
      const { error: updateError } = await supabase
        .from('products')
        .update({
          quantity_in_stock: newQuantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', product.id);

      if (updateError) {
        console.error('Error updating product:', updateError);
        toast.error('Failed to update product stock');
        return;
      }

      console.log('Stock movement created successfully');
      toast.success(`Stock ${transactionType === 'incoming' ? 'added' : 'removed'} successfully`);
      
      onProductUpdated();
      onClose();
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
          <DialogTitle>Stock Movement - {product.name}</DialogTitle>
        </DialogHeader>

        <div className="mb-4 p-3 bg-gray-50 rounded">
          <p className="text-sm text-gray-600">
            Current Stock: <span className="font-medium">{product.quantity_in_stock}</span>
          </p>
          <p className="text-sm text-gray-600">
            Unit Price: <span className="font-medium">${product.unit_price.toFixed(2)}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Movement Type *
            </label>
            <Select value={transactionType} onValueChange={(value: 'incoming' | 'outgoing') => setTransactionType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="incoming">Add Stock (Incoming)</SelectItem>
                <SelectItem value="outgoing">Remove Stock (Outgoing)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity *
            </label>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              placeholder="Enter quantity"
              min="1"
              max={transactionType === 'outgoing' ? product.quantity_in_stock : undefined}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unit Price
            </label>
            <Input
              type="number"
              step="0.01"
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reference Number
            </label>
            <Input
              type="text"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              placeholder="Invoice #, PO #, etc. (optional)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <Input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes (optional)"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Processing...' : `${transactionType === 'incoming' ? 'Add' : 'Remove'} Stock`}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
