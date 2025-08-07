import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Trash2, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { useQueryClient } from '@tanstack/react-query';
import { useIsMobile } from '@/hooks/use-mobile';
import { usePageRefresh } from '@/hooks/usePageRefresh';

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
  branch_id?: string;
  image_url?: string | null;
}

interface EditProductInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductUpdated: () => void;
  product: Product;
  onBack?: () => void; // New prop for back navigation
}

export const EditProductInfoModal = ({
  isOpen,
  onClose,
  onProductUpdated,
  product,
  onBack
}: EditProductInfoModalProps) => {
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(false);
  const [productImage, setProductImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(product.image_url || null);
  
  // Gebruik de page refresh hook
  usePageRefresh();
  const [form, setForm] = useState({
    name: product.name,
    description: product.description || '',
    quantity_in_stock: product.quantity_in_stock,
    minimum_stock_level: product.minimum_stock_level,
    unit_price: product.unit_price,
    purchase_price: product.purchase_price,
    sale_price: product.sale_price,
  });

  useEffect(() => {
    if (isOpen) {
      setForm({
        name: product.name,
        description: product.description || '',
        quantity_in_stock: product.quantity_in_stock,
        minimum_stock_level: product.minimum_stock_level,
        unit_price: product.unit_price,
        purchase_price: product.purchase_price,
        sale_price: product.sale_price,
      });
      setImagePreview(product.image_url || null);
      setProductImage(null);
    }
  }, [isOpen, product]);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.type === 'number' ? Number(e.target.value) : e.target.value });
  };

  const handleDelete = async () => {
    if (!user || !activeBranch) {
      toast.error('Je moet ingelogd zijn en een filiaal geselecteerd hebben');
      return;
    }
    const confirmMessage = 'Weet je zeker dat je dit product wilt verwijderen?\n\n' +
      'LET OP: Dit zal ook alle gerelateerde transacties verwijderen!';
    if (!confirm(confirmMessage)) return;
    
    setLoading(true);
    try {
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .match({ id: product.id, branch_id: activeBranch.branch_id });
      if (deleteError) {
        toast.error(`Verwijderen mislukt: ${deleteError.message}`);
        setLoading(false);
        return;
      }
      toast.success('Product en gerelateerde transacties succesvol verwijderd');
      // Forceer update van productCount in Sidebar
      queryClient.invalidateQueries({ queryKey: ['productCount', activeBranch.branch_id, user.id] });
      onProductUpdated();
      onClose();
    } catch (error) {
      toast.error('Er is een onverwachte fout opgetreden');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      const SUPABASE_URL = "https://sszuxnqhbxauvershuys.supabase.co";
      imageUrl = `${SUPABASE_URL}/storage/v1/object/public/product-images/${fileName}`;
    }
    const { error: updateError } = await supabase
      .from('products')
      .update({
        name: form.name,
        description: form.description,
        quantity_in_stock: Number(form.quantity_in_stock),
        minimum_stock_level: Number(form.minimum_stock_level),
        unit_price: Number(form.unit_price),
        purchase_price: Number(form.purchase_price),
        sale_price: Number(form.sale_price),
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

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`w-full max-w-full mx-auto p-0 ${isMobile ? 'h-full max-h-full rounded-none' : 'md:w-auto md:max-w-lg md:p-6 md:rounded-lg'}`}>
        <DialogHeader className={`${isMobile ? 'p-4 border-b' : 'p-0'}`}>
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
          <DialogTitle className={`${isMobile ? 'text-center pr-8' : ''}`}>
            Productinformatie aanpassen: {product.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className={`${isMobile ? 'flex-1 overflow-y-auto p-4' : 'mt-2'}`}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="mb-4">
              <Label>Productnaam</Label>
              <Input name="name" value={form.name} onChange={handleChange} disabled={loading} required />
            </div>
            <div className="mb-4">
              <Label>Beschrijving</Label>
              <Input name="description" value={form.description} onChange={handleChange} disabled={loading} />
            </div>
            <div className="mb-4">
              <Label>Voorraad</Label>
              <Input name="quantity_in_stock" type="number" value={form.quantity_in_stock} onChange={handleChange} disabled={loading} min={0} required />
            </div>
            <div className="mb-4">
              <Label>Min. Niveau</Label>
              <Input name="minimum_stock_level" type="number" value={form.minimum_stock_level} onChange={handleChange} disabled={loading} min={0} required />
            </div>
            <div className="mb-4">
              <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-2 gap-4'}`}>
                <div>
                  <Label htmlFor="purchase_price">Inkoopprijs</Label>
                  <Input
                    id="purchase_price"
                    name="purchase_price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.purchase_price}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="sale_price">Verkoopprijs</Label>
                  <Input
                    id="sale_price"
                    name="sale_price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.sale_price}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="mb-4">
              <Label>Productfoto</Label>
              <Input type="file" accept="image/*" onChange={handleImageChange} disabled={loading} />
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="mt-2 w-24 h-24 object-cover rounded border" />
              )}
            </div>
          </form>
        </div>

        <div className={`${isMobile ? 'p-4 border-t bg-gray-50' : 'mt-4'}`}>
          <div className={`flex ${isMobile ? 'flex-col gap-3' : 'justify-between gap-2'}`}>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleDelete} 
              disabled={loading}
              className={`flex items-center gap-2 ${isMobile ? 'w-full' : ''}`}
            >
              <Trash2 className="h-4 w-4" />
              Verwijderen
            </Button>
            <div className={`flex gap-2 ${isMobile ? 'w-full' : ''}`}>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose} 
                disabled={loading}
                className={isMobile ? 'flex-1' : ''}
              >
                Annuleren
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                onClick={handleSubmit}
                className={isMobile ? 'flex-1' : ''}
              >
                {loading ? 'Bijwerken...' : 'Productinformatie bijwerken'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
