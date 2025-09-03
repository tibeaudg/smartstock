import React, { useState } from 'react';
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Users,
  MessageSquare,
  Bell,
  FileText,
  Scan,
  Settings,
  ArrowLeft
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth'; // FIX: use import, not require
import { FloatingChatButton } from './FloatingChatButton';
import { ChatModal } from './ChatModal';

interface MobileBottomNavProps {
  currentTab: string;
  onTabChange?: (tab: string) => void;
  userRole: 'admin' | 'staff';
}

export const MobileBottomNav = ({ currentTab, onTabChange, userRole }: MobileBottomNavProps) => {
  // FIX: use hook directly
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isBlocked = userProfile?.blocked;
  const isOwner = userProfile && userProfile.is_owner === true && !userProfile.blocked;
  const isAdminPage = location.pathname.startsWith('/admin');
  
  const regularMenuItems = isBlocked
    ? []
    : [
        { id: 'dashboard', label: 'Dashboard', icon: BarChart3, path: '/dashboard' },
        { id: 'stock', label: 'Producten', icon: Package, path: '/dashboard/stock' },
        { id: 'scan', label: 'Scannen', icon: Scan, path: '/dashboard/scan' },
        { id: 'transactions', label: 'Bewegingen', icon: ShoppingCart, path: '/dashboard/transactions' },
        { id: 'settings', label: 'Instellingen', icon: Settings, path: '/dashboard/settings' },
        ...(isOwner && !isAdminPage
          ? [
              { id: 'admin', label: 'Admin', icon: Users, path: '/admin' },
            ]
          : []),
      ];



      

  const adminMenuItems = [
    { id: 'users', label: 'Gebruikers', icon: Users, path: '/admin' },
    { id: 'notifications', label: 'Meldingen', icon: Bell, path: '/admin' },
    { id: 'chats', label: 'Chats', icon: MessageSquare, path: '/admin' },
    { id: 'blogcms', label: 'Blog CMS', icon: FileText, path: '/admin' },
    { id: 'back', label: 'Terug', icon: ArrowLeft, path: '/dashboard' },
  ];

  // Alleen admin menu items tonen als gebruiker eigenaar is
  const menuItems = isAdminPage && isOwner ? adminMenuItems : regularMenuItems;

  const handleNav = (item: typeof menuItems[0]) => {
    if (onTabChange) onTabChange(item.id);
    if (item.path) navigate(item.path);
  };

  const [chatOpen, setChatOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <nav className={`flex items-center py-1 ${
          menuItems.length > 4 ? 'justify-between px-1' : 'justify-around px-2'
        }`}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item)}
              className={`flex flex-col items-center justify-center py-2 px-1 transition-colors ${
                menuItems.length > 4 ? 'flex-1' : 'min-w-0'
              } ${
                currentTab === item.id
                  ? 'text-blue-700 bg-blue-50'
                  : item.id === 'scan'
                  ? 'text-gray-600'
                  : 'text-gray-600'
              }`}
            >
              <item.icon className={`h-5 w-5 mb-1`} />
              <span className="text-xs font-medium text-center leading-tight truncate w-full">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
      <FloatingChatButton onClick={() => setChatOpen(true)} />
      <ChatModal open={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
};
