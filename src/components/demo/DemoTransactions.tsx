import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDemoBranches, useDemoTransactions } from '@/hooks/useDemoData';
import { Search, History, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useCurrency } from '@/hooks/useCurrency';
import { Loader2 } from 'lucide-react';
import { useMobile } from '@/hooks/use-mobile';

interface DemoTransactionsProps {
  sessionToken: string | null;
  selectedBranchId?: string;
}

export const DemoTransactions: React.FC<DemoTransactionsProps> = ({ sessionToken, selectedBranchId }) => {
  const { formatPrice } = useCurrency();
  const { isMobile } = useMobile();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'incoming' | 'outgoing'>('all');
  const [dateRange, setDateRange] = useState<'all' | 'today' | 'week' | 'month'>('all');

  const { data: branches, isLoading: branchesLoading } = useDemoBranches(sessionToken);
  const { data: transactions, isLoading: transactionsLoading } = useDemoTransactions(sessionToken, selectedBranchId, 100);

  const activeBranch = useMemo(() => {
    if (!branches || branches.length === 0) return null;
    return selectedBranchId 
      ? branches.find(b => b.id === selectedBranchId) || branches[0]
      : branches[0];
  }, [branches, selectedBranchId]);

  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];

    let filtered = transactions;

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(t => {
        if (filterType === 'incoming') {
          return t.transaction_type === 'in' || t.transaction_type === 'incoming';
        } else {
          return t.transaction_type === 'out' || t.transaction_type === 'outgoing';
        }
      });
    }

    // Filter by date range
    if (dateRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateRange) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setDate(now.getDate() - 30);
          break;
      }
      
      filtered = filtered.filter(t => {
        const transactionDate = new Date(t.created_at);
        return transactionDate >= filterDate;
      });
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.product_name?.toLowerCase().includes(query) ||
        t.reference_number?.toLowerCase().includes(query) ||
        t.notes?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [transactions, filterType, dateRange, searchQuery]);

  // Calculate stats
  const stats = useMemo(() => {
    if (!filteredTransactions) {
      return { totalIncoming: 0, totalOutgoing: 0, transactionCount: 0, totalValue: 0 };
    }

    let totalIncoming = 0;
    let totalOutgoing = 0;
    let totalValue = 0;

    filteredTransactions.forEach(t => {
      const quantity = Number(t.quantity) || 0;
      if (t.transaction_type === 'in' || t.transaction_type === 'incoming') {
        totalIncoming += quantity;
      } else {
        totalOutgoing += quantity;
      }
      totalValue += Number(t.total_value) || (quantity * (Number(t.unit_price) || 0));
    });

    return {
      totalIncoming,
      totalOutgoing,
      transactionCount: filteredTransactions.length,
      totalValue
    };
  }, [filteredTransactions]);

  if (branchesLoading || transactionsLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${isMobile ? 'm-2' : 'my-6 ml-0 w-screen pr-64'}`}>
      <div>
        <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-gray-900 mb-2`}>
          History
        </h1>
        {activeBranch && (
          <p className="text-gray-600">{activeBranch.name}</p>
        )}
      </div>

      {/* Filters */}
      <div className="space-y-4">
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products"
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Filters row */}
        <div className="flex gap-2 items-center">
          <Select
            value={filterType}
            onValueChange={(value) => setFilterType(value as 'all' | 'incoming' | 'outgoing')}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="incoming">In</SelectItem>
              <SelectItem value="outgoing">Out</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={dateRange}
            onValueChange={(value) => setDateRange(value as 'all' | 'today' | 'week' | 'month')}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">7 Days</SelectItem>
              <SelectItem value="month">30 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      {filteredTransactions.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card>
            <CardContent className="p-3 sm:p-4">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total In</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">{stats.totalIncoming}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Out</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-red-600">{stats.totalOutgoing}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">Movements</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold">{stats.transactionCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">Current Stock Value</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold">{formatPrice(stats.totalValue)}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Empty state */}
      {filteredTransactions.length === 0 && (
        <Card className="border-2 border-dashed border-gray-200 bg-gray-50">
          <CardContent className="py-12 text-center space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <History className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <p className="text-base font-semibold text-gray-900">No stock movements yet</p>
              <p className="text-sm text-gray-600">
                {searchQuery ? 'No transactions found matching your search.' : 'Demo transactions will appear here.'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transactions Table */}
      {filteredTransactions.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className={isMobile ? "" : "overflow-x-auto"}>
            <table className={`${isMobile ? "w-full" : "min-w-full"} divide-y divide-gray-200`}>
              <thead className="bg-gray-50">
                <tr>
                  <th className={`${isMobile ? "px-2 py-2" : "px-4 py-2"} text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${isMobile ? "w-1/2" : ""}`}>Product</th>
                  <th className={`${isMobile ? "px-1 py-2" : "px-4 py-2"} text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${isMobile ? "w-1/6" : ""}`}>User</th>
                  <th className={`${isMobile ? "px-1 py-2" : "px-4 py-2"} text-center text-xs font-medium text-gray-500 uppercase tracking-wider ${isMobile ? "w-1/6" : ""}`}>Type</th>
                  <th className={`${isMobile ? "px-2 py-2" : "px-4 py-2"} text-right text-xs font-medium text-gray-500 uppercase tracking-wider ${isMobile ? "w-1/6" : ""}`}>Quantity</th>
                  {!isMobile && (
                    <>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTransactions.map((transaction, index) => {
                  const isIncoming = transaction.transaction_type === 'in' || transaction.transaction_type === 'incoming';
                  
                  return (
                    <tr 
                      key={transaction.id}
                      className={`${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      } hover:bg-gray-100 transition-colors`}
                    >
                      <td className={`${isMobile ? "px-2 py-2" : "px-4 py-2"} text-sm`}>
                        <div className="font-bold break-words">{transaction.product_name || 'Unknown Product'}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {format(new Date(transaction.created_at), 'dd/MM/yyyy HH:mm')}
                        </div>
                      </td>
                      <td className={`${isMobile ? "px-1 py-2" : "px-4 py-2"} text-sm`}>
                        <div className="break-words">Demo</div>
                      </td>
                      <td className={`${isMobile ? "px-1 py-2" : "px-4 py-2"} text-center`}>
                        <Badge
                          variant={isIncoming ? 'default' : 'destructive'}
                          className={`${isIncoming ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''} ${isMobile ? 'text-xs px-1 py-0' : ''}`}
                        >
                          {isIncoming ? 'In' : 'Out'}
                        </Badge>
                      </td>
                      <td className={`${isMobile ? "px-2 py-2" : "px-4 py-2"} text-right text-sm font-medium`}>
                        {isIncoming ? (
                          <span className="text-green-600">+ {transaction.quantity}</span>
                        ) : (
                          <span className="text-red-600">- {transaction.quantity}</span>
                        )}
                      </td>
                      {!isMobile && (
                        <>
                          <td className="px-4 py-2 text-right text-sm">
                            {formatPrice(transaction.unit_price || 0)}
                          </td>
                          <td className="px-4 py-2 text-right text-sm">
                            {isIncoming ? (
                              <span className="text-red-600">- {formatPrice(Number(transaction.total_value) || (transaction.quantity * (Number(transaction.unit_price) || 0)))}</span>
                            ) : (
                              <span className="text-green-600">+ {formatPrice(Number(transaction.total_value) || (transaction.quantity * (Number(transaction.unit_price) || 0)))}</span>
                            )}
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })} 
              </tbody>
            </table>
          </div>
        </div>
      )}  

      {/* Demo Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Demo Mode</h3>
              <p className="text-sm text-blue-800">
                You can view all transaction history. To create new transactions, create a free account.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
