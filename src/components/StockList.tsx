
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { AddProductModal } from './AddProductModal';
import { EditProductModal } from './EditProductModal';
import { toast } from 'sonner';

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
}

export const StockList = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    if (!user) return;

    try {
      console.log('Fetching products for stock list...');
      const { data, error } = await supabase
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

      console.log('Products fetched for stock list:', data);
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

  const handleProductAdded = () => {
    console.log('Product added, refreshing list...');
    fetchProducts();
    setIsAddModalOpen(false);
  };

  const handleProductUpdated = () => {
    console.log('Product updated, refreshing list...');
    fetchProducts();
    setIsEditModalOpen(false);
    setSelectedProduct(null);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleDeleteProduct = async (product: Product) => {
    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) {
      return;
    }

    try {
      // Create a stock transaction for deletion
      if (product.quantity_in_stock > 0) {
        await supabase
          .from('stock_transactions')
          .insert({
            product_id: product.id,
            product_name: product.name,
            transaction_type: 'outgoing',
            quantity: product.quantity_in_stock,
            unit_price: product.unit_price,
            total_value: product.quantity_in_stock * product.unit_price,
            notes: 'Product deleted - stock removed',
            created_by: user?.id
          });
      }

      // Delete the product
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', product.id);

      if (error) {
        console.error('Error deleting product:', error);
        toast.error('Failed to delete product');
        return;
      }

      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

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
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Current Stock</TableHead>
              <TableHead>Min Level</TableHead>
              <TableHead>Unit Price</TableHead>
              <TableHead>Total Value</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
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
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditProduct(product)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteProduct(product)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onProductAdded={handleProductAdded}
      />

      {selectedProduct && (
        <EditProductModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedProduct(null);
          }}
          onProductUpdated={handleProductUpdated}
          product={selectedProduct}
        />
      )}
    </div>
  );
};
