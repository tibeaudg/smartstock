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
  Workflow,
  User,
  SlidersHorizontal,
  UserCog,
  Building2,
  CreditCard,
  ClipboardList,
  ShoppingBag,
  Hash,
  ArrowLeftRight,
  Tag,
  MapPin,
  MessageSquare,
  Mail,
}
from 'lucide-react';
import { SupportModal } from './SupportModal';
import { ChatModal } from './ChatModal';
import { BranchPickerDropdown } from './BranchPickerDropdown';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth, UserProfile } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
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
  onSecondarySidebarOpenChange?: (open: boolean) => void;
}

interface SubItem {
  id: string;
  label: string;
  path: string;
  icon?: React.ComponentType<{ className?: string }>;
  divider?: boolean;
  requiredFeature?: string;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType;
  path: string;
  end?: boolean;
  navigateOnClick?: boolean;
  subItems?: SubItem[];
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
  onSecondarySidebarOpenChange,
}: SidebarProps) => {
  const { productCount, isLoading } = useProductCount();
  const { isMobile } = useMobile();
  const { user } = useAuth();
  const { canUseFeature } = useSubscription();
  const { organisationName } = useBranchSettings();
  const navigate = useNavigate();
  const location = useLocation();
  const [supportOpen, setSupportOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const { unreadCount: unreadMessages, resetUnreadCount } = useUnreadMessages();
  const [activeSecondarySidebar, setActiveSecondarySidebar] = useState<string | null>(null);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const { theme, toggleTheme } = useTheme();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { signOut } = useAuth();
  const [uncontrolledCollapsed, setUncontrolledCollapsed] = useState(false);
  const [helpCenterOpen, setHelpCenterOpen] = useState(false);
  const { activeBranch } = useBranches();

  const isCollapsed =
    typeof controlledCollapsed === 'boolean' ? controlledCollapsed : uncontrolledCollapsed;

  const effectiveCollapsed = isMobile ? false : isCollapsed;

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

  const settingsSubItems: SubItem[] = [
    { id: 'general', label: 'General', path: '/dashboard/settings/general', icon: SlidersHorizontal },
    { id: 'profile', label: 'Profile', path: '/dashboard/settings/profile', icon: User },
    { id: 'users', label: 'Users', path: '/dashboard/settings/users', icon: UserCog, divider: true },
    { id: 'branches', label: 'Branches', path: '/dashboard/settings/branches', icon: Building2 },
    { id: 'billing', label: 'Billing', path: '/dashboard/settings/billing', icon: CreditCard },
  ];

  const adminSubItems: SubItem[] = [
    { id: 'users', label: 'User Management', path: '/admin?tab=users', icon: Users },
    { id: 'notifications', label: 'Notifications', path: '/admin?tab=notifications', icon: Bell },
    { id: 'emails', label: 'Email Management', path: '/admin?tab=emails', icon: Mail },
    // sentinel entry so bare /admin also opens the sidebar
    { id: '_admin_root', label: '', path: '/admin' },
  ];

  const analyticsSubItems = [
    { id: 'reports', label: 'Reports', path: '/dashboard/analytics/reports' },
    { id: 'advanced', label: 'Advanced Analytics', path: '/dashboard/analytics/advanced' },
    { id: 'export', label: 'Export', path: '/dashboard/analytics/export' },
  ];

  const menuItems = isBlocked
    ? [
        {
          id: 'settings', label: 'Settings', icon: Settings, path: '/dashboard/settings',
          subItems: [{ id: 'invoicing', label: 'Billing', path: '/dashboard/settings/invoicing', icon: CreditCard }]
        },
      ]
    : [
        { id: 'dashboard', label: 'Dashboard', icon: BarChart3, path: '/dashboard', end: true },

        {
          id: 'inventory', label: 'Inventory', icon: Package, path: 'dashboard/inventory',
          subItems: [
            { id: 'products', label: 'Products', path: '/dashboard/categories', icon: Package },
            { id: 'transactions', label: 'Transactions', path: '/dashboard/transactions', icon: ArrowLeftRight },
            { id: 'categories', label: 'Categories', path: '/dashboard/categoriesManagement', icon: Tag },
            { id: 'locations', label: 'Locations', path: '/dashboard/locations', icon: MapPin },
          ]
        },

        { id: 'bom', label: 'Bill of Materials', icon: Layers, path: '/dashboard/bom', end: true },

        {
          id: 'workflows',
          label: 'Workflows',
          icon: Workflow,
          path: '/dashboard/workflows',
          navigateOnClick: true,
          subItems: [
            { id: 'pick-lists', label: 'Pick Lists', path: '/dashboard/pick-lists', icon: ClipboardList, requiredFeature: 'orders' },
            { id: 'sales-orders', label: 'Sales Orders', path: '/dashboard/sales-orders', icon: ShoppingCart, requiredFeature: 'orders' },
            { id: 'purchase-orders', label: 'Purchase Orders', path: '/dashboard/purchase-orders', icon: ShoppingBag, requiredFeature: 'orders' },
            { id: 'stock-counts', label: 'Stock Counts', path: '/dashboard/stock-counts', icon: Hash, requiredFeature: 'orders' },
            { id: 'customers', label: 'Customers', path: '/dashboard/customer-management', icon: Contact, divider: true, requiredFeature: 'contacts' },
            { id: 'suppliers', label: 'Suppliers', path: '/dashboard/suppliers', icon: Truck, requiredFeature: 'contacts' },
          ],
        },

        { id: 'settings', label: 'Settings', icon: Settings, path: '/dashboard/settings', subItems: settingsSubItems },

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

  // Auto-open secondary sidebar based on current route
  useEffect(() => {
    for (const item of menuItems) {
      if (item.subItems?.some(sub => {
        if (sub.path.includes('?')) {
          const [subPath, subSearch] = sub.path.split('?');
          return location.pathname === subPath && location.search === `?${subSearch}`;
        }
        return location.pathname === sub.path || location.pathname.startsWith(sub.path + '/');
      })) {
        setActiveSecondarySidebar(item.id);
        setActiveSubmenu(item.id);
        return;
      }
    }
    setActiveSecondarySidebar(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.search]);

  // Notify parent when secondary sidebar opens/closes
  useEffect(() => {
    onSecondarySidebarOpenChange?.(activeSecondarySidebar !== null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSecondarySidebar]);

  const toggleSecondarySidebar = (menuId: string) => {
    setActiveSecondarySidebar(prev => prev === menuId ? null : menuId);
  };

  // Mobile & Desktop Sidebar
  return (
    <>
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}
      {/* Main Sidebar - FIXED positioning */}
      <div
        className={`
          fixed left-0 top-0 h-screen
          ${isMobile ? 'w-72' : (effectiveCollapsed ? 'w-20' : 'w-60')}
          bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800
          transition-[width,background-color,border-color,transform] duration-300
          z-50 flex flex-col rounded-r-xl
          ${isMobile ? (isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full') : 'translate-x-0'}
        `}
      >
        {/* Logo / Header Section */}
        <div className="sm:px-3 py-3 flex-shrink-0">
          {effectiveCollapsed ? (
            <div className="flex items-center justify-center">
              <Button
                size="icon"
                variant="ghost"
                aria-label="Toggle sidebar"
                aria-expanded={false}
                onClick={() => setCollapsed((prev) => !prev)}
                className="h-8 w-8 rounded-full hover:bg-gray-100"
              >
                <ChevronRight className="w-4 h-4 text-white hover:text-blue-600" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Package className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <h1 className="text-lg sm:text-xl font-semibold text-white truncate">
                  StockFlow
                </h1>
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
                        className="relative flex items-center justify-center h-8 w-8 rounded-full text-white hover:bg-white text-blue-600 transition-colors"
                      >
                        <Bell className="w-4 h-4 hover:text-blue-600" />
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
                        <h4 className="font-semibold text-white-900 dark:text-white-100">Notifications</h4>
                      </div>
                      <div className="p-2">
                        {notificationsLoading ? (
                          <div className="py-4 text-center text-sm text-white-500 dark:text-white-400">Loading...</div>
                        ) : notifications.length === 0 ? (
                          <div className="py-4 text-center text-sm text-white-600 dark:text-white-300">No notifications.</div>
                        ) : (
                          <ul className="divide-y divide-gray-200 dark:divide-gray-800">
                            {notifications.map((n) => (
                              <li key={n.id} className={`py-2 px-2 rounded-lg ${!n.read ? 'bg-blue-50/50 dark:bg-blue-500/10' : ''}`}>
                                <div className="font-medium text-white-900 dark:text-white-100 text-sm">{n.title}</div>
                                <div className="text-white-600 dark:text-white-300 text-xs mt-0.5">{n.message}</div>
                                <div className="text-white-400 dark:text-white-500 text-xs mt-1">{new Date(n.created_at).toLocaleString()}</div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                ) : null}
                {isMobile ? (
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label="Close sidebar"
                    onClick={onToggle}
                    className="h-8 w-8 rounded-full hover:bg-gray-100"
                  >
                    <X className="w-4 h-4 text-white" />
                  </Button>
                ) : (
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label="Toggle sidebar"
                    aria-expanded={true}
                    onClick={() => setCollapsed((prev) => !prev)}
                    className="h-8 w-8 rounded-full hover:bg-gray-100"
                  >
                    <ChevronLeft className="w-4 h-4 text-white hover:text-blue-600" />
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Navigation - collapsed vs expanded */}
        <nav className="flex-1 px-2 sm:px-3 py-3 sm:py-4 text-xs sm:text-sm overflow-y-auto pb-4">
          {effectiveCollapsed ? (
            // Collapsed: thin icon rail only
            <div className="flex flex-col justify-between items-center h-full">
              <div className="flex flex-col items-center gap-2">
                {menuItems.map((item) => {
                  if (item.id === 'settings' || item.id === 'admin') return null;

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
                      to={hasSubItems && !item.navigateOnClick ? '#' : item.path}
                      end={item.end}
                      onClick={(e) => {
                        if (hasSubItems && !item.navigateOnClick) {
                          e.preventDefault();
                          const isOpening = activeSecondarySidebar !== item.id;
                          toggleSecondarySidebar(item.id);
                          if (isOpening && item.subItems?.[0]) {
                            navigate(item.subItems[0].path);
                          }
                        } else {
                          setActiveSecondarySidebar(null);
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
                            ? 'bg-blue-50/50 text-white'
                            : 'text-white hover:bg-gray-100 dark:text-white dark:hover:bg-gray-900'
                        }
                      `}
                      title={item.label}
                    >
                      <Icon className="w-5 h-5" />
                    </NavLink>
                  );
                })}
              </div>

              {/* Bottom tools rail */}
              <div className="flex flex-col items-center gap-3 pb-2">
                <button
                  type="button"
                  aria-label="Settings"
                  onClick={() => {
                    const isOpening = activeSecondarySidebar !== 'settings';
                    toggleSecondarySidebar('settings');
                    if (isOpening && settingsSubItems[0]) navigate(settingsSubItems[0].path);
                  }}
                  className="flex items-center justify-center w-10 h-10 rounded-xl text-white hover:bg-gray-100 dark:text-white-400 dark:hover:bg-gray-900"
                >
                  <Settings className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={() => setHelpCenterOpen(true)}
                  aria-label="Help Center"
                  className="flex items-center justify-center w-10 h-10 rounded-xl text-white-500 hover:bg-gray-100"
                >
                  <HelpCircle className="w-5 h-5 text-white hover:text-blue-600" />
                </button>

                {isOwner && (
                  <button
                    type="button"
                    aria-label="Admin"
                    onClick={() => {
                      const isOpening = activeSecondarySidebar !== 'admin';
                      toggleSecondarySidebar('admin');
                      if (isOpening && adminSubItems[0]) navigate(adminSubItems[0].path);
                    }}
                    className="flex items-center justify-center w-10 h-10 rounded-xl text-white hover:bg-gray-100 dark:text-white-400 dark:hover:bg-gray-900"
                  >
                    <Users className="w-5 h-5" />
                  </button>
                )}

                {user && userProfile && (
                  <button
                    type="button"
                    aria-label="Profile"
                    className="rounded-full bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 w-9 h-9 flex items-center justify-center flex-shrink-0 text-white text-sm font-semibold hover:ring-2 hover:ring-blue-300 dark:hover:ring-blue-500"
                  >
                    {userProfile?.first_name?.[0] ||
                      userProfile?.email?.[0] ||
                      'U'}
                  </button>
                )}
              </div>
            </div>
          ) : (
            // Expanded: full panel
            <div className="min-h-full flex flex-col rounded-2xl bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 text-white dark:bg-gray-900/60">
              <div className="space-y-4">
                {/* Branch Picker */}
                <div>
                  <BranchPickerDropdown side="bottom" align="start">
                    <button
                      type="button"
                      className="w-full group flex items-center px-3 py-2 rounded-xl border border-gray-200 dark:bg-gray-950 text-xs sm:text-sm font-medium text-blue-600 hover:bg-white hover:text-blue-700 dark:text-white-300 dark:hover:bg-gray-950 dark:hover:text-blue-300 transition-colors bg-white"
                    >
                      <GitBranch className="w-4 h-4 mr-2 text-white-400 group-hover:text-blue-600 dark:text-white-500 dark:group-hover:text-blue-300" />
                      <span className="flex-1 text-left truncate">
                        {activeBranch?.branch_name ?? 'Switch branch'}
                      </span>
                      <ChevronDown className="w-3 h-3 text-white-400" />
                    </button>
                  </BranchPickerDropdown>
                </div>

                {/* Menu section */}
                <div className="space-y-2">
                
                  <ul className="space-y-1.5">
                    {menuItems.map((item) => {
                      if (item.id === 'settings' || item.id === 'admin') return null;
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
                      const isAnySubItemActive =
                        hasSubItems && item.subItems.some((sub) =>
                          location.pathname === sub.path || location.pathname.startsWith(sub.path + '/')
                        );
                      const isParentActive =
                        location.pathname === item.path &&
                        (!hasSubItems || !item.subItems.some((sub) => sub.path === item.path));
                      const isActive = isParentActive || isAnySubItemActive;
                      const isSecondaryOpen = activeSecondarySidebar === item.id;
                      // Only highlight if this item's secondary panel is open,
                      // or if no secondary panel is open and this item's route is active.
                      const showActive = isSecondaryOpen || (activeSecondarySidebar === null && isActive);

                      return (
                        <li key={item.id}>
                          <NavLink
                            to={hasSubItems && !item.navigateOnClick ? '#' : item.path}
                            end={item.end}
                            onClick={(e) => {
                              if (hasSubItems && !item.navigateOnClick) {
                                e.preventDefault();
                                if (isMobile) {
                                  const isOpening = activeSubmenu !== item.id;
                                  setActiveSubmenu(prev => prev === item.id ? null : item.id);
                                  if (isOpening && item.subItems?.[0]) {
                                    navigate(item.subItems[0].path);
                                  }
                                } else {
                                  const isOpening = activeSecondarySidebar !== item.id;
                                  toggleSecondarySidebar(item.id);
                                  if (isOpening && item.subItems?.[0]) {
                                    navigate(item.subItems[0].path);
                                  }
                                }
                              } else {
                                setActiveSecondarySidebar(null);
                                if (isMobile) {
                                  onToggle();
                                }
                              }
                            }}
                            className={`
                              group flex items-center px-3 py-2 rounded-xl text-left text-xs sm:text-sm font-medium
                              transition-all duration-200
                              ${
                                showActive
                                  ? 'bg-blue-100/25 text-white dark:bg-blue-500/20 dark:text-blue-300'
                                  : 'text-white hover:bg-blue-100/25 hover:text-white dark:text-white-300 dark:hover:bg-gray-950 dark:hover:text-blue-300'
                              }
                            `}
                          >
                            <Icon className={`w-4 h-4 mr-2 ${showActive ? 'text-white' : 'text-white group-hover:text-white dark:text-white-500 dark:group-hover:text-blue-300'}`} />
                            <span className="flex-1 truncate">{label}</span>
                            {isMobile && hasSubItems && (
                              <ChevronDown className={`w-3.5 h-3.5 ml-1 flex-shrink-0 transition-transform duration-200 ${activeSubmenu === item.id ? 'rotate-180' : ''}`} />
                            )}
                          </NavLink>
                          {isMobile && activeSubmenu === item.id && item.subItems && (
                            <ul className="ml-3 mt-0.5 space-y-0.5 border-l border-white/20 pl-3">
                              {item.subItems.map(sub => {
                                const MobileSubIcon = sub.icon;
                                const subIsLocked = sub.requiredFeature ? !canUseFeature(sub.requiredFeature) : false;
                                const subNavTarget = subIsLocked ? '/dashboard/workflows' : sub.path;
                                return (
                                  <li key={sub.id}>
                                    <NavLink
                                      to={subNavTarget}
                                      onClick={() => { setActiveSubmenu(null); onToggle(); }}
                                      className={({ isActive }) => `
                                        flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors
                                        ${isActive && !subIsLocked
                                          ? 'bg-white/20 text-white dark:bg-blue-500/20 dark:text-blue-300'
                                          : 'text-white/75 hover:bg-white/10 hover:text-white dark:text-white/60 dark:hover:bg-gray-950 dark:hover:text-blue-300'
                                        }
                                      `}
                                    >
                                      {MobileSubIcon && <MobileSubIcon className="w-3.5 h-3.5 flex-shrink-0 opacity-70" />}
                                      {sub.label}
                                    </NavLink>
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Bottom utilities: Preferences, Help */}
                <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-800 space-y-1.5">
                  {(() => {
                    const isSettingsActive = location.pathname.startsWith('/dashboard/settings');
                    const isSettingsOpen = activeSecondarySidebar === 'settings';

                    return (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            if (isMobile) {
                              const isOpening = activeSubmenu !== 'settings';
                              setActiveSubmenu(prev => prev === 'settings' ? null : 'settings');
                              if (isOpening && settingsSubItems[0]) navigate(settingsSubItems[0].path);
                            } else {
                              const isOpening = activeSecondarySidebar !== 'settings';
                              toggleSecondarySidebar('settings');
                              if (isOpening && settingsSubItems[0]) navigate(settingsSubItems[0].path);
                            }
                          }}
                          className={`
                            w-full flex items-center px-3 py-2 rounded-xl text-xs sm:text-sm font-medium
                            transition-colors border
                            ${
                              isSettingsActive || isSettingsOpen
                                ? 'bg-white text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/30'
                                : 'text-white-600 hover:bg-white hover:text-blue-700 dark:text-white-300 dark:hover:bg-gray-950 dark:hover:text-blue-300 border-transparent'
                            }
                          `}
                        >
                          <Settings className="w-4 h-4 mr-2 text-white-400" />
                          <span className="flex-1 truncate text-left">Settings</span>
                          {isMobile && (
                            <ChevronDown className={`w-3.5 h-3.5 ml-1 flex-shrink-0 transition-transform duration-200 ${activeSubmenu === 'settings' ? 'rotate-180' : ''}`} />
                          )}
                        </button>
                        {isMobile && activeSubmenu === 'settings' && (() => {
                          const settingsItem = menuItems.find(item => item.id === 'settings');
                          if (!settingsItem?.subItems) return null;
                          return (
                            <ul className="ml-3 mt-0.5 space-y-0.5 border-l border-white/20 pl-3">
                              {settingsItem.subItems.map(sub => {
                                const MobSettingsIcon = sub.icon;
                                return (
                                  <li key={sub.id}>
                                    <NavLink
                                      to={sub.path}
                                      onClick={() => { setActiveSubmenu(null); onToggle(); }}
                                      className={({ isActive }) => `
                                        flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors
                                        ${isActive ? 'bg-white/20 text-white dark:bg-blue-500/20 dark:text-blue-300' : 'text-white/75 hover:bg-white/10 hover:text-white dark:text-white/60 dark:hover:bg-gray-950 dark:hover:text-blue-300'}
                                      `}
                                    >
                                      {MobSettingsIcon && <MobSettingsIcon className="w-3.5 h-3.5 flex-shrink-0 opacity-70" />}
                                      {sub.label}
                                    </NavLink>
                                  </li>
                                );
                              })}
                            </ul>
                          );
                        })()}
                      </>
                    );
                  })()}

                  <button
                    type="button"
                    onClick={() => setHelpCenterOpen(true)}
                    className="w-full flex items-center px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-white-600 hover:bg-white hover:text-blue-700 dark:text-white-300 dark:hover:bg-gray-950 dark:hover:text-blue-300 border border-transparent transition-colors"
                  >
                    <HelpCircle className="w-4 h-4 mr-2 text-white-400" />
                    <span className="flex-1 truncate text-left">Help Center</span>
                  </button>

                  {isOwner && (() => {
                    const adminItem = menuItems.find(item => item.id === 'admin');
                    if (!adminItem) return null;
                    const isAdminActive = location.pathname.startsWith('/admin');
                    const isAdminOpen = activeSecondarySidebar === 'admin';
                    return (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            if (isMobile) {
                              const isOpening = activeSubmenu !== 'admin';
                              setActiveSubmenu(prev => prev === 'admin' ? null : 'admin');
                              if (isOpening && adminSubItems[0]) navigate(adminSubItems[0].path);
                            } else {
                              const isOpening = activeSecondarySidebar !== 'admin';
                              toggleSecondarySidebar('admin');
                              if (isOpening && adminSubItems[0]) navigate(adminSubItems[0].path);
                            }
                          }}
                          className={`
                            w-full flex items-center px-3 py-2 rounded-xl text-xs sm:text-sm font-medium
                            transition-colors border
                            ${
                              isAdminActive || isAdminOpen
                                ? 'bg-white text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/30'
                                : 'text-white-600 hover:bg-white hover:text-blue-700 dark:text-white-300 dark:hover:bg-gray-950 dark:hover:text-blue-300 border-transparent'
                            }
                          `}
                        >
                          <Users className="w-4 h-4 mr-2 text-white-400" />
                          <span className="flex-1 truncate text-left">Admin</span>
                        </button>
                        {isMobile && activeSubmenu === 'admin' && adminItem?.subItems && (
                          <ul className="ml-3 mt-0.5 space-y-0.5 border-l border-white/20 pl-3">
                            {adminItem.subItems.filter(sub => !sub.id.startsWith('_')).map(sub => {
                              const MobAdminIcon = sub.icon;
                              return (
                                <li key={sub.id}>
                                  <NavLink
                                    to={sub.path}
                                    onClick={() => { setActiveSubmenu(null); onToggle(); }}
                                    className={({ isActive }) => `
                                      flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors
                                      ${isActive ? 'bg-white/20 text-white dark:bg-blue-500/20 dark:text-blue-300' : 'text-white/75 hover:bg-white/10 hover:text-white dark:text-white/60 dark:hover:bg-gray-950 dark:hover:text-blue-300'}
                                    `}
                                  >
                                    {MobAdminIcon && <MobAdminIcon className="w-3.5 h-3.5 flex-shrink-0 opacity-70" />}
                                    {sub.label}
                                  </NavLink>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </>
                    );
                  })()}
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
                          <div className="rounded-full bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 w-10 h-10 flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-sm font-semibold">
                              {userProfile?.first_name?.[0] ||
                                userProfile?.email?.[0] ||
                                'U'}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0 text-left">
                            <div className="text-sm font-medium text-white-900 dark:text-white-100 truncate">
                              {userProfile?.first_name && userProfile?.last_name
                                ? `${userProfile.first_name} ${userProfile.last_name}`
                                : userProfile?.email || 'User'}
                            </div>
                            <div className="text-xs text-white-500 dark:text-white-400 truncate">
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

      {/* Secondary Sidebar - desktop only, slides in to the right of the main sidebar */}
      {!isMobile && activeSecondarySidebar && (() => {
        const activeItem = menuItems.find(item => item.id === activeSecondarySidebar);
        if (!activeItem?.subItems) return null;
        const title = activeItem.id === 'settings' ? 'Settings' : activeItem.label;

        return (
          <div
            className="fixed top-0 h-screen w-56 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 z-40 flex flex-col shadow-md transition-[left] duration-300"
            style={{ left: isCollapsed ? '5rem' : '15rem' }}
          >
            {/* Header */}
            <div className="px-5 pt-7 pb-5 flex-shrink-0">
              <h3 className="text-[20px] font-semibold text-gray-800 tracking-tight border-b border-gray-200/50 pb-4">{title}</h3>
            </div>

            {/* Nav items */}
            <nav className="flex-1 px-3 pb-4 overflow-y-auto">
              <ul className="space-y-0.5">
                {activeItem.subItems.filter(sub => !sub.id.startsWith('_')).map((subItem) => {
                  const isLocked = subItem.requiredFeature ? !canUseFeature(subItem.requiredFeature) : false;
                  const navTarget = isLocked ? '/dashboard/workflows' : subItem.path;
                  const isItemActive = !isLocked && (subItem.path.includes('?')
                    ? (() => {
                        const [subPath, subSearch] = subItem.path.split('?');
                        return location.pathname === subPath && location.search === `?${subSearch}`;
                      })()
                    : location.pathname === subItem.path || location.pathname.startsWith(subItem.path + '/'));
                  const SubIcon = subItem.icon;
                  return (
                    <React.Fragment key={subItem.id}>
                      {subItem.divider && (
                        <li aria-hidden="true" className="my-2 px-1">
                          <div className="h-px bg-gray-100 dark:bg-gray-800" />
                        </li>
                      )}
                      <li>
                        <NavLink
                          to={navTarget}
                          className={`
                            flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                            ${isItemActive
                              ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200'
                            }
                          `}
                        >
                          {SubIcon && (
                            <SubIcon className={`w-4 h-4 flex-shrink-0 ${isItemActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`} />
                          )}
                          <span className="truncate">{subItem.label}</span>
                        </NavLink>
                      </li>
                    </React.Fragment>
                  );
                })}
              </ul>
            </nav>
          </div>
        );
      })()}

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
