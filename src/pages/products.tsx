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
import { CategoryCustomizationModal } from '@/components/categories/CategoryCustomizationModal';
import { HierarchicalCategorySelector } from '@/components/categories/HierarchicalCategorySelector';
import { MultiIntentSearch } from '@/components/categories/MultiIntentSearch';
import { ProductCard } from '@/components/ProductCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
<<<<<<< HEAD
import { Grid3x3, Table2, Edit, Trash2, Copy, MapPin, ChevronRight, ChevronLeft, ChevronDown, Palette, ArrowUpDown, ArrowUp, ArrowDown, Scan, Filter, Search, X, Settings, Minimize2, Check, Printer, Truck, Tag, Package2, DollarSign,Warehouse, AlertCircle, TrendingUp, ArrowRightLeft, FolderTree, Download, GitBranch, Upload } from 'lucide-react';
=======
import { Grid3x3, Table2, Edit, Trash2, Copy, MapPin, MoreVertical, ChevronRight, ChevronLeft, ChevronDown, Palette, ArrowUpDown, ArrowUp, ArrowDown, Scan, Filter, Search, X, Settings, Minimize2, Check, Printer, Truck, Tag, Package2, DollarSign,Warehouse, AlertCircle, AlertTriangle, TrendingUp, ArrowRightLeft, FolderTree, Download, Upload, GitBranch, Hash, Layers } from 'lucide-react';
>>>>>>> 0c6dbc15edfccecdd64f738284615a3dd123bee3
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
import { useScannerSettings } from '@/hooks/useScannerSettings';
import { CommandPalette, useCommandPalette, type CommandPaletteAction } from '@/components/CommandPalette';
import { useColumnPreferences } from '@/hooks/useColumnPreferences';
import { ColumnVisibilityModal } from '@/components/products/ColumnVisibilityModal';
<<<<<<< HEAD
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
=======
import { getColumnById } from '@/lib/products/columnFieldMapping';
import { StockBadge, type StockStatus } from '@/components/products/StockBadge';
import { InlineReorderButton } from '@/components/products/InlineReorderButton';
import { calculateDaysOfCover, velocityToDailyConsumption } from '@/utils/daysOfCover';
import { EmptyStateCTA } from '@/components/products/EmptyStateCTA';
import { BulkActionBar } from '@/components/products/BulkActionBar';
import { BulkSKUModal } from '@/components/products/BulkSKUModal';
>>>>>>> 0c6dbc15edfccecdd64f738284615a3dd123bee3

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
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedStockStatus, setSelectedStockStatus] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<'all' | 'today' | 'week' | 'month' | 'year'>('all');
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState<string | null>(null);
  const [activeQuickFilter, setActiveQuickFilter] = useState<string | null>(null);
  // Quick filter pills - supports multiple active filters
  const [activeQuickFilters, setActiveQuickFilters] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('inventory-quick-filters');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  // Default to table view on both mobile and desktop
  const [productViewMode, setProductViewMode] = useState<'grid' | 'list' | 'table'>(() => {
    if (typeof window !== 'undefined') {
      return 'table';
    }
    return 'table';
  });
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sorting state - default to name ascending
  const [sortColumn, setSortColumn] = useState<string | null>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Compact mode state - default to true
  const [compactMode] = useState(true);
  
  
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
  const itemsPerPage = 100;
  
  // Hover state for row actions
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);
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
  
  // Category and warehouse dropdown states
  const [isCategoryPopoverOpen, setIsCategoryPopoverOpen] = useState(false);
  const [isWarehousePopoverOpen, setIsWarehousePopoverOpen] = useState(false);
  const [categorySearchQuery, setCategorySearchQuery] = useState('');
  const [warehouseSearchQuery, setWarehouseSearchQuery] = useState('');
  
  const { settings: scannerSettings, onScanSuccess } = useScannerSettings();
  
  // Command palette
  const { open: isCommandPaletteOpen, setOpen: setCommandPaletteOpen } = useCommandPalette();
  
  // Search input ref for keyboard shortcut
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  
  // Keyboard shortcut: "/" to focus search
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger if not typing in an input/textarea and not in command palette
      if (
        e.key === '/' &&
        !isCommandPaletteOpen &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        // Focus the search input - we'll need to expose a focus method from MultiIntentSearch
        // For now, try to find and focus the input directly
        const searchInput = document.querySelector('input[placeholder*="Search products"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen]);
  
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
  const queryClient = useQueryClient();
  useCategoryRealtime();

  // Map product locations to warehouse names
  const locationToWarehouseMap = React.useMemo(() => {
    const map = new Map<string, string>();
    warehouses.forEach(warehouse => {
      map.set(warehouse.name, warehouse.name);
    });
    return map;
  }, [warehouses]);

  // Get warehouse name for a product based on its warehouse_name
  const getWarehouseName = React.useCallback((warehouseName: string | null | undefined): string | null => {
    if (!warehouseName) return null;
    return warehouseName;
  }, []);

  // Flatten categories for quick selection
  const allCategories = React.useMemo(() => {
    return flattenCategoryTree(tree);
  }, [tree]);

  // Filter categories and warehouses based on search query
  const filteredCategories = React.useMemo(() => {
    if (!categorySearchQuery) return allCategories;
    return allCategories.filter(category =>
      category.name.toLowerCase().includes(categorySearchQuery.toLowerCase())
    );
  }, [allCategories, categorySearchQuery]);

  const filteredWarehouses = React.useMemo(() => {
    if (!warehouseSearchQuery) return warehouses;
    return warehouses.filter(warehouse =>
      warehouse.name.toLowerCase().includes(warehouseSearchQuery.toLowerCase())
    );
  }, [warehouses, warehouseSearchQuery]);

  // Handle category toggle
  const handleCategoryToggle = (categoryId: string) => {
    if (selectedCategoryIds.includes(categoryId)) {
      setSelectedCategoryIds(selectedCategoryIds.filter(id => id !== categoryId));
    } else {
      setSelectedCategoryIds([...selectedCategoryIds, categoryId]);
    }
  };

  // Get selected category names
  const selectedCategoryNames = React.useMemo(() => {
    return allCategories
      .filter(cat => selectedCategoryIds.includes(cat.id))
      .map(cat => cat.name);
  }, [allCategories, selectedCategoryIds]);
  
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
          product.location?.toLowerCase().includes(term) ||
          product.category_name?.toLowerCase().includes(term)
        );
      });
    }

    // Location filter (from sidebar)
    if (selectedLocations.length > 0) {
      filtered = filtered.filter((product: any) => 
        product.location && selectedLocations.includes(product.location)
      );
    }

    // Location filter (from quick switcher)
    if (selectedLocation) {
      filtered = filtered.filter((product: any) => 
        product.location && product.location.toLowerCase() === selectedLocation.toLowerCase()
      );
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

    // Quick filters (legacy single filter - keep for backward compatibility)
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

    // Quick filter pills (multiple filters)
    // Note: has-variants filter will be applied after variantCounts is calculated
    if (activeQuickFilters.length > 0) {
      const filtersToApply = activeQuickFilters.filter(f => f !== 'has-variants');
      if (filtersToApply.length > 0) {
        filtered = filtered.filter((product: any) => {
          const qty = Number(product.quantity_in_stock) || 0;
          const minLevel = Number(product.minimum_stock_level) || 0;
          
          // Product matches if it matches ANY of the active filters (OR logic)
          return filtersToApply.some(filterType => {
            switch (filterType) {
              case 'out-of-stock':
                return qty === 0;
              case 'low-stock':
                return qty > 0 && qty <= minLevel;
              case 'no-location':
                return !product.location || product.location.trim() === '';
              case 'missing-sku':
                return !product.is_variant && (!product.sku || product.sku === '---' || product.sku.trim() === '');
              default:
                return false;
            }
          });
        });
      }
    }

    return filtered;
  }, [categoryProducts, searchTerm, selectedLocations, selectedLocation, selectedWarehouse, selectedStockStatus, dateRange, activeQuickFilter, activeQuickFilters]);

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

  // Apply has-variants filter after variantCounts is available
  const filteredProductsWithVariants = React.useMemo(() => {
    let filtered = filteredProducts;
    
    // Apply has-variants filter if it's in activeQuickFilters
    if (activeQuickFilters.includes('has-variants')) {
      filtered = filtered.filter((product: any) => {
        return !product.is_variant && product.id && (variantCounts.get(String(product.id)) ?? 0) > 0;
      });
    }
    
    return filtered;
  }, [filteredProducts, activeQuickFilters, variantCounts]);

  // Calculate quick filter counts (for display in pills)
  const quickFilterCounts = React.useMemo(() => {
    const counts = {
      'out-of-stock': 0,
      'low-stock': 0,
      'no-location': 0,
      'has-variants': 0,
      'missing-sku': 0,
    };
    
    categoryProducts.forEach((product: any) => {
      const qty = Number(product.quantity_in_stock) || 0;
      const minLevel = Number(product.minimum_stock_level) || 0;
      
      if (qty === 0) counts['out-of-stock']++;
      if (qty > 0 && qty <= minLevel) counts['low-stock']++;
      if (!product.location || product.location.trim() === '') counts['no-location']++;
      if (!product.is_variant && product.id && (variantCounts.get(String(product.id)) ?? 0) > 0) {
        counts['has-variants']++;
      }
      if (!product.is_variant && (!product.sku || product.sku === '---' || product.sku.trim() === '')) {
        counts['missing-sku']++;
      }
    });
    
    return counts;
  }, [categoryProducts, variantCounts]);

  // Persist quick filters to localStorage
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('inventory-quick-filters', JSON.stringify(activeQuickFilters));
    }
  }, [activeQuickFilters]);

  // Toggle quick filter
  const toggleQuickFilter = (filterType: string) => {
    setActiveQuickFilters(prev => {
      if (prev.includes(filterType)) {
        return prev.filter(f => f !== filterType);
      } else {
        return [...prev, filterType];
      }
    });
  };

  // Use filtered products for sorting (always use filteredProductsWithVariants to include all filters)
  const sortedProducts = React.useMemo(() => {
    const productsToSort = filteredProductsWithVariants;
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
        case 'location':
          aValue = (a.location || '').toLowerCase();
          bValue = (b.location || '').toLowerCase();
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
  }, [filteredProducts, sortColumn, sortDirection, locationToWarehouseMap]);

  // Pagination calculations
  const totalProducts = sortedProducts.length;
  const totalPages = Math.ceil(totalProducts / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = sortedProducts.slice(startIndex, endIndex);

  // Reset to page 1 when filters/search change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedLocations, selectedLocation, selectedStockStatus, dateRange, activeQuickFilter, selectedCategoryIds, sortColumn, sortDirection]);

  // Detect repetitive locations (appearing in >70% of rows)
  const repetitiveLocations = React.useMemo(() => {
    if (sortedProducts.length === 0) return new Set<string>();
    
    const locationCounts = new Map<string, number>();
    sortedProducts.forEach((product: any) => {
      const location = product.location || '';
      locationCounts.set(location, (locationCounts.get(location) || 0) + 1);
    });
    
    const threshold = sortedProducts.length * 0.7;
    const repetitive = new Set<string>();
    
    locationCounts.forEach((count, location) => {
      if (count > threshold) {
        repetitive.add(location);
      }
    });
    
    return repetitive;
  }, [sortedProducts]);

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
    setSelectedLocations(filters.locations || []);
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

  const handleMoveToLocation = async (product: any) => {
    const newLocation = prompt('Enter new location for this product:', product.location || '');
    
    if (newLocation === null) return;
    
    try {
      const { error } = await supabase
        .from('products')
        .update({ location: newLocation })
        .eq('id', product.id);

      if (error) throw error;

      toast.success('Product location updated successfully');
      
      queryClient.invalidateQueries({ queryKey: ['productsByCategories'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    } catch (error) {
      console.error('Error updating product location:', error);
      toast.error('Failed to update product location');
    }
  };

  // Helper functions for table view
  const getStockStatus = (quantity: number, minLevel: number) => {
    const qty = Number(quantity);
    const min = Number(minLevel);
    if (qty === 0) return 'Out of Stock';
    if (qty > 0 && qty <= min) return 'Low Stock';
    return 'In Stock';
  };

<<<<<<< HEAD
  // Get stock status label for display
  const getStockStatusLabel = (quantity: number, minLevel: number) => {
    const qty = Number(quantity);
    const min = Number(minLevel);
    if (qty === 0) return 'Out of Stock';
    if (qty > 0 && qty <= min) return 'Low Stock';
    return 'Healthy';
  };

  // Calculate days until reorder needed (for low stock items)
  const getReorderDays = (quantity: number, minLevel: number): number | null => {
    const qty = Number(quantity);
    const min = Number(minLevel);
    if (qty === 0 || min === 0) return null;
    if (qty > min) return null;
    
    // Simple estimate: if at or below minimum, estimate days based on stock level
    // If at 0, it's already out of stock
    // If at min level, estimate ~4-7 days
    // If below min but above 0, estimate proportionally
    if (qty === 0) return null; // Out of stock, not reorder days
    
    // Estimate based on how close to zero we are
    // If at minimum level, estimate ~4 days
    // If at 50% of minimum, estimate ~2 days
    const ratio = qty / min;
    const estimatedDays = Math.max(1, Math.ceil(ratio * 7)); // Scale from 1-7 days
    return estimatedDays;
  };

  // Calculate days since last stocked (for out of stock items)
  const getDaysSinceLastStocked = (product: any): number | null => {
    // Try to find the last stock update date
    // Check updated_at if quantity_in_stock was recently changed
    // Or use created_at as fallback
    const dateToUse = product.updated_at || product.last_stocked_at || product.created_at;
    if (!dateToUse) return null;
    
    const lastStockedDate = new Date(dateToUse);
    const now = new Date();
    const diffTime = now.getTime() - lastStockedDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 ? diffDays : null;
=======
  // Enhanced stock status details with actionability information
  const getStockStatusDetails = (quantity: number, minLevel: number, updatedAt?: string | null) => {
    const qty = Number(quantity);
    const min = Number(minLevel);
    
    let status: 'out' | 'low' | 'healthy';
    let stockStatus: StockStatus;
    let label: string;
    let actionText: string | null = null;
    let dotColor: string;
    let bgColor: string;
    let borderColor: string;
    let textColor: string;
    
    if (qty === 0) {
      status = 'out';
      stockStatus = 'critical';
      label = 'Out of Stock';
      dotColor = 'bg-red-500';
      bgColor = 'bg-red-50';
      borderColor = 'border-red-200';
      textColor = 'text-red-700';
      
      // Calculate days since last update
      if (updatedAt) {
        const daysSince = Math.floor((Date.now() - new Date(updatedAt).getTime()) / (1000 * 60 * 60 * 24));
        if (daysSince > 0) {
          actionText = `Last stocked ${daysSince} day${daysSince !== 1 ? 's' : ''} ago`;
        } else {
          actionText = 'Last stocked today';
        }
      } else {
        actionText = 'No recent stock activity';
      }
    } else if (qty > 0 && qty <= min) {
      status = 'low';
      stockStatus = 'at-risk';
      label = 'Low Stock';
      dotColor = 'bg-orange-500';
      bgColor = 'bg-orange-50';
      borderColor = 'border-orange-200';
      textColor = 'text-orange-700';
      
      // Estimate days until reorder (simple calculation: assume 10% daily consumption)
      const daysUntilReorder = Math.ceil(qty / Math.max(min * 0.1, 1));
      if (daysUntilReorder <= 7) {
        actionText = `Reorder in ~${daysUntilReorder} day${daysUntilReorder !== 1 ? 's' : ''}`;
      } else {
        actionText = `Reorder soon (${qty} units remaining)`;
      }
    } else {
      status = 'healthy';
      stockStatus = 'healthy';
      label = 'Healthy';
      dotColor = 'bg-green-500';
      bgColor = '';
      borderColor = '';
      textColor = 'text-gray-700';
      actionText = null;
    }
    
    return {
      status,
      stockStatus,
      label,
      actionText,
      dotColor,
      bgColor,
      borderColor,
      textColor,
      isUrgent: status === 'out' || status === 'low',
    };
  };

  // Calculate days of cover using a simple estimate
  // Uses minimum stock level as a proxy for average daily consumption
  // If min level represents ~7 days of stock, then daily consumption ≈ min / 7
  const calculateDaysOfCoverSimple = (quantity: number, minLevel: number): number | null => {
    if (quantity <= 0) return 0;
    if (minLevel <= 0) return null; // Can't calculate without reorder point
    
    // Estimate daily consumption: assume min level covers ~7-14 days typically
    // Use a conservative estimate of minLevel / 10 for daily consumption
    const estimatedDailyConsumption = minLevel / 10;
    if (estimatedDailyConsumption <= 0) return null;
    
    return quantity / estimatedDailyConsumption;
>>>>>>> 0c6dbc15edfccecdd64f738284615a3dd123bee3
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

  // Get variant health summary for a product
  const getVariantHealthSummary = (productId: string): { total: number; low: number; out: number; healthy: number } => {
    const variants = variantsByParentId.get(productId) || [];
    const summary = {
      total: variants.length,
      low: 0,
      out: 0,
      healthy: 0,
    };
    
    variants.forEach((variant: any) => {
      const qty = Number(variant.quantity_in_stock) || 0;
      const minLevel = Number(variant.minimum_stock_level) || 0;
      
      if (qty === 0) {
        summary.out++;
      } else if (qty > 0 && qty <= minLevel) {
        summary.low++;
      } else {
        summary.healthy++;
      }
    });
    
    return summary;
  };

  const formatStockQuantity = (quantity: number) => {
    return new Intl.NumberFormat('en-US').format(Number(quantity) || 0);
  };

  // Format time ago (e.g., "2h ago", "3d ago")
  const formatTimeAgo = (dateString: string | null | undefined): string | null => {
    if (!dateString) return null;
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    const diffWeeks = Math.floor(diffDays / 7);
    if (diffWeeks < 4) return `${diffWeeks}w ago`;
    
    const diffMonths = Math.floor(diffDays / 30);
    return `${diffMonths}mo ago`;
  };

  // Row indicator helpers
  const getRowIndicators = (product: any) => {
    const indicators: Array<{ type: string; color: string; label: string }> = [];
    
    const qty = Number(product.quantity_in_stock) || 0;
    const minLevel = Number(product.minimum_stock_level) || 0;
    
    // Low stock indicator
    if (qty === 0) {
      indicators.push({ type: 'out-of-stock', color: 'bg-red-500', label: 'Out of Stock' });
    } else if (qty > 0 && qty <= minLevel) {
      indicators.push({ type: 'low-stock', color: 'bg-orange-500', label: 'Low Stock' });
    }
    
    // Missing SKU
    if (!product.sku || product.sku === '---') {
      indicators.push({ type: 'missing-sku', color: 'bg-yellow-500', label: 'Missing SKU' });
    }
    
    // Unassigned category
    if (!product.category_id || !product.category_name) {
      indicators.push({ type: 'no-category', color: 'bg-purple-500', label: 'No Category' });
    }
    
    // No location
    if (!product.location) {
      indicators.push({ type: 'no-location', color: 'bg-blue-500', label: 'No Location' });
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

  // Shared column configuration
  // Product name has no width constraint (flexible, widest)
  // Other columns have fixed small widths that fit their content
  const columnConfigs: Record<string, { label: string; sortKey?: string; align?: 'left' | 'center' | 'right'; responsive?: string; width?: string }> = React.useMemo(() => ({
    'sku': { label: 'SKU', sortKey: 'sku', align: 'left', width: 'w-24' },
    'barcode': { label: 'Barcode', align: 'left', responsive: 'hidden md:table-cell', width: 'w-28' },
    'description': { label: 'Description', align: 'left', responsive: 'hidden lg:table-cell', width: 'w-40' },
    'category_name': { label: 'Category', sortKey: 'name', align: 'left', width: 'w-32' },
    'name': { label: 'Product', sortKey: 'name', align: 'left', width: undefined }, // No width - flexible, takes remaining space
    'location': { label: 'Location', sortKey: 'location', align: 'center', responsive: 'hidden md:table-cell', width: 'w-24' },
    'warehouses': { label: 'Warehouses', sortKey: 'warehouses', align: 'center', responsive: 'hidden md:table-cell', width: 'w-28' },
    'stock': { label: 'Stock', sortKey: 'stock', align: 'center', width: 'w-32' },
    'minimum_stock_level': { label: 'Min. Level', sortKey: 'minimum_stock_level', align: 'right', responsive: 'hidden sm:table-cell', width: 'w-24' },
    'purchase_price': { label: 'Cost', sortKey: 'purchase_price', align: 'right', responsive: 'hidden sm:table-cell', width: 'w-24' },
    'sale_price': { label: 'Price', sortKey: 'sale_price', align: 'right', responsive: 'hidden sm:table-cell', width: 'w-24' },
    'unit_price': { label: 'Unit Price', sortKey: 'unit_price', align: 'right', responsive: 'hidden lg:table-cell', width: 'w-28' },
  }), []);

  // Helper to get column classes (width, responsive, align)
  const getColumnClasses = (columnId: string, includeAlign: boolean = true): string => {
    const config = columnConfigs[columnId];
    if (!config) return '';
    
    const classes: string[] = [];
    if (includeAlign) {
      if (config.align === 'center') classes.push('text-center');
      else if (config.align === 'right') classes.push('text-right');
      else classes.push('text-left');
    }
    // Only add width if it's defined (product name has undefined width for flexibility)
    if (config.width) classes.push(config.width);
    if (config.responsive) classes.push(config.responsive);
    
    return classes.join(' ');
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
    // Filter visible columns based on isColumnVisible check
    const visible = visibleColumns.filter(col => {
      if (col === 'sku' && !showSKUColumn) {
        return false;
      }
      return true;
    });

    // If we have a column order, use it to order the visible columns
    if (columnOrder && columnOrder.length > 0) {
      // Start with columns in the stored order that are also visible
      const ordered = columnOrder.filter(col => visible.includes(col));
      // Add any visible columns that aren't in the order (newly added columns)
      const unordered = visible.filter(col => !columnOrder.includes(col));
      return [...ordered, ...unordered];
    }
    
    // No order stored, return visible columns as-is
    return visible;
  }, [visibleColumns, columnOrder, showSKUColumn]);

  // Helper to render column header
  const renderColumnHeader = (columnId: string) => {
<<<<<<< HEAD
    const columnConfigs: Record<string, { label: string; sortKey?: string; align?: 'left' | 'center' | 'right'; responsive?: string; width?: string }> = {
      'sku': { label: 'SKU', sortKey: 'sku', align: 'center', width: 'w-12' }, // Fixed width for SKU (reduced by 20%)
      'barcode': { label: 'Barcode', align: 'center', responsive: 'hidden md:table-cell' },
      'description': { label: 'Description', align: 'center', responsive: 'hidden lg:table-cell' },
      'category_name': { label: 'Category', sortKey: 'name', align: 'center', width: 'w-16' }, // Fixed width for Category (reduced by 20%)
      'name': { label: 'Product', sortKey: 'name', align: 'center', width: 'min-w-[240px]' }, // Flexible width - expands to fill space (increased to prevent truncation)
      'location': { label: 'Location', sortKey: 'location', align: 'center', responsive: 'hidden md:table-cell', width: 'w-1/8' },
      'warehouses': { label: 'Warehouses', sortKey: 'warehouses', align: 'center', responsive: 'hidden md:table-cell', width: 'w-1/8' },
      'stock': { label: 'Stock', sortKey: 'stock', align: 'center', width: 'w-1/8' }, // Always visible - critical column
      'minimum_stock_level': { label: 'Min. Level', sortKey: 'minimum_stock_level', align: 'center', responsive: 'hidden sm:table-cell' },
      'purchase_price': { label: 'Cost', sortKey: 'purchase_price', align: 'center', responsive: 'hidden sm:table-cell', width: 'w-1/8' },
      'sale_price': { label: 'Price', sortKey: 'sale_price', align: 'center', responsive: 'hidden sm:table-cell', width: 'w-1/8' },
      'unit_price': { label: 'Unit Price', sortKey: 'unit_price', align: 'center', responsive: 'hidden lg:table-cell' },
    };

=======
>>>>>>> 0c6dbc15edfccecdd64f738284615a3dd123bee3
    const config = columnConfigs[columnId];
    if (!config) return null;

    const isSortable = !!config.sortKey;
    const sortKey = config.sortKey || columnId;
    
    return (
      <th
        key={columnId}
        className={cn(
<<<<<<< HEAD
          config.align === 'center' ? 'text-center' : config.align === 'right' ? 'text-right' : 'text-left',
          config.width || '',
          config.responsive || '',
          "px-3 sm:px-4 py-1.5 text-xs font-semibold text-gray-800 uppercase tracking-wider whitespace-nowrap",
          isSortable && "cursor-pointer hover:bg-gray-200 transition-colors touch-manipulation"
=======
          getColumnClasses(columnId),
          "px-3 py-3 text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap border-r border-gray-300",
          isSortable && "cursor-pointer hover:bg-gray-100 transition-colors",
          // Product name column should take remaining space (no width constraint)
          !config.width && columnId === 'name' && "w-auto"
>>>>>>> 0c6dbc15edfccecdd64f738284615a3dd123bee3
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

  // Helper to render empty state with tooltip
  const renderEmptyState = (message: string, tooltipText?: string) => {
    const content = (
      <span className="text-gray-400 italic text-xs">Not set</span>
    );
    
    if (tooltipText) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {content}
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">{tooltipText}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    
    return content;
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
    variantCount?: number
  ): React.ReactNode => {
    if (!isColumnVisible(columnId)) return null;

    switch (columnId) {
      case 'sku': {
        if (isVariant) {
          const hasVariantSKU = !!(product.variant_sku || product.sku);
          const hasParentSKU = parentProduct && !!(parentProduct.sku && parentProduct.sku !== '---');
          const variantMatchesParent = hasVariantSKU && hasParentSKU && (product.variant_sku || product.sku) === parentProduct.sku;
          const showNoSKU = (!hasVariantSKU && !hasParentSKU) || variantMatchesParent;
          return (
            <td className={cn(
<<<<<<< HEAD
              "text-left relative z-10 w-12",
              "px-3 sm:px-4 py-0.5 "
            )}>
              {showNoSKU ? (
                <span className={cn(
                  "text-gray-400",
                  compactMode ? "text-[10px]" : "text-xs"
                )}>
                  —
                </span>
              ) : (
                <span className={cn(
                  "font-mono",
                  !hasVariantSKU ? "text-gray-400" : "text-gray-900",
                  "text-xs"
                )}>
                  {product.variant_sku || product.sku || (
                    <span className={cn(
                      "text-gray-400",
                      compactMode ? "text-[10px]" : "text-xs"
                    )}>
                      —
                    </span>
                  )}
                </span>
=======
              getColumnClasses(columnId),
              "relative z-10 align-middle border-r border-gray-300",
              "px-3 py-1"
            )}>
              {showDash ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <AlertCircle className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Variant inherits SKU from parent</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : product.variant_sku || product.sku ? (
                <span className={cn(
                  "font-mono text-gray-600",
                  compactMode ? "text-xs" : "text-xs sm:text-sm"
                )}>
                  {product.variant_sku || product.sku}
                </span>
              ) : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <AlertCircle className="w-3.5 h-3.5 text-yellow-500 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">SKU required for tracking & exports</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
>>>>>>> 0c6dbc15edfccecdd64f738284615a3dd123bee3
              )}
            </td>
          );
        }
        const productHasVariants = !product.is_variant && (variantCounts.get(product.id) ?? 0) > 0;
        const productVariants = productHasVariants ? (variantsByParentId.get(product.id) || []) : [];
        const hasDifferentSKUs = productHasVariants && productVariants.length > 0 && 
          new Set(productVariants.map((v: any) => v.variant_sku || v.sku).filter(Boolean)).size > 1;
        const hasSKU = product.sku && product.sku !== '---';
        
        return (
<<<<<<< HEAD
            <td className={cn(
              "text-left relative z-10 align-middle w-12",
            "px-3 sm:px-4 py-1 "
=======
          <td className={cn(
            getColumnClasses(columnId),
            "relative z-10 align-middle border-r border-gray-300",
            "px-3 py-2"
>>>>>>> 0c6dbc15edfccecdd64f738284615a3dd123bee3
          )}>
            <div className="flex items-center gap-1.5">
              {productHasVariants && hasDifferentSKUs ? (
                <span className={cn(
<<<<<<< HEAD
                  "text-xs",
                  "text-gray-900"
                )}>
                  Multiple
                </span>
              ) : !product.sku || product.sku === '---' ? (
                <span className={cn(
                  "text-gray-400",
                  "text-xs"
                )}>
                  —
                </span>
              ) : (
                <span className={cn(
                  "font-mono text-gray-900",
                  "text-xs"
                )}>
                  {product.sku}
                </span>
=======
                  "text-gray-600",
                  compactMode ? "text-xs" : "text-xs sm:text-sm"
                )}>
                  Multiple
                </span>
              ) : hasSKU ? (
                <span className={cn(
                  "font-mono text-gray-900",
                  compactMode ? "text-xs" : "text-xs sm:text-sm"
                )}>
                  {product.sku}
                </span>
              ) : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <AlertCircle className="w-3.5 h-3.5 text-yellow-500 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">SKU required for tracking & exports</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
>>>>>>> 0c6dbc15edfccecdd64f738284615a3dd123bee3
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
<<<<<<< HEAD
              "text-left relative z-10 hidden md:table-cell align-middle ",
              "pl-8 sm:pl-10 pr-3 sm:pr-4 py-0.5 "
            )}>
              {showNoBarcode ? (
                <span className={cn(
                  "text-gray-400",
                  compactMode ? "text-[10px]" : "text-xs"
                )}>
                  —
                </span>
              ) : (
                <span className={cn(
                  "font-mono",
                  !hasVariantBarcode ? "text-gray-400" : "text-gray-900",
                  compactMode ? "text-xs" : "text-sm"
                )}>
                  {product.variant_barcode || product.barcode || (
                    <span className={cn(
                      "text-gray-400",
                      compactMode ? "text-[10px]" : "text-xs"
                    )}>
                      —
                    </span>
                  )}
                </span>
              )}
=======
              getColumnClasses(columnId),
              "relative z-10 align-middle border-r border-gray-300",
              "px-3 py-1"
            )}>
              <span className={cn(
                "font-mono",
                showDash ? "text-gray-300" : (!hasVariantBarcode ? "text-gray-300 opacity-50" : "text-gray-600"),
                compactMode ? "text-xs" : "text-sm"
              )}>
                {showDash ? renderEmptyState('Barcode', 'Variant inherits barcode from parent') : (product.variant_barcode || product.barcode || renderEmptyState('Barcode', 'No barcode assigned.'))}
              </span>
>>>>>>> 0c6dbc15edfccecdd64f738284615a3dd123bee3
            </td>
          );
        }
        return (
          <td className={cn(
<<<<<<< HEAD
            "text-left relative z-10 hidden md:table-cell align-middle",
            "px-3 sm:px-4 py-1 "
          )}>
            {!product.barcode ? (
              <span className={cn(
                "text-gray-400",
                compactMode ? "text-[10px]" : "text-xs"
              )}>
                —
              </span>
            ) : (
              <span className={cn(
                "font-mono text-gray-900",
                compactMode ? "text-xs" : "text-sm"
              )}>
                {product.barcode}
              </span>
            )}
=======
            getColumnClasses(columnId),
            "relative z-10 align-middle border-r border-gray-300",
            "px-3 py-2"
          )}>
            <span className={cn(
              "font-mono",
              !product.barcode ? "text-gray-300 opacity-50" : "text-gray-900",
              compactMode ? "text-xs" : "text-sm"
            )}>
              {product.barcode || renderEmptyState('Barcode', 'No barcode assigned.')}
            </span>
>>>>>>> 0c6dbc15edfccecdd64f738284615a3dd123bee3
          </td>
        );

      case 'description':
        return (
          <td className={cn(
<<<<<<< HEAD
            "text-left relative z-10 hidden lg:table-cell align-middle",
            "px-3 sm:px-4 py-1 "
=======
            getColumnClasses(columnId),
            "relative z-10 align-middle border-r border-gray-300",
            "px-3 py-2"
>>>>>>> 0c6dbc15edfccecdd64f738284615a3dd123bee3
          )}>
            {!isVariant && (
              <span className={cn(
                !product.description ? "text-gray-400" : "text-gray-900",
                "truncate max-w-xs block",
                compactMode ? "text-xs" : "text-sm"
              )}>
                {product.description || '—'}
              </span>
            )}
          </td>
        );

      case 'category_name':
        // Hide category column for variants (they inherit from parent)
        if (isVariant) {
          const variantCategory = product.category_name;
          const parentCategory = parentProduct?.category_name;
          const matchesParent = variantCategory === parentCategory;
          return (
            <td className={cn(
<<<<<<< HEAD
              "text-left relative z-10 align-middle w-16",
              "px-3 sm:px-4 py-1 "
            )}>
              {matchesParent ? (
                <span className={cn(
                  "text-gray-400 opacity-60",
                  compactMode ? "text-[10px]" : "text-xs"
                )}>
                  Same as parent
                </span>
              ) : !variantCategory ? (
                <span className={cn(
                  "text-gray-400",
                  compactMode ? "text-[10px]" : "text-xs"
                )}>
                  —
                </span>
=======
              getColumnClasses(columnId),
              "relative z-10 align-middle border-r border-gray-300",
              "px-3 py-1"
            )}>
              {matchesParent ? (
                renderEmptyState('Category', 'Variant inherits category from parent')
>>>>>>> 0c6dbc15edfccecdd64f738284615a3dd123bee3
              ) : (
                <span className={cn(
                  "text-gray-900",
                  compactMode ? "text-xs" : "text-sm"
                )}>
<<<<<<< HEAD
                  {variantCategory}
=======
                  {variantCategory || renderEmptyState('Category', 'Variant inherits category from parent')}
>>>>>>> 0c6dbc15edfccecdd64f738284615a3dd123bee3
                </span>
              )}
            </td>
          );
        }
        return (
          <td className={cn(
<<<<<<< HEAD
              "text-left relative z-10 align-middle w-16",
            "px-3 sm:px-4 py-1 "
=======
            getColumnClasses(columnId),
            "relative z-10 align-middle border-r border-gray-300",
            "px-3 py-2"
>>>>>>> 0c6dbc15edfccecdd64f738284615a3dd123bee3
          )}>
            {!product.category_name ? (
              <span className={cn(
                "text-gray-400",
                compactMode ? "text-[10px]" : "text-xs"
              )}>
                —
              </span>
            ) : (
              <span className={cn(
                "text-gray-900",
                compactMode ? "text-xs" : "text-sm"
              )}>
<<<<<<< HEAD
                {product.category_name}
=======
                {product.category_name || renderEmptyState('Category', 'No category assigned. Products without categories may be harder to organize.')}
>>>>>>> 0c6dbc15edfccecdd64f738284615a3dd123bee3
              </span>
            )}
          </td>
        );

      case 'name': {
        if (isVariant) {
          const variantLabel = formatVariantLabel(product);
          return (
            <td className={cn(
<<<<<<< HEAD
              "relative z-10 align-middle",
              "px-3 sm:px-4 py-1 "
=======
              getColumnClasses(columnId),
              "relative z-10 align-middle border-r border-gray-300",
              "px-3 py-1"
>>>>>>> 0c6dbc15edfccecdd64f738284615a3dd123bee3
            )}>
              <div className="flex items-center">
                {/* Very minimal connector line with no right margin to align text */}
                <div className="w-2 h-px bg-gray-300 mr-0.5"></div>
                <h3 className={cn(
<<<<<<< HEAD
                  "font-normal text-gray-900 leading-tight",
                  compactMode ? "text-xs" : "text-sm"
=======
                  "font-normal text-gray-600",
                  compactMode ? "text-sm" : "text-base"
>>>>>>> 0c6dbc15edfccecdd64f738284615a3dd123bee3
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
        const isProductExpanded = productHasVariants && expandedProductIds.has(product.id);
        return (
          <td className={cn(
<<<<<<< HEAD
            "relative z-10 overflow-visible align-middle text-left",
            "pl-0 pr-3 sm:pr-4 py-1 "
          )}>
            <div className={cn(
              "flex items-center",
              compactMode ? "gap-1" : "gap-1 sm:gap-1.5"
=======
            getColumnClasses(columnId),
            "relative z-10 overflow-visible align-middle border-r border-gray-300",
            "px-3 py-2"
          )}>
            <div className={cn(
              "flex items-center",
              compactMode ? "gap-1" : "gap-1.5"
>>>>>>> 0c6dbc15edfccecdd64f738284615a3dd123bee3
            )}>
              {/* Always reserve space for image to maintain alignment */}
              <div className={cn("flex-shrink-0", compactMode ? "w-6 h-6" : "w-6 h-6")}>
                {product.image_url ? (
                  <div 
                    className={cn("relative group z-[9999] w-full h-full")} 
                    onClick={(e) => e.stopPropagation()} 
                    onMouseEnter={() => setHoveredImageProductId(product.id)}
                    onMouseLeave={() => setHoveredImageProductId(null)}
                    data-interactive
                  >
                    <div className={cn("bg-gray-50 rounded-lg border flex items-center justify-center overflow-visible w-full h-full")}>
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="max-w-full max-h-full object-contain cursor-pointer transition-transform duration-300 ease-in-out group-hover:scale-[4] relative group-hover:shadow-2xl"
                        onClick={() => handleImagePreview(product.image_url)}
                      />
                    </div>
                  </div>
                ) : null}
              </div>
              <div className="flex-1 min-w-0">
                <div className={cn(
                  "flex items-center flex-wrap",
                  compactMode ? "gap-1" : "gap-1.5"
                )}>
<<<<<<< HEAD
                  {/* Always reserve space for chevron to maintain alignment */}
                  <div className={cn("flex-shrink-0", productHasVariants ? "" : "w-5 sm:w-4")}>
                    {productHasVariants && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleProductExpansion(product.id);
                        }}
                        data-interactive
                      >
                        <div className="flex items-center justify-center w-5 h-5 sm:w-4 sm:h-4 rounded-md bg-blue-50 border border-blue-200 group-hover:bg-blue-100 group-hover:border-blue-300 transition-colors cursor-pointer touch-manipulation">
                          {expandedProductIds.has(product.id) ? (
                            <ChevronDown className="w-3 h-3 sm:w-2.5 sm:h-2.5 text-blue-600" />
                          ) : (
                            <ChevronRight className="w-3 h-3 sm:w-2.5 sm:h-2.5 text-blue-600" />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Parent text - bolder and larger, with embedded variant badge */}
                  <h3 className={cn(
                    "font-bold",
                    productHasVariants ? (compactMode ? "text-sm" : "text-base") : (compactMode ? "text-xs" : "text-sm"),
                    "text-gray-900 truncate leading-tight"
=======
                  {/* Chevron for expandable products */}
                  {productHasVariants && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleProductExpansion(product.id);
                      }}
                      className="flex items-center justify-center w-5 h-5 rounded hover:bg-gray-100 transition-colors cursor-pointer flex-shrink-0"
                      data-interactive
                    >
                      {isProductExpanded ? (
                        <ChevronDown className="w-4 h-4 text-gray-600" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-600" />
                      )}
                    </button>
                  )}
                  {/* Product name - Line 1: Bold */}
                  <h3 className={cn(
                    "font-bold text-gray-900 truncate leading-tight",
                    compactMode ? "text-sm" : "text-base"
>>>>>>> 0c6dbc15edfccecdd64f738284615a3dd123bee3
                  )}>
                    {product.name}
                  </h3>
<<<<<<< HEAD
=======
                  {/* Variant badge - New format */}
                  {productHasVariants && productVariantCount > 0 && (() => {
                    const healthSummary = getVariantHealthSummary(String(product.id));
                    const allHealthy = healthSummary.out === 0 && healthSummary.low === 0 && healthSummary.healthy === healthSummary.total;
                    const allOut = healthSummary.healthy === 0 && healthSummary.low === 0;
                    const someLow = healthSummary.low > 0;
                    
                    let healthText = '';
                    if (allHealthy) {
                      healthText = 'All healthy';
                    } else if (allOut) {
                      healthText = 'All out';
                    } else if (someLow) {
                      healthText = `${healthSummary.low} low`;
                    } else {
                      healthText = `${healthSummary.healthy} healthy`;
                    }
                    
                    return (
                      <TooltipProvider delayDuration={150}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span 
                              className={cn(
                                "inline-flex items-center gap-0.5 text-[10px] font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors",
                                compactMode && "text-[9px] px-1"
                              )}
                              onClick={(e) => {
                                e.stopPropagation();
                                expandProductAndScroll(product.id);
                              }}
                              data-interactive
                            >
                              <ChevronRight className={cn(compactMode ? "w-2.5 h-2.5" : "w-3 h-3")} />
                              {productVariantCount} variants · {healthText}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="top" align="center" sideOffset={4}>
                            <p className="text-xs font-medium mb-1">Variant Health Summary</p>
                            {healthSummary.out > 0 && <p className="text-xs text-red-600">Out of stock: {healthSummary.out}</p>}
                            {healthSummary.low > 0 && <p className="text-xs text-orange-600">Low stock: {healthSummary.low}</p>}
                            {healthSummary.healthy > 0 && <p className="text-xs text-green-600">Healthy: {healthSummary.healthy}</p>}
                            <p className="text-xs text-gray-400 mt-1">Click to expand/collapse variants</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    );
                  })()}
                  {product.category_name && !isColumnVisible('category_name') && (
                    <Badge 
                      variant="secondary" 
                      className={cn(
                        "text-[9px] px-1.5 py-0 h-4 border bg-gray-100 text-gray-700 border-gray-200",
                        compactMode && "text-[8px] px-1"
                      )}
                    >
                      {product.category_name}
                    </Badge>
                  )}
>>>>>>> 0c6dbc15edfccecdd64f738284615a3dd123bee3
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
<<<<<<< HEAD
                {product.barcode && (
                  <p className={cn(
                    "text-gray-700 font-mono leading-tight",
                    compactMode ? "text-[9px] mt-0" : "text-[10px] mt-0"
=======
                {/* Line 2: SKU (muted) */}
                {product.sku && product.sku !== '---' && (
                  <div className={cn(
                    "flex items-center gap-1.5 text-gray-500 mt-0.5",
                    compactMode ? "text-[9px]" : "text-[10px]"
>>>>>>> 0c6dbc15edfccecdd64f738284615a3dd123bee3
                  )}>
                    <span className="font-mono">{product.sku}</span>
                  </div>
                )}
                {product.description && !compactMode && (
<<<<<<< HEAD
                  <p className="text-xs text-gray-700 truncate max-w-xs mt-1 hidden sm:block">
=======
                  <p className="text-[10px] text-gray-500 truncate max-w-xs leading-tight hidden sm:block mt-0.5">
>>>>>>> 0c6dbc15edfccecdd64f738284615a3dd123bee3
                    {product.description}
                  </p>
                )}
              </div>
            </div>
          </td>
        );
      }

      case 'location':
        if (isVariant) {
          const hasVariantLocation = !!product.location;
          const hasParentLocation = parentProduct && !!parentProduct.location;
          const variantMatchesParent = hasVariantLocation && hasParentLocation && product.location === parentProduct.location;
          const showNoLocation = (!hasVariantLocation && !hasParentLocation) || variantMatchesParent;
          return (
            <td className={cn(
<<<<<<< HEAD
              "text-left w-1/8 hidden md:table-cell relative z-10 align-left ",
              "px-3 sm:px-4 py-1 "
            )}>
              {showNoLocation ? (
                <span className={cn(
                  "text-gray-400 opacity-60",
                  "text-xs"
                )}>
                  {variantMatchesParent ? "Same as parent" : "—"}
                </span>
              ) : (
                <span className={cn(
                  !product.location ? "text-gray-400" : "text-gray-900",
                  "text-xs"
                )}>
                  {product.location || (
=======
              getColumnClasses(columnId),
              "relative z-10 align-middle border-r border-gray-300",
              "px-3 py-1"
            )}>
              <div className="flex items-center justify-center gap-1">
                {showDash ? (
                  renderEmptyState('Location', 'Variant inherits location from parent')
                ) : (
                  <>
                    <MapPin className={cn(
                      product.location ? (repetitiveLocations.has(product.location || '') ? "text-gray-200" : "text-gray-300") : "text-gray-200 opacity-30",
                      compactMode ? "w-2.5 h-2.5" : "w-3 h-3"
                    )} />
>>>>>>> 0c6dbc15edfccecdd64f738284615a3dd123bee3
                    <span className={cn(
                      "text-gray-400",
                      "text-xs"
                    )}>
                      —
                    </span>
                  )}
                </span>
              )}
            </td>
          );
        }
        return (
          <td className={cn(
<<<<<<< HEAD
            "text-left w-1/8 hidden md:table-cell relative z-10 align-left",
            "px-3 sm:px-4 py-1 "
=======
            getColumnClasses(columnId),
            "relative z-10 align-middle border-r border-gray-300",
            "px-3 py-2"
>>>>>>> 0c6dbc15edfccecdd64f738284615a3dd123bee3
          )}>
            {!product.location ? (
              <span className={cn(
                "text-gray-400",
                "text-xs"
              )}>
<<<<<<< HEAD
                —
=======
                {product.location || renderEmptyState('Location', 'No location assigned. Products without locations may be harder to find in the warehouse.')}
>>>>>>> 0c6dbc15edfccecdd64f738284615a3dd123bee3
              </span>
            ) : (
              <span className={cn(
                "text-gray-900",
                "text-xs"
              )}>
                {product.location}
              </span>
            )}
          </td>
        );

      case 'warehouses':
        const warehouseName = getWarehouseName(product.warehouse_name);
        if (isVariant) {
          const variantWarehouse = getWarehouseName(product.warehouse_name);
          const parentWarehouse = parentProduct ? getWarehouseName(parentProduct.warehouse_name) : null;
          const matchesParent = variantWarehouse === parentWarehouse;
          return (
            <td className={cn(
<<<<<<< HEAD
              "text-left w-1/8 hidden md:table-cell relative z-10 align-left ",
              "px-3 sm:px-4 py-1 "
            )}>
              {matchesParent ? (
                <span className={cn(
                  "text-gray-400 opacity-60",
                  "text-[10px]"
                )}>
                  Same as parent
                </span>
              ) : !variantWarehouse ? (
                <span className={cn(
                  "text-gray-400",
                  "text-[10px]"
                )}>
                  —
                </span>
              ) : (
                <span className={cn(
                  "text-gray-900",
                  "text-sm"
                )}>
                  {variantWarehouse}
                </span>
=======
              getColumnClasses(columnId),
              "relative z-10 align-middle border-r border-gray-300",
              "px-3 py-1"
            )}>
              {matchesParent ? (
                renderEmptyState('Category', 'Variant inherits category from parent')
              ) : (
                <div className="flex items-center justify-center gap-1">
                  <Warehouse className={cn(
                    variantWarehouse ? "text-gray-300" : "text-gray-200 opacity-30",
                    compactMode ? "w-2.5 h-2.5" : "w-3 h-3"
                  )} />
                  <span className={cn(
                    !variantWarehouse ? "text-gray-300 opacity-50" : "text-gray-500",
                    compactMode ? "text-xs" : "text-sm"
                  )}>
                    {variantWarehouse || renderEmptyState('Warehouse', 'Variant inherits warehouse from parent')}
                  </span>
                </div>
>>>>>>> 0c6dbc15edfccecdd64f738284615a3dd123bee3
              )}
            </td>
          );
        }
        return (
          <td className={cn(
<<<<<<< HEAD
            "text-left w-1/8 hidden md:table-cell relative z-10 align-left",
            "px-3 sm:px-4 py-1 "
=======
            getColumnClasses(columnId),
            "relative z-10 align-middle border-r border-gray-300",
            "px-3 py-2"
>>>>>>> 0c6dbc15edfccecdd64f738284615a3dd123bee3
          )}>
            {!warehouseName ? (
              <span className={cn(
                "text-gray-400",
                "text-[10px]"
              )}>
<<<<<<< HEAD
                —
=======
                {warehouseName || renderEmptyState('Warehouse', 'No warehouse assigned.')}
>>>>>>> 0c6dbc15edfccecdd64f738284615a3dd123bee3
              </span>
            ) : (
              <span className={cn(
                "text-gray-900",
                "text-sm"
              )}>
                {warehouseName}
              </span>
            )}
          </td>
        );

      case 'minimum_stock_level':
        return (
          <td className={cn(
<<<<<<< HEAD
            "text-left hidden sm:table-cell",
            "px-3 sm:px-4 py-2 align-middle "
=======
            getColumnClasses(columnId),
            "px-3 py-2 align-middle border-r border-gray-300"
>>>>>>> 0c6dbc15edfccecdd64f738284615a3dd123bee3
          )}>
            <div className="flex items-center justify-end">
              <span className={cn(
                "text-gray-900 font-mono",
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
        const stockStatusLabel = isVariant 
          ? getStockStatusLabel(Number(product.quantity_in_stock) || 0, product.minimum_stock_level || 0)
          : getStockStatusLabel(stockValue, product.minimum_stock_level || 0);
        const productHasVariantsForStock = !isVariant && product.id && (variantCounts.get(String(product.id)) ?? 0) > 0;
        const isAggregatedTotal = productHasVariantsForStock && displayStock !== (Number(product.quantity_in_stock) || 0);
        
<<<<<<< HEAD
        // Calculate contextual information
        const reorderDays = stockValue > 0 && stockValue <= (product.minimum_stock_level || 0) 
          ? getReorderDays(stockValue, product.minimum_stock_level || 0)
          : null;
        const daysSinceLastStocked = stockValue === 0 
          ? getDaysSinceLastStocked(product)
          : null;
=======
        // Get enhanced stock status details
        const statusDetails = getStockStatusDetails(
          stockValue,
          product.minimum_stock_level || 0,
          product.updated_at
        );
        
        // Only show badge for critical or at-risk, not for healthy
        const shouldShowBadge = statusDetails.stockStatus === 'critical' || statusDetails.stockStatus === 'at-risk';
>>>>>>> 0c6dbc15edfccecdd64f738284615a3dd123bee3
        
        return (
          <td 
            className={cn(
<<<<<<< HEAD
              "text-left w-1/8 align-middle",
              isVariant ? "" : "",
              "px-3 sm:px-4 py-1 "
            )} 
            onClick={(e) => isMobile && e.stopPropagation()}
          >
            <TooltipProvider delayDuration={150}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    data-interactive
                    className={cn(
                      "rounded-lg p-1.5 transition-all",
                      !isMobile && "cursor-pointer group hover:bg-blue-50 hover:border-blue-200",
                      isAggregatedTotal && "bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200/60 shadow-sm",
                      stockValue === 0 && "bg-red-50/50 border border-red-200/50",
                      stockValue > 0 && stockValue <= (product.minimum_stock_level || 0) && "bg-orange-50/50 border border-orange-200/50"
                    )}
                    onClick={(e) => {
                      if (!isMobile) {
                        e.stopPropagation();
                        handleStockAction(product, 'in');
                      }
                    }}
                  >
                    {/* Status indicator with label and quantity */}
                    <div className={cn(
                      "flex items-center gap-1.5",
                      (reorderDays !== null || daysSinceLastStocked !== null) && "mb-0.5"
                    )}>
                      <div
                        className={cn(
                          'rounded-full shadow-sm flex-shrink-0',
                          stockDotColorValue,
                          stockValue === 0 ? 'animate-pulse' : '',
                          'w-2 h-2'
                        )}
                      />
                      <span
                        className={cn(
                          'font-semibold text-xs',
                          stockValue === 0 ? 'text-red-700' : 
                          stockValue > 0 && stockValue <= (product.minimum_stock_level || 0) ? 'text-orange-700' : 
                          'text-green-700',
                          !isMobile && 'group-hover:text-blue-900'
                        )}
                      >
                        {stockStatusLabel}
                      </span>
                      {stockValue > 0 && (
                        <>
                          <span className="text-gray-400 text-xs">•</span>
                          <span
                            className={cn(
                              'font-mono text-xs font-semibold',
                              isAggregatedTotal ? 'text-blue-700' : 'text-gray-900',
                              !isMobile && 'group-hover:text-blue-900'
                            )}
                          >
                            {formatStockQuantity(stockValue)} {stockValue === 1 ? 'unit' : 'units'}
                          </span>
                        </>
                      )}
                      {isAggregatedTotal && (
                        <span className="text-[9px] text-blue-600 font-bold ml-1 bg-blue-200/50 px-1 py-0.5 rounded">Σ</span>
                      )}
                    </div>
                    
                    {/* Contextual information */}
                    {reorderDays !== null && (
                      <div className={cn(
                        "text-[10px] text-orange-600 font-medium mt-0.5",
                        !isMobile && "group-hover:text-orange-700"
                      )}>
                        Reorder in ~{reorderDays} {reorderDays === 1 ? 'day' : 'days'}
                      </div>
                    )}
                    {daysSinceLastStocked !== null && (
                      <div className={cn(
                        "text-[10px] text-red-600 font-medium mt-0.5",
                        !isMobile && "group-hover:text-red-700"
                      )}>
                        Last stocked {daysSinceLastStocked} {daysSinceLastStocked === 1 ? 'day' : 'days'} ago
                      </div>
                    )}
                  </div>
                </TooltipTrigger>
                {!isMobile && (
                  <TooltipContent side="top" align="center" sideOffset={8} className="z-[200000] max-w-xs shadow-lg">
                    <p className="font-medium">
                      {formatStockQuantity(stockValue)} in stock. Minimum: {formatStockQuantity(product.minimum_stock_level || 0)}
                      {isAggregatedTotal && <span className="text-xs text-gray-500 ml-1">(Total)</span>}
                    </p>
                    {productHasVariantsForStock && (
                      <p className="text-xs text-gray-400 mt-1">
                        Base: {formatStockQuantity(product.quantity_in_stock)} + Variants: {formatStockQuantity(displayStock - (Number(product.quantity_in_stock) || 0))}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">Status: {stockStatusValue}</p>
                    {stockValue === 0 && (
                      <p className="text-xs text-red-400 mt-1">⚠️ Out of stock!</p>
                    )}
                    {stockValue > 0 && stockValue <= (product.minimum_stock_level || 0) && (
                      <p className="text-xs text-orange-400 mt-1">⚠️ Low stock alert</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">Click to adjust stock</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
=======
              getColumnClasses(columnId),
              "align-middle border-r border-t border-b border-gray-300",
              "py-1",
              "px-3"
            )} 
            onClick={(e) => isMobile && e.stopPropagation()}
          >
            <div className="flex items-center justify-center gap-2">
              {/* Stock Badge - only show for critical/at-risk */}
              {shouldShowBadge && (
                <StockBadge
                  status={statusDetails.stockStatus}
                  quantity={stockValue}
                  daysOfCover={null}
                  compact={compactMode}
                />
              )}
              
              {/* Unit count - always visible, more prominent, green for healthy */}
              <span className={cn(
                "font-mono font-semibold",
                shouldShowBadge ? "text-gray-700" : "text-green-600",
                compactMode ? "text-xs" : "text-sm"
              )}>
                {formatStockQuantity(stockValue)}
              </span>
              
              {isAggregatedTotal && (
                <span className="text-[9px] text-blue-600 font-bold bg-blue-200/50 px-1 py-0.5 rounded">Σ</span>
              )}
            </div>
>>>>>>> 0c6dbc15edfccecdd64f738284615a3dd123bee3
          </td>
        );

      case 'purchase_price':
        return (
          <td className={cn(
<<<<<<< HEAD
            "text-right w-1/8 hidden sm:table-cell",
            "px-3 sm:px-4 py-2 align-middle "
=======
            getColumnClasses(columnId),
            "px-3 py-2 align-middle border-r border-gray-300"
>>>>>>> 0c6dbc15edfccecdd64f738284615a3dd123bee3
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
<<<<<<< HEAD
              "text-right w-1/8 hidden sm:table-cell align-middle ",
              "px-3 sm:px-4 py-1 "
=======
              getColumnClasses(columnId),
              "align-middle border-r border-gray-300",
              "px-3 py-1"
>>>>>>> 0c6dbc15edfccecdd64f738284615a3dd123bee3
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
<<<<<<< HEAD
            "text-left w-1/8 hidden sm:table-cell align-middle",
            "px-3 sm:px-4 py-1 "
=======
            getColumnClasses(columnId),
            "align-middle border-r border-gray-300",
            "px-3 py-2"
>>>>>>> 0c6dbc15edfccecdd64f738284615a3dd123bee3
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
<<<<<<< HEAD
            "text-left hidden lg:table-cell align-middle",
            "px-3 sm:px-4 py-1 "
=======
            getColumnClasses(columnId),
            "align-middle border-r border-gray-300",
            "px-3 py-2"
>>>>>>> 0c6dbc15edfccecdd64f738284615a3dd123bee3
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

      default:
        return null;
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

  // Handle create location action
  const handleCreateLocation = () => {
    const locationName = prompt('Enter location name:');
    if (locationName && locationName.trim()) {
      // Location creation is handled by setting product locations
      // This is just a quick way to create a location reference
      toast.success(`Location "${locationName}" can be used when adding products`);
    }
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

    const newLocation = prompt(
      `Enter new location for ${selectedProductIds.size} selected product${selectedProductIds.size !== 1 ? 's' : ''}:`,
      ''
    );

    if (newLocation === null) return;

    try {
      const { error } = await supabase
        .from('products')
        .update({ location: newLocation.trim() || null })
        .in('id', Array.from(selectedProductIds));

      if (error) throw error;

      toast.success(`Updated location for ${selectedProductIds.size} product${selectedProductIds.size !== 1 ? 's' : ''}`);
      setSelectedProductIds(new Set());
      
      queryClient.invalidateQueries({ queryKey: ['productsByCategories'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    } catch (error) {
      console.error('Error transferring stock:', error);
      toast.error('Failed to update product locations');
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
      const csvHeaders = ['Name', 'SKU', 'Barcode', 'Category', 'Location', 'Stock', 'Cost', 'Price', 'Description'];
      const csvData = selectedProducts.map((product: any) => [
        product.name || '',
        product.sku || '',
        product.barcode || '',
        product.category_name || '',
        product.location || '',
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
      const csvHeaders = ['Name', 'SKU', 'Barcode', 'Category', 'Location', 'Stock', 'Cost', 'Price', 'Description'];
      const csvData = productsToExport.map((product: any) => [
        product.name || '',
        product.sku || '',
        product.barcode || '',
        product.category_name || '',
        product.location || '',
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
        id: 'go-to-location',
        label: 'Go to Location',
        icon: <MapPin className="w-4 h-4" />,
        keywords: ['location', 'warehouse', 'shelf', 'find'],
        group: 'Navigation',
        action: () => {
          const location = prompt('Enter location to search for:');
          if (location && location.trim()) {
            setSearchTerm(location.trim());
            // Filter products by location
            const locationProducts = categoryProducts.filter((p: any) =>
              p.location?.toLowerCase().includes(location.toLowerCase())
            );
            if (locationProducts.length === 0) {
              toast.info(`No products found at location "${location}"`);
            } else {
              toast.success(`Found ${locationProducts.length} product(s) at "${location}"`);
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

  return (
<<<<<<< HEAD
    <div className={`h-[calc(100vh-8rem)] md:h-[calc(100vh-8rem)] ${isMobile ? 'm-2' : 'm-4'} rounded-lg border border-gray-200 flex flex-col overflow-hidden overscroll-none touch-pan-y bg-white`} style={{ touchAction: 'pan-y' }}>
      {/* Main Layout with Product Table */}
      <div className="flex-1 flex overflow-hidden min-h-0 relative overscroll-none">
        {/* Main Content - Products Table */}
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 min-w-0 min-h-0 relative">
          {/* Search Results Info - Above all other elements */}
=======
    <div className={`h-screen ${isMobile ? 'p-2' : 'p-4'} flex flex-col gap-4 overflow-hidden`} style={{ touchAction: 'pan-y' }}>
      {/* Header Section - Separate Card */}
      <Card className="flex-shrink-0">
        <CardContent className="p-0">
          {/* Section 1: Filters + Primary Actions */}
          <div className="px-4 md:px-6 py-3 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between gap-4">
              {/* Filters */}
              <div className="flex items-center gap-3 flex-1">
                <QuickSwitcherBar
                  tree={tree}
                  selectedCategoryIds={selectedCategoryIds}
                  onCategorySelectionChange={handleCategorySelectionChange}
                  selectedLocation={selectedLocation}
                  onLocationChange={setSelectedLocation}
                  selectedWarehouse={selectedWarehouse}
                  onWarehouseChange={setSelectedWarehouse}
                  onQuickFilterChange={setActiveQuickFilter}
                  activeQuickFilter={activeQuickFilter}
                />
              </div>
              
              {/* Primary & Secondary Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Secondary Actions */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleImportClick}
                  className="h-9 px-3 text-sm font-medium rounded-lg border-gray-300 hover:bg-gray-50"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Import
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportAll}
                  className="h-9 px-3 text-sm font-medium rounded-lg border-gray-300 hover:bg-gray-50"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                {/* Primary Action */}
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => {
                    setScannedSKU('');
                    setPreFilledProductName('');
                    navigate('/dashboard/products/new');
                  }}
                  className="h-9 px-4 text-sm font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </div>
            </div>
          </div>

          {/* Section 2: Needs Attention Status Bar */}
          <div className="px-4 md:px-6 py-2.5 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Needs attention</span>
              <div className="flex items-center gap-2 flex-wrap">
                {/* Out of stock - Red */}
                <button
                  onClick={() => toggleQuickFilter('out-of-stock')}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                    activeQuickFilters.includes('out-of-stock')
                      ? "bg-red-100 text-red-700 border border-red-300 shadow-sm"
                      : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                  )}
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Out of stock</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-red-200 text-red-800">
                    {quickFilterCounts['out-of-stock']}
                  </span>
                </button>
                
                {/* Low stock - Orange */}
                <button
                  onClick={() => toggleQuickFilter('low-stock')}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                    activeQuickFilters.includes('low-stock')
                      ? "bg-orange-100 text-orange-700 border border-orange-300 shadow-sm"
                      : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                  )}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Low stock</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-orange-200 text-orange-800">
                    {quickFilterCounts['low-stock']}
                  </span>
                </button>
                
                {/* No location - Neutral */}
                <button
                  onClick={() => toggleQuickFilter('no-location')}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                    activeQuickFilters.includes('no-location')
                      ? "bg-gray-100 text-gray-700 border border-gray-400 shadow-sm"
                      : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                  )}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>No location</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-gray-200 text-gray-800">
                    {quickFilterCounts['no-location']}
                  </span>
                </button>
                
                {/* Missing SKU - Neutral */}
                <button
                  onClick={() => toggleQuickFilter('missing-sku')}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                    activeQuickFilters.includes('missing-sku')
                      ? "bg-gray-100 text-gray-700 border border-gray-400 shadow-sm"
                      : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                  )}
                >
                  <Hash className="w-3.5 h-3.5" />
                  <span>Missing SKU</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-gray-200 text-gray-800">
                    {quickFilterCounts['missing-sku']}
                  </span>
                </button>
                
                {/* Has variants - Neutral */}
                <button
                  onClick={() => toggleQuickFilter('has-variants')}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                    activeQuickFilters.includes('has-variants')
                      ? "bg-gray-100 text-gray-700 border border-gray-400 shadow-sm"
                      : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                  )}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Has variants</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-gray-200 text-gray-800">
                    {quickFilterCounts['has-variants']}
                  </span>
                </button>
                
                {/* Clear all */}
                {activeQuickFilters.length > 0 && (
                  <button
                    onClick={() => setActiveQuickFilters([])}
                    className="px-2 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Search + Secondary Actions */}
          <div className="px-4 md:px-6 py-3 bg-white">
            <div className="flex items-center gap-3">
              {/* Search Bar - Centered and Prominent */}
              <div className="flex-1 flex justify-center">
                <div className="w-full max-w-2xl">
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
                  onCreateLocation={handleCreateLocation}
                  placeholder="Search products, SKUs, suppliers…"
                  />
                </div>
              </div>
              
              {/* Secondary Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {selectedProductIds.size > 0 && (
                  <span className="text-sm font-medium text-gray-600 hidden sm:inline">
                    {selectedProductIds.size} selected
                  </span>
                )}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsColumnVisibilityModalOpen(true)}
                        className="h-9 px-3 text-sm font-medium rounded-lg border-gray-300 hover:bg-gray-50"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">Customize Columns</span>
                        <span className="sm:hidden">Columns</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Customize visible columns</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Table Section - Separate Card */}
      <Card className="flex-1 flex flex-col overflow-hidden min-h-0">
        <CardContent className="p-0 flex-1 flex flex-col overflow-hidden min-h-0">
          {/* Search Results Info */}
>>>>>>> 0c6dbc15edfccecdd64f738284615a3dd123bee3
          {searchTerm && (
            <div className="flex-shrink-0 px-3 md:px-4 lg:px-6 py-2 bg-blue-50 border-b border-blue-200 flex items-center justify-between gap-3 relative z-50">
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
<<<<<<< HEAD
              {/* Consolidated Filtering Row - Search + Category + Warehouse + Actions */}
              <div className="flex-shrink-0 px-3 md:px-4 lg:px-6 py-2 bg-white border-b flex flex-wrap items-center gap-2">
                {/* Search Bar */}
                <div className="flex-1 min-w-[200px]">
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
                    onCreateLocation={handleCreateLocation}
                    placeholder="Search products, SKUs, categories, suppliers…"
                  />
                </div>

                {/* All Categories Dropdown */}
                <Popover open={isCategoryPopoverOpen} onOpenChange={setIsCategoryPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 text-xs justify-between min-w-[140px] flex-shrink-0"
                      onClick={() => {
                        if (!isCategoryPopoverOpen) {
                          setCategorySearchQuery('');
                        }
                      }}
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Package className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">
                          {selectedCategoryIds.length === 0 ? (
                            'All Categories'
                          ) : selectedCategoryIds.length === 1 ? (
                            selectedCategoryNames[0] || '1 Category'
                          ) : (
                            `${selectedCategoryIds.length} Categories`
                          )}
                        </span>
                      </div>
                      <ChevronDown className="w-3.5 h-3.5 ml-1.5 flex-shrink-0" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[280px] p-2" align="start">
                    <div className="space-y-1">
                      <div className="relative mb-2">
                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        <Input
                          type="text"
                          placeholder="Search categories..."
                          value={categorySearchQuery}
                          onChange={(e) => setCategorySearchQuery(e.target.value)}
                          className="h-8 pl-8 text-xs"
                        />
                      </div>
                      <div className="max-h-[200px] overflow-y-auto space-y-1">
                        {filteredCategories.length === 0 ? (
                          <div className="p-3 text-center text-xs text-gray-500">
                            No categories found
                          </div>
                        ) : (
                          filteredCategories.map((category) => {
                            const isSelected = selectedCategoryIds.includes(category.id);
                            return (
                              <label
                                key={category.id}
                                className={cn(
                                  "flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer hover:bg-gray-50 transition-colors",
                                  isSelected && "bg-blue-50"
                                )}
                              >
                                <Checkbox
                                  checked={isSelected}
                                  onCheckedChange={() => handleCategoryToggle(category.id)}
                                  className="data-[state=checked]:bg-blue-600 w-4 h-4"
                                />
                                <span className={cn(
                                  "flex-1 text-xs truncate",
                                  isSelected ? "font-medium text-blue-900" : "text-gray-700"
                                )}>
                                  {category.name}
                                </span>
                              </label>
                            );
                          })
                        )}
                      </div>
                      {selectedCategoryIds.length > 0 && (
                        <div className="pt-1 border-t mt-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              handleCategorySelectionChange([]);
                              setIsCategoryPopoverOpen(false);
                            }}
                            className="w-full h-7 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="w-3.5 h-3.5 mr-1" />
                            Clear Selection
                          </Button>
                        </div>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>

                {/* All Warehouses Dropdown */}
                {warehouses.length > 0 && (
                  <Popover open={isWarehousePopoverOpen} onOpenChange={setIsWarehousePopoverOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 text-xs justify-between min-w-[140px] flex-shrink-0"
                        onClick={() => {
                          if (!isWarehousePopoverOpen) {
                            setWarehouseSearchQuery('');
                          }
                        }}
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          <Warehouse className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="truncate">{selectedWarehouse || 'All Warehouses'}</span>
                        </div>
                        <ChevronDown className="w-3.5 h-3.5 ml-1.5 flex-shrink-0" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[240px] p-2" align="start">
                      <div className="space-y-1">
                        <div className="relative mb-2">
                          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                          <Input
                            type="text"
                            placeholder="Search warehouses..."
                            value={warehouseSearchQuery}
                            onChange={(e) => setWarehouseSearchQuery(e.target.value)}
                            className="h-8 pl-8 text-xs"
                          />
                        </div>
                        <div className="max-h-[200px] overflow-y-auto space-y-1">
                          <button
                            onClick={() => {
                              setSelectedWarehouse(null);
                              setIsWarehousePopoverOpen(false);
                            }}
                            className={cn(
                              "w-full text-left px-2 py-1.5 rounded-md text-xs hover:bg-gray-50 transition-colors",
                              !selectedWarehouse && "bg-blue-50 font-medium text-blue-900"
                            )}
                          >
                            All Warehouses
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
                                  "w-full text-left px-2 py-1.5 rounded-md text-xs hover:bg-gray-50 transition-colors",
                                  selectedWarehouse === warehouse.name && "bg-blue-50 font-medium text-blue-900"
                                )}
                              >
                                {warehouse.name}
                              </button>
                            ))
                          ) : (
                            <div className="px-2 py-1.5 text-xs text-gray-500 text-center">
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
                                setIsWarehousePopoverOpen(false);
                              }}
                              className="w-full h-7 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <X className="w-3.5 h-3.5 mr-1" />
                              Clear Selection
                            </Button>
                          </div>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {selectedProductIds.size > 0 && (
                    <span className="text-xs sm:text-sm font-medium text-gray-600 px-2 py-1.5 sm:px-0 sm:py-0 bg-gray-100 sm:bg-transparent rounded-md sm:rounded-none">
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
                          onClick={() => setIsColumnVisibilityModalOpen(true)}
                          className="h-9 px-2.5"
                        >
                          <Settings className="w-4 h-4" />
                          <span className="hidden lg:inline ml-1.5">Columns</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Customize visible columns</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleExportAll}
                          className="h-9 px-2.5 border-green-600 text-green-600 hover:bg-green-50"
                        >
                          <Download className="w-4 h-4" />
                          <span className="hidden lg:inline ml-1.5">Export</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Export all products</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleImportClick}
                          className="h-9 px-2.5 border-blue-600 text-blue-600 hover:bg-blue-50"
                        >
                          <Upload className="w-4 h-4" />
                          <span className="hidden lg:inline ml-1.5">Import</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Import products from CSV</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              
=======
>>>>>>> 0c6dbc15edfccecdd64f738284615a3dd123bee3
              {/* Products Section - Scrollable */}
              <div 
                className="flex-1 overflow-y-auto min-h-0 overscroll-contain bg-gray-50" 
                style={{ 
                  WebkitOverflowScrolling: 'touch',
                  paddingBottom: selectedProductIds.size > 0 ? '80px' : '0'
                }}
              >
                <div className="">
                {productsLoading ? (
                  <div className="flex items-center justify-center py-12">
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
<<<<<<< HEAD
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden relative">
                    {/* Scroll indicators for mobile */}
                    <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none z-20 sm:hidden" />
                    <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-20 sm:hidden" />
                    <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100" style={{ WebkitOverflowScrolling: 'touch' }}>
                      <table className={cn("w-full table-auto divide-y divide-gray-200", !isMobile && "min-w-[640px]")}>
                        <thead className="bg-gray-100 border-b-2 border-gray-300 sticky top-0 z-10">
=======
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    {/* Bulk Action Bar */}
                    <BulkActionBar
                      selectedCount={selectedProductIds.size}
                      onUpdateStock={() => {
                        if (selectedProductIds.size > 0) {
                          handleBulkAdjustStock();
                        }
                      }}
                      onAssignLocation={() => {
                        if (selectedProductIds.size > 0) {
                          handleBulkTransferStock();
                        }
                      }}
                      onExport={() => {
                        if (selectedProductIds.size > 0) {
                          handleBulkExport();
                        }
                      }}
                      onArchive={() => {
                        if (selectedProductIds.size > 0) {
                          handleBulkArchive();
                        }
                      }}
                      onClearSelection={() => setSelectedProductIds(new Set())}
                    />
                    <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                      <table className={cn("w-full table-fixed border-collapse", !isMobile && "min-w-[640px]")}>
                        <thead className="bg-gray-50 sticky top-0 z-10 border-b border-gray-300">
>>>>>>> 0c6dbc15edfccecdd64f738284615a3dd123bee3
                          {/* Column Headers */}
                          <tr>
                            <th 
                              className={cn(
<<<<<<< HEAD
                                "text-center w-14 sm:w-12",
                                "px-3 sm:px-4 py-1.5 "
=======
                                "text-center w-12 border-r border-gray-300 sticky left-0 z-20 bg-gray-50",
                                compactMode ? "px-2 py-1.5" : "px-3 py-2"
>>>>>>> 0c6dbc15edfccecdd64f738284615a3dd123bee3
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
                            
<<<<<<< HEAD
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
=======
                            // Determine row visual emphasis based on stock status
                            const stockStatusDetails = getStockStatusDetails(displayStock, product.minimum_stock_level, product.updated_at);
>>>>>>> 0c6dbc15edfccecdd64f738284615a3dd123bee3
                            
                            return (
                              <React.Fragment key={product.id}>
                              <tr
                                data-product-id={product.id}
                                onClick={(e) => handleRowClick(e, product)}
                                onMouseEnter={() => {
                                  setHoveredRowId(product.id);
                                  setHoveredProductGroupId(product.id);
                                }}
                                onMouseLeave={() => {
                                  setHoveredRowId(null);
                                  setHoveredProductGroupId(null);
                                }}
                                className={cn(
<<<<<<< HEAD
                                  'group transition-all duration-200 relative',
                                  'border-b border-[#EEE]',
                                  hoveredImageProductId === product.id && 'z-50',
                                )}
                              >
                                {/* Selection checkbox */}
                                <td 
                                  className={cn(
                                    "text-center w-14 sm:w-12 relative z-10",
                                    "px-3 sm:px-4 py-1 "
=======
                                  'group transition-all duration-200 relative cursor-pointer',
                                  index % 2 === 0 ? "bg-white" : "bg-gray-50/50",
                                  hoveredImageProductId === product.id && 'z-50',
                                  hoveredProductGroupId === product.id && 'bg-blue-50/50',
                                  'hover:bg-blue-50/50'
                                )}
                              >
                                {/* Selection checkbox - sticky */}
                                <td 
                                  className={cn(
                                    "text-center w-12 relative z-10 border-r border-gray-300 sticky left-0 bg-inherit",
                                    compactMode ? "px-2 py-1" : "px-3 py-1.5"
>>>>>>> 0c6dbc15edfccecdd64f738284615a3dd123bee3
                                  )} 
                                  onClick={(e) => e.stopPropagation()}
                                  data-interactive
                                >
                                  <div className="flex items-center justify-center">
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
<<<<<<< HEAD
                                            'group transition-all duration-200 relative',
                                            'border-b border-[#EEE]',
                                            'cursor-pointer',
                                            'h-6'
=======
                                            'group transition-all duration-200 relative bg-white',
                                            hoveredProductGroupId === product.id && 'bg-gray-50',
                                            'hover:bg-gray-50',
                                            'cursor-pointer'
>>>>>>> 0c6dbc15edfccecdd64f738284615a3dd123bee3
                                          )}
                                          style={{
                                            backgroundImage: 'linear-gradient(to right, rgb(209, 213, 219) 0px, rgb(209, 213, 219) 1px, transparent 1px)',
                                            backgroundPosition: 'left center',
                                            backgroundSize: '1px 100%',
                                            backgroundRepeat: 'no-repeat'
                                          }}
                                        >
<<<<<<< HEAD
                                          {/* Continuous vertical line - connects parent to last child */}
                                          <td 
                                            className="absolute left-0 top-0 bottom-0 w-px bg-gray-300"
                                            style={{ zIndex: 0 }}
                                          />
                                          
                                          {/* Empty checkbox cell for alignment */}
                                          <td 
                                            className={cn(
                                              "w-14 sm:w-12",
                                              "px-3 sm:px-4 py-0.5"
=======
                                          {/* Render checkbox cell - empty for variants but must be present for column alignment */}
                                          <td 
                                            className={cn(
                                              "text-center w-12 relative z-10 border-r border-gray-300",
                                              "px-3 py-2"
>>>>>>> 0c6dbc15edfccecdd64f738284615a3dd123bee3
                                            )}
                                          >
                                            {/* Non-breaking space to ensure cell maintains width */}
                                            &nbsp;
                                          </td>
                                          
                                          {/* Render columns in order for variants */}
                                          {getOrderedVisibleColumns.map(columnId => 
                                            <React.Fragment key={columnId}>
                                              {renderColumnCell(columnId, variant, variantStock, variantStockStatus, variantStockDotColor, [], true, product)}
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
                    {totalPages > 1 && (
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-3 sm:px-4 py-3 bg-white border-t border-gray-200">
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm text-gray-700">
                            Showing {startIndex + 1} to {Math.min(endIndex, totalProducts)} of {totalProducts} products
                          </span>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                            className="h-10 sm:h-8 px-3 min-h-[44px] sm:min-h-0 touch-manipulation"
                            title="First page"
                          >
                            <ChevronLeft className="w-4 h-4 sm:mr-1" />
                            <ChevronLeft className="w-4 h-4 sm:-ml-1 hidden sm:inline" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="h-10 sm:h-8 px-3 min-h-[44px] sm:min-h-0 touch-manipulation"
                            title="Previous page"
                          >
                            <ChevronLeft className="w-4 h-4 sm:mr-1" />
                            <span className="hidden sm:inline">Previous</span>
                          </Button>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(isMobile ? 3 : 5, totalPages) }, (_, i) => {
                              let pageNum: number;
                              if (totalPages <= (isMobile ? 3 : 5)) {
                                pageNum = i + 1;
                              } else if (currentPage <= 2) {
                                pageNum = i + 1;
                              } else if (currentPage >= totalPages - 1) {
                                pageNum = totalPages - (isMobile ? 2 : 4) + i;
                              } else {
                                pageNum = currentPage - (isMobile ? 1 : 2) + i;
                              }
                              return (
                                <Button
                                  key={pageNum}
                                  variant={currentPage === pageNum ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => setCurrentPage(pageNum)}
                                  className={cn(
                                    "h-10 sm:h-8 min-w-[44px] sm:min-w-[2rem] touch-manipulation",
                                    currentPage === pageNum && "bg-blue-600 hover:bg-blue-700 text-white"
                                  )}
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
                            className="h-10 sm:h-8 px-3 min-h-[44px] sm:min-h-0 touch-manipulation"
                            title="Next page"
                          >
                            <span className="hidden sm:inline">Next</span>
                            <ChevronRight className="w-4 h-4 sm:ml-1" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage === totalPages}
                            className="h-10 sm:h-8 px-3 min-h-[44px] sm:min-h-0 touch-manipulation"
                            title="Last page"
                          >
                            <ChevronRight className="w-4 h-4 sm:ml-1" />
                            <ChevronRight className="w-4 h-4 sm:-mr-1 hidden sm:inline" />
                          </Button>
                        </div>
                      </div>
                    )}
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
        </CardContent>
      </Card>

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
            <div className="space-y-4 py-4">
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

      {/* Fixed Bottom Bulk Action Bar - Enhanced */}
      {selectedProductIds.size > 0 && (
<<<<<<< HEAD
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg safe-area-inset-bottom">
          <div className="max-w-full mx-auto px-3 sm:px-4 py-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-3">
                <span className="text-xs sm:text-sm font-semibold text-gray-900">
                  {selectedProductIds.size} selected
                </span>
=======
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-50 to-indigo-50 border-t-2 border-blue-300 shadow-2xl animate-in slide-in-from-bottom duration-300">
          <div className="max-w-full mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-lg shadow-md">
                  <Check className="w-4 h-4" />
                  <span className="text-sm font-bold">
                    {selectedProductIds.size} product{selectedProductIds.size !== 1 ? 's' : ''} selected
                  </span>
                </div>
>>>>>>> 0c6dbc15edfccecdd64f738284615a3dd123bee3
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedProductIds(new Set())}
<<<<<<< HEAD
                  className="text-gray-600 hover:text-gray-900 h-10 sm:h-9 min-h-[44px] sm:min-h-0 touch-manipulation"
                >
                  <X className="w-4 h-4 sm:mr-1" />
                  <span className="hidden sm:inline">Clear</span>
=======
                  className="text-gray-700 hover:text-gray-900 hover:bg-white/50"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear selection
>>>>>>> 0c6dbc15edfccecdd64f738284615a3dd123bee3
                </Button>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {/* Edit button - only enabled when exactly 1 product is selected */}
                {selectedProductIds.size === 1 && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => {
                      const selectedId = Array.from(selectedProductIds)[0];
                      const product = sortedProducts.find((p: any) => p.id === selectedId);
                      if (product) {
                        handleProductEdit(product);
                      }
                    }}
                    className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 h-10 sm:h-9 min-h-[44px] sm:min-h-0 touch-manipulation flex-1 sm:flex-initial"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </Button>
                )}
              
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleBulkAdjustStock}
<<<<<<< HEAD
                  className="flex items-center gap-2 h-10 sm:h-9 min-h-[44px] sm:min-h-0 touch-manipulation flex-1 sm:flex-initial"
=======
                  className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 shadow-md"
>>>>>>> 0c6dbc15edfccecdd64f738284615a3dd123bee3
                >
                  <TrendingUp className="w-4 h-4" />
                  <span className="hidden sm:inline">Update Stock</span>
                  <span className="sm:hidden">Stock</span>
                </Button>
              
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkTransferStock}
                  className="flex items-center gap-2 border-blue-300 hover:bg-blue-50"
                >
                  <MapPin className="w-4 h-4" />
                  <span className="hidden sm:inline">Move Location</span>
                  <span className="sm:hidden">Move</span>
                </Button>
              
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkExport}
<<<<<<< HEAD
                  className="flex items-center gap-2 h-10 sm:h-9 min-h-[44px] sm:min-h-0 touch-manipulation flex-1 sm:flex-initial"
=======
                  className="flex items-center gap-2 border-gray-300 hover:bg-gray-50"
>>>>>>> 0c6dbc15edfccecdd64f738284615a3dd123bee3
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Export</span>
                  <span className="sm:hidden">Export</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkDeleteProducts}
<<<<<<< HEAD
                  className="flex items-center gap-2 h-10 sm:h-9 min-h-[44px] sm:min-h-0 touch-manipulation flex-1 sm:flex-initial"
=======
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-300"
>>>>>>> 0c6dbc15edfccecdd64f738284615a3dd123bee3
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
