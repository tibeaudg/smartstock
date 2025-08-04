import React from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import { Layout } from './Layout';
import { CreateBranchModal } from './CreateBranchModal';
import { useAuth } from '@/hooks/useAuth';
import { useBranches, BranchProvider } from '@/hooks/useBranches';

function isLocalStorageAvailable() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    const testKey = '__test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

const AppContent: React.FC = () => {
  const { userProfile } = useAuth();
  const { hasNoBranches } = useBranches();
  const location = useLocation();

  if (!isLocalStorageAvailable()) {
    return (
      <div style={{ padding: 32, textAlign: 'center', color: '#b91c1c', background: '#fef2f2', minHeight: '100vh' }}>
        <h1 style={{ fontSize: 28, marginBottom: 16 }}>Opslag niet beschikbaar</h1>
        <p style={{ marginBottom: 16 }}>
          De applicatie kan geen gegevens opslaan in je browser. Dit kan komen door:
          <ul style={{ textAlign: 'left', maxWidth: 400, margin: '16px auto' }}>
            <li>Private/incognito modus</li>
            <li>Uitgeschakelde cookies of opslag</li>
            <li>Strenge privacy-instellingen</li>
            <li>Een in-app browser (zoals Facebook/Instagram)</li>
          </ul>
          <br />
          Schakel deze instellingen uit of gebruik een andere browser om SmartStock te gebruiken.
        </p>
        <button onClick={() => window.location.reload()} style={{ background: '#2563eb', color: 'white', padding: '10px 24px', borderRadius: 6, fontSize: 16, border: 'none' }}>Opnieuw proberen</button>
      </div>
    );
  }

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
          // New branch created successfully
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
