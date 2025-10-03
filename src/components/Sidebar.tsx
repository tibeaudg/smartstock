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
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  Truck,
  LogOut,
  Star,
  TrendingUp,
  Brain,
  PieChart,
  Download,
  Filter,
  Database,
  Activity
} 
from 'lucide-react';
import { BranchSelector } from './BranchSelector';
import { SupportModal } from './SupportModal';
import { ChatModal } from './ChatModal';
import { FloatingChatButton } from './FloatingChatButton';
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { useAuth, UserProfile } from '@/hooks/useAuth';
import { useNavigate, NavLink, useLocation } from 'react-router-dom';
import { useMobile } from '@/hooks/use-mobile';
import { useUnreadMessages } from '@/hooks/UnreadMessagesContext';
import { useProductCount } from '@/hooks/useDashboardData';
import { useSubscription } from '@/hooks/useSubscription';

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
  const location = useLocation();
  const [supportOpen, setSupportOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const { unreadCount: unreadMessages, resetUnreadCount } = useUnreadMessages();
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});
  
  // Check subscription-based feature access
  const { canUseFeature, currentTier } = useSubscription();
  
  // Check specific feature access based on subscription tier
  const hasDeliveryNotes = canUseFeature('delivery-notes');
  const hasScanner = true; // Scanner is now available for all users
  const hasAnalytics = canUseFeature('analytics');

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
    { id: 'profile', label: 'Profile', path: '/dashboard/settings/profile' },
    { id: 'branches', label: 'Branches', path: '/dashboard/settings/branches' },
    { id: 'users', label: 'Users', path: '/dashboard/settings/users' },
    { id: 'subscription', label: 'Subscription', path: '/dashboard/settings/subscription' },
  ];

  const adminSubItems = [
    { id: 'overview', label: 'Overview', path: '/admin' },
  ];

  const analyticsSubItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/dashboard/analytics' },
    { id: 'predictions', label: 'Predictions', path: '/dashboard/analytics/predictions' },
    { id: 'reports', label: 'Reports', path: '/dashboard/analytics/reports' },
    { id: 'export', label: 'Export', path: '/dashboard/analytics/export' },
    { id: 'api', label: 'API', path: '/dashboard/analytics/api' },
    { id: 'filtering', label: 'Filtering', path: '/dashboard/analytics/filtering' },
  ];

  const menuItems = isBlocked
    ? [
        { 
          id: 'settings', 
          label: 'Settings', 
          icon: Settings, 
          path: '/dashboard/settings',
          subItems: [{ id: 'invoicing', label: 'Billing', path: '/dashboard/settings/invoicing' }]
        },
      ]
    : [
        { id: 'dashboard', label: 'Dashboard', icon: BarChart3, path: '/dashboard', end: true },

        { id: 'scanner', label: 'Scanner', icon: Scan, path: '/dashboard/scan' },

        { 
          id: 'stock', 
          label: 'Products', 
          icon: Package, 
          path: '/dashboard/stock',
          subItems: [
            { id: 'products', label: 'Products', path: '/dashboard/stock' },
            { id: 'categories', label: 'Categories', path: '/dashboard/categories' },
            { id: 'suppliers', label: 'Suppliers', path: '/dashboard/suppliers' }
          ]
        },
        { id: 'transactions', label: 'Movements', icon: ShoppingCart, path: '/dashboard/transactions' },
        ...(hasDeliveryNotes ? [{
          id: 'delivery-notes',
          label: 'Delivery Notes',
          icon: Truck,
          path: '/dashboard/delivery-notes'
        }] : []),
        ...(hasAnalytics ? [{
          id: 'analytics',
          label: 'Advanced Analytics',
          icon: TrendingUp,
          path: '/dashboard/analytics',
          subItems: analyticsSubItems
        }] : []),

        { 
          id: 'settings', 
          label: 'Settings', 
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
      {isMobile && isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onToggle} />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 z-50 flex flex-col
        ${isMobile 
          ? (isOpen ? 'w-64 translate-x-0' : 'w-16 -translate-x-full') 
          : (isOpen ? 'w-64' : 'w-16')
        }
        ${!isMobile ? 'md:relative md:translate-x-0' : ''}
      `}>
        <div className="flex items-center pl-3 sm:pl-5 space-x-2 sm:space-x-3 h-[60px] sm:h-[70px] flex-shrink-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Package className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          {isOpen && <h1 className="text-base sm:text-lg font-semibold text-gray-900">stockflow</h1>}
        </div>



        {/* Branch Selector - Always show when sidebar is open */}
        {isOpen && (
          <div className="px-2 sm:px-3 py-3 sm:py-4 border-b border-gray-200 flex-shrink-0">
            <BranchSelector />
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-2 sm:px-3 py-3 sm:py-4 text-xs sm:text-sm pb-40 sm:pb-60 overflow-y-auto">
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
                        // Auto-close sidebar on mobile when menu item is clicked
                        if (isMobile) {
                          onToggle();
                        }
                      }
                    }}
                    className={`
                      w-full font-semibold flex items-center px-2 sm:px-3 py-2 rounded-lg text-left transition-colors
                      ${(isItemActive || isSubmenuOpen)
                        ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    <div className="flex items-center w-full">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                      {isOpen && (
                        <div className="flex items-center justify-between flex-1 ml-2 sm:ml-3">
                          <span className="text-xs sm:text-sm">{label}</span>
                          {hasSubItems && (
                            <ChevronDown 
                              className={`w-3 h-3 sm:w-4 sm:h-4 transform transition-transform ${isSubmenuOpen ? 'rotate-180' : ''}`} 
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </NavLink>

                  {/* Submenu */}
                  {isOpen && hasSubItems && isSubmenuOpen && (
                    <ul className="ml-3 sm:ml-4 space-y-1">
                      {item.subItems.map((subItem) => (
                        <li key={subItem.id}>
                          <NavLink
                            to={subItem.path}
                            onClick={() => {
                              // Auto-close sidebar on mobile when submenu item is clicked
                              if (isMobile) {
                                onToggle();
                              }
                            }}
                            className={({ isActive }) => `
                              w-full flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-2 rounded-lg text-left transition-colors text-xs sm:text-sm
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



        {/* Sign Out Button */}
        <div className="border-t border-gray-200">
          <div className="px-3 py-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className={`
                  w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors
                  text-red-600 hover:bg-red-50 hover:text-red-700
                  focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                  ${isOpen ? '' : 'justify-center'}
                `}
                aria-label="Sign out"
              >
                <LogOut className="w-5 h-5 flex-shrink-0" />
                {isOpen && (
                  <span className="font-medium ml-3 flex-1 text-left">Logout</span>
                )}
              </Button>
            </div>
          </div>


        </div>
      </div>





      {/* Support Modal - Rendered using Portal to escape sidebar container */}
      {supportOpen && createPortal(
        <SupportModal 
          open={supportOpen} 
          onClose={() => setSupportOpen(false)} 
          aria-describedby="support-modal-description"
        />,
        document.body
      )}

      {/* Floating Chat Button - Rendered using Portal */}
      {!isMobile && createPortal(
        <>
          <FloatingChatButton onClick={() => setChatOpen(true)} />
          {unreadMessages > 0 && (
            <div className="fixed z-50 bottom-[88px] right-[52px] bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold shadow-lg">
              {unreadMessages}
            </div>
          )}
        </>,
        document.body
      )}

      {/* Chat Modal - Rendered using Portal */}
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
