import { supabase } from '../integrations/supabase/client';

// Delete a notification (admin only)
export async function deleteNotification(notificationId: string) {
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', notificationId);
  if (error) throw error;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  created_at: string;
  created_by: string;
  read: boolean;
  read_at?: string;
}

// Fetch notifications for the current user, with read state
export async function fetchNotifications(userId: string): Promise<Notification[]> {
  // Get all notifications
  const { data: notifications, error } = await supabase
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;

  // Get read states for this user
  const { data: reads, error: readsError } = await supabase
    .from('notification_reads')
    .select('notification_id, read_at')
    .eq('user_id', userId);
  if (readsError) throw readsError;

  const readMap = new Map(reads.map(r => [r.notification_id, r.read_at]));

  return notifications.map((n: any) => ({
    ...n,
    read: readMap.has(n.id),
    read_at: readMap.get(n.id) || undefined,
  }));
}

// Mark all notifications as read for the user
export async function markAllNotificationsAsRead(userId: string, notificationIds: string[]) {
  const now = new Date().toISOString();
  const inserts = notificationIds.map(id => ({
    notification_id: id,
    user_id: userId,
    read_at: now,
  }));
  // Upsert to avoid duplicates
  const { error } = await supabase
    .from('notification_reads')
    .upsert(inserts, { onConflict: 'notification_id,user_id' });
  if (error) throw error;
}

// Admin: send a new notification
export async function sendNotification(title: string, message: string, created_by: string) {
  const { data, error } = await supabase
    .from('notifications')
    .insert([{ title, message, created_by }]);
  if (error) throw error;
  return data;
}
