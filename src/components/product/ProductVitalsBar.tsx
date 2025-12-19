import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useProductValuation } from '@/hooks/useProductValuation';
import { useProductLeadTime } from '@/hooks/useProductLeadTime';
import { useAuth } from '@/hooks/useAuth';
import { useCurrency } from '@/hooks/useCurrency';
import { cn } from '@/lib/utils';
import { 
  Package, 
  AlertCircle, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  DollarSign,
  Clock
} from 'lucide-react';

interface ProductVitalsBarProps {
  productId: string;
  quantityInStock: number;
  minimumStockLevel: number;
  allocated?: number; // If allocation tracking exists
  valuationMethod?: 'FIFO' | 'LIFO' | 'Average';
}

export const ProductVitalsBar: React.FC<ProductVitalsBarProps> = ({
  productId,
  quantityInStock,
  minimumStockLevel,
  allocated = 0,
  valuationMethod = 'Average',
}) => {
  const { userProfile } = useAuth();
  const { formatPrice } = useCurrency();
  const { data: valuation } = useProductValuation(productId, valuationMethod);
  const { data: leadTime } = useProductLeadTime(productId);

  // Permission check: Only admin/owner can see financial data
  const isAdmin = userProfile?.role === 'admin' || userProfile?.is_owner === true;

  // Calculate available stock
  const available = Math.max(0, quantityInStock - allocated);
  const onHand = quantityInStock;

  // Calculate reorder point status
  const getReorderPointStatus = () => {
    if (minimumStockLevel === 0) {
      return { status: 'normal', label: 'No Reorder Point', color: 'bg-gray-500' };
    }

    const ratio = quantityInStock / minimumStockLevel;
    
    if (ratio > 1.5) {
      return { status: 'normal', label: 'Normal', color: 'bg-green-500' };
    } else if (ratio > 0.5) {
      return { status: 'low', label: 'Low', color: 'bg-orange-500' };
    } else {
      return { status: 'critical', label: 'Critical', color: 'bg-red-500' };
    }
  };

  const reorderStatus = getReorderPointStatus();

  // Format lead time trend
  const getLeadTimeTrendIcon = () => {
    if (!leadTime) return null;
    
    switch (leadTime.trend) {
      case 'up':
        return <TrendingUp className="w-3 h-3 text-orange-500" />;
      case 'down':
        return <TrendingDown className="w-3 h-3 text-green-500" />;
      default:
        return <Minus className="w-3 h-3 text-gray-500" />;
    }
  };

  return (
    <Card className="p-3 border-b">
      <div className="flex items-center gap-6 flex-wrap">
        {/* On-Hand vs Available vs Allocated */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-gray-500" />
            <span className="text-xs text-gray-600">On-Hand:</span>
            <span className="text-sm font-semibold">{onHand.toLocaleString()}</span>
          </div>
          
          {allocated > 0 && (
            <>
              <div className="w-px h-4 bg-gray-300" />
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">Available:</span>
                <span className="text-sm font-semibold text-blue-600">
                  {available.toLocaleString()}
                </span>
              </div>
              <div className="w-px h-4 bg-gray-300" />
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">Allocated:</span>
                <span className="text-sm font-semibold text-orange-600">
                  {allocated.toLocaleString()}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Reorder Point Status */}
        <div className="flex items-center gap-2">
          <div className={cn('w-2 h-2 rounded-full', reorderStatus.color)} />
          <span className="text-xs text-gray-600">Reorder:</span>
          <Badge 
            variant={reorderStatus.status === 'critical' ? 'destructive' : 
                   reorderStatus.status === 'low' ? 'secondary' : 'outline'}
            className="text-xs"
          >
            {reorderStatus.label}
          </Badge>
        </div>

        {/* Current Valuation (Admin only) */}
        {isAdmin && valuation && (
          <>
            <div className="w-px h-4 bg-gray-300" />
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-gray-500" />
              <span className="text-xs text-gray-600">Valuation ({valuationMethod}):</span>
              <span className="text-sm font-semibold">
                {formatPrice(valuation.total_valuation)}
              </span>
              <span className="text-xs text-gray-500">
                ({formatPrice(valuation.average_cost_per_unit)}/unit)
              </span>
            </div>
          </>
        )}

        {/* Lead Time */}
        {leadTime && leadTime.receiptCount > 1 && (
          <>
            <div className="w-px h-4 bg-gray-300" />
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-xs text-gray-600">Lead Time:</span>
              <span className="text-sm font-semibold">
                {leadTime.averageDays.toFixed(1)} days avg
              </span>
              {getLeadTimeTrendIcon()}
            </div>
          </>
        )}
      </div>
    </Card>
  );
};




