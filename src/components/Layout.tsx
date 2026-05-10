import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { useMobile } from '@/hooks/use-mobile';
import { UserProfile } from '@/hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import { EmailVerificationBanner } from './EmailVerificationBanner';
import { TrialBanner } from './TrialBanner';
import { PaymentGate } from './PaymentGate';

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
  const [secondarySidebarOpen, setSecondarySidebarOpen] = useState(false);

  const handleTabChange = (tab: string) => {
    onTabChange(tab);
  };

  const { notifications, loading: notificationsLoading, unreadCount, markAllAsRead } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-slate-100 dark:bg-slate-950 text-foreground transition-colors">
      {isMobile && (
        <div className="flex items-center h-14 px-4 bg-blue-600 dark:bg-gray-950 border-b border-blue-500 dark:border-gray-800 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="ml-3 text-base font-semibold text-white">StockFlow</span>
        </div>
      )}
      <div className="flex flex-1 overflow-hidden">
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
          onSecondarySidebarOpenChange={setSecondarySidebarOpen}
        />

        <main
          className={`flex-1 min-h-0 main-content-surface ${variant === 'admin' ? 'overflow-y-auto' : 'p-4 pt-8 overflow-y-auto'} ${
            isMobile
              ? 'ml-0'
              : sidebarCollapsed
                ? secondarySidebarOpen ? 'ml-[288px]' : 'ml-20'
                : secondarySidebarOpen ? 'ml-[496px]' : 'ml-72'
          } transition-[margin-left,color,background-color] duration-300`}
        >
          <div className={`${isMobile ? 'w-full' : variant === 'admin' ? 'w-full' : 'mx-auto w-full max-w-7xl px-4 md:px-6'} transition-colors`}>
            <EmailVerificationBanner />
            <TrialBanner />
            <PaymentGate>
              {children}
            </PaymentGate>
          </div>
        </main>
      </div>

    </div>
  );
};