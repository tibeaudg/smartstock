
import React from 'react';
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Shield, 
  CreditCard, 
  Settings, 
  Menu,
  User,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth, UserProfile } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  userRole: 'admin' | 'staff';
  userProfile?: UserProfile;
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar = ({ currentTab, onTabChange, userRole, userProfile, isOpen, onToggle }: SidebarProps) => {
  const { signOut } = useAuth();
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, adminOnly: false },
    { id: 'orders', label: 'Orders', icon: ShoppingCart, adminOnly: false },
    { id: 'stock', label: 'Stock', icon: Package, adminOnly: false },
    { id: 'licenses', label: 'Licenses', icon: Shield, adminOnly: true },
    { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard, adminOnly: true },
    { id: 'settings', label: 'Settings', icon: Settings, adminOnly: false },
  ];

  const filteredItems = menuItems.filter(item => !item.adminOnly || userRole === 'admin');

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error('Error signing out');
    } else {
      toast.success('Signed out successfully');
    }
  };

  const displayName = userProfile ? 
    `${userProfile.first_name} ${userProfile.last_name}`.trim() || userProfile.email :
    'User';

  return (
    <div className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 shadow-sm transition-all duration-300 z-30 ${isOpen ? 'w-64' : 'w-16'}`}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {isOpen && (
            <div>
              <h1 className="text-xl font-bold text-gray-900">StockManager</h1>
              <p className="text-sm text-gray-500 capitalize">{userRole}</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="p-2"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <nav className="mt-6 px-3">
        <ul className="space-y-2">
          {filteredItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors group ${
                  currentTab === item.id
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className={`h-5 w-5 ${isOpen ? 'mr-3' : 'mx-auto'}`} />
                {isOpen && <span className="font-medium">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="absolute bottom-4 left-0 right-0 px-3">
        <div className={`flex items-center ${isOpen ? 'justify-between' : 'justify-center'} p-3 bg-gray-50 rounded-lg`}>
          {isOpen && (
            <div className="flex items-center">
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{displayName}</p>
                <p className="text-xs text-gray-500">{userProfile?.email}</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="text-gray-500 hover:text-red-600"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
