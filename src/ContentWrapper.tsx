import React, { useState, useContext, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useNotifications } from './hooks/useNotifications';
import { AuthContext } from './hooks/useAuth';

export const ContentWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const auth = useContext(AuthContext);
  const user = auth?.user ?? null;

  const {
    notifications,
    loading,
    unreadCount,
    markAllAsRead,
  } = useNotifications();

  const [showNotifications, setShowNotifications] = useState(false);

  const title = useMemo(() => getPageTitle(location.pathname), [location.pathname]);

  const handleNotificationClick = () => {
    setShowNotifications(prev => !prev);

    if (unreadCount > 0) {
      markAllAsRead();
    }
  };

  return (
    <>

      {title && user && showNotifications && (
        <div className="fixed top-20 right-4 z-[100] w-[calc(100vw-2rem)] sm:w-80 max-h-[60vh] overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 shadow-xl transition-colors">
          <h4 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
            Notifications
          </h4>

          {loading ? (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Loading...
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-sm text-gray-700 dark:text-gray-300">
              No notifications.
            </div>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {notifications.map((n) => (
                <li
                  key={n.id}
                  className={`py-2 ${!n.read ? 'bg-blue-50 dark:bg-blue-500/10' : ''}`}
                >
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {n.title}
                  </div>

                  <div className="mb-1 text-xs text-gray-700 dark:text-gray-300">
                    {n.message}
                  </div>

                  <div className="text-xs text-gray-400 dark:text-gray-500">
                    {new Date(n.created_at).toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div>{children}</div>
    </>
  );
};

function getPageTitle(pathname: string): string {
  const routes: Record<string, string> = {
    '/': 'Home',
    '/dashboard': 'Dashboard',
    '/settings': 'Settings',
    '/notifications': 'Notifications',
    '/profile': 'Profile',
    '/login': 'Login',
  };

  // exact match
  if (routes[pathname]) return routes[pathname];

  // fallback for nested routes
  if (pathname.startsWith('/dashboard')) return 'Dashboard';
  if (pathname.startsWith('/settings')) return 'Settings';
  if (pathname.startsWith('/profile')) return 'Profile';

  return '';
}