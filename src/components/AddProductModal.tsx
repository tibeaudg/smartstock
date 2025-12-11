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
import { AlertCircle, Check, ChevronsUpDown, Plus, Scan, Info, Upload, X, Image as ImageIcon } from 'lucide-react';
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

// --- Data Interfaces ---

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: () => void;
  onFirstProductAdded?: () => void;
  preFilledSKU?: string;
  preFilledName?: string;
  preFilledCategoryId?: string;
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


export const AddProductModal = ({ isOpen, onClose, onProductAdded, onFirstProductAdded, preFilledSKU, preFilledName, preFilledCategoryId }: AddProductModalProps) => {
  console.log('[AddProductModal] Initialization: Component mounted with props.');

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
  const [hasVariants, setHasVariants] = useState(false);
  const [variants, setVariants] = useState<VariantData[]>([]);
  
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

  // Reset uploaded images when modal closes
  useEffect(() => {
    if (!isOpen) {
      // Cleanup all image previews when modal closes
      uploadedImages.forEach(img => URL.revokeObjectURL(img.preview));
      setUploadedImages([]);
      setIsDragging(false);
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
    console.log('[AddProductModal] Submission started. Data:', data);
    
    if (duplicateName && !hasVariants) {
      toast.error('Product name already exists for a main product in this branch.');
      console.error('[AddProductModal] Submission aborted: Duplicate name detected.');
      return;
    }

    if (!user || branchLoading || !activeBranch) {
      console.error('[AddProductModal] Submission aborted: Auth/Branch check failed.', { user: !!user, branchLoading, activeBranch: !!activeBranch });
      toast.error('Authentication or branch loading failed. Cannot proceed.');
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
      } else {
        // --- Product with Variants Insertion ---
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
      
      toast.success(hasVariants ? 'Product and variants added.' : 'Product successfully added.');
      
      form.reset();
      setVariants([]);
      setHasVariants(false);
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
        <DialogContent className={`w-full max-w-full mx-auto p-0 flex flex-col ${isMobile ? 'h-full max-h-full rounded-none bg-white' : 'bg-white md:w-auto md:max-w-4xl md:max-h-[90vh] md:rounded-lg'}`}>
          <DialogHeader className={`${isMobile ? 'p-4 border-b' : 'p-6 border-b'}`}>
            <DialogTitle>Add Product</DialogTitle>
          </DialogHeader>

          <div className={`flex-1 overflow-y-auto ${isMobile ? 'p-4' : 'p-6'}`}>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                {/* Two-Column Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column: Image Upload */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Add Images</h3>
                    
                    {/* Drag and Drop Area */}
                    <div
                      onDragEnter={handleDragEnter}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={cn(
                        "border-2 border-dashed rounded-lg p-12 min-h-[200px] text-center transition-colors flex items-center justify-center",
                        isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50 hover:border-gray-400"
                      )}
                    >
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="flex items-center space-x-2">
                          <ImageIcon className="w-12 h-12 text-gray-400" />
                          <ImageIcon className="w-12 h-12 text-gray-400 -ml-4" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">
                            Drop your files here. or <label htmlFor="image-upload" className="text-blue-600 hover:text-blue-700 cursor-pointer underline">Browse</label>
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
                          <Upload className="w-5 h-5 text-gray-400 mx-auto mt-2" />
                        </div>
                      </div>
                    </div>

                    {/* Uploaded Images List */}
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
                                {formatFileSize(image.size)}
                              </p>
                              {image.uploading && (
                                <div className="mt-1">
                                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div
                                      className="bg-green-600 h-1.5 rounded-full transition-all"
                                      style={{ width: `${image.progress || 0}%` }}
                                    />
                                  </div>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {image.progress || 0}% done
                                    {image.uploadSpeed && ` • ${formatFileSize(image.uploadSpeed)}/sec`}
                                  </p>
                                </div>
                              )}
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

     

                    {/* Variant Input Section - Always visible */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h4 className="text-md font-semibold text-gray-700 mb-3 flex items-center">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                        Product Variants
                      </h4>
                      <div className="space-y-4">
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
                            <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                              <div className="flex items-center justify-between mb-3">
                                <h5 className="text-sm font-medium text-gray-700">Variant {index + 1}</h5>
                                {displayVariants.length > 1 && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      const newVariants = variants.filter((_, i) => i !== index);
                                      setVariants(newVariants.length > 0 ? newVariants : []);
                                    }}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    Remove
                                  </Button>
                                )}
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                    placeholder="Variant SKU"
                                    className="mt-1"
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
                                    placeholder="Variant barcode"
                                    className="mt-1"
                                    disabled={loading}
                                  />
                                </div>
                                
                                <div>
                                  <Label htmlFor={`variant-location-${index}`} className="text-sm font-medium text-gray-700">
                                    Locations
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
                                    className="mt-1"
                                    disabled={loading}
                                  />
                                </div>
                                
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
                                    className="mt-1"
                                    disabled={loading}
                                  />
                                </div>
                                
                                <div>
                                  <Label htmlFor={`variant-min-stock-${index}`} className="text-sm font-medium text-gray-700">
                                    Minimum stock
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
                                    className="mt-1"
                                    disabled={loading}
                                  />
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
                          className="w-full border-dashed border-2 border-gray-300 hover:border-gray-400"
                          disabled={loading}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add variant
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Product Details */}
                  <div className="space-y-6">
                    {/* Basis Informatie Sectie */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    Basic Information
                  </h3>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      rules={{ required: 'Product name is mandatory' }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-blue-700 font-medium">Product Name *</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="Enter product name" 
                              disabled={loading} 
                              className="py-3 px-3 text-base border-blue-200 focus:border-blue-500" 
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

                    {/* SKU Field */}
                    <FormField
                      control={form.control}
                      name="sku"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-blue-700 font-medium">SKU</FormLabel>
                          <FormControl>
                            <div className="flex gap-2">
                              <Input 
                                {...field} 
                                placeholder="Enter SKU or scan barcode" 
                                disabled={loading} 
                                className="py-3 px-3 text-base border-blue-200 focus:border-blue-500 flex-1" 
                              />
                              <Button
                                type="button"
                                variant="default"
                                onClick={() => setShowScanner(true)}
                                disabled={loading}
                                className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium whitespace-nowrap"
                              >
                                <Scan className="w-5 h-5 mr-2" />
                                Scan Barcode
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Stock Fields - Show only if no variants */}
                    {!hasVariants && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="quantityInStock"
                        rules={{ 
                          required: 'Stock is mandatory',
                          min: { value: 0, message: 'Stock must be 0 or more' }
                        }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-blue-700 font-medium">Stock *</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="0"
                                placeholder=""
                                disabled={loading}
                                onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                                value={field.value === 0 ? '' : field.value.toString()} 
                                className="py-3 px-3 text-base border-blue-200 focus:border-blue-500"
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
                          required: 'Minimum level is mandatory',
                          min: { value: 0, message: 'Minimum level must be 0 or more' }
                        }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-blue-700 font-medium">Min. Level *</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="0"
                                placeholder="10"
                                disabled={loading}
                                onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                                value={field.value.toString()}
                                className="py-3 px-3 text-base border-blue-200 focus:border-blue-500"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    )}
                  </div>
                </div>

                {/* Advanced Options - Always visible, no toggle */}
                <div className="space-y-6">
                  {/* Product Details Sectie */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="text-md font-semibold text-gray-700 mb-3 flex items-center">
                      <div className="w-2 h-2 bg-gray-500 rounded-full mr-2"></div>
                      Product Details
                    </h4>
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                placeholder="Enter product description" 
                                disabled={loading}
                                className="resize-none py-3 px-3 text-base border-gray-200 focus:border-gray-400"
                                rows={3}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Location</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="Enter location (e.g. A1, Shelf 3, etc.)" 
                                disabled={loading}
                                className="py-3 px-3 text-base border-gray-200 focus:border-gray-400"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Category Sectie */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="text-md font-semibold text-gray-700 mb-3 flex items-center">
                      <div className="w-2 h-2 bg-gray-500 rounded-full mr-2"></div>
                      Category
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="categoryId"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <HierarchicalCategorySelector
                                value={field.value || null}
                                onValueChange={(categoryId, categoryName) => {
                                  field.onChange(categoryId || '');
                                  form.setValue('categoryName', categoryName || '');
                                  console.log(`[AddProductModal] Selected category: ${categoryName}, ID: ${categoryId}`);
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
                  </div>

                  {/* Prijzen Sectie - Show only if no variants */}
                  {!hasVariants && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="text-md font-semibold text-gray-700 mb-3 flex items-center">
                      <div className="w-2 h-2 bg-gray-500 rounded-full mr-2"></div>
                      Prices
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="purchasePrice"
                        rules={{ 
                          min: { value: 0, message: 'Must be 0 or more' }
                        }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Purchase Price</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                step="0.01"
                                min="0"
                                disabled={loading}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                value={field.value.toString()}
                                className="py-3 px-3 text-base border-gray-200 focus:border-gray-400"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="salePrice"
                        rules={{ 
                          min: { value: 0, message: 'Must be 0 or more' }
                        }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Sale Price</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                step="0.01"
                                min="0"
                                disabled={loading}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                value={field.value.toString()}
                                className="py-3 px-3 text-base border-gray-200 focus:border-gray-400"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  )}
                </div>
                  </div>
                </div>



              </form>



            </Form>


            
          </div>


            {/* Action Buttons - Sticky Footer */}
            <div className={`sticky bottom-0  bg-white border-t ${isMobile ? 'p-4' : 'p-6'} shadow-lg z-10`}>
              <div className={`flex gap-2 ${isMobile ? 'flex-col' : 'flex-row justify-end'}`}>
                <Button 
                  type="button"
                  onClick={() => form.handleSubmit(handleSubmit)()}
                  disabled={loading || (duplicateName && !hasVariants)} 
                  className={isMobile ? 'w-full bg-blue-500 text-white' : 'w-auto bg-blue-500 text-white'}
                >
                  {loading ? 'Adding...' : (hasVariants ? 'Add Product with Variants' : 'Publish Product')}
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
              <div className="font-bold text-blue-700 text-lg mb-2">Subscription automatically upgraded</div>
              <div className="text-blue-900 text-sm">
                Your number of products exceeds the limit of your current subscription. You will be automatically transferred to a higher subscription. Click 'Accept' to view your new license.
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
              Accept
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
