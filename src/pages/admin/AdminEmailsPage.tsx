import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BranchProvider } from '@/hooks/useBranches';
import { useAuth } from '@/hooks/useAuth';
import { Layout } from '@/components/Layout';
import { SEO } from '@/components/SEO';
import { AdminShell } from './AdminLayout';
import EmailManagementPage from './EmailManagementPage';

export default function AdminEmailsPage() {
  const { userProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (userProfile && userProfile.is_owner !== true) navigate('/dashboard');
  }, [userProfile, navigate]);

  return (
    <BranchProvider>
      <SEO title="Email Management | stockflow" url="https://www.stockflowsystems.com/admin/emails" />
      <Layout currentTab="admin" onTabChange={() => {}} userRole="admin" userProfile={userProfile} variant="admin">
        <AdminShell title="Email Management">
          <EmailManagementPage />
        </AdminShell>
      </Layout>
    </BranchProvider>
  );
}
