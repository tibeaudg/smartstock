/**
 * Category type definitions for hierarchical category system
 */

export interface Category {
  id: string;
  name: string;
  description: string | null;
  user_id: string;
  parent_category_id: string | null;
  icon: string | null;
  color: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Computed fields (not from DB)
  product_count?: number;
  stock_value?: number;
  children_count?: number;
}

export interface CategoryTree extends Category {
  children: CategoryTree[];
  level?: number; // Depth in tree (0 = root)
  path?: string; // Full path like "Electronics > Computers > Laptops"
}

export interface CategoryAnalytics {
  category_id: string;
  category_name: string;
  total_products: number;
  total_stock_quantity: number;
  total_stock_value: number;
  low_stock_count: number;
  out_of_stock_count: number;
  average_price: number;
  // Optional: growth metrics if historical data available
  products_added_last_30_days?: number;
  stock_value_change_percentage?: number;
}

export interface CategoryCreateData {
  name: string;
  description?: string | null;
  parent_category_id?: string | null;
  icon?: string | null;
  color?: string | null;
  display_order?: number;
  is_active?: boolean;
}

export interface CategoryUpdateData {
  name?: string;
  description?: string | null;
  parent_category_id?: string | null;
  icon?: string | null;
  color?: string | null;
  display_order?: number;
  is_active?: boolean;
}

export interface CategoryMoveData {
  category_id: string;
  new_parent_id: string | null;
  new_display_order: number;
}

export type CategoryViewMode = 'tree' | 'grid';

