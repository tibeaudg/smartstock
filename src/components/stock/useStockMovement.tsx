
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
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

export const useStockMovement = (product: Product, onProductUpdated: () => void, onClose: () => void) => {
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  const [loading, setLoading] = useState(false);
  const [transactionType, setTransactionType] = useState<'incoming' | 'outgoing'>('outgoing');
  const [quantity, setQuantity] = useState('');
  const [unitPrice, setUnitPrice] = useState(product.unit_price.toString());
  const [notes, setNotes] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');

  const resetForm = () => {
    setQuantity('');
    setUnitPrice(product.unit_price.toString());
    setNotes('');
    setReferenceNumber('');
    setTransactionType('outgoing');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !quantity || !activeBranch) return;

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
      console.log('Creating stock movement for branch:', activeBranch.branch_id, { transactionType, quantity: quantityNum, unitPrice: unitPriceNum });

      // Calculate new stock level
      const newQuantity = transactionType === 'incoming' 
        ? product.quantity_in_stock + quantityNum
        : product.quantity_in_stock - quantityNum;

      // Create stock transaction with branch_id
      const { error: transactionError } = await supabase
        .from('stock_transactions')
        .insert({
          product_id: product.id,
          product_name: product.name,
          transaction_type: transactionType,
          quantity: quantityNum,
          unit_price: unitPriceNum,
          total_value: quantityNum * unitPriceNum,
          notes: notes || null,
          reference_number: referenceNumber || null,
          created_by: user.id,
          branch_id: activeBranch.branch_id // CRUCIAL: Set the branch_id
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

      console.log('Stock movement created successfully for branch:', activeBranch.branch_id);
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

  return {
    loading,
    transactionType,
    quantity,
    unitPrice,
    notes,
    referenceNumber,
    setTransactionType,
    setQuantity,
    setUnitPrice,
    setNotes,
    setReferenceNumber,
    resetForm,
    handleSubmit
  };
};
