import { supabase } from '@/integrations/supabase/client';

export type EmailIssueKind = 'bounced' | 'failed' | 'lifecycle_failed';

export interface UserEmailHealth {
  userId: string;
  bounced: number;
  failed: number;
  lifecycleFailed: number;
  lastIssueAt: string | null;
  kinds: EmailIssueKind[];
}

const ISSUE_LOG_STATUSES = ['bounced', 'failed'] as const;

function mergeHealth(
  map: Map<string, UserEmailHealth>,
  userId: string,
  patch: Partial<UserEmailHealth> & { kind?: EmailIssueKind },
): void {
  const existing = map.get(userId) ?? {
    userId,
    bounced: 0,
    failed: 0,
    lifecycleFailed: 0,
    lastIssueAt: null,
    kinds: [],
  };
  const kinds = new Set(existing.kinds);
  if (patch.kind) kinds.add(patch.kind);
  const lastIssueAt =
    patch.lastIssueAt && (!existing.lastIssueAt || patch.lastIssueAt > existing.lastIssueAt)
      ? patch.lastIssueAt
      : existing.lastIssueAt;
  map.set(userId, {
    userId,
    bounced: existing.bounced + (patch.bounced ?? 0),
    failed: existing.failed + (patch.failed ?? 0),
    lifecycleFailed: existing.lifecycleFailed + (patch.lifecycleFailed ?? 0),
    lastIssueAt,
    kinds: [...kinds],
  });
}

/** Aggregate bounced/failed delivery issues per user for the admin accounts table. */
export async function fetchUserEmailHealthMap(): Promise<Map<string, UserEmailHealth>> {
  const map = new Map<string, UserEmailHealth>();

  const pageSize = 1000;
  let offset = 0;
  while (true) {
    const { data, error } = await supabase
      .from('email_logs')
      .select('recipient_user_id, status, sent_at')
      .in('status', [...ISSUE_LOG_STATUSES])
      .not('recipient_user_id', 'is', null)
      .order('sent_at', { ascending: false })
      .range(offset, offset + pageSize - 1);
    if (error) {
      console.error('[emailHealth] email_logs fetch failed:', error);
      break;
    }
    if (!data?.length) break;
    for (const row of data) {
      const userId = row.recipient_user_id as string;
      if (!userId) continue;
      const status = row.status as string;
      mergeHealth(map, userId, {
        bounced: status === 'bounced' ? 1 : 0,
        failed: status === 'failed' ? 1 : 0,
        lastIssueAt: row.sent_at as string,
        kind: status === 'bounced' ? 'bounced' : 'failed',
      });
    }
    if (data.length < pageSize) break;
    offset += pageSize;
  }

  offset = 0;
  while (true) {
    const { data, error } = await supabase
      .from('user_lifecycle_emails')
      .select('user_id, status, sent_at, error_message')
      .eq('status', 'failed')
      .range(offset, offset + pageSize - 1);
    if (error) {
      console.error('[emailHealth] user_lifecycle_emails fetch failed:', error);
      break;
    }
    if (!data?.length) break;
    for (const row of data) {
      const userId = row.user_id as string;
      if (!userId) continue;
      mergeHealth(map, userId, {
        lifecycleFailed: 1,
        lastIssueAt: row.sent_at as string,
        kind: 'lifecycle_failed',
      });
    }
    if (data.length < pageSize) break;
    offset += pageSize;
  }

  return map;
}

export function formatEmailHealthTooltip(health: UserEmailHealth): string {
  const parts: string[] = [];
  if (health.bounced > 0) parts.push(`${health.bounced} bounced`);
  if (health.failed > 0) parts.push(`${health.failed} failed`);
  if (health.lifecycleFailed > 0) parts.push(`${health.lifecycleFailed} lifecycle send failed`);
  const summary = parts.join(', ');
  if (health.lastIssueAt) {
    return `${summary} — last issue ${new Date(health.lastIssueAt).toLocaleDateString()}`;
  }
  return summary;
}

export function hasEmailDeliveryIssues(health: UserEmailHealth | undefined): boolean {
  if (!health) return false;
  return health.bounced > 0 || health.failed > 0 || health.lifecycleFailed > 0;
}
