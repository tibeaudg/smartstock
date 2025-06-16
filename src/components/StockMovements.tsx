import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useIsMobile } from '@/hooks/use-mobile';
import { ArrowUp, ArrowDown, Filter } from 'lucide-react';

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
  branch_id: string | null;
  products: {
    name: string;
  } | null;
}

export const StockMovements = () => {
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  const isMobile = useIsMobile();
  const [transactions, setTransactions] = useState<StockTransaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<StockTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'incoming' | 'outgoing'>('all');

  const fetchTransactions = async () => {
    if (!user || !activeBranch) {
      setTransactions([]);
      setFilteredTransactions([]);
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching stock transactions for branch:', activeBranch.branch_id);
      const { data, error } = await supabase
        .from('stock_transactions')
        .select(`
          *,
          products(name)
        `)
        .eq('branch_id', activeBranch.branch_id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching transactions:', error);
        return;
      }

      console.log('Transactions fetched for branch:', data);
      setTransactions(data || []);
      setFilteredTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [user, activeBranch]);

  useEffect(() => {
    if (filterType === 'all') {
      setFilteredTransactions(transactions);
    } else {
      setFilteredTransactions(transactions.filter(t => t.transaction_type === filterType));
    }
  }, [filterType, transactions]);

  const formatTransactionType = (type: string) => {
    switch (type) {
      case 'incoming':
        return 'Stock In';
      case 'outgoing':
        return 'Stock Out';
      default:
        return type;
    }
  };

  const getTransactionIcon = (type: string) => {
    return type === 'incoming' ? (
      <ArrowUp className="h-4 w-4 text-green-600" />
    ) : (
      <ArrowDown className="h-4 w-4 text-red-600" />
    );
  };

  const getTransactionStats = () => {
    const incoming = transactions.filter(t => t.transaction_type === 'incoming');
    const outgoing = transactions.filter(t => t.transaction_type === 'outgoing');
    
    return {
      total: transactions.length,
      incoming: incoming.length,
      outgoing: outgoing.length,
      incomingValue: incoming.reduce((sum, t) => sum + (t.total_value || 0), 0),
      outgoingValue: outgoing.reduce((sum, t) => sum + (t.total_value || 0), 0)
    };
  };

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

  const stats = getTransactionStats();

  // Mobile card view
  if (isMobile) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Stock Transactions</h1>
            <p className="text-sm text-gray-600">{activeBranch.branch_name}</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Stock In</p>
                  <p className="text-lg font-semibold text-green-600">{stats.incoming}</p>
                </div>
                <ArrowUp className="h-6 w-6 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Stock Out</p>
                  <p className="text-lg font-semibold text-red-600">{stats.outgoing}</p>
                </div>
                <ArrowDown className="h-6 w-6 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <Select value={filterType} onValueChange={(value: 'all' | 'incoming' | 'outgoing') => setFilterType(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Transactions</SelectItem>
              <SelectItem value="incoming">Stock In Only</SelectItem>
              <SelectItem value="outgoing">Stock Out Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          {filteredTransactions.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-gray-500">
                  {filterType === 'all' ? 'No stock transactions found for this branch.' : `No ${filterType} transactions found for this branch.`}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredTransactions.map((transaction) => (
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
                    <div className="flex items-center space-x-2 ml-2">
                      {getTransactionIcon(transaction.transaction_type)}
                      <Badge
                        variant={transaction.transaction_type === 'incoming' ? 'default' : 'destructive'}
                      >
                        {formatTransactionType(transaction.transaction_type)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Quantity:</span>
                      <span className={`font-semibold ${transaction.transaction_type === 'incoming' ? 'text-green-600' : 'text-red-600'}`}>
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
                        <span className="font-semibold text-blue-600">
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
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Stock Transaction History</h1>
          <p className="text-gray-600">{activeBranch.branch_name}</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Transactions</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Stock In</p>
                <p className="text-2xl font-bold text-green-600">{stats.incoming}</p>
              </div>
              <ArrowUp className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Stock Out</p>
                <p className="text-2xl font-bold text-red-600">{stats.outgoing}</p>
              </div>
              <ArrowDown className="h-6 w-6 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-gray-600">Net Value</p>
              <p className={`text-2xl font-bold ${(stats.incomingValue - stats.outgoingValue) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${(stats.incomingValue - stats.outgoingValue).toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select value={filterType} onValueChange={(value: 'all' | 'incoming' | 'outgoing') => setFilterType(value)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Transactions</SelectItem>
                <SelectItem value="incoming">Stock In Only</SelectItem>
                <SelectItem value="outgoing">Stock Out Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <p className="text-sm text-gray-500">
          Showing {filteredTransactions.length} of {stats.total} transactions
        </p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Total Value</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    {filterType === 'all' ? 'No stock transactions found for this branch.' : `No ${filterType} transactions found for this branch.`}
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions.map((transaction) => (
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
                      <div className="flex items-center space-x-2">
                        {getTransactionIcon(transaction.transaction_type)}
                        <Badge
                          variant={transaction.transaction_type === 'incoming' ? 'default' : 'destructive'}
                        >
                          {formatTransactionType(transaction.transaction_type)}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className={`font-medium ${transaction.transaction_type === 'incoming' ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.transaction_type === 'incoming' ? '+' : '-'}{transaction.quantity}
                    </TableCell>
                    <TableCell>
                      {transaction.unit_price ? `$${transaction.unit_price.toFixed(2)}` : '-'}
                    </TableCell>
                    <TableCell>
                      {transaction.total_value ? (
                        <span className="font-medium text-blue-600">
                          ${transaction.total_value.toFixed(2)}
                        </span>
                      ) : '-'}
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
