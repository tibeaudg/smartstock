import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TransactionLedger } from './TransactionLedger';
import { WarehouseDistribution } from './WarehouseDistribution';
import { BillOfMaterials } from './BillOfMaterials';
import { PredictiveAnalytics } from './PredictiveAnalytics';
import { Warehouse, FileText, Package, TrendingUp } from 'lucide-react';

interface InventorySegmentationProps {
  productId: string;
  currentStock: number;
  reorderPoint: number;
  onAddLocation?: () => void;
}

export const InventorySegmentation: React.FC<InventorySegmentationProps> = ({
  productId,
  currentStock,
  reorderPoint,
  onAddLocation,
}) => {
  return (
    <Tabs defaultValue="warehouse" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="warehouse" className="flex items-center gap-2">
          <Warehouse className="w-4 h-4" />
          <span className="hidden sm:inline">Distribution</span>
        </TabsTrigger>
        <TabsTrigger value="transactions" className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          <span className="hidden sm:inline">Transactions</span>
        </TabsTrigger>
        <TabsTrigger value="bom" className="flex items-center gap-2">
          <Package className="w-4 h-4" />
          <span className="hidden sm:inline">BOM</span>
        </TabsTrigger>
        <TabsTrigger value="analytics" className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          <span className="hidden sm:inline">Analytics</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="warehouse" className="mt-4">
        <WarehouseDistribution productId={productId} onAddLocation={onAddLocation} />
      </TabsContent>

      <TabsContent value="transactions" className="mt-4">
        <TransactionLedger productId={productId} />
      </TabsContent>

      <TabsContent value="bom" className="mt-4">
        <BillOfMaterials productId={productId} />
      </TabsContent>

      <TabsContent value="analytics" className="mt-4">
        <PredictiveAnalytics
          productId={productId}
          currentStock={currentStock}
          reorderPoint={reorderPoint}
        />
      </TabsContent>
    </Tabs>
  );
};

