import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useBranches } from '@/hooks/useBranches';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Package, Search, ArrowRight, ChevronDown, ChevronRight, Eye, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { useProductBOM } from '@/hooks/useProductBOM';
import { BillOfMaterials } from '@/components/product/BillOfMaterials';
import SEO from '@/components/SEO';

interface BOMListItem {
  id: string;
  parent_product_id: string;
  parent_product_name: string;
  parent_product_sku: string | null;
  component_count: number;
  buildable_quantity: number;
  created_at: string;
  versions?: Array<{ version_number: string; status: string; component_count: number }>;
  components?: Array<{ 
    name: string; 
    quantity: number; 
    unit: string;
    component_id?: string;
    unit_cost?: number;
    current_stock?: number;
  }>;
}

export default function BillOfMaterialsPage() {
  const { activeBranch } = useBranches();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newBOMProductId, setNewBOMProductId] = useState('');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [viewingBOM, setViewingBOM] = useState<string | null>(null);
  const [editingBOMProductId, setEditingBOMProductId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBOMs, setSelectedBOMs] = useState<Set<string>>(new Set());
  const [editingQuantities, setEditingQuantities] = useState<Map<string, { bomItemId: string; value: string }>>(new Map());

  // Fetch all products with BOMs (either with components or with versions)
  const { data: bomList, isLoading, refetch } = useQuery<BOMListItem[]>({
    queryKey: ['bomList', activeBranch?.branch_id],
    queryFn: async () => {
      if (!activeBranch) return [];

      // Fetch all BOM components for this branch
      const { data: boms, error: bomError } = await supabase
        .from('product_bom')
        .select('parent_product_id')
        .eq('branch_id', activeBranch.branch_id);

      if (bomError) {
        console.error('Error fetching BOMs:', bomError);
        throw bomError;
      }

      // Fetch all BOM versions for this branch (to include products with versions but no components yet)
      const { data: bomVersions, error: versionsError } = await supabase
        .from('bom_versions')
        .select('parent_product_id')
        .eq('branch_id', activeBranch.branch_id);

      if (versionsError) {
        console.error('Error fetching BOM versions:', versionsError);
        throw versionsError;
      }

      // Combine product IDs from both BOM components and versions
      const bomProductIds = new Set((boms || []).map((b: { parent_product_id: string }) => b.parent_product_id));
      const versionProductIds = new Set((bomVersions || []).map((v: { parent_product_id: string }) => v.parent_product_id));
      
      // Merge both sets to get all unique product IDs that have BOMs
      const uniqueParentIds = [...new Set([...bomProductIds, ...versionProductIds])];

      if (uniqueParentIds.length === 0) return [];

      // Fetch parent products
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id, name, sku')
        .in('id', uniqueParentIds)
        .eq('branch_id', activeBranch.branch_id);

      if (productsError) {
        console.error('Error fetching products:', productsError);
        throw productsError;
      }

      // For each product, calculate component count and buildable quantity
      const bomListItems: BOMListItem[] = await Promise.all(
        (products || []).map(async (product) => {
          // Fetch BOM versions for this product
          const { data: versions } = await supabase
            .from('bom_versions')
            .select('id, version_number, status')
            .eq('parent_product_id', product.id)
            .eq('branch_id', activeBranch.branch_id)
            .order('version_number', { ascending: false });

          // Fetch BOM components for this product (for active version or all if no versioning)
          const { data: bomItems } = await supabase
            .from('product_bom')
            .select('component_product_id, quantity_required, unit_of_measure, bom_version_id')
            .eq('parent_product_id', product.id)
            .eq('branch_id', activeBranch.branch_id);

          // Get active version ID
          const typedVersions = (versions || []) as Array<{ id: string; version_number: string; status: string }>;
          const activeVersion = typedVersions.find(v => v.status === 'active');
          const activeVersionId = activeVersion?.id || null;

          // Filter components by active version (or all if no versioning)
          const typedBomItems = (bomItems || []) as Array<{ 
            component_product_id: string; 
            quantity_required: number | string; 
            unit_of_measure: string | null;
            bom_version_id: string | null;
          }>;
          const activeBomItems = activeVersionId 
            ? typedBomItems.filter(item => item.bom_version_id === activeVersionId)
            : typedBomItems;

          // Fetch component product details for preview
          const componentIds = activeBomItems.map(item => item.component_product_id);
          const { data: componentProducts } = await supabase
            .from('products')
            .select('id, name, quantity_in_stock, purchase_price, unit_price')
            .in('id', componentIds)
            .eq('branch_id', activeBranch.branch_id);

          const componentMap = new Map(
            (componentProducts || []).map(c => [c.id, c])
          );

          // Calculate buildable quantity
          let buildableQuantity = Infinity;
          if (activeBomItems.length > 0) {
            buildableQuantity = Math.min(
              ...activeBomItems.map(item => {
                const component = componentMap.get(item.component_product_id);
                const stock = component?.quantity_in_stock || 0;
                const required = parseFloat(item.quantity_required?.toString() || '1');
                return required > 0 ? Math.floor(stock / required) : 0;
              })
            );
          }

          // Build component preview list with enhanced data
          const componentsPreview = activeBomItems.slice(0, 3).map(item => {
            const component = componentMap.get(item.component_product_id);
            const unitCost = component?.purchase_price || component?.unit_price || 0;
            return {
              name: component?.name || 'Unknown',
              quantity: parseFloat(item.quantity_required?.toString() || '0'),
              unit: item.unit_of_measure || 'unit',
              component_id: item.component_product_id,
              unit_cost: unitCost,
              current_stock: component?.quantity_in_stock || 0,
            };
          });

          // Build versions summary
          const versionsSummary = typedVersions.map(v => {
            const versionComponents = typedBomItems.filter(item => item.bom_version_id === v.id);
            return {
              version_number: v.version_number,
              status: v.status,
              component_count: versionComponents.length,
            };
          });

          return {
            id: product.id,
            parent_product_id: product.id,
            parent_product_name: product.name,
            parent_product_sku: product.sku,
            component_count: activeBomItems.length,
            buildable_quantity: buildableQuantity === Infinity ? 0 : buildableQuantity,
            created_at: new Date().toISOString(),
            versions: versionsSummary,
            components: componentsPreview,
          };
        })
      );

      return bomListItems;
    },
    enabled: !!activeBranch,
    staleTime: 30000,
  });

  // Fetch available products for creating new BOM
  const { data: availableProducts } = useQuery({
    queryKey: ['availableProductsForBOM', activeBranch?.branch_id],
    queryFn: async () => {
      if (!activeBranch) return [];

      const { data, error } = await supabase
        .from('products')
        .select('id, name, sku')
        .eq('branch_id', activeBranch.branch_id)
        .eq('is_variant', false)
        .order('name');

      if (error) {
        console.error('Error fetching products:', error);
        return [];
      }

      return data || [];
    },
    enabled: !!activeBranch,
  });

  const filteredBOMList = bomList?.filter((item) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        item.parent_product_name.toLowerCase().includes(query) ||
        (item.parent_product_sku && item.parent_product_sku.toLowerCase().includes(query));
      if (!matchesSearch) return false;
    }

    // Status filter
    if (statusFilter !== 'all') {
      const hasMatchingStatus = item.versions?.some(v => v.status === statusFilter);
      if (!hasMatchingStatus) return false;
    }

    return true;
  }) || [];

  const handleCreateBOM = () => {
    if (!newBOMProductId) {
      toast.error('Please select a product');
      return;
    }
    navigate(`/dashboard/products/${newBOMProductId}?tab=bom&create=true`);
    setIsCreateDialogOpen(false);
  };

  const handleDeleteBOM = async (productId: string) => {
    if (!confirm('Are you sure you want to delete the BOM for this product? This will remove all components and versions.')) {
      return;
    }

    if (!activeBranch) {
      toast.error('No active branch selected');
      return;
    }

    try {
      // Delete BOM components first (they reference bom_versions)
      const { error: bomError } = await supabase
        .from('product_bom')
        .delete()
        .eq('parent_product_id', productId)
        .eq('branch_id', activeBranch.branch_id);

      if (bomError) throw bomError;

      // Delete BOM versions
      const { error: versionsError } = await supabase
        .from('bom_versions')
        .delete()
        .eq('parent_product_id', productId)
        .eq('branch_id', activeBranch.branch_id);

      if (versionsError) throw versionsError;

      toast.success('BOM deleted successfully');
      refetch();
    } catch (error: any) {
      console.error('Error deleting BOM:', error);
      toast.error(`Failed to delete BOM: ${error.message}`);
    }
  };

  return (
    <>
      <SEO title="Bill of Materials | StockFlow" />
      <div className="h-full flex flex-col bg-white">
        {/* Header */}
        <div className="border-b px-6 py-4 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Bill of Materials</h1>
              <p className="text-sm text-gray-600 mt-1">
                Define what components are needed to build each product and track how many you can build
              </p>
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create BOM
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="border-b px-6 py-4 bg-gray-50">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by product name or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3" />
                <p className="text-gray-600">Loading BOMs...</p>
              </div>
            </div>
          ) : filteredBOMList.length === 0 ? (
            <Card className="p-12">
              <div className="text-center">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {searchQuery ? 'No BOMs found' : 'No Bill of Materials yet'}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {searchQuery
                    ? 'Try adjusting your search query'
                    : 'A Bill of Materials (BOM) lists all the components and quantities needed to build a finished product. Create your first BOM to get started.'}
                </p>
                {!searchQuery && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left max-w-md mx-auto">
                    <p className="text-sm text-blue-900 font-medium mb-2">What is a BOM?</p>
                    <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
                      <li>Lists all components needed to build a product</li>
                      <li>Shows how many units you can build with current stock</li>
                      <li>Helps plan production and identify shortages</li>
                    </ul>
                  </div>
                )}
                {!searchQuery && (
                  <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Create BOM
                  </Button>
                )}
              </div>
            </Card>
          ) : (
            <Card className="p-4">
              {/* Bulk Actions Toolbar */}
              {selectedBOMs.size > 0 && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-blue-900">
                      {selectedBOMs.size} BOM{selectedBOMs.size > 1 ? 's' : ''} selected
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        if (!confirm(`Are you sure you want to delete ${selectedBOMs.size} BOM(s)? This will remove all components and versions.`)) return;
                        if (!activeBranch) {
                          toast.error('No active branch selected');
                          return;
                        }
                        try {
                          for (const bomId of selectedBOMs) {
                            // Delete BOM components first
                            const { error: bomError } = await supabase
                              .from('product_bom')
                              .delete()
                              .eq('parent_product_id', bomId)
                              .eq('branch_id', activeBranch.branch_id);
                            
                            if (bomError) throw bomError;

                            // Delete BOM versions
                            const { error: versionsError } = await supabase
                              .from('bom_versions')
                              .delete()
                              .eq('parent_product_id', bomId)
                              .eq('branch_id', activeBranch.branch_id);
                            
                            if (versionsError) throw versionsError;
                          }
                          toast.success(`${selectedBOMs.size} BOM(s) deleted successfully`);
                          setSelectedBOMs(new Set());
                          refetch();
                        } catch (error: any) {
                          toast.error(`Failed to delete BOMs: ${error.message}`);
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Selected
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedBOMs(new Set())}
                    >
                      Clear Selection
                    </Button>
                  </div>
                </div>
              )}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedBOMs.size === filteredBOMList.length && filteredBOMList.length > 0}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedBOMs(new Set(filteredBOMList.map(item => item.id)));
                          } else {
                            setSelectedBOMs(new Set());
                          }
                        }}
                      />
                    </TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead className="text-right">Components</TableHead>
                    <TableHead className="text-right">Buildable Qty</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBOMList.map((item) => {
                    const isExpanded = expandedRows.has(item.id);
                    return (
                      <React.Fragment key={item.id}>
                        <TableRow className="cursor-pointer hover:bg-gray-50" onClick={(e) => {
                          // Don't toggle if clicking on interactive elements
                          const target = e.target as HTMLElement;
                          const isInteractive = 
                            target.closest('button') ||
                            target.closest('a') ||
                            target.closest('[role="button"]') ||
                            target.closest('input') ||
                            target.closest('label') ||
                            target.tagName === 'BUTTON' ||
                            target.tagName === 'A' ||
                            target.tagName === 'INPUT' ||
                            target.tagName === 'LABEL';
                          
                          if (isInteractive) {
                            return;
                          }
                          
                          const newExpanded = new Set(expandedRows);
                          if (isExpanded) {
                            newExpanded.delete(item.id);
                          } else {
                            newExpanded.add(item.id);
                          }
                          setExpandedRows(newExpanded);
                        }}>
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                              checked={selectedBOMs.has(item.id)}
                              onCheckedChange={(checked) => {
                                const newSelected = new Set(selectedBOMs);
                                if (checked) {
                                  newSelected.add(item.id);
                                } else {
                                  newSelected.delete(item.id);
                                }
                                setSelectedBOMs(newSelected);
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {isExpanded ? (
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                              )}
                              <div className="flex-1 min-w-0">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="font-medium truncate">{item.parent_product_name}</div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>{item.parent_product_name}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                {item.versions && item.versions.length > 0 && (
                                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                                    {item.versions.slice(0, 2).map((v, idx) => {
                                      const statusColors = {
                                        active: 'bg-green-100 text-green-800 border-green-300',
                                        draft: 'bg-yellow-100 text-yellow-800 border-yellow-300',
                                        archived: 'bg-gray-100 text-gray-800 border-gray-300',
                                      };
                                      const statusColor = statusColors[v.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800 border-gray-300';
                                      return (
                                        <TooltipProvider key={idx}>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <Badge 
                                                className={`text-xs border ${statusColor}`}
                                              >
                                                v{v.version_number}
                                              </Badge>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              <p>Version {v.version_number} - {v.status} ({v.component_count} components)</p>
                                            </TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>
                                      );
                                    })}
                                    {item.versions.length > 2 && (
                                      <span className="text-xs text-gray-500">
                                        +{item.versions.length - 2} more
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-mono text-sm text-gray-600">
                              {item.parent_product_sku || 'N/A'}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge variant="secondary">{item.component_count}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge
                              variant={
                                item.component_count === 0 
                                  ? 'secondary'
                                  : item.buildable_quantity === 0 
                                    ? 'destructive'
                                    : item.buildable_quantity < 5
                                      ? 'destructive'
                                      : 'default'
                              }
                            >
                              {item.buildable_quantity.toLocaleString()}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-2">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteBOM(item.id);
                                      }}
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Delete BOM</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </TableCell>
                        </TableRow>
                        {isExpanded && (
                          <TableRow>
                            <TableCell 
                              colSpan={6} 
                              className="bg-gray-50 p-4" 
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                              }}
                              onMouseDown={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              <div className="space-y-4">
                                {/* Components Preview */}
                                {item.components && item.components.length > 0 ? (
                                  <div>
                                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                                      Components {item.component_count > item.components.length && `(${item.components.length} of ${item.component_count} shown)`}
                                    </h4>
                                    <div className="bg-white border rounded-lg p-3">
                                      <div className="space-y-2">
                                        {item.components.map((comp, idx) => {
                                          const editingKey = `${item.id}-${comp.component_id || idx}`;
                                          const isEditing = editingQuantities.has(editingKey);
                                          const editValue = editingQuantities.get(editingKey)?.value || comp.quantity.toString();
                                          
                                          return (
                                            <div key={idx} className="flex items-center justify-between text-sm hover:bg-gray-50 p-2 rounded group">
                                              <div className="flex-1 min-w-0">
                                                <span className="text-gray-900 font-medium">{comp.name}</span>
                                                <div className="flex items-center gap-4 mt-1 text-xs text-gray-600">
                                                  {comp.unit_cost !== undefined && comp.unit_cost > 0 && (
                                                    <span>Unit Cost: ${comp.unit_cost.toFixed(2)}</span>
                                                  )}
                                                  {comp.current_stock !== undefined && (
                                                    <span>Stock: {comp.current_stock.toLocaleString()}</span>
                                                  )}
                                                </div>
                                              </div>
                                              <div className="flex items-center gap-2">
                                                {isEditing ? (
                                                  <>
                                                    <Input
                                                      type="number"
                                                      min="0.001"
                                                      step="0.001"
                                                      value={editValue}
                                                      onChange={(e) => {
                                                        const newMap = new Map(editingQuantities);
                                                        newMap.set(editingKey, { bomItemId: comp.component_id || '', value: e.target.value });
                                                        setEditingQuantities(newMap);
                                                      }}
                                                      onBlur={async () => {
                                                        const value = parseFloat(editValue);
                                                        if (value > 0 && comp.component_id && activeBranch) {
                                                          try {
                                                            // First find the BOM item ID
                                                            const { data: bomItems, error: findError } = await supabase
                                                              .from('product_bom')
                                                              .select('id')
                                                              .eq('component_product_id', comp.component_id)
                                                              .eq('parent_product_id', item.id)
                                                              .eq('branch_id', activeBranch.branch_id)
                                                              .limit(1)
                                                              .maybeSingle() as { data: { id: string } | null; error: any };
                                                            
                                                            if (findError) {
                                                              throw findError;
                                                            }
                                                            
                                                            if (!bomItems || !bomItems.id) {
                                                              throw new Error('BOM item not found');
                                                            }
                                                            
                                                            const { error: updateError } = await (supabase
                                                              .from('product_bom') as any)
                                                              .update({ quantity_required: value })
                                                              .eq('id', bomItems.id);
                                                            
                                                            if (updateError) throw updateError;
                                                            
                                                            toast.success('Quantity updated');
                                                            refetch();
                                                          } catch (error: any) {
                                                            toast.error(`Failed to update: ${error.message}`);
                                                          }
                                                        }
                                                        const newMap = new Map(editingQuantities);
                                                        newMap.delete(editingKey);
                                                        setEditingQuantities(newMap);
                                                      }}
                                                      onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                          e.currentTarget.blur();
                                                        }
                                                        if (e.key === 'Escape') {
                                                          const newMap = new Map(editingQuantities);
                                                          newMap.delete(editingKey);
                                                          setEditingQuantities(newMap);
                                                        }
                                                      }}
                                                      className="w-20 h-7 text-sm"
                                                      autoFocus
                                                      onClick={(e) => e.stopPropagation()}
                                                    />
                                                    <span className="text-gray-600 text-xs">{comp.unit}</span>
                                                  </>
                                                ) : (
                                                  <>
                                                    <span className="text-gray-600 font-mono">
                                                      {comp.quantity} {comp.unit}
                                                    </span>
                                                    <Button
                                                      variant="ghost"
                                                      size="sm"
                                                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        const newMap = new Map(editingQuantities);
                                                        newMap.set(editingKey, { bomItemId: comp.component_id || '', value: comp.quantity.toString() });
                                                        setEditingQuantities(newMap);
                                                      }}
                                                    >
                                                      <Edit className="w-3 h-3" />
                                                    </Button>
                                                  </>
                                                )}
                                              </div>
                                            </div>
                                          );
                                        })}
                                        {item.component_count > item.components.length && (
                                          <div className="text-xs text-gray-500 pt-2 border-t">
                                            +{item.component_count - item.components.length} more components
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                    <p className="text-sm text-yellow-800 mb-3">
                                      No components defined yet.
                                    </p>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingBOMProductId(item.id);
                                      }}
                                    >
                                      <Plus className="w-4 h-4 mr-2" />
                                      Add Components
                                    </Button>
                                  </div>
                                )}

                                {/* Buildable Quantity Info */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                  <p className="text-sm text-blue-900">
                                    <strong>Buildable Qty:</strong> You can build <strong>{item.buildable_quantity}</strong> units of this product with current component stock.
                                    {item.buildable_quantity === 0 && item.component_count > 0 && (
                                      <span className="block mt-1 text-blue-800">
                                        Check component stock levels to identify shortages.
                                      </span>
                                    )}
                                  </p>
                                </div>

                                {/* Quick Actions */}
                                <div 
                                  className="flex items-center gap-2 pt-2 border-t"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                  }}
                                  onMouseDown={(e) => {
                                    e.stopPropagation();
                                  }}
                                >
                                  <Button
                                    type="button"
                                    variant="default"
                                    size="sm"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      setEditingBOMProductId(item.id);
                                    }}
                                    onMouseDown={(e) => {
                                      e.stopPropagation();
                                      e.preventDefault();
                                    }}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                                  >
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit BOM Components
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      // Use a small timeout to ensure event propagation is fully stopped
                                      setTimeout(() => {
                                        navigate(`/dashboard/products/${item.id}`);
                                      }, 0);
                                    }}
                                    onMouseDown={(e) => {
                                      e.stopPropagation();
                                      e.preventDefault();
                                    }}
                                  >
                                    View Product Details
                                  </Button>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            </Card>
          )}
        </div>

        {/* Create BOM Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Bill of Materials</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Select Product</Label>
                <Select value={newBOMProductId} onValueChange={setNewBOMProductId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a product to create BOM for" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableProducts?.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} {product.sku && `(${product.sku})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-2">
                  You'll be taken to the product detail page to add components
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateBOM} disabled={!newBOMProductId}>
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* BOM Editing Modal */}
        <Dialog 
          open={editingBOMProductId !== null} 
          onOpenChange={(open) => {
            if (!open) {
              setEditingBOMProductId(null);
              // Refetch BOM list to show updated data
              refetch();
            }
          }}
        >
          <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle>
                {editingBOMProductId && bomList?.find(p => p.id === editingBOMProductId)?.parent_product_name 
                  ? `Edit BOM: ${bomList.find(p => p.id === editingBOMProductId)?.parent_product_name}`
                  : 'Edit Bill of Materials'}
              </DialogTitle>
            </DialogHeader>
            {editingBOMProductId && (
              <div className="flex-1 overflow-y-auto mt-4 pr-2">
                <BillOfMaterials 
                  productId={editingBOMProductId}
                  onVersionChange={() => {
                    // Refetch when version changes
                    refetch();
                  }}
                />
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

