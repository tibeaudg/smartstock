import { supabase } from '@/integrations/supabase/client';
import type { DeadStockItem, DeadStockSummary } from '@/hooks/useDeadStock';
import {
  parseMinLevel,
  parseQuantity,
  shouldExcludeParentWithVariants,
  type DashboardProductRow,
} from '@/lib/inventory/dashboardMetrics';
import { fetchInventoryValuation } from '@/lib/inventory/valuation';

type DeadStockProductRow = Pick<
  DashboardProductRow,
  | 'id'
  | 'name'
  | 'quantity_in_stock'
  | 'purchase_price'
  | 'minimum_stock_level'
  | 'is_variant'
  | 'parent_product_id'
  | 'variant_name'
  | 'updated_at'
  | 'created_at'
> & {
  location?: string | null;
  categories?: { name: string } | null;
};

function formatProductName(product: DeadStockProductRow): string {
  if (product.is_variant && product.variant_name) {
    return `${product.name ?? 'Unknown'} - ${product.variant_name}`;
  }
  return product.name ?? 'Unknown';
}

function normalizeLocation(location: string | null | undefined): string {
  const trimmed = (location ?? '').trim();
  return trimmed || 'Unassigned';
}

function getRecommendation(days: number, thresholdDays: number): string {
  if (days >= thresholdDays * 2) return 'Consider liquidation or disposal';
  if (days >= thresholdDays) return 'Review and potentially markdown';
  return 'Monitor';
}

function daysBetween(from: Date, to: Date): number {
  return Math.max(0, Math.floor((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)));
}

async function fetchDeadStockProducts(branchId: string): Promise<DeadStockProductRow[]> {
  const { data, error } = await supabase
    .from('products')
    .select(
      'id, name, quantity_in_stock, purchase_price, minimum_stock_level, is_variant, parent_product_id, variant_name, location, updated_at, created_at, categories(name)'
    )
    .eq('branch_id', branchId)
    .eq('status', 'active');

  if (error) throw error;
  return (data ?? []) as DeadStockProductRow[];
}

async function fetchLastTransactionDates(
  branchId: string,
  productIds: string[]
): Promise<Map<string, string>> {
  if (productIds.length === 0) return new Map();

  const { data, error } = await supabase
    .from('stock_transactions')
    .select('product_id, created_at')
    .eq('branch_id', branchId)
    .in('product_id', productIds)
    .order('created_at', { ascending: false });

  if (error) throw error;

  const lastByProduct = new Map<string, string>();
  for (const row of data ?? []) {
    if (!lastByProduct.has(row.product_id)) {
      lastByProduct.set(row.product_id, row.created_at);
    }
  }
  return lastByProduct;
}

function buildDeadStockSummary(items: DeadStockItem[]): DeadStockSummary {
  const summary: DeadStockSummary = {
    total_items: items.length,
    total_value: items.reduce((sum, item) => sum + item.stock_value, 0),
    total_quantity: items.reduce((sum, item) => sum + item.current_stock, 0),
    by_category: {},
    by_recommendation: {},
  };

  items.forEach((item) => {
    if (!summary.by_category[item.category_name]) {
      summary.by_category[item.category_name] = { count: 0, value: 0 };
    }
    summary.by_category[item.category_name].count += 1;
    summary.by_category[item.category_name].value += item.stock_value;

    if (!summary.by_recommendation[item.recommendation]) {
      summary.by_recommendation[item.recommendation] = { count: 0, value: 0 };
    }
    summary.by_recommendation[item.recommendation].count += 1;
    summary.by_recommendation[item.recommendation].value += item.stock_value;
  });

  return summary;
}

export async function fetchDeadStock(
  branchId: string,
  thresholdDays = 90,
  minStockLevel = 0
): Promise<{ items: DeadStockItem[]; summary: DeadStockSummary }> {
  const [products, valuation] = await Promise.all([
    fetchDeadStockProducts(branchId),
    fetchInventoryValuation(branchId, 'Average'),
  ]);

  const valuationByProduct = new Map(
    valuation.items.map((item) => [item.product_id, item])
  );

  const eligibleProducts = products.filter((product) => {
    if (shouldExcludeParentWithVariants(product, products)) return false;
    return parseQuantity(product.quantity_in_stock) >= minStockLevel;
  });

  const lastTxDates = await fetchLastTransactionDates(
    branchId,
    eligibleProducts.map((p) => p.id)
  );

  const now = new Date();
  const items: DeadStockItem[] = [];

  for (const product of eligibleProducts) {
    const qty = parseQuantity(product.quantity_in_stock);
    const valued = valuationByProduct.get(product.id);
    const unitCost = valued?.average_cost_per_unit ?? 0;
    const stockValue = valued?.total_valuation ?? qty * unitCost;

    const lastTx = lastTxDates.get(product.id);
    const fallbackDate = product.updated_at ?? product.created_at;
    const lastActivity = lastTx ?? fallbackDate ?? null;

    const daysSince = lastActivity
      ? daysBetween(new Date(lastActivity), now)
      : thresholdDays;

    if (daysSince < thresholdDays) continue;

    items.push({
      product_id: product.id,
      product_name: formatProductName(product),
      category_name: product.categories?.name ?? 'Uncategorized',
      location: normalizeLocation(product.location),
      current_stock: qty,
      minimum_stock_level: parseMinLevel(product.minimum_stock_level),
      last_transaction_date: lastActivity ?? now.toISOString(),
      days_since_last_movement: daysSince,
      stock_value: stockValue,
      unit_price: unitCost,
      recommendation: getRecommendation(daysSince, thresholdDays),
    });
  }

  items.sort((a, b) => b.days_since_last_movement - a.days_since_last_movement);

  return {
    items,
    summary: buildDeadStockSummary(items),
  };
}
