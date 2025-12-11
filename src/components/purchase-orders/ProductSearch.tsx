import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Package, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Product {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  current_stock: number;
  min_stock: number;
  unit_price: number;
  status: string;
  barcode?: string;
}

interface ProductSearchProps {
  onProductSelect: (product: Product, quantity: number) => void;
  selectedProductIds: string[];
}

export const ProductSearch: React.FC<ProductSearchProps> = ({
  onProductSelect,
  selectedProductIds
}) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    if (searchTerm.length > 2) {
      searchProducts();
    } else {
      setProducts([]);
    }
  }, [searchTerm]);

  const searchProducts = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user.id)
        .or('is_variant.is.null,is_variant.eq.false')
        .ilike('name', `%${searchTerm}%`)
        .limit(10);

      if (error) {
        console.error('Error searching products:', error);
        return;
      }

      setProducts(data || []);
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: quantity
    }));
  };

  const handleAddProduct = (product: Product) => {
    const quantity = quantities[product.id] || 1;
    onProductSelect(product, quantity);
    setQuantities(prev => ({
      ...prev,
      [product.id]: 1
    }));
  };

  const getStockStatus = (currentStock: number, minStock: number) => {
    if (currentStock === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    if (currentStock <= minStock) return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'In Stock', color: 'bg-green-100 text-green-800' };
  };

  const isProductSelected = (productId: string) => {
    return selectedProductIds.includes(productId);
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pr-10"
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
      </div>

      {/* Search Results */}
      {loading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-sm text-gray-600 mt-2">Searching products...</p>
        </div>
      )}

      {!loading && products.length > 0 && (
        <div className="space-y-3">
          {products.map((product) => {
            const stockStatus = getStockStatus(product.current_stock, product.min_stock);
            const isSelected = isProductSelected(product.id);
            
            return (
              <Card key={product.id} className={`${isSelected ? 'ring-2 ring-green-500' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Product Image */}
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      {product.image_url ? (
                        <img 
                          src={product.image_url} 
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <Package className="w-6 h-6 text-gray-400" />
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{product.name}</h3>
                      {product.description && (
                        <p className="text-xs text-gray-500 mt-1">{product.description}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={stockStatus.color}>
                          {stockStatus.label}
                        </Badge>
                        {product.barcode && (
                          <span className="text-xs text-gray-500">SKU: {product.barcode}</span>
                        )}
                      </div>
                    </div>

                    {/* Quantity and Add */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(product.id, Math.max(1, (quantities[product.id] || 1) - 1))}
                          className="w-8 h-8 p-0"
                        >
                          -
                        </Button>
                        <Input
                          type="number"
                          min="1"
                          value={quantities[product.id] || 1}
                          onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value) || 1)}
                          className="w-16 text-center"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(product.id, (quantities[product.id] || 1) + 1)}
                          className="w-8 h-8 p-0"
                        >
                          +
                        </Button>
                      </div>
                      
                      <Button
                        onClick={() => handleAddProduct(product)}
                        disabled={isSelected}
                        className={`${
                          isSelected 
                            ? 'bg-green-100 text-green-600 border-green-200' 
                            : 'bg-green-600 hover:bg-green-700 text-white'
                        }`}
                        size="sm"
                      >
                        {isSelected ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {!loading && searchTerm.length > 2 && products.length === 0 && (
        <div className="text-center py-8">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No products found
          </h3>
          <p className="text-sm text-gray-600">
            Try searching with different keywords or add a new product.
          </p>
        </div>
      )}

      {searchTerm.length <= 2 && (
        <div className="text-center py-8">
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Search for products
          </h3>
          <p className="text-sm text-gray-600">
            Type at least 3 characters to search for products.
          </p>
        </div>
      )}
    </div>
  );
};
