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
    if (productImage) {
      const fileExt = productImage.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, productImage, { upsert: false });
      if (uploadError) {
        toast.error('Fout bij uploaden van afbeelding');
        setLoading(false);
        return;
      }
      // Gebruik het SUPABASE_URL direct uit de client config
      const SUPABASE_URL = "https://sszuxnqhbxauvershuys.supabase.co";
      imageUrl = `${SUPABASE_URL}/storage/v1/object/public/product-images/${fileName}`;
    }
    const { error: updateError } = await supabase
      .from('products')
      .update({
        name: data.name,
        description: data.description,
        quantity_in_stock: data.quantity_in_stock,
        minimum_stock_level: data.minimum_stock_level,
        unit_price: data.unit_price,
        image_url: imageUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', product.id);
    if (updateError) {
      toast.error('Fout bij het bijwerken van product info');
      setLoading(false);
      return;
    }
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
  const actionTitle = actionType === 'in' ? 'Stock Toevoegen' : 'Stock Verwijderen';
  const actionColor = actionType === 'in' ? 'text-green-600' : 'text-red-600';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-full max-h-[90vh] overflow-y-auto mx-auto px-4 sm:px-8">
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

        {/* Formulier voor het bewerken van productinfo */}
        <form onSubmit={form.handleSubmit(handleProductInfoUpdate)} className="space-y-4 mt-6">
          <Label>Productnaam</Label>
          <Input {...form.register('name', { required: true })} disabled={loading} />
          <Label>Beschrijving</Label>
          <Input {...form.register('description')} disabled={loading} />
          <Label>Voorraad</Label>
          <Input type="number" {...form.register('quantity_in_stock', { required: true, min: 0 })} disabled={loading} />
          <Label>Min. Niveau</Label>
          <Input type="number" {...form.register('minimum_stock_level', { required: true, min: 0 })} disabled={loading} />
          <Label>Prijs</Label>
          <Input type="number" step="0.01" {...form.register('unit_price', { required: true, min: 0 })} disabled={loading} />
          <Label>Productfoto</Label>
          <Input type="file" accept="image/*" onChange={handleImageChange} disabled={loading} />
          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="mt-2 w-24 h-24 object-cover rounded border" />
          )}
          <div className="flex justify-end gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? 'Bijwerken...' : 'Productinformatie bijwerken'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
