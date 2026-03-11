import { 
  BarChart3, 
  Package, 
  Settings, 
  X,
  Users,
  ChevronDown,
  TrendingUp,
  Moon,
  Sun,
  Layers,
  FileText,
  ShoppingCart,
  Warehouse,
  Truck,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Bell,
  Contact,
  GitBranch,
} 
from 'lucide-react';
import { SupportModal } from './SupportModal';
import { ChatModal } from './ChatModal';
import { BranchPickerDropdown } from './BranchPickerDropdown';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth, UserProfile } from '@/hooks/useAuth';
import { useBranchSettings } from '@/hooks/useBranchSettings';
import { useBranches } from '@/hooks/useBranches';
import { useNavigate, NavLink, useLocation } from 'react-router-dom';
import { useMobile } from '@/hooks/use-mobile';
import { useUnreadMessages } from '@/hooks/UnreadMessagesContext';
import { useProductCount } from '@/hooks/useDashboardData';
import { useTheme } from '@/hooks/useTheme';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  created_at: string;
  read: boolean;
}

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  userRole: 'admin' | 'staff';
  userProfile?: UserProfile;
  isOpen: boolean;
  onToggle: () => void;
  unreadCount?: number;
  notificationsOpen?: boolean;
  onNotificationsOpenChange?: (open: boolean) => void;
  notifications?: NotificationItem[];
  notificationsLoading?: boolean;
  onMarkNotificationsRead?: () => void;
  isCollapsed?: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
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

export const Sidebar = ({
  userRole,
  userProfile,
  isOpen,
  onToggle,
  unreadCount = 0,
  notificationsOpen = false,
  onNotificationsOpenChange,
  notifications = [],
  notificationsLoading = false,
  onMarkNotificationsRead,
  isCollapsed: controlledCollapsed,
  onCollapseChange,
}: SidebarProps) => {
  const { productCount, isLoading } = useProductCount();
  const { isMobile } = useMobile();
  const { user } = useAuth();
  const { organisationName } = useBranchSettings();
  const navigate = useNavigate();
  const location = useLocation();
  const [supportOpen, setSupportOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const { unreadCount: unreadMessages, resetUnreadCount } = useUnreadMessages();
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const { theme, toggleTheme } = useTheme();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { signOut } = useAuth();
  const [uncontrolledCollapsed, setUncontrolledCollapsed] = useState(false);
  const [helpCenterOpen, setHelpCenterOpen] = useState(false);
  const { activeBranch } = useBranches();

  const isCollapsed =
    typeof controlledCollapsed === 'boolean' ? controlledCollapsed : uncontrolledCollapsed;

  const setCollapsed = (value: boolean | ((prev: boolean) => boolean)) => {
    if (typeof value === 'function') {
      setUncontrolledCollapsed((prev) => {
        const next = value(prev);
        onCollapseChange?.(next);
        return next;
      });
    } else {
      setUncontrolledCollapsed(value);
      onCollapseChange?.(value);
    }
  };

  // Navigate to help center when requested from sidebar
  useEffect(() => {
    if (!helpCenterOpen) return;
    navigate('/help-center');
    setHelpCenterOpen(false);
  }, [helpCenterOpen, navigate]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };
  


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


  const settingsSubItems = [
    { id: 'general', label: 'General', path: '/dashboard/settings/general' },
    { id: 'profile', label: 'Profile', path: '/dashboard/settings/profile' },
    { id: 'users', label: 'Users', path: '/dashboard/settings/users' },
    { id: 'branches', label: 'Branches', path: '/dashboard/settings/branches' },
    { id: 'billing', label: 'Billing', path: '/dashboard/settings/billing' },
  ];

  const adminSubItems = [
    { id: 'overview', label: 'Overview', path: '/admin' },
  ];

  const analyticsSubItems = [
    { id: 'reports', label: 'Reports', path: '/dashboard/analytics/reports' },
    { id: 'advanced', label: 'Advanced Analytics', path: '/dashboard/analytics/advanced' },
    { id: 'export', label: 'Export', path: '/dashboard/analytics/export' },
  ];



  const menuItems = isBlocked
    ? [
        { 
          id: 'settings',  label: 'Settings',  icon: Settings,  path: '/dashboard/settings',
          subItems: [{ id: 'invoicing', label: 'Billing', path: '/dashboard/settings/invoicing' }]
        },
      ]
    : [
        { id: 'dashboard', label: 'Dashboard', icon: BarChart3, path: '/dashboard', end: true },
        
        { 
          id: 'inventory', label: 'Inventory',  icon: Package,  path: 'dashboard/inventory',
          subItems: [
            { id: 'products', label: 'Products', path: '/dashboard/categories'}, 
            { id: 'transactions', label: 'Transactions', path:'/dashboard/transactions'},
            { id: 'categories', label: 'Categories', path:'/dashboard/categoriesManagement' }
          ]
        },

        { id: 'bom', label: 'Bill of Materials', icon: Layers, path: '/dashboard/bom', end: true },

        {
          id: 'orders',
          label: 'Orders',
          icon: ShoppingCart,
          path: '/dashboard/sales-orders',
          subItems: [
            { id: 'sales-orders', label: 'Sales Orders', path: '/dashboard/sales-orders' },
            { id: 'purchase-orders', label: 'Purchase Orders', path: '/dashboard/purchase-orders' },
          ],
        },

        {
          id: 'contacts',
          label: 'Contacts',
          icon: Contact,
          path: '/dashboard/customer-management',
          subItems: [
            { id: 'customers', label: 'Customers', path: '/dashboard/customer-management' },
            { id: 'suppliers', label: 'Suppliers', path: '/dashboard/suppliers' },
          ],
        },


        //{ id: 'analytics', label: 'Analytics', icon: TrendingUp, path: '/dashboard/analytics/reports', subItems: analyticsSubItems },



        { id: 'settings', label: 'Settings', icon: Settings,  path: '/dashboard/settings', subItems: settingsSubItems },

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

  // Mobile Bottom Navbar - render separately for mobile
  if (isMobile) {
    return (
      <>
        {/* Mobile Bottom Navbar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-950/95 border-t border-gray-200 dark:border-gray-800 z-50 md:hidden safe-area-bottom backdrop-blur-sm transition-colors">
          <div className="flex items-center justify-around h-16 px-2">
            {/* Branch Picker - first item on mobile */}
            <BranchPickerDropdown side="top" align="center">
              <button
                type="button"
                className="flex flex-col items-center justify-center flex-1 h-full px-2 transition-colors min-w-0 rounded-2xl text-gray-600 dark:text-gray-300"
                aria-label="Switch branch"
              >
                <GitBranch className="w-5 h-5 mb-0.5 flex-shrink-0" />
                <span className="text-[11px] font-medium truncate w-full text-center leading-tight">
                  Branch
                </span>
              </button>
            </BranchPickerDropdown>
            {/* Notifications - mobile */}
            {onNotificationsOpenChange && (
              <Popover open={notificationsOpen} onOpenChange={(open) => {
                onNotificationsOpenChange(open);
                if (open && unreadCount > 0 && onMarkNotificationsRead) onMarkNotificationsRead();
              }}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="flex flex-col items-center justify-center flex-1 h-full px-2 transition-colors min-w-0 rounded-2xl text-gray-600 dark:text-gray-300"
                    aria-label="Notifications"
                  >
                    <span className="relative inline-block">
                      <Bell className="w-5 h-5 mb-0.5 flex-shrink-0" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-1 w-2 h-2 bg-red-500 rounded-full" aria-hidden />
                      )}
                    </span>
                    <span className="text-[11px] font-medium truncate w-full text-center leading-tight">
                      Alerts
                    </span>
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[calc(100vw-2rem)] max-w-sm max-h-[min(24rem,70vh)] overflow-y-auto p-0 dark:bg-gray-950 dark:border-gray-800"
                  align="center"
                  side="top"
                  sideOffset={8}
                >
                  <div className="p-3 border-b border-gray-200 dark:border-gray-800">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">Notifications</h4>
                  </div>
                  <div className="p-2">
                    {notificationsLoading ? (
                      <div className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">Loading...</div>
                    ) : notifications.length === 0 ? (
                      <div className="py-4 text-center text-sm text-gray-600 dark:text-gray-300">No notifications.</div>
                    ) : (
                      <ul className="divide-y divide-gray-200 dark:divide-gray-800">
                        {notifications.map((n) => (
                          <li key={n.id} className={`py-2 px-2 rounded-lg ${!n.read ? 'bg-blue-50/50 dark:bg-blue-500/10' : ''}`}>
                            <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">{n.title}</div>
                            <div className="text-gray-600 dark:text-gray-300 text-xs mt-0.5">{n.message}</div>
                            <div className="text-gray-400 dark:text-gray-500 text-xs mt-1">{new Date(n.created_at).toLocaleString()}</div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            )}
            {menuItems.map((item) => {
              const Icon = item.icon;
              const hasSubItems = item.subItems && item.subItems.length > 0;
              const isParentActive = location.pathname === item.path && 
                (!hasSubItems || !item.subItems.some(sub => sub.path === item.path));
              const isAnySubItemActive = hasSubItems && item.subItems.some(sub => location.pathname === sub.path);
              const isActive = isParentActive || isAnySubItemActive;
              
              // Check if products button should be animated (when count is 0 and not loading)
              const shouldAnimateProducts = item.id === 'products' && productCount === 0 && !isLoading;

              return (
                <React.Fragment key={item.id}>
                  {hasSubItems ? (
                    <button
                      onClick={() => {
                        setActiveSubmenu(item.id);
                      }}
                      className={`
                        flex flex-col items-center justify-center flex-1 h-full px-2 transition-colors min-w-0 rounded-2xl
                        ${isActive ? 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/10' : 'text-gray-600 dark:text-gray-300'}
                        ${shouldAnimateProducts ? 'animate-pulse-glow-scale ring-2 ring-blue-400/50 dark:ring-blue-500/50' : ''}
                      `}
                    >
                      <Icon className="w-5 h-5 mb-0.5 flex-shrink-0" />
                      <span className="text-[11px] font-medium truncate w-full text-center leading-tight">
                        {item.label.length > 10 ? item.label.substring(0, 8) + '..' : item.label}
                      </span>
                    </button>
                  ) : (
                    <NavLink
                      to={item.path}
                      end={item.end}
                      className={({ isActive: navIsActive }) => `
                        flex flex-col items-center justify-center flex-1 h-full px-2 transition-colors min-w-0 rounded-2xl
                        ${navIsActive || isActive ? 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/10' : 'text-gray-600 dark:text-gray-300'}
                        ${shouldAnimateProducts ? 'animate-pulse-glow-scale ring-2 ring-blue-400/50 dark:ring-blue-500/50' : ''}
                      `}
                    >
                      <Icon className="w-5 h-5 mb-0.5 flex-shrink-0" />
                      <span className="text-[11px] font-medium truncate w-full text-center leading-tight">
                        {item.label.length > 10 ? item.label.substring(0, 8) + '..' : item.label}
                      </span>
                    </NavLink>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Submenu Modal for mobile */}
        {activeSubmenu && (() => {
          const menuItem = menuItems.find(item => item.id === activeSubmenu);
          if (!menuItem || !menuItem.subItems) return null;
          
          return (
            <div className="fixed inset-0 bg-black/60 z-[60] md:hidden" onClick={() => setActiveSubmenu(null)}>
              <div className="fixed bottom-20 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-xl shadow-lg max-h-[60vh] overflow-y-auto transition-colors" onClick={(e) => e.stopPropagation()}>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">{menuItem.label}</h3>
                    <button
                      onClick={() => setActiveSubmenu(null)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {/* Submenu Items */}
                  <div className="space-y-2">
                    {menuItem.subItems.map((subItem) => (
                      <NavLink
                        key={subItem.id}
                        to={subItem.path}
                        onClick={() => {
                          setActiveSubmenu(null);
                        }}
                        className={({ isActive }) => `
                          block w-full px-4 py-3 rounded-lg text-left font-medium text-sm transition-all duration-200
                          ${isActive
                            ? 'bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/30'
                            : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-blue-300'
                          }
                        `}
                      >
                        {subItem.label}
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

      </>
    );
  }

  // Desktop Sidebar
  return (
    <>
      {/* Sidebar - FIXED positioning */}
      <div
        className={`
          fixed left-0 top-0 h-screen
          ${isCollapsed ? 'w-20' : 'w-72'}
          bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800
          transition-[width,background-color,border-color] duration-300
          z-50 flex flex-col
        `}
      >
        {/* Logo / Header Section */}
        <div className="px-2 sm:px-3 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Package className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              {!isCollapsed && (
                <h1 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                  StockFlow
                </h1>
              )}
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              {onNotificationsOpenChange ? (
                <Popover open={notificationsOpen} onOpenChange={(open) => {
                  onNotificationsOpenChange(open);
                  if (open && unreadCount > 0 && onMarkNotificationsRead) onMarkNotificationsRead();
                }}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      aria-label="Notifications"
                      className="relative flex items-center justify-center h-8 w-8 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
                    >
                      <Bell className="w-4 h-4" />
                      {typeof unreadCount === 'number' && unreadCount > 0 && (
                        <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full" aria-hidden />
                      )}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-80 max-h-[min(24rem,80vh)] overflow-y-auto p-0 dark:bg-gray-950 dark:border-gray-800"
                    align="end"
                    side="bottom"
                    sideOffset={8}
                  >
                    <div className="p-3 border-b border-gray-200 dark:border-gray-800">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">Notifications</h4>
                    </div>
                    <div className="p-2">
                      {notificationsLoading ? (
                        <div className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">Loading...</div>
                      ) : notifications.length === 0 ? (
                        <div className="py-4 text-center text-sm text-gray-600 dark:text-gray-300">No notifications.</div>
                      ) : (
                        <ul className="divide-y divide-gray-200 dark:divide-gray-800">
                          {notifications.map((n) => (
                            <li key={n.id} className={`py-2 px-2 rounded-lg ${!n.read ? 'bg-blue-50/50 dark:bg-blue-500/10' : ''}`}>
                              <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">{n.title}</div>
                              <div className="text-gray-600 dark:text-gray-300 text-xs mt-0.5">{n.message}</div>
                              <div className="text-gray-400 dark:text-gray-500 text-xs mt-1">{new Date(n.created_at).toLocaleString()}</div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              ) : null}
              <Button
                size="icon"
                variant="ghost"
                aria-label="Toggle sidebar"
                aria-expanded={!isCollapsed}
                onClick={() => setCollapsed((prev) => !prev)}
                className="h-8 w-8 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {isCollapsed ? (
                  <ChevronRight className="w-4 h-4" />
                ) : (
                  <ChevronLeft className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation - collapsed vs expanded */}
        <nav className="flex-1 px-2 sm:px-3 py-3 sm:py-4 text-xs sm:text-sm overflow-y-auto pb-4">
          {isCollapsed ? (
            // Collapsed: thin icon rail only
            <div className="flex flex-col justify-between items-center h-full">
              <div className="flex flex-col items-center gap-2">
                {/* Main menu icons, excluding settings (moved to bottom utilities) */}
                {menuItems.map((item) => {
                  if (item.id === 'settings') return null;

                  const Icon = item.icon;
                  const hasSubItems = item.subItems && item.subItems.length > 0;
                  const isParentActive =
                    location.pathname === item.path &&
                    (!hasSubItems || !item.subItems.some((sub) => sub.path === item.path));
                  const isAnySubItemActive =
                    hasSubItems && item.subItems.some((sub) => location.pathname === sub.path);
                  const isActive = isParentActive || isAnySubItemActive;

                  return (
                    <NavLink
                      key={item.id}
                      to={hasSubItems ? '#' : item.path}
                      end={item.end}
                      onClick={(e) => {
                        if (hasSubItems) {
                          e.preventDefault();
                          toggleSubmenu(item.id);
                        } else {
                          setOpenSubmenus({});
                          if (isMobile) {
                            onToggle();
                          }
                        }
                      }}
                      className={`
                        flex items-center justify-center w-10 h-10 rounded-xl
                        transition-colors
                        ${
                          isActive
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300'
                            : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-900'
                        }
                      `}
                      title={item.label}
                    >
                      <Icon className="w-5 h-5" />
                    </NavLink>
                  );
                })}
              </div>

              {/* Bottom tools rail: settings/preferences, dark mode, help, profile */}
              <div className="flex flex-col items-center gap-3 pb-2">
                <button
                  type="button"
                  aria-label="Preferences"
                  onClick={() => navigate('/dashboard/settings')}
                  className="flex items-center justify-center w-10 h-10 rounded-xl text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-900"
                >
                  <Settings className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  className="flex items-center justify-center w-10 h-10 rounded-xl text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-900"
                  onClick={toggleTheme}
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setHelpCenterOpen(true)}
                  aria-label="Help Center"
                  className="flex items-center justify-center w-10 h-10 rounded-xl text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-900"
                >
                  <HelpCircle className="w-5 h-5" />
                </button>

                {user && userProfile && (
                  <button
                    type="button"
                    aria-label="Profile"
                    className="rounded-full bg-blue-600 w-9 h-9 flex items-center justify-center flex-shrink-0 text-white text-sm font-semibold hover:ring-2 hover:ring-blue-300 dark:hover:ring-blue-500"
                  >
                    {userProfile?.first_name?.[0] ||
                      userProfile?.email?.[0] ||
                      'U'}
                  </button>
                )}
              </div>
            </div>
          ) : (
            // Expanded: full panel like reference screenshot
            <div className="h-full flex flex-col rounded-2xl bg-white dark:bg-gray-900/60">
              {/* Upper content */}
              <div className="space-y-4">
                {/* Branch Picker */}
                <div className="">
                  <BranchPickerDropdown side="bottom" align="start">
                    <button
                      type="button"
                      className="w-full group flex items-center px-3 py-2 rounded-xl  border border-gray-200 dark:bg-gray-950 text-xs sm:text-sm font-medium text-gray-600 hover:bg-white hover:text-blue-700 dark:text-gray-300 dark:hover:bg-gray-950 dark:hover:text-blue-300 transition-colors"
                    >
                      <GitBranch className="w-4 h-4 mr-2 text-gray-400 group-hover:text-blue-600 dark:text-gray-500 dark:group-hover:text-blue-300" />
                      <span className="flex-1 text-left truncate">
                        {activeBranch?.branch_name ?? 'Switch branch'}
                      </span>
                      <ChevronDown className="w-3 h-3 text-gray-400" />
                    </button>
                  </BranchPickerDropdown>
                </div>

                {/* Menu section */}
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                    Menu
                  </p>
                  <ul className="space-y-1.5">
                    {menuItems.map((item) => {
                      // Move settings into bottom section for expanded state
                      if (item.id === 'settings') return null;
                      const Icon = item.icon;
                      let label = item.label;
                      if (item.id === 'products') {
                        label += ' ';
                        if (isLoading) {
                          label += '(...)';
                        } else {
                          label += `(${productCount})`;
                        }
                      }

                      const hasSubItems = item.subItems && item.subItems.length > 0;
                      const isSubmenuOpen = openSubmenus[item.id];
                      const isParentActive =
                        location.pathname === item.path &&
                        (!hasSubItems || !item.subItems.some((sub) => sub.path === item.path));
                      const isAnySubItemActive =
                        hasSubItems && item.subItems.some((sub) => location.pathname === sub.path);
                      const isExpanded = isSubmenuOpen || isAnySubItemActive;
                      const isActive = isParentActive;

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
                                setOpenSubmenus({});
                                if (isMobile) {
                                  onToggle();
                                }
                              }
                            }}
                            className={`
                              group flex items-center px-3 py-2 rounded-xl text-left text-xs sm:text-sm font-medium
                              transition-all duration-200
                              ${
                                isActive
                                  ? 'bg-blue-100/25 text-blue-700 border border-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/30'
                                  : isExpanded
                                    ? 'text-gray-700 dark:text-gray-200 bg-blue-100/25 dark:bg-gray-950/80 border border-transparent'
                                    : 'text-gray-600 hover:bg-blue-100/25 hover:text-blue-700 dark:text-gray-300 dark:hover:bg-gray-950 dark:hover:text-blue-300 border border-transparent'
                              }
                            `}
                          >
                            <Icon className={`w-4 h-4 mr-2 ${isActive ? 'text-blue-700' : 'text-gray-600 group-hover:text-blue-600 dark:text-gray-500 dark:group-hover:text-blue-300'}`} />





                            <span className="flex-1 truncate">{label}</span>
                            {hasSubItems && (
                              <ChevronDown
                                className={`w-3 h-3 ml-1 transition-transform ${
                                  isSubmenuOpen ? 'rotate-180' : ''
                                } text-gray-400 dark:text-gray-500`}
                              />
                            )}
                          </NavLink>

                          {/* Submenu */}
                          {hasSubItems && isExpanded && (
                            <ul className="ml-4 space-y-1 border-l border-gray-200 dark:border-gray-700 pl-3">
                              {item.subItems.map((subItem) => (
                                <li key={subItem.id}>
                                  <NavLink
                                    to={subItem.path}
                                    onClick={() => {
                                      setOpenSubmenus((prev) => ({
                                        ...prev,
                                        [item.id]: true,
                                      }));
                                      if (isMobile) {
                                        onToggle();
                                      }
                                    }}
                                    className={({ isActive }) => `
                                      relative w-full flex items-center px-3 py-1.5 rounded-lg
                                      text-left font-medium text-[11px] sm:text-xs transition-all duration-200
                                      ${
                                        isActive
                                          ? 'bg-blue-100/25 text-blue-700 border border-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/30'
                                          : 'text-gray-600 hover:bg-blue-100/25 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-950 dark:hover:text-blue-300'
                                      }
                                    `}
                                  >
                                    {({ isActive }) => (
                                      <>
                                        <span className="relative z-10 whitespace-nowrap">
                                          {subItem.label}
                                        </span>
                                      </>
                                    )}
                                  </NavLink>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>



                {/* Bottom utilities: Preferences, Dark mode, Themes, Help */}
                <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-800 space-y-1.5">
                  {(() => {
                    const isSettingsActive = location.pathname.startsWith('/dashboard/settings');
                    const isSettingsOpen = openSubmenus.settings || isSettingsActive;

                    return (
                      <div className="space-y-1">
                        <button
                          type="button"
                          onClick={() => toggleSubmenu('settings')}
                          className={`
                            w-full flex items-center px-3 py-2 rounded-xl text-xs sm:text-sm font-medium
                            transition-colors border
                            ${
                              isSettingsActive
                                ? 'bg-white text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/30'
                                : 'text-gray-600 hover:bg-white hover:text-blue-700 dark:text-gray-300 dark:hover:bg-gray-950 dark:hover:text-blue-300 border-transparent'
                            }
                          `}
                        >
                          <Settings className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="flex-1 truncate text-left">Preferences</span>
                          <ChevronDown
                            className={`w-3 h-3 ml-2 transition-transform text-gray-400 dark:text-gray-500 ${
                              isSettingsOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>

                        {isSettingsOpen && (
                          <ul className="ml-4 space-y-1 border-l border-gray-200 dark:border-gray-700 pl-3">
                            {settingsSubItems.map((subItem) => (
                              <li key={subItem.id}>
                                <NavLink
                                  to={subItem.path}
                                  onClick={() => {
                                    // keep preferences submenu open after click
                                    setOpenSubmenus((prev) => ({ ...prev, settings: true }));
                                  }}
                                  className={({ isActive }) => `
                                    relative w-full flex items-center px-3 py-1.5 rounded-lg
                                    text-left font-medium text-[11px] sm:text-xs transition-all duration-200
                                    ${
                                      isActive
                                        ? 'bg-white text-blue-700 border border-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/30'
                                        : 'text-gray-600 hover:bg-white hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-950 dark:hover:text-blue-300'
                                    }
                                  `}
                                >
                                  {subItem.label}
                                </NavLink>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })()}

                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="w-full flex items-center px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-gray-600 hover:bg-white hover:text-blue-700 dark:text-gray-300 dark:hover:bg-gray-950 dark:hover:text-blue-300 border border-transparent transition-colors"
                  >
                    {theme === 'dark' ? (
                      <Sun className="w-4 h-4 mr-2 text-gray-400" />
                    ) : (
                      <Moon className="w-4 h-4 mr-2 text-gray-400" />
                    )}
                    <span className="flex-1 truncate text-left">Dark mode</span>
                  </button>

         

                  <button
                    type="button"
                    onClick={() => setHelpCenterOpen(true)}
                    className="w-full flex items-center px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-gray-600 hover:bg-white hover:text-blue-700 dark:text-gray-300 dark:hover:bg-gray-950 dark:hover:text-blue-300 border border-transparent transition-colors"
                  >
                    <HelpCircle className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="flex-1 truncate text-left">Help Center</span>
                  </button>
                </div>
              </div>

              {/* Footer with profile */}
              <div className="mt-auto border-t border-gray-200 dark:border-gray-800 px-3 py-3">
                {user && userProfile && (
                  <DropdownMenu open={profileDropdownOpen} onOpenChange={setProfileDropdownOpen}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-start px-3 py-3 h-auto hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div className="rounded-full bg-blue-600 w-10 h-10 flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-sm font-semibold">
                              {userProfile?.first_name?.[0] ||
                                userProfile?.email?.[0] ||
                                'U'}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0 text-left">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                              {userProfile?.first_name && userProfile?.last_name
                                ? `${userProfile.first_name} ${userProfile.last_name}`
                                : userProfile?.email || 'User'}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {userProfile?.email}
                            </div>
                          </div>
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          handleSignOut();
                          setProfileDropdownOpen(false);
                        }}
                        className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                      >
                        <LogOut className="w-4 h-4 mr-2 text-red-600 dark:text-red-400" />
                        <span>Logout</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          )}
        </nav>
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





    </>
  );
};