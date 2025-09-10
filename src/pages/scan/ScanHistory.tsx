import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { History, Search, Filter, Download, Calendar, Package, ArrowUpDown } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { useModuleAccess } from '@/hooks/useModuleAccess';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';

interface ScanHistoryItem {
  id: string;
  barcode: string;
  product_name: string;
  transaction_type: 'in' | 'out';
  quantity: number;
  created_at: string;
  created_by: string;
  branch_id: string;
  branch_name: string;
}

export default function ScanHistory() {
  const { user, userProfile } = useAuth();
  const { activeBranch } = useBranches();
  const { data: scannerAccess } = useModuleAccess('scanning');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'in' | 'out'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'product' | 'quantity'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Check if user has access to scanner module
  if (!scannerAccess?.hasAccess) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Geen toegang</h2>
          <p className="text-gray-600">Je hebt geen toegang tot de Barcode Scanner module.</p>
        </div>
      </div>
    );
  }

  // Fetch scan history
  const { data: scanHistory = [], isLoading, error } = useQuery<ScanHistoryItem[]>({
    queryKey: ['scanHistory', activeBranch?.branch_id, searchTerm, filterType, sortBy, sortOrder],
    queryFn: async () => {
      if (!activeBranch) return [];

      let query = supabase
        .from('stock_transactions')
        .select(`
          id,
          barcode,
          product_name,
          transaction_type,
          quantity,
          created_at,
          created_by,
          branch_id,
          branches!inner(name)
        `)
        .eq('branch_id', activeBranch.branch_id)
        .not('barcode', 'is', null)
        .not('barcode', 'eq', '');

      // Apply search filter
      if (searchTerm) {
        query = query.or(`product_name.ilike.%${searchTerm}%,barcode.ilike.%${searchTerm}%`);
      }

      // Apply transaction type filter
      if (filterType !== 'all') {
        query = query.eq('transaction_type', filterType);
      }

      // Apply sorting
      const orderColumn = sortBy === 'date' ? 'created_at' : 
                         sortBy === 'product' ? 'product_name' : 'quantity';
      query = query.order(orderColumn, { ascending: sortOrder === 'asc' });

      const { data, error } = await query.limit(100);

      if (error) {
        console.error('Error fetching scan history:', error);
        throw error;
      }

      return data?.map(item => ({
        ...item,
        branch_name: (item as any).branches?.name || 'Onbekend'
      })) || [];
    },
    enabled: !!activeBranch && !!scannerAccess?.hasAccess,
  });

  const exportHistory = () => {
    const csvContent = [
      ['Datum', 'Barcode', 'Product', 'Type', 'Hoeveelheid', 'Gebruiker', 'Filiaal'].join(','),
      ...scanHistory.map(item => [
        format(new Date(item.created_at), 'dd-MM-yyyy HH:mm', { locale: nl }),
        item.barcode,
        `"${item.product_name}"`,
        item.transaction_type === 'in' ? 'Inkomend' : 'Uitgaand',
        item.quantity,
        item.created_by,
        `"${item.branch_name}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `scan-geschiedenis-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Scan geschiedenis geëxporteerd!');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Geschiedenis laden...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Fout bij laden</h2>
          <p className="text-gray-600">Er is een fout opgetreden bij het laden van de scan geschiedenis.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <History className="w-6 h-6" />
            Scan Geschiedenis
          </h1>
          <p className="text-gray-600 mt-1">
            Overzicht van alle barcode scans in {activeBranch?.name}
          </p>
        </div>
        <Button onClick={exportHistory} variant="outline" className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Exporteren
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Zoeken</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Product of barcode..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Type</label>
              <Select value={filterType} onValueChange={(value: 'all' | 'in' | 'out') => setFilterType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle</SelectItem>
                  <SelectItem value="in">Inkomend</SelectItem>
                  <SelectItem value="out">Uitgaand</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Sorteren op</label>
              <Select value={sortBy} onValueChange={(value: 'date' | 'product' | 'quantity') => setSortBy(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Datum</SelectItem>
                  <SelectItem value="product">Product</SelectItem>
                  <SelectItem value="quantity">Hoeveelheid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Volgorde</label>
              <Button
                variant="outline"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="w-full justify-between"
              >
                {sortOrder === 'asc' ? 'Oplopend' : 'Aflopend'}
                <ArrowUpDown className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Scan Geschiedenis ({scanHistory.length} resultaten)</span>
            <Badge variant="outline" className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {format(new Date(), 'dd MMM yyyy', { locale: nl })}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {scanHistory.length === 0 ? (
            <div className="text-center py-8">
              <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Geen scans gevonden</h3>
              <p className="text-gray-600">
                {searchTerm || filterType !== 'all' 
                  ? 'Geen scans gevonden met de huidige filters.' 
                  : 'Er zijn nog geen barcode scans uitgevoerd.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {scanHistory.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Package className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.product_name}</h4>
                      <p className="text-sm text-gray-600">Barcode: {item.barcode}</p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(item.created_at), 'dd MMM yyyy HH:mm', { locale: nl })} • {item.created_by}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={item.transaction_type === 'in' ? 'default' : 'secondary'}>
                      {item.transaction_type === 'in' ? 'Inkomend' : 'Uitgaand'}
                    </Badge>
                    <p className="text-sm font-semibold text-gray-900 mt-1">
                      {item.quantity} stuks
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
