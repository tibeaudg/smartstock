#!/usr/bin/env node

/**
 * Backfill stock history for imported products.
 *
 * Usage:
 *   1. Ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are available in your env (e.g. via .env).
 *   2. Run `node scripts/backfill-imported-stock-transactions.mjs`.
 *   3. Inspect the console output to verify how many records were created.
 *
 * The script finds products with on-hand stock that do not yet have any stock_transactions
 * entries and creates a single incoming transaction representing their initial balance.
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Set them in your environment before running this script.'
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const formatProductName = ({ name, is_variant, variant_name }) => {
  if (is_variant && variant_name) {
    return `${name} - ${variant_name}`;
  }
  return name;
};

const createTransactionPayload = (product) => {
  const quantity = Number(product.quantity_in_stock) || 0;
  if (quantity <= 0) {
    return null;
  }

  const unitPrice = Number(product.purchase_price) || 0;

  return {
    product_id: product.id,
    product_name: formatProductName(product),
    transaction_type: 'incoming',
    quantity,
    unit_price: unitPrice,
    total_value: unitPrice * quantity,
    branch_id: product.branch_id,
    user_id: product.user_id,
    created_by: product.user_id,
    reference_number: 'BACKFILL_INITIAL_STOCK',
    notes: 'Backfilled initial stock transaction for imported product',
    variant_id: product.is_variant ? product.id : null,
    variant_name: product.is_variant ? product.variant_name : null,
  };
};

async function productHasMovements(productId) {
  const { data, error } = await supabase
    .from('stock_transactions')
    .select('id')
    .eq('product_id', productId)
    .limit(1);

  if (error) {
    throw new Error(`Failed to inspect stock transactions for product ${productId}: ${error.message}`);
  }

  return Array.isArray(data) && data.length > 0;
}

async function main() {
  console.log('Starting stock transaction backfill…');

  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, name, branch_id, user_id, quantity_in_stock, purchase_price, is_variant, variant_name')
    .gt('quantity_in_stock', 0);

  if (productsError) {
    console.error('Failed to fetch products:', productsError.message);
    process.exit(1);
  }

  if (!products?.length) {
    console.log('No products with positive stock were found. Nothing to do.');
    process.exit(0);
  }

  let createdCount = 0;
  let skippedCount = 0;

  for (const product of products) {
    try {
      const alreadyHasMovements = await productHasMovements(product.id);
      if (alreadyHasMovements) {
        skippedCount += 1;
        continue;
      }

      const payload = createTransactionPayload(product);
      if (!payload) {
        skippedCount += 1;
        continue;
      }

      const { error: insertError } = await supabase.from('stock_transactions').insert(payload);
      if (insertError) {
        throw new Error(insertError.message);
      }

      createdCount += 1;
      console.log(`Created backfill transaction for ${payload.product_name}`);
    } catch (error) {
      console.error(`Failed to create stock transaction for product ${product.id}:`, error.message);
    }
  }

  console.log('Backfill complete.');
  console.log(`Created: ${createdCount}`);
  console.log(`Skipped: ${skippedCount}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Unexpected error while running stock transaction backfill:', error);
    process.exit(1);
  });

