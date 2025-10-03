import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { Product } from '@/types/stockTypes';

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

  const handleInputChange = (field: keyof VariantFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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
          image_url: parentProduct.image_url, // Inherit parent's image
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
