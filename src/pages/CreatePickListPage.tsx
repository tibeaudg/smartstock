import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PageFormLayout } from '@/components/PageFormLayout';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus, Trash2, ChevronDown, Check } from 'lucide-react';
import { Product, PickListStatus } from '@/types/stockTypes';
import { cn } from '@/lib/utils';

type PickItem = {
  product_id: string | null;
  quantity_requested: number;
  notes: string;
};

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-800',
  pending: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
};

export default function CreatePickListPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  const queryClient = useQueryClient();

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<PickListStatus>('draft');
  const [assignedTo, setAssignedTo] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<PickItem[]>([{ product_id: null, quantity_requested: 1, notes: '' }]);
  const [products, setProducts] = useState<Product[]>([]);
  const [openPopovers, setOpenPopovers] = useState<Record<number, boolean>>({});

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

  const addItem = () => setItems([...items, { product_id: null, quantity_requested: 1, notes: '' }]);
  const removeItem = (i: number) => setItems(items.filter((_, idx) => idx !== i));
  const updateItem = (i: number, updates: Partial<PickItem>) => {
    const next = [...items];
    next[i] = { ...next[i], ...updates };
    setItems(next);
  };

  const generatePickNumber = () => {
    const d = new Date();
    return `PL-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
  };

  const handleSubmit = async () => {
    if (!user || !activeBranch) { toast.error('User or branch information missing'); return; }
    const validItems = items.filter(it => it.product_id !== null && it.quantity_requested > 0);
    if (validItems.length === 0) { toast.error('Add at least one item with quantity'); return; }

    setLoading(true);
    try {
      const { data: pl, error: plError } = await supabase
        .from('pick_lists')
        .insert({
          pick_number: generatePickNumber(),
          status,
          branch_id: activeBranch.branch_id,
          user_id: user.id,
          created_by: user.id,
          assigned_to: assignedTo.trim() || null,
          notes: notes.trim() || null,
        })
        .select()
        .single();

      if (plError) throw plError;
      if (!pl) throw new Error('Failed to create pick list');

      const { error: itemsError } = await supabase.from('pick_list_items').insert(
        validItems.map(it => ({
          pick_list_id: pl.id,
          product_id: it.product_id,
          quantity_requested: it.quantity_requested,
          quantity_picked: 0,
          notes: it.notes.trim() || null,
        }))
      );
      if (itemsError) throw itemsError;

      queryClient.invalidateQueries({ queryKey: ['pickLists'] });
      toast.success('Pick list created');
      navigate(`/dashboard/pick-lists/${pl.id}/edit`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to create pick list');
    } finally {
      setLoading(false);
    }
  };

  const totalItems = items.filter(it => it.product_id).length;
  const totalQty = items.filter(it => it.product_id).reduce((s, it) => s + it.quantity_requested, 0);

  return (
    <div className="h-screen flex flex-col min-h-0 p-6">
      <PageFormLayout
        title="New Pick List"
        backTo="/dashboard/pick-lists"
        backLabel="Back"
        primaryAction={<Button onClick={handleSubmit} disabled={loading}>{loading ? 'Creating...' : 'Create Pick List'}</Button>}
        secondaryContent={<Button variant="outline" onClick={() => navigate('/dashboard/pick-lists')} disabled={loading}>Cancel</Button>}
      >
        <div className="space-y-6">
          {/* Header fields */}
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="assignedTo">Assigned To <span className="text-gray-400 font-normal">(optional)</span></Label>
                <Input id="assignedTo" value={assignedTo} onChange={e => setAssignedTo(e.target.value)} placeholder="Enter name" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={(v: PickListStatus) => setStatus(v)}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                  </SelectContent>
                </Select>
                <div className="mt-2">
                  <Badge className={STATUS_COLORS[status]}>{status.replace('_', ' ')}</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Additional notes..." rows={3} className="mt-1" />
          </div>

          {/* Items */}
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
            <div className="flex justify-between items-center mb-4">
              <Label>Items to Pick</Label>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="w-4 h-4 mr-2" />Add Item
              </Button>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => {
                const selectedProduct = products.find(p => p.id === item.product_id);
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
                              {selectedProduct
                                ? <span className="flex items-center gap-2">{selectedProduct.name} <span className="text-xs text-gray-400">In stock: {selectedProduct.quantity_in_stock}</span></span>
                                : 'Select product'}
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
                            <div className="border-t p-1">
                              <Link to="/dashboard/categories">
                                <Button type="button" variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground" onClick={() => setOpenPopovers(prev => ({ ...prev, [index]: false }))}>
                                  <Plus className="h-4 w-4" />add new
                                </Button>
                              </Link>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div>
                        <Label>Qty to Pick</Label>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity_requested || ''}
                          onChange={e => updateItem(index, { quantity_requested: parseInt(e.target.value) || 1 })}
                          className="mt-1"
                        />
                        {selectedProduct && item.quantity_requested > selectedProduct.quantity_in_stock && (
                          <p className="text-xs text-red-500 mt-1">Exceeds stock ({selectedProduct.quantity_in_stock})</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label>Item Notes</Label>
                      <Input value={item.notes} onChange={e => updateItem(index, { notes: e.target.value })} placeholder="Optional notes for this item" className="mt-1" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 flex justify-between items-center">
            <span className="text-sm text-gray-600">{totalItems} product(s) to pick</span>
            <span className="text-lg font-semibold text-gray-900">Total qty: {totalQty}</span>
          </div>
        </div>
      </PageFormLayout>
    </div>
  );
}
