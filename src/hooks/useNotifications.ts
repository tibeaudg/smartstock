import { useEffect, useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { fetchNotifications, markAllNotificationsAsRead } from '../lib/notifications';

export interface Notification {
  id: string;
  title: string;
  message: string;
  created_at: string;
  read: boolean;
  read_at?: string;
}


export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await fetchNotifications(user.id);
      setNotifications(data);
    } catch (e) {
      // Optionally handle error
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const markAllAsRead = async () => {
    if (!user) return;
    const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);
    if (unreadIds.length === 0) return;
    await markAllNotificationsAsRead(user.id, unreadIds);
    await loadNotifications();
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return { notifications, loading, unreadCount, markAllAsRead };
}
