import React from 'react';
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Settings
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MobileBottomNavProps {
  currentTab: string;
  onTabChange?: (tab: string) => void;
  userRole: 'admin' | 'staff';
}

export const MobileBottomNav = ({ currentTab, onTabChange, userRole }: MobileBottomNavProps) => {
  const navigate = useNavigate();
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, path: '/dashboard' },
    { id: 'stock', label: 'Producten', icon: Package, path: '/dashboard/stock' },
    { id: 'transactions', label: 'Bewegingslijst', icon: ShoppingCart, path: '/dashboard/transactions' },
    { id: 'settings', label: 'Instellingen', icon: Settings, path: '/dashboard/settings' },
  ];

  const handleNav = (item: typeof menuItems[0]) => {
    if (onTabChange) onTabChange(item.id);
    if (item.path) navigate(item.path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <nav className="flex justify-around">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNav(item)}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              currentTab === item.id
                ? 'text-blue-700 bg-blue-50'
                : 'text-gray-600'
            }`}
          >
            <item.icon className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};
