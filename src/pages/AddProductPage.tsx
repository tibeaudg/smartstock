import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { useCategoriesFetch } from '@/hooks/useCategoriesFetch';
import { useLocations, useCreateLocation } from '@/hooks/useLocations';
import { toast } from 'sonner';
import { safeLocalStorage } from '@/lib/errorHandler';
import { AlertCircle, Check, ChevronsUpDown, Plus, Scan, Info, Upload, X, Image as ImageIcon, ChevronDown, ChevronUp, ArrowLeft, Package } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useMobile } from '@/hooks/use-mobile';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { HierarchicalCategorySelector } from '@/components/categories/HierarchicalCategorySelector';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { z } from 'zod';

const LocationSelector: React.FC<{
  value?: string;
  onValueChange: (location: string | null) => void;
  placeholder?: string;
}> = ({ value, onValueChange, placeholder = 'Select location...' }) => {
  const { data: locations = [] } = useLocations();
  const createLocation = useCreateLocation();
  const { activeBranch } = useBranches();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newLocationName, setNewLocationName] = useState('');
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const normalizedSearch = searchTerm.trim();
  const selectedLocation = useMemo(
    () => locations.find((location) => location.name === value) || null,
    [locations, value]
  );

  const filteredLocations = useMemo(() => {
    if (!normalizedSearch) return locations;
    return locations.filter((location) =>
      location.name.toLowerCase().includes(normalizedSearch.toLowerCase())
    );
  }, [locations, normalizedSearch]);

  const exactMatch = normalizedSearch
    ? locations.some((location) => location.name.toLowerCase() === normalizedSearch.toLowerCase())
    : false;
  const canCreate = normalizedSearch.length > 0 && !exactMatch && !!activeBranch;

  const handleCreateButtonClick = () => {
    setIsAddingNew(true);
    setNewLocationName('');
  };

  const handleSaveNewLocation = async () => {
    const trimmedName = newLocationName.trim();
    if (!trimmedName) return;

    if (!activeBranch) {
      toast.error('Cannot create location: No active warehouse selected');
      return;
    }

    const exactMatch = locations.some((location) => location.name.toLowerCase() === trimmedName.toLowerCase());
    if (exactMatch) {
      toast.error('Location already exists');
      return;
    }

    await createLocation.mutateAsync({ name: trimmedName });
    setIsAddingNew(false);
    setNewLocationName('');
  };

  const handleCancelNewLocation = () => {
    setIsAddingNew(false);
    setNewLocationName('');
  };

  const displayValue = value ? selectedLocation?.name ?? value : placeholder;

  const handleSelect = (location: { name: string }) => {
    onValueChange(location.name);
    setOpen(false);
    setSearchTerm('');
  };

  const handleCreate = async () => {
    if (!canCreate) return;

    if (!activeBranch) {
      toast.error('Cannot create location: No active warehouse selected');
      return;
    }

    try {
      await createLocation.mutateAsync({ name: normalizedSearch });
      onValueChange(normalizedSearch);
      setOpen(false);
      setSearchTerm('');
    } catch (error) {
      console.error('Error creating location:', error);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <span className="truncate">{displayValue}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command>
          <CommandInput
            ref={searchInputRef}
            value={searchTerm}
            onValueChange={setSearchTerm}
            placeholder="Search or type to add a location..."
            autoComplete="off"
          />
          <div className="border-b bg-slate-50 px-3 py-2">
            {isAddingNew ? (
              <div className="space-y-2">
                <Input
                  value={newLocationName}
                  onChange={(e) => setNewLocationName(e.target.value)}
                  placeholder="Enter location name..."
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSaveNewLocation();
                    } else if (e.key === 'Escape') {
                      handleCancelNewLocation();
                    }
                  }}
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleSaveNewLocation}
                    disabled={!newLocationName.trim()}
                  >
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancelNewLocation}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="ghost"
                className="w-full justify-between"
                onClick={handleCreateButtonClick}
                disabled={!activeBranch}
              >
                <span>Add new location</span>
                <Plus className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
          <CommandList>
            <CommandEmpty>
              {canCreate ? (
                <div className="p-2 text-center">
                  <p className="text-sm text-gray-500 mb-2">No location found</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCreate}
                    className="w-full"
                    disabled={!canCreate}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create "{normalizedSearch}"
                  </Button>
                </div>
              ) : !activeBranch ? (
                <p className="text-sm text-gray-500">Select a warehouse to create locations</p>
              ) : (
                <p className="text-sm text-gray-500">No locations found</p>
              )}
            </CommandEmpty>
            <CommandGroup>
              {filteredLocations.map((location) => (
                <CommandItem
                  key={location.id ?? location.name}
                  value={location.name}
                  onSelect={() => handleSelect(location)}
                >
                  <div className="flex-1">
                    <div className="font-medium">{location.name}</div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

import { zodResolver } from '@hookform/resolvers/zod';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { BulkImporterSuggestionModal } from '@/components/BulkImporterSuggestionModal';
import { useSubscription } from '@/hooks/useSubscription';
import { useAppEventTracker } from '@/hooks/useAppEventTracker';
import { emitActivationOnce } from '@/lib/analytics';
import { startOperation, endOperation } from '@/lib/analytics/operations';

// --- Data Interfaces ---


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
  taxRate: number;
  taxInclusive: boolean;
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
  taxRate: z.number().min(0, 'Tax rate must be 0 or more.').max(100, 'Tax rate cannot exceed 100%.').default(0),
  taxInclusive: z.boolean().default(false),
});

// Draft storage key helper
const getDraftStorageKey = (branchId: string | undefined) => {
  return `product-draft-${branchId || 'default'}`;
};


export default function AddProductPage() {
  // --- Hooks and State ---
  const { user } = useAuth();
  const { activeBranch, loading: branchLoading } = useBranches();
  const { productCount, maxProducts, isOverProductLimit } = useSubscription();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { track } = useAppEventTracker();
  const submittedRef = useRef(false);
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
  const [showBulkImporterSuggestion, setShowBulkImporterSuggestion] = useState(false);
  const { isMobile } = useMobile();
  const [showDraftBanner, setShowDraftBanner] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const addAnotherRef = useRef(false);

  // Get pre-filled data from URL params
  const preFilledSKU = searchParams.get('sku') || undefined;
  const preFilledName = searchParams.get('name') || undefined;
  const preFilledCategoryId = searchParams.get('categoryId') || undefined;
  const isQuickMode = searchParams.get('quick') === '1';
  const [showQuickAdvanced, setShowQuickAdvanced] = useState(false);

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
  
  const { categories } = useCategoriesFetch();
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
      minimumStockLevel: 0,
      purchasePrice: 0,
      salePrice: 0,
      location: '',
      sku: '',
      taxRate: 0,
      taxInclusive: false,
    },
  });

  const nameValue = form.watch('name');

  // On mount: restore draft if one exists, otherwise start fresh
  useEffect(() => {
    if (!activeBranch?.branch_id) return;
    const draftKey = getDraftStorageKey(activeBranch.branch_id);

    // URL params pre-fill the form directly — skip any draft
    if (preFilledSKU || preFilledName || preFilledCategoryId) {
      safeLocalStorage.removeItem(draftKey);
      form.reset({
        name: preFilledName || '',
        description: '',
        categoryId: preFilledCategoryId || '',
        categoryName: '',
        quantityInStock: isQuickMode ? 1 : 0,
        minimumStockLevel: 0,
        purchasePrice: 0,
        salePrice: 0,
        location: '',
        sku: preFilledSKU || '',
        taxRate: 0,
        taxInclusive: false,
      });
      setVariants([]);
      setShowVariantsSection(false);
      setImagePreview(null);
      setUploadedImages([]);
      return;
    }

    const saved = safeLocalStorage.getItem(draftKey);
    if (saved) {
      try {
        const draft = JSON.parse(saved) as Partial<FormData>;
        if (draft.name || draft.sku) {
          setShowDraftBanner(true);
          return; // Leave form at defaults until user chooses
        }
      } catch {}
    }

    safeLocalStorage.removeItem(draftKey);
    form.reset({
      name: '',
      description: '',
      categoryId: '',
      categoryName: '',
      quantityInStock: isQuickMode ? 1 : 0,
      minimumStockLevel: 0,
      purchasePrice: 0,
      salePrice: 0,
      location: '',
      sku: '',
      taxRate: 0,
      taxInclusive: false,
    });
    setVariants([]);
    setShowVariantsSection(false);
    setImagePreview(null);
    setUploadedImages([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeBranch?.branch_id, isQuickMode]);

  // Note: fetchExistingVariants removed - this is an Add Product page, not an edit page

  // Autosave form values to localStorage on change (debounced 2s)
  useEffect(() => {
    if (!activeBranch?.branch_id || showDraftBanner) return;
    const draftKey = getDraftStorageKey(activeBranch.branch_id);
    let timer: NodeJS.Timeout;

    const subscription = form.watch((values) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const hasData = !!(values.name || values.sku || values.description);
        if (hasData) {
          safeLocalStorage.setItem(draftKey, JSON.stringify(values));
          setDraftSaved(true);
        } else {
          safeLocalStorage.removeItem(draftKey);
          setDraftSaved(false);
        }
      }, 2000);
    });

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, [activeBranch?.branch_id, form, showDraftBanner]);

  // Auto-clear draft saved indicator after 2.5s
  useEffect(() => {
    if (!draftSaved) return;
    const t = setTimeout(() => setDraftSaved(false), 2500);
    return () => clearTimeout(t);
  }, [draftSaved]);

  // Track form opened on mount and abandoned on unmount
  useEffect(() => {
    track('product_form_opened', 'Product Form Opened', { method: 'manual' });
    return () => {
      if (!submittedRef.current) {
        track('product_form_abandoned', 'Product Form Abandoned', { method: 'manual' });
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Effects ---

  // Handle pre-filled SKU
  useEffect(() => {
    if (preFilledSKU) {
      console.log(`[AddProductPage] Setting pre-filled SKU: ${preFilledSKU}`);
      form.setValue('sku', preFilledSKU);
    }
  }, [preFilledSKU, form]);

  useEffect(() => {
    if (preFilledName) {
      console.log(`[AddProductPage] Setting pre-filled product name: ${preFilledName}`);
      form.setValue('name', preFilledName, { shouldDirty: true });
    }
  }, [preFilledName, form]);

  // Handle pre-filled category
  useEffect(() => {
    if (preFilledCategoryId) {
      console.log(`[AddProductPage] Setting pre-filled category ID: ${preFilledCategoryId}`);
      form.setValue('categoryId', preFilledCategoryId);
      // Try to find category name from the categories list
      const category = categories.find(c => c.id === preFilledCategoryId);
      if (category) {
        form.setValue('categoryName', category.name);
      }
    }
  }, [preFilledCategoryId, form, categories]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      uploadedImages.forEach(img => URL.revokeObjectURL(img.preview));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Clear any stale localStorage prefill so form always starts empty for new product
  useEffect(() => {
    try {
      localStorage.removeItem('prefillAddProductName');
    } catch {}
  }, []);


  // Check for duplicate product name - debounced
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const checkDuplicate = async (name: string) => {
      name = name.trim();
      if (!name || !activeBranch?.branch_id || hasVariants) {
        setDuplicateName(false);
        return;
      }
      
      console.log(`[AddProductPage] Checking duplicate name: ${name}`);
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
      console.log(`[AddProductPage] Duplicate check result: ${data && data.length > 0 ? 'DUPLICATE' : 'OK'}`);
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

  // Barcode is handled via URL params when returning from /dashboard/scan

  // Generate SKU
  const generateSKU = () => {
    const sku = Math.random().toString(36).substring(2, 10).toUpperCase();
    form.setValue('sku', sku);
    toast.success(`SKU generated: ${sku}`);
  };

  // Calculate margin/markup
  const purchasePrice = form.watch('purchasePrice');
  const salePrice = form.watch('salePrice');
  const marginAmount = salePrice - purchasePrice;
  const marginPercent = purchasePrice > 0 ? (marginAmount / purchasePrice) * 100 : 0;

  // Generic function to handle Category creation or fetching
  const handleAssociation = useCallback(async (
    nameKey: keyof FormData,
    idKey: keyof FormData,
    tableName: 'categories',
    customFields: Record<string, any> = {}
  ): Promise<string | null> => {
    const nameValue = form.getValues(nameKey);
    const name = typeof nameValue === 'string' ? nameValue.trim() : '';
    const idValue = form.getValues(idKey);
    let id = typeof idValue === 'string' ? idValue : null;

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

    if (createError || !newItem) {
      console.error(`Error creating new ${tableName}:`, createError);
      toast.error(`Error creating ${tableName}`);
      throw createError || new Error(`Failed to create ${tableName}`);
    }

    console.log(`[AddProductModal] New ${tableName} created: ${newItem.id}`);
    return newItem.id;
  }, [form]);

  // --- Main Submission Logic ---

  const handleSubmit = async (data: FormData) => {
    const operationId =
      user?.id && activeBranch?.branch_id
        ? startOperation('product_create', {
            userId: user.id,
            branchId: activeBranch.branch_id,
            properties: { method: isQuickMode ? 'quick' : 'manual', surface: 'product_create' },
          })
        : '';
    console.log('[AddProductModal] Submission started. Mode: CREATE, Data:', data);

    if (isOverProductLimit) {
      track('product_form_error', 'Form Error: Product limit reached', { error: 'product_limit_reached', limit: maxProducts });
      toast.error(`You've reached your ${maxProducts}-product limit. Upgrade your plan to add more products.`, {
        action: { label: 'Upgrade', onClick: () => navigate('/dashboard/settings/billing') },
      });
      return;
    }

    // Check for duplicate name in create mode
    if (duplicateName && !hasVariants) {
      track('product_form_error', 'Form Error: Duplicate name', { error: 'duplicate_name' });
      toast.error('Product name already exists for a main product in this warehouse.');
      console.error('[AddProductModal] Submission aborted: Duplicate name detected.');
      return;
    }

    if (!user || branchLoading || !activeBranch) {
      console.error('[AddProductModal] Submission aborted: Auth/Branch check failed.', { user: !!user, branchLoading, activeBranch: !!activeBranch });
      toast.error('Authentication or warehouse loading failed. Cannot proceed.');
      return;
    }


    // Variant validation
    if (hasVariants) {
      const validVariants = variants.filter(v => v.variantName.trim());
      if (validVariants.length === 0) {
        track('product_form_error', 'Form Error: No variants provided', { error: 'no_variants' });
        toast.error('Add at least one variant.');
        console.error('[AddProductModal] Submission aborted: No variants provided.');
        return;
      }
      for (const variant of validVariants) {
        if (!variant.variantName.trim()) {
          track('product_form_error', 'Form Error: Variant missing name', { error: 'variant_missing_name' });
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
      taxRate: Number(data.taxRate) || 0,
      taxInclusive: data.taxInclusive || false,
    };
    
    setLoading(true);
    let wasFirstProduct = false;

    try {
      // 1. Check for first product before insertion
      const { count } = await supabase
        .from('products')
        .select('id', { count: 'exact', head: true })
        .eq('branch_id', activeBranch.branch_id);
      wasFirstProduct = (count || 0) === 0;

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

      // Invalidate productsByCategories queries (used in categories.tsx)
      queryClient.invalidateQueries({
        queryKey: ['productsByCategories'],
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

      const lastCategoryId = form.getValues('categoryId');
      const lastCategoryName = form.getValues('categoryName');

      form.reset({
        name: '',
        description: '',
        categoryId: '',
        categoryName: '',
        quantityInStock: 0,
        minimumStockLevel: 0,
        purchasePrice: 0,
        salePrice: 0,
        location: '',
        sku: '',
        taxRate: 0,
        taxInclusive: false,
      });
      setVariants([]);
      setShowVariantsSection(false);
      setImagePreview(null);
      setProductImage(null);
      // Clean up uploaded images and revoke object URLs
      uploadedImages.forEach(img => URL.revokeObjectURL(img.preview));
      setUploadedImages([]);

      safeLocalStorage.removeItem(getDraftStorageKey(activeBranch.branch_id));
      submittedRef.current = true;
      const method = isQuickMode ? 'quick' : 'manual';
      if (operationId) {
        endOperation(operationId, 'succeeded', {
          userId: user.id,
          branchId: activeBranch.branch_id,
          properties: { method, is_first: wasFirstProduct },
        });
      } else {
        track('product_created', undefined, { method, is_first: wasFirstProduct });
      }
      if (wasFirstProduct && user?.id) {
        emitActivationOnce(
          user.id,
          (events) => {
            events.forEach((e) => track(e.name, undefined, { ...e.properties, method }));
          },
          { method },
        );
        if (isQuickMode) {
          toast.success('Your inventory control center is live');
          navigate('/dashboard');
        } else {
          setShowBulkImporterSuggestion(true);
        }
      } else if (addAnotherRef.current) {
        addAnotherRef.current = false;
        form.setValue('categoryId', lastCategoryId);
        form.setValue('categoryName', lastCategoryName);
        setTimeout(() => form.setFocus('name'), 0);
      } else {
        navigate('/dashboard/categories');
      }
    } catch (error) {
      if (operationId) {
        endOperation(operationId, 'failed', {
          userId: user?.id,
          branchId: activeBranch?.branch_id,
          error_code: 'submit_exception',
          properties: { message: error instanceof Error ? error.message : 'unknown' },
        });
      }
      console.error('Unexpected error during product submission:', error);
      toast.error('Unexpected error during product addition.');
    } finally {
      setLoading(false);
      console.log('[AddProductModal] Submission finalized.');
    }
  };

  // --- Draft Handlers ---

  const handleRestoreDraft = () => {
    const draftKey = getDraftStorageKey(activeBranch?.branch_id);
    const saved = safeLocalStorage.getItem(draftKey);
    if (saved) {
      try {
        const draft = JSON.parse(saved) as Partial<FormData>;
        form.reset({ ...form.getValues(), ...draft });
      } catch {}
    }
    setShowDraftBanner(false);
  };

  const handleDiscardDraft = () => {
    safeLocalStorage.removeItem(getDraftStorageKey(activeBranch?.branch_id));
    form.reset({
      name: '',
      description: '',
      categoryId: '',
      categoryName: '',
      quantityInStock: isQuickMode ? 1 : 0,
      minimumStockLevel: 0,
      purchasePrice: 0,
      salePrice: 0,
      location: '',
      sku: '',
      taxRate: 0,
      taxInclusive: false,
    });
    setVariants([]);
    setShowVariantsSection(false);
    setShowDraftBanner(false);
  };

  // --- Render Checks ---

  if (!user || branchLoading) {
    console.log('[AddProductModal] Render aborted: User or branch loading.');
    return null;
  }

  if (!activeBranch) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Select a warehouse to add a product.</p>
          <Button onClick={() => navigate('/dashboard/categories')}>Back to Products</Button>
        </div>
      </div>
    );
  }

  // --- Component JSX (Structural Fix Applied) ---

  return (
    <>
      {/* Main AddProductPage Content - h-full + max-h so only inner card scrolls, not layout main */}
      <div className="h-full max-h-[calc(100vh-5rem)] flex flex-col min-h-0 bg-white border border-gray-200 rounded-lg shadow-sm ">
        {/* Header */}
        
        <div className="flex-shrink-0 border-b px-6 py-4 bg-white rounded-t-lg shadow-sm sticky top-0 z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => navigate('/dashboard/categories')}
                className="gap-2 border-gray-300 shadow-sm hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <h1 className="text-2xl font-bold">{isQuickMode ? 'Quick add product' : 'Add Product'}</h1>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              {draftSaved && (
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Draft saved
                </span>
              )}
              {!isQuickMode && (
                <Button
                  type="submit"
                  form="add-product-form"
                  disabled={loading || (duplicateName && !hasVariants) || isOverProductLimit || !nameValue?.trim()}
                  className={isMobile ? 'w-full' : 'shrink-0'}
                >
                  {loading ? 'Adding...' : 'Add Product'}
                </Button>
              )}
              <p className="text-sm text-gray-500">
                <Link
                  to="/dashboard/products/import"
                  className="hover:text-blue-600 transition-colors"
                >
                  Have a lot to add? Try Import.
                </Link>
              </p>
            </div>
          </div>
        </div>

        {isQuickMode && (
          <div className="flex-shrink-0 border-b border-blue-100 bg-blue-50 px-6 py-2 text-sm text-blue-700">
            Quick add — fill in the details later.
          </div>
        )}

        {/* Draft restore banner */}
        {showDraftBanner && (
          <div className="flex-shrink-0 flex flex-col sm:flex-row sm:items-center gap-2 border-b border-amber-100 bg-amber-50 px-6 py-3 text-sm text-amber-900">
            <p className="flex-1">You have an unsaved draft. Resume where you left off?</p>
            <div className="flex gap-4 shrink-0">
              <button
                type="button"
                className="font-medium text-amber-700 hover:underline"
                onClick={handleRestoreDraft}
              >
                Resume
              </button>
              <button
                type="button"
                className="font-medium text-amber-500 hover:underline"
                onClick={handleDiscardDraft}
              >
                Discard
              </button>
            </div>
          </div>
        )}

        {/* Over-limit warning */}
        {isOverProductLimit && (
          <div className="flex-shrink-0 flex items-center gap-3 bg-amber-50 border-b border-amber-200 px-6 py-3">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <p className="text-sm text-amber-800">
              You have <strong>{productCount}</strong> products but your Starter plan only allows{' '}
              <strong>{maxProducts}</strong>.{' '}
              <Link to="/dashboard/settings/billing" className="font-semibold underline hover:text-amber-900">
                Upgrade your plan
              </Link>{' '}
              to add more products.
            </p>
          </div>
        )}


        <div className={`flex-1 min-h-0 overflow-y-auto ${isMobile ? 'p-4 pt-6' : 'p-6 pt-8 '}`}>
          <div className="mx-auto">
            <Form {...form}>
              <form id="add-product-form" onSubmit={form.handleSubmit(handleSubmit, (errors) => {
                const firstError = Object.keys(errors)[0];
                const firstMessage = (errors as any)[firstError]?.message ?? firstError;
                track('product_form_error', `Form Error: ${firstMessage}`, { error: 'validation_error', field: firstError, message: firstMessage });
              })} className="space-y-6">
                {/* General Info */}
                  <FormField
                    control={form.control}
                    name="name"
                    rules={{ required: 'Product name is mandatory' }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-900 tracking-tight">Product Name *</FormLabel>
                        <FormControl>
                          <Input
                              {...field}
                              autoFocus
                              placeholder="Enter product name"
                              disabled={loading}
                              className="border-gray-300 focus:border-gray-500 text-lg overflow-hidden text-ellipsis"
                            />
                        </FormControl>
                        {duplicateName && !hasVariants && (
                          <div className="flex items-center text-sm text-red-600 mt-1">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            This product name already exists for a main product in this warehouse.
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                {/* Stock Quantity */}
                {!hasVariants && (
                  <FormField
                    control={form.control}
                    name="quantityInStock"
                    rules={{ min: { value: 0, message: 'Stock must be 0 or more' } }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-900">Stock Quantity <span className="text-gray-400 font-normal">(optional)</span></FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            inputMode="numeric"
                            min="0"
                            placeholder="0"
                            disabled={loading}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === '' || /^\d+$/.test(val)) {
                                field.onChange(val === '' ? 0 : parseInt(val, 10));
                              }
                            }}
                            value={field.value === 0 ? '' : field.value.toString()}
                            className="border-gray-300 focus:border-gray-500 max-w-xs"
                          />
                        </FormControl>
                        <FormDescription>Current quantity on hand.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {isQuickMode && !showQuickAdvanced && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="sku"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-900">SKU (optional)</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter SKU"
                                disabled={loading}
                                className="border-gray-300 focus:border-gray-500"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="categoryId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-900">Category (optional)</FormLabel>
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
                    <button
                      type="button"
                      className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                      onClick={() => setShowQuickAdvanced(true)}
                    >
                      <ChevronDown className="w-4 h-4" />
                      <span>Show advanced fields</span>
                    </button>
                  </div>
                )}

                {/* Collapsible More Details - SKU, Min Stock, Category, Location, Image, Description, Pricing, Tax */}
                {(!isQuickMode || showQuickAdvanced) && (
                <Collapsible open={showAdditionalInfo} onOpenChange={setShowAdditionalInfo}>
                  <CollapsibleTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-between"
                    >
                      <span className="font-medium">More details</span>
                      {showAdditionalInfo ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4 mt-4">
                    {/* Min Stock, SKU, Category, Location */}
                    {!hasVariants && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="minimumStockLevel"
                          rules={{ min: { value: 0, message: 'Minimum level must be 0 or more' } }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-900">Minimum Stock</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  inputMode="numeric"
                                  min="0"
                                  placeholder="10"
                                  disabled={loading}
                                  onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                                  value={field.value === 0 ? '' : field.value.toString()}
                                  className="border-gray-300 focus:border-gray-500"
                                />
                              </FormControl>
                              <FormDescription>We'll alert you when stock hits this level.</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="sku"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-900">SKU</FormLabel>
                              <FormControl>
                                <div className="flex gap-2">
                                  <Input
                                    {...field}
                                    placeholder="Enter SKU or scan barcode"
                                    disabled={loading || hasVariants}
                                    className="border-gray-300 focus:border-gray-500 flex-1"
                                  />
                                  <Link to="/dashboard/scan" state={{ returnTo: '/dashboard/products/new', barcodeField: 'sku' }}>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      disabled={loading || hasVariants}
                                      className="px-4 shrink-0"
                                      title="Scan barcode"
                                    >
                                      <Scan className="w-4 h-4 pr-2" />
                                      Scan Code
                                    </Button>
                                  </Link>
                                </div>
                              </FormControl>
                              <FormDescription>Unique identifier. Scan barcode to auto-fill.</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
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
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <LocationSelector
                                value={field.value || ''}
                                onValueChange={(location) => field.onChange(location || '')}
                                placeholder="Select location..."
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    {/* Top Row: Image and Description side by side */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Left Column - Product Image */}
                      <div className="space-y-3">
                        <h3 className="text-sm font-medium text-gray-600">Product Image</h3>
                      
                        {uploadedImages.length > 0 && (
                          <div className="space-y-3">
                            <div className="bg-gray-50 rounded-lg border border-gray-200 p-3 flex items-center justify-center">
                              <img
                                src={uploadedImages[0].preview}
                                alt="Product preview"
                                className="max-w-full max-h-48 object-contain"
                              />
                            </div>
                            {uploadedImages.length > 1 && (
                              <div className="grid grid-cols-4 gap-2">
                                {uploadedImages.slice(1).map((image, index) => (
                                  <div key={index + 1} className="relative group">
                                    <img
                                      src={image.preview}
                                      alt={`Thumbnail ${index + 2}`}
                                      className="w-full h-20 object-cover rounded border border-gray-200"
                                    />
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeImage(index + 1)}
                                      disabled={loading}
                                      className="absolute top-0 right-0 p-1 h-6 w-6 text-red-600 hover:text-red-700 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <X className="w-3 h-3" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}
                            <div className="space-y-1">
                              {uploadedImages.map((image, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2 p-2 bg-white border border-gray-200 rounded text-xs"
                                >
                                  <img src={image.preview} alt={`Preview ${index + 1}`} className="w-10 h-10 object-cover rounded" />
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 truncate">{image.file.name}</p>
                                    <p className="text-gray-500">{formatFileSize(image.size)}</p>
                                  </div>
                                  {index === 0 && uploadedImages.length > 1 && <span className="text-xs text-gray-500">Main</span>}
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeImage(index)}
                                    disabled={loading}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 h-6 px-2"
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      
                        <div
                          onDragEnter={handleDragEnter}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          className={cn(
                            "border-2 border-dashed rounded-lg p-4 text-center transition-colors",
                            isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50 hover:border-gray-400"
                          )}
                        >
                          <div className="flex flex-col items-center justify-center space-y-2">
                            <ImageIcon className="w-8 h-8 text-gray-400" />
                            <div>
                              <p className="text-xs text-gray-600">
                                Drop images here or <label htmlFor="image-upload" className="text-blue-600 hover:text-blue-700 cursor-pointer underline">Browse</label>
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
                      </div>

                      {/* Right Column - Description */}
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-600">Description</h3>
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Textarea 
                                  {...field} 
                                  placeholder="Enter product description" 
                                  disabled={loading}
                                  className="resize-none border-gray-300 focus:border-gray-500"
                                  rows={4}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Pricing and Tax Configuration */}
                    <div className="grid grid-cols-1 gap-6">
                      {!hasVariants && (
                        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                          <div className="text-sm font-medium text-gray-600 mb-3">Pricing</div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="purchasePrice"
                              rules={{ min: { value: 0, message: 'Must be 0 or more' } }}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Purchase Price</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      inputMode="decimal"
                                      step="0.01"
                                      min="0"
                                      placeholder="0"
                                      disabled={loading}
                                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                      value={field.value === 0 ? '' : field.value.toString()}
                                      className="border-gray-300 focus:border-gray-500"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="salePrice"
                              rules={{ min: { value: 0, message: 'Must be 0 or more' } }}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Sale Price</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      inputMode="decimal"
                                      step="0.01"
                                      min="0"
                                      placeholder="0"
                                      disabled={loading}
                                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                      value={field.value === 0 ? '' : field.value.toString()}
                                      className="border-gray-300 focus:border-gray-500"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          {purchasePrice > 0 && salePrice > 0 && (
                            <div className={`mt-4 p-3 rounded-lg border ${marginAmount >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Margin Amount:</span>
                                  <span className={`font-semibold ${marginAmount >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                                    {marginAmount >= 0 ? '+' : ''}{marginAmount.toFixed(2)}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Margin %:</span>
                                  <span className={`font-semibold ${marginPercent >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                                    {marginPercent >= 0 ? '+' : ''}{marginPercent.toFixed(2)}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {!hasVariants && (
                        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                          <div className="text-sm font-medium text-gray-600 mb-3">Tax Configuration</div>
                          <div className="space-y-3">
                            <FormField
                              control={form.control}
                              name="taxRate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm">Tax Rate (%)</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      inputMode="decimal"
                                      step="0.01"
                                      min="0"
                                      max="100"
                                      placeholder="0"
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
                            <FormField
                              control={form.control}
                              name="taxInclusive"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-200 p-3 bg-white">
                                  <div className="space-y-0.5">
                                    <FormLabel className="text-sm">Tax Inclusive</FormLabel>
                                    <p className="text-xs text-gray-500">Sale price includes tax</p>
                                  </div>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                      disabled={loading}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            {form.watch('taxRate') > 0 && salePrice > 0 && (
                              <div className="p-3 rounded-lg border bg-blue-50 border-blue-200">
                                <div className="space-y-1 text-sm">
                                  {form.watch('taxInclusive') ? (
                                    <>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Sale Price (incl. tax):</span>
                                        <span className="font-semibold text-gray-900">{salePrice.toFixed(2)}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Tax Amount:</span>
                                        <span className="font-semibold text-gray-900">
                                          {(salePrice - (salePrice / (1 + form.watch('taxRate') / 100))).toFixed(2)}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Price (excl. tax):</span>
                                        <span className="font-semibold text-gray-900">
                                          {(salePrice / (1 + form.watch('taxRate') / 100)).toFixed(2)}
                                        </span>
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Sale Price (excl. tax):</span>
                                        <span className="font-semibold text-gray-900">{salePrice.toFixed(2)}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Tax Amount:</span>
                                        <span className="font-semibold text-gray-900">
                                          {(salePrice * (form.watch('taxRate') / 100)).toFixed(2)}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Final Price (incl. tax):</span>
                                        <span className="font-semibold text-blue-700">
                                          {(salePrice * (1 + form.watch('taxRate') / 100)).toFixed(2)}
                                        </span>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
                )}

                {/* Subtle visual separator */}
                {(!isQuickMode || showQuickAdvanced) && (
                <div className="border-t border-gray-200 my-6"></div>
                )}

                {/* Variants Section */}
                {(!isQuickMode || showQuickAdvanced) && (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                    Product Variants {hasVariants && <span className="normal-case font-normal text-gray-500">(Active)</span>}
                  </h3>
                  {!showVariantsSection ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <p className="text-sm text-gray-600 mb-4">Add variants to manage sizes, colors, or other options.</p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setShowVariantsSection(true);
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
                        }}
                        className="flex items-center gap-2 mx-auto"
                      >
                        <ChevronDown className="w-4 h-4" />
                        Add Variants
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowVariantsSection(false)}
                          className="flex items-center gap-2 text-gray-600"
                        >
                          <ChevronUp className="w-4 h-4" />
                          Hide Variants
                        </Button>
                      </div>
                      {hasVariants && (
                        <p className="text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded p-2">
                          Variants are enabled. Stock, prices, and location are managed per variant below.
                        </p>
                      )}
                  
                  {/* Variant Input Section - Only show when expanded */}
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
                                      inputMode="numeric"
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
                                      inputMode="numeric"
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
                                      inputMode="decimal"
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
                                      inputMode="decimal"
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
                    </>
                  )}
                </div>
                )}

                
              </form>
            </Form>
          </div>
        </div>

        {/* Sticky submit footer — quick mode only */}
        {isQuickMode && (
          <div className="flex-shrink-0 border-t bg-white px-6 py-4 flex items-center justify-between gap-3">
            <button
              type="button"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              onClick={() => navigate('/dashboard/products/new')}
            >
              Use full form
            </button>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={loading || (duplicateName && !hasVariants) || isOverProductLimit || !nameValue?.trim()}
                onClick={() => {
                  addAnotherRef.current = true;
                  document.getElementById('add-product-form')?.dispatchEvent(
                    new Event('submit', { bubbles: true, cancelable: true })
                  );
                }}
              >
                Add & add another
              </Button>
              <Button
                type="submit"
                form="add-product-form"
                disabled={loading || (duplicateName && !hasVariants) || isOverProductLimit || !nameValue?.trim()}
              >
                {loading ? 'Adding...' : 'Add Product'}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* 2. Upgrade Notice Modal (Correctly isolated and conditional) */}
      {showUpgradeNotice && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
          <div className="bg-white border border-blue-300 rounded-lg shadow-lg p-6 max-w-md relative flex flex-col items-center">
            <Info className="w-8 h-8 text-blue-700 mb-4" />
            <div className="text-center">
              <div className="font-bold text-blue-700 text-lg mb-2">Plan automatically upgraded</div>
              <div className="text-blue-900 text-sm mb-3">
                StockFlow uses a freemium model start free, pay as you grow. You started on our free plan (up to 100 products at no cost). As your business grows and you add more products, your plan automatically upgrades to match your needs.
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

      {/* 3. Bulk Importer Suggestion Modal (first product added) */}
      <BulkImporterSuggestionModal
        isOpen={showBulkImporterSuggestion}
        onClose={() => {
          setShowBulkImporterSuggestion(false);
          navigate('/dashboard/categories');
        }}
      />
    </>
  );
}
