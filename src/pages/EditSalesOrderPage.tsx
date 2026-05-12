/**
 * Edit Sales Order Page
 * Form for editing an existing sales order - layout matches Create Sales Order exactly
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageFormLayout } from '@/components/PageFormLayout';
import { Badge } from '@/components/ui/badge';
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
import { useCurrency } from '@/hooks/useCurrency';
import { useBranches } from '@/hooks/useBranches';
import { toast } from 'sonner';
import { Plus, Trash2, User, Calendar, CreditCard, Truck, Package, FileText, DollarSign, PackageCheck } from 'lucide-react';
import { Product, SalesOrder } from '@/types/stockTypes';
import { format } from 'date-fns';
import { CustomerAutocomplete } from '@/components/customers/CustomerAutocomplete';
import { FulfillSalesOrderModal } from '@/components/sales-orders/FulfillSalesOrderModal';
import { useQueryClient } from '@tanstack/react-query';

interface OrderItem {
  id?: string;
  product_id: string;
  variant_id: string | null;
  quantity_ordered: number;
  quantity_fulfilled: number;
  unit_price: number;
  notes: string;
  product_name?: string;
}

export default function EditSalesOrderPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  const { formatPrice } = useCurrency();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [soLoading, setSoLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showFulfillModal, setShowFulfillModal] = useState(false);
  const [salesOrder, setSalesOrder] = useState<SalesOrder | null>(null);

  const [customerName, setCustomerName] = useState('');
  const [orderDate, setOrderDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [status, setStatus] = useState<'draft' | 'pending' | 'fulfilled' | 'cancelled'>('draft');
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed' | 'refunded'>('pending');
  const [deliveryStatus, setDeliveryStatus] = useState<'pending' | 'in_transit' | 'delivered' | 'failed'>('pending');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<OrderItem[]>([
    { product_id: '', variant_id: null, quantity_ordered: 0, quantity_fulfilled: 0, unit_price: 0, notes: '' }
  ]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (user && activeBranch?.branch_id) {
      supabase
        .from('products')
        .select('*')
        .eq('user_id', user.id)
        .eq('branch_id', activeBranch.branch_id)
        .order('name')
        .then(({ data, error }) => {
          if (error) toast.error('Failed to load products');
          else setProducts(data || []);
        });
    }
  }, [user?.id, activeBranch?.branch_id]);

  const fetchSO = useCallback(async () => {
    if (!id || !activeBranch?.branch_id) return;
    let query = supabase
      .from('sales_orders')
      .select(`
        *,
        items:sales_order_items(*)
      `)
      .eq('id', id)
      .eq('branch_id', activeBranch.branch_id);
    const { data, error } = await query.single();

    if (error || !data) {
      console.error('[EditSalesOrderPage] Fetch error:', { error, id, branchId: activeBranch?.branch_id });
      toast.error(error?.message || 'Sales order not found');
      setSoLoading(false);
      return;
    }

    const so = data as SalesOrder & { items?: Array<{
      id: string;
      product_id: string;
      variant_id: string | null;
      quantity_ordered: number;
      quantity_fulfilled: number;
      unit_price: number;
      notes: string | null;
      product?: { name: string };
    }> };

    setSalesOrder(so);
    setCustomerName(so.customer_name || '');
      setOrderDate(so.order_date ? format(new Date(so.order_date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'));
      setStatus((so.status as any) || 'draft');
      setPaymentStatus((so.payment_status as any) || 'pending');
      setDeliveryStatus((so.delivery_status as any) || 'pending');
      setDeliveryDate(so.delivery_date ? format(new Date(so.delivery_date), 'yyyy-MM-dd') : '');
      setTrackingNumber(so.tracking_number || '');
      setShippingAddress(so.shipping_address || '');
      setNotes(so.notes || '');

      if (so.items && so.items.length > 0) {
        setItems(so.items.map((item: any) => ({
          id: item.id,
          product_id: item.product_id || '',
          variant_id: item.variant_id,
          quantity_ordered: item.quantity_ordered,
          quantity_fulfilled: item.quantity_fulfilled || 0,
          unit_price: item.unit_price ?? 0,
          notes: item.notes || '',
          product_name: item.product?.name,
        })));
      }

    setSoLoading(false);
  }, [id, activeBranch?.branch_id]);

  useEffect(() => {
    if (id && activeBranch?.branch_id) {
      fetchSO();
    } else if (!activeBranch?.branch_id && id) {
      setSoLoading(false);
    }
  }, [id, activeBranch?.branch_id, fetchSO]);

  const addItem = () => {
    setItems([...items, {
      product_id: '',
      variant_id: null,
      quantity_ordered: 0,
      quantity_fulfilled: 0,
      unit_price: 0,
      notes: '',
    }]);
  };

  const removeItem = (index: number) => {
    if (items.length === 1) {
      toast.error('Sales order must have at least one item');
      return;
    }
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof OrderItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleProductChange = (index: number, productId: string) => {
    const product = products.find(p => p.id === productId);
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      product_id: productId,
      product_name: product?.name || '',
      unit_price: product?.sale_price || 0,
      quantity_ordered: newItems[index].quantity_ordered || 1
    };
    setItems(newItems);
  };

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'fulfilled': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (s: string) => {
    switch (s) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getDeliveryStatusColor = (s: string) => {
    switch (s) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'in_transit': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => {
      if (item.product_id && item.quantity_ordered > 0 && item.unit_price > 0) {
        return sum + (item.quantity_ordered * item.unit_price);
      }
      return sum;
    }, 0);
  };

  const handleSubmit = async () => {
    if (!id || !user || !activeBranch) return;
    if (!customerName.trim()) {
      toast.error('Customer name is required');
      return;
    }
    const validItems = items.filter(item => item.product_id && item.quantity_ordered > 0);
    if (validItems.length === 0) {
      toast.error('Add at least one item with a product and quantity');
      return;
    }

    setLoading(true);
    try {
      const trimmedName = customerName.trim();
      let customerId: string | null = null;
      const { data: existingCustomers } = await supabase
        .from('customers')
        .select('id, name, legal_name, commercial_name')
        .eq('user_id', user.id);

      const match = existingCustomers?.find(
        (c: { name?: string; legal_name?: string; commercial_name?: string }) =>
          (c.name?.toLowerCase() === trimmedName.toLowerCase()) ||
          (c.legal_name?.toLowerCase() === trimmedName.toLowerCase()) ||
          (c.commercial_name?.toLowerCase() === trimmedName.toLowerCase())
      );

      if (match) {
        customerId = match.id;
      } else {
        const { data: newCustomer, error: customerError } = await supabase
          .from('customers')
          .insert({ name: trimmedName, legal_name: trimmedName, user_id: user.id })
          .select('id')
          .single();
        if (!customerError && newCustomer) {
          customerId = newCustomer.id;
          queryClient.invalidateQueries({ queryKey: ['customers'] });
        }
      }

      const totalAmount = calculateTotal();

      const { error: soError } = await supabase
        .from('sales_orders')
        .update({
          customer_id: customerId,
          customer_name: trimmedName,
          status,
          payment_status: paymentStatus,
          delivery_status: deliveryStatus,
          delivery_date: deliveryDate ? new Date(deliveryDate).toISOString() : null,
          tracking_number: trackingNumber.trim() || null,
          shipping_address: shippingAddress.trim() || null,
          notes: notes.trim() || null,
          order_date: new Date(orderDate).toISOString(),
          total_amount: totalAmount,
          ...(status === 'fulfilled' && { fulfillment_date: new Date().toISOString() }),
        })
        .eq('id', id);

      if (soError) throw soError;

      const existingItemIds = items.filter(item => item.id).map(item => item.id!);
      const { data: allExisting } = await supabase
        .from('sales_order_items')
        .select('id')
        .eq('sales_order_id', id);
      const allIds = (allExisting || []).map((r: any) => r.id);
      const toDelete = allIds.filter((x: string) => !existingItemIds.includes(x));

      if (toDelete.length > 0) {
        await supabase.from('sales_order_items').delete().in('id', toDelete);
      }

      for (const item of validItems) {
        if (item.id) {
          await supabase
            .from('sales_order_items')
            .update({
              product_id: item.product_id,
              variant_id: item.variant_id,
              quantity_ordered: item.quantity_ordered,
              unit_price: item.unit_price,
              total_price: item.quantity_ordered * item.unit_price,
              notes: item.notes.trim() || null,
            })
            .eq('id', item.id);
        } else {
          await supabase.from('sales_order_items').insert({
            sales_order_id: id,
            product_id: item.product_id,
            variant_id: item.variant_id,
            quantity_ordered: item.quantity_ordered,
            quantity_fulfilled: item.quantity_fulfilled || 0,
            unit_price: item.unit_price,
            total_price: item.quantity_ordered * item.unit_price,
            notes: item.notes.trim() || null,
          });
        }
      }

      // When status is fulfilled, deduct stock for any unfulfilled quantities
      if (status === 'fulfilled') {
        const { data: soItems } = await supabase
          .from('sales_order_items')
          .select('id, quantity_ordered, quantity_fulfilled')
          .eq('sales_order_id', id);

        for (const soi of soItems || []) {
          const remaining = soi.quantity_ordered - (soi.quantity_fulfilled || 0);
          if (remaining > 0) {
            const { error: txError } = await supabase.rpc('create_sales_order_transaction', {
              p_so_item_id: soi.id,
              p_quantity_fulfilled: remaining,
              p_fulfilled_by: user.id,
            });
            if (txError) throw txError;
          }
        }
      }

      queryClient.invalidateQueries({ queryKey: ['salesOrders'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['stockTransactions'] });
      queryClient.invalidateQueries({ queryKey: ['productTransactions'] });
      toast.success('Sales order updated');
      navigate('/dashboard/sales-orders');
    } catch (error) {
      console.error('Error updating sales order:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update sales order');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await supabase.from('sales_order_items').delete().eq('sales_order_id', id);
      await supabase.from('sales_orders').delete().eq('id', id);
      queryClient.invalidateQueries({ queryKey: ['salesOrders'] });
      toast.success('Sales order deleted');
      navigate('/dashboard/sales-orders');
      setShowDeleteDialog(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete');
    }
  };

  if (soLoading) {
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
          title={salesOrder ? `Edit Sales Order - ${salesOrder.so_number}` : 'Edit Sales Order'}
          backTo="/dashboard/sales-orders"
          backLabel="Back"
          primaryAction={
            <Button onClick={handleSubmit} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? 'Saving...' : 'Save'}
            </Button>
          }
          secondaryContent={
            <>
              {(status === 'pending' || status === 'draft') && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFulfillModal(true)}
                  disabled={loading}
                >
                  <PackageCheck className="w-4 h-4 mr-1" />
                  Fulfill Items
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
             
            </>
          }
        >
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <User className="w-4 h-4" />
                Customer Information
              </h3>
              <CustomerAutocomplete
                value={customerName}
                onChange={setCustomerName}
                placeholder="Enter customer name"
                label="Customer Name"
                required
              />
            </div>

            {/* Order Details */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <Calendar className="w-4 h-4" />
                Order Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="orderDate">Order Date *</Label>
                  <Input
                    id="orderDate"
                    type="date"
                    value={orderDate}
                    onChange={(e) => setOrderDate(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={status} onValueChange={(v: any) => setStatus(v)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="fulfilled">Fulfilled</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="mt-2">
                    <Badge className={getStatusColor(status)}>{status}</Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment & Delivery */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <CreditCard className="w-4 h-4" />
                Payment & Delivery
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="paymentStatus">Payment Status</Label>
                  <Select value={paymentStatus} onValueChange={(v: any) => setPaymentStatus(v)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="mt-2">
                    <Badge className={getPaymentStatusColor(paymentStatus)}>{paymentStatus}</Badge>
                  </div>
                </div>
                <div>
                  <Label htmlFor="deliveryStatus">Delivery Status</Label>
                  <Select value={deliveryStatus} onValueChange={(v: any) => setDeliveryStatus(v)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_transit">In Transit</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="mt-2">
                    <Badge className={getDeliveryStatusColor(deliveryStatus)}>{deliveryStatus.replace('_', ' ')}</Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <Truck className="w-4 h-4" />
                Shipping Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="deliveryDate">Delivery Date</Label>
                  <Input id="deliveryDate" type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="trackingNumber">Tracking Number</Label>
                  <Input id="trackingNumber" value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} placeholder="Enter tracking number" className="mt-1" />
                </div>
              </div>
              <div className="mt-4">
                <Label htmlFor="shippingAddress">Shipping Address</Label>
                <Textarea id="shippingAddress" value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} placeholder="Enter shipping address" rows={3} className="mt-1" />
              </div>
            </div>

            {/* Items */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Items
                </h3>
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
                        <Label>Product *</Label>
                        <select
                          className="w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-1"
                          value={item.product_id}
                          onChange={(e) => handleProductChange(index, e.target.value)}
                        >
                          <option value="">Select product</option>
                          {products.map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.name} (Stock: {product.quantity_in_stock || 0})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label>Quantity *</Label>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity_ordered || ''}
                          onChange={(e) => updateItem(index, 'quantity_ordered', parseInt(e.target.value) || 0)}
                          placeholder="0"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Unit Price *</Label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.unit_price || ''}
                          onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    {item.product_id && item.quantity_ordered > 0 && item.unit_price > 0 && (
                      <div className="text-right text-sm text-gray-600 font-medium">
                        Subtotal: {formatPrice(item.quantity_ordered * item.unit_price)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <FileText className="w-4 h-4" />
                Additional Information
              </h3>
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Additional notes..." rows={3} className="mt-1" />
            </div>

            {/* Total */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                  <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
                </div>
                <span className="text-2xl font-bold text-blue-600">{formatPrice(calculateTotal())}</span>
              </div>
            </div>
          </div>
        </PageFormLayout>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete sales order?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this sales order and its items. This cannot be undone.
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

      {salesOrder && (
        <FulfillSalesOrderModal
          salesOrder={salesOrder}
          isOpen={showFulfillModal}
          onClose={() => setShowFulfillModal(false)}
          onFulfilled={() => {
            setShowFulfillModal(false);
            fetchSO();
            queryClient.invalidateQueries({ queryKey: ['salesOrders'] });
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['stockTransactions'] });
          }}
        />
      )}
    </>
  );
}
