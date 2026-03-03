import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { toast } from 'sonner';
import { Plus, Trash2, ChevronDown, Check } from 'lucide-react';
import { Product } from '@/types/stockTypes';
import { cn } from '@/lib/utils';
import { AddProductModal } from '@/components/AddProductModal';

interface CreatePurchaseOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPOCreated: () => void;
}

export const CreatePurchaseOrderModal = ({
  isOpen,
  onClose,
  onPOCreated
}: CreatePurchaseOrderModalProps) => {
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  const [loading, setLoading] = useState(false);
  const [vendorName, setVendorName] = useState('');
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<Array<{
    product_id: string | null;
    variant_id: string | null;
    quantity_ordered: number;
    unit_price: number;
    notes: string;
  }>>([{ product_id: null, variant_id: null, quantity_ordered: 0, unit_price: 0, notes: '' }]);
  const [products, setProducts] = useState<Product[]>([]);
  const [openProductPopovers, setOpenProductPopovers] = useState<Record<number, boolean>>({});
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [addProductForItemIndex, setAddProductForItemIndex] = useState<number | null>(null);

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
      .or('is_variant.is.null,is_variant.eq.false')
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

  const updateItem = (index: number, updates: Partial<typeof items[0]>) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], ...updates };
    setItems(newItems);
  };

  const generatePONumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `PO-${year}${month}${day}-${random}`;
  };

  const handleSubmit = async () => {
    if (!user || !activeBranch) {
      toast.error('User or branch information missing');
      return;
    }

    if (!vendorName.trim()) {
      toast.error('Vendor name is required');
      return;
    }

    const validItems = items.filter(item => item.product_id && item.quantity_ordered > 0);
    if (validItems.length === 0) {
      toast.error('Add at least one item with quantity');
      return;
    }

    setLoading(true);
    try {
      const poNumber = generatePONumber();
      const totalAmount = validItems.reduce((sum, item) => 
        sum + (item.quantity_ordered * item.unit_price), 0
      );

      // Create purchase order
      const { data: po, error: poError } = await supabase
        .from('purchase_orders')
        .insert({
          po_number: poNumber,
          status: 'draft',
          vendor_name: vendorName.trim(),
          expected_delivery_date: expectedDeliveryDate || null,
          total_amount: totalAmount,
          branch_id: activeBranch.branch_id,
          user_id: user.id,
          created_by: user.id,
          notes: notes.trim() || null,
        })
        .select()
        .single();

      if (poError) throw poError;

      // Create purchase order items
      const poItems = validItems.map(item => ({
        purchase_order_id: po.id,
        product_id: item.product_id,
        variant_id: item.variant_id,
        quantity_ordered: item.quantity_ordered,
        quantity_received: 0,
        unit_price: item.unit_price,
        total_price: item.quantity_ordered * item.unit_price,
        notes: item.notes.trim() || null,
      }));

      const { error: itemsError } = await supabase
        .from('purchase_order_items')
        .insert(poItems);

      if (itemsError) throw itemsError;

      toast.success('Purchase order created successfully');
      onPOCreated();
      onClose();
      
      // Reset form
      setVendorName('');
      setExpectedDeliveryDate('');
      setNotes('');
      setItems([{ product_id: null, variant_id: null, quantity_ordered: 0, unit_price: 0, notes: '' }]);
    } catch (error) {
      console.error('Error creating purchase order:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create purchase order');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Purchase Order</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Vendor Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="vendorName">Vendor Name *</Label>
              <Input
                id="vendorName"
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                placeholder="Enter vendor name"
              />
            </div>
            <div>
              <Label htmlFor="expectedDeliveryDate">Expected Delivery Date</Label>
              <Input
                id="expectedDeliveryDate"
                type="date"
                value={expectedDeliveryDate}
                onChange={(e) => setExpectedDeliveryDate(e.target.value)}
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
                      <Popover
                        open={openProductPopovers[index] ?? false}
                        onOpenChange={(open) =>
                          setOpenProductPopovers((prev) => ({ ...prev, [index]: open }))
                        }
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openProductPopovers[index] ?? false}
                            className="w-full justify-between font-normal"
                          >
                            {item.product_id
                              ? products.find((p) => p.id === item.product_id)?.name ?? 'Select product'
                              : 'Select product'}
                            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                          <Command>
                            <CommandInput placeholder="Search products..." />
                            <CommandList>
                              <CommandEmpty>No product found.</CommandEmpty>
                              <CommandGroup>
                                {products.map((product) => (
                                  <CommandItem
                                    key={product.id}
                                    value={product.name}
                                    onSelect={() => {
                                      updateItem(index, {
                                        product_id: product.id,
                                        variant_id: null,
                                        unit_price: product.purchase_price ?? product.unit_price ?? 0,
                                      });
                                      setOpenProductPopovers((prev) => ({ ...prev, [index]: false }));
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        'mr-2 h-4 w-4',
                                        item.product_id === product.id ? 'opacity-100' : 'opacity-0'
                                      )}
                                    />
                                    {product.name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                          <div className="border-t p-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
                              onClick={() => {
                                setAddProductForItemIndex(index);
                                setOpenProductPopovers((prev) => ({ ...prev, [index]: false }));
                                setShowAddProductModal(true);
                              }}
                            >
                              <Plus className="h-4 w-4" />
                              add new
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity_ordered || ''}
                        onChange={(e) => updateItem(index, { quantity_ordered: parseInt(e.target.value) || 0 })}
                      />
                    </div>

                    <div>
                      <Label>Unit Price</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.unit_price || ''}
                        onChange={(e) => updateItem(index, { unit_price: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Item Notes</Label>
                    <Input
                      value={item.notes}
                      onChange={(e) => updateItem(index, { notes: e.target.value })}
                      placeholder="Optional notes for this item"
                    />
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
            {loading ? 'Creating...' : 'Create Purchase Order'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>

    {showAddProductModal && (
      <AddProductModal
        isOpen={showAddProductModal}
        fromPurchaseOrder
        onClose={() => {
          setShowAddProductModal(false);
          setAddProductForItemIndex(null);
        }}
        onProductAdded={(product) => {
          if (addProductForItemIndex !== null && product) {
            updateItem(addProductForItemIndex, {
              product_id: product.id,
              variant_id: null,
              unit_price: product.purchase_price ?? product.unit_price ?? 0,
            });
          }
          fetchProducts();
          setShowAddProductModal(false);
          setAddProductForItemIndex(null);
        }}
      />
    )}
  </>
  );
};






