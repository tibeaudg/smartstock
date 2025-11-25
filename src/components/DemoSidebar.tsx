import React, { useState } from 'react';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import { BarChart3, Package, ShoppingCart, Menu, X, ChevronDown, Moon, Sun, Building2 } from 'lucide-react';
import { useMobile } from '@/hooks/use-mobile';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useDemoBranches } from '@/hooks/useDemoData';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

interface DemoSidebarProps {
  sessionToken: string | null;
  isOpen: boolean;
  onToggle: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3, path: '/demo/dashboard' },
  { id: 'products', label: 'Products', icon: Package, path: '/demo/categories' },
  { id: 'transactions', label: 'History', icon: ShoppingCart, path: '/demo/transactions' },
];

export const DemoSidebar: React.FC<DemoSidebarProps> = ({ sessionToken, isOpen, onToggle }) => {
  const { isMobile } = useMobile();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { data: branches } = useDemoBranches(sessionToken);
  const [selectedBranchId, setSelectedBranchId] = useState<string>('');

  const activeBranch = branches && branches.length > 0 ? branches[0] : null;

  const getPathWithToken = (path: string) => {
    return sessionToken ? `${path}?token=${sessionToken}` : path;
  };

  if (isMobile) {
    // Mobile bottom navbar
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden safe-area-bottom">
        <div className="flex items-center justify-around h-16 px-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
              (item.path === '/demo/dashboard' && location.pathname === '/demo');
            
            return (
              <NavLink
                key={item.id}
                to={getPathWithToken(item.path)}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                    isActive ? 'text-blue-600' : 'text-gray-600'
                  }`
                }
              >
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    );
  }

  // Desktop sidebar
  return (
    <>
      <div
        className={cn(
          'fixed left-0 top-0 h-screen bg-white dark:bg-gray-950 transition-all border border-gray-200 dark:border-gray-800 duration-300 z-50 flex flex-col',
          isOpen ? 'w-64' : 'w-16',
          'md:relative md:translate-x-0'
        )}
      >


        {/* Branch Selector - Always show when sidebar is open */}
        {isOpen && (
          <div className="px-2 sm:px-3 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-xs text-gray-500 uppercase tracking-wide font-medium">
                <Building2 className="h-3 w-3" />
                <span>Active Branch</span>
              </div>
              {activeBranch ? (
                <div className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <Building2 className="h-4 w-4 text-gray-400" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {activeBranch.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Main</div>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Demo Branch</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-2 sm:px-3 py-3 sm:py-4 text-xs sm:text-sm overflow-y-auto pb-4">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || 
                (item.path === '/demo/dashboard' && location.pathname === '/demo');

              return (
                <li key={item.id} className="space-y-1">
                  <NavLink
                    to={getPathWithToken(item.path)}
                    className={cn(
                      'relative group w-full font-semibold flex items-center px-2 sm:px-3 py-2 rounded-xl text-left transition-all duration-200',
                      isActive
                        ? 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/30'
                        : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700 dark:text-gray-300 dark:hover:bg-gray-900 dark:hover:text-blue-300',
                      !isOpen && 'justify-center'
                    )}
                  >
                    <div className="flex items-center w-full">
                      <Icon
                        className={cn(
                          'w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 transition-colors',
                          isActive ? 'text-blue-600 dark:text-blue-300' : 'text-gray-500 group-hover:text-blue-700 dark:text-gray-400 dark:group-hover:text-blue-300'
                        )}
                      />
                      {isOpen && (
                        <span className={cn(
                          'text-xs sm:text-sm transition-colors ml-2 sm:ml-3',
                          isActive ? 'text-blue-700 dark:text-blue-300' : 'group-hover:text-blue-700 dark:group-hover:text-blue-300'
                        )}>
                          {item.label}
                        </span>
                      )}
                    </div>
                  </NavLink>
                </li>
              );
            })}
          </ul>

          {/* Appearance Section */}
          {isOpen && (
            <div className="mt-6 hidden md:block">
              <div className="px-3 py-3 rounded-lg bg-gray-100 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 transition-colors">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {theme === 'dark' ? (
                      <Moon className="w-4 h-4 text-gray-600 dark:text-gray-200" />
                    ) : (
                      <Sun className="w-4 h-4 text-gray-600 dark:text-gray-200" />
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-800 dark:text-gray-100">Appearance</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {theme === 'dark' ? 'Dark mode enabled' : 'Light mode enabled'}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="inline-flex items-center gap-1 rounded-md border border-transparent bg-white dark:bg-gray-900 px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    {theme === 'dark' ? 'Light' : 'Dark'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </nav>

        {/* Fixed Bottom Section - Create Account Button */}
        <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-800">
          <div className="p-3 sm:px-3 sm:py-2">
            <Button
              asChild
              className={cn(
                'w-full bg-blue-600 hover:bg-blue-700 text-white',
                !isOpen && 'p-0 w-10 h-10'
              )}
              size="sm"
            >
              {isOpen ? (
                <a href="/auth?mode=register">Create Account</a>
              ) : (
                <a href="/auth?mode=register" className="flex items-center justify-center">
                  <span className="text-lg">+</span>
                </a>
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
