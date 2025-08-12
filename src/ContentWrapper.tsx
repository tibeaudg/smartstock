
import React from 'react';
import { useLocation } from 'react-router-dom';
import { DesktopHeader } from './components/ui/DesktopHeader';
import { useNotifications } from './hooks/useNotifications';

const getPageTitle = (pathname: string) => {
  if (pathname.startsWith('/dashboard/stock')) return 'Producten';
  if (pathname.startsWith('/dashboard/transactions')) return 'Voorraadmutaties';
  if (pathname.startsWith('/dashboard/settings')) return 'Instellingen';
  if (pathname.startsWith('/dashboard')) return 'Dashboard';
  if (pathname.startsWith('/admin/notifications')) return 'Meldingen';
  if (pathname.startsWith('/admin/user')) return 'Gebruiker';
  if (pathname.startsWith('/admin')) return 'Admin';
  if (pathname === '/') return '';
  return '';
};

export const ContentWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { unreadCount } = useNotifications();
  const title = getPageTitle(location.pathname);
  return (
    <>
      {/* Desktop header for all pages except landing/auth */}
      {title && (
        <DesktopHeader title={title} unreadCount={unreadCount} />
      )}
      <div>
        {children}
      </div>
    </>
  );
};
