import { Database } from '@/types/supabase';

export type StockTransaction = {
  id: string;
  created_at: string;
  product_id: string;
  product_name: string;
  transaction_type: 'incoming' | 'outgoing';
  quantity: number;
  unit_price: number;
  // total_value is calculated from quantity * unit_price
  reference_number: string | null;
  notes: string | null;
  branch_id: string;
  created_by: string;
  supplier_name?: string | null;
};

export type TransactionFilters = {
  dateRange: 'all' | 'today' | 'week' | 'month' | 'custom';
  transactionType: 'all' | 'incoming' | 'outgoing';
  searchQuery: string;
  startDate?: Date;
  endDate?: Date;
};

export type StockMovementStats = {
  totalIncoming: number;
  totalOutgoing: number;
  totalValue: number;
  transactionCount: number;
};
