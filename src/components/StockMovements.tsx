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
import { CalendarIcon, Download, Filter, Search } from 'lucide-react';
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
      XLSX.utils.book_append_sheet(wb, ws, 'Stock Movements');
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
            <p>Error loading stock movements: {error}</p>
            <Button variant="outline" onClick={refresh} className="mt-4">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-xl font-bold">Stock Movements</CardTitle>
          {!loading && (
            <p className="text-sm text-muted-foreground mt-1">
              {stats.transactionCount} transactions • Total value: €{stats.totalValue.toFixed(2)}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={loading || transactions.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products or references..."
                className="pl-8"
                value={filters.searchQuery}
                onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
              />
            </div>
            <Select
              value={filters.transactionType}
              onValueChange={(value: TransactionFilters['transactionType']) =>
                setFilters(prev => ({ ...prev, transactionType: value }))
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Transaction Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="incoming">Incoming</SelectItem>
                <SelectItem value="outgoing">Outgoing</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.dateRange}
              onValueChange={(value: TransactionFilters['dateRange']) =>
                setFilters(prev => ({ ...prev, dateRange: value }))
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
            
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
                      onSelect={(date) => 
                        setFilters(prev => ({ ...prev, startDate: date || undefined }))
                      }
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
                      onSelect={(date) =>
                        setFilters(prev => ({ ...prev, endDate: date || undefined }))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>

          {/* Transactions Table */}
          {loading ? (
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded-md" />
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No transactions found
            </div>
          ) : (
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-2 text-left">Date</th>
                    <th className="p-2 text-left">Product</th>
                    <th className="p-2 text-center">Type</th>
                    <th className="p-2 text-right">Quantity</th>
                    {!isMobile && (
                      <>
                        <th className="p-2 text-right">Unit Price</th>
                        <th className="p-2 text-right">Total Value</th>
                      </>
                    )}
                    <th className="p-2 text-left">Reference</th>
                    {!isMobile && (
                      <>
                        <th className="p-2 text-left">Supplier</th>
                        <th className="p-2 text-left">Notes</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b">
                      <td className="p-2 whitespace-nowrap">
                        {format(new Date(transaction.created_at), 'dd/MM/yyyy HH:mm')}
                      </td>
                      <td className="p-2">{transaction.product_name}</td>
                      <td className="p-2 text-center">
                        <Badge
                          variant={transaction.transaction_type === 'incoming' ? 'default' : 'destructive'}
                          className={transaction.transaction_type === 'incoming' ? 'bg-green-500 hover:bg-green-600' : ''}
                        >
                          {transaction.transaction_type}
                        </Badge>
                      </td>
                      <td className="p-2 text-right font-medium">
                        {transaction.quantity}
                      </td>
                      {!isMobile && (
                        <>
                          <td className="p-2 text-right">
                            €{transaction.unit_price.toFixed(2)}
                          </td>                          <td className="p-2 text-right">
                            €{(transaction.quantity * transaction.unit_price).toFixed(2)}
                          </td>
                        </>
                      )}
                      <td className="p-2">
                        {transaction.reference_number || '-'}
                      </td>
                      {!isMobile && (
                        <>
                          <td className="p-2">
                            {transaction.supplier_name || '-'}
                          </td>
                          <td className="p-2">
                            {transaction.notes || '-'}
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Stats Summary */}
          {!loading && transactions.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Incoming</p>
                  <p className="text-2xl font-bold text-green-600">{stats.totalIncoming}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Outgoing</p>
                  <p className="text-2xl font-bold text-red-600">{stats.totalOutgoing}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm font-medium text-muted-foreground">Transactions</p>
                  <p className="text-2xl font-bold">{stats.transactionCount}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                  <p className="text-2xl font-bold">€{stats.totalValue.toFixed(2)}</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
