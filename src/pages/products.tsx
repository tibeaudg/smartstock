import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Package } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { useMobile } from '@/hooks/use-mobile';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCategoryTree, useCreateCategory, useUpdateCategory, useDeleteCategory, useCategoryRealtime, useProductsByCategories } from '@/hooks/useCategories';
import { useWarehouses } from '@/hooks/useWarehouses';
import { CategoryFacetFilter } from '@/components/categories/CategoryFacetFilter';
import { QuickSwitcherBar } from '@/components/categories/QuickSwitcherBar';
import { CategoryCustomizationModal } from '@/components/categories/CategoryCustomizationModal';
import { HierarchicalCategorySelector } from '@/components/categories/HierarchicalCategorySelector';
import { MultiIntentSearch } from '@/components/categories/MultiIntentSearch';
import { ProductCard } from '@/components/ProductCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Grid3x3, Table2, Edit, Trash2, Copy, MapPin, ChevronRight, ChevronLeft, ChevronDown, ChevronUp, Palette, ArrowUpDown, ArrowUp, ArrowDown, Scan, Filter, Search, X, Settings, Minimize2, Check, Printer, Truck, Tag, Package2, DollarSign,Warehouse, AlertCircle, AlertTriangle, TrendingUp, ArrowRightLeft, FolderTree, Download, GitBranch, Hash } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import type { CategoryTree, CategoryCreateData } from '@/types/categoryTypes';
import { getCategoryPath, getCategoryIdsIncludingDescendants, flattenCategoryTree } from '@/lib/categories/categoryUtils';
import { cn } from '@/lib/utils';
import { EditProductStockModal } from '@/components/EditProductStockModal';
import { ManualStockAdjustModal } from '@/components/ManualStockAdjustModal';
import { ImagePreviewModal } from '@/components/ImagePreviewModal';
import { BarcodeScanner } from '@/components/BarcodeScanner';
import { VariantSelectionModal } from '@/components/VariantSelectionModal';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { BulkImportModal } from '@/components/BulkImportModal';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useScannerSettings } from '@/hooks/useScannerSettings';
import { CommandPalette, useCommandPalette, type CommandPaletteAction } from '@/components/CommandPalette';
import { useColumnPreferences } from '@/hooks/useColumnPreferences';
import { ColumnVisibilityModal } from '@/components/products/ColumnVisibilityModal';
import { CommandCenterPanel } from '@/components/products/CommandCenterPanel';
import { StockBadge, type StockStatus } from '@/components/products/StockBadge';
import { InlineReorderButton } from '@/components/products/InlineReorderButton';
import { ActionableSKU } from '@/components/products/ActionableSKU';
import { StorageColumn } from '@/components/products/StorageColumn';
import { CategoryColumn } from '@/components/products/CategoryColumn';
import { EnhancedStockColumn } from '@/components/products/EnhancedStockColumn';
import { QuickFilters, type QuickFilterType } from '@/components/products/QuickFilters';
import { DataCompletenessBadge } from '@/components/products/DataCompletenessBadge';
import { getColumnById } from '@/lib/products/columnFieldMapping';
import { calculateDaysOfCover, velocityToDailyConsumption } from '@/utils/daysOfCover';
import { calculateStockTrend } from '@/utils/stockTrends';
import { useOpsViewState, type OpsViewName } from '@/hooks/useOpsViewState';
import { OpsSummaryStrip } from '@/components/products/OpsSummaryStrip';
import { OpsViewTabs } from '@/components/products/OpsViewTabs';
import { ReorderColumn } from '@/components/products/ReorderColumn';
import { SetReorderRulePanel } from '@/components/products/SetReorderRulePanel';
import { calculateDaysOutOfStockBatch } from '@/utils/daysOutOfStock';
import { useCommandCenterData } from '@/hooks/useCommandCenterData';

export default function CategorysPage() {
  const { user } = useAuth();
  const { activeBranch } = useBranches();
  const { isMobile } = useMobile();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddSubCategoryModal, setShowAddSubCategoryModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCustomizationModal, setShowCustomizationModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryTree | null>(null);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  
  // Advanced filter states
  const [selectedStockStatus, setSelectedStockStatus] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<'all' | 'today' | 'week' | 'month' | 'year'>('all');
  const [selectedWarehouse, setSelectedWarehouse] = useState<string | null>(null);
  const [activeQuickFilter, setActiveQuickFilter] = useState<string | null>(null);
  const [activeQuickFilters, setActiveQuickFilters] = useState<QuickFilterType[]>([]);
  const [searchTokens, setSearchTokens] = useState<{ stock?: 'low' | 'out' | 'in'; warehouse?: string; category?: string }>({});
  const [showFilters, setShowFilters] = useState(false); // Default to collapsed
  // Default to table view on both mobile and desktop
  const [productViewMode, setProductViewMode] = useState<'grid' | 'list' | 'table'>(() => {
    if (typeof window !== 'undefined') {
      return 'table';
    }
    return 'table';
  });
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sorting state - default based on view mode
  const [sortColumn, setSortColumn] = useState<string | null>(() => {
    // In Daily Ops mode, default to urgency
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('products-view-mode');
      return savedMode === 'daily-ops' ? 'urgency' : 'name';
    }
    return 'name';
  });
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('products-view-mode');
      return savedMode === 'daily-ops' ? 'desc' : 'desc';
    }
    return 'desc';
  });
  
  // Compact mode state - default to true
  const [compactMode] = useState(true);
  
  // Daily Operations View state
  const { viewMode, setViewMode, activeOpsView, applyView, saveView } = useOpsViewState();
  const [isReorderRulePanelOpen, setIsReorderRulePanelOpen] = useState(false);
  const [productsForPanel, setProductsForPanel] = useState<any[]>([]);
  const [daysOutOfStockMap, setDaysOutOfStockMap] = React.useState<Map<string, number | null>>(new Map());
  
  // SKU column visibility
  const [showSKUColumn, setShowSKUColumn] = useState(true);
  
  // Column visibility modal state
  const [isColumnVisibilityModalOpen, setIsColumnVisibilityModalOpen] = useState(false);
  
  // Column preferences
  const { visibleColumns, columnOrder, setVisibleColumns, resetToDefaults } = useColumnPreferences();
  
  // Row selection state
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(new Set());
  
  // Expanded product rows state (for variant sub-tables)
  const [expandedProductIds, setExpandedProductIds] = useState<Set<string>>(new Set());
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  
  // Hover state for row actions
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);
  const [hoveredRowPosition, setHoveredRowPosition] = useState<{ top: number; right: number; height: number } | null>(null);
  const [hoveredImageProductId, setHoveredImageProductId] = useState<string | null>(null);
  // Group hover state - tracks parent product ID when hovering over parent or any variant
  const [hoveredProductGroupId, setHoveredProductGroupId] = useState<string | null>(null);
  
  // Product modal states
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isStockAdjustModalOpen, setIsStockAdjustModalOpen] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [isMobileProductDetailModalOpen, setIsMobileProductDetailModalOpen] = useState(false);
  const [isProductDetailModalOpen, setIsProductDetailModalOpen] = useState(false);
  const [detailProduct, setDetailProduct] = useState<any>(null);
  
  // Variant selection modal states
  const [isVariantSelectionModalOpen, setIsVariantSelectionModalOpen] = useState(false);
  const [productVariants, setProductVariants] = useState<any[]>([]);
  const [selectedAction, setSelectedAction] = useState<'in' | 'out'>('in');
  
  // Add product modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBarcodeScannerOpen, setIsBarcodeScannerOpen] = useState(false);
  const [scannedSKU, setScannedSKU] = useState<string>('');
  const [preFilledProductName, setPreFilledProductName] = useState<string>('');
  
  // Bulk import modal state
  const [isBulkImportModalOpen, setIsBulkImportModalOpen] = useState(false);
  
  const { settings: scannerSettings, onScanSuccess } = useScannerSettings();
  
  // Command palette
  const { open: isCommandPaletteOpen, setOpen: setCommandPaletteOpen } = useCommandPalette();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parentCategoryId: null as string | null,
  });

  // Subcategory form state (requires parent)
  const [subCategoryFormData, setSubCategoryFormData] = useState({
    name: '',
    description: '',
    parentCategoryId: null as string | null,
  });

  // Hooks
  const { tree, categories, isLoading } = useCategoryTree();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();
  const { data: categoryProducts = [], isLoading: productsLoading, refetch: refetchProducts } = useProductsByCategories(selectedCategoryIds);
  const { data: warehouses = [] } = useWarehouses();
  
  // State for category and warehouse dropdowns
  const [isCategoryPopoverOpen, setIsCategoryPopoverOpen] = useState(false);
  const [isWarehousePopoverOpen, setIsWarehousePopoverOpen] = useState(false);
  const [categorySearchQuery, setCategorySearchQuery] = useState('');
  const [warehouseSearchQuery, setWarehouseSearchQuery] = useState('');
  
  // Flatten categories for quick selection
  const allCategories = React.useMemo(() => {
    return flattenCategoryTree(tree);
  }, [tree]);
  
  // Filter categories and warehouses based on search query
  const filteredCategories = allCategories.filter(category =>
    category.name.toLowerCase().includes(categorySearchQuery.toLowerCase())
  );
  
  const filteredWarehouses = warehouses.filter(warehouse =>
    warehouse.name.toLowerCase().includes(warehouseSearchQuery.toLowerCase())
  );
  
  const selectedCategoryNames = allCategories
    .filter(cat => selectedCategoryIds.includes(cat.id))
    .map(cat => cat.name);
  
  // Clear search queries when popovers close
  React.useEffect(() => {
    if (!isCategoryPopoverOpen) {
      setCategorySearchQuery('');
    }
  }, [isCategoryPopoverOpen]);
  
  React.useEffect(() => {
    if (!isWarehousePopoverOpen) {
      setWarehouseSearchQuery('');
    }
  }, [isWarehousePopoverOpen]);
  const queryClient = useQueryClient();
  useCategoryRealtime();
  




  
  // Handle URL parameter for warehouse filter
  React.useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const warehouseParam = searchParams.get('warehouse');
    if (warehouseParam) {
      setSelectedWarehouse(decodeURIComponent(warehouseParam));
    }
  }, [location.search]);
  
  // Handle URL parameter for category filter
  React.useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      const categoryId = decodeURIComponent(categoryParam);
      // Set the category filter from URL parameter (replace any existing selection)
      // Use functional update to avoid dependency on selectedCategoryIds
      setSelectedCategoryIds(prev => {
        // Only update if different to avoid unnecessary re-renders
        if (prev.length === 1 && prev[0] === categoryId) {
          return prev;
        }
        // Replace selection with the category from URL
        return [categoryId];
      });
    }
    // If no category param in URL, don't clear selection (user might have manually selected)
    // This allows users to filter by category in the UI without URL param
  }, [location.search]);
  
  // Refetch products when returning to categories page (e.g., after adding a product)
  const prevLocationRef = React.useRef(location.pathname);
  React.useEffect(() => {
    // If we just navigated to the categories page (from another page)
    if (location.pathname === '/dashboard/categories' && 
        prevLocationRef.current !== location.pathname &&
        activeBranch?.branch_id) {
      // Invalidate and refetch product queries
      queryClient.invalidateQueries({ queryKey: ['productsByCategories'] });
      queryClient.invalidateQueries({ queryKey: ['categoryProducts'] });
      queryClient.invalidateQueries({ queryKey: ['categoryProductCounts'] });
      refetchProducts();
    }
    prevLocationRef.current = location.pathname;
  }, [location.pathname, activeBranch?.branch_id, queryClient, refetchProducts]);
  
  // Get product counts for categories
  const { data: productCounts } = useQuery({
    queryKey: ['categoryProductCounts', user?.id, activeBranch?.branch_id],
    queryFn: async () => {
      if (!user) return new Map<string, number>();
      const { getCategoryProductCounts } = await import('@/lib/categories/categoryService');
      return getCategoryProductCounts(user.id, activeBranch?.branch_id);
    },
    enabled: !!user && categories.length > 0,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  // Removed filterCategoryTree and filteredTree - no longer needed with facet filter approach

  // Filter products based on search and all filters
  const filteredProducts = React.useMemo(() => {
    let filtered = categoryProducts;

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((product: any) => {
        return (
          product.name?.toLowerCase().includes(term) ||
          product.description?.toLowerCase().includes(term) ||
          product.sku?.toLowerCase().includes(term) ||
          product.category_name?.toLowerCase().includes(term)
        );
      });
    }

    // Tokenized search filters
    if (searchTokens.stock) {
      filtered = filtered.filter((product: any) => {
        const qty = Number(product.quantity_in_stock) || 0;
        const minLevel = Number(product.minimum_stock_level) || 0;
        switch (searchTokens.stock) {
          case 'low':
            return qty > 0 && qty <= minLevel;
          case 'out':
            return qty === 0;
          case 'in':
            return qty > minLevel;
          default:
            return true;
        }
      });
    }
    if (searchTokens.warehouse) {
      filtered = filtered.filter((product: any) => 
        product.warehouse_name?.toLowerCase().includes(searchTokens.warehouse!.toLowerCase())
      );
    }
    if (searchTokens.category) {
      filtered = filtered.filter((product: any) => 
        product.category_name?.toLowerCase().includes(searchTokens.category!.toLowerCase())
      );
    }

    // Quick filters
    if (activeQuickFilters.length > 0) {
      filtered = filtered.filter((product: any) => {
        const qty = Number(product.quantity_in_stock) || 0;
        const minLevel = Number(product.minimum_stock_level) || 0;
        const hasSKU = !!(product.sku && product.sku !== '---');
        const hasCategory = !!product.category_name;
        
        return activeQuickFilters.some(filter => {
          switch (filter) {
            case 'low-stock':
              return qty > 0 && qty <= minLevel;
            case 'out-of-stock':
              return qty === 0;
            case 'missing-data':
              return !hasSKU || !hasCategory;
    
            default:
              return false;
          }
        });
      });
    }

    // Warehouse filter (from warehouse dropdown)
    if (selectedWarehouse) {
      filtered = filtered.filter((product: any) => 
        product.warehouse_name && product.warehouse_name.toLowerCase() === selectedWarehouse.toLowerCase()
      );
    }

    // Stock status filter
    if (selectedStockStatus.length > 0) {
      filtered = filtered.filter((product: any) => {
        const status = getStockStatus(product.quantity_in_stock, product.minimum_stock_level);
        return selectedStockStatus.some(filterStatus => {
          if (filterStatus === 'in-stock') return status === 'In Stock';
          if (filterStatus === 'low-stock') return status === 'Low Stock';
          if (filterStatus === 'out-of-stock') return status === 'Out of Stock';
          return false;
        });
      });
    }

    // Date range filter
    if (dateRange !== 'all') {
      const now = Date.now();
      let cutoffDate = 0;
      switch (dateRange) {
        case 'today':
          cutoffDate = now - (24 * 60 * 60 * 1000);
          break;
        case 'week':
          cutoffDate = now - (7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          cutoffDate = now - (30 * 24 * 60 * 60 * 1000);
          break;
        case 'year':
          cutoffDate = now - (365 * 24 * 60 * 60 * 1000);
          break;
      }
      filtered = filtered.filter((product: any) => {
        if (!product.created_at) return false;
        return new Date(product.created_at).getTime() >= cutoffDate;
      });
    }

    // Quick filters
    if (activeQuickFilter) {
      filtered = filtered.filter((product: any) => {
        const qty = Number(product.quantity_in_stock) || 0;
        const minLevel = Number(product.minimum_stock_level) || 0;
        const cost = Number(product.purchase_price) || 0;
        const price = Number(product.sale_price) || 0;
        const value = qty * price;
        const createdDate = product.created_at ? new Date(product.created_at).getTime() : 0;
        const daysSinceAdded = (Date.now() - createdDate) / (1000 * 60 * 60 * 24);

        switch (activeQuickFilter) {
          case 'low-stock':
            return qty > 0 && qty <= minLevel;
          case 'out-of-stock':
            return qty === 0;
          case 'recently-added':
            return daysSinceAdded <= 7;
          case 'high-value':
            return value >= 1000; // Products with total value >= $1000
          default:
            return true;
        }
      });
    }



    return filtered;
  }, [categoryProducts, searchTerm, selectedWarehouse, selectedStockStatus, dateRange, activeQuickFilter, activeQuickFilters, viewMode, activeOpsView]);

  // Fetch variants for all products to calculate variant counts (use filteredProducts to respect filters)
  const productIds = React.useMemo(() => 
    filteredProducts.filter(p => !p.is_variant && p.id).map(p => p.id),
    [filteredProducts]
  );

  const { data: variantsData = [] } = useQuery({
    queryKey: ['productVariants', productIds, activeBranch?.branch_id],
    queryFn: async () => {
      if (!activeBranch?.branch_id || productIds.length === 0) return [];
      
      const { data, error } = await supabase
        .from('products')
        .select('parent_product_id')
        .eq('is_variant', true)
        .eq('branch_id', activeBranch.branch_id)
        .in('parent_product_id', productIds);
      
      if (error) {
        console.error('Error fetching variants:', error);
        return [];
      }
      
      return data || [];
    },
    enabled: !!activeBranch?.branch_id && productIds.length > 0,
    staleTime: 1000 * 60, // 1 minute
  });

  // Fetch full variant details for expanded products
  const expandedProductIdsArray = Array.from(expandedProductIds);
  const { data: variantDetails = [] } = useQuery({
    queryKey: ['productVariantsDetail', expandedProductIdsArray, activeBranch?.branch_id],
    queryFn: async () => {
      if (!activeBranch?.branch_id || expandedProductIdsArray.length === 0) return [];
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_variant', true)
        .eq('branch_id', activeBranch.branch_id)
        .in('parent_product_id', expandedProductIdsArray)
        .order('variant_name');
      
      if (error) {
        console.error('Error fetching variant details:', error);
        return [];
      }
      
      return data || [];
    },
    enabled: !!activeBranch?.branch_id && expandedProductIdsArray.length > 0,
    staleTime: 1000 * 60, // 1 minute
  });

  // Group variants by parent product ID
  const variantsByParentId = React.useMemo(() => {
    const grouped = new Map<string, any[]>();
    variantDetails.forEach((variant: any) => {
      if (variant.parent_product_id) {
        const parentId = String(variant.parent_product_id);
        if (!grouped.has(parentId)) {
          grouped.set(parentId, []);
        }
        grouped.get(parentId)!.push(variant);
      }
    });
    return grouped;
  }, [variantDetails]);

  // Calculate variant counts and aggregated stock for each product
  const variantCounts = React.useMemo(() => {
    const counts = new Map<string, number>();
    
    // Initialize all products with 0 variants
    categoryProducts.forEach((product: any) => {
      if (product.id && !product.is_variant) {
        counts.set(String(product.id), 0);
      }
    });
    
    // Count variants for each product
    variantsData.forEach((variant: any) => {
      if (variant.parent_product_id) {
        const parentId = String(variant.parent_product_id);
        const current = counts.get(parentId) || 0;
        counts.set(parentId, current + 1);
      }
    });
    
    return counts;
  }, [categoryProducts, variantsData]);

  // Calculate total stock including variants for each parent product
  // Note: quantity_in_stock now already includes variant stock from the service layer
  const productStockTotals = React.useMemo(() => {
    const totals = new Map<string, number>();
    categoryProducts.forEach((product: any) => {
      // quantity_in_stock already includes variant stock, so just use it directly
      totals.set(product.id, Number(product.quantity_in_stock) || 0);
    });
    return totals;
  }, [categoryProducts]);

  // Calculate urgency score for sorting
  const getUrgencyScore = (product: any): number => {
    const qty = Number(product.quantity_in_stock) || 0;
    const minLevel = Number(product.minimum_stock_level) || 0;
    const hasMissingData = !product.sku || product.sku === '---' || !product.category_name;
    
    // Out of stock = highest urgency (100)
    if (qty === 0) return 100;
    // Low stock = high urgency (80)
    if (qty > 0 && qty <= minLevel) return 80;
    // Missing data = medium urgency (50)
    if (hasMissingData) return 50;
    // Healthy = low urgency (0)
    return 0;
  };

  // Use filtered products for sorting (always use filteredProducts to include all filters)
  const sortedProducts = React.useMemo(() => {
    const productsToSort = filteredProducts;
    if (!sortColumn) return productsToSort;

    return [...productsToSort].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortColumn) {
        case 'name':
          aValue = a.name?.toLowerCase() || '';
          bValue = b.name?.toLowerCase() || '';
          break;
        case 'sku':
          aValue = (a.sku || '').toLowerCase();
          bValue = (b.sku || '').toLowerCase();
          break;
        case 'barcode':
          aValue = (a.barcode || '').toLowerCase();
          bValue = (b.barcode || '').toLowerCase();
          break;
        case 'description':
          aValue = (a.description || '').toLowerCase();
          bValue = (b.description || '').toLowerCase();
          break;
        case 'warehouses':
          // Sort by warehouse name
          aValue = (a.warehouse_name || '').toLowerCase();
          bValue = (b.warehouse_name || '').toLowerCase();
          break;
        case 'stock':
          aValue = Number(a.quantity_in_stock) || 0;
          bValue = Number(b.quantity_in_stock) || 0;
          break;
        case 'minimum_stock_level':
          aValue = Number(a.minimum_stock_level) || 0;
          bValue = Number(b.minimum_stock_level) || 0;
          break;
        case 'urgency':
          aValue = getUrgencyScore(a);
          bValue = getUrgencyScore(b);
          break;
        case 'purchase_price':
          aValue = Number(a.purchase_price) || 0;
          bValue = Number(b.purchase_price) || 0;
          break;
        case 'sale_price':
          aValue = Number(a.sale_price) || 0;
          bValue = Number(b.sale_price) || 0;
          break;
        case 'unit_price':
          aValue = Number(a.unit_price) || 0;
          bValue = Number(b.unit_price) || 0;
          break;
        default:
          return 0;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        if (sortDirection === 'asc') {
          return aValue.localeCompare(bValue);
        } else {
          return bValue.localeCompare(aValue);
        }
      } else {
        if (sortDirection === 'asc') {
          return aValue - bValue;
        } else {
          return bValue - aValue;
        }
      }
    });
  }, [filteredProducts, sortColumn, sortDirection]);

  // Pagination calculations
  const totalProducts = sortedProducts.length;
  const totalPages = Math.ceil(totalProducts / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = sortedProducts.slice(startIndex, endIndex);

  // Handle items per page change - reset to page 1
  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  // Reset to page 1 when filters/search change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedStockStatus, dateRange, activeQuickFilter, activeQuickFilters, selectedCategoryIds, sortColumn, sortDirection, selectedWarehouse]);


  // Dashboard insights metrics
  const dashboardMetrics = React.useMemo(() => {
    const products = filteredProducts;
    
    const totalProducts = products.length;
    
    let lowStockCount = 0;
    let outOfStockCount = 0;
    let newlyAddedThisMonth = 0;
    let highValueCount = 0;
    let totalInventoryValue = 0;
    
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    products.forEach((product: any) => {
      const qty = Number(product.quantity_in_stock) || 0;
      const minLevel = Number(product.minimum_stock_level) || 0;
      const cost = Number(product.purchase_price) || 0;
      
      // Stock status
      if (qty === 0) {
        outOfStockCount++;
      } else if (qty > 0 && qty <= minLevel) {
        lowStockCount++;
      }
      
      // Newly added this month
      if (product.created_at) {
        const createdDate = new Date(product.created_at);
        if (createdDate >= startOfMonth) {
          newlyAddedThisMonth++;
        }
      }
      
      // High-value products (cost >= $100 or sale_price >= $100)
      const salePrice = Number(product.sale_price) || 0;
      if (cost >= 100 || salePrice >= 100) {
        highValueCount++;
      }
      
      // Total inventory value (cost * quantity)
      totalInventoryValue += cost * qty;
    });
    
    return {
      totalProducts,
      lowStockCount,
      outOfStockCount,
      newlyAddedThisMonth,
      highValueCount,
      totalInventoryValue,
    };
  }, [filteredProducts]);

  // Helper function to get price color
  const getPriceColor = (value: number | null | undefined, positiveColor: string): string => {
    if (value === null || value === undefined || Number(value) === 0) {
      return 'text-gray-400';
    }
    if (Number(value) < 0) {
      return 'text-red-600';
    }
    return positiveColor;
  };

  const handleAddSubCategory = async () => {
    if (!subCategoryFormData.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    if (!subCategoryFormData.parentCategoryId) {
      toast.error('Parent category is required for subcategories');
      return;
    }

    if (!user) {
      toast.error('You must be logged in to add categories');
      return;
    }

    try {
      const categoryData: CategoryCreateData = {
        name: subCategoryFormData.name.trim(),
        description: subCategoryFormData.description.trim() || null,
        parent_category_id: subCategoryFormData.parentCategoryId,
      };

      await createCategory.mutateAsync(categoryData);
      toast.success('Subcategory added successfully!');
      setShowAddSubCategoryModal(false);
      setSubCategoryFormData({ name: '', description: '', parentCategoryId: null });
    } catch (error) {
      console.error('Error adding subcategory:', error);
    }
  };

  const handleEditCategory = async () => {
    if (!selectedCategory || !formData.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    try {
      await updateCategory.mutateAsync({
        categoryId: selectedCategory.id,
        data: {
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          parent_category_id: formData.parentCategoryId,
        },
      });
      toast.success('Category updated successfully!');
      setShowEditModal(false);
      setSelectedCategory(null);
      setFormData({ name: '', description: '', parentCategoryId: null });
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;

    try {
      await deleteCategory.mutateAsync(selectedCategory.id);
      toast.success('Category deleted successfully!');
      setShowDeleteDialog(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const openEditModal = (category: CategoryTree) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      parentCategoryId: category.parent_category_id,
    });
    setShowEditModal(true);
  };

  const openDeleteDialog = (category: CategoryTree) => {
    setSelectedCategory(category);
    setShowDeleteDialog(true);
  };

  const openCustomizationModal = (category: CategoryTree) => {
    setSelectedCategory(category);
    setShowCustomizationModal(true);
  };

  // Removed handleCategoryClick, handleToggleExpand, handleExpandAll, handleCollapseAll, handleBreadcrumbClick
  // These are no longer needed with the facet filter approach

  const handleAddCategory = () => {
    setFormData({ name: '', description: '', parentCategoryId: null });
    navigate('/dashboard/products/new');
  };

  const handleSubmitCategory = async () => {
    if (!formData.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    if (!user) {
      toast.error('You must be logged in to add categories');
      return;
    }

    try {
      const categoryData: CategoryCreateData = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        parent_category_id: formData.parentCategoryId || null,
      };

      await createCategory.mutateAsync(categoryData);
      toast.success('Category added successfully!');
      setShowAddModal(false);
      setFormData({ name: '', description: '', parentCategoryId: null });
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleAddSubcategory = () => {
    // If only one category is selected, use it as parent
    if (selectedCategoryIds.length === 1) {
      setSubCategoryFormData({ name: '', description: '', parentCategoryId: selectedCategoryIds[0] });
      setShowAddSubCategoryModal(true);
    } else {
      // Otherwise, show modal without pre-selected parent
      setSubCategoryFormData({ name: '', description: '', parentCategoryId: null });
      setShowAddSubCategoryModal(true);
    }
  };

  // Category selection change handler
  const handleCategorySelectionChange = (categoryIds: string[]) => {
    setSelectedCategoryIds(categoryIds);
  };

  // Filter change handler
  const handleFiltersChange = (filters: any) => {
    setSelectedStockStatus(filters.stockStatus || []);
    setDateRange(filters.dateRange || 'all');
  };


  const handleFavoriteToggle = async (productId: string, isFavorite: boolean) => {
    if (!user || !activeBranch) return;
    
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_favorite: isFavorite })
        .eq('id', productId)
        .eq('branch_id', activeBranch.branch_id);
      
      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ['productsByCategories'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorite status');
    }
  };

  // Function to fetch product variants
  const fetchProductVariants = async (productId: string): Promise<any[]> => {
    try {
      if (!activeBranch?.branch_id) return [];
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('parent_product_id', productId)
        .eq('branch_id', activeBranch.branch_id)
        .order('variant_name');
      
      if (error) {
        console.error('Error fetching variants:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error fetching variants:', error);
      return [];
    }
  };

  const handleStockAction = async (product: any, action: 'in' | 'out') => {
    // Check if product has variants
    const variants = await fetchProductVariants(product.id);
    
    if (variants.length > 0) {
      // Product has variants - show variant selection modal
      setSelectedProduct(product);
      setSelectedAction(action);
      setProductVariants(variants);
      setIsVariantSelectionModalOpen(true);
    } else {
      // No variants - go directly to stock adjustment modal
      setSelectedProduct(product);
      setIsStockAdjustModalOpen(true);
    }
  };
  
  const handleVariantSelected = (variant: any) => {
    // Close variant selection modal and open stock adjustment modal with selected variant
    setIsVariantSelectionModalOpen(false);
    setSelectedProduct(variant);
    setIsStockAdjustModalOpen(true);
  };

  const handleProductEdit = (product: any) => {
    // Navigate to product detail page
    navigate(`/dashboard/products/${product.id}`);
  };

  const handleCreatePO = (product: any) => {
    // Navigate to purchase orders page with product pre-selected
    navigate(`/dashboard/purchase-orders?productId=${product.id}`);
  };

  const handleViewStockHistory = (product: any) => {
    // Navigate to stock movements page filtered by this product
    navigate(`/dashboard/transactions?productId=${product.id}`);
  };

  const handleImagePreview = (url: string) => {
    setPreviewImageUrl(url);
    setIsImagePreviewOpen(true);
  };

  const handleMobileRowClick = (product: any) => {
    if (isMobile) {
      setSelectedProduct(product);
      setIsMobileProductDetailModalOpen(true);
    }
  };

  // Handler for row click to open product detail modal or toggle expansion
  const handleRowClick = (e: React.MouseEvent<HTMLTableRowElement>, product: any) => {
    // Check if click target is an interactive element
    const target = e.target as HTMLElement;
    const isInteractive = 
      target.closest('button') ||
      target.closest('input') ||
      target.closest('a') ||
      target.closest('[role="button"]') ||
      target.closest('[data-interactive]') ||
      target.tagName === 'BUTTON' ||
      target.tagName === 'INPUT' ||
      target.tagName === 'A';

    // If clicking on interactive element, don't handle row click
    if (isInteractive) {
      return;
    }

    // Check if product has variants
    const hasVariants = !product.is_variant && product.id && (variantCounts.get(String(product.id)) ?? 0) > 0;
    
    if (hasVariants) {
      // Toggle expansion for products with variants
      toggleProductExpansion(product.id);
      return;
    }

    // If mobile, use existing mobile behavior
    if (isMobile) {
      handleMobileRowClick(product);
      return;
    }

    // On desktop, navigate to product detail page for products without variants
    navigate(`/dashboard/products/${product.id}`);
  };

  const handleDuplicateProduct = async (product: any) => {
    if (!activeBranch) return;

    try {
      const { id, created_at, updated_at, ...productData } = product;
      
      const duplicatedProduct: any = {
        ...productData,
        name: `${product.name} (Copy)`,
        branch_id: activeBranch.branch_id,
      };

      const { error } = await supabase
        .from('products')
        .insert(duplicatedProduct);

      if (error) throw error;

      toast.success('Product duplicated successfully');
      
      queryClient.invalidateQueries({ queryKey: ['productsByCategories'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['categoryProductCounts'] });
    } catch (error) {
      console.error('Error duplicating product:', error);
      toast.error('Failed to duplicate product');
    }
  };

  const handleDeleteProduct = async (product: any) => {
    if (!product) return;

    const confirmed = window.confirm(
      `Delete "${product.name}"? This action cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', product.id);

      if (error) throw error;

      toast.success('Product deleted successfully');
      
      queryClient.invalidateQueries({ queryKey: ['productsByCategories'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['categoryProductCounts'] });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };




  // Format variant label from attributes or fall back to variant_name
  const formatVariantLabel = (variant: any): string => {
    if (variant.variant_attributes) {
      try {
        const attrs = typeof variant.variant_attributes === 'string' 
          ? JSON.parse(variant.variant_attributes)
          : variant.variant_attributes;
        
        if (attrs && typeof attrs === 'object' && Object.keys(attrs).length > 0) {
          return Object.entries(attrs)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ');
        }
      } catch (e) {
        console.error('Error parsing variant attributes:', e);
      }
    }
    return variant.variant_name || 'Unnamed variant';
  };

  const getStockStatusDotColor = (quantity: number, minLevel: number) => {
    const qty = Number(quantity);
    const min = Number(minLevel);
    if (qty === 0) return 'bg-red-500';
    if (qty > 0 && qty <= min) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const formatStockQuantity = (quantity: number) => {
    return new Intl.NumberFormat('en-US').format(Number(quantity) || 0);
  };

  // Row indicator helpers
  const getRowIndicators = (product: any) => {
    const indicators: Array<{ type: string; color: string; label: string }> = [];
    
    const qty = Number(product.quantity_in_stock) || 0;
    const minLevel = Number(product.minimum_stock_level) || 0;
    

    
    // Missing SKU
    if (!product.sku || product.sku === '---') {
      indicators.push({ type: 'missing-sku', color: 'bg-yellow-500', label: 'Missing SKU' });
    }
    
    // Unassigned category
    if (!product.category_id || !product.category_name) {
      indicators.push({ type: 'no-category', color: 'bg-purple-500', label: 'No Category' });
    }
    
    // Recently added (within last 7 days)
    if (product.created_at) {
      const daysSinceAdded = (Date.now() - new Date(product.created_at).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceAdded <= 7) {
        indicators.push({ type: 'recent', color: 'bg-green-500', label: 'Recently Added' });
      }
    }
    
    // Price mismatch (cost >= price)
    const cost = Number(product.purchase_price) || 0;
    const price = Number(product.sale_price) || 0;
    if (cost > 0 && price > 0 && cost >= price) {
      indicators.push({ type: 'price-mismatch', color: 'bg-pink-500', label: 'Price Issue' });
    }
    
    return indicators;
  };

  // Helper to check if column should be visible
  // Now uses user preferences instead of view configs
  const isColumnVisible = (column: string): boolean => {
    // Special handling for SKU column - respect showSKUColumn state
    if (column === 'sku' && !showSKUColumn) {
      return false;
    }
    return visibleColumns.includes(column);
  };

  // Helper to get ordered visible columns
  const getOrderedVisibleColumns = React.useMemo(() => {
    // Filter visible columns based on visibility check (inline logic to avoid function dependency)
    let visible = visibleColumns.filter(col => {
      // Special handling for SKU column - respect showSKUColumn state
      if (col === 'sku' && !showSKUColumn) {
        return false;
      }
      return true;
    });

    // If we have a column order, use it to order the visible columns
    if (columnOrder && columnOrder.length > 0 && viewMode !== 'daily-ops') {
      // Start with columns in the stored order that are also visible
      const ordered = columnOrder.filter(col => visible.includes(col));
      // Add any visible columns that aren't in the order (newly added columns)
      const unordered = visible.filter(col => !columnOrder.includes(col));
      return [...ordered, ...unordered];
    }
    
    // No order stored or in daily ops mode, return visible columns as-is
    return visible;
  }, [visibleColumns, columnOrder, showSKUColumn, viewMode]);

  // Helper to render column header
  const renderColumnHeader = (columnId: string) => {
    const columnConfigs: Record<string, { label: string; sortKey?: string; align?: 'left' | 'center' | 'right'; responsive?: string; width?: string }> = {
      'urgency': { label: '', sortKey: 'urgency', align: 'center', width: 'w-12' }, // Icon-only column
      'sku': { label: 'SKU', sortKey: 'sku', align: 'left' }, // Always visible - critical identifier
      'barcode': { label: 'Barcode', align: 'left', responsive: 'hidden md:table-cell' },
      'description': { label: 'Description', align: 'left', responsive: 'hidden lg:table-cell' },
      'category_name': { label: 'Category', sortKey: 'name', align: 'left' }, // Always visible - critical identifier
      'name': { label: 'Product', sortKey: 'name', align: 'left', width: 'w-1/3' }, // Always visible - critical column
      'warehouses': { label: 'Warehouses', sortKey: 'warehouses', align: 'left', responsive: 'hidden md:table-cell', width: 'w-1/8' },
      'storage': { label: 'Storage', sortKey: 'warehouses', align: 'left', responsive: 'hidden md:table-cell', width: 'w-1/8' },
      'stock': { label: 'Stock', sortKey: 'stock', align: 'left', width: 'w-1/8' }, // Always visible - critical column
      'reorder': { label: 'Reorder', align: 'left', responsive: 'hidden lg:table-cell' },
      'data_health': { label: 'Data Health', align: 'left', responsive: 'hidden lg:table-cell' },
      'minimum_stock_level': { label: 'Min. Level', sortKey: 'minimum_stock_level', align: 'left', responsive: 'hidden sm:table-cell' },
      'purchase_price': { label: 'Cost', sortKey: 'purchase_price', align: 'left', responsive: 'hidden sm:table-cell', width: 'w-1/8' },
      'sale_price': { label: 'Price', sortKey: 'sale_price', align: 'left', responsive: 'hidden sm:table-cell', width: 'w-1/8' },
      'unit_price': { label: 'Unit Price', sortKey: 'unit_price', align: 'left', responsive: 'hidden lg:table-cell' },
    };

    const config = columnConfigs[columnId];
    if (!config) {
      // Return empty header to maintain column alignment (should not happen if getOrderedVisibleColumns is correct)
      return (
        <th
          key={columnId}
          className="px-3 sm:px-4 py-3 border-r border-gray-200 border-b-2 border-gray-300"
        />
      );
    }

    const isSortable = !!config.sortKey;
    const sortKey = config.sortKey || columnId;
    
    return (
      <th
        key={columnId}
        className={cn(
          config.align === 'center' ? 'text-center' : config.align === 'right' ? 'text-right' : 'text-left',
          config.width || '',
          config.responsive || '',
          "px-3 sm:px-4 py-3 text-sm font-bold text-gray-900 uppercase tracking-wider whitespace-nowrap border-r border-gray-200 border-b-2 border-gray-300",
          isSortable && "cursor-pointer hover:bg-gray-100 transition-colors touch-manipulation min-h-[44px] sm:min-h-0"
        )}
        onClick={isSortable ? () => handleSort(sortKey) : undefined}
      >
        <div className={cn(
          "flex items-center",
          config.align === 'center' && "justify-center",
          config.align === 'right' && "justify-end"
        )}>
          {config.label}
          {isSortable && getSortIcon(sortKey)}
        </div>
      </th>
    );
  };

  // Helper to render column cell
  const renderColumnCell = (
    columnId: string, 
    product: any, 
    displayStock: number, 
    stockStatus: string, 
    stockDotColor: string, 
    rowIndicators: Array<{ type: string; color: string; label: string }>,
    isVariant: boolean = false,
    parentProduct?: any,
    hasVariants?: boolean,
    variantCount?: number,
    variantIndex?: number,
    isLastVariant?: boolean
  ): React.ReactNode => {
    // Note: Visibility is already filtered by getOrderedVisibleColumns
    switch (columnId) {
      case 'urgency': {
        const urgencyScore = getUrgencyScore(product);
        const getUrgencyIcon = () => {
          if (urgencyScore >= 80) {
            return <AlertCircle className="w-4 h-4 text-red-600" />;
          } else if (urgencyScore >= 50) {
            return <AlertTriangle className="w-4 h-4 text-orange-600" />;
          } else if (urgencyScore > 0) {
            return <AlertCircle className="w-4 h-4 text-yellow-600" />;
          }
          return <Check className="w-4 h-4 text-green-600" />;
        };
        
        return (
          <td className={cn(
            "text-center w-12 px-2 py-0 border-r border-gray-100",
            isVariant && "bg-[#F9FAFB]"
          )}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Filter by urgency level - could add filter logic here
                    }}
                  >
                    {getUrgencyIcon()}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-xs space-y-1">
                    <p className="font-medium">Urgency: {urgencyScore >= 80 ? 'Critical' : urgencyScore >= 50 ? 'High' : urgencyScore > 0 ? 'Medium' : 'Low'}</p>
                    {urgencyScore >= 80 && <p>Out of stock or critical issues</p>}
                    {urgencyScore >= 50 && urgencyScore < 80 && <p>Low stock or missing data</p>}
                    {urgencyScore > 0 && urgencyScore < 50 && <p>Minor issues</p>}
                    {urgencyScore === 0 && <p>No issues</p>}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </td>
        );
      }

      case 'sku': {
        const productHasVariants = !product.is_variant && (variantCounts.get(product.id) ?? 0) > 0;
        const productVariants = productHasVariants ? (variantsByParentId.get(product.id) || []) : [];
        const hasDifferentSKUs = productHasVariants && productVariants.length > 0 && 
          new Set(productVariants.map((v: any) => v.variant_sku || v.sku).filter(Boolean)).size > 1;
        
        if (isVariant) {
          return (
            <td className={cn(
              "text-left relative z-10 bg-blue-50/20",
              "px-3 sm:px-4 py-0 border-r border-gray-100"
            )}>
              <ActionableSKU
                product={product}
                isVariant={true}
                parentProduct={parentProduct}
                compactMode={compactMode}
                onUpdateSKU={handleUpdateSKU}
              />
            </td>
          );
        }
        
        return (
          <td className={cn(
            "text-left relative z-10 align-middle",
            "px-3 sm:px-4 py-0 border-r border-gray-100"
          )}>
            <div className="flex items-center gap-1.5">
              {productHasVariants && hasDifferentSKUs ? (
                <span className={cn(
                  compactMode ? "text-xs" : "text-sm",
                  "text-gray-900"
                )}>
                  Multiple
                </span>
              ) : (
                <ActionableSKU
                  product={product}
                  isVariant={false}
                  compactMode={compactMode}
                  onUpdateSKU={handleUpdateSKU}
                />
              )}
            </div>
          </td>
        );
      }

      case 'barcode':
        if (isVariant) {
          const hasVariantBarcode = !!(product.variant_barcode || product.barcode);
          const hasParentBarcode = parentProduct && !!parentProduct.barcode;
          const variantMatchesParent = hasVariantBarcode && hasParentBarcode && (product.variant_barcode || product.barcode) === parentProduct.barcode;
          const showNoBarcode = (!hasVariantBarcode && !hasParentBarcode) || variantMatchesParent;
          return (
            <td className={cn(
              "text-left relative z-10 hidden md:table-cell align-middle bg-blue-50/40",
              "pl-8 sm:pl-10 pr-3 sm:pr-4 py-0 border-r border-gray-100"
            )}>
              {showNoBarcode ? (
                <span className={cn(
                  "text-gray-400 opacity-60",
                  compactMode ? "text-[10px]" : "text-xs"
                )}>
                  No Barcode
                </span>
              ) : (
                <span className={cn(
                  "font-mono",
                  !hasVariantBarcode ? "text-gray-400 opacity-60" : "text-gray-600",
                  compactMode ? "text-xs" : "text-sm"
                )}>
                  {product.variant_barcode || product.barcode || (
                    <span className={cn(
                      "text-gray-400 opacity-60",
                      compactMode ? "text-[10px]" : "text-xs"
                    )}>
                      No Barcode
                    </span>
                  )}
                </span>
              )}
            </td>
          );
        }
        return (
          <td className={cn(
            "text-left relative z-10 hidden md:table-cell align-middle",
            "px-3 sm:px-4 py-0 border-r border-gray-100"
          )}>
            {!product.barcode ? (
              <span className={cn(
                "text-gray-400 opacity-60",
                compactMode ? "text-[10px]" : "text-xs"
              )}>
                No Barcode
              </span>
            ) : (
              <span className={cn(
                "font-mono text-gray-900",
                compactMode ? "text-xs" : "text-sm"
              )}>
                {product.barcode}
              </span>
            )}
          </td>
        );

      case 'description':
        return (
          <td className={cn(
            "text-left relative z-10 hidden lg:table-cell align-middle",
            "px-3 sm:px-4 py-0 border-r border-gray-100"
          )}>
            {!isVariant && (
              <span className={cn(
                "text-gray-600 truncate max-w-xs block",
                !product.description && "text-gray-400 italic",
                compactMode ? "text-xs" : "text-sm"
              )}>
                {product.description || 'No description'}
              </span>
            )}
          </td>
        );

      case 'category_name': {
        const flatCategories = flattenCategoryTree(tree);
        return (
          <td className={cn(
            "text-left relative z-10 align-middle",
            isVariant && "bg-[#F9FAFB]",
            "px-3 sm:px-4 py-0 border-r border-gray-100"
          )}>
            <CategoryColumn
              product={product}
              categoryId={product.category_id}
              categoryName={product.category_name}
              isVariant={isVariant}
              parentProduct={parentProduct}
              compactMode={compactMode}
              onAssignCategory={handleAssignCategory}
              tree={tree}
              categories={flatCategories}
            />
          </td>
        );
      }

      case 'name': {
        if (isVariant) {
          const variantLabel = formatVariantLabel(product);
          
          return (
            <td className={cn(
              "w-1/4 relative z-10 align-middle bg-[#F9FAFB]",
              "px-3 sm:px-4 py-0 border-r border-gray-100"
            )}>
              <div className="flex items-center relative h-8">
                {/* Horizontal line connecting to variant name - aligned with vertical center */}
                <div className="absolute left-0 top-0 bottom-0 flex items-center pointer-events-none" style={{ width: '2.75rem' }}>
                  <div 
                    className="absolute left-[2.75rem] sm:left-[2.25rem] top-1/2 w-4 h-px bg-gray-300 -translate-y-1/2"
                  />
                </div>
                {/* Variant name aligned with parent name start position */}
                <h3 className={cn(
                  "font-normal text-gray-600 relative z-10",
                  compactMode ? "text-xs" : "text-sm",
                  "pl-[2.75rem] sm:pl-[2.25rem]"
                )}>
                  {variantLabel}
                </h3>
              </div>
            </td>
          );
        }
        // For parent products, check if they have variants
        const productHasVariants = hasVariants !== undefined ? hasVariants : (!product.is_variant && product.id && (variantCounts.get(String(product.id)) ?? 0) > 0);
        const productVariantCount = variantCount !== undefined ? variantCount : (productHasVariants ? (variantCounts.get(String(product.id)) ?? 0) : 0);
        const productIsExpanded = productHasVariants && expandedProductIds.has(product.id);
        return (
          <td className={cn(
            "w-1/4 relative z-10 overflow-visible align-middle",
            "px-3 sm:px-4 py-0 border-r border-gray-100"
          )}>
            {/* Expansion chevron - positioned in left padding */}
            {productHasVariants && (
              <div 
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 flex items-center justify-center flex-shrink-0 z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleProductExpansion(product.id);
                }}
                data-interactive
              >
                <div className="flex items-center justify-center w-8 h-8 sm:w-5 sm:h-5 rounded-md bg-blue-50 group-hover:bg-blue-100 transition-colors cursor-pointer touch-manipulation">
                  {productIsExpanded ? (
                    <ChevronDown className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-blue-600" />
                  ) : (
                    <ChevronRight className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-blue-600" />
                  )}
                </div>
              </div>
            )}
            <div className={cn(
              "flex items-center",
              compactMode ? "gap-1" : "gap-1.5 sm:gap-2",
              // Reserve space for chevron to align all product names
              "pl-[2.75rem] sm:pl-[2.25rem]"
            )}>
              {product.image_url && (
                <div 
                  className={cn("flex-shrink-0 relative group z-[9999]", "w-6 h-6")} 
                  onClick={(e) => e.stopPropagation()} 
                  onMouseEnter={() => setHoveredImageProductId(product.id)}
                  onMouseLeave={() => setHoveredImageProductId(null)}
                  data-interactive
                >
                  <div className={cn("bg-gray-50 rounded-lg border flex items-center justify-center overflow-visible", "w-6 h-6")}>
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover rounded cursor-pointer transition-transform duration-300 ease-in-out group-hover:scale-[4] relative group-hover:shadow-2xl"
                      onClick={() => handleImagePreview(product.image_url)}
                    />
                  </div>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className={cn(
                  "flex items-center flex-wrap",
                  compactMode ? "gap-1" : "gap-1.5"
                )}>
                  {/* Parent text - font-weight 600 for parent rows */}
                  <h3 
                    className={cn(
                      productHasVariants ? "font-semibold" : "font-semibold",
                      productHasVariants ? (compactMode ? "text-sm" : "text-base") : (compactMode ? "text-xs" : "text-sm"),
                      "text-gray-900 truncate"
                    )} 
                    style={productHasVariants ? { fontWeight: 600 } : undefined}
                  >
                    {product.name}
                    {productHasVariants && productVariantCount > 0 && (
                      <span className="ml-2 text-[10px] font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200" style={{ marginLeft: '8px' }}>
                        {productVariantCount} variant{productVariantCount !== 1 ? 's' : ''}
                      </span>
                    )}
                  </h3>
                  <div className="flex items-center gap-1 ml-1">
               
                    {rowIndicators.filter(i => ['price-mismatch'].includes(i.type)).map((indicator, idx) => (
                      <TooltipProvider key={idx}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge 
                              variant="default" 
                              className={cn(
                                "text-[9px] px-1 py-0 h-4 border",
                                indicator.type === 'price-mismatch' && "bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-50"
                              )}
                            >
                              {indicator.type === 'price-mismatch' && '⚠️'}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{indicator.label}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </td>
        );
      }

      case 'warehouses':
      case 'storage': {
        const warehouseName = product.warehouse_name;
        return (
          <td className={cn(
            "text-left w-1/8 hidden md:table-cell relative z-10 align-left",
            isVariant && "bg-[#F9FAFB]",
            "px-3 sm:px-4 py-0 border-r border-gray-100"
          )}>
            <StorageColumn
              product={product}
              warehouseName={warehouseName}
              isVariant={isVariant}
              parentProduct={parentProduct}
              compactMode={compactMode}
              onAssignWarehouse={handleAssignWarehouse}
              warehouses={warehouses}
            />
          </td>
        );
      }

      case 'minimum_stock_level':
        return (
          <td className={cn(
            "text-left hidden sm:table-cell",
            "px-3 sm:px-4 py-0.5 align-middle border-r border-gray-100"
          )}>
            <div className="flex items-center justify-end">
              <span className={cn(
                "text-gray-600 font-mono",
                "text-sm"
              )}>
                {formatStockQuantity(product.minimum_stock_level || 0)}
              </span>
            </div>
          </td>
        );

      case 'stock':
        const stockValue = isVariant ? Number(product.quantity_in_stock) || 0 : displayStock;
        const stockStatusValue = isVariant ? getStockStatus(Number(product.quantity_in_stock) || 0, product.minimum_stock_level || 0) : stockStatus;
        const stockDotColorValue = isVariant ? getStockStatusDotColor(Number(product.quantity_in_stock) || 0, product.minimum_stock_level || 0) : stockDotColor;
        const productHasVariantsForStock = !isVariant && product.id && (variantCounts.get(String(product.id)) ?? 0) > 0;
        const isAggregatedTotal = productHasVariantsForStock && displayStock !== (Number(product.quantity_in_stock) || 0);
        // Note: Trend calculation would require fetching transactions - making it optional for now
        const trend = null; // Could be calculated if transactions are available
        // Get days out of stock for this product
        const daysOut = daysOutOfStockMap.get(product.id) ?? null;
        const productWithDaysOut = { ...product, daysOutOfStock: daysOut };
        
        return (
          <EnhancedStockColumn
            product={productWithDaysOut}
            stockValue={stockValue}
            stockStatus={stockStatusValue}
            stockDotColor={stockDotColorValue}
            minimumStockLevel={product.minimum_stock_level || 0}
            isVariant={isVariant}
            isAggregatedTotal={isAggregatedTotal}
            compactMode={compactMode}
            isMobile={isMobile}
            trend={trend}
            onAdjustStock={(p) => handleStockAction(p, 'in')}
            formatStockQuantity={formatStockQuantity}
          />
        );

      case 'purchase_price':
        return (
          <td className={cn(
            "text-right w-1/8 hidden sm:table-cell",
            "px-3 sm:px-4 py-0.5 align-middle border-r border-gray-100"
          )}>
            <div className={cn(
              "flex items-center justify-left",
              getPriceColor(product.purchase_price, 'text-gray-900'),
              "font-medium font-mono",
              "text-sm"
            )}>
              ${product.purchase_price ? Number(product.purchase_price).toFixed(2) : '0.00'}
            </div>
          </td>
        );

      case 'sale_price':
        if (isVariant) {
          return (
            <td className={cn(
              "text-right w-1/8 hidden sm:table-cell align-middle bg-blue-50/20",
              "px-3 sm:px-4 py-0 border-r border-gray-100"
            )}>
              <div className={cn(
                "flex items-center justify-left gap-2",
                getPriceColor(product.sale_price, 'text-green-600'),
                "font-medium font-mono",
                "text-sm"
              )}>
                <span>
                  ${product.sale_price ? Number(product.sale_price).toFixed(2) : '0.00'}
                </span>
                <button
                  data-interactive
                  onClick={(e) => {
                    e.stopPropagation();
                    handleProductEdit(product);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-blue-900 rounded flex items-center justify-center"
                  aria-label="Quick edit variant"
                >
                  <Edit className={cn(
                    "text-blue-600",
                    "w-3.5 h-3.5"
                  )} />
                </button>
              </div>
            </td>
          );
        }
        return (
          <td className={cn(
            "text-left w-1/8 hidden sm:table-cell align-middle",
            "px-3 sm:px-4 py-0 border-r border-gray-100"
          )}>
            <div className={cn(
              "flex items-center justify-left gap-2",
              getPriceColor(product.sale_price, 'text-green-600'),
              "font-medium font-mono",
              "text-sm"
            )}>
              <span>
                ${product.sale_price ? Number(product.sale_price).toFixed(2) : '0.00'}
              </span>
              <button
                data-interactive
                onClick={(e) => {
                  e.stopPropagation();
                  handleProductEdit(product);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded flex items-center justify-center"
                aria-label="Quick edit product"
              >
                <Edit className={cn(
                  "text-blue-600",
                  "w-3.5 h-3.5"
                )} />
              </button>
            </div>
          </td>
        );

      case 'unit_price':
        return (
          <td className={cn(
            "text-left hidden lg:table-cell align-middle",
            "px-3 sm:px-4 py-0 border-r border-gray-100"
          )}>
            <div className={cn(
              "flex items-center justify-left",
              getPriceColor(product.unit_price, 'text-gray-900'),
              "font-medium font-mono",
              "text-sm"
            )}>
              ${product.unit_price ? Number(product.unit_price).toFixed(2) : '0.00'}
            </div>
          </td>
        );

      case 'reorder':
        if (isVariant) {
          return (
            <td className={cn(
              "text-left hidden lg:table-cell align-middle bg-blue-50/20",
              "px-3 sm:px-4 py-0 border-r border-gray-100"
            )}>
              <span className="text-xs text-gray-400">Inherited</span>
            </td>
          );
        }
        return (
          <ReorderColumn
            product={product}
            compactMode={compactMode}
            onCreatePO={(p, qty) => handleCreatePO(p)}
            onSetRule={(p) => {
              setProductsForPanel([p]);
              setIsReorderRulePanelOpen(true);
            }}
          />
        );

      case 'data_health':
        if (isVariant) {
          return (
            <td className={cn(
              "text-left hidden lg:table-cell align-middle bg-blue-50/20",
              "px-3 sm:px-4 py-0 border-r border-gray-100"
            )}>
              <span className="text-xs text-gray-400">Inherited</span>
            </td>
          );
        }
        return (
          <td 
            className={cn(
              "text-left hidden lg:table-cell align-middle",
              "px-3 sm:px-4 py-0 border-r border-gray-100"
            )}
            onClick={(e) => {
              if (viewMode === 'daily-ops') {
                e.stopPropagation();
                setProductsForPanel([product]);
              }
            }}
          >
         
          </td>
        );

      default:
        // Return empty cell to maintain column alignment (should not happen if getOrderedVisibleColumns is correct)
        return (
          <td 
            className={cn(
              "px-3 sm:px-4 py-0 border-r border-gray-100"
            )}
          />
        );
    }
  };

  // Toggle expansion of product row to show/hide variants
  const toggleProductExpansion = useCallback((productId: string) => {
    setExpandedProductIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  }, []);

  // Expand product and scroll to it (used by variant badge click)
  const expandProductAndScroll = useCallback((productId: string) => {
    setExpandedProductIds(prev => new Set(prev).add(productId));
    setTimeout(() => {
      const productElement = document.querySelector(`[data-product-id="${productId}"]`);
      if (productElement) {
        productElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  }, []);

  // Handler for barcode detection (when adding products)
  const handleBarcodeDetected = async (barcode: string) => {
    try {
      if (!activeBranch) {
        toast.error('No active branch selected');
        return;
      }

      // Search for product by SKU
      const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .eq('branch_id', activeBranch.branch_id)
        .eq('sku', barcode)
        .limit(1);

      if (error) {
        console.error('Error searching for product:', error);
        toast.error('Error searching for product');
        return;
      }

      if (products && products.length > 0) {
        // Product found - open stock adjustment modal
        const foundProduct: any = products[0];
        setSelectedProduct(foundProduct);
        setIsStockAdjustModalOpen(true);
        setIsBarcodeScannerOpen(false);
        toast.success(`Product found: ${foundProduct?.name || 'Product'}`);
      } else {
        // Product not found - open add product modal with pre-filled SKU
        setScannedSKU(barcode);
        setPreFilledProductName('');
        setIsBarcodeScannerOpen(false);
        navigate('/dashboard/products/new');
        toast.info('Product not found - will create new product');
      }
    } catch (error) {
      console.error('Error processing scanned barcode:', error);
      toast.error('Error processing scanned barcode');
    }
  };

  // Handler for barcode search from search bar (navigate to product in table)
  const handleBarcodeSearch = useCallback(async (barcode: string) => {
    try {
      if (!activeBranch) {
        toast.error('No active branch selected');
        return;
      }

      // Search for product by SKU, barcode, variant_sku, or variant_barcode
      const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .eq('branch_id', activeBranch.branch_id)
        .or(`sku.eq.${barcode},barcode.eq.${barcode},variant_sku.eq.${barcode},variant_barcode.eq.${barcode}`)
        .limit(1);

      if (error) {
        console.error('Error searching for product:', error);
        toast.error('Error searching for product');
        return;
      }

      if (products && products.length > 0) {
        const foundProduct: any = products[0];
        let targetProductId = foundProduct.id;
        let isVariant = foundProduct.is_variant;
        
        // If a variant was found, get its parent product
        if (isVariant && foundProduct.parent_product_id) {
          targetProductId = foundProduct.parent_product_id;
          // Expand the parent product to show variants
          expandProductAndScroll(targetProductId);
        }
        
        // If product has a category and it's not in the current filter, add it to ensure the product is visible
        const productToFilter = isVariant && foundProduct.parent_product_id 
          ? (categoryProducts.find((p: any) => p.id === targetProductId) || foundProduct)
          : foundProduct;
          
        if (productToFilter?.category_id && !selectedCategoryIds.includes(productToFilter.category_id)) {
          // Flatten tree to get flat categories array
          const flatCategories = flattenCategoryTree(tree);
          // Get the category and all its descendants
          const categoryIds = getCategoryIdsIncludingDescendants(productToFilter.category_id, flatCategories);
          // Merge with existing selected categories
          setSelectedCategoryIds([...selectedCategoryIds, ...categoryIds]);
        }
        
        // Set search term to product name to highlight it
        setSearchTerm(foundProduct.name);
        
        // Scroll to the product/variant in the table after a short delay to ensure DOM is updated
        setTimeout(() => {
          const productElement = document.querySelector(`[data-product-id="${foundProduct.id}"]`);
          const variantElement = isVariant ? document.querySelector(`[data-variant-id="${foundProduct.id}"]`) : null;
          const elementToScroll = variantElement || productElement;
          
          if (elementToScroll) {
            elementToScroll.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Highlight the row briefly
            const row = elementToScroll as HTMLElement;
            row.style.backgroundColor = '#dbeafe';
            setTimeout(() => {
              row.style.backgroundColor = '';
            }, 2000);
          }
        }, isVariant ? 500 : 300);
        
        toast.success(`Found: ${foundProduct.name}${isVariant ? ' (variant)' : ''}`);
      } else {
        // Product not found - offer to add it
        setSearchTerm('');
        setScannedSKU(barcode);
        setPreFilledProductName('');
        navigate('/dashboard/products/new');
        toast.info('Product not found - will create new product');
      }
    } catch (error) {
      console.error('Error processing barcode search:', error);
      toast.error('Error processing barcode search');
    }
  }, [activeBranch, selectedCategoryIds, tree, categoryProducts, expandProductAndScroll]);

  // Detect if input looks like a barcode (numeric, 8-13 digits or alphanumeric)
  const isBarcodePattern = (input: string): boolean => {
    // Remove whitespace
    const cleaned = input.trim();
    // Check if it's all numeric and 8-13 digits (common barcode lengths)
    if (/^\d{8,13}$/.test(cleaned)) {
      return true;
    }
    // Check if it's alphanumeric and looks like a barcode (e.g., EAN-13 with check digit)
    if (/^[A-Z0-9]{8,20}$/i.test(cleaned) && cleaned.length >= 8) {
      return true;
    }
    return false;
  };

  // Handle search input with command palette functionality
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  // Handle search submission (Enter key or blur)
  const handleSearchSubmit = (value: string) => {
    const trimmed = value.trim();
    
    if (!trimmed) {
      setSearchTerm('');
      return;
    }

    // Check for barcode pattern
    if (isBarcodePattern(trimmed)) {
      handleBarcodeSearch(trimmed);
      return;
    }

    // Otherwise, just set as normal search term
    setSearchTerm(trimmed);
  };

  // Handle product click from search results
  const handleSearchProductClick = (product: any) => {
    // If product has a category and it's not in the current filter, add it
    if (product.category_id && !selectedCategoryIds.includes(product.category_id)) {
      const flatCategories = flattenCategoryTree(tree);
      const categoryIds = getCategoryIdsIncludingDescendants(product.category_id, flatCategories);
      setSelectedCategoryIds([...selectedCategoryIds, ...categoryIds]);
    }
    
    // Set search term to product name to highlight it
    setSearchTerm(product.name);
    
    // Scroll to the product in the table after a short delay
    setTimeout(() => {
      const productElement = document.querySelector(`[data-product-id="${product.id}"]`);
      if (productElement) {
        productElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const row = productElement as HTMLElement;
        row.style.backgroundColor = '#dbeafe';
        setTimeout(() => {
          row.style.backgroundColor = '';
        }, 2000);
      }
    }, 300);
  };

  // Handle category click from search results
  const handleSearchCategoryClick = (categoryId: string) => {
    const flatCategories = flattenCategoryTree(tree);
    const categoryIds = getCategoryIdsIncludingDescendants(categoryId, flatCategories);
    setSelectedCategoryIds([...categoryIds]);
    setSearchTerm('');
  };

  // Handle supplier click from search results
  const handleSearchSupplierClick = (supplierId: string) => {
    // For now, just show a toast - could navigate to supplier page or filter by supplier
    toast.info('Supplier search clicked - filtering by supplier not yet implemented');
    setSearchTerm('');
  };


  const handleSort = (column: string) => {
    if (sortColumn === column) {
      // Toggle direction if clicking the same column
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new column and default to ascending
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (column: string) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="w-3 h-3 ml-1 text-gray-400" />;
    }
    if (sortDirection === 'asc') {
      return <ArrowUp className="w-3 h-3 ml-1 text-blue-600" />;
    }
    return <ArrowDown className="w-3 h-3 ml-1 text-blue-600" />;
  };



  const handleBulkTransferStock = async () => {
    if (selectedProductIds.size === 0) return;

    const newWarehouse = prompt(
      `Enter new warehouse for ${selectedProductIds.size} selected product${selectedProductIds.size !== 1 ? 's' : ''}:`,
      ''
    );

    if (newWarehouse === null) return;

    try {
      const { error } = await supabase
        .from('products')
        .update({ warehouse_name: newWarehouse.trim() || null })
        .in('id', Array.from(selectedProductIds));

      if (error) throw error;

      toast.success(`Updated warehouse for ${selectedProductIds.size} product${selectedProductIds.size !== 1 ? 's' : ''}`);
      setSelectedProductIds(new Set());
      
      queryClient.invalidateQueries({ queryKey: ['productsByCategories'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    } catch (error) {
      console.error('Error transferring stock:', error);
      toast.error('Failed to update product warehouses');
    }
  };



  const handleBulkDeleteProducts = async () => {
    if (selectedProductIds.size === 0) return;

    const confirmed = window.confirm(
      `Delete ${selectedProductIds.size} selected product${selectedProductIds.size !== 1 ? 's' : ''}? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .in('id', Array.from(selectedProductIds));

      if (error) throw error;

      toast.success(`Deleted ${selectedProductIds.size} product${selectedProductIds.size !== 1 ? 's' : ''} successfully`);
      setSelectedProductIds(new Set());
      
      queryClient.invalidateQueries({ queryKey: ['productsByCategories'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['categoryProductCounts'] });
    } catch (error) {
      console.error('Error deleting products:', error);
      toast.error('Failed to delete products');
    }
  };

  const handleBulkEditCategory = async () => {
    if (selectedProductIds.size === 0) return;
    const selectedProducts = sortedProducts.filter((p: any) => selectedProductIds.has(p.id));
    setProductsForPanel(selectedProducts);
  };

  const handleBulkEditCategoryLegacy = async () => {
    if (selectedProductIds.size === 0) return;

    // Get flat categories for selection
    const flatCategories = flattenCategoryTree(tree);
    
    // Show a simple selection dialog - in a real app, you might want a proper modal
    const categoryOptions = flatCategories.map(cat => {
      const path = getCategoryPath(cat.id, flatCategories);
      return { id: cat.id, name: path };
    });

    const categoryList = categoryOptions.map((cat, idx) => `${idx + 1}. ${cat.name}`).join('\n');
    const selected = prompt(
      `Select category for ${selectedProductIds.size} product${selectedProductIds.size !== 1 ? 's' : ''}:\n\n${categoryList}\n\nEnter category number or leave empty to uncategorize:`,
      ''
    );

    if (selected === null) return;

    let categoryId: string | null = null;
    if (selected.trim()) {
      const index = parseInt(selected.trim()) - 1;
      if (index >= 0 && index < categoryOptions.length) {
        categoryId = categoryOptions[index].id;
      } else {
        toast.error('Invalid category selection');
        return;
      }
    }

    try {
      const { error } = await supabase
        .from('products')
        .update({ category_id: categoryId })
        .in('id', Array.from(selectedProductIds));

      if (error) throw error;

      toast.success(`Updated category for ${selectedProductIds.size} product${selectedProductIds.size !== 1 ? 's' : ''}`);
      setSelectedProductIds(new Set());
      
      queryClient.invalidateQueries({ queryKey: ['productsByCategories'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['categoryProductCounts'] });
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Failed to update product categories');
    }
  };

  const handleBulkAdjustStock = async () => {
    if (selectedProductIds.size === 0) return;

    const adjustment = prompt(
      `Adjust stock for ${selectedProductIds.size} product${selectedProductIds.size !== 1 ? 's' : ''}:\n\nEnter adjustment amount (positive to add, negative to subtract, e.g., +10 or -5):`,
      '+0'
    );

    if (adjustment === null) return;

    const adjustmentValue = parseInt(adjustment.trim());
    if (isNaN(adjustmentValue)) {
      toast.error('Invalid adjustment amount');
      return;
    }

    try {
      const selectedProducts = sortedProducts.filter((p: any) => selectedProductIds.has(p.id));
      
      // Update each product individually to handle current stock
      const updates = selectedProducts.map(async (product: any) => {
        const currentStock = Number(product.quantity_in_stock) || 0;
        const newStock = Math.max(0, currentStock + adjustmentValue);

        const { error } = await supabase
          .from('products')
          .update({ quantity_in_stock: newStock })
          .eq('id', product.id);

        if (error) throw error;
      });

      await Promise.all(updates);

      toast.success(`Adjusted stock for ${selectedProductIds.size} product${selectedProductIds.size !== 1 ? 's' : ''}`);
      setSelectedProductIds(new Set());
      
      queryClient.invalidateQueries({ queryKey: ['productsByCategories'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    } catch (error) {
      console.error('Error adjusting stock:', error);
      toast.error('Failed to adjust stock');
    }
  };

  const handleBulkArchive = async () => {
    if (selectedProductIds.size === 0) return;

    const confirmed = window.confirm(
      `Archive ${selectedProductIds.size} selected product${selectedProductIds.size !== 1 ? 's' : ''}? Archived products will be hidden from normal views.`
    );

    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from('products')
        .update({ status: 'archived' })
        .in('id', Array.from(selectedProductIds));

      if (error) throw error;

      toast.success(`Archived ${selectedProductIds.size} product${selectedProductIds.size !== 1 ? 's' : ''}`);
      setSelectedProductIds(new Set());
      
      queryClient.invalidateQueries({ queryKey: ['productsByCategories'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['categoryProductCounts'] });
    } catch (error) {
      console.error('Error archiving products:', error);
      toast.error('Failed to archive products');
    }
  };

  const handleBulkExport = async () => {
    if (selectedProductIds.size === 0) return;

    try {
      const selectedProducts = sortedProducts.filter((p: any) => selectedProductIds.has(p.id));
      
      // Create CSV data
      const csvHeaders = ['Name', 'SKU', 'Barcode', 'Category', 'Warehouse', 'Stock', 'Cost', 'Price', 'Description'];
      const csvData = selectedProducts.map((product: any) => [
        product.name || '',
        product.sku || '',
        product.barcode || '',
        product.category_name || '',
        product.warehouse_name || '',
        product.quantity_in_stock || 0,
        product.purchase_price || 0,
        product.sale_price || 0,
        product.description || ''
      ]);

      const csvContent = [csvHeaders, ...csvData]
        .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        .join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `products_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`Exported ${selectedProductIds.size} product${selectedProductIds.size !== 1 ? 's' : ''} to CSV`);
    } catch (error) {
      console.error('Error exporting products:', error);
      toast.error('Failed to export products');
    }
  };

  const handleUpdateSKU = async (productId: string, sku: string) => {
    try {
      const product = sortedProducts.find((p: any) => p.id === productId);
      if (!product) return;

      // Determine if this is a variant and update the appropriate field
      const updateData: { sku?: string; variant_sku?: string } = {};
      
      if (product.is_variant) {
        updateData.variant_sku = sku || null;
      } else {
        updateData.sku = sku || null;
      }

      const { error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', productId);

      if (error) throw error;

      toast.success('SKU updated successfully');
      queryClient.invalidateQueries({ queryKey: ['productsByCategories'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    } catch (error) {
      console.error('Error updating SKU:', error);
      toast.error('Failed to update SKU');
      throw error;
    }
  };

  const handleBulkGenerateSKUs = async () => {
    if (selectedProductIds.size === 0) return;

    try {
      const selectedProducts = sortedProducts.filter((p: any) => selectedProductIds.has(p.id));
      
      const updates = selectedProducts.map(async (product: any) => {
        if (product.sku && product.sku !== '---') return; // Skip if already has SKU

        const namePrefix = (product.name || 'PROD').substring(0, 3).toUpperCase().replace(/[^A-Z0-9]/g, '');
        const idSuffix = product.id.substring(0, 8).toUpperCase();
        const generatedSKU = `${namePrefix}-${idSuffix}`;

        const { error } = await supabase
          .from('products')
          .update({ sku: generatedSKU })
          .eq('id', product.id);

        if (error) throw error;
      });

      await Promise.all(updates);

      toast.success(`Generated SKUs for ${selectedProductIds.size} product${selectedProductIds.size !== 1 ? 's' : ''}`);
      setSelectedProductIds(new Set());
      queryClient.invalidateQueries({ queryKey: ['productsByCategories'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    } catch (error) {
      console.error('Error generating SKUs:', error);
      toast.error('Failed to generate SKUs');
    }
  };

  const handleAssignWarehouse = async (productId: string, warehouseName: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ warehouse_name: warehouseName || null })
        .eq('id', productId);

      if (error) throw error;

      toast.success('Warehouse assigned successfully');
      queryClient.invalidateQueries({ queryKey: ['productsByCategories'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    } catch (error) {
      console.error('Error assigning warehouse:', error);
      toast.error('Failed to assign warehouse');
    }
  };

  const handleAssignCategory = async (productId: string, categoryId: string | null, categoryName: string | null) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ 
          category_id: categoryId,
          category_name: categoryName
        })
        .eq('id', productId);

      if (error) throw error;

      toast.success(categoryName ? `Category set to ${categoryName}` : 'Category removed');
      queryClient.invalidateQueries({ queryKey: ['productsByCategories'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['categoryProductCounts'] });
    } catch (error) {
      console.error('Error assigning category:', error);
      toast.error('Failed to assign category');
    }
  };


  // Export all products (not just selected ones)
  const handleExportAll = async () => {
    try {
      // Use the products from the current view (respecting all filters)
      const productsToExport = filteredProducts;
      
      if (productsToExport.length === 0) {
        toast.error('No products to export');
        return;
      }
      
      // Create CSV data
      const csvHeaders = ['Name', 'SKU', 'Barcode', 'Category', 'Warehouse', 'Stock', 'Cost', 'Price', 'Description'];
      const csvData = productsToExport.map((product: any) => [
        product.name || '',
        product.sku || '',
        product.barcode || '',
        product.category_name || '',
        product.warehouse_name || '',
        product.quantity_in_stock || 0,
        product.purchase_price || 0,
        product.sale_price || 0,
        product.description || ''
      ]);

      const csvContent = [csvHeaders, ...csvData]
        .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        .join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `products_export_all_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`Exported ${productsToExport.length} product${productsToExport.length !== 1 ? 's' : ''} to CSV`);
    } catch (error) {
      console.error('Error exporting products:', error);
      toast.error('Failed to export products');
    }
  };

  // Handle import button click
  const handleImportClick = () => {
    setIsBulkImportModalOpen(true);
  };

  // Handle import completion
  const handleImportComplete = async () => {
    // Invalidate all relevant queries to refresh the product list
    await queryClient.invalidateQueries({ queryKey: ['productsByCategories'] });
    await queryClient.invalidateQueries({ queryKey: ['products'] });
    await queryClient.invalidateQueries({ queryKey: ['categoryProductCounts'] });
    await queryClient.invalidateQueries({ queryKey: ['categoryAnalytics'] });
    await queryClient.invalidateQueries({ queryKey: ['allProductsAnalyticsWeekAgo'] });
  };

  const handleCustomizationSave = async (icon: string | null, color: string | null) => {
    if (!selectedCategory) return;

    try {
      await updateCategory.mutateAsync({
        categoryId: selectedCategory.id,
        data: {
          icon,
          color,
        },
      });
      toast.success('Category customized successfully!');
      setShowCustomizationModal(false);
    } catch (error) {
      console.error('Error customizing category:', error);
    }
  };

  // Command palette actions
  const commandPaletteActions: CommandPaletteAction[] = React.useMemo(() => {
    const actions: CommandPaletteAction[] = [
      {
        id: 'add-product',
        label: 'Add Product',
        icon: <Plus className="w-4 h-4" />,
        shortcut: '⌘N',
        keywords: ['create', 'new', 'product', 'add'],
        group: 'Products',
        action: () => {
          setScannedSKU('');
          setPreFilledProductName('');
          navigate('/dashboard/products/new');
        },
      },
      {
        id: 'adjust-stock',
        label: 'Adjust Stock',
        icon: <TrendingUp className="w-4 h-4" />,
        keywords: ['stock', 'inventory', 'quantity', 'adjust', 'update'],
        group: 'Inventory',
        action: () => {
          if (selectedProductIds.size > 0) {
            // If products are selected, show bulk stock adjustment
            const firstProduct = sortedProducts.find((p: any) => selectedProductIds.has(p.id));
            if (firstProduct) {
              setSelectedProduct(firstProduct);
              setIsStockAdjustModalOpen(true);
            }
          } else {
            // Open barcode scanner or prompt for SKU
            const sku = prompt('Enter product SKU to adjust stock:');
            if (sku) {
              handleBarcodeSearch(sku);
            }
          }
        },
      },
      {
        id: 'transfer-items',
        label: 'Transfer Items',
        icon: <ArrowRightLeft className="w-4 h-4" />,
        keywords: ['transfer', 'move', 'location', 'relocate'],
        group: 'Inventory',
        action: () => {
          if (selectedProductIds.size > 0) {
            handleBulkTransferStock();
          } else {
            toast.info('Select products first, or use this command after selecting items');
          }
        },
      },
      {
        id: 'view-categories',
        label: 'View Categories',
        icon: <FolderTree className="w-4 h-4" />,
        keywords: ['category', 'categories', 'filter', 'view'],
        group: 'Navigation',
        action: () => {
          // Focus on category filter
          setTimeout(() => {
            const filterElement = document.querySelector('[data-category-filter]');
            if (filterElement) {
              (filterElement as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 100);
        },
      },
      {
        id: 'go-to-warehouse',
        label: 'Go to Warehouse',
        icon: <Warehouse className="w-4 h-4" />,
        keywords: ['warehouse', 'find'],
        group: 'Navigation',
        action: () => {
          const warehouse = prompt('Enter warehouse to search for:');
          if (warehouse && warehouse.trim()) {
            setSelectedWarehouse(warehouse.trim());
            const warehouseProducts = categoryProducts.filter((p: any) =>
              p.warehouse_name?.toLowerCase().includes(warehouse.toLowerCase())
            );
            if (warehouseProducts.length === 0) {
              toast.info(`No products found in warehouse "${warehouse}"`);
            } else {
              toast.success(`Found ${warehouseProducts.length} product(s) in "${warehouse}"`);
            }
          }
        },
      },
      {
        id: 'search-by-sku',
        label: 'Search by SKU',
        icon: <Search className="w-4 h-4" />,
        shortcut: '⌘F',
        keywords: ['sku', 'barcode', 'search', 'find', 'lookup'],
        group: 'Search',
        action: () => {
          const sku = prompt('Enter SKU or barcode to search:');
          if (sku && sku.trim()) {
            handleBarcodeSearch(sku.trim());
          }
        },
      },
      {
        id: 'open-scanner',
        label: 'Open Barcode Scanner',
        icon: <Scan className="w-4 h-4" />,
        keywords: ['scanner', 'barcode', 'scan', 'camera'],
        group: 'Tools',
        action: () => {
          setIsBarcodeScannerOpen(true);
        },
      },
      {
        id: 'toggle-view',
        label: productViewMode === 'table' ? 'Switch to Grid View' : 'Switch to Table View',
        icon: productViewMode === 'table' ? <Grid3x3 className="w-4 h-4" /> : <Table2 className="w-4 h-4" />,
        keywords: ['view', 'grid', 'table', 'toggle'],
        group: 'View',
        action: () => {
          setProductViewMode(productViewMode === 'table' ? 'grid' : 'table');
        },
      },
      {
        id: 'add-category',
        label: 'Add Category',
        icon: <FolderTree className="w-4 h-4" />,
        keywords: ['category', 'create', 'new', 'add'],
        group: 'Categories',
        action: () => {
          handleAddCategory();
        },
      },
    ];

    return actions;
  }, [
    selectedProductIds,
    sortedProducts,
    categoryProducts,
    productViewMode,
    handleBarcodeSearch,
    handleBulkTransferStock,
    handleAddCategory,
  ]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">You are not logged in</p>
        </div>
      </div>
    );
  }

  // Removed showCategoryPane state - no longer needed

  // Compact mode is always true (default) - no longer using localStorage
  // Removed localStorage loading and saving to ensure compact mode is always the default

  // Calculate ops summary counts
  const opsSummaryCounts = React.useMemo(() => {
    const products = filteredProducts;
    let outOfStock = 0;
    let lowStock = 0;
    let missingSetup = 0;
    let overstock = 0;

    products.forEach((product: any) => {
      const qty = Number(product.quantity_in_stock) || 0;
      const minLevel = Number(product.minimum_stock_level) || 0;
      const maxLevel = Number(product.max_stock) || null;
      const hasSKU = !!(product.sku && product.sku !== '---');
      const hasCategory = !!product.category_name;

      if (qty === 0) outOfStock++;
      if (qty > 0 && qty <= minLevel) lowStock++;
      if (!hasSKU || !hasCategory) missingSetup++;
      if (maxLevel !== null && qty > maxLevel) overstock++;
    });

    return { outOfStock, lowStock, missingSetup, overstock };
  }, [filteredProducts]);

  // Handle ops summary filter clicks
  const handleOpsSummaryFilter = (filterType: 'out-of-stock' | 'low-stock' | 'missing-setup' | 'overstock') => {
    const filterMap: Record<string, QuickFilterType> = {
      'out-of-stock': 'out-of-stock',
      'low-stock': 'low-stock',
      'missing-setup': 'missing-data',
      'overstock': 'needs-reorder', // Use needs-reorder as proxy for now
    };
    
    const filter = filterMap[filterType];
    if (filter) {
      if (activeQuickFilters.includes(filter)) {
        setActiveQuickFilters(activeQuickFilters.filter(f => f !== filter));
      } else {
        setActiveQuickFilters([...activeQuickFilters, filter]);
      }
    }
  };

  return (
    <div className={`h-screen ${isMobile ? 'm-2 rounded-lg' : 'm-0 rounded-none'} border border-gray-100 flex flex-col overflow-hidden overscroll-none touch-pan-y`} style={{ touchAction: 'pan-y' }}>




 


      {/* Main Layout with Product Table */}
      <div className="flex-1 flex overflow-hidden min-h-0 relative overscroll-none p-3 md:p-4">
        {/* Main Content - Products Table */}
        <div className="flex-1 flex flex-col overflow-hidden  min-w-0 min-h-0 relative ">
          {/* Search Results Info - Above all other elements */}
          
          {searchTerm && (
            <div className="flex-shrink-0 px-3 md:px-4 py-1.5 bg-blue-50/80 border-b border-blue-100 flex items-center justify-between gap-3 relative z-50">
              <div className="text-sm font-medium text-blue-900">
                {filteredProducts.length > 0 && (
                  <span>{filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found</span>
                )}
                {filteredProducts.length === 0 && (
                  <span className="text-red-600">No results found</span>
                )}
              </div>
              
              {productViewMode === 'table' && (
                <div className="flex items-center gap-2 ml-auto">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2"
                          onClick={() => setShowSKUColumn(!showSKUColumn)}
                        >
                          <Tag className={cn("w-4 h-4", showSKUColumn && "text-blue-600")} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{showSKUColumn ? 'Hide' : 'Show'} SKU Column</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
            </div>
          )}

          {(categoryProducts.length > 0 || productsLoading) ? (
            <>
              {/* Search and Filters Card */}
              <Card className="mb-4">
                <CardContent className="p-3 space-y-3">
                  {/* Row A: Control Bar - Search Bar + Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                    {/* Multi-Intent Search Bar - Full width on mobile */}
                    <div className="flex-1 w-full sm:w-auto">
                      <MultiIntentSearch
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onSubmit={handleSearchSubmit}
                        onProductClick={handleSearchProductClick}
                        onCategoryClick={handleSearchCategoryClick}
                        onSupplierClick={handleSearchSupplierClick}
                        onCreateProduct={() => {
                          setScannedSKU('');
                          setPreFilledProductName('');
                          navigate('/dashboard/products/new');
                        }}
                        onCreateCategory={handleAddCategory}
                        onTokensChange={(tokens) => setSearchTokens(tokens)}
                        placeholder="Search products, SKUs, categories, suppliers… (e.g., stock:low warehouse:A)"
                      />
                    </div>
                    {/* Action Buttons - Stack on mobile, horizontal on desktop */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {selectedProductIds.size > 0 && (
                        <span className="text-xs sm:text-sm font-medium text-gray-600 px-2 py-0.5 sm:px-0 sm:py-0 bg-gray-100 sm:bg-transparent rounded-md sm:rounded-none">
                          {selectedProductIds.size} selected
                        </span>
                      )}
                      <Button
                        variant="default"
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white h-10 sm:h-9 min-h-[44px] sm:min-h-0 touch-manipulation flex-1 sm:flex-initial"
                        onClick={() => {
                          setScannedSKU('');
                          setPreFilledProductName('');
                          navigate('/dashboard/products/new');
                        }}
                      >
                        <Plus className="w-4 h-4 sm:mr-2" />
                        <span className="hidden xs:inline sm:inline">Add Product</span>
                      </Button>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowFilters(!showFilters)}
                              className="gap-2 h-10 sm:h-9 min-h-[44px] sm:min-h-0 touch-manipulation px-3 sm:px-3"
                            >
                              <Filter className="w-4 h-4" />
                              {showFilters ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{showFilters ? 'Hide filters' : 'Show filters'}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setIsColumnVisibilityModalOpen(true)}
                              className="gap-2 h-10 sm:h-9 min-h-[44px] sm:min-h-0 touch-manipulation px-3 sm:px-3"
                            >
                              <Settings className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Customize visible columns</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <Button
                        variant="ghost"
                        className="hidden"
                        size="sm"
                        onClick={() => setProductViewMode(productViewMode === 'table' ? 'grid' : 'table')}
                      >
                        {productViewMode === 'table' ? (
                          <>
                            <Grid3x3 className="w-4 h-4 mr-2" />
                            Grid
                          </>
                        ) : (
                          <>
                            <Table2 className="w-4 h-4 mr-2" />
                            Table
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Quick Filters with Category and Warehouse Dropdowns */}
                  {showFilters && (
                  <div className="flex items-center justify-between gap-3 pt-2 border-t">
                    {/* Quick Filters on the left */}
                    <div className="flex-1 min-w-0">
                      <QuickFilters
                        activeFilters={activeQuickFilters}
                        onFilterToggle={(filter) => {
                          setActiveQuickFilters(prev => 
                            prev.includes(filter) 
                              ? prev.filter(f => f !== filter)
                              : [...prev, filter]
                          );
                        }}
                        onClearAll={() => setActiveQuickFilters([])}
                        lowStockCount={dashboardMetrics.lowStockCount}
                        outOfStockCount={dashboardMetrics.outOfStockCount}
                        missingDataCount={categoryProducts.filter((p: any) => 
                          !p.sku || p.sku === '---' || !p.category_name
                        ).length}
                        needsReorderCount={categoryProducts.filter((p: any) => {
                          const qty = Number(p.quantity_in_stock) || 0;
                          const minLevel = Number(p.minimum_stock_level) || 0;
                          return qty > 0 && qty <= minLevel;
                        }).length}
                      />
                    </div>
                    
                    {/* Category and Warehouse Dropdowns on the right */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Category Quick Selector */}
                    <Popover open={isCategoryPopoverOpen} onOpenChange={setIsCategoryPopoverOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs justify-between"
                        >
                          <div className="flex items-center gap-1.5">
                            <Package className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate max-w-[120px]">
                              {selectedCategoryIds.length === 0 ? (
                                'All Categories'
                              ) : selectedCategoryIds.length === 1 ? (
                                selectedCategoryNames[0] || '1 Category'
                              ) : (
                                `${selectedCategoryIds.length} Categories`
                              )}
                            </span>
                          </div>
                          <ChevronDown className="w-3 h-3 ml-1.5 flex-shrink-0" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64 p-2" align="end">
                        <div className="space-y-1">
                          <div className="relative mb-2">
                            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                            <Input
                              type="text"
                              placeholder="Search categories..."
                              value={categorySearchQuery}
                              onChange={(e) => setCategorySearchQuery(e.target.value)}
                              className="h-8 pl-7 text-xs"
                            />
                          </div>
                          
                          <div className="max-h-[200px] overflow-y-auto space-y-1">
                            {filteredCategories.length === 0 ? (
                              <div className="p-4 text-center text-xs text-gray-500">
                                No categories found
                              </div>
                            ) : (
                              filteredCategories.map((category) => {
                                const isSelected = selectedCategoryIds.includes(category.id);
                                <Popover open={isCategoryPopoverOpen} onOpenChange={setIsCategoryPopoverOpen}>
  <PopoverTrigger asChild>
    <Button variant="outline" size="sm" className="h-8 gap-2">
      Categories
      {selectedCategoryIds.length > 0 && (
        <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-blue-100 text-blue-700 rounded-full">
          {selectedCategoryIds.length}
        </span>
      )}
    </Button>
  </PopoverTrigger>
  <PopoverContent className="w-56 p-2" align="start">
    <div className="flex flex-col gap-1">
      {/* Category List */}
      <div className="max-h-60 overflow-y-auto space-y-0.5">
        {categories.map((category) => {
          const isSelected = selectedCategoryIds.includes(category.id);
          return (
            <label
              key={category.id}
              className={cn(
                "group flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer hover:bg-gray-50 transition-colors",
                isSelected && "bg-blue-50"
              )}
            >
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => {
                  const next = isSelected
                    ? selectedCategoryIds.filter((id) => id !== category.id)
                    : [...selectedCategoryIds, category.id];
                  handleCategorySelectionChange(next);
                }}
                className="w-4 h-4"
              />
              <span
                className={cn(
                  "flex-1 text-xs truncate select-none",
                  isSelected ? "font-medium text-blue-900" : "text-gray-700"
                )}
              >
                {category.name}
              </span>
            </label>
          );
        })}
      </div>

      <div className="pt-1 mt-1 border-t flex flex-col gap-1">
        {/* Create New Action */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            // Logic for triggering creation modal/input
            handleCreateNewCategory();
            setIsCategoryPopoverOpen(false);
          }}
          className="w-full h-8 justify-start text-xs font-normal text-gray-600 hover:text-blue-600 hover:bg-blue-50"
        >
          <Plus className="w-3.5 h-3.5 mr-2" />
          Create new category
        </Button>

        {/* Clear Selection Action */}
        {selectedCategoryIds.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              handleCategorySelectionChange([]);
              setIsCategoryPopoverOpen(false);
            }}
            className="w-full h-8 justify-start text-xs font-normal text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <X className="w-3.5 h-3.5 mr-2" />
            Clear selection
          </Button>
        )}
      </div>
    </div>
  </PopoverContent>
</Popover>

                    {/* Warehouse Quick Selector */}
                    {warehouses.length > 0 && (
                      <Popover open={isWarehousePopoverOpen} onOpenChange={setIsWarehousePopoverOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs justify-between"
                          >
                            <div className="flex items-center gap-1.5">
                              <Warehouse className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate max-w-[120px]">
                                {selectedWarehouse || 'All Warehouses'}
                              </span>
                            </div>
                            <ChevronDown className="w-3 h-3 ml-1.5 flex-shrink-0" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-48 p-2" align="end">
                          <div className="space-y-1">
                            <div className="relative mb-2">
                              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                              <Input
                                type="text"
                                placeholder="Search warehouses..."
                                value={warehouseSearchQuery}
                                onChange={(e) => setWarehouseSearchQuery(e.target.value)}
                                className="h-8 pl-7 text-xs"
                              />
                            </div>
                            
                            <div className="max-h-[200px] overflow-y-auto space-y-1">

<button
                                onClick={() => {
                                  setSelectedWarehouse(null);

                                  setIsWarehousePopoverOpen(false);
                                }}
                                className={cn(
                                  "w-full text-left px-2 py-0.5 rounded-md text-xs hover:bg-gray-50 transition-colors",
                                  !selectedWarehouse && "bg-blue-50 font-medium text-blue-900"
                                )}
                              >
                                Create New
                              </button>

                              {filteredWarehouses.length > 0 ? (
                                filteredWarehouses.map((warehouse) => (
                                  <button
                                    key={warehouse.id}
                                    onClick={() => {
                                      setSelectedWarehouse(warehouse.name);
                                      setIsWarehousePopoverOpen(false);
                                    }}
                                    className={cn(
                                      "w-full text-left px-2 py-0.5 rounded-md text-xs hover:bg-gray-50 transition-colors",
                                      selectedWarehouse === warehouse.name && "bg-blue-50 font-medium text-blue-900"
                                    )}
                                  >
                                    {warehouse.name}
                                  </button>
                                ))
                              ) : (
                                <div className="px-2 py-0.5 text-xs text-gray-500 text-center">
                                  No warehouses found
                                </div>
                              )}
                            </div>
                            {selectedWarehouse && (
                              <div className="pt-1 border-t mt-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedWarehouse(null);
                                  }}
                                  className="w-full h-7 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <X className="w-3 h-3 mr-1" />
                                  Clear Selection
                                </Button>
                              </div>
                            )}
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>
                </div>
                  )}
              </CardContent>
            </Card>
              
              {/* Products Section - Scrollable */}
              <div 
                className="flex-1 flex flex-col min-h-0 overscroll-contain bg-gray-50/30" 
                style={{ 
                  WebkitOverflowScrolling: 'touch',
                  paddingBottom: selectedProductIds.size > 0 ? '80px' : '0'
                }}
              >
                <div className="flex-1 flex flex-col min-h-0">
                {productsLoading ? (
                  <div className="flex items-center justify-center py-2">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
                      <p className="text-gray-600">Loading products...</p>
                    </div>
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">
                        {searchTerm.trim() 
                          ? 'No products match your search' 
                          : 'No products found in this category'}
                      </p>
                    </CardContent>
                  </Card>
                ) : productViewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {sortedProducts.map((product: any) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onFavoriteToggle={handleFavoriteToggle}
                        onStockAction={handleStockAction}
                        onEdit={handleProductEdit}
                        onImagePreview={handleImagePreview}
                        isVariant={product.is_variant}
                      />
                    ))}
                  </div>
                ) : productViewMode === 'table' ? (
                  <div className="flex-1 flex flex-col min-h-0 bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden relative">
                    {/* Scroll indicators for mobile */}
                    <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none z-20 sm:hidden" />
                    <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-20 sm:hidden" />
                    <div className="flex-1 flex flex-col min-h-0 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100" style={{ WebkitOverflowScrolling: 'touch' }}>
                      <table className={cn("w-full divide-y divide-gray-100", !isMobile && "min-w-[640px]")}>
                        <thead className="bg-gray-50/80 backdrop-blur-sm sticky top-0 z-10 border-b-2 border-gray-300">
                          {/* Column Headers */}
                          <tr>
                            <th 
                              className={cn(
                                "text-center w-14 sm:w-12",
                                "px-3 sm:px-4 py-3 border-r border-gray-200 border-b-2 border-gray-300"
                              )}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <input
                                type="checkbox"
                                checked={paginatedProducts.length > 0 && paginatedProducts.every((p: any) => selectedProductIds.has(p.id))}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    const newSet = new Set(selectedProductIds);
                                    paginatedProducts.forEach((p: any) => newSet.add(p.id));
                                    setSelectedProductIds(newSet);
                                  } else {
                                    const newSet = new Set(selectedProductIds);
                                    paginatedProducts.forEach((p: any) => newSet.delete(p.id));
                                    setSelectedProductIds(newSet);
                                  }
                                }}
                                className={cn(
                                  "text-blue-600 rounded border-gray-300 focus:ring-blue-500 touch-manipulation",
                                  compactMode ? "w-5 h-5 sm:w-3 sm:h-3" : "w-5 h-5 sm:w-4 sm:h-4"
                                )}
                              />
                            </th>
                            {/* Dynamically render ordered visible columns */}
                            {getOrderedVisibleColumns.map(columnId => renderColumnHeader(columnId))}
                          </tr>
                        </thead>
                        <tbody className="bg-white">
                          {paginatedProducts.map((product: any, index: number) => {
                            // Use aggregated stock if available, otherwise use product's own stock
                            const displayStock = productStockTotals.get(product.id) ?? (Number(product.quantity_in_stock) || 0);
                            const stockStatus = getStockStatus(displayStock, product.minimum_stock_level);
                            const stockDotColor = getStockStatusDotColor(displayStock, product.minimum_stock_level);
                            const rowIndicators = getRowIndicators(product);
                            
                            // Check if product has variants
                            const hasVariants = !product.is_variant && product.id && (variantCounts.get(String(product.id)) ?? 0) > 0;
                            const isExpanded = hasVariants && expandedProductIds.has(product.id);
                            const productVariants = hasVariants ? (variantsByParentId.get(product.id) || []) : [];
                            const variantCount = hasVariants ? (variantCounts.get(String(product.id)) ?? 0) : 0;
                            
                            // Calculate base row index for alternating colors
                            // Count all previous rows including their variants
                            let rowIndex = 0;
                            for (let i = 0; i < index; i++) {
                              const prevProduct = paginatedProducts[i];
                              const prevHasVariants = !prevProduct.is_variant && prevProduct.id && (variantCounts.get(String(prevProduct.id)) ?? 0) > 0;
                              const prevIsExpanded = prevHasVariants && expandedProductIds.has(prevProduct.id);
                              rowIndex += 1; // Count the parent row
                              if (prevIsExpanded) {
                                const prevVariants = variantsByParentId.get(prevProduct.id) || [];
                                rowIndex += prevVariants.length; // Count variant rows
                              }
                            }
                            // Current row index (0-based)
                            const currentRowIndex = rowIndex;
                            const isEvenRow = currentRowIndex % 2 === 0;
                            
                            // Determine row highlighting based on stock status and missing data
                            const hasMissingData = !product.sku || product.sku === '---' || !product.category_name;
                            const isOutOfStock = displayStock === 0;
                            const isLowStock = displayStock > 0 && displayStock <= (product.minimum_stock_level || 0);
                            
                            return (
                              <React.Fragment key={product.id}>
                              <tr
                                data-product-id={product.id}
                                onClick={(e) => handleRowClick(e, product)}
                                onMouseEnter={(e) => {
                                  const rect = e.currentTarget.getBoundingClientRect();
                                  setHoveredRowId(product.id);
                                  setHoveredProductGroupId(product.id);
                                  setHoveredRowPosition({
                                    top: rect.top, // Fixed positioning is relative to viewport
                                    right: window.innerWidth - rect.right,
                                    height: rect.height,
                                  });
                                }}
                                onMouseLeave={() => {
                                  setHoveredRowId(null);
                                  setHoveredProductGroupId(null);
                                  setHoveredRowPosition(null);
                                }}
                                className={cn(
                                  'group transition-all duration-150 relative border-b border-gray-100 hover:bg-gray-50/50',
                                  hoveredImageProductId === product.id && 'z-50',
                                  // Parent row styling when expanded
                                  hasVariants && isExpanded && 'bg-[#F9FAFB] border-l-2 border-l-blue-600',
                                  // Parent row background even when not expanded
                                  hasVariants && 'bg-[#F9FAFB]'
                                )}
                              >
                                {/* Selection checkbox */}
                                <td 
                                  className={cn(
                                    "text-center w-14 sm:w-12 relative z-10",
                                    "px-3 sm:px-4 py-0 border-r border-gray-100"
                                  )} 
                                  onClick={(e) => e.stopPropagation()}
                                  data-interactive
                                >
                                  <div className="flex items-center justify-center h-8">
                                    <input
                                      type="checkbox"
                                      checked={selectedProductIds.has(product.id)}
                                      onChange={(e) => {
                                        e.stopPropagation();
                                        const newSet = new Set(selectedProductIds);
                                        if (e.target.checked) {
                                          newSet.add(product.id);
                                        } else {
                                          newSet.delete(product.id);
                                        }
                                        setSelectedProductIds(newSet);
                                      }}
                                      className={cn(
                                        "text-blue-600 rounded border-gray-300 focus:ring-blue-500 touch-manipulation",
                                        compactMode ? "w-5 h-5 sm:w-3 sm:h-3" : "w-5 h-5 sm:w-4 sm:h-4"
                                      )}
                                    />
                                  </div>
                                </td>
                                
                                {/* Render columns in order */}
                                {getOrderedVisibleColumns.map(columnId => 
                                  <React.Fragment key={columnId}>
                                    {renderColumnCell(columnId, product, displayStock, stockStatus, stockDotColor, rowIndicators, false, undefined, hasVariants, variantCount)}
                                  </React.Fragment>
                                )}
                              </tr>
                              {/* Variant sub-table - rendered when parent is expanded */}
                              {!product.is_variant && expandedProductIds.has(product.id) && (() => {
                                const productVariants = variantsByParentId.get(product.id) || [];
                                if (productVariants.length === 0) return null;
                                
                                return (
                                  <>
                                    {productVariants.map((variant: any, variantIndex: number) => {
                                      const variantStock = Number(variant.quantity_in_stock) || 0;
                                      const variantStockStatus = getStockStatus(variantStock, variant.minimum_stock_level || 0);
                                      const variantStockDotColor = getStockStatusDotColor(variantStock, variant.minimum_stock_level || 0);
                                      const isLastVariant = variantIndex === productVariants.length - 1;
                                      
                                      // Calculate variant row index for alternating colors
                                      const variantRowIndex = rowIndex + 1 + variantIndex; // +1 for parent row, +variantIndex for this variant
                                      const isVariantEvenRow = variantRowIndex % 2 === 0;
                                      
                                      return (
                                        <tr
                                          key={variant.id}
                                          data-product-id={variant.id}
                                          data-variant-id={variant.id}
                                          data-parent-product-id={product.id}
                                          onClick={(e) => handleRowClick(e, variant)}
                                          onMouseEnter={() => {
                                            setHoveredRowId(variant.id);
                                            setHoveredProductGroupId(product.id);
                                          }}
                                          onMouseLeave={() => {
                                            setHoveredRowId(null);
                                            setHoveredProductGroupId(null);
                                          }}
                                          className={cn(
                                            'group transition-all duration-150 relative border-b border-gray-100 hover:bg-gray-50/30',
                                            'cursor-pointer',
                                            'h-8',
                                            'bg-[#F9FAFB]'
                                          )}
                                        >
                                          {/* L-shaped connector lines will be rendered in name column */}
                                          
                                          {/* Checkbox cell for variants - matches parent structure */}
                                          <td 
                                            className={cn(
                                              "text-center w-14 sm:w-12 relative z-10 bg-[#F9FAFB]",
                                              "px-3 sm:px-4 py-0 border-r border-gray-100"
                                            )}
                                            onClick={(e) => e.stopPropagation()}
                                            data-interactive
                                          >
                                            <div className="flex items-center justify-center h-8">
                                              <input
                                                type="checkbox"
                                                checked={selectedProductIds.has(variant.id)}
                                                onChange={(e) => {
                                                  e.stopPropagation();
                                                  const newSet = new Set(selectedProductIds);
                                                  if (e.target.checked) {
                                                    newSet.add(variant.id);
                                                  } else {
                                                    newSet.delete(variant.id);
                                                  }
                                                  setSelectedProductIds(newSet);
                                                }}
                                                className={cn(
                                                  "text-blue-600 rounded border-gray-300 focus:ring-blue-500 touch-manipulation",
                                                  compactMode ? "w-5 h-5 sm:w-3 sm:h-3" : "w-5 h-5 sm:w-4 sm:h-4"
                                                )}
                                              />
                                            </div>
                                          </td>
                                          
                                          {/* Render columns in order for variants */}
                                          {getOrderedVisibleColumns.map(columnId => 
                                            <React.Fragment key={columnId}>
                                              {renderColumnCell(columnId, variant, variantStock, variantStockStatus, variantStockDotColor, [], true, product, false, 0, variantIndex, isLastVariant)}
                                            </React.Fragment>
                                          )}
                                        </tr>
                                      );
                                    })}
                                  </>
                                );
                              })()}
                              </React.Fragment>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Pagination Controls */}
                    <div className="flex-shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-white border-t border-gray-200">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-700">Results per page:</span>
                        <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                          <SelectTrigger className="w-[80px] h-9 rounded-md border-gray-300">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="12">12</SelectItem>
                            <SelectItem value="25">25</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={currentPage === 1 || totalPages === 0}
                          className="h-9 px-3 rounded-md border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50"
                        >
                          <span className="text-gray-600">&lt; Previous</span>
                        </Button>
                        {totalPages > 0 && (
                          <Button
                            variant="default"
                            size="sm"
                            className="h-9 min-w-[44px] bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                          >
                            {currentPage}
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages || totalPages === 0}
                          className="h-9 px-3 rounded-md border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50"
                        >
                          <span className="text-gray-600">Next &gt;</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : null}
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center p-4">
              <div className="text-center max-w-md">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Products Yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Your inventory is empty. Add your first product to get started.
                </p>
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                  <Button
                    onClick={() => {
                      setScannedSKU('');
                      setPreFilledProductName('');
                      navigate('/dashboard/products/new');
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-6"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Product
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Category Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Category Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. Electronics, Food"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Optional description of the category"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="parent">Parent Category (Optional)</Label>
              <HierarchicalCategorySelector
                value={formData.parentCategoryId}
                onValueChange={(id, name) => setFormData(prev => ({ ...prev, parentCategoryId: id || null }))}
                placeholder="Select parent category..."
                allowCreate={false}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitCategory} disabled={createCategory.isPending}>
              {createCategory.isPending ? 'Adding...' : 'Add Category'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Sub Category Modal */}
      <Dialog 
        open={showAddSubCategoryModal} 
        onOpenChange={(open) => {
          setShowAddSubCategoryModal(open);
          if (!open) {
            // Reset form when modal closes
            setSubCategoryFormData({ name: '', description: '', parentCategoryId: null });
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Sub Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="sub-parent">Parent Category *</Label>
              {subCategoryFormData.parentCategoryId && (
                <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm text-blue-900">
                    <span className="font-medium">Parent:</span>{' '}
                    {categories.find(c => c.id === subCategoryFormData.parentCategoryId)?.name || 'Unknown'}
                  </p>
                </div>
              )}
              <HierarchicalCategorySelector
                value={subCategoryFormData.parentCategoryId}
                onValueChange={(id, name) => setSubCategoryFormData(prev => ({ ...prev, parentCategoryId: id || null }))}
                placeholder="Select parent category..."
                allowCreate={false}
              />
              <p className="text-xs text-gray-500 mt-1">
                {subCategoryFormData.parentCategoryId 
                  ? 'You can change the parent category if needed'
                  : 'You must select a parent category for subcategories'}
              </p>
            </div>
            <div>
              <Label htmlFor="sub-name">Sub Category Name *</Label>
              <Input
                id="sub-name"
                value={subCategoryFormData.name}
                onChange={(e) => setSubCategoryFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. Laptops, Beverages"
              />
            </div>
            <div>
              <Label htmlFor="sub-description">Description</Label>
              <Textarea
                id="sub-description"
                value={subCategoryFormData.description}
                onChange={(e) => setSubCategoryFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Optional description of the subcategory"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowAddSubCategoryModal(false);
                setSubCategoryFormData({ name: '', description: '', parentCategoryId: null });
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddSubCategory} 
              disabled={createCategory.isPending || !subCategoryFormData.parentCategoryId}
            >
              {createCategory.isPending ? 'Adding...' : 'Add Sub Category'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Category Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. Electronics, Food"
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Optional description of the category"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="edit-parent">Parent Category</Label>
              <HierarchicalCategorySelector
                value={formData.parentCategoryId}
                onValueChange={(id, name) => setFormData(prev => ({ ...prev, parentCategoryId: id || null }))}
                placeholder="Select parent category..."
                allowCreate={false}
              />
            </div>
            {selectedCategory && (
              <div>
                <Button
                  variant="outline"
                  onClick={() => openCustomizationModal(selectedCategory)}
                  className="w-full"
                >
                  Customize Icon & Color
                </Button>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditCategory} disabled={updateCategory.isPending}>
              {updateCategory.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Category Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the category "{selectedCategory?.name}"?
              This action cannot be undone. If this category has children, they will be moved to this category's parent.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCategory}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Customization Modal */}
      {selectedCategory && (
        <CategoryCustomizationModal
          isOpen={showCustomizationModal}
          onClose={() => setShowCustomizationModal(false)}
          category={selectedCategory}
          onSave={handleCustomizationSave}
        />
      )}


      {selectedProduct && (
        <EditProductStockModal
          isOpen={isStockAdjustModalOpen}
          onClose={() => {
            setIsStockAdjustModalOpen(false);
            setSelectedProduct(null);
          }}
          product={selectedProduct}
          onProductUpdated={() => {
      queryClient.invalidateQueries({ queryKey: ['productsByCategories'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['categoryProductCounts'] });
          }}
        />
      )}

      {/* Image Preview Modal */}
      {previewImageUrl && (
        <ImagePreviewModal
          isOpen={isImagePreviewOpen}
          onClose={() => {
            setIsImagePreviewOpen(false);
            setPreviewImageUrl(null);
          }}
          imageUrl={previewImageUrl}
          alt="Product preview"
        />
      )}


      {isBarcodeScannerOpen && (
        <BarcodeScanner
          onBarcodeDetected={handleBarcodeDetected}
          onClose={() => setIsBarcodeScannerOpen(false)}
          onScanSuccess={onScanSuccess}
          settings={scannerSettings}
        />
      )}

      {/* Mobile Product Detail Modal */}
      {selectedProduct && (
        <Dialog open={isMobileProductDetailModalOpen} onOpenChange={setIsMobileProductDetailModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">{selectedProduct.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-1">
              {/* Stock Information */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'w-3 h-3 rounded-full',
                      getStockStatusDotColor(selectedProduct.quantity_in_stock, selectedProduct.minimum_stock_level),
                      Number(selectedProduct.quantity_in_stock) === 0 ? 'animate-pulse' : ''
                    )}
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-600">Stock</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {formatStockQuantity(selectedProduct.quantity_in_stock)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {getStockStatus(selectedProduct.quantity_in_stock, selectedProduct.minimum_stock_level)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button
                  onClick={() => {
                    setIsMobileProductDetailModalOpen(false);
                    handleStockAction(selectedProduct, 'in');
                  }}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Plus className="w-4 h-4 mr-2 text-green-600" />
                  Adjust Stock
                </Button>
                <Button
                  onClick={() => {
                    setIsMobileProductDetailModalOpen(false);
                    navigate(`/dashboard/products/${selectedProduct.id}`);
                  }}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Edit className="w-4 h-4 mr-2 text-blue-600" />
                  Edit
                </Button>
                <Button
                  onClick={() => {
                    setIsMobileProductDetailModalOpen(false);
                    handleDuplicateProduct(selectedProduct);
                  }}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Copy className="w-4 h-4 mr-2 text-purple-600" />
                  Duplicate
                </Button>
       
                <div className="pt-2 border-t">
                  <Button
                    onClick={() => {
                      setIsMobileProductDetailModalOpen(false);
                      handleDeleteProduct(selectedProduct);
                    }}
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    variant="outline"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Desktop Product Detail Modal */}
      {detailProduct && (
        <ProductDetailModal
          isOpen={isProductDetailModalOpen}
          onClose={() => {
            setIsProductDetailModalOpen(false);
            setDetailProduct(null);
          }}
          product={detailProduct}
          onAdjustStock={(product) => handleStockAction(product, 'in')}
          onDelete={handleDeleteProduct}
          onProductUpdated={() => {
            queryClient.invalidateQueries({ queryKey: ['productsByCategories'] });
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['categoryProductCounts'] });
          }}
          getStockStatus={getStockStatus}
          getStockStatusDotColor={getStockStatusDotColor}
          formatStockQuantity={formatStockQuantity}
        />
      )}

      {/* Variant Selection Modal */}
      {selectedProduct && (
        <VariantSelectionModal
          isOpen={isVariantSelectionModalOpen}
          onClose={() => {
            setIsVariantSelectionModalOpen(false);
            setSelectedProduct(null);
            setProductVariants([]);
          }}
          product={selectedProduct}
          variants={productVariants}
          actionType={selectedAction}
          onVariantSelected={handleVariantSelected}
        />
      )}

      {/* Command Palette */}
      <CommandPalette
        open={isCommandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
        actions={commandPaletteActions}
      />

      {/* Bulk Import Modal */}
      <BulkImportModal
        isOpen={isBulkImportModalOpen}
        onClose={() => setIsBulkImportModalOpen(false)}
        onImportComplete={handleImportComplete}
      />

      {/* Column Visibility Modal */}
      <ColumnVisibilityModal
        isOpen={isColumnVisibilityModalOpen}
        onClose={() => setIsColumnVisibilityModalOpen(false)}
        visibleColumns={visibleColumns}
        columnOrder={columnOrder}
        onSave={(columns, order) => {
          setVisibleColumns(columns, order);
        }}
        onReset={resetToDefaults}
      />

    

      {/* Set Reorder Rule Panel */}
      <SetReorderRulePanel
        isOpen={isReorderRulePanelOpen}
        onClose={() => {
          setIsReorderRulePanelOpen(false);
          setProductsForPanel([]);
        }}
        products={productsForPanel}
        onUpdate={() => {
          queryClient.invalidateQueries({ queryKey: ['productsByCategories'] });
          queryClient.invalidateQueries({ queryKey: ['products'] });
        }}
      />

      {/* Fixed Bottom Bulk Action Bar */}
      {selectedProductIds.size > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg safe-area-inset-bottom">
          <div className="max-w-full mx-auto px-3 sm:px-4 py-1">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-3">
                <span className="text-xs sm:text-sm font-semibold text-gray-900">
                  {selectedProductIds.size} selected
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedProductIds(new Set())}
                  className="text-gray-600 hover:text-gray-900 h-10 sm:h-9 min-h-[44px] sm:min-h-0 touch-manipulation"
                >
                  <X className="w-4 h-4 sm:mr-1" />
                  <span className="hidden sm:inline">Clear</span>
                </Button>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkExport}
                  className="flex items-center gap-2 h-10 sm:h-9 min-h-[44px] sm:min-h-0 touch-manipulation flex-1 sm:flex-initial"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Export</span>
                  <span className="sm:hidden">Export</span>
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDeleteProducts}
                  className="flex items-center gap-2 h-10 sm:h-9 min-h-[44px] sm:min-h-0 touch-manipulation flex-1 sm:flex-initial"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Delete</span>
                  <span className="sm:hidden">Delete</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
