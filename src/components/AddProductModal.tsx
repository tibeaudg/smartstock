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
  const navigate = useNavigate();
  const { isMobile } = useMobile();
  
  // State voor categorieën en leveranciers
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [suppliers, setSuppliers] = useState<Array<{ id: string; name: string }>>([]);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [supplierOpen, setSupplierOpen] = useState(false);
  
  // Gebruik de page refresh hook
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

  // Haal categorieën en leveranciers op
  useEffect(() => {
    if (user) {
      fetchCategories();
      fetchSuppliers();
    }
  }, [user]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
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
      toast.error('U bent niet ingelogd. Log opnieuw in en probeer het opnieuw.');
      return;
    }

    if (branchLoading) {
      toast.error('Filialen worden nog geladen, probeer het opnieuw.');
      return;
    }

    if (!activeBranch) {
      console.error('No active branch selected');
      toast.error('Geen actief filiaal geselecteerd. Selecteer een filiaal en probeer het opnieuw.');
      return;
    }

    setLoading(true);
    try {      
      // Haal huidig actief plan op vóór toevoegen
      const { data: beforeLicenseData } = await supabase.functions.invoke('get-license-and-usage');
      const beforePlan = beforeLicenseData?.activePlanId;
      console.log('[AddProductModal] user.id:', user.id, 'beforePlan:', beforePlan, 'beforeLicenseData:', beforeLicenseData);

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
            toast.error('Fout bij het aanmaken van leverancier');
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
          .single();

        if (existingCategory) {
          categoryId = existingCategory.id;
        } else {
          const { data: newCategory, error: categoryError } = await supabase
            .from('categories')
            .insert({ name: data.categoryName.trim() })
            .select('id')
            .single();

          if (categoryError) {
            console.error('Error creating category:', categoryError);
            toast.error('Fout bij het aanmaken van categorie');
            return;
          }
          categoryId = newCategory.id;
        }
      }

      // Upload image if exists
      if (productImage) {
        const fileExt = productImage.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, productImage, { upsert: false });
        if (uploadError) {
          toast.error('Fout bij uploaden van afbeelding');
          setLoading(false);
          return;
        }
        // Gebruik het SUPABASE_URL direct uit de client config
        const SUPABASE_URL = "https://sszuxnqhbxauvershuys.supabase.co";
        imageUrl = `${SUPABASE_URL}/storage/v1/object/public/product-images/${fileName}`;
      }

      // Create product with branch_id
      const productData = {
        name: data.name,
        description: data.description || null,
        quantity_in_stock: data.quantityInStock,
        minimum_stock_level: data.minimumStockLevel,
        unit_price: data.purchasePrice, // legacy fallback
        purchase_price: data.purchasePrice,
        sale_price: data.salePrice,
        branch_id: activeBranch.branch_id,
        image_url: imageUrl,
        user_id: user.id || (user?.id ?? ''), // fallback voor zekerheid
        supplier_id: supplierId,
        category_id: categoryId,
      };


      const { data: insertedProduct, error: productError } = await supabase
        .from('products')
        .insert(productData)
        .select()
        .single();

      if (productError) {
        console.error('Error adding product:', productError);
        toast.error(`Fout bij het toevoegen van product: ${productError.message}`);
        return;
      }
      // Direct na toevoegen: forceer refresh van productCount
      queryClient.invalidateQueries({ queryKey: ['productCount', activeBranch.branch_id, user.id] });

      // Always create a transaction for new products
      const stockTransactionData = {
        product_id: insertedProduct.id,
        product_name: data.name,
        transaction_type: 'incoming' as const,
        quantity: data.quantityInStock || 0,
        unit_price: data.purchasePrice,
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
        toast.error('Product created but failed to record initial stock');
      } else {
        console.log('Initial stock transaction created successfully');
      }

      toast.success('Product succesvol toegevoegd!');
      form.reset();
      // Na succesvol toevoegen, check licentie
      const { data: licenseData, error: licenseError } = await supabase.functions.invoke('get-license-and-usage');
      console.log('[AddProductModal] user.id:', user.id, 'afterPlan:', licenseData?.activePlanId, 'licenseData:', licenseData);
      if (!licenseError && licenseData) {
        const afterPlan = licenseData.activePlanId;
        if (beforePlan && afterPlan && beforePlan !== afterPlan) {
          onClose();
          setShowUpgradeNotice(true);
          return;
        }
      }
      onProductAdded();
      onClose();
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Onverwachte fout bij het toevoegen van product');
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
            <DialogTitle>Geen filiaal geselecteerd</DialogTitle>
          </DialogHeader>
          <div className="p-4 text-center">
            <p className="text-gray-600 mb-4">
              Selecteer eerst een filiaal om een product toe te voegen.
            </p>
            <Button onClick={onClose}>Sluiten</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`w-full max-w-full mx-auto p-0 ${isMobile ? 'h-full max-h-full rounded-none' : 'md:w-auto md:max-w-lg md:p-6 md:rounded-lg'}`}>
        <DialogHeader className={`${isMobile ? 'p-4 border-b' : ''}`}>
          <DialogTitle>Nieuw Product Toevoegen</DialogTitle>
        </DialogHeader>

        <div className={`${isMobile ? 'flex-1 overflow-y-auto p-4' : ''}`}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              rules={{ required: 'Product naam is verplicht' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Naam *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Voer product naam in" disabled={loading} className="py-3 px-3 text-base" />
                  </FormControl>
                  {duplicateName && (
                    <div className="flex items-center text-sm text-red-600 mt-1">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      Deze productnaam bestaat al in dit filiaal.
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Beschrijving</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Voer product beschrijving in" 
                      disabled={loading}
                      className="resize-none py-3 px-3 text-base"
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category and Supplier fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="categoryName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categorie</FormLabel>
                    <FormControl>
                      <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={categoryOpen}
                            className="w-full justify-between py-3 px-3 text-base"
                            disabled={loading}
                          >
                            {field.value ? field.value : "Selecteer categorie..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                                                     <Command>
                             <CommandInput 
                               placeholder="Categorie zoeken..." 
                               value={field.value}
                               onValueChange={field.onChange}
                             />
                            <CommandList>
                              <CommandEmpty>
                                <div className="p-2 text-center">
                                  <p className="text-sm text-gray-500 mb-2">Geen categorie gevonden</p>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                                                         onClick={async () => {
                                       if (field.value.trim()) {
                                         try {
                                           const { data: newCategory, error } = await supabase
                                             .from('categories')
                                             .insert({ name: field.value.trim() })
                                             .select('id, name')
                                             .single();
                                           
                                           if (error) {
                                             toast.error('Fout bij het aanmaken van categorie');
                                             return;
                                           }
                                           
                                           setCategories(prev => [...prev, newCategory]);
                                           // Also set the category ID in the form
                                           form.setValue('categoryId', newCategory.id);
                                           setCategoryOpen(false);
                                           toast.success('Nieuwe categorie toegevoegd!');
                                         } catch (error) {
                                           toast.error('Fout bij het aanmaken van categorie');
                                         }
                                       }
                                     }}
                                    className="w-full"
                                  >
                                    <Plus className="w-4 h-4 mr-2" />
                                    "{field.value}" toevoegen
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
                                      // Also set the category ID
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
                    <FormLabel>Leverancier</FormLabel>
                    <FormControl>
                      <Popover open={supplierOpen} onOpenChange={setSupplierOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={supplierOpen}
                            className="w-full justify-between py-3 px-3 text-base"
                            disabled={loading}
                          >
                            {field.value ? field.value : "Selecteer leverancier..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                                                     <Command>
                             <CommandInput 
                               placeholder="Leverancier zoeken..." 
                               value={field.value}
                               onValueChange={field.onChange}
                             />
                            <CommandList>
                              <CommandEmpty>
                                <div className="p-2 text-center">
                                  <p className="text-sm text-gray-500 mb-2">Geen leverancier gevonden</p>
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
                                             toast.error('Fout bij het aanmaken van leverancier');
                                             return;
                                           }
                                           
                                           setSuppliers(prev => [...prev, newSupplier]);
                                           // Also set the supplier ID in the form
                                           form.setValue('supplierId', newSupplier.id);
                                           setSupplierOpen(false);
                                           toast.success('Nieuwe leverancier toegevoegd!');
                                         } catch (error) {
                                           toast.error('Fout bij het aanmaken van leverancier');
                                         }
                                       }
                                     }}
                                    className="w-full"
                                  >
                                    <Plus className="w-4 h-4 mr-2" />
                                    "{field.value}" toevoegen
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
                                      // Also set the supplier ID
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

            {/* Responsive grid: 1 kolom op mobiel, 3 op desktop */}
            <div className=" grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="quantityInStock"
                rules={{ 
                  required: 'Voorraad is verplicht',
                  min: { value: 1, message: 'Aantal in voorraad kan niet 0 zijn!' }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Voorraad *</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        min="0"
                        placeholder="0"
                        disabled={loading}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        className="py-3 px-3 text-base"
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
                  required: 'Minimum niveau is verplicht',
                  min: { value: 0, message: 'Minimum niveau moet 0 of meer zijn' }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Min. Niveau *</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        min="0"
                        placeholder="10"
                        disabled={loading}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        className="py-3 px-3 text-base"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Prijsvelden onder elkaar in één kolom */}
              <div className="flex flex-col gap-2 p-2">
                <div>
                  <FormLabel htmlFor="purchasePrice">Inkoopprijs</FormLabel>
                  <Input
                    id="purchasePrice"
                    type="number"
                    step="0.01"
                    min="0"
                    {...form.register('purchasePrice', { required: true, min: 0 })}
                    className="py-3 px-3 text-base"
                  />
                </div>
                <div>
                  <Label htmlFor="salePrice">Verkoopprijs</Label>
                  <Input
                    id="salePrice"
                    type="number"
                    step="0.01"
                    min="0"
                    {...form.register('salePrice', { required: true, min: 0 })}
                    className="py-3 px-3 text-base"
                  />
                </div>
              </div>

              {/* Afbeelding upload veld */}
              <div className="flex flex-col gap-2">
                <Label>Productfoto</Label>
                <Input type="file" accept="image/*" onChange={handleImageChange} disabled={loading} className="py-2" />
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" className="mt-2 w-24 h-24 max-w-full object-cover rounded border mx-auto" />
                )}
              </div>
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
                  Annuleren
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading} 
                  className={isMobile ? 'w-full' : 'w-full sm:w-auto'}
                >
                  {loading ? 'Toevoegen...' : 'Product Toevoegen'}
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
        <div className="font-bold text-blue-700 text-lg mb-2">Abonnement automatisch geüpgraded</div>
        <div className="text-blue-900 text-sm">
          Uw aantal producten overschrijdt de limiet van uw huidige abonnement. U wordt automatisch overgezet naar een hoger abonnement. Klik op 'Accepteren' om uw nieuwe licentie te bekijken.
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
        Accepteren
      </button>

    </div>
  </div>
)}
    </Dialog>
  );
};
