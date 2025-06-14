
import React from 'react';
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Shield, 
  CreditCard, 
  Settings
} from 'lucide-react';

interface MobileBottomNavProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  userRole: 'admin' | 'staff';
}

export const MobileBottomNav = ({ currentTab, onTabChange, userRole }: MobileBottomNavProps) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, adminOnly: false },
    { id: 'orders', label: 'Orders', icon: ShoppingCart, adminOnly: false },
    { id: 'stock', label: 'Stock', icon: Package, adminOnly: false },
    { id: 'licenses', label: 'Licenses', icon: Shield, adminOnly: true },
    { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard, adminOnly: true },
    { id: 'settings', label: 'Settings', icon: Settings, adminOnly: false },
  ];

  const filteredItems = menuItems.filter(item => !item.adminOnly || userRole === 'admin');

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <nav className="flex justify-around">
        {filteredItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
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
