let cachedOrgId: string | null = null;
let cachedUserId: string | null = null;
let cachedBranchId: string | null = null;
let cachedIsOwner = false;

export function setAnalyticsContext(ctx: {
  userId?: string | null;
  branchId?: string | null;
  orgId?: string | null;
  isOwner?: boolean;
}): void {
  if (ctx.userId !== undefined) cachedUserId = ctx.userId;
  if (ctx.branchId !== undefined) cachedBranchId = ctx.branchId;
  if (ctx.orgId !== undefined) cachedOrgId = ctx.orgId;
  if (ctx.isOwner !== undefined) cachedIsOwner = ctx.isOwner;
}

export function getAnalyticsContext(): {
  userId: string | null;
  branchId: string | null;
  orgId: string | null;
  isOwner: boolean;
} {
  return {
    userId: cachedUserId,
    branchId: cachedBranchId,
    orgId: cachedOrgId,
    isOwner: cachedIsOwner,
  };
}

export function clearAnalyticsContext(): void {
  cachedOrgId = null;
  cachedUserId = null;
  cachedBranchId = null;
  cachedIsOwner = false;
}
