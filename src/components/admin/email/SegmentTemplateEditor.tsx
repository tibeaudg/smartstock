import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RichTextEditor } from '@/components/RichTextEditor';
import { useEmailTemplates } from '@/hooks/useEmailTemplates';
import { Eye, Save, X } from 'lucide-react';
import { toast } from 'sonner';

export interface EmailTemplateFormData {
  name: string;
  type: 'welcome' | 'newsletter' | 'followup' | 'support' | 'custom';
  subject: string;
  html_body: string;
  text_body: string;
  is_active: boolean;
}

interface SegmentTemplateEditorProps {
  initialTemplate?: {
    id: string;
    name: string;
    type: string;
    subject: string;
    html_body: string;
    text_body: string | null;
    is_active: boolean;
  } | null;
  onSave: (templateId: string) => void;
  onCancel: () => void;
}

const availableVariables = [
  { key: 'user_name', description: 'User full name' },
  { key: 'user_email', description: 'User email address' },
  { key: 'organization_name', description: 'Organization name' },
  { key: 'first_name', description: 'User first name' },
  { key: 'last_name', description: 'User last name' },
];

export function SegmentTemplateEditor({ initialTemplate, onSave, onCancel }: SegmentTemplateEditorProps) {
  const { createTemplate, updateTemplate, isCreating, isUpdating } = useEmailTemplates();
  const [previewHtml, setPreviewHtml] = useState('');

  const [formData, setFormData] = useState<EmailTemplateFormData>({
    name: '',
    type: 'followup',
    subject: '',
    html_body: '',
    text_body: '',
    is_active: true,
  });

  useEffect(() => {
    if (initialTemplate) {
      setFormData({
        name: initialTemplate.name,
        type: initialTemplate.type as EmailTemplateFormData['type'],
        subject: initialTemplate.subject,
        html_body: initialTemplate.html_body,
        text_body: initialTemplate.text_body || '',
        is_active: initialTemplate.is_active,
      });
    }
  }, [initialTemplate]);

  const handleSaveClick = () => {
    if (!formData.name.trim() || !formData.subject.trim() || !formData.html_body.trim()) {
      toast.error('Please fill in all required fields (name, subject, HTML body)');
      return;
    }

    if (initialTemplate) {
      updateTemplate(
        {
          id: initialTemplate.id,
          template: {
            name: formData.name,
            type: formData.type,
            subject: formData.subject,
            html_body: formData.html_body,
            text_body: formData.text_body || undefined,
            is_active: formData.is_active,
          },
        },
        {
          onSuccess: () => onSave(initialTemplate.id),
        }
      );
    } else {
      createTemplate(
        {
          name: formData.name,
          type: formData.type,
          subject: formData.subject,
          html_body: formData.html_body,
          text_body: formData.text_body || undefined,
          is_active: formData.is_active,
        },
        {
          onSuccess: (data: { id: string }) => {
            if (data?.id) {
              onSave(data.id);
            }
          },
        }
      );
    }
  };

  const handlePreview = () => {
    const sampleData: Record<string, string> = {
      user_name: 'John Doe',
      user_email: 'john@example.com',
      organization_name: 'Example Company',
      first_name: 'John',
      last_name: 'Doe',
    };
    let preview = formData.html_body;
    Object.entries(sampleData).forEach(([key, value]) => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      preview = preview.replace(regex, value);
    });
    setPreviewHtml(preview);
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
      <h4 className="font-medium text-sm">{initialTemplate ? 'Edit Template' : 'Create New Template'}</h4>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="seg-template-name">Template Name *</Label>
          <Input
            id="seg-template-name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Inactivity Follow-up"
          />
        </div>
        <div>
          <Label htmlFor="seg-template-type">Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value: EmailTemplateFormData['type']) => setFormData({ ...formData, type: value })}
          >
            <SelectTrigger id="seg-template-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="welcome">Welcome</SelectItem>
              <SelectItem value="newsletter">Newsletter</SelectItem>
              <SelectItem value="followup">Follow-up</SelectItem>
              <SelectItem value="support">Support</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="seg-template-subject">Subject *</Label>
        <Input
          id="seg-template-subject"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          placeholder="We miss you!"
        />
        <p className="text-xs text-muted-foreground mt-1">Use {'{{user_name}}'}, {'{{user_email}}'}, etc.</p>
      </div>

      <div>
        <Label>Variables</Label>
        <div className="mt-1 p-2 bg-white rounded border text-xs flex flex-wrap gap-2">
          {availableVariables.map((v) => (
            <code key={v.key} className="px-1.5 py-0.5 bg-gray-100 rounded">{`{{${v.key}}}`}</code>
          ))}
        </div>
      </div>

      <Tabs defaultValue="html" className="w-full">
        <TabsList>
          <TabsTrigger value="html">HTML Body *</TabsTrigger>
          <TabsTrigger value="text">Text Body</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="html" className="space-y-2">
          <RichTextEditor
            content={formData.html_body}
            onChange={(html) => setFormData({ ...formData, html_body: html })}
          />
        </TabsContent>
        <TabsContent value="text" className="space-y-2">
          <Textarea
            value={formData.text_body}
            onChange={(e) => setFormData({ ...formData, text_body: e.target.value })}
            placeholder="Plain text version (optional)"
            rows={6}
          />
        </TabsContent>
        <TabsContent value="preview" className="space-y-2">
          <div className="border rounded-md p-4 bg-white">
            <Button size="sm" variant="outline" onClick={handlePreview} className="mb-2">
              <Eye className="w-4 h-4 mr-2" />
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

      <div className="flex items-center space-x-2">
        <Switch
          id="seg-template-active"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
        />
        <Label htmlFor="seg-template-active" className="text-sm">Active</Label>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" size="sm" onClick={onCancel}>
          <X className="w-4 h-4 mr-1" />
          Cancel
        </Button>
        <Button size="sm" onClick={handleSaveClick} disabled={isCreating || isUpdating}>
          <Save className="w-4 h-4 mr-1" />
          {initialTemplate ? (isUpdating ? 'Saving...' : 'Save Template') : (isCreating ? 'Creating...' : 'Create Template')}
        </Button>
      </div>
    </div>
  );
}
