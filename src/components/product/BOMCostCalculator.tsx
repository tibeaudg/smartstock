import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useBranches } from '@/hooks/useBranches';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calculator, DollarSign, Package, Wrench, Factory, Truck } from 'lucide-react';

interface BOMCostCalculatorProps {
  bomVersionId: string | null;
  quantity?: number;
}

interface BOMCostBreakdown {
  material_cost: number;
  labor_cost: number;
  overhead_cost: number;
  subcontract_cost: number;
  total_cost: number;
  cost_per_unit: number;
}

export const BOMCostCalculator: React.FC<BOMCostCalculatorProps> = ({
  bomVersionId,
  quantity = 1.0,
}) => {
  const { activeBranch } = useBranches();

  const { data: costBreakdown, isLoading, error } = useQuery<BOMCostBreakdown>({
    queryKey: ['bomCost', bomVersionId, quantity, activeBranch?.branch_id],
    queryFn: async () => {
      if (!bomVersionId || !activeBranch) {
        return {
          material_cost: 0,
          labor_cost: 0,
          overhead_cost: 0,
          subcontract_cost: 0,
          total_cost: 0,
          cost_per_unit: 0,
        };
      }

      const { data, error: costError } = await supabase.rpc('calculate_bom_cost', {
        p_bom_version_id: bomVersionId,
        p_quantity: quantity,
        p_branch_id: activeBranch.branch_id,
      });

      if (costError) {
        console.error('Error calculating BOM cost:', costError);
        throw costError;
      }

      if (!data || data.length === 0) {
        return {
          material_cost: 0,
          labor_cost: 0,
          overhead_cost: 0,
          subcontract_cost: 0,
          total_cost: 0,
          cost_per_unit: 0,
        };
      }

      const result = data[0];
      return {
        material_cost: parseFloat(result.material_cost || 0),
        labor_cost: parseFloat(result.labor_cost || 0),
        overhead_cost: parseFloat(result.overhead_cost || 0),
        subcontract_cost: parseFloat(result.subcontract_cost || 0),
        total_cost: parseFloat(result.total_cost || 0),
        cost_per_unit: parseFloat(result.cost_per_unit || 0),
      };
    },
    enabled: !!bomVersionId && !!activeBranch,
    staleTime: 60000, // Cache for 1 minute
  });

  if (!bomVersionId) {
    return (
      <Card className="p-4">
        <div className="text-center py-4 text-gray-500">
          <p>No BOM version selected</p>
          <p className="text-sm mt-1">Select a BOM version to calculate costs</p>
        </div>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Calculating costs...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-4">
        <div className="text-center py-4 text-red-600">
          <p>Error calculating costs</p>
          <p className="text-sm mt-1">{error instanceof Error ? error.message : 'Unknown error'}</p>
        </div>
      </Card>
    );
  }

  const breakdown = costBreakdown || {
    material_cost: 0,
    labor_cost: 0,
    overhead_cost: 0,
    subcontract_cost: 0,
    total_cost: 0,
    cost_per_unit: 0,
  };

  const totalNonMaterial = breakdown.labor_cost + breakdown.overhead_cost + breakdown.subcontract_cost;
  const materialPercentage = breakdown.total_cost > 0 
    ? (breakdown.material_cost / breakdown.total_cost) * 100 
    : 0;

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="w-5 h-5 text-gray-600" />
        <h3 className="font-semibold">BOM Cost Breakdown</h3>
        {quantity !== 1.0 && (
          <Badge variant="secondary" className="ml-auto">
            Quantity: {quantity}
          </Badge>
        )}
      </div>

      {/* Total Cost */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-blue-900">Total Cost</span>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-900">
              ${breakdown.total_cost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-sm text-blue-700">
              ${breakdown.cost_per_unit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} per unit
            </div>
          </div>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-gray-600" />
            <span className="font-medium">Material Cost</span>
          </div>
          <div className="text-right">
            <div className="font-semibold">
              ${breakdown.material_cost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-gray-500">
              {materialPercentage.toFixed(1)}% of total
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-gray-600" />
            <span className="font-medium">Labor Cost</span>
          </div>
          <div className="text-right">
            <div className="font-semibold">
              ${breakdown.labor_cost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Factory className="w-4 h-4 text-gray-600" />
            <span className="font-medium">Overhead Cost</span>
          </div>
          <div className="text-right">
            <div className="font-semibold">
              ${breakdown.overhead_cost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-gray-600" />
            <span className="font-medium">Subcontract Cost</span>
          </div>
          <div className="text-right">
            <div className="font-semibold">
              ${breakdown.subcontract_cost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      </div>

      {/* Cost Summary */}
      {totalNonMaterial > 0 && (
        <div className="mt-4 pt-4 border-t">
          <div className="text-sm text-gray-600">
            <div className="flex justify-between mb-1">
              <span>Direct Materials:</span>
              <span className="font-medium">
                ${breakdown.material_cost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Conversion Costs (Labor + Overhead):</span>
              <span className="font-medium">
                ${(breakdown.labor_cost + breakdown.overhead_cost).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

