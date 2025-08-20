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
    <div className="h-screen flex flex-col pt-6 bg-gray-100">
      <div className="flex flex-1 overflow-hidden">
        {!isMobile && (
          <div className="fixed left-0 top-0 h-full z-20">
            <Sidebar
              currentTab={currentTab}
              onTabChange={handleTabChange}
              userRole={userRole}
              userProfile={userProfile}
              isOpen={sidebarOpen}
              onToggle={() => setSidebarOpen(!sidebarOpen)}
            />
          </div>
        )}

        <main className={`flex-1 p-4 pt-8 md:pt-20 md:pl-64 overflow-y-auto`}>
          <div className={`${isMobile ? 'w-full' : 'mx-auto w-full max-w-7xl px-4 md:px-6'}`}>
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
