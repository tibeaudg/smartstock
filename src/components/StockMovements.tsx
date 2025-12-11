import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { useMobile } from '@/hooks/use-mobile';
import { useStockMovements } from '@/hooks/useStockMovements';
import { TransactionFilters } from '@/types/stockTypes';
import { CalendarIcon, Download, Filter, Search, X, History } from 'lucide-react';
import { cn } from '@/lib/utils';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';

export const StockMovements = () => {
  console.log('[StockMovements] Component rendering');
  const { isMobile } = useMobile();
  const {
    transactions,
    stats,
    loading,
    error,
    filters,
    setFilters,
    refresh
  } = useStockMovements();
  
  console.log('[StockMovements] State:', { loading, error: error?.message, transactionsCount: transactions.length });

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


    <div className="space-y-4">



      {/* Filters */}
      <div className="space-y-4">
        {/* Search and Quick Filters */}
        <div className="space-y-4">
          {/* Search bar - full width */}
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products"
              className="pl-8"
              value={filters.searchQuery}
              onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
            />
          </div>
          {/* Filters row and Toevoegen button */}
          <div className="flex gap-2 items-center">
            <Select
              value={filters.transactionType}
              onValueChange={(value) => setFilters(prev => ({ ...prev, transactionType: value as any }))}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="incoming">Incoming</SelectItem>
                <SelectItem value="outgoing">Outgoing</SelectItem>
                <SelectItem value="purchase_order">Purchase Order</SelectItem>
                <SelectItem value="sales_order">Sales Order</SelectItem>
                <SelectItem value="stock_transfer">Stock Transfer</SelectItem>
                <SelectItem value="cycle_count">Cycle Count</SelectItem>
                <SelectItem value="adjustment">Adjustment</SelectItem>
                <SelectItem value="manual_adjustment">Manual Adjustment</SelectItem>
                <SelectItem value="scan_adjustment">Scan Adjustment</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.dateRange}
              onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value as 'all' | 'today' | 'week' | 'month' | 'custom' }))}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">7 Days</SelectItem>
                <SelectItem value="month">30 Days</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
            {/* Toevoegen button next to filters */}

          </div>
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
      </div>



      {/* Stats Cards */}
      {!loading && transactions.length > 0 && (
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
              <p className="text-lg sm:text-xl lg:text-2xl font-bold">${stats.totalValue.toFixed(2)}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Empty state */}
      {!loading && transactions.length === 0 && (
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
       <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
         <div className={isMobile ? "" : "overflow-x-auto"}>
           
           <table className={`${isMobile ? "w-full" : "min-w-full"} divide-y divide-gray-200`}>
                         <thead className="bg-gray-50">
               <tr>
                <th className={`${isMobile ? "px-2 py-2" : "px-4 py-2"} text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${isMobile ? "w-1/2" : ""}`}>Product</th>
                 <th className={`${isMobile ? "px-1 py-2" : "px-4 py-2"} text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${isMobile ? "w-1/6" : ""}`}>User</th>
                 <th className={`${isMobile ? "px-1 py-2" : "px-4 py-2"} text-center text-xs font-medium text-gray-500 uppercase tracking-wider ${isMobile ? "w-1/6" : ""}`}>Type</th>
                 {!isMobile && (
                   <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                 )}
                 {!isMobile && (
                   <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                 )}
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
              {transactions.map((transaction, index) => (
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
                     <Badge
                       variant={transaction.transaction_type === 'incoming' || transaction.transaction_type === 'purchase_order' || transaction.transaction_type === 'cycle_count' ? 'success' : 'destructive'}
                       className={`${isMobile ? 'text-xs px-1 py-0' : ''}`}
                     >
                       {transaction.transaction_type === 'incoming' ? 'In' : 
                        transaction.transaction_type === 'outgoing' ? 'Out' :
                        transaction.transaction_type === 'purchase_order' ? 'PO' :
                        transaction.transaction_type === 'sales_order' ? 'SO' :
                        transaction.transaction_type === 'stock_transfer' ? 'Transfer' :
                        transaction.transaction_type === 'cycle_count' ? 'Cycle' :
                        transaction.transaction_type === 'manual_adjustment' ? 'Manual' :
                        transaction.transaction_type === 'scan_adjustment' ? 'Scan' :
                        transaction.transaction_type}
                     </Badge>
                   </td>
                   {!isMobile && (
                     <td className="px-4 py-2 text-center text-sm">
                       {transaction.source_type ? (
                         <span className="text-xs text-gray-500">
                           {transaction.source_type.replace('_', ' ')}
                         </span>
                       ) : (
                         <span className="text-xs text-gray-400">-</span>
                       )}
                     </td>
                   )}
                   {!isMobile && (
                     <td className="px-4 py-2 text-center text-sm">
                       {transaction.adjustment_method ? (
                         <Badge variant="outline" className="text-xs">
                           {transaction.adjustment_method}
                         </Badge>
                       ) : (
                         <span className="text-xs text-gray-400">-</span>
                       )}
                     </td>
                   )}
                   <td className={`${isMobile ? "px-2 py-2" : "px-4 py-2"} text-right text-sm font-medium`}>
                     {transaction.transaction_type === 'outgoing' ? (
                      <span className="text-red-600">- {transaction.quantity}</span>
                     ) : (
                       <span className="text-green-600">+ {transaction.quantity}</span>
                     )}
                   </td>
                  {!isMobile && (
                    <>
                      <td className="px-4 py-2 text-right text-sm">
                        ${(Number(transaction.unit_price) || 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-2 text-right text-sm">
                        {transaction.transaction_type === 'outgoing' ? (
                          <span className="text-green-600">+ ${(Number(transaction.total_value) || (transaction.quantity * Number(transaction.unit_price))).toFixed(2)}</span>
                        ) : (
                          <span className="text-red-600">- ${(Number(transaction.total_value) || (transaction.quantity * Number(transaction.unit_price))).toFixed(2)}</span>
                        )}
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
  );
};
