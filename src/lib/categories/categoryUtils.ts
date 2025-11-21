/**
 * Utility functions for category hierarchy operations
 */

import type { Category, CategoryTree } from '@/types/categoryTypes';

/**
 * Build a tree structure from a flat array of categories
 */
export function buildCategoryTree(categories: Category[]): CategoryTree[] {
  // Create a map for quick lookup
  const categoryMap = new Map<string, CategoryTree>();
  const rootCategories: CategoryTree[] = [];

  // First pass: create all category nodes
  categories.forEach(category => {
    categoryMap.set(category.id, {
      ...category,
      children: [],
      level: 0,
    });
  });

  // Second pass: build parent-child relationships
  categories.forEach(category => {
    const treeNode = categoryMap.get(category.id)!;
    
    if (category.parent_category_id) {
      const parent = categoryMap.get(category.parent_category_id);
      if (parent) {
        parent.children.push(treeNode);
        treeNode.level = (parent.level || 0) + 1;
      } else {
        // Orphaned category (parent doesn't exist), treat as root
        rootCategories.push(treeNode);
      }
    } else {
      // Root category
      rootCategories.push(treeNode);
    }
  });

  // Sort by display_order
  const sortCategories = (cats: CategoryTree[]): CategoryTree[] => {
    return cats
      .sort((a, b) => a.display_order - b.display_order)
      .map(cat => ({
        ...cat,
        children: sortCategories(cat.children),
      }));
  };

  return sortCategories(rootCategories);
}

/**
 * Get the full path of a category (e.g., "Electronics > Computers > Laptops")
 */
export function getCategoryPath(category: Category, categories: Category[]): string {
  const path: string[] = [];
  let currentCategory: Category | undefined = category;

  // Build path by traversing up the hierarchy
  while (currentCategory) {
    path.unshift(currentCategory.name);
    
    if (currentCategory.parent_category_id) {
      currentCategory = categories.find(c => c.id === currentCategory!.parent_category_id);
    } else {
      break;
    }
  }

  return path.join(' > ');
}

/**
 * Get all direct children of a category
 */
export function getCategoryChildren(categoryId: string, categories: Category[]): Category[] {
  return categories
    .filter(c => c.parent_category_id === categoryId)
    .sort((a, b) => a.display_order - b.display_order);
}

/**
 * Get all descendants (children, grandchildren, etc.) of a category
 */
export function getCategoryDescendants(categoryId: string, categories: Category[]): Category[] {
  const descendants: Category[] = [];
  const children = getCategoryChildren(categoryId, categories);
  
  descendants.push(...children);
  
  // Recursively get descendants of children
  children.forEach(child => {
    descendants.push(...getCategoryDescendants(child.id, categories));
  });
  
  return descendants;
}

/**
 * Get all ancestors (parent, grandparent, etc.) of a category
 */
export function getCategoryAncestors(categoryId: string, categories: Category[]): Category[] {
  const ancestors: Category[] = [];
  const category = categories.find(c => c.id === categoryId);
  
  if (!category || !category.parent_category_id) {
    return ancestors;
  }
  
  let currentParentId = category.parent_category_id;
  
  while (currentParentId) {
    const parent = categories.find(c => c.id === currentParentId);
    if (parent) {
      ancestors.unshift(parent);
      currentParentId = parent.parent_category_id || '';
    } else {
      break;
    }
  }
  
  return ancestors;
}

/**
 * Validate if a category can be moved to a new parent
 * Prevents circular references
 */
export function validateCategoryMove(
  categoryId: string,
  newParentId: string | null,
  categories: Category[]
): { valid: boolean; error?: string } {
  // Can't be its own parent
  if (newParentId === categoryId) {
    return { valid: false, error: 'Category cannot be its own parent' };
  }

  // If moving to root (null parent), it's always valid
  if (!newParentId) {
    return { valid: true };
  }

  // Check if new parent is a descendant (would create circular reference)
  const descendants = getCategoryDescendants(categoryId, categories);
  const isDescendant = descendants.some(d => d.id === newParentId);
  
  if (isDescendant) {
    return { valid: false, error: 'Cannot move category to its own descendant' };
  }

  return { valid: true };
}

/**
 * Flatten a category tree back into an array
 */
export function flattenCategoryTree(tree: CategoryTree[]): Category[] {
  const result: Category[] = [];
  
  const traverse = (nodes: CategoryTree[]) => {
    nodes.forEach(node => {
      const { children, level, path, ...category } = node;
      result.push(category);
      if (children.length > 0) {
        traverse(children);
      }
    });
  };
  
  traverse(tree);
  return result;
}

/**
 * Get all category IDs including descendants (useful for filtering products)
 */
export function getCategoryIdsIncludingDescendants(categoryId: string, categories: Category[]): string[] {
  const descendants = getCategoryDescendants(categoryId, categories);
  return [categoryId, ...descendants.map(d => d.id)];
}

/**
 * Find a category in a tree by ID
 */
export function findCategoryInTree(tree: CategoryTree[], categoryId: string): CategoryTree | null {
  for (const node of tree) {
    if (node.id === categoryId) {
      return node;
    }
    const found = findCategoryInTree(node.children, categoryId);
    if (found) {
      return found;
    }
  }
  return null;
}

/**
 * Get the maximum depth of the category tree
 */
export function getMaxTreeDepth(tree: CategoryTree[]): number {
  if (tree.length === 0) return 0;
  
  return Math.max(
    ...tree.map(node => {
      const childrenDepth = node.children.length > 0 
        ? getMaxTreeDepth(node.children) 
        : 0;
      return (node.level || 0) + childrenDepth;
    })
  );
}

/**
 * Filter categories by search term (searches name and description)
 */
export function filterCategories(categories: Category[], searchTerm: string): Category[] {
  if (!searchTerm.trim()) {
    return categories;
  }
  
  const term = searchTerm.toLowerCase();
  return categories.filter(cat => 
    cat.name.toLowerCase().includes(term) ||
    (cat.description && cat.description.toLowerCase().includes(term))
  );
}

