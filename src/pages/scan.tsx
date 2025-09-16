import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Scan, Plus, Camera, Package, AlertCircle, ArrowUpDown, Check, ChevronsUpDown, Tag, Truck, X } from 'lucide-react';
import { BarcodeScanner } from '@/components/BarcodeScanner';
import { CameraDebugInfo } from '@/components/CameraDebugInfo';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { useMobile } from '@/hooks/use-mobile';
import { useScannerSettings } from '@/hooks/useScannerSettings';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface ProductFormData {
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
  barcode: string;
}

export default function ScanPage() {
  const { user, userProfile } = useAuth();
  const { activeBranch, loading: branchLoading } = useBranches();
  const { isMobile, isIOS, isSafari, cameraSupported } = useMobile();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  // Check if user is owner (using is_owner field from profiles table)
  const isOwner = userProfile && userProfile.is_owner === true && !userProfile.blocked;
  
  
  // Get scanner settings
  const { settings: scannerSettings, onScanSuccess } = useScannerSettings();
  
  const [showScanner, setShowScanner] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transactionType, setTransactionType] = useState<'incoming' | 'outgoing'>('incoming');
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    categoryId: '',
    supplierId: '',
    categoryName: '',
    supplierName: '',
    quantityInStock: 1,
    minimumStockLevel: 10,
    purchasePrice: 0,
    salePrice: 0,
    barcode: '',
  });

  // State voor categorieën en leveranciers dropdowns
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [suppliers, setSuppliers] = useState<Array<{ id: string; name: string }>>([]);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [supplierOpen, setSupplierOpen] = useState(false);

  const handleBarcodeDetected = async (barcode: string) => {
    setFormData(prev => ({ ...prev, barcode }));
    setShowScanner(false);
    
    // Zoek eerst naar bestaande producten met deze barcode
    try {
      const { data: existingProduct, error } = await supabase
        .from('products')
        .select('*')
        .eq('barcode', barcode)
        .eq('branch_id', activeBranch.branch_id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error searching for product:', error);
        toast.error('Fout bij het zoeken naar product');
        return;
      }

      if (existingProduct) {
        // Product bestaat al - toon melding en vul gegevens in
        toast.success(`Product gevonden: ${existingProduct.name}`);
        
        // Vul de form in met bestaande productgegevens
        setFormData(prev => ({
          ...prev,
          name: existingProduct.name,
          description: existingProduct.description || '',
          categoryId: existingProduct.category_id || '',
          supplierId: existingProduct.supplier_id || '',
          categoryName: existingProduct.category_name || '',
          supplierName: existingProduct.supplier_name || '',
          quantityInStock: 1, // Reset naar 1 voor nieuwe transactie
          minimumStockLevel: existingProduct.minimum_stock_level || 10,
          purchasePrice: existingProduct.purchase_price || 0,
          salePrice: existingProduct.sale_price || 0,
          barcode: barcode
        }));
        
        // Stel transaction type in op basis van scanner instellingen of bestaande voorraad
        if (scannerSettings.default_transaction_type === 'in') {
          setTransactionType('incoming');
        } else if (scannerSettings.default_transaction_type === 'out') {
          setTransactionType('outgoing');
        } else if (existingProduct.quantity_in_stock > 0) {
          setTransactionType('outgoing'); // Kan zowel in als uit
        } else {
          setTransactionType('incoming'); // Alleen in als voorraad 0 is
        }
        
        setShowProductForm(true);
      } else {
        // Nieuw product
        if (scannerSettings.auto_create_products) {
          // Automatisch product aanmaken
          toast.info('Nieuw product automatisch aangemaakt');
          
          // Maak een basis product aan
          const newProduct = {
            name: `Product ${barcode}`,
            description: 'Automatisch aangemaakt via barcode scanner',
            categoryId: categories.length > 0 ? categories[0].id : '',
            supplierId: suppliers.length > 0 ? suppliers[0].id : '',
            categoryName: categories.length > 0 ? categories[0].name : '',
            supplierName: suppliers.length > 0 ? suppliers[0].name : '',
            quantityInStock: 1,
            minimumStockLevel: 10,
            purchasePrice: 0,
            salePrice: 0,
            barcode: barcode
          };
          
          setFormData(newProduct);
          setTransactionType(scannerSettings.default_transaction_type === 'out' ? 'outgoing' : 'incoming');
          
          // Direct de transactie uitvoeren zonder form te tonen
          await handleSubmit(new Event('submit') as any, newProduct);
        } else {
          // Toon form voor handmatige invoer
          toast.info('Nieuw product toevoegen');
          
          // Reset form voor nieuw product
          setFormData(prev => ({
            ...prev,
            name: '',
            description: '',
            categoryId: '',
            supplierId: '',
            categoryName: '',
            supplierName: '',
            quantityInStock: 1,
            minimumStockLevel: 10,
            purchasePrice: 0,
            salePrice: 0,
            barcode: barcode
          }));
          
          // Gebruik scanner instellingen voor default transaction type
          setTransactionType(scannerSettings.default_transaction_type === 'out' ? 'outgoing' : 'incoming');
          setShowProductForm(true);
        }
      }
    } catch (error) {
      console.error('Error searching for product:', error);
      toast.error('Fout bij het zoeken naar product');
      
      // Fallback: toon form voor nieuw product
      setFormData(prev => ({ ...prev, barcode }));
      setTransactionType('incoming');
      setShowProductForm(true);
    }
  };

  // Haal categorieën en leveranciers op bij component mount
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

  const handleInputChange = (field: keyof ProductFormData, value: string | number) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // If changing category name, also update category ID
      if (field === 'categoryName') {
        const category = categories.find(cat => cat.name === value);
        newData.categoryId = category?.id || '';
      }
      
      // If changing supplier name, also update supplier ID
      if (field === 'supplierName') {
        const supplier = suppliers.find(sup => sup.name === value);
        newData.supplierId = supplier?.id || '';
      }
      
      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent, productData?: any) => {
    e.preventDefault();
    
    if (!user || !activeBranch) {
      toast.error('Gebruiker of filiaal niet gevonden');
      return;
    }

    // Gebruik productData als die beschikbaar is, anders formData
    const dataToUse = productData || formData;

    if (transactionType === 'incoming' && !dataToUse.name.trim()) {
      toast.error('Product naam is verplicht');
      return;
    }

    setLoading(true);

    try {
      let existingProduct: any = null;
      
      // For outgoing transactions, barcode is required
      if (transactionType === 'outgoing' && !dataToUse.barcode) {
        toast.error('Barcode is verplicht voor het verwijderen van producten');
        setLoading(false);
        return;
      }

      // Check if product with this barcode already exists
      if (dataToUse.barcode) {
        const { data: productData } = await supabase
          .from('products')
          .select('id, name, quantity_in_stock')
          .eq('barcode', dataToUse.barcode)
          .eq('branch_id', activeBranch.branch_id)
          .single();

        existingProduct = productData;

        if (existingProduct) {
          if (transactionType === 'incoming') {
            toast.error(`Product met barcode ${dataToUse.barcode} bestaat al: ${existingProduct.name}`);
            setLoading(false);
            return;
          }
        } else {
          if (transactionType === 'outgoing') {
            toast.error(`Product met barcode ${dataToUse.barcode} bestaat niet in de voorraad`);
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
          .eq('name', dataToUse.name.trim())
          .eq('branch_id', activeBranch.branch_id)
          .single();

        if (duplicateName) {
          toast.error('Deze productnaam bestaat al in dit filiaal');
          setLoading(false);
          return;
        }

        // Handle supplier
        let supplierId = null;
        if (formData.supplierName.trim()) {
          const { data: existingSupplier } = await supabase
            .from('suppliers')
            .select('id')
            .eq('name', formData.supplierName.trim())
            .single();

          if (existingSupplier) {
            supplierId = existingSupplier.id;
          } else {
            const { data: newSupplier, error: supplierError } = await supabase
              .from('suppliers')
              .insert({ name: formData.supplierName.trim() })
              .select('id')
              .single();

            if (supplierError) {
              console.error('Error creating supplier:', supplierError);
              toast.error('Fout bij het aanmaken van leverancier');
              setLoading(false);
              return;
            }
            supplierId = newSupplier.id;
          }
        }

        // Handle category
        let categoryId = null;
        if (formData.categoryName.trim()) {
          const { data: existingCategory } = await supabase
            .from('categories')
            .select('id')
            .eq('name', formData.categoryName.trim())
            .eq('user_id', user.id)
            .single();

          if (existingCategory) {
            categoryId = existingCategory.id;
          } else {
            const { data: newCategory, error: categoryError } = await supabase
              .from('categories')
              .insert({ name: formData.categoryName.trim(), user_id: user.id })
              .select('id')
              .single();

            if (categoryError) {
              console.error('Error creating category:', categoryError);
              toast.error('Fout bij het aanmaken van categorie');
              setLoading(false);
              return;
            }
            categoryId = newCategory.id;
          }
        }

        // Insert new product
        const productData = {
          name: dataToUse.name.trim(),
          description: dataToUse.description.trim() || null,
          category_id: categoryId,
          supplier_id: supplierId,
          quantity_in_stock: formData.quantityInStock,
          minimum_stock_level: formData.minimumStockLevel,
          purchase_price: formData.purchasePrice,
          sale_price: formData.salePrice,
          barcode: dataToUse.barcode || null,
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
        productName = dataToUse.name.trim();
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
        transaction_type: transactionType === 'incoming' ? 'incoming' : 'outgoing',
        quantity: formData.quantityInStock,
        unit_price: transactionType === 'incoming' ? formData.purchasePrice : formData.salePrice,
        user_id: user.id, // Behoud user_id voor backward compatibility
        created_by: user.id, // Nieuwe kolom voor relaties
        branch_id: activeBranch.branch_id,
        reference_number: transactionType === 'incoming' ? 'SCANNED_PRODUCT' : 'SCANNED_OUTGOING',
        notes: transactionType === 'incoming' 
          ? `Product toegevoegd via barcode scanner: ${dataToUse.barcode || 'geen barcode'}`
          : `Product verwijderd via barcode scanner: ${dataToUse.barcode || 'geen barcode'}`
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
      queryClient.invalidateQueries({ queryKey: ['stockTransactions'] });

      toast.success(transactionType === 'incoming' 
        ? 'Product succesvol toegevoegd!' 
        : 'Product succesvol uit voorraad gehaald!'
      );
      
      // Reset form and navigate to stock page
      setFormData({
        name: '',
        description: '',
        categoryId: '',
        supplierId: '',
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
      categoryId: '',
      supplierId: '',
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
    setCategoryOpen(false);
    setSupplierOpen(false);
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

  // Show loading state while checking module access (with timeout)
  if (scannerAccessLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Module toegang controleren...</p>
            {scannerAccessError && (
              <p className="text-red-600 text-sm mt-2">
                Fout bij controleren module toegang. Probeer de pagina te verversen.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Show module access required message if user doesn't have access
  if (!scannerAccess?.hasAccess) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600">
              <AlertCircle className="w-5 h-5" />
              Module Toegang Vereist
            </CardTitle>
            <CardDescription>
              Je hebt geen toegang tot de Barcode Scanner module. Koop deze module om barcodes te kunnen scannen.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-600">
                De Barcode Scanner module biedt de volgende functionaliteiten:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Barcode scanner met camera</li>
                <li>Automatische product detectie</li>
                <li>Snelle voorraad updates</li>
                <li>Inkomende en uitgaande transacties</li>
                <li>Product informatie automatisch invullen</li>
              </ul>
              <div className="flex gap-4">
                <Button onClick={() => navigate('/modules')}>
                  Bekijk Modules
                </Button>
                <Button variant="outline" onClick={() => navigate('/dashboard')}>
                  Terug naar Dashboard
                </Button>
              </div>
            </div>
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
              Gebruik je telefooncamera om barcodes te scannen
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => setShowScanner(true)}
                className="flex-1 h-12 px-4 p-2"
                size="lg"
                disabled={!cameraSupported}
              >
                <Camera className="w-5 h-5 mr-2" />
                Start Scanner
              </Button>
              
              {isOwner && (
                <Button
                  onClick={() => setShowDebugInfo(true)}
                  variant="outline"
                  className="flex-1 h-12 px-4 p-2"
                  size="lg"
                >
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Debug Info
                </Button>
              )}
            </div>
            
            {/* Camera Support Warning */}
            {!cameraSupported && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center text-red-700">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  <span className="text-sm">Camera wordt niet ondersteund op dit apparaat/browser</span>
                </div>
              </div>
            )}
            
            {/* iOS Safari Warning */}
            {isMobile && isIOS && !isSafari && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center text-yellow-700">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  <span className="text-sm">Voor beste resultaten op iPhone/iPad, gebruik Safari browser</span>
                </div>
              </div>
            )}
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

                {/* Huidige Voorraad Info voor bestaande producten */}
                {formData.barcode && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <Label className="text-sm font-medium text-green-700">Product Status</Label>
                    <p className="text-sm text-green-700 mt-1">
                      {transactionType === 'incoming' 
                        ? 'Nieuw product wordt toegevoegd aan de voorraad'
                        : 'Bestaand product wordt uit de voorraad gehaald'
                      }
                    </p>
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
                    disabled={formData.name !== ''} // Uitschakelen voor bestaande producten
                    className="mt-1"
                  />
                  {formData.name !== '' && (
                    <p className="text-sm text-gray-500 mt-1">
                      Product naam kan niet worden gewijzigd voor bestaande producten
                    </p>
                  )}
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
                       <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                         <PopoverTrigger asChild>
                           <Button
                             variant="outline"
                             role="combobox"
                             aria-expanded={categoryOpen}
                             className="w-full justify-between mt-1"
                           >
                             {formData.categoryName ? formData.categoryName : "Selecteer categorie..."}
                             <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                           </Button>
                         </PopoverTrigger>
                         <PopoverContent className="w-full p-0">
                           <Command>
                             <CommandInput 
                               placeholder="Categorie zoeken..." 
                               value={formData.categoryName}
                               onValueChange={(value) => handleInputChange('categoryName', value)}
                             />
                             <CommandList>
                               <CommandEmpty>
                                 <div className="p-2 text-center">
                                   <p className="text-sm text-gray-500 mb-2">Geen categorie gevonden</p>
                                   <Button
                                     variant="outline"
                                     size="sm"
                                     onClick={async () => {
                                       if (formData.categoryName.trim()) {
                                         try {
                                           const { data: newCategory, error } = await supabase
                                             .from('categories')
                                             .insert({ name: formData.categoryName.trim(), user_id: user.id })
                                             .select('id, name')
                                             .single();
                                           
                                           if (error) {
                                             toast.error('Fout bij het aanmaken van categorie');
                                             return;
                                           }
                                           
                                           setCategories(prev => [...prev, newCategory]);
                                           // Also set the category ID in the form
                                           setFormData(prev => ({ ...prev, categoryId: newCategory.id }));
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
                                     "{formData.categoryName}" toevoegen
                                   </Button>
                                 </div>
                               </CommandEmpty>
                               <CommandGroup>
                                 {categories.map((category) => (
                                   <CommandItem
                                     key={category.id}
                                     value={category.name}
                                     onSelect={() => {
                                       handleInputChange('categoryName', category.name);
                                       setCategoryOpen(false);
                                     }}
                                   >
                                     <Check
                                       className={cn(
                                         "mr-2 h-4 w-4",
                                         formData.categoryName === category.name ? "opacity-100" : "opacity-0"
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
                       <Label htmlFor="supplier" className="text-sm font-medium text-gray-700">
                         Leverancier
                       </Label>
                       <Popover open={supplierOpen} onOpenChange={setSupplierOpen}>
                         <PopoverTrigger asChild>
                           <Button
                             variant="outline"
                             role="combobox"
                             aria-expanded={supplierOpen}
                             className="w-full justify-between mt-1"
                           >
                             {formData.supplierName ? formData.supplierName : "Selecteer leverancier..."}
                             <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                           </Button>
                         </PopoverTrigger>
                         <PopoverContent className="w-full p-0">
                           <Command>
                             <CommandInput 
                               placeholder="Leverancier zoeken..." 
                               value={formData.supplierName}
                               onValueChange={(value) => handleInputChange('supplierName', value)}
                             />
                             <CommandList>
                               <CommandEmpty>
                                 <div className="p-2 text-center">
                                   <p className="text-sm text-gray-500 mb-2">Geen leverancier gevonden</p>
                                   <Button
                                     variant="outline"
                                     size="sm"
                                     onClick={async () => {
                                       if (formData.supplierName.trim()) {
                                         try {
                                           const { data: newSupplier, error } = await supabase
                                             .from('suppliers')
                                             .insert({ name: formData.supplierName.trim() })
                                             .select('id, name')
                                             .single();
                                           
                                           if (error) {
                                             toast.error('Fout bij het aanmaken van leverancier');
                                             return;
                                           }
                                           
                                           setSuppliers(prev => [...prev, newSupplier]);
                                           // Also set the supplier ID in the form
                                           setFormData(prev => ({ ...prev, supplierId: newSupplier.id }));
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
                                     "{formData.supplierName}" toevoegen
                                   </Button>
                                 </div>
                               </CommandEmpty>
                               <CommandGroup>
                                 {suppliers.map((supplier) => (
                                   <CommandItem
                                     key={supplier.id}
                                     value={supplier.name}
                                     onSelect={() => {
                                       handleInputChange('supplierName', supplier.name);
                                       setSupplierOpen(false);
                                     }}
                                   >
                                     <Check
                                       className={cn(
                                         "mr-2 h-4 w-4",
                                         formData.supplierName === supplier.name ? "opacity-100" : "opacity-0"
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
                     className="flex-1 h-12 px-4"
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
                    className="flex-1 h-12 px-4"
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
               <p>Richt je camera op een barcode</p>
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
          onScanSuccess={onScanSuccess}
          settings={scannerSettings}
        />
      )}

      {/* Debug Info Modal - Only for owners */}
      {isOwner && showDebugInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Camera Debug Informatie</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDebugInfo(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CameraDebugInfo />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
