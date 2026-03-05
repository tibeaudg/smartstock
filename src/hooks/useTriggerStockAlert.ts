import { supabase } from '@/integrations/supabase/client';

/**
 * Triggers the send-stock-alert edge function with check_alert to send automatic
 * low/out-of-stock notifications. Use after successful stock updates.
 * This is a fallback when the DB trigger (pg_net) doesn't fire (e.g. vault not configured).
 */
export async function triggerStockAlertIfNeeded(
  productId: string,
  branchId: string
): Promise<void> {
  try {
    await supabase.functions.invoke('send-stock-alert', {
      body: { check_alert: true, product_id: productId, branch_id: branchId },
    });
    // Silently ignore - we don't want to disturb the user; alerts are best-effort
  } catch {
    // Ignore errors
  }
}
