import type { StockTransaction } from '@/types/stockTypes';

export type StockTrend = 'selling-fast' | 'stable' | 'overstock';

export interface StockTrendResult {
  trend: StockTrend;
  confidence: number; // 0-1
  description: string;
  netMovement: number; // Net stock movement (positive = incoming, negative = outgoing)
  movementRate: number; // Average daily movement
}

/**
 * Calculate stock trend based on transaction history
 * Analyzes last 30 days of transactions to determine if stock is:
 * - Selling fast: High outgoing movement, stock decreasing
 * - Stable: Low or balanced movement
 * - Overstock: High incoming movement or consistently high stock levels
 */
export function calculateStockTrend(
  productId: string,
  currentStock: number,
  transactions: StockTransaction[]
): StockTrendResult {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Filter transactions from last 30 days for this product
  const recentTransactions = transactions.filter(tx => {
    const txDate = new Date(tx.created_at);
    return txDate >= thirtyDaysAgo && tx.product_id === productId;
  });

  // If no transactions, consider stable
  if (recentTransactions.length === 0) {
    return {
      trend: 'stable',
      confidence: 0.5,
      description: 'No recent activity',
      netMovement: 0,
      movementRate: 0,
    };
  }

  // Calculate net movement (positive = incoming, negative = outgoing)
  let totalIncoming = 0;
  let totalOutgoing = 0;

  recentTransactions.forEach(tx => {
    const quantity = Math.abs(tx.quantity);
    
    if (tx.transaction_type === 'incoming' || tx.transaction_type === 'purchase_order') {
      totalIncoming += quantity;
    } else if (tx.transaction_type === 'outgoing' || tx.transaction_type === 'sales_order') {
      totalOutgoing += quantity;
    }
  });

  const netMovement = totalIncoming - totalOutgoing;
  const daysInPeriod = 30;
  const movementRate = (totalIncoming + totalOutgoing) / daysInPeriod; // Average daily movement

  // Determine trend based on movement patterns
  let trend: StockTrend;
  let confidence: number;
  let description: string;

  // High outgoing with negative net movement = selling fast
  if (totalOutgoing > 0 && netMovement < 0 && movementRate > 5) {
    const rate = Math.abs(netMovement) / daysInPeriod;
    if (rate > 2) {
      trend = 'selling-fast';
      confidence = Math.min(0.9, 0.6 + (rate / 10));
      description = `Selling ${Math.round(rate)} units/day on average`;
    } else {
      trend = 'stable';
      confidence = 0.7;
      description = 'Steady sales';
    }
  }
  // High incoming or consistently high stock = overstock
  else if (netMovement > 0 && movementRate > 5 && currentStock > 100) {
    trend = 'overstock';
    confidence = Math.min(0.9, 0.6 + (netMovement / 100));
    description = `Receiving ${Math.round(netMovement / daysInPeriod)} units/day`;
  }
  // Low movement or balanced = stable
  else {
    trend = 'stable';
    confidence = movementRate < 2 ? 0.8 : 0.6;
    if (movementRate < 1) {
      description = 'Low activity';
    } else {
      description = 'Stable movement';
    }
  }

  return {
    trend,
    confidence,
    description,
    netMovement,
    movementRate,
  };
}


