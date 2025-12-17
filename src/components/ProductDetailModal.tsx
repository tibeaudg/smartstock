import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Edit, 
  Plus, 
  Trash2, 
  Package, 
  DollarSign,
  AlertCircle,
  Calendar,
  Scan,
  Check,
  X,
  Upload,
  Image as ImageIcon,
  ChevronsUpDown,
  Save,
  Warehouse,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCurrency } from '@/hooks/useCurrency';
import { supabase } from '@/integrations/supabase/client';
import { useBranches } from '@/hooks/useBranches';
import { useAuth } from '@/hooks/useAuth';
import { useWarehouses } from '@/hooks/useWarehouses';
import { AddVariantModal } from '@/components/AddVariantModal';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { BarcodeScanner } from './BarcodeScanner';
import { useScannerSettings } from '@/hooks/useScannerSettings';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductVitalsBar } from '@/components/product/ProductVitalsBar';
import { InventorySegmentation } from '@/components/product/InventorySegmentation';
import { ManualStockAdjustModal } from '@/components/ManualStockAdjustModal';
import { WarehouseTransferModal } from '@/components/WarehouseTransferModal';
import { CategorySelectionModal } from '@/components/CategorySelectionModal';
import { format } from 'date-fns';
import { Archive, QrCode, ArrowRightLeft, MapPin, Tag } from 'lucide-react';

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
  onAdjustStock: (product: any) => void;
  onDelete: (product: any) => void;
  onProductUpdated?: () => void;
  getStockStatus?: (quantity: number, minLevel: number) => string;
  getStockStatusDotColor?: (quantity: number, minLevel: number) => string;
  formatStockQuantity?: (quantity: number) => string;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  isOpen,
  onClose,
  product,
  onAdjustStock,
  onDelete,
  onProductUpdated,
  getStockStatus,
  getStockStatusDotColor,
  formatStockQuantity,
}) => {
  const { formatPrice } = useCurrency();
  const { activeBranch } = useBranches();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { settings: scannerSettings, onScanSuccess } = useScannerSettings();
  const { data: warehouses = [] } = useWarehouses();

  // Map product locations to warehouse names
  const locationToWarehouseMap = React.useMemo(() => {
    const map = new Map<string, string>();
    warehouses.forEach(warehouse => {
      map.set(warehouse.name, warehouse.name);
    });
    return map;
  }, [warehouses]);

  // Get warehouse name for a product based on its warehouse_name
  const getWarehouseName = React.useCallback((warehouseName: string | null | undefined): string | null => {
    if (!warehouseName) return null;
    return warehouseName;
  }, []);
  
  // Variants state
  const [variants, setVariants] = useState<any[]>([]);
  const [isLoadingVariants, setIsLoadingVariants] = useState(false);
  const [isAddVariantModalOpen, setIsAddVariantModalOpen] = useState(false);
  
  // Tab state
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  // Variant selection for bulk actions
  const [selectedVariantIds, setSelectedVariantIds] = useState<Set<string>>(new Set());
  
  // Modal states
  const [isWarehouseModalOpen, setIsWarehouseModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  
  // Editing states for each section
  const [editingField, setEditingField] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Variant editing state
  const [editingVariantId, setEditingVariantId] = useState<string | null>(null);
  const [variantForm, setVariantForm] = useState({
    variant_name: '',
    quantity_in_stock: 0,
    minimum_stock_level: 0,
    purchase_price: 0,
    sale_price: 0,
    variant_sku: '',
    variant_barcode: '',
    location: '',
  });
  
  // Form state
  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    quantity_in_stock: product?.quantity_in_stock || 0,
    minimum_stock_level: product?.minimum_stock_level || 0,
    purchase_price: product?.purchase_price || 0,
    sale_price: product?.sale_price || 0,
    sku: product?.sku || '',
    location: product?.location || '',
    category_id: product?.category_id || '',
    category_name: product?.category_name || '',
  });
  
  // Image upload state
  const [uploadedImages, setUploadedImages] = useState<Array<{
    file: File;
    preview: string;
    size: number;
  }>>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [newProductImage, setNewProductImage] = useState<File | null>(null);
  
  // Scanner state
  const [showScanner, setShowScanner] = useState(false);
  
  // Categories state
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [categoryOpen, setCategoryOpen] = useState(false);
  
  // Current product state (refreshed after updates)
  const [currentProduct, setCurrentProduct] = useState(product);

  // Update form and current product when product prop changes
  useEffect(() => {
    if (product) {
      setCurrentProduct(product);
      setForm({
        name: product.name || '',
        description: product.description || '',
        quantity_in_stock: product.quantity_in_stock || 0,
        minimum_stock_level: product.minimum_stock_level || 0,
        purchase_price: product.purchase_price || 0,
        sale_price: product.sale_price || 0,
        sku: product.sku || '',
        location: product.location || '',
        category_id: product.category_id || '',
        category_name: product.category_name || '',
      });
    }
  }, [product]);

  const fetchVariants = useCallback(async () => {
    if (!currentProduct || !activeBranch) return;
    
    setIsLoadingVariants(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('parent_product_id', currentProduct.id)
        .eq('branch_id', activeBranch.branch_id)
        .order('variant_name');

      if (error) throw error;
      setVariants(data || []);
    } catch (error) {
      console.error('Error fetching variants:', error);
      toast.error('Failed to load variants');
    } finally {
      setIsLoadingVariants(false);
    }
  }, [currentProduct?.id, activeBranch?.branch_id]);

  // Fetch variants when modal opens and product changes
  useEffect(() => {
    if (isOpen && currentProduct && !currentProduct.is_variant && activeBranch) {
      fetchVariants();
    } else {
      setVariants([]);
    }
  }, [isOpen, currentProduct?.id, activeBranch?.branch_id, fetchVariants]);

  // Fetch categories
  useEffect(() => {
    if (user && isOpen) {
      fetchCategories();
    }
  }, [user, isOpen]);

  const fetchCategories = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .eq('user_id', user.id)
        .order('name');
      
      if (error) {
        console.error('Error fetching categories:', error);
        return;
      }
      
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleVariantAdded = () => {
    fetchVariants();
    queryClient.invalidateQueries({ queryKey: ['productsByCategories'] });
    queryClient.invalidateQueries({ queryKey: ['products'] });
  };

  // Handle variant editing
  const handleEditVariant = (variant: any) => {
    setEditingVariantId(variant.id);
    setVariantForm({
      variant_name: variant.variant_name || '',
      quantity_in_stock: variant.quantity_in_stock || 0,
      minimum_stock_level: variant.minimum_stock_level || 0,
      purchase_price: variant.purchase_price || 0,
      sale_price: variant.sale_price || 0,
      variant_sku: variant.variant_sku || '',
      variant_barcode: variant.variant_barcode || '',
      location: variant.location || '',
    });
  };

  const handleSaveVariant = async (variantId: string) => {
    if (!user || !activeBranch) return;
    
    setLoading(true);
    try {
      const updateData: any = {
        variant_name: variantForm.variant_name.trim(),
        quantity_in_stock: Number(variantForm.quantity_in_stock),
        minimum_stock_level: Number(variantForm.minimum_stock_level),
        purchase_price: Number(variantForm.purchase_price) || null,
        sale_price: Number(variantForm.sale_price) || null,
        variant_sku: variantForm.variant_sku.trim() || null,
        variant_barcode: variantForm.variant_barcode.trim() || null,
        location: variantForm.location.trim() || null,
        updated_at: new Date().toISOString(),
      };

      const { error: updateError } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', variantId);
        
      if (updateError) {
        console.error('Error updating variant:', updateError);
        toast.error('Error updating variant');
        setLoading(false);
        return;
      }

      // Refresh variants
      await fetchVariants();

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['productsByCategories'] });
      
      if (onProductUpdated) {
        onProductUpdated();
      }

      toast.success('Variant updated successfully');
      setEditingVariantId(null);
    } catch (error) {
      console.error('Error updating variant:', error);
      toast.error('Unexpected error updating variant');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelVariantEdit = () => {
    setEditingVariantId(null);
    setVariantForm({
      variant_name: '',
      quantity_in_stock: 0,
      minimum_stock_level: 0,
      purchase_price: 0,
      sale_price: 0,
      variant_sku: '',
      variant_barcode: '',
      location: '',
    });
  };

  // Handle barcode scanning
  const handleBarcodeDetected = (barcode: string) => {
    setForm(prev => ({ ...prev, sku: barcode }));
    setShowScanner(false);
    toast.success(`SKU scanned: ${barcode}`);
  };

  // Image upload handlers
  const handleFiles = (files: File[]) => {
    const newImages = files.map(file => {
      const preview = URL.createObjectURL(file);
      return {
        file,
        preview,
        size: file.size,
      };
    });
    setUploadedImages(prev => [...prev, ...newImages]);
    if (newImages.length > 0) {
      setNewProductImage(newImages[0].file);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

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

  const removeImage = (index: number) => {
    setUploadedImages(prev => {
      const newImages = prev.filter((_, i) => i !== index);
      if (newImages.length > 0) {
        setNewProductImage(newImages[0].file);
      } else {
        setNewProductImage(null);
      }
      return newImages;
    });
  };

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      uploadedImages.forEach(img => URL.revokeObjectURL(img.preview));
    };
  }, [uploadedImages]);

  // Save handler for individual fields
  const handleSave = async (field: string) => {
    if (!user || !activeBranch || !currentProduct) return;
    
    setLoading(true);
    try {
      // Handle category separately
      let categoryId = form.category_id || null;
      if (field === 'category' && form.category_name.trim() && !categoryId) {
        const { data: existingCategory } = await supabase
          .from('categories')
          .select('id')
          .eq('name', form.category_name.trim())
          .eq('user_id', user.id)
          .maybeSingle();

        if (existingCategory) {
          categoryId = existingCategory.id;
        } else {
          const { data: newCategory, error: categoryError } = await supabase
            .from('categories')
            .insert({ name: form.category_name.trim(), user_id: user.id })
            .select('id')
            .single();

          if (categoryError || !newCategory) {
            toast.error('Error creating category');
            setLoading(false);
            return;
          }
          categoryId = newCategory.id;
        }
      }

      // Handle image upload
      let imageUrl = currentProduct.image_url;
      const imageToUpload = uploadedImages.length > 0 ? uploadedImages[0].file : newProductImage;
      if (field === 'image' && imageToUpload && user) {
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
          console.error('Error uploading image:', uploadError);
          toast.error('Error uploading image.');
          setLoading(false);
          return;
        }
        
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);
        imageUrl = publicUrl;
      }

      // Build update object based on field
      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      if (field === 'name') {
        updateData.name = form.name;
      } else if (field === 'description') {
        updateData.description = form.description;
      } else if (field === 'stock') {
        updateData.quantity_in_stock = Number(form.quantity_in_stock);
        updateData.minimum_stock_level = Number(form.minimum_stock_level);
      } else if (field === 'pricing') {
        updateData.purchase_price = Number(form.purchase_price);
        updateData.sale_price = Number(form.sale_price);
      } else if (field === 'sku') {
        updateData.sku = form.sku.trim() || null;
      } else if (field === 'location') {
        updateData.location = form.location.trim() || null;
      } else if (field === 'category') {
        updateData.category_id = categoryId;
        updateData.category_name = form.category_name.trim() || null;
      } else if (field === 'image') {
        updateData.image_url = imageUrl;
      }

      const { error: updateError } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', currentProduct.id);
        
      if (updateError) {
        console.error('Error updating product:', updateError);
        toast.error('Error updating product');
        setLoading(false);
        return;
      }

      // Refresh product data
      const { data: updatedProduct } = await supabase
        .from('products')
        .select('*')
        .eq('id', currentProduct.id)
        .single();

      if (updatedProduct) {
        setCurrentProduct(updatedProduct);
        setForm(prev => ({
          ...prev,
          name: updatedProduct.name || '',
          description: updatedProduct.description || '',
          quantity_in_stock: updatedProduct.quantity_in_stock || 0,
          minimum_stock_level: updatedProduct.minimum_stock_level || 0,
          purchase_price: updatedProduct.purchase_price || 0,
          sale_price: updatedProduct.sale_price || 0,
          sku: updatedProduct.sku || '',
          location: updatedProduct.location || '',
          category_id: updatedProduct.category_id || '',
          category_name: updatedProduct.category_name || '',
        }));
      }

      // Clear image upload state if image was saved
      if (field === 'image') {
        uploadedImages.forEach(img => URL.revokeObjectURL(img.preview));
        setUploadedImages([]);
        setNewProductImage(null);
      }

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['productsByCategories'] });
      queryClient.invalidateQueries({ queryKey: ['categoryProductCounts'] });
      
      if (onProductUpdated) {
        onProductUpdated();
      }

      toast.success('Product updated successfully');
      setEditingField(null);
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Unexpected error updating product');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = (field: string) => {
    // Reset form to current product values
    setForm({
      name: currentProduct?.name || '',
      description: currentProduct?.description || '',
      quantity_in_stock: currentProduct?.quantity_in_stock || 0,
      minimum_stock_level: currentProduct?.minimum_stock_level || 0,
      purchase_price: currentProduct?.purchase_price || 0,
      sale_price: currentProduct?.sale_price || 0,
      sku: currentProduct?.sku || '',
      location: currentProduct?.location || '',
      category_id: currentProduct?.category_id || '',
      category_name: currentProduct?.category_name || '',
    });
    
    // Clear image uploads
    if (field === 'image') {
      uploadedImages.forEach(img => URL.revokeObjectURL(img.preview));
      setUploadedImages([]);
      setNewProductImage(null);
    }
    
    setEditingField(null);
  };

  const handleCategoryChange = (value: string) => {
    const category = categories.find(cat => cat.name === value);
    setForm({ 
      ...form, 
      category_id: category?.id || '', 
      category_name: value 
    });
  };

  if (!currentProduct) return null;

  // Helper functions with defaults
  const getStatus = (qty: number, min: number) => {
    if (getStockStatus) return getStockStatus(qty, min);
    const quantity = Number(qty);
    const minLevel = Number(min);
    if (quantity === 0) return 'Out of Stock';
    if (quantity > 0 && quantity <= minLevel) return 'Low Stock';
    return 'In Stock';
  };

  const getDotColor = (qty: number, min: number) => {
    if (getStockStatusDotColor) return getStockStatusDotColor(qty, min);
    const quantity = Number(qty);
    const minLevel = Number(min);
    if (quantity === 0) return 'bg-red-500';
    if (quantity > 0 && quantity <= minLevel) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const formatQty = (qty: number) => {
    if (formatStockQuantity) return formatStockQuantity(qty);
    return new Intl.NumberFormat('en-US').format(Number(qty) || 0);
  };

  // Calculate total stock - only variant stock when variants exist, parent stock is ignored
  const totalStock = React.useMemo(() => {
    if (currentProduct.is_variant) {
      return Number(currentProduct.quantity_in_stock) || 0;
    }
    // If product has variants, use only variant stock (parent stock = 0)
    // If no variants, use parent stock as normal
    const variantsStock = variants.reduce((sum, variant) => {
      return sum + (Number(variant.quantity_in_stock) || 0);
    }, 0);
    return variants.length > 0 ? variantsStock : (Number(currentProduct.quantity_in_stock) || 0);
  }, [currentProduct.quantity_in_stock, currentProduct.is_variant, variants]);

  const stockStatus = getStatus(totalStock, currentProduct.minimum_stock_level);
  const stockDotColor = getDotColor(totalStock, currentProduct.minimum_stock_level);

  const handleAdjustStock = () => {
    onClose();
    onAdjustStock(currentProduct);
  };

  const handleSetWarehouse = () => {
    if (!currentProduct) return;
    setIsWarehouseModalOpen(true);
  };

  const handleSetCategory = () => {
    if (!currentProduct) return;
    setIsCategoryModalOpen(true);
  };

  const handleWarehouseSetComplete = async () => {
    // Refetch product data
    if (currentProduct?.id && activeBranch) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', currentProduct.id)
        .eq('branch_id', activeBranch.branch_id)
        .single();

      if (!error && data) {
        setCurrentProduct(data);
        setForm(prev => ({
          ...prev,
          location: data.location || '',
        }));
      }
    }
    
    if (onProductUpdated) {
      onProductUpdated();
    }
    queryClient.invalidateQueries({ queryKey: ['products'] });
    queryClient.invalidateQueries({ queryKey: ['productsByCategories'] });
  };

  const handleCategorySetComplete = async () => {
    // Refetch product data
    if (currentProduct?.id && activeBranch) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', currentProduct.id)
        .eq('branch_id', activeBranch.branch_id)
        .single();

      if (!error && data) {
        setCurrentProduct(data);
        setForm(prev => ({
          ...prev,
          category_id: data.category_id || '',
          category_name: data.category_name || '',
        }));
      }
    }
    
    if (onProductUpdated) {
      onProductUpdated();
    }
    queryClient.invalidateQueries({ queryKey: ['products'] });
    queryClient.invalidateQueries({ queryKey: ['productsByCategories'] });
  };

  const handleGenerateBarcode = () => {
    toast.info('Barcode generation coming soon');
  };

  const handleDelete = () => {
    onClose();
    onDelete(currentProduct);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-5/6 max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="pb-4 border-b px-6 pt-6">
          <div className="flex items-center justify-between">
            {editingField === 'name' ? (
              <div className="flex-1 flex items-center gap-2">
                <Input
                  value={form.name}
                  onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                  className="text-2xl font-bold"
                  disabled={loading}
                />
                <Button
                  size="sm"
                  onClick={() => handleSave('name')}
                  disabled={loading || !form.name.trim()}
                >
                  <Save className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleCancel('name')}
                  disabled={loading}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <DialogTitle className="text-2xl font-bold">{currentProduct.name}</DialogTitle>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setEditingField('name')}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Sticky Header Actions */}
          <div className="sticky top-0 z-10 bg-white border-b pb-3 -mx-6 px-6 -mt-6 pt-6 mb-4">
            <div className="flex items-center justify-end gap-2">
              <Button
                onClick={() => onAdjustStock(currentProduct)}
                variant="outline"
                size="sm"
                className="gap-2 text-xs"
              >
                <Plus className="w-3 h-3" />
                Adjust
              </Button>
              <Button
                onClick={handleSetWarehouse}
                variant="outline"
                size="sm"
                className="gap-2 text-xs"
              >
                <MapPin className="w-3 h-3" />
                {currentProduct?.warehouse_name || 'Set Warehouse'}
              </Button>
              <Button
                onClick={handleSetCategory}
                variant="outline"
                size="sm"
                className="gap-2 text-xs"
              >
                <Tag className="w-3 h-3" />
                {currentProduct?.category_name || 'Set Category'}
              </Button>
              <Button
                onClick={handleGenerateBarcode}
                variant="outline"
                size="sm"
                className="gap-2 text-xs"
              >
                <QrCode className="w-3 h-3" />
                Barcode
              </Button>
            </div>
          </div>

          {/* Tabs */}
          {currentProduct && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className={cn(
                "grid w-full mb-6",
                currentProduct.is_variant ? "grid-cols-1" : "grid-cols-2"
              )}>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                {!currentProduct.is_variant && (
                  <TabsTrigger value="variants">
                    Variants
                    {variants.length > 0 && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {variants.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                )}
              </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6 mt-0">

          {/* Vitals Bar */}
          {currentProduct && (
            <ProductVitalsBar
              productId={currentProduct.id}
              quantityInStock={totalStock}
              minimumStockLevel={currentProduct.minimum_stock_level || 0}
              valuationMethod="Average"
            />
          )}

          {/* Product Image and Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Image */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-600">Product Image</h3>
                {editingField !== 'image' && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingField('image')}
                    className="h-8"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                )}
              </div>
              
              {editingField === 'image' ? (
                <div className="space-y-4">
                  {(currentProduct.image_url || uploadedImages.length > 0) && (
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 flex items-center justify-center">
                  <img
                        src={uploadedImages.length > 0 ? uploadedImages[0].preview : currentProduct.image_url}
                        alt={currentProduct.name}
                        className="max-w-full max-h-64 object-contain"
                      />
                    </div>
                  )}
                  
                  <div
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={cn(
                      "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                      isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50 hover:border-gray-400"
                    )}
                  >
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <ImageIcon className="w-12 h-12 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          Drop your file here or <label htmlFor="image-upload" className="text-blue-600 hover:text-blue-700 cursor-pointer underline">Browse</label>
                        </p>
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageChange}
                          disabled={loading}
                          className="hidden"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {uploadedImages.length > 0 && (
                    <div className="space-y-2">
                      {uploadedImages.map((image, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg"
                        >
                          <img
                            src={image.preview}
                            alt={`Preview ${index + 1}`}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {image.file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(image.size / 1024).toFixed(2)} KB
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeImage(index)}
                            disabled={loading}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleSave('image')}
                      disabled={loading || uploadedImages.length === 0}
                      className="flex-1"
                    >
                      {loading ? 'Saving...' : 'Save'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleCancel('image')}
                      disabled={loading}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                currentProduct.image_url ? (
                  <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 flex items-center justify-center">
                    <img
                      src={currentProduct.image_url}
                      alt={currentProduct.name}
                    className="max-w-full max-h-64 object-contain"
                  />
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-12 flex items-center justify-center">
                  <Package className="w-16 h-16 text-gray-400" />
                </div>
                )
              )}
            </div>

            {/* Right Column - Stock and Quick Info */}
            <div className="space-y-4">
              {/* Stock Information */}
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-medium text-gray-600">Stock</div>
                  {editingField !== 'stock' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingField('stock')}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                
                {editingField === 'stock' ? (
                  <div className="space-y-3">
                    <div>
                      <Label>Stock Quantity</Label>
                      <Input
                        type="number"
                        value={form.quantity_in_stock}
                        onChange={(e) => setForm(prev => ({ ...prev, quantity_in_stock: Number(e.target.value) }))}
                        min={0}
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <Label>Minimum Level</Label>
                      <Input
                        type="number"
                        value={form.minimum_stock_level}
                        onChange={(e) => setForm(prev => ({ ...prev, minimum_stock_level: Number(e.target.value) }))}
                        min={0}
                        disabled={loading}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleSave('stock')}
                        disabled={loading}
                        className="flex-1"
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCancel('stock')}
                        disabled={loading}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={cn(
                      'w-4 h-4 rounded-full',
                      stockDotColor,
                      totalStock === 0 ? 'animate-pulse' : ''
                    )}
                  />
                  <div className="flex-1">
                    <div className="text-3xl font-bold text-gray-900">
                      {formatQty(totalStock)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {stockStatus}
                          {!currentProduct.is_variant && variants.length > 0 && (
                        <span className="ml-1 text-gray-400">
                              ({formatQty(totalStock)} from {variants.length} variant{variants.length !== 1 ? 's' : ''})
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                    {currentProduct.minimum_stock_level && (
                  <div className="text-xs text-gray-500 mt-2">
                        Minimum Level: {formatQty(currentProduct.minimum_stock_level)}
                  </div>
                    )}
                  </>
                )}
              </div>

              {/* Pricing Information */}
              {(currentProduct.purchase_price || currentProduct.sale_price || currentProduct.unit_price) && (
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium text-gray-600">Pricing</div>
                    {editingField !== 'pricing' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingField('pricing')}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  {editingField === 'pricing' ? (
                    <div className="space-y-3">
                      <div>
                        <Label>Purchase Price</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={form.purchase_price}
                          onChange={(e) => setForm(prev => ({ ...prev, purchase_price: Number(e.target.value) }))}
                          min={0}
                          disabled={loading}
                        />
                      </div>
                      <div>
                        <Label>Sale Price</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={form.sale_price}
                          onChange={(e) => setForm(prev => ({ ...prev, sale_price: Number(e.target.value) }))}
                          min={0}
                          disabled={loading}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleSave('pricing')}
                          disabled={loading}
                          className="flex-1"
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCancel('pricing')}
                          disabled={loading}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                  <div className="space-y-1 text-sm">
                      {currentProduct.purchase_price && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Purchase Price:</span>
                        <span className="font-medium text-red-600">
                            {formatPrice(Number(currentProduct.purchase_price))}
                        </span>
                      </div>
                    )}
                      {currentProduct.sale_price && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Sale Price:</span>
                        <span className="font-medium text-green-600">
                            {formatPrice(Number(currentProduct.sale_price))}
                        </span>
                      </div>
                    )}
                      {currentProduct.unit_price && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Unit Price:</span>
                        <span className="font-medium text-gray-900">
                            {formatPrice(Number(currentProduct.unit_price))}
                        </span>
                      </div>
                    )}
                  </div>
                  )}
                </div>
              )}

              {/* Additional Information */}
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 space-y-3">
                <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-gray-600 mb-2">Additional Information</div>
                </div>
                
                {/* SKU */}
                <div>
                  {editingField === 'sku' ? (
                    <div className="space-y-2">
                      <Label>SKU</Label>
                      <div className="flex gap-2">
                        <Input
                          value={form.sku}
                          onChange={(e) => setForm(prev => ({ ...prev, sku: e.target.value }))}
                          placeholder="Enter SKU or scan barcode"
                          disabled={loading}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowScanner(true)}
                          disabled={loading}
                        >
                          <Scan className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleSave('sku')}
                          disabled={loading}
                          className="flex-1"
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCancel('sku')}
                          disabled={loading}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-gray-600">SKU:</span>
                        <span className="font-mono ml-2 text-gray-900">
                          {currentProduct.sku || 'Not set'}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingField('sku')}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                  </div>
                )}
                </div>
                
                {/* Location */}
                <div>
                  {editingField === 'location' ? (
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input
                        value={form.location}
                        onChange={(e) => setForm(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="Enter location (e.g. row6 box 4)"
                        disabled={loading}
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleSave('location')}
                          disabled={loading}
                          className="flex-1"
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCancel('location')}
                          disabled={loading}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <span className="text-gray-600">Location:</span>
                        <span className="ml-2 text-gray-900">
                          {currentProduct.location || 'Not set'}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingField('location')}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Warehouse */}
                {(() => {
                  const warehouseName = getWarehouseName(currentProduct.warehouse_name);
                  return (
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Warehouse className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Warehouse:</span>
                        <span className={cn(
                          "text-gray-900",
                          !warehouseName && "text-gray-400 italic"
                        )}>
                          {warehouseName || 'Not assigned'}
                        </span>
                      </div>
                    </div>
                  );
                })()}
                
                {/* Category */}
                {editingField === 'category' ? (
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={categoryOpen}
                          className="w-full justify-between"
                          disabled={loading}
                        >
                          {form.category_name || "Select category..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput 
                            placeholder="Search category..." 
                            value={form.category_name}
                            onValueChange={(value) => handleCategoryChange(value)}
                          />
                          <CommandList>
                            <CommandEmpty>
                              <div className="p-2 text-center">
                                <p className="text-sm text-gray-500 mb-2">No category found</p>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={async () => {
                                    if (form.category_name.trim() && user) {
                                      try {
                                        const { data: newCategory, error } = await supabase
                                          .from('categories')
                                          .insert({ name: form.category_name.trim(), user_id: user.id })
                                          .select('id, name')
                                          .single();
                                        
                                        if (error || !newCategory) {
                                          toast.error('Error creating category');
                                          return;
                                        }
                                        
                                        setCategories(prev => [...prev, newCategory]);
                                        setForm(prev => ({ ...prev, category_id: newCategory.id }));
                                        setCategoryOpen(false);
                                        toast.success('New category added!');
                                      } catch (error) {
                                        toast.error('Error creating category');
                                      }
                                    }
                                  }}
                                  className="w-full"
                                >
                                  <Plus className="w-4 h-4 mr-2" />
                                  Add "{form.category_name}"
                                </Button>
                              </div>
                            </CommandEmpty>
                            <CommandGroup>
                              {categories.map((category) => (
                                <CommandItem
                                  key={category.id}
                                  value={category.name}
                                  onSelect={() => {
                                    handleCategoryChange(category.name);
                                    setCategoryOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      form.category_name === category.name ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {category.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleSave('category')}
                        disabled={loading}
                        className="flex-1"
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCancel('category')}
                        disabled={loading}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Category:</span>
                      <span className="text-gray-900">{currentProduct.category_name || 'Not set'}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingField('category')}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Description Section */}
            <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Description</h3>
              {editingField !== 'description' && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setEditingField('description')}
                  className="h-8"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              )}
              </div>
            
            {editingField === 'description' ? (
              <div className="space-y-3">
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                  disabled={loading}
                  rows={4}
                  className="resize-none"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleSave('description')}
                    disabled={loading}
                    className="flex-1"
                  >
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleCancel('description')}
                    disabled={loading}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {currentProduct.description || 'No description'}
                </p>
            </div>
          )}
          </div>

              {/* Show variant info if this is a variant */}
              {currentProduct.is_variant && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Variant Information</h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-900">
                      This is a variant of a parent product. To manage variants, open the parent product.
                    </p>
                  </div>
                </div>
              )}

              {/* Inventory Segmentation */}
              {currentProduct && (
                <InventorySegmentation
                  productId={currentProduct.id}
                  currentStock={totalStock}
                  reorderPoint={currentProduct.minimum_stock_level || 0}
                  onAddLocation={() => setEditingField('location')}
                />
              )}
            </TabsContent>

            {/* Variants Tab */}
            {!currentProduct.is_variant && (
              <TabsContent value="variants" className="mt-0 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Product Variants</h3>
                  <div className="flex items-center gap-2">
                    {selectedVariantIds.size > 0 && (
                      <>
                        <span className="text-sm text-gray-600">{selectedVariantIds.size} selected</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // Bulk adjust stock
                            if (selectedVariantIds.size > 0) {
                              const selectedVariants = variants.filter(v => selectedVariantIds.has(v.id));
                              if (selectedVariants.length > 0) {
                                onAdjustStock(selectedVariants[0]); // Adjust first selected for now
                              }
                            }
                          }}
                        >
                          <TrendingUp className="w-4 h-4 mr-2" />
                          Adjust Stock
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            if (selectedVariantIds.size > 0 && window.confirm(`Delete ${selectedVariantIds.size} variant(s)?`)) {
                              try {
                                const { error } = await supabase
                                  .from('products')
                                  .delete()
                                  .in('id', Array.from(selectedVariantIds));
                                
                                if (error) throw error;
                                
                                toast.success(`Deleted ${selectedVariantIds.size} variant(s)`);
                                setSelectedVariantIds(new Set());
                                handleVariantAdded();
                              } catch (error) {
                                console.error('Error deleting variants:', error);
                                toast.error('Failed to delete variants');
                              }
                            }
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedVariantIds(new Set())}
                        >
                          Clear
                        </Button>
                      </>
                    )}
                    <Button
                      onClick={() => setIsAddVariantModalOpen(true)}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Create New Variant
                    </Button>
                  </div>
                </div>

                {isLoadingVariants ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-sm text-gray-500">Loading variants...</div>
                  </div>
                ) : variants.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                    <Package className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No variants found</p>
                    <p className="text-xs text-gray-400 mt-1">Create your first variant to get started</p>
                  </div>
                ) : (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left">
                              <input
                                type="checkbox"
                                checked={variants.length > 0 && variants.every(v => selectedVariantIds.has(v.id))}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedVariantIds(new Set(variants.map(v => v.id)));
                                  } else {
                                    setSelectedVariantIds(new Set());
                                  }
                                }}
                                className="w-4 h-4 text-blue-600 rounded border-gray-300"
                              />
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variant Name</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {variants.map((variant) => {
                            const variantStockStatus = getStatus(variant.quantity_in_stock, variant.minimum_stock_level);
                            const variantStockDotColor = getDotColor(variant.quantity_in_stock, variant.minimum_stock_level);
                            const isEditing = editingVariantId === variant.id;
                            
                            return (
                              <tr key={variant.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3">
                                  <input
                                    type="checkbox"
                                    checked={selectedVariantIds.has(variant.id)}
                                    onChange={(e) => {
                                      const newSet = new Set(selectedVariantIds);
                                      if (e.target.checked) {
                                        newSet.add(variant.id);
                                      } else {
                                        newSet.delete(variant.id);
                                      }
                                      setSelectedVariantIds(newSet);
                                    }}
                                    className="w-4 h-4 text-blue-600 rounded border-gray-300"
                                  />
                                </td>
                                <td className="px-4 py-3">
                                  {isEditing ? (
                                    <Input
                                      value={variantForm.variant_name}
                                      onChange={(e) => setVariantForm(prev => ({ ...prev, variant_name: e.target.value }))}
                                      className="text-sm"
                                      disabled={loading}
                                    />
                                  ) : (
                                    <span className="text-sm font-medium text-gray-900">{variant.variant_name}</span>
                                  )}
                                </td>
                                <td className="px-4 py-3">
                                  {isEditing ? (
                                    <Input
                                      value={variantForm.variant_sku}
                                      onChange={(e) => setVariantForm(prev => ({ ...prev, variant_sku: e.target.value }))}
                                      className="text-sm font-mono"
                                      disabled={loading}
                                    />
                                  ) : (
                                    <span className="text-sm font-mono text-gray-600">{variant.variant_sku || variant.sku || '-'}</span>
                                  )}
                                </td>
                                <td className="px-4 py-3">
                                  {isEditing ? (
                                    <Input
                                      value={variantForm.location}
                                      onChange={(e) => setVariantForm(prev => ({ ...prev, location: e.target.value }))}
                                      className="text-sm"
                                      disabled={loading}
                                    />
                                  ) : (
                                    <span className="text-sm text-gray-600">{variant.location || '-'}</span>
                                  )}
                                </td>
                                <td className="px-4 py-3 text-center">
                                  {isEditing ? (
                                    <Input
                                      type="number"
                                      value={variantForm.quantity_in_stock}
                                      onChange={(e) => setVariantForm(prev => ({ ...prev, quantity_in_stock: Number(e.target.value) }))}
                                      className="text-sm w-24"
                                      disabled={loading}
                                    />
                                  ) : (
                                    <div className="flex items-center justify-center gap-2">
                                      <div className={cn('w-2 h-2 rounded-full', variantStockDotColor)} />
                                      <span className="text-sm font-medium text-gray-900">{formatQty(variant.quantity_in_stock)}</span>
                                    </div>
                                  )}
                                </td>
                                <td className="px-4 py-3 text-center">
                                  {isEditing ? (
                                    <Input
                                      type="number"
                                      step="0.01"
                                      value={variantForm.sale_price}
                                      onChange={(e) => setVariantForm(prev => ({ ...prev, sale_price: Number(e.target.value) }))}
                                      className="text-sm w-24"
                                      disabled={loading}
                                    />
                                  ) : (
                                    <span className="text-sm text-gray-900">{formatPrice(Number(variant.sale_price) || 0)}</span>
                                  )}
                                </td>
                                <td className="px-4 py-3 text-right">
                                  {isEditing ? (
                                    <div className="flex items-center justify-end gap-2">
                                      <Button
                                        size="sm"
                                        onClick={() => handleSaveVariant(variant.id)}
                                        disabled={loading || !variantForm.variant_name.trim()}
                                      >
                                        <Save className="w-4 h-4" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={handleCancelVariantEdit}
                                        disabled={loading}
                                      >
                                        <X className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  ) : (
                                    <div className="flex items-center justify-end gap-2">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleEditVariant(variant)}
                                      >
                                        <Edit className="w-4 h-4" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => onAdjustStock(variant)}
                                      >
                                        <TrendingUp className="w-4 h-4" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={async () => {
                                          if (window.confirm(`Delete variant "${variant.variant_name}"?`)) {
                                            try {
                                              const { error } = await supabase
                                                .from('products')
                                                .delete()
                                                .eq('id', variant.id);
                                              
                                              if (error) throw error;
                                              
                                              toast.success('Variant deleted');
                                              handleVariantAdded();
                                            } catch (error) {
                                              console.error('Error deleting variant:', error);
                                              toast.error('Failed to delete variant');
                                            }
                                          }
                                        }}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </TabsContent>
            )}
            </Tabs>
          )}
        </div>

        {/* Sticky Footer with Action Buttons */}
        <div className="sticky bottom-0 left-0 right-0 bg-white border-t px-6 py-4 shadow-lg z-10">
          <div className="flex items-center justify-end gap-2">
            <Button
              onClick={handleAdjustStock}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Adjust Stock
            </Button>
            <Button
              onClick={handleDelete}
              variant="outline"
              size="sm"
              className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>

      {/* Add Variant Modal */}
      {currentProduct && !currentProduct.is_variant && (
        <AddVariantModal
          isOpen={isAddVariantModalOpen}
          onClose={() => setIsAddVariantModalOpen(false)}
          onVariantAdded={handleVariantAdded}
          parentProduct={currentProduct}
        />
      )}

      {/* Barcode Scanner Modal */}
      {showScanner && (
        <BarcodeScanner
          onBarcodeDetected={handleBarcodeDetected}
          onClose={() => setShowScanner(false)}
          onScanSuccess={onScanSuccess}
          settings={scannerSettings}
        />
      )}

      {/* Warehouse Transfer Modal */}
      {isWarehouseModalOpen && currentProduct && (
        <WarehouseTransferModal
          isOpen={isWarehouseModalOpen}
          onClose={() => setIsWarehouseModalOpen(false)}
          product={{
            id: currentProduct.id,
            name: currentProduct.name,
            warehouse_name: currentProduct.warehouse_name,
          }}
          onTransferComplete={handleWarehouseSetComplete}
        />
      )}

      {/* Category Selection Modal */}
      {isCategoryModalOpen && currentProduct && (
        <CategorySelectionModal
          isOpen={isCategoryModalOpen}
          onClose={() => setIsCategoryModalOpen(false)}
          product={{
            id: currentProduct.id,
            name: currentProduct.name,
            category_id: currentProduct.category_id,
            category_name: currentProduct.category_name,
          }}
          onCategorySet={handleCategorySetComplete}
        />
      )}
    </Dialog>
  );
};
