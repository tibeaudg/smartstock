import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { PurchaseOrder, PurchaseOrderItem } from '@/types/stockTypes';

interface ReceivePurchaseOrderModalProps {
  purchaseOrder: PurchaseOrder;
  isOpen: boolean;
  onClose: () => void;
  onReceived: () => void;
}

export const ReceivePurchaseOrderModal = ({
  purchaseOrder,
  isOpen,
  onClose,
  onReceived
}: ReceivePurchaseOrderModalProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [receivedQuantities, setReceivedQuantities] = useState<Record<string, number>>({});

  const handleQuantityChange = (itemId: string, quantity: number) => {
    setReceivedQuantities(prev => ({
      ...prev,
      [itemId]: quantity
    }));
  };

  const handleReceive = async () => {
    if (!user) {
      toast.error('User not authenticated');
      return;
    }

    const itemsToReceive = purchaseOrder.items?.filter(item => {
      const receivedQty = receivedQuantities[item.id] || 0;
      return receivedQty > 0 && receivedQty <= item.quantity_ordered - item.quantity_received;
    });

    if (!itemsToReceive || itemsToReceive.length === 0) {
      toast.error('Please enter quantities to receive');
      return;
    }

    setLoading(true);
    try {
      // Receive each item and create stock transactions
      for (const item of itemsToReceive) {
        const quantityToReceive = receivedQuantities[item.id] || 0;
        
        if (quantityToReceive <= 0) continue;

        // Call the database function to create transaction and update stock
        const { error: functionError } = await supabase.rpc('create_purchase_order_transaction', {
          p_po_item_id: item.id,
          p_quantity_received: quantityToReceive,
          p_received_by: user.id
        });

        if (functionError) {
          console.error('Error receiving item:', functionError);
          throw new Error(`Failed to receive item: ${functionError.message}`);
        }
      }

      // Update PO status if all items are received
      const allReceived = purchaseOrder.items?.every(item => {
        const totalReceived = (item.quantity_received || 0) + (receivedQuantities[item.id] || 0);
        return totalReceived >= item.quantity_ordered;
      });

      if (allReceived) {
        await supabase
          .from('purchase_orders')
          .update({ status: 'received' })
          .eq('id', purchaseOrder.id);
      } else {
        await supabase
          .from('purchase_orders')
          .update({ status: 'ordered' })
          .eq('id', purchaseOrder.id);
      }

      toast.success('Items received successfully');
      onReceived();
      onClose();
      setReceivedQuantities({});
    } catch (error) {
      console.error('Error receiving purchase order:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to receive items');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Receive Purchase Order Items</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Enter the quantities received for each item. Stock transactions will be created automatically.
          </p>

          {purchaseOrder.items && purchaseOrder.items.length > 0 ? (
            <div className="space-y-4">
              {purchaseOrder.items.map((item) => {
                const remaining = item.quantity_ordered - item.quantity_received;
                const receivedQty = receivedQuantities[item.id] || 0;
                
                return (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-medium">{item.product?.name || 'Product'}</p>
                        <p className="text-sm text-gray-500">
                          Ordered: {item.quantity_ordered} | 
                          Received: {item.quantity_received} | 
                          Remaining: {remaining}
                        </p>
                      </div>
                      <p className="text-sm font-semibold">${item.unit_price.toFixed(2)}</p>
                    </div>
                    
                    {remaining > 0 ? (
                      <div>
                        <Label>Quantity to Receive (max: {remaining})</Label>
                        <Input
                          type="number"
                          min="0"
                          max={remaining}
                          value={receivedQty || ''}
                          onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 0)}
                          placeholder="0"
                        />
                      </div>
                    ) : (
                      <p className="text-sm text-green-600 font-medium">Fully received</p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500">No items to receive</p>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleReceive} disabled={loading}>
            {loading ? 'Receiving...' : 'Receive Items'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};


