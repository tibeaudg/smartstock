import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
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
  branch_id?: string;
  image_url?: string | null;
}

interface EditProductInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductUpdated: () => void;
  product: Product;
}

export const EditProductInfoModal = ({
  isOpen,
  onClose,
  onProductUpdated,
  product
}: EditProductInfoModalProps) => {
  const [loading, setLoading] = useState(false);
  const [productImage, setProductImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(product.image_url || null);
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
      <DialogContent className="max-w-lg w-full max-h-[90vh] overflow-y-auto mx-auto px-4 sm:px-8">
        <DialogHeader>
          <DialogTitle>Productinformatie aanpassen: {product.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <Label>Productnaam</Label>
          <Input name="name" value={form.name} onChange={handleChange} disabled={loading} required />
          <Label>Beschrijving</Label>
          <Input name="description" value={form.description} onChange={handleChange} disabled={loading} />
          <Label>Voorraad</Label>
          <Input name="quantity_in_stock" type="number" value={form.quantity_in_stock} onChange={handleChange} disabled={loading} min={0} required />
          <Label>Min. Niveau</Label>
          <Input name="minimum_stock_level" type="number" value={form.minimum_stock_level} onChange={handleChange} disabled={loading} min={0} required />
          <div className="grid grid-cols-2 gap-4">
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
          <Label>Productfoto</Label>
          <Input type="file" accept="image/*" onChange={handleImageChange} disabled={loading} />
          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="mt-2 w-24 h-24 object-cover rounded border" />
          )}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Annuleren
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Bijwerken...' : 'Productinformatie bijwerken'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
