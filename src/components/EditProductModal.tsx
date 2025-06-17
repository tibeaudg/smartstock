import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ProductInfo } from './stock/ProductInfo';
import { StockMovementForm } from './stock/StockMovementForm';
import { useStockMovement } from './stock/useStockMovement';
import { Badge } from '@/components/ui/badge';

interface Product {
  id: string;
  name: string;
  description: string | null;
  quantity_in_stock: number;
  minimum_stock_level: number;
  unit_price: number;
  status: string | null;
  categories: {
    name: string;
  } | null;
  suppliers: {
    name: string;
  } | null;
}

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductUpdated: () => void;
  product: Product;
}

export const EditProductModal = ({ isOpen, onClose, onProductUpdated, product }: EditProductModalProps) => {
  const {
    loading,
    transactionType,
    quantity,
    setTransactionType,
    setQuantity,
    resetForm,
    handleSubmit
  } = useStockMovement(product, onProductUpdated, onClose);

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Stock Movement - {product.name}
            <Badge variant="outline" className="ml-2">
              €{product.unit_price.toFixed(2)}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Current stock: {product.quantity_in_stock} units
            {product.quantity_in_stock <= product.minimum_stock_level && (
              <span className="text-red-500 ml-2">
                (Onder minimum stock niveau {product.minimum_stock_level})
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <StockMovementForm
          transactionType={transactionType}
          quantity={quantity}
          currentStock={product.quantity_in_stock}
          loading={loading}
          onTransactionTypeChange={setTransactionType}
          onQuantityChange={setQuantity}
          onSubmit={handleSubmit}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};
