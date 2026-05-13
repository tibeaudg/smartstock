import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
import { Plus, ClipboardList, Search, Download, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { PickList } from '@/types/stockTypes';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

type SortColumn = 'created_at' | 'assigned_to' | 'status' | null;
type SortDirection = 'asc' | 'desc';

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-800',
  pending: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const getInitials = (name?: string | null) => {
  if (!name) return 'N/A';
  const parts = name.trim().split(' ');
  return parts.length >= 2 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : name.substring(0, 2).toUpperCase();
};

export default function PickListsPage() {
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState<SortColumn>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const { data: pickLists = [], isLoading, refetch } = useQuery<PickList[]>({
    queryKey: ['pickLists', activeBranch?.branch_id, statusFilter],
    queryFn: async () => {
      if (!activeBranch?.branch_id) return [];
      let query = supabase
        .from('pick_lists')
        .select('*, items:pick_list_items(*, product:products!pick_list_items_product_id_fkey(name))')
        .eq('branch_id', activeBranch.branch_id)
        .order('created_at', { ascending: false });
      if (statusFilter !== 'all') query = query.eq('status', statusFilter);
      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as unknown as PickList[];
    },
    enabled: !!activeBranch?.branch_id,
  });

  const filtered = useMemo(() => {
    if (!searchQuery) return pickLists;
    const q = searchQuery.toLowerCase();
    return pickLists.filter(
      pl => pl.pick_number.toLowerCase().includes(q) ||
        pl.assigned_to?.toLowerCase().includes(q) ||
        pl.notes?.toLowerCase().includes(q)
    );
  }, [pickLists, searchQuery]);

  const sorted = useMemo(() => {
    if (!sortColumn) return filtered;
    return [...filtered].sort((a, b) => {
      let av: string | number, bv: string | number;
      switch (sortColumn) {
        case 'created_at': av = new Date(a.created_at).getTime(); bv = new Date(b.created_at).getTime(); break;
        case 'assigned_to': av = (a.assigned_to || '').toLowerCase(); bv = (b.assigned_to || '').toLowerCase(); break;
        case 'status': av = a.status; bv = b.status; break;
        default: return 0;
      }
      if (av < bv) return sortDirection === 'asc' ? -1 : 1;
      if (av > bv) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filtered, sortColumn, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / itemsPerPage));
  const paginated = useMemo(() => sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage), [sorted, currentPage, itemsPerPage]);

  const toggleSelectAll = (checked: boolean) => setSelectedIds(checked ? new Set(paginated.map(pl => pl.id)) : new Set());
  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedIds(next);
  };
  const isSelectAll = paginated.length > 0 && paginated.every(pl => selectedIds.has(pl.id));

  const handleSort = (col: SortColumn) => {
    if (sortColumn === col) setSortDirection(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortColumn(col); setSortDirection('desc'); }
  };

  const formatItems = (items: PickList['items'], max = 3) => {
    if (!items?.length) return '—';
    const names = items.slice(0, max).map((it: any) => it.product?.name || 'Unknown');
    const rest = items.length - max;
    return rest > 0 ? `${names.join(', ')} and ${rest} more` : names.join(', ');
  };

  const handleExport = () => {
    const toExport = selectedIds.size > 0 ? sorted.filter(pl => selectedIds.has(pl.id)) : sorted;
    const rows = [['Pick #', 'Date', 'Assigned To', 'Status', 'Items'].join(',')];
    toExport.forEach(pl => {
      rows.push([
        pl.pick_number,
        format(new Date(pl.created_at), 'MMM dd, yyyy'),
        `"${(pl.assigned_to || '').replace(/"/g, '""')}"`,
        pl.status,
        `"${formatItems(pl.items, 10).replace(/"/g, '""')}"`,
      ].join(','));
    });
    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `pick-lists-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    toast.success(`Exported ${toExport.length} pick list(s)`);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Delete ${selectedIds.size} pick list(s)? This cannot be undone.`)) return;
    try {
      const { error } = await supabase.from('pick_lists').delete().in('id', Array.from(selectedIds));
      if (error) throw error;
      toast.success(`Deleted ${selectedIds.size} pick list(s)`);
      setSelectedIds(new Set());
      refetch();
      queryClient.invalidateQueries({ queryKey: ['pickLists'] });
    } catch (e: any) {
      toast.error('Failed to delete: ' + (e.message || 'Unknown error'));
    }
  };

  if (!user || !activeBranch) {
    return (
      <div className="p-6">
        <Card><CardContent className="p-6 text-center"><p className="text-gray-600">Please select a warehouse to view pick lists.</p></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pick Lists</h1>
          <p className="text-sm text-gray-600 mt-1">Create lists of items to pick from inventory and track fulfillment</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExport} disabled={sorted.length === 0}>
            <Download className="w-4 h-4 mr-2" />Export
          </Button>
          <Link to="/dashboard/pick-lists/new">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />New Pick List
            </Button>
          </Link>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by pick number, assignee, or notes..." className="pl-8" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Filter by status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: pickLists.length, color: 'text-gray-900' },
          { label: 'Pending', value: pickLists.filter(pl => pl.status === 'pending').length, color: 'text-yellow-600' },
          { label: 'In Progress', value: pickLists.filter(pl => pl.status === 'in_progress').length, color: 'text-blue-600' },
          { label: 'Completed', value: pickLists.filter(pl => pl.status === 'completed').length, color: 'text-green-600' },
        ].map(stat => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : sorted.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <ClipboardList className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchQuery || statusFilter !== 'all' ? 'No pick lists found' : 'No Pick Lists yet'}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Create your first pick list to start tracking item pickups'}
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <Link to="/dashboard/pick-lists/new">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white"><Plus className="w-4 h-4 mr-2" />New Pick List</Button>
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
                    <TableHead>Pick #</TableHead>
                    <TableHead className="min-w-[180px]">Items</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('created_at')}>
                      <div className="flex items-center gap-2">Date {sortColumn === 'created_at' && <ArrowUpDown className={cn('w-3 h-3', sortDirection === 'asc' && 'rotate-180')} />}</div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('assigned_to')}>
                      <div className="flex items-center gap-2">Assigned To {sortColumn === 'assigned_to' && <ArrowUpDown className={cn('w-3 h-3', sortDirection === 'asc' && 'rotate-180')} />}</div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>
                      <div className="flex items-center gap-2">Status {sortColumn === 'status' && <ArrowUpDown className={cn('w-3 h-3', sortDirection === 'asc' && 'rotate-180')} />}</div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.map(pl => {
                    const totalQty = (pl.items || []).reduce((s: number, it: any) => s + (it.quantity_requested || 0), 0);
                    return (
                      <TableRow
                        key={pl.id}
                        className={cn('cursor-pointer', selectedIds.has(pl.id) && 'bg-blue-50')}
                        onClick={e => {
                          if ((e.target as HTMLElement).closest('input[type="checkbox"]')) return;
                          navigate(`/dashboard/pick-lists/${pl.id}/edit`);
                        }}
                      >
                        <TableCell onClick={e => e.stopPropagation()}>
                          <Checkbox checked={selectedIds.has(pl.id)} onCheckedChange={() => toggleSelect(pl.id)} />
                        </TableCell>
                        <TableCell className="font-medium">{pl.pick_number}</TableCell>
                        <TableCell className="min-w-[180px]">
                          <span className="truncate block" title={formatItems(pl.items, 10)}>{formatItems(pl.items)}</span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{totalQty || '—'}</TableCell>
                        <TableCell>{format(new Date(pl.created_at), 'd MMM yyyy')}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-purple-100 text-purple-700 text-xs">
                                {getInitials(pl.assigned_to)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{pl.assigned_to || 'Unassigned'}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={STATUS_COLORS[pl.status] || 'bg-gray-100 text-gray-800'}>
                            {STATUS_LABELS[pl.status] || pl.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Bulk actions */}
          {selectedIds.size > 0 && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-white border border-gray-200 rounded-xl shadow-lg px-6 py-3">
              <span className="text-sm font-medium text-gray-700">{selectedIds.size} selected</span>
              <Button variant="outline" size="sm" onClick={handleExport}>Export</Button>
              <Button variant="destructive" size="sm" onClick={handleBulkDelete}>Delete</Button>
              <Button variant="ghost" size="sm" onClick={() => setSelectedIds(new Set())}>Clear</Button>
            </div>
          )}

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Showing per page</span>
              <Select value={itemsPerPage.toString()} onValueChange={v => { setItemsPerPage(Number(v)); setCurrentPage(1); }}>
                <SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">Show 10</SelectItem>
                  <SelectItem value="25">Show 25</SelectItem>
                  <SelectItem value="50">Show 50</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <span className="text-sm text-gray-600">
              Showing {Math.min((currentPage - 1) * itemsPerPage + 1, sorted.length)}–{Math.min(currentPage * itemsPerPage, sorted.length)} of {sorted.length}
            </span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                <ChevronLeft className="w-4 h-4 mr-1" />Prev
              </Button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = totalPages <= 5 ? i + 1 : currentPage <= 3 ? i + 1 : currentPage >= totalPages - 2 ? totalPages - 4 + i : currentPage - 2 + i;
                return (
                  <Button key={page} variant={currentPage === page ? 'default' : 'outline'} size="sm" className="w-8 h-8 p-0" onClick={() => setCurrentPage(page)}>
                    {page}
                  </Button>
                );
              })}
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                Next<ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
