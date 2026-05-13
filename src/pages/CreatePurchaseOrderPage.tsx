import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PageFormLayout } from '@/components/PageFormLayout';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { useCurrency } from '@/hooks/useCurrency';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus, Trash2, ChevronDown, Check } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types/stockTypes';
import { cn } from '@/lib/utils';

export default function CreatePurchaseOrderPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  const { formatPrice } = useCurrency();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'draft' | 'pending' | 'ordered' | 'received' | 'cancelled'>('draft');
  const [vendorName, setVendorName] = useState('');
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<Array<{
    product_id: string | null;
    variant_id: string | null;
    quantity_ordered: number;
    unit_price: number;
    notes: string;
  }>>([{ product_id: null, variant_id: null, quantity_ordered: 0, unit_price: 0, notes: '' }]);
  const [products, setProducts] = useState<Product[]>([]);
  const [openProductPopovers, setOpenProductPopovers] = useState<Record<number, boolean>>({});

  const fetchProducts = async () => {
    if (!user || !activeBranch?.branch_id) return;
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', user.id)
      .eq('branch_id', activeBranch.branch_id)
      .or('is_variant.is.null,is_variant.eq.false')
      .order('name');
    if (error) {
      console.error('Error fetching products:', error);
      return;
    }
    setProducts(data || []);
  };

  useEffect(() => {
    if (user && activeBranch?.branch_id) fetchProducts();
  }, [user?.id, activeBranch?.branch_id]);

  const addItem = () => {
    setItems([...items, { product_id: null, variant_id: null, quantity_ordered: 0, unit_price: 0, notes: '' }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, updates: Partial<typeof items[0]>) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], ...updates };
    setItems(newItems);
  };

  const generatePONumber = () => {
    const date = new Date();
    return `PO-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
  };

  const handleSubmit = async () => {
    if (!user || !activeBranch) {
      toast.error('User or warehouse information missing');
      return;
    }
    if (!vendorName.trim()) {
      toast.error('Vendor name is required');
      return;
    }
    const validItems = items.filter(item => item.product_id && item.quantity_ordered > 0);
    if (validItems.length === 0) {
      toast.error('Add at least one item with quantity');
      return;
    }

    setLoading(true);
    try {
      const trimmedName = vendorName.trim();

      // Auto-save supplier to suppliers table if not already present
      let vendorId: string | null = null;
      const { data: existingSuppliers } = await supabase
        .from('suppliers')
        .select('id, name')
        .eq('user_id', user.id);

      const match = existingSuppliers?.find(
        (s: { name?: string }) => s.name?.toLowerCase() === trimmedName.toLowerCase()
      );

      if (match) {
        vendorId = match.id;
      } else {
        const { data: newSupplier, error: supplierError } = await supabase
          .from('suppliers')
          .insert({ name: trimmedName, user_id: user.id })
          .select('id')
          .single();
        if (!supplierError && newSupplier) {
          vendorId = newSupplier.id;
          queryClient.invalidateQueries({ queryKey: ['suppliers'] });
        }
      }

      const poNumber = generatePONumber();
      const totalAmount = validItems.reduce((sum, item) => sum + (item.quantity_ordered * item.unit_price), 0);

      const { data: po, error: poError } = await supabase
        .from('purchase_orders')
        .insert({
          po_number: poNumber,
          status,
          vendor_id: vendorId,
          vendor_name: trimmedName,
          expected_delivery_date: expectedDeliveryDate || null,
          total_amount: totalAmount,
          branch_id: activeBranch.branch_id,
          user_id: user.id,
          created_by: user.id,
          notes: notes.trim() || null,
        })
        .select()
        .single();

      if (poError) throw poError;
      if (!po) throw new Error('Failed to create purchase order');

      const poItems = validItems.map(item => ({
        purchase_order_id: po.id,
        product_id: item.product_id,
        variant_id: item.variant_id,
        quantity_ordered: item.quantity_ordered,
        quantity_received: 0,
        unit_price: item.unit_price,
        total_price: item.quantity_ordered * item.unit_price,
        notes: item.notes.trim() || null,
      }));

      const { data: insertedItems, error: itemsError } = await supabase
        .from('purchase_order_items')
        .insert(poItems)
        .select('id, quantity_ordered, quantity_received');

      if (itemsError) throw itemsError;

      // When status is received, add stock for each item
      if (status === 'received' && insertedItems?.length && user) {
        for (const item of insertedItems) {
          const remaining = item.quantity_ordered - (item.quantity_received || 0);
          if (remaining > 0) {
            const { error: txError } = await supabase.rpc('create_purchase_order_transaction', {
              p_po_item_id: item.id,
              p_quantity_received: remaining,
              p_received_by: user.id,
            });
            if (txError) throw txError;
          }
        }
        queryClient.invalidateQueries({ queryKey: ['products'] });
        queryClient.invalidateQueries({ queryKey: ['stockTransactions'] });
        queryClient.invalidateQueries({ queryKey: ['productTransactions'] });
      }

      queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] });
      toast.success('Purchase order created successfully');
      navigate('/dashboard/purchase-orders');
    } catch (error) {
      console.error('Error creating purchase order:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create purchase order');
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = items.reduce((sum, item) => sum + (item.quantity_ordered * item.unit_price), 0);

  return (
    <div className="h-screen flex flex-col min-h-0 p-6">
    <PageFormLayout
      title="Create Purchase Order"
      backTo="/dashboard/purchase-orders"
      backLabel="Back"
      primaryAction={
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Creating...' : 'Create Purchase Order'}
        </Button>
      }
      secondaryContent={
        <Button variant="outline" onClick={() => navigate('/dashboard/purchase-orders')} disabled={loading}>
          Cancel
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Vendor, Date and Status */}
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="vendorName">Vendor Name *</Label>
              <Input
                id="vendorName"
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                placeholder="Enter vendor name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="expectedDeliveryDate">Expected Delivery Date</Label>
              <Input
                id="expectedDeliveryDate"
                type="date"
                value={expectedDeliveryDate}
                onChange={(e) => setExpectedDeliveryDate(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(v: typeof status) => setStatus(v)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="ordered">Ordered</SelectItem>
                  <SelectItem value="received">Received</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <div className="mt-2">
                <Badge
                  className={
                    status === 'received'
                      ? 'bg-green-100 text-green-800'
                      : status === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : status === 'ordered'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                  }
                >
                  {status}
                </Badge>
              </div>
              {status === 'received' && (
                <p className="text-xs text-gray-600 mt-1">
                  Stock will be added when this order is created.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional notes..."
            rows={3}
            className="mt-1"
          />
        </div>

        {/* Items */}
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
          <div className="flex justify-between items-center mb-4">
            <Label>Items</Label>
            <Button type="button" variant="outline" size="sm" onClick={addItem}>
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </div>

          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4 bg-white">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">Item {index + 1}</h4>
                  {items.length > 1 && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(index)}>
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <Label>Product</Label>
                    <Popover
                      open={openProductPopovers[index] ?? false}
                      onOpenChange={(open) =>
                        setOpenProductPopovers((prev) => ({ ...prev, [index]: open }))
                      }
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openProductPopovers[index] ?? false}
                          className="w-full justify-between font-normal mt-1"
                        >
                          {item.product_id
                            ? products.find((p) => p.id === item.product_id)?.name ?? 'Select product'
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
                              {products.map((product) => (
                                <CommandItem
                                  key={product.id}
                                  value={product.name}
                                  onSelect={() => {
                                    updateItem(index, {
                                      product_id: product.id,
                                      variant_id: null,
                                      unit_price: product.purchase_price ?? product.unit_price ?? 0,
                                    });
                                    setOpenProductPopovers((prev) => ({ ...prev, [index]: false }));
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      item.product_id === product.id ? 'opacity-100' : 'opacity-0'
                                    )}
                                  />
                                  {product.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                        <div className="border-t p-1">
                          <Link to="/dashboard/products/new">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
                              onClick={() => setOpenProductPopovers((prev) => ({ ...prev, [index]: false }))}
                            >
                              <Plus className="h-4 w-4" />
                              add new
                            </Button>
                          </Link>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity_ordered || ''}
                      onChange={(e) => updateItem(index, { quantity_ordered: parseInt(e.target.value) || 0 })}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>Unit Price</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.unit_price || ''}
                      onChange={(e) => updateItem(index, { unit_price: parseFloat(e.target.value) || 0 })}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label>Item Notes</Label>
                  <Input
                    value={item.notes}
                    onChange={(e) => updateItem(index, { notes: e.target.value })}
                    placeholder="Optional notes for this item"
                    className="mt-1"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Total Amount:</span>
            <span className="text-xl font-bold">{formatPrice(totalAmount)}</span>
          </div>
        </div>
      </div>
    </PageFormLayout>
    </div>
  );
}
