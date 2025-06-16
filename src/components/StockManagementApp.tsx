
import React from 'react';
import { AuthPage } from './AuthPage';
import { Layout } from './Layout';
import { Dashboard } from './Dashboard';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export const StockManagementApp = () => {
  const { user, profile, loading } = useAuth();
  const [currentTab, setCurrentTab] = useState('dashboard');
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect if we're done loading and there's no authenticated user
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show dashboard even if profile is still loading, but ensure user exists
  if (!user) {
    return null; // Will redirect via useEffect
  }

  // Use a default profile if none exists yet
  const userProfile = profile || {
    id: user.id,
    email: user.email || '',
    first_name: user.user_metadata?.first_name || null,
    last_name: user.user_metadata?.last_name || null,
    role: 'staff' as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const renderTabContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return <Dashboard userRole={userProfile.role} />;
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
        return <Dashboard userRole={userProfile.role} />;
    }
  };

  return (
    <Layout
      currentTab={currentTab}
      onTabChange={setCurrentTab}
      userRole={userProfile.role}
      userProfile={userProfile}
    >
      {renderTabContent()}
    </Layout>
  );
};
