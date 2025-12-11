import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, Upload, X, Image as ImageIcon } from 'lucide-react';
import { Product } from '@/types/stockTypes';
import { cn } from '@/lib/utils';

interface AddVariantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVariantAdded: () => void;
  parentProduct: Product | null;
}

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

export const AddVariantModal: React.FC<AddVariantModalProps> = ({
  isOpen,
  onClose,
  onVariantAdded,
  parentProduct
}) => {
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  
  // Image upload state
  const [variantImage, setVariantImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<Array<{
    file: File;
    preview: string;
    size: number;
  }>>([]);
  const [isDragging, setIsDragging] = useState(false);
  
  const [formData, setFormData] = useState<VariantFormData>({
    variantName: '',
    quantityInStock: 0,
    minimumStockLevel: 0,
    purchasePrice: parentProduct?.purchase_price || 0,
    salePrice: parentProduct?.sale_price || 0,
    sku: '',
    barcode: '',
    location: ''
  });

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      uploadedImages.forEach(img => URL.revokeObjectURL(img.preview));
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reset uploaded images when modal closes
  useEffect(() => {
    if (!isOpen) {
      uploadedImages.forEach(img => URL.revokeObjectURL(img.preview));
      setUploadedImages([]);
      setVariantImage(null);
      setImagePreview(null);
      setIsDragging(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleInputChange = (field: keyof VariantFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle image change for preview and upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  // Handle multiple files
  const handleFiles = (files: File[]) => {
    const newImages = files.map(file => {
      const preview = URL.createObjectURL(file);
      return {
        file,
        preview,
        size: file.size
      };
    });
    setUploadedImages(prev => [...prev, ...newImages]);
    // Keep first image for backward compatibility
    if (newImages.length > 0) {
      setVariantImage(newImages[0].file);
      setImagePreview(newImages[0].preview);
    }
  };

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  // Remove image
  const removeImage = (index: number) => {
    setUploadedImages(prev => {
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

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !activeBranch || !parentProduct) {
      toast.error('Missing required information');
      return;
    }

    if (!formData.variantName.trim()) {
      toast.error('Variant name is required');
      return;
    }

    setLoading(true);
    
    try {
      // Handle Image Upload
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
          console.error('Error uploading variant image:', uploadError);
          toast.error('Error uploading image.');
          setLoading(false);
          return;
        }
        
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);
        imageUrl = publicUrl;
      } else {
        // If no image uploaded, inherit parent's image
        imageUrl = parentProduct.image_url;
      }

      const { error } = await supabase
        .from('products')
        .insert({
          name: parentProduct.name, // Same base name as parent
          description: parentProduct.description,
          quantity_in_stock: formData.quantityInStock,
          minimum_stock_level: formData.minimumStockLevel,
          unit_price: formData.salePrice, // For backwards compatibility
          purchase_price: formData.purchasePrice,
          sale_price: formData.salePrice,
          category_id: parentProduct.category_id,
          supplier_id: parentProduct.supplier_id,
          location: formData.location || null,
          branch_id: activeBranch.branch_id,
          user_id: user.id,
          image_url: imageUrl, // Use variant-specific image or parent's image
          is_variant: true,
          parent_product_id: parentProduct.id,
          variant_name: formData.variantName.trim(),
          variant_sku: formData.sku || null,
          variant_barcode: formData.barcode || null,
        });

      if (error) {
        console.error('Error creating variant:', error);
        toast.error(`Failed to create variant: ${error.message}`);
        return;
      }

      toast.success(`Variant "${formData.variantName}" added successfully!`);
      
      // Reset form
      setFormData({
        variantName: '',
        quantityInStock: 0,
        minimumStockLevel: 0,
        purchasePrice: parentProduct.purchase_price || 0,
        salePrice: parentProduct.sale_price || 0,
        sku: '',
        barcode: '',
        location: ''
      });

      // Clean up uploaded images
      uploadedImages.forEach(img => URL.revokeObjectURL(img.preview));
      setUploadedImages([]);
      setVariantImage(null);
      setImagePreview(null);

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['products'] });
      
      onVariantAdded();
      onClose();
      
    } catch (error) {
      console.error('Error creating variant:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  if (!parentProduct) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center">
            Add New Variant to: {parentProduct.name}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Variant Images */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Variant Images
            </Label>
            
            {/* Drag and Drop Area */}
            <div
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                "border-2 border-dashed rounded-lg p-6 text-center transition-colors flex items-center justify-center min-h-[120px]",
                isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50 hover:border-gray-400"
              )}
            >
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="flex items-center space-x-2">
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                  <ImageIcon className="w-8 h-8 text-gray-400 -ml-4" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">
                    Drop your image here, or <label htmlFor="variant-image-upload" className="text-blue-600 hover:text-blue-700 cursor-pointer underline">Browse</label>
                  </p>
                  <input
                    id="variant-image-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    disabled={loading}
                    className="hidden"
                  />
                  <Upload className="w-4 h-4 text-gray-400 mx-auto mt-1" />
                </div>
              </div>
            </div>

            {/* Uploaded Images List */}
            {uploadedImages.length > 0 && (
              <div className="space-y-2 mt-3">
                {uploadedImages.map((image, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-2 bg-white border border-gray-200 rounded-lg"
                  >
                    <img
                      src={image.preview}
                      alt={`Preview ${index + 1}`}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-900 truncate">
                        {image.file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(image.size)}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeImage(index)}
                      disabled={loading}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Variant Name */}
          <div>
            <Label htmlFor="variant-name" className="text-sm font-medium text-gray-700">
              Variant Name *
            </Label>
            <Input
              id="variant-name"
              value={formData.variantName}
              onChange={(e) => handleInputChange('variantName', e.target.value)}
              placeholder="e.g., Yellow, Green, Size M"
              className="mt-1"
              disabled={loading}
              required
            />
          </div>

          {/* Stock Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                Stock *
              </Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                value={formData.quantityInStock}
                onChange={(e) => handleInputChange('quantityInStock', parseInt(e.target.value) || 0)}
                className="mt-1"
                disabled={loading}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="min-level" className="text-sm font-medium text-gray-700">
                Min. Level *
              </Label>
              <Input
                id="min-level"
                type="number"
                min="0"
                value={formData.minimumStockLevel}
                onChange={(e) => handleInputChange('minimumStockLevel', parseInt(e.target.value) || 0)}
                className="mt-1"
                disabled={loading}
                required
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="purchase-price" className="text-sm font-medium text-gray-700">
                Purchase Price
              </Label>
              <Input
                id="purchase-price"
                type="number"
                min="0"
                step="0.01"
                value={formData.purchasePrice}
                onChange={(e) => handleInputChange('purchasePrice', parseFloat(e.target.value) || 0)}
                className="mt-1"
                disabled={loading}
              />
            </div>
            
            <div>
              <Label htmlFor="sale-price" className="text-sm font-medium text-gray-700">
                Sale Price
              </Label>
              <Input
                id="sale-price"
                type="number"
                min="0"
                step="0.01"
                value={formData.salePrice}
                onChange={(e) => handleInputChange('salePrice', parseFloat(e.target.value) || 0)}
                className="mt-1"
                disabled={loading}
              />
            </div>
          </div>

          {/* Optional Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sku" className="text-sm font-medium text-gray-700">
                SKU
              </Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => handleInputChange('sku', e.target.value)}
                placeholder="Variant SKU"
                className="mt-1"
                disabled={loading}
              />
            </div>
            
            <div>
              <Label htmlFor="barcode" className="text-sm font-medium text-gray-700">
                Barcode
              </Label>
              <Input
                id="barcode"
                value={formData.barcode}
                onChange={(e) => handleInputChange('barcode', e.target.value)}
                placeholder="Variant Barcode"
                className="mt-1"
                disabled={loading}
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <Label htmlFor="location" className="text-sm font-medium text-gray-700">
              Location
            </Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="Storage location"
              className="mt-1"
              disabled={loading}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Creating...' : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Variant
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
