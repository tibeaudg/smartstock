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
  sku?: string | null;
  location?: string | null;
  warehouse_name?: string | null;
  // Variants support
  is_variant?: boolean;
  parent_product_id?: string | null;
  variant_name?: string | null;
  variant_attributes?: Record<string, unknown> | null;
  variant_sku?: string | null;
  variant_barcode?: string | null;
  branch_id?: string | null;
};

export type TransactionType = 
  | 'incoming' 
  | 'outgoing' 
  | 'purchase_order' 
  | 'sales_order' 
  | 'stock_transfer' 
  | 'cycle_count' 
  | 'adjustment' 
  | 'damage' 
  | 'return' 
  | 'manual_adjustment' 
  | 'scan_adjustment';

export type AdjustmentMethod = 'manual' | 'scan' | 'system';

export type SourceType = 'purchase_orders' | 'sales_orders' | 'stock_transfers' | 'cycle_counts' | null;

export type StockTransaction = {
  id: string;
  created_at: string;
  product_id: string;
  product_name: string;
  transaction_type: TransactionType;
  quantity: number;
  unit_price: number | string; // Can be string from database
  total_value?: number | string; // Calculated field, can be string from database
  reference_number: string | null;
  notes: string | null;
  branch_id: string;
  created_by: string;
  variant_id?: string | null;
  variant_name?: string | null;
  // New fields for enhanced tracking
  source_type?: SourceType;
  source_id?: string | null;
  adjustment_method?: AdjustmentMethod;
  audit_trail?: Record<string, unknown>;
  // Gebruikersinfo
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
};

export type TransactionFilters = {
  dateRange: 'all' | 'today' | 'week' | 'month' | 'custom';
  transactionType: 'all' | TransactionType;
  sourceType?: 'all' | SourceType;
  adjustmentMethod?: 'all' | AdjustmentMethod;
  searchQuery: string;
  startDate?: Date;
  endDate?: Date;
  userId?: string | null;
  productId?: string | null;
};

// Purchase Order types
export type PurchaseOrderStatus = 'draft' | 'pending' | 'ordered' | 'received' | 'cancelled';

export type PurchaseOrder = {
  id: string;
  po_number: string;
  status: PurchaseOrderStatus;
  vendor_id?: string | null;
  vendor_name?: string | null;
  order_date: string;
  expected_delivery_date?: string | null;
  total_amount: number;
  branch_id: string;
  user_id: string;
  created_by?: string | null;
  notes?: string | null;
  tracking_number?: string | null;
  shipping_carrier?: string | null;
  created_at: string;
  updated_at: string;
  items?: PurchaseOrderItem[];
};

export type PurchaseOrderItem = {
  id: string;
  purchase_order_id: string;
  product_id?: string | null;
  variant_id?: string | null;
  quantity_ordered: number;
  quantity_received: number;
  unit_price: number;
  total_price: number;
  received_at?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  product?: Product;
};

// Sales Order types
export type SalesOrderStatus = 'draft' | 'pending' | 'fulfilled' | 'cancelled';

export type SalesOrder = {
  id: string;
  so_number: string;
  status: SalesOrderStatus;
  customer_id?: string | null;
  customer_name?: string | null;
  order_date: string;
  fulfillment_date?: string | null;
  total_amount: number;
  branch_id: string;
  user_id: string;
  created_by?: string | null;
  notes?: string | null;
  shipping_address?: string | null;
  payment_status?: 'pending' | 'success' | 'failed' | 'refunded';
  delivery_status?: 'pending' | 'in_transit' | 'delivered' | 'failed';
  delivery_date?: string | null;
  tracking_number?: string | null;
  created_at: string;
  updated_at: string;
  items?: SalesOrderItem[];
};

export type SalesOrderItem = {
  id: string;
  sales_order_id: string;
  product_id?: string | null;
  variant_id?: string | null;
  quantity_ordered: number;
  quantity_fulfilled: number;
  unit_price: number;
  total_price: number;
  fulfilled_at?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  product?: Product;
};

// Stock Transfer types
export type StockTransferStatus = 'pending' | 'in_transit' | 'completed' | 'cancelled';

export type StockTransfer = {
  id: string;
  transfer_number: string;
  status: StockTransferStatus;
  from_branch_id?: string | null;
  to_branch_id?: string | null;
  from_location?: string | null;
  to_location?: string | null;
  transfer_date: string;
  completed_date?: string | null;
  branch_id: string;
  user_id: string;
  created_by?: string | null;
  notes?: string | null;
  tracking_number?: string | null;
  created_at: string;
  updated_at: string;
  items?: StockTransferItem[];
  from_branch?: { id: string; name: string };
  to_branch?: { id: string; name: string };
};

export type StockTransferItem = {
  id: string;
  stock_transfer_id: string;
  product_id?: string | null;
  variant_id?: string | null;
  quantity_transferred: number;
  unit_price: number;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  product?: Product;
};



export type StockMovementStats = {
  totalIncoming: number;
  totalOutgoing: number;
  totalValue: number;
  transactionCount: number;
};
