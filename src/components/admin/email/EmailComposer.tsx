import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RichTextEditor } from '@/components/RichTextEditor';
import { useEmailTemplates } from '@/hooks/useEmailTemplates';
import { Send, Mail, Calendar, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';

export function EmailComposer() {
  const { templates } = useEmailTemplates();
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [recipientType, setRecipientType] = useState<'single' | 'multiple'>('single');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientEmails, setRecipientEmails] = useState<string[]>([]);
  const [subject, setSubject] = useState('');
  const [htmlBody, setHtmlBody] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [isSending, setIsSending] = useState(false);

  const activeTemplates = templates.filter(t => t.is_active);

  const { data: allUsers } = useQuery({
    queryKey: ['all-users-for-composer'],
    queryFn: async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name')
        .not('email', 'is', null)
        .limit(100);
      return data || [];
    },
  });

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplateId(templateId);
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSubject(template.subject);
      setHtmlBody(template.html_body);
    }
  };

  const handleAddEmail = () => {
    const email = prompt('Enter email address:');
    if (email && email.trim() && !recipientEmails.includes(email.trim())) {
      setRecipientEmails([...recipientEmails, email.trim()]);
    }
  };

  const handleRemoveEmail = (email: string) => {
    setRecipientEmails(recipientEmails.filter(e => e !== email));
  };

  const handleSend = async () => {
    if (!subject.trim() || !htmlBody.trim()) {
      toast.error('Subject and body are required');
      return;
    }

    const emails = recipientType === 'single' 
      ? (recipientEmail.trim() ? [recipientEmail.trim()] : [])
      : recipientEmails;

    if (emails.length === 0) {
      toast.error('At least one recipient is required');
      return;
    }

    setIsSending(true);

    try {
      for (const email of emails) {
        const { data, error } = await supabase.functions.invoke('send-email', {
          body: {
            toEmail: email,
            subject,
            htmlBody,
            emailType: 'custom',
            templateId: selectedTemplateId || null,
            variables: {
              user_email: email,
              user_name: email.split('@')[0],
            },
          },
        });

        if (error || !data?.success) {
          console.error(`Failed to send to ${email}:`, error || data?.error);
          toast.error(`Failed to send to ${email}`);
        }
      }

      toast.success(`Email(s) sent successfully to ${emails.length} recipient(s)`);
      
      // Reset form
      setRecipientEmail('');
      setRecipientEmails([]);
      setSubject('');
      setHtmlBody('');
      setSelectedTemplateId('');
      setScheduledAt('');
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send email');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Compose Email</h2>
        <p className="text-sm text-muted-foreground">
          Send a quick email to one or more recipients
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Email</CardTitle>
          <CardDescription>Compose and send an email</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="composer-template">Template (Optional)</Label>
            <Select value={selectedTemplateId || 'none'} onValueChange={(value) => handleTemplateChange(value === 'none' ? '' : value)}>
              <SelectTrigger id="composer-template">
                <SelectValue placeholder="Select a template or compose new" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Compose New</SelectItem>
                {activeTemplates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              Selecting a template will populate the subject and body
            </p>
          </div>

          <div>
            <Label>Recipient Type</Label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  checked={recipientType === 'single'}
                  onChange={() => setRecipientType('single')}
                  className="rounded"
                />
                <span className="text-sm">Single Recipient</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  checked={recipientType === 'multiple'}
                  onChange={() => setRecipientType('multiple')}
                  className="rounded"
                />
                <span className="text-sm">Multiple Recipients</span>
              </label>
            </div>
          </div>

          {recipientType === 'single' ? (
            <div>
              <Label htmlFor="composer-email">Recipient Email *</Label>
              <Input
                id="composer-email"
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="user@example.com"
              />
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Recipient Emails *</Label>
                <Button type="button" variant="outline" size="sm" onClick={handleAddEmail}>
                  <Mail className="w-4 h-4 mr-2" />
                  Add Email
                </Button>
              </div>
              <div className="space-y-2">
                {recipientEmails.map((email, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">{email}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveEmail(email)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {recipientEmails.length === 0 && (
                  <p className="text-sm text-muted-foreground">No emails added. Click "Add Email" to add recipients.</p>
                )}
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="composer-subject">Subject *</Label>
            <Input
              id="composer-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject"
            />
          </div>

          <div>
            <Label>Body *</Label>
            <RichTextEditor content={htmlBody} onChange={setHtmlBody} />
          </div>

          <div>
            <Label htmlFor="composer-schedule">Schedule (Optional)</Label>
            <Input
              id="composer-schedule"
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Leave empty to send immediately
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button onClick={handleSend} disabled={isSending || !subject.trim() || !htmlBody.trim()}>
              <Send className="w-4 h-4 mr-2" />
              {isSending ? 'Sending...' : 'Send Email'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
