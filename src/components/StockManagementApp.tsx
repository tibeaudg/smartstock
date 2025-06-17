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

  const getCurrentTab = (): string => {
    return location.pathname.split('/')[2] || 'dashboard';
  };

  if (!userProfile) return null;

  return (
    <div className="w-full h-full"> {/* Added wrapper div with full dimensions */}
      <div className="relative flex flex-col min-h-screen"> {/* Added flex container */}
        <main className="flex-1">
          <Layout
            currentTab={getCurrentTab()}
            onTabChange={(tab: string) => {}}
            userRole={userProfile.role}
            userProfile={userProfile}
          >
            <Outlet />
          </Layout>
        </main>

        <CreateBranchModal
          open={hasNoBranches}
          onOpenChange={() => {}}
          onBranchCreated={() => {}}
        />
      </div>
    </div>
  );
};

export const StockManagementApp = () => (
  <BranchProvider>
    <AppContent />
  </BranchProvider>
);
