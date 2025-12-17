import React, { useState } from 'react';
import { useBOMTree } from '@/hooks/useBOMExplosion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, ChevronDown, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BOMTreeViewProps {
  productId: string;
  bomVersionId?: string | null;
  onComponentClick?: (componentId: string) => void;
}

interface TreeNode {
  component_product_id: string;
  component_product_name: string;
  component_product_sku: string | null;
  quantity_required: number;
  unit_of_measure: string;
  scrap_factor: number;
  sequence_number: number;
  level: number;
  parent_product_id: string;
  has_children: boolean;
  expanded?: boolean;
}

export const BOMTreeView: React.FC<BOMTreeViewProps> = ({
  productId,
  bomVersionId,
  onComponentClick,
}) => {
  const navigate = useNavigate();
  const { bomTree, isLoading } = useBOMTree(productId, bomVersionId);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const handleComponentClick = (componentId: string) => {
    if (onComponentClick) {
      onComponentClick(componentId);
    } else {
      navigate(`/dashboard/products/${componentId}`);
    }
  };

  const renderNode = (node: TreeNode, index: number) => {
    const nodeId = `${node.component_product_id}-${index}`;
    const isExpanded = expandedNodes.has(nodeId);
    const indentLevel = node.level * 24;

    return (
      <div key={nodeId}>
        <div
          className="flex items-center gap-2 py-2 px-3 hover:bg-gray-50 rounded cursor-pointer group"
          style={{ paddingLeft: `${indentLevel + 12}px` }}
          onClick={() => node.has_children && toggleNode(nodeId)}
        >
          <div className="flex items-center gap-2 flex-1">
            {node.has_children ? (
              <button
                className="p-0.5 hover:bg-gray-200 rounded"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleNode(nodeId);
                }}
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            ) : (
              <div className="w-5" />
            )}
            <Package className="w-4 h-4 text-gray-400" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span
                  className="font-medium text-sm hover:text-blue-600 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleComponentClick(node.component_product_id);
                  }}
                >
                  {node.component_product_name}
                </span>
                {node.component_product_sku && (
                  <Badge variant="outline" className="text-xs">
                    {node.component_product_sku}
                  </Badge>
                )}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                {node.quantity_required} {node.unit_of_measure}
                {node.scrap_factor > 0 && (
                  <span className="ml-2 text-orange-600">
                    (+{(node.scrap_factor * 100).toFixed(1)}% scrap)
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        {isExpanded && node.has_children && (
          <div>
            {bomTree
              .filter(
                (child) =>
                  child.parent_product_id === node.component_product_id &&
                  child.level === node.level + 1
              )
              .map((child, childIndex) => renderNode(child, childIndex))}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3" />
          <p className="text-sm text-gray-600">Loading BOM tree...</p>
        </div>
      </Card>
    );
  }

  if (bomTree.length === 0) {
    return (
      <Card className="p-4">
        <div className="text-center py-8 text-gray-500">
          <Package className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p>No components in BOM</p>
        </div>
      </Card>
    );
  }

  // Get root level nodes (level 0)
  const rootNodes = bomTree.filter((node) => node.level === 0);

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">BOM Tree View</h3>
      <div className="border rounded-lg overflow-hidden">
        {rootNodes.map((node, index) => renderNode(node, index))}
      </div>
    </Card>
  );
};

