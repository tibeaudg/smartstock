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
  onAddWarehouse?: () => void;
}

interface WarehouseData {
  warehouse: string;
  quantity: number;
  value: number;
  lastMovement: string | null;
  status: 'active' | 'low' | 'empty';
}

export const WarehouseDistribution: React.FC<WarehouseDistributionProps> = ({
  productId,
  onAddWarehouse,
}) => {
  const { formatPrice } = useCurrency();
  const { activeBranch } = useBranches();

  const { data: warehouseData, isLoading } = useQuery<WarehouseData[]>({
    queryKey: ['warehouseDistribution', productId, activeBranch?.branch_id],
    queryFn: async () => {
      if (!productId || !activeBranch) return [];

      // Fetch product and variants with warehouses
      const { data: products, error } = await supabase
        .from('products')
        .select('id, warehouse_name, quantity_in_stock, unit_price, purchase_price')
        .or(`id.eq.${productId},parent_product_id.eq.${productId}`)
        .eq('branch_id', activeBranch.branch_id);

      if (error) {
        console.error('Error fetching warehouse distribution:', error);
        throw error;
      }

      if (!products || products.length === 0) return [];

      // Group by warehouse
      const warehouseMap = new Map<string, WarehouseData>();

      products.forEach((product) => {
        const warehouse = product.warehouse_name || 'No Warehouse';
        const quantity = product.quantity_in_stock || 0;
        const price = product.purchase_price || product.unit_price || 0;
        const value = quantity * (typeof price === 'string' ? parseFloat(price) : price);

        if (warehouseMap.has(warehouse)) {
          const existing = warehouseMap.get(warehouse)!;
          existing.quantity += quantity;
          existing.value += value;
        } else {
          warehouseMap.set(warehouse, {
            warehouse,
            quantity,
            value,
            lastMovement: null,
            status: quantity === 0 ? 'empty' : quantity < 10 ? 'low' : 'active',
          });
        }
      });

      // Fetch last movement for each warehouse
      const warehouses = Array.from(warehouseMap.keys());
      for (const warehouse of warehouses) {
        const { data: lastTx } = await supabase
          .from('stock_transactions')
          .select('created_at')
          .eq('product_id', productId)
          .eq('branch_id', activeBranch.branch_id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (lastTx) {
          const warehouseData = warehouseMap.get(warehouse);
          if (warehouseData) {
            warehouseData.lastMovement = lastTx.created_at;
          }
        }
      }

      return Array.from(warehouseMap.values()).sort((a, b) => b.quantity - a.quantity);
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

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-500">Loading warehouse distribution...</div>
      </Card>
    );
  }

  if (!warehouseData || warehouseData.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">No warehouse data</p>
          <p className="text-sm text-gray-500 mb-4">
            Add a warehouse to track where this product is stored
          </p>
          {onAddWarehouse && (
            <Button variant="outline" size="sm" onClick={onAddWarehouse}>
              <Plus className="w-4 h-4 mr-2" />
              Add Warehouse
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
              <TableHead>Warehouse</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Value</TableHead>
              <TableHead>Last Movement</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {warehouseData.map((item, index) => {
              return (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <div className="font-medium">{item.warehouse}</div>
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




