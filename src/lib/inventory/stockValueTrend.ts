import {
  isIncomingTransaction,
  isOutgoingTransaction,
  parseQuantity,
} from '@/lib/inventory/dashboardMetrics';

export interface StockValueTrendPoint {
  date: string;
  total_value: number;
}

type StockValueTransaction = {
  transaction_type: string;
  quantity: number | string | null;
  created_at: string;
  unit_price?: number | string | null;
};

export function calculateStockValueTrend(
  transactions: StockValueTransaction[],
  currentValue: number
): StockValueTrendPoint[] {
  const trendMap = new Map<string, number>();

  if (transactions.length > 0) {
    const transactionsByDate = new Map<string, StockValueTransaction[]>();
    transactions.forEach((transaction) => {
      const date = new Date(transaction.created_at).toISOString().split('T')[0];
      if (!transactionsByDate.has(date)) {
        transactionsByDate.set(date, []);
      }
      transactionsByDate.get(date)!.push(transaction);
    });

    let runningValue = currentValue;
    const sortedDates = Array.from(transactionsByDate.keys()).sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );

    sortedDates.forEach((date) => {
      const dayTransactions = transactionsByDate.get(date) || [];
      dayTransactions.forEach((transaction) => {
        const qty = parseQuantity(transaction.quantity);
        const unitPrice = Number(transaction.unit_price) || 0;
        if (isIncomingTransaction(transaction.transaction_type)) {
          runningValue -= qty * unitPrice;
        } else if (isOutgoingTransaction(transaction.transaction_type)) {
          runningValue += qty * unitPrice;
        }
      });
      trendMap.set(date, runningValue);
    });
  }

  const currentDate = new Date().toISOString().split('T')[0];
  if (!trendMap.has(currentDate)) {
    trendMap.set(currentDate, currentValue);
  }

  return Array.from(trendMap.entries())
    .map(([date, total_value]) => ({ date, total_value }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function getStockValueAtOrBefore(
  trend: StockValueTrendPoint[],
  targetDate: Date
): number | null {
  const target = targetDate.toISOString().split('T')[0];
  let best: StockValueTrendPoint | null = null;

  for (const point of trend) {
    if (point.date <= target && (!best || point.date > best.date)) {
      best = point;
    }
  }

  return best?.total_value ?? null;
}

export function buildStockValueSparkline(
  trend: StockValueTrendPoint[],
  currentValue: number,
  days = 12
): Array<{ value: number }> {
  const data: Array<{ value: number }> = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const point = trend.find((entry) => entry.date === dateStr);
    data.push({ value: point?.total_value ?? currentValue });
  }

  return data;
}
