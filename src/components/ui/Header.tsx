import React from 'react';
import { NotificationButton } from '../NotificationButton';
import { Package, User, LogOut, Settings, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useMobile } from '@/hooks/use-mobile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from '@/components/ui/button';

interface HeaderProps {
  title: string;
  unreadCount?: number;
  onNotificationClick?: () => void;
  sidebarOpen?: boolean;
  onSidebarToggle?: () => void;
  userProfile?: {
    first_name?: string;
    last_name?: string;
    email?: string;
  };
  onProfileClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, unreadCount = 0, onNotificationClick, sidebarOpen, onSidebarToggle, userProfile, onProfileClick }) => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const { isMobile } = useMobile();
  return (
    <>

      {/* Desktop Header */}
        <header className="hidden lg:flex fixed top-0 left-0 right-0 z-40 items-center justify-between px-8 h-[70px] bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 transition-colors">
          {/* Left side - Sidebar toggle */}
        <div className="flex items-center">
          {onSidebarToggle && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onSidebarToggle}
              className="w-10 h-10 hover:bg-gray-100"
              aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          )}
        </div>
        
        {/* Center - Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">stockflow</h1>
        </div>
        
        {/* Right side - Notifications, language switcher and user menu */}
        <div className="flex items-center space-x-4">
          {user && (
            <NotificationButton unreadCount={unreadCount} onClick={onNotificationClick} />
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="w-10 h-10 hover:bg-gray-100 dark:hover:bg-gray-800">
                <div className="rounded-full bg-blue-600 w-8 h-8 flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">
                    {user?.email?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200">
              <DropdownMenuItem onClick={() => navigate('/dashboard/settings/profile')}>
                <User className="mr-2 h-4 w-4 " />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/dashboard/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={async () => {
                try {
                  await signOut();
                  navigate('/auth');
                } catch (error) {
                  console.error('Error during sign out:', error);
                }
              }}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white dark:bg-gray-950 shadow-sm transition-colors">
        <div className="flex items-center justify-between px-4 h-[60px] border-b border-gray-100 dark:border-gray-800">
          {/* Left side - Notifications (moved from right) */}
          <div className="flex items-center">
            {user && onNotificationClick && (
              <NotificationButton unreadCount={unreadCount} onClick={onNotificationClick} />
            )}
          </div>
          
          {/* Center - Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <Package className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-semibold text-gray-900 dark:text-gray-100">stockflow</span>
          </div>
          
          {/* Right side - Profile button (moved from bottom navbar) */}
          <div className="flex items-center">
            {user && onProfileClick && userProfile && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onProfileClick}
                className="w-10 h-10 hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Profile"
              >
                <div className="rounded-full bg-blue-600 w-8 h-8 flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">
                    {userProfile?.first_name?.[0] || userProfile?.email?.[0] || 'U'}
                  </span>
                </div>
              </Button>
            )}
          </div>
        </div>
      </header>
    </>
  );
};
