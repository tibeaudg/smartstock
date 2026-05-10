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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus, Trash2, ChevronDown, Check, PackageCheck, AlertCircle } from 'lucide-react';
import { StockCount, StockCountItem, Product } from '@/types/stockTypes';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-purple-100 text-purple-800',
  approved: 'bg-green-100 text-green-800',
};

const STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  in_progress: 'In Progress',
  completed: 'Completed',
  approved: 'Approved',
};

export default function EditStockCountPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  const queryClient = useQueryClient();

  const [sc, setSc] = useState<StockCount | null>(null);
  const [scLoading, setScLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);

  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<Array<{
    id?: string;
    product_id: string | null;
    expected_quantity: number;
    counted_quantity: number;
    notes: string;
  }>>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [openPopovers, setOpenPopovers] = useState<Record<number, boolean>>({});

  const fetchCount = useCallback(async () => {
    if (!id || !activeBranch?.branch_id) return;
    setScLoading(true);
    try {
      const { data, error } = await supabase
        .from('cycle_counts')
        .select('*, items:cycle_count_items(*, product:products!cycle_count_items_product_id_fkey(*))')
        .eq('id', id)
        .eq('branch_id', activeBranch.branch_id)
        .single();
      if (error) throw error;
      const count = data as unknown as StockCount;
      setSc(count);
      setNotes(count.notes || '');
      setItems((count.items || []).map((it: StockCountItem) => ({
        id: it.id,
        product_id: it.product_id || null,
        expected_quantity: it.expected_quantity,
        counted_quantity: it.counted_quantity,
        notes: it.notes || '',
      })));
    } catch (e) {
      toast.error('Failed to load stock count');
      navigate('/dashboard/stock-counts');
    } finally {
      setScLoading(false);
    }
  }, [id, activeBranch?.branch_id, navigate]);

  useEffect(() => { fetchCount(); }, [fetchCount]);

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

  const canEdit = sc?.status === 'draft' || sc?.status === 'in_progress';
  const isReadOnly = sc?.status === 'approved' || sc?.status === 'completed';

  const addItem = () => setItems([...items, { product_id: null, expected_quantity: 0, counted_quantity: 0, notes: '' }]);
  const removeItem = (i: number) => setItems(items.filter((_, idx) => idx !== i));
  const updateItem = (i: number, updates: Partial<typeof items[0]>) => {
    const next = [...items];
    next[i] = { ...next[i], ...updates };
    setItems(next);
  };

  const selectProduct = (index: number, product: Product) => {
    updateItem(index, { product_id: product.id, expected_quantity: product.quantity_in_stock, counted_quantity: product.quantity_in_stock });
    setOpenPopovers(prev => ({ ...prev, [index]: false }));
  };

  const handleSave = async () => {
    if (!sc || !user) return;
    setLoading(true);
    try {
      const validItems = items.filter(it => it.product_id !== null);
      const discrepancies = validItems.filter(it => it.counted_quantity !== it.expected_quantity).length;

      await supabase.from('cycle_counts').update({
        notes: notes.trim() || null,
        total_items_counted: validItems.length,
        discrepancy_count: discrepancies,
        updated_at: new Date().toISOString(),
      }).eq('id', sc.id);

      // Delete existing items and re-insert
      await supabase.from('cycle_count_items').delete().eq('cycle_count_id', sc.id);

      if (validItems.length > 0) {
        await supabase.from('cycle_count_items').insert(
          validItems.map(it => ({
            cycle_count_id: sc.id,
            product_id: it.product_id,
            expected_quantity: it.expected_quantity,
            counted_quantity: it.counted_quantity,
            variance: it.counted_quantity - it.expected_quantity,
            variance_value: 0,
            notes: it.notes.trim() || null,
          }))
        );
      }

      queryClient.invalidateQueries({ queryKey: ['stockCounts'] });
      toast.success('Stock count saved');
      fetchCount();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!sc || !user) return;
    setCompleting(true);
    try {
      const { error } = await supabase.rpc('create_cycle_count_adjustment', {
        p_cycle_count_id: sc.id,
        p_approved_by: user.id,
      });
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ['stockCounts'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['stockTransactions'] });
      toast.success('Stock count approved and inventory adjusted');
      fetchCount();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to complete stock count');
    } finally {
      setCompleting(false);
      setShowCompleteDialog(false);
    }
  };

  const handleDelete = async () => {
    if (!sc) return;
    try {
      const { error } = await supabase.from('cycle_counts').delete().eq('id', sc.id);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ['stockCounts'] });
      toast.success('Stock count deleted');
      navigate('/dashboard/stock-counts');
    } catch (e) {
      toast.error('Failed to delete stock count');
    }
  };

  if (scLoading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>;
  }

  if (!sc) return null;

  return (
    <>
      <div className="h-screen flex flex-col min-h-0 p-6">
        <PageFormLayout
          title={sc.count_number}
          backTo="/dashboard/stock-counts"
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
                  <PackageCheck className="w-4 h-4 mr-2" />
                  Approve & Apply
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
            {/* Status Banner */}
            {isReadOnly && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                This stock count has been {sc.status}. Inventory has been adjusted and this record is read-only.
              </div>
            )}

            {/* Info */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Count Date</p>
                  <p className="text-sm font-medium">{format(new Date(sc.count_date), 'MMM d, yyyy')}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Status</p>
                  <Badge className={STATUS_COLORS[sc.status]}>{STATUS_LABELS[sc.status]}</Badge>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Discrepancies</p>
                  <p className={cn('text-sm font-medium', sc.discrepancy_count > 0 ? 'text-amber-600' : 'text-gray-500')}>
                    {sc.discrepancy_count} / {sc.total_items_counted} items
                  </p>
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
                <Label>Products</Label>
                {canEdit && (
                  <Button type="button" variant="outline" size="sm" onClick={addItem}>
                    <Plus className="w-4 h-4 mr-2" />Add Product
                  </Button>
                )}
              </div>

              {isReadOnly ? (
                // Read-only table for completed/approved counts
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 pr-4 font-medium text-gray-600">Product</th>
                        <th className="text-right py-2 pr-4 font-medium text-gray-600">Expected</th>
                        <th className="text-right py-2 pr-4 font-medium text-gray-600">Counted</th>
                        <th className="text-right py-2 font-medium text-gray-600">Variance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {(sc.items || []).map((it: StockCountItem) => {
                        const v = it.variance;
                        return (
                          <tr key={it.id}>
                            <td className="py-2 pr-4">{it.product?.name || 'Unknown product'}</td>
                            <td className="py-2 pr-4 text-right">{it.expected_quantity}</td>
                            <td className="py-2 pr-4 text-right">{it.counted_quantity}</td>
                            <td className={cn('py-2 text-right font-medium', v > 0 ? 'text-green-600' : v < 0 ? 'text-red-600' : 'text-gray-400')}>
                              {v > 0 ? `+${v}` : v || '—'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item, index) => {
                    const selectedProduct = products.find(p => p.id === item.product_id);
                    const v = item.counted_quantity - item.expected_quantity;
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
                          <div className="md:col-span-2">
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
                                        <CommandItem key={p.id} value={p.name} onSelect={() => selectProduct(index, p)}>
                                          <Check className={cn('mr-2 h-4 w-4', item.product_id === p.id ? 'opacity-100' : 'opacity-0')} />
                                          <span className="flex-1">{p.name}</span>
                                          <span className="text-xs text-gray-400 ml-2">Stock: {p.quantity_in_stock}</span>
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                          </div>

                          <div>
                            <Label>Expected Qty</Label>
                            <Input type="number" min="0" value={item.expected_quantity} onChange={e => updateItem(index, { expected_quantity: parseInt(e.target.value) || 0 })} className="mt-1" />
                          </div>

                          <div>
                            <Label>Counted Qty</Label>
                            <Input type="number" min="0" value={item.counted_quantity} onChange={e => updateItem(index, { counted_quantity: parseInt(e.target.value) || 0 })} className="mt-1 border-blue-300 focus:ring-blue-500" />
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <Label>Notes</Label>
                            <Input value={item.notes} onChange={e => updateItem(index, { notes: e.target.value })} placeholder="Optional notes" className="mt-1" />
                          </div>
                          <div className="text-right pt-5 min-w-[80px]">
                            <span className="text-xs text-gray-500">Variance</span>
                            <p className={cn('text-sm font-semibold', v > 0 ? 'text-green-600' : v < 0 ? 'text-red-600' : 'text-gray-400')}>
                              {v > 0 ? `+${v}` : v === 0 ? '—' : v}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </PageFormLayout>
      </div>

      {/* Delete dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete stock count?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete this stock count and all its items. This cannot be undone.</AlertDialogDescription>
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
            <AlertDialogTitle>Approve & Apply Stock Count?</AlertDialogTitle>
            <AlertDialogDescription>
              This will adjust your inventory based on the counted quantities. Items with a variance will have their stock levels updated. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleComplete} disabled={completing} className="bg-green-600 hover:bg-green-700">
              {completing ? 'Applying...' : 'Approve & Apply'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
