import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './ui/Header';
import { useMobile } from '@/hooks/use-mobile';
import { UserProfile, useAuth } from '@/hooks/useAuth';
import { BranchSelector } from './BranchSelector';
import { NotificationButton } from './NotificationButton';
import { useNotifications } from '../hooks/useNotifications';
import { EmailVerificationBanner } from './EmailVerificationBanner';

interface LayoutProps {
  children: React.ReactNode;
  currentTab: string;
  onTabChange: (tab: string) => void;
  userRole: 'admin' | 'staff';
  userProfile?: UserProfile;
  // When set to 'admin', the inner max-width container and default paddings are disabled
  // so pages can render full-bleed layouts (e.g., with a sub-sidebar) without hacks.
  variant?: 'default' | 'admin';
}

export const Layout = ({ children, currentTab, onTabChange, userRole, userProfile, variant = 'default' }: LayoutProps) => {
  const { isMobile } = useMobile();
  const { user } = useAuth();

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
    <div className="h-screen flex flex-col bg-background text-foreground transition-colors">
      {/* Header */}
      <Header 
        title="Dashboard" 
        unreadCount={unreadCount} 
        onNotificationClick={handleNotificationClick}
        userProfile={userProfile}
      />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - hidden on mobile, shown on desktop, always open */}
        {!isMobile && (
          <div className="fixed left-0 top-0 h-full z-20">
            <Sidebar
              currentTab={currentTab}
              onTabChange={handleTabChange}
              userRole={userRole}
              userProfile={userProfile}
              isOpen={true}
              onToggle={() => {}}
            />
          </div>
        )}
        
        {/* Mobile Bottom Navbar - rendered inside Sidebar component */}
        {isMobile && (
          <Sidebar
            currentTab={currentTab}
            onTabChange={handleTabChange}
            userRole={userRole}
            userProfile={userProfile}
            isOpen={false}
            onToggle={() => {}}
          />
        )}

        <main
          className={`flex-1 main-content-surface ${variant === 'admin' ? 'pt-[70px] md:pt-[70px] md:pl-0 overflow-y-auto' : 'p-4 pt-8 md:pt-20 overflow-y-auto'} ${
            isMobile 
              ? 'ml-0 pb-20' // On mobile, add bottom padding for navbar
              : 'md:pl-64' // Always account for open sidebar on desktop
          } transition-colors`}
        >
          <div className={`${isMobile ? 'w-full' : variant === 'admin' ? 'w-full' : 'mx-auto w-full max-w-7xl px-4 md:px-6'} transition-colors`}>
            <EmailVerificationBanner />
            {children}
          </div>
        </main>
      </div>

      {/* Notification Overlay */}
      {showNotifications && user && (
        <div className="fixed top-20 right-4 z-[100] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-4 w-80 max-h-[60vh] overflow-y-auto transition-colors">
          <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Notifications</h4>
          {notificationsLoading ? (
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
    </div>
  );
};
