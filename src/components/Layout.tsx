
import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { MobileBottomNav } from './MobileBottomNav';
import { useIsMobile } from '@/hooks/use-mobile';
import { UserProfile } from '@/hooks/useAuth';

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
    console.log('Layout: Tab change requested:', tab);
    onTabChange(tab);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
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
      
      <main className={`flex-1 transition-all duration-300 ${!isMobile && sidebarOpen ? 'ml-64' : !isMobile ? 'ml-16' : ''} ${isMobile ? 'pb-16' : ''}`}>
        <div className="p-3 md:p-4">
          {children}
        </div>
      </main>

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
