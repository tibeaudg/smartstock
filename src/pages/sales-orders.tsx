import React, { useState, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Plus, 
  Search, 
  ShoppingCart, 
  Download, 
  Grid3x3, 
  Filter, 
  ArrowUpDown, 
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Calendar,
  Eye,
  Edit,
  Trash2,
  Copy
} from 'lucide-react';
import { toast } from 'sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { SalesOrder } from '@/types/stockTypes';
import { CreateSalesOrderModal } from '@/components/sales-orders/CreateSalesOrderModal';
import { SalesOrderDetail } from '@/components/sales-orders/SalesOrderDetail';
import { SalesOrderStatistics } from '@/components/sales-orders/SalesOrderStatistics';
import { SalesOrderBulkActionBar } from '@/components/sales-orders/SalesOrderBulkActionBar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

type SortColumn = 'order_date' | 'customer_name' | 'total_amount' | 'status' | 'payment_status' | null;
type SortDirection = 'asc' | 'desc';

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

export default function SalesOrdersPage() {
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  const queryClient = useQueryClient();
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedSO, setSelectedSO] = useState<SalesOrder | null>(null);
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Table states
  const [selectedOrderIds, setSelectedOrderIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState<SortColumn>('order_date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [showStatistics, setShowStatistics] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const { data: salesOrders = [], isLoading, refetch } = useQuery<SalesOrder[]>({
    queryKey: ['salesOrders', activeBranch?.branch_id],
    queryFn: async () => {
      if (!activeBranch?.branch_id) return [];
      
      let query = supabase
        .from('sales_orders')
        .select(`
          *,
          items:sales_order_items(*)
        `)
        .eq('branch_id', activeBranch.branch_id);

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      setLastUpdate(new Date());
      return data || [];
    },
    enabled: !!activeBranch?.branch_id,
  });

  // Filter sales orders
  const filteredSOs = useMemo(() => {
    let filtered = salesOrders;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(so =>
        so.so_number.toLowerCase().includes(query) ||
        so.customer_name?.toLowerCase().includes(query) ||
        so.notes?.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [salesOrders, searchQuery]);

  // Sort sales orders
  const sortedSOs = useMemo(() => {
    if (!sortColumn) return filteredSOs;
    
    const sorted = [...filteredSOs].sort((a, b) => {
      let aValue: any;
      let bValue: any;
      
      switch (sortColumn) {
        case 'order_date':
          aValue = new Date(a.order_date).getTime();
          bValue = new Date(b.order_date).getTime();
          break;
        case 'customer_name':
          aValue = (a.customer_name || '').toLowerCase();
          bValue = (b.customer_name || '').toLowerCase();
          break;
        case 'total_amount':
          aValue = a.total_amount;
          bValue = b.total_amount;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'payment_status':
          aValue = a.payment_status || 'pending';
          bValue = b.payment_status || 'pending';
          break;
        default:
          return 0;
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    return sorted;
  }, [filteredSOs, sortColumn, sortDirection]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedSOs.length / itemsPerPage));
  const paginatedSOs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return sortedSOs.slice(start, end);
  }, [sortedSOs, currentPage, itemsPerPage]);

  // Selection handlers
  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrderIds(new Set(paginatedSOs.map(so => so.id)));
    } else {
      setSelectedOrderIds(new Set());
    }
  };

  const toggleSelectOrder = (orderId: string) => {
    const newSelected = new Set(selectedOrderIds);
    if (newSelected.has(orderId)) {
      newSelected.delete(orderId);
    } else {
      newSelected.add(orderId);
    }
    setSelectedOrderIds(newSelected);
  };

  const isSelectAll = paginatedSOs.length > 0 && paginatedSOs.every(so => selectedOrderIds.has(so.id));

  // Sort handler
  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  // Export handler
  const handleExport = () => {
    const ordersToExport = selectedOrderIds.size > 0
      ? sortedSOs.filter(so => selectedOrderIds.has(so.id))
      : sortedSOs;

    const headers = ['SO Number', 'Date', 'Customer', 'Delivery', 'Items', 'Total', 'Payment', 'Status'];
    const csvRows = [headers.join(',')];

    ordersToExport.forEach(so => {
      const row = [
        so.so_number,
        format(new Date(so.order_date), 'MMM dd, yyyy'),
        `"${(so.customer_name || 'N/A').replace(/"/g, '""')}"`,
        so.delivery_status || 'N/A',
        (so.items?.length || 0).toString(),
        so.total_amount.toFixed(2),
        so.payment_status || 'pending',
        so.status,
      ];
      csvRows.push(row.join(','));
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const dateStr = new Date().toISOString().split('T')[0];
    
    link.setAttribute('href', url);
    link.setAttribute('download', `sales-orders-export-${dateStr}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    toast.success(`Exported ${ordersToExport.length} sales order(s)`);
  };

  // Bulk delete handler
  const handleBulkDelete = async () => {
    if (selectedOrderIds.size === 0) return;
    
    if (!confirm(`Are you sure you want to delete ${selectedOrderIds.size} sales order(s)? This action cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('sales_orders')
        .delete()
        .in('id', Array.from(selectedOrderIds));

      if (error) throw error;

      toast.success(`Deleted ${selectedOrderIds.size} sales order(s)`);
      setSelectedOrderIds(new Set());
      refetch();
      queryClient.invalidateQueries({ queryKey: ['salesOrders'] });
    } catch (error: any) {
      toast.error('Failed to delete sales orders: ' + (error.message || 'Unknown error'));
    }
  };

  const handleSOCreated = () => {
    setShowCreateModal(false);
    refetch();
    queryClient.invalidateQueries({ queryKey: ['salesOrders'] });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'fulfilled': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status?: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getDeliveryStatusColor = (status?: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'in_transit': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusLabel = (status?: string) => {
    switch (status) {
      case 'success': return 'Success';
      case 'pending': return 'Pending';
      case 'failed': return 'Failed';
      case 'refunded': return 'Refunded';
      default: return 'Pending';
    }
  };

  const getDeliveryStatusLabel = (status?: string) => {
    switch (status) {
      case 'delivered': return 'Delivered';
      case 'in_transit': return 'In Transit';
      case 'pending': return 'Pending';
      case 'failed': return 'Failed';
      default: return 'N/A';
    }
  };

  const getCustomerInitials = (name?: string | null) => {
    if (!name) return 'N/A';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  if (!user || !activeBranch) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">Please select a branch to view sales orders.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales Orders</h1>
          <p className="text-sm text-gray-600 mt-1">Manage your sales orders and track fulfillment</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExport}
            disabled={sortedSOs.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button 
            onClick={() => setShowCreateModal(true)} 
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Sales Order
          </Button>
        </div>
      </div>


      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by SO number, customer, or notes..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="fulfilled">Fulfilled</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Statistics Cards */}
      {showStatistics && <SalesOrderStatistics salesOrders={salesOrders} />}

      {/* Sales Orders Table */}
      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : sortedSOs.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No sales orders found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || statusFilter !== 'all' 
                ? 'Try adjusting your filters'
                : 'Create your first sales order to get started'}
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <Button 
                onClick={() => setShowCreateModal(true)} 
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Sales Order
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={isSelectAll}
                        onCheckedChange={toggleSelectAll}
                      />
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort('order_date')}
                    >
                      <div className="flex items-center gap-2">
                        Orders
                        {sortColumn === 'order_date' && (
                          <ArrowUpDown className={cn(
                            "w-3 h-3",
                            sortDirection === 'asc' ? 'rotate-180' : ''
                          )} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort('order_date')}
                    >
                      <div className="flex items-center gap-2">
                        Date
                        {sortColumn === 'order_date' && (
                          <ArrowUpDown className={cn(
                            "w-3 h-3",
                            sortDirection === 'asc' ? 'rotate-180' : ''
                          )} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort('customer_name')}
                    >
                      <div className="flex items-center gap-2">
                        Customer
                        {sortColumn === 'customer_name' && (
                          <ArrowUpDown className={cn(
                            "w-3 h-3",
                            sortDirection === 'asc' ? 'rotate-180' : ''
                          )} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Delivery</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort('total_amount')}
                    >
                      <div className="flex items-center gap-2">
                        Total
                        {sortColumn === 'total_amount' && (
                          <ArrowUpDown className={cn(
                            "w-3 h-3",
                            sortDirection === 'asc' ? 'rotate-180' : ''
                          )} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort('payment_status')}
                    >
                      <div className="flex items-center gap-2">
                        Payment
                        {sortColumn === 'payment_status' && (
                          <ArrowUpDown className={cn(
                            "w-3 h-3",
                            sortDirection === 'asc' ? 'rotate-180' : ''
                          )} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedSOs.map((so) => {
                    const isSelected = selectedOrderIds.has(so.id);
                    return (
                      <TableRow
                        key={so.id}
                        className={cn(
                          "cursor-pointer",
                          isSelected && "bg-blue-50"
                        )}
                        onClick={(e) => {
                          if ((e.target as HTMLElement).closest('input[type="checkbox"]') || 
                              (e.target as HTMLElement).closest('button')) {
                            return;
                          }
                          setSelectedSO(so);
                        }}
                      >
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => toggleSelectOrder(so.id)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{so.so_number}</TableCell>
                        <TableCell>
                          {format(new Date(so.order_date), 'd MMM yyyy')}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                                {getCustomerInitials(so.customer_name)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{so.customer_name || 'No customer'}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getDeliveryStatusColor(so.delivery_status)}>
                            {getDeliveryStatusLabel(so.delivery_status)}
                          </Badge>
                        </TableCell>
                        <TableCell>{so.items?.length || 0} Items</TableCell>
                        <TableCell className="font-medium">${so.total_amount.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge className={getPaymentStatusColor(so.payment_status)}>
                            {getPaymentStatusLabel(so.payment_status)}
                          </Badge>
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setSelectedSO(so)}>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {
                                // TODO: Implement edit
                                toast.info('Edit functionality coming soon');
                              }}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {
                                // TODO: Implement duplicate
                                toast.info('Duplicate functionality coming soon');
                              }}>
                                <Copy className="w-4 h-4 mr-2" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={async () => {
                                  if (confirm('Are you sure you want to delete this sales order?')) {
                                    try {
                                      const { error } = await supabase
                                        .from('sales_orders')
                                        .delete()
                                        .eq('id', so.id);
                                      
                                      if (error) throw error;
                                      toast.success('Sales order deleted');
                                      refetch();
                                    } catch (error: any) {
                                      toast.error('Failed to delete: ' + (error.message || 'Unknown error'));
                                    }
                                  }
                                }}
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Bulk Action Bar */}
          {selectedOrderIds.size > 0 && (
            <SalesOrderBulkActionBar
              selectedCount={selectedOrderIds.size}
              onExport={handleExport}
              onDelete={handleBulkDelete}
              onClearSelection={() => setSelectedOrderIds(new Set())}
            />
          )}

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
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
                Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, sortedSOs.length)} of {sortedSOs.length}
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
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  if (totalPages > 5 && i === 4 && pageNum < totalPages - 1) {
                    return (
                      <React.Fragment key={pageNum}>
                        <span className="px-2">...</span>
                        <Button
                          variant={currentPage === totalPages ? "default" : "outline"}
                          size="sm"
                          className="w-8 h-8 p-0"
                          onClick={() => setCurrentPage(totalPages)}
                        >
                          {totalPages}
                        </Button>
                      </React.Fragment>
                    );
                  }
                  
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
        </>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateSalesOrderModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSOCreated={handleSOCreated}
        />
      )}

      {selectedSO && (
        <SalesOrderDetail
          salesOrder={selectedSO}
          isOpen={!!selectedSO}
          onClose={() => setSelectedSO(null)}
          onSOUpdated={refetch}
        />
      )}
    </div>
  );
}
