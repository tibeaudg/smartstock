import { supabase } from '@/integrations/supabase/client';
import type {
  LocationUtilizationItem,
  LocationUtilizationSummary,
} from '@/hooks/useLocationUtilization';
import {
  parseQuantity,
  shouldExcludeParentWithVariants,
  type DashboardProductRow,
} from '@/lib/inventory/dashboardMetrics';
import { fetchInventoryValuation } from '@/lib/inventory/valuation';

type LocationProductRow = Pick<
  DashboardProductRow,
  'id' | 'quantity_in_stock' | 'is_variant' | 'parent_product_id'
> & {
  location?: string | null;
};

export const UNASSIGNED_LOCATION = 'Unassigned';

/** Split comma-separated location strings; empty/null → Unassigned. */
export function expandProductLocations(location: string | null | undefined): string[] {
  const trimmed = (location ?? '').trim();
  if (!trimmed) return [UNASSIGNED_LOCATION];

  const parts = trimmed
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);

  return parts.length > 0 ? parts : [UNASSIGNED_LOCATION];
}

async function fetchLocationProducts(branchId: string): Promise<LocationProductRow[]> {
  const { data, error } = await supabase
    .from('products')
    .select('id, quantity_in_stock, location, is_variant, parent_product_id')
    .eq('branch_id', branchId)
    .eq('status', 'active');

  if (error) throw error;
  return (data ?? []) as LocationProductRow[];
}

function buildLocationSummary(items: LocationUtilizationItem[]): LocationUtilizationSummary {
  const total_value = items.reduce((sum, item) => sum + item.total_value, 0);

  return {
    total_locations: items.length,
    total_value,
    total_products: items.reduce((sum, item) => sum + item.total_products, 0),
    total_quantity: items.reduce((sum, item) => sum + item.total_quantity, 0),
    average_value_per_location: items.length > 0 ? total_value / items.length : 0,
    top_locations: items.slice(0, 10),
  };
}

export async function fetchLocationUtilization(
  branchId: string,
  limit?: number
): Promise<{ items: LocationUtilizationItem[]; summary: LocationUtilizationSummary }> {
  const [products, valuation] = await Promise.all([
    fetchLocationProducts(branchId),
    fetchInventoryValuation(branchId, 'Average'),
  ]);

  const valuationByProduct = new Map(
    valuation.items.map((item) => [item.product_id, item])
  );

  const countableProducts = products.filter(
    (p) => !shouldExcludeParentWithVariants(p, products)
  );

  const locationMap = new Map<
    string,
    { productIds: Set<string>; total_quantity: number; total_value: number }
  >();

  for (const product of countableProducts) {
    const qty = parseQuantity(product.quantity_in_stock);
    if (qty <= 0) continue;

    const valued = valuationByProduct.get(product.id);
    const productValue = valued?.total_valuation ?? 0;
    const locations = expandProductLocations(product.location);

    for (const location of locations) {
      const existing = locationMap.get(location) ?? {
        productIds: new Set<string>(),
        total_quantity: 0,
        total_value: 0,
      };
      existing.productIds.add(product.id);
      existing.total_quantity += qty;
      existing.total_value += productValue;
      locationMap.set(location, existing);
    }
  }

  let items: LocationUtilizationItem[] = Array.from(locationMap.entries()).map(
    ([location, stats]) => ({
      location,
      branch_id: branchId,
      branch_name: null,
      total_products: stats.productIds.size,
      total_quantity: stats.total_quantity,
      total_value: stats.total_value,
      average_value_per_product:
        stats.productIds.size > 0 ? stats.total_value / stats.productIds.size : 0,
      locations_count: locationMap.size,
    })
  );

  items.sort((a, b) => b.total_value - a.total_value);

  const summary = buildLocationSummary(items);
  const displayItems = limit && limit > 0 ? items.slice(0, limit) : items;

  return {
    items: displayItems,
    summary,
  };
}
