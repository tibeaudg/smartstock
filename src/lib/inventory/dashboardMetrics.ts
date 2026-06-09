/**
 * Shared inventory metric calculations used by dashboard hooks and components.
 * Keeps low-stock, out-of-stock, and quantity parsing consistent everywhere.
 */

export interface DashboardProductRow {
  id: string;
  quantity_in_stock: number | string | null;
  purchase_price?: number | string | null;
  minimum_stock_level?: number | string | null;
  is_variant?: boolean | null;
  parent_product_id?: string | null;
  category_id?: string | null;
  name?: string;
  variant_name?: string | null;
  sku?: string | null;
  created_at?: string;
  updated_at?: string;
  categories?: { name: string } | null;
}

export interface DashboardLowStockItem {
  id: string;
  product_name: string;
  quantity_in_stock: number;
  min_stock_level: number;
  category?: string;
}

export function parseQuantity(value: number | string | null | undefined): number {
  const qty = Number(value);
  return Number.isFinite(qty) ? qty : 0;
}

export function parseMinLevel(value: number | string | null | undefined): number {
  const min = Number(value);
  return Number.isFinite(min) && min > 0 ? min : 0;
}

/** Parent catalog rows that only exist as variant containers should not be counted. */
export function shouldExcludeParentWithVariants(
  product: DashboardProductRow,
  allProducts: DashboardProductRow[]
): boolean {
  if (product.is_variant === false && product.parent_product_id == null) {
    return allProducts.some((p) => p.parent_product_id === product.id);
  }
  return false;
}

export function isOutOfStock(product: DashboardProductRow): boolean {
  return parseQuantity(product.quantity_in_stock) === 0;
}

export function isLowStockProduct(
  product: DashboardProductRow,
  allProducts: DashboardProductRow[]
): boolean {
  if (shouldExcludeParentWithVariants(product, allProducts)) return false;
  const min = parseMinLevel(product.minimum_stock_level);
  if (min <= 0) return false;
  return parseQuantity(product.quantity_in_stock) <= min;
}

/** Stock above minimum but within 2× minimum — early warning band. */
export function isApproachingMinStock(
  product: DashboardProductRow,
  allProducts: DashboardProductRow[]
): boolean {
  if (shouldExcludeParentWithVariants(product, allProducts)) return false;
  const min = parseMinLevel(product.minimum_stock_level);
  if (min <= 0) return false;
  const qty = parseQuantity(product.quantity_in_stock);
  return qty > min && qty <= min * 2;
}

export function countLowStockProducts(products: DashboardProductRow[]): number {
  return products.filter((p) => isLowStockProduct(p, products)).length;
}

export function countOutOfStockProducts(products: DashboardProductRow[]): number {
  return products.filter((p) => isOutOfStock(p)).length;
}

export function countApproachingMinProducts(products: DashboardProductRow[]): number {
  return products.filter((p) => isApproachingMinStock(p, products)).length;
}

export function sumTotalQuantity(products: DashboardProductRow[]): number {
  return products.reduce((sum, p) => sum + parseQuantity(p.quantity_in_stock), 0);
}

export function countDistinctCategories(products: DashboardProductRow[]): number {
  const ids = new Set(
    products
      .map((p) => p.category_id)
      .filter((id): id is string => Boolean(id))
  );
  return ids.size;
}

export function mapLowStockProduct(
  product: DashboardProductRow,
  allProducts: DashboardProductRow[]
): DashboardLowStockItem {
  return {
    id: product.id,
    product_name:
      product.is_variant && product.variant_name
        ? `${product.name} - ${product.variant_name}`
        : (product.name ?? 'Unknown'),
    quantity_in_stock: parseQuantity(product.quantity_in_stock),
    min_stock_level: parseMinLevel(product.minimum_stock_level),
    category: product.categories?.name ?? undefined,
  };
}

export function getLowStockProducts(products: DashboardProductRow[]): DashboardLowStockItem[] {
  return products
    .filter((p) => isLowStockProduct(p, products))
    .map((p) => mapLowStockProduct(p, products))
    .sort((a, b) => a.quantity_in_stock - b.quantity_in_stock);
}

export function countProductsAddedSince(
  products: Array<{ created_at?: string }>,
  since: Date
): number {
  return products.filter((p) => p.created_at && new Date(p.created_at) >= since).length;
}

const INCOMING_TYPES = new Set([
  'incoming',
  'in',
  'purchase_order',
  'scan_adjustment',
  'return',
]);

const OUTGOING_TYPES = new Set([
  'outgoing',
  'out',
  'sales_order',
  'damage',
]);

export function isIncomingTransaction(type: string): boolean {
  return INCOMING_TYPES.has(type);
}

export function isOutgoingTransaction(type: string): boolean {
  return OUTGOING_TYPES.has(type);
}

type StockDirectionTx = {
  transaction_type: string;
  reference_number?: string | null;
};

/** Stock-in for quantity / COGS calculations (includes manual & scan adjustments). */
export function isStockInTransaction(tx: StockDirectionTx): boolean {
  if (isIncomingTransaction(tx.transaction_type)) return true;
  if (tx.transaction_type === 'manual_adjustment') {
    const ref = tx.reference_number ?? '';
    return ref.includes('_IN') || !ref.includes('OUT');
  }
  if (tx.transaction_type === 'scan_adjustment') {
    return !(tx.reference_number ?? '').includes('OUTGOING');
  }
  return false;
}

/** Stock-out for COGS calculations (includes manual & scan adjustments). */
export function isStockOutTransaction(tx: StockDirectionTx): boolean {
  if (isOutgoingTransaction(tx.transaction_type)) return true;
  if (tx.transaction_type === 'manual_adjustment') {
    return (tx.reference_number ?? '').includes('OUT');
  }
  if (tx.transaction_type === 'scan_adjustment') {
    return (tx.reference_number ?? '').includes('OUTGOING');
  }
  return false;
}

export type ActivityType = 'stock_in' | 'stock_out' | 'edit' | 'create' | 'delete';

export function transactionToActivityType(transactionType: string): ActivityType {
  if (isIncomingTransaction(transactionType)) return 'stock_in';
  if (isOutgoingTransaction(transactionType)) return 'stock_out';
  if (transactionType === 'cycle_count' || transactionType === 'manual_adjustment' || transactionType === 'adjustment') {
    return 'edit';
  }
  if (transactionType === 'stock_transfer') return 'edit';
  return 'edit';
}

export interface HealthBreakdown {
  out: number;
  critical: number;
  low: number;
  healthy: number;
}

/** Partition countable products into mutually exclusive health buckets. */
export function computeHealthBreakdownFromProducts(
  products: DashboardProductRow[]
): HealthBreakdown {
  let out = 0;
  let critical = 0;
  let low = 0;
  let healthy = 0;

  for (const product of products) {
    if (shouldExcludeParentWithVariants(product, products)) continue;

    const qty = parseQuantity(product.quantity_in_stock);
    const min = parseMinLevel(product.minimum_stock_level);

    if (qty === 0) {
      out += 1;
      continue;
    }
    if (min > 0 && qty <= min) {
      critical += 1;
      continue;
    }
    if (min > 0 && qty <= min * 2) {
      low += 1;
      continue;
    }
    healthy += 1;
  }

  return { out, critical, low, healthy };
}
