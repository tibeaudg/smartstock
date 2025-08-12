import React from 'react';
import { NotificationButton } from '../NotificationButton';
import { Package } from 'lucide-react';

interface DesktopHeaderProps {
  title: string;
  unreadCount?: number;
  onNotificationClick?: () => void;
}

export const DesktopHeader: React.FC<DesktopHeaderProps> = ({ title, unreadCount = 0, onNotificationClick }) => {
  return (
    <header className="hidden lg:flex top-0 z-40 items-center justify-between px-8 h-[70px] bg-white">
      <div className="flex items-center space-x-3 p-4 flex-shrink-0">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <Package className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-lg font-semibold text-gray-900">stockflow</h1>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h1>
      <NotificationButton unreadCount={unreadCount} onClick={onNotificationClick} />
    </header>
  );
};
