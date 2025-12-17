import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useBranches } from '@/hooks/useBranches';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface WhereUsedInquiryProps {
  componentId: string;
}

interface WhereUsedItem {
  parent_product_id: string;
  parent_product_name: string;
  parent_product_sku: string | null;
  bom_version_id: string | null;
  version_number: string | null;
  quantity_used: number;
  level: number;
}

export const WhereUsedInquiry: React.FC<WhereUsedInquiryProps> = ({ componentId }) => {
  const { activeBranch } = useBranches();
  const navigate = useNavigate();

  const { data: whereUsed, isLoading } = useQuery<WhereUsedItem[]>({
    queryKey: ['whereUsed', componentId, activeBranch?.branch_id],
    queryFn: async () => {
      if (!activeBranch) return [];

      const { data, error } = await supabase.rpc('get_where_used', {
        p_component_id: componentId,
        p_branch_id: activeBranch.branch_id,
      });

      if (error) {
        console.error('Error fetching where-used:', error);
        throw error;
      }

      return (data || []).map((item: any) => ({
        parent_product_id: item.parent_product_id,
        parent_product_name: item.parent_product_name || '',
        parent_product_sku: item.parent_product_sku,
        bom_version_id: item.bom_version_id,
        version_number: item.version_number,
        quantity_used: parseFloat(item.quantity_used || 0),
        level: item.level || 0,
      })) as WhereUsedItem[];
    },
    enabled: !!componentId && !!activeBranch,
  });

  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Loading where-used data...</p>
        </div>
      </Card>
    );
  }

  if (!whereUsed || whereUsed.length === 0) {
    return (
      <Card className="p-4">
        <div className="text-center py-8 text-gray-500">
          <Package className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p>This component is not used in any BOMs</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">Where Used</h3>
      <div className="space-y-2">
        {whereUsed.map((item, index) => (
          <div
            key={index}
            className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
            onClick={() => navigate(`/dashboard/products/${item.parent_product_id}`)}
            style={{ paddingLeft: `${item.level * 24 + 12}px` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {item.level > 0 && <ArrowRight className="w-4 h-4 text-gray-400" />}
                <Package className="w-4 h-4 text-gray-600" />
                <span className="font-medium">{item.parent_product_name}</span>
                {item.parent_product_sku && (
                  <Badge variant="outline" className="text-xs">
                    {item.parent_product_sku}
                  </Badge>
                )}
                {item.version_number && (
                  <Badge variant="secondary" className="text-xs">
                    v{item.version_number}
                  </Badge>
                )}
              </div>
              <div className="text-sm text-gray-600">
                {item.quantity_used.toFixed(3)} per unit
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

