import { supabase } from '@/integrations/supabase/client';

export type AdminAuditAction =
  | 'impersonate'
  | 'block'
  | 'unblock'
  | 'delete_user'
  | 'plan_override'
  | 'trial_extend'
  | 'subscription_pause'
  | 'credit_applied'
  | 'trial_stage_override'
  | 'checklist_retrigger'
  | 'password_reset';

export interface LogAdminActionParams {
  adminUserId: string;
  targetUserId: string;
  action: AdminAuditAction;
  summary: string;
  reason?: string;
  tableName?: string;
  recordId?: string;
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
}

export async function logAdminAction(params: LogAdminActionParams): Promise<void> {
  const {
    adminUserId,
    targetUserId,
    action,
    summary,
    reason,
    tableName = 'profiles',
    recordId,
    oldValues,
    newValues,
  } = params;

  const { error } = await supabase.from('audit_logs').insert({
    user_id: targetUserId,
    admin_user_id: adminUserId,
    action: `ADMIN: ${summary}`,
    table_name: tableName,
    record_id: recordId ?? targetUserId,
    reason: reason?.trim() || null,
    old_values: oldValues ?? null,
    new_values: newValues ?? null,
  });

  if (error) {
    console.warn('[adminAudit] failed to write audit log:', error.message);
  }
}
