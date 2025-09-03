
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from './components/ui/Header';
import { useNotifications } from './hooks/useNotifications';
import { useAuth } from './hooks/useAuth';

const getPageTitle = (pathname: string) => {
  // Don't show header for dashboard pages as they use Layout component
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) return '';
  if (pathname.startsWith('/admin/notifications')) return 'Meldingen';
  if (pathname.startsWith('/admin/user')) return 'Gebruiker';
  if (pathname.startsWith('/admin')) return 'Admin';
  if (pathname === '/') return '';
  return '';
};

export const ContentWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { user } = useAuth();
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
        <div className="fixed top-20 right-4 z-[100] bg-white border border-gray-200 rounded-lg shadow-xl p-4 w-80 max-h-[60vh] overflow-y-auto">
          <h4 className="font-semibold mb-2">Meldingen</h4>
          {loading ? (
            <div className="text-gray-500 text-sm">Laden...</div>
          ) : notifications.length === 0 ? (
            <div className="text-gray-700 text-sm">Geen meldingen.</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {notifications.map((n) => (
                <li key={n.id} className={`py-2 ${!n.read ? 'bg-blue-50' : ''}`}>
                  <div className="font-medium text-gray-900 text-sm">{n.title}</div>
                  <div className="text-gray-700 text-xs mb-1">{n.message}</div>
                  <div className="text-gray-400 text-xs">{new Date(n.created_at).toLocaleString()}</div>
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
