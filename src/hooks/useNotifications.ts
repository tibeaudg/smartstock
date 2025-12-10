import { useEffect, useState, useCallback, useContext } from 'react';
import { AuthContext } from './useAuth';
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
  // Use context directly to avoid hard failure if provider is not mounted yet
  const auth = useContext(AuthContext);
  const user = auth?.user || null;
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
