/**
 * Category service functions for CRUD operations with hierarchy support
 */

import { supabase } from '@/integrations/supabase/client';
import type { 
  Category, 
  CategoryCreateData, 
  CategoryUpdateData, 
  CategoryMoveData,
  CategoryAnalytics 
} from '@/types/categoryTypes';
import { validateCategoryMove, getCategoryDescendants } from './categoryUtils';
import { toast } from 'sonner';

/**
 * Create a new category
 */
export async function createCategory(
  data: CategoryCreateData,
  userId: string
): Promise<Category> {
  // Get the next display_order if not provided
  let displayOrder = data.display_order;
  if (displayOrder === undefined) {
    const { data: siblings } = await supabase
      .from('categories')
      .select('display_order')
      .eq('user_id', userId)
      .eq('parent_category_id', data.parent_category_id || null)
      .order('display_order', { ascending: false })
      .limit(1);
    
    displayOrder = siblings && siblings.length > 0 
      ? (siblings[0].display_order || 0) + 1 
      : 0;
  }

  const { data: category, error } = await supabase
    .from('categories')
    .insert({
      name: data.name,
      description: data.description || null,
      user_id: userId,
      parent_category_id: data.parent_category_id || null,
      icon: data.icon || null,
      color: data.color || null,
      display_order: displayOrder,
      is_active: data.is_active !== undefined ? data.is_active : true,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating category:', error);
    toast.error(`Error creating category: ${error.message}`);
    throw error;
  }

  return category as Category;
}

/**
 * Update an existing category
 */
export async function updateCategory(
  categoryId: string,
  data: CategoryUpdateData,
  userId: string
): Promise<Category> {
  // If parent_category_id is being changed, validate the move
  if (data.parent_category_id !== undefined) {
    const { data: allCategories } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', userId);
    
    if (allCategories) {
      const validation = validateCategoryMove(
        categoryId,
        data.parent_category_id,
        allCategories as Category[]
      );
      
      if (!validation.valid) {
        toast.error(validation.error || 'Invalid category move');
        throw new Error(validation.error || 'Invalid category move');
      }
    }
  }

  const updateData: Partial<CategoryUpdateData> = { ...data };
  
  const { data: category, error } = await supabase
    .from('categories')
    .update(updateData)
    .eq('id', categoryId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating category:', error);
    toast.error(`Error updating category: ${error.message}`);
    throw error;
  }

  return category as Category;
}

/**
 * Delete a category
 * If the category has children, they will be moved to the category's parent (or root if no parent)
 */
export async function deleteCategory(
  categoryId: string,
  userId: string
): Promise<void> {
  // First, get the category to find its parent
  const { data: category } = await supabase
    .from('categories')
    .select('parent_category_id')
    .eq('id', categoryId)
    .eq('user_id', userId)
    .single();

  if (!category) {
    throw new Error('Category not found');
  }

  // Get all children of this category
  const { data: allCategories } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', userId);

  if (!allCategories) {
    throw new Error('Failed to fetch categories');
  }

  const children = getCategoryDescendants(categoryId, allCategories as Category[]);
  
  // Move children to the category's parent (or root if no parent)
  if (children.length > 0) {
    const newParentId = category.parent_category_id;
    
    // Get max display_order for the new parent
    const { data: siblings } = await supabase
      .from('categories')
      .select('display_order')
      .eq('user_id', userId)
      .eq('parent_category_id', newParentId || null)
      .order('display_order', { ascending: false })
      .limit(1);
    
    let nextOrder = siblings && siblings.length > 0 
      ? (siblings[0].display_order || 0) + 1 
      : 0;

    // Update all children
    for (const child of children) {
      await supabase
        .from('categories')
        .update({
          parent_category_id: newParentId,
          display_order: nextOrder++,
        })
        .eq('id', child.id);
    }
  }

  // Now delete the category
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', categoryId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error deleting category:', error);
    toast.error(`Error deleting category: ${error.message}`);
    throw error;
  }
}

/**
 * Move a category to a new parent and/or position
 */
export async function moveCategory(
  moveData: CategoryMoveData,
  userId: string
): Promise<Category> {
  const { category_id, new_parent_id, new_display_order } = moveData;

  // Validate the move
  const { data: allCategories } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', userId);
  
  if (!allCategories) {
    throw new Error('Failed to fetch categories');
  }

  const validation = validateCategoryMove(
    category_id,
    new_parent_id,
    allCategories as Category[]
  );
  
  if (!validation.valid) {
    toast.error(validation.error || 'Invalid category move');
    throw new Error(validation.error || 'Invalid category move');
  }

  // Update the category
  const { data: category, error } = await supabase
    .from('categories')
    .update({
      parent_category_id: new_parent_id,
      display_order: new_display_order,
    })
    .eq('id', category_id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error moving category:', error);
    toast.error(`Error moving category: ${error.message}`);
    throw error;
  }

  return category as Category;
}

/**
 * Get a category with its children
 */
export async function getCategoryWithChildren(
  categoryId: string,
  userId: string
): Promise<Category | null> {
  const { data: category, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', categoryId)
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching category:', error);
    return null;
  }

  return category as Category;
}

/**
 * Get all categories for a user
 */
export async function getAllCategories(userId: string): Promise<Category[]> {
  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', userId)
    .order('display_order', { ascending: true })
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    toast.error('Error fetching categories');
    throw error;
  }

  return (categories || []) as Category[];
}

/**
 * Get category analytics (product counts, stock values, etc.)
 */
export async function getCategoryAnalytics(
  categoryId: string,
  userId: string,
  branchId?: string
): Promise<CategoryAnalytics | null> {
  // Get the category
  const { data: category } = await supabase
    .from('categories')
    .select('name')
    .eq('id', categoryId)
    .eq('user_id', userId)
    .single();

  if (!category) {
    return null;
  }

  // Get all descendant category IDs
  const { data: allCategories } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', userId);

  if (!allCategories) {
    return null;
  }

  const { getCategoryDescendants } = await import('./categoryUtils');
  const descendants = getCategoryDescendants(categoryId, allCategories as Category[]);
  const categoryIds = [categoryId, ...descendants.map(d => d.id)];

  // Calculate date one week ago
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const oneWeekAgoISO = oneWeekAgo.toISOString();

  // Build query for current products
  let productsQuery = supabase
    .from('products')
    .select('quantity_in_stock, purchase_price, minimum_stock_level, created_at')
    .in('category_id', categoryIds);

  if (branchId) {
    productsQuery = productsQuery.eq('branch_id', branchId);
  }

  const { data: products, error } = await productsQuery;

  if (error) {
    console.error('Error fetching category analytics:', error);
    return null;
  }

  // Build query for products from one week ago
  let productsWeekAgoQuery = supabase
    .from('products')
    .select('quantity_in_stock, purchase_price, minimum_stock_level')
    .in('category_id', categoryIds)
    .lte('created_at', oneWeekAgoISO);

  if (branchId) {
    productsWeekAgoQuery = productsWeekAgoQuery.eq('branch_id', branchId);
  }

  const { data: productsWeekAgo } = await productsWeekAgoQuery;

  if (!products || products.length === 0) {
    return {
      category_id: categoryId,
      category_name: category.name,
      total_products: 0,
      total_stock_quantity: 0,
      total_stock_value: 0,
      low_stock_count: 0,
      out_of_stock_count: 0,
      average_price: 0,
      total_products_week_ago: 0,
      total_stock_value_week_ago: 0,
      low_stock_count_week_ago: 0,
      out_of_stock_count_week_ago: 0,
    };
  }

  const totalProducts = products.length;
  const totalStockQuantity = products.reduce((sum, p) => sum + (Number(p.quantity_in_stock) || 0), 0);
  const totalStockValue = products.reduce((sum, p) => {
    const qty = Number(p.quantity_in_stock) || 0;
    const price = Number(p.purchase_price) || 0;
    return sum + (qty * price);
  }, 0);
  
  const lowStockCount = products.filter(p => {
    const qty = Number(p.quantity_in_stock) || 0;
    const min = Number(p.minimum_stock_level) || 0;
    return qty > 0 && qty <= min;
  }).length;
  
  const outOfStockCount = products.filter(p => {
    const qty = Number(p.quantity_in_stock) || 0;
    return qty === 0;
  }).length;
  
  const averagePrice = totalProducts > 0 
    ? products.reduce((sum, p) => sum + (Number(p.purchase_price) || 0), 0) / totalProducts
    : 0;

  // Calculate week-ago values
  const totalProductsWeekAgo = productsWeekAgo?.length || 0;
  const totalStockValueWeekAgo = productsWeekAgo?.reduce((sum, p) => {
    const qty = Number(p.quantity_in_stock) || 0;
    const price = Number(p.purchase_price) || 0;
    return sum + (qty * price);
  }, 0) || 0;
  
  const lowStockCountWeekAgo = productsWeekAgo?.filter(p => {
    const qty = Number(p.quantity_in_stock) || 0;
    const min = Number(p.minimum_stock_level) || 0;
    return qty > 0 && qty <= min;
  }).length || 0;
  
  const outOfStockCountWeekAgo = productsWeekAgo?.filter(p => {
    const qty = Number(p.quantity_in_stock) || 0;
    return qty === 0;
  }).length || 0;

  return {
    category_id: categoryId,
    category_name: category.name,
    total_products: totalProducts,
    total_stock_quantity: totalStockQuantity,
    total_stock_value: totalStockValue,
    low_stock_count: lowStockCount,
    out_of_stock_count: outOfStockCount,
    average_price: averagePrice,
    total_products_week_ago: totalProductsWeekAgo,
    total_stock_value_week_ago: totalStockValueWeekAgo,
    low_stock_count_week_ago: lowStockCountWeekAgo,
    out_of_stock_count_week_ago: outOfStockCountWeekAgo,
  };
}

/**
 * Get products in a category (including all descendant categories)
 */
export async function getCategoryProducts(
  categoryId: string,
  userId: string,
  branchId?: string
): Promise<any[]> {
  // Get all descendant category IDs
  const { data: allCategories } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', userId);

  if (!allCategories) {
    return [];
  }

  const { getCategoryDescendants } = await import('./categoryUtils');
  const descendants = getCategoryDescendants(categoryId, allCategories as Category[]);
  const categoryIds = [categoryId, ...descendants.map(d => d.id)];

  // Build query
  let productsQuery = supabase
    .from('products')
    .select('*')
    .in('category_id', categoryIds);

  if (branchId) {
    productsQuery = productsQuery.eq('branch_id', branchId);
  }

  const { data: products, error } = await productsQuery
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching category products:', error);
    return [];
  }

  if (!products || products.length === 0) {
    return [];
  }

  // Get category names
  const productCategoryIds = [...new Set(products.map(p => p.category_id).filter(Boolean))];

  let categories: { [key: string]: string } = {};
  if (productCategoryIds.length > 0) {
    const { data: categoryData } = await supabase
      .from('categories')
      .select('id, name')
      .in('id', productCategoryIds);
    
    if (categoryData) {
      categories = categoryData.reduce((acc: { [key: string]: string }, cat: { id: string; name: string }) => {
        acc[cat.id] = cat.name;
        return acc;
      }, {} as { [key: string]: string });
    }
  }

  // Add category names to products
  const productsWithNames = products.map(product => ({
    ...product,
    category_name: product.category_id ? categories[product.category_id] || null : null
  }));

  return productsWithNames;
}

/**
 * Get all products for a user (optionally filtered by branch)
 */
export async function getAllProducts(
  userId: string,
  branchId?: string
): Promise<any[]> {
  // Build query
  let productsQuery = supabase
    .from('products')
    .select('*');

  if (branchId) {
    productsQuery = productsQuery.eq('branch_id', branchId);
  }

  const { data: products, error } = await productsQuery
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching all products:', error);
    return [];
  }

  if (!products || products.length === 0) {
    return [];
  }

  // Get category names
  const productCategoryIds = [...new Set(products.map(p => p.category_id).filter(Boolean))];

  let categories: { [key: string]: string } = {};
  if (productCategoryIds.length > 0) {
    const { data: categoryData } = await supabase
      .from('categories')
      .select('id, name')
      .in('id', productCategoryIds);
    
    if (categoryData) {
      categories = categoryData.reduce((acc: { [key: string]: string }, cat: { id: string; name: string }) => {
        acc[cat.id] = cat.name;
        return acc;
      }, {} as { [key: string]: string });
    }
  }

  // Add category names to products
  const productsWithNames = products.map(product => ({
    ...product,
    category_name: product.category_id ? categories[product.category_id] || null : null
  }));

  return productsWithNames;
}

