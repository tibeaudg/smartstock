import React from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import { Layout } from './Layout';
import { CreateBranchModal } from './CreateBranchModal';
import { useAuth } from '@/hooks/useAuth';
import { useBranches, BranchProvider } from '@/hooks/useBranches';

const AppContent: React.FC = () => {
  const { userProfile } = useAuth();
  const { hasNoBranches } = useBranches();
  const location = useLocation();

  const getCurrentTab = (): string => {
    const pathParts = location.pathname.split('/');
    return pathParts[2] || 'dashboard';
  };

  if (!userProfile) return null;

  return (
  <div className="w-screen h-screen overflow-hidden overflow-x-hidden m-0 p-0">
      {/* Sidebar and Layout are assumed to be part of Layout component */}
      <Layout
        currentTab={getCurrentTab()}
        onTabChange={(tab: string) => {
        }}
        userRole={userProfile.role}
        userProfile={userProfile}
      >
        {/* Main scrollable content */}
        <div className="flex-1 h-full overflow-y-auto">
          <Outlet />
        </div>
      </Layout>

      <CreateBranchModal
        open={hasNoBranches}
        onOpenChange={() => {
        }}
        onBranchCreated={() => {
          console.log('New branch created');
        }}
      />
    </div>
  );
};

export const StockManagementApp: React.FC = () => (
  <BranchProvider>
    <AppContent />
  </BranchProvider>
);
