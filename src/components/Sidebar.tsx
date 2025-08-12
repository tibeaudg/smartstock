import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Settings, 
  Menu,
  X,
  HelpCircle,
  CircleUserRound, 
  Users
} 
from 'lucide-react';
import { BranchSelector } from './BranchSelector';
import { ChatModal } from './ChatModal';
import React, { useState } from 'react';
import { createPortal } from 'react-dom';

import { Button } from '@/components/ui/button';
import { useAuth, UserProfile } from '@/hooks/useAuth';
import { useNavigate, NavLink } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { LogOut } from 'lucide-react';

import { useProductCount } from '@/hooks/useDashboardData';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  userRole: 'admin' | 'staff';
  userProfile?: UserProfile;
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar = ({ userRole, userProfile, isOpen, onToggle }: SidebarProps) => {
  const { productCount, isLoading } = useProductCount();
  const isMobile = useIsMobile();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [chatOpen, setChatOpen] = useState(false);

  // If blocked, only show settings/invoicing
  const isBlocked = userProfile?.blocked;
  const isOwner = userProfile && userProfile.role === 'admin' && !userProfile.blocked;
  
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };
  
  const menuItems = isBlocked
    ? [
        { id: 'settings', label: 'Instellingen', icon: Settings, path: '/dashboard/settings' },
      ]
    : [
        { id: 'dashboard', label: 'Dashboard', icon: BarChart3, path: '/dashboard', end: true },
        { id: 'stock', label: 'Producten', icon: Package, path: '/dashboard/stock' },
        { id: 'transactions', label: 'Stockmutaties', icon: ShoppingCart, path: '/dashboard/transactions' },
        { id: 'settings', label: 'Instellingen', icon: Settings, path: '/dashboard/settings' },
        ...(isOwner
          ? [
              { id: 'admin', label: 'Admin', icon: Users, path: '/admin' },
            ]
          : []),
      ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={onToggle} />
      )}

      
      
      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 z-50 flex flex-col
        ${isOpen ? 'w-64' : 'w-16'}
        ${isOpen ? 'md:relative md:translate-x-0' : 'md:relative'}
        ${!isOpen ? 'md:translate-x-0' : ''}
      `}>

      <div className="flex items-center pl-5 space-x-3 h-[70px] flex-shrink-0">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <Package className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-lg font-semibold text-gray-900">stockflow</h1>
      </div>
        


        {/* User Info */}
        {isOpen && (
          <div className="px-3 py-2 border-b border-t border-gray-200 flex-shrink-0">
            <p className="text-xs text-gray-700 text-center font-medium">
              {userProfile?.first_name || userProfile?.last_name
                ? `${userProfile?.first_name ?? ''} ${userProfile?.last_name ?? ''}`.trim()
                : 'Laden...'}
            </p>
          </div>
        )}

        {/* Branch Selector - Only on Desktop */}
        {isOpen && !isMobile && (
          <div className="px-3 py-4 border-b border-gray-200 flex-shrink-0">
            <BranchSelector />
          </div>
        )}

        {/* Sidebar Content Area (no internal scrolling) */}
        
        <div className="flex-2 flex flex-col min-h-0 max-h-screen">
          {/* Navigation */}
          
          <nav className="flex-1 px-3 py-4 text-sm pb-60">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                let label = item.label;
                if (item.id === 'stock') {
                  label += ` `;
                  if (isLoading) {
                    label += '(...)';
                  } else {
                    label += `(${productCount})`;
                  }
                }
                return (
                  <li key={item.id}>
                    <NavLink
                      to={item.path}
                      end={item.end}
                      className={({ isActive }) => `
                        w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors
                        ${isActive 
                          ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }
                      `}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      {isOpen && <span className="font-medium ml-3">{label}</span>}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Fixed Bottom Section */}
        <div className="flex-shrink-0">
          {/* Help Section as professional submenu button */}
          <div className="border-t border-gray-200">
            <div className="px-3 py-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setChatOpen(true)}
                className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors
                  text-gray-600 hover:bg-blue-50 hover:text-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  ${isOpen ? '' : 'justify-center'}`}
                aria-label="Open hulp chat"
              >
                <HelpCircle className="w-5 h-5 flex-shrink-0" />
                {isOpen && (
                  <>
                    <span className="font-medium ml-3 flex-1 text-left">Hulp nodig?</span>
                    <svg className="w-4 h-4 ml-auto text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Logout Section - Desktop Only */}
          {!isMobile && (
            <div className="border-t border-gray-200">
              <div className="px-3 py-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className={`
                    w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50 
                    focus:ring-2 focus:ring-red-500 focus:ring-offset-2 
                    transition-all duration-200 rounded-lg
                    ${isOpen ? 'px-3' : 'px-2'}
                  `}
                  aria-label={isOpen ? "Afmelden" : "Uitloggen"}
                >
                  <LogOut className="w-4 h-4 flex-shrink-0" />
                  {isOpen && <span className="ml-3 font-medium">Afmelden</span>}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sidebar Close Button */}
      {isMobile && isOpen && (
        <button
          className="fixed top-4 right-4 z-50 bg-white text-gray-700 rounded-full p-2 shadow-md md:hidden border border-gray-200 hover:bg-gray-100"
          onClick={onToggle}
          aria-label="Sluit menu"
        >
          <X className="w-6 h-6" />
        </button>
      )}

      {/* Chat Modal - Rendered using Portal to escape sidebar container */}
      {chatOpen && createPortal(
        <ChatModal 
          open={chatOpen} 
          onClose={() => setChatOpen(false)} 
          aria-describedby="chat-modal-description"
        />,
        document.body
      )}
    </>
  );
};