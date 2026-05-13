import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PageFormLayout } from '@/components/PageFormLayout';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus, Trash2, ChevronDown, Check } from 'lucide-react';
import { Product } from '@/types/stockTypes';
import { cn } from '@/lib/utils';

type CountItem = {
  product_id: string | null;
  expected_quantity: number;
  counted_quantity: number;
  notes: string;
};

export default function CreateStockCountPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  const queryClient = useQueryClient();

  const [loading, setLoading] = useState(false);
  const [countDate, setCountDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [items, setItems] = useState<CountItem[]>([{ product_id: null, expected_quantity: 0, counted_quantity: 0, notes: '' }]);
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

  const addItem = () => setItems([...items, { product_id: null, expected_quantity: 0, counted_quantity: 0, notes: '' }]);
  const removeItem = (i: number) => setItems(items.filter((_, idx) => idx !== i));
  const updateItem = (i: number, updates: Partial<CountItem>) => {
    const next = [...items];
    next[i] = { ...next[i], ...updates };
    setItems(next);
  };

  const selectProduct = (index: number, product: Product) => {
    updateItem(index, {
      product_id: product.id,
      expected_quantity: product.quantity_in_stock,
      counted_quantity: product.quantity_in_stock,
    });
    setOpenPopovers(prev => ({ ...prev, [index]: false }));
  };

  const generateCountNumber = () => {
    const d = new Date();
    return `SC-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
  };

  const handleSubmit = async () => {
    if (!user || !activeBranch) { toast.error('User or warehouse information missing'); return; }
    const validItems = items.filter(it => it.product_id !== null);
    if (validItems.length === 0) { toast.error('Add at least one product to count'); return; }

    setLoading(true);
    try {
      const discrepancies = validItems.filter(it => it.counted_quantity !== it.expected_quantity).length;

      const { data: sc, error: scError } = await supabase
        .from('cycle_counts')
        .insert({
          count_number: generateCountNumber(),
          status: 'draft',
          count_date: new Date(countDate).toISOString(),
          branch_id: activeBranch.branch_id,
          user_id: user.id,
          created_by: user.id,
          notes: notes.trim() || null,
          location_filter: locationFilter.trim() || null,
          total_items_counted: validItems.length,
          discrepancy_count: discrepancies,
        })
        .select()
        .single();

      if (scError) throw scError;
      if (!sc) throw new Error('Failed to create stock count');

      const countItems = validItems.map(it => ({
        cycle_count_id: sc.id,
        product_id: it.product_id,
        expected_quantity: it.expected_quantity,
        counted_quantity: it.counted_quantity,
        variance: it.counted_quantity - it.expected_quantity,
        variance_value: 0,
        notes: it.notes.trim() || null,
      }));

      const { error: itemsError } = await supabase.from('cycle_count_items').insert(countItems);
      if (itemsError) throw itemsError;

      queryClient.invalidateQueries({ queryKey: ['stockCounts'] });
      toast.success('Stock count created');
      navigate(`/dashboard/stock-counts/${sc.id}/edit`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to create stock count');
    } finally {
      setLoading(false);
    }
  };

  const variance = (item: CountItem) => item.counted_quantity - item.expected_quantity;

  return (
    <div className="h-screen flex flex-col min-h-0 p-6">
      <PageFormLayout
        title="New Stock Count"
        backTo="/dashboard/stock-counts"
        backLabel="Back"
        primaryAction={<Button onClick={handleSubmit} disabled={loading}>{loading ? 'Creating...' : 'Create Stock Count'}</Button>}
        secondaryContent={<Button variant="outline" onClick={() => navigate('/dashboard/stock-counts')} disabled={loading}>Cancel</Button>}
      >
        <div className="space-y-6">
          {/* Header fields */}
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="countDate">Count Date</Label>
                <Input id="countDate" type="date" value={countDate} onChange={e => setCountDate(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="locationFilter">Location Filter <span className="text-gray-400 font-normal">(optional)</span></Label>
                <Input id="locationFilter" value={locationFilter} onChange={e => setLocationFilter(e.target.value)} placeholder="e.g. Warehouse A" className="mt-1" />
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
              <Label>Products to Count</Label>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="w-4 h-4 mr-2" />Add Product
              </Button>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => {
                const selectedProduct = products.find(p => p.id === item.product_id);
                const v = variance(item);
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
                        <Label>Expected Qty</Label>
                        <Input type="number" min="0" value={item.expected_quantity} onChange={e => updateItem(index, { expected_quantity: parseInt(e.target.value) || 0 })} className="mt-1" />
                      </div>

                      <div>
                        <Label>Counted Qty</Label>
                        <Input type="number" min="0" value={item.counted_quantity} onChange={e => updateItem(index, { counted_quantity: parseInt(e.target.value) || 0 })} className="mt-1" />
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <Label>Notes</Label>
                        <Input value={item.notes} onChange={e => updateItem(index, { notes: e.target.value })} placeholder="Optional notes for this item" className="mt-1" />
                      </div>
                      <div className="text-right pt-5">
                        <span className="text-xs text-gray-500">Variance</span>
                        <p className={cn('text-sm font-semibold', v > 0 ? 'text-green-600' : v < 0 ? 'text-red-600' : 'text-gray-500')}>
                          {v > 0 ? `+${v}` : v}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 flex justify-between items-center">
            <span className="text-sm text-gray-600">{items.filter(it => it.product_id).length} product(s) to count</span>
            <span className="text-sm text-amber-600 font-medium">
              {items.filter(it => it.product_id && it.counted_quantity !== it.expected_quantity).length} discrepancy(ies)
            </span>
          </div>
        </div>
      </PageFormLayout>
    </div>
  );
}
