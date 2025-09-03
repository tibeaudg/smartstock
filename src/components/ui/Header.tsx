import React from 'react';
import { NotificationButton } from '../NotificationButton';
import { Package, User, LogOut, Settings, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
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
}

export const Header: React.FC<HeaderProps> = ({ title, unreadCount = 0, onNotificationClick, sidebarOpen, onSidebarToggle }) => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  return (
    <>

      {/* Desktop Header */}
      <header className="hidden lg:flex fixed top-0 left-0 right-0 z-40 items-center justify-between px-8 h-[70px] bg-white shadow-sm">
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
          <h1 className="text-lg font-semibold text-gray-900">stockflow</h1>
        </div>
        
        {/* Right side - Notifications and user menu */}
        <div className="flex items-center space-x-4">
          {user && (
            <NotificationButton unreadCount={unreadCount} onClick={onNotificationClick} />
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => navigate('/dashboard/settings/profile')}>
                <User className="mr-2 h-4 w-4" />
                <span>Mijn Profiel</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/dashboard/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Instellingen</span>
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
                <span>Afmelden</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 h-[60px] border-b border-gray-100">
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
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <Package className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-semibold text-gray-900">stockflow</span>
          </div>
          
          {/* Right side - Notifications and user menu */}
          <div className="flex items-center space-x-2">
            {user && (
              <NotificationButton unreadCount={unreadCount} onClick={onNotificationClick} />
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>

              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => navigate('/dashboard/settings/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Mijn Profiel</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/dashboard/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Instellingen</span>
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
                  <span>Afmelden</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    </>
  );
};
