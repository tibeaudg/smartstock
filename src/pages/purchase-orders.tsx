import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Search, Upload, Download, Filter, Package, Truck, CheckCircle, Clock, AlertCircle, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { useMobile } from '@/hooks/use-mobile';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { PurchaseOrderModal } from '@/components/PurchaseOrderModal';
import { PurchaseOrderCard } from '@/components/purchase-orders/PurchaseOrderCard';
import { StatusProgressBar } from '@/components/purchase-orders/StatusProgressBar';

interface PurchaseOrder {
  id: string;
  po_number: string;
  vendor_id: string;
  user_id: string;
  branch_id?: string;
  status: 'quote' | 'ordered' | 'packaging' | 'shipped' | 'received' | 'cancelled';
  payment_status: 'unpaid' | 'paid' | 'partial';
  payment_terms: string;
  order_date: string;
  expected_delivery_date?: string;
  actual_delivery_date?: string;
  shipping_carrier?: string;
  tracking_number?: string;
  warehouse_location?: string;
  delivery_street?: string;
  delivery_city?: string;
  delivery_state?: string;
  delivery_country?: string;
  delivery_zipcode?: string;
  assigned_to?: string;
  order_note?: string;
  terms?: string;
  total_amount: number;
  created_at: string;
  updated_at: string;
  vendor?: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  items?: Array<{
    id: string;
    product_id: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    product?: {
      id: string;
      name: string;
      image_url?: string;
    };
  }>;
}

// Fetch function for React Query
const fetchPurchaseOrders = async (userId: string): Promise<PurchaseOrder[]> => {
  const { data, error } = await supabase
    .from('purchase_orders')
    .select(`
      *,
      vendor:suppliers(id, name, email, phone, address),
      items:purchase_order_items(
        id,
        product_id,
        quantity,
        unit_price,
        total_price,
        product:products(id, name, image_url)
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching purchase orders:', error);
    throw error;
  }

  return data || [];
};

export default function PurchaseOrdersPage() {
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  const { isMobile } = useMobile();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Check for pre-selected vendor from navigation state
  const preSelectedVendor = location.state?.preSelectedVendor;
  const preSelectedVendorName = location.state?.preSelectedVendorName;
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');

  // Use React Query for caching
  const {
    data: purchaseOrders = [],
    isLoading: loading,
    error: purchaseOrdersError,
  } = useQuery<PurchaseOrder[]>({
    queryKey: ['purchase-orders', user?.id],
    queryFn: () => user ? fetchPurchaseOrders(user.id) : [],
    enabled: !!user,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    gcTime: 1000 * 60 * 30, // 30 minutes garbage collect
  });

  // Filter purchase orders based on search and filters
  const filteredPurchaseOrders = purchaseOrders.filter(po => {
    const matchesSearch = 
      po.po_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.vendor?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.items?.some(item => 
        item.product?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesStatus = statusFilter === 'all' || po.status === statusFilter;
    const matchesPaymentStatus = paymentStatusFilter === 'all' || po.payment_status === paymentStatusFilter;
    
    const matchesAmount = (() => {
      if (!minAmount && !maxAmount) return true;
      const amount = po.total_amount;
      const min = minAmount ? parseFloat(minAmount) : 0;
      const max = maxAmount ? parseFloat(maxAmount) : Infinity;
      return amount >= min && amount <= max;
    })();

    return matchesSearch && matchesStatus && matchesPaymentStatus && matchesAmount;
  });

  // Auto-open modal if vendor is pre-selected
  useEffect(() => {
    if (preSelectedVendor) {
      setShowAddModal(true);
      // Clear the state to prevent reopening
      navigate(location.pathname, { replace: true });
    }
  }, [preSelectedVendor, navigate, location.pathname]);

  // Real-time updates for purchase orders
  useEffect(() => {
    if (!user?.id) return;

    const purchaseOrdersChannel = supabase
      .channel('purchase-orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'purchase_orders',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          console.log('Purchase order change detected, refreshing...');
          queryClient.invalidateQueries({ queryKey: ['purchase-orders', user.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(purchaseOrdersChannel);
    };
  }, [user?.id, queryClient]);

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPaymentStatusFilter('all');
    setMinAmount('');
    setMaxAmount('');
  };

  const getStatusCounts = () => {
    const counts = {
      all: purchaseOrders.length,
      quote: 0,
      shipped: 0,
      received: 0,
    };

    purchaseOrders.forEach(po => {
      if (po.status === 'quote') counts.quote++;
      if (po.status === 'shipped') counts.shipped++;
      if (po.status === 'received') counts.received++;
    });

    return counts;
  };

  const statusCounts = getStatusCounts();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">You are not logged in</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Header Section with Title and Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-gray-900 mb-2`}>
            Purchase Orders
          </h1>

          
          <Badge className="text-xs bg-blue-100 text-blue-700 border border-blue-700">
                      Beta
                    </Badge>


          
          <p className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-600`}>
            Manage your purchase orders and track deliveries
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-2">

          <Button 
            onClick={() => setShowAddModal(true)}
            className="h-9 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Purchase Order
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-2 py-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search purchase orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={resetFilters}
          className="h-9 shrink-0"
        >
          <X className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={statusFilter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter('all')}
          className={statusFilter === 'all' ? 'bg-blue-600 text-white' : ''}
        >
          All ({statusCounts.all})
        </Button>
        <Button
          variant={statusFilter === 'quote' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter('quote')}
          className={statusFilter === 'quote' ? 'bg-blue-600 text-white' : ''}
        >
          Quote ({statusCounts.quote})
        </Button>
        <Button
          variant={statusFilter === 'shipped' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter('shipped')}
          className={statusFilter === 'shipped' ? 'bg-orange-600 text-white' : ''}
        >
          Shipped ({statusCounts.shipped})
        </Button>
        <Button
          variant={statusFilter === 'received' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter('received')}
          className={statusFilter === 'received' ? 'bg-green-600 text-white' : ''}
        >
          Received ({statusCounts.received})
        </Button>
      </div>

      {/* Purchase Orders List */}
      <div className="space-y-2">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading purchase orders...</p>
            </div>
          </div>
        ) : filteredPurchaseOrders.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No purchase orders found
              </h3>
              <p className="text-base text-gray-600 mb-4">
                You have no purchase orders yet. Create your first purchase order to get started.
              </p>
              <Button 
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Purchase Order
              </Button>
            </div>
          </div>
        ) : (
          filteredPurchaseOrders.map((purchaseOrder) => (
            <PurchaseOrderCard
              key={purchaseOrder.id}
              purchaseOrder={purchaseOrder}
              onEdit={() => {
                // TODO: Implement edit functionality
                console.log('Edit purchase order:', purchaseOrder.id);
              }}
              onDelete={() => {
                // TODO: Implement delete functionality
                console.log('Delete purchase order:', purchaseOrder.id);
              }}
            />
          ))
        )}
      </div>

      {/* Add Purchase Order Modal */}
      <PurchaseOrderModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onPurchaseOrderAdded={() => {
          setShowAddModal(false);
          queryClient.invalidateQueries({ queryKey: ['purchase-orders', user.id] });
        }}
        preSelectedVendor={preSelectedVendor}
        preSelectedVendorName={preSelectedVendorName}
      />
    </div>
  );
}
