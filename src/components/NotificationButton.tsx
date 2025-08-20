import React from 'react';
import { Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface NotificationButtonProps {
  unreadCount: number;
  onClick: () => void;
}

export const NotificationButton: React.FC<NotificationButtonProps> = ({ unreadCount, onClick }) => {
  return (
    <button
      className="relative flex items-center justify-center w-10 h-10 rounded-full bg-transparent text-blue-600  hover:bg-blue-600 hover:text-white transition-colors"
      onClick={onClick}
      aria-label="Notifications"
    >
      <Bell className="h-5 w-5 text-blue-600 hover:text-white" />
      {unreadCount > 0 && (
        <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
          {unreadCount}
        </Badge>
      )}
    </button>
  );
};
