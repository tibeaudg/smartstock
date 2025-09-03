import React, { useState, useEffect } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BranchManagement } from './settings/BranchManagement';
import { ProfileSettings } from './settings/ProfileSettings';
import { UserManagement } from './settings/UserManagement';
import { ModuleManagement } from './settings/ModuleManagement';
import { LicenseOverview } from './settings/LicenseOverview';
import { InvoicingOverview } from '@/components/settings/InvoicingOverview';
import { useAuth } from '@/hooks/useAuth';
import { useLocation, useNavigate, Outlet, useMatch } from 'react-router-dom';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { useMobile } from '@/hooks/use-mobile';
import {
  Building2,
  User,
  Banknote,
  Users,
  FileText,
  Key,
} from 'lucide-react';

export const Settings = () => {
  const { userProfile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { isMobile } = useMobile();
  
  // Gebruik de page refresh hook
  usePageRefresh();

  // Get current path to determine active submenu
  const settingsMatch = useMatch('/dashboard/settings/*');
  const currentPath = settingsMatch?.pathname?.split('/').pop() || 'profile';

  const isAdmin = userProfile?.role === 'admin';
  const isBlocked = userProfile?.blocked;

  // If blocked, navigate to invoicing
  useEffect(() => {
    if (isBlocked && currentPath !== 'invoicing') {
      navigate('invoicing');
    }
  }, [isBlocked, currentPath, navigate]);

  // Trigger license refetch on mount or route change
  useEffect(() => {
    if (currentPath === 'license' || !isAdmin) {
      window.dispatchEvent(new Event('license-refetch'));
    }
  }, [location.key, currentPath, isAdmin]);

  // Define menu items
  const menuItems = [
    { id: 'profile', label: 'Profiel', icon: <User className="w-4 h-4" /> },
    ...(isAdmin
      ? [
          { id: 'branches', label: 'Filialen', icon: <Building2 className="w-4 h-4" /> },
          { id: 'users', label: 'Gebruikers', icon: <Users className="w-4 h-4" /> },
          { id: 'modules', label: 'Modules', icon: <FileText className="w-4 h-4" /> },
        ]
      : []),
    ...(isBlocked ? [{ id: 'invoicing', label: 'Facturatie', icon: <Banknote className="w-4 h-4" /> }] : []),
  ];

  if (isBlocked) {
    return (
      <div className="space-y-6 pt-24 pb-24 md:pt-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Instellingen</h1>
          <p className="font-bold p-2 items-center justify-center text-blue-700 mt-2 bg-blue-50 border border-blue-200">
            Uw account is geblokkeerd. U kunt alleen uw facturen bekijken en betalen.
          </p>
        </div>
        <Outlet />
      </div>
    );
  }

  const handleSubmenuClick = (itemId: string) => {
    navigate(`/dashboard/settings/${itemId}`);
  };

  if (isMobile) {
    return (
      <div className="space-y-6 pt-6 pb-12">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Instellingen</h1>
          
          {/* Mobile Submenu */}
          <div className="space-y-2 mb-6">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSubmenuClick(item.id)}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                  currentPath === item.id
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-24 pb-24 md:pt-0">
      {/* Menu */}
      <div className="flex">
        <div className="flex-1 p-4 md:p-8 space-y-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
