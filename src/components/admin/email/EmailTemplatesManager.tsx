import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RichTextEditor } from '@/components/RichTextEditor';
import { useEmailTemplates, useEmailTemplate } from '@/hooks/useEmailTemplates';
import { Plus, Edit, Trash2, Eye, Save, X } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

export function EmailTemplatesManager() {
  const { templates, createTemplate, updateTemplate, deleteTemplate, isCreating, isUpdating, isDeleting } = useEmailTemplates();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');

  const editingTemplate = editingId ? templates.find(t => t.id === editingId) : null;
  const { data: fullTemplate } = useEmailTemplate(editingId || undefined);

  const [formData, setFormData] = useState({
    name: '',
    type: 'custom' as 'welcome' | 'newsletter' | 'followup' | 'support' | 'custom',
    subject: '',
    html_body: '',
    text_body: '',
    is_active: true,
  });

  const handleOpenDialog = (templateId?: string) => {
    if (templateId) {
      const template = templates.find(t => t.id === templateId);
      if (template) {
        setFormData({
          name: template.name,
          type: template.type,
          subject: template.subject,
          html_body: template.html_body,
          text_body: template.text_body || '',
          is_active: template.is_active,
        });
        setEditingId(templateId);
      }
    } else {
      setFormData({
        name: '',
        type: 'custom',
        subject: '',
        html_body: '',
        text_body: '',
        is_active: true,
      });
      setEditingId(null);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingId(null);
    setPreviewHtml('');
  };

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.subject.trim() || !formData.html_body.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingId) {
      updateTemplate({
        id: editingId,
        template: {
          name: formData.name,
          type: formData.type,
          subject: formData.subject,
          html_body: formData.html_body,
          text_body: formData.text_body || undefined,
          is_active: formData.is_active,
        },
      });
    } else {
      createTemplate({
        name: formData.name,
        type: formData.type,
        subject: formData.subject,
        html_body: formData.html_body,
        text_body: formData.text_body || undefined,
        is_active: formData.is_active,
      });
    }

    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    deleteTemplate(id);
  };

  const handlePreview = () => {
    // Replace template variables with sample data
    const sampleData = {
      user_name: 'John Doe',
      user_email: 'john@example.com',
      organization_name: 'Example Company',
    };

    let preview = formData.html_body;
    Object.entries(sampleData).forEach(([key, value]) => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      preview = preview.replace(regex, value);
    });

    setPreviewHtml(preview);
  };

  const availableVariables = [
    { key: 'user_name', description: 'User full name' },
    { key: 'user_email', description: 'User email address' },
    { key: 'organization_name', description: 'Organization name' },
    { key: 'first_name', description: 'User first name' },
    { key: 'last_name', description: 'User last name' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Email Templates</h2>
          <p className="text-sm text-muted-foreground">
            Create and manage reusable email templates with variable support
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="w-4 h-4 mr-2" />
          New Template
        </Button>
      </div>

      {/* Templates List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription className="mt-1">
                    <span className="capitalize">{template.type}</span>
                    {!template.is_active && (
                      <span className="ml-2 text-red-600">(Inactive)</span>
                    )}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {template.subject}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenDialog(template.id)}
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Template</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{template.name}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(template.id)}
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

        {templates.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">No templates yet. Create your first template to get started.</p>
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Template' : 'Create New Template'}</DialogTitle>
            <DialogDescription>
              Create a reusable email template with variable placeholders
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="template-name">Template Name *</Label>
                <Input
                  id="template-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Welcome Email"
                />
              </div>
              <div>
                <Label htmlFor="template-type">Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: any) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger id="template-type">
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
              <Label htmlFor="template-subject">Subject *</Label>
              <Input
                id="template-subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Welcome to StockFlow!"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Use variables like {'{{user_name}}'} in the subject
              </p>
            </div>

            <div>
              <Label>Available Variables</Label>
              <div className="mt-2 p-3 bg-gray-50 rounded-md">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {availableVariables.map((variable) => (
                    <div key={variable.key} className="flex items-center gap-2">
                      <code className="text-xs bg-white px-2 py-1 rounded">{`{{${variable.key}}}`}</code>
                      <span className="text-muted-foreground">{variable.description}</span>
                    </div>
                  ))}
                </div>
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
                  placeholder="Plain text version of the email (optional)"
                  rows={10}
                />
                <p className="text-xs text-muted-foreground">
                  Plain text version for email clients that don't support HTML
                </p>
              </TabsContent>

              <TabsContent value="preview" className="space-y-2">
                <div className="border rounded-md p-4 bg-white">
                  <div className="mb-2">
                    <Button size="sm" variant="outline" onClick={handlePreview}>
                      <Eye className="w-4 h-4 mr-2" />
                      Generate Preview
                    </Button>
                  </div>
                  {previewHtml ? (
                    <div
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{ __html: previewHtml }}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Click "Generate Preview" to see how the email will look with sample data
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex items-center space-x-2">
              <Switch
                id="template-active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="template-active">Active (templates must be active to use in campaigns)</Label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={handleCloseDialog}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isCreating || isUpdating}>
                <Save className="w-4 h-4 mr-2" />
                {editingId ? (isUpdating ? 'Saving...' : 'Save Changes') : (isCreating ? 'Creating...' : 'Create Template')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
