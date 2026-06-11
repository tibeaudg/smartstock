import React, { useContext, useEffect, useRef } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import { Layout } from './Layout';
import { CurrencyBranchSync } from './CurrencyBranchSync';
import { AuthContext, useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { UnreadMessagesProvider } from '@/hooks/UnreadMessagesContext';
import { SubscriptionMigrationModal } from './SubscriptionMigrationModal';
import { PastDueRedirect } from './PastDueRedirect';
import { supabase } from '@/integrations/supabase/client';

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

function isInventoryLocationsPage(pathname: string): boolean {
  return pathname === '/dashboard/locations' || pathname.startsWith('/dashboard/locations/');
}

export const StockManagementApp: React.FC = () => {
  // Use context directly to avoid hard failure if provider is not mounted yet
  const auth = useContext(AuthContext);
  const userProfile = auth?.userProfile || null;
  const loading = auth?.loading ?? true;
  const { user } = useAuth();
  const { hasNoBranches, hasError, refreshBranches, setActiveBranch } = useBranches();
  const location = useLocation();
  const isCreatingBranch = useRef(false);

  useEffect(() => {
    if (!hasNoBranches || hasError || !user || isCreatingBranch.current) return;
    isCreatingBranch.current = true;

    (async () => {
      try {
        const { data: branchData, error: branchError } = await supabase
          .from('branches')
          .insert({ name: 'Main Warehouse', is_main: true, is_active: true, user_id: user.id })
          .select()
          .single();

        if (branchError) throw branchError;

        await supabase.from('branch_users').insert({
          branch_id: branchData.id,
          user_id: user.id,
          role: 'admin',
          granted_by: user.id,
        });

        setActiveBranch({
          branch_id: branchData.id,
          branch_name: branchData.name,
          is_main: true,
          user_role: 'admin',
        });

        await refreshBranches();
      } catch (err) {
        console.error('Failed to auto-create default warehouse:', err);
        isCreatingBranch.current = false;
      }
    })();
  }, [hasNoBranches, hasError, user?.id]);

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

  const isProductDetailPage = /^\/dashboard\/products\/[^/]+$/.test(location.pathname);

  return (
    <UnreadMessagesProvider>
        <CurrencyBranchSync />
        <SubscriptionMigrationModal />
        <PastDueRedirect />
        <div className="w-screen h-screen overflow-hidden overflow-x-hidden m-0 p-0 bg-background text-foreground transition-colors">
        <Layout
          currentTab={getCurrentTab()}
          onTabChange={(tab: string) => {
          }}
          userRole={userProfile.role as 'admin' | 'staff'}
          userProfile={userProfile}
          variant={
            location.pathname.startsWith('/admin') ||
            location.pathname.includes('/categories') ||
            isProductDetailPage ||
            isInventoryLocationsPage(location.pathname) ||
            location.pathname.includes('/transactions') ||
            location.pathname.includes('/bom') ||
            location.pathname.includes('/sales-orders') ||
            location.pathname.includes('/purchase-orders') ||
            location.pathname.includes('/customer-management') ||
            location.pathname.includes('/suppliers')
              ? 'admin'
              : 'default'
          }
          contentLayout={isProductDetailPage ? 'fill' : 'scroll'}
        >
          <Outlet key={location.pathname} />
        </Layout>
        </div>
    </UnreadMessagesProvider>
  );
};
