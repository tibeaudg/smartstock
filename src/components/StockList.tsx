import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Minus, Plus, Trash2 } from 'lucide-react';
import { EditProductModal } from './EditProductModal';
import { AddProductModal } from './AddProductModal';
import { ProductFilters } from './ProductFilters';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  description: string | null;
  quantity_in_stock: number;
  minimum_stock_level: number;
  unit_price: number;
  status: string | null;
  category_name: string | null;
  supplier_name: string | null;
  categories: {
    name: string;
  } | null;
  suppliers: {
    name: string;
  } | null;
  category_id: string | null;
  supplier_id: string | null;
  branch_id: string | null;
}

const getStockStatus = (quantity: number, minLevel: number) => {
  if (quantity > minLevel) {
    return 'In Stock';
  } else if (quantity > 0) {
    return 'Laag';
  } else {
    return 'Op';
  }
};



const getStockStatusVariant = (status: string) => {
  switch (status) {
    case 'In Stock':
      return 'success';
    case 'Laag':
      return 'warning';
    case 'Op':
      return 'destructive';
    default:
      return 'default';
  }
};

type StockAction = 'in' | 'out';

export const StockList = () => {
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  const isMobile = useIsMobile();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedAction, setSelectedAction] = useState<StockAction | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('');
  const [stockStatusFilter, setStockStatusFilter] = useState('all');
  const [minPriceFilter, setMinPriceFilter] = useState('');
  const [maxPriceFilter, setMaxPriceFilter] = useState('');
  const [minStockFilter, setMinStockFilter] = useState('');
  const [maxStockFilter, setMaxStockFilter] = useState('');

  // Calculate active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (categoryFilter !== '') count++;
    if (supplierFilter !== '') count++;
    if (stockStatusFilter !== 'all') count++;
    if (minPriceFilter !== '') count++;
    if (maxPriceFilter !== '') count++;
    if (minStockFilter !== '') count++;
    if (maxStockFilter !== '') count++;
    return count;
  }, [categoryFilter, supplierFilter, stockStatusFilter, minPriceFilter, maxPriceFilter, minStockFilter, maxStockFilter]);

  // Filter products based on all filter criteria
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const stockStatus = getStockStatus(product.quantity_in_stock, product.minimum_stock_level);
      const displayCategory = product.category_name || product.categories?.name || '';
      const displaySupplier = product.supplier_name || product.suppliers?.name || '';
      
      // Search term filter
      const matchesSearch = searchTerm === '' || 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));

      // Category filter (text-based partial match)
      const matchesCategory = categoryFilter === '' || 
        displayCategory.toLowerCase().includes(categoryFilter.toLowerCase());

      // Supplier filter (text-based partial match)
      const matchesSupplier = supplierFilter === '' || 
        displaySupplier.toLowerCase().includes(supplierFilter.toLowerCase());

      // Stock status filter
      const matchesStockStatus = stockStatusFilter === 'all' || 
        (stockStatusFilter === 'in-stock' && stockStatus === 'In Stock') ||
        (stockStatusFilter === 'low-stock' && stockStatus === 'Laag') ||
        (stockStatusFilter === 'out-of-stock' && stockStatus === 'Op');

      // Price range filter
      const matchesMinPrice = minPriceFilter === '' || product.unit_price >= parseFloat(minPriceFilter);
      const matchesMaxPrice = maxPriceFilter === '' || product.unit_price <= parseFloat(maxPriceFilter);

      // Stock quantity range filter
      const matchesMinStock = minStockFilter === '' || product.quantity_in_stock >= parseInt(minStockFilter);
      const matchesMaxStock = maxStockFilter === '' || product.quantity_in_stock <= parseInt(maxStockFilter);

      return matchesSearch && matchesCategory && matchesSupplier && matchesStockStatus && 
             matchesMinPrice && matchesMaxPrice && matchesMinStock && matchesMaxStock;
    });
  }, [products, searchTerm, categoryFilter, supplierFilter, stockStatusFilter, minPriceFilter, maxPriceFilter, minStockFilter, maxStockFilter]);

  const handleClearFilters = () => {
    setCategoryFilter('');
    setSupplierFilter('');
    setStockStatusFilter('all');
    setMinPriceFilter('');
    setMaxPriceFilter('');
    setMinStockFilter('');
    setMaxStockFilter('');
  };

  const handleStockAction = (product: Product, action: StockAction) => {
    console.log('Stock action triggered:', action, 'for product:', product.name);
    setSelectedProduct(product);
    setSelectedAction(action);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (productId: string) => {
    if (!user || !activeBranch) {
      toast.error('Je moet ingelogd zijn en een filiaal geselecteerd hebben');
      return;
    }
    
    const confirmMessage = 'Weet je zeker dat je dit product wilt verwijderen?\n\n' +
      'LET OP: Dit zal ook alle gerelateerde transacties verwijderen!';
    
    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .match({ 
          id: productId, 
          branch_id: activeBranch.branch_id 
        });

      if (deleteError) {
        console.error('Delete error:', deleteError);
        toast.error(`Verwijderen mislukt: ${deleteError.message}`);
        return;
      }

      toast.success('Product en gerelateerde transacties succesvol verwijderd');
      await fetchProducts();
      
    } catch (error) {
      console.error('Error:', error);
      toast.error('Er is een onverwachte fout opgetreden');
    }
  };

  const fetchProducts = async () => {
    if (!user || !activeBranch) {
      setProducts([]);
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching products for branch:', activeBranch.branch_id);
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories(name),
          suppliers(name)
        `)
        .eq('branch_id', activeBranch.branch_id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        return;
      }

      console.log('Products fetched for branch:', data);
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [user, activeBranch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!activeBranch) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Geen filiaal geselecteerd</h2>
          <p className="text-gray-600">Selecteer een filiaal om producten te bekijken.</p>
        </div>
      </div>
    );
  }

  // Mobile card view
  if (isMobile) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Producten</h1>
            <p className="text-sm text-gray-600">{activeBranch.branch_name}</p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Toevoegen
          </Button>
        </div>

        <ProductFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={setCategoryFilter}
          supplierFilter={supplierFilter}
          onSupplierFilterChange={setSupplierFilter}
          stockStatusFilter={stockStatusFilter}
          onStockStatusFilterChange={setStockStatusFilter}
          minPriceFilter={minPriceFilter}
          onMinPriceFilterChange={setMinPriceFilter}
          maxPriceFilter={maxPriceFilter}
          onMaxPriceFilterChange={setMaxPriceFilter}
          minStockFilter={minStockFilter}
          onMinStockFilterChange={setMinStockFilter}
          maxStockFilter={maxStockFilter}
          onMaxStockFilterChange={setMaxStockFilter}
          onClearFilters={handleClearFilters}
          activeFiltersCount={activeFiltersCount}
        />

        <div className="space-y-3">
          {filteredProducts.length === 0 ? (
            <Card className="bg-white">
              <CardContent className="p-6 text-center">
                <p className="text-gray-500">
                  {products.length === 0 ? 'No products found for this branch.' : 'No products match your filters.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredProducts.map((product) => {
              const stockStatus = getStockStatus(product.quantity_in_stock, product.minimum_stock_level);
              
              return (
                <Card key={product.id} className="relative bg-white">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg font-semibold text-gray-900 truncate">
                          {product.name}
                        </CardTitle>
                        {product.description && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {product.description}
                          </p>
                        )}
                      </div>
                      <div className="flex space-x-2 ml-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStockAction(product, 'in')}
                          className="text-gray-600 hover:text-white hover:bg-green-600 hover:border-green-600"
                        >
                          <Plus className="h-4 w-4" />
                          In
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStockAction(product, 'out')}
                          className="text-gray-600 hover:text-white hover:bg-red-600 hover:border-red-600"
                        >
                          <Minus className="h-4 w-4" />
                          Out
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Stock Niveau:</span>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold">{product.quantity_in_stock}</span>
                          <Badge
                            variant={getStockStatusVariant(stockStatus)}
                            className="text-xs"
                          >
                            {stockStatus}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Eenheidsprijs:</span>
                        <span className="font-semibold text-green-600">
                          ${product.unit_price.toFixed(2)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Min. Niveau:</span>
                        <span>{product.minimum_stock_level}</span>
                      </div>
                    

                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {selectedProduct && (
          <EditProductModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedProduct(null);
              setSelectedAction(null);
            }}
            onProductUpdated={() => {
              fetchProducts();
              setIsEditModalOpen(false);
              setSelectedProduct(null);
              setSelectedAction(null);
            }}
            product={selectedProduct}
            actionType={selectedAction}
          />
        )}

        <AddProductModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onProductAdded={() => {
            fetchProducts();
            setIsAddModalOpen(false);
          }}
        />
      </div>
    );
  }



  const { userProfile } = useAuth();

  const isAdmin = userProfile?.role === 'admin';




  // Desktop table view
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Producten</h1>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nieuw product toevoegen
        </Button>
      </div>

      <ProductFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        supplierFilter={supplierFilter}
        onSupplierFilterChange={setSupplierFilter}
        stockStatusFilter={stockStatusFilter}
        onStockStatusFilterChange={setStockStatusFilter}
        minPriceFilter={minPriceFilter}
        onMinPriceFilterChange={setMinPriceFilter}
        maxPriceFilter={maxPriceFilter}
        onMaxPriceFilterChange={setMaxPriceFilter}
        minStockFilter={minStockFilter}
        onMinStockFilterChange={setMinStockFilter}
        maxStockFilter={maxStockFilter}
        onMaxStockFilterChange={setMaxStockFilter}
        onClearFilters={handleClearFilters}
        activeFiltersCount={activeFiltersCount}
      />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Niveau
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Min. Niveau
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Eenheidsprijs
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acties
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-2 text-center text-gray-500">
                    {products.length === 0 ? 'No products found for this branch.' : 'No products match your filters.'}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product, index) => {
                  const stockStatus = getStockStatus(product.quantity_in_stock, product.minimum_stock_level);
                  
                  return (
                    <tr 
                      key={product.id} 
                      className={`${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      } hover:bg-gray-100 transition-colors`}
                    >
                      <td className="px-4 py-2 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          {product.description && (
                            <div className="text-xs text-gray-500 max-w-xs truncate">
                              {product.description}
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                        {product.quantity_in_stock}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        {product.minimum_stock_level}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-green-600">
                        ${product.unit_price.toFixed(2)}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <Badge variant={getStockStatusVariant(stockStatus)}>
                          {stockStatus}
                        </Badge>
                      </td>
                      <td className="px-4 py-1 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStockAction(product, 'in')}
                            className="text-gray-600 hover:text-white hover:bg-green-600 hover:border-green-600"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStockAction(product, 'out')}
                            className="text-gray-600 hover:text-white hover:bg-red-600 hover:border-green-600"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                            {isAdmin && (
                              <Button variant="destructive" size="sm">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Verwijderen
                              </Button>
                            )}

                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedProduct && (
        <EditProductModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedProduct(null);
            setSelectedAction(null);
          }}
          onProductUpdated={() => {
            fetchProducts();
            setIsEditModalOpen(false);
            setSelectedProduct(null);
            setSelectedAction(null);
          }}
          product={selectedProduct}
          actionType={selectedAction}
        />
      )}

      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onProductAdded={() => {
          fetchProducts();
          setIsAddModalOpen(false);
        }}
      />
    </div>
  );
};
