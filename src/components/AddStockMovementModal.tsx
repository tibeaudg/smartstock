
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface AddStockMovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransactionAdded: () => void;
}

export const AddStockMovementModal = ({ isOpen, onClose, onTransactionAdded }: AddStockMovementModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [transactionType, setTransactionType] = useState<'incoming' | 'outgoing'>('incoming');
  const [productName, setProductName] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [unitPrice, setUnitPrice] = useState<string>('');
  const [referenceNumber, setReferenceNumber] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submission started');
    console.log('User:', user?.id);
    console.log('Product name:', productName);
    console.log('Quantity:', quantity);
    console.log('Transaction type:', transactionType);

    if (!user) {
      console.error('No user found');
      toast({
        title: 'Error',
        description: 'You must be logged in to add stock movements',
        variant: 'destructive',
      });
      return;
    }

    if (!productName.trim()) {
      console.error('No product name entered');
      toast({
        title: 'Error',
        description: 'Please enter a product name',
        variant: 'destructive',
      });
      return;
    }

    if (!quantity || parseInt(quantity) <= 0) {
      console.error('Invalid quantity');
      toast({
        title: 'Error',
        description: 'Please enter a valid quantity',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const quantityNum = parseInt(quantity);
      const unitPriceNum = unitPrice ? parseFloat(unitPrice) : null;
      const totalValue = unitPriceNum ? quantityNum * unitPriceNum : null;

      console.log('Creating transaction with data:', {
        product_name: productName.trim(),
        transaction_type: transactionType,
        quantity: quantityNum,
        unit_price: unitPriceNum,
        total_value: totalValue,
        created_by: user.id,
        reference_number: referenceNumber || null,
        notes: notes || null,
      });

      // Insert the stock transaction
      const { data: transactionData, error: transactionError } = await supabase
        .from('stock_transactions')
        .insert({
          product_name: productName.trim(),
          transaction_type: transactionType,
          quantity: quantityNum,
          unit_price: unitPriceNum,
          total_value: totalValue,
          created_by: user.id,
          reference_number: referenceNumber || null,
          notes: notes || null,
        })
        .select();

      if (transactionError) {
        console.error('Error creating transaction:', transactionError);
        toast({
          title: 'Error',
          description: `Failed to create stock movement: ${transactionError.message}`,
          variant: 'destructive',
        });
        return;
      }

      console.log('Transaction created successfully:', transactionData);

      toast({
        title: 'Success',
        description: 'Stock movement added successfully',
      });

      // Reset form
      setTransactionType('incoming');
      setProductName('');
      setQuantity('');
      setUnitPrice('');
      setReferenceNumber('');
      setNotes('');

      onTransactionAdded();
    } catch (error) {
      console.error('Error creating stock movement:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = productName.trim() && quantity && parseInt(quantity) > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Stock Movement</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex space-x-2">
            <Button
              type="button"
              variant={transactionType === 'incoming' ? 'default' : 'outline'}
              onClick={() => setTransactionType('incoming')}
              className="flex-1"
            >
              In
            </Button>
            <Button
              type="button"
              variant={transactionType === 'outgoing' ? 'default' : 'outline'}
              onClick={() => setTransactionType('outgoing')}
              className="flex-1"
            >
              Out
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="product">Product Name</Label>
            <Input
              id="product"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Enter product name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="unitPrice">Unit Price (optional)</Label>
            <Input
              id="unitPrice"
              type="number"
              step="0.01"
              min="0"
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reference">Reference Number (optional)</Label>
            <Input
              id="reference"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !isFormValid}>
              {loading ? 'Adding...' : 'Add Movement'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
