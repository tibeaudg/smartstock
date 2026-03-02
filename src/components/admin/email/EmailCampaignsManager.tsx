import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEmailCampaigns, useEmailCampaign } from '@/hooks/useEmailCampaigns';
import { useEmailTemplates } from '@/hooks/useEmailTemplates';
import { useEmailSegments } from '@/hooks/useEmailSegments';
import { Plus, Send, Play, Calendar, Users, FileText, Trash2, Edit } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

export function EmailCampaignsManager() {
  const { campaigns, createCampaign, updateCampaign, sendCampaign, deleteCampaign, isCreating, isSending, isDeleting, isUpdating } = useEmailCampaigns();
  const { templates } = useEmailTemplates();
  const { segments } = useEmailSegments();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    template_id: '',
    scheduled_at: '',
    recipient_type: 'all' as 'all' | 'segment' | 'manual',
    segment_id: '',
    recipient_user_ids: [] as string[],
    recipient_emails: [] as string[],
  });

  const { data: allUsers } = useQuery({
    queryKey: ['all-users-for-campaign'],
    queryFn: async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name')
        .not('email', 'is', null)
        .limit(1000);
      return data || [];
    },
  });

  const activeTemplates = templates.filter(t => t.is_active);

  const handleOpenDialog = (campaignId?: string) => {
    if (campaignId) {
      const campaign = campaigns.find(c => c.id === campaignId);
      if (campaign) {
        // Load campaign data for editing
        // Note: We'll need to fetch recipient_config from the database
        setFormData({
          name: campaign.name,
          template_id: campaign.template_id || '',
          scheduled_at: campaign.scheduled_at ? new Date(campaign.scheduled_at).toISOString().slice(0, 16) : '',
          recipient_type: (campaign as any).recipient_type || 'all',
          segment_id: (campaign as any).segment_id || '',
          recipient_user_ids: [],
          recipient_emails: [],
        });
        setSelectedCampaignId(campaignId);
      }
    } else {
      setFormData({
        name: '',
        template_id: '',
        scheduled_at: '',
        recipient_type: 'all',
        segment_id: '',
        recipient_user_ids: [],
        recipient_emails: [],
      });
      setSelectedCampaignId(null);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedCampaignId(null);
  };

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.template_id) {
      return;
    }

    if (selectedCampaignId) {
      // Update existing campaign
      // For now, we'll update basic fields. Full recipient reconfiguration would require
      // deleting and recreating recipients, which is complex. We'll update name, template, and schedule.
      updateCampaign({
        id: selectedCampaignId,
        updates: {
          name: formData.name,
          template_id: formData.template_id,
          scheduled_at: formData.scheduled_at || null,
          status: formData.scheduled_at ? 'scheduled' : 'draft',
        } as any,
      });
    } else {
      // Create new campaign
      createCampaign({
        name: formData.name,
        template_id: formData.template_id,
        scheduled_at: formData.scheduled_at || null,
        recipient_type: formData.recipient_type,
        segment_id: formData.recipient_type === 'segment' ? formData.segment_id : undefined,
        recipient_user_ids: formData.recipient_type === 'manual' ? formData.recipient_user_ids : undefined,
        recipient_emails: formData.recipient_type === 'manual' ? formData.recipient_emails : undefined,
      });
    }

    handleCloseDialog();
  };

  const handleSendCampaign = (campaignId: string) => {
    sendCampaign({ campaignId, batchSize: 10 });
  };

  const handleDelete = (id: string) => {
    deleteCampaign(id);
  };

  const toggleUserSelection = (userId: string) => {
    if (formData.recipient_user_ids.includes(userId)) {
      setFormData({
        ...formData,
        recipient_user_ids: formData.recipient_user_ids.filter(id => id !== userId),
      });
    } else {
      setFormData({
        ...formData,
        recipient_user_ids: [...formData.recipient_user_ids, userId],
      });
    }
  };

  const addEmail = () => {
    const email = prompt('Enter email address:');
    if (email && email.trim()) {
      setFormData({
        ...formData,
        recipient_emails: [...formData.recipient_emails, email.trim()],
      });
    }
  };

  const removeEmail = (email: string) => {
    setFormData({
      ...formData,
      recipient_emails: formData.recipient_emails.filter(e => e !== email),
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      completed: 'bg-green-100 text-green-700',
      sending: 'bg-blue-100 text-blue-700',
      scheduled: 'bg-yellow-100 text-yellow-700',
      draft: 'bg-gray-100 text-gray-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return variants[status] || 'bg-gray-100 text-gray-700';
  };

  const isAutomatedSignupCampaign = (campaign: any) => {
    const cfg = campaign?.recipient_config || {};
    return cfg?.automation_enabled === true && cfg?.automation_trigger === 'user_signup';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Email Campaigns</h2>
          <p className="text-sm text-muted-foreground">
            Create and manage email campaigns for bulk sending
          </p>
        </div>
        <Button onClick={handleOpenDialog}>
          <Plus className="w-4 h-4 mr-2" />
          New Campaign
        </Button>
      </div>

      {/* Campaigns List */}
      <div className="grid grid-cols-1 gap-4">
        {campaigns.map((campaign) => (
          <Card key={campaign.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{campaign.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {campaign.email_templates?.name || 'No template'}
                  </CardDescription>
                </div>
                <Badge className={getStatusBadge(campaign.status)}>
                  {campaign.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-xs text-muted-foreground">Recipients</p>
                  <p className="text-sm font-medium">{campaign.total_recipients}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Sent</p>
                  <p className="text-sm font-medium">{campaign.sent_count}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Delivered</p>
                  <p className="text-sm font-medium text-green-600">{campaign.delivered_count}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Failed</p>
                  <p className="text-sm font-medium text-red-600">{campaign.failed_count}</p>
                </div>
              </div>

              {campaign.scheduled_at && (
                <div className="mb-4">
                  <p className="text-xs text-muted-foreground">Scheduled for</p>
                  <p className="text-sm font-medium">
                    {format(new Date(campaign.scheduled_at), 'MMM d, yyyy HH:mm')}
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                {(campaign.status === 'draft' || campaign.status === 'scheduled') && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDialog(campaign.id)}
                      disabled={isUpdating}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    {!isAutomatedSignupCampaign(campaign) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSendCampaign(campaign.id)}
                        disabled={isSending}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        {campaign.status === 'scheduled' ? 'Send Now' : 'Send Campaign'}
                      </Button>
                    )}
                  </>
                )}
                {campaign.status === 'sending' && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDialog(campaign.id)}
                      disabled={isUpdating}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    {!isAutomatedSignupCampaign(campaign) ? (
                      <Button variant="outline" size="sm" disabled>
                        Sending...
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" disabled>
                        Automated
                      </Button>
                    )}
                  </>
                )}
                {(campaign.status === 'completed' || campaign.status === 'cancelled') && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenDialog(campaign.id)}
                    disabled={isUpdating}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    View/Edit
                  </Button>
                )}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Campaign</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{campaign.name}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(campaign.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}

        {campaigns.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No campaigns yet. Create your first campaign to get started.</p>
          </div>
        )}
      </div>

      {/* Create Campaign Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedCampaignId ? 'Edit Campaign' : 'Create New Campaign'}</DialogTitle>
            <DialogDescription>
              {selectedCampaignId 
                ? 'Update campaign settings. Note: Changing recipients requires recreating the campaign.'
                : 'Set up an email campaign with template and recipient selection'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="campaign-name">Campaign Name *</Label>
              <Input
                id="campaign-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Monthly Newsletter - January 2024"
              />
            </div>

            <div>
              <Label htmlFor="campaign-template">Template *</Label>
              <Select
                value={formData.template_id}
                onValueChange={(value) => setFormData({ ...formData, template_id: value })}
              >
                <SelectTrigger id="campaign-template">
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  {activeTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name} ({template.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Tabs value={formData.recipient_type} onValueChange={(value: any) => setFormData({ ...formData, recipient_type: value })}>
              <TabsList>
                <TabsTrigger value="all">All Users</TabsTrigger>
                <TabsTrigger value="segment">Segment</TabsTrigger>
                <TabsTrigger value="manual">Manual</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Send to all users in the system
                </p>
              </TabsContent>

              <TabsContent value="segment" className="space-y-2">
                <Label>Select Segment</Label>
                <Select
                  value={formData.segment_id}
                  onValueChange={(value) => setFormData({ ...formData, segment_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a segment" />
                  </SelectTrigger>
                  <SelectContent>
                    {segments.map((segment) => (
                      <SelectItem key={segment.id} value={segment.id}>
                        {segment.name} ({segment.user_count} users)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TabsContent>

              <TabsContent value="manual" className="space-y-4">
                <div>
                  <Label>Select Users</Label>
                  <div className="mt-2 border rounded-md max-h-60 overflow-y-auto p-2">
                    {allUsers && allUsers.length > 0 ? (
                      <div className="space-y-2">
                        {allUsers.map((user: any) => (
                          <div key={user.id} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={formData.recipient_user_ids.includes(user.id)}
                              onChange={() => toggleUserSelection(user.id)}
                              className="rounded"
                            />
                            <label className="text-sm cursor-pointer">
                              {user.email} {user.first_name && `(${user.first_name} ${user.last_name || ''})`}
                            </label>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No users available</p>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Email Addresses</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addEmail}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Email
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {formData.recipient_emails.map((email, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">{email}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeEmail(email)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    {formData.recipient_emails.length === 0 && (
                      <p className="text-sm text-muted-foreground">No emails added</p>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div>
              <Label htmlFor="campaign-schedule">Schedule (Optional)</Label>
              <Input
                id="campaign-schedule"
                type="datetime-local"
                value={formData.scheduled_at}
                onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Leave empty to send immediately when campaign is started
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={(isCreating || isUpdating) || !formData.name.trim() || !formData.template_id}>
                {isCreating ? 'Creating...' : isUpdating ? 'Updating...' : selectedCampaignId ? 'Update Campaign' : 'Create Campaign'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
