import { supabase } from '@/integrations/supabase/client';
import type {
  InventoryTurnoverItem,
  InventoryTurnoverSummary,
  TurnoverPeriod,
} from '@/hooks/useInventoryTurnover';
import {
  isStockInTransaction,
  isStockOutTransaction,
  parseQuantity,
  shouldExcludeParentWithVariants,
  type DashboardProductRow,
} from '@/lib/inventory/dashboardMetrics';
import { fetchInventoryValuation } from '@/lib/inventory/valuation';

type TurnoverProductRow = Pick<
  DashboardProductRow,
  'id' | 'name' | 'quantity_in_stock' | 'purchase_price' | 'is_variant' | 'parent_product_id' | 'variant_name'
> & {
  categories?: { name: string } | null;
};

type PeriodTransaction = {
  product_id: string;
  quantity: number | string;
  unit_price: number | string | null;
  transaction_type: string;
  reference_number?: string | null;
  created_at: string;
};

function parseCost(value: number | string | null | undefined): number {
  const cost = Number(value);
  return Number.isFinite(cost) && cost > 0 ? cost : 0;
}

function formatProductName(product: TurnoverProductRow): string {
  if (product.is_variant && product.variant_name) {
    return `${product.name ?? 'Unknown'} - ${product.variant_name}`;
  }
  return product.name ?? 'Unknown';
}

export function resolveTurnoverPeriod(
  period: TurnoverPeriod = 'monthly',
  startDate?: Date,
  endDate?: Date
): { periodStart: Date; periodEnd: Date } {
  const periodEnd = endDate ? new Date(endDate) : new Date();
  periodEnd.setHours(23, 59, 59, 999);

  let periodStart: Date;
  if (startDate) {
    periodStart = new Date(startDate);
  } else {
    periodStart = new Date(periodEnd);
    switch (period) {
      case 'quarterly':
        periodStart.setMonth(periodStart.getMonth() - 3);
        break;
      case 'yearly':
        periodStart.setFullYear(periodStart.getFullYear() - 1);
        break;
      default:
        periodStart.setMonth(periodStart.getMonth() - 1);
    }
  }
  periodStart.setHours(0, 0, 0, 0);

  return { periodStart, periodEnd };
}

async function fetchTurnoverProducts(branchId: string): Promise<TurnoverProductRow[]> {
  const { data, error } = await supabase
    .from('products')
    .select(
      'id, name, quantity_in_stock, purchase_price, is_variant, parent_product_id, variant_name, categories(name)'
    )
    .eq('branch_id', branchId)
    .eq('status', 'active');

  if (error) throw error;
  return (data ?? []) as TurnoverProductRow[];
}

async function fetchPeriodTransactions(
  branchId: string,
  periodStart: Date,
  periodEnd: Date
): Promise<PeriodTransaction[]> {
  const { data, error } = await supabase
    .from('stock_transactions')
    .select('product_id, quantity, unit_price, transaction_type, reference_number, created_at')
    .eq('branch_id', branchId)
    .gte('created_at', periodStart.toISOString())
    .lte('created_at', periodEnd.toISOString());

  if (error) throw error;
  return (data ?? []) as PeriodTransaction[];
}

function resolveUnitCost(
  productId: string,
  txUnitPrice: number,
  costByProduct: Map<string, number>,
  valuationCostByProduct: Map<string, number>
): number {
  if (txUnitPrice > 0) return txUnitPrice;
  const valuedCost = valuationCostByProduct.get(productId) ?? 0;
  if (valuedCost > 0) return valuedCost;
  return costByProduct.get(productId) ?? 0;
}

function buildTurnoverSummary(items: InventoryTurnoverItem[]): InventoryTurnoverSummary {
  const total_cogs = items.reduce((sum, item) => sum + item.cogs, 0);
  const total_average_inventory = items.reduce((sum, item) => sum + item.average_inventory, 0);

  const summary: InventoryTurnoverSummary = {
    average_turnover_ratio:
      total_average_inventory > 0 ? total_cogs / total_average_inventory : 0,
    total_cogs,
    total_average_inventory,
    by_category: {},
  };

  items.forEach((item) => {
    if (!summary.by_category[item.category_name]) {
      summary.by_category[item.category_name] = { turnover_ratio: 0, cogs: 0 };
    }
    summary.by_category[item.category_name].cogs += item.cogs;
  });

  Object.keys(summary.by_category).forEach((category) => {
    const categoryItems = items.filter((item) => item.category_name === category);
    const categoryAvgInventory = categoryItems.reduce(
      (sum, item) => sum + item.average_inventory,
      0
    );
    if (categoryAvgInventory > 0) {
      summary.by_category[category].turnover_ratio =
        summary.by_category[category].cogs / categoryAvgInventory;
    }
  });

  return summary;
}

export async function fetchInventoryTurnover(
  branchId: string,
  period: TurnoverPeriod = 'monthly',
  startDate?: Date,
  endDate?: Date
): Promise<{ items: InventoryTurnoverItem[]; summary: InventoryTurnoverSummary }> {
  const { periodStart, periodEnd } = resolveTurnoverPeriod(period, startDate, endDate);
  const periodDays = Math.max(
    1,
    Math.ceil((periodEnd.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24))
  );

  const [products, transactions, valuation] = await Promise.all([
    fetchTurnoverProducts(branchId),
    fetchPeriodTransactions(branchId, periodStart, periodEnd),
    fetchInventoryValuation(branchId, 'Average'),
  ]);

  const costByProduct = new Map(
    products.map((p) => [p.id, parseCost(p.purchase_price)])
  );
  const valuationCostByProduct = new Map(
    valuation.items.map((item) => [item.product_id, item.average_cost_per_unit])
  );

  const countableProducts = products.filter(
    (p) => !shouldExcludeParentWithVariants(p, products)
  );

  const activeProductIds = new Set<string>([
    ...countableProducts.map((p) => p.id),
    ...transactions.map((t) => t.product_id),
  ]);

  const items: InventoryTurnoverItem[] = [];

  for (const productId of activeProductIds) {
    const product = countableProducts.find((p) => p.id === productId);
    if (!product) continue;

    const productTxs = transactions.filter((t) => t.product_id === productId);
    const unitCost =
      valuationCostByProduct.get(productId) ||
      costByProduct.get(productId) ||
      0;

    const endingQty = parseQuantity(product.quantity_in_stock);
    const endingValue = endingQty * unitCost;

    let incomingQty = 0;
    let outgoingQty = 0;
    let cogs = 0;

    for (const tx of productTxs) {
      const qty = Math.abs(parseQuantity(tx.quantity));
      if (qty <= 0) continue;

      const txCost = resolveUnitCost(
        productId,
        Number(tx.unit_price) || 0,
        costByProduct,
        valuationCostByProduct
      );

      if (isStockOutTransaction(tx)) {
        outgoingQty += qty;
        cogs += qty * txCost;
      } else if (isStockInTransaction(tx)) {
        incomingQty += qty;
      }
    }

    const beginningQty = Math.max(0, endingQty - incomingQty + outgoingQty);
    const beginningValue = beginningQty * unitCost;
    const averageInventory = (beginningValue + endingValue) / 2;
    const turnoverRatio = averageInventory > 0 ? cogs / averageInventory : 0;
    const daysSalesOfInventory =
      cogs > 0 ? (averageInventory / cogs) * periodDays : null;

    if (averageInventory <= 0 && cogs <= 0 && endingQty <= 0) continue;

    items.push({
      product_id: productId,
      product_name: formatProductName(product),
      category_name: product.categories?.name ?? 'Uncategorized',
      period_start: periodStart.toISOString().split('T')[0],
      period_end: periodEnd.toISOString().split('T')[0],
      beginning_inventory: beginningValue,
      ending_inventory: endingValue,
      average_inventory: averageInventory,
      cogs,
      turnover_ratio: turnoverRatio,
      days_sales_of_inventory: daysSalesOfInventory,
    });
  }

  return {
    items,
    summary: buildTurnoverSummary(items),
  };
}
