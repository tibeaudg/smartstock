import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Minus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { usePageRefresh } from '@/hooks/usePageRefresh';

interface Product {
  id: string;
  name: string;
  description: string | null;
  quantity_in_stock: number;
  minimum_stock_level: number;
  unit_price: number;
  status: string | null;
  branch_id?: string; // Added branch_id as optional
  image_url?: string | null; // <-- toegevoegd
  is_variant?: boolean;
  variant_name?: string | null;
}

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductUpdated: () => void;
  product: Product;
  actionType?: 'in' | 'out';
}

export const EditProductModal = ({
  isOpen,
  onClose,
  onProductUpdated,
  product,
  actionType: initialActionType = 'in'
}: EditProductModalProps) => {
  const [quantity, setQuantity] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [currentActionType, setCurrentActionType] = useState<'in' | 'out'>(initialActionType);
  // Geen geavanceerde opties in deze modal; enkel quantity aanpassen
  const queryClient = useQueryClient();
  
  // Use the page refresh hook
  usePageRefresh();

  const form = useForm({
    defaultValues: {
      name: product.name,
      description: product.description || '',
      quantity_in_stock: product.quantity_in_stock,
      minimum_stock_level: product.minimum_stock_level,
      unit_price: product.unit_price,
    },
  });

  const handleSubmit = async () => {
    const numericQuantity = Number(quantity);

    if (!quantity || Number.isNaN(numericQuantity) || numericQuantity <= 0) {
      toast.error('Enter a valid quantity');
      return;
    }

    setLoading(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Not logged in');
      }

      const currentQuantity = Number(product.quantity_in_stock) || 0;
      const newQuantity = currentActionType === 'in' 
        ? currentQuantity + numericQuantity
        : currentQuantity - numericQuantity;

      // Validate stock levels
      if (currentActionType === 'out' && newQuantity < 0) {
        toast.error('Not enough stock available');
        setLoading(false);
        return;
      }

      // Create transaction with created_by field
      const { data: transactionData, error: transactionError } = await supabase
        .from('stock_transactions')
        .insert({
          product_id: product.id,
          product_name: product.is_variant && product.variant_name ? `${product.name} - ${product.variant_name}` : product.name,
          transaction_type: currentActionType === 'in' ? 'incoming' : 'outgoing',
          quantity: numericQuantity,
          unit_price: product.unit_price,
          reference_number: `STOCK_${currentActionType?.toUpperCase()}_${Date.now()}`,
          notes: `Stock ${currentActionType === 'in' ? 'added' : 'removed'} via product edit`,
          user_id: user.id, // Behoud user_id voor backward compatibility
          created_by: user.id, // Nieuwe kolom voor relaties
          branch_id: product.branch_id, // Add this if you have branch information
          variant_id: product.is_variant ? product.id : null,
          variant_name: product.is_variant ? product.variant_name : null
        })
        .select()
        .single();

      if (transactionError) {
        console.error('Transaction error:', transactionError);
        throw new Error(`Error creating transaction: ${transactionError.message}`);
      }

      // Then update the product quantity
      const { error: updateError } = await supabase
        .from('products')
        .update({ 
          quantity_in_stock: newQuantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', product.id);

      if (updateError) {
        console.error('Update error:', updateError);
        throw new Error(`Error updating stock: ${updateError.message}`);
      }

      toast.success(`Stock successfully ${currentActionType === 'in' ? 'added' : 'removed'}`);
      onProductUpdated();
      // Invalideer relevante queries zodat data automatisch wordt gerefetched
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['stockTransactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardData'] });
      onClose();
    } catch (error) {
      console.error('Error in stock update:', error);
      toast.error(error instanceof Error ? error.message : 'An error occurred while updating stock');
    } finally {
      setLoading(false);
      setQuantity('');
    }
  };

  // Geen geavanceerde info/afbeeldingsbewerking in deze modal

  useEffect(() => {
    if (isOpen) {
      setQuantity('');
      setCurrentActionType(initialActionType);
    }
  }, [isOpen, initialActionType]);

  if (!isOpen) return null;

  // Add this to show the action type
  const actionTitle = currentActionType === 'in' ? 'Add Stock' : 'Remove Stock';
  const actionColor = currentActionType === 'in' ? 'text-green-600' : 'text-red-600';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-150 max-h-[90vh] overflow-y-auto mx-auto px-4 sm:px-8">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className={actionColor}>{actionTitle}: {product.name}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-6">
          
          {/* Stock Operation Switcher */}
          <div className="grid gap-2">
            <Label>Stock Operation</Label>
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
                <Plus className="w-4 h-4" />
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

          {/* Voorraad Bewerking Sectie */}
          <div className={`border rounded-lg p-4 ${currentActionType === 'in' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <h3 className={`text-lg font-semibold mb-4 flex items-center ${currentActionType === 'in' ? 'text-green-800' : 'text-red-800'}`}>
              <div className={`w-3 h-3 rounded-full mr-2 ${currentActionType === 'in' ? 'bg-green-500' : 'bg-red-500'}`}></div>
              Stock {currentActionType === 'in' ? 'Add' : 'Remove'}
            </h3>
            <div className="grid gap-2">
              <Label htmlFor="quantity" className={`font-medium ${currentActionType === 'in' ? 'text-green-700' : 'text-red-700'}`}>
                Quantity
              </Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter quantity"
                min="1"
                className={`py-3 px-3 text-base ${currentActionType === 'in' ? 'border-green-200 focus:border-green-500' : 'border-red-200 focus:border-red-500'}`}
              />
            </div>
          </div>

          {/* Geavanceerde Opties niet nodig voor toevoegen/uithalen */}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={loading}
            className={currentActionType === 'in' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
          >
            {loading ? 'Processing...' : currentActionType === 'in' ? 'Add Stock' : 'Remove Stock'}
          </Button>
        </DialogFooter>        
      </DialogContent>
    </Dialog>
  );
};
