import { useEffect } from 'react';
import { useAuth } from './useAuth';
import { useOptionalBranchId } from './useBranches';
import { analytics, setAnalyticsContext } from '@/lib/analytics';
import { resolveOrgId, setOrgIdCache } from '@/lib/analytics/orgResolver';

/** Syncs auth/branch context into the analytics module for automatic envelope fields. */
export function useAnalyticsContextSync() {
  const { user, userProfile } = useAuth();
  const branchId = useOptionalBranchId();

  useEffect(() => {
    if (!user?.id) {
      analytics.reset();
      return;
    }

    setAnalyticsContext({
      userId: user.id,
      branchId: branchId ?? null,
      isOwner: userProfile?.is_owner === true,
    });

    void resolveOrgId(user.id, branchId).then((orgId) => {
      if (branchId) setOrgIdCache(branchId, orgId);
      setAnalyticsContext({ orgId });
      analytics.identify(user.id, { org_id: orgId, branch_id: branchId });
    });
  }, [user?.id, branchId, userProfile?.is_owner]);
}
