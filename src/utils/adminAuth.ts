/**
 * Admin Authorization Utilities
 * 
 * This module provides server-side admin authorization checks
 * to prevent unauthorized access to admin features.
 */

import { supabase } from '@/integrations/supabase/client';

/**
 * Verify if a user has admin/owner privileges
 * @param userId - The user ID to check
 * @returns Promise<boolean> - True if user is admin/owner
 */
export async function verifyAdminAccess(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('is_owner, role')
      .eq('id', userId)
      .single();

    if (error || !data) {
      console.error('Error verifying admin access:', error);
      return false;
    }

    // Check if user is owner or has admin role
    return data.is_owner === true || data.role === 'admin';
  } catch (error) {
    console.error('Exception in verifyAdminAccess:', error);
    return false;
  }
}

/**
 * Verify if a user is a system owner (highest privilege)
 * @param userId - The user ID to check
 * @returns Promise<boolean> - True if user is owner
 */
export async function verifyOwnerAccess(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('is_owner')
      .eq('id', userId)
      .single();

    if (error || !data) {
      console.error('Error verifying owner access:', error);
      return false;
    }

    return data.is_owner === true;
  } catch (error) {
    console.error('Exception in verifyOwnerAccess:', error);
    return false;
  }
}

/**
 * Check if user has access to a specific branch
 * @param userId - The user ID to check
 * @param branchId - The branch ID to check access for
 * @returns Promise<boolean> - True if user has access
 */
export async function verifyBranchAccess(
  userId: string,
  branchId: string
): Promise<boolean> {
  try {
    // Owners have access to all branches
    const isOwner = await verifyOwnerAccess(userId);
    if (isOwner) return true;

    // Check if user is assigned to this branch
    const { data, error } = await supabase
      .from('branch_users')
      .select('user_id')
      .eq('user_id', userId)
      .eq('branch_id', branchId)
      .single();

    if (error || !data) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('Exception in verifyBranchAccess:', error);
    return false;
  }
}

