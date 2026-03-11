import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { useMobile } from '@/hooks/use-mobile';
import { UserProfile } from '@/hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import { EmailVerificationBanner } from './EmailVerificationBanner';
import { TrialBanner } from './TrialBanner';

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
  // Ensure sidebar starts closed on mobile, open on desktop
  // Use a more explicit check to handle any timing issues
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    // Default to closed on mobile, open on desktop
    // This ensures proper initial state regardless of timing
    return !isMobile;
  });

  // Only set initial state when mobile detection changes, don't override user actions
  useEffect(() => {
    // Only set initial state, don't continuously override user actions
    if (isMobile) {
      // On mobile, start with sidebar closed but allow user to open it
      setSidebarOpen(false);
    } else {
      // On desktop, start with sidebar open
      setSidebarOpen(true);
    }
  }, [isMobile]); // Remove sidebarOpen from dependencies to prevent loops

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleTabChange = (tab: string) => {
    onTabChange(tab);
  };

  const { notifications, loading: notificationsLoading, unreadCount, markAllAsRead } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-slate-100 dark:bg-slate-950 text-foreground transition-colors">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - directly render without wrapper div */}
        {!isMobile && (
          <Sidebar
            currentTab={currentTab}
            onTabChange={handleTabChange}
            userRole={userRole}
            userProfile={userProfile}
            isOpen={sidebarOpen}
            onToggle={() => setSidebarOpen(!sidebarOpen)}
            unreadCount={unreadCount}
            notificationsOpen={showNotifications}
            onNotificationsOpenChange={setShowNotifications}
            notifications={notifications}
            notificationsLoading={notificationsLoading}
            onMarkNotificationsRead={markAllAsRead}
            isCollapsed={sidebarCollapsed}
            onCollapseChange={setSidebarCollapsed}
          />
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
            unreadCount={unreadCount}
            notificationsOpen={showNotifications}
            onNotificationsOpenChange={setShowNotifications}
            notifications={notifications}
            notificationsLoading={notificationsLoading}
            onMarkNotificationsRead={markAllAsRead}
          />
        )}

        <main
          className={`flex-1 min-h-0 main-content-surface ${variant === 'admin' ? 'overflow-y-auto' : 'p-4 pt-8 overflow-y-auto'} ${
            isMobile 
              ? 'ml-0 pb-20' // On mobile, add bottom padding for navbar
              : sidebarCollapsed
                ? 'ml-20' // Match left margin to collapsed sidebar width
                : 'ml-72' // Match left margin to expanded sidebar width
          } transition-colors`}
        >
          <div className={`${isMobile ? 'w-full' : variant === 'admin' ? 'w-full' : 'mx-auto w-full max-w-7xl px-4 md:px-6'} transition-colors`}>
            <EmailVerificationBanner />
            <TrialBanner />
            {children}
          </div>
        </main>
      </div>

    </div>
  );
};