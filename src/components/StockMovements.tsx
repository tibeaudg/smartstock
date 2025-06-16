
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';

interface StockTransaction {
  id: string;
  product_id: string;
  product_name: string;
  transaction_type: 'incoming' | 'outgoing';
  quantity: number;
  unit_price: number;
  total_value: number;
  created_at: string;
  created_by: string;
  reference_number: string | null;
  notes: string | null;
  branch_id: string;
}

export const StockMovements = () => {
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  const isMobile = useIsMobile();
  const [transactions, setTransactions] = useState<StockTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    if (!user || !activeBranch) {
      console.log('No user or active branch, clearing transactions');
      setTransactions([]);
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching stock transactions for branch:', activeBranch.branch_id);
      const { data, error } = await supabase
        .from('stock_transactions')
        .select('*')
        .eq('branch_id', activeBranch.branch_id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching transactions:', error);
        return;
      }

      console.log('Transactions fetched for branch:', activeBranch.branch_id, data);
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [user, activeBranch]);

  // Set up real-time subscription for stock transactions
  useEffect(() => {
    if (!activeBranch) return;

    console.log('Setting up real-time subscription for stock transactions for branch:', activeBranch.branch_id);
    const channel = supabase
      .channel(`stock-transactions-changes-${activeBranch.branch_id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'stock_transactions',
          filter: `branch_id=eq.${activeBranch.branch_id}`
        },
        (payload) => {
          console.log('Real-time stock transaction change for branch:', activeBranch.branch_id, payload);
          fetchTransactions(); // Refresh the data when changes occur
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up real-time subscription for branch:', activeBranch.branch_id);
      supabase.removeChannel(channel);
    };
  }, [activeBranch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!activeBranch) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Geen filiaal geselecteerd</h2>
          <p className="text-gray-600">Selecteer een filiaal om transacties te bekijken.</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('nl-NL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTransactionTypeVariant = (type: string) => {
    return type === 'incoming' ? 'default' : 'secondary';
  };

  const getTransactionTypeLabel = (type: string) => {
    return type === 'incoming' ? 'Inkomend' : 'Uitgaand';
  };

  // Mobile card view
  if (isMobile) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stock Movements</h1>
          <p className="text-sm text-gray-600">{activeBranch.branch_name}</p>
        </div>

        <div className="space-y-3">
          {transactions.length === 0 ? (
            <Card className="bg-white">
              <CardContent className="p-6 text-center">
                <p className="text-gray-500">No stock movements found for this branch.</p>
              </CardContent>
            </Card>
          ) : (
            transactions.map((transaction) => (
              <Card key={transaction.id} className="bg-white">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg font-semibold text-gray-900 truncate">
                        {transaction.product_name}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        {formatDate(transaction.created_at)}
                      </p>
                    </div>
                    <Badge variant={getTransactionTypeVariant(transaction.transaction_type)}>
                      {getTransactionTypeLabel(transaction.transaction_type)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-700">Quantity:</span>
                      <span className="font-semibold">{transaction.quantity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-700">Unit Price:</span>
                      <span className="font-medium text-green-600">
                        €{transaction.unit_price.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-700">Total Value:</span>
                      <span className="font-semibold text-green-600">
                        €{transaction.total_value.toFixed(2)}
                      </span>
                    </div>
                    {transaction.reference_number && (
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-700">Reference:</span>
                        <span className="text-sm">{transaction.reference_number}</span>
                      </div>
                    )}
                    {transaction.notes && (
                      <div className="mt-2">
                        <span className="text-sm font-medium text-gray-700 block mb-1">Notes:</span>
                        <p className="text-sm text-gray-600">{transaction.notes}</p>
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
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Stock Movements</h1>
        <p className="text-gray-600">{activeBranch.branch_name}</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unit Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reference
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                    No stock movements found for this branch.
                  </td>
                </tr>
              ) : (
                transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {transaction.product_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getTransactionTypeVariant(transaction.transaction_type)}>
                        {getTransactionTypeLabel(transaction.transaction_type)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {transaction.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      €{transaction.unit_price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      €{transaction.total_value.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(transaction.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.reference_number || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {transaction.notes || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
