import { Database } from '@/types/supabase';

export type Product = {
  id: string;
  name: string;
  description: string | null;
  quantity_in_stock: number;
  minimum_stock_level: number;
  unit_price: number;
  purchase_price: number;
  sale_price: number;
  status: string | null;
  image_url?: string | null;
};

export type StockTransaction = {
  id: string;
  created_at: string;
  product_id: string;
  product_name: string;
  transaction_type: 'incoming' | 'outgoing';
  quantity: number;
  unit_price: number | string; // Can be string from database
  total_value?: number | string; // Calculated field, can be string from database
  reference_number: string | null;
  notes: string | null;
  branch_id: string;
  created_by: string;
  // Gebruikersinfo
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
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
