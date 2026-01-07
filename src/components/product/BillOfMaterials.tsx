import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProductBOM } from '@/hooks/useProductBOM';
import { useBOMVersions } from '@/hooks/useBOMVersions';
import { useCircularReferenceCheck } from '@/hooks/useCircularReferenceCheck';
import { CircularReferenceWarning } from './CircularReferenceWarning';
import { BOMTreeView } from './BOMTreeView';
import { BOMVersionManager } from './BOMVersionManager';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBranches } from '@/hooks/useBranches';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Package, AlertCircle, GitBranch, ListTree } from 'lucide-react';
import { toast } from 'sonner';

interface BillOfMaterialsProps {
  productId: string;
  bomVersionId?: string | null;
  onVersionChange?: (versionId: string | null) => void;
}

export const BillOfMaterials: React.FC<BillOfMaterialsProps> = ({ 
  productId, 
  bomVersionId,
  onVersionChange 
}) => {
  const { activeBranch } = useBranches();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const { versions, activeVersion, createVersion, isLoading } = useBOMVersions(productId);
  const { checkCircularReference, checkResult, isChecking } = useCircularReferenceCheck();
  const currentVersionId = bomVersionId !== undefined ? bomVersionId : (activeVersion?.id || null);
  const hasAttemptedAutoCreate = React.useRef(false);
  const hasOpenedAddDialog = React.useRef(false);
  
  // Auto-create version 1.0 if coming from "Create BOM" flow and no versions exist
  useEffect(() => {
    const shouldCreate = searchParams.get('create') === 'true';
    
    // Only proceed if:
    // 1. We have the create flag
    // 2. Versions have finished loading (not loading)
    // 3. No versions exist
    // 4. We haven't already attempted to create
    if (shouldCreate && !isLoading && versions.length === 0 && !hasAttemptedAutoCreate.current) {
      hasAttemptedAutoCreate.current = true;
      createVersion({
        parent_product_id: productId,
        version_number: '1.0',
        description: 'Initial BOM version',
      }, {
        onSuccess: (newVersion) => {
          // Remove the create parameter from URL
          searchParams.delete('create');
          setSearchParams(searchParams, { replace: true });
          if (onVersionChange) {
            onVersionChange(newVersion.id);
          }
          toast.success('BOM version 1.0 created successfully');
        },
        onError: (error: Error) => {
          // Remove the create parameter even on error
          searchParams.delete('create');
          setSearchParams(searchParams, { replace: true });
          toast.error(`Failed to create initial version: ${error.message}`);
          // Reset flag on error so user can retry
          hasAttemptedAutoCreate.current = false;
        },
      });
    }
    
    // If create flag is present and versions exist but no components, open add dialog
    if (shouldCreate && !isLoading && versions.length > 0 && bom.length === 0 && !hasOpenedAddDialog.current) {
      hasOpenedAddDialog.current = true;
      setIsAddDialogOpen(true);
      // remove the create param so we don't reopen on refresh
      searchParams.delete('create');
      setSearchParams(searchParams, { replace: true });
    }

    // Reset flags if create parameter is removed (user navigated away or manually removed)
    if (!shouldCreate) {
      hasAttemptedAutoCreate.current = false;
      hasOpenedAddDialog.current = false;
    }
  }, [searchParams, versions.length, isLoading, productId, createVersion, onVersionChange, setSearchParams]);
  
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
  } = useProductBOM(productId, currentVersionId);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'tree'>('table');
  const [formData, setFormData] = useState({
    component_product_id: '',
    quantity_required: 1,
    unit_of_measure: 'unit',
    component_uom: 'unit',
    conversion_factor: 1.0,
    scrap_factor: 0,
    sequence_number: 0,
    bom_version_id: currentVersionId,
    notes: '',
  });
  const [circularRefWarning, setCircularRefWarning] = useState<{
    hasCircular: boolean;
    path?: string;
  }>({ hasCircular: false });

  // Check for circular reference when component is selected
  useEffect(() => {
    if (formData.component_product_id && !editingItem) {
      checkCircularReference({
        parentProductId: productId,
        componentProductId: formData.component_product_id,
        bomVersionId: currentVersionId,
      });
    }
  }, [formData.component_product_id, productId, currentVersionId, editingItem]);

  useEffect(() => {
    if (checkResult) {
      setCircularRefWarning({
        hasCircular: checkResult.hasCircularReference,
        path: checkResult.path,
      });
    }
  }, [checkResult]);

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

    if (circularRefWarning.hasCircular) {
      toast.error('Cannot add component: Circular reference detected');
      return;
    }

    // If no version exists, prompt user to create one first
    if (!currentVersionId && versions.length === 0) {
      toast.error('Please create a BOM version first using the version manager above');
      setIsAddDialogOpen(false);
      return;
    }

    createBOMItem({
      ...formData,
      bom_version_id: currentVersionId,
    }, {
      onSuccess: () => {
        setIsAddDialogOpen(false);
        setFormData({
          component_product_id: '',
          quantity_required: 1,
          unit_of_measure: 'unit',
          component_uom: 'unit',
          conversion_factor: 1.0,
          scrap_factor: 0,
          sequence_number: 0,
          bom_version_id: currentVersionId,
          notes: '',
        });
        setCircularRefWarning({ hasCircular: false });
      },
      onError: (error: any) => {
        if (error.message?.includes('Circular reference')) {
          toast.error('Circular reference detected. Please check the BOM structure.');
        } else {
          toast.error(`Failed to add component: ${error.message || 'Unknown error'}`);
        }
      },
    });
  };

  const handleEdit = (item: any) => {
    setEditingItem(item.id);
    setFormData({
      component_product_id: item.component_product_id,
      quantity_required: item.quantity_required,
      unit_of_measure: item.unit_of_measure,
      component_uom: item.component_uom || item.unit_of_measure || 'unit',
      conversion_factor: item.conversion_factor || 1.0,
      scrap_factor: item.scrap_factor || 0,
      sequence_number: item.sequence_number || 0,
      bom_version_id: item.bom_version_id || currentVersionId,
      notes: item.notes || '',
    });
    setCircularRefWarning({ hasCircular: false });
  };

  const handleUpdate = () => {
    if (!editingItem) return;

    updateBOMItem(
      {
        id: editingItem,
        updates: {
          quantity_required: formData.quantity_required,
          unit_of_measure: formData.unit_of_measure,
          component_uom: formData.component_uom,
          conversion_factor: formData.conversion_factor,
          scrap_factor: formData.scrap_factor,
          sequence_number: formData.sequence_number,
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
            component_uom: 'unit',
            conversion_factor: 1.0,
            scrap_factor: 0,
            sequence_number: 0,
            bom_version_id: currentVersionId,
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

  // Show version manager if no versions exist
  if (versions.length === 0 && bom.length === 0) {
    return (
      <div className="space-y-4">
        <BOMVersionManager 
          productId={productId} 
          onVersionChange={(versionId) => {
            if (onVersionChange) {
              onVersionChange(versionId);
            }
          }}
        />
        <Card className="p-6">
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">No BOM version created yet</p>
            <p className="text-sm text-gray-500 mb-4">
              Create a BOM version above, then add components to it
            </p>
          </div>
        </Card>
      </div>
    );
  }

  if (bom.length === 0 && versions.length > 0) {
    return (
      <div className="space-y-4">
        <BOMVersionManager 
          productId={productId} 
          onVersionChange={(versionId) => {
            if (onVersionChange) {
              onVersionChange(versionId);
            }
          }}
        />
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
      </div>
    );
  }

  // Version selector
  const selectedVersion = versions.find(v => v.id === currentVersionId);

  return (
    <div className="space-y-4">
      {/* BOM Overview Header */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">Bill of Materials Overview</h3>
            <p className="text-xs text-blue-800 mb-3">
              A BOM defines all the components and quantities needed to build this product. 
              {versions.length > 0 && ` You have ${versions.length} version${versions.length > 1 ? 's' : ''} defined.`}
            </p>
            <div className="flex items-center gap-4 text-xs">
              <div>
                <span className="text-blue-700 font-medium">Components:</span>{' '}
                <span className="text-blue-900">{bom.length}</span>
              </div>
              {buildableQuantity > 0 && (
                <div>
                  <span className="text-blue-700 font-medium">Can Build:</span>{' '}
                  <span className="text-blue-900 font-semibold">{buildableQuantity.toLocaleString()} units</span>
                </div>
              )}
              {buildableQuantity === 0 && bom.length > 0 && (
                <div className="text-orange-700">
                  <span className="font-medium">⚠️ Cannot build</span> - Check component stock
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      <BOMVersionManager 
        productId={productId} 
        onVersionChange={(versionId) => {
          if (onVersionChange) {
            onVersionChange(versionId);
          }
        }}
      />
      <Card className="p-4">
        {/* Version Selector */}
        {versions.length > 0 && (
          <div className="mb-4 p-3 bg-gray-50 border rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-gray-600" />
                <Label className="text-sm font-medium">BOM Version:</Label>
                <Select
                  value={currentVersionId || ''}
                  onValueChange={(value) => {
                    const versionId = value === 'none' ? null : value;
                    if (onVersionChange) {
                      onVersionChange(versionId);
                    }
                  }}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue>
                      {selectedVersion ? `v${selectedVersion.version_number}` : 'No Version (Legacy)'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Version (Legacy)</SelectItem>
                    {versions.map((v) => (
                      <SelectItem key={v.id} value={v.id}>
                        v{v.version_number} ({v.status})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode(viewMode === 'table' ? 'tree' : 'table')}
                >
                  <ListTree className="w-4 h-4 mr-2" />
                  {viewMode === 'table' ? 'Tree View' : 'Table View'}
                </Button>
              </div>
            </div>
          </div>
        )}

      {/* Circular Reference Warning */}
      {circularRefWarning.hasCircular && (
        <CircularReferenceWarning
          hasCircularReference={true}
          path={circularRefWarning.path}
          onDismiss={() => setCircularRefWarning({ hasCircular: false })}
        />
      )}

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

      {/* Tree View */}
      {viewMode === 'tree' ? (
        <BOMTreeView productId={productId} bomVersionId={currentVersionId} />
      ) : (
        <>
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
                  <TableHead className="text-right">Effective</TableHead>
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
                      {item.scrap_factor && item.scrap_factor > 0 && (
                        <span className="text-xs text-orange-600 ml-1">
                          (+{(item.scrap_factor * 100).toFixed(1)}%)
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-mono text-gray-600">
                      {item.effectiveQuantity?.toFixed(3) || item.quantity_required}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {item.componentAvailable.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant={
                          item.buildableQuantity > 0 ? 'secondary' : 'destructive'
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
        </>
      )}

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
              component_uom: 'unit',
              conversion_factor: 1.0,
              scrap_factor: 0,
              sequence_number: 0,
              bom_version_id: currentVersionId,
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
              <Label>Component UOM</Label>
              <Input
                value={formData.component_uom}
                onChange={(e) =>
                  setFormData({ ...formData, component_uom: e.target.value })
                }
                placeholder="Component's unit of measure"
              />
              <p className="text-xs text-gray-500 mt-1">
                Unit of measure for the component (may differ from parent)
              </p>
            </div>

            <div>
              <Label>Conversion Factor</Label>
              <Input
                type="number"
                step="0.0001"
                min="0.0001"
                value={formData.conversion_factor}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    conversion_factor: parseFloat(e.target.value) || 1.0,
                  })
                }
              />
              <p className="text-xs text-gray-500 mt-1">
                Factor to convert from component UOM to parent UOM
              </p>
            </div>

            <div>
              <Label>Scrap Factor (%)</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={(formData.scrap_factor * 100).toFixed(2)}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    scrap_factor: (parseFloat(e.target.value) || 0) / 100,
                  })
                }
              />
              <p className="text-xs text-gray-500 mt-1">
                Expected waste percentage (e.g., 5 for 5% waste)
              </p>
            </div>

            <div>
              <Label>Sequence Number</Label>
              <Input
                type="number"
                min="0"
                value={formData.sequence_number}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sequence_number: parseInt(e.target.value) || 0,
                  })
                }
              />
              <p className="text-xs text-gray-500 mt-1">
                Order in which components appear (lower numbers first)
              </p>
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
    </div>
  );
  
};  
  

  