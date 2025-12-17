import React, { useState } from 'react';
import { useWorkOrders } from '@/hooks/useWorkOrders';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useBranches } from '@/hooks/useBranches';
import { Plus, Package } from 'lucide-react';
import { toast } from 'sonner';
import SEO from '@/components/SEO';

export default function WorkOrdersPage() {
  const { workOrders, isLoading, createWorkOrder, isCreating } = useWorkOrders();
  const { activeBranch } = useBranches();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    product_id: '',
    quantity_to_build: 1,
    due_date: '',
    priority: 0,
    notes: '',
  });

  const { data: products } = useQuery({
    queryKey: ['productsForWO', activeBranch?.branch_id],
    queryFn: async () => {
      if (!activeBranch) return [];
      const { data } = await supabase
        .from('products')
        .select('id, name, sku, item_type')
        .eq('branch_id', activeBranch.branch_id)
        .eq('item_type', 'manufactured')
        .order('name');
      return data || [];
    },
    enabled: !!activeBranch,
  });

  const handleCreate = () => {
    if (!formData.product_id || formData.quantity_to_build <= 0) {
      toast.error('Please select a product and enter quantity');
      return;
    }

    createWorkOrder(formData, {
      onSuccess: () => {
        setIsCreateDialogOpen(false);
        setFormData({ product_id: '', quantity_to_build: 1, due_date: '', priority: 0, notes: '' });
      },
    });
  };

  return (
    <>
      <SEO title="Work Orders | StockFlow" />
      <div className="h-full flex flex-col bg-white">
        <div className="border-b px-6 py-4 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Work Orders</h1>
              <p className="text-sm text-gray-600 mt-1">Manage manufacturing work orders</p>
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Work Order
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3" />
              <p className="text-gray-600">Loading work orders...</p>
            </div>
          ) : workOrders.length === 0 ? (
            <Card className="p-12">
              <div className="text-center">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No work orders yet</h3>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Work Order
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="p-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>WO Number</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-center">Quantity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workOrders.map((wo) => (
                    <TableRow key={wo.id}>
                      <TableCell className="font-mono">{wo.wo_number}</TableCell>
                      <TableCell>{wo.product_id}</TableCell>
                      <TableCell className="text-center">{wo.quantity_to_build}</TableCell>
                      <TableCell>
                        <Badge variant={wo.status === 'completed' ? 'default' : 'secondary'}>
                          {wo.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{wo.due_date ? new Date(wo.due_date).toLocaleDateString() : '-'}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">View</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Work Order</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Product</Label>
                <Select value={formData.product_id} onValueChange={(v) => setFormData({ ...formData, product_id: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products?.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name} {p.sku && `(${p.sku})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Quantity to Build</Label>
                <Input
                  type="number"
                  min="1"
                  value={formData.quantity_to_build}
                  onChange={(e) => setFormData({ ...formData, quantity_to_build: parseInt(e.target.value) || 1 })}
                />
              </div>
              <div>
                <Label>Due Date</Label>
                <Input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={isCreating}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

