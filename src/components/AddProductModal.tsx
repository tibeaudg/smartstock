import React, { useState, useEffect } from 'react';
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
import { SuggestionInput } from './SuggestionInput';
import { AlertCircle, Check, ChevronsUpDown, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Info } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useMobile } from '@/hooks/use-mobile';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: () => void;
}

interface FormData {
  name: string;
  description: string;
  categoryId: string;
  supplierId: string;
  categoryName: string;
  supplierName: string;
  quantityInStock: number;
  minimumStockLevel: number;
  purchasePrice: number;
  salePrice: number;
  location: string;
}

export const AddProductModal = ({ isOpen, onClose, onProductAdded }: AddProductModalProps) => {
  const { user } = useAuth();
  const { activeBranch, loading: branchLoading } = useBranches();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [duplicateName, setDuplicateName] = useState(false);
  const [productImage, setProductImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showUpgradeNotice, setShowUpgradeNotice] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const navigate = useNavigate();
  const { isMobile } = useMobile();
  
  // State voor Categoryën en leveranciers
  const [categories, setCategorys] = useState<Array<{ id: string; name: string }>>([]);
  const [suppliers, setSuppliers] = useState<Array<{ id: string; name: string }>>([]);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [supplierOpen, setSupplierOpen] = useState(false);
  // Variants UI state
  const [hasVariants, setHasVariants] = useState(false);
  const [variants, setVariants] = useState<Array<{
    variantName: string;
    quantityInStock: number;
    minimumStockLevel: number;
    purchasePrice: number;
    salePrice: number;
    sku?: string;
    barcode?: string;
    location?: string;
  }>>([]);
  
  // Use the page refresh hook
  usePageRefresh();

  const form = useForm<FormData>({
    defaultValues: {
      name: '',
      description: '',
      categoryId: '',
      supplierId: '',
      categoryName: '',
      supplierName: '',
      quantityInStock: 0,
      minimumStockLevel: 10,
      purchasePrice: 0,
      salePrice: 0,
      location: '',
    },
  });


  // Check for duplicate product name
  useEffect(() => {
    const checkDuplicate = async () => {
      const name = form.getValues('name').trim();
      if (!name) {
        setDuplicateName(false);
        return;
      }
      // Voor varianten laten we duplicate namen toe; validatie alleen voor hoofdproduct
      if (hasVariants) {
        setDuplicateName(false);
        return;
      }
      const { data, error } = await supabase
        .from('products')
        .select('id')
        .eq('name', name)
        .eq('branch_id', activeBranch?.branch_id);

      if (!error && data && data.length > 0) {
        setDuplicateName(true);
      } else {
        setDuplicateName(false);
      }
    };

    const subscription = form.watch((value, { name }) => {
      if (name === 'name') {
        checkDuplicate();
      }
    });

    return () => subscription.unsubscribe?.();
     
  }, [form, activeBranch]);

  // Haal Categoryën en leveranciers op
  useEffect(() => {
    if (user) {
      fetchCategorys();
      fetchSuppliers();
    }
  }, [user]);

  const fetchCategorys = async () => {
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
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .select('id, name')
        .order('name');
      
      if (error) {
        console.error('Error fetching suppliers:', error);
        return;
      }
      
      setSuppliers(data || []);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  // Afhandeling voor image preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setProductImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (data: FormData) => {

    // Enhanced validation with better error messages
    if (!user) {
      console.error('No authenticated user found');
      toast.error('You are not logged in. Please log in again and try again.');
      return;
    }

    if (branchLoading) {
      toast.error('Branches are still loading, please try again');
      return;
    }

    if (!activeBranch) {
      console.error('No active branch selected');
      toast.error('No active branch selected. Select a branch and try again');
      return;
    }

    // Validatie voor varianten
    if (hasVariants) {
      const validVariants = variants.filter(v => v.variantName.trim());
      if (validVariants.length === 0) {
        toast.error('Add at least one variant');
        return;
      }
      
      // Controleer of alle varianten verplichte velden hebben
      for (const variant of validVariants) {
        if (!variant.variantName.trim()) {
          toast.error('All variants must have a name');
          return;
        }
        // Prijzen zijn niet verplicht
      }
    }

    setLoading(true);
    try {      
      // Skip license check for now - function doesn't exist
      // TODO: Implement proper license checking if needed
      console.log('[AddProductModal] user.id:', user.id, 'adding product');

      let imageUrl = null;


      // Handle supplier
      let supplierId = data.supplierId || null;
      if (data.supplierName.trim() && !supplierId) {
        // If we have a name but no ID, try to find existing or create new
        const { data: existingSupplier } = await supabase
          .from('suppliers')
          .select('id')
          .eq('name', data.supplierName.trim())
          .single();

        if (existingSupplier) {
          supplierId = existingSupplier.id;
        } else {
          const { data: newSupplier, error: supplierError } = await supabase
            .from('suppliers')
            .insert({ name: data.supplierName.trim() })
            .select('id')
            .single();

          if (supplierError) {
            console.error('Error creating supplier:', supplierError);
            toast.error('Error creating supplier');
            return;
          }
          supplierId = newSupplier.id;
        }
      }

      // Handle category
      let categoryId = data.categoryId || null;
      if (data.categoryName.trim() && !categoryId) {
        // If we have a name but no ID, try to find existing or create new
        const { data: existingCategory } = await supabase
          .from('categories')
          .select('id')
          .eq('name', data.categoryName.trim())
          .eq('user_id', user.id)
          .single();

        if (existingCategory) {
          categoryId = existingCategory.id;
        } else {
          const { data: newCategory, error: categoryError } = await supabase
            .from('categories')
            .insert({ name: data.categoryName.trim(), user_id: user.id })
            .select('id')
            .single();

          if (categoryError) {
            console.error('Error creating category:', categoryError);
            toast.error('Error creating category');
            return;
          }
          categoryId = newCategory.id;
        }
      }

      // Upload image if exists
      if (productImage) {
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(productImage.type)) {
          toast.error('Invalid image format. Please use JPEG, PNG, or WebP');
          setLoading(false);
          return;
        }

        // Validate file size (max 5MB)
        if (productImage.size > 5 * 1024 * 1024) {
          toast.error('Image size must be less than 5MB');
          setLoading(false);
          return;
        }

        const fileExt = productImage.name.split('.').pop()?.toLowerCase();
        
        // Validate file extension
        if (!fileExt || !['jpg', 'jpeg', 'png', 'webp'].includes(fileExt)) {
          toast.error('Invalid file extension');
          setLoading(false);
          return;
        }

        const fileName = `${user.id}/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, productImage, { 
            upsert: false,
            contentType: productImage.type
          });
        if (uploadError) {
          toast.error('Error uploading image');
          setLoading(false);
          return;
        }
        // Get public URL from Supabase storage
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);
        imageUrl = publicUrl;
      }

      if (!hasVariants) {
        // Enkel hoofdproduct aanmaken (zonder varianten)
        const productData = {
          name: data.name,
          description: data.description || null,
          quantity_in_stock: data.quantityInStock,
          minimum_stock_level: data.minimumStockLevel,
          unit_price: data.purchasePrice,
          purchase_price: data.purchasePrice,
          sale_price: data.salePrice,
          branch_id: activeBranch.branch_id,
          image_url: imageUrl,
          user_id: user.id || (user?.id ?? ''),
          supplier_id: supplierId,
          category_id: categoryId,
          location: data.location.trim() || null,
          is_variant: false,
          parent_product_id: null,
          variant_name: null,
        };
        const { data: insertedProduct, error: productError } = await supabase
          .from('products')
          .insert(productData)
          .select()
          .single();
        if (productError) {
          console.error('Error adding product:', productError);
          toast.error(`Error adding product: ${productError.message}`);
          return;
        }
        // Direct na toevoegen: forceer refresh van productCount
        queryClient.invalidateQueries({ queryKey: ['productCount', activeBranch.branch_id, user.id] });
        // Initiele transactie
        const stockTransactionData = {
          product_id: insertedProduct.id,
          product_name: data.name,
          transaction_type: 'incoming' as const,
          quantity: data.quantityInStock || 0,
          unit_price: data.purchasePrice,
          user_id: user.id,
          created_by: user.id,
          branch_id: activeBranch.branch_id,
          reference_number: 'INITIAL_STOCK',
          notes: 'Nieuw product toegevoegd'
        };
        const { error: transactionError } = await supabase
          .from('stock_transactions')
          .insert(stockTransactionData);
        if (transactionError) {
          console.error('Error creating initial stock transaction:', transactionError);
          toast.error(`Product created but stock transaction failed: ${transactionError.message}`);
        } else {
          queryClient.invalidateQueries({ queryKey: ['stockTransactions'] });
        }
      } else {
        // Hoofdproduct + varianten in batch
        const parentData = {
          name: data.name,
          description: data.description || null,
          quantity_in_stock: 0,
          minimum_stock_level: data.minimumStockLevel,
          unit_price: data.purchasePrice,
          purchase_price: data.purchasePrice,
          sale_price: data.salePrice,
          branch_id: activeBranch.branch_id,
          image_url: imageUrl,
          user_id: user.id || (user?.id ?? ''),
          supplier_id: supplierId,
          category_id: categoryId,
          location: data.location.trim() || null,
          is_variant: false,
          parent_product_id: null,
          variant_name: null,
        };
        const { data: parent, error: parentError } = await supabase
          .from('products')
          .insert(parentData)
          .select()
          .single();
        if (parentError || !parent) {
          console.error('Error creating parent product:', parentError);
          toast.error('Error creating main product');
          return;
        }
        // Maak varianten
        const variantRows = variants.filter(v => v.variantName.trim()).map(v => ({
          name: data.name, // zelfde basisnaam
          description: data.description || null,
          quantity_in_stock: v.quantityInStock || 0,
          minimum_stock_level: v.minimumStockLevel ?? 0,
          unit_price: v.purchasePrice,
          purchase_price: v.purchasePrice,
          sale_price: v.salePrice,
          branch_id: activeBranch.branch_id,
          image_url: imageUrl,
          user_id: user.id || (user?.id ?? ''),
          supplier_id: supplierId,
          category_id: categoryId,
          location: v.location?.trim() || data.location.trim() || null,
          is_variant: true,
          parent_product_id: parent.id,
          variant_name: v.variantName.trim(),
          variant_sku: v.sku || null,
          variant_barcode: v.barcode || null,
        }));
        let insertedVariants: any[] = [];
        if (variantRows.length > 0) {
          const { data: createdVariants, error: varErr } = await supabase
            .from('products')
            .insert(variantRows)
            .select();
          if (varErr) {
            console.error('Error creating variants:', varErr);
            toast.error('Error creating variants');
            return;
          }
          insertedVariants = createdVariants || [];
          // Transacties voor elke variant met startvoorraad
          const transactions = insertedVariants.map((vp, idx) => ({
            product_id: vp.id,
            product_name: `${data.name} - ${vp.variant_name}`,
            transaction_type: 'incoming' as const,
            quantity: variantRows[idx].quantity_in_stock || 0,
            unit_price: variantRows[idx].purchase_price,
            user_id: user.id,
            created_by: user.id,
            branch_id: activeBranch.branch_id,
            reference_number: 'INITIAL_STOCK_VARIANT',
            notes: 'Nieuw variant toegevoegd',
            variant_id: vp.id,
            variant_name: vp.variant_name,
          }));
          if (transactions.length > 0) {
            const { error: tErr } = await supabase
              .from('stock_transactions')
              .insert(transactions);
            if (tErr) {
              console.error('Error creating variant transactions:', tErr);
              toast.error('Variants created but initial transactions failed');
            }
          }
        }
        // refresh counters
        queryClient.invalidateQueries({ queryKey: ['productCount', activeBranch.branch_id, user.id] });
        queryClient.invalidateQueries({ queryKey: ['stockTransactions'] });
      }

      toast.success(hasVariants ? 'Main product and variants added!' : 'Product successfully added!');
      form.reset();
      setVariants([]);
      setHasVariants(false);
      // Skip license check for now - function doesn't exist
      // TODO: Implement proper license checking if needed
      console.log('[AddProductModal] user.id:', user.id, 'product added successfully');
      onProductAdded();
      onClose();
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Unexpected error adding product');
    } finally {
      setLoading(false);
    }
  };

  // Don't render if no user or if branches are loading
  if (!user || branchLoading) {
    return null;
  }

  // Show message if no active branch
  if (!activeBranch) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>No branch selected</DialogTitle>
          </DialogHeader>
          <div className="p-4 text-center">
            <p className="text-gray-600 mb-4">
              Please select a branch first to add a product.
            </p>
            <Button onClick={onClose}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`w-full max-w-full mx-auto p-0 ${isMobile ? 'h-full max-h-full rounded-none bg-white' : 'bg-white md:w-auto md:max-w-4xl md:max-h-[90vh] md:p-6 md:rounded-lg'}`}>
        <DialogHeader className={`${isMobile ? 'p-4 border-b' : ''}`}>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>

        <div className={`${isMobile ? 'flex-1 overflow-y-auto p-4' : 'max-h-[calc(90vh-120px)] overflow-y-auto'}`}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              
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
              rules={{ required: 'Product naam is verplicht' }}
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
                  {duplicateName && (
                    <div className="flex items-center text-sm text-red-600 mt-1">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      This product name already exists in this branch.
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

                  {/* Voorraad velden - alleen tonen als geen varianten */}
                  {!hasVariants && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="quantityInStock"
                      rules={{ 
                        required: hasVariants ? false : 'Voorraad is verplicht',
                        min: { value: 0, message: 'Aantal in voorraad moet 0 of meer zijn' }
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-blue-700 font-medium">Stock {!hasVariants && '*'}</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="number" 
                              min="0"
                              placeholder="0"
                              disabled={loading}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
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
                        required: hasVariants ? false : 'Minimum niveau is verplicht',
                        min: { value: 0, message: 'Minimum niveau moet 0 of meer zijn' }
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-blue-700 font-medium">Min. Level {!hasVariants && '*'}</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="number" 
                              min="0"
                              placeholder="10"
                              disabled={loading}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
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

              {/* Geavanceerde Opties Sectie */}
              <div className="space-y-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                  className="w-full justify-between text-gray-600 hover:text-gray-800 border-gray-300"
                >
                  <span className="flex items-center">
                    <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
                    Advanced Options
                  </span>
                  <ChevronsUpDown className={`w-4 h-4 transition-transform ${showAdvancedOptions ? 'rotate-180' : ''}`} />
                </Button>

                {showAdvancedOptions && (
                  <div className="space-y-6 border border-gray-200 rounded-lg p-4 bg-gray-100">
                    
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

                    {/* Category en Leverancier Sectie */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h4 className="text-md font-semibold text-gray-700 mb-3 flex items-center">
                        <div className="w-2 h-2 bg-gray-500 rounded-full mr-2"></div>
                        Category & Supplier
                      </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="categoryName"
                render={({ field }) => (
                  <FormItem>
                              <FormLabel className="text-gray-700">Category</FormLabel>
                    <FormControl>
                      <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={categoryOpen}
                                      className="w-full justify-between py-3 px-3 text-base border-gray-200 focus:border-gray-400"
                            disabled={loading}
                          >
                            {field.value ? field.value : "Select category..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                                                     <Command>
                             <CommandInput 
                               placeholder="Search category..." 
                               value={field.value}
                               onValueChange={field.onChange}
                             />
                            <CommandList>
                              <CommandEmpty>
                                <div className="p-2 text-center">
                                  <p className="text-sm text-gray-500 mb-2">No category found</p>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                                                         onClick={async () => {
                                       if (field.value.trim()) {
                                         try {
                                           const { data: newCategory, error } = await supabase
                                             .from('categories')
                                             .insert({ name: field.value.trim(), user_id: user.id })
                                             .select('id, name')
                                             .single();
                                           
                                           if (error) {
                                             toast.error('Error creating category');
                                             return;
                                           }
                                           
                                           setCategorys(prev => [...prev, newCategory]);
                                           form.setValue('categoryId', newCategory.id);
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
                                    Add "{field.value}"
                                  </Button>
                                </div>
                              </CommandEmpty>
                              <CommandGroup>
                                {categories.map((category) => (
                                  <CommandItem
                                    key={category.id}
                                    value={category.name}
                                    onSelect={() => {
                                      field.onChange(category.name);
                                      form.setValue('categoryId', category.id);
                                      setCategoryOpen(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        field.value === category.name ? "opacity-100" : "opacity-0"
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
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="supplierName"
                render={({ field }) => (
                  <FormItem>
                              <FormLabel className="text-gray-700">Supplier</FormLabel>
                    <FormControl>
                      <Popover open={supplierOpen} onOpenChange={setSupplierOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={supplierOpen}
                                      className="w-full justify-between py-3 px-3 text-base border-gray-200 focus:border-gray-400"
                            disabled={loading}
                          >
                            {field.value ? field.value : "Select supplier..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                                                     <Command>
                             <CommandInput 
                               placeholder="Search supplier..." 
                               value={field.value}
                               onValueChange={field.onChange}
                             />
                            <CommandList>
                              <CommandEmpty>
                                <div className="p-2 text-center">
                                  <p className="text-sm text-gray-500 mb-2">No supplier found</p>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                                                         onClick={async () => {
                                       if (field.value.trim()) {
                                         try {
                                           const { data: newSupplier, error } = await supabase
                                             .from('suppliers')
                                             .insert({ name: field.value.trim() })
                                             .select('id, name')
                                             .single();
                                           
                                           if (error) {
                                             toast.error('Error creating supplier');
                                             return;
                                           }
                                           
                                           setSuppliers(prev => [...prev, newSupplier]);
                                           form.setValue('supplierId', newSupplier.id);
                                           setSupplierOpen(false);
                                           toast.success('New supplier added!');
                                         } catch (error) {
                                           toast.error('Error creating supplier');
                                         }
                                       }
                                     }}
                                    className="w-full"
                                  >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add "{field.value}"
                                  </Button>
                                </div>
                              </CommandEmpty>
                              <CommandGroup>
                                {suppliers.map((supplier) => (
                                  <CommandItem
                                    key={supplier.id}
                                    value={supplier.name}
                                    onSelect={() => {
                                      field.onChange(supplier.name);
                                      form.setValue('supplierId', supplier.id);
                                      setSupplierOpen(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        field.value === supplier.name ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                    {supplier.name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                      </div>
            </div>

                    {/* Prijzen Sectie - alleen tonen als geen varianten */}
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
                            required: false,
                            min: { value: 0, message: 'Moet 0 of meer zijn' }
                }}
                render={({ field }) => (
                  <FormItem>
                              <FormLabel className="text-gray-700">Purchase Price</FormLabel>
                    <FormControl>
                                              <Input 
                        {...field} 
                        type="number" 
                                  step="0.01"
                        min="0"
                        disabled={loading}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
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
                            required: false,
                            min: { value: 0, message: 'Moet 0 of meer zijn' }
                }}
                render={({ field }) => (
                  <FormItem>
                              <FormLabel className="text-gray-700">Sale Price</FormLabel>
                    <FormControl>
                                              <Input 
                        {...field} 
                        type="number" 
                                  step="0.01"
                        min="0"
                        disabled={loading}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
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

                    {/* Afbeelding Sectie */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h4 className="text-md font-semibold text-gray-700 mb-3 flex items-center">
                        <div className="w-2 h-2 bg-gray-500 rounded-full mr-2"></div>
                        Product Photo
                      </h4>
                      <div className="space-y-2">
                        <Input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleImageChange} 
                          disabled={loading} 
                          className="py-2 border-gray-200 focus:border-gray-400" 
                        />
                        {imagePreview && (
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="mt-2 w-24 h-24 max-w-full object-cover rounded border mx-auto" 
                          />
                        )}
                      </div>
                    </div>

              </div>
                )}
            </div>

            {/* Variant Toggle - Helemaal onderaan */}
            <div className="space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Has variants?</h4>
                    <p className="text-xs text-gray-500 mt-1">
                      Enable this to add multiple variants of this product (e.g. different colors, sizes)
                    </p>
                  </div>
                  <Switch
                    checked={hasVariants}
                    onCheckedChange={(checked) => {
                      setHasVariants(checked);
                      if (checked && variants.length === 0) {
                        // Voeg standaard een variant toe wanneer ingeschakeld
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
                      } else if (!checked) {
                        // Reset variants wanneer uitgeschakeld
                        setVariants([]);
                      }
                    }}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Variant Sectie */}
              {hasVariants && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="text-md font-semibold text-gray-700 mb-3 flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                    Product Varianten
                  </h4>
                  <div className="space-y-4">
                    {variants.map((variant, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="text-sm font-medium text-gray-700">Variant {index + 1}</h5>
                          {variants.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const newVariants = variants.filter((_, i) => i !== index);
                                setVariants(newVariants);
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
                                const newVariants = [...variants];
                                newVariants[index].variantName = e.target.value;
                                setVariants(newVariants);
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
                              value={variant.sku}
                              onChange={(e) => {
                                const newVariants = [...variants];
                                newVariants[index].sku = e.target.value;
                                setVariants(newVariants);
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
                              value={variant.barcode}
                              onChange={(e) => {
                                const newVariants = [...variants];
                                newVariants[index].barcode = e.target.value;
                                setVariants(newVariants);
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
                              value={variant.location}
                              onChange={(e) => {
                                const newVariants = [...variants];
                                newVariants[index].location = e.target.value;
                                setVariants(newVariants);
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
                              value={variant.quantityInStock}
                              onChange={(e) => {
                                const newVariants = [...variants];
                                newVariants[index].quantityInStock = parseInt(e.target.value) || 0;
                                setVariants(newVariants);
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
                              value={variant.minimumStockLevel}
                              onChange={(e) => {
                                const newVariants = [...variants];
                                newVariants[index].minimumStockLevel = parseInt(e.target.value) || 0;
                                setVariants(newVariants);
                              }}
                              className="mt-1"
                              disabled={loading}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor={`variant-purchase-${index}`} className="text-sm font-medium text-gray-700">
                              Purchase price
                            </Label>
                            <Input
                              id={`variant-purchase-${index}`}
                              type="number"
                              step="0.01"
                              min="0"
                              value={variant.purchasePrice}
                              onChange={(e) => {
                                const newVariants = [...variants];
                                newVariants[index].purchasePrice = parseFloat(e.target.value) || 0;
                                setVariants(newVariants);
                              }}
                              className="mt-1"
                              disabled={loading}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor={`variant-sale-${index}`} className="text-sm font-medium text-gray-700">
                              Sale price
                            </Label>
                      <Input 
                              id={`variant-sale-${index}`}
                        type="number" 
                        step="0.01"
                        min="0"
                              value={variant.salePrice}
                              onChange={(e) => {
                                const newVariants = [...variants];
                                newVariants[index].salePrice = parseFloat(e.target.value) || 0;
                                setVariants(newVariants);
                              }}
                              className="mt-1"
                        disabled={loading}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setVariants([...variants, {
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
              )}
            </div>

            <div className={`${isMobile ? 'p-4 border-t bg-gray-50' : 'pt-4'}`}>
              <div className={`flex gap-2 ${isMobile ? 'flex-col' : 'flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2'}`}>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onClose} 
                  disabled={loading} 
                  className={isMobile ? 'w-full' : 'w-full sm:w-auto'}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading} 
                  className={isMobile ? 'w-full' : 'w-full sm:w-auto'}
                >
                  {loading ? 'Adding...' : (hasVariants ? 'Add Product with Variants' : 'Add Product')}
                </Button>
              </div>
            </div>
          </form>
        </Form>
        </div>
      </DialogContent>
      {showUpgradeNotice && (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
    {/* 1. 'items-center' toegevoegd om alles horizontaal te centreren.
      2. 'justify-center' en overbodige klassen verwijderd voor duidelijkheid.
    */}
    <div className="bg-white border border-blue-300 rounded-lg shadow-lg p-6 max-w-md relative flex flex-col items-center">
      
      {/* 3. Ruimte toegevoegd onder het icoon */}
      <Info className="w-8 h-8 text-blue-700 mb-4" />

      {/* 2. 'text-center' toegevoegd om de tekst te centreren */}
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
          // Dispatch custom event om LicenseOverview te laten refetchen
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
    </Dialog>
  );
};
