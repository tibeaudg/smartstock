
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ProductInfo } from './stock/ProductInfo';
import { StockMovementForm } from './stock/StockMovementForm';
import { useStockMovement } from './stock/useStockMovement';

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
    unitPrice,
    notes,
    referenceNumber,
    setTransactionType,
    setQuantity,
    setUnitPrice,
    setNotes,
    setReferenceNumber,
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
          <DialogTitle>Stock Movement - {product.name}</DialogTitle>
          <DialogDescription>
            Add or remove stock for this product. Current stock: {product.quantity_in_stock}
          </DialogDescription>
        </DialogHeader>

        <ProductInfo product={product} />

        <StockMovementForm
          transactionType={transactionType}
          quantity={quantity}
          unitPrice={unitPrice}
          notes={notes}
          referenceNumber={referenceNumber}
          currentStock={product.quantity_in_stock}
          loading={loading}
          onTransactionTypeChange={setTransactionType}
          onQuantityChange={setQuantity}
          onUnitPriceChange={setUnitPrice}
          onNotesChange={setNotes}
          onReferenceNumberChange={setReferenceNumber}
          onSubmit={handleSubmit}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};
