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
import { AlertCircle } from 'lucide-react'; // Optional: for a warning icon

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: () => void;
}

interface FormData {
  name: string;
  description: string;
  categoryName: string;
  supplierName: string;
  quantityInStock: number;
  minimumStockLevel: number;
  unitPrice: number;
}

export const AddProductModal = ({ isOpen, onClose, onProductAdded }: AddProductModalProps) => {
  const { user } = useAuth();
  const { activeBranch, loading: branchLoading } = useBranches();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [suppliers, setSuppliers] = useState<string[]>([]);
  const [duplicateName, setDuplicateName] = useState(false);

  const form = useForm<FormData>({
    defaultValues: {
      name: '',
      description: '',
      categoryName: '',
      supplierName: '',
      quantityInStock: 0,
      minimumStockLevel: 10,
      unitPrice: 0,
    },
  });

  const fetchSuggestions = async () => {
    try {
      // Fetch existing categories
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('name')
        .order('name');
      
      if (categoriesData) {
        setCategories(categoriesData.map(c => c.name));
      }

      // Fetch existing suppliers
      const { data: suppliersData } = await supabase
        .from('suppliers')
        .select('name')
        .order('name');
      
      if (suppliersData) {
        setSuppliers(suppliersData.map(s => s.name));
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchSuggestions();
    }
  }, [isOpen]);

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
    // eslint-disable-next-line
  }, [form, activeBranch]);

  const handleSubmit = async (data: FormData) => {
    console.log('Starting product submission...');
    console.log('User:', user?.id);
    console.log('Active branch:', activeBranch);
    console.log('Branch loading:', branchLoading);

    // Enhanced validation with better error messages
    if (!user) {
      console.error('No authenticated user found');
      toast.error('U bent niet ingelogd. Log opnieuw in en probeer het opnieuw.');
      return;
    }

    if (branchLoading) {
      console.log('Branches are still loading, please wait...');
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
      console.log('Adding product for branch:', activeBranch.branch_id);
      
      let categoryId = null;
      let supplierId = null;

      // Handle category
      if (data.categoryName.trim()) {
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

      // Handle supplier
      if (data.supplierName.trim()) {
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

      // Create product with branch_id
      const productData = {
        name: data.name,
        description: data.description || null,
        category_id: categoryId,
        category_name: data.categoryName.trim() || null,
        supplier_id: supplierId,
        supplier_name: data.supplierName.trim() || null,
        quantity_in_stock: data.quantityInStock,
        minimum_stock_level: data.minimumStockLevel,
        unit_price: data.unitPrice,
        branch_id: activeBranch.branch_id,
      };

      console.log('Inserting product with data:', productData);

      const { data: insertedProduct, error: productError } = await supabase
        .from('products')
        .insert(productData)
        .select()
        .single();

      if (productError) {
        console.error('Error adding product:', productError);
        toast.error(`Fout bij het toevoegen van product: ${productError.message}`);
        return;
      }      console.log('Product added successfully:', insertedProduct);

      // Always create a transaction for new products
      const stockTransactionData = {
        product_id: insertedProduct.id,
        product_name: data.name,
        transaction_type: 'incoming' as const,
        quantity: data.quantityInStock || 0,
        unit_price: data.unitPrice,
        created_by: user.id,
        branch_id: activeBranch.branch_id,
        reference_number: 'INITIAL_STOCK',
        notes: 'Nieuw product toegevoegd'
      };

      console.log('Creating initial stock transaction:', stockTransactionData);
      
      const { error: transactionError } = await supabase
        .from('stock_transactions')
        .insert(stockTransactionData);

      if (transactionError) {
        console.error('Error creating initial stock transaction:', transactionError);
        toast.error('Product created but failed to record initial stock');
      } else {
        console.log('Initial stock transaction created successfully');
      }

      console.log('Product added successfully for branch:', activeBranch.branch_id);
      toast.success('Product succesvol toegevoegd!');
      form.reset();
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
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nieuw Product Toevoegen</DialogTitle>
        </DialogHeader>

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
                    <Input {...field} placeholder="Voer product naam in" disabled={loading} />
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
                      className="resize-none"
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="hidden grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="categoryName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categorie</FormLabel>
                    <FormControl>
                      <SuggestionInput
                        {...field}
                        label="Categorie"
                        suggestions={categories}
                        placeholder="Voer categorie in"
                        disabled={loading}
                      />
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
                      <SuggestionInput
                        {...field}
                        label="Leverancier"
                        suggestions={suppliers}
                        placeholder="Voer leverancier in"
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
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
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unitPrice"
                rules={{ 
                  required: 'Prijs is verplicht',
                  min: { value: 0, message: 'Prijs moet 0 of meer zijn' }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prijs *</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        disabled={loading}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                Annuleren
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Toevoegen...' : 'Product Toevoegen'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
