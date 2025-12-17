import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useBranches } from '@/hooks/useBranches';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Package, Search, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { useProductBOM } from '@/hooks/useProductBOM';
import SEO from '@/components/SEO';

interface BOMListItem {
  id: string;
  parent_product_id: string;
  parent_product_name: string;
  parent_product_sku: string | null;
  component_count: number;
  buildable_quantity: number;
  created_at: string;
}

export default function BillOfMaterialsPage() {
  const { activeBranch } = useBranches();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newBOMProductId, setNewBOMProductId] = useState('');

  // Fetch all products with BOMs
  const { data: bomList, isLoading, refetch } = useQuery<BOMListItem[]>({
    queryKey: ['bomList', activeBranch?.branch_id],
    queryFn: async () => {
      if (!activeBranch) return [];

      // Fetch all BOMs for this branch
      const { data: boms, error: bomError } = await supabase
        .from('product_bom')
        .select('parent_product_id')
        .eq('branch_id', activeBranch.branch_id);

      if (bomError) {
        console.error('Error fetching BOMs:', bomError);
        throw bomError;
      }

      if (!boms || boms.length === 0) return [];

      // Get unique parent product IDs
      const uniqueParentIds = [...new Set(boms.map(b => b.parent_product_id))];

      // Fetch parent products
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id, name, sku')
        .in('id', uniqueParentIds)
        .eq('branch_id', activeBranch.branch_id);

      if (productsError) {
        console.error('Error fetching products:', productsError);
        throw productsError;
      }

      // For each product, calculate component count and buildable quantity
      const bomListItems: BOMListItem[] = await Promise.all(
        (products || []).map(async (product) => {
          // Fetch BOM components for this product
          const { data: bomItems } = await supabase
            .from('product_bom')
            .select('component_product_id, quantity_required')
            .eq('parent_product_id', product.id)
            .eq('branch_id', activeBranch.branch_id);

          // Calculate buildable quantity
          let buildableQuantity = Infinity;
          if (bomItems && bomItems.length > 0) {
            const componentIds = bomItems.map(item => item.component_product_id);
            const { data: components } = await supabase
              .from('products')
              .select('id, quantity_in_stock')
              .in('id', componentIds)
              .eq('branch_id', activeBranch.branch_id);

            if (components) {
              const componentMap = new Map(
                components.map(c => [c.id, c.quantity_in_stock || 0])
              );

              buildableQuantity = Math.min(
                ...bomItems.map(item => {
                  const stock = componentMap.get(item.component_product_id) || 0;
                  const required = parseFloat(item.quantity_required.toString());
                  return Math.floor(stock / required);
                })
              );
            }
          }

          return {
            id: product.id,
            parent_product_id: product.id,
            parent_product_name: product.name,
            parent_product_sku: product.sku,
            component_count: bomItems?.length || 0,
            buildable_quantity: buildableQuantity === Infinity ? 0 : buildableQuantity,
            created_at: new Date().toISOString(), // This would ideally come from the BOM
          };
        })
      );

      return bomListItems;
    },
    enabled: !!activeBranch,
    staleTime: 30000,
  });

  // Fetch available products for creating new BOM
  const { data: availableProducts } = useQuery({
    queryKey: ['availableProductsForBOM', activeBranch?.branch_id],
    queryFn: async () => {
      if (!activeBranch) return [];

      const { data, error } = await supabase
        .from('products')
        .select('id, name, sku')
        .eq('branch_id', activeBranch.branch_id)
        .eq('is_variant', false)
        .order('name');

      if (error) {
        console.error('Error fetching products:', error);
        return [];
      }

      return data || [];
    },
    enabled: !!activeBranch,
  });

  const filteredBOMList = bomList?.filter((item) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      item.parent_product_name.toLowerCase().includes(query) ||
      (item.parent_product_sku && item.parent_product_sku.toLowerCase().includes(query))
    );
  }) || [];

  const handleCreateBOM = () => {
    if (!newBOMProductId) {
      toast.error('Please select a product');
      return;
    }
    navigate(`/dashboard/products/${newBOMProductId}`);
    setIsCreateDialogOpen(false);
  };

  const handleDeleteBOM = async (productId: string) => {
    if (!confirm('Are you sure you want to delete the BOM for this product? This will remove all components.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('product_bom')
        .delete()
        .eq('parent_product_id', productId)
        .eq('branch_id', activeBranch?.branch_id);

      if (error) throw error;

      toast.success('BOM deleted successfully');
      refetch();
    } catch (error: any) {
      console.error('Error deleting BOM:', error);
      toast.error(`Failed to delete BOM: ${error.message}`);
    }
  };

  return (
    <>
      <SEO title="Bill of Materials | StockFlow" />
      <div className="h-full flex flex-col bg-white">
        {/* Header */}
        <div className="border-b px-6 py-4 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Bill of Materials</h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage product components and buildable quantities
              </p>
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create BOM
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="border-b px-6 py-4 bg-gray-50">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by product name or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3" />
                <p className="text-gray-600">Loading BOMs...</p>
              </div>
            </div>
          ) : filteredBOMList.length === 0 ? (
            <Card className="p-12">
              <div className="text-center">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {searchQuery ? 'No BOMs found' : 'No Bill of Materials yet'}
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  {searchQuery
                    ? 'Try adjusting your search query'
                    : 'Create your first Bill of Materials to get started'}
                </p>
                {!searchQuery && (
                  <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Create BOM
                  </Button>
                )}
              </div>
            </Card>
          ) : (
            <Card className="p-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead className="text-center">Components</TableHead>
                    <TableHead className="text-center">Buildable Qty</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBOMList.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="font-medium">{item.parent_product_name}</div>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm text-gray-600">
                          {item.parent_product_sku || 'N/A'}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">{item.component_count}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={item.buildable_quantity > 0 ? 'default' : 'destructive'}
                        >
                          {item.buildable_quantity.toLocaleString()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/dashboard/products/${item.id}`)}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteBOM(item.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </div>

        {/* Create BOM Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Bill of Materials</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Select Product</Label>
                <Select value={newBOMProductId} onValueChange={setNewBOMProductId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a product to create BOM for" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableProducts?.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} {product.sku && `(${product.sku})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-2">
                  You'll be taken to the product detail page to add components
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateBOM} disabled={!newBOMProductId}>
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

