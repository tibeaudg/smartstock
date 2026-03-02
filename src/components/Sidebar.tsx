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
  Warehouse,
  Truck,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Bell,
} 
from 'lucide-react';
import { SupportModal } from './SupportModal';
import { ChatModal } from './ChatModal';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth, UserProfile } from '@/hooks/useAuth';
import { useNavigate, NavLink, useLocation } from 'react-router-dom';
import { useMobile } from '@/hooks/use-mobile';
import { useUnreadMessages } from '@/hooks/UnreadMessagesContext';
import { useProductCount } from '@/hooks/useDashboardData';
import { useSubscription } from '@/hooks/useSubscription';
import { useTheme } from '@/hooks/useTheme';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  userRole: 'admin' | 'staff';
  userProfile?: UserProfile;
  isOpen: boolean;
  onToggle: () => void;
  unreadCount?: number;
  onNotificationClick?: () => void;
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
  onNotificationClick,
  isCollapsed: controlledCollapsed,
  onCollapseChange,
}: SidebarProps) => {
  const { productCount, isLoading } = useProductCount();
  const { isMobile } = useMobile();
  const { user } = useAuth();
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

        { id: 'sales-orders', label: 'Sales Orders', icon: FileText, path: '/dashboard/sales-orders',end: true },

        { id: 'customer-management', label: 'Customers', icon: Truck, path: '/dashboard/customer-management',end: true },


        { id: 'analytics', label: 'Analytics', icon: TrendingUp, path: '/dashboard/analytics/reports', subItems: analyticsSubItems },



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
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Package className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              {!isCollapsed && (
                <h1 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
                  stockflow
                </h1>
              )}
            </div>
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

        {/* Navigation - collapsed vs expanded */}
        <nav className="flex-1 px-2 sm:px-3 py-3 sm:py-4 text-xs sm:text-sm overflow-y-auto pb-4">
          {isCollapsed ? (
            // Collapsed: thin icon rail only
            <div className="flex flex-col justify-between items-center h-full">
              <div className="flex flex-col items-center gap-2">
                {/* Notifications icon to mirror uncollapsed state */}
                {onNotificationClick && (
                  <button
                    type="button"
                    onClick={onNotificationClick}
                    aria-label="Notifications"
                    className="flex items-center justify-center w-10 h-10 rounded-xl text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-900"
                  >
                    <Bell className="w-5 h-5" />
                  </button>
                )}

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
                {/* Quick search / Notifications */}
                <div className="border-b border-gray-200 dark:border-gray-800 pb-3">
                  <div className="hidden flex items-center justify-between px-3 py-2 rounded-xl bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      Quick search
                    </span>
                  </div>

                  <button
                    type="button"
                    className="w-full group flex items-center px-3 py-2 rounded-xl bg-white dark:bg-gray-950 text-xs sm:text-sm font-medium text-gray-600 hover:bg-white hover:text-blue-700 dark:text-gray-300 dark:hover:bg-gray-950 dark:hover:text-blue-300 transition-colors"
                    onClick={onNotificationClick}
                  >
                    <Bell className="w-4 h-4 mr-2 text-gray-400 group-hover:text-blue-600 dark:text-gray-500 dark:group-hover:text-blue-300" />
                    <span className="flex-1 text-left">
                      Notifications
                    </span>
                    {typeof unreadCount === 'number' && unreadCount > 0 && (
                      <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 ml-2">
                        {unreadCount}+
                      </span>
                    )}
                  </button>

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
                                  ? 'bg-white text-blue-700 border border-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/30'
                                  : isExpanded
                                    ? 'text-gray-700 dark:text-gray-200 bg-white/80 dark:bg-gray-950/80 border border-transparent'
                                    : 'text-gray-600 hover:bg-white hover:text-blue-700 dark:text-gray-300 dark:hover:bg-gray-950 dark:hover:text-blue-300 border border-transparent'
                              }
                            `}
                          >
                            <Icon className="w-4 h-4 mr-2 text-gray-400 group-hover:text-blue-600 dark:text-gray-500 dark:group-hover:text-blue-300" />
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
                                          ? 'bg-white text-blue-700 border border-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/30'
                                          : 'text-gray-600 hover:bg-white hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-950 dark:hover:text-blue-300'
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

                {/* Upgrade card */}
                <div className="mt-4 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/60 dark:to-blue-900/40 px-4 py-3 border border-blue-100 dark:border-blue-900/60">
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-100">
                    Current plan: <span className="font-semibold"> Free</span>
                  </p>
                  <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-300">
                    Upgrade to Pro to get the latest and exclusive features.
                  </p>
                  <Button className="mt-3 w-full h-8 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700" size="sm">
                    Coming Soon
                  </Button>
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