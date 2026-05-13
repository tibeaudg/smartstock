import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Mail, TestTube, Send, CheckCircle2, XCircle } from 'lucide-react';
import { useSmtpSettings } from '@/hooks/useSmtpSettings';
import SEO from '@/components/SEO';

export default function AdminSmtpPage() {
  const { isConfigured, smtpUsername, isLoading, testSmtpConnection, sendTestEmail, isTesting, isSendingTestEmail } = useSmtpSettings();
  const [testEmailTo, setTestEmailTo] = useState('');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-gray-500">Checking SMTP configuration...</p>
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
          <h1 className="text-2xl font-semibold text-gray-900">SMTP Settings</h1>
          <p className="text-sm text-gray-600 mt-1">
            SMTP is configured via Supabase project secrets, not stored in the database.
          </p>
        </div>

        <Card className={isConfigured ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'}>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-2">
              {isConfigured ? (
                <><CheckCircle2 className="w-5 h-5 text-green-600" /><span className="font-medium text-green-800">SMTP is configured</span></>
              ) : (
                <><XCircle className="w-5 h-5 text-amber-600" /><span className="font-medium text-amber-800">SMTP is not configured</span></>
              )}
            </div>
            {isConfigured && smtpUsername && (
              <p className="text-sm text-green-700 mt-1">Sending from: {smtpUsername}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" />
              SMTP configuration
            </CardTitle>
            <CardDescription>
              Set these secrets in your Supabase project dashboard under Edge Functions &rarr; Secrets.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { name: 'SMTP_host', example: 'smtp.gmail.com' },
                { name: 'SMTP_port', example: '465' },
                { name: 'username', example: 'support@yourcompany.com' },
                { name: 'SMTP_password', example: 'your-app-password' },
                { name: 'From_name', example: 'StockFlow Support' },
              ].map(({ name, example }) => (
                <div key={name} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
                  <Badge variant="secondary" className="font-mono text-xs shrink-0">{name}</Badge>
                  <span className="text-xs text-gray-500">{example}</span>
                </div>
              ))}
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h4 className="font-medium text-amber-900 mb-1">Note</h4>
              <p className="text-sm text-amber-800">
                For Gmail, use an App Password instead of your regular password. The <code className="bg-amber-100 px-1 rounded">username</code> secret is also used as the From email address.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test connection</CardTitle>
            <CardDescription>Verify your SMTP configuration works correctly.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              onClick={() => testSmtpConnection()}
              disabled={isTesting || !isConfigured}
            >
              <TestTube className="w-4 h-4 mr-2" />
              {isTesting ? 'Testing...' : 'Test connection'}
            </Button>

            <div className="border-t pt-4 space-y-2">
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
                  onClick={() => sendTestEmail({ toEmail: testEmailTo.trim() })}
                  disabled={isSendingTestEmail || !testEmailTo.trim() || !isConfigured}
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
