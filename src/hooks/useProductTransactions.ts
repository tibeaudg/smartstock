import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useBranches } from './useBranches';
import type { StockTransaction } from '@/types/stockTypes';

export interface ProductTransactionFilters {
  userId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  transactionTypes?: string[];
  page?: number;
  pageSize?: number;
}

export interface ProductTransactionsResult {
  transactions: StockTransaction[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const useProductTransactions = (
  productId: string | null,
  filters: ProductTransactionFilters = {}
) => {
  const { activeBranch } = useBranches();
  const {
    userId,
    dateFrom,
    dateTo,
    transactionTypes,
    page = 1,
    pageSize = 50,
  } = filters;

  return useQuery<ProductTransactionsResult>({
    queryKey: [
      'productTransactions',
      productId,
      activeBranch?.branch_id,
      userId,
      dateFrom,
      dateTo,
      transactionTypes,
      page,
      pageSize,
    ],
    queryFn: async () => {
      if (!productId || !activeBranch) {
        return {
          transactions: [],
          total: 0,
          page: 1,
          pageSize: 50,
          totalPages: 0,
        };
      }

      let query = supabase
        .from('stock_transactions')
        .select('*', { count: 'exact' })
        .eq('product_id', productId)
        .eq('branch_id', activeBranch.branch_id)
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.eq('created_by', userId);
      }

      if (dateFrom) {
        query = query.gte('created_at', dateFrom.toISOString());
      }

      if (dateTo) {
        query = query.lte('created_at', dateTo.toISOString());
      }

      if (transactionTypes && transactionTypes.length > 0) {
        query = query.in('transaction_type', transactionTypes);
      }

      // Get total count first
      const { count } = await query;

      // Apply pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching product transactions:', error);
        throw error;
      }

      const transactions: StockTransaction[] = (data || []).map((tx: any) => ({
        id: tx.id,
        created_at: tx.created_at,
        product_id: tx.product_id,
        product_name: tx.product_name,
        transaction_type: tx.transaction_type,
        quantity: tx.quantity,
        unit_price: typeof tx.unit_price === 'string' ? parseFloat(tx.unit_price) : tx.unit_price,
        total_value: typeof tx.total_value === 'string' ? parseFloat(tx.total_value) : tx.total_value,
        reference_number: tx.reference_number,
        notes: tx.notes,
        branch_id: tx.branch_id,
        created_by: tx.created_by,
        variant_id: tx.variant_id,
        variant_name: tx.variant_name,
        source_type: tx.source_type,
        source_id: tx.source_id,
        adjustment_method: tx.adjustment_method,
        audit_trail: tx.audit_trail,
      }));

      const total = count || 0;
      const totalPages = Math.ceil(total / pageSize);

      return {
        transactions,
        total,
        page,
        pageSize,
        totalPages,
      };
    },
    enabled: !!productId && !!activeBranch,
    staleTime: 30000, // 30 seconds
  });
};




