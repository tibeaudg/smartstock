import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useBranches } from '@/hooks/useBranches';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useParams, Link, Outlet, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

// UI Components
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

// Icons
import { 
  Plus, Edit, Trash2, Package, Search, ArrowRight, ChevronLeft,
  Eye, Filter, DollarSign, X
} from 'lucide-react';

// Custom Components
import { BillOfMaterials } from '@/components/product/BillOfMaterials';
import SEO from '@/components/SEO';

// Types
interface BOMComponent {
  id: string;
  name: string;
  sku: string | null;
  quantity: number;
  unit: string;
  component_id: string;
  unit_cost: number;
  current_stock: number;
  scrap_factor: number;
  production_step: string | null;
  has_bom: boolean;
  buildable_qty: number;
}

interface BOMVersion {
  id: string;
  version_number: string;
  status: string;
  component_count: number;
  total_cost: number;
  created_at: string;
}

interface BOMListItem {
  id: string;
  parent_product_id: string;
  parent_product_name: string;
  parent_product_sku: string | null;
  component_count: number;
  buildable_quantity: number;
  total_estimated_cost: number;
  created_at: string;
  versions: BOMVersion[];
  components: BOMComponent[];
}

interface WhereUsedItem {
  parent_product_id: string;
  parent_product_name: string;
  parent_product_sku: string | null;
  quantity_required: number;
  total_parents_buildable: number;
}

// Main BOM List Page Component
export default function BillOfMaterialsPage() {
  const { activeBranch } = useBranches();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we're in edit mode (on the edit page)
  const isEditPage = location.pathname.includes('/bom/edit/');

  // If we're on edit page, render the edit component
  if (isEditPage) {
    return <BOMEditPage />;
  }

  // Otherwise render the list page
  return <BOMListPage />;
}

// BOM List Page
function BOMListPage() {
  const { activeBranch } = useBranches();
  const { user } = useAuth();
  const navigate = useNavigate();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBOMs, setSelectedBOMs] = useState<Set<string>>(new Set());
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newBOMProductId, setNewBOMProductId] = useState('');
  const [selectedComponentForWhereUsed, setSelectedComponentForWhereUsed] = useState<string | null>(null);
  const [bulkReplaceDialog, setBulkReplaceDialog] = useState<{ from: string; to: string } | null>(null);

  // Fetch BOM list with enhanced data
  const { data: bomList, isLoading, refetch } = useQuery<BOMListItem[]>({
    queryKey: ['bomList', activeBranch?.branch_id],
    queryFn: async () => {
      if (!activeBranch) return [];

      // Fetch all products with BOMs
      const { data: boms, error: bomError } = await supabase
        .from('product_bom')
        .select('parent_product_id')
        .eq('branch_id', activeBranch.branch_id);

      if (bomError) throw bomError;

      const { data: bomVersions, error: versionsError } = await supabase
        .from('bom_versions')
        .select('parent_product_id')
        .eq('branch_id', activeBranch.branch_id);

      if (versionsError) throw versionsError;

      const bomProductIds = new Set((boms || []).map(b => b.parent_product_id));
      const versionProductIds = new Set((bomVersions || []).map(v => v.parent_product_id));
      const uniqueParentIds = [...new Set([...bomProductIds, ...versionProductIds])];

      if (uniqueParentIds.length === 0) return [];

      // Fetch parent products
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id, name, sku')
        .in('id', uniqueParentIds)
        .eq('branch_id', activeBranch.branch_id);

      if (productsError) throw productsError;

      // Build enhanced BOM list
      const bomListItems: BOMListItem[] = await Promise.all(
        (products || []).map(async (product) => {
          // Fetch versions
          const { data: versions } = await supabase
            .from('bom_versions')
            .select('id, version_number, status, created_at')
            .eq('parent_product_id', product.id)
            .eq('branch_id', activeBranch.branch_id)
            .order('version_number', { ascending: false });

          const typedVersions = (versions || []) as Array<{ id: string; version_number: string; status: string; created_at: string }>;
          const activeVersion = typedVersions.find(v => v.status === 'active');

          // Fetch BOM components
          const { data: bomItems } = await supabase
            .from('product_bom')
            .select(`
              id,
              component_product_id,
              quantity_required,
              unit_of_measure,
              scrap_factor,
              production_step,
              bom_version_id
            `)
            .eq('parent_product_id', product.id)
            .eq('branch_id', activeBranch.branch_id);

          const typedBomItems = (bomItems || []) as Array<{
            id: string;
            component_product_id: string;
            quantity_required: number | string;
            unit_of_measure: string | null;
            scrap_factor: number | null;
            production_step: string | null;
            bom_version_id: string | null;
          }>;

          // Filter by active version
          const activeBomItems = activeVersion
            ? typedBomItems.filter(item => item.bom_version_id === activeVersion.id)
            : typedBomItems;

          // Fetch component details
          const componentIds = activeBomItems.map(item => item.component_product_id);
          const { data: componentProducts } = await supabase
            .from('products')
            .select('id, name, sku, quantity_in_stock, purchase_price, unit_price')
            .in('id', componentIds)
            .eq('branch_id', activeBranch.branch_id);

          const componentMap = new Map((componentProducts || []).map(c => [c.id, c]));

          // Check which components have BOMs
          const { data: componentBOMs } = await supabase
            .from('product_bom')
            .select('parent_product_id')
            .in('parent_product_id', componentIds)
            .eq('branch_id', activeBranch.branch_id);

          const componentsBOMSet = new Set((componentBOMs || []).map(cb => cb.parent_product_id));

          // Calculate buildable quantity with scrap factor
          let buildableQuantity = Infinity;
          let totalEstimatedCost = 0;

          const componentsData: BOMComponent[] = activeBomItems.map(item => {
            const component = componentMap.get(item.component_product_id);
            const stock = component?.quantity_in_stock || 0;
            const baseQuantity = parseFloat(item.quantity_required?.toString() || '1');
            const scrapFactor = item.scrap_factor || 0;
            const effectiveQuantity = baseQuantity * (1 + scrapFactor / 100);
            const unitCost = component?.purchase_price || component?.unit_price || 0;

            // Calculate buildable for this component
            const componentBuildable = effectiveQuantity > 0 
              ? Math.floor(stock / effectiveQuantity) 
              : 0;

            buildableQuantity = Math.min(buildableQuantity, componentBuildable);
            totalEstimatedCost += unitCost * effectiveQuantity;

            return {
              id: item.id,
              name: component?.name || 'Unknown',
              sku: component?.sku || null,
              quantity: baseQuantity,
              unit: item.unit_of_measure || 'unit',
              component_id: item.component_product_id,
              unit_cost: unitCost,
              current_stock: stock,
              scrap_factor: scrapFactor,
              production_step: item.production_step,
              has_bom: componentsBOMSet.has(item.component_product_id),
              buildable_qty: componentBuildable,
            };
          });

          // Build versions summary with cost calculation
          const versionsSummary: BOMVersion[] = await Promise.all(
            typedVersions.map(async (v) => {
              const versionComponents = typedBomItems.filter(item => item.bom_version_id === v.id);
              
              // Calculate total cost for this version
              let versionCost = 0;
              for (const item of versionComponents) {
                const component = componentMap.get(item.component_product_id);
                const unitCost = component?.purchase_price || component?.unit_price || 0;
                const baseQty = parseFloat(item.quantity_required?.toString() || '1');
                const scrap = item.scrap_factor || 0;
                versionCost += unitCost * baseQty * (1 + scrap / 100);
              }

              return {
                id: v.id,
                version_number: v.version_number,
                status: v.status,
                component_count: versionComponents.length,
                total_cost: versionCost,
                created_at: v.created_at,
              };
            })
          );

          return {
            id: product.id,
            parent_product_id: product.id,
            parent_product_name: product.name,
            parent_product_sku: product.sku,
            component_count: activeBomItems.length,
            buildable_quantity: buildableQuantity === Infinity ? 0 : buildableQuantity,
            total_estimated_cost: totalEstimatedCost,
            created_at: new Date().toISOString(),
            versions: versionsSummary,
            components: componentsData,
          };
        })
      );

      return bomListItems;
    },
    enabled: !!activeBranch,
    refetchOnWindowFocus: true,
    staleTime: 30000,
  });

  // Fetch available products for BOM creation
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

      if (error) return [];
      return data || [];
    },
    enabled: !!activeBranch,
  });

  // Fetch where-used data for selected component
  const { data: whereUsedData } = useQuery<WhereUsedItem[]>({
    queryKey: ['whereUsed', selectedComponentForWhereUsed, activeBranch?.branch_id],
    queryFn: async () => {
      if (!selectedComponentForWhereUsed || !activeBranch) return [];

      const { data: bomItems } = await supabase
        .from('product_bom')
        .select(`
          parent_product_id,
          quantity_required,
          scrap_factor
        `)
        .eq('component_product_id', selectedComponentForWhereUsed)
        .eq('branch_id', activeBranch.branch_id);

      if (!bomItems) return [];

      const parentIds = [...new Set(bomItems.map(item => item.parent_product_id))];

      const { data: parentProducts } = await supabase
        .from('products')
        .select('id, name, sku')
        .in('id', parentIds)
        .eq('branch_id', activeBranch.branch_id);

      const parentMap = new Map((parentProducts || []).map(p => [p.id, p]));

      return bomItems.map(item => {
        const parent = parentMap.get(item.parent_product_id);
        const bomItem = bomList?.find(b => b.id === item.parent_product_id);
        
        return {
          parent_product_id: item.parent_product_id,
          parent_product_name: parent?.name || 'Unknown',
          parent_product_sku: parent?.sku || null,
          quantity_required: parseFloat(item.quantity_required?.toString() || '1') * (1 + (item.scrap_factor || 0) / 100),
          total_parents_buildable: bomItem?.buildable_quantity || 0,
        };
      });
    },
    enabled: !!selectedComponentForWhereUsed && !!activeBranch,
  });

  // Filtered list
  const filteredBOMList = useMemo(() => {
    return (bomList || []).filter(item => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          item.parent_product_name.toLowerCase().includes(query) ||
          (item.parent_product_sku && item.parent_product_sku.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      if (statusFilter !== 'all') {
        const hasMatchingStatus = item.versions?.some(v => v.status === statusFilter);
        if (!hasMatchingStatus) return false;
      }

      return true;
    });
  }, [bomList, searchQuery, statusFilter]);

  // Handlers
  const handleCreateBOM = () => {
    if (!newBOMProductId) {
      toast.error('Please select a product');
      return;
    }
    // Navigate to the edit page for the new BOM
    navigate(`/dashboard/bom/edit/${newBOMProductId}?create=true`);
    setIsCreateDialogOpen(false);
  };

  const handleDeleteBOM = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this BOM? All components and versions will be removed.')) {
      return;
    }

    if (!activeBranch) {
      toast.error('No active branch selected');
      return;
    }

    try {
      const { error: bomError } = await supabase
        .from('product_bom')
        .delete()
        .eq('parent_product_id', productId)
        .eq('branch_id', activeBranch.branch_id);

      if (bomError) throw bomError;

      const { error: versionsError } = await supabase
        .from('bom_versions')
        .delete()
        .eq('parent_product_id', productId)
        .eq('branch_id', activeBranch.branch_id);

      if (versionsError) throw versionsError;

      toast.success('BOM deleted successfully');
      refetch();
    } catch (error: any) {
      toast.error(`Failed to delete BOM: ${error.message}`);
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedBOMs.size} BOM(s)? This will remove all components and versions.`)) return;
    
    if (!activeBranch) {
      toast.error('No active branch selected');
      return;
    }

    try {
      for (const bomId of selectedBOMs) {
        await supabase.from('product_bom').delete().eq('parent_product_id', bomId).eq('branch_id', activeBranch.branch_id);
        await supabase.from('bom_versions').delete().eq('parent_product_id', bomId).eq('branch_id', activeBranch.branch_id);
      }
      toast.success(`${selectedBOMs.size} BOM(s) deleted`);
      setSelectedBOMs(new Set());
      refetch();
    } catch (error: any) {
      toast.error(`Failed to delete BOMs: ${error.message}`);
    }
  };

  const toggleSelectAll = () => {
    if (selectedBOMs.size === filteredBOMList.length && filteredBOMList.length > 0) {
      setSelectedBOMs(new Set());
    } else {
      setSelectedBOMs(new Set(filteredBOMList.map(item => item.id)));
    }
  };

  // Render
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
                Manage product recipes, track component costs, and calculate build capacity
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
                    : 'Create your first BOM to define product recipes and track production capacity'}
                </p>
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
              {/* Bulk Actions */}
              {selectedBOMs.size > 0 && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-900">
                    {selectedBOMs.size} selected
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleBulkDelete}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedBOMs(new Set())}>
                      Clear
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
                        onCheckedChange={toggleSelectAll} 
                      />
                    </TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead className="text-right">Components</TableHead>
                    <TableHead className="text-right">Est. Cost</TableHead>
                    <TableHead className="text-right">Buildable</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBOMList.map((item) => (
                    <BOMRow
                      key={item.id}
                      item={item}
                      isSelected={selectedBOMs.has(item.id)}
                      onToggleSelect={(checked) => {
                        const newSelected = new Set(selectedBOMs);
                        if (checked) newSelected.add(item.id);
                        else newSelected.delete(item.id);
                        setSelectedBOMs(newSelected);
                      }}
                      onDelete={() => handleDeleteBOM(item.id)}
                      onEdit={() => navigate(`/dashboard/bom/edit/${item.id}`)}
                      onViewProduct={() => navigate(`/dashboard/products/${item.id}`)}
                      onViewWhereUsed={(componentId) => setSelectedComponentForWhereUsed(componentId)}
                    />
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </div>

        {/* Dialogs */}
        <CreateBOMDialog
          isOpen={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
          availableProducts={availableProducts || []}
          selectedProductId={newBOMProductId}
          onSelectProduct={setNewBOMProductId}
          onConfirm={handleCreateBOM}
        />

        <WhereUsedDialog
          isOpen={selectedComponentForWhereUsed !== null}
          onClose={() => setSelectedComponentForWhereUsed(null)}
          componentId={selectedComponentForWhereUsed}
          whereUsedData={whereUsedData || []}
        />

        <BulkReplaceDialog
          isOpen={bulkReplaceDialog !== null}
          onClose={() => setBulkReplaceDialog(null)}
          onConfirm={() => {}}
          fromComponentId={bulkReplaceDialog?.from}
          toComponentId={bulkReplaceDialog?.to}
        />
      </div>
    </>
  );
}

// BOM Edit Page Component
function BOMEditPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const isCreateMode = new URLSearchParams(location.search).get('create') === 'true';

  // Fetch product details
  const { data: product, isLoading } = useQuery({
    queryKey: ['productForBOM', productId],
    queryFn: async () => {
      if (!productId) return null;
      
      const { data, error } = await supabase
        .from('products')
        .select('id, name, sku')
        .eq('id', productId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!productId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <>
      <SEO title={`${isCreateMode ? 'Create' : 'Edit'} BOM: ${product?.name || 'Loading...'} | StockFlow`} />
      
      <div className="h-full flex flex-col bg-white">
        {/* Header with back button */}
        <div className="border-b px-6 py-4 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard/bom')}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to BOM List
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {isCreateMode ? 'Create BOM' : `Edit BOM: ${product?.name || 'Loading...'}`}
                </h1>
                {product?.sku && (
                  <p className="text-sm text-gray-600 mt-1">
                    SKU: {product.sku}
                  </p>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard/bom')}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* BOM Editor Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {productId ? (
            <div className="max-w-7xl mx-auto">
              <BillOfMaterials 
                productId={productId} 
                onVersionChange={() => {}} 
                isCreateMode={isCreateMode}
              />
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No product selected</p>
              <Button 
                onClick={() => navigate('/dashboard/bom')}
                className="mt-4"
              >
                Back to BOM List
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// BOM Row Component
interface BOMRowProps {
  item: BOMListItem;
  isSelected: boolean;
  onToggleSelect: (checked: boolean) => void;
  onDelete: () => void;
  onEdit: () => void;
  onViewProduct: () => void;
  onViewWhereUsed: (componentId: string) => void;
}

function BOMRow({ item, isSelected, onToggleSelect, onDelete, onEdit, onViewProduct, onViewWhereUsed }: BOMRowProps) {
  return (
    <TableRow>
      <TableCell onClick={(e) => e.stopPropagation()}>
        <Checkbox checked={isSelected} onCheckedChange={onToggleSelect} />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div>
            <div className="font-medium">{item.parent_product_name}</div>
            {item.versions.length > 0 && (
              <div className="flex gap-2 mt-1">
                {item.versions.slice(0, 2).map((v) => (
                  <Badge key={v.id} variant={v.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                    v{v.version_number} • {v.status}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <span className="font-mono text-sm text-gray-600">{item.parent_product_sku || 'N/A'}</span>
      </TableCell>
      <TableCell className="text-right">
        <Badge variant="secondary">{item.component_count}</Badge>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-1">
          <DollarSign className="w-3 h-3 text-gray-400" />
          <span className="font-semibold text-gray-900">{item.total_estimated_cost.toFixed(2)}</span>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <Badge variant={item.buildable_quantity === 0 ? 'destructive' : item.buildable_quantity < 5 ? 'default' : 'default'}>
          {item.buildable_quantity.toLocaleString()}
        </Badge>
      </TableCell>
      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-end gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={onViewProduct}>
                  <Eye className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>View Product</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Button variant="default" size="sm" onClick={onEdit}>
            <Edit className="w-4 h-4" />
          </Button>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={onDelete} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete BOM</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </TableCell>
    </TableRow>
  );
}

// Dialog Components (unchanged from your original)
function CreateBOMDialog({ isOpen, onClose, availableProducts, selectedProductId, onSelectProduct, onConfirm }: any) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Bill of Materials</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label>Select Product</Label>
            <Select value={selectedProductId} onValueChange={onSelectProduct}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a product" />
              </SelectTrigger>
              <SelectContent>
                {availableProducts.map((product: any) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name} {product.sku && `(${product.sku})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={onConfirm} disabled={!selectedProductId}>
            Continue <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function WhereUsedDialog({ isOpen, onClose, componentId, whereUsedData }: any) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Where Used Report</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {whereUsedData.length === 0 ? (
            <p className="text-sm text-gray-600">This component is not used in any BOMs</p>
          ) : (
            <div className="space-y-2">
              {whereUsedData.map((item: WhereUsedItem) => (
                <div key={item.parent_product_id} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{item.parent_product_name}</p>
                      <p className="text-xs text-gray-600">{item.parent_product_sku || 'No SKU'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">Qty Required: <span className="font-semibold">{item.quantity_required}</span></p>
                      <p className="text-xs text-gray-600">Can Build: {item.total_parents_buildable}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function BulkReplaceDialog({ isOpen, onClose, onConfirm, fromComponentId, toComponentId }: any) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bulk Replace Component</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-sm text-gray-600">
            Replace component across all BOMs. This action cannot be undone.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={onConfirm} variant="destructive">
            Replace All
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}