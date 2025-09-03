import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Settings, 
  Menu,
  X,
  HelpCircle,
  CircleUserRound, 
  Users,
  MessageSquare,
  Bell,
  Scan,
  ChevronDown
} 
from 'lucide-react';
import { BranchSelector } from './BranchSelector';
import { ChatModal } from './ChatModal';
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { useAuth, UserProfile } from '@/hooks/useAuth';
import { useNavigate, NavLink, useLocation } from 'react-router-dom';
import { useMobile } from '@/hooks/use-mobile';
import { useUnreadMessages } from '@/hooks/UnreadMessagesContext';
import { useProductCount } from '@/hooks/useDashboardData';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  userRole: 'admin' | 'staff';
  userProfile?: UserProfile;
  isOpen: boolean;
  onToggle: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType;
  path: string;
  end?: boolean;
  subItems?: {
    id: string;
    label: string;
    path: string;
  }[];
}

export const Sidebar = ({ userRole, userProfile, isOpen, onToggle }: SidebarProps) => {
  const { productCount, isLoading } = useProductCount();
  const { isMobile } = useMobile();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [chatOpen, setChatOpen] = useState(false);
  const { unreadCount: unreadMessages, resetUnreadCount } = useUnreadMessages();
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});

  // If blocked, only show settings/invoicing
  const isBlocked = userProfile?.blocked;
  const isOwner = userProfile && userProfile.is_owner === true && !userProfile.blocked;

  const toggleSubmenu = (menuId: string) => {
    setOpenSubmenus(prev => {
      // If we're opening this submenu, close all others
      if (!prev[menuId]) {
        return { [menuId]: true };
      }
      // If we're closing this submenu, just close it
      return { ...prev, [menuId]: false };
    });
  };
  
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };
  
  const settingsSubItems = [
    { id: 'branches', label: 'Filialen', path: '/dashboard/settings/branches' },
    { id: 'users', label: 'Gebruikers', path: '/dashboard/settings/users' },
    { id: 'modules', label: 'Modules', path: '/dashboard/settings/modules' },
  ];

  const adminSubItems = [
    { id: 'overview', label: 'Overzicht', path: '/admin' },
  ];

  const menuItems = isBlocked
    ? [
        { 
          id: 'settings', 
          label: 'Instellingen', 
          icon: Settings, 
          path: '/dashboard/settings',
          subItems: [{ id: 'invoicing', label: 'Facturatie', path: '/dashboard/settings/invoicing' }]
        },
      ]
    : [
        { id: 'dashboard', label: 'Dashboard', icon: BarChart3, path: '/dashboard', end: true },
        { id: 'scan', label: 'Scannen', icon: Scan, path: '/dashboard/scan' },

        { 
          id: 'stock', 
          label: 'Producten', 
          icon: Package, 
          path: '/dashboard/stock',
          subItems: [
            { id: 'products', label: 'Producten', path: '/dashboard/stock' },
            { id: 'categories', label: 'Categorieën', path: '/dashboard/categories' },
            { id: 'suppliers', label: 'Leveranciers', path: '/dashboard/suppliers' }
          ]
        },
        { id: 'transactions', label: 'Bewegingen', icon: ShoppingCart, path: '/dashboard/transactions' },
        { 
          id: 'settings', 
          label: 'Instellingen', 
          icon: Settings, 
          path: '/dashboard/settings',
          subItems: settingsSubItems
        },
        ...(isOwner
          ? [
              { 
                id: 'admin', 
                label: 'Admin', 
                icon: Users, 
                path: '/admin',
                subItems: adminSubItems
              },
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
          {isOpen && <h1 className="text-lg font-semibold text-gray-900">stockflow</h1>}
        </div>

        {/* Branch Selector - Only on Desktop */}
        {isOpen && !isMobile && (
          <div className="px-3 py-4 border-b border-gray-200 flex-shrink-0">
            <BranchSelector />
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 text-sm pb-60 overflow-y-auto">
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

              const hasSubItems = item.subItems && item.subItems.length > 0;
              const isSubmenuOpen = openSubmenus[item.id];
              const isItemActive = location.pathname === item.path || 
                (hasSubItems && item.subItems.some(sub => location.pathname === sub.path));

              return (
                <li key={item.id} className="space-y-1">
                  <NavLink
                    to={hasSubItems ? '#' : item.path}
                    end={item.end}
                    onClick={(e) => {
                      if (hasSubItems) {
                        e.preventDefault();
                        toggleSubmenu(item.id);
                      } else {
                        // Close all submenus when clicking a regular menu item
                        setOpenSubmenus({});
                      }
                    }}
                    className={`
                      w-full font-semibold flex items-center px-3 py-2 rounded-lg text-left transition-colors
                      ${(isItemActive || isSubmenuOpen)
                        ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    <div className="flex items-center w-full">
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      {isOpen && (
                        <div className="flex items-center justify-between flex-1 ml-3">
                          <span>{label}</span>
                          {hasSubItems && (
                            <ChevronDown 
                              className={`w-4 h-4 transform transition-transform ${isSubmenuOpen ? 'rotate-180' : ''}`} 
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </NavLink>

                  {/* Submenu */}
                  {isOpen && hasSubItems && isSubmenuOpen && (
                    <ul className="ml-4 space-y-1">
                      {item.subItems.map((subItem) => (
                        <li key={subItem.id}>
                          <NavLink
                            to={subItem.path}
                            className={({ isActive }) => `
                              w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors text-sm
                              ${isActive 
                                ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                              }
                            `}
                          >
                            <span>{subItem.label}</span>
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Fixed Bottom Section */}
        <div className="flex-shrink-0">
          {/* Help Section */}
          <div className="border-t border-gray-200">
            <div className="px-3 py-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setChatOpen(true)}
                className={`
                  w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors
                  ${unreadMessages > 0 
                    ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' 
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
                  }
                  focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  ${isOpen ? '' : 'justify-center'}
                `}
                aria-label="Open hulp chat"
              >
                <div className="relative">
                  {unreadMessages > 0 ? (
                    <MessageSquare className="w-5 h-5 flex-shrink-0 text-blue-600" />
                  ) : (
                    <HelpCircle className="w-5 h-5 flex-shrink-0" />
                  )}
                  {unreadMessages > 0 && !isOpen && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center">
                      <Bell className="w-4 h-4 text-red-500 fill-current animate-pulse" />
                    </span>
                  )}
                </div>
                {isOpen && (
                  <>
                    <span className="font-medium ml-3 flex-1 text-left">Support</span>
                    {unreadMessages > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full mr-2">
                        {unreadMessages}
                      </span>
                    )}
                    <ChevronDown className="w-4 h-4 ml-auto" />
                  </>
                )}
              </Button>
            </div>
          </div>

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
          resetUnreadMessages={resetUnreadCount}
        />,
        document.body
      )}
    </>
  );
};
