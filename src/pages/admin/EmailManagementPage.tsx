import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Mail, Send, History, BarChart3, UserPlus, Sparkles } from 'lucide-react';
import { useEmailLogs, useEmailLogStats } from '@/hooks/useEmailLogs';
import { useEmailSegments } from '@/hooks/useEmailSegments';
import { useEmailTemplates } from '@/hooks/useEmailTemplates';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import SEO from '@/components/SEO';
import AdminSmtpPage from '@/pages/AdminSmtpPage';
import { EmailLogsView } from '@/components/admin/email/EmailLogsView';
import { EmailSegmentsManager } from '@/components/admin/email/EmailSegmentsManager';

export default function EmailManagementPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isNewAccountsDialogOpen, setIsNewAccountsDialogOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [timeRange, setTimeRange] = useState('1'); // hours
  const [isSending, setIsSending] = useState(false);
  const { data: stats } = useEmailLogStats();
  const { segments, isLoading: segmentsLoading } = useEmailSegments();
  const { templates } = useEmailTemplates();
  const { data: recentLogs } = useEmailLogs({});

  const recentLogsData = recentLogs?.slice(0, 10) || [];
  const activeSegmentAutomations = segments.filter(s => (s as any).automation_enabled === true);
  const recentSegmentSends = (recentLogs || []).filter((log: any) => log.metadata?.segment_id).slice(0, 5);
  const welcomeTemplates = templates.filter(t => t.type === 'welcome' && t.is_active);

  const handleSendToNewAccounts = async () => {
    if (!selectedTemplateId) {
      toast.error('Please select a template');
      return;
    }

    setIsSending(true);

    try {
      // Calculate the cutoff time
      const hoursAgo = parseInt(timeRange);
      const cutoffTime = new Date();
      cutoffTime.setHours(cutoffTime.getHours() - hoursAgo);

      // Get users who registered within the time range
      const { data: newUsers, error: usersError } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name, created_at')
        .gte('created_at', cutoffTime.toISOString())
        .not('email', 'is', null);

      if (usersError) {
        throw usersError;
      }

      if (!newUsers || newUsers.length === 0) {
        toast.info('No new accounts found in the selected time range');
        setIsNewAccountsDialogOpen(false);
        setIsSending(false);
        return;
      }

      // Get the selected template
      const template = templates.find(t => t.id === selectedTemplateId);
      if (!template) {
        toast.error('Template not found');
        setIsSending(false);
        return;
      }

      // Send emails to all new users
      let successCount = 0;
      let failCount = 0;

      for (const user of newUsers) {
        try {
          const variables = {
            user_name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email.split('@')[0],
            user_email: user.email,
            first_name: user.first_name || '',
            last_name: user.last_name || '',
            organization_name: '',
          };

          const subject = template.subject.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key) => {
            return variables[key as keyof typeof variables] || match;
          });

          const htmlBody = template.html_body.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key) => {
            return variables[key as keyof typeof variables] || match;
          });

          const { data, error } = await supabase.functions.invoke('send-email', {
            body: {
              toEmail: user.email,
              subject,
              htmlBody,
              textBody: template.text_body,
              emailType: 'welcome',
              templateId: template.id,
              recipientUserId: user.id,
              variables,
            },
          });

          if (error || !data?.success) {
            console.error(`Failed to send to ${user.email}:`, error || data?.error);
            failCount++;
          } else {
            successCount++;
          }
        } catch (error) {
          console.error(`Error sending to ${user.email}:`, error);
          failCount++;
        }
      }

      if (successCount > 0) {
        toast.success(`Welcome emails sent to ${successCount} new account${successCount !== 1 ? 's' : ''}`);
      }
      if (failCount > 0) {
        toast.error(`Failed to send to ${failCount} account${failCount !== 1 ? 's' : ''}`);
      }

      setIsNewAccountsDialogOpen(false);
      setSelectedTemplateId('');
    } catch (error) {
      console.error('Error sending to new accounts:', error);
      toast.error('Failed to send emails to new accounts');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <SEO
        title="Email Management | Admin"
        description="Manage all outgoing emails, templates, campaigns, and track email delivery."
        url="https://www.stockflowsystems.com/admin/emails"
      />
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Email Management</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage all outgoing emails from the platform including welcome emails, newsletters, follow-ups, and support.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="segments">Segments</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="space-y-6">
            <AdminSmtpPage />
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  Quick Actions
                </CardTitle>
                <CardDescription>Send emails to specific user groups quickly</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Dialog open={isNewAccountsDialogOpen} onOpenChange={setIsNewAccountsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-green-600 hover:bg-green-700">
                        <UserPlus className="w-4 h-4 mr-2" />
                        New Accounts
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Send Welcome Email to New Accounts</DialogTitle>
                        <DialogDescription>
                          Send a welcome email to users who just registered. Select the time range and template.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div>
                          <Label htmlFor="time-range">Accounts Registered In Last</Label>
                          <Select value={timeRange} onValueChange={setTimeRange}>
                            <SelectTrigger id="time-range">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">Last 1 hour</SelectItem>
                              <SelectItem value="6">Last 6 hours</SelectItem>
                              <SelectItem value="12">Last 12 hours</SelectItem>
                              <SelectItem value="24">Last 24 hours</SelectItem>
                              <SelectItem value="48">Last 48 hours</SelectItem>
                              <SelectItem value="72">Last 3 days</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="welcome-template">Welcome Email Template *</Label>
                          <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId}>
                            <SelectTrigger id="welcome-template">
                              <SelectValue placeholder="Select a welcome template" />
                            </SelectTrigger>
                            <SelectContent>
                              {welcomeTemplates.length === 0 ? (
                                <SelectItem value="none" disabled>No welcome templates available</SelectItem>
                              ) : (
                                welcomeTemplates.map((template) => (
                                  <SelectItem key={template.id} value={template.id}>
                                    {template.name}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                          {welcomeTemplates.length === 0 && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Create a welcome template in the Segments tab when creating a segment
                            </p>
                          )}
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                          <Button variant="outline" onClick={() => setIsNewAccountsDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button 
                            onClick={handleSendToNewAccounts} 
                            disabled={isSending || !selectedTemplateId || welcomeTemplates.length === 0}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {isSending ? (
                              <>
                                <Send className="w-4 h-4 mr-2 animate-spin" />
                                Sending...
                              </>
                            ) : (
                              <>
                                <Send className="w-4 h-4 mr-2" />
                                Send Welcome Emails
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Emails</CardTitle>
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.total || 0}</div>
                  <p className="text-xs text-muted-foreground">All time</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Delivered</CardTitle>
                  <BarChart3 className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats?.delivered || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats?.total ? `${Math.round((stats.delivered / stats.total) * 100)}% delivery rate` : '0% delivery rate'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Failed</CardTitle>
                  <BarChart3 className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{stats?.failed || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats?.total ? `${Math.round((stats.failed / stats.total) * 100)}% failure rate` : '0% failure rate'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Segment Automations</CardTitle>
                  <Send className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{activeSegmentAutomations.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {segmentsLoading ? 'Loading...' : `${segments.length} total segments`}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Email Types Breakdown */}
            {stats && Object.keys(stats.by_type).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Emails by Type</CardTitle>
                  <CardDescription>Distribution of emails sent by type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(stats.by_type).map(([type, count]) => (
                      <div key={type} className="flex items-center justify-between">
                        <span className="text-sm font-medium capitalize">{type}</span>
                        <span className="text-sm text-muted-foreground">{count as number}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Emails</CardTitle>
                  <CardDescription>Last 10 sent emails</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentLogsData.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No emails sent yet</p>
                    ) : (
                      recentLogsData.map((log) => (
                        <div key={log.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                          <div className="flex-1">
                            <p className="text-sm font-medium">{log.subject}</p>
                            <p className="text-xs text-muted-foreground">{log.recipient_email}</p>
                          </div>
                          <div className="text-right">
                            <span className={`text-xs px-2 py-1 rounded ${
                              log.status === 'delivered' ? 'bg-green-100 text-green-700' :
                              log.status === 'failed' ? 'bg-red-100 text-red-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {log.status}
                            </span>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(log.sent_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Segment Automations</CardTitle>
                  <CardDescription>Latest emails sent via segment automations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentSegmentSends.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No segment automation emails yet</p>
                    ) : (
                      recentSegmentSends.map((log: any) => (
                        <div key={log.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                          <div className="flex-1">
                            <p className="text-sm font-medium">{log.subject}</p>
                            <p className="text-xs text-muted-foreground">
                              {log.recipient_email} • {log.metadata?.segment_name || 'Segment'}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`text-xs px-2 py-1 rounded ${
                              log.status === 'delivered' ? 'bg-green-100 text-green-700' :
                              log.status === 'failed' ? 'bg-red-100 text-red-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {log.status}
                            </span>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(log.sent_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="segments">
            <EmailSegmentsManager />
          </TabsContent>

          <TabsContent value="history">
            <EmailLogsView />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
