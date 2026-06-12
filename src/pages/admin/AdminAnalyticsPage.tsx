import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BranchProvider } from '@/hooks/useBranches';
import { useAuth } from '@/hooks/useAuth';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { Layout } from '@/components/Layout';
import { AdminShell } from './AdminLayout';
import { useAnalyticsDashboard } from '@/hooks/useAnalyticsDashboard';
import { GrowthSection } from '@/components/admin/analytics/GrowthSection';
import { DeviceSection } from '@/components/admin/analytics/DeviceSection';

export default function AdminAnalyticsPage() {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  usePageRefresh();

  const { summary, cohorts, dailySignups, revenue, deviceStats, avgRetention, isLoading } =
    useAnalyticsDashboard();

  useEffect(() => {
    if (userProfile && userProfile.is_owner !== true) {
      navigate('/dashboard');
    }
  }, [userProfile, navigate]);

  return (
    <BranchProvider>

      <Layout
        currentTab="admin"
        onTabChange={() => {}}
        userRole="admin"
        userProfile={userProfile}
        variant="admin"
      >
        <AdminShell title="Analytics Overview">
          <GrowthSection summary={summary} dailySignups={dailySignups} isLoading={isLoading} />
          <DeviceSection deviceStats={deviceStats} isLoading={isLoading} />
        </AdminShell>
      </Layout>
    </BranchProvider>
  );
}
