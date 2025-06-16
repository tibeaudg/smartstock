import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';

interface StockTransaction {
  id: string;
  product_id: string;
  transaction_type: 'incoming' | 'outgoing';
  quantity: number;
  unit_price: number | null;
  total_value: number | null;
  created_at: string;
  reference_number: string | null;
  notes: string | null;
  product_name: string | null;
  products: {
    name: string;
  } | null;
}

export const StockMovements = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [transactions, setTransactions] = useState<StockTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    if (!user) return;

    try {
      console.log('Fetching stock transactions...');
      const { data, error } = await supabase
        .from('stock_transactions')
        .select(`
          *,
          products(name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching transactions:', error);
        return;
      }

      console.log('Transactions fetched:', data);
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  const formatTransactionType = (type: string) => {
    switch (type) {
      case 'incoming':
        return 'Stock Added';
      case 'outgoing':
        return 'Stock Removed';
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Mobile card view
  if (isMobile) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Transaction History</h1>

        <div className="space-y-3">
          {transactions.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-gray-500">No stock transactions found.</p>
              </CardContent>
            </Card>
          ) : (
            transactions.map((transaction) => (
              <Card key={transaction.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg font-semibold text-gray-900 truncate">
                        {transaction.products?.name || transaction.product_name || 'Unknown Product'}
                      </CardTitle>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(transaction.created_at).toLocaleDateString()} at{' '}
                        {new Date(transaction.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                    <Badge
                      variant={transaction.transaction_type === 'incoming' ? 'default' : 'destructive'}
                      className="ml-2"
                    >
                      {formatTransactionType(transaction.transaction_type)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Quantity:</span>
                      <span className="font-semibold">
                        {transaction.transaction_type === 'incoming' ? '+' : '-'}{transaction.quantity}
                      </span>
                    </div>
                    
                    {transaction.unit_price && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Unit Price:</span>
                        <span>${transaction.unit_price.toFixed(2)}</span>
                      </div>
                    )}
                    
                    {transaction.total_value && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Total Value:</span>
                        <span className="font-semibold text-green-600">
                          ${transaction.total_value.toFixed(2)}
                        </span>
                      </div>
                    )}
                    
                    {transaction.reference_number && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Reference:</span>
                        <span className="text-sm">{transaction.reference_number}</span>
                      </div>
                    )}
                    
                    {transaction.notes && (
                      <div className="pt-2">
                        <span className="text-sm font-medium text-gray-700">Notes:</span>
                        <p className="text-sm text-gray-600 mt-1">{transaction.notes}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    );
  }

  // Desktop table view
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Stock Transaction History</h1>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Transaction</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Total Value</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No stock transactions found.
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      {new Date(transaction.created_at).toLocaleDateString()}
                      <div className="text-xs text-gray-500">
                        {new Date(transaction.created_at).toLocaleTimeString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {transaction.products?.name || transaction.product_name || 'Unknown Product'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          transaction.transaction_type === 'incoming'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {formatTransactionType(transaction.transaction_type)}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">
                      {transaction.transaction_type === 'incoming' ? '+' : '-'}{transaction.quantity}
                    </TableCell>
                    <TableCell>
                      {transaction.unit_price ? `$${transaction.unit_price.toFixed(2)}` : '-'}
                    </TableCell>
                    <TableCell>
                      {transaction.total_value ? `$${transaction.total_value.toFixed(2)}` : '-'}
                    </TableCell>
                    <TableCell>{transaction.reference_number || '-'}</TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate" title={transaction.notes || ''}>
                        {transaction.notes || '-'}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
