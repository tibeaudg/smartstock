import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// Icons niet nodig in deze modal
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
  actionType
}: EditProductModalProps) => {
  const [quantity, setQuantity] = useState<string>('');
  const [loading, setLoading] = useState(false);
  // Geen geavanceerde opties in deze modal; enkel quantity aanpassen
  const queryClient = useQueryClient();
  
  // Gebruik de page refresh hook
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
    if (!quantity || parseInt(quantity) <= 0) {
      toast.error('Voer een geldig aantal in');
      return;
    }

    setLoading(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Niet ingelogd');
      }

      const numericQuantity = parseInt(quantity);
      const newQuantity = actionType === 'in' 
        ? product.quantity_in_stock + numericQuantity
        : product.quantity_in_stock - numericQuantity;

      // Validate stock levels
      if (actionType === 'out' && newQuantity < 0) {
        toast.error('Niet genoeg voorraad beschikbaar');
        setLoading(false);
        return;
      }

      // Create transaction with created_by field
      const { data: transactionData, error: transactionError } = await supabase
        .from('stock_transactions')
        .insert({
          product_id: product.id,
          product_name: product.is_variant && product.variant_name ? `${product.name} - ${product.variant_name}` : product.name,
          transaction_type: actionType === 'in' ? 'incoming' : 'outgoing',
          quantity: numericQuantity,
          unit_price: product.unit_price,
          reference_number: `STOCK_${actionType?.toUpperCase()}_${Date.now()}`,
          notes: `Stock ${actionType === 'in' ? 'added' : 'removed'} via product edit`,
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
        throw new Error(`Fout bij het maken van de transactie: ${transactionError.message}`);
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
        throw new Error(`Fout bij het bijwerken van de voorraad: ${updateError.message}`);
      }

      toast.success(`Voorraad succesvol ${actionType === 'in' ? 'toegevoegd' : 'verwijderd'}`);
      onProductUpdated();
      // Invalideer relevante queries zodat data automatisch wordt gerefetched
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['stockTransactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardData'] });
      onClose();
    } catch (error) {
      console.error('Error in stock update:', error);
      toast.error(error instanceof Error ? error.message : 'Er is een fout opgetreden bij het bijwerken van de voorraad');
    } finally {
      setLoading(false);
      setQuantity('');
    }
  };

  // Geen geavanceerde info/afbeeldingsbewerking in deze modal

  useEffect(() => {
    if (isOpen) {
      setQuantity('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Add this to show the action type
  const actionTitle = actionType === 'in' ? 'Add Stock' : 'Remove Stock';
  const actionColor = actionType === 'in' ? 'text-green-600' : 'text-red-600';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full max-h-[90vh] overflow-y-auto mx-auto px-4 sm:px-8">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className={actionColor}>{actionTitle}: {product.name}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-6">
          
          {/* Voorraad Bewerking Sectie */}
          <div className={`border rounded-lg p-4 ${actionType === 'in' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <h3 className={`text-lg font-semibold mb-4 flex items-center ${actionType === 'in' ? 'text-green-800' : 'text-red-800'}`}>
              <div className={`w-3 h-3 rounded-full mr-2 ${actionType === 'in' ? 'bg-green-500' : 'bg-red-500'}`}></div>
              Voorraad {actionType === 'in' ? 'Toevoegen' : 'Verwijderen'}
            </h3>
            <div className="grid gap-2">
              <Label htmlFor="quantity" className={`font-medium ${actionType === 'in' ? 'text-green-700' : 'text-red-700'}`}>
                Aantal
              </Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Voer aantal in"
                min="1"
                className={`py-3 px-3 text-base ${actionType === 'in' ? 'border-green-200 focus:border-green-500' : 'border-red-200 focus:border-red-500'}`}
              />
            </div>
          </div>

          {/* Geavanceerde Opties niet nodig voor toevoegen/uithalen */}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Annuleren
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={loading}
            className={actionType === 'in' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
          >
            {loading ? 'Bezig...' : actionType === 'in' ? 'Toevoegen' : 'Verwijderen'}
          </Button>
        </DialogFooter>        
      </DialogContent>
    </Dialog>
  );
};
