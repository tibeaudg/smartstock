
import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Plus } from 'lucide-react';
import { EditProductModal } from './EditProductModal';
import { AddProductModal } from './AddProductModal';
import { ProductFilters } from './ProductFilters';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';

interface Category {
  id: string;
  name: string;
}

interface Supplier {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  quantity_in_stock: number;
  minimum_stock_level: number;
  unit_price: number;
  status: string | null;
  categories: {
    name: string;
  } | null;
  suppliers: {
    name: string;
  } | null;
  category_id: string | null;
  supplier_id: string | null;
}

const getStockStatus = (quantity: number, minLevel: number) => {
  if (quantity > minLevel) {
    return 'In Stock';
  } else if (quantity > 0) {
    return 'Low Stock';
  } else {
    return 'Out of Stock';
  }
};

const getStockStatusVariant = (status: string) => {
  switch (status) {
    case 'In Stock':
      return 'default'; // This will be green
    case 'Low Stock':
      return 'secondary'; // This will be orange  
    case 'Out of Stock':
      return 'destructive'; // This will be red
    default:
      return 'default';
  }
};

export const StockList = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [supplierFilter, setSupplierFilter] = useState('all');
  const [stockStatusFilter, setStockStatusFilter] = useState('all');
  const [minPriceFilter, setMinPriceFilter] = useState('');
  const [maxPriceFilter, setMaxPriceFilter] = useState('');
  const [minStockFilter, setMinStockFilter] = useState('');
  const [maxStockFilter, setMaxStockFilter] = useState('');

  // Calculate active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (categoryFilter !== 'all') count++;
    if (supplierFilter !== 'all') count++;
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
      
      // Search term filter
      const matchesSearch = searchTerm === '' || 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));

      // Category filter
      const matchesCategory = categoryFilter === 'all' || product.category_id === categoryFilter;

      // Supplier filter
      const matchesSupplier = supplierFilter === 'all' || product.supplier_id === supplierFilter;

      // Stock status filter
      const matchesStockStatus = stockStatusFilter === 'all' || 
        (stockStatusFilter === 'in-stock' && stockStatus === 'In Stock') ||
        (stockStatusFilter === 'low-stock' && stockStatus === 'Low Stock') ||
        (stockStatusFilter === 'out-of-stock' && stockStatus === 'Out of Stock');

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
    setCategoryFilter('all');
    setSupplierFilter('all');
    setStockStatusFilter('all');
    setMinPriceFilter('');
    setMaxPriceFilter('');
    setMinStockFilter('');
    setMaxStockFilter('');
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (productId: string) => {
    if (!user) return;
    
    if (!confirm('Are you sure you want to delete this product? This will also delete all associated transactions.')) {
      return;
    }

    try {
      console.log('Deleting product:', productId);
      
      // First delete associated stock transactions
      const { error: transactionError } = await supabase
        .from('stock_transactions')
        .delete()
        .eq('product_id', productId);

      if (transactionError) {
        console.error('Error deleting transactions:', transactionError);
        toast.error('Failed to delete product transactions');
        return;
      }

      // Then delete the product
      const { error: productError } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (productError) {
        console.error('Error deleting product:', productError);
        toast.error('Failed to delete product');
        return;
      }

      console.log('Product deleted successfully');
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const fetchProducts = async () => {
    if (!user) return;

    try {
      console.log('Fetching products...');
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories(name),
          suppliers(name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        return;
      }

      console.log('Products fetched:', data);
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchSuppliers();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Mobile card view
  if (isMobile) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <Button onClick={() => setIsAddModalOpen(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add New
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
          categories={categories}
          suppliers={suppliers}
          onClearFilters={handleClearFilters}
          activeFiltersCount={activeFiltersCount}
        />

        <div className="space-y-3">
          {filteredProducts.length === 0 ? (
            <Card className="bg-white">
              <CardContent className="p-6 text-center">
                <p className="text-gray-500">
                  {products.length === 0 ? 'No products found.' : 'No products match your filters.'}
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
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(product)}
                          className="p-2"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Stock Level:</span>
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
                        <span className="text-sm font-medium text-gray-700">Unit Price:</span>
                        <span className="font-semibold text-green-600">
                          ${product.unit_price.toFixed(2)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Min. Level:</span>
                        <span>{product.minimum_stock_level}</span>
                      </div>
                      
                      {product.categories && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">Category:</span>
                          <Badge variant="outline" className="text-xs">
                            {product.categories.name}
                          </Badge>
                        </div>
                      )}
                      
                      {product.suppliers && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">Supplier:</span>
                          <span className="text-sm">{product.suppliers.name}</span>
                        </div>
                      )}
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
            }}
            onProductUpdated={() => {
              fetchProducts();
              setIsEditModalOpen(false);
              setSelectedProduct(null);
            }}
            product={selectedProduct}
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

  // Desktop table view
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Product
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
        categories={categories}
        suppliers={suppliers}
        onClearFilters={handleClearFilters}
        activeFiltersCount={activeFiltersCount}
      />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Supplier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Min. Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unit Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                    {products.length === 0 ? 'No products found.' : 'No products match your filters.'}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const stockStatus = getStockStatus(product.quantity_in_stock, product.minimum_stock_level);
                  return (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          {product.description && (
                            <div className="text-sm text-gray-500 max-w-xs truncate">
                              {product.description}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {product.categories ? (
                          <Badge variant="outline">{product.categories.name}</Badge>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.suppliers?.name || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {product.quantity_in_stock}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.minimum_stock_level}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                        ${product.unit_price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={getStockStatusVariant(stockStatus)}>
                          {stockStatus}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(product)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(product.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
          }}
          onProductUpdated={() => {
            fetchProducts();
            setIsEditModalOpen(false);
            setSelectedProduct(null);
          }}
          product={selectedProduct}
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
