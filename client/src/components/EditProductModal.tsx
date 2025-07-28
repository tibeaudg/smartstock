import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Minus } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

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
  const [productImage, setProductImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(product.image_url || null);
  const queryClient = useQueryClient();

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
      // Get current user from useAuth hook
      const { user } = require('@/hooks/useAuth').useAuth();
      
      if (!user) {
        throw new Error('Not logged in');
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
      await api.stockTransactions.create({
        product_id: product.id,
        product_name: product.name,
        transaction_type: actionType === 'in' ? 'incoming' : 'outgoing',
        quantity: numericQuantity,
        unit_price: product.unit_price,
        reference_number: `STOCK_${actionType?.toUpperCase()}_${Date.now()}`,
        notes: `Stock ${actionType === 'in' ? 'added' : 'removed'} via stock management`,
        created_by: user.id,
        branch_id: product.branch_id
      });

      // Then update the product quantity
      await api.products.update(product.id, { 
        quantity_in_stock: newQuantity,
      });

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

  // Afhandeling voor image preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setProductImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(product.image_url || null);
    }
  };

  // Product info update handler
  const handleProductInfoUpdate = async (data: any) => {
    setLoading(true);
    let imageUrl = product.image_url;
    // Skip image upload for now in the demo
    
    await api.products.update(product.id, {
      name: data.name,
      description: data.description,
      quantity_in_stock: data.quantity_in_stock,
      minimum_stock_level: data.minimum_stock_level,
      unit_price: data.unit_price,
      image_url: imageUrl,
    });
    toast.success('Productinformatie bijgewerkt!');
    onProductUpdated();
    onClose();
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      setQuantity('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Add this to show the action type
  const actionTitle = actionType === 'in' ? 'Toevoegen' : 'Uithalen';
  const actionColor = actionType === 'in' ? 'text-green-600' : 'text-red-600';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm w-sm max-h-[90vh] overflow-y-auto mx-auto px-4 sm:px-8">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
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
