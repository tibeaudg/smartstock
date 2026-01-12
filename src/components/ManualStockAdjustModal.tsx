import React, { useState, useEffect, useCallback, useRef } from 'react';
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

// Enhanced Product interface with all possible fields
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
  created_at?: string;
  updated_at?: string;
}

interface ManualStockAdjustModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductUpdated: () => void;
  onBack?: () => void;
  defaultAction?: 'in' | 'out';
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
  const [selectedProductOriginal, setSelectedProductOriginal] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [actionType, setActionType] = useState<'in' | 'out'>(defaultAction);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Focus search input when modal opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Fetch products when modal opens
  useEffect(() => {
    if (isOpen && activeBranch?.branch_id) {
      fetchProducts();
    } else if (isOpen) {
      toast.error('Please select a branch first');
      onClose();
    }
  }, [isOpen, activeBranch]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSearchValue('');
      setSelectedProduct(null);
      setSelectedProductOriginal(null);
      setQuantity('');
      setActionType(defaultAction);
      setProducts([]);
    }
  }, [isOpen, defaultAction]);

  const fetchProducts = useCallback(async () => {
    if (!activeBranch?.branch_id) {
      toast.error('No active branch selected');
      return;
    }
    
    setSearchLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, description, quantity_in_stock, minimum_stock_level, unit_price, status, branch_id, image_url, is_variant, variant_name, sku, created_at, updated_at')
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
    } finally {
      setSearchLoading(false);
    }
  }, [activeBranch]);

  // Filter and format products for display
  const filteredProducts = React.useMemo(() => {
    if (!searchValue.trim()) return [];
    
    return products
      .map(product => {
        const displayName =
          product.is_variant && product.variant_name
            ? `${product.name} (${product.variant_name})`
            : product.name;

        return {
          ...product,
          displayName,
          // Ensure we keep the original product object reference
          originalProduct: product
        };
      })
      .filter(product =>
        product.displayName.toLowerCase().includes(searchValue.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchValue.toLowerCase())
      );
  }, [products, searchValue]);

  const handleProductSelect = (productWithDisplay: any) => {
    // Use the original product object, not the modified one
    const originalProduct = productWithDisplay.originalProduct || productWithDisplay;
    
    console.log('Product selected:', {
      selectedProduct: originalProduct,
      id: originalProduct.id,
      typeOfId: typeof originalProduct.id,
      allKeys: Object.keys(originalProduct)
    });
    
    if (!originalProduct.id) {
      toast.error('Selected product has no ID. Please try again.');
      return;
    }
    
    setSelectedProduct(originalProduct);
    setSelectedProductOriginal(originalProduct);
    setSearchValue(productWithDisplay.displayName);
    setSearchOpen(false);
  };

  const handleCreateNew = () => {
    const trimmedValue = searchValue.trim();
    setSearchOpen(false);
    
    // Persist intended name
    try {
      if (trimmedValue) {
        sessionStorage.setItem('prefillAddProductName', trimmedValue);
      } else {
        sessionStorage.removeItem('prefillAddProductName');
      }
    } catch {}
    
    // Close modal first
    onClose();
    
    // Use callback or dispatch event
    if (onCreateNewProduct) {
      setTimeout(() => onCreateNewProduct(trimmedValue || undefined), 100);
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
    // Use the original product reference to avoid stale data
    const productToUse = selectedProductOriginal || selectedProduct;
    
    if (!productToUse) {
      toast.error('Please select a product');
      return;
    }

    // Debug logging
    console.log('DEBUG - Submitting stock adjustment:', {
      productToUse,
      productId: productToUse.id,
      productIdType: typeof productToUse.id,
      productIdValid: productToUse.id && typeof productToUse.id === 'string' && productToUse.id.trim() !== '',
      hasBranchId: !!productToUse.branch_id,
      branchId: productToUse.branch_id
    });

    // Capture values safely
    const productId = productToUse.id;
    const productName = productToUse.name;
    const variantName = productToUse.variant_name;
    const displayName = 
      productToUse.is_variant && variantName 
        ? `${productName} - ${variantName}`
        : productName;

    const branchId = productToUse.branch_id;
    const unitPrice = productToUse.unit_price || 0;
    const isVariant = Boolean(productToUse.is_variant);

    // Helper: validate UUID-like strings to avoid passing 'undefined' or invalid values
    const isValidUUID = (val: any) => {
      if (typeof val !== 'string') return false;
      const s = val.trim();
      if (!s || s === 'undefined') return false;
      const uuidRegex = /^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i;
      return uuidRegex.test(s);
    };

    const sanitizeUUID = (val: any) => (isValidUUID(val) ? String(val).trim() : null);

    // CRITICAL VALIDATION: Check productId and branchId; avoid sending 'undefined' strings
    // Accept any non-empty product id string (some products may not use UUIDs),
    // but explicitly reject the literal 'undefined'
    if (!productId || typeof productId !== 'string' || productId.trim() === '' || productId === 'undefined') {
      console.error('Invalid product ID detected:', productId);
      toast.error('Invalid product ID. Please reselect the product.');
      return;
    }

    const branchIdSanitized = sanitizeUUID(branchId) || sanitizeUUID(activeBranch?.branch_id);
    if (!branchIdSanitized) {
      toast.error('Product is not associated with a valid branch');
      return;
    }

    const numericQuantity = parseInt(quantity, 10);

    if (!quantity || isNaN(numericQuantity) || numericQuantity <= 0) {
      toast.error('Enter a valid quantity greater than 0');
      return;
    }

    if (numericQuantity > 999999) {
      toast.error('Quantity is too large');
      return;
    }

    setLoading(true);

    try {
      const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        throw new Error(`Authentication error: ${authError.message}`);
      }
      
      if (!currentUser) {
        throw new Error('Not logged in. Please log in again.');
      }

      const currentQuantity = Number(productToUse.quantity_in_stock) || 0;
      const newQuantity =
        actionType === 'in'
          ? currentQuantity + numericQuantity
          : currentQuantity - numericQuantity;

      if (actionType === 'out' && newQuantity < 0) {
        toast.error(`Not enough stock available. Current stock: ${currentQuantity}`);
        return;
      }

      // Prepare transaction data with debug info
      const transactionData = {
        product_id: productId,
        product_name: displayName,
        transaction_type: actionType === 'in' ? 'incoming' : 'outgoing',
        quantity: numericQuantity,
        unit_price: unitPrice,
        reference_number: `MANUAL_${actionType.toUpperCase()}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        notes: `Manual stock ${actionType === 'in' ? 'addition' : 'removal'}`,
        user_id: sanitizeUUID(currentUser.id) || null,
        created_by: sanitizeUUID(currentUser.id) || null,
        branch_id: branchIdSanitized,
        variant_id: isVariant ? productId : null,
        variant_name: isVariant ? variantName : null,
        adjustment_method: 'manual',
        created_at: new Date().toISOString()
      };

      console.log('DEBUG - Transaction data to insert:', transactionData);

      // Create transaction
      const { error: transactionError } = await supabase
        .from('stock_transactions')
        .insert(transactionData);

      if (transactionError) {
        console.error('Transaction error details:', transactionError);
        throw new Error(`Failed to create transaction: ${transactionError.message}`);
      }

      // Update product stock
      const { error: updateError } = await supabase
        .from('products')
        .update({
          quantity_in_stock: newQuantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', productId);

      if (updateError) {
        console.error('Update error details:', updateError);
        throw new Error(`Failed to update stock: ${updateError.message}`);
      }

      toast.success(`Stock successfully ${actionType === 'in' ? 'added' : 'removed'}`);

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['stockTransactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardData'] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });

      onProductUpdated();
      onClose();
    } catch (error: any) {
      console.error('Stock adjustment error:', error);
      
      // Show more specific error messages
      if (error.message.includes('product_id')) {
        toast.error('Product ID error. Please refresh and try again.');
      } else if (error.message.includes('foreign key')) {
        toast.error('Invalid product reference. The product might have been deleted.');
      } else {
        toast.error(error.message || 'An error occurred while updating stock');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (value: string) => {
    // Allow only numbers
    const numValue = value.replace(/[^0-9]/g, '');
    setQuantity(numValue);
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
              <div className="relative" ref={searchRef}>
                <Input
                  ref={searchInputRef}
                  placeholder="Type to search for a product..."
                  value={searchValue}
                  onChange={(e) => {
                    setSearchValue(e.target.value);
                    setSelectedProduct(null);
                    setSelectedProductOriginal(null);
                    setSearchOpen(true);
                  }}
                  onFocus={() => setSearchOpen(true)}
                  className="w-full"
                  disabled={searchLoading}
                />
                
                {searchLoading && (
                  <div className="absolute right-3 top-3">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  </div>
                )}
                
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
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 focus:outline-none focus:bg-gray-100"
                          >
                            <div className="font-medium text-gray-900">{product.displayName}</div>
                            <div className="text-sm text-gray-500">
                              Stock: {product.quantity_in_stock} | SKU: {product.sku || 'N/A'}
                              {product.id && <span className="ml-2 text-xs text-gray-400">ID: {product.id.substring(0, 8)}...</span>}
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : !searchLoading ? (
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
                    ) : null}
                  </div>
                )}
              </div>
              
              {/* Debug info - can be removed in production */}
              {process.env.NODE_ENV === 'development' && selectedProduct && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                  <div className="font-medium text-yellow-800">Debug Info:</div>
                  <div className="text-yellow-700">
                    Product ID: {selectedProduct.id || 'MISSING!'}<br/>
                    Type: {typeof selectedProduct.id}<br/>
                    Branch ID: {selectedProduct.branch_id || 'MISSING!'}
                  </div>
                </div>
              )}
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
                    onChange={(e) => handleQuantityChange(e.target.value)}
                    placeholder="Enter quantity"
                    min="1"
                    max="999999"
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
                disabled={loading || !quantity || parseInt(quantity, 10) <= 0}
                className={`${actionType === 'in' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} ${isMobile ? 'w-full' : ''}`}
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                    Processing...
                  </>
                ) : actionType === 'in' ? 'Add Stock' : 'Remove Stock'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};