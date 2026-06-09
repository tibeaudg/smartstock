import { supabase } from '@/integrations/supabase/client';

import type { InventoryValuationItem, InventoryValuationSummary, ValuationMethod } from '@/hooks/useInventoryValuation';

import {

  parseQuantity,

  shouldExcludeParentWithVariants,

  type DashboardProductRow,

} from '@/lib/inventory/dashboardMetrics';



const VALUATION_RPC: Record<ValuationMethod, string> = {

  FIFO: 'calculate_inventory_valuation_fifo',

  LIFO: 'calculate_inventory_valuation_lifo',

  Average: 'calculate_inventory_valuation_average',

};



export const VALUATION_METHOD_LABELS: Record<ValuationMethod, string> = {

  FIFO: 'FIFO (First In, First Out)',

  LIFO: 'LIFO (Last In, First Out)',

  Average: 'Weighted Average Cost',

};



export const VALUATION_METHOD_DESCRIPTIONS: Record<ValuationMethod, string> = {

  FIFO: 'Values remaining stock using the oldest purchase prices first.',

  LIFO: 'Values remaining stock using the newest purchase prices first.',

  Average: 'Values stock using the weighted average of all recorded purchase prices.',

};



type ValuationProductRow = Pick<

  DashboardProductRow,

  | 'id'

  | 'name'

  | 'quantity_in_stock'

  | 'purchase_price'

  | 'is_variant'

  | 'parent_product_id'

  | 'variant_name'

> & {

  location?: string | null;

  categories?: { name: string } | null;

};



function parseCost(value: number | string | null | undefined): number {

  const cost = Number(value);

  return Number.isFinite(cost) && cost > 0 ? cost : 0;

}



function formatProductName(product: ValuationProductRow): string {

  if (product.is_variant && product.variant_name) {

    return `${product.name ?? 'Unknown'} - ${product.variant_name}`;

  }

  return product.name ?? 'Unknown';

}



function mapRpcItem(item: Record<string, unknown>): InventoryValuationItem {

  return {

    product_id: item.product_id as string,

    product_name: item.product_name as string,

    category_name: item.category_name as string,

    location: item.location as string,

    current_stock: Number(item.current_stock) || 0,

    valuation_method: item.valuation_method as string,

    total_valuation: parseFloat(String(item.total_valuation ?? 0)),

    average_cost_per_unit: parseFloat(String(item.average_cost_per_unit ?? 0)),

  };

}



function buildSummary(items: InventoryValuationItem[]): InventoryValuationSummary {
  const total_valuation = items.reduce((sum, item) => sum + item.total_valuation, 0);
  const total_quantity = items.reduce((sum, item) => sum + item.current_stock, 0);
  const valued_quantity = items.reduce(
    (sum, item) => sum + (item.average_cost_per_unit > 0 ? item.current_stock : 0),
    0
  );

  const summary: InventoryValuationSummary = {
    total_valuation,
    total_products: items.length,
    total_quantity,
    valued_quantity,
    average_cost_per_unit:
      valued_quantity > 0 ? total_valuation / valued_quantity : 0,
    by_category: {},
    by_location: {},
  };



  items.forEach((item) => {

    summary.by_category[item.category_name] =

      (summary.by_category[item.category_name] || 0) + item.total_valuation;

    summary.by_location[item.location] =

      (summary.by_location[item.location] || 0) + item.total_valuation;

  });



  return summary;

}



async function fetchValuationProducts(

  branchId: string,

  categoryId?: string | null

): Promise<ValuationProductRow[]> {

  let query = supabase

    .from('products')

    .select(

      'id, name, quantity_in_stock, purchase_price, is_variant, parent_product_id, variant_name, location, categories(name)'

    )

    .eq('branch_id', branchId)

    .eq('status', 'active');



  if (categoryId) {

    query = query.eq('category_id', categoryId);

  }



  const { data, error } = await query;

  if (error) throw error;

  return (data ?? []) as ValuationProductRow[];

}



/**

 * RPC valuation only considers certain stock transaction types and excludes variants.

 * Merge product-level purchase_price so items valued on the product record are included.

 */

function enrichValuationItems(

  rpcItems: InventoryValuationItem[],

  products: ValuationProductRow[],

  method: ValuationMethod

): InventoryValuationItem[] {

  const rpcByProduct = new Map(rpcItems.map((item) => [item.product_id, item]));

  const methodLabel =

    method === 'Average' ? 'Average Cost' : method === 'FIFO' ? 'FIFO' : 'LIFO';



  const valuableProducts = products.filter((product) => {

    if (shouldExcludeParentWithVariants(product, products)) return false;

    return parseQuantity(product.quantity_in_stock) > 0;

  });



  return valuableProducts.map((product) => {

    const qty = parseQuantity(product.quantity_in_stock);

    const purchaseCost = parseCost(product.purchase_price);

    const existing = rpcByProduct.get(product.id);



    if (existing && (existing.total_valuation > 0 || existing.average_cost_per_unit > 0)) {

      return existing;

    }



    if (purchaseCost > 0) {

      return {

        product_id: product.id,

        product_name: existing?.product_name ?? formatProductName(product),

        category_name:

          existing?.category_name ?? product.categories?.name ?? 'Uncategorized',

        location: existing?.location ?? product.location ?? 'No Location',

        current_stock: qty,

        valuation_method: existing?.valuation_method ?? methodLabel,

        total_valuation: qty * purchaseCost,

        average_cost_per_unit: purchaseCost,

      };

    }



    if (existing) {

      return existing;

    }



    return {

      product_id: product.id,

      product_name: formatProductName(product),

      category_name: product.categories?.name ?? 'Uncategorized',

      location: product.location ?? 'No Location',

      current_stock: qty,

      valuation_method: methodLabel,

      total_valuation: 0,

      average_cost_per_unit: 0,

    };

  });

}



export async function fetchInventoryValuation(

  branchId: string,

  method: ValuationMethod = 'Average',

  categoryId?: string | null

): Promise<{ items: InventoryValuationItem[]; summary: InventoryValuationSummary }> {

  const [rpcResult, products] = await Promise.all([

    supabase.rpc(VALUATION_RPC[method], {

      p_branch_id: branchId,

      p_category_id: categoryId ?? null,

    }),

    fetchValuationProducts(branchId, categoryId),

  ]);



  if (rpcResult.error) throw rpcResult.error;



  const rpcItems = (rpcResult.data || []).map((item: Record<string, unknown>) =>

    mapRpcItem(item)

  );

  const items = enrichValuationItems(rpcItems, products, method);

  const summary = buildSummary(items);



  return { items, summary };

}



function productHasCostData(

  product: {

    id: string;

    purchase_price?: number | string | null;

    parent_product_id?: string | null;

  },

  valuedByProduct: Map<string, boolean>

): boolean {

  if (parseCost(product.purchase_price) > 0) return true;

  if (valuedByProduct.get(product.id)) return true;

  if (product.parent_product_id && valuedByProduct.get(product.parent_product_id)) {

    return true;

  }

  return false;

}



/** Products with stock on hand but no purchase price history to value them. */

export function countItemsWithoutCostData(

  products: Array<{

    id: string;

    quantity_in_stock: number | string | null;

    purchase_price?: number | string | null;

    parent_product_id?: string | null;

    is_variant?: boolean | null;

  }>,

  valuationItems: InventoryValuationItem[]

): number {

  const valuedByProduct = new Map(

    valuationItems.map((item) => [

      item.product_id,

      item.total_valuation > 0 || item.average_cost_per_unit > 0,

    ])

  );



  return products.filter((product) => {

    if (shouldExcludeParentWithVariants(product, products)) return false;

    const qty = parseQuantity(product.quantity_in_stock);

    if (qty <= 0) return false;

    return !productHasCostData(product, valuedByProduct);

  }).length;

}

