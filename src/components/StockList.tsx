
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface Product {
  id: string;
  name: string;
  sku: string;
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
}

export const StockList = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    if (!user) return;

    try {
      const { data, error } = await (supabase as any)
        .from('products')
        .select(`
          *,
          categories(name),
          suppliers(name)
        `)
        .order('name');

      if (error) {
        console.error('Error fetching products:', error);
        return;
      }

      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [user]);

  const getStatusColor = (status: string | null, quantity: number, minLevel: number) => {
    if (quantity === 0) return 'destructive';
    if (quantity <= minLevel) return 'secondary';
    return 'default';
  };

  const getStatusText = (status: string | null, quantity: number, minLevel: number) => {
    if (quantity === 0) return 'Out of Stock';
    if (quantity <= minLevel) return 'Low Stock';
    return 'In Stock';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Stock Overview</h1>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Current Stock</TableHead>
              <TableHead>Min Level</TableHead>
              <TableHead>Unit Price</TableHead>
              <TableHead>Total Value</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                  No products found. Add products to see them here.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{product.name}</div>
                      {product.description && (
                        <div className="text-sm text-gray-500">{product.description}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>{product.categories?.name || '-'}</TableCell>
                  <TableCell>{product.suppliers?.name || '-'}</TableCell>
                  <TableCell className="font-medium">{product.quantity_in_stock}</TableCell>
                  <TableCell>{product.minimum_stock_level}</TableCell>
                  <TableCell>${product.unit_price.toFixed(2)}</TableCell>
                  <TableCell>
                    ${(product.quantity_in_stock * product.unit_price).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={getStatusColor(
                        product.status,
                        product.quantity_in_stock,
                        product.minimum_stock_level
                      )}
                    >
                      {getStatusText(
                        product.status,
                        product.quantity_in_stock,
                        product.minimum_stock_level
                      )}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
