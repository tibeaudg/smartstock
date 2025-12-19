/**
 * Column Field Mapping Utility
 * 
 * This file defines all available columns for the products table.
 * When adding new fields to AddProductModal or ProductDetailModal,
 * make sure to add them here as well to enable column visibility control.
 * 
 * The column IDs should match the data keys used in the product objects.
 */

export interface ColumnDefinition {
  id: string; // Column identifier (matches product data key)
  label: string; // Display name for the column
  category: 'basic' | 'inventory' | 'pricing' | 'metadata' | 'category';
  sortable: boolean; // Whether this column can be sorted
  defaultVisible: boolean; // Whether this column is visible by default
  dataKey: string; // The actual key in the product object
  description?: string; // Optional description for tooltips
}

/**
 * All available columns for the products table.
 * 
 * IMPORTANT: When adding new fields to product modals, add them here too!
 */
export const AVAILABLE_COLUMNS: ColumnDefinition[] = [
  // Basic Information
  {
    id: 'name',
    label: 'Product',
    category: 'basic',
    sortable: true,
    defaultVisible: true,
    dataKey: 'name',
    description: 'Product name',
  },
  {
    id: 'description',
    label: 'Description',
    category: 'basic',
    sortable: false,
    defaultVisible: false,
    dataKey: 'description',
    description: 'Product description',
  },
  {
    id: 'sku',
    label: 'SKU',
    category: 'basic',
    sortable: true,
    defaultVisible: true,
    dataKey: 'sku',
    description: 'Stock Keeping Unit',
  },
  {
    id: 'barcode',
    label: 'Barcode',
    category: 'basic',
    sortable: false,
    defaultVisible: false,
    dataKey: 'barcode',
    description: 'Product barcode',
  },
  
  // Category Information
  {
    id: 'category_name',
    label: 'Category',
    category: 'category',
    sortable: true,
    defaultVisible: true,
    dataKey: 'category_name',
    description: 'Product category',
  },
  
  // Inventory Information
  {
    id: 'stock',
    label: 'Stock',
    category: 'inventory',
    sortable: true,
    defaultVisible: true,
    dataKey: 'quantity_in_stock',
    description: 'Current stock quantity',
  },
  {
    id: 'minimum_stock_level',
    label: 'Min. Stock Level',
    category: 'inventory',
    sortable: true,
    defaultVisible: false,
    dataKey: 'minimum_stock_level',
    description: 'Minimum stock level before reorder',
  },
  {
    id: 'location',
    label: 'Location',
    category: 'inventory',
    sortable: true,
    defaultVisible: true,
    dataKey: 'location',
    description: 'Storage location',
  },
  {
    id: 'warehouses',
    label: 'Warehouses',
    category: 'inventory',
    sortable: true,
    defaultVisible: true,
    dataKey: 'location',
    description: 'Warehouse name',
  },
  
  // Pricing Information
  {
    id: 'purchase_price',
    label: 'Cost',
    category: 'pricing',
    sortable: true,
    defaultVisible: false,
    dataKey: 'purchase_price',
    description: 'Purchase price (cost)',
  },
  {
    id: 'sale_price',
    label: 'Price',
    category: 'pricing',
    sortable: true,
    defaultVisible: false,
    dataKey: 'sale_price',
    description: 'Sale price',
  },
  {
    id: 'unit_price',
    label: 'Unit Price',
    category: 'pricing',
    sortable: true,
    defaultVisible: false,
    dataKey: 'unit_price',
    description: 'Unit price',
  },
  
  // Metadata
  {
    id: 'image_url',
    label: 'Image',
    category: 'metadata',
    sortable: false,
    defaultVisible: false,
    dataKey: 'image_url',
    description: 'Product image',
  },
];

/**
 * Get all available columns
 */
export function getAvailableColumns(): ColumnDefinition[] {
  return AVAILABLE_COLUMNS;
}

/**
 * Get columns by category
 */
export function getColumnsByCategory(): Record<string, ColumnDefinition[]> {
  const grouped: Record<string, ColumnDefinition[]> = {
    basic: [],
    inventory: [],
    pricing: [],
    metadata: [],
    category: [],
  };
  
  AVAILABLE_COLUMNS.forEach(column => {
    if (grouped[column.category]) {
      grouped[column.category].push(column);
    }
  });
  
  return grouped;
}

/**
 * Get default visible columns
 */
export function getDefaultVisibleColumns(): string[] {
  return AVAILABLE_COLUMNS
    .filter(col => col.defaultVisible)
    .map(col => col.id);
}

/**
 * Get default column order
 * Decision-first order: Product | Stock Status | Available | Location(s) | SKU | Category | Warehouses
 */
export function getDefaultColumnOrder(): string[] {
<<<<<<< HEAD
  // Recommended decision-first order
  return [
    'name',           // Product
    'stock',          // Stock Status & Available (shows both status indicator and quantity)
    'location',       // Location(s)
    'sku',            // SKU
    'category_name',  // Category
    'warehouses',     // Warehouses
    // Additional columns (not in default visible set)
    'barcode',
    'description',
    'minimum_stock_level',
    'purchase_price',
    'sale_price',
    'unit_price',
=======
  // Decision-first order prioritizing actionable information
  return [
    'name',           // Product (visual anchor)
    'stock',          // Stock Status (decision-critical)
    'minimum_stock_level', // Available/Min level (context for stock status)
    'location',       // Location(s) (operational)
    'sku',            // SKU (secondary identifier)
    'category_name',  // Category (filtering/grouping)
    'warehouses',     // Warehouses (secondary filter)
    'barcode',        // Barcode (metadata)
    'description',    // Description (metadata)
    'purchase_price', // Cost (financial)
    'sale_price',    // Price (financial)
    'unit_price',    // Unit Price (financial)
>>>>>>> 0c6dbc15edfccecdd64f738284615a3dd123bee3
  ];
}

/**
 * Get column definition by ID
 */
export function getColumnById(id: string): ColumnDefinition | undefined {
  return AVAILABLE_COLUMNS.find(col => col.id === id);
}

/**
 * Get category display name
 */
export function getCategoryDisplayName(category: string): string {
  const names: Record<string, string> = {
    basic: 'Basic Information',
    inventory: 'Inventory',
    pricing: 'Pricing',
    metadata: 'Metadata',
    category: 'Category',
  };
  return names[category] || category;
}



