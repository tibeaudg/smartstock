
import React from 'react';
import { AuthPage } from './AuthPage';
import { Layout } from './Layout';
import { Dashboard } from './Dashboard';
import { StockMovements } from './StockMovements';
import { StockList } from './StockList';
import { Settings } from './Settings';
import { CreateBranchModal } from './CreateBranchModal';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { BranchProvider, useBranches } from '@/hooks/useBranches';

const AppContent = () => {
  const { user, userProfile, loading: authLoading } = useAuth();
  const { branches, loading: branchesLoading, hasNoBranches, refreshBranches } = useBranches();
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const initializeApp = async () => {
      // Wait for auth and branches to load
      if (authLoading || branchesLoading) return;

      if (!user) {
        console.log('No authenticated user found, redirecting to auth...');
        navigate('/auth');
        return;
      }

      if (mounted) {
        setLoading(false);
      }
    };

    initializeApp();

    return () => {
      mounted = false;
    };
  }, [user, authLoading, branchesLoading, navigate]);

  // Show loading while authentication or branches are being checked
  if (loading || branchesLoading) {
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

  const handleTabChange = (tab: string) => {
    console.log('Switching to tab:', tab);
    setCurrentTab(tab);
  };

  const handleBranchCreated = async () => {
    console.log('Branch created, refreshing branches...');
    await refreshBranches();
  };

  const renderTabContent = () => {
    console.log('Rendering content for tab:', currentTab);
    
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
        return <Settings />;
      default:
        console.log('Unknown tab, defaulting to dashboard');
        return <Dashboard userRole={currentUserProfile.role} />;
    }
  };

  return (
    <>
      <Layout
        currentTab={currentTab}
        onTabChange={handleTabChange}
        userRole={currentUserProfile.role}
        userProfile={currentUserProfile}
      >
        {renderTabContent()}
      </Layout>
      
      <CreateBranchModal 
        open={hasNoBranches} 
        onBranchCreated={handleBranchCreated} 
      />
    </>
  );
};

export const StockManagementApp = () => {
  return (
    <BranchProvider>
      <AppContent />
    </BranchProvider>
  );
};
