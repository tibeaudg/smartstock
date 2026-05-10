import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { PageFormLayout } from '@/components/PageFormLayout';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus, Trash2, ChevronDown, Check, PackageCheck, AlertCircle } from 'lucide-react';
import { PickList, PickListItem, PickListStatus, Product } from '@/types/stockTypes';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-800',
  pending: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export default function EditPickListPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  const queryClient = useQueryClient();

  const [pl, setPl] = useState<PickList | null>(null);
  const [plLoading, setPlLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);

  const [status, setStatus] = useState<PickListStatus>('draft');
  const [assignedTo, setAssignedTo] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<Array<{
    id?: string;
    product_id: string | null;
    quantity_requested: number;
    notes: string;
  }>>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [openPopovers, setOpenPopovers] = useState<Record<number, boolean>>({});

  const fetchPickList = useCallback(async () => {
    if (!id || !activeBranch?.branch_id) return;
    setPlLoading(true);
    try {
      const { data, error } = await supabase
        .from('pick_lists')
        .select('*, items:pick_list_items(*, product:products!pick_list_items_product_id_fkey(*))')
        .eq('id', id)
        .eq('branch_id', activeBranch.branch_id)
        .single();
      if (error) throw error;
      const pickList = data as unknown as PickList;
      setPl(pickList);
      setStatus(pickList.status);
      setAssignedTo(pickList.assigned_to || '');
      setNotes(pickList.notes || '');
      setItems((pickList.items || []).map((it: PickListItem) => ({
        id: it.id,
        product_id: it.product_id || null,
        quantity_requested: it.quantity_requested,
        notes: it.notes || '',
      })));
    } catch (e) {
      toast.error('Failed to load pick list');
      navigate('/dashboard/pick-lists');
    } finally {
      setPlLoading(false);
    }
  }, [id, activeBranch?.branch_id, navigate]);

  useEffect(() => { fetchPickList(); }, [fetchPickList]);

  useEffect(() => {
    if (!user || !activeBranch?.branch_id) return;
    supabase
      .from('products')
      .select('*')
      .eq('user_id', user.id)
      .eq('branch_id', activeBranch.branch_id)
      .or('is_variant.is.null,is_variant.eq.false')
      .order('name')
      .then(({ data }) => setProducts(data || []));
  }, [user?.id, activeBranch?.branch_id]);

  const canEdit = pl?.status === 'draft' || pl?.status === 'pending' || pl?.status === 'in_progress';
  const isReadOnly = pl?.status === 'completed' || pl?.status === 'cancelled';

  const addItem = () => setItems([...items, { product_id: null, quantity_requested: 1, notes: '' }]);
  const removeItem = (i: number) => setItems(items.filter((_, idx) => idx !== i));
  const updateItem = (i: number, updates: Partial<typeof items[0]>) => {
    const next = [...items];
    next[i] = { ...next[i], ...updates };
    setItems(next);
  };

  const handleSave = async () => {
    if (!pl || !user) return;
    setLoading(true);
    try {
      const validItems = items.filter(it => it.product_id !== null && it.quantity_requested > 0);

      await supabase.from('pick_lists').update({
        status,
        assigned_to: assignedTo.trim() || null,
        notes: notes.trim() || null,
        updated_at: new Date().toISOString(),
      }).eq('id', pl.id);

      // Replace items
      await supabase.from('pick_list_items').delete().eq('pick_list_id', pl.id);
      if (validItems.length > 0) {
        await supabase.from('pick_list_items').insert(
          validItems.map(it => ({
            pick_list_id: pl.id,
            product_id: it.product_id,
            quantity_requested: it.quantity_requested,
            quantity_picked: 0,
            notes: it.notes.trim() || null,
          }))
        );
      }

      queryClient.invalidateQueries({ queryKey: ['pickLists'] });
      toast.success('Pick list saved');
      fetchPickList();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!pl || !user) return;
    setCompleting(true);
    try {
      const { error } = await supabase.rpc('complete_pick_list', {
        p_pick_list_id: pl.id,
        p_completed_by: user.id,
      });
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ['pickLists'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['stockTransactions'] });
      toast.success('Pick list completed and inventory updated');
      fetchPickList();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to complete pick list');
    } finally {
      setCompleting(false);
      setShowCompleteDialog(false);
    }
  };

  const handleDelete = async () => {
    if (!pl) return;
    try {
      const { error } = await supabase.from('pick_lists').delete().eq('id', pl.id);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ['pickLists'] });
      toast.success('Pick list deleted');
      navigate('/dashboard/pick-lists');
    } catch (e) {
      toast.error('Failed to delete pick list');
    }
  };

  if (plLoading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>;
  }

  if (!pl) return null;

  const totalQty = items.filter(it => it.product_id).reduce((s, it) => s + it.quantity_requested, 0);

  return (
    <>
      <div className="h-screen flex flex-col min-h-0 p-6">
        <PageFormLayout
          title={pl.pick_number}
          backTo="/dashboard/pick-lists"
          backLabel="Back"
          primaryAction={
            canEdit ? (
              <Button onClick={handleSave} disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</Button>
            ) : null
          }
          secondaryContent={
            <div className="flex items-center gap-2">
              {canEdit && (
                <Button
                  variant="outline"
                  className="border-green-300 text-green-700 hover:bg-green-50"
                  onClick={() => setShowCompleteDialog(true)}
                  disabled={completing}
                >
                  <PackageCheck className="w-4 h-4 mr-2" />Complete Pick
                </Button>
              )}
              {canEdit && (
                <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50" onClick={() => setShowDeleteDialog(true)}>
                  <Trash2 className="w-4 h-4 mr-2" />Delete
                </Button>
              )}
            </div>
          }
        >
          <div className="space-y-6">
            {/* Status banner */}
            {isReadOnly && (
              <div className={cn(
                'flex items-center gap-2 p-3 border rounded-lg text-sm',
                pl.status === 'completed' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
              )}>
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {pl.status === 'completed'
                  ? 'This pick list has been completed. Inventory has been decremented and this record is read-only.'
                  : 'This pick list has been cancelled and is read-only.'}
              </div>
            )}

            {/* Info */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Created</p>
                  <p className="text-sm font-medium">{format(new Date(pl.created_at), 'MMM d, yyyy')}</p>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  {canEdit ? (
                    <Select value={status} onValueChange={(v: PickListStatus) => setStatus(v)}>
                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="mt-1">
                      <Badge className={STATUS_COLORS[pl.status]}>{STATUS_LABELS[pl.status]}</Badge>
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="assignedTo">Assigned To</Label>
                  <Input
                    id="assignedTo"
                    value={assignedTo}
                    onChange={e => setAssignedTo(e.target.value)}
                    disabled={isReadOnly}
                    placeholder="Enter name"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} disabled={isReadOnly} rows={3} className="mt-1" />
            </div>

            {/* Items */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
              <div className="flex justify-between items-center mb-4">
                <Label>Items</Label>
                {canEdit && (
                  <Button type="button" variant="outline" size="sm" onClick={addItem}>
                    <Plus className="w-4 h-4 mr-2" />Add Item
                  </Button>
                )}
              </div>

              {isReadOnly ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 pr-4 font-medium text-gray-600">Product</th>
                        <th className="text-right py-2 pr-4 font-medium text-gray-600">Requested</th>
                        <th className="text-right py-2 font-medium text-gray-600">Picked</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {(pl.items || []).map((it: PickListItem) => (
                        <tr key={it.id}>
                          <td className="py-2 pr-4">{(it as any).product?.name || 'Unknown product'}</td>
                          <td className="py-2 pr-4 text-right">{it.quantity_requested}</td>
                          <td className={cn('py-2 text-right font-medium', it.quantity_picked >= it.quantity_requested ? 'text-green-600' : 'text-gray-400')}>
                            {it.quantity_picked}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item, index) => {
                    const selectedProduct = products.find(p => p.id === item.product_id);
                    const overStock = selectedProduct && item.quantity_requested > selectedProduct.quantity_in_stock;
                    return (
                      <div key={index} className="border rounded-lg p-4 space-y-4 bg-white">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-sm text-gray-700">Item {index + 1}</h4>
                          {items.length > 1 && (
                            <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(index)}>
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="md:col-span-3">
                            <Label>Product</Label>
                            <Popover open={openPopovers[index] ?? false} onOpenChange={open => setOpenPopovers(prev => ({ ...prev, [index]: open }))}>
                              <PopoverTrigger asChild>
                                <Button variant="outline" role="combobox" className="w-full justify-between font-normal mt-1">
                                  {selectedProduct?.name ?? 'Select product'}
                                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                                <Command>
                                  <CommandInput placeholder="Search products..." />
                                  <CommandList>
                                    <CommandEmpty>No product found.</CommandEmpty>
                                    <CommandGroup>
                                      {products.map(p => (
                                        <CommandItem key={p.id} value={p.name} onSelect={() => {
                                          updateItem(index, { product_id: p.id });
                                          setOpenPopovers(prev => ({ ...prev, [index]: false }));
                                        }}>
                                          <Check className={cn('mr-2 h-4 w-4', item.product_id === p.id ? 'opacity-100' : 'opacity-0')} />
                                          <span className="flex-1">{p.name}</span>
                                          <span className={cn('text-xs ml-2', p.quantity_in_stock <= 0 ? 'text-red-400' : 'text-gray-400')}>
                                            {p.quantity_in_stock} in stock
                                          </span>
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                          </div>

                          <div>
                            <Label>Qty to Pick</Label>
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity_requested}
                              onChange={e => updateItem(index, { quantity_requested: parseInt(e.target.value) || 1 })}
                              className={cn('mt-1', overStock && 'border-red-400 focus:ring-red-400')}
                            />
                            {overStock && <p className="text-xs text-red-500 mt-1">Exceeds stock ({selectedProduct.quantity_in_stock})</p>}
                          </div>
                        </div>

                        <div>
                          <Label>Item Notes</Label>
                          <Input value={item.notes} onChange={e => updateItem(index, { notes: e.target.value })} placeholder="Optional notes" className="mt-1" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Summary */}
            {!isReadOnly && (
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 flex justify-between items-center">
                <span className="text-sm text-gray-600">{items.filter(it => it.product_id).length} product(s)</span>
                <span className="text-lg font-semibold text-gray-900">Total qty: {totalQty}</span>
              </div>
            )}
          </div>
        </PageFormLayout>
      </div>

      {/* Delete dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete pick list?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete this pick list and all its items. This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Complete dialog */}
      <AlertDialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Complete Pick List?</AlertDialogTitle>
            <AlertDialogDescription>
              This will decrement stock for all items and mark the pick list as completed. Make sure stock levels are sufficient before continuing.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleComplete} disabled={completing} className="bg-green-600 hover:bg-green-700">
              {completing ? 'Completing...' : 'Complete Pick'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
