import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DemoSidebar } from './DemoSidebar';
import { Header } from './ui/Header';
import { useMobile } from '@/hooks/use-mobile';
import { DemoBanner } from './DemoBanner';
import { useDemoSession } from '@/hooks/useDemoData';
import { ThemeProvider } from '@/hooks/useTheme';

interface DemoLayoutProps {
  sessionToken: string | null;
  children: React.ReactNode;
}

export const DemoLayout: React.FC<DemoLayoutProps> = ({ sessionToken, children }) => {
  const { isMobile } = useMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(() => !isMobile);

  const { data: session } = useDemoSession(sessionToken);
  const expiresAt = session ? new Date(session.expires_at) : undefined;

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  const getCurrentTab = (): string => {
    const pathParts = location.pathname.split('/');
    return pathParts[2] || 'demo';
  };

  // Mock user profile for demo
  const mockUserProfile = {
    id: 'demo-user',
    email: 'demo@stockflowsystems.com',
    first_name: 'Demo',
    last_name: 'User',
    role: 'admin' as const,
    is_owner: true,
    blocked: false,
  };

  return (
    <ThemeProvider>
      <div className="w-screen h-screen overflow-hidden overflow-x-hidden m-0 p-0 bg-slate-50 dark:bg-gray-900">
        {/* Demo Banner - Always visible at top */}
        <DemoBanner expiresAt={expiresAt} />

        <div className="h-[calc(100vh-80px)] flex flex-col">
          {/* Header */}
          <Header 
            title="Demo Dashboard" 
            unreadCount={0} 
            onNotificationClick={() => {}}
            userProfile={mockUserProfile}
          />
          
          <div className="flex flex-1 overflow-hidden">
            {/* Demo Sidebar */}
            <DemoSidebar
              sessionToken={sessionToken}
              isOpen={sidebarOpen}
              onToggle={() => setSidebarOpen(!sidebarOpen)}
            />

            <main
              className={` ${
                isMobile 

                    ? 'md:ml-6' // Account for fixed sidebar width
                    : 'md:ml-6'
              } transition-colors`}
            >
              {children}
            </main>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

