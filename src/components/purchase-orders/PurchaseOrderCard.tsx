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

interface PurchaseOrder {
  id: string;
  po_number: string;
  status: 'quote' | 'ordered' | 'packaging' | 'shipped' | 'received' | 'cancelled';
  payment_status: 'unpaid' | 'paid' | 'partial';
  order_date: string;
  expected_delivery_date?: string;
  total_amount: number;
  vendor?: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  items?: Array<{
    id: string;
    quantity: number;
    product?: {
      id: string;
      name: string;
      image_url?: string;
    };
  }>;
  tracking_number?: string;
  shipping_carrier?: string;
}

interface PurchaseOrderCardProps {
  purchaseOrder: PurchaseOrder;
  onEdit: () => void;
  onDelete: () => void;
}

export const PurchaseOrderCard: React.FC<PurchaseOrderCardProps> = ({
  purchaseOrder,
  onEdit,
  onDelete
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'quote':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'ordered':
        return <Package className="w-4 h-4 text-orange-500" />;
      case 'packaging':
        return <Package className="w-4 h-4 text-orange-500" />;
      case 'shipped':
        return <Truck className="w-4 h-4 text-blue-500" />;
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
      case 'quote':
        return 'bg-blue-100 text-blue-800';
      case 'ordered':
      case 'packaging':
        return 'bg-orange-100 text-orange-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'received':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (paymentStatus: string) => {
    switch (paymentStatus) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800';
      case 'unpaid':
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
      case 'quote':
        return 'New Quote';
      case 'ordered':
        return 'Ordered';
      case 'packaging':
        return 'Product in packaging';
      case 'shipped':
        return 'Order is on shipping';
      case 'received':
        return 'Package received';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const getStatusDescription = (status: string, date: string) => {
    const formattedDate = formatDate(date);
    switch (status) {
      case 'quote':
        return `New Quote ${formattedDate}`;
      case 'ordered':
        return `Order placed ${formattedDate}`;
      case 'packaging':
        return `Product in packaging ${formattedDate}`;
      case 'shipped':
        return `Order is on shipping ${formattedDate}`;
      case 'received':
        return `Package received ${formattedDate}`;
      default:
        return `${status} ${formattedDate}`;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
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
            <Badge className={getPaymentStatusColor(purchaseOrder.payment_status)}>
              {purchaseOrder.payment_status === 'unpaid' ? 'Unpaid' : 
               purchaseOrder.payment_status === 'paid' ? 'Paid' : 'Partial'}
            </Badge>
          </div>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Product Information */}
        {purchaseOrder.items && purchaseOrder.items.length > 0 && (
          <div className="space-y-2">
            {purchaseOrder.items.slice(0, 2).map((item, index) => (
              <div key={item.id} className="flex items-center gap-3">
                {item.product?.image_url ? (
                  <img 
                    src={item.product.image_url} 
                    alt={item.product.name}
                    className="w-8 h-8 rounded object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                    <Package className="w-4 h-4 text-gray-400" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.product?.name}</p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
            {purchaseOrder.items.length > 2 && (
              <p className="text-xs text-gray-500">
                +{purchaseOrder.items.length - 2} more items
              </p>
            )}
          </div>
        )}

        {/* Vendor Information */}
        {purchaseOrder.vendor && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-sm">
                {purchaseOrder.vendor.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">{purchaseOrder.vendor.name}</p>
              <p className="text-xs text-gray-500">{purchaseOrder.vendor.address}</p>
            </div>
            <Badge variant="outline" className="text-xs">
              Billed
            </Badge>
          </div>
        )}

        {/* Status and Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {getStatusDescription(purchaseOrder.status, purchaseOrder.order_date)}
            </span>
            <span className="text-sm font-semibold">
              ${purchaseOrder.total_amount.toFixed(2)}
            </span>
          </div>
          
          <StatusProgressBar status={purchaseOrder.status} />
          
          {purchaseOrder.status === 'shipped' && (
            <Button 
              size="sm" 
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              Track shipment
            </Button>
          )}
          
          {purchaseOrder.status === 'received' && (
            <Button 
              size="sm" 
              variant="outline"
              className="w-full text-green-600 border-green-200"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Fulfilled
            </Button>
          )}
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
          {purchaseOrder.tracking_number && (
            <div className="flex items-center gap-1">
              <Truck className="w-3 h-3" />
              <span>{purchaseOrder.tracking_number}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
