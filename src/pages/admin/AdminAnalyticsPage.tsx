import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BranchProvider } from '@/hooks/useBranches';
import { useAuth } from '@/hooks/useAuth';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { Layout } from '@/components/Layout';
import { SEO } from '@/components/SEO';
import { AdminShell } from './AdminLayout';
import { useAnalyticsDashboard } from '@/hooks/useAnalyticsDashboard';
import { GrowthSection } from '@/components/admin/analytics/GrowthSection';
import { EngagementSection } from '@/components/admin/analytics/EngagementSection';
import { RetentionSection } from '@/components/admin/analytics/RetentionSection';
import { RevenueSection } from '@/components/admin/analytics/RevenueSection';
import { DeviceSection } from '@/components/admin/analytics/DeviceSection';
import { SystemOverview } from '@/components/admin/SystemOverview';

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
      <SEO
        title="Admin Analytics | stockflow"
        description="Product analytics dashboard for StockFlow owners."
        keywords="admin analytics, retention, growth, stockflow"
        url="https://www.stockflowsystems.com/admin"
      />
      <Layout
        currentTab="admin"
        onTabChange={() => {}}
        userRole="admin"
        userProfile={userProfile}
        variant="admin"
      >
        <AdminShell title="Analytics Overview">
          <GrowthSection summary={summary} dailySignups={dailySignups} isLoading={isLoading} />
          <EngagementSection summary={summary} isLoading={isLoading} />
          <DeviceSection deviceStats={deviceStats} isLoading={isLoading} />
          <RetentionSection cohorts={cohorts} avgRetention={avgRetention} isLoading={isLoading} />
          <RevenueSection revenue={revenue} isLoading={isLoading} />
          <SystemOverview />
        </AdminShell>
      </Layout>
    </BranchProvider>
  );
}
