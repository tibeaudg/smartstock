import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Plus,
  Package,
  Search,
  Download,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { PurchaseOrder } from '@/types/stockTypes';
import { PurchaseOrderStatistics } from '@/components/purchase-orders/PurchaseOrderStatistics';
import { PurchaseOrderBulkActionBar } from '@/components/purchase-orders/PurchaseOrderBulkActionBar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

type SortColumn = 'order_date' | 'vendor_name' | 'total_amount' | 'status' | null;
type SortDirection = 'asc' | 'desc';

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

export default function PurchaseOrdersPage() {
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const state = location.state as { openCreate?: boolean } | undefined;
    if (state?.openCreate) {
      navigate('/dashboard/purchase-orders/new', { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [selectedOrderIds, setSelectedOrderIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState<SortColumn>('order_date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const { data: purchaseOrders = [], isLoading, refetch } = useQuery<PurchaseOrder[]>({
    queryKey: ['purchaseOrders', activeBranch?.branch_id, statusFilter],
    queryFn: async () => {
      if (!activeBranch?.branch_id) return [];

      let query = supabase
        .from('purchase_orders')
        .select(`
          *,
          items:purchase_order_items(*, product:products!purchase_order_items_product_id_fkey(name), variant:products!purchase_order_items_variant_id_fkey(name))
        `)
        .eq('branch_id', activeBranch.branch_id)
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    },
    enabled: !!activeBranch?.branch_id,
  });

  const filteredPOs = useMemo(() => {
    if (!searchQuery) return purchaseOrders;
    const query = searchQuery.toLowerCase();
    return purchaseOrders.filter(
      po =>
        po.po_number.toLowerCase().includes(query) ||
        po.vendor_name?.toLowerCase().includes(query) ||
        po.notes?.toLowerCase().includes(query)
    );
  }, [purchaseOrders, searchQuery]);

  const sortedPOs = useMemo(() => {
    if (!sortColumn) return filteredPOs;

    const sorted = [...filteredPOs].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortColumn) {
        case 'order_date':
          aValue = new Date(a.order_date).getTime();
          bValue = new Date(b.order_date).getTime();
          break;
        case 'vendor_name':
          aValue = (a.vendor_name || '').toLowerCase();
          bValue = (b.vendor_name || '').toLowerCase();
          break;
        case 'total_amount':
          aValue = a.total_amount;
          bValue = b.total_amount;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [filteredPOs, sortColumn, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(sortedPOs.length / itemsPerPage));
  const paginatedPOs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return sortedPOs.slice(start, end);
  }, [sortedPOs, currentPage, itemsPerPage]);

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrderIds(new Set(paginatedPOs.map(po => po.id)));
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

  const isSelectAll = paginatedPOs.length > 0 && paginatedPOs.every(po => selectedOrderIds.has(po.id));

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  const handleExport = () => {
    const ordersToExport =
      selectedOrderIds.size > 0
        ? sortedPOs.filter(po => selectedOrderIds.has(po.id))
        : sortedPOs;

    const headers = ['PO Number', 'Date', 'Vendor', 'Status', 'Products', 'Qty', 'Total'];
    const csvRows = [headers.join(',')];

    ordersToExport.forEach(po => {
      const productsCell = formatOrderItemsDisplay(po.items, 10).replace(/"/g, '""');
      const qtyCell = formatOrderQuantitiesDisplay(po.items, 10);
      const row = [
        po.po_number,
        format(new Date(po.order_date), 'MMM dd, yyyy'),
        `"${(po.vendor_name || 'N/A').replace(/"/g, '""')}"`,
        po.status,
        `"${productsCell}"`,
        qtyCell,
        (po.total_amount || 0).toFixed(2),
      ];
      csvRows.push(row.join(','));
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const dateStr = new Date().toISOString().split('T')[0];

    link.setAttribute('href', url);
    link.setAttribute('download', `purchase-orders-export-${dateStr}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
    toast.success(`Exported ${ordersToExport.length} purchase order(s)`);
  };

  const handleBulkDelete = async () => {
    if (selectedOrderIds.size === 0) return;

    if (
      !confirm(
        `Are you sure you want to delete ${selectedOrderIds.size} purchase order(s)? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const { error } = await supabase
        .from('purchase_orders')
        .delete()
        .in('id', Array.from(selectedOrderIds));

      if (error) throw error;

      toast.success(`Deleted ${selectedOrderIds.size} purchase order(s)`);
      setSelectedOrderIds(new Set());
      refetch();
      queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] });
    } catch (error: any) {
      toast.error('Failed to delete purchase orders: ' + (error.message || 'Unknown error'));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'ordered':
        return 'bg-blue-100 text-blue-800';
      case 'received':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getVendorInitials = (name?: string | null) => {
    if (!name) return 'N/A';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const formatOrderItemsDisplay = (items: PurchaseOrder['items'], maxItems = 3) => {
    if (!items?.length) return '—';
    const parts = items.slice(0, maxItems).map((item: { product?: { name?: string }; variant?: { name?: string } }) => {
      return item.variant?.name || item.product?.name || 'Unknown product';
    });
    const remainder = items.length - maxItems;
    return remainder > 0 ? `${parts.join(', ')} and ${remainder} more` : parts.join(', ');
  };

  const formatOrderQuantitiesDisplay = (items: PurchaseOrder['items'], maxItems = 3) => {
    if (!items?.length) return '—';
    const quantities = items.slice(0, maxItems).map((item: { quantity_ordered?: number }) => item.quantity_ordered ?? 0);
    const remainder = items.length - maxItems;
    const qtyStr = quantities.join(', ');
    return remainder > 0 ? `${qtyStr} +${remainder} more` : qtyStr;
  };

  if (!user || !activeBranch) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">Please select a branch to view purchase orders.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Purchase Orders</h1>
          <p className="text-sm text-gray-600 mt-1">Manage your purchase orders and track inventory receipts</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={sortedPOs.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Link to="/dashboard/purchase-orders/new">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create Purchase Order
            </Button>
          </Link>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by PO number, vendor, or notes..."
            className="pl-8"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
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
            <SelectItem value="ordered">Ordered</SelectItem>
            <SelectItem value="received">Received</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Statistics Cards */}
      <PurchaseOrderStatistics purchaseOrders={purchaseOrders} />

      {/* Purchase Orders Table */}
      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : sortedPOs.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchQuery || statusFilter !== 'all' ? 'No purchase orders found' : 'No Purchase Orders yet'}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Create your first purchase order to track vendor orders and inventory receipts'}
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <Link to="/dashboard/purchase-orders/new">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Purchase Order
                </Button>
              </Link>
            )}
          </div>
        </Card>
      ) : (
        <>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox checked={isSelectAll} onCheckedChange={toggleSelectAll} />
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort('order_date')}
                    >
                      <div className="flex items-center gap-2">
                        Orders
                        {sortColumn === 'order_date' && (
                          <ArrowUpDown className={cn('w-3 h-3', sortDirection === 'asc' ? 'rotate-180' : '')} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="min-w-[180px]">Items</TableHead>
                    <TableHead className="min-w-[80px]">Qty</TableHead>
                    <TableHead
                      className="cursor-pointer min-w-[90px]"
                      onClick={() => handleSort('total_amount')}
                    >
                      <div className="flex items-center gap-2">
                        Amount
                        {sortColumn === 'total_amount' && (
                          <ArrowUpDown className={cn('w-3 h-3', sortDirection === 'asc' ? 'rotate-180' : '')} />
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
                          <ArrowUpDown className={cn('w-3 h-3', sortDirection === 'asc' ? 'rotate-180' : '')} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort('vendor_name')}
                    >
                      <div className="flex items-center gap-2">
                        Vendor
                        {sortColumn === 'vendor_name' && (
                          <ArrowUpDown className={cn('w-3 h-3', sortDirection === 'asc' ? 'rotate-180' : '')} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center gap-2">
                        Status
                        {sortColumn === 'status' && (
                          <ArrowUpDown className={cn('w-3 h-3', sortDirection === 'asc' ? 'rotate-180' : '')} />
                        )}
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedPOs.map(po => {
                    const isSelected = selectedOrderIds.has(po.id);
                    return (
                      <TableRow
                        key={po.id}
                        className={cn('cursor-pointer', isSelected && 'bg-blue-50')}
                        onClick={e => {
                          if (
                            (e.target as HTMLElement).closest('input[type="checkbox"]') ||
                            (e.target as HTMLElement).closest('button')
                          ) {
                            return;
                          }
                          navigate(`/dashboard/purchase-orders/${po.id}/edit`);
                        }}
                      >
                        <TableCell onClick={e => e.stopPropagation()}>
                          <Checkbox checked={isSelected} onCheckedChange={() => toggleSelectOrder(po.id)} />
                        </TableCell>
                        <TableCell className="font-medium">{po.po_number}</TableCell>
                        <TableCell className="min-w-[180px]">
                          <span className="truncate block" title={formatOrderItemsDisplay(po.items, 10)}>
                            {formatOrderItemsDisplay(po.items)}
                          </span>
                        </TableCell>
                        <TableCell className="min-w-[80px] text-muted-foreground">
                          {formatOrderQuantitiesDisplay(po.items)}
                        </TableCell>
                        <TableCell className="font-medium min-w-[90px]">${(po.total_amount || 0).toFixed(2)}</TableCell>
                        <TableCell>{format(new Date(po.order_date), 'd MMM yyyy')}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                                {getVendorInitials(po.vendor_name)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{po.vendor_name || 'No vendor'}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(po.status)}>{po.status}</Badge>
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
            <PurchaseOrderBulkActionBar
              selectedCount={selectedOrderIds.size}
              onExport={handleExport}
              onDelete={handleBulkDelete}
              onClearSelection={() => setSelectedOrderIds(new Set())}
            />
          )}

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Showing per page</span>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={v => {
                  setItemsPerPage(Number(v));
                  setCurrentPage(1);
                }}
              >
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
                Showing {(currentPage - 1) * itemsPerPage + 1} -{' '}
                {Math.min(currentPage * itemsPerPage, sortedPOs.length)} of {sortedPOs.length}
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
                          variant={currentPage === totalPages ? 'default' : 'outline'}
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
                      variant={currentPage === pageNum ? 'default' : 'outline'}
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
              <GoToPageInput totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          </div>
        </>
      )}

    </div>
  );
}
