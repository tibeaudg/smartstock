import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Clock, UserCheck, RefreshCcw, AlertTriangle, AlertOctagon, Play, PlayCircle,
  CheckCircle2, XCircle, Info, Zap, ChevronRight
} from 'lucide-react';
import { useLifecycleEmails, LifecycleStage, ALL_LIFECYCLE_STAGES } from '@/hooks/useLifecycleEmails';
import { useEmailTemplates } from '@/hooks/useEmailTemplates';
import { useSmtpSettings } from '@/hooks/useSmtpSettings';
import { format } from 'date-fns';

interface StageDefinition {
  id: LifecycleStage;
  name: string;
  description: string;
  triggerWindow: string;
  emailType: 'lifecycle' | 'deletion_warning';
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
}

const STAGE_DEFS: StageDefinition[] = [
  {
    id: '24h_nudge',
    name: '24-Hour Nudge',
    description: 'Sent to users who signed up but never returned after account creation.',
    triggerWindow: '24h+ after signup with no real activity',
    emailType: 'lifecycle',
    icon: <Clock className="w-4 h-4" />,
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  {
    id: '7d_inactive',
    name: '7-Day Re-engage',
    description: "Gently reminds users who haven't logged in for a week.",
    triggerWindow: '7+ days since last login',
    emailType: 'lifecycle',
    icon: <UserCheck className="w-4 h-4" />,
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
  },
  {
    id: '14d_inactive',
    name: '14-Day Follow-up',
    description: 'A softer touch for users inactive for two weeks.',
    triggerWindow: '14+ days since last login',
    emailType: 'lifecycle',
    icon: <RefreshCcw className="w-4 h-4" />,
    color: 'text-violet-700',
    bgColor: 'bg-violet-50',
    borderColor: 'border-violet-200',
  },
  {
    id: '25d_warning',
    name: '5-Day Deletion Warning',
    description: 'Critical notice: account will be deleted in 5 days.',
    triggerWindow: '25+ days since last login',
    emailType: 'deletion_warning',
    icon: <AlertTriangle className="w-4 h-4" />,
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
  },
  {
    id: '29d_final_warning',
    name: 'Final Deletion Warning',
    description: 'Last chance notice sent the day before auto-deletion.',
    triggerWindow: '29+ days since last login',
    emailType: 'deletion_warning',
    icon: <AlertOctagon className="w-4 h-4" />,
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
];

const STAGE_LABEL: Record<LifecycleStage, string> = {
  '24h_nudge': '24-Hour Nudge',
  '7d_inactive': '7-Day Re-engage',
  '14d_inactive': '14-Day Follow-up',
  '25d_warning': '5-Day Warning',
  '29d_final_warning': 'Final Warning',
};

export function EmailLifecycleView() {
  const { settingsMap, statsMap, isLoading, getEffectiveSetting, updateSetting, isSaving, triggerLifecycle, isTriggering, triggeringStage } = useLifecycleEmails();
  const { templates } = useEmailTemplates();
  const { isConfigured } = useSmtpSettings();
  const [expandedStage, setExpandedStage] = useState<LifecycleStage | null>(null);

  const totalSent = ALL_LIFECYCLE_STAGES.reduce((acc, s) => acc + (statsMap.get(s)?.total || 0), 0);
  const totalFailed = ALL_LIFECYCLE_STAGES.reduce((acc, s) => acc + (statsMap.get(s)?.failed || 0), 0);
  const enabledCount = ALL_LIFECYCLE_STAGES.filter((s) => getEffectiveSetting(s).enabled).length;
  const deliveryRate = totalSent > 0 ? Math.round(((totalSent - totalFailed) / totalSent) * 100) : 0;

  const eligibleTemplates = (type: 'lifecycle' | 'deletion_warning') =>
    templates.filter((t) => t.type === type || t.type === 'custom');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Lifecycle Email Automation</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Automatically engage users at every stage of their journey — from signup through re-engagement to deletion warnings.
          </p>
        </div>
        <Button
          onClick={() => triggerLifecycle(undefined)}
          disabled={isTriggering || !isConfigured}
          className="bg-blue-600 hover:bg-blue-700 shrink-0"
        >
          {isTriggering && !triggeringStage ? (
            <><RefreshCcw className="w-4 h-4 mr-2 animate-spin" />Running...</>
          ) : (
            <><PlayCircle className="w-4 h-4 mr-2" />Run All Stages</>
          )}
        </Button>
      </div>

      {/* SMTP warning */}
      {!isConfigured && (
        <Alert className="border-amber-200 bg-amber-50">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            SMTP is not configured. Go to the <strong>Settings</strong> tab to configure your email server before lifecycle emails can be sent.
          </AlertDescription>
        </Alert>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground">Stages enabled</p>
            <p className="text-2xl font-bold mt-1">{enabledCount} <span className="text-sm font-normal text-muted-foreground">/ 5</span></p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground">Total lifecycle emails</p>
            <p className="text-2xl font-bold mt-1">{totalSent}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground">Delivery rate</p>
            <p className={`text-2xl font-bold mt-1 ${deliveryRate >= 90 ? 'text-green-600' : deliveryRate >= 70 ? 'text-amber-600' : 'text-red-600'}`}>
              {deliveryRate}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground">SMTP status</p>
            <div className="flex items-center gap-1.5 mt-1">
              {isConfigured ? (
                <><CheckCircle2 className="w-4 h-4 text-green-600" /><span className="text-sm font-medium text-green-700">Configured</span></>
              ) : (
                <><XCircle className="w-4 h-4 text-red-500" /><span className="text-sm font-medium text-red-600">Not configured</span></>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Welcome email note */}
      <Alert className="border-blue-200 bg-blue-50">
        <Info className="w-4 h-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Welcome email (Day 0)</strong> is managed via the <strong>Segments</strong> tab. Create a segment with <em>user_signup</em> automation trigger to automatically send a welcome email when users sign up.
        </AlertDescription>
      </Alert>

      {/* Pipeline flow */}
      <div className="hidden md:flex items-center gap-1 overflow-x-auto pb-2">
        {STAGE_DEFS.map((stage, i) => (
          <React.Fragment key={stage.id}>
            <div className={`flex items-center gap-1.5 px-3 py-2 rounded-md border text-xs font-medium ${stage.bgColor} ${stage.borderColor} ${stage.color} shrink-0`}>
              {stage.icon}
              {stage.name}
              {getEffectiveSetting(stage.id).enabled ? (
                <CheckCircle2 className="w-3 h-3 text-green-600 ml-1" />
              ) : (
                <XCircle className="w-3 h-3 text-gray-400 ml-1" />
              )}
            </div>
            {i < STAGE_DEFS.length - 1 && (
              <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Stage cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {STAGE_DEFS.map((stageDef) => {
          const setting = getEffectiveSetting(stageDef.id);
          const stats = statsMap.get(stageDef.id);
          const isCurrentlyTriggering = isTriggering && triggeringStage === stageDef.id;
          const isExpanded = expandedStage === stageDef.id;

          return (
            <Card
              key={stageDef.id}
              className={`border-l-4 transition-shadow hover:shadow-md ${stageDef.borderColor} ${!setting.enabled ? 'opacity-60' : ''}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className={`p-1.5 rounded-md ${stageDef.bgColor} ${stageDef.color} shrink-0`}>
                      {stageDef.icon}
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="text-sm font-semibold leading-tight">{stageDef.name}</CardTitle>
                      <Badge
                        variant="outline"
                        className={`text-xs mt-0.5 ${stageDef.emailType === 'deletion_warning' ? 'border-red-200 text-red-600' : 'border-indigo-200 text-indigo-600'}`}
                      >
                        {stageDef.emailType === 'deletion_warning' ? 'Deletion warning' : 'Lifecycle'}
                      </Badge>
                    </div>
                  </div>
                  <Switch
                    checked={setting.enabled}
                    onCheckedChange={(checked) =>
                      updateSetting({ stage: stageDef.id, enabled: checked, template_id: setting.template_id })
                    }
                    disabled={isSaving}
                  />
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <p className="text-xs text-muted-foreground">{stageDef.description}</p>

                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Zap className="w-3 h-3" />
                  <span>{stageDef.triggerWindow}</span>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-green-600" />
                    <strong>{stats?.sent || 0}</strong> sent
                  </span>
                  {(stats?.failed || 0) > 0 && (
                    <span className="flex items-center gap-1">
                      <XCircle className="w-3 h-3 text-red-500" />
                      <strong>{stats.failed}</strong> failed
                    </span>
                  )}
                  {stats?.last_sent_at && (
                    <span className="text-muted-foreground">
                      Last: {format(new Date(stats.last_sent_at), 'MMM d')}
                    </span>
                  )}
                </div>

                {/* Template selector */}
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">Template</Label>
                  <Select
                    value={setting.template_id || '_default'}
                    onValueChange={(val) =>
                      updateSetting({
                        stage: stageDef.id,
                        enabled: setting.enabled,
                        template_id: val === '_default' ? null : val,
                      })
                    }
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="_default">
                        <span className="text-muted-foreground">Default template</span>
                      </SelectItem>
                      {eligibleTemplates(stageDef.emailType).map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Trigger button */}
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full h-8 text-xs"
                  onClick={() => triggerLifecycle(stageDef.id)}
                  disabled={isTriggering || !isConfigured || !setting.enabled}
                >
                  {isCurrentlyTriggering ? (
                    <><RefreshCcw className="w-3 h-3 mr-1.5 animate-spin" />Running...</>
                  ) : (
                    <><Play className="w-3 h-3 mr-1.5" />Trigger Now</>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* How it works info */}
      <Card className="bg-gray-50 border-gray-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Info className="w-4 h-4 text-gray-500" />
            How lifecycle emails work
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground space-y-1.5">
          <p>• Each stage fires <strong>once per user</strong> — users won't receive the same stage email twice, even across multiple runs.</p>
          <p>• <strong>Run All Stages</strong> processes all 5 stages in a single pass. Ideal as a daily scheduled job.</p>
          <p>• <strong>Trigger Now</strong> on a specific card lets you test a stage without affecting others.</p>
          <p>• If no custom template is selected, a professional default template is used automatically.</p>
          <p>• All sent emails appear in the <strong>History</strong> tab under types "lifecycle" or "deletion_warning".</p>
          <p>• Account auto-deletion runs at <strong>30 days</strong> of inactivity. The 25d and 29d warnings give users a chance to log back in.</p>
        </CardContent>
      </Card>
    </div>
  );
}
