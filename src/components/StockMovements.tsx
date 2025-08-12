import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile';
import { useStockMovements } from '@/hooks/useStockMovements';
import { TransactionFilters } from '@/types/stockTypes';
import { CalendarIcon, Download, Filter, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';

export const StockMovements = () => {
  const isMobile = useIsMobile();
  const {
    transactions,
    stats,
    loading,
    error,
    filters,
    setFilters,
    refresh
  } = useStockMovements();

  const handleExport = () => {
    try {
      const exportData = transactions.map(t => ({
        'Date': new Date(t.created_at).toLocaleString(),
        'Product': t.product_name,
        'Type': t.transaction_type,
        'Quantity': t.quantity,
        'Unit Price': t.unit_price.toFixed(2),
        'Total Value': (t.quantity * t.unit_price).toFixed(2),
        'Reference': t.reference_number || '',
        'Notes': t.notes || '',
        'Supplier': t.supplier_name || ''
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

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">

        <Button
          variant="default"
          size="sm"
          onClick={handleExport}
          disabled={loading || transactions.length === 0}
        >
          <Download className="h-4 w-4 mr-2 " />
          Export
        </Button>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        {/* Search and Quick Filters */}
        <div className="space-y-4">
          {/* Search bar - full width */}
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Zoek producten"
              className="pl-8"
              value={filters.searchQuery}
              onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
            />
          </div>
          {/* Filters row and Toevoegen button */}
          <div className="flex gap-2 items-center">
            <Select
              value={filters.transactionType}
              onValueChange={(value) => setFilters(prev => ({ ...prev, transactionType: value as 'all' | 'incoming' | 'outgoing' }))}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Types</SelectItem>
                <SelectItem value="incoming">In</SelectItem>
                <SelectItem value="outgoing">Out</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.dateRange}
              onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value as 'all' | 'today' | 'week' | 'month' | 'custom' }))}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Datum" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle</SelectItem>
                <SelectItem value="today">Vandaag</SelectItem>
                <SelectItem value="week">7 Dagen</SelectItem>
                <SelectItem value="month">30 Dagen</SelectItem>
                <SelectItem value="custom">Aangepast</SelectItem>
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
                  {filters.startDate ? format(filters.startDate, "PP") : "Start date"}
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
                  {filters.endDate ? format(filters.endDate, "PP") : "End date"}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm font-medium text-muted-foreground">Totaal In</p>
              <p className="text-2xl font-bold text-green-600">{stats.totalIncoming}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm font-medium text-muted-foreground">Totaal Uit</p>
              <p className="text-2xl font-bold text-red-600">{stats.totalOutgoing}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm font-medium text-muted-foreground">Bewegingen</p>
              <p className="text-2xl font-bold">{stats.transactionCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm font-medium text-muted-foreground">Huidige Waarde Stock</p>
              <p className="text-2xl font-bold">€{stats.totalValue.toFixed(2)}</p>
            </CardContent>
          </Card>
        </div>
      )}


             {/* Transactions Table */}
       <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
         <div className={isMobile ? "" : "overflow-x-auto"}>
           
           <table className={`${isMobile ? "w-full" : "min-w-full"} divide-y divide-gray-200`}>
                         <thead className="bg-gray-50">
               <tr>
                 <th className={`${isMobile ? "px-2 py-2" : "px-4 py-2"} text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${isMobile ? "w-1/2" : ""}`}>Product</th>
                 <th className={`${isMobile ? "px-1 py-2" : "px-4 py-2"} text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${isMobile ? "w-1/6" : ""}`}>Gebruiker</th>
                 <th className={`${isMobile ? "px-1 py-2" : "px-4 py-2"} text-center text-xs font-medium text-gray-500 uppercase tracking-wider ${isMobile ? "w-1/6" : ""}`}>Type</th>
                 <th className={`${isMobile ? "px-2 py-2" : "px-4 py-2"} text-right text-xs font-medium text-gray-500 uppercase tracking-wider ${isMobile ? "w-1/6" : ""}`}>Aantal</th>
                 {!isMobile && (
                   <>
                     <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Eenheidsprijs</th>
                     <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Totaal</th>
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
                     <div className="break-words">{transaction.first_name || 'Onbekend'}</div>
                   </td>
                   <td className={`${isMobile ? "px-1 py-2" : "px-4 py-2"} text-center`}>
                     <Badge
                       variant={transaction.transaction_type === 'incoming' ? 'default' : 'destructive'}
                       className={`${transaction.transaction_type === 'incoming' ? 'bg-green-500 hover:bg-green-600' : ''} ${isMobile ? 'text-xs px-1 py-0' : ''}`}
                     >
                       {transaction.transaction_type === 'incoming' ? 'In' : 'Uit'}
                     </Badge>
                   </td>
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
                        €{(transaction.transaction_type === 'incoming'
                          ? (transaction.purchase_price ?? transaction.unit_price)
                          : (transaction.sale_price ?? transaction.unit_price)
                        ).toFixed(2)}
                      </td>
                      <td className="px-4 py-2 text-right text-sm">
                        {transaction.transaction_type === 'outgoing' ? (
                          <span className="text-green-600">+ €{(transaction.quantity * (transaction.sale_price ?? transaction.unit_price)).toFixed(2)}</span>
                        ) : (
                          <span className="text-red-600">- €{(transaction.quantity * (transaction.purchase_price ?? transaction.unit_price)).toFixed(2)}</span>
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
