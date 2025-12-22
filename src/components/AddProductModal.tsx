import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { toast } from 'sonner';
import { AlertCircle, Check, ChevronsUpDown, Plus, Scan, Info, Upload, X, Image as ImageIcon, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useMobile } from '@/hooks/use-mobile';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { HierarchicalCategorySelector } from '@/components/categories/HierarchicalCategorySelector';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { BarcodeScanner } from './BarcodeScanner';
import { useScannerSettings } from '@/hooks/useScannerSettings';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

// --- Data Interfaces ---

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: () => void;
  onFirstProductAdded?: () => void;
  preFilledSKU?: string;
  preFilledName?: string;
  preFilledCategoryId?: string;
  // Edit mode props
  editMode?: boolean;
  existingProduct?: any;
  onProductUpdated?: () => void;
  onAdjustStock?: (product: any) => void;
  onDelete?: (product: any) => void;
}

interface VariantData {
  variantName: string;
  quantityInStock: number;
  minimumStockLevel: number;
  purchasePrice: number;
  salePrice: number;
  sku?: string;
  barcode?: string;
  location?: string;
}

interface FormData {
  name: string;
  description: string;
  categoryId: string;
  categoryName: string;
  quantityInStock: number;
  minimumStockLevel: number;
  purchasePrice: number;
  salePrice: number;
  location: string;
  sku: string;
}

// --- Zod Schema for Robust Validation ---
const productSchema = z.object({
  name: z.string().min(1, 'Product name is mandatory.'),
  description: z.string().optional(),
  categoryId: z.string().optional(),
  categoryName: z.string().optional(),
  quantityInStock: z.number().min(0, 'Stock must be 0 or more.').default(0),
  minimumStockLevel: z.number().min(0, 'Minimum level must be 0 or more.').default(0),
  purchasePrice: z.number().min(0, 'Purchase price must be 0 or more.').default(0),
  salePrice: z.number().min(0, 'Sale price must be 0 or more.').default(0),
  location: z.string().optional(),
  sku: z.string().optional(),
});


export const AddProductModal = ({ 
  isOpen, 
  onClose, 
  onProductAdded, 
  onFirstProductAdded, 
  preFilledSKU, 
  preFilledName, 
  preFilledCategoryId,
  editMode = false,
  existingProduct,
  onProductUpdated,
  onAdjustStock,
  onDelete
}: AddProductModalProps) => {
  console.log('[AddProductModal] Initialization: Component mounted with props.', { editMode, existingProduct: !!existingProduct });

  // --- Hooks and State ---
  const { user } = useAuth();
  const { activeBranch, loading: branchLoading } = useBranches();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [duplicateName, setDuplicateName] = useState(false);
  const [productImage, setProductImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  // Enhanced image upload state
  const [uploadedImages, setUploadedImages] = useState<Array<{
    file: File;
    preview: string;
    size: number;
    uploading?: boolean;
    progress?: number;
    uploadSpeed?: number;
  }>>([]);
  const [isDragging, setIsDragging] = useState(false);
  // Re-added for completeness, assuming original code intended to use this state
  const [showUpgradeNotice, setShowUpgradeNotice] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const navigate = useNavigate();
  const { isMobile } = useMobile();
  const { settings: scannerSettings, onScanSuccess } = useScannerSettings();

  // Safety: prevent indefinite loading if background/tab-switch caused a stuck request
  useEffect(() => {
    if (!loading) return;
    const timer = setTimeout(async () => {
      try {
        await supabase.auth.refreshSession();
      } catch {}
      toast.error('Request took too long. Session refreshed, please try again.');
      setLoading(false);
    }, 12000); // 12s safety timeout
    return () => clearTimeout(timer);
  }, [loading]);

  // Resume handler on visibility return to avoid stuck modal after tab switch
  useEffect(() => {
    const onVisible = () => {
      if (!document.hidden && loading) {
        setLoading(false);
        toast.info('Connection resumed. Please retry adding the product.');
      }
    };
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', onVisible);
    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', onVisible);
    };
  }, [loading]);
  
  const [categories, setCategorys] = useState<Array<{ id: string; name: string }>>([]);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [variants, setVariants] = useState<VariantData[]>([]);
  const [showVariantsSection, setShowVariantsSection] = useState(false);
  
  // Compute hasVariants based on whether any variant has a name
  const hasVariants = variants.some(v => v.variantName.trim().length > 0);
  
  usePageRefresh();

  // --- Form Initialization ---
  const form = useForm<FormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      categoryId: '',
      categoryName: '',
      quantityInStock: 0,
      minimumStockLevel: 10,
      purchasePrice: 0,
      salePrice: 0,
      location: '',
      sku: '',
    },
  });

  // Load existing product data when in edit mode
  useEffect(() => {
    if (editMode && existingProduct && isOpen) {
      console.log('[AddProductModal] Loading existing product data for edit mode');
      form.reset({
        name: existingProduct.name || '',
        description: existingProduct.description || '',
        categoryId: existingProduct.category_id || '',
        categoryName: existingProduct.category_name || '',
        quantityInStock: existingProduct.quantity_in_stock || 0,
        minimumStockLevel: existingProduct.minimum_stock_level || 10,
        purchasePrice: existingProduct.purchase_price || 0,
        salePrice: existingProduct.sale_price || 0,
        location: existingProduct.location || '',
        sku: existingProduct.sku || '',
      });
      
      // Load existing image if available
      if (existingProduct.image_url) {
        // Note: We can't directly set a File from URL, so we'll handle this in the UI
        setImagePreview(existingProduct.image_url);
      }
      
      // Load variants if this is a parent product
      if (!existingProduct.is_variant) {
        fetchExistingVariants();
      }
    } else if (!editMode && isOpen) {
      // Reset form for new product
      form.reset({
        name: '',
        description: '',
        categoryId: '',
        categoryName: '',
        quantityInStock: 0,
        minimumStockLevel: 10,
        purchasePrice: 0,
        salePrice: 0,
        location: '',
        sku: '',
      });
      setVariants([]);
      setShowVariantsSection(false);
      setImagePreview(null);
      setUploadedImages([]);
    }
  }, [editMode, existingProduct, isOpen, form]);

  // Fetch existing variants for edit mode
  const fetchExistingVariants = async () => {
    if (!existingProduct?.id || !activeBranch) return;
    
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('parent_product_id', existingProduct.id)
        .eq('branch_id', activeBranch.branch_id)
        .order('variant_name');

      if (error) throw error;
      
      if (data && data.length > 0) {
        const loadedVariants: VariantData[] = data.map(v => ({
          variantName: v.variant_name || '',
          quantityInStock: v.quantity_in_stock || 0,
          minimumStockLevel: v.minimum_stock_level || 0,
          purchasePrice: v.purchase_price || 0,
          salePrice: v.sale_price || 0,
          sku: v.variant_sku || '',
          barcode: v.variant_barcode || '',
          location: v.location || '',
        }));
        setVariants(loadedVariants);
        setShowVariantsSection(true);
      }
    } catch (error) {
      console.error('Error fetching variants:', error);
    }
  };

  // --- Effects ---

  // Handle pre-filled SKU
  useEffect(() => {
    if (preFilledSKU && isOpen) {
      console.log(`[AddProductModal] Setting pre-filled SKU: ${preFilledSKU}`);
      form.setValue('sku', preFilledSKU);
    }
  }, [preFilledSKU, isOpen, form]);

  useEffect(() => {
    if (preFilledName && isOpen) {
      console.log(`[AddProductModal] Setting pre-filled product name: ${preFilledName}`);
      form.setValue('name', preFilledName, { shouldDirty: true });
    }
  }, [preFilledName, isOpen, form]);

  // Handle pre-filled category
  useEffect(() => {
    if (preFilledCategoryId && isOpen) {
      console.log(`[AddProductModal] Setting pre-filled category ID: ${preFilledCategoryId}`);
      form.setValue('categoryId', preFilledCategoryId);
      // Try to find category name from the categories list
      const category = categories.find(c => c.id === preFilledCategoryId);
      if (category) {
        form.setValue('categoryName', category.name);
        console.log(`[AddProductModal] Found category name: ${category.name}`);
      }
    }
  }, [preFilledCategoryId, isOpen, form, categories]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      uploadedImages.forEach(img => URL.revokeObjectURL(img.preview));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reset uploaded images and variants section when modal closes
  useEffect(() => {
    if (!isOpen) {
      // Cleanup all image previews when modal closes
      uploadedImages.forEach(img => URL.revokeObjectURL(img.preview));
      setUploadedImages([]);
      setIsDragging(false);
      setShowVariantsSection(false);
    }
    // Only depend on isOpen, not uploadedImages to avoid infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Fallback: if name was persisted in localStorage by the opener, use it once
  useEffect(() => {
    if (!isOpen) return;
    try {
      if (!preFilledName) {
        const stored = localStorage.getItem('prefillAddProductName');
        if (stored && stored.trim()) {
          console.log('[AddProductModal] Applying localStorage prefill for product name:', stored);
          form.setValue('name', stored.trim(), { shouldDirty: true });
        }
        localStorage.removeItem('prefillAddProductName');
      } else {
        // Clear any stale value if prop is present
        localStorage.removeItem('prefillAddProductName');
      }
    } catch {}
  }, [isOpen, preFilledName, form]);

  // Check for duplicate product name - debounced
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const checkDuplicate = async (name: string) => {
      name = name.trim();
      if (!name || !activeBranch?.branch_id || hasVariants) {
        setDuplicateName(false);
        return;
      }
      
      console.log(`[AddProductModal] Checking duplicate name: ${name}`);
      const { data, error } = await supabase
        .from('products')
        .select('id')
        .eq('name', name)
        .eq('branch_id', activeBranch.branch_id)
        .eq('is_variant', false);

      if (error) {
        console.error('Error checking duplicate product name:', error);
        setDuplicateName(false);
        return;
      }

      setDuplicateName(data && data.length > 0);
      console.log(`[AddProductModal] Duplicate check result: ${data && data.length > 0 ? 'DUPLICATE' : 'OK'}`);
    };

    const subscription = form.watch((value, { name }) => {
      if (name === 'name') {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => checkDuplicate(value.name || ''), 500);
      }
    });

    return () => {
      clearTimeout(timeoutId);
      subscription.unsubscribe?.();
    };
     
  }, [form, activeBranch, hasVariants]);

  // Fetch Categories
  useEffect(() => {
    if (user && isOpen) {
      console.log('[AddProductModal] Fetching categories.');
      fetchCategorys();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isOpen]);

  // --- Data Fetching Functions ---

  const fetchCategorys = useCallback(async () => {
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
      setCategorys(data || []);
      console.log(`[AddProductModal] Fetched ${data?.length || 0} categories.`);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }, [user]);


  // --- Utility Functions ---

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
        size: file.size,
        uploading: false,
        progress: 0,
        uploadSpeed: 0
      };
    });
    setUploadedImages(prev => [...prev, ...newImages]);
    // Keep first image for backward compatibility
    if (newImages.length > 0) {
      setProductImage(newImages[0].file);
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
        setProductImage(newImages[0].file);
        setImagePreview(newImages[0].preview);
      } else {
        setProductImage(null);
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

  // Handle barcode scanning result
  const handleBarcodeDetected = (barcode: string) => {
    if (showScanner) {
      form.setValue('sku', barcode);
      setShowScanner(false);
      toast.success(`SKU scanned: ${barcode}`);
      console.log(`[AddProductModal] Barcode scanned and set as SKU: ${barcode}`);
    }
  };

  // Generic function to handle Category creation or fetching
  const handleAssociation = useCallback(async (
    nameKey: keyof FormData,
    idKey: keyof FormData,
    tableName: 'categories',
    customFields: Record<string, any> = {}
  ): Promise<string | null> => {
    const name = form.getValues(nameKey)?.trim();
    let id = form.getValues(idKey) || null;

    if (!name && !id) return null;
    if (id && !name) return id; // Already selected by ID

    // Attempt to find existing
    console.log(`[AddProductModal] Checking/Creating ${tableName} with name: ${name}`);
    const { data: existing, error: findError } = await supabase
      .from(tableName)
      .select('id')
      .eq('name', name)
      .maybeSingle();

    if (findError) {
      console.error(`Error finding existing ${tableName}:`, findError);
      toast.error(`Error checking ${tableName}`);
      throw findError;
    }

    if (existing) {
      console.log(`[AddProductModal] Existing ${tableName} found: ${existing.id}`);
      return existing.id;
    }

    // Create new
    const insertData = { name, ...customFields };
    console.log(`[AddProductModal] Creating new ${tableName} with data:`, insertData);

    const { data: newItem, error: createError } = await supabase
      .from(tableName)
      .insert(insertData)
      .select('id')
      .single();

    if (createError) {
      console.error(`Error creating new ${tableName}:`, createError);
      toast.error(`Error creating ${tableName}`);
      throw createError;
    }

    console.log(`[AddProductModal] New ${tableName} created: ${newItem.id}`);
    return newItem.id;
  }, [form]);

  // --- Main Submission Logic ---

  const handleSubmit = async (data: FormData) => {
    console.log('[AddProductModal] Submission started. Mode:', editMode ? 'EDIT' : 'CREATE', 'Data:', data);
    
    // Only check for duplicate name in create mode
    if (!editMode && duplicateName && !hasVariants) {
      toast.error('Product name already exists for a main product in this branch.');
      console.error('[AddProductModal] Submission aborted: Duplicate name detected.');
      return;
    }

    if (!user || branchLoading || !activeBranch) {
      console.error('[AddProductModal] Submission aborted: Auth/Branch check failed.', { user: !!user, branchLoading, activeBranch: !!activeBranch });
      toast.error('Authentication or branch loading failed. Cannot proceed.');
      return;
    }

    if (editMode && !existingProduct?.id) {
      toast.error('Product ID is required for editing.');
      return;
    }

    // Variant validation
    if (hasVariants) {
      const validVariants = variants.filter(v => v.variantName.trim());
      if (validVariants.length === 0) {
        toast.error('Add at least one variant.');
        console.error('[AddProductModal] Submission aborted: No variants provided.');
        return;
      }
      for (const variant of validVariants) {
        if (!variant.variantName.trim()) {
          toast.error('All variants must have a name.');
          console.error('[AddProductModal] Submission aborted: Variant missing name.');
          return;
        }
      }
    }
    
    // Ensure numbers are numbers, not NaN from parsing in form fields
    const validatedData = {
      ...data,
      quantityInStock: Number(data.quantityInStock) || 0,
      minimumStockLevel: Number(data.minimumStockLevel) || 0,
      purchasePrice: Number(data.purchasePrice) || 0,
      salePrice: Number(data.salePrice) || 0,
    };
    
    setLoading(true);
    let wasFirstProduct = false;

    try {
      // 1. Check for first product before insertion
      if (onFirstProductAdded) {
        // Corrected check: using select 'id' and head: true is better than counting
        const { count } = await supabase
          .from('products')
          .select('id', { count: 'exact', head: true })
          .eq('branch_id', activeBranch.branch_id);
        wasFirstProduct = (count || 0) === 0;
        console.log(`[AddProductModal] Product count before adding: ${count}. Was first product: ${wasFirstProduct}`);
      }

      // 2. Handle Image Upload (use first uploaded image)
      let imageUrl: string | null = null;
      const imageToUpload = uploadedImages.length > 0 ? uploadedImages[0].file : productImage;
      if (imageToUpload) {
        console.log('[AddProductModal] Image upload initiated.');
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
        console.log(`[AddProductModal] Image uploaded. URL: ${imageUrl}`);
      }

      // 3. Handle Category Association
      const categoryId = await handleAssociation('categoryName', 'categoryId', 'categories', { user_id: user.id });
      
      let insertedProduct: any = null;
      
      if (!hasVariants) {
        if (editMode && existingProduct) {
          // --- Update Single Product ---
          const updateData = {
            name: validatedData.name,
            description: validatedData.description || null,
            quantity_in_stock: validatedData.quantityInStock,
            minimum_stock_level: validatedData.minimumStockLevel,
            unit_price: validatedData.purchasePrice,
            purchase_price: validatedData.purchasePrice,
            sale_price: validatedData.salePrice,
            category_id: categoryId,
            location: validatedData.location.trim() || null,
            sku: validatedData.sku.trim() || null,
            updated_at: new Date().toISOString(),
            ...(imageUrl && { image_url: imageUrl }),
          };
          console.log('[AddProductModal] Updating single product data:', updateData);
          
          const { data: product, error: productError } = await supabase
            .from('products')
            .update(updateData)
            .eq('id', existingProduct.id)
            .select()
            .single();
            
          if (productError) {
            console.error('Error updating single product:', productError);
            toast.error(`Error updating product: ${productError.message}`);
            setLoading(false);
            return;
          }
          insertedProduct = product;
          console.log(`[AddProductModal] Single product updated: ID ${insertedProduct.id}`);
        } else {
          // --- Single Product Insertion ---
          const productData = {
            name: validatedData.name,
            description: validatedData.description || null,
            quantity_in_stock: validatedData.quantityInStock,
            minimum_stock_level: validatedData.minimumStockLevel,
            unit_price: validatedData.purchasePrice,
            purchase_price: validatedData.purchasePrice,
            sale_price: validatedData.salePrice,
            branch_id: activeBranch.branch_id,
            image_url: imageUrl,
            user_id: user.id,
            category_id: categoryId,
            location: validatedData.location.trim() || null,
            sku: validatedData.sku.trim() || null,
            is_variant: false,
            parent_product_id: null,
            variant_name: null,
          };
          console.log('[AddProductModal] Inserting single product data:', productData);
          
          const { data: product, error: productError } = await supabase
            .from('products')
            .insert(productData)
            .select()
            .single();
            
          if (productError) {
            console.error('Error adding single product:', productError);
            toast.error(`Error adding product: ${productError.message}`);
            setLoading(false);
            return;
          }
          insertedProduct = product;
          console.log(`[AddProductModal] Single product inserted: ID ${insertedProduct.id}`);

          // Initial Stock Transaction for Single Product
          const stockTransactionData = {
            product_id: insertedProduct.id,
            product_name: validatedData.name,
            transaction_type: 'incoming' as const,
            quantity: validatedData.quantityInStock,
            unit_price: validatedData.purchasePrice,
            user_id: user.id,
            created_by: user.id,
            branch_id: activeBranch.branch_id,
            reference_number: 'INITIAL_STOCK',
            notes: 'New product initial stock',
            variant_id: null,
            variant_name: null,
            adjustment_method: 'system'
          };
          console.log('[AddProductModal] Inserting initial transaction for single product.');

          const { error: transactionError } = await supabase
            .from('stock_transactions')
            .insert(stockTransactionData);

          if (transactionError) {
            console.error('Error creating initial stock transaction:', transactionError);
            toast.warning(`Product created but stock transaction failed: ${transactionError.message}`);
          }
        }
      } else {
        // --- Product with Variants ---
        if (editMode && existingProduct) {
          // Update Parent Product
          const parentUpdateData = {
            name: validatedData.name,
            description: validatedData.description || null,
            minimum_stock_level: validatedData.minimumStockLevel,
            unit_price: validatedData.purchasePrice,
            purchase_price: validatedData.purchasePrice,
            sale_price: validatedData.salePrice,
            category_id: categoryId,
            location: validatedData.location.trim() || null,
            updated_at: new Date().toISOString(),
            ...(imageUrl && { image_url: imageUrl }),
          };
          console.log('[AddProductModal] Updating parent product data:', parentUpdateData);

          const { data: parent, error: parentError } = await supabase
            .from('products')
            .update(parentUpdateData)
            .eq('id', existingProduct.id)
            .select()
            .single();

          if (parentError || !parent) {
            console.error('Error updating parent product:', parentError);
            toast.error('Error updating main product.');
            setLoading(false);
            return;
          }
          console.log(`[AddProductModal] Parent product updated: ID ${parent.id}`);
          insertedProduct = parent;
          
          // Note: Variant updates in edit mode require more complex logic (delete old, update/create new)
          // For now, variants are preserved as-is. Full variant editing would require tracking variant IDs.
          toast.info('Parent product updated. Variant changes require separate management.');
        } else {
          // 4. Create Parent Product
          const parentData = {
            name: validatedData.name,
            description: validatedData.description || null,
            quantity_in_stock: 0,
            minimum_stock_level: validatedData.minimumStockLevel,
            unit_price: validatedData.purchasePrice,
            purchase_price: validatedData.purchasePrice,
            sale_price: validatedData.salePrice,
            branch_id: activeBranch.branch_id,
            image_url: imageUrl,
            user_id: user.id,
            category_id: categoryId,
            location: validatedData.location.trim() || null,
            is_variant: false,
            parent_product_id: null,
            variant_name: null,
          };
          console.log('[AddProductModal] Inserting parent product data:', parentData);

          const { data: parent, error: parentError } = await supabase
            .from('products')
            .insert(parentData)
            .select()
            .single();

          if (parentError || !parent) {
            console.error('Error creating parent product:', parentError);
            toast.error('Error creating main product.');
            setLoading(false);
            return;
          }
          console.log(`[AddProductModal] Parent product inserted: ID ${parent.id}`);
        }

        // Create variants only in create mode (edit mode variant updates handled separately above)
        if (!editMode && insertedProduct) {
        // 5a. Log product creation in history (quantity 0 so stats aren't affected)
        try {
          const { error: parentTxError } = await supabase
            .from('stock_transactions')
            .insert({
              product_id: parent.id,
              product_name: validatedData.name,
              transaction_type: 'incoming' as const,
              quantity: 0,
              unit_price: validatedData.purchasePrice || 0,
              total_value: 0,
              user_id: user.id,
              created_by: user.id,
              branch_id: activeBranch.branch_id,
              reference_number: 'PRODUCT_CREATED',
              notes: 'Product created',
              variant_id: null,
              variant_name: null,
              adjustment_method: 'system'
            });

          if (parentTxError) {
            console.warn('[AddProductModal] Failed to log parent product creation:', parentTxError);
          }
        } catch (e) {
          console.warn('[AddProductModal] Exception while logging parent product creation:', e);
        }

        // 5. Create Variants
        const variantRows = variants.filter(v => v.variantName.trim()).map(v => ({
          name: validatedData.name,
          description: validatedData.description || null,
          quantity_in_stock: v.quantityInStock || 0,
          minimum_stock_level: v.minimumStockLevel || 0,
          unit_price: v.purchasePrice || 0,
          purchase_price: v.purchasePrice || 0,
          sale_price: v.salePrice || 0,
          branch_id: activeBranch.branch_id,
          image_url: imageUrl,
          user_id: user.id,
          category_id: categoryId,
          location: v.location?.trim() || validatedData.location.trim() || null,
          is_variant: true,
          parent_product_id: parent.id,
          variant_name: v.variantName.trim(),
          sku: v.sku?.trim() || null,
          variant_barcode: v.barcode?.trim() || null,
        }));
        
        console.log(`[AddProductModal] Preparing ${variantRows.length} variant rows.`);
        
        if (variantRows.length > 0) {
          const { data: createdVariants, error: varErr } = await supabase
            .from('products')
            .insert(variantRows)
            .select();
            
          if (varErr) {
            console.error('Error creating variants:', varErr);
            toast.error('Error creating variants.');
            setLoading(false);
            return;
          }
          const insertedVariants = createdVariants || [];
          console.log(`[AddProductModal] Inserted ${insertedVariants.length} variants.`);

          // 6. Create Initial Transactions for Variants
          const transactions = insertedVariants
            .filter(vp => vp.quantity_in_stock > 0)
            .map(vp => ({
              product_id: vp.id,
              product_name: `${validatedData.name} - ${vp.variant_name}`,
              transaction_type: 'incoming' as const,
              quantity: vp.quantity_in_stock,
              unit_price: vp.purchase_price,
              user_id: user.id,
              created_by: user.id,
              branch_id: activeBranch.branch_id,
              reference_number: 'INITIAL_STOCK_VARIANT',
              notes: 'New variant initial stock',
              variant_id: vp.id,
              variant_name: vp.variant_name,
              adjustment_method: 'system'
            }));
            
          console.log(`[AddProductModal] Preparing ${transactions.length} variant transactions.`);

          if (transactions.length > 0) {
            const { error: tErr } = await supabase
              .from('stock_transactions')
              .insert(transactions);
            if (tErr) {
              console.error('Error creating variant transactions:', tErr);
              toast.warning('Variants created but initial transactions failed.');
            }
          }
        }
      }

      // 7. Final Steps
      const branchId = activeBranch.branch_id;
      const userId = user.id;

      await queryClient.invalidateQueries({
        queryKey: ['products', branchId],
        refetchType: 'active',
      });

      await queryClient.invalidateQueries({
        queryKey: ['products'],
        refetchType: 'active',
      });

      // Invalidate all categoryProducts queries to refresh category views
      queryClient.invalidateQueries({
        queryKey: ['categoryProducts'],
        refetchType: 'active',
      });

      // Invalidate all categoryAnalytics queries to refresh category stats
      queryClient.invalidateQueries({
        queryKey: ['categoryAnalytics'],
        refetchType: 'active',
      });

      // Invalidate all products analytics queries
      queryClient.invalidateQueries({
        queryKey: ['allProductsAnalyticsWeekAgo'],
        refetchType: 'active',
      });

      queryClient.invalidateQueries({
        queryKey: ['productCount', branchId, userId],
      });

      queryClient.invalidateQueries({
        queryKey: ['stockTransactions'],
      });

      queryClient.invalidateQueries({
        queryKey: ['dashboardData', branchId],
      });

      // Ensure any active product lists refetch immediately
      await queryClient.refetchQueries({
        queryKey: ['products', branchId],
        type: 'active',
      });
      
      toast.success(editMode 
        ? (hasVariants ? 'Product and variants updated.' : 'Product successfully updated.')
        : (hasVariants ? 'Product and variants added.' : 'Product successfully added.')
      );
      
      // Only reset if not in edit mode (edit mode keeps data for potential further edits)
      if (!editMode) {
        form.reset();
        setVariants([]);
        setShowVariantsSection(false);
        setImagePreview(null);
        setProductImage(null);
        // Clean up uploaded images and revoke object URLs
        uploadedImages.forEach(img => URL.revokeObjectURL(img.preview));
        setUploadedImages([]);
        
        if (wasFirstProduct && onFirstProductAdded) {
          console.log('[AddProductModal] Triggering first product callback.');
          onFirstProductAdded();
        }
        
        onProductAdded();
        onClose();
      } else {
        // In edit mode, just close and trigger update callback
        if (onProductUpdated) {
          onProductUpdated();
        }
        onClose();
      }
    } catch (error) {
      console.error('Unexpected error during product submission:', error);
      toast.error('Unexpected error during product addition.');
    } finally {
      setLoading(false);
      console.log('[AddProductModal] Submission finalized.');
    }
  };

  // --- Render Checks ---

  if (!user || branchLoading) {
    console.log('[AddProductModal] Render aborted: User or branch loading.');
    return null;
  }

  if (!activeBranch) {
    console.log('[AddProductModal] Render aborted: No active branch.');
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>No branch selected</DialogTitle>
          </DialogHeader>
          <div className="p-4 text-center">
            <p className="text-gray-600 mb-4">
              Select a branch to add a product.
            </p>
            <Button onClick={onClose}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // --- Component JSX (Structural Fix Applied) ---

  return (
    <> {/* FIX: Use React Fragment to return multiple top-level elements (modals) */}
      
      {/* 1. Main AddProductModal Dialog */}
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className={`w-full max-w-full mx-auto p-0 flex flex-col ${isMobile ? 'h-full max-h-full rounded-none bg-white' : 'bg-white md:w-auto md:max-w-5xl md:max-h-[95vh] md:rounded-lg'}`}>
          <DialogHeader className={`${isMobile ? 'p-4 border-b' : 'p-6 border-b'}`}>
            <DialogTitle>{editMode ? 'Edit Product' : 'Add Product'}</DialogTitle>
          </DialogHeader>

          <div className={`flex-1 overflow-y-auto ${isMobile ? 'p-4' : 'p-6'}`}>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                {/* Product Information Card */}
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                  <div className="text-sm font-medium text-gray-600 mb-3">Product Information</div>
                  <div className="space-y-4">
                    {/* Product Name */}
                    <FormField
                      control={form.control}
                      name="name"
                      rules={{ required: 'Product name is mandatory' }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-semibold text-gray-900">Product Name *</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="Enter product name" 
                              disabled={loading} 
                              className="border-gray-300 focus:border-gray-500 text-lg" 
                            />
                          </FormControl>
                          {duplicateName && !hasVariants && (
                            <div className="flex items-center text-sm text-red-600 mt-1">
                              <AlertCircle className="w-4 h-4 mr-1" />
                              This product name already exists for a main product in this branch.
                            </div>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Stock and Minimum Stock */}
                    {!hasVariants && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="quantityInStock"
                          rules={{ 
                            min: { value: 0, message: 'Stock must be 0 or more' }
                          }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-lg font-semibold text-gray-900">Stock Quantity</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  inputMode="numeric"
                                  min="0"
                                  placeholder="0"
                                  disabled={loading}
                                  onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                                  value={field.value === 0 ? '' : field.value.toString()} 
                                  className="border-gray-300 focus:border-gray-500 text-lg" 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="minimumStockLevel"
                          rules={{ 
                            min: { value: 0, message: 'Minimum level must be 0 or more' }
                          }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-lg font-semibold text-gray-900">Minimum Stock</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  inputMode="numeric"
                                  min="0"
                                  placeholder="10"
                                  disabled={loading}
                                  onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                                  value={field.value.toString()}
                                  className="border-gray-300 focus:border-gray-500 text-lg"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    {/* SKU Field */}
                    {!hasVariants && (
                      <FormField
                        control={form.control}
                        name="sku"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-semibold text-gray-900">SKU</FormLabel>
                            <FormControl>
                              <div className="flex gap-2">
                                <Input 
                                  {...field} 
                                  placeholder="Enter SKU or scan barcode" 
                                  disabled={loading || hasVariants}
                                  className="border-gray-300 focus:border-gray-500 text-lg flex-1" 
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setShowScanner(true)}
                                  disabled={loading || hasVariants}
                                  className="px-4"
                                  title="Scan barcode"
                                >
                                  <Scan className="w-4 h-4" />
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </div>

                {/* Collapsible Additional Information Section */}
                <Collapsible open={showAdditionalInfo} onOpenChange={setShowAdditionalInfo}>
                  <CollapsibleTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-between"
                    >
                      <span className="font-medium">Additional Information</span>
                      {showAdditionalInfo ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4 mt-4">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                          <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700 font-medium">Category</FormLabel>
                                <FormControl>
                                  <HierarchicalCategorySelector
                                    value={field.value || null}
                                    onValueChange={(categoryId, categoryName) => {
                                      field.onChange(categoryId || '');
                                      form.setValue('categoryName', categoryName || '');
                                    }}
                                    placeholder="Select category..."
                                    allowCreate={true}
                                    showPath={true}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>


                        {/* Purchase Price */}
                        {!hasVariants && (
                          <FormField
                            control={form.control}
                            name="purchasePrice"
                            rules={{ 
                              min: { value: 0, message: 'Must be 0 or more' }
                            }}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700 font-medium">Purchase Price</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    step="0.01"
                                    min="0"
                                    placeholder="0.00"
                                    disabled={loading}
                                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                    value={field.value.toString()}
                                    className="border-gray-300 focus:border-gray-500"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}

                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700 font-medium">Description</FormLabel>
                              <FormControl>
                                <Textarea 
                                  {...field} 
                                  placeholder="Enter product description" 
                                  disabled={loading}
                                  className="resize-none border-gray-300 focus:border-gray-500"
                                  rows={3}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Location - Only show if no variants */}
                        {!hasVariants && (
                          <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700 font-medium">Location</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    placeholder="Enter location (e.g. A1, Shelf 3, etc.)" 
                                    disabled={loading}
                                    className="border-gray-300 focus:border-gray-500"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* Two-Column Layout for Image and Variants */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column: Compact Image Upload */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Product Image</h3>
                    
                    {/* Show existing image in edit mode if no new image uploaded */}
                    {editMode && existingProduct?.image_url && !uploadedImages.length && imagePreview && imagePreview === existingProduct.image_url && (
                      <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 flex items-center justify-center">
                        <img
                          src={existingProduct.image_url}
                          alt={existingProduct.name || 'Product'}
                          className="max-w-full max-h-48 object-contain rounded"
                        />
                      </div>
                    )}
                    
                    {/* Show preview of newly uploaded image */}
                    {imagePreview && imagePreview !== existingProduct?.image_url && (
                      <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 flex items-center justify-center">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="max-w-full max-h-48 object-contain rounded"
                        />
                      </div>
                    )}
                    
                    {/* Compact Drag and Drop Area */}
                    <div
                      onDragEnter={handleDragEnter}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={cn(
                        "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
                        isDragging ? "border-gray-500 bg-gray-100" : "border-gray-300 bg-gray-50 hover:border-gray-400"
                      )}
                    >
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">
                            <label htmlFor="image-upload" className="text-gray-700 hover:text-gray-900 cursor-pointer underline font-medium">
                              {editMode ? 'Click to change image' : 'Click to upload'}
                            </label> or drag and drop
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
                          <p className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP up to 5MB</p>
                        </div>
                      </div>
                    </div>

                    {/* Uploaded Images List - Compact */}
                    {uploadedImages.length > 0 && (
                      <div className="space-y-2">
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
                              <p className="text-sm font-medium text-gray-900 truncate">
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
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right Column: Variants */}
                      <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Product Variants {hasVariants && <span className="text-sm font-normal text-gray-500">(Active)</span>}
                      </h3>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setShowVariantsSection(!showVariantsSection);
                          // If opening and no variants exist, add an empty variant
                          if (!showVariantsSection && variants.length === 0) {
                            setVariants([{
                              variantName: '',
                              quantityInStock: 0,
                              minimumStockLevel: 0,
                              purchasePrice: 0,
                              salePrice: 0,
                              sku: '',
                              barcode: '',
                              location: ''
                            }]);
                          }
                        }}
                        className="flex items-center gap-2"
                      >
                        {showVariantsSection ? (
                          <>
                            <ChevronUp className="w-4 h-4" />
                            Hide
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4" />
                            Add Variants
                          </>
                        )}
                      </Button>
                    </div>
                    {hasVariants && showVariantsSection && (
                      <p className="text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded p-2">
                        Variants are enabled. Stock, prices, and location are managed per variant below.
                      </p>
                    )}
                    
                    {/* Variant Input Section - Only show when toggled */}
                    {showVariantsSection && (
                      <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
                      <div className="space-y-3">
                        {(variants.length === 0 ? [{
                          variantName: '',
                          quantityInStock: 0,
                          minimumStockLevel: 0,
                          purchasePrice: 0,
                          salePrice: 0,
                          sku: '',
                          barcode: '',
                          location: ''
                        }] : variants).map((variant, index) => {
                          const displayVariants = variants.length === 0 ? [{
                            variantName: '',
                            quantityInStock: 0,
                            minimumStockLevel: 0,
                            purchasePrice: 0,
                            salePrice: 0,
                            sku: '',
                            barcode: '',
                            location: ''
                          }] : variants;
                          
                          return (
                            <div key={index} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="text-sm font-medium text-gray-700">Variant {index + 1}</h5>
                                {displayVariants.length > 1 && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      const newVariants = variants.filter((_, i) => i !== index);
                                      setVariants(newVariants.length > 0 ? newVariants : []);
                                    }}
                                    className="text-red-600 hover:text-red-700 h-7 px-2 text-xs"
                                  >
                                    Remove
                                  </Button>
                                )}
                              </div>
                              
                              <div className="space-y-3">
                                <div className="grid grid-cols-1 gap-2">
                                <div>
                                  <Label htmlFor={`variant-name-${index}`} className="text-sm font-medium text-gray-700">
                                    Variant name *
                                  </Label>
                                  <Input 
                                    id={`variant-name-${index}`}
                                    value={variant.variantName}
                                    onChange={(e) => {
                                      const currentVariants = variants.length === 0 ? [{
                                        variantName: '',
                                        quantityInStock: 0,
                                        minimumStockLevel: 0,
                                        purchasePrice: 0,
                                        salePrice: 0,
                                        sku: '',
                                        barcode: '',
                                        location: ''
                                      }] : [...variants];
                                      currentVariants[index].variantName = e.target.value;
                                      setVariants(currentVariants);
                                    }}
                                    placeholder="e.g. Yellow, Green, Size M"
                                    className="mt-1"
                                    disabled={loading}
                                  />
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <Label htmlFor={`variant-sku-${index}`} className="text-sm font-medium text-gray-700">
                                    SKU
                                  </Label>
                                  <Input
                                    id={`variant-sku-${index}`}
                                    value={variant.sku || ''}
                                    onChange={(e) => {
                                      const currentVariants = variants.length === 0 ? [{
                                        variantName: '',
                                        quantityInStock: 0,
                                        minimumStockLevel: 0,
                                        purchasePrice: 0,
                                        salePrice: 0,
                                        sku: '',
                                        barcode: '',
                                        location: ''
                                      }] : [...variants];
                                      currentVariants[index].sku = e.target.value;
                                      setVariants(currentVariants);
                                    }}
                                      placeholder="SKU"
                                      className="mt-1 text-sm"
                                    disabled={loading}
                                  />
                                </div>
                                
                                <div>
                                  <Label htmlFor={`variant-barcode-${index}`} className="text-sm font-medium text-gray-700">
                                    Barcode
                                  </Label>
                                  <Input
                                    id={`variant-barcode-${index}`}
                                    value={variant.barcode || ''}
                                    onChange={(e) => {
                                      const currentVariants = variants.length === 0 ? [{
                                        variantName: '',
                                        quantityInStock: 0,
                                        minimumStockLevel: 0,
                                        purchasePrice: 0,
                                        salePrice: 0,
                                        sku: '',
                                        barcode: '',
                                        location: ''
                                      }] : [...variants];
                                      currentVariants[index].barcode = e.target.value;
                                      setVariants(currentVariants);
                                    }}
                                      placeholder="Barcode"
                                      className="mt-1 text-sm"
                                    disabled={loading}
                                  />
                                  </div>
                                </div>
                                
                                <div>
                                  <Label htmlFor={`variant-location-${index}`} className="text-sm font-medium text-gray-700">
                                    Location
                                  </Label>
                                  <Input
                                    id={`variant-location-${index}`}
                                    value={variant.location || ''}
                                    onChange={(e) => {
                                      const currentVariants = variants.length === 0 ? [{
                                        variantName: '',
                                        quantityInStock: 0,
                                        minimumStockLevel: 0,
                                        purchasePrice: 0,
                                        salePrice: 0,
                                        sku: '',
                                        barcode: '',
                                        location: ''
                                      }] : [...variants];
                                      currentVariants[index].location = e.target.value;
                                      setVariants(currentVariants);
                                    }}
                                    placeholder="e.g. A1, Shelf 3"
                                    className="mt-1 text-sm"
                                    disabled={loading}
                                  />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <Label htmlFor={`variant-stock-${index}`} className="text-sm font-medium text-gray-700">
                                    Stock *
                                  </Label>
                                  <Input
                                    id={`variant-stock-${index}`}
                                    type="number" 
                                    min="0"
                                    value={variant.quantityInStock.toString()}
                                    onChange={(e) => {
                                      const currentVariants = variants.length === 0 ? [{
                                        variantName: '',
                                        quantityInStock: 0,
                                        minimumStockLevel: 0,
                                        purchasePrice: 0,
                                        salePrice: 0,
                                        sku: '',
                                        barcode: '',
                                        location: ''
                                      }] : [...variants];
                                      currentVariants[index].quantityInStock = parseInt(e.target.value, 10) || 0;
                                      setVariants(currentVariants);
                                    }}
                                      className="mt-1 text-sm"
                                    disabled={loading}
                                  />
                                </div>
                                
                                <div>
                                  <Label htmlFor={`variant-min-stock-${index}`} className="text-sm font-medium text-gray-700">
                                      Min. stock
                                  </Label>
                                  <Input
                                    id={`variant-min-stock-${index}`}
                                    type="number"
                                    min="0"
                                    value={variant.minimumStockLevel.toString()}
                                    onChange={(e) => {
                                      const currentVariants = variants.length === 0 ? [{
                                        variantName: '',
                                        quantityInStock: 0,
                                        minimumStockLevel: 0,
                                        purchasePrice: 0,
                                        salePrice: 0,
                                        sku: '',
                                        barcode: '',
                                        location: ''
                                      }] : [...variants];
                                      currentVariants[index].minimumStockLevel = parseInt(e.target.value, 10) || 0;
                                      setVariants(currentVariants);
                                    }}
                                      className="mt-1 text-sm"
                                    disabled={loading}
                                  />
                                </div>
                              </div>
                                
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <Label htmlFor={`variant-purchase-${index}`} className="text-sm font-medium text-gray-700">
                                      Purchase Price
                                    </Label>
                                    <Input
                                      id={`variant-purchase-${index}`}
                                      type="number"
                                      step="0.01"
                                      min="0"
                                      value={variant.purchasePrice.toString()}
                                      onChange={(e) => {
                                        const currentVariants = variants.length === 0 ? [{
                              variantName: '',
                              quantityInStock: 0,
                              minimumStockLevel: 0,
                              purchasePrice: 0,
                              salePrice: 0,
                              sku: '',
                              barcode: '',
                              location: ''
                                        }] : [...variants];
                                        currentVariants[index].purchasePrice = parseFloat(e.target.value) || 0;
                                        setVariants(currentVariants);
                          }}
                                      className="mt-1 text-sm"
                          disabled={loading}
                                    />
                            </div>
                                  
                                  <div>
                                    <Label htmlFor={`variant-sale-${index}`} className="text-sm font-medium text-gray-700">
                                      Sale Price
                                    </Label>
                              <Input 
                                      id={`variant-sale-${index}`}
                                type="number" 
                                      step="0.01"
                                min="0"
                                      value={variant.salePrice.toString()}
                                      onChange={(e) => {
                                        const currentVariants = variants.length === 0 ? [{
                                          variantName: '',
                                          quantityInStock: 0,
                                          minimumStockLevel: 0,
                                          purchasePrice: 0,
                                          salePrice: 0,
                                          sku: '',
                                          barcode: '',
                                          location: ''
                                        }] : [...variants];
                                        currentVariants[index].salePrice = parseFloat(e.target.value) || 0;
                                        setVariants(currentVariants);
                                      }}
                                      className="mt-1 text-sm"
                                disabled={loading}
                      />
                    </div>
                  </div>
                </div>
                    </div>
                          );
                        })}
                        
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            const currentVariants = variants.length === 0 ? [] : [...variants];
                            setVariants([...currentVariants, {
                              variantName: '',
                              quantityInStock: 0,
                              minimumStockLevel: 0,
                              purchasePrice: 0,
                              salePrice: 0,
                              sku: '',
                              barcode: '',
                              location: ''
                            }]);
                          }}
                          className="w-full border-dashed border-2 border-gray-300 hover:border-gray-400 text-sm"
                                disabled={loading}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add variant
                        </Button>
                    </div>
                  </div>
                  )}
                  </div>
                </div>



              </form>



            </Form>


            
          </div>


            {/* Action Buttons - Sticky Footer */}
            <div className={`sticky bottom-0 bg-white border-t ${isMobile ? 'p-4' : 'p-6'} shadow-lg z-10`}>
              <div className={`flex gap-2 ${isMobile ? 'flex-col' : 'flex-row justify-end'}`}>
                {editMode && onDelete && (
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (onDelete && existingProduct) {
                        onDelete(existingProduct);
                        onClose();
                      }
                    }}
                    className={isMobile ? 'w-full text-red-600 hover:text-red-700 hover:bg-red-50' : 'text-red-600 hover:text-red-700 hover:bg-red-50'}
                  >
                    Delete
                  </Button>
                )}
                {editMode && onAdjustStock && (
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (onAdjustStock && existingProduct) {
                        onClose();
                        onAdjustStock(existingProduct);
                      }
                    }}
                    className={isMobile ? 'w-full' : ''}
                  >
                    Adjust Stock
                  </Button>
                )}
                <Button 
                  type="button"
                  onClick={() => form.handleSubmit(handleSubmit)()}
                  disabled={loading || (!editMode && duplicateName && !hasVariants)} 
                  className={isMobile ? 'w-full' : 'w-auto'}
                >
                  {loading ? (editMode ? 'Updating...' : 'Adding...') : (editMode ? 'Update Product' : 'Add Product')}
                </Button>
              </div>
            </div>


            
        </DialogContent>
      </Dialog>
      
      {/* 2. Upgrade Notice Modal (Correctly isolated and conditional) */}
      {showUpgradeNotice && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
          <div className="bg-white border border-blue-300 rounded-lg shadow-lg p-6 max-w-md relative flex flex-col items-center">
            <Info className="w-8 h-8 text-blue-700 mb-4" />
            <div className="text-center">
              <div className="font-bold text-blue-700 text-lg mb-2">Plan automatically upgraded</div>
              <div className="text-blue-900 text-sm mb-3">
                StockFlow uses a freemium model—start free, pay as you grow. You started on our free plan (up to 100 products at no cost). As your business grows and you add more products, your plan automatically upgrades to match your needs.
              </div>
              <div className="text-blue-900 text-sm font-medium">
                Your plan has been upgraded to accommodate your growing inventory. Click 'View Plan' to see your new plan details and pricing.
              </div>
            </div>
            <button
              className="mt-4 bg-blue-700 text-white font-semibold px-4 py-2 rounded hover:bg-blue-800 transition"
              onClick={() => {
                setShowUpgradeNotice(false);
                window.dispatchEvent(new Event('license-refetch'));
                navigate('/dashboard/settings', { state: { tab: 'license' } });
              }}
              autoFocus
            >
              View Plan
            </button>
          </div>
        </div>
      )}

      {/* 3. Barcode Scanner Modal (Correctly isolated and conditional) */}
      {showScanner && (
        <BarcodeScanner
          onBarcodeDetected={handleBarcodeDetected}
          onClose={() => setShowScanner(false)}
          onScanSuccess={onScanSuccess}
          settings={scannerSettings}
        />
      )}
    </> // End React Fragment
  );
};

// Wrapper component for backward compatibility - uses AddProductModal in edit mode
export const ProductDetailModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  product: any;
  onAdjustStock?: (product: any) => void;
  onDelete?: (product: any) => void;
  onProductUpdated?: () => void;
  getStockStatus?: (quantity: number, minLevel: number) => string;
  getStockStatusDotColor?: (quantity: number, minLevel: number) => string;
  formatStockQuantity?: (quantity: number) => string;
}> = ({
  isOpen,
  onClose,
  product,
  onAdjustStock,
  onDelete,
  onProductUpdated,
}) => {
  return (
    <AddProductModal
      isOpen={isOpen}
      onClose={onClose}
      editMode={true}
      existingProduct={product}
      onProductAdded={() => {}} // Not used in edit mode
      onProductUpdated={onProductUpdated}
      onAdjustStock={onAdjustStock}
      onDelete={onDelete}
    />
  );
};
