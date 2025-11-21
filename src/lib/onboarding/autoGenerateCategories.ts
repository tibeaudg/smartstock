import { supabase } from '@/integrations/supabase/client';
import { getSuggestedCategories, IndustryType } from './industryCategories';

export interface GenerateResult {
  success: boolean;
  categoriesCreated: number;
  productsCreated: number;
  errors: string[];
}

/**
 * Auto-generate categories and sample products based on industry
 */
export async function autoGenerateCategories(
  userId: string,
  branchId: string,
  industry: IndustryType
): Promise<GenerateResult> {
  const result: GenerateResult = {
    success: false,
    categoriesCreated: 0,
    productsCreated: 0,
    errors: []
  };

  try {
    const suggestedCategories = getSuggestedCategories(industry);
    const categoryMap = new Map<string, string>(); // category name -> category id

    // Create categories
    for (const categorySuggestion of suggestedCategories) {
      try {
        // Check if category already exists
        const { data: existingCategory } = await supabase
          .from('categories')
          .select('id')
          .eq('name', categorySuggestion.name)
          .eq('user_id', userId)
          .single();

        let categoryId: string;

        if (existingCategory) {
          categoryId = existingCategory.id;
        } else {
          // Create new category
          const { data: newCategory, error: categoryError } = await supabase
            .from('categories')
            .insert({
              name: categorySuggestion.name,
              description: categorySuggestion.description || null,
              user_id: userId
            })
            .select('id')
            .single();

          if (categoryError) {
            result.errors.push(`Failed to create category ${categorySuggestion.name}: ${categoryError.message}`);
            continue;
          }

          if (!newCategory) {
            result.errors.push(`Failed to create category ${categorySuggestion.name}: No data returned`);
            continue;
          }

          categoryId = newCategory.id;
          result.categoriesCreated++;
        }

        categoryMap.set(categorySuggestion.name, categoryId);

        // Create sample products for this category
        for (const productName of categorySuggestion.sampleProducts) {
          try {
            // Check if product already exists
            const { data: existingProduct } = await supabase
              .from('products')
              .select('id')
              .eq('name', productName)
              .eq('user_id', userId)
              .eq('branch_id', branchId)
              .single();

            if (existingProduct) {
              continue; // Skip if product already exists
            }

            // Generate random stock and prices
            const quantityInStock = Math.floor(Math.random() * 50) + 10; // 10-60 units
            const purchasePrice = Math.round((Math.random() * 50 + 5) * 100) / 100; // €5-55
            const salePrice = Math.round(purchasePrice * (1.3 + Math.random() * 0.4) * 100) / 100; // 30-70% markup

            // Create product
            const { error: productError } = await supabase
              .from('products')
              .insert({
                name: productName,
                description: `Sample ${productName} for ${categorySuggestion.name}`,
                category_id: categoryId,
                branch_id: branchId,
                user_id: userId,
                quantity_in_stock: quantityInStock,
                minimum_stock_level: Math.floor(quantityInStock * 0.2), // 20% of stock
                purchase_price: purchasePrice,
                sale_price: salePrice,
                unit_price: salePrice,
                status: 'active'
              });

            if (productError) {
              result.errors.push(`Failed to create product ${productName}: ${productError.message}`);
              continue;
            }

            result.productsCreated++;

            // Create initial stock transaction
            await supabase.from('stock_transactions').insert({
              product_id: null, // Will be set if we can get the product ID
              product_name: productName,
              transaction_type: 'incoming',
              quantity: quantityInStock,
              unit_price: purchasePrice,
              total_value: purchasePrice * quantityInStock,
              reference_number: 'AUTO_GENERATED',
              notes: 'Initial stock from auto-generated categories',
              user_id: userId,
              created_by: userId,
              branch_id: branchId
            });
          } catch (error: any) {
            result.errors.push(`Error creating product ${productName}: ${error.message}`);
          }
        }
      } catch (error: any) {
        result.errors.push(`Error processing category ${categorySuggestion.name}: ${error.message}`);
      }
    }

    result.success = result.errors.length === 0 || result.categoriesCreated > 0;
    return result;
  } catch (error: any) {
    result.errors.push(`Fatal error: ${error.message}`);
    return result;
  }
}

