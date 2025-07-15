import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Settings, 
  Menu,
  X,
  LogOut,
  HelpCircle,
  CircleUserRound 
} 
from 'lucide-react';


import { Button } from '@/components/ui/button';
import { useAuth, UserProfile } from '@/hooks/useAuth';
import { useNavigate, NavLink } from 'react-router-dom';
import { BranchSelector } from './BranchSelector';
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
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { productCount, isLoading } = useProductCount();

  // If blocked, only show settings/invoicing
  const isBlocked = userProfile?.blocked;
  const isOwner = userProfile && userProfile.role === 'admin' && !userProfile.blocked;
  const menuItems = isBlocked
    ? [
        { id: 'settings', label: 'Instellingen', icon: Settings, path: '/dashboard/settings' },
      ]
    : [
        { id: 'dashboard', label: 'Dashboard', icon: BarChart3, path: '/dashboard', end: true },
        { id: 'stock', label: 'Producten', icon: Package, path: '/dashboard/stock' },
        { id: 'transactions', label: 'Stockmutaties', icon: ShoppingCart, path: '/dashboard/transactions' },
        ...(isOwner
          ? [
              { id: 'admin', label: 'Admin', icon: Settings, path: '/admin' },
            ]
          : []),
        { id: 'settings', label: 'Instellingen', icon: Settings, path: '/dashboard/settings' },
      ];

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

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
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
          {isOpen && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-semibold text-gray-900">stockflow</h1>
            </div>
          )}

        </div>

        {/* Branch Selector */}
        {isOpen && (
          <div className="p-4 border-b border-gray-200 flex-shrink-0">
            <BranchSelector />
            <p className="text-xs text-gray-700 pt-3 text-center font-medium">
              {userProfile?.first_name || userProfile?.last_name
                ? `${userProfile?.first_name ?? ''} ${userProfile?.last_name ?? ''}`.trim()
                : 'Laden...'}
            </p>
          </div>
        )}
        

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto text-sm">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              // Producten label aanpassen
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

        {/* Help Section */}
        <div className="border-t border-gray-200 p-4 flex-shrink-0">
            <div className="flex items-center space-x-3 px-3 py-2 text-gray-600">
              <HelpCircle className="w-5 h-5 flex-shrink-0" />
              <div>
                <p className="font-medium">Hulp nodig?</p>
                <p className="text-xs text-gray-500">info@stockflow.be</p>
              </div>
            </div>
        </div>


        <div className="border-t border-gray-200 p-4 flex-shrink-0">
              <div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className={`
                    w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50
                    ${!isOpen ? 'px-2' : 'px-3'}
                  `}
                >
                  <LogOut className="w-4 h-4 flex-shrink-0" />
                  {isOpen && <span className="ml-3">Afmelden</span>}
                </Button>              
          </div>
        </div>
          
          
      </div>
    </>
  );
};
