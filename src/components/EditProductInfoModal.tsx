import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Trash2, ArrowLeft, Check, ChevronsUpDown, Plus } from 'lucide-react';
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
  
  // State voor categorieën en leveranciers
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [suppliers, setSuppliers] = useState<Array<{ id: string; name: string }>>([]);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [supplierOpen, setSupplierOpen] = useState(false);
  
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

  // Haal categorieën en leveranciers op
  useEffect(() => {
    if (user) {
      fetchCategories();
      fetchSuppliers();
    }
  }, [user]);

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

  const handleDelete = async () => {
    if (!user || !activeBranch) {
      toast.error('Je moet ingelogd zijn en een filiaal geselecteerd hebben');
      return;
    }
    const confirmMessage = 'Weet je zeker dat je dit product wilt verwijderen?\n\n' +
      'LET OP: Dit zal ook alle gerelateerde transacties verwijderen!';
    if (!confirm(confirmMessage)) return;
    
    setLoading(true);
    try {
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .match({ id: product.id, branch_id: activeBranch.branch_id });
      if (deleteError) {
        toast.error(`Verwijderen mislukt: ${deleteError.message}`);
        setLoading(false);
        return;
      }
      toast.success('Product en gerelateerde transacties succesvol verwijderd');
      // Forceer update van productCount in Sidebar
      queryClient.invalidateQueries({ queryKey: ['productCount', activeBranch.branch_id, user.id] });
      onProductUpdated();
      onClose();
    } catch (error) {
      toast.error('Er is een onverwachte fout opgetreden');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    let imageUrl = product.image_url;
    if (productImage) {
      const fileExt = productImage.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, productImage, { upsert: false });
      if (uploadError) {
        toast.error('Fout bij uploaden van afbeelding');
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
            toast.error('Fout bij het aanmaken van leverancier');
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
            toast.error('Fout bij het aanmaken van categorie');
            setLoading(false);
            return;
          }
          categoryId = newCategory.id;
          console.log('Created new category:', newCategory);
        }
      }

      console.log('Final IDs for update:', { categoryId, supplierId });

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
        toast.error('Fout bij het bijwerken van product info');
        setLoading(false);
        return;
      }
      
      console.log('Product updated successfully');
      toast.success('Productinformatie bijgewerkt!');
      
      // Invalidate all product queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['products'] });
      
      onProductUpdated();
      onClose();
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Onverwachte fout bij het bijwerken van product');
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
            Productinformatie aanpassen: {product.name}
          </DialogTitle>
        </DialogHeader>

        <div className={`${isMobile ? 'flex-1 overflow-y-auto p-4' : 'max-h-[calc(90vh-120px)] overflow-y-auto'}`}>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Basis Informatie Sectie */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                Basis Informatie
              </h3>
              <div className="space-y-4">
                <div>
                  <Label className="text-blue-700 font-medium">Product Naam *</Label>
                  <Input 
                    name="name" 
                    value={form.name} 
                    onChange={handleChange} 
                    disabled={loading} 
                    required 
                    className="py-3 px-3 text-base border-blue-200 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-blue-700 font-medium">Voorraad *</Label>
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
                    <Label className="text-blue-700 font-medium">Min. Niveau *</Label>
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
                  Geavanceerde Opties
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
                        <Label className="text-gray-700">Beschrijving</Label>
                        <Textarea 
                          name="description" 
                          value={form.description} 
                          onChange={handleChange} 
                          disabled={loading}
                          className="resize-none py-3 px-3 text-base border-gray-200 focus:border-gray-400"
                          rows={3}
                        />
                      </div>

                      <div>
                        <Label className="text-gray-700">Locatie</Label>
                        <Input 
                          name="location" 
                          value={form.location} 
                          onChange={handleChange} 
                          disabled={loading} 
                          placeholder="Voer locatie in (bijv. A1, Rek 3, etc.)" 
                          className="py-3 px-3 text-base border-gray-200 focus:border-gray-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Categorie en Leverancier Sectie */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="text-md font-semibold text-gray-700 mb-3 flex items-center">
                      <div className="w-2 h-2 bg-gray-500 rounded-full mr-2"></div>
                      Categorie & Leverancier
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-700">Categorie</Label>
                        <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={categoryOpen}
                              className="w-full justify-between py-3 px-3 text-base border-gray-200 focus:border-gray-400"
                              disabled={loading}
                            >
                              {form.category_name ? form.category_name : "Selecteer categorie..."}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput 
                                placeholder="Categorie zoeken..." 
                                value={form.category_name}
                                onValueChange={(value) => handleCategoryChange(value)}
                              />
                              <CommandList>
                                <CommandEmpty>
                                  <div className="p-2 text-center">
                                    <p className="text-sm text-gray-500 mb-2">Geen categorie gevonden</p>
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
                                              toast.error('Fout bij het aanmaken van categorie');
                                              return;
                                            }
                                            
                                            setCategories(prev => [...prev, newCategory]);
                                            setForm(prev => ({ ...prev, category_id: newCategory.id }));
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
                                      "{form.category_name}" toevoegen
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
                        <Label className="text-gray-700">Leverancier</Label>
                        <Popover open={supplierOpen} onOpenChange={setSupplierOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={supplierOpen}
                              className="w-full justify-between py-3 px-3 text-base border-gray-200 focus:border-gray-400"
                              disabled={loading}
                            >
                              {form.supplier_name ? form.supplier_name : "Selecteer leverancier..."}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput 
                                placeholder="Leverancier zoeken..." 
                                value={form.supplier_name}
                                onValueChange={(value) => handleSupplierChange(value)}
                              />
                              <CommandList>
                                <CommandEmpty>
                                  <div className="p-2 text-center">
                                    <p className="text-sm text-gray-500 mb-2">Geen leverancier gevonden</p>
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
                                              toast.error('Fout bij het aanmaken van leverancier');
                                              return;
                                            }
                                            
                                            setSuppliers(prev => [...prev, newSupplier]);
                                            setForm(prev => ({ ...prev, supplier_id: newSupplier.id }));
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
                                      "{form.supplier_name}" toevoegen
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

                  {/* Prijzen Sectie */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="text-md font-semibold text-gray-700 mb-3 flex items-center">
                      <div className="w-2 h-2 bg-gray-500 rounded-full mr-2"></div>
                      Prijzen
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-700">Inkoopprijs</Label>
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
                        <Label className="text-gray-700">Verkoopprijs</Label>
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

                  {/* Afbeelding Sectie */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="text-md font-semibold text-gray-700 mb-3 flex items-center">
                      <div className="w-2 h-2 bg-gray-500 rounded-full mr-2"></div>
                      Productfoto
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
              Verwijderen
            </Button>
            <div className={`flex gap-2 ${isMobile ? 'flex-col' : 'flex-row'}`}>
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
                onClick={handleSubmit}
                className={isMobile ? 'w-full' : 'w-full sm:w-auto'}
              >
                {loading ? 'Bijwerken...' : 'Productinformatie bijwerken'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
