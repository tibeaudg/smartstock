import React from 'react';
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Settings, 
  Users, 
  CreditCard,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth, UserProfile } from '@/hooks/useAuth';
import { useNavigate, NavLink } from 'react-router-dom';
import { BranchSelector } from './BranchSelector';

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

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, path: '/dashboard', end: true },
    { id: 'stock', label: 'Producten', icon: Package, path: '/dashboard/stock' },
    { id: 'transactions', label: 'Bewegingslijst', icon: ShoppingCart, path: '/dashboard/transactions' },
    ...(userRole === 'admin' ? [
    ] : []),
    { id: 'settings', label: 'Instellingen', icon: Settings, path: '/dashboard/settings' },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
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
              <h1 className="text-lg font-semibold text-gray-900">StockManager</h1>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="p-1.5 hover:bg-gray-100"
          >
            {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>
        </div>

        {/* Branch Selector */}
        {isOpen && (
          <div className="p-4 border-b border-gray-200 flex-shrink-0">
            <BranchSelector />
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              
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
                    {isOpen && <span className="font-medium ml-3">{item.label}</span>}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Profile & Sign Out */}
        <div className="border-t border-gray-200 p-4 flex-shrink-0">
          {isOpen && userProfile && (
            <div className="mb-3">
              <p className="text-sm font-medium text-gray-900">
                {userProfile.first_name} {userProfile.last_name}
              </p>
              <p className="text-xs text-gray-500">{userProfile.email}</p>
            </div>
          )}
          
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
    </>
  );
};
