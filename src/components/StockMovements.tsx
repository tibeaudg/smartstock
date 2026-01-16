import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { useMobile } from '@/hooks/use-mobile';
import { useStockMovements } from '@/hooks/useStockMovements';
import { TransactionFilters } from '@/types/stockTypes';
import { CalendarIcon, Download, Filter, Search, X, History, Package, Plus, ChevronLeft, ChevronRight, ArrowUpDown, Upload, Maximize2, Minimize2, TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';
import { useProductCount } from '@/hooks/useDashboardData';
import { useNavigate } from 'react-router-dom';

// Go to page input component
const GoToPageInput: React.FC<{ totalPages: number; onPageChange: (page: number) => void }> = ({ totalPages, onPageChange }) => {
  const [pageInput, setPageInput] = useState('');

  const handleGo = () => {
    const page = parseInt(pageInput);
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
      setPageInput('');
    }
  };

  return (
    <>
      <Input
        type="number"
        min={1}
        max={totalPages}
        className="w-16 h-8"
        value={pageInput}
        onChange={(e) => setPageInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleGo();
          }
        }}
        placeholder="Page"
      />
      <Button
        variant="outline"
        size="sm"
        onClick={handleGo}
      >
        Go
      </Button>
    </>
  );
};

export const StockMovements = () => {
  console.log('[StockMovements] Component rendering');
  const { isMobile } = useMobile();
  const navigate = useNavigate();
  const { productCount, isLoading: productCountLoading } = useProductCount();
  const {
    transactions,
    stats,
    loading,
    error,
    filters,
    setFilters,
    refresh
  } = useStockMovements();
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  console.log('[StockMovements] State:', { loading, error: error?.message, transactionsCount: transactions.length });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(transactions.length / itemsPerPage));
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return transactions.slice(start, end);
  }, [transactions, currentPage, itemsPerPage]);

  // Calculate stats with trends and percentage changes
  const enhancedStats = useMemo(() => {
    const now = new Date();
    const currentMonthStart = startOfMonth(now);
    const currentMonthEnd = endOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    const currentMonthTransactions = transactions.filter(t => {
      const transDate = new Date(t.created_at);
      return isWithinInterval(transDate, { start: currentMonthStart, end: currentMonthEnd });
    });

    const lastMonthTransactions = transactions.filter(t => {
      const transDate = new Date(t.created_at);
      return isWithinInterval(transDate, { start: lastMonthStart, end: lastMonthEnd });
    });

    // Calculate totals
    const currentTotalIn = currentMonthTransactions
      .filter(t => t.transaction_type === 'incoming' || t.transaction_type === 'purchase_order')
      .reduce((sum, t) => sum + (t.quantity || 0), 0);
    const lastTotalIn = lastMonthTransactions
      .filter(t => t.transaction_type === 'incoming' || t.transaction_type === 'purchase_order')
      .reduce((sum, t) => sum + (t.quantity || 0), 0);
    const totalInChange = lastTotalIn > 0 
      ? ((currentTotalIn - lastTotalIn) / lastTotalIn) * 100 
      : currentTotalIn > 0 ? 100 : 0;

    const currentTotalOut = currentMonthTransactions
      .filter(t => t.transaction_type === 'outgoing' || t.transaction_type === 'sales_order')
      .reduce((sum, t) => sum + (t.quantity || 0), 0);
    const lastTotalOut = lastMonthTransactions
      .filter(t => t.transaction_type === 'outgoing' || t.transaction_type === 'sales_order')
      .reduce((sum, t) => sum + (t.quantity || 0), 0);
    const totalOutChange = lastTotalOut > 0 
      ? ((currentTotalOut - lastTotalOut) / lastTotalOut) * 100 
      : currentTotalOut > 0 ? 100 : 0;

    const currentMovements = currentMonthTransactions.length;
    const lastMovements = lastMonthTransactions.length;
    const movementsChange = lastMovements > 0 
      ? ((currentMovements - lastMovements) / lastMovements) * 100 
      : currentMovements > 0 ? 100 : 0;

    const currentValue = currentMonthTransactions.reduce((sum, t) => sum + (Number(t.total_value) || 0), 0);
    const lastValue = lastMonthTransactions.reduce((sum, t) => sum + (Number(t.total_value) || 0), 0);
    const valueChange = lastValue > 0 
      ? ((currentValue - lastValue) / lastValue) * 100 
      : currentValue > 0 ? 100 : 0;

    // Generate trend data for last 12 days
    const generateTrendData = (filterFn: (t: any) => boolean) => {
      const data = [];
      for (let i = 11; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayStart = new Date(date.setHours(0, 0, 0, 0));
        const dayEnd = new Date(date.setHours(23, 59, 59, 999));
        
        const count = transactions.filter(t => {
          const transDate = new Date(t.created_at);
          return transDate >= dayStart && transDate <= dayEnd && filterFn(t);
        }).length;
        
        data.push({ value: count });
      }
      return data;
    };

    return {
      totalIn: {
        value: stats.totalIncoming,
        change: totalInChange,
        trend: generateTrendData(t => t.transaction_type === 'incoming' || t.transaction_type === 'purchase_order'),
        color: '#10b981', // Green
      },
      totalOut: {
        value: stats.totalOutgoing,
        change: totalOutChange,
        trend: generateTrendData(t => t.transaction_type === 'outgoing' || t.transaction_type === 'sales_order'),
        color: '#ef4444', // Red
      },
      movements: {
        value: stats.transactionCount,
        change: movementsChange,
        trend: generateTrendData(() => true),
        color: '#9333ea', // Purple
      },
      stockValue: {
        value: stats.totalValue,
        change: valueChange,
        trend: generateTrendData(() => true),
        color: '#3b82f6', // Blue
      },
    };
  }, [transactions, stats]);

  // Calculate active filters count - MUST be before any early returns
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.transactionType !== 'all') count++;
    if (filters.dateRange !== 'all') count++;
    if (filters.searchQuery) count++;
    return count;
  }, [filters.transactionType, filters.dateRange, filters.searchQuery]);

  const handleExport = () => {
    try {
      const exportData = transactions.map(t => ({
        'Date': new Date(t.created_at).toLocaleString(),
        'Product': t.product_name,
        'Type': t.transaction_type,
        'Quantity': t.quantity,
        'Unit Price': (Number(t.unit_price) || 0).toFixed(2),
        'Total Value': (Number(t.total_value) || (t.quantity * Number(t.unit_price))).toFixed(2),
        'Reference': t.reference_number || '',
        'Source Type': t.source_type || '',
        'Source ID': t.source_id || '',
        'Adjustment Method': t.adjustment_method || '',
        'Notes': t.notes || '',
        'User': t.first_name || 'Onbekend'
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Bewegingslijst');
      XLSX.writeFile(wb, `stock-movements-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
      
      toast.success('Export completed successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data');
    }
  };

  // Clear filters function
  const clearFilters = () => {
    setFilters({
      ...filters,
      transactionType: 'all',
      dateRange: 'all',
      searchQuery: '',
      startDate: undefined,
      endDate: undefined,
    });
  };

  // Early returns AFTER all hooks
  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="text-center text-red-500">
            <p>Error loading stock movements: {error?.toString()}</p>
            <Button variant="outline" onClick={() => refresh()} className="mt-4">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center p-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading transactions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header with Title and Actions */}
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-sm text-gray-600 mt-1">
            Track inventory transactions, adjustments, and stock movements
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeFiltersCount > 0 && (
            <Button 
              variant="outline" 
              onClick={clearFilters}
              className="relative"
            >
              <X className="w-4 h-4 mr-2" />
              Clear Filters
              <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                {activeFiltersCount}
              </Badge>
            </Button>
          )}

          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions"
            className="pl-8"
            value={filters.searchQuery}
            onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
          />
        </div>
        <Select
          value={filters.transactionType}
          onValueChange={(value) => setFilters(prev => ({ ...prev, transactionType: value as any }))}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="incoming">Incoming</SelectItem>
            <SelectItem value="outgoing">Outgoing</SelectItem>
            <SelectItem value="purchase_order">Purchase Order</SelectItem>
            <SelectItem value="sales_order">Sales Order</SelectItem>
            <SelectItem value="stock_transfer">Stock Transfer</SelectItem>
            <SelectItem value="adjustment">Adjustment</SelectItem>
            <SelectItem value="manual_adjustment">Manual Adjustment</SelectItem>
            <SelectItem value="scan_adjustment">Scan Adjustment</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.dateRange}
          onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value as 'all' | 'today' | 'week' | 'month' | 'custom' }))}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">7 Days</SelectItem>
            <SelectItem value="month">30 Days</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      </div>

        {/* Date Range Picker (if custom selected) */}
        {filters.dateRange === 'custom' && (
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className={cn(
                  "justify-start text-left font-normal",
                  !filters.startDate && "text-muted-foreground"
                )}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.startDate ? format(filters.startDate, "PP") : "Start Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filters.startDate}
                  onSelect={(date) => setFilters(prev => ({ ...prev, startDate: date }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className={cn(
                  "justify-start text-left font-normal",
                  !filters.endDate && "text-muted-foreground"
                )}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.endDate ? format(filters.endDate, "PP") : "End Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filters.endDate}
                  onSelect={(date) => setFilters(prev => ({ ...prev, endDate: date }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        )}

      {/* Stats Cards */}
      {!loading && transactions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Total In Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total In</h3>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{enhancedStats.totalIn.value}</div>
                <div className="flex items-center gap-1 mt-1">
                  {enhancedStats.totalIn.change >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  )}
                  <span className={`text-xs font-medium ${enhancedStats.totalIn.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {enhancedStats.totalIn.change >= 0 ? '+' : ''}{enhancedStats.totalIn.change.toFixed(1)}% Vs last month
                  </span>
                </div>
              </div>
              <div className="h-12 w-20">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={enhancedStats.totalIn.trend}>
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={enhancedStats.totalIn.color}
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={true}
                      animationDuration={1000}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Total Out Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total Out</h3>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{enhancedStats.totalOut.value}</div>
                <div className="flex items-center gap-1 mt-1">
                  {enhancedStats.totalOut.change >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  )}
                  <span className={`text-xs font-medium ${enhancedStats.totalOut.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {enhancedStats.totalOut.change >= 0 ? '+' : ''}{enhancedStats.totalOut.change.toFixed(1)}% Vs last month
                  </span>
                </div>
              </div>
              <div className="h-12 w-20">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={enhancedStats.totalOut.trend}>
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={enhancedStats.totalOut.color}
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={true}
                      animationDuration={1000}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Movements Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Movements</h3>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{enhancedStats.movements.value}</div>
                <div className="flex items-center gap-1 mt-1">
                  {enhancedStats.movements.change >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  )}
                  <span className={`text-xs font-medium ${enhancedStats.movements.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {enhancedStats.movements.change >= 0 ? '+' : ''}{enhancedStats.movements.change.toFixed(1)}% Vs last month
                  </span>
                </div>
              </div>
              <div className="h-12 w-20">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={enhancedStats.movements.trend}>
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={enhancedStats.movements.color}
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={true}
                      animationDuration={1000}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Current Stock Value Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Current Stock Value</h3>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">${enhancedStats.stockValue.value.toFixed(2)}</div>
                <div className="flex items-center gap-1 mt-1">
                  {enhancedStats.stockValue.change >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  )}
                  <span className={`text-xs font-medium ${enhancedStats.stockValue.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {enhancedStats.stockValue.change >= 0 ? '+' : ''}{enhancedStats.stockValue.change.toFixed(1)}% Vs last month
                  </span>
                </div>
              </div>
              <div className="h-12 w-20">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={enhancedStats.stockValue.trend}>
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={enhancedStats.stockValue.color}
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={true}
                      animationDuration={1000}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty state - Check if products exist first */}
      {!loading && !productCountLoading && productCount === 0 && (
        <Card className="border-2 border-dashed border-gray-200 bg-gray-50">
          <CardContent className="py-12 text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <Package className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <p className="text-lg font-semibold text-gray-900">You cannot record transactions without products</p>
              <p className="text-sm text-gray-600">
                Add your first product to start tracking inventory movements and transactions.
              </p>
            </div>
            <Button
              onClick={() => navigate('/dashboard/products/new')}
              className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-6 mt-4"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Product
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Empty state - No transactions but products exist */}
      {!loading && !productCountLoading && productCount > 0 && transactions.length === 0 && (
        <Card className="border-2 border-dashed border-gray-200 bg-gray-50">
          <CardContent className="py-12 text-center space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <History className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <p className="text-base font-semibold text-gray-900">No stock movements yet</p>
              <p className="text-sm text-gray-600">
                Adjust stock levels or record inventory movements to see them listed here.
              </p>
            </div>
            <div className="text-xs text-gray-500">
              Tip: use the scan button or manual adjust options in Products to create your first history entry.
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transactions Table */}
      <div>
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
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
              {paginatedTransactions.map((transaction, index) => (
                                 <tr 
                   key={transaction.id}
                   className={`${
                     index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                   } hover:bg-gray-100 transition-colors`}
                 >
                   <td className={`${isMobile ? "px-2 py-2" : "px-4 py-2"} text-sm`}>
                     <div className="font-bold break-words">{transaction.product_name}</div>
                     <div className="text-xs text-gray-500 mt-1">
                       {format(new Date(transaction.created_at), 'dd/MM/yyyy HH:mm')}
                     </div>
                   </td>
                   <td className={`${isMobile ? "px-1 py-2" : "px-4 py-2"} text-sm`}>
                     <div className="break-words">{transaction.first_name || 'Unknown'}</div>
                   </td>
                   <td className={`${isMobile ? "px-1 py-2" : "px-4 py-2"} text-center`}>
                     {(() => {
                       // Determine if transaction is incoming or outgoing
                       const isOutgoing = transaction.transaction_type === 'outgoing' || 
                                         transaction.transaction_type === 'sales_order' ||
                                         (transaction.transaction_type === 'manual_adjustment' && 
                                          transaction.reference_number?.includes('_OUT'));
                       const isIncoming = transaction.transaction_type === 'incoming' || 
                                         transaction.transaction_type === 'purchase_order' || 
                                         transaction.transaction_type === 'cycle_count' ||
                                         (transaction.transaction_type === 'manual_adjustment' && 
                                          transaction.reference_number?.includes('_IN'));
                       
                       return (
                         <Badge
                           variant={isIncoming ? 'success' : 'destructive'}
                           className={`${isMobile ? 'text-xs px-1 py-0' : ''}`}
                         >
                           {transaction.transaction_type === 'incoming' ? 'In' : 
                            transaction.transaction_type === 'outgoing' ? 'Out' :
                            transaction.transaction_type === 'purchase_order' ? 'PO' :
                            transaction.transaction_type === 'sales_order' ? 'SO' :
                            transaction.transaction_type === 'stock_transfer' ? 'Transfer' :
                            transaction.transaction_type === 'manual_adjustment' ? (isOutgoing ? 'Out' : 'In') :
                            transaction.transaction_type === 'scan_adjustment' ? 'Scan' :
                            transaction.transaction_type}
                         </Badge>
                       );
                     })()}
                   </td>
                   <td className={`${isMobile ? "px-2 py-2" : "px-4 py-2"} text-right text-sm font-medium`}>
                     {(() => {
                       // Determine if transaction is outgoing (for quantity display)
                       const isOutgoing = transaction.transaction_type === 'outgoing' || 
                                         transaction.transaction_type === 'sales_order' ||
                                         (transaction.transaction_type === 'manual_adjustment' && 
                                          transaction.reference_number?.includes('_OUT'));
                       
                       return isOutgoing ? (
                         <span className="text-red-600">- {transaction.quantity}</span>
                       ) : (
                         <span className="text-green-600">+ {transaction.quantity}</span>
                       );
                     })()}
                   </td>
                  {!isMobile && (
                    <>
                      <td className="px-4 py-2 text-right text-sm">
                        ${(Number(transaction.unit_price) || 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-2 text-right text-sm">
                        {(() => {
                          // Determine if transaction is outgoing (for total value display)
                          const isOutgoing = transaction.transaction_type === 'outgoing' || 
                                            transaction.transaction_type === 'sales_order' ||
                                            (transaction.transaction_type === 'manual_adjustment' && 
                                             transaction.reference_number?.includes('_OUT'));
                          
                          return isOutgoing ? (
                            <span className="text-green-600">+ ${(Number(transaction.total_value) || (transaction.quantity * Number(transaction.unit_price))).toFixed(2)}</span>
                          ) : (
                            <span className="text-red-600">- ${(Number(transaction.total_value) || (transaction.quantity * Number(transaction.unit_price))).toFixed(2)}</span>
                          );
                        })()}
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      {transactions.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 ">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Showing per page</span>
            <Select value={itemsPerPage.toString()} onValueChange={(v) => {
              setItemsPerPage(Number(v));
              setCurrentPage(1);
            }}>
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">Show 10</SelectItem>
                <SelectItem value="25">Show 25</SelectItem>
                <SelectItem value="50">Show 50</SelectItem>
                <SelectItem value="100">Show 100</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, transactions.length)} of {transactions.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Prev
            </Button>
            
            <div className="flex items-center gap-1">
              {totalPages <= 5 ? (
                // Show all pages if 5 or fewer
                Array.from({ length: totalPages }, (_, i) => (
                  <Button
                    key={i + 1}
                    variant={currentPage === i + 1 ? "default" : "outline"}
                    size="sm"
                    className="w-8 h-8 p-0"
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))
              ) : currentPage <= 3 ? (
                // Show first 5 pages when near start
                <>
                  {Array.from({ length: 5 }, (_, i) => (
                    <Button
                      key={i + 1}
                      variant={currentPage === i + 1 ? "default" : "outline"}
                      size="sm"
                      className="w-8 h-8 p-0"
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                  <span className="px-2">...</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-8 h-8 p-0"
                    onClick={() => setCurrentPage(totalPages)}
                  >
                    {totalPages}
                  </Button>
                </>
              ) : currentPage >= totalPages - 2 ? (
                // Show last 5 pages when near end
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-8 h-8 p-0"
                    onClick={() => setCurrentPage(1)}
                  >
                    1
                  </Button>
                  <span className="px-2">...</span>
                  {Array.from({ length: 5 }, (_, i) => {
                    const pageNum = totalPages - 4 + i;
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        className="w-8 h-8 p-0"
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </>
              ) : (
                // Show pages around current page when in middle
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-8 h-8 p-0"
                    onClick={() => setCurrentPage(1)}
                  >
                    1
                  </Button>
                  <span className="px-2">...</span>
                  {Array.from({ length: 5 }, (_, i) => {
                    const pageNum = currentPage - 2 + i;
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        className="w-8 h-8 p-0"
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  <span className="px-2">...</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-8 h-8 p-0"
                    onClick={() => setCurrentPage(totalPages)}
                  >
                    {totalPages}
                  </Button>
                </>
              )}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Go to page</span>
            <GoToPageInput
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      )}

    </div>
  );
};

