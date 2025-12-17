import React, { useState } from 'react';
import { useProductBOM } from '@/hooks/useProductBOM';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBranches } from '@/hooks/useBranches';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Package, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface BillOfMaterialsProps {
  productId: string;
}

export const BillOfMaterials: React.FC<BillOfMaterialsProps> = ({ productId }) => {
  const { activeBranch } = useBranches();
  const {
    bom,
    bomWithBuildable,
    buildableQuantity,
    createBOMItem,
    updateBOMItem,
    deleteBOMItem,
    isCreating,
    isUpdating,
    isDeleting,
  } = useProductBOM(productId);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    component_product_id: '',
    quantity_required: 1,
    unit_of_measure: 'unit',
    notes: '',
  });

  // Fetch available products for selection
  const { data: availableProducts } = useQuery({
    queryKey: ['availableProductsForBOM', activeBranch?.branch_id],
    queryFn: async () => {
      if (!activeBranch) return [];

      const { data, error } = await supabase
        .from('products')
        .select('id, name, sku, quantity_in_stock')
        .eq('branch_id', activeBranch.branch_id)
        .eq('is_variant', false)
        .neq('id', productId) // Don't allow self-reference
        .order('name');

      if (error) {
        console.error('Error fetching products:', error);
        return [];
      }

      return data || [];
    },
    enabled: !!activeBranch,
  });

  const handleAdd = () => {
    if (!formData.component_product_id || formData.quantity_required <= 0) {
      toast.error('Please select a component and enter a valid quantity');
      return;
    }

    createBOMItem(formData, {
      onSuccess: () => {
        setIsAddDialogOpen(false);
        setFormData({
          component_product_id: '',
          quantity_required: 1,
          unit_of_measure: 'unit',
          notes: '',
        });
      },
    });
  };

  const handleEdit = (item: any) => {
    setEditingItem(item.id);
    setFormData({
      component_product_id: item.component_product_id,
      quantity_required: item.quantity_required,
      unit_of_measure: item.unit_of_measure,
      notes: item.notes || '',
    });
  };

  const handleUpdate = () => {
    if (!editingItem) return;

    updateBOMItem(
      {
        id: editingItem,
        updates: {
          quantity_required: formData.quantity_required,
          unit_of_measure: formData.unit_of_measure,
          notes: formData.notes || undefined,
        },
      },
      {
        onSuccess: () => {
          setEditingItem(null);
          setFormData({
            component_product_id: '',
            quantity_required: 1,
            unit_of_measure: 'unit',
            notes: '',
          });
        },
      }
    );
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this component from the BOM?')) {
      deleteBOMItem(id);
    }
  };

  if (bom.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">No components defined</p>
          <p className="text-sm text-gray-500 mb-4">
            Add components to create a Bill of Materials
          </p>
          <Button variant="outline" size="sm" onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Component
          </Button>
        </div>

        {/* Add Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Component to BOM</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Component Product</Label>
                <Select
                  value={formData.component_product_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, component_product_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableProducts?.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} {product.sku && `(${product.sku})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Quantity Required</Label>
                <Input
                  type="number"
                  min="0.001"
                  step="0.001"
                  value={formData.quantity_required}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      quantity_required: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>

              <div>
                <Label>Unit of Measure</Label>
                <Input
                  value={formData.unit_of_measure}
                  onChange={(e) =>
                    setFormData({ ...formData, unit_of_measure: e.target.value })
                  }
                  placeholder="unit, kg, liter, etc."
                />
              </div>

              <div>
                <Label>Notes (optional)</Label>
                <Input
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional notes"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAdd} disabled={isCreating}>
                Add Component
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      {/* Buildable Quantity Summary */}
      {buildableQuantity > 0 && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-green-600" />
            <div>
              <div className="font-semibold text-green-900">
                Buildable Quantity: {buildableQuantity.toLocaleString()}
              </div>
              <div className="text-sm text-green-700">
                Based on current component stock levels
              </div>
            </div>
          </div>
        </div>
      )}

      {buildableQuantity === 0 && bomWithBuildable.length > 0 && (
        <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            <div className="text-sm text-orange-900">
              Cannot build any units - insufficient component stock
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Components</h3>
        <Button variant="outline" size="sm" onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Component
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Component</TableHead>
              <TableHead className="text-right">Required</TableHead>
              <TableHead className="text-right">Available</TableHead>
              <TableHead className="text-right">Buildable</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bomWithBuildable.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{item.component_product_name || 'Unknown'}</div>
                    {item.component_product_sku && (
                      <div className="text-xs text-gray-500 font-mono">
                        {item.component_product_sku}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono">
                  {item.quantity_required}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {item.componentAvailable.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  <Badge
                    variant={
                      item.buildableQuantity > 0 ? 'outline' : 'destructive'
                    }
                  >
                    {item.buildableQuantity.toLocaleString()}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {item.unit_of_measure}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(item)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      disabled={isDeleting}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog
        open={isAddDialogOpen || editingItem !== null}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddDialogOpen(false);
            setEditingItem(null);
            setFormData({
              component_product_id: '',
              quantity_required: 1,
              unit_of_measure: 'unit',
              notes: '',
            });
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Edit Component' : 'Add Component to BOM'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {!editingItem && (
              <div>
                <Label>Component Product</Label>
                <Select
                  value={formData.component_product_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, component_product_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableProducts?.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} {product.sku && `(${product.sku})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label>Quantity Required</Label>
              <Input
                type="number"
                min="0.001"
                step="0.001"
                value={formData.quantity_required}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quantity_required: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>

            <div>
              <Label>Unit of Measure</Label>
              <Input
                value={formData.unit_of_measure}
                onChange={(e) =>
                  setFormData({ ...formData, unit_of_measure: e.target.value })
                }
                placeholder="unit, kg, liter, etc."
              />
            </div>

            <div>
              <Label>Notes (optional)</Label>
              <Input
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddDialogOpen(false);
                setEditingItem(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={editingItem ? handleUpdate : handleAdd}
              disabled={isCreating || isUpdating}
            >
              {editingItem ? 'Update' : 'Add'} Component
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

