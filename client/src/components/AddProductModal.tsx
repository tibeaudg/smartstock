import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { api } from '@/lib/api';
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

  const form = useForm<FormData>({
    defaultValues: {
      name: '',
      description: '',
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
      try {
        const products = await api.products.getAll(activeBranch?.branch_id);
        const exists = products.some(p => p.name === name);
        setDuplicateName(exists);
      } catch (error) {
        console.error('Error checking duplicate:', error);
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
      // Simplified implementation without image upload for now
      let imageUrl = null;

      // Create product with branch_id
      const productData = {
        name: data.name,
        description: data.description || '',
        quantity_in_stock: data.quantityInStock,
        minimum_stock_level: data.minimumStockLevel,
        unit_price: data.purchasePrice,
        purchase_price: data.purchasePrice,
        sale_price: data.salePrice,
        branch_id: activeBranch.branch_id,
        image_url: imageUrl,
        user_id: user.id,
      };

      const insertedProduct = await api.products.create(productData);

      // Create initial stock transaction
      const stockTransactionData = {
        product_id: insertedProduct.id,
        product_name: data.name,
        transaction_type: 'incoming' as const,
        quantity: data.quantityInStock || 0,
        unit_price: data.purchasePrice,
        created_by: user.id,
        branch_id: activeBranch.branch_id,
        reference_number: 'INITIAL_STOCK',
        notes: 'New product added'
      };

      await api.stockTransactions.create(stockTransactionData);

      toast.success('Product successfully added!');
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
      <DialogContent className="w-full max-w-full p-2 md:w-auto md:max-w-lg md:p-6">
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

            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} disabled={loading} className="w-full sm:w-auto">
                Annuleren
              </Button>
              <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                {loading ? 'Toevoegen...' : 'Product Toevoegen'}
              </Button>
            </div>
          </form>
        </Form>
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
