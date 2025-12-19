import { supabase } from '@/integrations/supabase/client';

/**
 * Calculate how many days a product has been out of stock
 * @param productId Product ID
 * @param branchId Branch ID
 * @returns Number of days out of stock, or null if product is not out of stock or no data available
 */
export async function calculateDaysOutOfStock(
  productId: string,
  branchId: string
): Promise<number | null> {
  try {
    // First, check if product is currently out of stock
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('quantity_in_stock')
      .eq('id', productId)
      .eq('branch_id', branchId)
      .single();

    if (productError || !product) {
      return null;
    }

    const currentStock = Number(product.quantity_in_stock) || 0;
    
    // If product has stock, it's not out of stock
    if (currentStock > 0) {
      return null;
    }

    // Find the last transaction where stock went to zero or below
    // We'll look for the last outgoing transaction that resulted in zero stock
    const { data: transactions, error: txError } = await supabase
      .from('stock_transactions')
      .select('created_at, quantity, transaction_type, quantity_after')
      .eq('product_id', productId)
      .eq('branch_id', branchId)
      .in('transaction_type', ['outgoing', 'sales_order', 'adjustment'])
      .order('created_at', { ascending: false })
      .limit(100);

    if (txError || !transactions || transactions.length === 0) {
      // If no transactions, we can't determine when it went out
      // Return null to indicate unknown
      return null;
    }

    // Find the most recent transaction where quantity_after was 0 or negative
    const zeroStockTransaction = transactions.find(
      tx => (tx.quantity_after !== null && Number(tx.quantity_after) <= 0) ||
            (tx.quantity_after === null && tx.transaction_type === 'outgoing')
    );

    if (!zeroStockTransaction) {
      // Check if we can infer from the transaction pattern
      // Look for the last transaction before current state
      const lastTransaction = transactions[0];
      if (lastTransaction) {
        const lastTxDate = new Date(lastTransaction.created_at);
        const now = new Date();
        const daysDiff = Math.floor((now.getTime() - lastTxDate.getTime()) / (1000 * 60 * 60 * 24));
        return daysDiff;
      }
      return null;
    }

    // Calculate days since stock went to zero
    const zeroDate = new Date(zeroStockTransaction.created_at);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - zeroDate.getTime()) / (1000 * 60 * 60 * 24));

    return daysDiff >= 0 ? daysDiff : 0;
  } catch (error) {
    console.error('Error calculating days out of stock:', error);
    return null;
  }
}

/**
 * Batch calculate days out of stock for multiple products
 * More efficient than calling calculateDaysOutOfStock multiple times
 */
export async function calculateDaysOutOfStockBatch(
  productIds: string[],
  branchId: string
): Promise<Map<string, number | null>> {
  const result = new Map<string, number | null>();

  if (productIds.length === 0) {
    return result;
  }

  try {
    // Get current stock for all products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, quantity_in_stock')
      .eq('branch_id', branchId)
      .in('id', productIds);

    if (productsError || !products) {
      productIds.forEach(id => result.set(id, null));
      return result;
    }

    // Filter to only products that are out of stock
    const outOfStockProducts = products.filter(
      p => (Number(p.quantity_in_stock) || 0) === 0
    );

    if (outOfStockProducts.length === 0) {
      productIds.forEach(id => result.set(id, null));
      return result;
    }

    // Get recent transactions for out-of-stock products
    const { data: transactions, error: txError } = await supabase
      .from('stock_transactions')
      .select('product_id, created_at, quantity_after')
      .eq('branch_id', branchId)
      .in('product_id', outOfStockProducts.map(p => p.id))
      .in('transaction_type', ['outgoing', 'sales_order', 'adjustment'])
      .order('created_at', { ascending: false })
      .limit(1000);

    if (txError || !transactions) {
      outOfStockProducts.forEach(p => result.set(p.id, null));
      return result;
    }

    // Group transactions by product
    const transactionsByProduct = new Map<string, typeof transactions>();
    transactions.forEach(tx => {
      if (!transactionsByProduct.has(tx.product_id)) {
        transactionsByProduct.set(tx.product_id, []);
      }
      transactionsByProduct.get(tx.product_id)!.push(tx);
    });

    // Calculate days out for each product
    const now = new Date();
    outOfStockProducts.forEach(product => {
      const productTxs = transactionsByProduct.get(product.id) || [];
      
      // Find the most recent transaction where quantity_after was 0
      const zeroStockTx = productTxs.find(
        tx => tx.quantity_after !== null && Number(tx.quantity_after) <= 0
      );

      if (zeroStockTx) {
        const zeroDate = new Date(zeroStockTx.created_at);
        const daysDiff = Math.floor((now.getTime() - zeroDate.getTime()) / (1000 * 60 * 60 * 24));
        result.set(product.id, daysDiff >= 0 ? daysDiff : 0);
      } else if (productTxs.length > 0) {
        // Use last transaction date as fallback
        const lastTx = productTxs[0];
        const lastTxDate = new Date(lastTx.created_at);
        const daysDiff = Math.floor((now.getTime() - lastTxDate.getTime()) / (1000 * 60 * 60 * 24));
        result.set(product.id, daysDiff >= 0 ? daysDiff : null);
      } else {
        result.set(product.id, null);
      }
    });

    // Set null for products that have stock
    products
      .filter(p => (Number(p.quantity_in_stock) || 0) > 0)
      .forEach(p => result.set(p.id, null));

    // Set null for products not in the results
    productIds.forEach(id => {
      if (!result.has(id)) {
        result.set(id, null);
      }
    });

    return result;
  } catch (error) {
    console.error('Error calculating days out of stock batch:', error);
    productIds.forEach(id => result.set(id, null));
    return result;
  }
}


