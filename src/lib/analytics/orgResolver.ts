import { supabase } from '@/integrations/supabase/client';

const orgCache = new Map<string, string>();

/**
 * Account owner id: branches.user_id for the active branch, else the current user.
 */
export async function resolveOrgId(
  userId: string,
  branchId?: string | null,
): Promise<string> {
  if (!branchId) return userId;

  const cached = orgCache.get(branchId);
  if (cached) return cached;

  const { data } = await supabase
    .from('branches')
    .select('user_id')
    .eq('id', branchId)
    .maybeSingle();

  const orgId = data?.user_id ?? userId;
  orgCache.set(branchId, orgId);
  return orgId;
}

export function setOrgIdCache(branchId: string, orgId: string): void {
  orgCache.set(branchId, orgId);
}

export function clearOrgIdCache(): void {
  orgCache.clear();
}
