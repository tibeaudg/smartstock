import React, { useContext } from 'react';
import { useLocation, Outlet, useNavigate } from 'react-router-dom';
import { Layout } from './Layout';
import { CreateBranchModal } from './CreateBranchModal';
import { OnboardingWizard } from './OnboardingWizard';
import { AuthContext } from '@/hooks/useAuth';
import { useBranches, BranchProvider } from '@/hooks/useBranches';
import { UnreadMessagesProvider } from '@/hooks/UnreadMessagesContext';
import { useOnboardingCheck } from '@/hooks/useOnboardingCheck';

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

export const StockManagementApp: React.FC = () => {
  // Use context directly to avoid hard failure if provider is not mounted yet
  const auth = useContext(AuthContext);
  const userProfile = auth?.userProfile || null;
  const loading = auth?.loading ?? true;
  const { hasNoBranches, hasError } = useBranches();
  const { shouldShowOnboarding, isLoading: isLoadingOnboarding } = useOnboardingCheck();
  const location = useLocation();
  const navigate = useNavigate();

  // Show loading state while auth is being determined
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
          <p className="text-gray-400 text-sm mt-4">
            If this takes too long, 
            <button 
              onClick={() => window.location.reload()} 
              className="text-blue-600 hover:text-blue-800 underline ml-1"
            >
              click here to refresh
            </button>
          </p>
        </div>
      </div>
    );
  }

  if (!isLocalStorageAvailable()) {
    return (
      <div style={{ padding: 32, textAlign: 'center', color: '#b91c1c', background: '#fef2f2', minHeight: 'screen' }}>
        <h1 style={{ fontSize: 28, marginBottom: 16 }}>Local Storage Unavailable</h1>
        <p style={{ marginBottom: 16 }}>
          This application requires local storage to function properly. This might be due to:
          <ul style={{ textAlign: 'left', maxWidth: 400, margin: '16px auto' }}>
            <li>Private browsing mode</li>
            <li>Cookies disabled</li>
            <li>Privacy settings</li>
            <li>In-app browser restrictions</li>
          </ul>
          <br />
          Please enable local storage or use a different browser and try again.
        </p>
        <button onClick={() => window.location.reload()} style={{ background: '#2563eb', color: 'white', padding: '10px 24px', borderRadius: 6, fontSize: 16, border: 'none' }}>Try Again</button>
      </div>
    );
  }

  const getCurrentTab = (): string => {
    const pathParts = location.pathname.split('/');
    return pathParts[2] || 'dashboard';
  };

  if (!userProfile) return null;

  const handleOnboardingComplete = () => {
    // Redirect to categories page after onboarding completion
    navigate('/categories');
  };

  return (
    <UnreadMessagesProvider>
        <div className="w-screen h-screen overflow-hidden overflow-x-hidden m-0 p-0 bg-background text-foreground transition-colors">
        {/* Sidebar and Layout are assumed to be part of Layout component */}
        <Layout
          currentTab={getCurrentTab()}
          onTabChange={(tab: string) => {
          }}
          userRole={userProfile.role}
          userProfile={userProfile}
          // Use an admin-friendly variant when browsing /admin routes, categories, transactions, bom, sales-orders, or vendor-management so we can control spacing fully
          variant={location.pathname.startsWith('/admin') || location.pathname.includes('/categories') || location.pathname.includes('/transactions') || location.pathname.includes('/bom') || location.pathname.includes('/sales-orders') || location.pathname.includes('/vendor-management') ? 'admin' : 'default'}
        >
          {/* Main scrollable content - Layout already handles overflow */}
          <Outlet key={location.pathname} />
        </Layout>


          <CreateBranchModal
            open={hasNoBranches && !hasError}
            onOpenChange={() => {
            }}
            onBranchCreated={() => {
              // New branch created successfully
            }}
          />
        </div>
    </UnreadMessagesProvider>
  );
};
