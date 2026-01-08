import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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
import { SalesOrder } from '@/types/stockTypes';
import { format } from 'date-fns';
import { Check, ShoppingCart, Trash2 } from 'lucide-react';
import { FulfillSalesOrderModal } from './FulfillSalesOrderModal';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SalesOrderDetailProps {
  salesOrder: SalesOrder;
  isOpen: boolean;
  onClose: () => void;
  onSOUpdated: () => void;
}

export const SalesOrderDetail = ({
  salesOrder,
  isOpen,
  onClose,
  onSOUpdated
}: SalesOrderDetailProps) => {
  const [showFulfillModal, setShowFulfillModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'fulfilled': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const canFulfill = salesOrder.status === 'pending' || salesOrder.status === 'draft';
  const canDelete = salesOrder.status === 'draft' || salesOrder.status === 'cancelled';

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
      <Dialog open={isOpen} onOpenChange={onClose} >
        <DialogContent className="max-h-[90vh] max-w-[90vh]">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-3">
                <ShoppingCart className="w-5 h-5" />
                {salesOrder.so_number}
              </DialogTitle>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(salesOrder.status)}>
                  {salesOrder.status}
                </Badge>
        
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Order Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Customer</label>
                <p className="text-base font-semibold">{salesOrder.customer_name || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Order Date</label>
                <p className="text-base">
                  {format(new Date(salesOrder.order_date), 'MMM dd, yyyy')}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Total Amount</label>
                <p className="text-base font-semibold">${salesOrder.total_amount.toFixed(2)}</p>
              </div>
            </div>

            {salesOrder.notes && (
              <div>
                <label className="text-sm font-medium text-gray-500">Notes</label>
                <p className="text-base">{salesOrder.notes}</p>
              </div>
            )}

            {/* Items */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Items</h3>
              <div className="space-y-2">
                {salesOrder.items && salesOrder.items.length > 0 ? (
                  salesOrder.items.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">
                            {item.product?.name || 'Product'}
                          </p>
                          <p className="text-sm text-gray-500">
                            Ordered: {item.quantity_ordered} | Fulfilled: {item.quantity_fulfilled}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${item.unit_price.toFixed(2)}</p>
                          <p className="text-sm text-gray-500">
                            Total: ${item.total_price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No items in this sales order</p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center pt-4 border-t gap-2">
              <div>
                {canDelete && (
                  <Button
                    variant="destructive"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
             
                {canFulfill && (
                  <Button onClick={() => setShowFulfillModal(true)}>
                    <Check className="w-4 h-4 mr-2" />
                    Fulfill Items
                  </Button>
                )}
              </div>
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
                <li>All {salesOrder.items?.length || 0} item(s) in this order</li>
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