import React from 'react';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCurrency } from '@/hooks/useCurrency';
import { MapPin, Plus, Package } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useBranches } from '@/hooks/useBranches';
import { useQuery } from '@tanstack/react-query';

interface WarehouseDistributionProps {
  productId: string;
  onAddLocation?: () => void;
}

interface LocationData {
  location: string;
  quantity: number;
  value: number;
  lastMovement: string | null;
  status: 'active' | 'low' | 'empty';
}

export const WarehouseDistribution: React.FC<WarehouseDistributionProps> = ({
  productId,
  onAddLocation,
}) => {
  const { formatPrice } = useCurrency();
  const { activeBranch } = useBranches();

  const { data: locationData, isLoading } = useQuery<LocationData[]>({
    queryKey: ['warehouseDistribution', productId, activeBranch?.branch_id],
    queryFn: async () => {
      if (!productId || !activeBranch) return [];

      // Fetch product and variants with locations
      const { data: products, error } = await supabase
        .from('products')
        .select('id, location, quantity_in_stock, unit_price, purchase_price')
        .or(`id.eq.${productId},parent_product_id.eq.${productId}`)
        .eq('branch_id', activeBranch.branch_id);

      if (error) {
        console.error('Error fetching warehouse distribution:', error);
        throw error;
      }

      if (!products || products.length === 0) return [];

      // Group by location
      const locationMap = new Map<string, LocationData>();

      products.forEach((product) => {
        const location = product.location || 'No Location';
        const quantity = product.quantity_in_stock || 0;
        const price = product.purchase_price || product.unit_price || 0;
        const value = quantity * (typeof price === 'string' ? parseFloat(price) : price);

        if (locationMap.has(location)) {
          const existing = locationMap.get(location)!;
          existing.quantity += quantity;
          existing.value += value;
        } else {
          locationMap.set(location, {
            location,
            quantity,
            value,
            lastMovement: null,
            status: quantity === 0 ? 'empty' : quantity < 10 ? 'low' : 'active',
          });
        }
      });

      // Fetch last movement for each location
      const locations = Array.from(locationMap.keys());
      for (const location of locations) {
        const { data: lastTx } = await supabase
          .from('stock_transactions')
          .select('created_at')
          .eq('product_id', productId)
          .eq('branch_id', activeBranch.branch_id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (lastTx) {
          const locationData = locationMap.get(location);
          if (locationData) {
            locationData.lastMovement = lastTx.created_at;
          }
        }
      }

      return Array.from(locationMap.values()).sort((a, b) => b.quantity - a.quantity);
    },
    enabled: !!productId && !!activeBranch,
    staleTime: 30000,
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="bg-green-50 text-green-700">Active</Badge>;
      case 'low':
        return <Badge variant="secondary" className="bg-orange-50 text-orange-700">Low</Badge>;
      case 'empty':
        return <Badge variant="destructive">Empty</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const parseBinLevel = (location: string) => {
    // Support formats like "A1-B2-S3" or "Warehouse A, Shelf 3, Bin 5"
    if (location.includes('-')) {
      const parts = location.split('-');
      return {
        zone: parts[0] || '',
        aisle: parts[1] || '',
        shelf: parts[2] || '',
      };
    }
    return null;
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-500">Loading warehouse distribution...</div>
      </Card>
    );
  }

  if (!locationData || locationData.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">No location data</p>
          <p className="text-sm text-gray-500 mb-4">
            Add a location to track where this product is stored
          </p>
          {onAddLocation && (
            <Button variant="outline" size="sm" onClick={onAddLocation}>
              <Plus className="w-4 h-4 mr-2" />
              Add Location
            </Button>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Location</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Value</TableHead>
              <TableHead>Last Movement</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {locationData.map((item, index) => {
              const binLevel = parseBinLevel(item.location);
              return (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="font-medium">{item.location}</div>
                        {binLevel && (
                          <div className="text-xs text-gray-500">
                            Zone: {binLevel.zone}
                            {binLevel.aisle && ` • Aisle: ${binLevel.aisle}`}
                            {binLevel.shelf && ` • Shelf: ${binLevel.shelf}`}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {item.quantity.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatPrice(item.value)}
                  </TableCell>
                  <TableCell className="text-xs text-gray-600">
                    {item.lastMovement
                      ? format(new Date(item.lastMovement), 'MMM dd, yyyy')
                      : 'Never'}
                  </TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

