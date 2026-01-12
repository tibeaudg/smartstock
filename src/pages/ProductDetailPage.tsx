import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Edit, Plus, Trash2, MapPin, Package, Tag, Image as ImageIcon, QrCode, Archive, Save, X, Scan, Check, ChevronsUpDown, TrendingUp } from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';
import { useBranches } from '@/hooks/useBranches';
import { useAuth } from '@/hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';
import { useScannerSettings } from '@/hooks/useScannerSettings';
import { useWarehouses } from '@/hooks/useWarehouses';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { EditProductStockModal } from '@/components/EditProductStockModal';
import { WarehouseTransferModal } from '@/components/WarehouseTransferModal';
import { CategorySelectionModal } from '@/components/CategorySelectionModal';
import { AddVariantModal } from '@/components/AddVariantModal';
import { BarcodeScanner } from '@/components/BarcodeScanner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BillOfMaterials from '@/components/products/BillOfMaterials';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { format } from 'date-fns';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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
  
  // Tab state (initialize from URL `tab` query param once)
  const initialTab = React.useMemo(() => new URLSearchParams(window.location.search).get('tab') || 'overview', []);
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  
  // Variant selection for bulk actions
  const [selectedVariantIds, setSelectedVariantIds] = useState<Set<string>>(new Set());
  
  // Editing states for each section
  const [editingField, setEditingField] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [productLoading, setProductLoading] = useState(true);
  
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
  
  // Current product state
  const [currentProduct, setCurrentProduct] = useState<any>(null);
  
  // Form state
  const [form, setForm] = useState({
    name: '',
    description: '',
    quantity_in_stock: 0,
    minimum_stock_level: 0,
    purchase_price: 0,
    sale_price: 0,
    sku: '',
    location: '',
    category_id: '',
    category_name: '',
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

  // Modal states
  const [isStockAdjustModalOpen, setIsStockAdjustModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [showBarcodeGenerator, setShowBarcodeGenerator] = useState(false);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id || !activeBranch) return;
      
      setProductLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .eq('branch_id', activeBranch.branch_id)
          .single();

        if (error) throw error;
        
        if (data) {
          setCurrentProduct(data);
          setForm({
            name: data.name || '',
            description: data.description || '',
            quantity_in_stock: data.quantity_in_stock || 0,
            minimum_stock_level: data.minimum_stock_level || 0,
            purchase_price: data.purchase_price || 0,
            sale_price: data.sale_price || 0,
            sku: data.sku || '',
            location: data.location || '',
            category_id: data.category_id || '',
            category_name: data.category_name || '',
          });
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product');
        navigate('/dashboard/categories');
      } finally {
        setProductLoading(false);
      }
    };

    fetchProduct();
  }, [id, activeBranch, navigate]);

  // Fetch variants when product changes
  useEffect(() => {
    if (currentProduct && !currentProduct.is_variant && activeBranch) {
      fetchVariants();
    } else {
      setVariants([]);
    }
  }, [currentProduct?.id, activeBranch?.branch_id]);

  // Fetch categories
  useEffect(() => {
    if (user) {
      fetchCategories();
    }
  }, [user]);

  const fetchVariants = async () => {
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
  };

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

      await fetchVariants();
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['productsByCategories'] });

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

  const [selectedProductForStock, setSelectedProductForStock] = useState<any>(null);

  const handleAdjustStock = async (product?: any) => {
    const prodToUse = product || currentProduct;
    if (!prodToUse) {
      toast.error('No product selected');
      return;
    }

    const prodIdRaw = prodToUse?.id;
    const prodId = typeof prodIdRaw === 'number' ? String(prodIdRaw) : (prodIdRaw ?? '');
    const branchId = prodToUse?.branch_id || activeBranch?.branch_id;

    if (!prodId || prodId === 'undefined' || (typeof prodId === 'string' && prodId.trim() === '')) {
      if (id && typeof id === 'string' && id.trim() !== '') {
        console.warn('handleAdjustStock: product.id missing, falling back to route id', { prodIdRaw, routeId: id });
        try {
          const branchToUse = prodToUse?.branch_id || activeBranch?.branch_id;
          const { data: fetchedProduct, error: fetchError } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .eq('branch_id', branchToUse)
            .maybeSingle();

          if (fetchError || !fetchedProduct) {
            console.error('handleAdjustStock: failed to fetch product by route id', fetchError);
            toast.error('Unable to load product details. Please refresh and try again.');
            return;
          }

          setSelectedProductForStock(fetchedProduct);
          setIsStockAdjustModalOpen(true);
          return;
        } catch (err) {
          console.error('handleAdjustStock: exception fetching product', err);
          toast.error('Unable to load product details. Please refresh and try again.');
          return;
        }
      }

      console.error('handleAdjustStock: invalid product id (raw)', prodIdRaw, 'coerced:', prodId, prodToUse);
      toast.error('Product ID is missing. Please refresh and try again.');
      return;
    }

    if (!branchId) {
      console.warn('handleAdjustStock: missing branch id on product, attempting to resolve user branch', prodToUse);
      if (user?.id) {
        try {
          const res: any = await supabase.rpc('get_user_branches', { user_id: user.id });
          const branches = res?.data || res;
          if (Array.isArray(branches) && branches.length > 0) {
            const fallbackBranch = branches[0];
            const fallbackBranchId = fallbackBranch.branch_id || fallbackBranch.id || fallbackBranch.branch_id;
            if (fallbackBranchId) {
              console.log('handleAdjustStock: using fallback branch id from RPC', fallbackBranchId);
              const fallbackProduct = { ...prodToUse, branch_id: fallbackBranchId };
              setSelectedProductForStock(fallbackProduct);
              setIsStockAdjustModalOpen(true);
              return;
            }
          }
        } catch (err) {
          console.error('handleAdjustStock: error resolving user branch', err);
        }
      }

      console.error('handleAdjustStock: missing branch id', branchId, prodToUse);
      toast.error('Branch information missing. Please select a branch.');
      return;
    }

    setSelectedProductForStock(prodToUse);
    setIsStockAdjustModalOpen(true);
  };

  const handleSetWarehouse = () => {
    if (!currentProduct) return;
    setIsTransferModalOpen(true);
  };

  const handleSetCategory = () => {
    if (!currentProduct) return;
    setIsCategoryModalOpen(true);
  };

  const handleTransferComplete = async () => {
    if (id && activeBranch) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
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
    
    queryClient.invalidateQueries({ queryKey: ['products'] });
    queryClient.invalidateQueries({ queryKey: ['productsByCategories'] });
  };

  const handleCategorySetComplete = async () => {
    if (id && activeBranch) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
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
    
    queryClient.invalidateQueries({ queryKey: ['products'] });
    queryClient.invalidateQueries({ queryKey: ['productsByCategories'] });
  };

  const handleGenerateBarcode = () => {
    setShowBarcodeGenerator(true);
    toast.info('Barcode generation coming soon');
  };

  const handleArchive = () => {
    if (confirm('Are you sure you want to archive this product?')) {
      toast.info('Archive functionality coming soon');
    }
  };

  const handleDelete = () => {
    if (!currentProduct) return;
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;

    (async () => {
      setLoading(true);
      try {
        const res: any = await supabase
          .from('products')
          .delete()
          .eq('id', currentProduct.id)
          .eq('branch_id', currentProduct.branch_id || activeBranch?.branch_id);

        const error = res?.error;
        if (error) {
          console.error('Error deleting product:', error);
          toast.error('Failed to delete product');
          return;
        }

        toast.success('Product deleted');
        queryClient.invalidateQueries({ queryKey: ['products'] });
        queryClient.invalidateQueries({ queryKey: ['productsByCategories'] });
        queryClient.invalidateQueries({ queryKey: ['categoryProductCounts'] });
        navigate('/dashboard/categories');
      } catch (err) {
        console.error('Unexpected error deleting product:', err);
        toast.error('Failed to delete product');
      } finally {
        setLoading(false);
      }
    })();
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') {
        return;
      }

      if (e.ctrlKey || e.metaKey) {
        if (e.key === 's') {
          e.preventDefault();
          if (editingField) {
            handleSave(editingField);
          }
        }
      } else {
        switch (e.key.toLowerCase()) {
          case 'a':
            e.preventDefault();
            handleAdjustStock();
            break;
          case 't':
            e.preventDefault();
            handleSetWarehouse();
            break;
          case 'c':
            e.preventDefault();
            handleSetCategory();
            break;
          case 'b':
            e.preventDefault();
            handleGenerateBarcode();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editingField, currentProduct]);

  // Helper functions with defaults
  const getStatus = (qty: number, min: number) => {
    const quantity = Number(qty);
    const minLevel = Number(min);
    if (quantity === 0) return 'Out of Stock';
    if (quantity > 0 && quantity <= minLevel) return 'Low Stock';
    return 'In Stock';
  };

  const getDotColor = (qty: number, min: number) => {
    const quantity = Number(qty);
    const minLevel = Number(min);
    if (quantity === 0) return 'bg-red-500';
    if (quantity > 0 && quantity <= minLevel) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const formatQty = (qty: number) => {
    return new Intl.NumberFormat('en-US').format(Number(qty) || 0);
  };

  // Calculate total stock
  const totalStock = React.useMemo(() => {
    if (!currentProduct) return 0;
    if (currentProduct.is_variant) {
      return Number(currentProduct.quantity_in_stock) || 0;
    }
    const variantsStock = variants.reduce((sum, variant) => {
      return sum + (Number(variant.quantity_in_stock) || 0);
    }, 0);
    return variants.length > 0 ? variantsStock : (Number(currentProduct.quantity_in_stock) || 0);
  }, [currentProduct?.quantity_in_stock, currentProduct?.is_variant, variants]);

  if (productLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3" />
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Product not found</p>
          <Button onClick={() => navigate('/dashboard/categories')}>
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const stockStatus = getStatus(totalStock, currentProduct.minimum_stock_level);
  const stockDotColor = getDotColor(totalStock, currentProduct.minimum_stock_level);

  const getProductStatus = () => {
    if (currentProduct.status === 'inactive') return { label: 'Inactive', variant: 'secondary' as const };
    if (currentProduct.status === 'discontinued') return { label: 'Discontinued', variant: 'destructive' as const };
    return { label: 'Active', variant: 'default' as const };
  };

  const productStatus = getProductStatus();

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Breadcrumb + Header */}
      <div className="border-b px-6 py-2 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard/categories')}
              className="p-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <nav className="text-xs text-gray-500">
              <span className="cursor-pointer hover:underline" onClick={() => navigate('/dashboard/categories')}>Products</span>
              <span className="mx-2">/</span>
              <span className="text-gray-900 font-medium">{currentProduct?.name}</span>
            </nav>
          </div>
          <div className="px-6 py-3">
            <Button
              onClick={handleAdjustStock}
              variant="outline"
              size="sm"
              className="gap-2 text-xs mr-2"
              title="Adjust Stock (A)"
            >
              <Plus className="w-3 h-3" />
              Adjust
            </Button>
            <Button
              onClick={handleSetCategory}
              variant="outline"
              size="sm"
              className="gap-2 text-xs mr-2"
              title="Set Category (C)"
            >
              <Tag className="w-3 h-3" />
              {currentProduct?.category_name || 'Set Category'}
            </Button>
            <Button
              onClick={handleDelete}
              variant="outline"
              size="sm"
              className="gap-2 mr-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-3 h-3" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Fixed (320px) */}
        <div className="w-80 border-r bg-gray-50 flex flex-col overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Product Image */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-medium text-gray-600 uppercase">Product Image</h3>
                {editingField !== 'image' && currentProduct.image_url && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingField('image')}
                    className="h-6 w-6 p-0"
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                )}
              </div>
              
              {editingField === 'image' || !currentProduct.image_url ? (
                <div className="space-y-2">
                  {(currentProduct.image_url || uploadedImages.length > 0) && (
                    <div className="bg-white rounded border border-gray-200 p-2 flex items-center justify-center">
                      <img
                        src={uploadedImages.length > 0 ? uploadedImages[0].preview : currentProduct.image_url}
                        alt={currentProduct.name}
                        className="max-w-full max-h-48 object-contain"
                      />
                    </div>
                  )}
                  
                  <div
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={cn(
                      "border-2 border-dashed rounded p-4 text-center transition-colors text-xs",
                      isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white hover:border-gray-400"
                    )}
                  >
                    <ImageIcon className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                    <label htmlFor="image-upload-sidebar" className="text-blue-600 hover:text-blue-700 cursor-pointer underline text-xs">
                      Upload Image
                    </label>
                    <input
                      id="image-upload-sidebar"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={loading}
                      className="hidden"
                    />
                  </div>
                  
                  {uploadedImages.length > 0 && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleSave('image')}
                        disabled={loading || uploadedImages.length === 0}
                        className="flex-1 text-xs h-7"
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCancel('image')}
                        disabled={loading}
                        className="flex-1 text-xs h-7"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded border border-gray-200 p-2 flex items-center justify-center">
                  <img
                    src={currentProduct.image_url}
                    alt={currentProduct.name}
                    className="max-w-full max-h-48 object-contain"
                  />
                </div>
              )}
            </div>

            <Separator />

            {/* Product Metadata */}
            <div className="space-y-3">
              {/* SKU */}
              <div>
                <div className="text-xs font-medium text-gray-500 mb-1">SKU</div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm text-gray-900">
                    {currentProduct.sku || 'Not set'}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingField('sku')}
                    className="h-6 w-6 p-0"
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              {/* Location */}
              <div>
                <div className="text-xs font-medium text-gray-500 mb-1">Location</div>
                {editingField === 'location' ? (
                  <div className="space-y-2">
                    <Input
                      value={form.location}
                      onChange={(e) => setForm(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Enter location (e.g. row6 box 4)"
                      disabled={loading}
                      className="text-sm"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleSave('location')}
                        disabled={loading}
                        className="flex-1 h-7 text-xs"
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCancel('location')}
                        disabled={loading}
                        className="flex-1 h-7 text-xs"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-900">
                      {currentProduct.location || 'Not set'}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingField('location')}
                      className="h-6 w-6 p-0"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>

              {/* UPC/Barcode */}
              {currentProduct.barcode && (
                <div>
                  <div className="text-xs font-medium text-gray-500 mb-1">UPC/Barcode</div>
                  <span className="font-mono text-sm text-gray-900">{currentProduct.barcode}</span>
                </div>
              )}
            </div>

            {/* Quick Metadata */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Created:</span>
                <span className="text-gray-900">
                  {currentProduct.created_at ? format(new Date(currentProduct.created_at), 'MMM dd, yyyy') : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Last Updated:</span>
                <span className="text-gray-900">
                  {currentProduct.updated_at ? format(new Date(currentProduct.updated_at), 'MMM dd, yyyy') : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Pane - Scrollable */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Sticky Header Actions */}
          <div className="sticky top-0 z-10 bg-white border-b px-6 py-3">
            <div className="flex items-center justify-between">
              {editingField === 'name' ? (
                <div className="flex-1 flex items-center gap-2">
                  <Input
                    value={form.name}
                    onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                    className="text-xl font-bold"
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
                  <h1 className="text-xl font-bold">{currentProduct.name}</h1>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingField('name')}
                    className="h-6 w-6 p-0"
                    title="Edit product name"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full mb-6 grid-cols-2 gap-2 bg-white border rounded-md p-1">
                  <TabsTrigger value="overview" className="px-3 py-1 rounded text-sm">Overview</TabsTrigger>
                  {!currentProduct.is_variant && (
                    <TabsTrigger value="variants" className="px-3 py-1 rounded text-sm">
                      <div className="flex items-center">
                        <span>Variants</span>
                        {variants.length > 0 && (
                          <Badge variant="secondary" className="ml-2 text-xs">
                            {variants.length}
                          </Badge>
                        )}
                      </div>
                    </TabsTrigger>
                  )}
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="mt-0 space-y-6">
                  {/* Description Section */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">Description</h3>
                      {editingField !== 'description' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingField('description')}
                          className="h-6 w-6 p-0"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                    
                    {editingField === 'description' ? (
                      <div className="space-y-2">
                        <Textarea
                          value={form.description}
                          onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Enter product description"
                          disabled={loading}
                          className="min-h-[100px]"
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleSave('description')}
                            disabled={loading}
                            className="flex-1"
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
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
                      <p className="text-sm text-gray-600">
                        {currentProduct.description || 'No description provided'}
                      </p>
                    )}
                  </div>

                  <Separator />

                  {/* Stock Information */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">Stock Information</h3>
                      {editingField !== 'stock' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingField('stock')}
                          className="h-6 w-6 p-0"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                    
                    {editingField === 'stock' ? (
                      <div className="space-y-3">
           
                        <div>
                          <Label>Minimum Stock Level</Label>
                          <Input
                            type="number"
                            value={form.minimum_stock_level}
                            onChange={(e) => setForm(prev => ({ ...prev, minimum_stock_level: Number(e.target.value) }))}
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
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Current Stock</div>
                          <div className="flex items-center gap-2">
                            <div className={cn('w-2 h-2 rounded-full', stockDotColor)} />
                            <span className="text-lg font-semibold">{formatQty(totalStock)}</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Minimum Level</div>
                          <span className="text-lg font-semibold">{formatQty(currentProduct.minimum_stock_level)}</span>
                        </div>
                        <div className="col-span-2">
                          <Badge variant={stockStatus === 'Out of Stock' ? 'destructive' : stockStatus === 'Low Stock' ? 'secondary' : 'default'}>
                            {stockStatus}
                          </Badge>
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Pricing Information */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">Pricing</h3>
                      {editingField !== 'pricing' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingField('pricing')}
                          className="h-6 w-6 p-0"
                        >
                          <Edit className="w-3 h-3" />
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
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Purchase Price</div>
                          <span className="text-lg font-semibold">{formatPrice(currentProduct.purchase_price || 0)}</span>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Sale Price</div>
                          <span className="text-lg font-semibold">{formatPrice(currentProduct.sale_price || 0)}</span>
                        </div>
                      </div>
                    )}
                  </div>
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
                                if (selectedVariantIds.size > 0) {
                                  const selectedVariants = variants.filter(v => selectedVariantIds.has(v.id));
                                  if (selectedVariants.length > 0) {
                                    handleAdjustStock(selectedVariants[0]);
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
                                            className="h-7"
                                          >
                                            Save
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={handleCancelVariantEdit}
                                            disabled={loading}
                                            className="h-7"
                                          >
                                            Cancel
                                          </Button>
                                        </div>
                                      ) : (
                                        <div className="flex items-center justify-end gap-2">
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleEditVariant(variant)}
                                            className="h-7 w-7 p-0"
                                          >
                                            <Edit className="w-4 h-4" />
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleAdjustStock(variant)}
                                            className="h-7 w-7 p-0"
                                          >
                                            <TrendingUp className="w-4 h-4" />
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
            </div>
          </div>
        </div>
      </div>
      <AddVariantModal
        isOpen={isAddVariantModalOpen}
        onClose={() => setIsAddVariantModalOpen(false)}
        parentProduct={currentProduct}
        onVariantAdded={handleVariantAdded}
      />
      {/* Modals */}
      {isStockAdjustModalOpen && (selectedProductForStock || currentProduct) && (
        <EditProductStockModal
          isOpen={isStockAdjustModalOpen}
          onClose={() => {
            setIsStockAdjustModalOpen(false);
            setSelectedProductForStock(null);
          }}
          product={selectedProductForStock || currentProduct}
          onProductUpdated={async () => {
            if (id && activeBranch) {
              const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .eq('branch_id', activeBranch.branch_id)
                .single();

              if (!error && data) {
                setCurrentProduct(data);
                setForm(prev => ({
                  ...prev,
                  quantity_in_stock: data.quantity_in_stock || 0,
                  minimum_stock_level: data.minimum_stock_level || 0,
                }));
              }
            }

            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['productsByCategories'] });
            setIsStockAdjustModalOpen(false);
            setSelectedProductForStock(null);
          }}
        />
      )}

      {isTransferModalOpen && currentProduct && (
        <WarehouseTransferModal
          isOpen={isTransferModalOpen}
          onClose={() => setIsTransferModalOpen(false)}
          product={currentProduct}
          onTransferComplete={handleTransferComplete}
        />
      )}

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

    </div>
  );
}
  