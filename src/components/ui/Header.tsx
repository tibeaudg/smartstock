import React from 'react';
import { NotificationButton } from '../NotificationButton';
import { Package, Menu } from 'lucide-react';

interface HeaderProps {
  title: string;
  unreadCount?: number;
  onNotificationClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, unreadCount = 0, onNotificationClick }) => {
  return (
    <>
      {/* Desktop Header */}
      <header className="hidden lg:flex fixed top-0 left-0 right-0 z-40 items-center justify-between px-8 h-[70px] bg-white shadow-sm">
        <div className="flex items-center space-x-3 p-4 flex-shrink-0">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-semibold text-gray-900">stockflow</h1>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h1>
        <NotificationButton unreadCount={unreadCount} onClick={onNotificationClick} />
      </header>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 h-[60px] border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                <Package className="w-4 h-4 text-white" />
              </div>
              <span className="text-base font-semibold text-gray-900">stockflow</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <NotificationButton unreadCount={unreadCount} onClick={onNotificationClick} />
          </div>
        </div>
        <div className="px-4 py-2 border-b border-gray-100">
          <h1 className="text-lg font-bold text-gray-900 truncate">{title}</h1>
        </div>
      </header>
    </>
  );
};
