import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Plus, Minus } from 'lucide-react';
import { useMobile } from '@/hooks/use-mobile';
import { usePageRefresh } from '@/hooks/usePageRefresh';

interface Product {
  id: string;
  name: string;
  description: string | null;
  quantity_in_stock: number;
  minimum_stock_level: number;
  unit_price: number;
  status: string | null;
  branch_id?: string;
  image_url?: string | null;
  is_variant?: boolean;
  variant_name?: string | null;
}

interface EditProductStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductUpdated: () => void;
  product: Product;
  actionType?: 'in' | 'out'; // Made optional since we'll handle it internally
  onBack?: () => void; // New prop for back navigation
}

export const EditProductStockModal = ({
  isOpen,
  onClose,
  onProductUpdated,
  product,
  actionType: initialActionType = 'in',
  onBack
}: EditProductStockModalProps) => {
  const [quantity, setQuantity] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [currentActionType, setCurrentActionType] = useState<'in' | 'out'>(initialActionType);
  const queryClient = useQueryClient();
  const { isMobile } = useMobile();
  
  // Gebruik de page refresh hook
  usePageRefresh();

  useEffect(() => {
    if (isOpen) {
      setQuantity('');
      setCurrentActionType(initialActionType);
    }
  }, [isOpen, initialActionType]);

  if (!isOpen) return null;

  const actionTitle = currentActionType === 'in' ? 'Add Stock' : 'Remove Stock';
  const actionColor = currentActionType === 'in' ? 'text-green-600' : 'text-red-600';

  const handleSubmit = async () => {
    if (!quantity || parseInt(quantity) <= 0) {
      toast.error('Enter a valid quantity');
      return;
    }
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not logged in');
      const numericQuantity = parseInt(quantity);
      const newQuantity = currentActionType === 'in'
        ? product.quantity_in_stock + numericQuantity
        : product.quantity_in_stock - numericQuantity;
      if (currentActionType === 'out' && newQuantity < 0) {
        toast.error('Not enough stock available');
        setLoading(false);
        return;
      }
        const { error: transactionError } = await supabase
        .from('stock_transactions')
        .insert({
          product_id: product.id,
          product_name: product.is_variant && product.variant_name ? `${product.name} - ${product.variant_name}` : product.name,
          transaction_type: currentActionType === 'in' ? 'incoming' : 'outgoing',
          quantity: numericQuantity,
          unit_price: product.unit_price,
          reference_number: `STOCK_${currentActionType?.toUpperCase()}_${Date.now()}`,
          notes: `Stock ${currentActionType === 'in' ? 'added' : 'removed'} via stock management`,
          user_id: user.id, // Behoud user_id voor backward compatibility
          created_by: user.id, // Nieuwe kolom voor relaties
          branch_id: product.branch_id,
          variant_id: product.is_variant ? product.id : null,
          variant_name: product.is_variant ? product.variant_name : null
        });
      if (transactionError) {
        throw new Error(`Error creating transaction: ${transactionError.message}`);
      }
      const { error: updateError } = await supabase
        .from('products')
        .update({
          quantity_in_stock: newQuantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', product.id);
      if (updateError) {
        throw new Error(`Error updating stock: ${updateError.message}`);
      }
      toast.success(`Stock successfully ${currentActionType === 'in' ? 'added' : 'removed'}`);
      onProductUpdated();
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['stockTransactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardData'] });
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred while updating stock');
    } finally {
      setLoading(false);
      setQuantity('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${isMobile ? 'w-full max-w-full mx-auto p-6 h-full max-h-full rounded-none bg-gray-50' : 'max-w-xs mx-auto px-14'}`}>
        <DialogHeader className={`${isMobile ? 'p-4 ' : ''}`}>
          
          <DialogTitle className={`flex items-center gap-2 ${isMobile ? 'text-center pr-8' : ''}`}>
            <span className={actionColor}>{actionTitle}: {product.name}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className={`${isMobile ? 'flex-1 overflow-y-auto p-4 bg-white rounded-lg' : 'py-4'}`}>
          <div className="grid gap-4">
            {/* Action Type Switcher */}
            <div className="grid gap-2">
              <div className={`flex rounded-lg border-2 ${currentActionType === 'in' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                <button
                  type="button"
                  onClick={() => setCurrentActionType('in')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-l-md transition-colors ${
                    currentActionType === 'in' 
                      ? 'bg-green-600 text-white' 
                      : 'text-green-700 hover:bg-green-100'
                  }`}
                >
                  <Plus className="w-4 h-4 " />
                  <span className="font-medium">Add Stock</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentActionType('out')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-r-md transition-colors ${
                    currentActionType === 'out' 
                      ? 'bg-red-600 text-white' 
                      : 'text-red-700 hover:bg-red-100'
                  }`}
                >
                  <Minus className="w-4 h-4" />
                  <span className="font-medium">Remove Stock</span>
                </button>
              </div>
            </div>

            {/* Quantity Input */}
            <div className="grid gap-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter quantity"
                min="1"
                className={`${isMobile ? 'text-lg' : ''} ${currentActionType === 'in' ? 'border-green-200 focus:border-green-500' : 'border-red-200 focus:border-red-500'}`}
              />
            </div>
            
              {isMobile && (
              <div className={`p-4 rounded-lg ${currentActionType === 'in' ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className="text-sm text-gray-600 mb-2">Current stock</div>
                <div className="text-2xl font-bold">{product.quantity_in_stock}</div>
                <div className={`text-sm mt-1 ${currentActionType === 'in' ? 'text-green-700' : 'text-red-700'}`}>
                  {currentActionType === 'in' 
                    ? `After adding: ${product.quantity_in_stock + (parseInt(quantity) || 0)}`
                    : `After removing: ${product.quantity_in_stock - (parseInt(quantity) || 0)}`
                  }
                </div>
              </div>
            )}

          </div>
        </div>

        <div className={`${isMobile ? 'p-4 bg-gray-50' : ''}`}>
          <div className={`flex gap-2 ${isMobile ? 'flex-col' : 'justify-end'}`}>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className={`${currentActionType === 'in' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} ${isMobile ? 'w-full' : ''}`}
            >
              {loading ? 'Processing...' : currentActionType === 'in' ? 'Add Stock' : 'Remove Stock'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
