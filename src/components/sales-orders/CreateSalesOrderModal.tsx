import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { toast } from 'sonner';
import { Plus, Trash2, User, Calendar, CreditCard, Truck, Package, FileText, DollarSign } from 'lucide-react';
import { Product } from '@/types/stockTypes';
import { format } from 'date-fns';

interface CreateSalesOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSOCreated: () => void;
}

interface OrderItem {
  product_id: string;
  variant_id: string | null;
  quantity_ordered: number;
  unit_price: number;
  notes: string;
  product_name?: string;
}

export const CreateSalesOrderModal = ({
  isOpen,
  onClose,
  onSOCreated
}: CreateSalesOrderModalProps) => {
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  const [loading, setLoading] = useState(false);
  
  // Form state
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
    if (isOpen && activeBranch?.branch_id) {
      fetchProducts();
    }
  }, [isOpen, activeBranch?.branch_id]);

  const fetchProducts = async () => {
    if (!activeBranch?.branch_id) return;
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('branch_id', activeBranch.branch_id)
      .order('name');

    if (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
      return;
    }

    setProducts(data || []);
  };

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

  const generateSONumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `SO-${year}${month}${day}-${random}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'fulfilled': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getDeliveryStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'in_transit': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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

    setLoading(true);
    try {
      const soNumber = generateSONumber();
      const totalAmount = validItems.reduce((sum, item) => 
        sum + (item.quantity_ordered * item.unit_price), 0
      );

      // Create sales order
      const { data: so, error: soError } = await supabase
        .from('sales_orders')
        .insert({
          so_number: soNumber,
          status: status,
          customer_name: customerName.trim(),
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

      // Create sales order items
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

      const { error: itemsError } = await supabase
        .from('sales_order_items')
        .insert(soItems);

      if (itemsError) throw itemsError;

      toast.success(`Sales order ${soNumber} created successfully`);
      onSOCreated();
      onClose();
      
      // Reset form
      setCustomerName('');
      setOrderDate(format(new Date(), 'yyyy-MM-dd'));
      setStatus('draft');
      setPaymentStatus('pending');
      setDeliveryStatus('pending');
      setDeliveryDate('');
      setTrackingNumber('');
      setShippingAddress('');
      setNotes('');
      setItems([{ product_id: '', variant_id: null, quantity_ordered: 0, unit_price: 0, notes: '', product_name: '' }]);
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

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Create Sales Order
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-4 h-4" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="customerName">Customer Name *</Label>
                <Input
                  id="customerName"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter customer name"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Order Details */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Order Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                  <Select value={status} onValueChange={(value: any) => setStatus(value)}>
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
                    <Badge className={getStatusColor(status)}>
                      {status}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment & Delivery Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Payment & Delivery
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="paymentStatus">Payment Status</Label>
                  <Select value={paymentStatus} onValueChange={(value: any) => setPaymentStatus(value)}>
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
                    <Badge className={getPaymentStatusColor(paymentStatus)}>
                      {paymentStatus}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label htmlFor="deliveryStatus">Delivery Status</Label>
                  <Select value={deliveryStatus} onValueChange={(value: any) => setDeliveryStatus(value)}>
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
                    <Badge className={getDeliveryStatusColor(deliveryStatus)}>
                      {deliveryStatus.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Truck className="w-4 h-4" />
                Shipping Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="deliveryDate">Delivery Date</Label>
                  <Input
                    id="deliveryDate"
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="trackingNumber">Tracking Number</Label>
                  <Input
                    id="trackingNumber"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Enter tracking number"
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="shippingAddress">Shipping Address</Label>
                <Textarea
                  id="shippingAddress"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Enter shipping address"
                  rows={3}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Items */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Items
                </CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={addItem}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4 bg-gray-50">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">Item {index + 1}</h4>
                      {items.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(index)}
                        >
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
                        {item.product_id && item.product_name && (
                          <p className="text-xs text-gray-600 mt-1">
                            Selected: {item.product_name}
                          </p>
                        )}
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
                        Subtotal: ${(item.quantity_ordered * item.unit_price).toFixed(2)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Additional Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
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
            </CardContent>
          </Card>

          {/* Summary */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                  <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
                </div>
                <span className="text-2xl font-bold text-blue-600">
                  ${calculateTotal().toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
            {loading ? 'Creating...' : 'Create Sales Order'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

