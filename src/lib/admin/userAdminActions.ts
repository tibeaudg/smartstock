import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export async function impersonateUser(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.functions.invoke('generate-magic-link', {
      body: { user_id: userId },
    });
    if (error) throw error;
    if (data?.link) {
      await navigator.clipboard.writeText(data.link);
      toast.success('Magic link copied — open in a private/incognito window');
      return true;
    }
    return false;
  } catch {
    toast.error('Impersonation requires the "generate-magic-link" edge function to be deployed');
    return false;
  }
}

export function emailUser(email: string, subject = 'StockFlow'): void {
  window.location.href = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}`;
}

export async function extendTrial(userId: string, adminEmail?: string): Promise<boolean> {
  try {
    const { data: sub } = await supabase
      .from('user_subscriptions')
      .select('trial_end_date, end_date')
      .eq('user_id', userId)
      .maybeSingle();
    const baseDate = sub?.trial_end_date ? new Date(sub.trial_end_date) : new Date();
    const newEnd = new Date(baseDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
    const { error } = await supabase
      .from('user_subscriptions')
      .update({ trial_end_date: newEnd, end_date: newEnd })
      .eq('user_id', userId);
    if (error) throw error;
    await supabase.from('audit_logs').insert({
      user_id: userId,
      action: `ADMIN: Trial extended +7 days by ${adminEmail ?? 'admin'}`,
      table_name: 'user_subscriptions',
      record_id: userId,
    });
    toast.success('Trial extended by 7 days');
    return true;
  } catch (err) {
    toast.error(err instanceof Error ? err.message : 'Failed to extend trial');
    return false;
  }
}

export async function addAdminNote(
  userId: string,
  note: string,
  adminEmail?: string,
): Promise<boolean> {
  const trimmed = note.trim();
  if (!trimmed) return false;
  try {
    const { error } = await supabase.from('audit_logs').insert({
      user_id: userId,
      action: `ADMIN_NOTE: ${trimmed} (by ${adminEmail ?? 'admin'})`,
      table_name: 'profiles',
      record_id: userId,
    });
    if (error) throw error;
    toast.success('Flag note saved');
    return true;
  } catch (err) {
    toast.error(err instanceof Error ? err.message : 'Failed to save note');
    return false;
  }
}

export async function resetUserPassword(email: string): Promise<boolean> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth`,
    });
    if (error) throw error;
    toast.success(`Password reset email sent to ${email}`);
    return true;
  } catch (err) {
    toast.error(err instanceof Error ? err.message : 'Failed to send reset email');
    return false;
  }
}

export function copyEmails(emails: string[]): void {
  const text = emails.join(', ');
  navigator.clipboard.writeText(text);
  toast.success(`Copied ${emails.length} email(s)`);
}

export function mailtoBulk(emails: string[], max = 50): void {
  if (emails.length > max) {
    toast.warning(`mailto supports up to ${max} addresses; copying list instead.`);
    copyEmails(emails);
    return;
  }
  const bcc = emails.join(',');
  window.location.href = `mailto:?bcc=${encodeURIComponent(bcc)}&subject=${encodeURIComponent('StockFlow')}`;
}
