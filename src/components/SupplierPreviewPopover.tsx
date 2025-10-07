import React, { useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Truck, Mail, Phone, MapPin, Package, Calendar, RotateCcw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface Supplier {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  created_at: string;
  updated_at: string;
}

interface SupplierPreviewPopoverProps {
  supplierId: string;
  supplierName: string;
  children: React.ReactNode;
}

interface SupplierDetails extends Supplier {
  lastOrderDate?: string | null;
  orderCount?: number;
}

export const SupplierPreviewPopover: React.FC<SupplierPreviewPopoverProps> = ({
  supplierId,
  supplierName,
  children
}) => {
  const [supplierDetails, setSupplierDetails] = useState<SupplierDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  // Fetch supplier details when popover opens
  useEffect(() => {
    if (isOpen && supplierId && user) {
      fetchSupplierDetails();
    }
  }, [isOpen, supplierId, user]);

  const fetchSupplierDetails = async () => {
    setLoading(true);
    try {
      // Fetch supplier basic info
      const { data: supplier, error: supplierError } = await supabase
        .from('suppliers')
        .select('*')
        .eq('id', supplierId)
        .eq('user_id', user.id)
        .single();

      if (supplierError) {
        console.error('Error fetching supplier:', supplierError);
        return;
      }

      // Fetch last order date and order count from delivery_notes
      const { data: lastOrder, error: orderError } = await supabase
        .from('delivery_notes')
        .select('created_at')
        .eq('supplier_id', supplierId)
        .eq('user_id', user.id)
        .eq('type', 'incoming')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      const { data: allOrders, error: countError } = await supabase
        .from('delivery_notes')
        .select('id')
        .eq('supplier_id', supplierId)
        .eq('user_id', user.id)
        .eq('type', 'incoming');

      setSupplierDetails({
        ...supplier,
        lastOrderDate: lastOrder?.created_at || null,
        orderCount: allOrders?.length || 0
      });

      if (orderError && orderError.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error fetching last order:', orderError);
      }
    } catch (error) {
      console.error('Error fetching supplier details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickReorder = () => {
    // This could navigate to a reorder page or open a modal
    toast.info('Quick reorder feature coming soon!');
    setIsOpen(false);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start">
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        ) : supplierDetails ? (
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">{supplierDetails.name}</h3>
              </div>
              {supplierDetails.orderCount && supplierDetails.orderCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {supplierDetails.orderCount} order{supplierDetails.orderCount !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>

            {/* Contact Information */}
            <div className="space-y-2">
              {supplierDetails.email && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <a 
                    href={`mailto:${supplierDetails.email}`}
                    className="hover:text-blue-600 hover:underline"
                  >
                    {supplierDetails.email}
                  </a>
                </div>
              )}
              
              {supplierDetails.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <a 
                    href={`tel:${supplierDetails.phone}`}
                    className="hover:text-blue-600 hover:underline"
                  >
                    {supplierDetails.phone}
                  </a>
                </div>
              )}
              
              {supplierDetails.address && (
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="line-clamp-2">{supplierDetails.address}</span>
                </div>
              )}
            </div>

            {/* Order Information */}
            <div className="border-t pt-3">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>Last order: {formatDate(supplierDetails.lastOrderDate)}</span>
              </div>
              
              {supplierDetails.orderCount === 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Package className="w-4 h-4 text-gray-400" />
                  <span>No orders yet</span>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="border-t pt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleQuickReorder}
                className="w-full"
                disabled={supplierDetails.orderCount === 0}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Quick Reorder
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            <Truck className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">Failed to load supplier details</p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
