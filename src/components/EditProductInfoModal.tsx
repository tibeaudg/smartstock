import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
          .single();

        if (existingCategory) {
          categoryId = existingCategory.id;
          console.log('Found existing category:', existingCategory);
        } else {
          const { data: newCategory, error: categoryError } = await supabase
            .from('categories')
            .insert({ name: form.category_name.trim() })
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
      <DialogContent className={`w-full max-w-full mx-auto p-0 ${isMobile ? 'h-full max-h-full rounded-none' : ' md:w-auto md:max-w-lg md:p-6 md:rounded-lg'}`}>
        <DialogHeader className={`${isMobile ? 'p-4 border-b' : 'p-0'}`}>
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
        
        <div className={`${isMobile ? 'flex-1 overflow-y-auto p-4' : 'mt-2'}`}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="mb-4">
              <Label>Productnaam</Label>
              <Input name="name" value={form.name} onChange={handleChange} disabled={loading} required />
            </div>
            <div className="mb-4">
              <Label>Beschrijving</Label>
              <Input name="description" value={form.description} onChange={handleChange} disabled={loading} />
            </div>
            <div className="mb-4">
              <Label>Locatie</Label>
              <Input name="location" value={form.location} onChange={handleChange} disabled={loading} placeholder="Voer locatie in (bijv. A1, Rek 3, etc.)" />
            </div>
            <div className="mb-4">
              <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-2 gap-4'}`}>
                <div>
                  <Label>Categorie</Label>
                  <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={categoryOpen}
                        className="w-full justify-between py-3 px-3 text-base"
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
                                             .insert({ name: form.category_name.trim() })
                                             .select('id, name')
                                             .single();
                                           
                                           if (error) {
                                             toast.error('Fout bij het aanmaken van categorie');
                                             return;
                                           }
                                           
                                           setCategories(prev => [...prev, newCategory]);
                                           // Also set the category ID in the form
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
                  <Label>Leverancier</Label>
                  <Popover open={supplierOpen} onOpenChange={setSupplierOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={supplierOpen}
                        className="w-full justify-between py-3 px-3 text-base"
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
                                    // Voeg nieuwe leverancier toe aan database
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
                                      // Also set the supplier ID in the form
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
            <div className="mb-4">
              <Label>Voorraad</Label>
              <Input name="quantity_in_stock" type="number" value={form.quantity_in_stock} onChange={handleChange} disabled={loading} min={0} required />
            </div>
            <div className="mb-4">
              <Label>Min. Niveau</Label>
              <Input name="minimum_stock_level" type="number" value={form.minimum_stock_level} onChange={handleChange} disabled={loading} min={0} required />
            </div>
            <div className="mb-4">
              <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-2 gap-4'}`}>
                <div>
                  <Label htmlFor="purchase_price">Inkoopprijs</Label>
                  <Input
                    id="purchase_price"
                    name="purchase_price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.purchase_price}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="sale_price">Verkoopprijs</Label>
                  <Input
                    id="sale_price"
                    name="sale_price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.sale_price}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="mb-4">
              <Label>Productfoto</Label>
              <Input type="file" accept="image/*" onChange={handleImageChange} disabled={loading} />
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="mt-2 w-24 h-24 object-cover rounded border" />
              )}
            </div>
          </form>
        </div>

        <div className={`${isMobile ? 'p-4 border-t bg-gray-50' : 'mt-4'}`}>
          <div className={`flex ${isMobile ? 'flex-col gap-3' : 'justify-between gap-2'}`}>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleDelete} 
              disabled={loading}
              className={`flex items-center gap-2 ${isMobile ? 'w-full' : ''}`}
            >
              <Trash2 className="h-4 w-4" />
              Verwijderen
            </Button>
            <div className={`flex gap-2 ${isMobile ? 'w-full' : ''}`}>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose} 
                disabled={loading}
                className={isMobile ? 'flex-1' : ''}
              >
                Annuleren
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                onClick={handleSubmit}
                className={isMobile ? 'flex-1' : ''}
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
