import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Mail, Save, TestTube, Send } from 'lucide-react';
import { useSmtpSettings } from '@/hooks/useSmtpSettings';
import SEO from '@/components/SEO';

export default function AdminSmtpPage() {
  const {
    smtpSettings,
    isLoading,
    saveSmtpSettings,
    testSmtpConnection,
    sendTestEmail,
    isSaving,
    isTesting,
    isSendingTestEmail,
  } = useSmtpSettings();

  const [settings, setSettings] = useState({
    smtp_host: '',
    smtp_port: 587,
    smtp_username: '',
    smtp_password: '',
    from_email: '',
    from_name: '',
    use_tls: true,
  });
  const [testEmailTo, setTestEmailTo] = useState('');

  useEffect(() => {
    if (smtpSettings) {
      setSettings({
        smtp_host: smtpSettings.smtp_host,
        smtp_port: smtpSettings.smtp_port,
        smtp_username: smtpSettings.smtp_username,
        smtp_password: '', // Never load password
        from_email: smtpSettings.from_email,
        from_name: smtpSettings.from_name || '',
        use_tls: smtpSettings.use_tls,
      });
    }
  }, [smtpSettings]);

  const handleChange = (field: keyof typeof settings, value: string | number | boolean) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    saveSmtpSettings(settings);
  };

  const handleTestConnection = () => {
    testSmtpConnection();
  };

  const handleSendTestEmail = () => {
    if (!testEmailTo.trim()) return;
    sendTestEmail({ settings, toEmail: testEmailTo.trim() });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-gray-500">Loading SMTP settings...</p>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="SMTP Settings | Admin"
        description="Configure SMTP for outgoing support and notification emails."
        url="https://www.stockflowsystems.com/admin/smtp"
      />
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">E-mail / SMTP</h1>
          <p className="text-sm text-gray-600 mt-1">
            Configure outgoing email for support replies and notifications to users.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" />
              SMTP configuration
            </CardTitle>
            <CardDescription>
              Configure your SMTP server to send support replies and other emails to users.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="smtp-host">SMTP host *</Label>
                <Input
                  id="smtp-host"
                  placeholder="smtp.gmail.com"
                  value={settings.smtp_host}
                  onChange={(e) => handleChange('smtp_host', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="smtp-port">SMTP port *</Label>
                <Input
                  id="smtp-port"
                  type="number"
                  placeholder="587"
                  value={settings.smtp_port}
                  onChange={(e) => handleChange('smtp_port', parseInt(e.target.value) || 587)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="smtp-username">Username *</Label>
                <Input
                  id="smtp-username"
                  placeholder="your@email.com"
                  value={settings.smtp_username}
                  onChange={(e) => handleChange('smtp_username', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="smtp-password">Password</Label>
                <Input
                  id="smtp-password"
                  type="password"
                  placeholder="Leave blank to keep current password"
                  value={settings.smtp_password}
                  onChange={(e) => handleChange('smtp_password', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="from-email">From email *</Label>
                <Input
                  id="from-email"
                  type="email"
                  placeholder="support@yourcompany.com"
                  value={settings.from_email}
                  onChange={(e) => handleChange('from_email', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="from-name">From name</Label>
                <Input
                  id="from-name"
                  placeholder="StockFlow Support"
                  value={settings.from_name}
                  onChange={(e) => handleChange('from_name', e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="use-tls"
                checked={settings.use_tls}
                onCheckedChange={(checked) => handleChange('use_tls', checked)}
              />
              <Label htmlFor="use-tls">Use TLS/SSL encryption</Label>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h4 className="font-medium text-amber-900 mb-2">Security</h4>
              <p className="text-sm text-amber-800">
                Your password is stored encrypted. For Gmail, use an App Password instead of your regular password.
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Common SMTP settings</h4>
              <div className="text-sm text-gray-700 space-y-1">
                <p><strong>Gmail:</strong> smtp.gmail.com:587 (TLS) or 465 (SSL)</p>
                <p><strong>Outlook:</strong> smtp-mail.outlook.com:587</p>
                <p><strong>Yahoo:</strong> smtp.mail.yahoo.com:587</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <Button
                onClick={handleSave}
                disabled={isSaving || !settings.smtp_host || !settings.smtp_username || !settings.from_email}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save settings'}
              </Button>
              <Button
                variant="outline"
                onClick={handleTestConnection}
                disabled={isTesting || isSaving || !settings.smtp_host || !settings.smtp_username || !settings.from_email}
              >
                <TestTube className="w-4 h-4 mr-2" />
                {isTesting ? 'Testing...' : 'Test connection'}
              </Button>
            </div>

            <div className="border-t pt-6 space-y-2">
              <Label htmlFor="test-email-to">Send test email to</Label>
              <div className="flex gap-2 flex-wrap">
                <Input
                  id="test-email-to"
                  type="email"
                  placeholder="test@example.com"
                  value={testEmailTo}
                  onChange={(e) => setTestEmailTo(e.target.value)}
                  className="max-w-xs"
                />
                <Button
                  variant="outline"
                  onClick={handleSendTestEmail}
                  disabled={isSendingTestEmail || !testEmailTo.trim() || !settings.smtp_host || !settings.smtp_username || !settings.from_email}
                >
                  <Send className="w-4 h-4 mr-2" />
                  {isSendingTestEmail ? 'Sending...' : 'Send test email'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
