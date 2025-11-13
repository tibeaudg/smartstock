import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { useMobile } from '@/hooks/use-mobile';
import { ArrowLeft, Plus, Minus } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string | null;
  quantity_in_stock: number;
  minimum_stock_level: number;
  unit_price: number;
  status: string | null;
  branch_id?: string;
  image_url?: string | null;
  is_variant?: boolean;
  variant_name?: string | null;
  sku?: string | null;
}

interface ManualStockAdjustModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductUpdated: () => void;
  onBack?: () => void;
  defaultAction?: 'in' | 'out';
  // Optional: allow parent to directly handle "Create New Product" with a prefilled name
  onCreateNewProduct?: (name?: string) => void;
}

export const ManualStockAdjustModal = ({
  isOpen,
  onClose,
  onProductUpdated,
  onBack,
  defaultAction = 'in',
  onCreateNewProduct
}: ManualStockAdjustModalProps) => {
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  const queryClient = useQueryClient();
  const { isMobile } = useMobile();
  
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [actionType, setActionType] = useState<'in' | 'out'>(defaultAction);
  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.relative')) {
        setSearchOpen(false);
      }
    };

    if (searchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [searchOpen]);

  // Fetch products when modal opens
  useEffect(() => {
    if (isOpen && activeBranch) {
      fetchProducts();
    }
  }, [isOpen, activeBranch]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSearchValue('');
      setSelectedProduct(null);
      setQuantity('');
      setActionType(defaultAction);
    }
  }, [isOpen, defaultAction]);

  const fetchProducts = useCallback(async () => {
    if (!activeBranch) {
      
      return;
    }
    
    
    
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('branch_id', activeBranch.branch_id)
        .order('name');
      
      if (error) {
        console.error('Error fetching products:', error);
        toast.error('Error loading products');
        return;
      }
      
      
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Error loading products');
    }
  }, [activeBranch]);

  // Filter and format products for display
  const filteredProducts = products
    .map(product => {
      const displayName =
        product.is_variant && product.variant_name
          ? `${product.name} (${product.variant_name})`
          : product.name;

      return {
        ...product,
        displayName
      };
    })
    .filter(product =>
      product.displayName.toLowerCase().includes(searchValue.toLowerCase())
    );

  const handleProductSelect = (product: any) => {
    setSelectedProduct(product);
    setSearchValue(product.displayName);
    setSearchOpen(false);
  };

  const handleCreateNew = () => {
    const trimmedValue = searchValue.trim();
    setSearchOpen(false);
    onClose();
    // Persist intended name so receivers can reliably prefill even if state/event timing differs
    try {
      if (trimmedValue) {
        localStorage.setItem('prefillAddProductName', trimmedValue);
      } else {
        localStorage.removeItem('prefillAddProductName');
      }
    } catch {}
    // Prefer direct callback when provided; fall back to global event for backward compatibility
    if (onCreateNewProduct) {
      onCreateNewProduct(trimmedValue || undefined);
    } else {
      window.dispatchEvent(
        new CustomEvent('openAddProductModal', {
          detail: {
            name: trimmedValue || undefined
          }
        })
      );
    }
  };

  const handleSubmit = async () => {
    if (!selectedProduct) {
      toast.error('Please select a product');
      return;
    }

    const numericQuantity = Number(quantity);

    if (!quantity || Number.isNaN(numericQuantity) || numericQuantity <= 0) {
      toast.error('Enter a valid quantity');
      return;
    }

    setLoading(true);
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) throw new Error('Not logged in');
      
      const currentQuantity = Number(selectedProduct.quantity_in_stock) || 0;
      const newQuantity = actionType === 'in'
        ? currentQuantity + numericQuantity
        : currentQuantity - numericQuantity;
      
      if (actionType === 'out' && newQuantity < 0) {
        toast.error('Not enough stock available');
        setLoading(false);
        return;
      }

      // Create stock transaction
      const { error: transactionError } = await supabase
        .from('stock_transactions')
        .insert({
          product_id: selectedProduct.id,
          product_name: selectedProduct.is_variant && selectedProduct.variant_name 
            ? `${selectedProduct.name} - ${selectedProduct.variant_name}` 
            : selectedProduct.name,
          transaction_type: actionType === 'in' ? 'incoming' : 'outgoing',
          quantity: numericQuantity,
          unit_price: selectedProduct.unit_price,
          reference_number: `MANUAL_${actionType.toUpperCase()}_${Date.now()}`,
          notes: `Stock ${actionType === 'in' ? 'added' : 'removed'} via manual adjustment`,
          user_id: currentUser.id,
          created_by: currentUser.id,
          branch_id: selectedProduct.branch_id,
          variant_id: selectedProduct.is_variant ? selectedProduct.id : null,
          variant_name: selectedProduct.is_variant ? selectedProduct.variant_name : null
        });

      if (transactionError) {
        throw new Error(`Error creating transaction: ${transactionError.message}`);
      }

      // Update product stock
      const { error: updateError } = await supabase
        .from('products')
        .update({
          quantity_in_stock: newQuantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedProduct.id);

      if (updateError) {
        throw new Error(`Error updating stock: ${updateError.message}`);
      }

      toast.success(`Stock successfully ${actionType === 'in' ? 'added' : 'removed'}`);
      onProductUpdated();
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['stockTransactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardData'] });
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred while updating stock');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${isMobile ? 'w-full max-w-full mx-auto p-0 h-full max-h-full rounded-none' : 'max-w-md mx-auto'}`}>
        <DialogHeader className={`${isMobile ? 'p-4 border-b' : ''}`}>
          {isMobile && onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="absolute left-4 top-4 z-10"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <DialogTitle className={`flex items-center gap-2 ${isMobile ? 'text-center pr-8' : ''}`}>
            Manual Stock Adjustment
          </DialogTitle>
        </DialogHeader>
        
        <div className={`${isMobile ? 'flex-1 overflow-y-auto p-4' : 'py-4'}`}>
          <div className="space-y-4">
            {/* Product Search */}
            <div className="space-y-2">
              <Label>Select Product</Label>
              <div className="relative">
                <Input
                  placeholder="Type to search for a product..."
                  value={searchValue}
                  onChange={(e) => {
                    setSearchValue(e.target.value);
                    setSearchOpen(true);
                  }}
                  onFocus={() => setSearchOpen(true)}
                  className="w-full"
                />
                
                {/* Autocomplete Suggestions */}
                {searchOpen && searchValue && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {filteredProducts.length > 0 ? (
                      <div className="py-1">
                        {filteredProducts.map((product) => (
                          <button
                            key={product.id}
                            type="button"
                            onClick={() => handleProductSelect(product)}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                          >
                            <div className="font-medium text-gray-900">{product.displayName}</div>
                            <div className="text-sm text-gray-500">
                              Stock: {product.quantity_in_stock} | SKU: {product.sku || 'N/A'}
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center">
                        <p className="text-sm text-gray-500 mb-3">No products found</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCreateNew}
                          className="w-full"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Create New Product
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Stock Adjustment UI - Only show if product is selected */}
            {selectedProduct && (
              <>
                {/* Action Type Switcher */}
                <div className="space-y-2">
                  <Label>Stock Operation</Label>
                  <div className={`flex rounded-lg border-2 ${actionType === 'in' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                    <button
                      type="button"
                      onClick={() => setActionType('in')}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-l-md transition-colors ${
                        actionType === 'in' 
                          ? 'bg-green-600 text-white' 
                          : 'text-green-700 hover:bg-green-100'
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                      <span className="font-medium">Add Stock</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActionType('out')}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-r-md transition-colors ${
                        actionType === 'out' 
                          ? 'bg-red-600 text-white' 
                          : 'text-red-700 hover:bg-red-100'
                      }`}
                    >
                      <Minus className="w-4 h-4" />
                      <span className="font-medium">Remove Stock</span>
                    </button>
                  </div>
                </div>

                {/* Quantity Input */}
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Enter quantity"
                    min="1"
                    className={`${actionType === 'in' ? 'border-green-200 focus:border-green-500' : 'border-red-200 focus:border-red-500'}`}
                  />
                </div>

                {/* Current Stock Display */}
                <div className={`p-4 rounded-lg ${actionType === 'in' ? 'bg-green-50' : 'bg-red-50'}`}>
                  <div className="text-sm text-gray-600 mb-2">Current stock</div>
                  <div className="text-2xl font-bold">{Number(selectedProduct.quantity_in_stock) || 0}</div>
                  <div className={`text-sm mt-1 ${actionType === 'in' ? 'text-green-700' : 'text-red-700'}`}>
                    {(() => {
                      const currentStock = Number(selectedProduct.quantity_in_stock) || 0;
                      const inputQuantity = Number(quantity) || 0;
                      const result = actionType === 'in'
                        ? currentStock + inputQuantity
                        : currentStock - inputQuantity;
                      return actionType === 'in'
                        ? `After adding: ${result}`
                        : `After removing: ${result}`;
                    })()}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className={`${isMobile ? 'p-4 border-t bg-gray-50' : ''}`}>
          <div className={`flex gap-2 ${isMobile ? 'flex-col' : 'justify-end'}`}>
            <Button 
              variant="outline" 
              onClick={onClose} 
              disabled={loading}
              className={isMobile ? 'w-full' : ''}
            >
              Cancel
            </Button>
            {selectedProduct && (
              <Button
                onClick={handleSubmit}
                disabled={loading || !quantity}
                className={`${actionType === 'in' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} ${isMobile ? 'w-full' : ''}`}
              >
                {loading ? 'Processing...' : actionType === 'in' ? 'Add Stock' : 'Remove Stock'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
