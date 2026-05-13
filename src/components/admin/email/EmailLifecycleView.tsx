import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Clock, UserCheck, RefreshCcw, AlertTriangle, AlertOctagon, Play, PlayCircle,
  CheckCircle2, XCircle, Info, Zap, ChevronRight, Mail, Pencil, Save, X, Eye,
} from 'lucide-react';
import { useLifecycleEmails, LifecycleStage, ALL_LIFECYCLE_STAGES } from '@/hooks/useLifecycleEmails';
import { useEmailTemplates } from '@/hooks/useEmailTemplates';
import { useSmtpSettings } from '@/hooks/useSmtpSettings';
import { RichTextEditor } from '@/components/RichTextEditor';
import { format } from 'date-fns';
import { toast } from 'sonner';

// ── Stage definitions ──────────────────────────────────────────────────────

interface StageDefinition {
  id: LifecycleStage;
  name: string;
  description: string;
  triggerWindow: string;
  templateType: 'welcome' | 'lifecycle' | 'deletion_warning';
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  defaultSubject: string;
  defaultHtml: string;
}

const STAGE_DEFS: StageDefinition[] = [
  {
    id: 'welcome',
    name: 'Welcome Email',
    description: 'Sent immediately when a new user signs up. Introduces the product and links to first steps.',
    triggerWindow: 'Day 0 — on signup (auto-triggered)',
    templateType: 'welcome',
    icon: <Mail className="w-4 h-4" />,
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-300',
    defaultSubject: 'Welcome to StockFlow, {{first_name}}!',
    defaultHtml: `<p>Hi {{first_name}},</p>
<p>Welcome to StockFlow! Your account is ready and we're excited to help you take control of your inventory.</p>
<p>Here's how to get started:</p>
<ol>
  <li><strong>Add your first product</strong> — Go to Products and add your inventory items</li>
  <li><strong>Set up a location</strong> — Create warehouses or storage locations</li>
  <li><strong>Invite your team</strong> — Add staff members under Settings → Users</li>
</ol>
<p><a href="https://stockflowsystems.com/dashboard">Log in and get started →</a></p>
<p>Questions? Just reply to this email — we're happy to help.</p>`,
  },
  {
    id: '24h_nudge',
    name: '24-Hour Nudge',
    description: 'Sent to users who signed up but never returned after account creation.',
    triggerWindow: '24h+ after signup with no real activity',
    templateType: 'lifecycle',
    icon: <Clock className="w-4 h-4" />,
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    defaultSubject: 'Get started with StockFlow — your account is ready',
    defaultHtml: `<p>Hi {{first_name}},</p>
<p>You created your StockFlow account but haven't had a chance to explore yet.</p>
<p>Getting started takes less than 5 minutes:</p>
<ul>
  <li>Add your first product to the inventory</li>
  <li>Set up a warehouse or storage location</li>
  <li>Invite a team member</li>
</ul>
<p><a href="https://stockflowsystems.com/dashboard">Log in and get started →</a></p>`,
  },
  {
    id: '7d_inactive',
    name: '7-Day Re-engage',
    description: "Gently reminds users who haven't logged in for a week.",
    triggerWindow: '7+ days since last login',
    templateType: 'lifecycle',
    icon: <UserCheck className="w-4 h-4" />,
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    defaultSubject: 'We miss you at StockFlow',
    defaultHtml: `<p>Hi {{first_name}},</p>
<p>It's been a week since your last visit. We wanted to check in.</p>
<p>StockFlow helps you:</p>
<ul>
  <li>Track stock levels in real-time across all locations</li>
  <li>Generate purchase orders automatically when stock runs low</li>
  <li>Reduce stockouts and overstocking by up to 30%</li>
</ul>
<p><a href="https://stockflowsystems.com/dashboard">Come back and pick up where you left off →</a></p>`,
  },
  {
    id: '14d_inactive',
    name: '14-Day Follow-up',
    description: 'A softer touch for users inactive for two weeks.',
    triggerWindow: '14+ days since last login',
    templateType: 'lifecycle',
    icon: <RefreshCcw className="w-4 h-4" />,
    color: 'text-violet-700',
    bgColor: 'bg-violet-50',
    borderColor: 'border-violet-200',
    defaultSubject: 'Your StockFlow account is still here for you',
    defaultHtml: `<p>Hi {{first_name}},</p>
<p>It's been two weeks. Life gets busy — we completely understand.</p>
<p>When you're ready, StockFlow will be here to help you take control of your inventory.</p>
<p>Not finding what you need? Reply to this email and tell us what's missing — we read every response.</p>
<p><a href="https://stockflowsystems.com/dashboard">Log back in →</a></p>`,
  },
  {
    id: '25d_warning',
    name: '5-Day Deletion Warning',
    description: 'Critical notice: account will be deleted in 5 days.',
    triggerWindow: '25+ days since last login',
    templateType: 'deletion_warning',
    icon: <AlertTriangle className="w-4 h-4" />,
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    defaultSubject: 'Action required: Your account will be deleted in 5 days',
    defaultHtml: `<p>Hi {{first_name}},</p>
<p><strong>Important notice:</strong> Your StockFlow account (<strong>{{user_email}}</strong>) has been inactive for 25 days and will be automatically deleted in <strong>5 days</strong>.</p>
<p>To keep your account, simply log in at <a href="https://stockflowsystems.com/dashboard">stockflowsystems.com</a>.</p>
<p>If you'd like to export your data before deletion, log in and go to <strong>Settings → Export Data</strong>.</p>`,
  },
  {
    id: '29d_final_warning',
    name: 'Final Deletion Warning',
    description: 'Last chance notice sent the day before auto-deletion.',
    triggerWindow: '29+ days since last login',
    templateType: 'deletion_warning',
    icon: <AlertOctagon className="w-4 h-4" />,
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    defaultSubject: 'Final notice: Your account will be deleted tomorrow',
    defaultHtml: `<p>Hi {{first_name}},</p>
<p><strong>Final notice:</strong> Your StockFlow account will be <strong>permanently deleted tomorrow</strong> due to 29 days of inactivity.</p>
<p>To prevent deletion, log in now: <a href="https://stockflowsystems.com/dashboard">stockflowsystems.com</a></p>
<p>After deletion, your account and all associated data cannot be recovered.</p>`,
  },
];

// ── Inline template editor ─────────────────────────────────────────────────

interface TemplateEditorProps {
  stageDef: StageDefinition;
  currentTemplateId: string | null;
  onSaved: (templateId: string) => void;
  onClose: () => void;
}

const VARIABLES = ['first_name', 'last_name', 'user_name', 'user_email', 'organization_name'];

const SAMPLE: Record<string, string> = {
  first_name: 'Jane', last_name: 'Smith', user_name: 'Jane Smith',
  user_email: 'jane@example.com', organization_name: 'Acme Corp',
};

function TemplateEditor({ stageDef, currentTemplateId, onSaved, onClose }: TemplateEditorProps) {
  const { templates, createTemplate, updateTemplate, isCreating, isUpdating } = useEmailTemplates();
  const existingTemplate = currentTemplateId ? templates.find((t) => t.id === currentTemplateId) ?? null : null;

  const [subject, setSubject] = useState(existingTemplate?.subject ?? stageDef.defaultSubject);
  const [html, setHtml] = useState(existingTemplate?.html_body ?? stageDef.defaultHtml);
  const [text, setText] = useState(existingTemplate?.text_body ?? '');
  const [previewHtml, setPreviewHtml] = useState('');

  // Re-init when the resolved template changes (async load)
  useEffect(() => {
    if (existingTemplate) {
      setSubject(existingTemplate.subject);
      setHtml(existingTemplate.html_body ?? stageDef.defaultHtml);
      setText(existingTemplate.text_body ?? '');
    }
  }, [existingTemplate?.id]);

  const isSaving = isCreating || isUpdating;

  const handleSave = () => {
    if (!subject.trim() || !html.trim()) {
      toast.error('Subject and HTML body are required');
      return;
    }
    const payload = {
      name: `${stageDef.name} — auto`,
      type: stageDef.templateType as any,
      subject: subject.trim(),
      html_body: html,
      text_body: text || undefined,
      is_active: true,
    };
    if (existingTemplate) {
      updateTemplate({ id: existingTemplate.id, template: payload }, {
        onSuccess: () => onSaved(existingTemplate.id),
      });
    } else {
      createTemplate(payload, {
        onSuccess: (data: any) => { if (data?.id) onSaved(data.id); },
      });
    }
  };

  const generatePreview = () => {
    let p = html;
    Object.entries(SAMPLE).forEach(([k, v]) => {
      p = p.replace(new RegExp(`{{\\s*${k}\\s*}}`, 'g'), v);
    });
    setPreviewHtml(p);
  };

  return (
    <div className="border-t border-gray-200 bg-gray-50 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-700">
          {existingTemplate ? 'Edit Template' : 'Create Template'}
        </p>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          {VARIABLES.map((v) => (
            <code key={v} className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-gray-600">{`{{${v}}}`}</code>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-xs text-gray-600">Subject *</Label>
        <Input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Email subject line"
          className="mt-1 text-sm"
        />
      </div>

      <Tabs defaultValue="html" className="w-full">
        <TabsList className="h-8">
          <TabsTrigger value="html" className="text-xs h-7">HTML Body *</TabsTrigger>
          <TabsTrigger value="text" className="text-xs h-7">Plain Text</TabsTrigger>
          <TabsTrigger value="preview" className="text-xs h-7">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="html" className="mt-2">
          <RichTextEditor
            key={existingTemplate?.id ?? `new-${stageDef.id}`}
            content={html}
            onChange={setHtml}
          />
        </TabsContent>
        <TabsContent value="text" className="mt-2">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Plain text version (optional — auto-generated from HTML if blank)"
            rows={6}
            className="text-sm"
          />
        </TabsContent>
        <TabsContent value="preview" className="mt-2">
          <div className="border rounded-md p-4 bg-white min-h-[120px]">
            <Button size="sm" variant="outline" onClick={generatePreview} className="mb-3 h-7 text-xs">
              <Eye className="w-3 h-3 mr-1.5" />
              Generate Preview
            </Button>
            {previewHtml ? (
              <div className="prose max-w-none text-sm" dangerouslySetInnerHTML={{ __html: previewHtml }} />
            ) : (
              <p className="text-sm text-muted-foreground">Click Generate Preview to see the email with sample data.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2 pt-1">
        <Button variant="outline" size="sm" onClick={onClose} className="h-8 text-xs">
          <X className="w-3 h-3 mr-1" />
          Cancel
        </Button>
        <Button size="sm" onClick={handleSave} disabled={isSaving} className="h-8 text-xs bg-blue-600 hover:bg-blue-700">
          <Save className="w-3 h-3 mr-1" />
          {isSaving ? 'Saving…' : existingTemplate ? 'Save Changes' : 'Create & Use Template'}
        </Button>
      </div>
    </div>
  );
}

// ── Main lifecycle view ────────────────────────────────────────────────────

export function EmailLifecycleView() {
  const {
    statsMap, isLoading, getEffectiveSetting, updateSetting, isSaving,
    triggerLifecycle, isTriggering, triggeringStage,
  } = useLifecycleEmails();
  const { templates } = useEmailTemplates();
  const { isConfigured } = useSmtpSettings();
  const [editingStage, setEditingStage] = useState<LifecycleStage | null>(null);

  const totalSent = ALL_LIFECYCLE_STAGES.reduce((acc, s) => acc + (statsMap.get(s)?.total || 0), 0);
  const totalFailed = ALL_LIFECYCLE_STAGES.reduce((acc, s) => acc + (statsMap.get(s)?.failed || 0), 0);
  const enabledCount = ALL_LIFECYCLE_STAGES.filter((s) => getEffectiveSetting(s).enabled).length;
  const deliveryRate = totalSent > 0 ? Math.round(((totalSent - totalFailed) / totalSent) * 100) : 0;

  const resolveTemplateName = (templateId: string | null) =>
    templateId ? (templates.find((t) => t.id === templateId)?.name ?? 'Custom template') : null;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Lifecycle Email Automation</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Every email in the user journey — from welcome to deletion warnings — managed in one place.
          </p>
        </div>
        <Button
          onClick={() => triggerLifecycle(undefined)}
          disabled={isTriggering || !isConfigured}
          className="bg-blue-600 hover:bg-blue-700 shrink-0"
        >
          {isTriggering && !triggeringStage ? (
            <><RefreshCcw className="w-4 h-4 mr-2 animate-spin" />Running…</>
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
            SMTP is not configured. Go to the <strong>Settings</strong> tab to set up your email server before any emails can be sent.
          </AlertDescription>
        </Alert>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="pt-4 pb-4">
          <p className="text-xs text-muted-foreground">Stages enabled</p>
          <p className="text-2xl font-bold mt-1">{enabledCount} <span className="text-sm font-normal text-muted-foreground">/ {ALL_LIFECYCLE_STAGES.length}</span></p>
        </CardContent></Card>
        <Card><CardContent className="pt-4 pb-4">
          <p className="text-xs text-muted-foreground">Total emails sent</p>
          <p className="text-2xl font-bold mt-1">{totalSent}</p>
        </CardContent></Card>
        <Card><CardContent className="pt-4 pb-4">
          <p className="text-xs text-muted-foreground">Delivery rate</p>
          <p className={`text-2xl font-bold mt-1 ${deliveryRate >= 90 ? 'text-green-600' : deliveryRate >= 70 ? 'text-amber-600' : 'text-red-600'}`}>
            {deliveryRate}%
          </p>
        </CardContent></Card>
        <Card><CardContent className="pt-4 pb-4">
          <p className="text-xs text-muted-foreground">SMTP status</p>
          <div className="flex items-center gap-1.5 mt-1">
            {isConfigured ? (
              <><CheckCircle2 className="w-4 h-4 text-green-600" /><span className="text-sm font-medium text-green-700">Configured</span></>
            ) : (
              <><XCircle className="w-4 h-4 text-red-500" /><span className="text-sm font-medium text-red-600">Not configured</span></>
            )}
          </div>
        </CardContent></Card>
      </div>

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

      {/* Stage list — accordion layout with inline template editor */}
      <div className="space-y-3">
        {STAGE_DEFS.map((stageDef) => {
          const setting = getEffectiveSetting(stageDef.id);
          const stats = statsMap.get(stageDef.id);
          const isCurrentlyTriggering = isTriggering && triggeringStage === stageDef.id;
          const isEditing = editingStage === stageDef.id;
          const templateName = resolveTemplateName(setting.template_id);

          return (
            <div
              key={stageDef.id}
              className={`rounded-xl border-l-4 border border-gray-200 overflow-hidden transition-shadow ${stageDef.borderColor} ${!setting.enabled ? 'opacity-60' : 'hover:shadow-sm'}`}
            >
              {/* Stage row */}
              <div className="flex items-start gap-4 p-4 bg-white">

                {/* Icon + info */}
                <div className={`p-2 rounded-lg ${stageDef.bgColor} ${stageDef.color} shrink-0 mt-0.5`}>
                  {stageDef.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-gray-900">{stageDef.name}</span>
                    <Badge
                      variant="outline"
                      className={`text-xs ${stageDef.templateType === 'deletion_warning' ? 'border-red-200 text-red-600' : stageDef.templateType === 'welcome' ? 'border-emerald-200 text-emerald-700' : 'border-indigo-200 text-indigo-600'}`}
                    >
                      {stageDef.templateType === 'deletion_warning' ? 'Deletion warning' : stageDef.templateType === 'welcome' ? 'Welcome' : 'Lifecycle'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{stageDef.description}</p>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                    <Zap className="w-3 h-3" />
                    <span>{stageDef.triggerWindow}</span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-xs mt-2">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-green-600" />
                      <strong>{stats?.total || 0}</strong> sent
                    </span>
                    {(stats?.failed || 0) > 0 && (
                      <span className="flex items-center gap-1 text-red-600">
                        <XCircle className="w-3 h-3" />
                        <strong>{stats!.failed}</strong> failed
                      </span>
                    )}
                    {stats?.last_sent_at && (
                      <span className="text-muted-foreground">
                        Last: {format(new Date(stats.last_sent_at), 'MMM d')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right controls */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <Switch
                    checked={setting.enabled}
                    onCheckedChange={(checked) =>
                      updateSetting({ stage: stageDef.id, enabled: checked, template_id: setting.template_id })
                    }
                    disabled={isSaving}
                  />

                  <div className="flex items-center gap-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      className={`h-7 text-xs gap-1 ${isEditing ? 'bg-blue-50 border-blue-300 text-blue-700' : ''}`}
                      onClick={() => setEditingStage(isEditing ? null : stageDef.id)}
                    >
                      <Pencil className="w-3 h-3" />
                      {templateName ? 'Edit Template' : 'Add Template'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs"
                      onClick={() => triggerLifecycle(stageDef.id)}
                      disabled={isTriggering || !isConfigured || !setting.enabled}
                    >
                      {isCurrentlyTriggering ? (
                        <RefreshCcw className="w-3 h-3 animate-spin" />
                      ) : (
                        <><Play className="w-3 h-3 mr-1" />Trigger</>
                      )}
                    </Button>
                  </div>

                  {/* Current template label */}
                  <span className="text-xs text-muted-foreground text-right max-w-[160px] truncate">
                    {templateName ?? <span className="italic">Using default template</span>}
                  </span>
                </div>
              </div>

              {/* Inline template editor */}
              {isEditing && (
                <TemplateEditor
                  stageDef={stageDef}
                  currentTemplateId={setting.template_id}
                  onSaved={(templateId) => {
                    updateSetting({ stage: stageDef.id, enabled: setting.enabled, template_id: templateId });
                    setEditingStage(null);
                  }}
                  onClose={() => setEditingStage(null)}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* How it works */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-1.5">
        <p className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5" />
          How the lifecycle pipeline works
        </p>
        <p className="text-xs text-muted-foreground">• <strong>Welcome</strong> fires automatically the moment a new user signs up. All other stages run when you click <em>Run All Stages</em> or use a scheduled cron job.</p>
        <p className="text-xs text-muted-foreground">• Each stage fires <strong>once per user</strong> — deduplication is enforced at the database level.</p>
        <p className="text-xs text-muted-foreground">• Click <strong>Edit / Add Template</strong> on any stage to customise the subject and body inline — no need to leave this page.</p>
        <p className="text-xs text-muted-foreground">• If no custom template is saved for a stage, a professional default is used automatically.</p>
        <p className="text-xs text-muted-foreground">• All sent emails appear in the <strong>History</strong> tab.</p>
      </div>
    </div>
  );
}
