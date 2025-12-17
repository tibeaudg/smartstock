import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useBranches } from '@/hooks/useBranches';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, AlertTriangle, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ATPDisplayProps {
  productId: string;
  bomVersionId?: string | null;
}

interface ShortageItem {
  component_product_id: string;
  component_product_name: string;
  component_product_sku: string | null;
  quantity_required: number;
  quantity_available: number;
  quantity_short: number;
  unit_of_measure: string;
}

interface ATPResult {
  can_build_quantity: number;
  shortage_items: ShortageItem[];
}

export const ATPDisplay: React.FC<ATPDisplayProps> = ({ productId, bomVersionId }) => {
  const { activeBranch } = useBranches();
  const navigate = useNavigate();

  const { data: atpResult, isLoading } = useQuery<ATPResult>({
    queryKey: ['atp', productId, bomVersionId, activeBranch?.branch_id],
    queryFn: async () => {
      if (!activeBranch) {
        return { can_build_quantity: 0, shortage_items: [] };
      }

      const { data, error } = await supabase.rpc('calculate_atp', {
        p_product_id: productId,
        p_bom_version_id: bomVersionId || null,
        p_branch_id: activeBranch.branch_id,
      });

      if (error) {
        console.error('Error calculating ATP:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        return { can_build_quantity: 0, shortage_items: [] };
      }

      const result = data[0];
      return {
        can_build_quantity: result.can_build_quantity || 0,
        shortage_items: (result.shortage_items || []) as ShortageItem[],
      };
    },
    enabled: !!productId && !!activeBranch,
    staleTime: 30000,
  });

  const handleGeneratePO = (shortage: ShortageItem) => {
    // Navigate to purchase orders with pre-filled data
    navigate('/dashboard/purchase-orders', {
      state: {
        prefillProduct: shortage.component_product_id,
        prefillQuantity: Math.ceil(shortage.quantity_short),
      },
    });
  };

  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Calculating ATP...</p>
        </div>
      </Card>
    );
  }

  const atp = atpResult || { can_build_quantity: 0, shortage_items: [] };

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Package className="w-5 h-5 text-gray-600" />
        <h3 className="font-semibold">Available to Promise (ATP)</h3>
      </div>

      {/* Buildable Quantity */}
      <div className={`mb-4 p-4 rounded-lg border ${
        atp.can_build_quantity > 0 
          ? 'bg-green-50 border-green-200' 
          : 'bg-orange-50 border-orange-200'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold text-lg">
              Can Build: {atp.can_build_quantity.toLocaleString()} units
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Based on current component stock levels
            </div>
          </div>
          <Badge variant={atp.can_build_quantity > 0 ? 'default' : 'destructive'}>
            {atp.can_build_quantity > 0 ? 'Available' : 'Unavailable'}
          </Badge>
        </div>
      </div>

      {/* Shortages */}
      {atp.shortage_items && atp.shortage_items.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-orange-600" />
            <h4 className="font-semibold text-sm">Component Shortages</h4>
          </div>
          <div className="space-y-2">
            {atp.shortage_items.map((shortage, index) => (
              <div
                key={index}
                className="p-3 bg-red-50 border border-red-200 rounded-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-red-900">
                      {shortage.component_product_name}
                    </div>
                    {shortage.component_product_sku && (
                      <div className="text-xs text-red-700 font-mono mt-1">
                        SKU: {shortage.component_product_sku}
                      </div>
                    )}
                    <div className="text-sm text-red-800 mt-2">
                      <div>Required: {shortage.quantity_required.toFixed(2)} {shortage.unit_of_measure}</div>
                      <div>Available: {shortage.quantity_available.toFixed(2)} {shortage.unit_of_measure}</div>
                      <div className="font-semibold">Short: {shortage.quantity_short.toFixed(2)} {shortage.unit_of_measure}</div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleGeneratePO(shortage)}
                    className="ml-4"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Generate PO
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {(!atp.shortage_items || atp.shortage_items.length === 0) && atp.can_build_quantity > 0 && (
        <div className="text-center py-4 text-green-700">
          <p className="text-sm">All components available in sufficient quantities</p>
        </div>
      )}
    </Card>
  );
};

