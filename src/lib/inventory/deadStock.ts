import { supabase } from '@/integrations/supabase/client';
import type { DeadStockItem, DeadStockSummary } from '@/hooks/useDeadStock';
import { parseMinLevel, parseQuantity } from '@/lib/inventory/dashboardMetrics';
import { fetchInventoryValuation } from '@/lib/inventory/valuation';

/** Mirrors SQL filters in identify_dead_stock — audit-only rows are not stock movement. */
export function isQualifyingStockMovement(tx: {
  quantity?: number | null;
  reference_number?: string | null;
}): boolean {
  const qty = Number(tx.quantity);
  if (!Number.isFinite(qty) || qty === 0) return false;
  if ((tx.reference_number ?? '') === 'PRODUCT_CREATED') return false;
  return true;
}

/** Last activity from movement records only; metadata edits (updated_at) are ignored. */
export function resolveLastActivityDate(
  lastMovementAt: string | undefined | null,
  createdAt: string | undefined | null
): string | null {
  return lastMovementAt ?? createdAt ?? null;
}

export function daysBetween(from: Date, to: Date): number {
  return Math.max(0, Math.floor((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)));
}

export function qualifiesAsDeadStock(daysSince: number, thresholdDays: number): boolean {
  return daysSince >= thresholdDays;
}

function getRecommendation(days: number, thresholdDays: number): string {
  if (days >= thresholdDays * 2) return 'Consider liquidation or disposal';
  if (days >= thresholdDays) return 'Review and potentially markdown';
  return 'Monitor';
}

type IdentifyDeadStockRow = {
  product_id: string;
  product_name: string;
  category_name: string;
  location: string;
  current_stock: number;
  minimum_stock_level: number;
  last_transaction_date: string;
  days_since_last_movement: number;
  stock_value: number;
  unit_price: number;
  recommendation: string;
};

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

function mapRpcRowToDeadStockItem(
  row: IdentifyDeadStockRow,
  valuationByProduct: Map<string, { total_valuation: number; average_cost_per_unit: number }>,
  thresholdDays: number
): DeadStockItem {
  const qty = parseQuantity(row.current_stock);
  const valued = valuationByProduct.get(row.product_id);
  const unitCost = valued?.average_cost_per_unit ?? (Number(row.unit_price) || 0);
  const stockValue = valued?.total_valuation ?? qty * unitCost;

  return {
    product_id: row.product_id,
    product_name: row.product_name,
    category_name: row.category_name,
    location: row.location,
    current_stock: qty,
    minimum_stock_level: parseMinLevel(row.minimum_stock_level),
    last_transaction_date: row.last_transaction_date,
    days_since_last_movement: row.days_since_last_movement,
    stock_value: stockValue,
    unit_price: unitCost,
    recommendation:
      row.recommendation || getRecommendation(row.days_since_last_movement, thresholdDays),
  };
}

export async function fetchDeadStock(
  branchId: string,
  thresholdDays = 90,
  minStockLevel = 0
): Promise<{ items: DeadStockItem[]; summary: DeadStockSummary }> {
  const [rpcResult, valuation] = await Promise.all([
    supabase.rpc('identify_dead_stock', {
      p_branch_id: branchId,
      p_threshold_days: thresholdDays,
      p_min_stock_level: minStockLevel,
    }),
    fetchInventoryValuation(branchId, 'Average'),
  ]);

  if (rpcResult.error) throw rpcResult.error;

  const valuationByProduct = new Map(
    valuation.items.map((item) => [
      item.product_id,
      {
        total_valuation: item.total_valuation,
        average_cost_per_unit: item.average_cost_per_unit,
      },
    ])
  );

  const items = ((rpcResult.data ?? []) as IdentifyDeadStockRow[])
    .map((row) => mapRpcRowToDeadStockItem(row, valuationByProduct, thresholdDays))
    .sort((a, b) => b.days_since_last_movement - a.days_since_last_movement);

  return {
    items,
    summary: buildDeadStockSummary(items),
  };
}
