import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Wrench, Factory, Truck } from 'lucide-react';
import { toast } from 'sonner';

interface BOMCostComponent {
  id: string;
  bom_version_id: string;
  cost_type: 'material' | 'labor' | 'overhead' | 'subcontract';
  description: string | null;
  rate_per_unit: number;
  quantity: number;
  total_cost: number;
  created_at: string;
  updated_at: string;
}

interface LaborOverheadEditorProps {
  bomVersionId: string | null;
}

export const LaborOverheadEditor: React.FC<LaborOverheadEditorProps> = ({
  bomVersionId,
}) => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    cost_type: 'labor' as 'labor' | 'overhead' | 'subcontract',
    description: '',
    rate_per_unit: 0,
    quantity: 0,
  });

  // Fetch cost components
  const { data: costComponents, isLoading } = useQuery<BOMCostComponent[]>({
    queryKey: ['bomCostComponents', bomVersionId],
    queryFn: async () => {
      if (!bomVersionId) return [];

      const { data, error } = await supabase
        .from('bom_cost_components')
        .select('*')
        .eq('bom_version_id', bomVersionId)
        .order('cost_type', { ascending: true })
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching cost components:', error);
        throw error;
      }

      return (data || []).map((item: any) => ({
        ...item,
        rate_per_unit: parseFloat(item.rate_per_unit || 0),
        quantity: parseFloat(item.quantity || 0),
        total_cost: parseFloat(item.total_cost || 0),
      })) as BOMCostComponent[];
    },
    enabled: !!bomVersionId,
  });

  // Create cost component
  const createComponent = useMutation({
    mutationFn: async () => {
      if (!bomVersionId) {
        throw new Error('No BOM version selected');
      }

      const { data, error } = await supabase
        .from('bom_cost_components')
        .insert({
          bom_version_id: bomVersionId,
          cost_type: formData.cost_type,
          description: formData.description || null,
          rate_per_unit: formData.rate_per_unit,
          quantity: formData.quantity,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating cost component:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bomCostComponents', bomVersionId] });
      queryClient.invalidateQueries({ queryKey: ['bomCost', bomVersionId] });
      toast.success('Cost component added');
      setIsDialogOpen(false);
      setFormData({ cost_type: 'labor', description: '', rate_per_unit: 0, quantity: 0 });
    },
    onError: (error: Error) => {
      toast.error(`Failed to add cost component: ${error.message}`);
    },
  });

  // Update cost component
  const updateComponent = useMutation({
    mutationFn: async () => {
      if (!editingId) {
        throw new Error('No component selected for editing');
      }

      const { data, error } = await supabase
        .from('bom_cost_components')
        .update({
          cost_type: formData.cost_type,
          description: formData.description || null,
          rate_per_unit: formData.rate_per_unit,
          quantity: formData.quantity,
        })
        .eq('id', editingId)
        .select()
        .single();

      if (error) {
        console.error('Error updating cost component:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bomCostComponents', bomVersionId] });
      queryClient.invalidateQueries({ queryKey: ['bomCost', bomVersionId] });
      toast.success('Cost component updated');
      setIsDialogOpen(false);
      setEditingId(null);
      setFormData({ cost_type: 'labor', description: '', rate_per_unit: 0, quantity: 0 });
    },
    onError: (error: Error) => {
      toast.error(`Failed to update cost component: ${error.message}`);
    },
  });

  // Delete cost component
  const deleteComponent = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('bom_cost_components')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting cost component:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bomCostComponents', bomVersionId] });
      queryClient.invalidateQueries({ queryKey: ['bomCost', bomVersionId] });
      toast.success('Cost component deleted');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete cost component: ${error.message}`);
    },
  });

  const handleEdit = (component: BOMCostComponent) => {
    setEditingId(component.id);
    setFormData({
      cost_type: component.cost_type,
      description: component.description || '',
      rate_per_unit: component.rate_per_unit,
      quantity: component.quantity,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (editingId) {
      updateComponent.mutate();
    } else {
      createComponent.mutate();
    }
  };

  const getCostTypeIcon = (type: string) => {
    switch (type) {
      case 'labor':
        return <Wrench className="w-4 h-4" />;
      case 'overhead':
        return <Factory className="w-4 h-4" />;
      case 'subcontract':
        return <Truck className="w-4 h-4" />;
      default:
        return null;
    }
  };

  if (!bomVersionId) {
    return (
      <Card className="p-4">
        <div className="text-center py-4 text-gray-500">
          <p>No BOM version selected</p>
        </div>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Loading cost components...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Labor, Overhead & Subcontract Costs</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setEditingId(null);
            setFormData({ cost_type: 'labor', description: '', rate_per_unit: 0, quantity: 0 });
            setIsDialogOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Cost Component
        </Button>
      </div>

      {!costComponents || costComponents.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No cost components defined</p>
          <p className="text-sm mt-2">Add labor, overhead, or subcontract costs</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Rate</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Total Cost</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {costComponents.map((component) => (
                <TableRow key={component.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getCostTypeIcon(component.cost_type)}
                      <span className="capitalize">{component.cost_type}</span>
                    </div>
                  </TableCell>
                  <TableCell>{component.description || '-'}</TableCell>
                  <TableCell className="text-right font-mono">
                    ${component.rate_per_unit.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {component.quantity}
                  </TableCell>
                  <TableCell className="text-right font-mono font-semibold">
                    ${component.total_cost.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(component)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (confirm('Delete this cost component?')) {
                            deleteComponent.mutate(component.id);
                          }
                        }}
                        className="text-red-600 hover:text-red-700"
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
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingId ? 'Edit Cost Component' : 'Add Cost Component'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Cost Type</Label>
              <Select
                value={formData.cost_type}
                onValueChange={(value: any) =>
                  setFormData({ ...formData, cost_type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="labor">Labor</SelectItem>
                  <SelectItem value="overhead">Overhead</SelectItem>
                  <SelectItem value="subcontract">Subcontract</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Description</Label>
              <Input
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="e.g., Assembly labor, Machine setup, etc."
              />
            </div>

            <div>
              <Label>
                {formData.cost_type === 'labor'
                  ? 'Rate per Hour'
                  : formData.cost_type === 'overhead'
                  ? 'Rate per Unit/Hour'
                  : 'Rate per Unit'}
              </Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={formData.rate_per_unit}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    rate_per_unit: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>

            <div>
              <Label>
                {formData.cost_type === 'labor'
                  ? 'Hours'
                  : formData.cost_type === 'overhead'
                  ? 'Units/Hours'
                  : 'Quantity'}
              </Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quantity: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>

            {formData.rate_per_unit > 0 && formData.quantity > 0 && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                <div className="text-sm font-semibold text-blue-900">
                  Total: ${(formData.rate_per_unit * formData.quantity).toFixed(2)}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                createComponent.isPending ||
                updateComponent.isPending ||
                formData.rate_per_unit <= 0 ||
                formData.quantity <= 0
              }
            >
              {editingId ? 'Update' : 'Add'} Component
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

