import { supabase } from '@/integrations/supabase/client';
import type { UserProfile, UserStats } from './types';
import { plans } from './plans';

export interface AdminBranch {
  branch_id: string;
  branch_name: string;
  is_main: boolean;
  user_count: number;
  created_at: string;
}

export async function fetchUserProfiles(): Promise<UserProfile[]> {
  const batchSize = 1000;
  let page = 0;
  const all: UserProfile[] = [];
  while (true) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .range(page * batchSize, (page + 1) * batchSize - 1);
    if (error) throw error;
    if (!data || data.length === 0) break;
    all.push(...(data as UserProfile[]));
    if (data.length < batchSize) break;
    page++;
  }
  return all;
}

export async function fetchUserIdsWithRecentErrors(): Promise<Set<string>> {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const { data, error } = await supabase
    .from('application_errors')
    .select('user_id')
    .gte('created_at', sevenDaysAgo.toISOString())
    .not('user_id', 'is', null);
  if (error) {
    console.error('Error fetching recent errors:', error);
    return new Set();
  }
  return new Set((data || []).map((r: { user_id: string }) => r.user_id).filter(Boolean));
}

function calculateCoreUsageScore(
  productCount: number,
  branchCount: number,
  linkedUserCount: number,
): number {
  return 3 * productCount + 2 * branchCount + linkedUserCount;
}

function calculateUserLicenseCost(
  planId: string | null,
  stats: { productCount: number; branchCount: number; linkedUserCount: number },
): number {
  const plan = plans[planId as keyof typeof plans] || plans.basic;
  const billableProducts = Math.max(0, stats.productCount - plan.includedProducts);
  return billableProducts * plan.pricePerProduct;
}

export async function fetchUserStats(userId: string): Promise<UserStats> {
  try {
    const result = await (supabase.rpc as (name: string, args: { admin_id: string }) => ReturnType<typeof supabase.rpc>)(
      'get_admin_branches',
      { admin_id: userId },
    );
    const adminBranches = result.data as AdminBranch[] | null;
    if (result.error) throw result.error;

    if (!adminBranches || adminBranches.length === 0) {
      return {
        userId,
        productCount: 0,
        branchCount: 0,
        linkedUserCount: 0,
        licenseCost: 0,
        coreUsageScore: 0,
        statsLastUpdated: new Date().toISOString(),
      };
    }

    const branchIds = adminBranches.map((b) => b.branch_id);
    const { count: productCount, error: productsError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .in('branch_id', branchIds);
    if (productsError) throw productsError;

    const linkedUsersResult = await supabase
      .from('branch_users')
      .select('user_id')
      .in('branch_id', branchIds);
    if (linkedUsersResult.error) throw linkedUsersResult.error;

    const uniqueLinkedUsers = new Set(
      (linkedUsersResult.data as { user_id: string }[] | null)
        ?.map((u) => u.user_id)
        .filter((id) => id !== userId && id != null),
    );

    const productCountValue = productCount || 0;
    const branchCountValue = adminBranches.length;
    const linkedUserCountValue = uniqueLinkedUsers.size;
    const coreUsageScore = calculateCoreUsageScore(
      productCountValue,
      branchCountValue,
      linkedUserCountValue,
    );

    const stats: UserStats = {
      userId,
      productCount: productCountValue,
      branchCount: branchCountValue,
      linkedUserCount: linkedUserCountValue,
      licenseCost: 0,
      coreUsageScore,
      statsLastUpdated: new Date().toISOString(),
    };

    const { data: userData } = await supabase
      .from('profiles')
      .select('selected_plan')
      .eq('id', userId)
      .maybeSingle();
    if (userData) {
      stats.licenseCost = calculateUserLicenseCost(userData.selected_plan, {
        productCount: stats.productCount,
        branchCount: stats.branchCount,
        linkedUserCount: stats.linkedUserCount,
      });
    }

    return stats;
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return {
      userId,
      productCount: 0,
      branchCount: 0,
      linkedUserCount: 0,
      licenseCost: 0,
      coreUsageScore: 0,
      statsLastUpdated: new Date().toISOString(),
    };
  }
}

export async function blockUser(id: string, blocked: boolean) {
  const { error } = await supabase
    .from('profiles')
    .update({ blocked: !blocked })
    .eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deleteUser(id: string) {
  const { error: branchUsersError } = await supabase
    .from('branch_users')
    .delete()
    .eq('user_id', id);
  if (branchUsersError) throw new Error(branchUsersError.message);

  const { error: profilesError } = await supabase.from('profiles').delete().eq('id', id);
  if (profilesError) throw new Error(profilesError.message);

  const { error: authError } = await supabase.functions.invoke('delete-user', {
    body: { user_id: id },
  });
  if (authError) throw new Error(authError.message);
}

export interface BranchOwnership {
  ownerIds: Set<string>;
  subUserParentMap: Record<string, string>;
}

export async function fetchBranchOwnership(): Promise<BranchOwnership> {
  const [branchesRes, branchUsersRes] = await Promise.all([
    supabase.from('branches').select('id, user_id'),
    supabase.from('branch_users').select('user_id, branch_id'),
  ]);
  const branches = (branchesRes.data || []) as { id: string; user_id: string }[];
  const branchUsers = (branchUsersRes.data || []) as { user_id: string; branch_id: string }[];

  const branchOwnerMap: Record<string, string> = {};
  const ownerIds = new Set<string>();
  for (const b of branches) {
    if (b.user_id) {
      branchOwnerMap[b.id] = b.user_id;
      ownerIds.add(b.user_id);
    }
  }

  const subUserParentMap: Record<string, string> = {};
  for (const bu of branchUsers) {
    if (!ownerIds.has(bu.user_id)) {
      const ownerId = branchOwnerMap[bu.branch_id];
      if (ownerId && !subUserParentMap[bu.user_id]) subUserParentMap[bu.user_id] = ownerId;
    }
  }
  return { ownerIds, subUserParentMap };
}
