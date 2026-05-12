import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageFormLayout } from '@/components/PageFormLayout';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useCurrency } from '@/hooks/useCurrency';
import { useBranches } from '@/hooks/useBranches';
import { toast } from 'sonner';
import { Plus, Trash2, User, Calendar, CreditCard, Truck, Package, FileText, DollarSign } from 'lucide-react';
import { Product } from '@/types/stockTypes';
import { format } from 'date-fns';
import { CustomerAutocomplete } from '@/components/customers/CustomerAutocomplete';
import { useQueryClient } from '@tanstack/react-query';

interface OrderItem {
  product_id: string;
  variant_id: string | null;
  quantity_ordered: number;
  unit_price: number;
  notes: string;
  product_name?: string;
}

export default function CreateSalesOrderPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  const { formatPrice } = useCurrency();
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();
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
    { product_id: '', variant_id: null, quantity_ordered: 0, unit_price: 0, notes: '', product_name: '' }
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

  const addItem = () => {
    setItems([...items, {
      product_id: '',
      variant_id: null,
      quantity_ordered: 0,
      unit_price: 0,
      notes: '',
      product_name: ''
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
    const salePrice = product?.sale_price ?? 0;
    if (product && salePrice === 0) {
      toast.warning(`"${product.name}" has no sale price set. The order total and transaction value will be $0.`);
    }
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      product_id: productId,
      product_name: product?.name || '',
      unit_price: salePrice,
      quantity_ordered: newItems[index].quantity_ordered || 1
    };
    setItems(newItems);
  };

  const generateSONumber = () => {
    const date = new Date();
    return `SO-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
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

  const handleSubmit = async () => {
    if (!user || !activeBranch) {
      toast.error('User or branch information missing');
      return;
    }
    if (!customerName.trim()) {
      toast.error('Customer name is required');
      return;
    }
    const validItems = items.filter(item => item.product_id && item.quantity_ordered > 0);
    if (validItems.length === 0) {
      toast.error('Add at least one item with a product and quantity');
      return;
    }

    // When creating as fulfilled, validate stock availability first
    if (status === 'fulfilled') {
      const productIds = [...new Set(validItems.map(i => i.variant_id || i.product_id).filter(Boolean))];
      if (productIds.length > 0) {
        const { data: stockData } = await supabase
          .from('products')
          .select('id, quantity_in_stock, name')
          .in('id', productIds);
        const stockMap = new Map((stockData || []).map(p => [p.id, { name: p.name, qty: Number(p.quantity_in_stock) || 0 }]));
        for (const item of validItems) {
          const productId = item.variant_id || item.product_id;
          const prod = productId ? stockMap.get(productId) : null;
          const availableStock = prod?.qty ?? 0;
          if (availableStock < item.quantity_ordered) {
            toast.error(
              `Insufficient stock for ${prod?.name ?? 'product'}. Available: ${availableStock}, Requested: ${item.quantity_ordered}`
            );
            return;
          }
        }
      }
    }

    setLoading(true);
    try {
      const trimmedName = customerName.trim();

      // Auto-save customer to customers table if not already present
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
          .insert({
            name: trimmedName,
            legal_name: trimmedName,
            user_id: user.id,
          })
          .select('id')
          .single();
        if (!customerError && newCustomer) {
          customerId = newCustomer.id;
          queryClient.invalidateQueries({ queryKey: ['customers'] });
        }
      }

      const soNumber = generateSONumber();
      const totalAmount = validItems.reduce((sum, item) => sum + (item.quantity_ordered * item.unit_price), 0);

      const { data: so, error: soError } = await supabase
        .from('sales_orders')
        .insert({
          so_number: soNumber,
          status,
          customer_id: customerId,
          customer_name: trimmedName,
          total_amount: totalAmount,
          branch_id: activeBranch.branch_id,
          user_id: user.id,
          created_by: user.id,
          notes: notes.trim() || null,
          order_date: new Date(orderDate).toISOString(),
          payment_status: paymentStatus,
          delivery_status: deliveryStatus,
          delivery_date: deliveryDate ? new Date(deliveryDate).toISOString() : null,
          tracking_number: trackingNumber.trim() || null,
          shipping_address: shippingAddress.trim() || null,
        })
        .select()
        .single();

      if (soError) throw soError;
      if (!so) throw new Error('Failed to create sales order');

      const soItems = validItems.map(item => ({
        sales_order_id: so.id,
        product_id: item.product_id,
        variant_id: item.variant_id,
        quantity_ordered: item.quantity_ordered,
        quantity_fulfilled: 0,
        unit_price: item.unit_price,
        total_price: item.quantity_ordered * item.unit_price,
        notes: item.notes.trim() || null,
      }));

      const { data: insertedItems, error: itemsError } = await supabase
        .from('sales_order_items')
        .insert(soItems)
        .select('id, quantity_ordered');

      if (itemsError) throw itemsError;

      // When status is fulfilled, deduct stock and create stock transactions for each item
      if (status === 'fulfilled' && insertedItems?.length) {
        for (const item of insertedItems) {
          const { error: fulfillError } = await supabase.rpc('create_sales_order_transaction', {
            p_so_item_id: item.id,
            p_quantity_fulfilled: item.quantity_ordered,
            p_fulfilled_by: user.id,
          });
          if (fulfillError) throw fulfillError;
        }
        await supabase
          .from('sales_orders')
          .update({ fulfillment_date: new Date().toISOString() })
          .eq('id', so.id);
      }

      queryClient.invalidateQueries({ queryKey: ['salesOrders'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['stockTransactions'] });
      queryClient.invalidateQueries({ queryKey: ['productTransactions'] });
      toast.success(`Sales order ${soNumber} created successfully`);
      navigate('/dashboard/sales-orders');
    } catch (error) {
      console.error('Error creating sales order:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create sales order');
    } finally {
      setLoading(false);
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

  return (
    <div className="h-screen flex flex-col min-h-0 p-6">
      <PageFormLayout
        title="Create Sales Order"
        backTo="/dashboard/sales-orders"
        backLabel="Back"
        primaryAction={
          <Button onClick={handleSubmit} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
            {loading ? 'Creating...' : 'Create Sales Order'}
          </Button>
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
                {status === 'draft' || status === 'pending' ? (
                  <p className="mt-2 text-sm text-amber-700 bg-amber-50 rounded px-2 py-1.5">
                    Stock will be deducted when this order is fulfilled.
                  </p>
                ) : status === 'fulfilled' ? (
                  <p className="mt-2 text-sm text-green-700 bg-green-50 rounded px-2 py-1.5">
                    Stock will be deducted immediately upon creation.
                  </p>
                ) : null}
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
  );
}
