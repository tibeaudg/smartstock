import { supabase } from '@/integrations/supabase/client';
import { generateDemoData } from '@/lib/onboarding/generateDemoData';

export interface DemoSession {
  id: string;
  session_token: string;
  expires_at: string;
  created_at: string;
  demo_data_created: boolean;
  last_accessed: string;
}

export interface DemoDataIds {
  branchIds: string[];
  categoryIds: string[];
  productIds: string[];
  transactionIds: string[];
}

/**
 * Create or get a guest session
 */
export async function createOrGetGuestSession(token?: string): Promise<DemoSession | null> {
  try {
    // If token provided, try to get existing session
    if (token) {
      const { data: session, error } = await supabase
        .from('guest_sessions')
        .select('*')
        .eq('session_token', token)
        .single();

      if (!error && session) {
        // Check if expired
        const expires = new Date(session.expires_at);
        if (expires > new Date()) {
          // Update last_accessed
          await supabase
            .from('guest_sessions')
            .update({ last_accessed: new Date().toISOString() })
            .eq('session_token', token);
          return session as DemoSession;
        }
      }
    }

    // Create new session
    const newToken = `guest_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

    const { data: session, error } = await supabase
      .from('guest_sessions')
      .insert({
        session_token: newToken,
        expires_at: expiresAt.toISOString(),
        demo_data_created: false
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating guest session:', error);
      return null;
    }

    return session as DemoSession;
  } catch (error) {
    console.error('Error in createOrGetGuestSession:', error);
    return null;
  }
}

/**
 * Initialize demo data for a session
 */
export async function initializeDemoData(sessionToken: string): Promise<boolean> {
  try {
    // Check if demo data already exists
    const { data: session } = await supabase
      .from('guest_sessions')
      .select('demo_data_created')
      .eq('session_token', sessionToken)
      .single();

    if (session?.demo_data_created) {
      // Check if data actually exists (in case of partial creation)
      const { data: existingBranches } = await supabase
        .from('branches')
        .select('id')
        .eq('session_token', sessionToken)
        .limit(1);

      if (existingBranches && existingBranches.length > 0) {
        return true; // Demo data already exists
      }
      
      // Data was marked as created but doesn't exist - reset flag and recreate
      await supabase
        .from('guest_sessions')
        .update({ demo_data_created: false })
        .eq('session_token', sessionToken);
    }

    // Delete any existing demo data for this session to prevent duplicates
    console.log('[initializeDemoData] Cleaning up any existing demo data for session:', sessionToken);
    
    // Delete in reverse order of dependencies
    await supabase
      .from('stock_transactions')
      .delete()
      .eq('session_token', sessionToken);
    
    await supabase
      .from('products')
      .delete()
      .eq('session_token', sessionToken);
    
    await supabase
      .from('categories')
      .delete()
      .eq('session_token', sessionToken);
    
    await supabase
      .from('branches')
      .delete()
      .eq('session_token', sessionToken);

    // Generate fresh demo data
    const result = await generateDemoData(sessionToken);

    if (result.success) {
      // Mark demo data as created
      await supabase
        .from('guest_sessions')
        .update({ demo_data_created: true })
        .eq('session_token', sessionToken);

      return true;
    }

    return false;
  } catch (error) {
    console.error('Error initializing demo data:', error);
    return false;
  }
}

/**
 * Get demo branches by session token
 */
export async function getDemoBranches(sessionToken: string) {
  console.log('[DemoDataService] Fetching branches for token:', sessionToken);
  const { data, error } = await supabase
    .from('branches')
    .select('*')
    .eq('session_token', sessionToken)
    .order('is_main', { ascending: false })
    .order('name');

  if (error) {
    console.error('[DemoDataService] Error fetching demo branches:', error);
    return [];
  }

  console.log('[DemoDataService] Found branches:', data?.length || 0);
  return data || [];
}

/**
 * Get demo categories by session token
 */
export async function getDemoCategories(sessionToken: string) {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('session_token', sessionToken)
    .order('name');

  if (error) {
    console.error('Error fetching demo categories:', error);
    return [];
  }

  return data || [];
}

/**
 * Get demo products by session token
 */
export async function getDemoProducts(sessionToken: string, branchId?: string) {
  console.log('[DemoDataService] Fetching products for token:', sessionToken, 'branchId:', branchId);
  let query = supabase
    .from('products')
    .select('*')
    .eq('session_token', sessionToken);

  if (branchId) {
    query = query.eq('branch_id', branchId);
  }

  const { data, error } = await query.order('name');

  if (error) {
    console.error('[DemoDataService] Error fetching demo products:', error);
    return [];
  }

  console.log('[DemoDataService] Found products:', data?.length || 0);
  return data || [];
}

/**
 * Get demo stock transactions by session token
 */
export async function getDemoTransactions(sessionToken: string, branchId?: string, limit?: number) {
  let query = supabase
    .from('stock_transactions')
    .select('*')
    .eq('session_token', sessionToken);

  if (branchId) {
    query = query.eq('branch_id', branchId);
  }

  query = query.order('created_at', { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching demo transactions:', error);
    return [];
  }

  return data || [];
}

/**
 * Get demo session info
 */
export async function getDemoSession(sessionToken: string): Promise<DemoSession | null> {
  const { data, error } = await supabase
    .from('guest_sessions')
    .select('*')
    .eq('session_token', sessionToken)
    .single();

  if (error) {
    console.error('Error fetching demo session:', error);
    return null;
  }

  return data as DemoSession;
}

