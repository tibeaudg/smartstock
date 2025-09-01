import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Scan, Plus, Camera, Package, AlertCircle } from 'lucide-react';
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

    if (!formData.name.trim()) {
      toast.error('Product naam is verplicht');
      return;
    }

    setLoading(true);

    try {
      // Check if product with this barcode already exists
      if (formData.barcode) {
        const { data: existingProduct } = await supabase
          .from('products')
          .select('id, name')
          .eq('barcode', formData.barcode)
          .eq('branch_id', activeBranch.branch_id)
          .single();

        if (existingProduct) {
          toast.error(`Product met barcode ${formData.barcode} bestaat al: ${existingProduct.name}`);
          setLoading(false);
          return;
        }
      }

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

      // Insert product
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
        branch_id: activeBranch.branch_id,
        created_by: user.id,
        status: 'active'
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

      // Create initial stock transaction
      const stockTransactionData = {
        product_id: insertedProduct.id,
        product_name: formData.name.trim(),
        transaction_type: 'incoming' as const,
        quantity: formData.quantityInStock,
        unit_price: formData.purchasePrice,
        created_by: user.id,
        branch_id: activeBranch.branch_id,
        reference_number: 'SCANNED_PRODUCT',
        notes: `Product toegevoegd via barcode scanner: ${formData.barcode || 'geen barcode'}`
      };

      const { error: transactionError } = await supabase
        .from('stock_transactions')
        .insert(stockTransactionData);

      if (transactionError) {
        console.error('Error creating initial stock transaction:', transactionError);
        toast.error('Product aangemaakt maar voorraad transactie mislukt');
      }

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['productCount', activeBranch.branch_id, user.id] });
      queryClient.invalidateQueries({ queryKey: ['products', activeBranch.branch_id] });

      toast.success('Product succesvol toegevoegd!');
      
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
      
      // Navigate to stock page to see the new product
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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Scannen</h1>
          <p className="text-gray-600">
            Scan barcodes of voer handmatig in om nieuwe producten toe te voegen aan {activeBranch.branch_name}
          </p>
        </div>

        {/* Scanner Section */}
        <Card className="mb-8">
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
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => setShowScanner(true)}
                className="flex-1"
                size="lg"
              >
                <Camera className="w-5 h-5 mr-2" />
                Start Scanner
              </Button>
              <Button
                onClick={() => setShowProductForm(true)}
                variant="outline"
                className="flex-1"
                size="lg"
              >
                <Plus className="w-5 h-5 mr-2" />
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
                Nieuw Product Toevoegen
              </CardTitle>
              <CardDescription>
                Vul de productgegevens in om het product toe te voegen aan je voorraad
              </CardDescription>
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

                {/* Description */}
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

                {/* Category and Supplier */}
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

                {/* Stock and Pricing */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                      Voorraad *
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
                        Product Toevoegen...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Product Toevoegen
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
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              Hoe werkt het?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-gray-600">
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
                <p>Vul de productgegevens in en klik op "Product Toevoegen"</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                  4
                </div>
                <p>Het product wordt toegevoegd aan je voorraad en je wordt doorgestuurd naar de productenlijst</p>
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
