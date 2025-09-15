import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
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
  actionType: 'in' | 'out';
  onBack?: () => void; // New prop for back navigation
}

export const EditProductStockModal = ({
  isOpen,
  onClose,
  onProductUpdated,
  product,
  actionType,
  onBack
}: EditProductStockModalProps) => {
  const [quantity, setQuantity] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const { isMobile } = useMobile();
  
  // Gebruik de page refresh hook
  usePageRefresh();

  useEffect(() => {
    if (isOpen) setQuantity('');
  }, [isOpen]);

  if (!isOpen) return null;

  const actionTitle = actionType === 'in' ? 'Toevoegen' : 'Uithalen';
  const actionColor = actionType === 'in' ? 'text-green-600' : 'text-red-600';

  const handleSubmit = async () => {
    if (!quantity || parseInt(quantity) <= 0) {
      toast.error('Voer een geldig aantal in');
      return;
    }
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Niet ingelogd');
      const numericQuantity = parseInt(quantity);
      const newQuantity = actionType === 'in'
        ? product.quantity_in_stock + numericQuantity
        : product.quantity_in_stock - numericQuantity;
      if (actionType === 'out' && newQuantity < 0) {
        toast.error('Niet genoeg voorraad beschikbaar');
        setLoading(false);
        return;
      }
        const { error: transactionError } = await supabase
        .from('stock_transactions')
        .insert({
          product_id: product.id,
          product_name: product.is_variant && product.variant_name ? `${product.name} - ${product.variant_name}` : product.name,
          transaction_type: actionType === 'in' ? 'incoming' : 'outgoing',
          quantity: numericQuantity,
          unit_price: product.unit_price,
          reference_number: `STOCK_${actionType?.toUpperCase()}_${Date.now()}`,
          notes: `Voorraad ${actionType === 'in' ? 'toegevoegd' : 'verwijderd'} via voorraad beheer`,
          user_id: user.id, // Behoud user_id voor backward compatibility
          created_by: user.id, // Nieuwe kolom voor relaties
          branch_id: product.branch_id,
          variant_id: product.is_variant ? product.id : null,
          variant_name: product.is_variant ? product.variant_name : null
        });
      if (transactionError) {
        throw new Error(`Fout bij het maken van de transactie: ${transactionError.message}`);
      }
      const { error: updateError } = await supabase
        .from('products')
        .update({
          quantity_in_stock: newQuantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', product.id);
      if (updateError) {
        throw new Error(`Fout bij het bijwerken van de voorraad: ${updateError.message}`);
      }
      toast.success(`Voorraad succesvol ${actionType === 'in' ? 'toegevoegd' : 'verwijderd'}`);
      onProductUpdated();
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['stockTransactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardData'] });
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Er is een fout opgetreden bij het bijwerken van de voorraad');
    } finally {
      setLoading(false);
      setQuantity('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${isMobile ? 'w-full max-w-full mx-auto p-0 h-full max-h-full rounded-none' : 'max-w-xs mx-auto px-14'}`}>
        <DialogHeader className={`${isMobile ? 'p-4 border-b' : ''}`}>
          {isMobile && onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="absolute left-4 top-4 z-10"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <DialogTitle className={`flex items-center gap-2 ${isMobile ? 'text-center pr-8' : ''}`}>
            <span className={actionColor}>{actionTitle}: {product.name}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className={`${isMobile ? 'flex-1 overflow-y-auto p-4' : 'py-4'}`}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="quantity">Aantal</Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Voer aantal in"
                min="1"
                className={isMobile ? 'text-lg' : ''}
              />
            </div>
            
            {isMobile && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-2">Huidige voorraad</div>
                <div className="text-2xl font-bold">{product.quantity_in_stock}</div>
                <div className="text-sm text-gray-500 mt-1">
                  {actionType === 'in' 
                    ? `Na toevoegen: ${product.quantity_in_stock + (parseInt(quantity) || 0)}`
                    : `Na uithalen: ${product.quantity_in_stock - (parseInt(quantity) || 0)}`
                  }
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={`${isMobile ? 'p-4 border-t bg-gray-50' : ''}`}>
          <div className={`flex gap-2 ${isMobile ? 'flex-col' : 'justify-end'}`}>
            <Button 
              variant="outline" 
              onClick={onClose} 
              disabled={loading}
              className={isMobile ? 'w-full' : ''}
            >
              Annuleren
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className={`${actionType === 'in' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} ${isMobile ? 'w-full' : ''}`}
            >
              {loading ? 'Bezig...' : actionType === 'in' ? 'Toevoegen' : 'Verwijderen'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
