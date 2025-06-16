import { useState, useCallback } from 'react';
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

export const useStockMovement = (
  product: Product,
  onProductUpdated: () => void,
  onClose: () => void
) => {
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  const [loading, setLoading] = useState(false);
  const [transactionType, setTransactionType] = useState<'incoming' | 'outgoing'>('incoming');
  const [quantity, setQuantity] = useState('');

  const resetForm = useCallback(() => {
    setQuantity('');
    setTransactionType('incoming');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !activeBranch) {
      toast.error('User or branch information missing');
      return;
    }

    if (!quantity.trim()) {
      toast.error('Please enter a quantity');
      return;
    }

    const quantityNum = parseInt(quantity, 10);

    // Validation
    if (isNaN(quantityNum) || quantityNum <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    if (transactionType === 'outgoing' && quantityNum > product.quantity_in_stock) {
      toast.error('Cannot remove more stock than available');
      return;
    }

    setLoading(true);
    try {
      // Calculate new stock level
      const newQuantity = transactionType === 'incoming'
        ? product.quantity_in_stock + quantityNum
        : product.quantity_in_stock - quantityNum;

      const transactionData = {
        product_id: product.id,
        product_name: product.name,
        transaction_type: transactionType,
        quantity: quantityNum,
        unit_price: product.unit_price, // Use the product's existing unit price
        created_by: user.id,
        branch_id: activeBranch.branch_id
      };

      // Create the transaction
      const { error: transactionError } = await supabase
        .from('stock_transactions')
        .insert(transactionData);

      if (transactionError) {
        throw new Error(`Failed to create transaction: ${transactionError.message}`);
      }

      // Update product stock (without changing unit price)
      const { error: updateError } = await supabase
        .from('products')
        .update({
          quantity_in_stock: newQuantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', product.id);

      if (updateError) {
        throw new Error(`Failed to update product: ${updateError.message}`);
      }

      toast.success(
        transactionType === 'incoming'
          ? `Added ${quantityNum} items to stock`
          : `Removed ${quantityNum} items from stock`
      );

      onProductUpdated();
      onClose();
    } catch (error) {
      console.error('Error in stock movement:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to process stock movement');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    transactionType,
    quantity,
    setTransactionType,
    setQuantity,
    resetForm,
    handleSubmit
  };
};
