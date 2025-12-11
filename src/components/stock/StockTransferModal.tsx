import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';
import { Product } from '@/types/stockTypes';

interface StockTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransferCreated: () => void;
}

export const StockTransferModal = ({
  isOpen,
  onClose,
  onTransferCreated
}: StockTransferModalProps) => {
  const { user } = useAuth();
  const { activeBranch, branches } = useBranches();
  const [loading, setLoading] = useState(false);
  const [toBranchId, setToBranchId] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<Array<{
    product_id: string | null;
    variant_id: string | null;
    quantity_transferred: number;
    unit_price: number;
    notes: string;
  }>>([{ product_id: null, variant_id: null, quantity_transferred: 0, unit_price: 0, notes: '' }]);
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
      return;
    }

    setProducts(data || []);
  };

  const addItem = () => {
    setItems([...items, { product_id: null, variant_id: null, quantity_transferred: 0, unit_price: 0, notes: '' }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const generateTransferNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `TR-${year}${month}${day}-${random}`;
  };

  const handleSubmit = async () => {
    if (!user || !activeBranch) {
      toast.error('User or branch information missing');
      return;
    }

    if (!toBranchId) {
      toast.error('Please select a destination branch');
      return;
    }

    const validItems = items.filter(item => item.product_id && item.quantity_transferred > 0);
    if (validItems.length === 0) {
      toast.error('Add at least one item with quantity');
      return;
    }

    setLoading(true);
    try {
      const transferNumber = generateTransferNumber();

      // Create stock transfer
      const { data: transfer, error: transferError } = await supabase
        .from('stock_transfers')
        .insert({
          transfer_number: transferNumber,
          status: 'pending',
          from_branch_id: activeBranch.branch_id,
          to_branch_id: toBranchId,
          to_location: toLocation.trim() || null,
          branch_id: activeBranch.branch_id,
          user_id: user.id,
          created_by: user.id,
          notes: notes.trim() || null,
        })
        .select()
        .single();

      if (transferError) throw transferError;

      // Create stock transfer items
      const transferItems = validItems.map(item => ({
        stock_transfer_id: transfer.id,
        product_id: item.product_id,
        variant_id: item.variant_id,
        quantity_transferred: item.quantity_transferred,
        unit_price: item.unit_price,
        notes: item.notes.trim() || null,
      }));

      const { error: itemsError } = await supabase
        .from('stock_transfer_items')
        .insert(transferItems);

      if (itemsError) throw itemsError;

      // Complete the transfer (creates transactions)
      const { error: completeError } = await supabase.rpc('create_stock_transfer_transactions', {
        p_transfer_id: transfer.id,
        p_completed_by: user.id
      });

      if (completeError) {
        console.error('Error completing transfer:', completeError);
        // Transfer created but not completed - user can complete it later
        toast.warning('Transfer created but could not be completed automatically');
      } else {
        toast.success('Stock transfer completed successfully');
      }

      onTransferCreated();
      onClose();
      
      // Reset form
      setToBranchId('');
      setToLocation('');
      setNotes('');
      setItems([{ product_id: null, variant_id: null, quantity_transferred: 0, unit_price: 0, notes: '' }]);
    } catch (error) {
      console.error('Error creating stock transfer:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create stock transfer');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const availableBranches = branches?.filter(b => b.branch_id !== activeBranch?.branch_id) || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Stock Transfer</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="toBranch">To Branch *</Label>
              <Select value={toBranchId} onValueChange={setToBranchId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select destination branch" />
                </SelectTrigger>
                <SelectContent>
                  {availableBranches.map((branch) => (
                    <SelectItem key={branch.branch_id} value={branch.branch_id}>
                      {branch.branch_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="toLocation">To Location</Label>
              <Input
                id="toLocation"
                value={toLocation}
                onChange={(e) => setToLocation(e.target.value)}
                placeholder="Optional location"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes..."
              rows={3}
            />
          </div>

          {/* Items */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <Label>Items</Label>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => {
                const product = products.find(p => p.id === item.product_id);
                return (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
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

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Product</Label>
                        <select
                          className="w-full rounded-md border border-input bg-background px-3 py-2"
                          value={item.product_id || ''}
                          onChange={(e) => {
                            const selectedProduct = products.find(p => p.id === e.target.value);
                            updateItem(index, 'product_id', e.target.value);
                            if (selectedProduct) {
                              updateItem(index, 'unit_price', selectedProduct.unit_price || 0);
                            }
                          }}
                        >
                          <option value="">Select product</option>
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} (Stock: {p.quantity_in_stock})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          min="1"
                          max={product?.quantity_in_stock || 0}
                          value={item.quantity_transferred || ''}
                          onChange={(e) => updateItem(index, 'quantity_transferred', parseInt(e.target.value) || 0)}
                        />
                        {product && (
                          <p className="text-xs text-gray-500 mt-1">
                            Available: {product.quantity_in_stock}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label>Unit Price</Label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.unit_price || ''}
                          onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Transferring...' : 'Complete Transfer'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

