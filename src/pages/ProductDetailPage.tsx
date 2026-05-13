import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Edit, Plus, Trash2, MapPin, Package, Tag, Image as ImageIcon, QrCode, Archive, Save, X, Scan, Check, ChevronsUpDown, TrendingUp, ArrowUpRight, Minus, DollarSign, ShoppingCart, BarChart2, FileText } from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';
import { useBranches } from '@/hooks/useBranches';
import { useAuth } from '@/hooks/useAuth';
import { useCategoriesFetch } from '@/hooks/useCategoriesFetch';
import { useLocations } from '@/hooks/useLocations';
import { useQueryClient } from '@tanstack/react-query';
import { useScannerSettings } from '@/hooks/useScannerSettings';
import { useWarehouses } from '@/hooks/useWarehouses';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import type { Product as StockProduct } from '@/types/stockTypes';
import { toast } from 'sonner';

type ProductRow = Database['public']['Tables']['products']['Row'];
type Product = ProductRow & { sku?: string | null };
import { EditProductStockModal } from '@/components/EditProductStockModal';
import { AddVariantModal } from '@/components/AddVariantModal';
import { BarcodeScanner } from '@/components/BarcodeScanner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BillOfMaterials from '@/components/products/BillOfMaterials';
import { StockHistoryChart } from '@/components/products/StockHistoryChart';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  const [variants, setVariants] = useState<Product[]>([]);
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
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [parentProduct, setParentProduct] = useState<Product | null>(null);
  
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

  // Locations state for multiple locations support
  const [locations, setLocations] = useState<string[]>(['']);
  
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
  const { categories, refetch: refetchCategories } = useCategoriesFetch();
  const [newCategoryName, setNewCategoryName] = useState('');

  // Locations state (for combobox - known locations from the locations table)
  const { data: knownLocations = [] } = useLocations();
  const [openLocationIndex, setOpenLocationIndex] = useState<number | null>(null);

  // Modal states
  const [isStockAdjustModalOpen, setIsStockAdjustModalOpen] = useState(false);
  const [stockModalActionType, setStockModalActionType] = useState<'in' | 'out'>('in');
  const [showBarcodeGenerator, setShowBarcodeGenerator] = useState(false);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id || !activeBranch) return;
      
      setProductLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*, categories(name)')
          .eq('id', id)
          .eq('branch_id', activeBranch.branch_id)
          .single();

        if (error) throw error;

        if (data) {
          const product = data as any;
          const resolvedCategoryName = (product.categories as any)?.name || product.category_name || '';
          setCurrentProduct({ ...product, category_name: resolvedCategoryName });
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
            category_name: resolvedCategoryName,
          });
          // Initialize locations array from comma-separated string
          if (product.location) {
            const locationArray = product.location.split(',').map(l => l.trim()).filter(l => l);
            setLocations(locationArray.length > 0 ? locationArray : ['']);
          } else {
            setLocations(['']);
          }
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

  // Fetch parent product if viewing a variant
  useEffect(() => {
    const fetchParentProduct = async () => {
      if (currentProduct?.is_variant && currentProduct?.parent_product_id && activeBranch) {
        try {
          const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', currentProduct.parent_product_id)
            .eq('branch_id', activeBranch.branch_id)
            .single();

          if (error) throw error;
          setParentProduct(data);
        } catch (error) {
          console.error('Error fetching parent product:', error);
          setParentProduct(null);
        }
      } else {
        setParentProduct(null);
      }
    };

    fetchParentProduct();
  }, [currentProduct?.is_variant, currentProduct?.parent_product_id, activeBranch?.branch_id]);

  // Fetch variants when product changes
  useEffect(() => {
    if (currentProduct && !currentProduct.is_variant && activeBranch) {
      fetchVariants();
    } else {
      setVariants([]);
    }
  }, [currentProduct?.id, activeBranch?.branch_id]);

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
      setVariants((data || []) as Product[]);
    } catch (error) {
      console.error('Error fetching variants:', error);
      toast.error('Failed to load variants');
    } finally {
      setIsLoadingVariants(false);
    }
  };

  const handleVariantAdded = () => {
    fetchVariants();
    queryClient.invalidateQueries({ queryKey: ['productsByCategories'] });
    queryClient.invalidateQueries({ queryKey: ['products'] });
  };

  // Handle variant editing
  const handleEditVariant = (variant: Product) => {
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
        // @ts-expect-error - Supabase products update type inference can fail
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

        const existing = existingCategory as { id: string } | null;
        if (existing) {
          categoryId = existing.id;
        } else {
          const { data: newCategory, error: categoryError } = await supabase
            .from('categories')
            // @ts-expect-error - Supabase categories insert type inference can fail
            .insert({ name: form.category_name.trim(), user_id: user.id })
            .select('id')
            .single();

          if (categoryError || !newCategory) {
            toast.error('Error creating category');
            setLoading(false);
            return;
          }
          categoryId = (newCategory as { id: string }).id;
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
        // Join locations array with commas, filter out empty strings
        const locationString = locations.filter(l => l.trim()).join(', ') || null;
        updateData.location = locationString;
      } else if (field === 'category') {
        updateData.category_id = categoryId;
        updateData.category_name = form.category_name.trim() || null;
      } else if (field === 'image') {
        updateData.image_url = imageUrl;
      }

      const { error: updateError } = await supabase
        .from('products')
        // @ts-expect-error - Supabase products update type inference can fail
        .update(updateData)
        .eq('id', currentProduct.id);
        
      if (updateError) {
        console.error('Error updating product:', updateError);
        toast.error('Error updating product');
        setLoading(false);
        return;
      }

      // When location is saved, ensure any new location names are created in the locations table
      if (field === 'location') {
        const knownLocationNames = new Set(knownLocations.map(l => l.name));
        for (const loc of locations.filter(l => l.trim())) {
          const locName = loc.trim();
          if (!knownLocationNames.has(locName)) {
            const { error: locErr } = await supabase
              .from('locations')
              .insert({ name: locName, user_id: user.id });
            if (locErr && locErr.code !== '23505' && !locErr.message?.includes('unique')) {
              console.warn('Could not create location entry:', locErr);
            }
          }
        }
        queryClient.invalidateQueries({ queryKey: ['locations'] });
      }

      // Refresh product data
      const { data: updatedData } = await supabase
        .from('products')
        .select('*, categories(name)')
        .eq('id', currentProduct.id)
        .single();

      if (updatedData) {
        const updatedProduct = updatedData as any;
        const resolvedCategoryName = (updatedProduct.categories as any)?.name || updatedProduct.category_name || '';
        setCurrentProduct({ ...updatedProduct, category_name: resolvedCategoryName });
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
          category_name: resolvedCategoryName,
        }));
        // Update locations array from updated product
        if (updatedProduct.location) {
          const locationArray = updatedProduct.location.split(',').map(l => l.trim()).filter(l => l);
          setLocations(locationArray.length > 0 ? locationArray : ['']);
        } else {
          setLocations(['']);
        }
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
      if (field === 'category') {
        queryClient.invalidateQueries({ queryKey: ['categories'] });
        queryClient.invalidateQueries({ queryKey: ['categories-fetch'] });
        refetchCategories();
      }

      toast.success('Product updated successfully');
      setEditingField(null);
      if (field === 'sku') {
        setShowScanner(false);
      }
      if (field === 'category') {
        setNewCategoryName('');
      }
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
    
    // Reset locations array from current product
    if (field === 'location' && currentProduct?.location) {
      const locationArray = currentProduct.location.split(',').map(l => l.trim()).filter(l => l);
      setLocations(locationArray.length > 0 ? locationArray : ['']);
      setOpenLocationIndex(null);
    } else if (field === 'location') {
      setLocations(['']);
      setOpenLocationIndex(null);
    }
    
    // Clear image uploads
    if (field === 'image') {
      uploadedImages.forEach(img => URL.revokeObjectURL(img.preview));
      setUploadedImages([]);
      setNewProductImage(null);
    }

    // Close barcode scanner when canceling SKU edit
    if (field === 'sku') {
      setShowScanner(false);
    }

    // Clear new category input when canceling category edit
    if (field === 'category') {
      setNewCategoryName('');
    }
    
    setEditingField(null);
  };

  const handleCategoryChange = (value: string) => {
    setNewCategoryName('');
    if (value === '__none__') {
      setForm(prev => ({ ...prev, category_id: '', category_name: '' }));
      return;
    }
    const category = categories.find(cat => cat.id === value);
    if (category) {
      setForm(prev => ({ ...prev, category_id: category.id, category_name: category.name }));
    }
  };

  const handleNewCategoryInput = (value: string) => {
    setNewCategoryName(value);
    setForm(prev => ({ ...prev, category_id: '', category_name: value.trim() }));
  };

  const [selectedProductForStock, setSelectedProductForStock] = useState<Product | null>(null);

  const handleAdjustStock = async (product?: Product | null) => {
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
          // @ts-expect-error - Supabase RPC type inference can fail
          const res: any = await supabase.rpc('get_user_branches', { user_id: user.id });
          const branches = res?.data || res;
          if (Array.isArray(branches) && branches.length > 0) {
            const fallbackBranch = branches[0];
            const fallbackBranchId = fallbackBranch.branch_id || fallbackBranch.id || fallbackBranch.branch_id;
            if (fallbackBranchId) {
              console.log('handleAdjustStock: using fallback branch id from RPC', fallbackBranchId);
              const fallbackProduct = { ...prodToUse, branch_id: fallbackBranchId };
              setStockModalActionType('in');
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

    setStockModalActionType('in');
    setSelectedProductForStock(prodToUse);
    setIsStockAdjustModalOpen(true);
  };

  const handleStockIn = () => {
    if (!currentProduct) return;
    setStockModalActionType('in');
    setSelectedProductForStock(currentProduct);
    setIsStockAdjustModalOpen(true);
  };

  const handleStockOut = () => {
    if (!currentProduct) return;
    setStockModalActionType('out');
    setSelectedProductForStock(currentProduct);
    setIsStockAdjustModalOpen(true);
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
        queryClient.invalidateQueries({ queryKey: ['productCount'] });
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
    const status = currentProduct.status as string | null;
    if (status === 'inactive') return { label: 'Inactive', variant: 'secondary' as const };
    if (status === 'discontinued') return { label: 'Discontinued', variant: 'destructive' as const };
    return { label: 'Active', variant: 'default' as const };
  };

  const productStatus = getProductStatus();

  return (
    <div className="h-screen pb-6 flex flex-col bg-white rounded-lg">
      {/* Breadcrumb + Header */}
      <div className="border-b  px-6 py-2 bg-white rounded-t-xl">
        <div className="flex items-center justify-between ">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/dashboard/categories')}
              className="gap-2 border-gray-300 hover:bg-gray-50 p-2"
            >
              <ArrowLeft className="w-4 h-4 text-gray-500" />
              <span className="text-xs">Back</span>
            </Button>
            <nav className="text-xs text-gray-500">
              <span className="cursor-pointer hover:underline" onClick={() => navigate('/dashboard/categories')}>Products</span>
              {currentProduct?.is_variant && parentProduct && (
                <>
                  <span className="mx-2">/</span>
                  <span 
                    className="cursor-pointer hover:underline text-blue-600"
                    onClick={() => navigate(`/dashboard/products/${parentProduct.id}`)}
                  >
                    {parentProduct.name}
                  </span>
                </>
              )}
              <span className="mx-2">/</span>
              <span className="text-gray-900 font-medium">
                {currentProduct?.is_variant ? (currentProduct?.variant_name || currentProduct?.name) : currentProduct?.name}
              </span>
              {currentProduct?.is_variant && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  Variant
                </Badge>
              )}
            </nav>
          </div>
          <div className="px-6 py-3">
            <Button
              onClick={handleStockIn}
              variant="outline"
              size="sm"
              className="gap-2 text-xs mr-2 text-green-600 hover:text-green-600 hover:bg-green-50"
              title="Adjust Stock (A)"
            >
              <Plus className="w-3 h-3" />
              In
            </Button>

            <Button onClick={handleStockOut} variant="outline" size="sm" className="gap-2 text-xs mr-2 text-red-600 hover:text-red-600 hover:bg-red-50" title="Stock Out (O)">
              <Minus className="w-3 h-3" />
              Out
            </Button>
            <Button
              onClick={handleDelete}
              variant="default"
              size="sm"
              className="gap-2 bg-red-600 mr-2 text-xs text-white hover:text-white hover:bg-red-600"
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
              {/* Category */}
              <div className="bg-white border border-gray-200 rounded-md p-2">
                <div className="text-xs font-medium text-gray-500 mb-1">Category</div>
                {editingField === 'category' ? (
                  <div className="space-y-2">
                    <Select
                      value={newCategoryName ? '__none__' : (form.category_id || '__none__')}
                      onValueChange={handleCategoryChange}
                      disabled={loading}
                    >
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none__">No Category</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="space-y-1">
                      <label className="text-xs text-gray-500">Or add new category</label>
                      <Input
                        value={newCategoryName}
                        onChange={(e) => handleNewCategoryInput(e.target.value)}
                        placeholder="Type new category name"
                        disabled={loading}
                        className="h-9 text-sm"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleSave('category')}
                        disabled={loading}
                        className="flex-1 h-7 text-xs"
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCancel('category')}
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
                      {currentProduct.category_name || 'Not set'}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingField('category')}
                      className="h-6 w-6 p-0"
                      title="Edit category"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>

              {/* SKU */}
              <div className="bg-white border border-gray-200 rounded-md p-2">
                <div className="text-xs font-medium text-gray-500 mb-1">SKU</div>
                {editingField === 'sku' ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={form.sku}
                        onChange={(e) => setForm(prev => ({ ...prev, sku: e.target.value }))}
                        placeholder="Enter SKU"
                        disabled={loading}
                        className="text-sm font-mono flex-1"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowScanner(true)}
                        disabled={loading}
                        className="h-9 shrink-0 gap-1.5"
                        title="Scan barcode"
                      >
                        <Scan className="w-4 h-4" />
                        Scan
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleSave('sku')}
                        disabled={loading}
                        className="flex-1 h-7 text-xs"
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCancel('sku')}
                        disabled={loading}
                        className="flex-1 h-7 text-xs"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm text-gray-900">
                      {currentProduct.sku || 'Not set'}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingField('sku')}
                      className="h-6 w-6 p-0"
                      title="Edit SKU"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Location */}
              <div className="bg-white border border-gray-200 rounded-md p-2">
                <div className="text-xs font-medium text-gray-500 mb-1">Location</div>
                {editingField === 'location' ? (
                  <div className="space-y-2">
                    {locations.map((location, index) => (
                      <div key={index} className="flex gap-2">
                        <Popover
                          open={openLocationIndex === index}
                          onOpenChange={(open) => setOpenLocationIndex(open ? index : null)}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              disabled={loading}
                              className="flex-1 justify-between text-sm font-normal h-9 px-3"
                            >
                              <span className={cn(location ? 'text-gray-900' : 'text-gray-400')}>
                                {location || 'Select or type location...'}
                              </span>
                              <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="p-0 w-[220px]" align="start">
                            <Command shouldFilter={false}>
                              <CommandInput
                                placeholder="Search or type new..."
                                value={location}
                                onValueChange={(val) => {
                                  const newLocations = [...locations];
                                  newLocations[index] = val;
                                  setLocations(newLocations);
                                }}
                              />
                              <CommandList>
                                <CommandEmpty>
                                  {location.trim() ? (
                                    <div
                                      className="px-2 py-1.5 text-sm text-blue-600 cursor-pointer hover:bg-gray-50 flex items-center gap-1.5"
                                      onClick={() => setOpenLocationIndex(null)}
                                    >
                                      <Plus className="w-3 h-3" />
                                      Add "{location.trim()}"
                                    </div>
                                  ) : (
                                    <span className="px-2 py-1.5 text-sm text-gray-400 block">
                                      Type to add a new location
                                    </span>
                                  )}
                                </CommandEmpty>
                                {knownLocations.filter(
                                  (loc) =>
                                    !location ||
                                    loc.name.toLowerCase().includes(location.toLowerCase())
                                ).length > 0 && (
                                  <CommandGroup heading="Locations">
                                    {knownLocations
                                      .filter(
                                        (loc) =>
                                          !location ||
                                          loc.name.toLowerCase().includes(location.toLowerCase())
                                      )
                                      .map((loc) => (
                                        <CommandItem
                                          key={loc.name}
                                          value={loc.name}
                                          onSelect={() => {
                                            const newLocations = [...locations];
                                            newLocations[index] = loc.name;
                                            setLocations(newLocations);
                                            setOpenLocationIndex(null);
                                          }}
                                        >
                                          <Check
                                            className={cn(
                                              'mr-2 h-3 w-3',
                                              location === loc.name ? 'opacity-100' : 'opacity-0'
                                            )}
                                          />
                                          {loc.name}
                                        </CommandItem>
                                      ))}
                                  </CommandGroup>
                                )}
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        {locations.length > 1 && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              const newLocations = locations.filter((_, i) => i !== index);
                              setLocations(newLocations.length > 0 ? newLocations : ['']);
                            }}
                            disabled={loading}
                            className="h-9 w-9 p-0"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setLocations([...locations, ''])}
                      disabled={loading}
                      className="w-full h-7 text-xs"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add Location
                    </Button>
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
                    <div className="flex flex-wrap gap-1 flex-1">
                      {currentProduct.location ? (
                        currentProduct.location.split(',').map((loc: string, idx: number) => {
                          const trimmedLoc = loc.trim();
                          return trimmedLoc ? (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              <MapPin className="w-2.5 h-2.5 mr-1" />
                              {trimmedLoc}
                            </Badge>
                          ) : null;
                        })
                      ) : (
                        <span className="text-sm text-gray-500">Not set</span>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        // Initialize locations when entering edit mode
                        if (currentProduct.location) {
                          const locationArray = currentProduct.location.split(',').map(l => l.trim()).filter(l => l);
                          setLocations(locationArray.length > 0 ? locationArray : ['']);
                        } else {
                          setLocations(['']);
                        }
                        setEditingField('location');
                      }}
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
          {/* Sticky Header */}
          <div className="sticky top-0 z-10 bg-white border-b px-6 py-4">
            <div className="flex items-start justify-between">
              {editingField === 'name' ? (
                <div className="flex-1 flex items-center gap-2">
                  <Input
                    value={form.name}
                    onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                    className="text-xl font-bold"
                    disabled={loading}
                  />
                  <Button size="sm" onClick={() => handleSave('name')} disabled={loading || !form.name.trim()}>
                    <Save className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleCancel('name')} disabled={loading}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {currentProduct.is_variant && parentProduct && (
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs font-normal">
                        <Package className="w-3 h-3 mr-1" />
                        Parent: {parentProduct.name}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/dashboard/products/${parentProduct.id}`)}
                        className="h-5 px-2 text-xs gap-1"
                      >
                        <ArrowUpRight className="w-3 h-3" />
                        View
                      </Button>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold text-gray-900">
                      {currentProduct.is_variant ? (currentProduct.variant_name || currentProduct.name) : currentProduct.name}
                    </h1>
                    {currentProduct.is_variant && (
                      <Badge variant="secondary" className="text-xs">Variant</Badge>
                    )}
                    <Badge
                      className={cn(
                        'text-xs',
                        productStatus.variant === 'destructive'
                          ? 'bg-red-100 text-red-700 border-red-200'
                          : productStatus.variant === 'secondary'
                          ? 'bg-gray-100 text-gray-600 border-gray-200'
                          : 'bg-green-100 text-green-700 border-green-200'
                      )}
                      variant="outline"
                    >
                      {productStatus.label}
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingField('name')}
                      className="h-6 w-6 p-0 hover:bg-gray-100 rounded-lg"
                    >
                      <Edit className="w-3.5 h-3.5 text-gray-400" />
                    </Button>
                  </div>
                  {currentProduct.sku && (
                    <p className="text-xs text-gray-400 font-mono">SKU: {currentProduct.sku}</p>
                  )}
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
                  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                          <FileText className="w-4 h-4 text-purple-600" />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900">Description</h3>
                      </div>
                      {editingField !== 'description' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingField('description')}
                          className="h-7 w-7 p-0 rounded-lg hover:bg-gray-100"
                        >
                          <Edit className="w-3.5 h-3.5 text-gray-400" />
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
                      <p className="text-sm text-gray-500 leading-relaxed">
                        {currentProduct.description || 'No description provided'}
                      </p>
                    )}
                  </div>


                  {/* Stock Information */}
                  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                          <BarChart2 className="w-4 h-4 text-blue-600" />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900">Stock Information</h3>
                      </div>
                      {editingField !== 'stock' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingField('stock')}
                          className="h-7 w-7 p-0 rounded-lg hover:bg-gray-100"
                        >
                          <Edit className="w-3.5 h-3.5 text-gray-400" />
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
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="text-xs text-gray-500 mb-1 font-medium">Current Stock</div>
                            <div className="flex items-center gap-2">
                              <div className={cn('w-2.5 h-2.5 rounded-full', stockDotColor)} />
                              <span className="text-2xl font-bold text-gray-900">{formatQty(totalStock)}</span>
                            </div>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="text-xs text-gray-500 mb-1 font-medium">Minimum Level</div>
                            <span className="text-2xl font-bold text-gray-900">{formatQty(currentProduct.minimum_stock_level)}</span>
                          </div>
                        </div>
                        {/* Stock level bar */}
                        {currentProduct.minimum_stock_level > 0 && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs text-gray-400">
                              <span>0</span>
                              <span>Min: {formatQty(currentProduct.minimum_stock_level)}</span>
                            </div>
                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={cn('h-full rounded-full transition-all', stockDotColor)}
                                style={{
                                  width: `${Math.min(100, (totalStock / (currentProduct.minimum_stock_level * 2)) * 100)}%`,
                                }}
                              />
                            </div>
                          </div>
                        )}
                        <div>
                          <Badge
                            className={cn(
                              'text-xs font-medium px-2.5 py-0.5',
                              stockStatus === 'Out of Stock'
                                ? 'bg-red-100 text-red-700 border-red-200'
                                : stockStatus === 'Low Stock'
                                ? 'bg-orange-100 text-orange-700 border-orange-200'
                                : 'bg-green-100 text-green-700 border-green-200'
                            )}
                            variant="outline"
                          >
                            {stockStatus}
                          </Badge>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Pricing Information */}
                  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                          <DollarSign className="w-4 h-4 text-emerald-600" />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900">Pricing</h3>
                      </div>
                      {editingField !== 'pricing' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingField('pricing')}
                          className="h-7 w-7 p-0 rounded-lg hover:bg-gray-100"
                        >
                          <Edit className="w-3.5 h-3.5 text-gray-400" />
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
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="text-xs text-gray-500 mb-1 font-medium">Purchase Price</div>
                          <span className="text-xl font-bold text-gray-900">{formatPrice(currentProduct.purchase_price || 0)}</span>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="text-xs text-gray-500 mb-1 font-medium">Sale Price</div>
                          <span className="text-xl font-bold text-gray-900">{formatPrice(currentProduct.sale_price || 0)}</span>
                        </div>
                        {(currentProduct.purchase_price || 0) > 0 && (currentProduct.sale_price || 0) > 0 && (
                          <div className="col-span-2 flex items-center gap-1.5 text-xs text-gray-500">
                            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                            <span>
                              Margin:{' '}
                              <span className="font-semibold text-emerald-600">
                                {(((currentProduct.sale_price || 0) - (currentProduct.purchase_price || 0)) / (currentProduct.sale_price || 1) * 100).toFixed(1)}%
                              </span>
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Stock History Chart */}
                  {activeBranch && (
                    <StockHistoryChart
                      productId={currentProduct.id}
                      branchId={activeBranch.branch_id}
                      currentStock={totalStock}
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
                                          placeholder="Enter locations (comma-separated)"
                                        />
                                      ) : (
                                        <div className="flex flex-wrap gap-1">
                                          {variant.location ? (
                                            variant.location.split(',').map((loc: string, idx: number) => {
                                              const trimmedLoc = loc.trim();
                                              return trimmedLoc ? (
                                                <Badge key={idx} variant="secondary" className="text-xs">
                                                  {trimmedLoc}
                                                </Badge>
                                              ) : null;
                                            })
                                          ) : (
                                            <span className="text-sm text-gray-500">-</span>
                                          )}
                                        </div>
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
        parentProduct={currentProduct as StockProduct}
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
          product={(selectedProductForStock || currentProduct) as StockProduct}
          actionType={stockModalActionType}
          onProductUpdated={async () => {
            if (id && activeBranch) {
              const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .eq('branch_id', activeBranch.branch_id)
                .single();

              if (!error && data) {
                const product = data as Product;
                setCurrentProduct(product);
                setForm(prev => ({
                  ...prev,
                  quantity_in_stock: product.quantity_in_stock || 0,
                  minimum_stock_level: product.minimum_stock_level || 0,
                }));
                if (!product.is_variant) {
                  fetchVariants();
                }
              }
            }

            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['productsByCategories'] });
            setIsStockAdjustModalOpen(false);
            setSelectedProductForStock(null);
          }}
        />
      )}

      {showScanner && (
        <BarcodeScanner
          onBarcodeDetected={handleBarcodeDetected}
          onClose={() => setShowScanner(false)}
          onScanSuccess={onScanSuccess}
          settings={scannerSettings}
          variant="modal"
        />
      )}

    </div>
  );
}
  