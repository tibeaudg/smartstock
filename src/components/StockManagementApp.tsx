
import React from 'react';
import { AuthPage } from './AuthPage';
import { Layout } from './Layout';
import { Dashboard } from './Dashboard';
import { StockMovements } from './StockMovements';
import { StockList } from './StockList';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export const StockManagementApp = () => {
  const { user, userProfile, loading } = useAuth();
  const [currentTab, setCurrentTab] = useState('dashboard');
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect if authentication check is complete and there's no user
    if (!loading && !user) {
      console.log('No authenticated user found, redirecting to auth...');
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Show loading while authentication is being checked
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

  // Don't render anything if no user (will redirect via useEffect)
  if (!user) {
    return null;
  }

  // Use a default profile if none exists yet
  const currentUserProfile = userProfile || {
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
        return <Dashboard userRole={currentUserProfile.role} />;
      case 'orders':
        return <StockMovements />;
      case 'stock':
        return <StockList />;
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
        return <Dashboard userRole={currentUserProfile.role} />;
    }
  };

  return (
    <Layout
      currentTab={currentTab}
      onTabChange={setCurrentTab}
      userRole={currentUserProfile.role}
      userProfile={currentUserProfile}
    >
      {renderTabContent()}
    </Layout>
  );
};
