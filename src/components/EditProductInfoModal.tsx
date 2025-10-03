import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Trash2, ArrowLeft, Check, ChevronsUpDown, Plus } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { useQueryClient } from '@tanstack/react-query';
import { useMobile } from '@/hooks/use-mobile';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  description: string | null;
  quantity_in_stock: number;
  minimum_stock_level: number;
  unit_price: number;
  purchase_price: number;
  sale_price: number;
  status: string | null;
  branch_id?: string;
  image_url?: string | null;
  category_id?: string | null;
  supplier_id?: string | null;
  category_name?: string | null;
  supplier_name?: string | null;
  location?: string | null;
}

interface EditProductInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductUpdated: () => void;
  product: Product;
  onBack?: () => void; // New prop for back navigation
}

export const EditProductInfoModal = ({
  isOpen,
  onClose,
  onProductUpdated,
  product,
  onBack
}: EditProductInfoModalProps) => {
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  const queryClient = useQueryClient();
  const { isMobile } = useMobile();
  const [loading, setLoading] = useState(false);
  const [productImage, setProductImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(product.image_url || null);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  
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
  const [hasExistingVariants, setHasExistingVariants] = useState(false);
  const [existingVariants, setExistingVariants] = useState<Product[]>([]);
  const [isAddingVariant, setIsAddingVariant] = useState(false);
  const [newVariant, setNewVariant] = useState({
    variantName: '',
    quantityInStock: 0,
    minimumStockLevel: 0,
    purchasePrice: 0,
    salePrice: 0,
    location: ''
  });
  
  // Gebruik de page refresh hook
  usePageRefresh();
  const [form, setForm] = useState({
    name: product.name,
    description: product.description || '',
    quantity_in_stock: product.quantity_in_stock,
    minimum_stock_level: product.minimum_stock_level,
    unit_price: product.unit_price,
    purchase_price: product.purchase_price,
    sale_price: product.sale_price,
    category_id: product.category_id || '',
    supplier_id: product.supplier_id || '',
    category_name: product.category_name || '',
    supplier_name: product.supplier_name || '',
    location: product.location || '',
  });

  useEffect(() => {
    if (isOpen) {
      setForm({
        name: product.name,
        description: product.description || '',
        quantity_in_stock: product.quantity_in_stock,
        minimum_stock_level: product.minimum_stock_level,
        unit_price: product.unit_price,
        purchase_price: product.purchase_price,
        sale_price: product.sale_price,
        category_id: product.category_id || '',
        supplier_id: product.supplier_id || '',
        category_name: product.category_name || '',
        supplier_name: product.supplier_name || '',
        location: product.location || '',
      });
      setImagePreview(product.image_url || null);
      setProductImage(null);
    }
  }, [isOpen, product]);

  // Haal Categoryën en leveranciers op
  useEffect(() => {
    if (user) {
      fetchCategorys();
      fetchSuppliers();
    }
  }, [user]);

  // Check for existing variants when modal opens
  useEffect(() => {
    const fetchExistingVariants = async () => {
      if (!isOpen || !product.id || !activeBranch) return;
      
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('parent_product_id', product.id)
          .eq('branch_id', activeBranch.branch_id)
          .order('variant_name');
        
        if (!error && data && data.length > 0) {
          setHasExistingVariants(true);
          setExistingVariants(data as Product[]);
        } else {
          setHasExistingVariants(false);
          setExistingVariants([]);
        }
      } catch (error) {
        console.error('Error fetching variants:', error);
        setHasExistingVariants(false);
        setExistingVariants([]);
      }
    };

    fetchExistingVariants();
  }, [isOpen, product.id, activeBranch]);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setProductImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(product.image_url || null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.type === 'number' ? Number(e.target.value) : e.target.value });
  };

  const handleCategoryChange = (value: string) => {
    // Find the category by name and set both ID and name
    const category = categories.find(cat => cat.name === value);
    setForm({ 
      ...form, 
      category_id: category?.id || '', 
      category_name: value 
    });
  };

  const handleSupplierChange = (value: string) => {
    // Find the supplier by name and set both ID and name
    const supplier = suppliers.find(sup => sup.name === value);
    setForm({ 
      ...form, 
      supplier_id: supplier?.id || '', 
      supplier_name: value 
    });
  };

  const handleAddVariant = async () => {
    if (!user || !activeBranch) {
      toast.error('You must be logged in and have a branch selected');
      return;
    }

    if (!newVariant.variantName.trim()) {
      toast.error('Variant name is required');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('products')
        .insert({
          name: product.name,
          description: product.description,
          quantity_in_stock: newVariant.quantityInStock,
          minimum_stock_level: newVariant.minimumStockLevel,
          unit_price: newVariant.salePrice, // For backwards compatibility
          purchase_price: newVariant.purchasePrice,
          sale_price: newVariant.salePrice,
          category_id: product.category_id,
          supplier_id: product.supplier_id,
          location: newVariant.location,
          branch_id: activeBranch.branch_id,
          user_id: user.id,
          parent_product_id: product.id,
          is_variant: true,
          variant_name: newVariant.variantName,
          image_url: product.image_url // Inherit parent's image
        });

      if (error) {
        console.error('Error creating variant:', error);
        toast.error(`Failed to create variant: ${error.message}`);
        setLoading(false);
        return;
      }

      toast.success(`Variant "${newVariant.variantName}" created successfully`);
      
      // Reset form
      setNewVariant({
        variantName: '',
        quantityInStock: 0,
        minimumStockLevel: 0,
        purchasePrice: 0,
        salePrice: 0,
        location: ''
      });
      setIsAddingVariant(false);

      // Refresh variants list
      const { data: updatedVariants } = await supabase
        .from('products')
        .select('*')
        .eq('parent_product_id', product.id)
        .eq('branch_id', activeBranch.branch_id)
        .order('variant_name');
      
      if (updatedVariants) {
        setExistingVariants(updatedVariants as Product[]);
      }

      // Invalidate queries to refresh the product list
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['productCount', activeBranch.branch_id, user.id] });
      
    } catch (error) {
      console.error('Exception creating variant:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!user || !activeBranch) {
      toast.error('You must be logged in and have a branch selected');
      return;
    }
    const confirmMessage = 'Are you sure you want to delete this product?\n\n' +
      'WARNING: This will also delete all related transactions!';
    if (!confirm(confirmMessage)) return;
    
    setLoading(true);
    try {
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .match({ id: product.id, branch_id: activeBranch.branch_id });
      if (deleteError) {
        toast.error(`Delete failed: ${deleteError.message}`);
        setLoading(false);
        return;
      }
      toast.success('Product and related transactions successfully deleted');
      // Forceer update van productCount in Sidebar en dashboard data
      queryClient.invalidateQueries({ queryKey: ['productCount', activeBranch.branch_id, user.id] });
      queryClient.invalidateQueries({ queryKey: ['dashboardData', activeBranch.branch_id] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      onProductUpdated();
      onClose();
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      }
    }
    
    setLoading(true);
    let imageUrl = product.image_url;
    if (productImage) {
      const fileExt = productImage.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, productImage, { upsert: false });
      if (uploadError) {
        toast.error('Error uploading image');
        setLoading(false);
        return;
      }
      const SUPABASE_URL = "https://sszuxnqhbxauvershuys.supabase.co";
      imageUrl = `${SUPABASE_URL}/storage/v1/object/public/product-images/${fileName}`;
    }

    try {
      console.log('Updating product with form data:', form);
      
      // Handle supplier
      let supplierId = form.supplier_id || null;
      if (form.supplier_name.trim() && !supplierId) {
        // If we have a name but no ID, try to find existing or create new
        const { data: existingSupplier } = await supabase
          .from('suppliers')
          .select('id')
          .eq('name', form.supplier_name.trim())
          .single();

        if (existingSupplier) {
          supplierId = existingSupplier.id;
          console.log('Found existing supplier:', existingSupplier);
        } else {
          const { data: newSupplier, error: supplierError } = await supabase
            .from('suppliers')
            .insert({ name: form.supplier_name.trim() })
            .select('id')
            .single();

          if (supplierError) {
            console.error('Error creating supplier:', supplierError);
            toast.error('Error creating supplier');
            setLoading(false);
            return;
          }
          supplierId = newSupplier.id;
          console.log('Created new supplier:', newSupplier);
        }
      }

      // Handle category
      let categoryId = form.category_id || null;
      if (form.category_name.trim() && !categoryId) {
        // If we have a name but no ID, try to find existing or create new
        const { data: existingCategory } = await supabase
        .from('categories')
        .select('id')
        .eq('name', form.category_name.trim())
        .eq('user_id', user.id)
        .single();

        if (existingCategory) {
          categoryId = existingCategory.id;
          console.log('Found existing category:', existingCategory);
        } else {
          const { data: newCategory, error: categoryError } = await supabase
            .from('categories')
            .insert({ name: form.category_name.trim(), user_id: user.id })
            .select('id')
            .single();

          if (categoryError) {
            console.error('Error creating category:', categoryError);
            toast.error('Error creating category');
            setLoading(false);
            return;
          }
          categoryId = newCategory.id;
          console.log('Created new category:', newCategory);
        }
      }

      console.log('Final IDs for update:', { categoryId, supplierId });

      if (!hasVariants) {
        // Normale product update (zonder varianten)
        const { error: updateError } = await supabase
          .from('products')
          .update({
            name: form.name,
            description: form.description,
            quantity_in_stock: Number(form.quantity_in_stock),
            minimum_stock_level: Number(form.minimum_stock_level),
            unit_price: Number(form.unit_price),
            purchase_price: Number(form.purchase_price),
            sale_price: Number(form.sale_price),
            image_url: imageUrl,
            category_id: categoryId,
            supplier_id: supplierId,
            category_name: form.category_name.trim() || null,
            supplier_name: form.supplier_name.trim() || null,
            location: form.location.trim() || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', product.id);
          
        if (updateError) {
          console.error('Error updating product:', updateError);
          toast.error('Error updating product info');
          setLoading(false);
          return;
        }
        
        console.log('Product updated successfully');
        toast.success('Product information updated!');
      } else {
        // Product met varianten - update hoofdproduct en maak varianten
        const { error: updateError } = await supabase
          .from('products')
          .update({
            name: form.name,
            description: form.description,
            quantity_in_stock: 0, // Hoofdproduct heeft geen voorraad bij varianten
            minimum_stock_level: Number(form.minimum_stock_level),
            unit_price: Number(form.unit_price),
            purchase_price: Number(form.purchase_price),
            sale_price: Number(form.sale_price),
            image_url: imageUrl,
            category_id: categoryId,
            supplier_id: supplierId,
            category_name: form.category_name.trim() || null,
            supplier_name: form.supplier_name.trim() || null,
            location: form.location.trim() || null,
            is_variant: false,
            parent_product_id: null,
            variant_name: null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', product.id);
          
        if (updateError) {
          console.error('Error updating product:', updateError);
          toast.error('Error updating product info');
          setLoading(false);
          return;
        }
        
        // Maak varianten
        const variantRows = variants.filter(v => v.variantName.trim()).map(v => ({
          name: form.name, // zelfde basisnaam
          description: form.description || null,
          quantity_in_stock: v.quantityInStock || 0,
          minimum_stock_level: v.minimumStockLevel ?? 0,
          unit_price: v.purchasePrice,
          purchase_price: v.purchasePrice,
          sale_price: v.salePrice,
          branch_id: activeBranch?.branch_id,
          image_url: imageUrl,
          user_id: user.id || (user?.id ?? ''),
          supplier_id: supplierId,
          category_id: categoryId,
          location: v.location?.trim() || form.location.trim() || null,
          is_variant: true,
          parent_product_id: product.id,
          variant_name: v.variantName.trim(),
          variant_sku: v.sku || null,
          variant_barcode: v.barcode || null,
        }));
        
        if (variantRows.length > 0) {
          const { data: createdVariants, error: varErr } = await supabase
            .from('products')
            .insert(variantRows)
            .select();
          if (varErr) {
            console.error('Error creating variants:', varErr);
            toast.error('Error creating variants');
            setLoading(false);
            return;
          }
          
          // Transacties voor elke variant met startvoorraad
          const transactions = createdVariants?.map((vp, idx) => ({
            product_id: vp.id,
            product_name: `${form.name} - ${vp.variant_name}`,
            transaction_type: 'incoming' as const,
            quantity: variantRows[idx].quantity_in_stock || 0,
            unit_price: variantRows[idx].purchase_price,
            user_id: user.id,
            created_by: user.id,
            branch_id: activeBranch?.branch_id,
            reference_number: 'VARIANT_CREATED',
            notes: 'Variant toegevoegd aan bestaand product',
            variant_id: vp.id,
            variant_name: vp.variant_name,
          })) || [];
          
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
        
        console.log('Product with variants updated successfully');
        toast.success('Product and variants updated!');
      }
      
      // Invalidate all product queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['stockTransactions'] });
      
      onProductUpdated();
      onClose();
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Unexpected error updating product');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`w-full max-w-full mx-auto p-0 ${isMobile ? 'h-full max-h-full rounded-none bg-white' : 'bg-white md:w-auto md:max-w-4xl md:max-h-[90vh] md:p-6 md:rounded-lg'}`}>
        <DialogHeader className={`${isMobile ? 'p-4 border-b' : ''}`}>
          {isMobile && onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="absolute left-4 top-4 z-10"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <DialogTitle className={`${isMobile ? 'text-center pr-8' : ''}`}>
            Edit Product Information: {product.name}
          </DialogTitle>
        </DialogHeader>

        <div className={`${isMobile ? 'flex-1 overflow-y-auto p-4' : 'max-h-[calc(90vh-120px)] overflow-y-auto'}`}>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Basis Informatie Sectie */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                Basic Information
              </h3>
              <div className="space-y-4">
                <div>
                  <Label className="text-blue-700 font-medium">Product Name *</Label>
                  <Input 
                    name="name" 
                    value={form.name} 
                    onChange={handleChange} 
                    disabled={loading} 
                    required 
                    className="py-3 px-3 text-base border-blue-200 focus:border-blue-500"
                  />
                </div>

                {!hasExistingVariants && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-blue-700 font-medium">Stock *</Label>
                      <Input 
                        name="quantity_in_stock" 
                        type="number" 
                        value={form.quantity_in_stock} 
                        onChange={handleChange} 
                        disabled={loading} 
                        min={0} 
                        required 
                        className="py-3 px-3 text-base border-blue-200 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <Label className="text-blue-700 font-medium">Min. Level *</Label>
                      <Input 
                        name="minimum_stock_level" 
                        type="number" 
                        value={form.minimum_stock_level} 
                        onChange={handleChange} 
                        disabled={loading} 
                        min={0} 
                        required 
                        className="py-3 px-3 text-base border-blue-200 focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}
                {hasExistingVariants && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-purple-900">Product Variants ({existingVariants.length})</h4>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => setIsAddingVariant(true)}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Variant
                      </Button>
                    </div>
                    
                    {/* List of existing variants */}
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {existingVariants.map((variant) => (
                        <div key={variant.id} className="bg-white border border-purple-200 rounded-lg p-3 flex items-center justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{variant.variant_name}</p>
                            <div className="flex gap-4 mt-1 text-xs text-gray-600">
                              <span>Stock: {variant.quantity_in_stock}</span>
                              <span>Min: {variant.minimum_stock_level}</span>
                              <span>Price: ${variant.sale_price.toFixed(2)}</span>
                              {variant.location && <span>Location: {variant.location}</span>}
                            </div>
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              // TODO: Open edit modal for this variant
                              toast.info('Edit variant functionality coming soon');
                            }}
                            className="ml-2"
                          >
                            Edit
                          </Button>
                        </div>
                      ))}
                    </div>

                    {/* Add new variant form */}
                    {isAddingVariant && (
                      <div className="bg-white border-2 border-purple-300 rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="text-sm font-semibold text-purple-900">New Variant</h5>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setIsAddingVariant(false);
                              setNewVariant({
                                variantName: '',
                                quantityInStock: 0,
                                minimumStockLevel: 0,
                                purchasePrice: 0,
                                salePrice: 0,
                                location: ''
                              });
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div className="col-span-2">
                            <Label className="text-xs">Variant Name *</Label>
                            <Input
                              value={newVariant.variantName}
                              onChange={(e) => setNewVariant({ ...newVariant, variantName: e.target.value })}
                              placeholder="e.g., Yellow, Size M"
                              className="text-sm"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Stock *</Label>
                            <Input
                              type="number"
                              value={newVariant.quantityInStock}
                              onChange={(e) => setNewVariant({ ...newVariant, quantityInStock: Number(e.target.value) })}
                              min={0}
                              className="text-sm"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Min Level *</Label>
                            <Input
                              type="number"
                              value={newVariant.minimumStockLevel}
                              onChange={(e) => setNewVariant({ ...newVariant, minimumStockLevel: Number(e.target.value) })}
                              min={0}
                              className="text-sm"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Purchase Price *</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={newVariant.purchasePrice}
                              onChange={(e) => setNewVariant({ ...newVariant, purchasePrice: Number(e.target.value) })}
                              min={0}
                              className="text-sm"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Sale Price *</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={newVariant.salePrice}
                              onChange={(e) => setNewVariant({ ...newVariant, salePrice: Number(e.target.value) })}
                              min={0}
                              className="text-sm"
                            />
                          </div>
                          <div className="col-span-2">
                            <Label className="text-xs">Location</Label>
                            <Input
                              value={newVariant.location}
                              onChange={(e) => setNewVariant({ ...newVariant, location: e.target.value })}
                              placeholder="Optional"
                              className="text-sm"
                            />
                          </div>
                        </div>
                        
                        <Button
                          type="button"
                          size="sm"
                          onClick={handleAddVariant}
                          disabled={!newVariant.variantName || loading}
                          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                        >
                          {loading ? 'Creating...' : 'Create Variant'}
                        </Button>
                      </div>
                    )}
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
                      <div>
                        <Label className="text-gray-700">Description</Label>
                        <Textarea 
                          name="description" 
                          value={form.description} 
                          onChange={handleChange} 
                          disabled={loading}
                          className="resize-none py-3 px-3 text-base border-gray-200 focus:border-gray-400"
                          rows={3}
                        />
                      </div>


                      {!hasExistingVariants && (
                        <div>
                          <Label className="text-gray-700">Location</Label>
                          <Input 
                            name="location" 
                            value={form.location} 
                            onChange={handleChange} 
                            disabled={loading} 
                            placeholder="Enter location (e.g. A1, Shelf 3, etc.)" 
                            className="py-3 px-3 text-base border-gray-200 focus:border-gray-400"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Category en Leverancier Sectie */}
                  {!hasExistingVariants && (
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h4 className="text-md font-semibold text-gray-700 mb-3 flex items-center">
                        <div className="w-2 h-2 bg-gray-500 rounded-full mr-2"></div>
                          Category & Supplier
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-700">Category</Label>
                        <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={categoryOpen}
                              className="w-full justify-between py-3 px-3 text-base border-gray-200 focus:border-gray-400"
                              disabled={loading}
                            >
                              {form.category_name ? form.category_name : "Select category..."}
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
                                        if (form.category_name.trim()) {
                                          try {
                                            const { data: newCategory, error } = await supabase
                                              .from('categories')
                                              .insert({ name: form.category_name.trim(), user_id: user.id })
                                              .select('id, name')
                                              .single();
                                            
                                            if (error) {
                                              toast.error('Error creating category');
                                              return;
                                            }
                                            
                                            setCategorys(prev => [...prev, newCategory]);
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
                      </div>

                      <div>
                        <Label className="text-gray-700">Supplier</Label>
                        <Popover open={supplierOpen} onOpenChange={setSupplierOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={supplierOpen}
                              className="w-full justify-between py-3 px-3 text-base border-gray-200 focus:border-gray-400"
                              disabled={loading}
                            >
                              {form.supplier_name ? form.supplier_name : "Select supplier..."}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput 
                                placeholder="Search supplier..." 
                                value={form.supplier_name}
                                onValueChange={(value) => handleSupplierChange(value)}
                              />
                              <CommandList>
                                <CommandEmpty>
                                  <div className="p-2 text-center">
                                    <p className="text-sm text-gray-500 mb-2">No supplier found</p>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={async () => {
                                        if (form.supplier_name.trim()) {
                                          try {
                                            const { data: newSupplier, error } = await supabase
                                              .from('suppliers')
                                              .insert({ name: form.supplier_name.trim() })
                                              .select('id, name')
                                              .single();
                                            
                                            if (error) {
                                              toast.error('Error creating supplier');
                                              return;
                                            }
                                            
                                            setSuppliers(prev => [...prev, newSupplier]);
                                            setForm(prev => ({ ...prev, supplier_id: newSupplier.id }));
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
                                      Add "{form.supplier_name}"
                                    </Button>
                                  </div>
                                </CommandEmpty>
                                <CommandGroup>
                                  {suppliers.map((supplier) => (
                                    <CommandItem
                                      key={supplier.id}
                                      value={supplier.name}
                                      onSelect={() => {
                                        handleSupplierChange(supplier.name);
                                        setSupplierOpen(false);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          form.supplier_name === supplier.name ? "opacity-100" : "opacity-0"
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
                      </div>
                      </div>
                    </div>
                  )}

                  {/* Prijzen Sectie */}
                  {!hasExistingVariants && (
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h4 className="text-md font-semibold text-gray-700 mb-3 flex items-center">
                        <div className="w-2 h-2 bg-gray-500 rounded-full mr-2"></div>
                          Prices
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-700">Purchase Price</Label>
                          <Input
                            name="purchase_price"
                            type="number"
                            step="0.01"
                            min="0"
                            value={form.purchase_price}
                            onChange={handleChange}
                            disabled={loading}
                            className="py-3 px-3 text-base border-gray-200 focus:border-gray-400"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-700">Sale Price</Label>
                          <Input
                            name="sale_price"
                            type="number"
                            step="0.01"
                            min="0"
                            value={form.sale_price}
                            onChange={handleChange}
                            disabled={loading}
                            className="py-3 px-3 text-base border-gray-200 focus:border-gray-400"
                          />
                        </div>
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
            {!hasExistingVariants && (
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
            )}
          </form>
        </div>

        <div className={`${isMobile ? 'p-4 border-t bg-gray-50' : 'pt-4'}`}>
          <div className={`flex gap-2 ${isMobile ? 'flex-col' : 'flex-col sm:flex-row justify-between space-y-2 sm:space-y-0 sm:space-x-2'}`}>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleDelete} 
              disabled={loading}
              className={`flex items-center gap-2 ${isMobile ? 'w-full' : 'w-full sm:w-auto'}`}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
            <div className={`flex gap-2 ${isMobile ? 'flex-col' : 'flex-row'}`}>
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
                onClick={handleSubmit}
                className={isMobile ? 'w-full' : 'w-full sm:w-auto'}
              >
                {loading ? 'Updating...' : (hasVariants ? 'Update Product with Variants' : 'Update Product Information')}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
