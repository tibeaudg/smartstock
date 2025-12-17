import React, { useState } from 'react';
import { useProductTransactions, type ProductTransactionFilters } from '@/hooks/useProductTransactions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useCurrency } from '@/hooks/useCurrency';
import { format } from 'date-fns';
import { Download, ChevronLeft, ChevronRight, Package } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

interface TransactionLedgerProps {
  productId: string;
}

export const TransactionLedger: React.FC<TransactionLedgerProps> = ({ productId }) => {
  const { formatPrice } = useCurrency();
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<ProductTransactionFilters>({
    page,
    pageSize: 50,
  });
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>();
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const { data, isLoading } = useProductTransactions(productId, {
    ...filters,
    userId: selectedUserId,
    dateFrom: dateFrom ? new Date(dateFrom) : undefined,
    dateTo: dateTo ? new Date(dateTo) : undefined,
    transactionTypes: selectedTypes.length > 0 ? selectedTypes : undefined,
    page,
    pageSize: 50,
  });

  // Fetch unique users for filter
  const [availableUsers, setAvailableUsers] = useState<Array<{ id: string; name: string }>>([]);

  React.useEffect(() => {
    const fetchUsers = async () => {
      if (!productId || !user) return;

      const { data: transactions } = await supabase
        .from('stock_transactions')
        .select('created_by')
        .eq('product_id', productId)
        .not('created_by', 'is', null);

      if (transactions) {
        const uniqueUserIds = [...new Set(transactions.map((t) => t.created_by).filter(Boolean))];
        
        // Fetch user profiles
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name, email')
          .in('id', uniqueUserIds);

        if (profiles) {
          setAvailableUsers(
            profiles.map((p) => ({
              id: p.id,
              name: p.full_name || p.email || 'Unknown',
            }))
          );
        }
      }
    };

    fetchUsers();
  }, [productId, user]);

  const handleExport = async () => {
    if (!data || !productId) return;

    try {
      // Fetch all transactions (not paginated) for export
      const { data: allTransactions } = await supabase
        .from('stock_transactions')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (!allTransactions) return;

      // Convert to CSV
      const headers = ['Date', 'Type', 'Quantity', 'Unit Price', 'Total', 'User', 'Reference', 'Notes'];
      const rows = allTransactions.map((tx) => [
        format(new Date(tx.created_at), 'yyyy-MM-dd HH:mm:ss'),
        tx.transaction_type,
        tx.quantity.toString(),
        (typeof tx.unit_price === 'string' ? parseFloat(tx.unit_price) : tx.unit_price || 0).toString(),
        (typeof tx.total_value === 'string' ? parseFloat(tx.total_value) : tx.total_value || 0).toString(),
        tx.created_by || '',
        tx.reference_number || '',
        tx.notes || '',
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
      ].join('\n');

      // Download
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions-${productId}-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast.success('Transactions exported successfully');
    } catch (error) {
      console.error('Error exporting transactions:', error);
      toast.error('Failed to export transactions');
    }
  };

  const transactionTypes = [
    'incoming',
    'outgoing',
    'purchase_order',
    'sales_order',
    'stock_transfer',
    'cycle_count',
    'adjustment',
    'damage',
    'return',
    'manual_adjustment',
    'scan_adjustment',
  ];

  const getTransactionTypeBadge = (type: string) => {
    const typeMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      incoming: { label: 'Incoming', variant: 'default' },
      outgoing: { label: 'Outgoing', variant: 'destructive' },
      purchase_order: { label: 'PO', variant: 'outline' },
      sales_order: { label: 'SO', variant: 'outline' },
      stock_transfer: { label: 'Transfer', variant: 'secondary' },
      adjustment: { label: 'Adjustment', variant: 'secondary' },
      manual_adjustment: { label: 'Manual', variant: 'secondary' },
      scan_adjustment: { label: 'Scan', variant: 'secondary' },
    };

    const config = typeMap[type] || { label: type, variant: 'outline' as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-500">Loading transactions...</div>
      </Card>
    );
  }

  if (!data || data.transactions.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">No transactions yet</p>
          <p className="text-sm text-gray-500">Transaction history will appear here</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      {/* Filters */}
      <div className="mb-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label className="text-xs">User</Label>
            <Select value={selectedUserId || 'all'} onValueChange={(value) => setSelectedUserId(value === 'all' ? undefined : value)}>
              <SelectTrigger>
                <SelectValue placeholder="All users" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All users</SelectItem>
                {availableUsers.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs">Date From</Label>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>

          <div>
            <Label className="text-xs">Date To</Label>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>

          <div>
            <Label className="text-xs">Type</Label>
            <Select
              value={selectedTypes.length > 0 ? selectedTypes.join(',') : 'all'}
              onValueChange={(value) => setSelectedTypes(value === 'all' ? [] : value.split(','))}
            >
              <SelectTrigger>
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                {transactionTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing {data.transactions.length} of {data.total} transactions
          </div>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[140px]">Date</TableHead>
              <TableHead className="w-[100px]">Type</TableHead>
              <TableHead className="w-[80px] text-right">Quantity</TableHead>
              <TableHead className="w-[100px] text-right">Unit Price</TableHead>
              <TableHead className="w-[100px] text-right">Total</TableHead>
              <TableHead className="w-[120px]">User</TableHead>
              <TableHead className="w-[120px]">Reference</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.transactions.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell className="text-xs">
                  {format(new Date(tx.created_at), 'MMM dd, yyyy HH:mm')}
                </TableCell>
                <TableCell>{getTransactionTypeBadge(tx.transaction_type)}</TableCell>
                <TableCell className="text-right font-mono">
                  {tx.quantity > 0 ? '+' : ''}{tx.quantity.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  {tx.unit_price ? formatPrice(typeof tx.unit_price === 'string' ? parseFloat(tx.unit_price) : tx.unit_price) : '-'}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {tx.total_value ? formatPrice(typeof tx.total_value === 'string' ? parseFloat(tx.total_value) : tx.total_value) : '-'}
                </TableCell>
                <TableCell className="text-xs text-gray-600">
                  {availableUsers.find(u => u.id === tx.created_by)?.name || 'Unknown'}
                </TableCell>
                <TableCell className="text-xs font-mono">
                  {tx.reference_number || '-'}
                </TableCell>
                <TableCell className="text-xs text-gray-600 max-w-xs truncate">
                  {tx.notes || '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {data.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-600">
            Page {data.page} of {data.totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
              disabled={page === data.totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

