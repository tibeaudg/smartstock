import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, ShoppingCart, Search } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { SalesOrder } from '@/types/stockTypes';
import { CreateSalesOrderModal } from '@/components/sales-orders/CreateSalesOrderModal';
import { SalesOrderDetail } from '@/components/sales-orders/SalesOrderDetail';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function SalesOrdersPage() {
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedSO, setSelectedSO] = useState<SalesOrder | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

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

  const filteredSOs = salesOrders.filter(so => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        so.so_number.toLowerCase().includes(query) ||
        so.customer_name?.toLowerCase().includes(query) ||
        so.notes?.toLowerCase().includes(query)
      );
    }
    return true;
  });

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales Orders</h1>
          <p className="text-sm text-gray-600 mt-1">Manage your sales orders and track fulfillment</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Create Sales Order
        </Button>
      </div>

      {/* Filters */}
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

      {/* Sales Orders List */}
      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredSOs.length === 0 ? (
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
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Sales Order
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredSOs.map((so) => (
            <Card key={so.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedSO(so)}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{so.so_number}</h3>
                      <Badge className={getStatusColor(so.status)}>
                        {so.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{so.customer_name || 'No customer'}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Items: {so.items?.length || 0} | Total: ${so.total_amount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
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




