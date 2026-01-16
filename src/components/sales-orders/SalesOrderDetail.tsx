import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { SalesOrder, SalesOrderItem, Product } from '@/types/stockTypes';
import { format } from 'date-fns';
import { Check, ShoppingCart, Trash2, Save, User, Calendar, CreditCard, Truck, Package, FileText, DollarSign, Plus } from 'lucide-react';
import { FulfillSalesOrderModal } from './FulfillSalesOrderModal';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';

interface SalesOrderDetailProps {
  salesOrder: SalesOrder;
  isOpen: boolean;
  onClose: () => void;
  onSOUpdated: () => void;
}

interface OrderItemForm {
  id?: string;
  product_id: string;
  variant_id: string | null;
  quantity_ordered: number;
  quantity_fulfilled: number;
  unit_price: number;
  total_price: number;
  notes: string;
  product_name?: string;
  isNew?: boolean;
}

export const SalesOrderDetail = ({
  salesOrder,
  isOpen,
  onClose,
  onSOUpdated
}: SalesOrderDetailProps) => {
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  const [showFulfillModal, setShowFulfillModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  // Form state
  const [customerName, setCustomerName] = useState(salesOrder.customer_name || '');
  const [orderDate, setOrderDate] = useState(
    salesOrder.order_date ? format(new Date(salesOrder.order_date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')
  );
  const [status, setStatus] = useState<'draft' | 'pending' | 'fulfilled' | 'cancelled'>(salesOrder.status);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed' | 'refunded'>(
    salesOrder.payment_status || 'pending'
  );
  const [deliveryStatus, setDeliveryStatus] = useState<'pending' | 'in_transit' | 'delivered' | 'failed'>(
    salesOrder.delivery_status || 'pending'
  );
  const [deliveryDate, setDeliveryDate] = useState(
    salesOrder.delivery_date ? format(new Date(salesOrder.delivery_date), 'yyyy-MM-dd') : ''
  );
  const [trackingNumber, setTrackingNumber] = useState(salesOrder.tracking_number || '');
  const [shippingAddress, setShippingAddress] = useState(salesOrder.shipping_address || '');
  const [notes, setNotes] = useState(salesOrder.notes || '');
  const [items, setItems] = useState<OrderItemForm[]>([]);

  useEffect(() => {
    if (isOpen && activeBranch?.branch_id) {
      fetchProducts();
      // Initialize form with sales order data
      if (salesOrder.items) {
        setItems(salesOrder.items.map(item => ({
          id: item.id,
          product_id: item.product_id || '',
          variant_id: item.variant_id,
          quantity_ordered: item.quantity_ordered,
          quantity_fulfilled: item.quantity_fulfilled,
          unit_price: item.unit_price,
          total_price: item.total_price,
          notes: item.notes || '',
          product_name: item.product?.name,
          isNew: false,
        })));
      }
      setCustomerName(salesOrder.customer_name || '');
      setOrderDate(salesOrder.order_date ? format(new Date(salesOrder.order_date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'));
      setStatus(salesOrder.status);
      setPaymentStatus(salesOrder.payment_status || 'pending');
      setDeliveryStatus(salesOrder.delivery_status || 'pending');
      setDeliveryDate(salesOrder.delivery_date ? format(new Date(salesOrder.delivery_date), 'yyyy-MM-dd') : '');
      setTrackingNumber(salesOrder.tracking_number || '');
      setShippingAddress(salesOrder.shipping_address || '');
      setNotes(salesOrder.notes || '');
    }
  }, [isOpen, salesOrder, activeBranch?.branch_id]);

  const fetchProducts = async () => {
    if (!activeBranch?.branch_id) return;
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('branch_id', activeBranch.branch_id)
      .order('name');

    if (error) {
      console.error('Error fetching products:', error);
      return;
    }

    setProducts(data || []);
  };

  const addItem = () => {
    setItems([...items, { 
      product_id: '', 
      variant_id: null, 
      quantity_ordered: 0, 
      quantity_fulfilled: 0,
      unit_price: 0, 
      total_price: 0,
      notes: '',
      product_name: '',
      isNew: true,
    }]);
  };

  const removeItem = (index: number) => {
    if (items.length === 1) {
      toast.error('Sales order must have at least one item');
      return;
    }
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof OrderItemForm, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    if (field === 'quantity_ordered' || field === 'unit_price') {
      newItems[index].total_price = newItems[index].quantity_ordered * newItems[index].unit_price;
    }
    setItems(newItems);
  };

  const handleProductChange = (index: number, productId: string) => {
    const product = products.find(p => p.id === productId);
    const newItems = [...items];
    
    newItems[index] = {
      ...newItems[index],
      product_id: productId,
      product_name: product?.name || '',
      unit_price: product?.sale_price || newItems[index].unit_price,
      quantity_ordered: newItems[index].quantity_ordered || 1,
    };
    newItems[index].total_price = newItems[index].quantity_ordered * newItems[index].unit_price;
    
    setItems(newItems);
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

  const canFulfill = status === 'pending' || status === 'draft';
  const canDelete = status === 'draft' || status === 'cancelled';

  const calculateTotal = () => {
    return items.reduce((sum, item) => {
      if (item.product_id && item.quantity_ordered > 0 && item.unit_price > 0) {
        return sum + (item.quantity_ordered * item.unit_price);
      }
      return sum + (item.total_price || 0);
    }, 0);
  };

  const handleUpdate = async () => {
    if (!customerName.trim()) {
      toast.error('Customer name is required');
      return;
    }

    const validItems = items.filter(item => item.product_id && item.quantity_ordered > 0);
    if (validItems.length === 0) {
      toast.error('Add at least one item with a product and quantity');
      return;
    }

    setIsSaving(true);
    try {
      const totalAmount = calculateTotal();

      // Update sales order
      const { error: soError } = await supabase
        .from('sales_orders')
        .update({
          customer_name: customerName.trim(),
          status: status,
          payment_status: paymentStatus,
          delivery_status: deliveryStatus,
          delivery_date: deliveryDate ? new Date(deliveryDate).toISOString() : null,
          tracking_number: trackingNumber.trim() || null,
          shipping_address: shippingAddress.trim() || null,
          notes: notes.trim() || null,
          order_date: new Date(orderDate).toISOString(),
          total_amount: totalAmount,
        })
        .eq('id', salesOrder.id);

      if (soError) throw soError;

      // Handle items: delete removed items, update existing, insert new
      const existingItemIds = items.filter(item => item.id && !item.isNew).map(item => item.id!);
      const allExistingItems = salesOrder.items?.map(item => item.id) || [];
      const itemsToDelete = allExistingItems.filter(id => !existingItemIds.includes(id));

      // Delete removed items
      if (itemsToDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from('sales_order_items')
          .delete()
          .in('id', itemsToDelete);
        if (deleteError) throw deleteError;
      }

      // Update or insert items
      for (const item of validItems) {
        if (item.id && !item.isNew) {
          // Update existing item
          const { error: updateError } = await supabase
            .from('sales_order_items')
            .update({
              product_id: item.product_id,
              variant_id: item.variant_id,
              quantity_ordered: item.quantity_ordered,
              unit_price: item.unit_price,
              total_price: item.total_price,
              notes: item.notes.trim() || null,
            })
            .eq('id', item.id);
          if (updateError) throw updateError;
        } else {
          // Insert new item
          const { error: insertError } = await supabase
            .from('sales_order_items')
            .insert({
              sales_order_id: salesOrder.id,
              product_id: item.product_id,
              variant_id: item.variant_id,
              quantity_ordered: item.quantity_ordered,
              quantity_fulfilled: item.quantity_fulfilled || 0,
              unit_price: item.unit_price,
              total_price: item.total_price,
              notes: item.notes.trim() || null,
            });
          if (insertError) throw insertError;
        }
      }

      toast.success(`Sales order ${salesOrder.so_number} updated successfully`);
      onSOUpdated();
    } catch (error) {
      console.error('Error updating sales order:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update sales order');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // First delete all sales order items
      const { error: itemsError } = await supabase
        .from('sales_order_items')
        .delete()
        .eq('sales_order_id', salesOrder.id);

      if (itemsError) throw itemsError;

      // Then delete the sales order
      const { error: soError } = await supabase
        .from('sales_orders')
        .delete()
        .eq('id', salesOrder.id);

      if (soError) throw soError;

      toast.success(`Sales order ${salesOrder.so_number} deleted successfully`);
      setShowDeleteDialog(false);
      onClose();
      onSOUpdated();
    } catch (error) {
      console.error('Error deleting sales order:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete sales order');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-3">
                <ShoppingCart className="w-5 h-5" />
                {salesOrder.so_number}
              </DialogTitle>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(status)}>
                  {status}
                </Badge>
              </div>
            </div>
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
                {salesOrder.created_at && (
                  <div className="text-xs text-gray-500 pt-2 border-t">
                    Created: {format(new Date(salesOrder.created_at), 'MMM dd, yyyy HH:mm')}
                    {salesOrder.updated_at && salesOrder.updated_at !== salesOrder.created_at && (
                      <> • Updated: {format(new Date(salesOrder.updated_at), 'MMM dd, yyyy HH:mm')}</>
                    )}
                  </div>
                )}
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
                  {items.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No items in this sales order</p>
                  ) : (
                    items.map((item, index) => (
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
                            {!item.isNew && (
                              <p className="text-xs text-gray-500 mt-1">
                                Fulfilled: {item.quantity_fulfilled}
                              </p>
                            )}
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

                        {(item.product_id && item.quantity_ordered > 0 && item.unit_price > 0) || item.total_price > 0 ? (
                          <div className="text-right text-sm text-gray-600 font-medium">
                            Subtotal: ${((item.quantity_ordered || 0) * (item.unit_price || 0) || item.total_price).toFixed(2)}
                          </div>
                        ) : null}
                      </div>
                    ))
                  )}
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

          {/* Actions */}
          <div className="flex justify-between items-center pt-4 border-t gap-2 mt-6">
            <div>
              {canDelete && (
                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteDialog(true)}
                  disabled={isSaving}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose} disabled={isSaving}>
                Cancel
              </Button>
              {canFulfill && (
                <Button 
                  onClick={() => setShowFulfillModal(true)}
                  variant="outline"
                  disabled={isSaving}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Fulfill Items
                </Button>
              )}
              <Button 
                onClick={handleUpdate} 
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Sales Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete sales order <strong>{salesOrder.so_number}</strong>?
              <br />
              <br />
              This will permanently delete:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>The sales order record</li>
                <li>All {items.length || 0} item(s) in this order</li>
              </ul>
              <br />
              <span className="text-red-600 font-semibold">This action cannot be undone.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? 'Deleting...' : 'Delete Order'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Fulfill Modal */}
      {showFulfillModal && (
        <FulfillSalesOrderModal
          salesOrder={salesOrder}
          isOpen={showFulfillModal}
          onClose={() => setShowFulfillModal(false)}
          onFulfilled={onSOUpdated}
        />
      )}
    </>
  );
};

