import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

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

interface CreatePurchaseOrderData {
  vendor_id: string;
  branch_id?: string;
  status?: 'quote' | 'ordered' | 'packaging' | 'shipped' | 'received' | 'cancelled';
  payment_status?: 'unpaid' | 'paid' | 'partial';
  payment_terms?: string;
  expected_delivery_date?: string;
  assigned_to?: string;
  shipping_carrier?: string;
  warehouse_location?: string;
  delivery_street?: string;
  delivery_country?: string;
  delivery_city?: string;
  delivery_state?: string;
  delivery_zipcode?: string;
  order_note?: string;
  terms?: string;
  total_amount: number;
  items: Array<{
    product_id: string;
    quantity: number;
    unit_price: number;
    total_price: number;
  }>;
}

interface UpdatePurchaseOrderData {
  status?: 'quote' | 'ordered' | 'packaging' | 'shipped' | 'received' | 'cancelled';
  payment_status?: 'unpaid' | 'paid' | 'partial';
  tracking_number?: string;
  actual_delivery_date?: string;
  order_note?: string;
}

// Fetch purchase orders
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

// Create purchase order
const createPurchaseOrder = async (userId: string, data: CreatePurchaseOrderData): Promise<PurchaseOrder> => {
  const { data: purchaseOrder, error: poError } = await supabase
    .from('purchase_orders')
    .insert({
      vendor_id: data.vendor_id,
      user_id: userId,
      branch_id: data.branch_id,
      status: data.status || 'quote',
      payment_status: data.payment_status || 'unpaid',
      payment_terms: data.payment_terms || 'due_on_receipt',
      expected_delivery_date: data.expected_delivery_date || null,
      assigned_to: data.assigned_to || null,
      shipping_carrier: data.shipping_carrier || null,
      warehouse_location: data.warehouse_location || null,
      delivery_street: data.delivery_street || null,
      delivery_country: data.delivery_country || null,
      delivery_city: data.delivery_city || null,
      delivery_state: data.delivery_state || null,
      delivery_zipcode: data.delivery_zipcode || null,
      order_note: data.order_note || null,
      terms: data.terms || null,
      total_amount: data.total_amount
    })
    .select()
    .single();

  if (poError) {
    console.error('Error creating purchase order:', poError);
    throw poError;
  }

  // Add purchase order items
  if (data.items && data.items.length > 0) {
    const items = data.items.map(item => ({
      purchase_order_id: purchaseOrder.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.total_price
    }));

    const { error: itemsError } = await supabase
      .from('purchase_order_items')
      .insert(items);

    if (itemsError) {
      console.error('Error adding purchase order items:', itemsError);
      throw itemsError;
    }
  }

  return purchaseOrder;
};

// Update purchase order
const updatePurchaseOrder = async (id: string, data: UpdatePurchaseOrderData): Promise<PurchaseOrder> => {
  const { data: purchaseOrder, error } = await supabase
    .from('purchase_orders')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating purchase order:', error);
    throw error;
  }

  return purchaseOrder;
};

// Delete purchase order
const deletePurchaseOrder = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('purchase_orders')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting purchase order:', error);
    throw error;
  }
};

export const usePurchaseOrders = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch purchase orders
  const {
    data: purchaseOrders = [],
    isLoading,
    error,
    refetch
  } = useQuery<PurchaseOrder[]>({
    queryKey: ['purchase-orders', user?.id],
    queryFn: () => user ? fetchPurchaseOrders(user.id) : [],
    enabled: !!user,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    gcTime: 1000 * 60 * 30, // 30 minutes garbage collect
  });

  // Create purchase order mutation
  const createMutation = useMutation({
    mutationFn: (data: CreatePurchaseOrderData) => {
      if (!user) throw new Error('User not authenticated');
      return createPurchaseOrder(user.id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders', user?.id] });
      toast.success('Purchase order created successfully');
    },
    onError: (error: any) => {
      console.error('Error creating purchase order:', error);
      toast.error('Error creating purchase order');
    }
  });

  // Update purchase order mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePurchaseOrderData }) => 
      updatePurchaseOrder(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders', user?.id] });
      toast.success('Purchase order updated successfully');
    },
    onError: (error: any) => {
      console.error('Error updating purchase order:', error);
      toast.error('Error updating purchase order');
    }
  });

  // Delete purchase order mutation
  const deleteMutation = useMutation({
    mutationFn: deletePurchaseOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders', user?.id] });
      toast.success('Purchase order deleted successfully');
    },
    onError: (error: any) => {
      console.error('Error deleting purchase order:', error);
      toast.error('Error deleting purchase order');
    }
  });

  // Filter and search functions
  const filterByStatus = (status: string) => {
    if (status === 'all') return purchaseOrders;
    return purchaseOrders.filter(po => po.status === status);
  };

  const filterByPaymentStatus = (paymentStatus: string) => {
    if (paymentStatus === 'all') return purchaseOrders;
    return purchaseOrders.filter(po => po.payment_status === paymentStatus);
  };

  const searchPurchaseOrders = (searchTerm: string) => {
    if (!searchTerm) return purchaseOrders;
    
    const term = searchTerm.toLowerCase();
    return purchaseOrders.filter(po => 
      po.po_number.toLowerCase().includes(term) ||
      po.vendor?.name.toLowerCase().includes(term) ||
      po.items?.some(item => 
        item.product?.name.toLowerCase().includes(term)
      )
    );
  };

  const filterByAmountRange = (minAmount: number, maxAmount: number) => {
    return purchaseOrders.filter(po => 
      po.total_amount >= minAmount && po.total_amount <= maxAmount
    );
  };

  // Get status counts
  const getStatusCounts = () => {
    const counts = {
      all: purchaseOrders.length,
      quote: 0,
      ordered: 0,
      packaging: 0,
      shipped: 0,
      received: 0,
      cancelled: 0
    };

    purchaseOrders.forEach(po => {
      counts[po.status]++;
    });

    return counts;
  };

  // Get payment status counts
  const getPaymentStatusCounts = () => {
    const counts = {
      all: purchaseOrders.length,
      unpaid: 0,
      paid: 0,
      partial: 0
    };

    purchaseOrders.forEach(po => {
      counts[po.payment_status]++;
    });

    return counts;
  };

  return {
    purchaseOrders,
    isLoading,
    error,
    refetch,
    createPurchaseOrder: createMutation.mutate,
    updatePurchaseOrder: updateMutation.mutate,
    deletePurchaseOrder: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    filterByStatus,
    filterByPaymentStatus,
    searchPurchaseOrders,
    filterByAmountRange,
    getStatusCounts,
    getPaymentStatusCounts
  };
};
