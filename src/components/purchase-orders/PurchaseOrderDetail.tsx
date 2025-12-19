import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PurchaseOrder } from '@/types/stockTypes';
import { format } from 'date-fns';
import { Package, Calendar, DollarSign, FileText, X } from 'lucide-react';
import { ReceivePurchaseOrderModal } from './ReceivePurchaseOrderModal';

interface PurchaseOrderDetailProps {
  purchaseOrder: PurchaseOrder;
  isOpen: boolean;
  onClose: () => void;
  onPOUpdated: () => void;
}

export const PurchaseOrderDetail = ({
  purchaseOrder,
  isOpen,
  onClose,
  onPOUpdated
}: PurchaseOrderDetailProps) => {
  const [showReceiveModal, setShowReceiveModal] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'ordered': return 'bg-blue-100 text-blue-800';
      case 'received': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const canReceive = purchaseOrder.status === 'ordered' || purchaseOrder.status === 'pending';

  if (!isOpen) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-3">
                <Package className="w-5 h-5" />
                {purchaseOrder.po_number}
              </DialogTitle>
              <Badge className={getStatusColor(purchaseOrder.status)}>
                {purchaseOrder.status}
              </Badge>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Order Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Vendor</label>
                <p className="text-base font-semibold">{purchaseOrder.vendor_name || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Order Date</label>
                <p className="text-base">
                  {format(new Date(purchaseOrder.order_date), 'MMM dd, yyyy')}
                </p>
              </div>
              {purchaseOrder.expected_delivery_date && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Expected Delivery</label>
                  <p className="text-base">
                    {format(new Date(purchaseOrder.expected_delivery_date), 'MMM dd, yyyy')}
                  </p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-500">Total Amount</label>
                <p className="text-base font-semibold">${purchaseOrder.total_amount.toFixed(2)}</p>
              </div>
            </div>

            {purchaseOrder.notes && (
              <div>
                <label className="text-sm font-medium text-gray-500">Notes</label>
                <p className="text-base">{purchaseOrder.notes}</p>
              </div>
            )}

            {/* Items */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Items</h3>
              <div className="space-y-2">
                {purchaseOrder.items && purchaseOrder.items.length > 0 ? (
                  purchaseOrder.items.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">
                            {item.product?.name || 'Product'}
                          </p>
                          <p className="text-sm text-gray-500">
                            Ordered: {item.quantity_ordered} | Received: {item.quantity_received}
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
                  <p className="text-gray-500">No items in this purchase order</p>
                )}
              </div>
            </div>

            {/* Actions */}
            {canReceive && (
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
                <Button onClick={() => setShowReceiveModal(true)}>
                  Receive Items
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {showReceiveModal && (
        <ReceivePurchaseOrderModal
          purchaseOrder={purchaseOrder}
          isOpen={showReceiveModal}
          onClose={() => setShowReceiveModal(false)}
          onReceived={onPOUpdated}
        />
      )}
    </>
  );
};




