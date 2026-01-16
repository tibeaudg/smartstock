import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useBranches } from '@/hooks/useBranches';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { AddProductModal } from '@/components/AddProductModal';

// UI Components
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

// Icons
import { 
  Plus, Edit, Trash2, Package, Search, ArrowRight, ChevronLeft,
  Eye, Filter, DollarSign, X, AlertCircle, Loader2, Save,
  ChevronRight, ArrowUpDown, Download
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

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

interface Product {
  id: string;
  name: string;
  sku: string | null;
}

interface BOMComponentFormData {
  component_product_id: string;
  quantity_required: number;
  unit_of_measure: string;
  scrap_factor: number;
  production_step: string;
}

interface NewProductFormData {
  name: string;
  sku: string;
  quantity_in_stock: number;
  unit_price: number;
}

// Main BOM List Page Component
export default function BillOfMaterials() {
  const location = useLocation();
  const isEditPage = location.pathname.includes('/bom/edit/');

  if (isEditPage) {
    return <BOMEditPage />;
  }

  return <BOMListPage />;
}

// Go to page input component
const GoToPageInput: React.FC<{ totalPages: number; onPageChange: (page: number) => void }> = ({ totalPages, onPageChange }) => {
  const [pageInput, setPageInput] = useState('');

  const handleGo = () => {
    const page = parseInt(pageInput);
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
      setPageInput('');
    }
  };

  return (
    <>
      <Input
        type="number"
        min={1}
        max={totalPages}
        className="w-16 h-8"
        value={pageInput}
        onChange={(e) => setPageInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleGo();
          }
        }}
        placeholder="Page"
      />
      <Button
        variant="outline"
        size="sm"
        onClick={handleGo}
      >
        Go
      </Button>
    </>
  );
};

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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch BOM list with enhanced data
  const { data: bomList, isLoading, refetch, error } = useQuery<BOMListItem[]>({
    queryKey: ['bomList', activeBranch?.branch_id],
    queryFn: async () => {
      if (!activeBranch) return [];

      try {
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
            try {
              // Fetch versions
              const { data: versions } = await supabase
                .from('bom_versions')
                .select('id, version_number, status, created_at')
                .eq('parent_product_id', product.id)
                .eq('branch_id', activeBranch.branch_id)
                .order('version_number', { ascending: false });

              const typedVersions = (versions || []) as Array<{ 
                id: string; 
                version_number: string; 
                status: string; 
                created_at: string;
              }>;
              
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

              if (activeBomItems.length === 0) {
                return {
                  id: product.id,
                  parent_product_id: product.id,
                  parent_product_name: product.name,
                  parent_product_sku: product.sku,
                  component_count: 0,
                  buildable_quantity: 0,
                  total_estimated_cost: 0,
                  created_at: new Date().toISOString(),
                  versions: typedVersions.map(v => ({
                    id: v.id,
                    version_number: v.version_number,
                    status: v.status,
                    component_count: 0,
                    total_cost: 0,
                    created_at: v.created_at,
                  })),
                  components: [],
                };
              }

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
            } catch (error) {
              console.error(`Error processing BOM for product ${product.id}:`, error);
              // Return minimal data on error
              return {
                id: product.id,
                parent_product_id: product.id,
                parent_product_name: product.name,
                parent_product_sku: product.sku,
                component_count: 0,
                buildable_quantity: 0,
                total_estimated_cost: 0,
                created_at: new Date().toISOString(),
                versions: [],
                components: [],
              };
            }
          })
        );

        return bomListItems;
      } catch (error) {
        console.error('Error fetching BOM list:', error);
        throw error;
      }
    },
    enabled: !!activeBranch,
    refetchOnWindowFocus: false,
    staleTime: 30000,
    retry: 2,
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

      if (error) {
        console.error('Error fetching products:', error);
        return [];
      }
      return data || [];
    },
    enabled: !!activeBranch,
  });

  // Fetch where-used data for selected component
  const { data: whereUsedData } = useQuery<WhereUsedItem[]>({
    queryKey: ['whereUsed', selectedComponentForWhereUsed, activeBranch?.branch_id],
    queryFn: async () => {
      if (!selectedComponentForWhereUsed || !activeBranch) return [];

      try {
        const { data: bomItems } = await supabase
          .from('product_bom')
          .select(`
            parent_product_id,
            quantity_required,
            scrap_factor
          `)
          .eq('component_product_id', selectedComponentForWhereUsed)
          .eq('branch_id', activeBranch.branch_id);

        if (!bomItems || bomItems.length === 0) return [];

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
      } catch (error) {
        console.error('Error fetching where-used data:', error);
        return [];
      }
    },
    enabled: !!selectedComponentForWhereUsed && !!activeBranch,
  });

  // Filtered list
  const filteredBOMList = useMemo(() => {
    if (!bomList) return [];
    
    return bomList.filter(item => {
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

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredBOMList.length / itemsPerPage));
  const paginatedBOMList = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredBOMList.slice(start, end);
  }, [filteredBOMList, currentPage, itemsPerPage]);

  // Handlers
  const handleCreateBOM = () => {
    if (!newBOMProductId) {
      toast.error('Please select a product');
      return;
    }
    navigate(`/dashboard/bom/edit/${newBOMProductId}?create=true`);
    setIsCreateDialogOpen(false);
    setNewBOMProductId('');
  };

  const handleExport = () => {
    try {
      const exportData = filteredBOMList.map(item => ({
        'Product Name': item.parent_product_name,
        'SKU': item.parent_product_sku || 'N/A',
        'Components': item.component_count,
        'Estimated Cost': item.total_estimated_cost.toFixed(2),
        'Buildable Quantity': item.buildable_quantity,
        'Versions': item.versions.length,
        'Active Version': item.versions.find(v => v.status === 'active')?.version_number || 'N/A',
        'Created': new Date(item.created_at).toLocaleDateString(),
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Bill of Materials');
      XLSX.writeFile(wb, `bom-list-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
      
      toast.success('Export completed successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data');
    }
  };

  const handleDeleteBOM = async (productId: string) => {
    if (!window.confirm('Are you sure you want to delete this BOM? All components and versions will be removed.')) {
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
      console.error('Error deleting BOM:', error);
      toast.error(`Failed to delete BOM: ${error.message}`);
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selectedBOMs.size} BOM(s)? This will remove all components and versions.`)) {
      return;
    }
    
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
      console.error('Error deleting BOMs:', error);
      toast.error(`Failed to delete BOMs: ${error.message}`);
    }
  };

  const toggleSelectAll = () => {
    if (selectedBOMs.size === paginatedBOMList.length && paginatedBOMList.length > 0) {
      setSelectedBOMs(new Set());
    } else {
      setSelectedBOMs(new Set(paginatedBOMList.map(item => item.id)));
    }
  };

  // Error state
  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading BOMs</h3>
            <p className="text-sm text-gray-600 mb-4">
              {error instanceof Error ? error.message : 'An unexpected error occurred'}
            </p>
            <Button onClick={() => refetch()}>
              Try Again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Render
  return (
    <div className="space-y-6 p-4 sm:p-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bill of Materials</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage product recipes, track component costs, and calculate build capacity
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-blue-600 text-white hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" /> Add BOM
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
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
              <SelectValue placeholder="All Status" />
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

      {/* Content */}
      <div>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-3" />
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
          <Card>
            {/* Bulk Actions */}
            {selectedBOMs.size > 0 && (
              <div className="p-3 bg-blue-50 border-b border-blue-200 flex items-center justify-between">
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
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={selectedBOMs.size === paginatedBOMList.length && paginatedBOMList.length > 0} 
                      onCheckedChange={toggleSelectAll} 
                    />
                  </TableHead>
                  <TableHead className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</TableHead>
                  <TableHead className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</TableHead>
                  <TableHead className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Components</TableHead>
                  <TableHead className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Est. Cost</TableHead>
                  <TableHead className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Buildable</TableHead>
                  <TableHead className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedBOMList.map((item) => (
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

        {/* Pagination */}
        {filteredBOMList.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Showing per page</span>
              <Select value={itemsPerPage.toString()} onValueChange={(v) => {
                setItemsPerPage(Number(v));
                setCurrentPage(1);
              }}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">Show 10</SelectItem>
                  <SelectItem value="25">Show 25</SelectItem>
                  <SelectItem value="50">Show 50</SelectItem>
                  <SelectItem value="100">Show 100</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredBOMList.length)} of {filteredBOMList.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Prev
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  if (totalPages > 5 && i === 4 && pageNum < totalPages - 1) {
                    return (
                      <React.Fragment key={pageNum}>
                        <span className="px-2">...</span>
                        <Button
                          variant={currentPage === totalPages ? "default" : "outline"}
                          size="sm"
                          className="w-8 h-8 p-0"
                          onClick={() => setCurrentPage(totalPages)}
                        >
                          {totalPages}
                        </Button>
                      </React.Fragment>
                    );
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      className="w-8 h-8 p-0"
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Go to page</span>
              <GoToPageInput
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <CreateBOMDialog
        isOpen={isCreateDialogOpen}
        onClose={() => {
          setIsCreateDialogOpen(false);
          setNewBOMProductId('');
        }}
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
    </div>
  );
}

// BOM Edit Page Component
function BOMEditPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { activeBranch } = useBranches();
  const queryClient = useQueryClient();
  const isCreateMode = new URLSearchParams(location.search).get('create') === 'true';

  // State for BOM components
  const [components, setComponents] = useState<BOMComponentFormData[]>([]);
  const [versionNumber, setVersionNumber] = useState('1.0');
  const [isSaving, setIsSaving] = useState(false);
  
  // State for inline product creation
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [componentIndexForNewProduct, setComponentIndexForNewProduct] = useState<number | null>(null);

  // Fetch product details
  const { data: product, isLoading: isProductLoading, error: productError } = useQuery({
    queryKey: ['productForBOM', productId],
    queryFn: async () => {
      if (!productId || !activeBranch) return null;
      
      const { data, error } = await supabase
        .from('products')
        .select('id, name, sku')
        .eq('id', productId)
        .eq('branch_id', activeBranch.branch_id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!productId && !!activeBranch,
  });

  // Fetch existing BOM if not in create mode
  const { data: existingBOM, isLoading: isBOMLoading } = useQuery({
    queryKey: ['existingBOM', productId],
    queryFn: async () => {
      if (!productId || !activeBranch || isCreateMode) return null;

      const { data: versions } = await supabase
        .from('bom_versions')
        .select('id, version_number, status')
        .eq('parent_product_id', productId)
        .eq('branch_id', activeBranch.branch_id)
        .order('version_number', { ascending: false })
        .limit(1);

      if (!versions || versions.length === 0) return null;

      const activeVersion = versions[0];
      setVersionNumber(activeVersion.version_number);

      const { data: bomItems } = await supabase
        .from('product_bom')
        .select('*')
        .eq('parent_product_id', productId)
        .eq('bom_version_id', activeVersion.id)
        .eq('branch_id', activeBranch.branch_id);

      if (bomItems) {
        setComponents(bomItems.map(item => ({
          component_product_id: item.component_product_id,
          quantity_required: parseFloat(item.quantity_required?.toString() || '1'),
          unit_of_measure: item.unit_of_measure || 'unit',
          scrap_factor: item.scrap_factor || 0,
          production_step: item.production_step || '',
        })));
      }

      return { version: activeVersion, items: bomItems || [] };
    },
    enabled: !!productId && !!activeBranch && !isCreateMode,
  });

  // Fetch all available products for component selection
  const { data: availableProducts } = useQuery({
    queryKey: ['availableProducts', activeBranch?.branch_id],
    queryFn: async () => {
      if (!activeBranch) return [];

      const { data, error } = await supabase
        .from('products')
        .select('id, name, sku, quantity_in_stock')
        .eq('branch_id', activeBranch.branch_id)
        .neq('id', productId) // Don't allow selecting the parent product
        .order('name');

      if (error) throw error;
      return data || [];
    },
    enabled: !!activeBranch && !!productId,
  });

  // Add new component row
  const handleAddComponent = () => {
    setComponents([
      ...components,
      {
        component_product_id: '',
        quantity_required: 1,
        unit_of_measure: 'unit',
        scrap_factor: 0,
        production_step: '',
      },
    ]);
  };

  // Remove component
  const handleRemoveComponent = (index: number) => {
    setComponents(components.filter((_, i) => i !== index));
  };

  // Update component field
  const handleUpdateComponent = (index: number, field: keyof BOMComponentFormData, value: any) => {
    const updated = [...components];
    updated[index] = { ...updated[index], [field]: value };
    setComponents(updated);
  };

  // Open inline product creation
  const handleOpenProductCreation = (componentIndex: number) => {
    setComponentIndexForNewProduct(componentIndex);
    setIsCreatingProduct(true);
  };

  // Handle product creation completion - auto-select the new product in the component
  const handleProductAdded = async () => {
    if (!activeBranch) return;

    // Invalidate all product-related queries to ensure products appear in categories page
    await queryClient.invalidateQueries({
      queryKey: ['products'],
      refetchType: 'active',
    });

    await queryClient.invalidateQueries({
      queryKey: ['products', activeBranch.branch_id],
      refetchType: 'active',
    });

    // Invalidate the specific query key pattern used by categories page
    await queryClient.invalidateQueries({
      predicate: (query) => {
        const key = query.queryKey;
        return (
          Array.isArray(key) &&
          key.length >= 2 &&
          key[0] === 'products' &&
          key[1] === 'categoryProducts'
        );
      },
      refetchType: 'active',
    });

    // Invalidate category products queries
    queryClient.invalidateQueries({
      queryKey: ['categoryProducts'],
      refetchType: 'active',
    });

    queryClient.invalidateQueries({
      predicate: (query) => {
        const key = query.queryKey;
        return (
          Array.isArray(key) &&
          key.length >= 1 &&
          key[0] === 'categoryProducts'
        );
      },
      refetchType: 'active',
    });

    // Invalidate stock transactions queries
    queryClient.invalidateQueries({
      queryKey: ['stockTransactions'],
      refetchType: 'active',
    });

    queryClient.invalidateQueries({
      predicate: (query) => {
        const key = query.queryKey;
        return (
          Array.isArray(key) &&
          key.length >= 1 &&
          key[0] === 'stockTransactions'
        );
      },
      refetchType: 'active',
    });

    // Refresh available products for BOM component selection
    await queryClient.invalidateQueries({ queryKey: ['availableProducts', activeBranch.branch_id] });
    
    // Wait a bit for the query to complete, then find and select the most recently created product
    setTimeout(async () => {
      if (!activeBranch || componentIndexForNewProduct === null) return;
      
      try {
        const { data: products } = await supabase
          .from('products')
          .select('id, name')
          .eq('branch_id', activeBranch.branch_id)
          .eq('is_variant', false)
          .neq('id', productId) // Don't allow selecting the parent product
          .order('created_at', { ascending: false })
          .limit(1);

        if (products && products.length > 0) {
          // Check if this product is not already in the available products list
          // (meaning it was just created)
          const isNewProduct = !availableProducts?.some(p => p.id === products[0].id);
          if (isNewProduct) {
            handleUpdateComponent(componentIndexForNewProduct, 'component_product_id', products[0].id);
          }
        }
      } catch (error) {
        console.error('Error finding newly created product:', error);
      } finally {
        setIsCreatingProduct(false);
        setComponentIndexForNewProduct(null);
      }
    }, 500);
  };

  // Save BOM
  const handleSave = async () => {
    if (!productId || !activeBranch) {
      toast.error('Missing required data');
      return;
    }

    if (components.length === 0) {
      toast.error('Please add at least one component');
      return;
    }

    // Validate all components have a product selected
    if (components.some(c => !c.component_product_id)) {
      toast.error('Please select a product for all components');
      return;
    }

    setIsSaving(true);

    try {
      // Get or create version
      let versionId: string;

      // First, check if a version already exists
      const { data: existingVersion, error: checkError } = await supabase
        .from('bom_versions')
        .select('id, status')
        .eq('parent_product_id', productId)
        .eq('branch_id', activeBranch.branch_id)
        .eq('version_number', versionNumber)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingVersion) {
        // Use existing version
        versionId = existingVersion.id;

        // Delete existing components for this version
        await supabase
          .from('product_bom')
          .delete()
          .eq('bom_version_id', versionId)
          .eq('branch_id', activeBranch.branch_id);
      } else {
        // Create new version
        const { data: newVersion, error: versionError } = await supabase
          .from('bom_versions')
          .insert({
            parent_product_id: productId,
            version_number: versionNumber,
            status: 'active',
            branch_id: activeBranch.branch_id,
          })
          .select()
          .single();

        if (versionError) throw versionError;
        versionId = newVersion.id;

        // If this is a new version, deactivate all other versions
        await supabase
          .from('bom_versions')
          .update({ status: 'archived' })
          .eq('parent_product_id', productId)
          .eq('branch_id', activeBranch.branch_id)
          .neq('id', versionId);
      }

      // Insert new components
      const componentsToInsert = components.map(c => ({
        parent_product_id: productId,
        component_product_id: c.component_product_id,
        quantity_required: c.quantity_required,
        unit_of_measure: c.unit_of_measure,
        scrap_factor: c.scrap_factor,
        production_step: c.production_step,
        bom_version_id: versionId,
        branch_id: activeBranch.branch_id,
      }));

      const { error: insertError } = await supabase
        .from('product_bom')
        .insert(componentsToInsert);

      if (insertError) throw insertError;

      toast.success(isCreateMode ? 'BOM created successfully' : 'BOM updated successfully');
      queryClient.invalidateQueries({ queryKey: ['bomList'] });
      queryClient.invalidateQueries({ queryKey: ['existingBOM', productId] });
      
      navigate('/dashboard/bom');
    } catch (error: any) {
      console.error('Error saving BOM:', error);
      toast.error(`Failed to save BOM: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isProductLoading || isBOMLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (productError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8 max-w-md">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Product</h3>
            <p className="text-sm text-gray-600 mb-4">
              {productError instanceof Error ? productError.message : 'Product not found'}
            </p>
            <Button onClick={() => navigate('/dashboard/bom')}>
              Back to BOM List
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col w-full">
      {/* Header */}
      <div className="px-4 py-4">
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
                {isCreateMode ? 'Create BOM' : 'Edit BOM'}: {product?.name || 'Loading...'}
              </h1>
              {product?.sku && (
                <p className="text-sm text-gray-600 mt-1">
                  SKU: {product.sku}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard/bom')}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving || components.length === 0}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save BOM
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Version Info */}
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Version</Label>
                <Input
                  value={versionNumber}
                  onChange={(e) => setVersionNumber(e.target.value)}
                  className="mt-1 w-32"
                  placeholder="e.g., 1.0"
                />
              </div>
              <div className="text-sm text-gray-600">
                {components.length} component{components.length !== 1 ? 's' : ''}
              </div>
            </div>
          </Card>

          {/* Components Table */}
          <Card>
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Components</h2>
                <Button onClick={handleAddComponent} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Component
                </Button>
              </div>
            </div>

            {components.length === 0 ? (
              <div className="p-12 text-center">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">No components yet</p>
                <Button onClick={handleAddComponent}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Component
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Component</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Scrap %</TableHead>
                      <TableHead>Production Step</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {components.map((component, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="space-y-2">
                            <Select
                              value={component.component_product_id}
                              onValueChange={(value) => {
                                if (value === '__create_new__') {
                                  handleOpenProductCreation(index);
                                } else {
                                  handleUpdateComponent(index, 'component_product_id', value);
                                }
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select product" />
                              </SelectTrigger>
                              <SelectContent>
                                <div className="p-2 border-b mb-1">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full justify-start"
                                    onClick={() => handleOpenProductCreation(index)}
                                  >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create New Product
                                  </Button>
                                </div>
                                {availableProducts?.map((p) => (
                                  <SelectItem key={p.id} value={p.id}>
                                    {p.name} {p.sku && `(${p.sku})`} - Stock: {p.quantity_in_stock}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={component.quantity_required}
                            onChange={(e) =>
                              handleUpdateComponent(
                                index,
                                'quantity_required',
                                parseFloat(e.target.value) || 0
                              )
                            }
                            min="0"
                            step="0.01"
                            className="w-24"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={component.unit_of_measure}
                            onChange={(e) =>
                              handleUpdateComponent(index, 'unit_of_measure', e.target.value)
                            }
                            className="w-24"
                            placeholder="unit"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={component.scrap_factor}
                            onChange={(e) =>
                              handleUpdateComponent(
                                index,
                                'scrap_factor',
                                parseFloat(e.target.value) || 0
                              )
                            }
                            min="0"
                            max="100"
                            step="0.1"
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={component.production_step}
                            onChange={(e) =>
                              handleUpdateComponent(index, 'production_step', e.target.value)
                            }
                            placeholder="Optional"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveComponent(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Inline Product Creation Modal - Using AddProductModal for consistency */}
      <AddProductModal
        isOpen={isCreatingProduct}
        onClose={() => {
          setIsCreatingProduct(false);
          setComponentIndexForNewProduct(null);
        }}
        onProductAdded={handleProductAdded}
        onFirstProductAdded={handleProductAdded}
      />
    </div>
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

function BOMRow({ item, isSelected, onToggleSelect, onDelete, onEdit, onViewProduct }: BOMRowProps) {
  return (
    <TableRow className="hover:bg-gray-50">
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
                  <Badge 
                    key={v.id} 
                    variant={v.status === 'active' ? 'default' : 'secondary'} 
                    className="text-xs"
                  >
                    v{v.version_number} • {v.status}
                  </Badge>
                ))}
                {item.versions.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{item.versions.length - 2} more
                  </Badge>
                )}
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
        <Badge 
          variant={
            item.buildable_quantity === 0 
              ? 'destructive' 
              : item.buildable_quantity < 5 
              ? 'default' 
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
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onDelete} 
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
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

// Dialog Components
function CreateBOMDialog({ 
  isOpen, 
  onClose, 
  availableProducts, 
  selectedProductId, 
  onSelectProduct, 
  onConfirm 
}: {
  isOpen: boolean;
  onClose: () => void;
  availableProducts: Product[];
  selectedProductId: string;
  onSelectProduct: (id: string) => void;
  onConfirm: () => void;
}) {
  const { activeBranch } = useBranches();
  const queryClient = useQueryClient();
  
  // State for product creation modal
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);

  // Handle product creation completion
  const handleProductAdded = async () => {
    if (!activeBranch) return;

    // Invalidate all product-related queries to ensure products appear in categories page
    await queryClient.invalidateQueries({
      queryKey: ['products'],
      refetchType: 'active',
    });

    await queryClient.invalidateQueries({
      queryKey: ['products', activeBranch.branch_id],
      refetchType: 'active',
    });

    // Invalidate the specific query key pattern used by categories page
    await queryClient.invalidateQueries({
      predicate: (query) => {
        const key = query.queryKey;
        return (
          Array.isArray(key) &&
          key.length >= 2 &&
          key[0] === 'products' &&
          key[1] === 'categoryProducts'
        );
      },
      refetchType: 'active',
    });

    // Invalidate category products queries
    queryClient.invalidateQueries({
      queryKey: ['categoryProducts'],
      refetchType: 'active',
    });

    queryClient.invalidateQueries({
      predicate: (query) => {
        const key = query.queryKey;
        return (
          Array.isArray(key) &&
          key.length >= 1 &&
          key[0] === 'categoryProducts'
        );
      },
      refetchType: 'active',
    });

    // Invalidate stock transactions queries
    queryClient.invalidateQueries({
      queryKey: ['stockTransactions'],
      refetchType: 'active',
    });

    queryClient.invalidateQueries({
      predicate: (query) => {
        const key = query.queryKey;
        return (
          Array.isArray(key) &&
          key.length >= 1 &&
          key[0] === 'stockTransactions'
        );
      },
      refetchType: 'active',
    });

    // Refresh available products for BOM creation
    await queryClient.invalidateQueries({ queryKey: ['availableProductsForBOM', activeBranch.branch_id] });
    
    // Wait a bit for the query to complete, then find and select the most recently created product
    setTimeout(async () => {
      if (!activeBranch) return;
      
      try {
        const { data: products } = await supabase
          .from('products')
          .select('id, name')
          .eq('branch_id', activeBranch.branch_id)
          .eq('is_variant', false)
          .order('created_at', { ascending: false })
          .limit(1);

        if (products && products.length > 0) {
          // Check if this product is not already in the available products list
          // (meaning it was just created)
          const isNewProduct = !availableProducts.some(p => p.id === products[0].id);
          if (isNewProduct) {
            onSelectProduct(products[0].id);
          }
        }
      } catch (error) {
        console.error('Error finding newly created product:', error);
      }
    }, 500);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Bill of Materials</DialogTitle>
            <DialogDescription>
              Select a product to create a BOM for
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Select Product</Label>
              <Select value={selectedProductId} onValueChange={onSelectProduct}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a product" />
                </SelectTrigger>
                <SelectContent>
                  <div className="p-2 border-b mb-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setIsCreatingProduct(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create New Product
                    </Button>
                  </div>
                  {availableProducts.map((product) => (
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




      {/* Product Creation Modal - Using AddProductModal for consistency */}
      <AddProductModal
        isOpen={isCreatingProduct}
        onClose={() => setIsCreatingProduct(false)}
        onProductAdded={handleProductAdded}
        onFirstProductAdded={handleProductAdded}
      />
    </>
  );
}

function WhereUsedDialog({ 
  isOpen, 
  onClose, 
  componentId, 
  whereUsedData 
}: {
  isOpen: boolean;
  onClose: () => void;
  componentId: string | null;
  whereUsedData: WhereUsedItem[];
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Where Used Report</DialogTitle>
          <DialogDescription>
            This component is used in the following BOMs
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {whereUsedData.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600">This component is not used in any BOMs</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {whereUsedData.map((item) => (
                <div key={item.parent_product_id} className="p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{item.parent_product_name}</p>
                      <p className="text-xs text-gray-600">{item.parent_product_sku || 'No SKU'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">
                        Qty Required: <span className="font-semibold">{item.quantity_required.toFixed(2)}</span>
                      </p>
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