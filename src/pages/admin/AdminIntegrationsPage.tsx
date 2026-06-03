import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Plug, Users, MousePointerClick } from 'lucide-react';
import { BranchProvider } from '@/hooks/useBranches';
import { useAuth } from '@/hooks/useAuth';
import { Layout } from '@/components/Layout';
import { SEO } from '@/components/SEO';
import { AdminShell } from './AdminLayout';
import { useIntegrationClickStats } from '@/hooks/useIntegrationClickStats';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

function IntegrationsStatsContent() {
  const { data, isLoading, isError } = useIntegrationClickStats();
  const stats = data?.stats ?? [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-16 text-red-600">
        Could not load integration click data. Check that you have admin access.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <MousePointerClick className="h-4 w-4" />
              Total clicks
            </CardDescription>
            <CardTitle className="text-3xl">{data?.totalClicks ?? 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Plug className="h-4 w-4" />
              Integrations clicked
            </CardDescription>
            <CardTitle className="text-3xl">{data?.integrationsWithClicks ?? 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Unique users
            </CardDescription>
            <CardTitle className="text-3xl">{data?.totalUniqueUsers ?? 0}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Clicks by integration</CardTitle>
          <CardDescription>
            Users who clicked an integration card in Settings. Sorted by total clicks.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Integration</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Total clicks</TableHead>
                <TableHead className="text-right">Unique users</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.map((row) => (
                <TableRow key={row.integrationId}>
                  <TableCell className="font-medium">{row.integrationName}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{row.category}</Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{row.totalClicks}</TableCell>
                  <TableCell className="text-right tabular-nums">{row.uniqueUsers}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminIntegrationsPage() {
  const { userProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (userProfile && userProfile.is_owner !== true) {
      navigate('/dashboard');
    }
  }, [userProfile, navigate]);

  return (
    <BranchProvider>
      <SEO
        title="Admin Integrations | stockflow"
        description="Integration interest clicks from StockFlow settings."
        keywords="admin integrations, stockflow"
        url="https://www.stockflowsystems.com/admin/integrations"
      />
      <Layout
        currentTab="admin"
        onTabChange={() => {}}
        userRole="admin"
        userProfile={userProfile}
        variant="admin"
      >
        <AdminShell title="Integration interest">
          <IntegrationsStatsContent />
        </AdminShell>
      </Layout>
    </BranchProvider>
  );
}
