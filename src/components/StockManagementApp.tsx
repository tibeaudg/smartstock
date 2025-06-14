
import React, { useState } from 'react';
import { AuthForm } from './AuthForm';
import { Layout } from './Layout';
import { Dashboard } from './Dashboard';

export const StockManagementApp = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<{
    email: string;
    role: 'admin' | 'staff';
  } | null>(null);
  const [currentTab, setCurrentTab] = useState('dashboard');

  const handleLogin = (email: string, password: string, role: 'admin' | 'staff') => {
    // In a real app, this would validate credentials
    setCurrentUser({ email, role });
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentTab('dashboard');
  };

  const renderTabContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return <Dashboard userRole={currentUser?.role || 'staff'} />;
      case 'orders':
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Orders Management</h2>
            <p className="text-gray-600">Orders functionality will be implemented here.</p>
          </div>
        );
      case 'stock':
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Stock Management</h2>
            <p className="text-gray-600">Stock management functionality will be implemented here.</p>
          </div>
        );
      case 'licenses':
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">License Management</h2>
            <p className="text-gray-600">License management functionality will be implemented here.</p>
          </div>
        );
      case 'subscriptions':
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Subscriptions</h2>
            <p className="text-gray-600">Subscription management functionality will be implemented here.</p>
          </div>
        );
      case 'settings':
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Settings</h2>
            <p className="text-gray-600">Settings functionality will be implemented here.</p>
          </div>
        );
      default:
        return <Dashboard userRole={currentUser?.role || 'staff'} />;
    }
  };

  if (!isAuthenticated) {
    return <AuthForm onLogin={handleLogin} />;
  }

  return (
    <Layout
      currentTab={currentTab}
      onTabChange={setCurrentTab}
      userRole={currentUser?.role || 'staff'}
    >
      {renderTabContent()}
    </Layout>
  );
};
