import { supabase } from '@/integrations/supabase/client';

export interface DemoDataResult {
  success: boolean;
  branchesCreated: number;
  categoriesCreated: number;
  productsCreated: number;
  transactionsCreated: number;
  errors: string[];
}

/**
 * Generate comprehensive demo data for guest sandbox accounts
 * Creates warehouses, categories, products, and stock movements
 */
export async function generateDemoData(
  sessionToken: string
): Promise<DemoDataResult> {
  const result: DemoDataResult = {
    success: false,
    branchesCreated: 0,
    categoriesCreated: 0,
    productsCreated: 0,
    transactionsCreated: 0,
    errors: []
  };

  try {
    console.log('[generateDemoData] Starting demo data generation for token:', sessionToken);
    // Use NULL user_id for demo data (allowed when session_token is present)
    // This avoids foreign key constraint issues
    const demoUserId = null;
    
    // Create demo branches/warehouses
    const branchNames = ['Main Warehouse', 'Distribution Center', 'Retail Store'];
    const branchIds: string[] = [];

    for (const branchName of branchNames) {
      try {
        console.log('[generateDemoData] Creating branch:', branchName);
        const { data: branch, error: branchError } = await supabase
          .from('branches')
          .insert({
            name: branchName,
            is_main: branchIds.length === 0,
            is_active: true,
            user_id: demoUserId, // NULL for demo data
            session_token: sessionToken // Associate with session
          })
          .select('id')
          .single();

        if (branchError) {
          console.error('[generateDemoData] Branch creation error:', branchError);
          result.errors.push(`Failed to create branch ${branchName}: ${branchError.message}`);
          continue;
        }

        if (branch) {
          branchIds.push(branch.id);
          result.branchesCreated++;
        }
      } catch (error: any) {
        result.errors.push(`Error creating branch ${branchName}: ${error.message}`);
      }
    }

    if (branchIds.length === 0) {
      result.errors.push('No branches created - cannot create products');
      return result;
    }

    const mainBranchId = branchIds[0];

    // Create demo categories
    const categories = [
      { name: 'Electronics', description: 'Electronic devices and accessories' },
      { name: 'Clothing', description: 'Apparel and fashion items' },
      { name: 'Home & Garden', description: 'Home improvement supplies' },
      { name: 'Food & Beverages', description: 'Food items and drinks' },
      { name: 'Office Supplies', description: 'Office equipment and supplies' }
    ];

    const categoryIds: string[] = [];

    for (const category of categories) {
      try {
        const { data: newCategory, error: categoryError } = await supabase
          .from('categories')
          .insert({
            name: category.name,
            description: category.description,
            user_id: demoUserId, // NULL for demo data
            session_token: sessionToken // Associate with session
          })
          .select('id')
          .single();

        if (categoryError) {
          result.errors.push(`Failed to create category ${category.name}: ${categoryError.message}`);
          continue;
        }

        if (newCategory) {
          categoryIds.push(newCategory.id);
          result.categoriesCreated++;
        }
      } catch (error: any) {
        result.errors.push(`Error creating category ${category.name}: ${error.message}`);
      }
    }

    // Create demo products
    const products = [
      { name: 'Laptop', category: 0, stock: 25, price: 899.99, salePrice: 1299.99 },
      { name: 'Smartphone', category: 0, stock: 50, price: 599.99, salePrice: 799.99 },
      { name: 'Headphones', category: 0, stock: 100, price: 49.99, salePrice: 79.99 },
      { name: 'T-Shirt', category: 1, stock: 200, price: 15.99, salePrice: 24.99 },
      { name: 'Jeans', category: 1, stock: 150, price: 39.99, salePrice: 59.99 },
      { name: 'Garden Tools', category: 2, stock: 75, price: 29.99, salePrice: 49.99 },
      { name: 'Furniture', category: 2, stock: 30, price: 199.99, salePrice: 299.99 },
      { name: 'Coffee', category: 3, stock: 120, price: 8.99, salePrice: 14.99 },
      { name: 'Notebook', category: 4, stock: 500, price: 2.99, salePrice: 4.99 },
      { name: 'Pen Set', category: 4, stock: 300, price: 5.99, salePrice: 9.99 }
    ];

    for (const product of products) {
      try {
        const categoryId = categoryIds[product.category] || null;

        const { data: newProduct, error: productError } = await supabase
          .from('products')
          .insert({
            name: product.name,
            description: `Demo ${product.name} for testing`,
            category_id: categoryId,
            branch_id: mainBranchId,
            quantity_in_stock: product.stock,
            minimum_stock_level: Math.floor(product.stock * 0.2),
            purchase_price: product.price,
            sale_price: product.salePrice,
            unit_price: product.salePrice,
            status: 'active',
            user_id: demoUserId, // NULL for demo data
            session_token: sessionToken // Associate with session
          })
          .select('id')
          .single();

        if (productError) {
          result.errors.push(`Failed to create product ${product.name}: ${productError.message}`);
          continue;
        }

        if (newProduct) {
          result.productsCreated++;

          // Create initial stock transaction
          await supabase.from('stock_transactions').insert({
            product_id: newProduct.id,
            product_name: product.name,
            transaction_type: 'in', // Use 'in' instead of 'incoming' to match schema
            quantity: product.stock,
            unit_price: product.price,
            total_value: product.price * product.stock,
            reference_number: 'DEMO_INITIAL',
            notes: 'Initial stock for demo account',
            user_id: demoUserId, // NULL for demo data
            created_by: demoUserId, // NULL for demo data
            branch_id: mainBranchId,
            session_token: sessionToken // Associate with session
          });

          result.transactionsCreated++;
        }
      } catch (error: any) {
        result.errors.push(`Error creating product ${product.name}: ${error.message}`);
      }
    }

    result.success = result.errors.length === 0 || result.productsCreated > 0;
    return result;
  } catch (error: any) {
    result.errors.push(`Fatal error: ${error.message}`);
    return result;
  }
}

