import type { NavigateFunction } from 'react-router-dom';

export type AddProductMode = 'quick' | 'full';

export interface NewProductResult {
  id: string;
  name: string;
  purchase_price?: number;
  unit_price?: number;
}

export interface NavigateToAddProductOptions {
  mode?: AddProductMode;
  preFilledSKU?: string;
  preFilledName?: string;
  preFilledCategoryId?: string;
  fromPurchaseOrder?: boolean;
  returnTo?: string;
  returnState?: Record<string, unknown>;
}

export function buildAddProductPath(options: NavigateToAddProductOptions = {}): string {
  const params = new URLSearchParams();
  if (options.mode === 'quick') params.set('quick', '1');
  if (options.preFilledSKU) params.set('sku', options.preFilledSKU);
  if (options.preFilledName) params.set('name', options.preFilledName);
  if (options.preFilledCategoryId) params.set('categoryId', options.preFilledCategoryId);
  if (options.fromPurchaseOrder) params.set('fromPurchaseOrder', '1');
  const qs = params.toString();
  return `/dashboard/products/new${qs ? `?${qs}` : ''}`;
}

export function navigateToAddProduct(
  navigate: NavigateFunction,
  options: NavigateToAddProductOptions = {}
): void {
  const { returnTo, returnState, ...pathOptions } = options;
  navigate(buildAddProductPath(pathOptions), {
    state: returnTo ? { returnTo, returnState } : undefined,
  });
}

export function buildAddVariantPath(productId: string): string {
  return `/dashboard/products/${productId}/variants/new`;
}

export function navigateToAddVariant(navigate: NavigateFunction, productId: string): void {
  navigate(buildAddVariantPath(productId));
}

export type StockAdjustAction = 'in' | 'out';

export interface NavigateToStockAdjustOptions {
  action?: StockAdjustAction;
  variantId?: string;
  returnTo?: string;
}

export function buildStockAdjustPath(
  productId: string,
  options: NavigateToStockAdjustOptions = {}
): string {
  const params = new URLSearchParams();
  if (options.action) params.set('action', options.action);
  if (options.variantId) params.set('variantId', options.variantId);
  const qs = params.toString();
  return `/dashboard/products/${productId}/stock/adjust${qs ? `?${qs}` : ''}`;
}

export function navigateToStockAdjust(
  navigate: NavigateFunction,
  productId: string,
  options: NavigateToStockAdjustOptions = {}
): void {
  const { returnTo, ...pathOptions } = options;
  navigate(buildStockAdjustPath(productId, pathOptions), {
    state: returnTo ? { returnTo } : undefined,
  });
}
