import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  description: string | null;
  quantity_in_stock: number;
  minimum_stock_level: number;
  unit_price: number;
  purchase_price: number;
  sale_price: number;
  status: string | null;
  image_url?: string | null; // <-- toegevoegd
  is_variant?: boolean;
  variant_name?: string | null;
}

export const useStockMovement = (
  product: Product,
  onProductUpdated: () => void,
  onClose: () => void
) => {
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  const queryClient = useQueryClient();
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

    const quantityNum = Number(quantity);

    // Validation
    if (Number.isNaN(quantityNum) || quantityNum <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    const currentQuantity = Number(product.quantity_in_stock) || 0;

    if (transactionType === 'outgoing' && quantityNum > currentQuantity) {
      toast.error('Cannot remove more stock than available');
      return;
    }

    setLoading(true);
    try {
      // Calculate new stock level
      const newQuantity = transactionType === 'incoming'
        ? currentQuantity + quantityNum
        : currentQuantity - quantityNum;

      const transactionData = {
        product_id: product.id,
        product_name: product.is_variant && product.variant_name ? `${product.name} - ${product.variant_name}` : product.name,
        transaction_type: 'manual_adjustment' as const,
        quantity: quantityNum,
        unit_price: transactionType === 'incoming' ? product.purchase_price : product.sale_price,
        user_id: user.id, // Behoud user_id voor backward compatibility
        created_by: user.id, // Nieuwe kolom voor relaties
        branch_id: activeBranch.branch_id,
        reference_number: `MANUAL_${transactionType.toUpperCase()}`,
        notes: `Handmatige ${transactionType === 'incoming' ? 'toevoeging' : 'verwijdering'} van voorraad`,
        variant_id: product.is_variant ? product.id : null,
        variant_name: product.is_variant ? product.variant_name : null,
        adjustment_method: 'manual' as const
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

      // Invalidate stock transactions query to refresh the movements list
      queryClient.invalidateQueries({ queryKey: ['stockTransactions'] });
      
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
