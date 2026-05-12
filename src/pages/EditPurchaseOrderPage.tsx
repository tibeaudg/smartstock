/**
 * Edit Purchase Order Page
 * Form for editing an existing purchase order - layout matches Create Purchase Order exactly
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { useCurrency } from '@/hooks/useCurrency';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus, Trash2, ChevronDown, Check, PackageCheck } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ReceivePurchaseOrderModal } from '@/components/purchase-orders/ReceivePurchaseOrderModal';
import { Product, PurchaseOrder } from '@/types/stockTypes';
import { cn } from '@/lib/utils';

type ItemForm = {
  product_id: string | null;
  variant_id: string | null;
  quantity_ordered: number;
  unit_price: number;
  notes: string;
};

export default function EditPurchaseOrderPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  const { formatPrice } = useCurrency();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [poLoading, setPoLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [purchaseOrder, setPurchaseOrder] = useState<PurchaseOrder | null>(null);

  const [status, setStatus] = useState<'draft' | 'pending' | 'ordered' | 'received' | 'cancelled'>('draft');
  const [vendorName, setVendorName] = useState('');
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<ItemForm[]>([{ product_id: null, variant_id: null, quantity_ordered: 0, unit_price: 0, notes: '' }]);
  const [products, setProducts] = useState<Product[]>([]);
  const [openProductPopovers, setOpenProductPopovers] = useState<Record<number, boolean>>({});
  const [canEdit, setCanEdit] = useState(true);

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

  const fetchPO = useCallback(async () => {
    if (!id || !activeBranch?.branch_id) return;
    let query = supabase
      .from('purchase_orders')
      .select(`
        *,
        items:purchase_order_items(*)
      `)
      .eq('id', id)
      .eq('branch_id', activeBranch.branch_id);
    const { data, error } = await query.single();

    if (error || !data) {
      console.error('[EditPurchaseOrderPage] Fetch error:', { error, id, branchId: activeBranch?.branch_id });
      toast.error(error?.message || 'Purchase order not found');
      setPoLoading(false);
      return;
    }

    const po = data as PurchaseOrder & { items?: Array<{ id: string; product_id: string; variant_id: string | null; quantity_ordered: number; quantity_received: number; unit_price: number; notes: string | null; product?: { name: string } }> };
    setPurchaseOrder(po);
    setStatus((po.status as any) || 'draft');
    setVendorName(po.vendor_name || '');
      setExpectedDeliveryDate(po.expected_delivery_date ? new Date(po.expected_delivery_date).toISOString().slice(0, 10) : '');
      setNotes(po.notes || '');

      if (po.items && po.items.length > 0) {
        setItems(po.items.map((item: any) => ({
          product_id: item.product_id,
          variant_id: item.variant_id,
          quantity_ordered: item.quantity_ordered,
          unit_price: item.unit_price ?? 0,
          notes: item.notes || '',
        })));
      }

    setCanEdit(po.status === 'draft' || po.status === 'pending' || po.status === 'ordered');
    setPoLoading(false);
  }, [id, activeBranch?.branch_id]);

  useEffect(() => {
    if (id && activeBranch?.branch_id) {
      fetchPO();
    } else if (!activeBranch?.branch_id && id) {
      setPoLoading(false);
    }
  }, [id, activeBranch?.branch_id, fetchPO]);

  const addItem = () => {
    setItems([...items, { product_id: null, variant_id: null, quantity_ordered: 0, unit_price: 0, notes: '' }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, updates: Partial<ItemForm>) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], ...updates };
    setItems(newItems);
  };

  const handleSubmit = async () => {
    if (!id || !user || !activeBranch) return;
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

      const totalAmount = validItems.reduce((sum, item) => sum + (item.quantity_ordered * item.unit_price), 0);

      const { error: updateError } = await supabase
        .from('purchase_orders')
        .update({
          vendor_id: vendorId,
          vendor_name: trimmedName,
          status,
          expected_delivery_date: expectedDeliveryDate || null,
          total_amount: totalAmount,
          notes: notes.trim() || null,
        })
        .eq('id', id);

      if (updateError) throw updateError;

      const { data: existingItems } = await supabase
        .from('purchase_order_items')
        .select('product_id, quantity_received')
        .eq('purchase_order_id', id);

      const receivedByProduct = new Map(
        (existingItems || []).map((i: any) => [i.product_id, i.quantity_received ?? 0])
      );

      await supabase.from('purchase_order_items').delete().eq('purchase_order_id', id);

      const poItems = validItems.map((item) => {
        const qtyReceived = receivedByProduct.get(item.product_id!) ?? 0;
        return {
          purchase_order_id: id,
          product_id: item.product_id,
          variant_id: item.variant_id,
          quantity_ordered: item.quantity_ordered,
          quantity_received: Math.min(qtyReceived, item.quantity_ordered),
          unit_price: item.unit_price,
          total_price: item.quantity_ordered * item.unit_price,
          notes: item.notes.trim() || null,
        };
      });

      const { data: insertedItems, error: itemsError } = await supabase
        .from('purchase_order_items')
        .insert(poItems)
        .select('id, quantity_ordered, quantity_received');

      if (itemsError) throw itemsError;

      // When status is received, add stock for any unreceived quantities
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
      toast.success('Purchase order updated');
      navigate('/dashboard/purchase-orders');
    } catch (error) {
      console.error('Error updating purchase order:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update purchase order');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await supabase.from('purchase_order_items').delete().eq('purchase_order_id', id);
      await supabase.from('purchase_orders').delete().eq('id', id);
      queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] });
      toast.success('Purchase order deleted');
      navigate('/dashboard/purchase-orders');
      setShowDeleteDialog(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete');
    }
  };

  const totalAmount = items.reduce((sum, item) => sum + (item.quantity_ordered * item.unit_price), 0);

  if (poLoading) {
    return (
      <div className="flex items-center justify-center p-24">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <>
      <div className="h-screen flex flex-col min-h-0 p-6">
        <PageFormLayout
          title={purchaseOrder ? `Edit Purchase Order - ${purchaseOrder.po_number}` : 'Edit Purchase Order'}
          backTo="/dashboard/purchase-orders"
          backLabel="Back"
          primaryAction={
            <Button onClick={handleSubmit} disabled={loading || !canEdit} className="bg-blue-600 hover:bg-blue-700">
              {loading ? 'Saving...' : 'Save'}
            </Button>
          }
          secondaryContent={
            <>
              {(status === 'draft' || status === 'pending' || status === 'ordered') && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowReceiveModal(true)}
                  disabled={loading}
                >
                  <PackageCheck className="w-4 h-4 mr-1" />
                  Receive Items
                </Button>
              )}
              {canEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              )}
            </>
          }
        >
          <div className="space-y-6">
            {!canEdit && status === 'received' && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800 text-sm">
                This purchase order has been received. Some fields may be read-only.
              </div>
            )}

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
                    disabled={!canEdit}
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
                    disabled={!canEdit}
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={status} onValueChange={(v: typeof status) => setStatus(v)} disabled={!canEdit}>
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
                      Stock will be added when you save.
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
                disabled={!canEdit}
              />
            </div>

            {/* Items */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
              <div className="flex justify-between items-center mb-4">
                <Label>Items</Label>
                {canEdit && (
                  <Button type="button" variant="outline" size="sm" onClick={addItem}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Item
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4 bg-white">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">Item {index + 1}</h4>
                      {canEdit && items.length > 1 && (
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
                          onOpenChange={(open) => canEdit && setOpenProductPopovers((prev) => ({ ...prev, [index]: open }))}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={openProductPopovers[index] ?? false}
                              className="w-full justify-between font-normal mt-1"
                              disabled={!canEdit}
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
                                  <Plus className="w-4 h-4" />
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
                          disabled={!canEdit}
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
                          disabled={!canEdit}
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
                        disabled={!canEdit}
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

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete purchase order?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this purchase order and its items. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {purchaseOrder && (
        <ReceivePurchaseOrderModal
          purchaseOrder={purchaseOrder}
          isOpen={showReceiveModal}
          onClose={() => setShowReceiveModal(false)}
          onReceived={() => {
            setShowReceiveModal(false);
            fetchPO();
            queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] });
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['stockTransactions'] });
          }}
        />
      )}
    </>
  );
}
