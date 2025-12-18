import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';
import { Product } from '@/types/stockTypes';

interface CreateSalesOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSOCreated: () => void;
}

export const CreateSalesOrderModal = ({
  isOpen,
  onClose,
  onSOCreated
}: CreateSalesOrderModalProps) => {
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  const [loading, setLoading] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<Array<{
    product_id: string | null;
    variant_id: string | null;
    quantity_ordered: number;
    unit_price: number;
    notes: string;
  }>>([{ product_id: null, variant_id: null, quantity_ordered: 0, unit_price: 0, notes: '' }]);
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
    setItems([...items, { product_id: null, variant_id: null, quantity_ordered: 0, unit_price: 0, notes: '' }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
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
      toast.error('Add at least one item with quantity');
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
          status: 'draft',
          customer_name: customerName.trim(),
          total_amount: totalAmount,
          branch_id: activeBranch.branch_id,
          user_id: user.id,
          created_by: user.id,
          notes: notes.trim() || null,
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

      toast.success('Sales order created successfully');
      onSOCreated();
      onClose();
      
      // Reset form
      setCustomerName('');
      setNotes('');
      setItems([{ product_id: null, variant_id: null, quantity_ordered: 0, unit_price: 0, notes: '' }]);
    } catch (error) {
      console.error('Error creating sales order:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create sales order');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Sales Order</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <Label htmlFor="customerName">Customer Name *</Label>
            <Input
              id="customerName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter customer name"
            />
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
              {items.map((item, index) => (
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

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                      <Label>Product</Label>
                      <select
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                        value={item.product_id || ''}
                        onChange={(e) => {
                          const product = products.find(p => p.id === e.target.value);
                          updateItem(index, 'product_id', e.target.value);
                          if (product) {
                            updateItem(index, 'unit_price', product.sale_price || 0);
                          }
                        }}
                      >
                        <option value="">Select product</option>
                        {products.map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.name} (Stock: {product.quantity_in_stock})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity_ordered || ''}
                        onChange={(e) => updateItem(index, 'quantity_ordered', parseInt(e.target.value) || 0)}
                      />
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
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total Amount:</span>
              <span className="text-xl font-bold">
                ${items.reduce((sum, item) => sum + (item.quantity_ordered * item.unit_price), 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Creating...' : 'Create Sales Order'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};



