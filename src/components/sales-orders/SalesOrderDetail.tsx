import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SalesOrder } from '@/types/stockTypes';
import { format } from 'date-fns';
import { ShoppingCart } from 'lucide-react';
import { FulfillSalesOrderModal } from './FulfillSalesOrderModal';

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
              <Badge className={getStatusColor(salesOrder.status)}>
                {salesOrder.status}
              </Badge>
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
            {canFulfill && (
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
                <Button onClick={() => setShowFulfillModal(true)}>
                  Fulfill Items
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

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



