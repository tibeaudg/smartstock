import React from 'react';
import { Layout } from './Layout';
import { CreateBranchModal } from './CreateBranchModal';
import { useAuth } from '@/hooks/useAuth';
import { useLocation, Outlet } from 'react-router-dom';
import { useBranches, BranchProvider } from '@/hooks/useBranches';

const AppContent = () => {
  const { userProfile } = useAuth();
  const { hasNoBranches } = useBranches();
  const location = useLocation();
  
  // Get current tab from URL
  const getCurrentTab = () => {
    const path = location.pathname.split('/')[2] || 'dashboard';
    return path;
  };

  // Don't render anything if no userProfile
  if (!userProfile) {
    return null;
  }

  return (
    <>
      <Layout
        currentTab={getCurrentTab()}
        onTabChange={(tab: string) => {
          // Navigation is now handled by the Layout component directly
          // The tab change just updates the UI state
        }}
        userRole={userProfile.role}
        userProfile={userProfile}
      >
        <Outlet />
      </Layout>
      
      <CreateBranchModal 
        open={hasNoBranches} 
        onOpenChange={() => {}} 
        onBranchCreated={() => {}}
      />
    </>
  );
};

export const StockManagementApp = () => (
  <BranchProvider>
    <AppContent />
  </BranchProvider>
);
