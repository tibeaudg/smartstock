import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { AddProductModal } from '@/components/AddProductModal';

export type AddProductMode = 'quick' | 'full';

export interface OpenAddProductOptions {
  mode?: AddProductMode;
  preFilledSKU?: string;
  preFilledName?: string;
  preFilledCategoryId?: string;
  fromPurchaseOrder?: boolean;
  onProductAdded?: (product?: {
    id: string;
    name: string;
    purchase_price?: number;
    unit_price?: number;
  }) => void;
}

interface AddProductModalContextValue {
  openAddProduct: (options?: OpenAddProductOptions) => void;
  closeAddProduct: () => void;
  isOpen: boolean;
}

const AddProductModalContext = createContext<AddProductModalContextValue | undefined>(undefined);

export function AddProductModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<OpenAddProductOptions>({});

  const openAddProduct = useCallback((opts: OpenAddProductOptions = {}) => {
    setOptions(opts);
    setIsOpen(true);
  }, []);

  const closeAddProduct = useCallback(() => {
    setIsOpen(false);
    setOptions({});
  }, []);

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<{ sku?: string }>).detail;
      openAddProduct({ mode: 'quick', preFilledSKU: detail?.sku });
    };
    window.addEventListener('openAddProductModal', handler);
    return () => window.removeEventListener('openAddProductModal', handler);
  }, [openAddProduct]);

  return (
    <AddProductModalContext.Provider value={{ openAddProduct, closeAddProduct, isOpen }}>
      {children}
      <AddProductModal
        isOpen={isOpen}
        onClose={closeAddProduct}
        mode={options.mode ?? 'quick'}
        preFilledSKU={options.preFilledSKU}
        preFilledName={options.preFilledName}
        preFilledCategoryId={options.preFilledCategoryId}
        fromPurchaseOrder={options.fromPurchaseOrder}
        onProductAdded={(product) => {
          options.onProductAdded?.(product);
        }}
      />
    </AddProductModalContext.Provider>
  );
}

export function useAddProductModal() {
  const ctx = useContext(AddProductModalContext);
  if (!ctx) {
    throw new Error('useAddProductModal must be used within AddProductModalProvider');
  }
  return ctx;
}
