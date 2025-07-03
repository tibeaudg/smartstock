import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Minus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

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
  branch_id?: string; // Added branch_id as optional
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
  const queryClient = useQueryClient();

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
          product_name: product.name,
          transaction_type: actionType === 'in' ? 'incoming' : 'outgoing',
          quantity: numericQuantity,
          unit_price: product.unit_price,
          reference_number: `STOCK_${actionType?.toUpperCase()}_${Date.now()}`,
          notes: `Voorraad ${actionType === 'in' ? 'toegevoegd' : 'verwijderd'} via voorraad beheer`,
          created_by: user.id,
          branch_id: product.branch_id // Add this if you have branch information
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

  useEffect(() => {
    if (isOpen) {
      setQuantity('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Add this to show the action type
  const actionTitle = actionType === 'in' ? 'Stock Toevoegen' : 'Stock Verwijderen';
  const actionColor = actionType === 'in' ? 'text-green-600' : 'text-red-600';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xs mx-auto px-14">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {actionType === 'in' ? <Plus className="h-5 w-5" /> : <Minus className="h-5 w-5" />}
            <span className={actionColor}>{actionTitle}: {product.name}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <div className="grid gap-2">
            <Label htmlFor="quantity">Aantal</Label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Voer aantal in"
              min="1"
            />
          </div>
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
