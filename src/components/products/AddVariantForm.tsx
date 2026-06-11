import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DecimalInput } from '@/components/ui/decimal-input';
import { IntegerInput } from '@/components/ui/integer-input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, Upload, X, Image as ImageIcon } from 'lucide-react';
import { Product } from '@/types/stockTypes';
import { cn } from '@/lib/utils';

interface VariantFormData {
  variantName: string;
  quantityInStock: number;
  minimumStockLevel: number;
  purchasePrice: number;
  salePrice: number;
  sku?: string;
  barcode?: string;
  location?: string;
}

export interface AddVariantFormProps {
  formId?: string;
  parentProduct: Product;
  onSuccess: () => void;
  onCancel: () => void;
}

export function AddVariantForm({ formId = 'add-variant-form', parentProduct, onSuccess, onCancel }: AddVariantFormProps) {
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [variantImage, setVariantImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<Array<{ file: File; preview: string; size: number }>>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [formData, setFormData] = useState<VariantFormData>({
    variantName: '',
    quantityInStock: 0,
    minimumStockLevel: 0,
    purchasePrice: parentProduct?.purchase_price || 0,
    salePrice: parentProduct?.sale_price || 0,
    sku: '',
    barcode: '',
    location: '',
  });

  useEffect(() => {
    return () => {
      uploadedImages.forEach((img) => URL.revokeObjectURL(img.preview));
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [uploadedImages, imagePreview]);

  const handleInputChange = (field: keyof VariantFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFiles = (files: File[]) => {
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      size: file.size,
    }));
    setUploadedImages((prev) => [...prev, ...newImages]);
    if (newImages.length > 0) {
      setVariantImage(newImages[0].file);
      setImagePreview(newImages[0].preview);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(Array.from(e.target.files || []));
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => {
      const newImages = prev.filter((_, i) => i !== index);
      if (newImages.length > 0) {
        setVariantImage(newImages[0].file);
        setImagePreview(newImages[0].preview);
      } else {
        setVariantImage(null);
        setImagePreview(null);
      }
      return newImages;
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !activeBranch) {
      toast.error('Missing required information');
      return;
    }
    if (!formData.variantName.trim()) {
      toast.error('Variant name is required');
      return;
    }

    setLoading(true);
    try {
      let imageUrl: string | null = null;
      const imageToUpload = uploadedImages.length > 0 ? uploadedImages[0].file : variantImage;
      if (imageToUpload) {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(imageToUpload.type) || imageToUpload.size > 5 * 1024 * 1024) {
          toast.error('Image upload failed: Invalid format (JPEG, PNG, WebP) or size (>5MB).');
          setLoading(false);
          return;
        }
        const fileExt = imageToUpload.name.split('.').pop()?.toLowerCase();
        const fileName = `${user.id}/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, imageToUpload, { upsert: false, contentType: imageToUpload.type });
        if (uploadError) {
          toast.error('Error uploading image.');
          setLoading(false);
          return;
        }
        const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(fileName);
        imageUrl = publicUrl;
      } else {
        imageUrl = parentProduct.image_url;
      }

      const { error } = await supabase.from('products').insert({
        name: parentProduct.name,
        description: parentProduct.description,
        quantity_in_stock: formData.quantityInStock,
        minimum_stock_level: formData.minimumStockLevel,
        unit_price: formData.salePrice,
        purchase_price: formData.purchasePrice,
        sale_price: formData.salePrice,
        category_id: parentProduct.category_id,
        supplier_id: parentProduct.supplier_id,
        location: formData.location || null,
        branch_id: activeBranch.branch_id,
        user_id: user.id,
        image_url: imageUrl,
        is_variant: true,
        parent_product_id: parentProduct.id,
        variant_name: formData.variantName.trim(),
        variant_sku: formData.sku || null,
        variant_barcode: formData.barcode || null,
      });

      if (error) {
        toast.error(`Failed to create variant: ${error.message}`);
        return;
      }

      toast.success(`Variant "${formData.variantName}" added successfully!`);
      uploadedImages.forEach((img) => URL.revokeObjectURL(img.preview));
      await queryClient.invalidateQueries({ queryKey: ['products'] });
      onSuccess();
    } catch {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <p className="text-sm text-gray-600">
        Parent product: <span className="font-medium">{parentProduct.name}</span>
      </p>

      <div>
        <Label className="text-sm font-medium text-gray-700 mb-2 block">Variant Images</Label>
        <div
          onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragOver={(e) => e.preventDefault()}
          onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'));
            if (files.length > 0) handleFiles(files);
          }}
          className={cn(
            'border-2 border-dashed rounded-lg p-6 text-center transition-colors flex items-center justify-center min-h-[120px]',
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:border-gray-400'
          )}
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <ImageIcon className="w-8 h-8 text-gray-400" />
            <p className="text-xs text-gray-600 mb-1">
              Drop your image here, or{' '}
              <label htmlFor="variant-image-upload" className="text-blue-600 hover:text-blue-700 cursor-pointer underline">
                Browse
              </label>
            </p>
            <input id="variant-image-upload" type="file" accept="image/*" multiple onChange={handleImageChange} disabled={loading} className="hidden" />
            <Upload className="w-4 h-4 text-gray-400 mx-auto mt-1" />
          </div>
        </div>
        {uploadedImages.length > 0 && (
          <div className="space-y-2 mt-3">
            {uploadedImages.map((image, index) => (
              <div key={index} className="flex items-center gap-3 p-2 bg-white border border-gray-200 rounded-lg">
                <img src={image.preview} alt={`Preview ${index + 1}`} className="w-12 h-12 object-cover rounded" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-900 truncate">{image.file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(image.size)}</p>
                </div>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeImage(index)} disabled={loading} className="text-red-600 h-8 w-8 p-0">
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="variant-name">Variant Name *</Label>
        <Input id="variant-name" value={formData.variantName} onChange={(e) => handleInputChange('variantName', e.target.value)} placeholder="e.g., Yellow, Size M" className="mt-1" disabled={loading} required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="quantity">Stock *</Label>
          <IntegerInput id="quantity" min={0} value={formData.quantityInStock} onChange={(v) => handleInputChange('quantityInStock', v)} className="mt-1" disabled={loading} required />
        </div>
        <div>
          <Label htmlFor="min-level">Min. Level *</Label>
          <IntegerInput id="min-level" min={0} value={formData.minimumStockLevel} onChange={(v) => handleInputChange('minimumStockLevel', v)} className="mt-1" disabled={loading} required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="purchase-price">Purchase Price</Label>
          <DecimalInput id="purchase-price" min={0} value={formData.purchasePrice} onChange={(v) => handleInputChange('purchasePrice', v)} className="mt-1" disabled={loading} />
        </div>
        <div>
          <Label htmlFor="sale-price">Sale Price</Label>
          <DecimalInput id="sale-price" min={0} value={formData.salePrice} onChange={(v) => handleInputChange('salePrice', v)} className="mt-1" disabled={loading} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="sku">SKU</Label>
          <Input id="sku" value={formData.sku} onChange={(e) => handleInputChange('sku', e.target.value)} className="mt-1" disabled={loading} />
        </div>
        <div>
          <Label htmlFor="barcode">Barcode</Label>
          <Input id="barcode" value={formData.barcode} onChange={(e) => handleInputChange('barcode', e.target.value)} className="mt-1" disabled={loading} />
        </div>
      </div>

      <div>
        <Label htmlFor="location">Location</Label>
        <Input id="location" value={formData.location} onChange={(e) => handleInputChange('location', e.target.value)} className="mt-1" disabled={loading} />
      </div>
    </form>
  );
}
