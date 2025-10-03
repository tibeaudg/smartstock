import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Scan, Plus, Camera, Package, AlertCircle, ArrowUpDown, Check, ChevronsUpDown, Tag, Truck, X, HelpCircle, Clock, Trash2 } from 'lucide-react';
import { BarcodeScanner } from '@/components/BarcodeScanner';
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
  const { user } = useAuth();
  const { activeBranch, loading: branchLoading } = useBranches();
  const { isMobile, isIOS, isSafari, cameraSupported } = useMobile();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  // Get scanner settings
  const { settings: scannerSettings, onScanSuccess } = useScannerSettings();
  
  const [showScanner, setShowScanner] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transactionType, setTransactionType] = useState<'incoming' | 'outgoing'>('incoming');
  const [scanHistory, setScanHistory] = useState<Array<{barcode: string; name: string; timestamp: Date}>>([]);
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

  // State for categories and suppliers dropdowns
  const [categories, setCategorys] = useState<Array<{ id: string; name: string }>>([]);
  const [suppliers, setSuppliers] = useState<Array<{ id: string; name: string }>>([]);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [supplierOpen, setSupplierOpen] = useState(false);

  const handleBarcodeDetected = async (barcode: string) => {
    setFormData(prev => ({ ...prev, barcode }));
    setShowScanner(false);
    
    // First search for existing products with this barcode
    try {
      const { data: existingProduct, error } = await supabase
        .from('products')
        .select('*')
        .eq('barcode', barcode)
        .eq('branch_id', activeBranch.branch_id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error searching for product:', error);
        toast.error('Error searching for product');
        return;
      }

      if (existingProduct) {
        // Product already exists - show message and fill in data
        toast.success(`Product found: ${existingProduct.name}`);
        
        // Add to scan history
        setScanHistory(prev => {
          const newHistory = [
            { barcode, name: existingProduct.name, timestamp: new Date() },
            ...prev.filter(item => item.barcode !== barcode) // Remove duplicate if exists
          ];
          return newHistory.slice(0, 10); // Keep only last 10 items
        });
        
        // Fill in the form with existing product data
        setFormData(prev => ({
          ...prev,
          name: existingProduct.name,
          description: existingProduct.description || '',
          categoryId: existingProduct.category_id || '',
          supplierId: existingProduct.supplier_id || '',
          categoryName: existingProduct.category_name || '',
          supplierName: existingProduct.supplier_name || '',
          quantityInStock: 1, // Reset to 1 for new transaction
          minimumStockLevel: existingProduct.minimum_stock_level || 10,
          purchasePrice: existingProduct.purchase_price || 0,
          salePrice: existingProduct.sale_price || 0,
          barcode: barcode
        }));
        
        // Set transaction type based on scanner settings or existing stock
        if (scannerSettings.default_transaction_type === 'in') {
          setTransactionType('incoming');
        } else if (scannerSettings.default_transaction_type === 'out') {
          setTransactionType('outgoing');
        } else if (existingProduct.quantity_in_stock > 0) {
          setTransactionType('outgoing'); // Can be both in or out
        } else {
          setTransactionType('incoming'); // Only in if stock is 0
        }
        
        setShowProductForm(true);
      } else {
        // New product
        if (scannerSettings.auto_create_products) {
          // Automatically create product
          toast.info('New product automatically created');
          
          // Create a basic product
          const newProduct = {
            name: `Product ${barcode}`,
            description: 'Automatically created via barcode scanner',
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
          
          // Directly execute the transaction without showing form
          await handleSubmit(new Event('submit') as any, newProduct);
        } else {
          // Show form for manual input
          toast.info('Add new product');
          
          // Reset form for new product
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
          
          // Use scanner settings for default transaction type
          setTransactionType(scannerSettings.default_transaction_type === 'out' ? 'outgoing' : 'incoming');
          setShowProductForm(true);
        }
      }
    } catch (error) {
      console.error('Error searching for product:', error);
      toast.error('Error searching for product');
      
      // Fallback: show form for new product
      setFormData(prev => ({ ...prev, barcode }));
      setTransactionType('incoming');
      setShowProductForm(true);
    }
  };

  // Fetch categories and suppliers on component mount
  useEffect(() => {
    if (user) {
      fetchCategorys();
      fetchSuppliers();
    }
  }, [user]);

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
      toast.error('User or branch not found');
      return;
    }

    // Use productData if available, otherwise formData
    const dataToUse = productData || formData;

    if (transactionType === 'incoming' && !dataToUse.name.trim()) {
      toast.error('Product name is required');
      return;
    }

    setLoading(true);

    try {
      let existingProduct: any = null;
      
      // For outgoing transactions, barcode is required
      if (transactionType === 'outgoing' && !dataToUse.barcode) {
        toast.error('Barcode is required for removing products');
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
            toast.error(`Product with barcode ${dataToUse.barcode} already exists: ${existingProduct.name}`);
            setLoading(false);
            return;
          }
        } else {
          if (transactionType === 'outgoing') {
            toast.error(`Product with barcode ${dataToUse.barcode} does not exist in stock`);
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
          toast.error('This product name already exists in this branch');
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
              toast.error('Error creating supplier');
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
              toast.error('Error creating category');
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
          toast.error(`Error adding product: ${productError.message}`);
          return;
        }

        productId = insertedProduct.id;
        productName = dataToUse.name.trim();
      } else {
        // For outgoing transactions, use existing product
        if (!existingProduct) {
          toast.error('Product not found in stock');
          setLoading(false);
          return;
        }

        // Check if enough stock is available
        if (existingProduct.quantity_in_stock < formData.quantityInStock) {
          toast.error(`Not enough stock available. Current stock: ${existingProduct.quantity_in_stock}`);
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
        user_id: user.id, // Keep user_id for backward compatibility
        created_by: user.id, // New column for relationships
        branch_id: activeBranch.branch_id,
        reference_number: transactionType === 'incoming' ? 'SCANNED_PRODUCT' : 'SCANNED_OUTGOING',
        notes: transactionType === 'incoming' 
          ? `Product added via barcode scanner: ${dataToUse.barcode || 'no barcode'}`
          : `Product removed via barcode scanner: ${dataToUse.barcode || 'no barcode'}`
      };

      const { error: transactionError } = await supabase
        .from('stock_transactions')
        .insert(stockTransactionData);

      if (transactionError) {
        console.error('Error creating stock transaction:', transactionError);
        toast.error(transactionType === 'incoming' 
          ? 'Product created but stock transaction failed'
          : 'Stock transaction failed'
        );
      }

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['productCount', activeBranch.branch_id, user.id] });
      queryClient.invalidateQueries({ queryKey: ['products', activeBranch.branch_id] });
      queryClient.invalidateQueries({ queryKey: ['stockTransactions'] });

      toast.success(transactionType === 'incoming' 
        ? 'Product successfully added!' 
        : 'Product successfully removed from stock!'
      );
      
      // Add to scan history
      if (dataToUse.barcode) {
        setScanHistory(prev => {
          const newHistory = [
            { barcode: dataToUse.barcode, name: productName, timestamp: new Date() },
            ...prev.filter(item => item.barcode !== dataToUse.barcode) // Remove duplicate if exists
          ];
          return newHistory.slice(0, 10); // Keep only last 10 items
        });
      }
      
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
      toast.error('Unexpected error adding product');
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
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!activeBranch) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">No Branch Selected</CardTitle>
            <CardDescription>
              Please select a branch first to be able to scan and add products.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Scanner is now available for all users - no access check needed
  // (Removed subscription access checks since scanner is now in free tier)

  return (
    <div className="container mx-auto px-4 py-4 md:py-8">
      <div className="max-w-4xl mx-auto pb-24">
         {/* Scanner Section */}
         <Card className="mb-6 md:mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Scan className="w-5 h-5 text-blue-600" />
                  Barcode Scanner
                </CardTitle>
                <CardDescription>
                  Use your phone camera to scan barcodes
                </CardDescription>
              </div>
              <Button
                onClick={() => setShowHelpModal(true)}
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-500 hover:text-blue-600"
              >
                <HelpCircle className="w-5 h-5" />
              </Button>
            </div>
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
            </div>
            
            {/* Camera Support Warning */}
            {!cameraSupported && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center text-red-700">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  <span className="text-sm">Camera is not supported on this device/browser</span>
                </div>
              </div>
            )}
            
            {/* iOS Safari Warning */}
            {isMobile && isIOS && !isSafari && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center text-yellow-700">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  <span className="text-sm">For best results on iPhone/iPad, please use Safari browser</span>
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
                {transactionType === 'incoming' ? 'Add New Product' : 'Remove Product from Stock'}
              </CardTitle>
              <CardDescription>
                {transactionType === 'incoming' 
                  ? 'Fill in the product details to add it to your inventory'
                  : 'Scan an existing product to remove it from stock'
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
                    Add
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
                    Remove
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Barcode Display */}
                {formData.barcode && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <Label className="text-sm font-medium text-blue-700">Detected Barcode</Label>
                    <p className="text-lg font-mono text-blue-900">{formData.barcode}</p>
                  </div>
                )}

                {/* Current Stock Info for existing products */}
                {formData.barcode && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <Label className="text-sm font-medium text-green-700">Product Status</Label>
                    <p className="text-sm text-green-700 mt-1">
                      {transactionType === 'incoming' 
                        ? 'New product will be added to inventory'
                        : 'Existing product will be removed from stock'
                      }
                    </p>
                  </div>
                )}

                {/* Product Name */}
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Product Name *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter product name"
                    required
                    disabled={formData.name !== ''} // Disable for existing products
                    className="mt-1"
                  />
                  {formData.name !== '' && (
                    <p className="text-sm text-gray-500 mt-1">
                      Product name cannot be changed for existing products
                    </p>
                  )}
                </div>

                {/* Description - Only show for incoming transactions */}
                {transactionType === 'incoming' && (
                  <div>
                    <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Enter product description"
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
                        Category
                      </Label>
                      <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={categoryOpen}
                            className="w-full justify-between mt-1"
                          >
                            {formData.categoryName ? formData.categoryName : "Select category..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput 
                              placeholder="Search category..." 
                              value={formData.categoryName}
                              onValueChange={(value) => handleInputChange('categoryName', value)}
                            />
                            <CommandList>
                              <CommandEmpty>
                                <div className="p-2 text-center">
                                  <p className="text-sm text-gray-500 mb-2">No category found</p>
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
                                            toast.error('Error creating category');
                                            return;
                                          }
                                          
                                          setCategorys(prev => [...prev, newCategory]);
                                          // Also set the category ID in the form
                                          setFormData(prev => ({ ...prev, categoryId: newCategory.id }));
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
                                    Add "{formData.categoryName}"
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
                        Supplier
                      </Label>
                      <Popover open={supplierOpen} onOpenChange={setSupplierOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={supplierOpen}
                            className="w-full justify-between mt-1"
                          >
                            {formData.supplierName ? formData.supplierName : "Select supplier..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput 
                              placeholder="Search supplier..." 
                              value={formData.supplierName}
                              onValueChange={(value) => handleInputChange('supplierName', value)}
                            />
                            <CommandList>
                              <CommandEmpty>
                                <div className="p-2 text-center">
                                  <p className="text-sm text-gray-500 mb-2">No supplier found</p>
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
                                            toast.error('Error creating supplier');
                                            return;
                                          }
                                          
                                          setSuppliers(prev => [...prev, newSupplier]);
                                          // Also set the supplier ID in the form
                                          setFormData(prev => ({ ...prev, supplierId: newSupplier.id }));
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
                                    Add "{formData.supplierName}"
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
                      Quantity *
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
                        Minimum Stock
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
                        Purchase Price ($)
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
                        Sale Price ($)
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
                        {transactionType === 'incoming' ? 'Adding Product...' : 'Removing Product...'}
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        {transactionType === 'incoming' ? 'Add Product' : 'Remove Product'}
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
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Scan History */}
        <Card className="mt-6 md:mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Scan History
            </CardTitle>
            <CardDescription>
              Recently scanned barcodes (last 10 items)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {scanHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">No items scanned yet</p>
                <p className="text-xs mt-1">Scanned items will appear here</p>
              </div>
            ) : (
              <div className="space-y-2">
                {scanHistory.map((item, index) => (
                  <div 
                    key={`${item.barcode}-${index}`}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500 font-mono">{item.barcode}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setScanHistory(prev => prev.filter((_, i) => i !== index));
                        toast.success('Item removed from history');
                      }}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {scanHistory.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setScanHistory([]);
                      toast.success('History cleared');
                    }}
                    className="w-full mt-2"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All History
                  </Button>
                )}
              </div>
            )}
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

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                  How does it work?
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHelpModal(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <p>Click "Start Scanner" and grant access to your camera</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <p>Point your camera at a barcode</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <p>Choose between "Add" (new product) or "Remove" (existing product)</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                    4
                  </div>
                  <p>Fill in the required information and click the corresponding button</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                    5
                  </div>
                  <p>The product will be added to or removed from your inventory</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

