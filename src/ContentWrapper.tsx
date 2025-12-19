
import React, { useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from './components/ui/Header';
import { useNotifications } from './hooks/useNotifications';
import { AuthContext } from './hooks/useAuth';
import { useSessionRevalidation } from './hooks/useSessionRevalidation';
import { useWindowRefocusRefresh } from './hooks/useWindowRefocusRefresh';
import { useWebsiteTracking } from './hooks/useWebsiteTracking';

const getPageTitle = (pathname: string) => {
  // Don't show header for dashboard pages as they use Layout component
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) return '';
    if (pathname.startsWith('/admin/notifications')) return 'Notifications';
  if (pathname.startsWith('/admin/user')) return 'User';
  if (pathname.startsWith('/admin')) return 'Admin';
  if (pathname === '/') return '';
  return '';
};

export const ContentWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  // Use context directly to avoid hard failure if provider is not mounted yet
  const auth = useContext(AuthContext);
  const user = auth?.user || null;

  // Globally revalidate auth session on tab focus to prevent stale data freezes
  useSessionRevalidation();
  // Global window refocus refresh - works on all pages
  useWindowRefocusRefresh();
  // Enable website tracking throughout the app
  useWebsiteTracking();
  const { notifications, loading, unreadCount, markAllAsRead } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const title = getPageTitle(location.pathname);
  const handleNotificationClick = () => {
    setShowNotifications((prev) => !prev);
    if (unreadCount > 0) {
      markAllAsRead();
    }
  };
  return (
    <>
      {/* Desktop header for all pages except landing/auth */}
      {title && (
        <Header title={title} unreadCount={unreadCount} onNotificationClick={handleNotificationClick} />
      )}
      {/* Notification Overlay (internal pages only) */}
      {title && user && showNotifications && (
        <div className="fixed top-20 right-4 z-[100] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-4 w-80 max-h-[60vh] overflow-y-auto transition-colors">
          <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Notifications</h4>
          {loading ? (
            <div className="text-gray-500 dark:text-gray-400 text-sm">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="text-gray-700 dark:text-gray-300 text-sm">No notifications.</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {notifications.map((n) => (
                <li key={n.id} className={`py-2 ${!n.read ? 'bg-blue-50 dark:bg-blue-500/10' : ''}`}>
                  <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">{n.title}</div>
                  <div className="text-gray-700 dark:text-gray-300 text-xs mb-1">{n.message}</div>
                  <div className="text-gray-400 dark:text-gray-500 text-xs">{new Date(n.created_at).toLocaleString()}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      <div>
        {children}
      </div>
    </>
  );
};
