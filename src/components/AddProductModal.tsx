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
import { useNavigate } from 'react-router-dom';
import { Info } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

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
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [duplicateName, setDuplicateName] = useState(false);
  const [productImage, setProductImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showUpgradeNotice, setShowUpgradeNotice] = useState(false);
  const navigate = useNavigate();

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
      let imageUrl = null;


      // Handle supplier
      let supplierId = null;
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
        unit_price: data.unitPrice,
        branch_id: activeBranch.branch_id,
        image_url: imageUrl,
        user_id: user.id, // <-- automatisch koppelen aan gebruiker
        supplier_id: supplierId,
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
        unit_price: data.unitPrice,
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
      if (!licenseError && licenseData) {
        const plan = licenseData.activePlanId;
        const plans = licenseData.availablePlans || [];
        const activePlan = plans.find((p) => p.id === plan);
        if (activePlan && licenseData.usage.total_products > activePlan.limit && plan !== 'enterprise') {
          onClose();
          setShowUpgradeNotice(true);
          return; // Stop hier, zodat modal open blijft tot acceptatie
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

              {/* Afbeelding upload veld */}
              <div>
                <Label>Productfoto</Label>
                <Input type="file" accept="image/*" onChange={handleImageChange} disabled={loading} />
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" className="mt-2 w-24 h-24 object-cover rounded border" />
                )}
              </div>
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
      {showUpgradeNotice && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
          <div className="bg-blue-100 border border-blue-300 rounded-lg shadow-lg p-6 w-full max-w-md relative flex flex-col">
            <div className="flex items-start">
              <Info className="w-6 h-6 text-blue-700 mr-3 mt-1" />
              <div>
                <div className="font-bold text-blue-900 text-lg mb-1">Abonnement automatisch geüpgraded</div>
                <div className="text-blue-900 text-sm mb-2">
                  Uw aantal producten overschrijdt de limiet van uw huidige abonnement. U wordt automatisch overgezet naar een hoger abonnement. Klik op 'Accepteren' om uw nieuwe licentie te bekijken.
                </div>
              </div>
            </div>
            <button
              className="mt-4 bg-blue-700 text-white font-semibold px-4 py-2 rounded hover:bg-blue-800 transition"
              onClick={() => { setShowUpgradeNotice(false); navigate('/dashboard/settings', { state: { tab: 'license' } }); }}
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
