import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  MoreHorizontal,
  MapPin,
  Calendar,
  DollarSign,
  User
} from 'lucide-react';
import { StatusProgressBar } from './StatusProgressBar';

import { PurchaseOrder } from '@/types/stockTypes';

interface PurchaseOrderCardProps {
  purchaseOrder: PurchaseOrder;
  onClick: () => void;
}

export const PurchaseOrderCard: React.FC<PurchaseOrderCardProps> = ({
  purchaseOrder,
  onClick
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <Clock className="w-4 h-4 text-gray-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'ordered':
        return <Package className="w-4 h-4 text-blue-500" />;
      case 'received':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'cancelled':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft':
        return 'Draft';
      case 'pending':
        return 'Pending';
      case 'ordered':
        return 'Ordered';
      case 'received':
        return 'Received';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {getStatusIcon(purchaseOrder.status)}
              <h3 className="font-semibold text-lg">{purchaseOrder.po_number}</h3>
            </div>
            <Badge className={getStatusColor(purchaseOrder.status)}>
              {getStatusText(purchaseOrder.status)}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Vendor Information */}
        {purchaseOrder.vendor_name && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-sm">
                {purchaseOrder.vendor_name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">{purchaseOrder.vendor_name}</p>
            </div>
          </div>
        )}

        {/* Items Summary */}
        {purchaseOrder.items && purchaseOrder.items.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Items: {purchaseOrder.items.length}</p>
            <p className="text-xs text-gray-500">
              Total Qty: {purchaseOrder.items.reduce((sum, item) => sum + item.quantity_ordered, 0)}
            </p>
          </div>
        )}

        {/* Status and Amount */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {formatDate(purchaseOrder.order_date)}
            </span>
            <span className="text-sm font-semibold">
              ${purchaseOrder.total_amount.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Additional Info */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(purchaseOrder.order_date)}</span>
            </div>
            {purchaseOrder.expected_delivery_date && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>Due {formatDate(purchaseOrder.expected_delivery_date)}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
