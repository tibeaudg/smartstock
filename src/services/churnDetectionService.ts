import { supabase } from '@/integrations/supabase/client';

export interface ChurnStatus {
  isChurned: boolean;
  accountAgeDays: number;
  hasEngagement: boolean;
}

/**
 * Checks if a user is in churn state (7+ days old with zero engagement)
 * Engagement is defined as:
 * - Product imports (products created)
 * - Stock updates (stock_transactions)
 * - Barcode scans (stock_transactions with scan activity)
 * - Location transfers (stock_transactions with location changes)
 */
export async function checkUserChurnStatus(userId: string): Promise<ChurnStatus> {
  try {
    // Get user profile to check account creation date
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('created_at')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      console.error('Error fetching user profile:', profileError);
      return { isChurned: false, accountAgeDays: 0, hasEngagement: false };
    }

    const accountCreatedAt = new Date(profile.created_at);
    const now = new Date();
    const accountAgeDays = Math.floor((now.getTime() - accountCreatedAt.getTime()) / (1000 * 60 * 60 * 24));

    // If account is less than 7 days old, not in churn
    if (accountAgeDays < 7) {
      return { isChurned: false, accountAgeDays, hasEngagement: false };
    }

    // Check for engagement in the first 7 days after account creation
    const sevenDaysAfterCreation = new Date(accountCreatedAt);
    sevenDaysAfterCreation.setDate(sevenDaysAfterCreation.getDate() + 7);

    // Check for product imports (products created within first 7 days)
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, created_at')
      .eq('user_id', userId)
      .lte('created_at', sevenDaysAfterCreation.toISOString())
      .limit(1);

    if (productsError) {
      console.error('Error checking products:', productsError);
    }

    // Check for stock transactions (any activity within first 7 days)
    // First check transactions by created_by
    const { data: transactionsByUser, error: transactionsByUserError } = await supabase
      .from('stock_transactions')
      .select('id, created_at')
      .eq('created_by', userId)
      .lte('created_at', sevenDaysAfterCreation.toISOString())
      .limit(1);

    // Also check transactions via user's products
    let transactionsByProduct: any[] = [];
    if (products && products.length > 0) {
      const productIds = products.map(p => p.id);
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('stock_transactions')
        .select('id, created_at')
        .in('product_id', productIds)
        .lte('created_at', sevenDaysAfterCreation.toISOString())
        .limit(1);
      
      if (!transactionsError && transactionsData) {
        transactionsByProduct = transactionsData;
      }
    }

    const hasTransactions = 
      (transactionsByUser && transactionsByUser.length > 0) ||
      (transactionsByProduct && transactionsByProduct.length > 0);

    if (transactionsByUserError) {
      console.error('Error checking transactions:', transactionsByUserError);
    }

    // Check if user has any branches (location setup indicates engagement)
    const { data: branches, error: branchesError } = await supabase
      .from('branches')
      .select('id, created_at')
      .eq('user_id', userId)
      .lte('created_at', sevenDaysAfterCreation.toISOString())
      .limit(1);

    if (branchesError) {
      console.error('Error checking branches:', branchesError);
    }

    // User has engagement if any of these exist
    const hasEngagement = 
      (products && products.length > 0) ||
      hasTransactions ||
      (branches && branches.length > 0);

    // User is in churn if account is 7+ days old and has no engagement
    const isChurned = accountAgeDays >= 7 && !hasEngagement;

    return {
      isChurned,
      accountAgeDays,
      hasEngagement,
    };
  } catch (error) {
    console.error('Error in checkUserChurnStatus:', error);
    return { isChurned: false, accountAgeDays: 0, hasEngagement: false };
  }
}

/**
 * Checks if user has already submitted churn feedback
 */
export async function hasChurnFeedback(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('user_feedback')
      .select('id')
      .eq('user_id', userId)
      .eq('trigger_context', 'churn')
      .limit(1);

    if (error) {
      console.error('Error checking churn feedback:', error);
      return false;
    }

    return (data && data.length > 0) || false;
  } catch (error) {
    console.error('Error in hasChurnFeedback:', error);
    return false;
  }
}

