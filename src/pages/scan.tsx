import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Scan, Plus, Camera, Package, AlertCircle, ArrowUpDown } from 'lucide-react';
import { BarcodeScanner } from '@/components/BarcodeScanner';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

interface ProductFormData {
  name: string;
  description: string;
  categoryName: string;
  supplierName: string;
  quantityInStock: number;
  minimumStockLevel: number;
  purchasePrice: number;
  salePrice: number;
  barcode: string;
}

export default function ScanPage() {
  const { user } = useAuth();
  const { activeBranch, loading: branchLoading } = useBranches();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  const [showScanner, setShowScanner] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transactionType, setTransactionType] = useState<'incoming' | 'outgoing'>('incoming');
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    categoryName: '',
    supplierName: '',
    quantityInStock: 1,
    minimumStockLevel: 10,
    purchasePrice: 0,
    salePrice: 0,
    barcode: '',
  });

  const handleBarcodeDetected = (barcode: string) => {
    setFormData(prev => ({ ...prev, barcode }));
    setTransactionType('incoming'); // Reset to incoming for new barcodes
    setShowScanner(false);
    setShowProductForm(true);
    toast.success(`Barcode gedetecteerd: ${barcode}`);
  };

  const handleInputChange = (field: keyof ProductFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !activeBranch) {
      toast.error('Gebruiker of filiaal niet gevonden');
      return;
    }

    if (transactionType === 'incoming' && !formData.name.trim()) {
      toast.error('Product naam is verplicht');
      return;
    }

    setLoading(true);

    try {
      let existingProduct: any = null;
      
      // For outgoing transactions, barcode is required
      if (transactionType === 'outgoing' && !formData.barcode) {
        toast.error('Barcode is verplicht voor het verwijderen van producten');
        setLoading(false);
        return;
      }

      // Check if product with this barcode already exists
      if (formData.barcode) {
        const { data: productData } = await supabase
          .from('products')
          .select('id, name, quantity_in_stock')
          .eq('barcode', formData.barcode)
          .eq('branch_id', activeBranch.branch_id)
          .single();

        existingProduct = productData;

        if (existingProduct) {
          if (transactionType === 'incoming') {
            toast.error(`Product met barcode ${formData.barcode} bestaat al: ${existingProduct.name}`);
            setLoading(false);
            return;
          }
        } else {
          if (transactionType === 'outgoing') {
            toast.error(`Product met barcode ${formData.barcode} bestaat niet in de voorraad`);
            setLoading(false);
            return;
          }
        }
      }

      let productId: string;
      let productName: string;

      if (transactionType === 'incoming') {
        // Check if product name already exists in this branch
        const { data: duplicateName } = await supabase
          .from('products')
          .select('id')
          .eq('name', formData.name.trim())
          .eq('branch_id', activeBranch.branch_id)
          .single();

        if (duplicateName) {
          toast.error('Deze productnaam bestaat al in dit filiaal');
          setLoading(false);
          return;
        }

        // Insert new product
        const productData = {
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          category_name: formData.categoryName.trim() || null,
          supplier_name: formData.supplierName.trim() || null,
          quantity_in_stock: formData.quantityInStock,
          minimum_stock_level: formData.minimumStockLevel,
          purchase_price: formData.purchasePrice,
          sale_price: formData.salePrice,
          barcode: formData.barcode || null,
          branch_id: activeBranch.branch_id
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

        productId = insertedProduct.id;
        productName = formData.name.trim();
      } else {
        // For outgoing transactions, use existing product
        if (!existingProduct) {
          toast.error('Product niet gevonden in de voorraad');
          setLoading(false);
          return;
        }

        // Check if enough stock is available
        if (existingProduct.quantity_in_stock < formData.quantityInStock) {
          toast.error(`Niet genoeg voorraad beschikbaar. Huidige voorraad: ${existingProduct.quantity_in_stock}`);
          setLoading(false);
          return;
        }

        productId = existingProduct.id;
        productName = existingProduct.name;
      }

      // Create stock transaction
      const stockTransactionData = {
        product_id: productId,
        product_name: productName,
        transaction_type: transactionType,
        quantity: formData.quantityInStock,
        unit_price: transactionType === 'incoming' ? formData.purchasePrice : formData.salePrice,
        created_by: user.id,
        branch_id: activeBranch.branch_id,
        reference_number: transactionType === 'incoming' ? 'SCANNED_PRODUCT' : 'SCANNED_OUTGOING',
        notes: transactionType === 'incoming' 
          ? `Product toegevoegd via barcode scanner: ${formData.barcode || 'geen barcode'}`
          : `Product verwijderd via barcode scanner: ${formData.barcode || 'geen barcode'}`
      };

      const { error: transactionError } = await supabase
        .from('stock_transactions')
        .insert(stockTransactionData);

      if (transactionError) {
        console.error('Error creating stock transaction:', transactionError);
        toast.error(transactionType === 'incoming' 
          ? 'Product aangemaakt maar voorraad transactie mislukt'
          : 'Voorraad transactie mislukt'
        );
      }

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['productCount', activeBranch.branch_id, user.id] });
      queryClient.invalidateQueries({ queryKey: ['products', activeBranch.branch_id] });

      toast.success(transactionType === 'incoming' 
        ? 'Product succesvol toegevoegd!' 
        : 'Product succesvol uit voorraad gehaald!'
      );
      
      // Reset form and navigate to stock page
      setFormData({
        name: '',
        description: '',
        categoryName: '',
        supplierName: '',
        quantityInStock: 1,
        minimumStockLevel: 10,
        purchasePrice: 0,
        salePrice: 0,
        barcode: '',
      });
      setShowProductForm(false);
      
      // Navigate to stock page
      navigate('/dashboard/stock');
      
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Onverwachte fout bij het toevoegen van product');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      categoryName: '',
      supplierName: '',
      quantityInStock: 1,
      minimumStockLevel: 10,
      purchasePrice: 0,
      salePrice: 0,
      barcode: '',
    });
    setTransactionType('incoming');
    setShowProductForm(false);
  };

  if (!user || branchLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Laden...</p>
        </div>
      </div>
    );
  }

  if (!activeBranch) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Geen filiaal geselecteerd</CardTitle>
            <CardDescription>
              Selecteer eerst een filiaal om producten te kunnen scannen en toevoegen.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/dashboard')}>
              Ga naar Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4 md:py-8">
      <div className="max-w-4xl mx-auto pb-24">
         {/* Scanner Section */}
         <Card className="mb-6 md:mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scan className="w-5 h-5 text-blue-600" />
              Barcode Scanner
            </CardTitle>
            <CardDescription>
              Gebruik je telefooncamera om barcodes te scannen of voer handmatig in
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 ">
              <Button
                onClick={() => setShowScanner(true)}
                className="flex-1 p-2"
                size="lg"
              >
                <Camera className="w-5 h-5 mr-2" />
                Start Scanner
              </Button>
              <Button
                onClick={() => setShowProductForm(true)}
                variant="outline"
                className="flex-1 p-2"
                size="lg"
              >
                <Plus className="w-5 h-5 mr-2 " />
                Handmatig Toevoegen
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Product Form */}
        {showProductForm && (
          <Card>
                         <CardHeader>
               <CardTitle className="flex items-center gap-2">
                 <Package className="w-5 h-5 text-green-600" />
                 {transactionType === 'incoming' ? 'Nieuw Product Toevoegen' : 'Product Uit Voorraad Halen'}
               </CardTitle>
               <CardDescription>
                 {transactionType === 'incoming' 
                   ? 'Vul de productgegevens in om het product toe te voegen aan je voorraad'
                   : 'Scan een bestaand product om het uit de voorraad te halen'
                 }
               </CardDescription>
               
               {/* Transaction Type Switcher */}
               <div className="flex items-center justify-center mt-4">
                 <div className="bg-gray-100 rounded-lg p-1 flex items-center w-full max-w-xs">
                   <button
                     type="button"
                     onClick={() => setTransactionType('incoming')}
                     className={`flex-1 px-3 py-2 rounded-md text-xs md:text-sm font-medium transition-colors ${
                       transactionType === 'incoming'
                         ? 'bg-white text-blue-600 shadow-sm'
                         : 'text-gray-500 hover:text-gray-700'
                     }`}
                   >
                     <ArrowUpDown className="w-3 h-3 md:w-4 md:h-4 inline mr-1 md:mr-2" />
                     Toevoegen
                   </button>
                   <button
                     type="button"
                     onClick={() => setTransactionType('outgoing')}
                     className={`flex-1 px-3 py-2 rounded-md text-xs md:text-sm font-medium transition-colors ${
                       transactionType === 'outgoing'
                         ? 'bg-white text-red-600 shadow-sm'
                         : 'text-gray-500 hover:text-gray-700'
                       }`}
                   >
                     <ArrowUpDown className="w-3 h-3 md:w-4 md:h-4 inline mr-1 md:mr-2 rotate-180" />
                     Verwijderen
                   </button>
                 </div>
               </div>
             </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Barcode Display */}
                {formData.barcode && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <Label className="text-sm font-medium text-blue-700">Gedetecteerde Barcode</Label>
                    <p className="text-lg font-mono text-blue-900">{formData.barcode}</p>
                  </div>
                )}

                {/* Product Name */}
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Product Naam *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Voer product naam in"
                    required
                    className="mt-1"
                  />
                </div>

                                 {/* Description - Only show for incoming transactions */}
                 {transactionType === 'incoming' && (
                   <div>
                     <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                       Beschrijving
                     </Label>
                     <Textarea
                       id="description"
                       value={formData.description}
                       onChange={(e) => handleInputChange('description', e.target.value)}
                       placeholder="Voer product beschrijving in"
                       rows={3}
                       className="mt-1"
                     />
                   </div>
                 )}

                 {/* Category and Supplier - Only show for incoming transactions */}
                 {transactionType === 'incoming' && (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                         Categorie
                       </Label>
                       <Input
                         id="category"
                         type="text"
                         value={formData.categoryName}
                         onChange={(e) => handleInputChange('categoryName', e.target.value)}
                         placeholder="Bijv. Elektronica, Voeding"
                         className="mt-1"
                       />
                     </div>
                     <div>
                       <Label htmlFor="supplier" className="text-sm font-medium text-gray-700">
                         Leverancier
                       </Label>
                       <Input
                         id="supplier"
                         type="text"
                         value={formData.supplierName}
                         onChange={(e) => handleInputChange('supplierName', e.target.value)}
                         placeholder="Naam van leverancier"
                         className="mt-1"
                       />
                     </div>
                   </div>
                 )}

                                 {/* Stock and Pricing */}
                 <div className={`grid gap-4 ${transactionType === 'incoming' ? 'grid-cols-1 md:grid-cols-4' : 'grid-cols-1 md:grid-cols-2'}`}>
                   <div>
                     <Label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                       Aantal *
                     </Label>
                     <Input
                       id="quantity"
                       type="number"
                       min="1"
                       value={formData.quantityInStock}
                       onChange={(e) => handleInputChange('quantityInStock', parseInt(e.target.value) || 1)}
                       required
                       className="mt-1"
                     />
                   </div>
                   
                   {transactionType === 'incoming' && (
                     <div>
                       <Label htmlFor="minStock" className="text-sm font-medium text-gray-700">
                         Minimale Voorraad
                       </Label>
                       <Input
                         id="minStock"
                         type="number"
                         min="0"
                         value={formData.minimumStockLevel}
                         onChange={(e) => handleInputChange('minimumStockLevel', parseInt(e.target.value) || 0)}
                         className="mt-1"
                       />
                     </div>
                   )}
                   
                   {transactionType === 'incoming' && (
                     <div>
                       <Label htmlFor="purchasePrice" className="text-sm font-medium text-gray-700">
                         Inkoopprijs (€)
                       </Label>
                       <Input
                         id="purchasePrice"
                         type="number"
                         min="0"
                         step="0.01"
                         value={formData.purchasePrice}
                         onChange={(e) => handleInputChange('purchasePrice', parseFloat(e.target.value) || 0)}
                         className="mt-1"
                       />
                     </div>
                   )}
                   
                   {transactionType === 'incoming' && (
                     <div>
                       <Label htmlFor="salePrice" className="text-sm font-medium text-gray-700">
                         Verkoopprijs (€)
                       </Label>
                       <Input
                         id="salePrice"
                         type="number"
                         min="0"
                         step="0.01"
                         value={formData.salePrice}
                         onChange={(e) => handleInputChange('salePrice', parseFloat(e.target.value) || 0)}
                         className="mt-1"
                       />
                     </div>
                   )}
                 </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                     <Button
                     type="submit"
                     disabled={loading}
                     className="flex-1"
                     size="lg"
                   >
                     {loading ? (
                       <>
                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                         {transactionType === 'incoming' ? 'Product Toevoegen...' : 'Product Verwijderen...'}
                       </>
                     ) : (
                       <>
                         <Plus className="w-4 h-4 mr-2" />
                         {transactionType === 'incoming' ? 'Product Toevoegen' : 'Product Verwijderen'}
                       </>
                     )}
                   </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    disabled={loading}
                    className="flex-1"
                    size="lg"
                  >
                    Annuleren
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

                 {/* Instructions */}
         <Card className="mt-6 md:mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              Hoe werkt het?
            </CardTitle>
          </CardHeader>
                              <CardContent>
             <div className="space-y-2 md:space-y-3 text-xs md:text-sm text-gray-600">
             <div className="flex items-start gap-3">
               <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                 1
               </div>
               <p>Klik op "Start Scanner" en geef toegang tot je camera</p>
             </div>
             <div className="flex items-start gap-3">
               <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                 2
               </div>
               <p>Richt je camera op een barcode of voer handmatig in</p>
             </div>
             <div className="flex items-start gap-3">
               <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                 3
               </div>
               <p>Kies tussen "Toevoegen" (nieuw product) of "Verwijderen" (bestaand product)</p>
             </div>
             <div className="flex items-start gap-3">
               <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                 4
               </div>
               <p>Vul de benodigde gegevens in en klik op de bijbehorende knop</p>
             </div>
             <div className="flex items-start gap-3">
               <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                 5
               </div>
               <p>Het product wordt toegevoegd aan of verwijderd uit je voorraad</p>
             </div>
           </div>
         </CardContent>
        </Card>
      </div>

      {/* Barcode Scanner Modal */}
      {showScanner && (
        <BarcodeScanner
          onBarcodeDetected={handleBarcodeDetected}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
}
