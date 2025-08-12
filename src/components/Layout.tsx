import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { MobileBottomNav } from './MobileBottomNav';
import { useIsMobile } from '@/hooks/use-mobile';
import { UserProfile } from '@/hooks/useAuth';
import { BranchSelector } from './BranchSelector';
import { NotificationButton } from './NotificationButton';
import { useNotifications } from '../hooks/useNotifications';

interface LayoutProps {
  children: React.ReactNode;
  currentTab: string;
  onTabChange: (tab: string) => void;
  userRole: 'admin' | 'staff';
  userProfile?: UserProfile;
}

export const Layout = ({ children, currentTab, onTabChange, userRole, userProfile }: LayoutProps) => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleTabChange = (tab: string) => {
    onTabChange(tab);
  };

  const { notifications, loading: notificationsLoading, unreadCount, markAllAsRead } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const handleNotificationClick = () => {
    setShowNotifications((prev) => !prev);
    if (unreadCount > 0) markAllAsRead();
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header with Branch Selector and Notification Bell - Only on Mobile */}
      {isMobile && (
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex-shrink-0">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <BranchSelector />
            <div className="ml-2">
              <NotificationButton unreadCount={unreadCount} onClick={handleNotificationClick} />
            </div>
          </div>
          {/* Notification Overlay */}
          {showNotifications && (
            <div className="fixed top-16 right-4 z-[100] bg-white border border-gray-200 rounded-lg shadow-xl p-4 w-80 max-h-[60vh] overflow-y-auto">
              <h4 className="font-semibold mb-2">Meldingen</h4>
              {notificationsLoading ? (
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
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {!isMobile && (
          <Sidebar
            currentTab={currentTab}
            onTabChange={handleTabChange}
            userRole={userRole}
            userProfile={userProfile}
            isOpen={sidebarOpen}
            onToggle={() => setSidebarOpen(!sidebarOpen)}
          />
        )}

        <main className={`flex-1 overflow-y-auto ${isMobile ? 'pb-16' : ''}`}>
          <div className="p-4 md:p-6 max-w-full">
            {children}
          </div>
        </main>
      </div>

      {isMobile && (
        <MobileBottomNav
          currentTab={currentTab}
          onTabChange={handleTabChange}
          userRole={userRole}
        />
      )}
    </div>
  );
};
