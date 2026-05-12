import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Mail, Send, BarChart3, CheckCircle2, XCircle, Activity, RefreshCcw,
  Clock, AlertTriangle, Settings2
} from 'lucide-react';
import { useEmailLogs, useEmailLogStats } from '@/hooks/useEmailLogs';
import { useEmailSegments } from '@/hooks/useEmailSegments';
import { useSmtpSettings } from '@/hooks/useSmtpSettings';
import { useLifecycleEmails, ALL_LIFECYCLE_STAGES } from '@/hooks/useLifecycleEmails';
import SEO from '@/components/SEO';
import AdminSmtpPage from '@/pages/AdminSmtpPage';
import { EmailLogsView } from '@/components/admin/email/EmailLogsView';
import { EmailSegmentsManager } from '@/components/admin/email/EmailSegmentsManager';
import { EmailLifecycleView } from '@/components/admin/email/EmailLifecycleView';
import { format } from 'date-fns';

const STATUS_BADGE: Record<string, string> = {
  delivered: 'bg-green-100 text-green-700',
  sent: 'bg-blue-100 text-blue-700',
  failed: 'bg-red-100 text-red-700',
  bounced: 'bg-orange-100 text-orange-700',
};

const TYPE_BADGE: Record<string, string> = {
  welcome: 'bg-purple-100 text-purple-700',
  newsletter: 'bg-blue-100 text-blue-700',
  followup: 'bg-yellow-100 text-yellow-700',
  support: 'bg-green-100 text-green-700',
  lifecycle: 'bg-indigo-100 text-indigo-700',
  deletion_warning: 'bg-red-100 text-red-700',
  custom: 'bg-gray-100 text-gray-700',
};

const LIFECYCLE_STAGE_LABEL: Record<string, string> = {
  '24h_nudge': '24h Nudge',
  '7d_inactive': '7-Day',
  '14d_inactive': '14-Day',
  '25d_warning': '5-Day Warning',
  '29d_final_warning': 'Final Warning',
};

export default function EmailManagementPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { data: stats } = useEmailLogStats();
  const { segments, isLoading: segmentsLoading } = useEmailSegments();
  const { data: recentLogs } = useEmailLogs({});
  const { isConfigured, smtpSettings } = useSmtpSettings();
  const { statsMap, getEffectiveSetting } = useLifecycleEmails();

  const recentLogsData = recentLogs?.slice(0, 8) || [];
  const activeSegmentAutomations = segments.filter((s) => (s as any).automation_enabled === true);
  const enabledLifecycleStages = ALL_LIFECYCLE_STAGES.filter((s) => getEffectiveSetting(s).enabled).length;
  const totalLifecycleSent = ALL_LIFECYCLE_STAGES.reduce((acc, s) => acc + (statsMap.get(s)?.total || 0), 0);

  const deliveryRate = stats?.total
    ? Math.round((stats.delivered / stats.total) * 100)
    : 0;

  return (
    <>
      <SEO
        title="Email Management | Admin"
        description="Manage all outgoing emails, lifecycle automations, templates, and track email delivery."
        url="https://www.stockflowsystems.com/admin/emails"
      />
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Email Management</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage outgoing emails, lifecycle automations, and track delivery across all channels.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="settings">
              <Settings2 className="w-3.5 h-3.5 mr-1.5" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="dashboard">
              <BarChart3 className="w-3.5 h-3.5 mr-1.5" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="lifecycle">
              <RefreshCcw className="w-3.5 h-3.5 mr-1.5" />
              Lifecycle
            </TabsTrigger>
            <TabsTrigger value="segments">
              <Mail className="w-3.5 h-3.5 mr-1.5" />
              Segments
            </TabsTrigger>
            <TabsTrigger value="history">
              <Activity className="w-3.5 h-3.5 mr-1.5" />
              History
            </TabsTrigger>
          </TabsList>

          {/* ── Settings ── */}
          <TabsContent value="settings" className="space-y-6">
            <AdminSmtpPage />
          </TabsContent>

          {/* ── Dashboard ── */}
          <TabsContent value="dashboard" className="space-y-6">

            {/* Status row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

              {/* SMTP status */}
              <Card className={isConfigured ? 'border-green-200' : 'border-amber-200'}>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">SMTP Status</CardTitle>
                  <Mail className={`h-4 w-4 ${isConfigured ? 'text-green-600' : 'text-amber-500'}`} />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-1.5">
                    {isConfigured ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-semibold text-green-700">Configured</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-amber-500" />
                        <span className="text-sm font-semibold text-amber-600">Not configured</span>
                      </>
                    )}
                  </div>
                  {isConfigured && smtpSettings?.from_email && (
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      From: {smtpSettings.from_email}
                    </p>
                  )}
                  {!isConfigured && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Configure in the Settings tab
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Total emails */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Total Emails Sent</CardTitle>
                  <Send className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.total || 0}</div>
                  <p className="text-xs text-muted-foreground">All time</p>
                </CardContent>
              </Card>

              {/* Delivery rate */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
                  <BarChart3 className={`h-4 w-4 ${deliveryRate >= 90 ? 'text-green-600' : deliveryRate >= 70 ? 'text-amber-500' : 'text-red-500'}`} />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${deliveryRate >= 90 ? 'text-green-600' : deliveryRate >= 70 ? 'text-amber-600' : 'text-red-600'}`}>
                    {deliveryRate}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {stats?.delivered || 0} delivered · {stats?.failed || 0} failed
                  </p>
                </CardContent>
              </Card>

              {/* Automations */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Active Automations</CardTitle>
                  <RefreshCcw className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {activeSegmentAutomations.length + enabledLifecycleStages}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {enabledLifecycleStages} lifecycle · {activeSegmentAutomations.length} segments
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Lifecycle pipeline snapshot */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <RefreshCcw className="w-4 h-4 text-blue-600" />
                      Lifecycle Pipeline
                    </CardTitle>
                    <CardDescription>User journey email automation — {totalLifecycleSent} emails sent across all stages</CardDescription>
                  </div>
                  <button
                    onClick={() => setActiveTab('lifecycle')}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Manage →
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {ALL_LIFECYCLE_STAGES.map((stage) => {
                    const stageStats = statsMap.get(stage);
                    const setting = getEffectiveSetting(stage);
                    return (
                      <div
                        key={stage}
                        className={`rounded-lg border p-3 text-center cursor-pointer hover:shadow-sm transition-shadow ${setting.enabled ? 'bg-white' : 'bg-gray-50 opacity-60'}`}
                        onClick={() => setActiveTab('lifecycle')}
                      >
                        <div className="flex items-center justify-center gap-1 mb-1">
                          {setting.enabled ? (
                            <CheckCircle2 className="w-3 h-3 text-green-600" />
                          ) : (
                            <XCircle className="w-3 h-3 text-gray-400" />
                          )}
                          <span className="text-xs font-medium">{LIFECYCLE_STAGE_LABEL[stage]}</span>
                        </div>
                        <p className="text-lg font-bold">{stageStats?.total || 0}</p>
                        <p className="text-xs text-muted-foreground">sent</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Two-column: recent emails + email types */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Recent emails */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Recent Emails</CardTitle>
                    <button
                      onClick={() => setActiveTab('history')}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View all →
                    </button>
                  </div>
                  <CardDescription>Last 8 emails sent</CardDescription>
                </CardHeader>
                <CardContent>
                  {recentLogsData.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4 text-center">No emails sent yet</p>
                  ) : (
                    <div className="space-y-2">
                      {recentLogsData.map((log) => (
                        <div key={log.id} className="flex items-center justify-between gap-3 py-1.5 border-b last:border-0">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{log.subject}</p>
                            <p className="text-xs text-muted-foreground truncate">{log.recipient_email}</p>
                          </div>
                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${STATUS_BADGE[log.status] || 'bg-gray-100 text-gray-700'}`}>
                              {log.status}
                            </span>
                            <span className={`text-xs px-1.5 py-0.5 rounded ${TYPE_BADGE[log.email_type] || 'bg-gray-100 text-gray-700'}`}>
                              {log.email_type}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Breakdown */}
              <div className="space-y-4">
                {/* By type */}
                {stats && Object.keys(stats.by_type).length > 0 && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Emails by Type</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {Object.entries(stats.by_type)
                          .sort(([, a], [, b]) => (b as number) - (a as number))
                          .map(([type, count]) => (
                            <div key={type} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className={`text-xs px-1.5 py-0.5 rounded ${TYPE_BADGE[type] || 'bg-gray-100 text-gray-700'}`}>
                                  {type}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-24 bg-gray-100 rounded-full h-1.5">
                                  <div
                                    className="bg-blue-500 rounded-full h-1.5"
                                    style={{ width: `${stats.total > 0 ? Math.round(((count as number) / stats.total) * 100) : 0}%` }}
                                  />
                                </div>
                                <span className="text-sm text-muted-foreground w-8 text-right">{count as number}</span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Segment automations */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Segment Automations</CardTitle>
                      <button
                        onClick={() => setActiveTab('segments')}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Manage →
                      </button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {segmentsLoading ? (
                      <p className="text-sm text-muted-foreground">Loading...</p>
                    ) : activeSegmentAutomations.length === 0 ? (
                      <p className="text-sm text-muted-foreground py-2 text-center">No active segment automations</p>
                    ) : (
                      <div className="space-y-2">
                        {activeSegmentAutomations.slice(0, 5).map((seg: any) => (
                          <div key={seg.id} className="flex items-center justify-between py-1.5 border-b last:border-0">
                            <div>
                              <p className="text-sm font-medium">{seg.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {seg.automation_trigger === 'user_signup' ? 'On signup' : 'Inactivity'} · {seg.user_count || 0} users
                              </p>
                            </div>
                            <Badge variant="outline" className="text-xs border-green-200 text-green-700 bg-green-50">
                              Active
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* ── Lifecycle ── */}
          <TabsContent value="lifecycle">
            <EmailLifecycleView />
          </TabsContent>

          {/* ── Segments ── */}
          <TabsContent value="segments">
            <EmailSegmentsManager />
          </TabsContent>

          {/* ── History ── */}
          <TabsContent value="history">
            <EmailLogsView />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
